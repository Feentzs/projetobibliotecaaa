const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'bibliotec',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Conexão com MySQL estabelecida com sucesso');
    connection.release();
  })
  .catch(error => {
    console.error('❌ Erro ao conectar ao MySQL:', error.message);
    process.exit(1);
  });

module.exports = pool;
