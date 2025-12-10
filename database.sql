-- Script para criar as tabelas da BiblioTec
-- Execute este script no seu banco de dados MySQL

CREATE DATABASE IF NOT EXISTS bibliotec;
USE bibliotec;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de livros
CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  cover_url VARCHAR(500) NOT NULL,
  pdf_url VARCHAR(500),
  description LONGTEXT,
  genre VARCHAR(100),
  rating DECIMAL(3, 1) DEFAULT 4.0,
  pages INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_author (author),
  INDEX idx_genre (genre)
);

-- Tabela de biblioteca do usuário (favoritos e livros que o usuário está lendo)
CREATE TABLE IF NOT EXISTS user_library (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  book_id INT NOT NULL,
  progress INT DEFAULT 0,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_book (user_id, book_id),
  INDEX idx_user (user_id),
  INDEX idx_book (book_id)
);

-- Inserir alguns livros de exemplo
INSERT INTO books (title, author, cover_url, description, genre, rating, pages) VALUES
('Memórias Póstumas de Brás Cubas', 'Machado de Assis', 'https://covers.openlibrary.org/b/id/12628263-L.jpg', 'Um clássico da literatura brasileira que narra a vida de Brás Cubas após sua morte.', 'Clássico', 5, 368),
('Capitães da Areia', 'Jorge Amado', 'https://covers.openlibrary.org/b/id/11686911-L.jpg', 'A história de um grupo de meninos que vivem nas ruas de Salvador.', 'Romance', 4, 376),
('Dom Casmurro', 'Machado de Assis', 'https://covers.openlibrary.org/b/id/13491181-L.jpg', 'Um romance sobre ciúmes, traição e a subjetividade da memória.', 'Romance', 5, 256),
('O Alquimista', 'Paulo Coelho', 'https://covers.openlibrary.org/b/id/13141106-L.jpg', 'Uma jornada pelo deserto em busca de um tesouro e do destino pessoal.', 'Ficção', 4, 224),
('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 'https://covers.openlibrary.org/b/id/13293269-L.jpg', 'Um conto poético sobre um jovem príncipe que viaja por vários planetas.', 'Infantojuvenil', 5, 96),
('Quincas Borba', 'Machado de Assis', 'https://covers.openlibrary.org/b/id/8231856-L.jpg', 'A história de Quincas Borba e suas consequências na vida dos personagens.', 'Clássico', 4, 368),
('Iracema', 'José de Alencar', 'https://covers.openlibrary.org/b/id/240727-L.jpg', 'Uma lenda indígena sobre o amor entre uma índia e um colonizador.', 'Romance', 4, 96),
('O Cortiço', 'Aluísio Azevedo', 'https://covers.openlibrary.org/b/id/240677-L.jpg', 'Uma obra naturalista que retrata a vida em um cortiço no Rio de Janeiro.', 'Realismo', 4, 224),
('Macunaíma', 'Mário de Andrade', 'https://covers.openlibrary.org/b/id/11054071-L.jpg', 'Um romance modernista que narra as aventuras do herói da cultura brasileira.', 'Modernismo', 4, 304),
('Os Sertões', 'Euclides da Cunha', 'https://covers.openlibrary.org/b/id/11155574-L.jpg', 'Um ensaio sobre a Guerra de Canudos e o povo do sertão.', 'História', 5, 656),
('A Metamorfose', 'Franz Kafka', 'https://covers.openlibrary.org/b/id/12502453-L.jpg', 'A estranha história de um homem que se transforma em inseto.', 'Ficção', 5, 96),
('1984', 'George Orwell', 'https://covers.openlibrary.org/b/id/153541-L.jpg', 'Um romance distópico sobre um governo totalitário que controla a realidade.', 'Ficção', 5, 328),
('Grande Sertão: Veredas', 'João Guimarães Rosa', 'https://covers.openlibrary.org/b/id/12618218-L.jpg', 'Um romance clássico sobre jagunços e o sertão brasileiro.', 'Clássico', 5, 640),
('A Hora da Estrela', 'Clarice Lispector', 'https://covers.openlibrary.org/b/id/13527603-L.jpg', 'A história de uma jovem nordestina em busca de um lugar no mundo.', 'Romance', 4, 88),
('Vidas Secas', 'Graciliano Ramos', 'https://covers.openlibrary.org/b/id/13516261-L.jpg', 'A luta de uma família de retirantes pela sobrevivência no sertão.', 'Romance', 5, 128),
('A República', 'Platão', 'https://covers.openlibrary.org/b/id/11153242-L.jpg', 'Um diálogo filosófico sobre justiça, política e a natureza da realidade.', 'Filosofia', 4, 416),
('Memórias do Cárcere', 'Graciliano Ramos', 'https://covers.openlibrary.org/b/id/11110448-L.jpg', 'Memórias do encarceramento durante a ditadura do Estado Novo.', 'Biografia', 5, 560),
('Senhora', 'José de Alencar', 'https://covers.openlibrary.org/b/id/240690-L.jpg', 'Um romance sobre uma mulher que usa sua riqueza para conquistar seu amor.', 'Romance', 4, 256),
('O Primo Basílio', 'Eça de Queirós', 'https://covers.openlibrary.org/b/id/240735-L.jpg', 'Um romance sobre traição e as consequências de um envolvimento extraconjugal.', 'Realismo', 4, 256),
('Ensaio sobre a Cegueira', 'José Saramago', 'https://covers.openlibrary.org/b/id/240744-L.jpg', 'Uma epidemia misteriosa de cegueira muda a vida de um país.', 'Ficção', 5, 344),
('Cem Anos de Solidão', 'Gabriel García Márquez', 'https://covers.openlibrary.org/b/id/8252387-L.jpg', 'A saga familiar de Macondo com elementos de realismo mágico.', 'Realismo Mágico', 5, 417),
('Crime e Castigo', 'Fiódor Dostoiévski', 'https://covers.openlibrary.org/b/id/8226456-L.jpg', 'A história de um crime e a culpa que consome o criminoso.', 'Clássico', 5, 685),
('Orgulho e Preconceito', 'Jane Austen', 'https://covers.openlibrary.org/b/id/13298758-L.jpg', 'Um romance sobre amor, família e preconceitos sociais na Inglaterra.', 'Romance', 5, 279),
('O Senhor dos Anéis', 'J.R.R. Tolkien', 'https://covers.openlibrary.org/b/id/13287771-L.jpg', 'A épica jornada de um hobbit para destruir um anel mágico.', 'Fantasia', 5, 1178),
('Hamlet', 'William Shakespeare', 'https://covers.openlibrary.org/b/id/8232331-L.jpg', 'A tragédia de um príncipe que busca vingança pela morte de seu pai.', 'Teatro', 5, 320),
('A Divina Comédia', 'Dante Alighieri', 'https://covers.openlibrary.org/b/id/8232106-L.jpg', 'Uma jornada através do Inferno, Purgatório e Paraíso.', 'Poesia', 5, 480),
('Guerra e Paz', 'Liev Tolstói', 'https://covers.openlibrary.org/b/id/8232075-L.jpg', 'Um romance épico sobre a vida durante as Guerras Napoleônicas.', 'Clássico', 5, 1296),
('Ulisses', 'James Joyce', 'https://covers.openlibrary.org/b/id/8232469-L.jpg', 'Uma odisseia moderna sobre um dia na vida de um homem em Dublin.', 'Modernismo', 5, 783),
('Torto Arado', 'Itamar Vieira Junior', 'https://covers.openlibrary.org/b/id/13048931-L.jpg', 'A história de duas irmãs que desvendam segredos do passado familiar.', 'Romance', 4, 344),
('A Vida Invisível de Eurídice Gusmão', 'Martha Batalha', 'https://covers.openlibrary.org/b/id/12686569-L.jpg', 'A história de duas mulheres cujas vidas se cruzam em São Paulo.', 'Romance', 4, 280);
