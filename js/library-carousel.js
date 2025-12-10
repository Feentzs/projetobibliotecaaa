// ===== CARROSSÉIS DE BIBLIOTECA =====

let favoritedBooks = [];
let reservedBooks = [];

// Inicializar carrosséis quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
  loadLibraryCarousels();
  setupCarouselControls();
});

// Carregamento dos dados de favoritos e reservados
async function loadLibraryCarousels() {
  try {
    const token = localStorage.getItem('bibliotec_token');
    
    if (!token) {
      showCarouselEmpty('favoritesCarousel', 'Faça login para ver seus livros favoritados');
      showCarouselEmpty('reservedCarousel', 'Faça login para ver seus livros reservados');
      return;
    }

    // Carregar biblioteca do usuário
    const userLibrary = await api.getUserLibrary();
    
    if (!userLibrary || userLibrary.length === 0) {
      showCarouselEmpty('favoritesCarousel', 'Você ainda não favoritou nenhum livro');
      showCarouselEmpty('reservedCarousel', 'Você ainda não reservou nenhum livro');
      return;
    }

    // Separar favoritos e reservados
    favoritedBooks = userLibrary.filter(book => book.is_favorite === true || book.is_favorite === 1);
    reservedBooks = userLibrary.filter(book => book.status === 'reserved' || book.is_reserved === true);

    // Renderizar carrosséis
    renderCarousel('favoritesCarousel', 'favoritesTrack', favoritedBooks, 'Você ainda não favoritou nenhum livro');
    renderCarousel('reservedCarousel', 'reservedTrack', reservedBooks, 'Você ainda não reservou nenhum livro');

  } catch (error) {
    console.error('Erro ao carregar carrosséis:', error);
    showCarouselEmpty('favoritesCarousel', 'Erro ao carregar livros favoritados');
    showCarouselEmpty('reservedCarousel', 'Erro ao carregar livros reservados');
  }
}

// Renderizar carrossel com livros
function renderCarousel(carouselId, trackId, books, emptyMessage) {
  const track = document.getElementById(trackId);
  
  if (!track) {
    console.error(`Elemento ${trackId} não encontrado`);
    return;
  }

  if (!books || books.length === 0) {
    showCarouselEmpty(carouselId, emptyMessage);
    return;
  }

  // Limpar conteúdo anterior
  track.innerHTML = '';

  // Criar cards
  books.forEach(book => {
    const card = createCarouselCard(book);
    track.appendChild(card);
  });

  // Atualizar botões de controle
  updateCarouselButtons(trackId, books.length);
}

// Criar card do carrossel
function createCarouselCard(book) {
  const card = document.createElement('div');
  card.className = 'carousel-card';
  card.style.cursor = 'pointer';

  const rating = parseFloat(book.rating) || 0;
  const ratingDisplay = rating.toFixed(1).replace('.', ',');

  card.innerHTML = `
    <img src="${book.cover_url || book.cover}" alt="${book.title}" loading="lazy" />
    <div class="carousel-card-body">
      <h3 class="carousel-card-title">${book.title}</h3>
      <p class="carousel-card-author">${book.author}</p>
      <div class="carousel-card-meta">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 2.5l2.76 5.59 6.16.9-4.46 4.35 1.05 6.12L12 17.77 6.49 19.46l1.05-6.12L3.08 8.99l6.16-.9L12 2.5z" fill="#2FD6CB"/>
        </svg>
        <span>${ratingDisplay}</span>
      </div>
    </div>
  `;

  // Navegar para a página do livro
  card.addEventListener('click', function() {
    window.location.href = `livro.html?id=${book.id}`;
  });

  return card;
}

// Mostrar mensagem de carrossel vazio
function showCarouselEmpty(carouselId, message) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  carousel.innerHTML = `<div class="carousel-empty">${message}</div>`;
}

// Configurar controles do carrossel
function setupCarouselControls() {
  // Favoritos
  const favPrevBtn = document.getElementById('favorites-prev');
  const favNextBtn = document.getElementById('favorites-next');
  if (favPrevBtn && favNextBtn) {
    favPrevBtn.addEventListener('click', () => scrollCarousel('favoritesTrack', -1));
    favNextBtn.addEventListener('click', () => scrollCarousel('favoritesTrack', 1));
  }

  // Reservados
  const resPrevBtn = document.getElementById('reserved-prev');
  const resNextBtn = document.getElementById('reserved-next');
  if (resPrevBtn && resNextBtn) {
    resPrevBtn.addEventListener('click', () => scrollCarousel('reservedTrack', -1));
    resNextBtn.addEventListener('click', () => scrollCarousel('reservedTrack', 1));
  }
}

// Rolar carrossel
function scrollCarousel(trackId, direction) {
  const track = document.getElementById(trackId);
  if (!track) return;

  const scrollAmount = 240; // Largura do card + gap
  const currentScroll = track.parentElement.scrollLeft || 0;
  const newScroll = currentScroll + (scrollAmount * direction);

  track.parentElement.scrollTo({
    left: newScroll,
    behavior: 'smooth'
  });

  // Atualizar status dos botões após scroll
  setTimeout(() => {
    updateCarouselButtons(trackId, track.children.length);
  }, 350);
}

// Atualizar estado dos botões de navegação
function updateCarouselButtons(trackId, totalCards) {
  const carousel = document.getElementById(trackId).parentElement;
  
  if (!carousel) return;

  const scrollLeft = carousel.scrollLeft;
  const scrollWidth = carousel.scrollWidth;
  const clientWidth = carousel.clientWidth;

  // Identificar qual carrossel é
  const isPrev = trackId.includes('favorites') ? 'favorites-prev' : 'reserved-prev';
  const isNext = trackId.includes('favorites') ? 'favorites-next' : 'reserved-next';

  const prevBtn = document.getElementById(isPrev);
  const nextBtn = document.getElementById(isNext);

  if (prevBtn) {
    prevBtn.disabled = scrollLeft <= 0;
  }

  if (nextBtn) {
    nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 10;
  }
}

// Listener para resize e scroll do carrossel
window.addEventListener('resize', () => {
  updateCarouselButtons('favoritesTrack', favoritedBooks.length);
  updateCarouselButtons('reservedTrack', reservedBooks.length);
});

document.addEventListener('scroll', function() {
  const favTrack = document.getElementById('favoritesTrack');
  const resTrack = document.getElementById('reservedTrack');
  
  if (favTrack) {
    updateCarouselButtons('favoritesTrack', favoritedBooks.length);
  }
  if (resTrack) {
    updateCarouselButtons('reservedTrack', reservedBooks.length);
  }
});
