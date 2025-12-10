// ===== FUNCIONALIDADES DA PÁGINA DO LIVRO =====

let currentBook = null;
let userFavorites = [];

// Dados dos livros relacionados
const relatedBooks = [
  { id: "1", title: "Ayrton Senna: Uma Lenda a Toda Velocidade", author: "Christopher Hilton", cover: "https://covers.openlibrary.org/b/id/11686911-L.jpg", rating: 4.5, genre: 'Biografia' },
  { id: "2", title: "A Morte de Ayrton Senna", author: "Richard Williams", cover: "https://covers.openlibrary.org/b/id/13491181-L.jpg", rating: 4.2, genre: 'Biografia' },
  { id: "3", title: "Minha Garota", author: "Adriane Yamin", cover: "https://covers.openlibrary.org/b/id/13141106-L.jpg", rating: 4.0, genre: 'Memórias' },
  { id: "4", title: "Senna: O Piloto", author: "Tom Rubython", cover: "https://covers.openlibrary.org/b/id/12628263-L.jpg", rating: 4.7, genre: 'Biografia' },
  { id: "5", title: "Ayrton Senna: O Herói", author: "Reginaldo Leme", cover: "https://covers.openlibrary.org/b/id/11686911-L.jpg", rating: 4.3, genre: 'Biografia' }
];

document.addEventListener('DOMContentLoaded', async function() {
  // Carregar dados da API primeiro
  await loadBooksFromAPI();
  await loadUserLibraryFromAPI();
  
  // Depois inicializar a página
  initBookPage();
});

async function initBookPage() {
  await loadBookFromURL();
  renderRelatedBooks();
  wireRelatedCarousel();
  initFavoriteButton();
}

// ===== CARREGAR LIVRO DA URL =====
async function loadBookFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');
  
  if (!bookId) {
    console.warn('Nenhum ID de livro encontrado na URL');
    return;
  }
  
  let book = null;
  
  // Tentar carregar da API primeiro
  try {
    // Buscar em todos os arrays carregados da API
    if (recommended && recommended.length > 0) {
      book = recommended.find(b => b.id == bookId);
    }
    if (!book && topRated && topRated.length > 0) {
      book = topRated.find(b => b.id == bookId);
    }
    if (!book && newReleases && newReleases.length > 0) {
      book = newReleases.find(b => b.id == bookId);
    }
    if (!book && popularNow && popularNow.length > 0) {
      book = popularNow.find(b => b.id == bookId);
    }
    if (!book && library && library.length > 0) {
      book = library.find(b => b.id == bookId);
    }
  } catch (e) {
    console.error('Erro ao buscar nos arrays da API:', e);
  }
  
  // Se não encontrar, tentar carregar do localStorage
  if (!book) {
    try {
      const stored = localStorage.getItem('biblioTecBooks');
      if (stored) {
        const booksData = JSON.parse(stored);
        for (const carousel in booksData) {
          book = booksData[carousel].find(b => b.id == bookId);
          if (book) break;
        }
      }
    } catch (e) {
      console.error('Erro ao carregar do localStorage:', e);
    }
  }
  
  if (book) {
    currentBook = book;
    updateBookPage(book);
  } else {
    console.warn('Livro não encontrado com ID:', bookId);
    document.querySelector('.book-title').textContent = 'Livro não encontrado';
  }
}

// ===== ATUALIZAR PÁGINA COM DADOS DO LIVRO =====
function updateBookPage(book) {
  if (!book) return;
  
  // Atualizar título da página
  document.title = `${book.title} - BiblioTec`;
  
  // Atualizar capa
  const coverImg = document.querySelector('.cover-image');
  if (coverImg) {
    coverImg.src = book.cover_url || book.cover;
    coverImg.alt = `Capa do livro ${book.title}`;
  }
  
  // Atualizar informações do livro
  const authorSpan = document.querySelector('.author');
  if (authorSpan) {
    authorSpan.textContent = book.author || 'Autor desconhecido';
  }
  
  const titleH1 = document.querySelector('.book-title');
  if (titleH1) {
    titleH1.textContent = book.title;
  }
  
  // Atualizar badge de gênero
  const genreBadge = document.querySelector('.book-tags .badge');
  if (genreBadge) {
    if (book.genre) {
      genreBadge.textContent = book.genre;
    } else {
      genreBadge.textContent = 'Geral';
    }
  }
  
  // Atualizar rating
  const ratingSpan = document.getElementById('ratingSpan');
  if (ratingSpan) {
    const rating = parseFloat(book.rating) || 0;
    ratingSpan.textContent = rating.toFixed(1).replace('.', ',');
  }
  
  // Atualizar número de páginas
  const pagesBadge = document.getElementById('pagesBadge');
  if (pagesBadge) {
    if (book.pages) {
      pagesBadge.textContent = `${book.pages} Páginas`;
      pagesBadge.style.display = 'inline-block';
    } else {
      pagesBadge.style.display = 'none';
    }
  }
  
  // Atualizar descrição
  const descText = document.getElementById('bookDescriptionText');
  if (descText) {
    if (book.description) {
      descText.textContent = book.description;
    } else {
      descText.textContent = 'Nenhuma descrição disponível para este livro.';
    }
  }
  
  // Atualizar botão de favoritos com status
  const favBtn = document.querySelector('.btn.fav');
  if (favBtn) {
    favBtn.setAttribute('data-id', book.id);
    
    // Verificar se está nos favoritos
    const isFavorite = userFavorites && userFavorites.some(b => b.id == book.id && (b.is_favorite === true || b.is_favorite === 1));
    
    if (isFavorite) {
      favBtn.classList.add('active');
      const svg = favBtn.querySelector('svg');
      if (svg) {
        svg.innerHTML = '<path d="M12 2.5l2.76 5.59 6.16.9-4.46 4.35 1.05 6.12L12 17.77 6.49 19.46l1.05-6.12L3.08 8.99l6.16-.9L12 2.5z" fill="currentColor"/>';
      }
    }
  }
  
  // Atualizar botão de leitura
  updateReadButton(book);
}

