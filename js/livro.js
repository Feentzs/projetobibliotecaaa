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
    // Buscar o livro em todos os arrays
    const allBooks = [...recommended, ...library, ...topRated, ...newReleases, ...popularNow];
    const book = allBooks.find(b => b.id === bookId);
    
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
  if (genreBadge) {
    genreBadge.textContent = book.genre;
  }
  
  // Atualizar rating
  const ratingSpan = document.querySelector('.meta span');
  if (ratingSpan) {
    ratingSpan.textContent = book.rating?.toFixed(1).replace('.', ',') || '0,0';
  }
  
  // Atualizar botão de favoritos
  const favBtn = document.querySelector('.btn.fav');
  if (favBtn) {
    favBtn.setAttribute('data-id', book.id);
  }
  
  // Atualizar progresso se existir
  if (book.progress) {
    const continueBtn = document.querySelector('.continue-btn');
    if (continueBtn) {
      continueBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Continuar na Página ${Math.floor(book.progress * 5.12)}
      `;
    }
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
