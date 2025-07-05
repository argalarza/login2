const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.MYSQL_DB_HOST,
  port: process.env.MYSQL_DB_PORT || 3306,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err.message);
    process.exit(1);
  } else {
    console.log('Conectado a MySQL');
  }
});

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) return reject(err);
      resolve(results.length > 0 ? results[0] : null);
    });
  });
};

module.exports = { getUserByEmail };
