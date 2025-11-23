// ===== GERENCIAMENTO DE LIVROS =====

// Carregar livros do localStorage ou usar dados padrão
function loadBooks() {
  const stored = localStorage.getItem('biblioTecBooks');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Erro ao carregar livros:', e);
    }
  }
  // Se não houver dados, retornar objeto vazio (usuário pode adicionar livros)
  return {
    recommended: [],
    library: [],
    topRated: [],
    newReleases: [],
    popularNow: []
  };
}

// Salvar livros no localStorage
function saveBooks(books) {
  localStorage.setItem('biblioTecBooks', JSON.stringify(books));
}

// Obter próximo ID disponível
function getNextId(books) {
  let maxId = 0;
  Object.values(books).flat().forEach(book => {
    const id = parseInt(book.id) || 0;
    if (id > maxId) maxId = id;
  });
  return String(maxId + 1);
}

// Inicializar página
let allBooks = loadBooks();
let editingBookId = null;

const modal = document.getElementById('bookModal');
const form = document.getElementById('bookForm');
const btnAdd = document.getElementById('btnAddBook');
const btnClose = document.getElementById('closeModal');
const btnCancel = document.getElementById('cancelForm');
const booksGrid = document.getElementById('booksGrid');
const searchInput = document.getElementById('searchBooks');
const filterSelect = document.getElementById('filterCarousel');
const progressGroup = document.getElementById('progressGroup');

// Event Listeners
btnAdd.addEventListener('click', () => openModal());
btnClose.addEventListener('click', closeModal);
btnCancel.addEventListener('click', closeModal);
form.addEventListener('submit', handleSubmit);
searchInput.addEventListener('input', renderBooks);
filterSelect.addEventListener('change', renderBooks);

// Fechar modal ao clicar fora
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Mostrar/esconder campo de progresso baseado em "library"
document.querySelectorAll('input[name="carousels"]').forEach(cb => {
  cb.addEventListener('change', () => {
    const libraryChecked = document.querySelector('input[name="carousels"][value="library"]').checked;
    progressGroup.style.display = libraryChecked ? 'block' : 'none';
  });
});

function openModal(bookId = null) {
  editingBookId = bookId;
  const modalTitle = document.getElementById('modalTitle');
  
  if (bookId) {
    modalTitle.textContent = 'Editar Livro';
    const book = findBookById(bookId);
    if (book) {
      fillForm(book);
    }
  } else {
    modalTitle.textContent = 'Adicionar Novo Livro';
    form.reset();
    progressGroup.style.display = 'none';
  }
  
  modal.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  form.reset();
  editingBookId = null;
  progressGroup.style.display = 'none';
}

function findBookById(id) {
  for (const carousel in allBooks) {
    const book = allBooks[carousel].find(b => b.id === id);
    if (book) return { ...book, carousel };
  }
  return null;
}

function fillForm(book) {
  document.getElementById('bookId').value = book.id;
  document.getElementById('bookTitle').value = book.title || '';
  document.getElementById('bookAuthor').value = book.author || '';
  document.getElementById('bookCover').value = book.cover || '';
  document.getElementById('bookPdf').value = book.pdf || '';
  document.getElementById('bookDescription').value = book.description || '';
  document.getElementById('bookGenre').value = book.genre || '';
  document.getElementById('bookRating').value = book.rating || 4;
  document.getElementById('bookPages').value = book.pages || '';
  document.getElementById('bookProgress').value = book.progress || 0;
  
  // Marcar checkboxes dos carrosséis
  document.querySelectorAll('input[name="carousels"]').forEach(cb => {
    cb.checked = false;
  });
  
  if (book.carousel) {
    document.querySelector(`input[name="carousels"][value="${book.carousel}"]`).checked = true;
  }
  
  // Se estiver em library, mostrar progresso
  if (book.carousel === 'library' || allBooks.library.some(b => b.id === book.id)) {
    progressGroup.style.display = 'block';
    document.querySelector('input[name="carousels"][value="library"]').checked = true;
  }
}

function handleSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(form);
  const carousels = Array.from(document.querySelectorAll('input[name="carousels"]:checked')).map(cb => cb.value);
  
  if (carousels.length === 0) {
    alert('Selecione pelo menos um carrossel!');
    return;
  }
  
  const bookData = {
    id: editingBookId || getNextId(allBooks),
    title: formData.get('title'),
    author: formData.get('author'),
    cover: formData.get('cover'),
    pdf: formData.get('pdf') || '',
    description: formData.get('description') || '',
    genre: formData.get('genre'),
    rating: parseFloat(formData.get('rating')) || 4,
    pages: formData.get('pages') ? parseInt(formData.get('pages')) : undefined,
    progress: carousels.includes('library') ? parseInt(formData.get('progress') || 0) : undefined
  };
  
  // Remover livro de todos os carrosséis primeiro (se editando)
  if (editingBookId) {
    Object.keys(allBooks).forEach(carousel => {
      allBooks[carousel] = allBooks[carousel].filter(b => b.id !== editingBookId);
    });
  }
  
  // Adicionar aos carrosséis selecionados
  carousels.forEach(carousel => {
    if (!allBooks[carousel]) allBooks[carousel] = [];
    allBooks[carousel].push({ ...bookData });
  });
  
  saveBooks(allBooks);
  renderBooks();
  closeModal();
  
  // Disparar evento customizado para atualizar outras páginas
  window.dispatchEvent(new CustomEvent('booksUpdated'));
  
  alert(editingBookId ? 'Livro atualizado com sucesso!' : 'Livro adicionado com sucesso!');
}

function deleteBook(bookId) {
  if (!confirm('Tem certeza que deseja excluir este livro?')) return;
  
  Object.keys(allBooks).forEach(carousel => {
    allBooks[carousel] = allBooks[carousel].filter(b => b.id !== bookId);
  });
  
  saveBooks(allBooks);
  renderBooks();
  
  // Disparar evento customizado para atualizar outras páginas
  window.dispatchEvent(new CustomEvent('booksUpdated'));
  
  alert('Livro excluído com sucesso!');
}

function renderBooks() {
  const searchTerm = searchInput.value.toLowerCase();
  const filterCarousel = filterSelect.value;
  
  let booksToShow = [];
  
  // Coletar todos os livros únicos
  const allBooksList = [];
  Object.keys(allBooks).forEach(carousel => {
    allBooks[carousel].forEach(book => {
      if (!allBooksList.find(b => b.id === book.id)) {
        allBooksList.push({ ...book, carousels: [carousel] });
      } else {
        const existing = allBooksList.find(b => b.id === book.id);
        if (!existing.carousels.includes(carousel)) {
          existing.carousels.push(carousel);
        }
      }
    });
  });
  
  // Filtrar
  booksToShow = allBooksList.filter(book => {
    const matchesSearch = !searchTerm || 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm);
    
    const matchesFilter = !filterCarousel || book.carousels.includes(filterCarousel);
    
    return matchesSearch && matchesFilter;
  });
  
  if (booksToShow.length === 0) {
    booksGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" stroke-width="1.6"/>
        </svg>
        <h3>Nenhum livro encontrado</h3>
        <p>${searchTerm || filterCarousel ? 'Tente ajustar os filtros' : 'Adicione seu primeiro livro!'}</p>
      </div>
    `;
    return;
  }
  
  booksGrid.innerHTML = booksToShow.map(book => {
    const carouselNames = {
      recommended: 'Recomendados',
      library: 'Continue Lendo',
      topRated: 'Mais Bem Avaliados',
      newReleases: 'Novos Lançamentos',
      popularNow: 'Populares Agora'
    };
    
    return `
      <div class="book-card-admin">
        <img src="${book.cover}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/200x300?text=Sem+Imagem'">
        <div class="book-card-body">
          <h3>${book.title}</h3>
          <p>${book.author}</p>
          <div class="book-card-meta">
            <span>⭐ ${book.rating?.toFixed(1).replace('.', ',') || '0,0'}</span>
            <span>${book.genre || 'Sem categoria'}</span>
            ${book.pages ? `<span>${book.pages} págs</span>` : ''}
            ${book.progress !== undefined ? `<span>${book.progress}% lido</span>` : ''}
          </div>
          <div class="book-card-carousels">
            ${book.carousels.map(c => `<span class="badge">${carouselNames[c] || c}</span>`).join('')}
          </div>
          <div class="book-card-actions">
            <button class="btn-edit" onclick="editBook('${book.id}')">Editar</button>
            <button class="btn-delete" onclick="deleteBook('${book.id}')">Excluir</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function editBook(bookId) {
  openModal(bookId);
}

// Tornar funções globais para uso nos event handlers inline
window.editBook = editBook;
window.deleteBook = deleteBook;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
  renderBooks();
});

