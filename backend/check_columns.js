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
    const [rows] = await connection.query('DESCRIBE oit_stack_mh_mla_2024_001');
    console.log('Columns in oit_stack_mh_mla_2024_001:');
    rows.forEach(row => console.log(`${row.Field} (${row.Type})`));
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}
testConnection();
