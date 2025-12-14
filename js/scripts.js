// ===== MIGRAÇÃO DA BARRA DE PESQUISA DO HEADER =====
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
  const allBooks = []; // Livros seriam carregados de outro lugar
  
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

function navigateToBook(bookId) {
  window.location.href = `livro.html?id=${bookId}`;
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
    
    // Atualizar switch - CORREÇÃO: checked = isDark (modo escuro ativo)
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
      
      // Atualizar tema - CORREÇÃO: lógica simplificada
      if (darkModeStyle) {
        // Se o switch está marcado (checked) → ativar modo escuro
        darkModeStyle.disabled = !isDark;
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        console.log('Modo escuro ativo:', isDark);
        console.log('darkModeStyle.disabled:', darkModeStyle.disabled);
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
  
  // Configurar conta
  if (accountBtn) {
    accountBtn.addEventListener('click', function() {
      closeMenu();
      window.location.href = 'account.html';
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

// ===== SISTEMA DE TEMA ESCURO =====
function initDarkMode() {
  const themeToggle = document.getElementById('theme-toggle');
  const darkModeStyle = document.getElementById('dark-mode-style');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  
  if (!darkModeStyle) return;
  
  // Verificar preferência salva
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Aplicar tema salvo ou preferência do sistema
  if (savedTheme === 'light') {
    darkModeStyle.disabled = true;
    updateThemeIcon(false);
    console.log('Tema: claro (salvo)');
  } else if (savedTheme === 'dark') {
    darkModeStyle.disabled = false;
    updateThemeIcon(true);
    console.log('Tema: escuro (salvo)');
  } else if (prefersDark) {
    // Se não tiver preferência salva, usar preferência do sistema
    darkModeStyle.disabled = false;
    localStorage.setItem('theme', 'dark');
    updateThemeIcon(true);
    console.log('Tema: escuro (sistema)');
  } else {
    darkModeStyle.disabled = true;
    localStorage.setItem('theme', 'light');
    updateThemeIcon(false);
    console.log('Tema: claro (padrão)');
  }
  
  // Aplicar tema inicial
  applyDarkModeTheme(!darkModeStyle.disabled);
  
  // Sincronizar com o switch do menu hambúrguer se existir
  const themeSwitch = document.getElementById('theme-switch');
  if (themeSwitch) {
    // Atualizar o switch para refletir o estado atual
    // Se modo escuro ativo (darkModeStyle.disabled = false) → switch checked = true
    themeSwitch.checked = !darkModeStyle.disabled;
    
    console.log('Switch inicializado para:', themeSwitch.checked ? 'ON (escuro)' : 'OFF (claro)');
    
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
      const isDark = darkModeStyle.disabled; // Se disabled = true, está no modo claro
      
      console.log('Botão tema clicado. Modo escuro atual:', !isDark);
      
      if (isDark) {
        // Ativar modo escuro (darkModeStyle.disabled = false)
        darkModeStyle.disabled = false;
        localStorage.setItem('theme', 'dark');
        updateThemeIcon(true);
        console.log('Mudando para modo escuro');
      } else {
        // Ativar modo claro (darkModeStyle.disabled = true)
        darkModeStyle.disabled = true;
        localStorage.setItem('theme', 'light');
        updateThemeIcon(false);
        console.log('Mudando para modo claro');
      }
      
      // Sincronizar com o switch do menu hambúrguer
      if (themeSwitch) {
        themeSwitch.checked = !darkModeStyle.disabled; // Ativo = checked
      }
      
      // Aplicar mudanças visuais
      applyDarkModeTheme(!isDark);
      
      // Recarregar a página para garantir que todas as mudanças sejam aplicadas
      setTimeout(() => {
        location.reload();
      }, 300);
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
    console.log('Aplicando tema:', isDark ? 'escuro' : 'claro');
    
    // 1. Trocar logo do header
    const headerLogo = document.getElementById('header-logo');
    if (headerLogo) {
      headerLogo.src = isDark ? 'images/logo-dark.svg' : 'images/logo-light.svg';
      console.log('Logo do header atualizado:', headerLogo.src);
    }
    
    // 2. Trocar imagem da ilustração do hero
    const logoCenter = document.querySelector('.logo-center');
    if (logoCenter) {
      logoCenter.src = isDark ? './images/ilustdark.png' : './images/ilust1.webp';
      console.log('Ilustração do hero atualizada:', logoCenter.src);
    }
    
    // 3. Trocar logo no hero-content
    const heroLogo = document.querySelector('.hero-content .header-logo');
    if (heroLogo) {
      heroLogo.src = isDark ? './images/logo-dark.svg' : './images/logo-light.svg';
      console.log('Logo do hero atualizado:', heroLogo.src);
    }
    
    // 4. Aplicar classe dark-mode ao body para estilos CSS
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // 5. Atualizar imagens dos estados vazios
    updateEmptyStateImages();
    
    console.log('Classe dark-mode no body:', document.body.classList.contains('dark-mode'));
  }
}

// ===== MODAL DE REGISTRO NA PÁGINA DE LOGIN =====
function initSignupModal() {
  const signupLink = document.getElementById('signup-link');
  const loginLink = document.getElementById('login-link');
  const closeSignup = document.getElementById('closeSignup');
  const signupModal = document.getElementById('signupModal');
  const signupForm = document.getElementById('signup-form');
  
  if (!signupLink || !signupModal) return;
  
  // Inicializar animação dos inputs do modal
  initModalInputs();
  
  // Abrir modal
  signupLink.addEventListener('click', function(e) {
    e.preventDefault();
    signupModal.style.display = 'flex';
    // Pequeno delay para ativar a animação
    setTimeout(() => {
      signupModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Previne scroll da página principal
    }, 10);
  });
  
  // Fechar modal com botão X
  if (closeSignup) {
    closeSignup.addEventListener('click', function(e) {
      e.preventDefault();
      closeModal();
    });
  }
  
  // Fechar modal com link "Voltar ao Login"
  if (loginLink) {
    loginLink.addEventListener('click', function(e) {
      e.preventDefault();
      closeModal();
    });
  }
  
  // Fechar modal clicando fora
  signupModal.addEventListener('click', function(e) {
    if (e.target === signupModal) {
      closeModal();
    }
  });
  
  // Fechar modal com ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && signupModal.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Função para fechar modal
  function closeModal() {
    signupModal.classList.remove('active');
    setTimeout(() => {
      signupModal.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restaura scroll
    }, 300); // Tempo da animação
  }
  
  // Validação do formulário
  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      const confirm = document.getElementById('signup-confirm').value;
      
      // Validações básicas
      if (!name || !email || !password || !confirm) {
        showFormError('Por favor, preencha todos os campos!');
        return;
      }
      
      if (password !== confirm) {
        showFormError('As senhas não coincidem!');
        return;
      }
      
      if (password.length < 6) {
        showFormError('A senha deve ter pelo menos 6 caracteres!');
        return;
      }
      
      if (!validateEmail(email)) {
        showFormError('Por favor, insira um email válido!');
        return;
      }
      
      // Aqui você pode adicionar a lógica de registro
      console.log('Registrando:', { name, email, password });
      
      // Simular registro bem-sucedido
      showFormSuccess('Conta criada com sucesso! Faça login com suas credenciais.');
      
      // Limpar formulário
      signupForm.reset();
      resetModalInputs();
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        closeModal();
      }, 2000);
    });
  }
  
  // Adicionar validação em tempo real para "Confirmar Senha"
  const confirmInput = document.getElementById('signup-confirm');
  if (confirmInput) {
    confirmInput.addEventListener('input', function() {
      const password = document.getElementById('signup-password').value;
      const confirm = this.value;
      
      if (confirm.length > 0 && password !== confirm) {
        this.classList.add('error');
        this.parentElement.classList.add('error');
      } else {
        this.classList.remove('error');
        this.parentElement.classList.remove('error');
      }
    });
  }
  
  // Inicializar animação dos inputs do modal
  function initModalInputs() {
    const modalInputs = signupModal.querySelectorAll('.input-contain input');
    
    modalInputs.forEach(input => {
      // Verificar se já tem valor
      if (input.value) {
        input.parentElement.classList.add('has-value');
      }
      
      input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
      });
      
      input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
        if (this.value) {
          this.parentElement.classList.add('has-value');
        } else {
          this.parentElement.classList.remove('has-value');
        }
      });
      
      input.addEventListener('input', function() {
        if (this.value) {
          this.parentElement.classList.add('has-value');
        } else {
          this.parentElement.classList.remove('has-value');
        }
      });
    });
  }
  
  // Resetar animação dos inputs
  function resetModalInputs() {
    const modalInputs = signupModal.querySelectorAll('.input-contain');
    modalInputs.forEach(container => {
      container.classList.remove('has-value', 'focused');
    });
  }
  
  // Funções auxiliares
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  function showFormError(message) {
    // Remover mensagens anteriores
    removeExistingMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.textContent = message;
    
    // Inserir após o título do modal
    const modalTitle = document.querySelector('.modal-title');
    if (modalTitle) {
      modalTitle.parentNode.insertBefore(errorDiv, modalTitle.nextSibling);
    }
  }
  
  function showFormSuccess(message) {
    // Remover mensagens anteriores
    removeExistingMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success-message';
    successDiv.textContent = message;
    
    // Inserir após o título do modal
    const modalTitle = document.querySelector('.modal-title');
    if (modalTitle) {
      modalTitle.parentNode.insertBefore(successDiv, modalTitle.nextSibling);
    }
  }
  
  function removeExistingMessages() {
    const existingErrors = document.querySelectorAll('.form-error-message, .form-success-message');
    existingErrors.forEach(msg => msg.remove());
  }
}

