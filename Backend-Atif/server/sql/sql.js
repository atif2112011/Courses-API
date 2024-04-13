const postgres = require("postgres");

const sql = postgres({
  username: "neondb_owner",
  host: "ep-fragrant-mountain-a5kmzvl7.us-east-2.aws.neon.tech",
  database: "neondb",
  password: "2ExXF1dOHIDf",
  port: 5432,
  ssl: "require",
  connection: {
    options: "project=ep-fragrant-mountain-a5kmzvl7",
  },
});

module.exports = sql;
