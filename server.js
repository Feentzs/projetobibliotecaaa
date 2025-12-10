const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configurações
const pool = require('./src/config/database');

// Importar rotas
const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const userLibraryRoutes = require('./src/routes/userLibraryRoutes');

const app = express();

// ===== MIDDLEWARES =====
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ===== ROTAS =====
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/user-library', userLibraryRoutes);

// ===== ROTA DE HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({ status: '✅ Servidor rodando' });
});

// ===== TRATAMENTO DE ERROS 404 =====
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// ===== INICIAR SERVIDOR =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📖 BiblioTec Backend - ${process.env.NODE_ENV || 'development'}`);
});

// ===== TRATAMENTO DE ERROS NÃO CAPTURADOS =====
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rejeitada não tratada:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Erro não capturado:', error);
  process.exit(1);
});

module.exports = app;
