require('dotenv').config();
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    const count = await Candidate.countDocuments({ constituency_number: 1, year: 2024 });
    console.log('Candidates for constituency 1 in 2024:', count);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testConnection();
