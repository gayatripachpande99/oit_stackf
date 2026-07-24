const mongoose = require('mongoose');
require('dotenv').config();
const { getConstituencyData } = require('../models/constituencyModel');

async function inspect196() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const data = await getConstituencyData(196);
    console.log('\n--- 2024 Records ---');
    if (data.records_2024) {
      data.records_2024.forEach((r, idx) => {
        console.log(`${idx + 1}. Name: "${r.candidate_name}", Party: "${r.party}", Total: ${r.total}, Year: ${r.year}`);
      });
    }

    console.log('\n--- 2019 Records ---');
    if (data.records_2019) {
      data.records_2019.forEach((r, idx) => {
        console.log(`${idx + 1}. Name: "${r.candidate_name}", Party: "${r.party}", Total: ${r.total}, Year: ${r.year}`);
      });
    }

    console.log('\n--- 2014 Records ---');
    if (data.records_2014) {
      data.records_2014.forEach((r, idx) => {
        console.log(`${idx + 1}. Name: "${r.candidate_name}", Party: "${r.party}", Total: ${r.total}, Year: ${r.year}`);
      });
    }

    console.log('\n--- 2009 Records ---');
    if (data.records_2009) {
      data.records_2009.forEach((r, idx) => {
        console.log(`${idx + 1}. Name: "${r.candidate_name}", Party: "${r.party}", Total: ${r.total}, Year: ${r.year}`);
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

inspect196();
