const pool = require('../config/database');

class BookController {
  // Obter todos os livros
  static async getBooks(req, res) {
    try {
      const connection = await pool.getConnection();
      const [books] = await connection.query('SELECT * FROM books ORDER BY id DESC');
      connection.release();

      return res.json(books);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      return res.status(500).json({ error: 'Erro ao buscar livros' });
    }
  }

  // Obter um livro específico
  static async getBook(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID do livro é obrigatório' });
      }

      const connection = await pool.getConnection();
      const [books] = await connection.query('SELECT * FROM books WHERE id = ?', [id]);
      connection.release();

      if (books.length === 0) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }

      return res.json(books[0]);
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      return res.status(500).json({ error: 'Erro ao buscar livro' });
    }
  }

  // Criar novo livro (admin)
  static async createBook(req, res) {
    try {
      const { title, author, cover, pdf, description, genre, rating, pages } = req.body;

      if (!title || !author) {
        return res.status(400).json({ error: 'Título e autor são obrigatórios' });
      }

      const connection = await pool.getConnection();

      const [result] = await connection.query(
        'INSERT INTO books (title, author, cover, pdf, description, genre, rating, pages) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, author, cover || '', pdf || '', description || '', genre || '', rating || 0, pages || 0]
      );

      connection.release();

      return res.status(201).json({
        message: 'Livro criado com sucesso',
        id: result.insertId,
        book: { id: result.insertId, title, author, cover, pdf, description, genre, rating, pages }
      });
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      return res.status(500).json({ error: 'Erro ao criar livro' });
    }
  }

  // Atualizar livro (admin)
  static async updateBook(req, res) {
    try {
      const { id } = req.params;
      const { title, author, cover, pdf, description, genre, rating, pages } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID do livro é obrigatório' });
      }

      if (!title || !author) {
        return res.status(400).json({ error: 'Título e autor são obrigatórios' });
      }

      const connection = await pool.getConnection();

      const [result] = await connection.query(
        'UPDATE books SET title = ?, author = ?, cover = ?, pdf = ?, description = ?, genre = ?, rating = ?, pages = ? WHERE id = ?',
        [title, author, cover || '', pdf || '', description || '', genre || '', rating || 0, pages || 0, id]
      );

      connection.release();

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }

      return res.json({
        message: 'Livro atualizado com sucesso',
        book: { id, title, author, cover, pdf, description, genre, rating, pages }
      });
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      return res.status(500).json({ error: 'Erro ao atualizar livro' });
    }
  }

  // Deletar livro (admin)
  static async deleteBook(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'ID do livro é obrigatório' });
      }

      const connection = await pool.getConnection();

      const [result] = await connection.query('DELETE FROM books WHERE id = ?', [id]);

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

  // Buscar livros por gênero
  static async searchBooks(req, res) {
    try {
      const { query } = req.query;

      if (!query) {
        return res.status(400).json({ error: 'Query de busca é obrigatória' });
      }

      const connection = await pool.getConnection();
      const [books] = await connection.query(
        'SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR genre LIKE ? ORDER BY id DESC',
        [`%${query}%`, `%${query}%`, `%${query}%`]
      );
      connection.release();

      return res.json(books);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      return res.status(500).json({ error: 'Erro ao buscar livros' });
    }
  }
}

module.exports = BookController;
