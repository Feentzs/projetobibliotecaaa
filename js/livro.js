// ===== FUNCIONALIDADES DA PÁGINA DO LIVRO =====

// Dados dos livros relacionados
const relatedBooks = [
  { id: "1", title: "Ayrton Senna: Uma Lenda a Toda Velocidade", author: "Christopher Hilton", cover: "https://covers.openlibrary.org/b/id/11686911-L.jpg", rating: 4.5, genre: 'Biografia' },
  { id: "2", title: "A Morte de Ayrton Senna", author: "Richard Williams", cover: "https://covers.openlibrary.org/b/id/13491181-L.jpg", rating: 4.2, genre: 'Biografia' },
  { id: "3", title: "Minha Garota", author: "Adriane Yamin", cover: "https://covers.openlibrary.org/b/id/13141106-L.jpg", rating: 4.0, genre: 'Memórias' },
  { id: "4", title: "Senna: O Piloto", author: "Tom Rubython", cover: "https://covers.openlibrary.org/b/id/12628263-L.jpg", rating: 4.7, genre: 'Biografia' },
  { id: "5", title: "Ayrton Senna: O Herói", author: "Reginaldo Leme", cover: "https://covers.openlibrary.org/b/id/11686911-L.jpg", rating: 4.3, genre: 'Biografia' }
];

document.addEventListener('DOMContentLoaded', function() {
  initBookPage();
});

function initBookPage() {
  loadBookFromURL();
  renderRelatedBooks();
  wireRelatedCarousel();
  initFavoriteButton();
}

// ===== CARREGAR LIVRO DA URL =====
function loadBookFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');
  
  if (bookId) {
    // Primeiro tentar carregar do localStorage
    const stored = localStorage.getItem('biblioTecBooks');
    let book = null;
    
    if (stored) {
      try {
        const booksData = JSON.parse(stored);
        // Buscar em todos os carrosséis
        for (const carousel in booksData) {
          book = booksData[carousel].find(b => b.id === bookId);
          if (book) break;
        }
      } catch (e) {
        console.error('Erro ao carregar do localStorage:', e);
      }
    }
    
    // Se não encontrar no localStorage, buscar nos arrays padrão
    if (!book) {
      const allBooks = [...recommended, ...library, ...topRated, ...newReleases, ...popularNow];
      book = allBooks.find(b => b.id === bookId);
    }
    
    if (book) {
      updateBookPage(book);
    } else {
      // Se não encontrar, usar o livro padrão
      console.log('Livro não encontrado, usando padrão');
    }
  }
}

// ===== ATUALIZAR PÁGINA COM DADOS DO LIVRO =====
function updateBookPage(book) {
  // Atualizar título da página
  document.title = `${book.title} - BiblioTec`;
  
  // Atualizar capa
  const coverImg = document.querySelector('.cover-image');
  if (coverImg) {
    coverImg.src = book.cover;
    coverImg.alt = `Capa do livro ${book.title}`;
  }
  
  // Atualizar informações do livro
  const authorSpan = document.querySelector('.author');
  if (authorSpan) {
    authorSpan.textContent = book.author;
  }
  
  const titleH1 = document.querySelector('.book-title');
  if (titleH1) {
    titleH1.textContent = book.title;
  }
  
  // Atualizar badge de gênero
  const genreBadge = document.querySelector('.book-tags .badge');
  if (genreBadge && book.genre) {
    genreBadge.textContent = book.genre;
  }
  
  // Atualizar rating
  const ratingSpan = document.getElementById('ratingSpan');
  if (ratingSpan) {
    ratingSpan.textContent = book.rating?.toFixed(1).replace('.', ',') || '0,0';
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
  
  // Atualizar botão de favoritos
  const favBtn = document.querySelector('.btn.fav');
  if (favBtn) {
    favBtn.setAttribute('data-id', book.id);
  }
  
  // Atualizar botão de leitura
  const readBtn = document.getElementById('readBtn');
  const readBtnText = document.getElementById('readBtnText');
  if (readBtn && readBtnText) {
    // Verificar se há progresso salvo no localStorage
    const savedProgress = localStorage.getItem(`bookProgress_${book.id}`);
    const progress = savedProgress ? parseInt(savedProgress) : (book.progress || 0);
    
    // Remover listeners anteriores se existirem
    const newReadBtn = readBtn.cloneNode(true);
    readBtn.parentNode.replaceChild(newReadBtn, readBtn);
    const newReadBtnText = document.getElementById('readBtnText');
    
    if (progress > 0 && book.pages) {
      // Calcular página atual baseada no progresso
      const currentPage = Math.floor((progress / 100) * book.pages) || 1;
      newReadBtnText.textContent = `Continuar na Página ${currentPage}`;
    } else if (progress > 0) {
      newReadBtnText.textContent = 'Continuar lendo';
    } else {
      newReadBtnText.textContent = 'Ler agora';
    }
    
    // Adicionar event listener para salvar progresso
    newReadBtn.addEventListener('click', () => {
      if (book.pdf) {
        // Redirecionar para o visualizador de PDF
        window.location.href = `pdf-viewer.html?id=${book.id}`;
      } else {
        alert('PDF não disponível para este livro.');
      }
    });
  }
}

// ===== RENDERIZAR LIVROS RELACIONADOS =====
function renderRelatedBooks() {
  const carousel = document.getElementById('relatedCarousel');
  if (!carousel) return;
  
  carousel.innerHTML = '';
  relatedBooks.forEach(book => {
    carousel.appendChild(createCard(book));
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
  
  // Usar a mesma função de comportamento do carrossel da home
  wireCarouselBehavior(carousel, () => { tagEdgeCardsGeneric(carousel); });
  wireCarouselWithNavVisibility(carousel, prevButton, nextButton, () => { tagEdgeCardsGeneric(carousel); });
}

// ===== BOTÃO DE FAVORITOS =====
function initFavoriteButton() {
  const favoriteBtn = document.querySelector('.btn.fav');
  
  if (favoriteBtn) {
    favoriteBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      
      // Atualizar o ícone
      const svg = this.querySelector('svg');
      if (this.classList.contains('active')) {
        svg.innerHTML = '<path d="M12 2.5l2.76 5.59 6.16.9-4.46 4.35 1.05 6.12L12 17.77 6.49 19.46l1.05-6.12L3.08 8.99l6.16-.9L12 2.5z" fill="currentColor"/>';
      } else {
        svg.innerHTML = '<path d="M12 4.8l1.76 3.57 3.94.57-2.85 2.78.67 3.92L12 13.9l-3.52 1.86.67-3.92L6.3 8.94l3.94-.57L12 4.8z" stroke="currentColor" stroke-width="1.2" fill="none"/>';
      }
      
      // Feedback visual
      this.style.transform = 'scale(1.1)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  }
}
