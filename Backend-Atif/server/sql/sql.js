const postgres = require("postgres");
const dotenv = require("dotenv");
dotenv.config();
const sql = postgres({
  username: "neondb_owner",
  host: "ep-fragrant-mountain-a5kmzvl7.us-east-2.aws.neon.tech",
  database: "neondb",
  password: process.env.SQL_PASS,
  port: 5432,
  ssl: "require",
  connection: {
    options: "project=ep-fragrant-mountain-a5kmzvl7",
  },
});

module.exports = sql;
