const mongoose = require('mongoose');
require('dotenv').config();

async function inspectPune2024() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const mh2024Colls = collections.filter(c => c.name.startsWith('oit_stack_mh_mla_2024_'));
    
    console.log(`Checking ${mh2024Colls.length} collections for 2024...`);
    
    for (const collInfo of mh2024Colls) {
      const coll = db.collection(collInfo.name);
      // count records where constituency_number is between 195 and 215
      const count = await coll.countDocuments({
        constituency_number: { $gte: 195, $lte: 215 }
      });
      if (count > 0) {
        console.log(`Collection ${collInfo.name} has ${count} records for constituencies 195 to 215.`);
        const sample = await coll.find({ constituency_number: { $gte: 195, $lte: 215 } }).toArray();
        console.log(`First 3 records in ${collInfo.name}:`);
        console.log(JSON.stringify(sample.slice(0, 3), null, 2));
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

inspectPune2024();
