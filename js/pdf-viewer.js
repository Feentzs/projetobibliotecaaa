// ===== CONFIGURAÇÃO DO PDF.JS =====
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// ===== VARIÁVEIS GLOBAIS =====
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;
let scale = 1.0;
let highlights = [];
let bookId = null;
let bookData = null;

// ===== ELEMENTOS DOM =====
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');
const pageContainer = document.getElementById('pageContainer');
const highlightsLayer = document.getElementById('highlightsLayer');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const btnBack = document.getElementById('btnBack');
const btnHighlight = document.getElementById('btnHighlight');
const btnBookmark = document.getElementById('btnBookmark');
const currentPageSpan = document.getElementById('currentPage');
const totalPagesSpan = document.getElementById('totalPages');
const zoomLevelSpan = document.getElementById('zoomLevel');
const btnZoomIn = document.getElementById('btnZoomIn');
const btnZoomOut = document.getElementById('btnZoomOut');
const progressFill = document.getElementById('progressFill');
const bookTitle = document.getElementById('bookTitle');
const bookAuthor = document.getElementById('bookAuthor');

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  initPDFViewer();
});

function initPDFViewer() {
  // Obter dados da URL
  const urlParams = new URLSearchParams(window.location.search);
  bookId = urlParams.get('id');
  
  if (!bookId) {
    alert('ID do livro não encontrado!');
    window.location.href = 'home.html';
    return;
  }
  
  // Carregar dados do livro
  loadBookData();
  
  // Event listeners
  btnPrev.addEventListener('click', () => changePage(-1));
  btnNext.addEventListener('click', () => changePage(1));
  btnBack.addEventListener('click', () => goBack());
  btnZoomIn.addEventListener('click', () => changeZoom(0.2));
  btnZoomOut.addEventListener('click', () => changeZoom(-0.2));
  btnHighlight.addEventListener('click', toggleHighlightMode);
  btnBookmark.addEventListener('click', toggleBookmark);
  
  // Teclado
  document.addEventListener('keydown', handleKeyPress);
  
  // Seleção de texto
  document.addEventListener('mouseup', handleTextSelection);
  
  // Atualizar camada de texto ao mudar zoom
  canvas.addEventListener('load', () => {
    if (isHighlightMode && textLayer) {
      createTextLayer();
    }
  });
  
  // Salvar progresso ao sair
  window.addEventListener('beforeunload', saveProgress);
}

// ===== CARREGAR DADOS DO LIVRO =====
function loadBookData() {
  const stored = localStorage.getItem('biblioTecBooks');
  let book = null;
  
  if (stored) {
    try {
      const booksData = JSON.parse(stored);
      for (const carousel in booksData) {
        book = booksData[carousel].find(b => b.id === bookId);
        if (book) {
          bookData = book;
          break;
        }
      }
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    }
  }
  
  if (!bookData) {
    // Tentar carregar dos arrays padrão (se disponíveis)
    try {
      if (typeof recommended !== 'undefined') {
        const allBooks = [...(recommended || []), ...(library || []), ...(topRated || []), ...(newReleases || []), ...(popularNow || [])];
        bookData = allBooks.find(b => b.id === bookId);
      }
    } catch (e) {
      console.error('Erro ao carregar arrays padrão:', e);
    }
  }
  
  if (!bookData || !bookData.pdf) {
    alert('PDF não disponível para este livro!');
    window.location.href = 'home.html';
    return;
  }
  
  // Atualizar informações do livro
  bookTitle.textContent = bookData.title || 'Livro';
  bookAuthor.textContent = bookData.author || '';
  
  // Carregar progresso salvo
  const savedProgress = localStorage.getItem(`bookProgress_${bookId}`);
  if (savedProgress) {
    currentPage = parseInt(savedProgress) || 1;
  }
  
  // Carregar highlights
  const savedHighlights = localStorage.getItem(`bookHighlights_${bookId}`);
  if (savedHighlights) {
    highlights = JSON.parse(savedHighlights);
  }
  
  // Carregar PDF
  loadPDF(bookData.pdf);
}

// ===== CARREGAR PDF =====
function loadPDF(url) {
  pdfjsLib.getDocument(url).promise.then((pdf) => {
    pdfDoc = pdf;
    totalPages = pdf.numPages;
    totalPagesSpan.textContent = totalPages;
    
    // Ir para a página salva
    renderPage(currentPage);
    
    // Atualizar progresso
    updateProgress();
    
    // Adicionar ao carrossel "Continue Lendo"
    addToLibraryCarousel();
  }).catch((error) => {
    console.error('Erro ao carregar PDF:', error);
    alert('Erro ao carregar o PDF. Verifique se o link está correto.');
  });
}