// ===== ATUALIZAR IMAGENS DOS ESTADOS VAZIOS =====
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

// ===== INIT MOBILE BOTTOM NAV =====
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

// ===== ANIMAÇÃO DOS INPUTS DO LOGIN =====
function initLoginInputs() {
  const loginInputs = document.querySelectorAll('#login-form .input-contain input');
  
  loginInputs.forEach(input => {
    // Verificar se já tem valor
    if (input.value) {
      input.parentElement.classList.add('has-value');
    }
    
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
      if (this.value) {
        this.parentElement.classList.add('has-value');
      } else {
        this.parentElement.classList.remove('has-value');
      }
    });
    
    input.addEventListener('input', function() {
      if (this.value) {
        this.parentElement.classList.add('has-value');
      } else {
        this.parentElement.classList.remove('has-value');
      }
    });
  });
}

// ===== INICIALIZAÇÃO GERAL =====
function initAll() {
  // Inicializar sistema de pesquisa (se estiver na página correta)
  if (document.querySelector('.search') || document.querySelector('.header-search')) {
    initSearch();
    initSearchMigration();
    initMobileBottomNav();
  }
  
  // Inicializar menu do usuário (se existir)
  if (document.getElementById('menu_checkbox')) {
    initUserMenu();
  }
  
  // Inicializar sistema de tema escuro
  initDarkMode();
  
  // Inicializar modal de registro (se estiver na página de login)
  if (document.getElementById('signupModal')) {
    initSignupModal();
  }
  
  // Inicializar animação dos inputs do login
  if (document.getElementById('login-form')) {
    initLoginInputs();
  }
  
  console.log('Sistema inicializado com sucesso!');
}

// ===== INICIALIZAR QUANDO O DOM ESTIVER PRONTO =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

// ===== FUNÇÕES AUXILIARES GLOBAIS =====
window.BiblioTec = window.BiblioTec || {};

window.BiblioTec.utils = {
  showToast: function(message, type = 'info') {
    // Implementar toast notifications se necessário
    console.log(`${type.toUpperCase()}: ${message}`);
  },
  
  formatDate: function(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  },
  
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};