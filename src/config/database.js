// const mysql = require('mysql2/promise');
// require('dotenv').config();

// const dbConfig = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// };

// const pool = mysql.createPool(dbConfig);

// module.exports = pool;

require('dotenv').config();

// For PostgreSQL on Render (production)
if (process.env.DATABASE_URL) {
    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    module.exports = pool;
} else {
    // For MySQL (local development)
    const mysql = require('mysql2/promise');
    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
    const pool = mysql.createPool(dbConfig);
    module.exports = pool;
}
