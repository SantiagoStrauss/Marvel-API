const mysql = require("mysql2");

var { promisify } = require("util");
require("dotenv").config();
var credentials = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
};
var pool = mysql.createPool(credentials);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("Database connection was closed");
    }
    if (err.code === "ER_CON_COUNT_ERROR") {
      console.error("Database has too many connections");
    }
    if (err.code === "ECONNREFUSED") {
      console.error("Database connection was refused");
    }
  }
  if (connection) {
    connection.release();
    console.log("DB is connected");
  }
  else{
    console.log("DB is not connected");
  }
  return;
});

pool.query = promisify(pool.query);

module.exports = pool;
