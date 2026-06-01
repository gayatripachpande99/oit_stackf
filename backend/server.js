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

// Serve OIT_Stack main frontend
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

// Main frontend catch-all
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/api/voters", async(req, res)=>{

    try{

        const boothNumber = req.query.boothNumber;

        let filter = {};

        if(boothNumber){

            filter.boothNumber = Number(boothNumber);

        }

        const voters = await Voter.find(filter);

        res.json(voters);

    }
    catch(error){

        res.status(500).json({
            message : error.message
        });

    }

});