// db.js
const pgp = require('pg-promise')();
const db = pgp(process.env.POSTGRES_URL); // e.g., postgres://user:pass@localhost:5432/pet_adoption

module.exports = db;