// ===== RENDERIZAR PÁGINA =====
function renderPage(pageNum, direction = null) {
  if (!pdfDoc) return;
  
  // Remover animação anterior
  pageContainer.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
  
  // Adicionar animação de saída
  if (direction === 'prev') {
    pageContainer.classList.add('slide-out-right');
  } else if (direction === 'next') {
    pageContainer.classList.add('slide-out-left');
  }
  
  setTimeout(() => {
    pdfDoc.getPage(pageNum).then((page) => {
      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      
      page.render(renderContext).promise.then(() => {
        currentPage = pageNum;
        currentPageSpan.textContent = currentPage;
        
        // Atualizar botões
        btnPrev.disabled = currentPage <= 1;
        btnNext.disabled = currentPage >= totalPages;
        
        // Adicionar animação de entrada
        if (direction === 'prev') {
          pageContainer.classList.add('slide-in-left');
        } else if (direction === 'next') {
          pageContainer.classList.add('slide-in-right');
        }
        
        // Criar camada de texto se estiver em modo highlight
        if (isHighlightMode) {
          createTextLayer();
        }
        
        // Renderizar highlights
        renderHighlights();
        
        // Atualizar progresso
        updateProgress();
        
        // Salvar progresso
        saveProgress();
      });
    });
  }, direction ? 200 : 0);
}

// ===== MUDAR PÁGINA =====
function changePage(delta) {
  const newPage = currentPage + delta;
  if (newPage >= 1 && newPage <= totalPages) {
    const direction = delta > 0 ? 'next' : 'prev';
    renderPage(newPage, direction);
  }
}

// ===== ZOOM =====
function changeZoom(delta) {
  scale = Math.max(0.5, Math.min(3.0, scale + delta));
  zoomLevelSpan.textContent = Math.round(scale * 100) + '%';
  renderPage(currentPage);
  // Atualizar camada de texto se estiver em modo highlight
  if (isHighlightMode) {
    setTimeout(() => createTextLayer(), 100);
  }
}

// ===== PROGRESSO =====
function updateProgress() {
  const progress = (currentPage / totalPages) * 100;
  progressFill.style.width = progress + '%';
}

// ===== SALVAR PROGRESSO =====
function saveProgress() {
  if (bookId) {
    localStorage.setItem(`bookProgress_${bookId}`, currentPage.toString());
    
    // Calcular progresso percentual
    const progressPercent = Math.round((currentPage / totalPages) * 100);
    
    // Atualizar no localStorage dos livros
    const stored = localStorage.getItem('biblioTecBooks');
    if (stored) {
      try {
        const booksData = JSON.parse(stored);
        let updated = false;
        
        // Atualizar progresso em todos os carrosséis onde o livro aparece
        for (const carousel in booksData) {
          const bookIndex = booksData[carousel].findIndex(b => b.id === bookId);
          if (bookIndex !== -1) {
            booksData[carousel][bookIndex].progress = progressPercent;
            updated = true;
          }
        }
        
        // Se não estiver em "library", adicionar
        if (!booksData.library || !booksData.library.find(b => b.id === bookId)) {
          if (!booksData.library) booksData.library = [];
          const bookToAdd = { ...bookData, progress: progressPercent };
          booksData.library.push(bookToAdd);
          updated = true;
        }
        
        if (updated) {
          localStorage.setItem('biblioTecBooks', JSON.stringify(booksData));
          // Disparar evento para atualizar outras páginas
          window.dispatchEvent(new CustomEvent('booksUpdated'));
          
          // Sincronizar com a nuvem se disponível
          if (typeof saveBooksToCloud === 'function') {
            saveBooksToCloud(booksData).catch(err => {
              console.error('Erro ao sincronizar progresso:', err);
            });
          }
        }
      } catch (e) {
        console.error('Erro ao salvar progresso:', e);
      }
    }
  }
}

// ===== ADICIONAR AO CARROSSEL "CONTINUE LENDO" =====
function addToLibraryCarousel() {
  const stored = localStorage.getItem('biblioTecBooks');
  if (!stored) return;
  
  try {
    const booksData = JSON.parse(stored);
    if (!booksData.library) booksData.library = [];
    
    // Verificar se já está no carrossel
    const exists = booksData.library.find(b => b.id === bookId);
    if (!exists) {
      const progressPercent = Math.round((currentPage / totalPages) * 100);
      const bookToAdd = { ...bookData, progress: progressPercent };
      booksData.library.push(bookToAdd);
      localStorage.setItem('biblioTecBooks', JSON.stringify(booksData));
      window.dispatchEvent(new CustomEvent('booksUpdated'));
      
      // Sincronizar com a nuvem se disponível
      if (typeof saveBooksToCloud === 'function') {
        saveBooksToCloud(booksData).catch(err => {
          console.error('Erro ao sincronizar:', err);
        });
      }
    }
  } catch (e) {
    console.error('Erro ao adicionar ao carrossel:', e);
  }
}

// ===== HIGHLIGHTS =====
let isHighlightMode = false;
let selectedText = '';
let textLayer = null;

