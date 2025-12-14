// ===== CARROSSÉIS DE BIBLIOTECA =====

let favoritedBooks = [];
let reservedBooks = [];

// Inicializar carrosséis quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
  loadLibraryCarousels();
  setupCarouselControls();
  
  // Verificar e atualizar imagens dos estados vazios
  checkAndShowEmptyStates();
  updateEmptyStateImages();
  
  // Observar mudanças de tema
  const darkModeStyle = document.getElementById('dark-mode-style');
  if (darkModeStyle) {
    const observer = new MutationObserver(updateEmptyStateImages);
    observer.observe(darkModeStyle, { attributes: true, attributeFilter: ['disabled'] });
  }
});

// Carregamento dos dados de favoritos e reservados
async function loadLibraryCarousels() {
  try {
    const token = localStorage.getItem('bibliotec_token');
    
    if (!token) {
      showEmptyState('favorites', 'Faça login para ver seus livros favoritados');
      showEmptyState('reserved', 'Faça login para ver seus livros reservados');
      return;
    }

    // Carregar biblioteca do usuário
    const userLibrary = await api.getUserLibrary();
    
    if (!userLibrary || userLibrary.length === 0) {
      showEmptyState('favorites', 'Você ainda não favoritou nenhum livro');
      showEmptyState('reserved', 'Você ainda não reservou nenhum livro');
      return;
    }

    // Separar favoritos e reservados
    favoritedBooks = userLibrary.filter(book => book.is_favorite === true || book.is_favorite === 1);
    reservedBooks = userLibrary.filter(book => book.status === 'reserved' || book.is_reserved === true);

    // Renderizar carrosséis
    renderCarousel('favoritesCarousel', 'favoritesTrack', favoritedBooks, 'favorites');
    renderCarousel('reservedCarousel', 'reservedTrack', reservedBooks, 'reserved');

  } catch (error) {
    console.error('Erro ao carregar carrosséis:', error);
    showEmptyState('favorites', 'Erro ao carregar livros favoritados');
    showEmptyState('reserved', 'Erro ao carregar livros reservados');
  }
  
  // Verificar estados vazios após carregamento
  checkAndShowEmptyStates();
}

