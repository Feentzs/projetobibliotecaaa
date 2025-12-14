const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token ausente' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'seu-segredo-aqui', (err, user) => {
    if (err) {
      console.error('Erro ao verificar token:', err.message);
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    req.user = user;
    next();
  });
};

const verifySuperuser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT is_superuser FROM users WHERE id = ?',
      [req.user.id]
    );
    connection.release();

    if (!rows || rows.length === 0 || !rows[0].is_superuser) {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
    }

    next();
  } catch (error) {
    console.error('Erro ao verificar superuser:', error);
    return res.status(500).json({ error: 'Erro ao verificar permissões' });
  }
};

module.exports = { authenticateToken, verifySuperuser };
