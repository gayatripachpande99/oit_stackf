require('dotenv').config({ path: './backend/.env' });
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Config:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
  });

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Connected successfully!');

    const [rows] = await connection.query('SHOW TABLES');
    console.log('Tables in database:');
    rows.forEach(row => {
      console.log(Object.values(row)[0]);
    });

    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testConnection();
