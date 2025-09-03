const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PORT = process.env.DB_PORT;

const dbPool = new Pool({
  database: DB_DATABASE,
  host: DB_HOST,
  password: DB_PASSWORD,
  port: DB_PORT,
  user: DB_USERNAME,
});

module.exports = {
  dbPool,
};
