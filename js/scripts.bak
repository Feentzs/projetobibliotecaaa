// ===== CARREGAMENTO DINÂMICO DE DADOS =====
// Dados padrão (fallback)
const defaultBooks = {
  recommended: [
    { id: "1", title: "Memórias Póstumas de Brás Cubas", author: "Machado de Assis", cover: "https://covers.openlibrary.org/b/id/12628263-L.jpg", rating: 5, genre: 'Clássico' },
    { id: "2", title: "Capitães da Areia", author: "Jorge Amado", cover: "https://covers.openlibrary.org/b/id/11686911-L.jpg", rating: 4, genre: 'Romance' },
    { id: "3", title: "Dom Casmurro", author: "Machado de Assis", cover: "https://covers.openlibrary.org/b/id/13491181-L.jpg", rating: 5, genre: 'Romance' },
    { id: "4", title: "O Alquimista", author: "Paulo Coelho", cover: "https://covers.openlibrary.org/b/id/13141106-L.jpg", rating: 4, genre: 'Ficção' },
    { id: "5", title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", cover: "https://covers.openlibrary.org/b/id/13293269-L.jpg", rating: 5, genre: 'Infantojuvenil' },
    { id: "10", title: "Quincas Borba", author: "Machado de Assis", cover: "https://covers.openlibrary.org/b/id/8231856-L.jpg", rating: 4, genre: 'Clássico' },
    { id: "11", title: "Iracema", author: "José de Alencar", cover: "https://covers.openlibrary.org/b/id/240727-L.jpg", rating: 4, genre: 'Romance' },
    { id: "12", title: "O Cortiço", author: "Aluísio Azevedo", cover: "https://covers.openlibrary.org/b/id/240677-L.jpg", rating: 4, genre: 'Realismo' },
    { id: "13", title: "Macunaíma", author: "Mário de Andrade", cover: "https://covers.openlibrary.org/b/id/11054071-L.jpg", rating: 4, genre: 'Modernismo' },
    { id: "14", title: "Os Sertões", author: "Euclides da Cunha", cover: "https://covers.openlibrary.org/b/id/11155574-L.jpg", rating: 5, genre: 'História' },
    { id: "15", title: "A Metamorfose", author: "Franz Kafka", cover: "https://covers.openlibrary.org/b/id/12502453-L.jpg", rating: 5, genre: 'Ficção' },
    { id: "16", title: "1984", author: "George Orwell", cover: "https://covers.openlibrary.org/b/id/153541-L.jpg", rating: 5, genre: 'Ficção' }
  ],
  library: [
    { id: "6", title: "Grande Sertão: Veredas", author: "João Guimarães Rosa", cover: "https://covers.openlibrary.org/b/id/12618218-L.jpg", rating: 5, progress: 42, genre: 'Clássico' },
    { id: "7", title: "A Hora da Estrela", author: "Clarice Lispector", cover: "https://covers.openlibrary.org/b/id/13527603-L.jpg", rating: 4, progress: 63, genre: 'Romance' },
    { id: "8", title: "Vidas Secas", author: "Graciliano Ramos", cover: "https://covers.openlibrary.org/b/id/13516261-L.jpg", rating: 5, progress: 18, genre: 'Romance' },
    { id: "9", title: "A República", author: "Platão", cover: "https://covers.openlibrary.org/b/id/11153242-L.jpg", rating: 4, progress: 75, genre: 'Filosofia' },
    { id: "17", title: "Memórias do Cárcere", author: "Graciliano Ramos", cover: "https://covers.openlibrary.org/b/id/11110448-L.jpg", rating: 5, progress: 12, genre: 'Biografia' },
    { id: "18", title: "Senhora", author: "José de Alencar", cover: "https://covers.openlibrary.org/b/id/240690-L.jpg", rating: 4, progress: 55, genre: 'Romance' },
    { id: "19", title: "O Primo Basílio", author: "Eça de Queirós", cover: "https://covers.openlibrary.org/b/id/240735-L.jpg", rating: 4, progress: 33, genre: 'Realismo' },
    { id: "20", title: "Ensaio sobre a Cegueira", author: "José Saramago", cover: "https://covers.openlibrary.org/b/id/240744-L.jpg", rating: 5, progress: 78, genre: 'Ficção' }
  ],
  topRated: [
    { id: "21", title: "Cem Anos de Solidão", author: "Gabriel García Márquez", cover: "https://covers.openlibrary.org/b/id/8252387-L.jpg", rating: 5, genre: 'Realismo Mágico' },
    { id: "22", title: "Crime e Castigo", author: "Fiódor Dostoiévski", cover: "https://covers.openlibrary.org/b/id/8226456-L.jpg", rating: 5, genre: 'Clássico' },
    { id: "23", title: "Orgulho e Preconceito", author: "Jane Austen", cover: "https://covers.openlibrary.org/b/id/13298758-L.jpg", rating: 5, genre: 'Romance' },
    { id: "24", title: "O Senhor dos Anéis", author: "J.R.R. Tolkien", cover: "https://covers.openlibrary.org/b/id/13287771-L.jpg", rating: 5, genre: 'Fantasia' },
    { id: "25", title: "Hamlet", author: "William Shakespeare", cover: "https://covers.openlibrary.org/b/id/8232331-L.jpg", rating: 5, genre: 'Teatro' },
    { id: "26", title: "A Divina Comédia", author: "Dante Alighieri", cover: "https://covers.openlibrary.org/b/id/8232106-L.jpg", rating: 5, genre: 'Poesia' },
    { id: "27", title: "Guerra e Paz", author: "Liev Tolstói", cover: "https://covers.openlibrary.org/b/id/8232075-L.jpg", rating: 5, genre: 'Clássico' },
    { id: "28", title: "Ulisses", author: "James Joyce", cover: "https://covers.openlibrary.org/b/id/8232469-L.jpg", rating: 5, genre: 'Modernismo' }
  ],
  newReleases: [
    { id: "29", title: "Torto Arado", author: "Itamar Vieira Junior", cover: "https://covers.openlibrary.org/b/id/13048931-L.jpg", rating: 4.8, genre: 'Romance' },
    { id: "30", title: "A Vida Invisível de Eurídice Gusmão", author: "Martha Batalha", cover: "https://covers.openlibrary.org/b/id/12686569-L.jpg", rating: 4.5, genre: 'Romance' },
    { id: "31", title: "O Avesso da Pele", author: "Jeferson Tenório", cover: "https://covers.openlibrary.org/b/id/12967270-L.jpg", rating: 4.7, genre: 'Romance' },
    { id: "32", title: "Ventos do Apocalipse", author: "Paulina Chiziane", cover: "https://covers.openlibrary.org/b/id/12967271-L.jpg", rating: 4.6, genre: 'Ficção' },
    { id: "33", title: "O Fio das Missangas", author: "Mia Couto", cover: "https://covers.openlibrary.org/b/id/12686570-L.jpg", rating: 4.4, genre: 'Contos' },
    { id: "34", title: "A Cartomante", author: "Julián Fuentes", cover: "https://covers.openlibrary.org/b/id/12967272-L.jpg", rating: 4.3, genre: 'Suspense' },
    { id: "35", title: "Terra Sonâmbula", author: "Mia Couto", cover: "https://covers.openlibrary.org/b/id/12686571-L.jpg", rating: 4.8, genre: 'Romance' },
    { id: "36", title: "O Silêncio da Chuva", author: "Luiz Alfredo Garcia-Roza", cover: "https://covers.openlibrary.org/b/id/12686572-L.jpg", rating: 4.2, genre: 'Policial' }
  ],
  popularNow: [
    { id: "37", title: "O Hobbit", author: "J.R.R. Tolkien", cover: "https://covers.openlibrary.org/b/id/13287772-L.jpg", rating: 4.8, genre: 'Fantasia' },
    { id: "38", title: "O Nome do Vento", author: "Patrick Rothfuss", cover: "https://covers.openlibrary.org/b/id/8232345-L.jpg", rating: 4.7, genre: 'Fantasia' },
    { id: "39", title: "A Menina que Roubava Livros", author: "Markus Zusak", cover: "https://covers.openlibrary.org/b/id/8232346-L.jpg", rating: 4.6, genre: 'Drama' },
    { id: "40", title: "O Poder do Hábito", author: "Charles Duhigg", cover: "https://covers.openlibrary.org/b/id/12686573-L.jpg", rating: 4.4, genre: 'Autoajuda' },
    { id: "41", title: "Sapiens", author: "Yuval Noah Harari", cover: "https://covers.openlibrary.org/b/id/12686574-L.jpg", rating: 4.5, genre: 'História' },
    { id: "42", title: "O Sol é para Todos", author: "Harper Lee", cover: "https://covers.openlibrary.org/b/id/8232347-L.jpg", rating: 4.8, genre: 'Drama' },
    { id: "43", title: "O Código Da Vinci", author: "Dan Brown", cover: "https://covers.openlibrary.org/b/id/8232348-L.jpg", rating: 4.2, genre: 'Suspense' },
    { id: "44", title: "A Garota no Trem", author: "Paula Hawkins", cover: "https://covers.openlibrary.org/b/id/12686575-L.jpg", rating: 4.1, genre: 'Thriller' }
  ]
};

// Carregar dados do localStorage ou usar padrão
function loadBooksData() {
  const stored = localStorage.getItem('biblioTecBooks');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Mesclar com dados padrão para garantir que todos os arrays existam
      return {
        recommended: parsed.recommended || defaultBooks.recommended,
        library: parsed.library || defaultBooks.library,
        topRated: parsed.topRated || defaultBooks.topRated,
        newReleases: parsed.newReleases || defaultBooks.newReleases,
        popularNow: parsed.popularNow || defaultBooks.popularNow
      };
    } catch (e) {
      console.error('Erro ao carregar livros:', e);
      return defaultBooks;
    }
  }
  return defaultBooks;
}

