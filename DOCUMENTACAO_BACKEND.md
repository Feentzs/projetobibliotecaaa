# 📚 Documentação do Backend - BiblioTec
## Guia Completo das Ferramentas e Tecnologias Utilizadas

---

## 📖 Introdução

Este documento explica de forma clara e simples todas as ferramentas, bibliotecas e tecnologias usadas na criação do backend (a parte "de trás" do aplicativo) do sistema **BiblioTec** - um sistema de biblioteca online.

O backend é como o "coração" do aplicativo. Ele recebe os pedidos do usuário (pela interface do site), busca os dados no banco de dados, processa as informações e envia tudo de volta para o usuário.

---

## 🛠️ Ferramentas Principais Utilizadas

### 1. **Node.js** 
**O que é?**
É um programa que permite executar código JavaScript fora do navegador. Normalmente, JavaScript roda em navegadores web, mas Node.js permite rodar JavaScript no servidor (computador que hospeda o site).

**Por que usamos?**
- Permite criar aplicações rápidas e eficientes
- Usa a mesma linguagem (JavaScript) para frontend e backend
- Tem uma comunidade grande com muitas bibliotecas prontas
- Suporta aplicações em tempo real

**Como funciona em nosso projeto?**
Quando você acessa o site, o Node.js está rodando no servidor. Ele recebe sua requisição (exemplo: "buscar todos os livros"), processa, e envia a resposta.

---

### 2. **Express.js**
**O que é?**
É uma biblioteca que facilita a criação de servidores web com Node.js. Sem o Express, seria muito complicado criar um servidor.

**Por que usamos?**
- Simplifica a criação de rotas (URLs como `/api/books`, `/api/auth`, etc.)
- Facilita o tratamento de requisições e respostas
- É leve, rápido e fácil de aprender
- Muito usado na indústria

**Exemplos em nosso projeto:**
```javascript
// Quando você acessa http://seusite/api/books
app.get('/api/books', (req, res) => {
  // O Express captura isso e executa essa função
})
```

---

### 3. **MySQL**
**O que é?**
Um banco de dados relacional. É onde armazenamos todas as informações do nosso sistema (usuários, livros, dados da biblioteca do usuário, etc.).

**Por que usamos?**
- Muito seguro para dados importantes
- Organiza os dados em tabelas (como uma planilha)
- Permite buscas rápidas e complexas
- Gratuito e confiável

**Como funciona?**
Os dados são organizados em 4 tabelas principais:
- **users**: Armazena nome, email e senha dos usuários
- **books**: Armazena informações dos livros (título, autor, capa, PDF)
- **user_library**: Armazena quais livros cada usuário está lendo ou favoritou

---

### 4. **JWT (JSON Web Tokens)**
**O que é?**
Uma forma segura de verificar quem você é quando está logado no site. É como um "crachá de acesso" digital.

**Por que usamos?**
- Muito seguro
- Descentralizado (o servidor não precisa guardar informações de sessão)
- Funciona bem em aplicações modernas
- Padrão da indústria

**Como funciona em nosso projeto:**
1. Você faz login com email e senha
2. O servidor verifica se está correto
3. Se estiver, gera um token JWT (uma sequência longa de caracteres)
4. Você guarda esse token
5. Sempre que faz uma requisição para uma ação protegida (como adicionar um livro à sua biblioteca), você envia o token
6. O servidor verifica se o token é válido
7. Se for, permite a ação

**Exemplo prático:**
```
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ikpv...
(Este é um token real, só exemplo)
```

---

### 5. **bcryptjs**
**O que é?**
Uma biblioteca que criptografa (embaralha) senhas. Não armazenamos senhas "em bruto" no banco de dados.

**Por que usamos?**
- Senhas claras no banco de dados são MUITO perigosas
- bcryptjs é muito seguro e resistente a ataques
- Se o banco de dados vazar, as senhas não podem ser descobertas

**Como funciona:**
```
Senha digitada: "123456"
Depois do bcryptjs: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36SGLEvO"
```
É impossível fazer o caminho inverso (descobrir a senha a partir do hash).

---

### 6. **CORS (Cross-Origin Resource Sharing)**
**O que é?**
Uma regra de segurança que controla qual lado do site pode acessar qual. Sem CORS, o frontend e backend não conseguem se comunicar.

**Por que usamos?**
- Proteção contra ataques
- Permite que o frontend (HTML/CSS/JavaScript) converse com o backend (Node.js)
- Controla quem pode acessar a API

