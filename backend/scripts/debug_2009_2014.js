const mongoose = require('mongoose');
require('dotenv').config();

async function debugData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB:', mongoose.connection.host);

    const db = mongoose.connection.db;
    const allCollections = await db.listCollections().toArray();
    const names = allCollections.map(c => c.name);

    // Show all collection names
    console.log('\n=== ALL COLLECTIONS ===');
    names.forEach(n => console.log(' -', n));

    // Filter 2009 and 2014 collections
    const cols2009 = names.filter(n => n.includes('2009'));
    const cols2014 = names.filter(n => n.includes('2014'));
    console.log('\n2009 collections:', cols2009);
    console.log('2014 collections:', cols2014);

    // Sample a record from each to inspect fields
    for (const col of [...cols2009.slice(0,2), ...cols2014.slice(0,2)]) {
      const coll = db.collection(col);
      const count = await coll.countDocuments();
      const sample = await coll.findOne({});
      console.log(`\n=== ${col} (${count} docs) ===`);
      if (sample) {
        console.log('Fields:', Object.keys(sample));
        console.log('Sample:', JSON.stringify(sample, null, 2));
      }
    }

    // Now look for constituency 208 in 2009/2014
    console.log('\n=== CONSTITUENCY 208 in 2009 collections ===');
    for (const col of cols2009) {
      const coll = db.collection(col);
      const recs = await coll.find({ constituency_number: 208 }).toArray();
      if (recs.length > 0) {
        console.log(`Found ${recs.length} in ${col}:`);
        recs.forEach(r => {
          console.log(`  ${r.candidate_name} | party: ${r.party} | total: ${r.total} | votes_percentage: ${r.votes_percentage} | general: ${r.general} | postal: ${r.postal}`);
        });
      }
    }

    console.log('\n=== CONSTITUENCY 208 in 2014 collections ===');
    for (const col of cols2014) {
      const coll = db.collection(col);
      const recs = await coll.find({ constituency_number: 208 }).toArray();
      if (recs.length > 0) {
        console.log(`Found ${recs.length} in ${col}:`);
        recs.forEach(r => {
          console.log(`  ${r.candidate_name} | party: ${r.party} | total: ${r.total} | votes_percentage: ${r.votes_percentage} | general: ${r.general} | postal: ${r.postal}`);
        });
      }
    }

    await mongoose.disconnect();
    console.log('\nDone.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

debugData();
