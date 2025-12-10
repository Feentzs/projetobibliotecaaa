const jwt = require('jsonwebtoken');

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

module.exports = authenticateToken;