// Renderizar carrossel com livros
function renderCarousel(carouselId, trackId, books, type) {
  const carousel = document.getElementById(carouselId);
  const track = document.getElementById(trackId);
  const emptyState = document.getElementById(`${type}-empty`);
  
  if (!track || !carousel) {
    console.error(`Elementos não encontrados: ${carouselId}, ${trackId}`);
    return;
  }

  if (!books || books.length === 0) {
    if (emptyState) emptyState.style.display = 'flex';
    carousel.style.display = 'none';
    return;
  }

  // Mostrar carrossel e ocultar estado vazio
  if (emptyState) emptyState.style.display = 'none';
  carousel.style.display = 'block';
  
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
    <img src="${book.cover_url || book.cover || 'images/default-cover.jpg'}" alt="${book.title}" loading="lazy" />
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

// Mostrar estado vazio com imagem
function showEmptyState(type, message) {
  const emptyState = document.getElementById(`${type}-empty`);
  const carousel = document.getElementById(`${type}Carousel`);
  const title = document.getElementById(`${type}-empty-title`);
  const subtitle = document.getElementById(`${type}-empty-subtitle`);
  
  if (emptyState) {
    // Atualizar mensagens
    if (title) title.textContent = message;
    if (subtitle) subtitle.textContent = getEmptyStateSubtitle(type);
    
    // Mostrar estado vazio e ocultar carrossel
    emptyState.style.display = 'flex';
    
    if (carousel) {
      carousel.style.display = 'none';
    }
  }
}

// Obter subtítulo apropriado para o estado vazio
function getEmptyStateSubtitle(type) {
  switch(type) {
    case 'favorites':
      return 'Explore a biblioteca e adicione seus livros favoritos!';
    case 'reserved':
      return 'Explore a biblioteca e reserve seus livros favoritos!';
    default:
      return '';
  }
}

// ===== GERENCIAMENTO DE ESTADOS VAZIOS =====

function checkAndShowEmptyStates() {
  // Verificar livros favoritados
  const favoritesTrack = document.getElementById('favoritesTrack');
  const favoritesEmpty = document.getElementById('favorites-empty');
  const favoritesCarousel = document.getElementById('favoritesCarousel');
  
  const hasFavorites = favoritesTrack && favoritesTrack.children.length > 0;
  
  if (favoritesEmpty && favoritesCarousel) {
    if (hasFavorites) {
      favoritesEmpty.style.display = 'none';
      favoritesCarousel.style.display = 'block';
    } else {
      favoritesEmpty.style.display = 'flex';
      favoritesCarousel.style.display = 'none';
    }
  }
  
  // Verificar livros reservados
  const reservedTrack = document.getElementById('reservedTrack');
  const reservedEmpty = document.getElementById('reserved-empty');
  const reservedCarousel = document.getElementById('reservedCarousel');
  
  const hasReserved = reservedTrack && reservedTrack.children.length > 0;
  
  if (reservedEmpty && reservedCarousel) {
    if (hasReserved) {
      reservedEmpty.style.display = 'none';
      reservedCarousel.style.display = 'block';
    } else {
      reservedEmpty.style.display = 'flex';
      reservedCarousel.style.display = 'none';
    }
  }
}

// ===== ATUALIZAÇÃO DE IMAGENS POR TEMA =====

function updateEmptyStateImages() {
  const darkModeStyle = document.getElementById('dark-mode-style');
  const isDarkMode = darkModeStyle && !darkModeStyle.disabled;
  
  const emptyStateImages = document.querySelectorAll('.empty-state-image');
  
  emptyStateImages.forEach(img => {
    const lightSrc = img.getAttribute('data-light');
    const darkSrc = img.getAttribute('data-dark');
    
    if (isDarkMode && darkSrc) {
      img.src = darkSrc;
    } else if (lightSrc) {
      img.src = lightSrc;
    }
  });
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

  const carousel = track.parentElement;
  const scrollAmount = 240; // Largura do card + gap
  const currentScroll = carousel.scrollLeft || 0;
  const newScroll = currentScroll + (scrollAmount * direction);

  carousel.scrollTo({
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
    prevBtn.style.opacity = scrollLeft <= 0 ? '0.5' : '1';
  }

  if (nextBtn) {
    nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 10;
    nextBtn.style.opacity = scrollLeft >= scrollWidth - clientWidth - 10 ? '0.5' : '1';
  }
}

// Listener para resize e scroll do carrossel
window.addEventListener('resize', () => {
  updateCarouselButtons('favoritesTrack', favoritedBooks.length);
  updateCarouselButtons('reservedTrack', reservedBooks.length);
});

// Atualizar botões durante o scroll
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

// Adicionar event listeners para scroll nos carrosséis
['favoritesCarousel', 'reservedCarousel'].forEach(carouselId => {
  const carousel = document.getElementById(carouselId);
  if (carousel) {
    carousel.addEventListener('scroll', function() {
      const trackId = carouselId === 'favoritesCarousel' ? 'favoritesTrack' : 'reservedTrack';
      const books = carouselId === 'favoritesCarousel' ? favoritedBooks : reservedBooks;
      updateCarouselButtons(trackId, books.length);
    });
  }
});

// ===== ATUALIZAÇÃO EM TEMPO REAL =====

// Função para recarregar carrosséis (pode ser chamada de outros scripts)
window.reloadLibraryCarousels = async function() {
  await loadLibraryCarousels();
  checkAndShowEmptyStates();
  updateEmptyStateImages();
};

// Listener para eventos de atualização
window.addEventListener('booksUpdated', async () => {
  console.log('Livros atualizados, recarregando carrosséis...');
  await reloadLibraryCarousels();
});

// Listener para mudanças de tema do sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  updateEmptyStateImages();
});