const express = require('express');
const UserLibraryController = require('../controllers/userLibraryController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Todas as rotas de biblioteca do usuário requerem autenticação
router.use(authenticateToken);

// GET /api/user-library - Obter biblioteca do usuário
router.get('/', UserLibraryController.getUserLibrary);

// POST /api/user-library - Adicionar livro à biblioteca
router.post('/', UserLibraryController.addToLibrary);

// PUT /api/user-library/:book_id - Atualizar progresso de leitura
router.put('/:book_id', UserLibraryController.updateProgress);

// DELETE /api/user-library/:book_id - Remover livro da biblioteca
router.delete('/:book_id', UserLibraryController.removeFromLibrary);

module.exports = router;
