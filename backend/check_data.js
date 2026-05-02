require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const [rows] = await connection.query('SELECT count(*) as count FROM oit_stack_mh_mla_2024_001 WHERE constituency_number = 1');
    console.log('Rows for constituency 1 in _001:', rows[0].count);
    
    const [rows2] = await connection.query('SELECT count(*) as count FROM oit_stack_mh_mla_2024_002 WHERE constituency_number = 1');
    console.log('Rows for constituency 1 in _002:', rows2[0].count);

    const [rows3] = await connection.query('SELECT count(*) as count FROM oit_stack_mh_mla_2024_003 WHERE constituency_number = 1');
    console.log('Rows for constituency 1 in _003:', rows3[0].count);

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}
testConnection();
