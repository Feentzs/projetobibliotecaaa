const pool = require('../config/database');

class UserLibraryController {
  // Obter biblioteca do usuário
  static async getUserLibrary(req, res) {
    try {
      const userId = req.user.id;

      const connection = await pool.getConnection();

      const [libraryItems] = await connection.query(
        `SELECT b.*, ul.progress, ul.status, ul.is_favorite, ul.id as library_id
         FROM user_library ul
         JOIN books b ON ul.book_id = b.id
         WHERE ul.user_id = ?
         ORDER BY ul.id DESC`,
        [userId]
      );

      connection.release();

      return res.json(libraryItems);
    } catch (error) {
      console.error('Erro ao buscar biblioteca:', error);
      return res.status(500).json({ error: 'Erro ao buscar biblioteca' });
    }
  }

  // Adicionar livro à biblioteca
  static async addToLibrary(req, res) {
    try {
      const userId = req.user.id;
      const { book_id } = req.body;

      if (!book_id) {
        return res.status(400).json({ error: 'ID do livro é obrigatório' });
      }

      const connection = await pool.getConnection();

      // Verificar se livro existe
      const [books] = await connection.query('SELECT id FROM books WHERE id = ?', [book_id]);

      if (books.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Livro não encontrado' });
      }

      // Verificar se já está na biblioteca
      const [existing] = await connection.query(
        'SELECT id FROM user_library WHERE user_id = ? AND book_id = ?',
        [userId, book_id]
      );

      if (existing.length > 0) {
        connection.release();
        return res.status(400).json({ error: 'Livro já está na sua biblioteca' });
      }

      // Adicionar à biblioteca
      const [result] = await connection.query(
        'INSERT INTO user_library (user_id, book_id, progress) VALUES (?, ?, ?)',
        [userId, book_id, 0]
      );

      connection.release();

      return res.status(201).json({
        message: 'Livro adicionado à biblioteca com sucesso',
        library_id: result.insertId
      });
    } catch (error) {
      console.error('Erro ao adicionar livro à biblioteca:', error);
      return res.status(500).json({ error: 'Erro ao adicionar livro à biblioteca' });
    }
  }

  // Atualizar progresso de leitura
  static async updateProgress(req, res) {
    try {
      const userId = req.user.id;
      const { book_id } = req.params;
      const { progress } = req.body;

      if (!book_id) {
        return res.status(400).json({ error: 'ID do livro é obrigatório' });
      }

      if (typeof progress !== 'number' || progress < 0 || progress > 100) {
        return res.status(400).json({ error: 'Progresso deve ser um número entre 0 e 100' });
      }

      const connection = await pool.getConnection();

      const [result] = await connection.query(
        'UPDATE user_library SET progress = ? WHERE user_id = ? AND book_id = ?',
        [progress, userId, book_id]
      );

      connection.release();

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Livro não encontrado na sua biblioteca' });
      }

      return res.json({ message: 'Progresso atualizado com sucesso', progress });
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      return res.status(500).json({ error: 'Erro ao atualizar progresso' });
    }
  }

  // Remover livro da biblioteca
  static async removeFromLibrary(req, res) {
    try {
      const userId = req.user.id;
      const { book_id } = req.params;

      if (!book_id) {
        return res.status(400).json({ error: 'ID do livro é obrigatório' });
      }

      const connection = await pool.getConnection();

      const [result] = await connection.query(
        'DELETE FROM user_library WHERE user_id = ? AND book_id = ?',
        [userId, book_id]
      );

      connection.release();

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Livro não encontrado na sua biblioteca' });
      }

      return res.json({ message: 'Livro removido da biblioteca com sucesso' });
    } catch (error) {
      console.error('Erro ao remover livro da biblioteca:', error);
      return res.status(500).json({ error: 'Erro ao remover livro da biblioteca' });
    }
  }

  // Reservar livro
  static async reserveBook(req, res) {
    try {
      const userId = req.user.id;
      const { book_id } = req.params;

      if (!book_id) {
        return res.status(400).json({ error: 'ID do livro é obrigatório' });
      }

      const connection = await pool.getConnection();

      // Verificar se já tem este livro na biblioteca
      const [existing] = await connection.query(
        'SELECT * FROM user_library WHERE user_id = ? AND book_id = ?',
        [userId, book_id]
      );

      if (existing && existing.length > 0) {
        connection.release();
        return res.status(400).json({ error: 'Você já tem este livro em sua biblioteca' });
      }

      // Criar entrada com status "reserved"
      const [result] = await connection.query(
        `INSERT INTO user_library (user_id, book_id, status, is_favorite)
         VALUES (?, ?, 'reserved', 0)`,
        [userId, book_id]
      );

      connection.release();

      return res.status(201).json({
        message: 'Livro reservado com sucesso',
        id: result.insertId
      });
    } catch (error) {
      console.error('Erro ao reservar livro:', error);
      return res.status(500).json({ error: 'Erro ao reservar livro' });
    }
  }

  // Favoritar livro
  static async toggleFavorite(req, res) {
    try {
      const userId = req.user.id;
      const { book_id } = req.params;

      if (!book_id) {
        return res.status(400).json({ error: 'ID do livro é obrigatório' });
      }

      const connection = await pool.getConnection();

      // Verificar se tem este livro na biblioteca
      const [existing] = await connection.query(
        'SELECT is_favorite FROM user_library WHERE user_id = ? AND book_id = ?',
        [userId, book_id]
      );

      if (!existing || existing.length === 0) {
        // Se não existe, criar com favorito = 1
        const [result] = await connection.query(
          `INSERT INTO user_library (user_id, book_id, status, is_favorite)
           VALUES (?, ?, 'reading', 1)`,
          [userId, book_id]
        );
        connection.release();
        return res.status(201).json({
          message: 'Livro adicionado aos favoritos',
          id: result.insertId,
          is_favorite: true
        });
      }

      // Se existe, alternar favorito
      const newFavoriteStatus = existing[0].is_favorite ? 0 : 1;
      
      await connection.query(
        'UPDATE user_library SET is_favorite = ? WHERE user_id = ? AND book_id = ?',
        [newFavoriteStatus, userId, book_id]
      );

      connection.release();

      return res.json({
        message: newFavoriteStatus ? 'Adicionado aos favoritos' : 'Removido dos favoritos',
        is_favorite: Boolean(newFavoriteStatus)
      });
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      return res.status(500).json({ error: 'Erro ao alternar favorito' });
    }
  }
}

module.exports = UserLibraryController;
