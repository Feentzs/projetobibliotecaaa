const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - Registrar novo usuário
router.post('/register', AuthController.register);

// POST /api/auth/login - Login
router.post('/login', AuthController.login);

// GET /api/auth/verify - Verificar token (protegido)
router.get('/verify', authenticateToken, AuthController.verifyToken);

// GET /api/auth/verify-admin - Verificar acesso de administrador (protegido)
router.get('/verify-admin', authenticateToken, AuthController.verifyAdminAccess);

// PUT /api/auth/profile - Atualizar perfil (protegido)
router.put('/profile', authenticateToken, AuthController.updateProfile);

// POST /api/auth/change-password - Alterar senha (protegido)
router.post('/change-password', authenticateToken, AuthController.changePassword);

// DELETE /api/auth/delete-account - Deletar conta (protegido)
router.delete('/delete-account', authenticateToken, AuthController.deleteAccount);

module.exports = router;
