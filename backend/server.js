require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const constituencyRoutes = require('./routes/constituencyRoutes');
const voterRoutes = require('./routes/voterRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve CorporateTraining static frontend under /training
app.use('/training', express.static(path.join(__dirname, '../CorporateTraining/frontend')));

// API Routes
app.use('/api', constituencyRoutes);
app.use('/api', voterRoutes);

// CorporateTraining frontend catch-all
app.get('/training/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../CorporateTraining/frontend/index.html'));
});

// Catch-all route to serve the frontend index.html for any other request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