**Explicação simples:**
Imagine que o backend é um restaurante e o frontend é um cliente. O CORS é a regra que diz "só clientes que têm reserva podem entrar". Se não tivéssemos CORS, qualquer um de qualquer lugar poderia fazer requisições.

**Em nosso projeto:**
```javascript
app.use(cors({
  origin: '*',  // Permite requisições de qualquer origem (aberto)
  methods: ['GET', 'POST', 'PUT', 'DELETE']  // Métodos HTTP permitidos
}));
```

---

### 7. **dotenv (.env)**
**O que é?**
Uma forma segura de guardar informações sensíveis (como senhas do banco de dados, segredos do JWT) sem aparecer no código.

**Por que usamos?**
- Senhas e chaves secretas NÃO devem estar no código
- Diferentes ambientes (teste, produção) precisam de valores diferentes
- Se o código for compartilhado, as informações sensíveis não vazam

**Como funciona:**
Criamos um arquivo `.env` (nunca compartilhado) com:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=minha_senha_secreta
JWT_SECRET=meu_segredo_jwt
```

E no código, acessamos assim:
```javascript
const dbPassword = process.env.DB_PASSWORD
```

---

### 8. **mysql2**
**O que é?**
A biblioteca que permite que Node.js se comunique com MySQL.

**Por que usamos?**
- Sem ela, Node.js não consegue acessar o banco de dados
- Oferece suporte a "promises" (forma moderna de trabalhar com código assíncrono)
- Muito confiável

**Como funciona:**
```javascript
const connection = await pool.getConnection();
const [users] = await connection.query('SELECT * FROM users');
connection.release();
```

---

## 🏗️ Arquitetura do Projeto

Nosso projeto segue um padrão chamado **MVC** (Model-View-Controller), mas como é apenas o backend, temos:

### **Estrutura de Pastas:**
```
projeto/
├── src/
│   ├── config/
│   │   └── database.js        ← Conexão com o banco
│   ├── controllers/           ← Lógica das operações
│   │   ├── authController.js  ← Login, registro, autenticação
│   │   ├── bookController.js  ← Operações com livros
│   │   ├── userLibraryController.js  ← Biblioteca do usuário
│   │   └── adminController.js ← Operações de administrador
│   ├── middleware/            ← Verificações de segurança
│   │   └── auth.js            ← Verifica tokens JWT
│   └── routes/                ← Definição das URLs/endpoints
│       ├── authRoutes.js
│       ├── bookRoutes.js
│       ├── userLibraryRoutes.js
│       └── adminRoutes.js
├── server.js                  ← Arquivo principal que inicia tudo
├── package.json               ← Lista de bibliotecas usadas
└── database.sql              ← Script para criar as tabelas
```

---

## 🔄 Fluxo de uma Requisição (Como Funciona)

Vamos usar um exemplo: **Um usuário quer fazer login**

### **Passo 1: O usuário envia seus dados**
```
O frontend envia:
POST /api/auth/login
{
  "email": "usuario@example.com",
  "password": "123456"
}
```

### **Passo 2: Express captura a requisição**
```javascript
// Em authRoutes.js
router.post('/login', AuthController.login);
// Express redireciona para o controller
```

### **Passo 3: O Controller processa**
```javascript
// Em authController.js
static async login(req, res) {
  const { email, password } = req.body;
  
  // 1. Busca o usuário no banco
  const connection = await pool.getConnection();
  const [users] = await connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  
  // 2. Verifica a senha
  const passwordMatch = await bcryptjs.compare(password, users[0].password);
  
  // 3. Se estiver correto, gera o JWT
  const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET);
  
  // 4. Envia a resposta
  res.json({ token, user: { id, name, email } });
}
```

### **Passo 4: A resposta volta para o frontend**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "João",
    "email": "usuario@example.com"
  }
}
```

---

## 🔐 Segurança: Rotas Protegidas

Algumas rotas precisam de autenticação. Usamos o middleware `authenticateToken` para isso.

### **Exemplo de rota protegida:**
```javascript
// Em authRoutes.js
router.get('/verify', authenticateToken, AuthController.verifyToken);
```

### **Como funciona:**
```javascript
// Em middleware/auth.js
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next(); // Permite continuar
  });
};
```

**O que acontece:**
1. Cliente envia um token no header da requisição
2. O middleware verifica se é válido
3. Se for válido, permite acessar a rota
4. Se não for, retorna erro 403 (Forbidden)

