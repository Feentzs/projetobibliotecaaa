const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const pool = require('../config/database');

class AuthController {
  // Registrar novo usuário
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validação
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
      }

      const connection = await pool.getConnection();

      // Verificar se email já existe
      const [existingUser] = await connection.query('SELECT email FROM users WHERE email = ?', [email]);

      if (existingUser.length > 0) {
        connection.release();
        return res.status(400).json({ error: 'Email já registrado' });
      }

      // Hash da senha
      const hashedPassword = await bcryptjs.hash(password, 10);

      // Inserir usuário
      const [result] = await connection.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      connection.release();

      // Gerar JWT
      const token = jwt.sign(
        { id: result.insertId, name, email },
        process.env.JWT_SECRET || 'seu-segredo-aqui',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: 'Usuário registrado com sucesso',
        token,
        user: { id: result.insertId, name, email }
      });
    } catch (error) {
      console.error('Erro ao registrar:', error);
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  }

  // Login
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const connection = await pool.getConnection();

      const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

      connection.release();

      if (users.length === 0) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      const user = users[0];

      // Comparar senha
      const passwordMatch = await bcryptjs.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Email ou senha incorretos' });
      }

      // Gerar JWT
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        process.env.JWT_SECRET || 'seu-segredo-aqui',
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login realizado com sucesso',
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ error: 'Erro ao fazer login' });
    }
  }

  // Verificar token
  static async verifyToken(req, res) {
    try {
      const user = req.user;
      return res.json({ valid: true, user });
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return res.status(500).json({ error: 'Erro ao verificar token' });
    }
  }
}

module.exports = AuthController;
