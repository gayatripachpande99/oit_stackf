const mongoose = require('mongoose');

const getConstituencyData = async (constituencyId) => {
  const id = parseInt(constituencyId);
  const db = mongoose.connection.db;

  // Helper function to fetch from multiple collections and merge
  const fetchFromCollections = async (year, count, percentageField = 'votes_percentage') => {
    let allRecords = [];
    for (let i = 1; i <= count; i++) {
      const collectionName = `oit_stack_mh_mla_${year}_00${i}`;
      const records = await db.collection(collectionName)
        .find({ constituency_number: id, candidate_name: { $ne: null } })
        .toArray();
      
      // Normalize field names if necessary (e.g., mapping votes_polled_valid_nota to votes_percentage)
      const normalized = records.map(r => ({
        ...r,
        votes_percentage: r[percentageField] || r.votes_percentage
      }));
      
      allRecords = allRecords.concat(normalized);
    }

    // Sort by total descending and add rank
    return allRecords
      .sort((a, b) => b.total - a.total)
      .map((record, index) => ({
        ...record,
        rank_no: index + 1
      }));
  };

  try {
    const [rows2009, rows2014, rows2019, rows2024] = await Promise.all([
      fetchFromCollections(2009, 5),
      fetchFromCollections(2014, 6),
      fetchFromCollections(2019, 4),
      fetchFromCollections(2024, 3, 'votes_polled_valid_nota')
    ]);

    return {
      records_2009: rows2009,
      records_2014: rows2014,
      records_2019: rows2019,
      records_2024: rows2024
    };
  } catch (error) {
    console.error('Error fetching MongoDB data from multiple collections:', error);
    throw error;
  }
};

module.exports = {
  getConstituencyData
};
