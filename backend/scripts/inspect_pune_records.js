const mongoose = require('mongoose');
require('dotenv').config();

async function inspectPuneRecords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const recordsColl = db.collection('records');
    
    const records = await recordsColl.find({
      constituency_number: { $gte: 195, $lte: 215 }
    }).toArray();

    console.log(`Found ${records.length} Pune records in the 'records' collection:`);
    records.forEach(r => {
      console.log(JSON.stringify(r, null, 2));
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

inspectPuneRecords();
