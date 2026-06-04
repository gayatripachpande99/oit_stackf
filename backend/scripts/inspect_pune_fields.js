const { getConstituencyData } = require('../models/constituencyModel');
const mongoose = require('mongoose');
require('dotenv').config();

async function inspectFields() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let errorsFound = 0;
    for (let id = 195; id <= 215; id++) {
      const data = await getConstituencyData(id);
      const records = data.records_2019;
      for (const r of records) {
        if (r.general === undefined || r.general === null ||
            r.postal === undefined || r.postal === null ||
            r.total === undefined || r.total === null) {
          console.log(`Constituency ${id} candidate ${r.candidate_name} has missing/null vote fields: general=${r.general}, postal=${r.postal}, total=${r.total}`);
          errorsFound++;
        }
      }
    }
    console.log(`Done inspection. Total candidates with null/missing vote fields: ${errorsFound}`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error during inspection:', error);
  }
}

inspectFields();
