const { Pool } = require("pg");
require("dotenv").config();

let pool;
if (process.env.DB_URL) {
  // When deployed on Render, use the provided DB_URL and add SSL settings.
  pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  // When running locally, use the local environment variables.
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
}

module.exports = pool;

// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// module.exports = pool;

// const { Pool } = require("pg");
// require("dotenv").config();

// const pool = new Pool({
//   connectionString: process.env.DB_URL,
//   ssl: { rejectUnauthorized: false }, // Required for Render PostgreSQL
// });

// module.exports = pool;
