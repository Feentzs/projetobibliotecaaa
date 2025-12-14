const express = require('express');
const BookController = require('../controllers/bookController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/books - Obter todos os livros (público)
router.get('/', BookController.getBooks);

// GET /api/books/search?query=... - Buscar livros (público)
router.get('/search', BookController.searchBooks);

// GET /api/books/:id - Obter um livro específico (público)
router.get('/:id', BookController.getBook);

// POST /api/books - Criar novo livro (admin/protegido)
router.post('/', authenticateToken, BookController.createBook);

// PUT /api/books/:id - Atualizar livro (admin/protegido)
router.put('/:id', authenticateToken, BookController.updateBook);

// DELETE /api/books/:id - Deletar livro (admin/protegido)
router.delete('/:id', authenticateToken, BookController.deleteBook);

module.exports = router;
