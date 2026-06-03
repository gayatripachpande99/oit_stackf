const mongoose = require('mongoose');
require('dotenv').config();
const { getConstituencyData } = require('../models/constituencyModel');

async function checkAllPune() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let allOk = true;
    for (let id = 195; id <= 215; id++) {
      const data = await getConstituencyData(id);
      const count = data.records_2024 ? data.records_2024.length : 0;
      console.log(`Constituency ${id}: found ${count} 2024 records`);
      if (count === 0) {
        allOk = false;
      }
    }

    if (allOk) {
      console.log('SUCCESS: All constituencies from 195 to 215 have 2024 records in MongoDB!');
    } else {
      console.log('WARNING: Some constituencies are missing 2024 records.');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAllPune();
