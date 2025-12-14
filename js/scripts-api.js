// ===== CARREGAMENTO DINÂMICO DE DADOS DO BACKEND =====

let recommended = [];
let topRated = [];
let newReleases = [];
let popularNow = [];
let allGenres = [];

// Carregar livros do backend
async function loadBooksFromAPI() {
  try {
    console.log('Carregando livros do backend...');
    const books = await api.getBooks();
    
    if (!books || books.length === 0) {
      console.warn('Nenhum livro encontrado no backend');
      recommended = [];
      topRated = [];
      newReleases = [];
      popularNow = [];
      return;
    }

    // Distribuir livros entre as categorias de forma única
    const totalBooks = books.length;
    const sliceSize = Math.floor(totalBooks / 5);
    
    recommended = books.slice(0, sliceSize * 2); // Primeiros 40%
    topRated = books.filter(b => parseFloat(b.rating) >= 4.0).slice(0, sliceSize); // Top rated até 20%
    newReleases = books.slice(sliceSize * 2, sliceSize * 3); // Próximos 20%
    popularNow = books.slice(sliceSize * 3, sliceSize * 4); // Próximos 20%

    // Extrair gêneros únicos
    allGenres = Array.from(new Set(books.map(b => b.genre).filter(Boolean)));

    console.log('Livros carregados:', {
      recommended: recommended.length,
      topRated: topRated.length,
      newReleases: newReleases.length,
      popularNow: popularNow.length,
      genres: allGenres
    });

    return books;
  } catch (error) {
    console.error('Erro ao carregar livros do backend:', error);
    // Não usar fallback - mostrar mensagem de erro
    recommended = [];
    topRated = [];
    newReleases = [];
    popularNow = [];
    return [];
  }
}

// ===== NAVEGAÇÃO PARA PÁGINA DO LIVRO =====
function navigateToBook(bookId) {
  window.location.href = `livro.html?id=${bookId}`;
}