// ===== ATUALIZAR BOTÃO DE LEITURA =====
function updateReadButton(book) {
  const readBtn = document.getElementById('readBtn');
  const readBtnText = document.getElementById('readBtnText');
  
  if (!readBtn || !readBtnText) return;
  
  // Definir texto padrão como "Reservar"
  readBtnText.textContent = 'Reservar';
  
  // Remover listeners anteriores
  const newReadBtn = readBtn.cloneNode(true);
  readBtn.parentNode.replaceChild(newReadBtn, readBtn);
  
  // Adicionar novo listener para reserva
  newReadBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('bibliotec_token');
    if (!token) {
      alert('Por favor, faça login para reservar um livro');
      window.location.href = 'login.html';
      return;
    }
    
    try {
      newReadBtn.disabled = true;
      newReadBtn.textContent = 'Reservando...';
      
      await api.reserveBook(book.id);
      
      alert('Livro reservado com sucesso!');
      newReadBtn.textContent = 'Reservado';
    } catch (error) {
      console.error('Erro ao reservar:', error);
      alert('Erro ao reservar o livro. Tente novamente.');
      newReadBtn.disabled = false;
      newReadBtn.textContent = 'Reservar';
    }
  });
}

// ===== RENDERIZAR LIVROS RELACIONADOS =====
function renderRelatedBooks() {
  const carousel = document.getElementById('relatedCarousel');
  if (!carousel) return;
  
  carousel.innerHTML = '';
  relatedBooks.forEach(book => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-book-id', book.id);
    card.style.cursor = 'pointer';
    
    const rating = parseFloat(book.rating) || 0;
    const ratingDisplay = rating.toFixed(1).replace('.', ',');
    
    card.innerHTML = `
      <img src="${book.cover}" alt="${book.title}" />
      <div class="card-body">
        <div class="meta">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2.5l2.76 5.59 6.16.9-4.46 4.35 1.05 6.12L12 17.77 6.49 19.46l1.05-6.12L3.08 8.99l6.16-.9L12 2.5z" fill="#2FD6CB"/>
          </svg>
          <span>${ratingDisplay}</span>
          <span class="badge">${book.genre || 'Geral'}</span>
        </div>
        <h3 style="margin:8px 0 0;font-size:16px">${book.title}</h3>
        <p style="margin:6px 0 0;color:#64748b">${book.author}</p>
      </div>
    `;
    
    card.addEventListener('click', function() {
      navigateToBook(book.id);
    });
    
    carousel.appendChild(card);
  });
}

// ===== CARROSSEL DE LIVROS RELACIONADOS =====
function wireRelatedCarousel() {
  const carousel = document.getElementById('relatedCarousel');
  if (!carousel) return;
  
  const prevButton = document.getElementById('prevRelated');
  const nextButton = document.getElementById('nextRelated');
  
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      carousel.scrollBy({ left: -260, behavior: 'smooth' });
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      carousel.scrollBy({ left: 260, behavior: 'smooth' });
    });
  }
}

// ===== BOTÃO DE FAVORITOS =====
function initFavoriteButton() {
  const favoriteBtn = document.querySelector('.btn.fav');
  
  if (!favoriteBtn) return;
  
  favoriteBtn.addEventListener('click', async function(e) {
    e.preventDefault();
    
    if (!currentBook) {
      alert('Carregando livro...');
      return;
    }
    
    const token = localStorage.getItem('bibliotec_token');
    if (!token) {
      alert('Por favor, faça login para adicionar aos favoritos');
      window.location.href = 'login.html';
      return;
    }
    
    try {
      const isFavorite = this.classList.contains('active');
      
      if (!isFavorite) {
        // Adicionar aos favoritos
        await api.addToLibrary(currentBook.id);
        this.classList.add('active');
        
        // Atualizar ícone para preenchido
        const svg = this.querySelector('svg');
        if (svg) {
          svg.innerHTML = '<path d="M12 2.5l2.76 5.59 6.16.9-4.46 4.35 1.05 6.12L12 17.77 6.49 19.46l1.05-6.12L3.08 8.99l6.16-.9L12 2.5z" fill="currentColor"/>';
        }
        
        console.log('Livro adicionado aos favoritos');
      } else {
        // Remover dos favoritos
        await api.removeFromLibrary(currentBook.id);
        this.classList.remove('active');
        
        // Atualizar ícone para vazio
        const svg = this.querySelector('svg');
        if (svg) {
          svg.innerHTML = '<path d="M12 4.8l1.76 3.57 3.94.57-2.85 2.78.67 3.92L12 13.9l-3.52 1.86.67-3.92L6.3 8.94l3.94-.57L12 4.8z" stroke="currentColor" stroke-width="1.2" fill="none"/>';
        }
        
        console.log('Livro removido dos favoritos');
      }
      
      // Feedback visual
      this.style.transform = 'scale(1.1)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
      
    } catch (error) {
      console.error('Erro ao alterar status de favorito:', error);
      alert('Erro ao alterar favorito. Tente novamente.');
    }
  });
}

// ===== NAVEGAÇÃO =====
function navigateToBook(bookId) {
  window.location.href = `livro.html?id=${bookId}`;
}

