const mongoose = require('mongoose');
require('dotenv').config();
const { getCandidateModel } = require('../models/Candidate');

async function compareRecords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const recordsColl = db.collection('records');
    const records = await recordsColl.find({}).toArray();
    
    console.log(`Checking ${records.length} records...`);
    
    let matchedCount = 0;
    
    for (const r of records) {
      // Search in all 2009 collections
      let foundIn2009 = false;
      for (let i = 1; i <= 10; i++) {
        const collName = `oit_stack_mh_mla_2009_00${i}`;
        const Model = getCandidateModel(collName);
        const match = await Model.findOne({
          constituency_number: r.constituency_number,
          candidate_name: r.candidate_name,
          party: r.party
        });
        if (match) {
          foundIn2009 = true;
          console.log(`Match found for "${r.candidate_name}" (${r.party}, Const: ${r.constituency_number}) in ${collName}`);
          break;
        }
      }
      if (foundIn2009) {
        matchedCount++;
      } else {
        console.log(`No 2009 match found for: "${r.candidate_name}" (${r.party}, Const: ${r.constituency_number})`);
      }
    }
    
    console.log(`\nComparison complete: ${matchedCount} out of ${records.length} records found in 2009 collections.`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

compareRecords();
