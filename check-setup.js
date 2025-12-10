#!/usr/bin/env node

/**
 * Script de Verificação da Instalação BiblioTec
 * Verifica se tudo está configurado corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verificando instalação do BiblioTec...\n');

let hasErrors = false;

// 1. Verificar Node.js
console.log('✓ Node.js:', process.version);

// 2. Verificar package.json
if (fs.existsSync('package.json')) {
  console.log('✓ package.json encontrado');
} else {
  console.log('✗ package.json não encontrado');
  hasErrors = true;
}

// 3. Verificar node_modules
if (fs.existsSync('node_modules')) {
  console.log('✓ node_modules encontrado (dependências instaladas)');
} else {
  console.log('⚠ node_modules não encontrado - execute: npm install');
  hasErrors = true;
}

// 4. Verificar .env
if (fs.existsSync('.env')) {
  console.log('✓ .env encontrado');
  const env = fs.readFileSync('.env', 'utf8');
  if (env.includes('DB_HOST')) console.log('  ✓ DB_HOST configurado');
  if (env.includes('DB_USER')) console.log('  ✓ DB_USER configurado');
  if (env.includes('JWT_SECRET')) console.log('  ✓ JWT_SECRET configurado');
} else {
  console.log('✗ .env não encontrado');
  hasErrors = true;
}

// 5. Verificar server.js
if (fs.existsSync('server.js')) {
  console.log('✓ server.js encontrado');
} else {
  console.log('✗ server.js não encontrado');
  hasErrors = true;
}

// 6. Verificar database.sql
if (fs.existsSync('database.sql')) {
  console.log('✓ database.sql encontrado');
  console.log('  ℹ Execução: mysql -u root -p < database.sql');
} else {
  console.log('✗ database.sql não encontrado');
  hasErrors = true;
}

// 7. Verificar arquivos JavaScript principais
const jsFiles = [
  'js/api.js',
  'js/auth.js',
  'js/scripts-api.js',
  'js/admin-api.js'
];

console.log('\nArquivos JavaScript:');
jsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✓ ${file}`);
  } else {
    console.log(`✗ ${file} não encontrado`);
    hasErrors = true;
  }
});

// 8. Verificar HTML
const htmlFiles = [
  'index.html',
  'login.html',
  'home.html',
  'admin.html'
];

console.log('\nArquivos HTML:');
htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✓ ${file}`);
  } else {
    console.log(`✗ ${file} não encontrado`);
    hasErrors = true;
  }
});

// 9. Resumo
console.log('\n' + (hasErrors ? '❌' : '✅') + ' Verificação concluída\n');

if (hasErrors) {
  console.log('⚠ Existem problemas na instalação. Por favor:');
  console.log('  1. Execute: npm install');
  console.log('  2. Verifique o arquivo .env');
  console.log('  3. Execute database.sql no MySQL');
  console.log('  4. Verifique se todos os arquivos necessários existem\n');
  process.exit(1);
} else {
  console.log('✨ Tudo está configurado! Você pode executar: npm run dev\n');
  process.exit(0);
}
