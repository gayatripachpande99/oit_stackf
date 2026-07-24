const mongoose = require('mongoose');
require('dotenv').config();

async function searchCandidates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('Searching for candidates matching "WALSE PATIL" or "NIKAM" or similar in all collections...');
    
    for (const collInfo of collections) {
      const collName = collInfo.name;
      if (collName.startsWith('system.')) continue;
      
      const coll = db.collection(collName);
      const query = {
        $or: [
          { candidate_name: /WALSE PATIL/i },
          { candidate_name: /NIKAM/i }
        ]
      };
      const docs = await coll.find(query).toArray();
      if (docs.length > 0) {
        console.log(`\nCollection: "${collName}" (${docs.length} matches):`);
        for (const doc of docs) {
          console.log(`  ID: ${doc._id}, Const: ${doc.constituency_number}, Name: ${doc.candidate_name}, Sex: ${doc.sex}, Age: ${doc.age}, Party: ${doc.party}, Total Votes: ${doc.total}, Year: ${doc.year}`);
        }
      }
    }
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error during search:', error);
  }
}

searchCandidates();
