const mysql = require('mysql2');
require('dotenv').config();

const dbPassword = process.env.DB_PASSWORD || '';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: dbPassword,
  database: process.env.DB_NAME || 'alzheimer_ai_db',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const db = mysql.createPool(dbConfig);

// Check connection once at startup for better diagnostics
 db.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection error:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('MySQL auth failed. Check backend/.env DB_USER and DB_PASSWORD.');
    }
    return;
  }
  console.log('MySQL connected:', connection.config.host, connection.config.database);
  connection.release();
});

module.exports = db;





