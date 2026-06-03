const mongoose = require('mongoose');
require('dotenv').config();
const { getConstituencyData } = require('../models/constituencyModel');

async function testQuery() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const data = await getConstituencyData(208);
    console.log('Results for constituency 208:');
    console.log('2009 records count:', data.records_2009 ? data.records_2009.length : 'none');
    console.log('2014 records count:', data.records_2014 ? data.records_2014.length : 'none');
    console.log('2019 records count:', data.records_2019 ? data.records_2019.length : 'none');
    console.log('2024 records count:', data.records_2024 ? data.records_2024.length : 'none');
    
    if (data.records_2024 && data.records_2024.length > 0) {
      console.log('2024 records sample:');
      data.records_2024.slice(0, 5).forEach(r => {
        console.log(`- ${r.candidate_name} (${r.party}): ${r.total} votes, rank: ${r.rank_no}, %: ${r.votes_percentage}`);
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

testQuery();
