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

  // Atualizar perfil
  static async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, bio } = req.body;

      if (!name || name.length < 3) {
        return res.status(400).json({ error: 'Nome deve ter pelo menos 3 caracteres' });
      }

      const connection = await pool.getConnection();

      const [result] = await connection.query(
        'UPDATE users SET name = ? WHERE id = ?',
        [name, userId]
      );

      connection.release();

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json({
        message: 'Perfil atualizado com sucesso',
        user: { id: userId, name, email: req.user.email }
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }

  // Alterar senha
  static async changePassword(req, res) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Nova senha deve ter pelo menos 8 caracteres' });
      }

      const connection = await pool.getConnection();

      const [users] = await connection.query('SELECT password FROM users WHERE id = ?', [userId]);

      if (users.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Comparar senha atual
      const passwordMatch = await bcryptjs.compare(currentPassword, users[0].password);

      if (!passwordMatch) {
        connection.release();
        return res.status(401).json({ error: 'Senha atual incorreta' });
      }

      // Hash da nova senha
      const hashedPassword = await bcryptjs.hash(newPassword, 10);

      await connection.query(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, userId]
      );

      connection.release();

      return res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return res.status(500).json({ error: 'Erro ao alterar senha' });
    }
  }

  // Deletar conta
  static async deleteAccount(req, res) {
    try {
      const userId = req.user.id;

      const connection = await pool.getConnection();

      // Deletar biblioteca do usuário
      await connection.query('DELETE FROM user_library WHERE user_id = ?', [userId]);

      // Deletar usuário
      const [result] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);

      connection.release();

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json({ message: 'Conta deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      return res.status(500).json({ error: 'Erro ao deletar conta' });
    }
  }

  // Verificar acesso de administrador
  static async verifyAdminAccess(req, res) {
    try {
      const userId = req.user.id;

      const connection = await pool.getConnection();

      const [users] = await connection.query(
        'SELECT is_superuser FROM users WHERE id = ?',
        [userId]
      );

      connection.release();

      if (users.length === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const isSuperuser = users[0].is_superuser === 1;

      if (!isSuperuser) {
        return res.status(403).json({ error: 'Acesso negado. Usuário não é administrador.' });
      }

      return res.json({ valid: true, isAdmin: true });
    } catch (error) {
      console.error('Erro ao verificar acesso de admin:', error);
      return res.status(500).json({ error: 'Erro ao verificar acesso' });
    }
  }
}

module.exports = AuthController;
