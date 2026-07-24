const mongoose = require('mongoose');
require('dotenv').config();

async function inspectElectionDB() {
  try {
    const voterDbUri = (process.env.MONGODB_URI || '').includes('/oit_stack')
      ? process.env.MONGODB_URI.replace('/oit_stack', '/electionDB')
      : process.env.MONGODB_URI;

    console.log('Connecting to electionDB at:', voterDbUri);
    await mongoose.connect(voterDbUri);
    console.log('Connected to electionDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections in electionDB database:', collections.map(c => c.name));

    for (const collInfo of collections) {
      const count = await db.collection(collInfo.name).countDocuments();
      console.log(`Collection "${collInfo.name}" has ${count} documents.`);
      
      if (count > 0) {
        const sample = await db.collection(collInfo.name).findOne();
        console.log(`Sample from "${collInfo.name}":`, JSON.stringify(sample).substring(0, 300));
        
        // Check if there are constituency_number fields
        const sampleWithConstituency = await db.collection(collInfo.name).findOne({ constituency_number: { $exists: true } });
        if (sampleWithConstituency) {
          console.log(`Has constituency_number! Sample:`, JSON.stringify(sampleWithConstituency).substring(0, 300));
          const uniqueConst = await db.collection(collInfo.name).distinct('constituency_number');
          console.log(`Unique constituencies in "${collInfo.name}":`, uniqueConst);
        }
      }
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

inspectElectionDB();
