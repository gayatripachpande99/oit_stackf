require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files from parent directory
app.use(express.static(path.join(__dirname, '../')));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// GET /api/constituency/:id
app.get('/api/constituency/:id', async (req, res) => {
  const constituencyId = req.params.id;

  try {
    const query2009 = `
      SELECT constituency_number, candidate_name, sex, age, category, party, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2009_001 WHERE constituency_number = ? AND candidate_name IS NOT NULL
      UNION
      SELECT constituency_number, candidate_name, sex, age, category, party, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2009_002 WHERE constituency_number = ? AND candidate_name IS NOT NULL
      UNION
      SELECT constituency_number, candidate_name, sex, age, category, party, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2009_003 WHERE constituency_number = ? AND candidate_name IS NOT NULL
      UNION
      SELECT constituency_number, candidate_name, sex, age, category, party, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2009_004 WHERE constituency_number = ? AND candidate_name IS NOT NULL
      UNION
      SELECT constituency_number, candidate_name, sex, age, category, party, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2009_005 WHERE constituency_number = ? AND candidate_name IS NOT NULL
    `;

    const query2014 = `
      SELECT constituency_number, candidate_name, sex, age, category, party, symbol, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2014_001 WHERE constituency_number = ? AND candidate_name IS NOT NULL
      UNION
      SELECT constituency_number, candidate_name, sex, age, category, party, symbol, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2014_002 WHERE constituency_number = ? AND candidate_name IS NOT NULL
      UNION
      SELECT constituency_number, candidate_name, sex, age, category, party, symbol, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2014_003 WHERE constituency_number = ? AND candidate_name IS NOT NULL
      UNION
      SELECT constituency_number, candidate_name, sex, age, category, party, symbol, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2014_004 WHERE constituency_number = ? AND candidate_name IS NOT NULL
      UNION
      SELECT constituency_number, candidate_name, sex, age, category, party, symbol, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2014_005 WHERE constituency_number = ? AND candidate_name IS NOT NULL
      UNION
      SELECT constituency_number, candidate_name, sex, age, category, party, symbol, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2014_006 WHERE constituency_number = ? AND candidate_name IS NOT NULL
    `;

    const query2019 = `
      SELECT constituency_number, candidate_name, sex, age, category, party, symbol, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2019_001 WHERE constituency_number = ? AND candidate_name IS NOT NULL
      UNION
      SELECT constituency_number, candidate_name, sex, age, category, party, symbol, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2019_002 WHERE constituency_number = ? AND candidate_name IS NOT NULL
      UNION
      SELECT constituency_number, candidate_name, sex, age, category, party, symbol, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2019_003 WHERE constituency_number = ? AND candidate_name IS NOT NULL
      UNION
      SELECT constituency_number, candidate_name, sex, age, category, party, symbol, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2019_004 WHERE constituency_number = ? AND candidate_name IS NOT NULL
    `;

    const [rows2009] = await pool.query(query2009, [
      constituencyId, constituencyId, constituencyId, constituencyId, constituencyId
    ]);

    const [rows2014] = await pool.query(query2014, [
      constituencyId, constituencyId, constituencyId, constituencyId, constituencyId, constituencyId
    ]);

    const [rows2019] = await pool.query(query2019, [
      constituencyId, constituencyId, constituencyId, constituencyId
    ]);

    res.json({
      constituency_number: parseInt(constituencyId),
      records_2009: rows2009,
      records_2014: rows2014,
      records_2019: rows2019
    });

  } catch (error) {
    console.error('DB ERROR:', error);

    res.status(500).json({
      message: error.message,
      sqlMessage: error.sqlMessage
    });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('DB config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
  });

  try {
    const conn = await pool.getConnection();
    console.log('Database connected successfully');
    conn.release();
  } catch (err) {
    console.error('Database connection failed:', {
      message: err.message,
      code: err.code,
      sqlMessage: err.sqlMessage
    });
  }
});