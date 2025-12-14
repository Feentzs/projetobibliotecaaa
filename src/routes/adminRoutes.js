const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authenticateToken, verifySuperuser } = require('../middleware/auth');

// ===== DASHBOARD =====
router.get('/dashboard/stats', authenticateToken, verifySuperuser, AdminController.getDashboardStats);

// ===== LIVROS =====
router.get('/books', authenticateToken, verifySuperuser, AdminController.getBooks);
router.post('/books', authenticateToken, verifySuperuser, AdminController.createBook);
router.put('/books/:id', authenticateToken, verifySuperuser, AdminController.updateBook);
router.delete('/books/:id', authenticateToken, verifySuperuser, AdminController.deleteBook);

// ===== USUÁRIOS =====
router.get('/users', authenticateToken, verifySuperuser, AdminController.getUsers);
router.post('/users', authenticateToken, verifySuperuser, AdminController.createUser);
router.delete('/users/:id', authenticateToken, verifySuperuser, AdminController.deleteUser);

// ===== RESERVAS =====
router.get('/reservations', authenticateToken, verifySuperuser, AdminController.getReservations);
router.put('/reservations/:id', authenticateToken, verifySuperuser, AdminController.updateReservation);
router.delete('/reservations/:id', authenticateToken, verifySuperuser, AdminController.deleteReservation);

module.exports = router;
