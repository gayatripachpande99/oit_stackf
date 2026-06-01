require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const config = require('./config/env');
const errorHandler = require('./middleware/errorMiddleware');
const { generalLimiter } = require('./middleware/rateLimiter');

// Original Roots
const constituencyRoutes = require('./routes/constituencyRoutes');
const voterRoutes = require('./routes/voterRoutes');

// Corporate Training Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const questionRoutes = require('./routes/questionRoutes');
const testRoutes = require('./routes/testRoutes');
const resultRoutes = require('./routes/resultRoutes');
const codingRoutes = require('./routes/codingRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || config.port || 3000;

// Connect to MongoDB
connectDB();

// Trust proxy for rate limiting behind Render/Vercel
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: function(origin, callback) {
    const allowed = [
      config.clientUrl,
      'https://www.oitstack.com',
      'https://oitstack.com',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173'
    ];
    // Allow requests with no origin (file://, Postman, mobile apps)
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(mongoSanitize()); // Prevent NoSQL injection
// app.use(generalLimiter);  // Rate limiting - commented out in case it blocks normal traffic too aggressively, uncomment if needed

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Original API Routes
app.use('/api', constituencyRoutes);
app.use('/api', voterRoutes);

// The hardcoded voter route from original server.js
app.get("/api/voters", async(req, res)=>{
    try{
        const boothNumber = req.query.boothNumber;
        let filter = {};
        if(boothNumber){
            filter.boothNumber = Number(boothNumber);
        }
        // Requires Voter model which isn't imported here, but kept for compatibility
        // const voters = await Voter.find(filter); 
        // res.json(voters);
    }
    catch(error){
        res.status(500).json({ message : error.message });
    }
});

// Corporate Training API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static frontend files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Catch-all route to serve the frontend index.html for any other request (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;