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
    if (obj[key] instanceof Date) {
      sortedObj[key] = obj[key].toISOString();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sortedObj[key] = JSON.stringify(obj[key]);
    } else {
      sortedObj[key] = obj[key];
    }
  }
  return JSON.stringify(sortedObj);
}

async function removeDuplicates() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log(`Analyzing and cleaning up ${collections.length} collections...`);
    
    let totalDeleted = 0;
    
    for (const collInfo of collections) {
      const collName = collInfo.name;
      if (collName.startsWith('system.')) continue;
      
      const coll = db.collection(collName);
      const docs = await coll.find({}).toArray();
      
      const seen = new Map();
      
      for (const doc of docs) {
        const key = getNormalizedKey(doc);
        if (!seen.has(key)) {
          seen.set(key, [doc]);
        } else {
          seen.get(key).push(doc);
        }
      }
      
      const idsToDelete = [];
      for (const [key, groupDocs] of seen.entries()) {
        if (groupDocs.length > 1) {
          // Sort documents by _id representation (ascending) so the oldest/first one is kept at index 0.
          // Note: MongoDB ObjectID hex string sorting naturally aligns with creation time.
          groupDocs.sort((a, b) => {
            const idA = a._id.toString();
            const idB = b._id.toString();
            return idA.localeCompare(idB);
          });
          
          // Keep groupDocs[0], delete the rest
          for (let i = 1; i < groupDocs.length; i++) {
            idsToDelete.push(groupDocs[i]._id);
          }
        }
      }
      
      if (idsToDelete.length > 0) {
        console.log(`Collection "${collName}": Deleting ${idsToDelete.length} duplicate records...`);
        const result = await coll.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`  Deleted ${result.deletedCount} documents successfully.`);
        totalDeleted += result.deletedCount;
      }
    }

    console.log(`Database cleanup completed. Total duplicate records deleted: ${totalDeleted}`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

removeDuplicates();