function toggleHighlightMode() {
  isHighlightMode = !isHighlightMode;
  btnHighlight.classList.toggle('active', isHighlightMode);
  
  if (isHighlightMode) {
    document.body.style.cursor = 'text';
    // Criar camada de texto se não existir
    if (!textLayer) {
      createTextLayer();
    }
  } else {
    document.body.style.cursor = 'default';
  }
}

async function createTextLayer() {
  if (!pdfDoc) return;
  
  try {
    const page = await pdfDoc.getPage(currentPage);
    const textContent = await page.getTextContent();
    const viewport = page.getViewport({ scale });
    
    // Criar div para texto invisível
    if (!textLayer) {
      textLayer = document.createElement('div');
      textLayer.className = 'text-layer';
      textLayer.style.position = 'absolute';
      textLayer.style.top = '0';
      textLayer.style.left = '0';
      textLayer.style.width = canvas.width + 'px';
      textLayer.style.height = canvas.height + 'px';
      textLayer.style.opacity = '0';
      textLayer.style.pointerEvents = isHighlightMode ? 'auto' : 'none';
      textLayer.style.userSelect = 'text';
      textLayer.style.webkitUserSelect = 'text';
      pageContainer.appendChild(textLayer);
    }
    
    textLayer.innerHTML = '';
    textLayer.style.width = canvas.width + 'px';
    textLayer.style.height = canvas.height + 'px';
    textLayer.style.pointerEvents = isHighlightMode ? 'auto' : 'none';
    
    // Renderizar texto usando a API do PDF.js
    const textDiv = document.createElement('div');
    textDiv.style.position = 'absolute';
    textDiv.style.left = '0';
    textDiv.style.top = '0';
    textDiv.style.width = canvas.width + 'px';
    textDiv.style.height = canvas.height + 'px';
    
    pdfjsLib.renderTextLayer({
      textContent: textContent,
      container: textDiv,
      viewport: viewport,
      textDivs: []
    });
    
    textLayer.appendChild(textDiv);
  } catch (e) {
    console.error('Erro ao criar camada de texto:', e);
  }
}

function handleTextSelection() {
  if (!isHighlightMode || !textLayer) return;
  
  setTimeout(() => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text.length > 0) {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        // Verificar se a seleção está dentro do canvas
        if (rect.left >= canvasRect.left && rect.right <= canvasRect.right &&
            rect.top >= canvasRect.top && rect.bottom <= canvasRect.bottom) {
          
          // Calcular posição relativa ao canvas
          const x = rect.left - canvasRect.left;
          const y = rect.top - canvasRect.top;
          const width = rect.width;
          const height = rect.height;
          
          // Criar highlight
          createHighlight(x, y, width, height, text, currentPage);
        }
      } catch (e) {
        console.error('Erro ao processar seleção:', e);
      }
      
      // Limpar seleção
      selection.removeAllRanges();
    }
  }, 10);
}

function createHighlight(x, y, width, height, text, page) {
  const highlight = {
    id: Date.now(),
    x: (x / canvas.width) * 100,
    y: (y / canvas.height) * 100,
    width: (width / canvas.width) * 100,
    height: (height / canvas.height) * 100,
    text: text,
    page: page
  };
  
  highlights.push(highlight);
  renderHighlights();
  saveHighlights();
}

function renderHighlights() {
  highlightsLayer.innerHTML = '';
  
  const pageHighlights = highlights.filter(h => h.page === currentPage);
  
  pageHighlights.forEach(highlight => {
    const highlightEl = document.createElement('div');
    highlightEl.className = 'highlight';
    highlightEl.style.left = highlight.x + '%';
    highlightEl.style.top = highlight.y + '%';
    highlightEl.style.width = highlight.width + '%';
    highlightEl.style.height = highlight.height + '%';
    highlightEl.title = highlight.text;
    highlightEl.addEventListener('click', () => {
      // Opção: mostrar texto completo ou remover
      console.log('Highlight:', highlight.text);
    });
    
    highlightsLayer.appendChild(highlightEl);
  });
}

function saveHighlights() {
  if (bookId) {
    localStorage.setItem(`bookHighlights_${bookId}`, JSON.stringify(highlights));
  }
}

// ===== BOOKMARK =====
function toggleBookmark() {
  const bookmarks = JSON.parse(localStorage.getItem(`bookBookmarks_${bookId}`) || '[]');
  const index = bookmarks.indexOf(currentPage);
  
  if (index > -1) {
    bookmarks.splice(index, 1);
    btnBookmark.classList.remove('active');
  } else {
    bookmarks.push(currentPage);
    btnBookmark.classList.add('active');
  }
  
  localStorage.setItem(`bookBookmarks_${bookId}`, JSON.stringify(bookmarks));
}

// ===== TECLADO =====
function handleKeyPress(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    changePage(-1);
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    changePage(1);
  } else if (e.key === 'Escape') {
    goBack();
  }
}

// ===== VOLTAR =====
function goBack() {
  saveProgress();
  window.location.href = `livro.html?id=${bookId}`;
}

