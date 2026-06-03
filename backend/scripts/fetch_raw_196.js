const mongoose = require('mongoose');
require('dotenv').config();
const { getCandidateModel } = require('../models/Candidate');

async function fetchRaw196() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const mh2024Colls = collections.filter(c => c.name.startsWith('oit_stack_mh_mla_2024_'));
    
    console.log('\n--- Raw 2024 Records in DB for Constituency 196 ---');
    for (const collInfo of mh2024Colls) {
      const coll = db.collection(collInfo.name);
      const docs = await coll.find({ constituency_number: 196 }).toArray();
      if (docs.length > 0) {
        console.log(`Collection: ${collInfo.name}`);
        docs.forEach(doc => {
          console.log(`  - Name: "${doc.candidate_name}", Party: "${doc.party}", Total: ${doc.total}, Year: ${doc.year}, Age: ${doc.age}, Sex: ${doc.sex}`);
        });
      }
    }
    
    console.log('\n--- Raw Records collection in DB for Constituency 196 ---');
    const recordsColl = db.collection('records');
    const recordsDocs = await recordsColl.find({ constituency_number: 196 }).toArray();
    recordsDocs.forEach(doc => {
      console.log(`  - Name: "${doc.candidate_name}", Party: "${doc.party}", Total: ${doc.total}, Year: ${doc.year}, Age: ${doc.age}, Sex: ${doc.sex}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

fetchRaw196();
