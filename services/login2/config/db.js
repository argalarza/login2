const mysql = require('mysql2');

// Configuración de la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.MYSQL_DB_HOST,
  port: process.env.MYSQL_DB_PORT || 3306,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
});

module.exports = db;
