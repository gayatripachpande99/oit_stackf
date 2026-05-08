require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const constituencyRoutes = require('./routes/constituencyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from parent directory
app.use(express.static(path.join(__dirname, '../')));

// API Routes
app.use('/api', constituencyRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running (MongoDB Migrated)');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});