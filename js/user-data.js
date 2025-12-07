// Dados do usuário (simulado - em um sistema real, viria do backend)
const defaultUserData = {
  name: 'Maria Silva',
  email: 'maria.silva@email.com'
};

// Carregar ou criar dados do usuário
function loadUserData() {
  const stored = localStorage.getItem('userData');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return defaultUserData;
    }
  }
  
  // Salvar dados padrão
  localStorage.setItem('userData', JSON.stringify(defaultUserData));
  return defaultUserData;
}

// Atualizar dados do usuário
function updateUserData(newData) {
  const currentData = loadUserData();
  const updatedData = { ...currentData, ...newData };
  localStorage.setItem('userData', JSON.stringify(updatedData));
  
  // Disparar evento para outras abas/páginas
  window.dispatchEvent(new Event('userDataUpdated'));
  
  return updatedData;
}