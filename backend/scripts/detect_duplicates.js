const mongoose = require('mongoose');
require('dotenv').config();

function getNormalizedKey(doc) {
  const obj = { ...doc };
  delete obj._id;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  
  // Sort keys to get a consistent string representation
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj = {};
  for (const key of sortedKeys) {
    // If the value is a date, convert it to ISO string
    if (obj[key] instanceof Date) {
      sortedObj[key] = obj[key].toISOString();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Stringify sub-objects
      sortedObj[key] = JSON.stringify(obj[key]);
    } else {
      sortedObj[key] = obj[key];
    }
  }
  return JSON.stringify(sortedObj);
}

async function detectDuplicates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`Analyzing ${collections.length} collections...`);
    
    for (const collInfo of collections) {
      const collName = collInfo.name;
      // Skip system collections if any
      if (collName.startsWith('system.')) continue;
      
      const coll = db.collection(collName);
      const docs = await coll.find({}).toArray();
      
      const seen = new Map();
      const duplicateGroups = [];
      
      for (const doc of docs) {
        const key = getNormalizedKey(doc);
        if (!seen.has(key)) {
          seen.set(key, [doc._id]);
        } else {
          seen.get(key).push(doc._id);
        }
      }
      
      let dupCount = 0;
      for (const [key, ids] of seen.entries()) {
        if (ids.length > 1) {
          dupCount += (ids.length - 1);
          duplicateGroups.push({
            key,
            ids
          });
        }
      }
      
      if (dupCount > 0) {
        console.log(`Collection "${collName}": Found ${dupCount} duplicate records (Total docs: ${docs.length}, Unique: ${seen.size})`);
        // Print one duplicate sample
        const sampleGroup = duplicateGroups[0];
        console.log(`  Sample duplicate IDs: ${sampleGroup.ids.join(', ')}`);
        console.log(`  Sample data: ${sampleGroup.key.substring(0, 300)}`);
      }
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error during detection:', error);
  }
}

detectDuplicates();
