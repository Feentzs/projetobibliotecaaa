// ===== SISTEMA DE MODO ESCURO =====

// Carregar preferência salva
function loadDarkModePreference() {
  const saved = localStorage.getItem('darkMode');
  if (saved === 'true') {
    document.body.classList.add('dark-mode');
    return true;
  } else {
    document.body.classList.remove('dark-mode');
  }
  return false;
}

// Alternar modo escuro
function toggleDarkMode() {
  const isDark = document.body.classList.contains('dark-mode');
  
  if (isDark) {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
  } else {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
  }
  
  updateDarkModeButton();
}

// Atualizar ícone do botão
function updateDarkModeButton() {
  const btn = document.getElementById('theme-switch');
  if (!btn) return;
  
  const isDark = document.body.classList.contains('dark-mode');
  
  if (isDark) {
    btn.checked = true;
  } else {
    btn.checked = false;
  }
}

// Inicializar modo escuro
function initDarkMode() {
  loadDarkModePreference();
  
  // Procurar checkbox de tema
  const themeSwitch = document.getElementById('theme-switch');
  if (themeSwitch) {
    themeSwitch.addEventListener('change', toggleDarkMode);
    updateDarkModeButton();
  }
  
  // Procurar botão de tema no menu
  const themeToggleMenu = document.getElementById('theme-toggle-menu');
  if (themeToggleMenu) {
    themeToggleMenu.addEventListener('click', toggleDarkMode);
  }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
  initDarkMode();
}