// Função para carregar dados do JSONBin (chamada na inicialização)
async function loadBooksDataFromCloud() {
  try {
    if (typeof loadBooksFromCloud === 'function') {
      const cloudData = await loadBooksFromCloud();
      if (cloudData) {
        // Mesclar com dados padrão
        const merged = {
          recommended: cloudData.recommended || defaultBooks.recommended,
          library: cloudData.library || defaultBooks.library,
          topRated: cloudData.topRated || defaultBooks.topRated,
          newReleases: cloudData.newReleases || defaultBooks.newReleases,
          popularNow: cloudData.popularNow || defaultBooks.popularNow
        };
        // Salvar no localStorage como cache
        localStorage.setItem('biblioTecBooks', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (error) {
    console.warn('Erro ao carregar do JSONBin, usando dados locais:', error);
  }
  return null;
}

// Carregar dados dinamicamente
const booksData = loadBooksData();
let recommended = booksData.recommended;
let library = booksData.library;
let topRated = booksData.topRated;
let newReleases = booksData.newReleases;
let popularNow = booksData.popularNow;

// Atualizar gêneros dinamicamente
let allGenres = Array.from(new Set([...recommended, ...library, ...topRated, ...newReleases, ...popularNow].map(b=>b.genre))).filter(Boolean);

// ===== NAVEGAÇÃO PARA PÁGINA DO LIVRO =====
function navigateToBook(bookId) {
  window.location.href = `livro.html?id=${bookId}`;
}

function createCard(book){
  const card = document.createElement('article');
  card.className = 'card';
  card.setAttribute('data-book-id', book.id);
  card.style.cursor = 'pointer';
  card.innerHTML = `
    <img src="${book.cover}" alt="${book.title}" />
    <div class="card-body">
      <div class="meta"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2.5l2.76 5.59 6.16.9-4.46 4.35 1.05 6.12L12 17.77 6.49 19.46l1.05-6.12L3.08 8.99l6.16-.9L12 2.5z" fill="#2FD6CB"/></svg><span>${book.rating?.toFixed(1).replace('.',',') ?? '0,0'}</span><span class="badge">${book.genre??''}</span></div>
      <h3 style="margin:8px 0 0;font-size:16px">${book.title}</h3>
      <p style="margin:6px 0 0;color:#64748b">${book.author}</p>
      ${typeof book.progress === 'number'? `<div style="margin-top:10px"><div style="height:8px;background:#f1f5f9;border-radius:999px"><div style="height:8px;border-radius:999px;width:${book.progress}% ;background:var(--accent)"></div></div><small style="color:#94a3b8"> ${book.progress}% lido</small></div>` : ''}
      <div class="actions">
        <button class="btn read">Ler agora</button>
        <button class="btn icon fav" aria-pressed="false" title="Favoritar" data-id="${book.id}" data-active="false">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 4.8l1.76 3.57 3.94.57-2.85 2.78.67 3.92L12 13.9l-3.52 1.86.67-3.92L6.3 8.94l3.94-.57L12 4.8z" stroke="currentColor" stroke-width="1.2" fill="none"/>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  // Adicionar event listener para navegação
  card.addEventListener('click', function(e) {
    // Evitar navegação se clicar nos botões
    if (e.target.closest('.btn')) {
      return;
    }
    
    // Navegar para a página do livro
    navigateToBook(book.id);
  });
  
  // Adicionar event listener para o botão "Ler agora"
  const readBtn = card.querySelector('.btn.read');
  if (readBtn) {
    readBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      // Verificar se tem PDF
      if (book.pdf) {
        window.location.href = `pdf-viewer.html?id=${book.id}`;
      } else {
        // Se não tiver PDF, ir para a página do livro
        navigateToBook(book.id);
      }
    });
  }
  
  return card;
}

// ===== SISTEMA DE PESQUISA COM OVERLAY =====
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const headerSearchInput = document.getElementById('headerSearchInput');
  const heroSearchOverlay = document.getElementById('heroSearchOverlay');
  const headerSearchOverlay = document.getElementById('headerSearchOverlay');
  const searchBackdrop = document.getElementById('searchBackdrop');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => handleSearch(e.target.value, heroSearchOverlay));
    searchInput.addEventListener('focus', () => showSearchOverlay(heroSearchOverlay, searchBackdrop));
  }

  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', (e) => handleSearch(e.target.value, headerSearchOverlay));
    headerSearchInput.addEventListener('focus', () => showSearchOverlay(headerSearchOverlay, searchBackdrop));
  }

  // Fechar overlay ao clicar no backdrop
  if (searchBackdrop) {
    searchBackdrop.addEventListener('click', () => {
      hideSearchOverlays();
    });
  }

  // Fechar overlay ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideSearchOverlays();
    }
  });
}

function showSearchOverlay(overlay, backdrop) {
  if (overlay && backdrop) {
    overlay.classList.add('active');
    backdrop.classList.add('active');
  }
}

function hideSearchOverlays() {
  const overlays = document.querySelectorAll('.search-overlay');
  const backdrop = document.getElementById('searchBackdrop');
  const inputs = document.querySelectorAll('#searchInput, #headerSearchInput');
  
  overlays.forEach(overlay => overlay.classList.remove('active'));
  if (backdrop) backdrop.classList.remove('active');
  
  // Remover foco dos inputs
  inputs.forEach(input => input.blur());
}

function handleSearch(query, overlay) {
  const q = query.trim().toLowerCase();
  const allBooks = [...recommended, ...library, ...topRated, ...newReleases, ...popularNow];
  
  if (!overlay) return;

  if (q.length === 0) {
    overlay.innerHTML = '<div class="no-results">Digite para buscar livros...</div>';
    return;
  }

  const results = allBooks.filter(b => 
    (b.title + b.author + (b.genre || '')).toLowerCase().includes(q)
  );

  renderSearchResults(results, overlay);
}

function renderSearchResults(results, overlay) {
  if (!overlay) return;

  if (results.length === 0) {
    overlay.innerHTML = '<div class="no-results">Nenhum livro encontrado</div>';
    return;
  }

  const resultsHTML = results.slice(0, 8).map(book => `
    <a href="#" class="search-result-item" data-book-id="${book.id}">
      <img src="${book.cover}" alt="${book.title}" />
      <div class="search-result-info">
        <h4>${book.title}</h4>
        <p>${book.author}</p>
        <div class="search-result-meta">
          <span>${book.genre}</span>
          <span>•</span>
          <span>⭐ ${book.rating?.toFixed(1).replace('.', ',') || '0,0'}</span>
        </div>
      </div>
    </a>
  `).join('');

  overlay.innerHTML = `<div class="search-results">${resultsHTML}</div>`;

  // Adicionar event listeners para os resultados
  overlay.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const bookId = item.getAttribute('data-book-id');
      hideSearchOverlays();
      navigateToBook(bookId);
    });
  });
}

// ===== EFEITO DE MIGRAÇÃO DA BARRA DE PESQUISA =====
function initSearchMigration() {
  const heroSearch = document.querySelector('.hero .search');
  const headerSearch = document.querySelector('.header-search');
  const header = document.querySelector('.site-header');
  const heroSection = document.querySelector('.hero');
  
  if (!heroSearch || !headerSearch || !heroSection) return;
  
  const heroInput = document.getElementById('searchInput');
  const headerInput = document.getElementById('headerSearchInput');
  const heroOverlay = document.getElementById('heroSearchOverlay');
  const headerOverlay = document.getElementById('headerSearchOverlay');
  
  function syncInputs(source, target) {
    target.value = source.value;
    // Sincronizar também os overlays
    if (source === heroInput) {
      handleSearch(source.value, headerOverlay);
    } else {
      handleSearch(source.value, heroOverlay);
    }
  }
  
  heroInput.addEventListener('input', () => syncInputs(heroInput, headerInput));
  headerInput.addEventListener('input', () => syncInputs(headerInput, heroInput));
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        heroSearch.classList.add('hidden');
        headerSearch.classList.remove('hidden');
        header.classList.add('with-search');
        // Transferir o overlay ativo se houver
        if (heroOverlay.classList.contains('active')) {
          heroOverlay.classList.remove('active');
          headerOverlay.classList.add('active');
        }
      } else {
        heroSearch.classList.remove('hidden');
        headerSearch.classList.add('hidden');
        header.classList.remove('with-search');
        // Transferir o overlay ativo se houver
        if (headerOverlay.classList.contains('active')) {
          headerOverlay.classList.remove('active');
          heroOverlay.classList.add('active');
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '-80px 0px 0px 0px'
  });
  
  observer.observe(heroSection);
}

// Função para verificar e atualizar a visibilidade das setas
function updateNavButtons(carousel, prevButton, nextButton) {
  const scrollLeft = carousel.scrollLeft;
  const scrollWidth = carousel.scrollWidth;
  const clientWidth = carousel.clientWidth;
  
  // Mostrar/ocultar seta esquerda
  if (scrollLeft <= 10) {
    prevButton.classList.add('hidden');
  } else {
    prevButton.classList.remove('hidden');
  }
  
  // Mostrar/ocultar seta direita
  if (scrollLeft + clientWidth >= scrollWidth - 10) {
    nextButton.classList.add('hidden');
  } else {
    nextButton.classList.remove('hidden');
  }
}

// Função auxiliar para adicionar o comportamento a um carrossel
function wireCarouselWithNavVisibility(carousel, prevButton, nextButton, tagFunction) {
  // Atualizar visibilidade inicial
  updateNavButtons(carousel, prevButton, nextButton);
  
  // Atualizar no scroll
  carousel.addEventListener('scroll', () => {
    updateNavButtons(carousel, prevButton, nextButton);
    if (tagFunction) tagFunction();
  }, { passive: true });
  
  // Atualizar no resize (caso o conteúdo mude)
  window.addEventListener('resize', () => {
    updateNavButtons(carousel, prevButton, nextButton);
  }, { passive: true });
}

// Funções para o carrossel de categorias
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
  
  // Drag to scroll
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
  
  // touch support
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
  
  // Adicionar controle de visibilidade para categorias também
  wireCarouselWithNavVisibility(carousel, prevButton, nextButton);
}

// Atualizar a função de renderização de categorias
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

function renderCarousel(){
  const root = document.getElementById('recCarousel');
  root.innerHTML='';
  // Randomizar ordem dos livros recomendados
  const shuffled = [...recommended].sort(() => Math.random() - 0.5);
  shuffled.forEach(b=>root.appendChild(createCard(b)));
  tagEdgeCards();
}

function renderLibraryCarousel() {
  const root = document.getElementById('libraryCarousel');
  if (!root) return;
  root.innerHTML = '';
  library.forEach(b => root.appendChild(createCard(b)));
  tagEdgeCardsLibrary();
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

// Simple carousel controls: scroll left/right
function wireCarousel(){
  const carousel = document.getElementById('recCarousel');
  const prevButton = document.getElementById('prevRec');
  const nextButton = document.getElementById('nextRec');
  
  prevButton.addEventListener('click',()=>{
    carousel.scrollBy({left:-260,behavior:'smooth'});
  });
  
  nextButton.addEventListener('click',()=>{
    carousel.scrollBy({left:260,behavior:'smooth'});
  });
  
  wireCarouselBehavior(carousel, tagEdgeCards);
  wireCarouselWithNavVisibility(carousel, prevButton, nextButton, tagEdgeCards);
}

function wireLibraryCarousel() {
  const carousel = document.getElementById('libraryCarousel');
  if (!carousel) return;
  
  const prevButton = document.getElementById('prevLibrary');
  const nextButton = document.getElementById('nextLibrary');
  
  prevButton.addEventListener('click', () => {
    carousel.scrollBy({ left: -260, behavior: 'smooth' });
  });
  
  nextButton.addEventListener('click', () => {
    carousel.scrollBy({ left: 260, behavior: 'smooth' });
  });
  
  wireCarouselBehavior(carousel, ()=>{ tagEdgeCardsGeneric(carousel); });
  wireCarouselWithNavVisibility(carousel, prevButton, nextButton, ()=>{ tagEdgeCardsGeneric(carousel); });
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
  
  wireCarouselBehavior(carousel, ()=>{ tagEdgeCardsGeneric(carousel); });
  wireCarouselWithNavVisibility(carousel, prevButton, nextButton, ()=>{ tagEdgeCardsGeneric(carousel); });
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
  
  wireCarouselBehavior(carousel, ()=>{ tagEdgeCardsGeneric(carousel); });
  wireCarouselWithNavVisibility(carousel, prevButton, nextButton, ()=>{ tagEdgeCardsGeneric(carousel); });
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
  
  wireCarouselBehavior(carousel, ()=>{ tagEdgeCardsGeneric(carousel); });
  wireCarouselWithNavVisibility(carousel, prevButton, nextButton, ()=>{ tagEdgeCardsGeneric(carousel); });
}

// Função auxiliar para evitar código repetido
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
  
  // touch support
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
  
  // update edge styles on scroll/resize
  ['scroll', 'resize'].forEach(evt => {
    (evt === 'resize' ? window : carousel).addEventListener(evt, tagFunction, { passive: true });
  });
}

function tagEdgeCards(){
  const root = document.getElementById('recCarousel');
  if(!root) return;
  tagEdgeCardsGeneric(root);
}

function tagEdgeCardsLibrary() {
  const root = document.getElementById('libraryCarousel');
  if (!root) return;
  tagEdgeCardsGeneric(root);
}

function tagEdgeCardsGeneric(root) {
  const cards = Array.from(root.querySelectorAll('.card'));
  cards.forEach(c => { c.classList.remove('edge-left', 'edge-right') });
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

function filterByGenre(genre){
  const carousels = [
    { id: 'recCarousel', data: recommended },
    { id: 'libraryCarousel', data: library },
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

function initMobileBottomNav() {
  const searchBtn = document.querySelector('[data-action="mobile-search"]');
  if (!searchBtn) return;

  const heroInput = document.getElementById('searchInput');
  const headerInput = document.getElementById('headerSearchInput');
  const heroOverlay = document.getElementById('heroSearchOverlay');
  const headerOverlay = document.getElementById('headerSearchOverlay');
  const searchBackdrop = document.getElementById('searchBackdrop');

  searchBtn.addEventListener('click', () => {
    const heroHidden = document.querySelector('.hero .search')?.classList.contains('hidden');
    const targetInput = heroInput && !heroHidden ? heroInput : headerInput;
    const overlayTarget = targetInput === heroInput ? heroOverlay : headerOverlay;

    if (targetInput) {
      targetInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        targetInput.focus();
        if (overlayTarget) {
          showSearchOverlay(overlayTarget, searchBackdrop);
        }
      }, 250);
    }
  });
}

// Favorites handling (local)
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('button.fav');
  if(!btn) return;
  btn.classList.toggle('active');
  const active = btn.classList.contains('active');
  btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  btn.dataset.active = active ? 'true' : 'false';
  btn.innerHTML = active
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.76 5.59 6.16.9-4.46 4.35 1.05 6.12L12 17.77 6.49 19.46l1.05-6.12L3.08 8.99l6.16-.9L12 2.5z"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4.8l1.76 3.57 3.94.57-2.85 2.78.67 3.92L12 13.9l-3.52 1.86.67-3.92L6.3 8.94l3.94-.57L12 4.8z" stroke="currentColor" stroke-width="1.2" fill="none"/></svg>`;
});

// Função para recarregar dados do localStorage
function reloadBooksData() {
  const booksData = loadBooksData();
  recommended = booksData.recommended;
  library = booksData.library;
  topRated = booksData.topRated;
  newReleases = booksData.newReleases;
  popularNow = booksData.popularNow;
  allGenres = Array.from(new Set([...recommended, ...library, ...topRated, ...newReleases, ...popularNow].map(b=>b.genre))).filter(Boolean);
  
  // Re-renderizar carrosséis
  renderCategories();
  renderCarousel();
  renderLibraryCarousel();
  renderTopRatedCarousel();
  renderNewReleasesCarousel();
  renderPopularNowCarousel();
}

// ===== MENU HAMBÚRGUER DO USUÁRIO =====
function initUserMenu() {
  const menuCheckbox = document.getElementById('menu_checkbox');
  const menuDropdown = document.getElementById('user-menu-dropdown');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  
  if (!menuCheckbox || !menuDropdown) return;
  
  // Criar backdrop dinamicamente
  const menuBackdrop = document.createElement('div');
  menuBackdrop.className = 'menu-backdrop';
  hamburgerMenu.parentNode.appendChild(menuBackdrop);
  
  // Elementos do tema no menu
  const themeSwitch = document.getElementById('theme-switch');
  const sunIconMenu = document.getElementById('sun-icon-menu');
  const moonIconMenu = document.getElementById('moon-icon-menu');
  const darkModeStyle = document.getElementById('dark-mode-style');
  
  // Botões do menu
  const accountBtn = document.getElementById('account-btn');
  const logoutBtn = document.getElementById('logout-btn');
  
  // Carregar informações do usuário
  function loadUserInfo() {
    const userName = document.getElementById('current-username');
    const userEmail = document.getElementById('current-useremail');
    
    // Tentar carregar do localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (userName) {
      userName.textContent = userData.name || 'Usuário';
    }
    
    if (userEmail) {
      userEmail.textContent = userData.email || 'usuario@exemplo.com';
    }
  }
  
  // Configurar tema no menu - CORRIGIDO
  function setupThemeInMenu() {
    if (!darkModeStyle || !themeSwitch) return;
    
    // Verificar se o modo escuro está ativo
    const isDark = !darkModeStyle.disabled;
    
    // Atualizar switch - CORRIGIDO: agora mostra o estado correto
    themeSwitch.checked = isDark;
    
    // Atualizar ícones
    if (sunIconMenu && moonIconMenu) {
      if (isDark) {
        sunIconMenu.style.display = 'none';
        moonIconMenu.style.display = 'block';
      } else {
        sunIconMenu.style.display = 'block';
        moonIconMenu.style.display = 'none';
      }
    }
  }
  
  // Fechar menu
  function closeMenu() {
    menuCheckbox.checked = false;
  }
  
  // Event Listeners
  menuBackdrop.addEventListener('click', closeMenu);
  
  // Fechar menu ao pressionar ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuCheckbox.checked) {
      closeMenu();
    }
  });
  
  // Alternar tema pelo switch - CORRIGIDO
  if (themeSwitch) {
    themeSwitch.addEventListener('change', function() {
      const isDark = this.checked;
      
      console.log('Switch alterado para:', isDark ? 'escuro' : 'claro');
      console.log('darkModeStyle.disabled antes:', darkModeStyle.disabled);
      
      // Atualizar tema - CORRIGIDO: inverter a lógica
      if (darkModeStyle) {
        // Se o switch está marcado (checked), ativar modo escuro (disabled = false)
        // Se o switch não está marcado, ativar modo claro (disabled = true)
        darkModeStyle.disabled = !isDark;
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        console.log('darkModeStyle.disabled depois:', darkModeStyle.disabled);
      }
      
      // Atualizar ícones no menu
      if (sunIconMenu && moonIconMenu) {
        if (isDark) {
          sunIconMenu.style.display = 'none';
          moonIconMenu.style.display = 'block';
        } else {
          sunIconMenu.style.display = 'block';
          moonIconMenu.style.display = 'none';
        }
      }
      
      // Recarregar a página para aplicar todas as mudanças de tema
      setTimeout(() => {
        location.reload();
      }, 300);
    });
  }
  
  // Configurar conta (placeholder)
  if (accountBtn) {
    accountBtn.addEventListener('click', function() {
      closeMenu();
      alert('Funcionalidade de configuração de conta será implementada em breve!');
    });
  }
  
  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (confirm('Tem certeza que deseja sair?')) {
        // Limpar dados do usuário (opcional)
        localStorage.removeItem('userSession');
        
        // Redirecionar para login
        window.location.href = 'login.html';
      }
    });
  }
  
  // Inicializar
  loadUserInfo();
  setupThemeInMenu();
  
  // Verificar se há mudanças nos dados do usuário
  window.addEventListener('storage', function(e) {
    if (e.key === 'userData') {
      loadUserInfo();
    }
  });
}

