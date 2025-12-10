#!/bin/bash
# BiblioTec - Quick Start Commands
# =================================

echo "🚀 BiblioTec - Setup Rápido"
echo "=============================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Instalar dependências
echo -e "${BLUE}[1/4]${NC} Instalando dependências..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependências instaladas${NC}"
else
    echo -e "${RED}✗ Erro ao instalar dependências${NC}"
    exit 1
fi
echo ""

# 2. Verificar .env
echo -e "${BLUE}[2/4]${NC} Verificando configuração..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env encontrado${NC}"
else
    echo -e "${RED}✗ .env não encontrado${NC}"
    echo -e "${YELLOW}Crie um arquivo .env com as credenciais do MySQL${NC}"
    exit 1
fi
echo ""

# 3. Avisar sobre banco de dados
echo -e "${BLUE}[3/4]${NC} Banco de Dados..."
echo -e "${YELLOW}Você precisa executar manualmente:${NC}"
echo "  mysql -u root -p bibliotec < database.sql"
echo ""
echo -e "${YELLOW}Ou no MySQL Workbench/phpMyAdmin:${NC}"
echo "  Execute o arquivo: database.sql"
echo ""

# 4. Iniciar servidor
echo -e "${BLUE}[4/4]${NC} Iniciando servidor..."
echo -e "${GREEN}Servidor BiblioTec iniciando em http://localhost:3000${NC}"
echo -e "${YELLOW}Frontend: http://127.0.0.1:5500 (com Go Live)${NC}"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

npm run dev
