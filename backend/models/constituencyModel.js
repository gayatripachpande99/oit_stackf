const mongoose = require('mongoose');
const { getCandidateModel } = require('./Candidate');

const CACHE_TTL_MS = process.env.NODE_ENV === 'production' ? 10 * 60 * 1000 : 1000; // 1 second TTL in development
const constituencyCache = new Map();

const getCachedConstituency = (id) => {
  const cached = constituencyCache.get(id);
  if (!cached) return null;

  if (Date.now() > cached.expiresAt) {
    constituencyCache.delete(id);
    return null;
  }

  return cached.value;
};

const setCachedConstituency = (id, value) => {
  constituencyCache.set(id, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS
  });
};

const getConstituencyData = async (constituencyId) => {
  const id = parseInt(constituencyId);
  
  if (isNaN(id)) {
    throw new Error('Invalid constituency ID');
  }

  const cached = getCachedConstituency(id);
  if (cached) {
    return cached;
  }

  // Helper function to fetch from multiple collections and merge
  const fetchFromCollections = async (year, count, percentageField = 'votes_percentage') => {
    let allRecords = [];
    
    try {
      const promises = [];
      for (let i = 1; i <= count; i++) {
        const collectionName = `oit_stack_mh_mla_${year}_00${i}`;
        const Model = getCandidateModel(collectionName);
        promises.push(Model.find({ 
          constituency_number: id, 
          candidate_name: { $ne: null } 
        })
          .select('constituency_number candidate_name sex age category party symbol general postal total votes_percentage votes_polled_valid_nota year')
          .sort({ total: -1 })
          .lean());
      }

      const results = await Promise.all(promises);
      
      results.forEach(records => {
        const normalized = records.map(r => ({
          ...r,
          votes_percentage: r[percentageField] || r.votes_percentage || 0
        }));
        allRecords = allRecords.concat(normalized);
      });

      // De-duplicate records by candidate name and party
      const uniqueMap = new Map();
      
      for (const record of allRecords) {
        const key = `${record.candidate_name}-${record.party}`.toLowerCase().trim();
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, record);
        } else {
          // If duplicate exists, keep the one with higher total votes
          const existing = uniqueMap.get(key);
          if ((record.total || 0) > (existing.total || 0)) {
            uniqueMap.set(key, record);
          }
        }
      }

      allRecords = Array.from(uniqueMap.values());

      // Sort by total descending and add rank
      return allRecords
        .sort((a, b) => (b.total || 0) - (a.total || 0))
        .map((record, index) => ({
          ...record,
          rank_no: index + 1
        }));
    } catch (err) {
      console.error(`Error fetching data for year ${year}:`, err);
      return []; // Return empty array on failure for a specific year
    }
  };

  const fetchFromRecordsCollection = async (constituencyId) => {
    try {
      if (!mongoose.connection || !mongoose.connection.db) {
        return [];
      }
      const recordsColl = mongoose.connection.db.collection('records');
      const records = await recordsColl.find({ constituency_number: constituencyId }).toArray();
      return records.map(r => ({
        ...r,
        year: r.year || 2009, // Default to 2009 since the existing records in this collection match 2009 winners
        votes_percentage: r.votes_percentage || 0
      }));
    } catch (err) {
      console.error('Error fetching from records collection:', err);
      return [];
    }
  };

  const mergeAndProcess = (baseRecords, extraRecords, targetYear) => {
    const yearExtras = extraRecords.filter(r => r.year === targetYear);
    const merged = [...baseRecords, ...yearExtras];
    
    const uniqueMap = new Map();
    for (const record of merged) {
      if (!record.candidate_name || record.candidate_name === "NULL") continue;
      const key = `${record.candidate_name}-${record.party}`.toLowerCase().trim();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, record);
      } else {
        const existing = uniqueMap.get(key);
        if ((record.total || 0) > (existing.total || 0)) {
          uniqueMap.set(key, record);
        }
      }
    }
    
    return Array.from(uniqueMap.values())
      .sort((a, b) => (b.total || 0) - (a.total || 0))
      .map((record, index) => ({
        ...record,
        rank_no: index + 1
      }));
  };

  try {
    console.log(`Fetching data for constituency: ${id}`);

    const [rows2009, rows2014, rows2019, rows2024, extraRecords] = await Promise.all([
      fetchFromCollections(2009, 10),
      fetchFromCollections(2014, 15),
      fetchFromCollections(2019, 10),
      fetchFromCollections(2024, 15, 'votes_polled_valid_nota'),
      fetchFromRecordsCollection(id)
    ]);

    const data = {
      records_2009: mergeAndProcess(rows2009, extraRecords, 2009),
      records_2014: mergeAndProcess(rows2014, extraRecords, 2014),
      records_2019: mergeAndProcess(rows2019, extraRecords, 2019),
      records_2024: mergeAndProcess(rows2024, extraRecords, 2024)
    };

    setCachedConstituency(id, data);
    return data;
  } catch (error) {
    console.error('Critical error in constituencyModel:', error);
    throw error;
  }
};

module.exports = {
  getConstituencyData
};
