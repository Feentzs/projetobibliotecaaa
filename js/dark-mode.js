// ===== SISTEMA DE MODO ESCURO =====

// Carregar preferência salva
function loadDarkModePreference() {
  const saved = localStorage.getItem('darkMode');
  if (saved === 'true') {
    document.documentElement.setAttribute('data-theme', 'dark');
    return true;
  }
  return false;
}

// Alternar modo escuro
function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('darkMode', 'false');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('darkMode', 'true');
  }
  
  updateDarkModeButton();
}

// Atualizar ícone do botão
function updateDarkModeButton() {
  const btn = document.getElementById('darkModeToggle');
  if (!btn) return;
  
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const icon = btn.querySelector('svg');
  
  if (isDark) {
    // Ícone de sol (modo claro)
    if (icon) {
      icon.innerHTML = `
        <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      `;
    }
    btn.setAttribute('aria-label', 'Ativar modo claro');
  } else {
    // Ícone de lua (modo escuro)
    if (icon) {
      icon.innerHTML = `
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    }
    btn.setAttribute('aria-label', 'Ativar modo escuro');
  }
}

// Inicializar modo escuro
function initDarkMode() {
  loadDarkModePreference();
  
  // Adicionar botão toggle se não existir
  const existingBtn = document.getElementById('darkModeToggle');
  if (!existingBtn) {
    const header = document.querySelector('.site-header .nav');
    if (header) {
      const btn = document.createElement('button');
      btn.id = 'darkModeToggle';
      btn.className = 'dark-mode-toggle';
      btn.setAttribute('aria-label', 'Alternar modo escuro');
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      `;
      btn.addEventListener('click', toggleDarkMode);
      header.appendChild(btn);
    }
  } else {
    existingBtn.addEventListener('click', toggleDarkMode);
  }
  
  updateDarkModeButton();
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
  initDarkMode();
}



