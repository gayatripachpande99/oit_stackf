const mongoose = require('mongoose');
require('dotenv').config();

async function inspectRecords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const recordsColl = db.collection('records');
    
    const count = await recordsColl.countDocuments();
    console.log(`Total documents in 'records': ${count}`);

    if (count > 0) {
      const sample = await recordsColl.findOne();
      console.log('Sample record:', JSON.stringify(sample, null, 2));

      // Get unique years
      const years = await recordsColl.distinct('year');
      console.log('Unique years in records:', years);

      // Get unique constituency numbers
      const constituencies = await recordsColl.distinct('constituency_number');
      console.log('Unique constituencies in records:', constituencies);

      // Count by year
      for (const y of years) {
        const c = await recordsColl.countDocuments({ year: y });
        console.log(`Year ${y}: ${c} documents`);
      }
      
      // Let's print all 2024 records if any
      const records2024 = await recordsColl.find({ year: 2024 }).toArray();
      console.log(`Found ${records2024.length} records for year 2024`);
      if (records2024.length > 0) {
        console.log('2024 records sample:');
        console.log(JSON.stringify(records2024.slice(0, 5), null, 2));
      }
      
      // Let's query all records in `records` to see their constituency numbers and details
      const allRecords = await recordsColl.find({}).toArray();
      console.log('All records overview (first 10):');
      allRecords.slice(0, 10).forEach(r => {
        console.log(`ID: ${r._id}, Year: ${r.year}, Constituency: ${r.constituency_number}, Name: ${r.candidate_name}, Party: ${r.party}, Total: ${r.total}`);
      });
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

inspectRecords();
