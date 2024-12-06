require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit: 1000, // Giới hạn số kết nối
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
});

module.exports = pool.promise();

// Get-NetTCPConnection -LocalPort 3306 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }