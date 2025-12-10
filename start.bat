@echo off
REM BiblioTec - Quick Start Script para Windows
REM =============================================

cls
echo.
echo  __  __     __   __  __  __      
echo |  )(  \    |  \ |  )(  )|__) 
echo |__)\__/    |__/ |__)\( |    
echo.
echo BiblioTec - Sistema de Biblioteca Online
echo ==========================================
echo.

REM 1. Instalar dependências
echo [1/4] Instalando dependências...
call npm install
if errorlevel 1 (
    echo Erro ao instalar dependências
    pause
    exit /b 1
)
echo OK - Dependências instaladas
echo.

REM 2. Verificar .env
echo [2/4] Verificando configuração...
if exist ".env" (
    echo OK - .env encontrado
) else (
    echo ERRO - .env nao encontrado
    echo Crie um arquivo .env com as credenciais do MySQL
    pause
    exit /b 1
)
echo.

REM 3. Avisar sobre banco de dados
echo [3/4] Banco de Dados...
echo.
echo AVISO: Voce precisa executar manualmente:
echo.
echo   mysql -u root -p bibliotec ^< database.sql
echo.
echo Ou no MySQL Workbench/phpMyAdmin:
echo   Execute o arquivo: database.sql
echo.
pause

REM 4. Iniciar servidor
echo [4/4] Iniciando servidor...
echo.
echo Servidor BiblioTec iniciando em http://localhost:3000
echo Frontend: http://127.0.0.1:5500 (com Go Live)
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

npm run dev
pause
