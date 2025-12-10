const express = require('express');
const AuthController = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - Registrar novo usuário
router.post('/register', AuthController.register);

// POST /api/auth/login - Login
router.post('/login', AuthController.login);

// GET /api/auth/verify - Verificar token (protegido)
router.get('/verify', authenticateToken, AuthController.verifyToken);

module.exports = router;
