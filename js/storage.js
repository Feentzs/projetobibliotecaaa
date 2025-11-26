

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3/b';

let JSONBIN_BIN_ID = $2a$10$ijxgoPq2BGCRfLvvRiwrlu1Su6Cmqyn9wXkh7HkE8A9Us7FC8VORq; // Coloque o ID do seu bin aqui
let JSONBIN_API_KEY = $2a$10$0JOzLi/jrpxmlitca/Q9v.j/vulrWo9U/xQFMzQQaaacjCvzviKiC; // Coloque sua Master Key aqui

// Se não configurado, o sistema usará apenas localStorage (funciona localmente)
const USE_CLOUD_STORAGE = JSONBIN_BIN_ID && JSONBIN_API_KEY && 
                          JSONBIN_BIN_ID !== 'biblioTecBooks' && 
                          JSONBIN_API_KEY !== '$2a$10$YOUR_API_KEY_HERE';

// ===== FUNÇÕES DE ARMAZENAMENTO =====

// Carregar dados do JSONBin (com fallback para localStorage)
async function loadBooksFromCloud() {
  // Se não estiver configurado, retornar null para usar localStorage
  if (!USE_CLOUD_STORAGE) {
    return null;
  }

  try {
    // Tentar carregar do JSONBin
    const response = await fetch(`${JSONBIN_API_URL}/${JSONBIN_BIN_ID}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': JSONBIN_API_KEY,
        'X-Bin-Meta': 'false'
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.record) {
        // Salvar também no localStorage como cache
        localStorage.setItem('biblioTecBooks', JSON.stringify(data.record));
        return data.record;
      }
    }
  } catch (error) {
    console.warn('Erro ao carregar do JSONBin, usando localStorage:', error);
  }

  // Fallback para localStorage
  const stored = localStorage.getItem('biblioTecBooks');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Erro ao parsear localStorage:', e);
    }
  }

  return null;
}

// Salvar dados no JSONBin
async function saveBooksToCloud(books) {
  // Se não estiver configurado, apenas salvar localmente
  if (!USE_CLOUD_STORAGE) {
    localStorage.setItem('biblioTecBooks', JSON.stringify(books));
    return false;
  }

  try {
    // Salvar no localStorage primeiro (cache local)
    localStorage.setItem('biblioTecBooks', JSON.stringify(books));

    // Tentar salvar no JSONBin
    const response = await fetch(`${JSONBIN_API_URL}/${JSONBIN_BIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY
      },
      body: JSON.stringify(books)
    });

    if (response.ok) {
      console.log('Dados salvos no JSONBin com sucesso!');
      return true;
    } else {
      console.warn('Erro ao salvar no JSONBin, mas dados salvos localmente');
      return false;
    }
  } catch (error) {
    console.error('Erro ao salvar no JSONBin:', error);
    // Dados já foram salvos no localStorage, então não é crítico
    return false;
  }
}

// Função de inicialização do bin (criar se não existir)
async function initializeBin() {
  const defaultData = {
    recommended: [],
    library: [],
    topRated: [],
    newReleases: [],
    popularNow: []
  };

  try {
    // Tentar criar o bin se não existir
    const response = await fetch(`${JSONBIN_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY,
        'X-Bin-Name': 'BiblioTec Books'
      },
      body: JSON.stringify(defaultData)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Bin criado com sucesso:', data);
      return data.metadata?.id;
    }
  } catch (error) {
    console.error('Erro ao criar bin:', error);
  }

  return null;
}

// ===== FUNÇÕES COMPATÍVEIS COM O CÓDIGO EXISTENTE =====

// Versão assíncrona para carregar dados
async function loadBooksAsync() {
  const data = await loadBooksFromCloud();
  if (data) {
    return data;
  }
  
  // Retornar estrutura vazia se não houver dados
  return {
    recommended: [],
    library: [],
    topRated: [],
    newReleases: [],
    popularNow: []
  };
}

// Versão síncrona (mantém compatibilidade)
function loadBooks() {
  const stored = localStorage.getItem('biblioTecBooks');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Erro ao carregar livros:', e);
    }
  }
  return {
    recommended: [],
    library: [],
    topRated: [],
    newReleases: [],
    popularNow: []
  };
}

// Versão assíncrona para salvar
async function saveBooksAsync(books) {
  await saveBooksToCloud(books);
}

// Versão síncrona (mantém compatibilidade, mas salva em background)
function saveBooks(books) {
  // Salvar no localStorage imediatamente
  localStorage.setItem('biblioTecBooks', JSON.stringify(books));
  
  // Salvar no JSONBin em background (não bloqueia a UI)
  saveBooksToCloud(books).catch(err => {
    console.error('Erro ao salvar em background:', err);
  });
}

// Exportar funções
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { loadBooks, saveBooks, loadBooksAsync, saveBooksAsync, loadBooksFromCloud, saveBooksToCloud };
}

