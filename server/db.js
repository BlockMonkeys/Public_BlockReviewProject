const mysql = require("mysql");

let db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "blockreview"
});

db.connect(function(err) {
  if (err) {
    console.log(`❌ MYSQL DB PROBLEM`);
    throw err;
  } else {
    console.log(`✅ MYSQL DB IS CONNECTED`);
  }
});

module.exports = { db };