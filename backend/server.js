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
    const query = `
      SELECT constituency_number, candidate_name, sex, age, category, party, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2009_001 WHERE constituency_number = ? AND candidate_name IS NOT NULL

      UNION ALL

      SELECT constituency_number, candidate_name, sex, age, category, party, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2009_002 WHERE constituency_number = ? AND candidate_name IS NOT NULL

      UNION ALL

      SELECT constituency_number, candidate_name, sex, age, category, party, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2009_003 WHERE constituency_number = ? AND candidate_name IS NOT NULL

      UNION ALL

      SELECT constituency_number, candidate_name, sex, age, category, party, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2009_004 WHERE constituency_number = ? AND candidate_name IS NOT NULL

      UNION ALL

      SELECT constituency_number, candidate_name, sex, age, category, party, \`general\`, postal, \`total\`, votes_percentage
      FROM oit_stack_mh_mla_2009_005 WHERE constituency_number = ? AND candidate_name IS NOT NULL
    `;

    const [rows] = await pool.query(query, [
      constituencyId,
      constituencyId,
      constituencyId,
      constituencyId,
      constituencyId
    ]);

    res.json({
      constituency_number: parseInt(constituencyId),
      candidates: rows
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});