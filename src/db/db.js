const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Use promise wrapper
const db = pool.promise();

db.query('SELECT 1 + 1 AS solution')
    .then(([rows, fields]) => {
        console.log('Connected to MySQL Database');
    })
    .catch((err) => {
        console.error('Failed to connect to db:', err.message);
    });

module.exports = db;
