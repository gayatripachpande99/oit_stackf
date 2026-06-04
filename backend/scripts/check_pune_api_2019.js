const { getConstituencyData } = require('../models/constituencyModel');
const mongoose = require('mongoose');
require('dotenv').config();

async function checkPuneAPI2019() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (let id = 195; id <= 215; id++) {
      const data = await getConstituencyData(id);
      console.log(`Constituency ${id}: 2009: ${data.records_2009.length}, 2014: ${data.records_2014.length}, 2019: ${data.records_2019.length}, 2024: ${data.records_2024.length}`);
      if (data.records_2019.length > 0) {
        console.log(`  Sample 2019:`, data.records_2019.slice(0, 2).map(r => ({
          name: r.candidate_name,
          party: r.party,
          total: r.total,
          rank: r.rank_no
        })));
      }
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkPuneAPI2019();
