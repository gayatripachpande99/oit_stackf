const mongoose = require('mongoose');
require('dotenv').config();

async function inspectPune2019() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const mla2019Collections = collections
      .map(c => c.name)
      .filter(name => name.startsWith('oit_stack_mh_mla_2019_'))
      .sort();

    console.log('Found 2019 collections:', mla2019Collections);

    for (const collName of mla2019Collections) {
      const coll = db.collection(collName);
      const count = await coll.countDocuments({
        constituency_number: { $gte: 195, $lte: 215 }
      });
      console.log(`Collection "${collName}" has ${count} Pune documents.`);
      if (count > 0) {
        const sample = await coll.find({ constituency_number: { $gte: 195, $lte: 215 } }).toArray();
        console.log(`Sample from ${collName}:`, sample.map(s => ({
          constituency: s.constituency_number,
          candidate: s.candidate_name,
          party: s.party,
          total: s.total
        })));
      }
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

inspectPune2019();
