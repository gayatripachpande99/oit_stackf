const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose.connection;
  }

  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/oit_stack';
    
    // If mongoUri points to root without database name, ensure /oit_stack database path
    if (mongoUri.includes('mongodb.net/') && !mongoUri.includes('mongodb.net/oit_stack') && mongoUri.includes('mongodb.net/?')) {
      mongoUri = mongoUri.replace('mongodb.net/?', 'mongodb.net/oit_stack?');
    }

    const conn = await mongoose.connect(mongoUri, {
      dbName: 'oit_stack',
    });

    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host} | DB: oit_stack`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not exit process in serverless
  }
};

module.exports = connectDB;