// ===== INICIALIZAÇÃO =====
async function init() {
  // Tentar carregar dados do JSONBin primeiro
  try {
    const cloudData = await loadBooksDataFromCloud();
    if (cloudData) {
      recommended = cloudData.recommended;
      library = cloudData.library;
      topRated = cloudData.topRated;
      newReleases = cloudData.newReleases;
      popularNow = cloudData.popularNow;
      allGenres = Array.from(new Set([...recommended, ...library, ...topRated, ...newReleases, ...popularNow].map(b=>b.genre))).filter(Boolean);
    }
  } catch (error) {
    console.warn('Usando dados locais:', error);
  }
  
  renderCategories();
  renderCarousel();
  renderLibraryCarousel();
  renderTopRatedCarousel();
  renderNewReleasesCarousel();
  renderPopularNowCarousel();

  wireCategoriesCarousel();
  wireCarousel();
  wireLibraryCarousel();
  wireTopRatedCarousel();
  wireNewReleasesCarousel();
  wirePopularNowCarousel();
  
  initSearch();
  initSearchMigration();
  initMobileBottomNav();
  
  // Inicializar menu do usuário
  initUserMenu();
  
  // Listener para atualizar quando dados mudarem (de outra aba/página)
  window.addEventListener('storage', (e) => {
    if (e.key === 'biblioTecBooks') {
      reloadBooksData();
    }
  });
  
  // Listener para evento customizado (mesma aba)
  window.addEventListener('booksUpdated', () => {
    reloadBooksData();
  });
  
  // Sincronizar com JSONBin periodicamente (a cada 10 segundos)
  setInterval(async () => {
    try {
      const cloudData = await loadBooksDataFromCloud();
      if (cloudData) {
        const cloudStr = JSON.stringify({
          recommended: cloudData.recommended,
          library: cloudData.library,
          topRated: cloudData.topRated,
          newReleases: cloudData.newReleases,
          popularNow: cloudData.popularNow
        });
        const localStr = JSON.stringify({
          recommended,
          library,
          topRated,
          newReleases,
          popularNow
        });
        if (cloudStr !== localStr) {
          recommended = cloudData.recommended;
          library = cloudData.library;
          topRated = cloudData.topRated;
          newReleases = cloudData.newReleases;
          popularNow = cloudData.popularNow;
          allGenres = Array.from(new Set([...recommended, ...library, ...topRated, ...newReleases, ...popularNow].map(b=>b.genre))).filter(Boolean);
          reloadBooksData();
        }
      }
    } catch (error) {
      // Silenciosamente falha
    }
  }, 10000);
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);