// ===== CRIAR CARD DE LIVRO =====
function createCard(book) {
  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('data-book-id', book.id);
  card.style.cursor = 'pointer';
  
  const rating = parseFloat(book.rating) || 0;
  const ratingDisplay = rating.toFixed(1).replace('.', ',');
  
  card.innerHTML = `
    <img src="${book.cover_url}" alt="${book.title}" />
    <div class="card-body">
      <div class="meta">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2.5l2.76 5.59 6.16.9-4.46 4.35 1.05 6.12L12 17.77 6.49 19.46l1.05-6.12L3.08 8.99l6.16-.9L12 2.5z" fill="#2FD6CB"/>
        </svg>
        <span>${ratingDisplay}</span>
        <span class="badge">${book.genre || ''}</span>
      </div>
      <h3 style="margin:8px 0 0;font-size:16px">${book.title}</h3>
      <p style="margin:6px 0 0;color:#64748b">${book.author}</p>
      ${typeof book.progress === 'number' ? `
        <div style="margin-top:10px">
          <div style="height:8px;background:#f1f5f9;border-radius:999px">
            <div style="height:8px;border-radius:999px;width:${book.progress}%;background:var(--accent)"></div>
          </div>
          <small style="color:#94a3b8">${book.progress}% lido</small>
        </div>
      ` : ''}
      <div class="actions">
        <button class="btn read" title="Reservar este livro">Reservar</button>
        <button class="btn icon fav" aria-pressed="false" title="Favoritar" data-id="${book.id}" data-active="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 4.8l1.76 3.57 3.94.57-2.85 2.78.67 3.92L12 13.9l-3.52 1.86.67-3.92L6.3 8.94l3.94-.57L12 4.8z" stroke="currentColor" stroke-width="1.2" fill="none"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  // Event listener para navegação do card
  card.addEventListener('click', function (e) {
    if (e.target.closest('.btn')) {
      return;
    }
    navigateToBook(book.id);
  });

  // Event listener para o botão "Reservar"
  const readBtn = card.querySelector('.btn.read');
  if (readBtn) {
    readBtn.addEventListener('click', async function (e) {
      e.stopPropagation();
      
      const token = localStorage.getItem('bibliotec_token');
      if (!token) {
        alert('Por favor, faça login para reservar um livro');
        window.location.href = 'login.html';
        return;
      }
      
      try {
        await api.reserveBook(book.id);
        alert('Livro reservado com sucesso!');
        readBtn.disabled = true;
        readBtn.textContent = 'Reservado';
      } catch (error) {
        console.error('Erro ao reservar:', error);
        alert('Erro ao reservar o livro. Tente novamente.');
      }
    });
  }

  // Event listener para o botão "Favoritar"
  const favBtn = card.querySelector('.btn.icon.fav');
  if (favBtn) {
    favBtn.addEventListener('click', async function (e) {
      e.stopPropagation();
      
      const token = localStorage.getItem('bibliotec_token');
      if (!token) {
        alert('Por favor, faça login para favoritar um livro');
        window.location.href = 'login.html';
        return;
      }
      
      try {
        const response = await api.toggleFavorite(book.id);
        
        // Atualizar visual do botão
        if (response.is_favorite) {
          favBtn.classList.add('active');
          favBtn.setAttribute('aria-pressed', 'true');
          favBtn.setAttribute('data-active', 'true');
        } else {
          favBtn.classList.remove('active');
          favBtn.setAttribute('aria-pressed', 'false');
          favBtn.setAttribute('data-active', 'false');
        }
      } catch (error) {
        console.error('Erro ao favoritar:', error);
        alert('Erro ao favoritar o livro. Tente novamente.');
      }
    });
  }

  return card;
}

// ===== FUNÇÕES AUXILIARES DE NAVEGAÇÃO =====
function updateNavButtons(carousel, prevButton, nextButton) {
  const scrollLeft = carousel.scrollLeft;
  const scrollWidth = carousel.scrollWidth;
  const clientWidth = carousel.clientWidth;
  
  if (scrollLeft <= 10) {
    prevButton.classList.add('hidden');
  } else {
    prevButton.classList.remove('hidden');
  }
  
  if (scrollLeft + clientWidth >= scrollWidth - 10) {
    nextButton.classList.add('hidden');
  } else {
    nextButton.classList.remove('hidden');
  }
}

function wireCarouselWithNavVisibility(carousel, prevButton, nextButton, tagFunction) {
  updateNavButtons(carousel, prevButton, nextButton);
  
  carousel.addEventListener('scroll', () => {
    updateNavButtons(carousel, prevButton, nextButton);
    if (tagFunction) tagFunction();
  }, { passive: true });
  
  window.addEventListener('resize', () => {
    updateNavButtons(carousel, prevButton, nextButton);
  }, { passive: true });
}

function wireCarouselBehavior(carousel, tagFunction) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  
  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.classList.add('dragging');
  });
  
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('dragging');
  });
  
  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('dragging');
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.2;
    carousel.scrollLeft = scrollLeft - walk;
  });
  
  let touchStartX = 0;
  let touchScrollLeft = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = carousel.scrollLeft;
  }, { passive: true });
  
  carousel.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - touchStartX) * 1.0;
    carousel.scrollLeft = touchScrollLeft - walk;
  }, { passive: true });
  
  ['scroll', 'resize'].forEach(evt => {
    (evt === 'resize' ? window : carousel).addEventListener(evt, tagFunction, { passive: true });
  });
}

function renderCategories() {
  const chipsRoot = document.getElementById('categoriesCarousel');
  if (!chipsRoot) return;
  
  chipsRoot.innerHTML = '';
  
  const iconFor = (g) => {
    const icons = [
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2.5l2.76 5.59 6.16.9-4.46 4.35 1.05 6.12L12 17.77 6.49 19.46l1.05-6.12L3.08 8.99l6.16-.9L12 2.5z" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>',
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" stroke="currentColor" stroke-width="1.6"/></svg>',
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>',
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" stroke="currentColor" stroke-width="1.6" fill="none"/></svg>',
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/></svg>'
    ];
    return icons[Math.floor(Math.random() * icons.length)];
  };
  
  allGenres.forEach(g => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.innerHTML = iconFor(g) + `<span>${g}</span>`;
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filterByGenre(g);
    });
    chipsRoot.appendChild(chip);
  });
}

function wireCategoriesCarousel() {
  const carousel = document.getElementById('categoriesCarousel');
  if (!carousel) return;
  
  const prevButton = document.getElementById('prevCategories');
  const nextButton = document.getElementById('nextCategories');
  
  prevButton.addEventListener('click', () => {
    carousel.scrollBy({ left: -200, behavior: 'smooth' });
  });
  
  nextButton.addEventListener('click', () => {
    carousel.scrollBy({ left: 200, behavior: 'smooth' });
  });
  
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  
  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.classList.add('dragging');
  });
  
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('dragging');
  });
  
  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('dragging');
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5;
    carousel.scrollLeft = scrollLeft - walk;
  });
  
  let touchStartX = 0;
  let touchScrollLeft = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = carousel.scrollLeft;
  }, { passive: true });
  
  carousel.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - touchStartX) * 1.2;
    carousel.scrollLeft = touchScrollLeft - walk;
  }, { passive: true });
  
  wireCarouselWithNavVisibility(carousel, prevButton, nextButton);
}

function filterByGenre(genre) {
  const carousels = [
    { id: 'recCarousel', data: recommended },
    { id: 'topRatedCarousel', data: topRated },
    { id: 'newReleasesCarousel', data: newReleases },
    { id: 'popularNowCarousel', data: popularNow }
  ];
  
  carousels.forEach(({ id, data }) => {
    const root = document.getElementById(id);
    if (root) {
      root.innerHTML = '';
      const filtered = data.filter(b => b.genre === genre);
      filtered.forEach(b => root.appendChild(createCard(b)));
    }
  });
}

// ===== RENDERIZAÇÃO DOS CARROSSÉIS =====
function wireCarousel(){
  const carousel = document.getElementById('recCarousel');
  const prevButton = document.getElementById('prevRec');
  const nextButton = document.getElementById('nextRec');
  
  prevButton.addEventListener('click', () => {
    carousel.scrollBy({ left: -260, behavior: 'smooth' });
  });
  
  nextButton.addEventListener('click', () => {
    carousel.scrollBy({ left: 260, behavior: 'smooth' });
  });
  
  wireCarouselBehavior(carousel, () => tagEdgeCardsGeneric(carousel));
  wireCarouselWithNavVisibility(carousel, prevButton, nextButton, () => tagEdgeCardsGeneric(carousel));
}

function wireTopRatedCarousel() {
  const carousel = document.getElementById('topRatedCarousel');
  if (!carousel) return;
  
  const prevButton = document.getElementById('prevTopRated');
  const nextButton = document.getElementById('nextTopRated');
  
  prevButton.addEventListener('click', () => {
    carousel.scrollBy({ left: -260, behavior: 'smooth' });
  });
  
  nextButton.addEventListener('click', () => {
    carousel.scrollBy({ left: 260, behavior: 'smooth' });
  });
  
  wireCarouselBehavior(carousel, () => tagEdgeCardsGeneric(carousel));
  wireCarouselWithNavVisibility(carousel, prevButton, nextButton, () => tagEdgeCardsGeneric(carousel));
}

function wireNewReleasesCarousel() {
  const carousel = document.getElementById('newReleasesCarousel');
  if (!carousel) return;
  
  const prevButton = document.getElementById('prevNewReleases');
  const nextButton = document.getElementById('nextNewReleases');
  
  prevButton.addEventListener('click', () => {
    carousel.scrollBy({ left: -260, behavior: 'smooth' });
  });
  
  nextButton.addEventListener('click', () => {
    carousel.scrollBy({ left: 260, behavior: 'smooth' });
  });
  
  wireCarouselBehavior(carousel, () => tagEdgeCardsGeneric(carousel));
  wireCarouselWithNavVisibility(carousel, prevButton, nextButton, () => tagEdgeCardsGeneric(carousel));
}

function wirePopularNowCarousel() {
  const carousel = document.getElementById('popularNowCarousel');
  if (!carousel) return;
  
  const prevButton = document.getElementById('prevPopularNow');
  const nextButton = document.getElementById('nextPopularNow');
  
  prevButton.addEventListener('click', () => {
    carousel.scrollBy({ left: -260, behavior: 'smooth' });
  });
  
  nextButton.addEventListener('click', () => {
    carousel.scrollBy({ left: 260, behavior: 'smooth' });
  });
  
  wireCarouselBehavior(carousel, () => tagEdgeCardsGeneric(carousel));
  wireCarouselWithNavVisibility(carousel, prevButton, nextButton, () => tagEdgeCardsGeneric(carousel));
}

function renderCarousel() {
  const root = document.getElementById('recCarousel');
  if (!root) return;
  root.innerHTML = '';
  const shuffled = [...recommended].sort(() => Math.random() - 0.5);
  shuffled.forEach(b => root.appendChild(createCard(b)));
  tagEdgeCardsGeneric(root);
}

function renderTopRatedCarousel() {
  const root = document.getElementById('topRatedCarousel');
  if (!root) return;
  root.innerHTML = '';
  topRated.forEach(b => root.appendChild(createCard(b)));
  tagEdgeCardsGeneric(root);
}

function renderNewReleasesCarousel() {
  const root = document.getElementById('newReleasesCarousel');
  if (!root) return;
  root.innerHTML = '';
  newReleases.forEach(b => root.appendChild(createCard(b)));
  tagEdgeCardsGeneric(root);
}

function renderPopularNowCarousel() {
  const root = document.getElementById('popularNowCarousel');
  if (!root) return;
  root.innerHTML = '';
  popularNow.forEach(b => root.appendChild(createCard(b)));
  tagEdgeCardsGeneric(root);
}

function tagEdgeCardsGeneric(root) {
  const cards = Array.from(root.querySelectorAll('.card'));
  cards.forEach(c => { c.classList.remove('edge-left', 'edge-right'); });
  const rect = root.getBoundingClientRect();
  
  let leftIdx = -1, rightIdx = -1;
  let minLeft = Infinity, maxRight = -Infinity;
  
  for (let i = 0; i < cards.length; i++) {
    const r = cards[i].getBoundingClientRect();
    const intersects = r.left < rect.right && r.right > rect.left;
    if (!intersects) continue;
    if (r.left < minLeft) { minLeft = r.left; leftIdx = i; }
    if (r.right > maxRight) { maxRight = r.right; rightIdx = i; }
  }
  
  if (rightIdx !== -1) cards[rightIdx].classList.add('edge-right');
  if (leftIdx !== -1) cards[leftIdx].classList.add('edge-left');
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', async () => {
  // Carregar livros do backend
  await loadBooksFromAPI();

  // Renderizar os carrosséis
  renderCarousel();
  renderTopRatedCarousel();
  renderNewReleasesCarousel();
  renderPopularNowCarousel();

  // Renderizar categorias
  renderCategories();

  // Wire up carousel interactions
  wireCarousel();
  wireTopRatedCarousel();
  wireNewReleasesCarousel();
  wirePopularNowCarousel();
  wireCategoriesCarousel();

  // Disparar evento para indicar que os dados foram carregados
  window.dispatchEvent(new CustomEvent('booksLoaded'));
});

// Listener para atualizações de livros (do admin)
window.addEventListener('booksUpdated', async () => {
  console.log('Livros foram atualizados, recarregando...');
  await loadBooksFromAPI();
  renderCarousel();
  renderTopRatedCarousel();
  renderNewReleasesCarousel();
  renderPopularNowCarousel();
  renderCategories();
});