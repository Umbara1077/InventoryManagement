const mysql = require('mysql2/promise');

async function connect() {
  return mysql.createConnection(process.env.DATABASE_URL);
}

module.exports = { connect };