// Função original para a página da biblioteca (mantida para compatibilidade)
function renderLibrary(rootId='libraryGridPage'){
  const root = document.getElementById(rootId);
  if(!root) return;
  root.innerHTML='';
  library.forEach(b=>root.appendChild(createCard(b)));
}

// dark-mode.js - CORRIGIDO para funcionar com o switch
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const darkModeStyle = document.getElementById('dark-mode-style');
  const themeIcon = document.getElementById('theme-icon');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  
  // Verificar preferência salva
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Aplicar tema salvo ou preferência do sistema
  if (savedTheme === 'light') {
    darkModeStyle.disabled = true;
    updateThemeIcon(false);
  } else if (savedTheme === 'dark') {
    darkModeStyle.disabled = false;
    updateThemeIcon(true);
  } else if (prefersDark) {
    // Se não tiver preferência salva, usar preferência do sistema
    darkModeStyle.disabled = false;
    localStorage.setItem('theme', 'dark');
    updateThemeIcon(true);
  } else {
    darkModeStyle.disabled = true;
    updateThemeIcon(false);
  }
  
  // Aplicar tema inicial
  applyDarkModeTheme(!darkModeStyle.disabled);
  
  // Sincronizar com o switch do menu hambúrguer se existir
  const themeSwitch = document.getElementById('theme-switch');
  if (themeSwitch) {
    // Atualizar o switch para refletir o estado atual
    themeSwitch.checked = !darkModeStyle.disabled;
    
    // Atualizar ícones no menu hambúrguer
    const sunIconMenu = document.getElementById('sun-icon-menu');
    const moonIconMenu = document.getElementById('moon-icon-menu');
    if (sunIconMenu && moonIconMenu) {
      if (!darkModeStyle.disabled) { // Modo escuro ativo
        sunIconMenu.style.display = 'none';
        moonIconMenu.style.display = 'block';
      } else { // Modo claro ativo
        sunIconMenu.style.display = 'block';
        moonIconMenu.style.display = 'none';
      }
    }
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const isDark = darkModeStyle.disabled;
      
      if (isDark) {
        // Ativar modo escuro
        darkModeStyle.disabled = false;
        localStorage.setItem('theme', 'dark');
        updateThemeIcon(true);
      } else {
        // Ativar modo claro
        darkModeStyle.disabled = true;
        localStorage.setItem('theme', 'light');
        updateThemeIcon(false);
      }
      
      // Sincronizar com o switch do menu hambúrguer
      if (themeSwitch) {
        themeSwitch.checked = !darkModeStyle.disabled;
      }
      
      // Aplicar mudanças visuais
      applyDarkModeTheme(!isDark);
      location.reload();
    });
  }
  
  function updateThemeIcon(isDark) {
    if (sunIcon && moonIcon) {
      if (isDark) {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
      } else {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
      }
    }
  }
  
  function applyDarkModeTheme(isDark) {
    // 1. Trocar logo do header
    const headerLogo = document.getElementById('header-logo');
    if (headerLogo) {
      headerLogo.src = isDark ? 'images/logo-dark.svg' : 'images/logo-light.svg';
    }
    
    // 2. Trocar imagem da ilustração do hero
    const logoCenter = document.querySelector('.logo-center');
    if (logoCenter) {
      logoCenter.src = isDark ? './images/ilustdark.png' : './images/ilust1.webp';
    }
    
    // 3. Trocar logo no hero-content
    const heroLogo = document.querySelector('.hero-content .header-logo');
    if (heroLogo) {
      heroLogo.src = isDark ? './images/logo-dark.svg' : './images/logo-light.svg';
    }
    
    // 4. Aplicar classe dark-mode ao body para estilos CSS
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
});