// ===== GERENCIAMENTO DE LIVROS COM API =====

let allBooks = [];
let editingBookId = null;
let isInitialized = false;

const modal = document.getElementById('bookModal');
const form = document.getElementById('bookForm');
const btnAdd = document.getElementById('btnAddBook');
const btnClose = document.getElementById('closeModal');
const btnCancel = document.getElementById('cancelForm');
const booksGrid = document.getElementById('booksGrid');
const searchInput = document.getElementById('searchBooks');
const filterSelect = document.getElementById('filterCarousel');
const progressGroup = document.getElementById('progressGroup');

// ===== EVENTOS =====
btnAdd.addEventListener('click', () => openModal());
btnClose.addEventListener('click', closeModal);
btnCancel.addEventListener('click', closeModal);
form.addEventListener('submit', handleSubmit);
searchInput.addEventListener('input', renderBooks);
filterSelect.addEventListener('change', renderBooks);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// ===== FUNÇÕES MODAIS =====
function openModal(bookId = null) {
  editingBookId = bookId;
  const modalTitle = document.getElementById('modalTitle');

  if (bookId) {
    modalTitle.textContent = 'Editar Livro';
    const book = allBooks.find(b => b.id == bookId);
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
}

// ===== GERENCIAMENTO DE LIVROS =====
async function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData(form);

  const bookData = {
    title: formData.get('title'),
    author: formData.get('author'),
    cover: formData.get('cover'),
    pdf: formData.get('pdf') || '',
    description: formData.get('description') || '',
    genre: formData.get('genre'),
    rating: parseFloat(formData.get('rating')) || 4,
    pages: formData.get('pages') ? parseInt(formData.get('pages')) : undefined
  };

  try {
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = editingBookId ? 'Atualizando...' : 'Adicionando...';

    if (editingBookId) {
      // Atualizar livro
      await api.updateBook(editingBookId, bookData);
      alert('Livro atualizado com sucesso!');
    } else {
      // Adicionar novo livro
      await api.addBook(bookData);
      alert('Livro adicionado com sucesso!');
    }

    closeModal();
    await loadBooksFromAPI();
    renderBooks();

    // Disparar evento para atualizar outras páginas
    window.dispatchEvent(new CustomEvent('booksUpdated'));

  } catch (error) {
    alert('Erro: ' + error.message);
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.textContent = editingBookId ? 'Atualizar' : 'Adicionar';
  }
}

async function deleteBook(bookId) {
  if (!confirm('Tem certeza que deseja excluir este livro?')) return;

  try {
    await api.deleteBook(bookId);
    alert('Livro excluído com sucesso!');
    await loadBooksFromAPI();
    renderBooks();

    // Disparar evento para atualizar outras páginas
    window.dispatchEvent(new CustomEvent('booksUpdated'));
  } catch (error) {
    alert('Erro ao excluir: ' + error.message);
  }
}

async function editBook(bookId) {
  openModal(bookId);
}

// Funções globais para inline handlers
window.editBook = editBook;
window.deleteBook = deleteBook;

// ===== CARREGAMENTO DE DADOS =====
async function loadBooksFromAPI() {
  try {
    console.log('Carregando livros do backend...');
    allBooks = await api.getBooks();
    console.log('Livros carregados:', allBooks.length);
    return allBooks;
  } catch (error) {
    console.error('Erro ao carregar livros:', error);
    allBooks = [];
    alert('Erro ao carregar livros. Verifique sua conexão.');
    return [];
  }
}

// ===== RENDERIZAÇÃO =====
function renderBooks() {
  const searchTerm = searchInput.value.toLowerCase();
  const filterCarousel = filterSelect.value;

  let booksToShow = allBooks;

  // Filtrar por busca
  if (searchTerm) {
    booksToShow = booksToShow.filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
    );
  }

  if (booksToShow.length === 0) {
    booksGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" stroke-width="1.6"/>
        </svg>
        <h3>Nenhum livro encontrado</h3>
        <p>${searchTerm ? 'Tente ajustar os filtros' : 'Nenhum livro no banco de dados'}</p>
      </div>
    `;
    return;
  }

  booksGrid.innerHTML = booksToShow.map(book => `
    <div class="book-card-admin">
      <img src="${book.cover}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/200x300?text=Sem+Imagem'">
      <div class="book-card-body">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <div class="book-card-meta">
          <span>⭐ ${book.rating ? book.rating.toFixed(1).replace('.', ',') : '0,0'}</span>
          <span>${book.genre || 'Sem categoria'}</span>
          ${book.pages ? `<span>${book.pages} págs</span>` : ''}
        </div>
        <div class="book-card-actions">
          <button class="btn-edit" onclick="editBook('${book.id}')">Editar</button>
          <button class="btn-delete" onclick="deleteBook('${book.id}')">Excluir</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', async () => {
  // Verificar autenticação
  const token = localStorage.getItem('bibliotec_token');
  if (!token) {
    alert('Você precisa estar autenticado para acessar esta página');
    window.location.href = 'login.html';
    return;
  }

  // Carregando indicador
  booksGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;">Carregando livros...</div>';

  // Carregar livros
  await loadBooksFromAPI();

  isInitialized = true;
  renderBooks();
});