---

## 📊 Endpoints Principais

### **Autenticação (auth)**
- `POST /api/auth/register` - Criar novo usuário
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/verify` - Verificar token (protegido)
- `PUT /api/auth/profile` - Atualizar perfil (protegido)
- `POST /api/auth/change-password` - Mudar senha (protegido)
- `DELETE /api/auth/delete-account` - Deletar conta (protegido)

### **Livros (books)**
- `GET /api/books` - Listar todos os livros
- `GET /api/books/:id` - Detalhes de um livro
- `POST /api/books` - Criar livro (admin)
- `PUT /api/books/:id` - Editar livro (admin)
- `DELETE /api/books/:id` - Deletar livro (admin)

### **Biblioteca do Usuário (user-library)**
- `GET /api/user-library` - Minha biblioteca (protegido)
- `POST /api/user-library` - Adicionar livro à biblioteca (protegido)
- `PUT /api/user-library/:id` - Atualizar progresso (protegido)
- `DELETE /api/user-library/:id` - Remover livro (protegido)

### **Administração (admin)**
- `GET /api/admin/users` - Listar usuários (admin)
- `GET /api/admin/stats` - Estatísticas (admin)

---

## 🚀 Como o Servidor Inicia

Quando você executa `npm start` ou `node server.js`:

### **Passo 1: Carrega as variáveis de ambiente**
```javascript
require('dotenv').config();
```

### **Passo 2: Conecta ao banco de dados**
```javascript
const pool = require('./src/config/database');
// MySQL é inicializado aqui
```

### **Passo 3: Configura middlewares**
```javascript
app.use(cors(...));      // Permite requisições cross-origin
app.use(express.json()); // Interpreta JSON
```

### **Passo 4: Registra as rotas**
```javascript
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
// ... outras rotas
```

### **Passo 5: Inicia o servidor**
```javascript
app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
```

---

## 💾 Banco de Dados: Estrutura das Tabelas

### **Tabela: users**
```sql
CREATE TABLE users (
  id INT PRIMARY KEY,              -- ID único de cada usuário
  name VARCHAR(255),               -- Nome completo
  email VARCHAR(255) UNIQUE,       -- Email (não pode repetir)
  password VARCHAR(255),           -- Senha criptografada
  is_superuser BOOLEAN,            -- É admin?
  created_at TIMESTAMP,            -- Quando foi criado
  updated_at TIMESTAMP             -- Última modificação
);
```

### **Tabela: books**
```sql
CREATE TABLE books (
  id INT PRIMARY KEY,              -- ID único do livro
  title VARCHAR(255),              -- Título
  author VARCHAR(255),             -- Autor
  cover_url VARCHAR(500),          -- Link da capa
  pdf_url VARCHAR(500),            -- Link do PDF
  description LONGTEXT,            -- Descrição completa
  genre VARCHAR(100),              -- Gênero (ficção, romance, etc)
  rating DECIMAL(3,1),             -- Avaliação (0-5)
  pages INT,                       -- Número de páginas
  created_at TIMESTAMP,            -- Data de criação
  updated_at TIMESTAMP             -- Data de atualização
);
```

### **Tabela: user_library**
```sql
CREATE TABLE user_library (
  id INT PRIMARY KEY,              -- ID da entrada
  user_id INT,                     -- Qual usuário
  book_id INT,                     -- Qual livro
  progress INT,                    -- Progresso de leitura (%)
  added_at TIMESTAMP,              -- Quando adicionou à biblioteca
  updated_at TIMESTAMP             -- Última atualização
);
```

**Relacionamento (Foreign Keys):**
- `user_library.user_id` → `users.id`
- `user_library.book_id` → `books.id`

Isso significa que cada entrada em `user_library` está conectada a um usuário e um livro real.

---

## 🔍 Possíveis Dúvidas e Respostas

### **P: Por que usar JWT em vez de guardar a sessão no servidor?**
**R:** JWT é mais eficiente para aplicações modernas. O servidor não precisa guardar informações de quem está logado. O token contém essas informações criptografadas. Se a aplicação cresce e fica distribuída em múltiplos servidores, JWT funciona melhor.

---

### **P: Por que criptografar senhas com bcryptjs se há outras opções?**
**R:** bcryptjs é muito seguro porque usa um algoritmo chamado "Blowfish" que propositalmente é lento (demora alguns segundos). Isso torna ataques de força bruta impraticáveis. Se alguém tentar adivinhar senhas, demoraria anos.

---

### **P: O que é um "middleware" exatamente?**
**R:** Middleware é uma função que fica "no meio" da requisição e da resposta. Exemplo: quando você faz uma requisição com token, o middleware `authenticateToken` verifica o token ANTES de deixar você acessar a rota.

Fluxo:
```
Requisição → Middleware (verifica token) → Controller (processa) → Resposta
```

---

### **P: Por que precisamos de `pool` de conexões no MySQL?**
**R:** Abrir e fechar uma conexão com o banco demora tempo. Um "pool" é como manter várias conexões abertas e prontas. Quando precisa de uma, pega do pool. Quando termina, devolve. Isso é muito mais rápido.

---

### **P: O que significa "ON DELETE CASCADE"?**
**R:** Se um usuário é deletado, todos os seus dados em `user_library` também são deletados automaticamente. Previne dados órfãos (dados que não pertencem mais a ninguém).

---

### **P: Por que temos um endpoint `/health`?**
**R:** Usado para verificar se o servidor está ativo. Muito útil em produção para monitoramento. Você acessa e se receber uma resposta, o servidor está funcionando.

---

### **P: O que é `express.static(__dirname)`?**
**R:** Permite que o Express sirva arquivos HTML, CSS, JavaScript e imagens do computador. Sem isso, o navegador não conseguiria acessar esses arquivos.

---

### **P: Por que usar variáveis de ambiente (`.env`)?**
**R:** 
1. **Segurança**: Senhas não ficam no código
2. **Flexibilidade**: Em desenvolvimento, usa um banco local. Em produção, usa outro servidor de banco.
3. **Privacidade**: Se compartilha o código no GitHub, os segredos não vazam.

---

## 📦 Package.json Explicado

```json
{
  "name": "bibliotec-backend",
  "version": "1.0.0",
  "description": "Backend para BiblioTec - Sistema de Biblioteca Online",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",      // Inicia o servidor normalmente
    "dev": "nodemon server.js"      // Inicia e reinicia automaticamente quando altera arquivo
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",           // Criptografia de senhas
    "cors": "^2.8.5",               // Cross-origin requests
    "dotenv": "^16.3.1",            // Variáveis de ambiente
    "express": "^4.22.1",           // Framework web
    "jsonwebtoken": "^9.0.3",       // JWT
    "mysql2": "^3.6.0"              // Conexão com MySQL
  },
  "devDependencies": {
    "nodemon": "^3.0.1"             // Reinicia servidor ao detectar mudanças
  }
}
```

**O que cada versão significa:**
- `^2.4.3` = Usa versão 2.4.3 ou superior (mas não maior que 3.0.0)
- `~2.4.3` = Usa versão 2.4.3 ou 2.4.4, 2.4.5 (pequenas correções)
- `*` = Qualquer versão

---

## 🎯 Resumo das Tecnologias

| Ferramenta | Função | Alternativas |
|---|---|---|
| **Node.js** | Executor de JavaScript no servidor | Python, Java, Go |
| **Express.js** | Framework web | Django, FastAPI, Spring |
| **MySQL** | Banco de dados relacional | PostgreSQL, MongoDB, Firebase |
| **JWT** | Autenticação e autorização | Sessions, OAuth2 |
| **bcryptjs** | Criptografia de senhas | Argon2, PBKDF2 |
| **CORS** | Segurança cross-origin | Proxy, Headers customizados |
| **dotenv** | Variáveis de ambiente | Variáveis do sistema, Config files |
| **mysql2** | Driver MySQL para Node | Sequelize, Prisma |

---

## 🚀 Próximos Passos Possíveis

Se fosse expandir o projeto, poderia:
1. **Adicionar upload de livros em PDF** - Guardar PDFs no servidor
2. **Sistema de comentários** - Usuários comentarem em livros
3. **Avaliações** - Usuários avaliarem livros
4. **Recomendações** - Baseado em livros que leu
5. **Notificações** - Quando novos livros chegam
6. **Relatórios** - Para administradores
7. **Cache** - Melhorar performance com Redis

---

## 📚 Recursos para Aprender Mais

- [Documentação Express.js](https://expressjs.com/)
- [Documentação MySQL](https://dev.mysql.com/doc/)
- [Como funciona JWT](https://jwt.io/)
- [Node.js Oficial](https://nodejs.org/)

---

**Documento criado com fins educacionais para apresentação do projeto BiblioTec**
