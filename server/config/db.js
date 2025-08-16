// db.js
const pgp = require('pg-promise')();
const db = pgp({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // allow self-signed certs
  },
});// e.g., postgres://user:pass@localhost:5432/pet_adoption

module.exports = db;
