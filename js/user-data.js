// ===== GESTÃO DE DADOS DO USUÁRIO =====

// Carregar dados do usuário do localStorage (obtidos no login)
function loadUserData() {
  const stored = localStorage.getItem('bibliotec_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Erro ao carregar dados do usuário:', e);
      return null;
    }
  }
  return null;
}

// Atualizar dados do usuário na tela
function updateUserUI() {
  const user = loadUserData();
  
  if (!user) {
    // Usuário não autenticado - esconder elementos de usuário
    const userElements = document.querySelectorAll('[data-user-content]');
    userElements.forEach(el => el.style.display = 'none');
    return;
  }

  // Atualizar informações do usuário na UI
  const username = document.getElementById('current-username');
  const useremail = document.getElementById('current-useremail');

  if (username) username.textContent = user.name || 'Usuário';
  if (useremail) useremail.textContent = user.email || 'usuario@exemplo.com';
}

// Logout do usuário
function logoutUser() {
  localStorage.removeItem('bibliotec_token');
  localStorage.removeItem('bibliotec_user');
  window.location.href = 'login.html';
}

// Inicializar UI do usuário
document.addEventListener('DOMContentLoaded', () => {
  updateUserUI();

  // Botão de logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
  }

  // Fechar menu ao clicar em um item
  const menuCheckbox = document.getElementById('menu_checkbox');
  if (menuCheckbox) {
    const menuItems = document.querySelectorAll('.menu-items .menu-item, #logout-btn');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        menuCheckbox.checked = false;
      });
    });
  }
});
