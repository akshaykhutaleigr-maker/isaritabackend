// const mongoose =require('mongoose');
// mongoose.connect('mongodb://localhost:27017/e-commerce');
const { Pool } = require('pg');

// Configure the PostgreSQL connection pool
const pool = new Pool({
  user: 'postgres',     // PostgreSQL username
  host: 'localhost',         // DB host
  database: 'postgres',          // Database name
  password: 'postgres', // DB password
  port: 5432,                // Default PostgreSQL port
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;