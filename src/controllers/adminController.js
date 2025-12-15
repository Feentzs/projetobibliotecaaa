const pool = require('../config/database');

class AdminController {
  // ===== DASHBOARD =====

  // Obter estatísticas do dashboard
  static async getDashboardStats(req, res) {
    try {
      const connection = await pool.getConnection();

      // Total de livros
      const [booksResult] = await connection.query('SELECT COUNT(*) as total FROM books');
      const totalBooks = booksResult[0].total;

      // Total de usuários
      const [usersResult] = await connection.query('SELECT COUNT(*) as total FROM users');
      const totalUsers = usersResult[0].total;

      // Total de livros na biblioteca dos usuários
      const [reservationsResult] = await connection.query(
        'SELECT COUNT(*) as total FROM user_library'
      );
      const totalReservations = reservationsResult[0].total;

      // Livro mais popular
      const [topBookResult] = await connection.query(
        `SELECT b.title, COUNT(ul.id) as count 
         FROM books b 
         LEFT JOIN user_library ul ON b.id = ul.book_id 
         GROUP BY b.id 
         ORDER BY count DESC 
         LIMIT 1`
      );
      const topBook = topBookResult.length > 0 ? topBookResult[0].title : 'N/A';

      // Livros adicionados na semana
      const [weekReservationsResult] = await connection.query(
        `SELECT COUNT(*) as total FROM user_library 
         WHERE added_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)`
      );
      const weekReservations = weekReservationsResult[0].total;

      connection.release();

      return res.json({
        totalBooks,
        totalUsers,
        totalReservations,
        weekReservations,
        topBook
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return res.status(500).json({ error: 'Erro ao obter estatísticas' });
    }
  }

  // ===== LIVROS =====

  // Listar todos os livros
  static async getBooks(req, res) {
    try {
      const connection = await pool.getConnection();
      const [books] = await connection.query('SELECT * FROM books ORDER BY created_at DESC');
      connection.release();

      return res.json(books);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      return res.status(500).json({ error: 'Erro ao buscar livros' });
    }
  }

  // Criar novo livro
  static async createBook(req, res) {
    try {
      const { title, author, cover_url, description, genre, rating, pages, pdf_url } = req.body;

      if (!title || !author || !cover_url) {
        return res.status(400).json({ error: 'Título, autor e capa são obrigatórios' });
      }

      const connection = await pool.getConnection();
      const [result] = await connection.query(
        `INSERT INTO books (title, author, cover_url, description, genre, rating, pages, pdf_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, author, cover_url, description || null, genre || null, rating || 4.0, pages || null, pdf_url || null]
      );
      connection.release();

      return res.status(201).json({
        message: 'Livro criado com sucesso',
        id: result.insertId
      });
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      return res.status(500).json({ error: 'Erro ao criar livro' });
    }
  }

  // Atualizar livro
  static async updateBook(req, res) {
    try {
      const bookId = req.params.id;
      const { title, author, cover_url, description, genre, rating, pages, pdf_url } = req.body;

      // Construir query dinamicamente apenas com campos fornecidos
      const fields = [];
      const values = [];

      if (title !== undefined) {
        fields.push('title = ?');
        values.push(title);
      }
      if (author !== undefined) {
        fields.push('author = ?');
        values.push(author);
      }
      if (cover_url !== undefined) {
        fields.push('cover_url = ?');
        values.push(cover_url);
      }
      if (description !== undefined) {
        fields.push('description = ?');
        values.push(description);
      }
      if (genre !== undefined) {
        fields.push('genre = ?');
        values.push(genre);
      }
      if (rating !== undefined) {
        fields.push('rating = ?');
        values.push(rating);
      }
      if (pages !== undefined) {
        fields.push('pages = ?');
        values.push(pages);
      }
      if (pdf_url !== undefined) {
        fields.push('pdf_url = ?');
        values.push(pdf_url);
      }

      if (fields.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar' });
      }

      values.push(bookId);

      const connection = await pool.getConnection();
      const [result] = await connection.query(
        `UPDATE books SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      connection.release();

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }

      return res.json({ message: 'Livro atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      return res.status(500).json({ error: 'Erro ao atualizar livro' });
    }
  }

  // Deletar livro
  static async deleteBook(req, res) {
    try {
      const bookId = req.params.id;

      const connection = await pool.getConnection();
      const [result] = await connection.query('DELETE FROM books WHERE id = ?', [bookId]);
      connection.release();

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }

      return res.json({ message: 'Livro deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar livro:', error);
      return res.status(500).json({ error: 'Erro ao deletar livro' });
    }
  }

  // ===== USUÁRIOS =====

  // Listar todos os usuários
  static async getUsers(req, res) {
    try {
      const connection = await pool.getConnection();
      const [users] = await connection.query('SELECT id, name, email, is_superuser, created_at FROM users');
      connection.release();

      return res.json(users);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
  }

  // Criar novo usuário
  static async createUser(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      const connection = await pool.getConnection();

      // Verificar se email já existe
      const [existingUser] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        connection.release();
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

      // Hash da senha (simplificado - use bcrypt em produção)
      const crypto = require('crypto');
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

      const [result] = await connection.query(
        'INSERT INTO users (name, email, password, is_superuser) VALUES (?, ?, ?, ?)',
        [name, email, passwordHash, 0]
      );
      connection.release();

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        id: result.insertId
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }

  // Deletar usuário
  static async deleteUser(req, res) {
    try {
      const userId = req.params.id;

      // Evitar deletar a si mesmo
      if (userId == req.user.id) {
        return res.status(400).json({ error: 'Não é possível deletar sua própria conta' });
      }

      const connection = await pool.getConnection();
      
      // Deletar biblioteca do usuário primeiro
      await connection.query('DELETE FROM user_library WHERE user_id = ?', [userId]);
      
      // Deletar usuário
      const [result] = await connection.query('DELETE FROM users WHERE id = ?', [userId]);
      connection.release();

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }

  // ===== RESERVAS =====

  // Listar todas as reservas
  static async getReservations(req, res) {
    try {
      const connection = await pool.getConnection();
      const [reservations] = await connection.query(
        `SELECT ul.id, u.name, u.email, b.title, b.author, ul.status, ul.added_at, ul.is_favorite, ul.progress
         FROM user_library ul
         JOIN users u ON ul.user_id = u.id
         JOIN books b ON ul.book_id = b.id
         ORDER BY ul.added_at DESC`
      );
      connection.release();

      return res.json(reservations);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      return res.status(500).json({ error: 'Erro ao buscar reservas' });
    }
  }

  // Atualizar status de uma reserva
  static async updateReservation(req, res) {
    try {
      const reservationId = req.params.id;
      const { status } = req.body;

      if (!['reading', 'reserved', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Status inválido' });
      }

      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'UPDATE user_library SET status = ? WHERE id = ?',
        [status, reservationId]
      );
      connection.release();

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }

      return res.json({ message: 'Reserva atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      return res.status(500).json({ error: 'Erro ao atualizar reserva' });
    }
  }

  // Deletar uma reserva
  static async deleteReservation(req, res) {
    try {
      const reservationId = req.params.id;

      const connection = await pool.getConnection();
      const [result] = await connection.query('DELETE FROM user_library WHERE id = ?', [reservationId]);
      connection.release();

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }

      return res.json({ message: 'Reserva deletada com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar reserva:', error);
      return res.status(500).json({ error: 'Erro ao deletar reserva' });
    }
  }
}

module.exports = AdminController;
