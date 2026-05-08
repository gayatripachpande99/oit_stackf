const Candidate = require('./Candidate');

const getConstituencyData = async (constituencyId) => {
  const id = parseInt(constituencyId);

  // Helper function to fetch and rank candidates for a specific year
  const getYearlyRecords = async (year) => {
    const records = await Candidate.find({ 
      constituency_number: id,
      year: year 
    }).sort({ total: -1 });

    // Add rank_no dynamically
    return records.map((record, index) => {
      const doc = record.toObject();
      return {
        ...doc,
        rank_no: index + 1
      };
    });
  };

  try {
    const [rows2009, rows2014, rows2019, rows2024] = await Promise.all([
      getYearlyRecords(2009),
      getYearlyRecords(2014),
      getYearlyRecords(2019),
      getYearlyRecords(2024)
    ]);

    return {
      records_2009: rows2009,
      records_2014: rows2014,
      records_2019: rows2019,
      records_2024: rows2024
    };
  } catch (error) {
    console.error('Error fetching MongoDB data:', error);
    throw error;
  }
};

module.exports = {
  getConstituencyData
};
