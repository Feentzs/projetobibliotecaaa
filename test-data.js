// Script para criar dados de teste no localStorage
const testBooks = [
  {
    id: 1,
    title: "1984",
    author: "George Orwell",
    genre: "Ficção Científica",
    rating: 4.8,
    pages: 328,
    cover_url: "https://images-na.ssl-images-amazon.com/images/P/B003JTHWKU.01.L.jpg",
    description: "Um clássico da ficção científica que retrata um futuro distópico."
  },
  {
    id: 2,
    title: "O Senhor dos Anéis",
    author: "J.R.R. Tolkien",
    genre: "Fantasia",
    rating: 4.9,
    pages: 1178,
    cover_url: "https://images-na.ssl-images-amazon.com/images/P/B008EGQVIQ.01.L.jpg",
    description: "Uma épica fantasia sobre a jornada para destruir um anel mágico poderoso."
  },
  {
    id: 3,
    title: "Dom Casmurro",
    author: "Machado de Assis",
    genre: "Romance",
    rating: 4.5,
    pages: 256,
    cover_url: "https://images-na.ssl-images-amazon.com/images/P/B00EZ0ZN4W.01.L.jpg",
    description: "Um clássico da literatura brasileira sobre amor e traição."
  },
  {
    id: 4,
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasia",
    rating: 4.7,
    pages: 310,
    cover_url: "https://images-na.ssl-images-amazon.com/images/P/B003G4W49C.01.L.jpg",
    description: "As aventuras de um pequeno hobbit em busca de um tesouro."
  },
  {
    id: 5,
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    genre: "Realismo Mágico",
    rating: 4.6,
    pages: 417,
    cover_url: "https://images-na.ssl-images-amazon.com/images/P/B00EDDUGIC.01.L.jpg",
    description: "Uma saga familiar em um vilarejo isolado na América Latina."
  },
  {
    id: 6,
    title: "Orgulho e Preconceito",
    author: "Jane Austen",
    genre: "Romance",
    rating: 4.5,
    pages: 279,
    cover_url: "https://images-na.ssl-images-amazon.com/images/P/B00AER6D7G.01.L.jpg",
    description: "Uma história de romance e autoconhecimento na era Georgiana."
  }
];

const testUsers = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@example.com",
    active: true,
    created_at: new Date(2024, 0, 15).toISOString()
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@example.com",
    active: true,
    created_at: new Date(2024, 1, 20).toISOString()
  },
  {
    id: 3,
    name: "Pedro Oliveira",
    email: "pedro@example.com",
    active: false,
    created_at: new Date(2024, 2, 10).toISOString()
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana@example.com",
    active: true,
    created_at: new Date(2024, 3, 5).toISOString()
  }
];

const testReservations = [
  {
    id: 1,
    user_id: 1,
    book_id: 1,
    status: "reserved",
    reserve_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    user_id: 2,
    book_id: 2,
    status: "ready",
    reserve_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    user_id: 1,
    book_id: 3,
    status: "completed",
    reserve_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    user_id: 3,
    book_id: 4,
    status: "reserved",
    reserve_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    user_id: 4,
    book_id: 5,
    status: "reserved",
    reserve_date: new Date().toISOString()
  }
];

// Função para salvar dados de teste
function createTestData() {
  // Salvar livros
  const booksData = {};
  testBooks.forEach(book => {
    if (!booksData.recommended) booksData.recommended = [];
    booksData.recommended.push(book);
  });
  localStorage.setItem('biblioTecBooks', JSON.stringify(booksData));
  console.log('[OK] Livros de teste salvos', testBooks.length);

  // Salvar usuários (simulado)
  localStorage.setItem('testUsers', JSON.stringify(testUsers));
  console.log('[OK] Usuários de teste salvos', testUsers.length);

  // Salvar reservas
  localStorage.setItem('testReservations', JSON.stringify(testReservations));
  console.log('[OK] Reservas de teste salvas', testReservations.length);

  // Salvar dados do usuário logado
  localStorage.setItem('userData', JSON.stringify({
    id: 1,
    name: "Admin",
    email: "admin@example.com"
  }));
  console.log('[OK] Dados do usuário logado salvos');

  alert('[OK] Dados de teste criados com sucesso!\n\nVocê pode agora visualizar:\n- Livros na aba "Livros"\n- Usuários na aba "Usuários"\n- Reservas na aba "Reservas"');
}

// Executar quando chamado
if (typeof window !== 'undefined') {
  window.createTestData = createTestData;
  console.log('[INFO] Para criar dados de teste, execute: createTestData()');
}
