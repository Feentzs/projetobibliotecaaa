// ===== PAINEL DE ADMIN =====

class AdminPanel {
  constructor() {
    this.currentUser = null;
    this.isAdmin = false;
    this.books = [];
    this.users = [];
    this.reservations = [];
    this.currentPage = 'dashboard';
  }

  // ===== INICIALIZAÇÃO =====

  async init() {
    try {
      console.log('🔧 Inicializando AdminPanel...');
      
      // Verificar se usuário está logado
      const token = localStorage.getItem('bibliotec_token');
      const userData = JSON.parse(localStorage.getItem('bibliotec_user') || '{}');
      
      if (!token || !userData.id) {
        console.warn('❌ Token ou usuário não encontrado');
        window.location.href = '/login.html';
        return;
      }

      this.currentUser = userData;
      console.log('✅ Usuário encontrado:', userData.name);

      // Verificar se é admin
      const isAdmin = await adminApi.verifyAdminAccess();
      
      if (!isAdmin) {
        console.warn('❌ Acesso negado - não é admin');
        alert('Acesso negado. Apenas administradores podem acessar esta página.');
        window.location.href = '/home.html';
        return;
      }

      this.isAdmin = true;
      console.log('✅ Acesso de admin verificado');

      // Configurar página
      this.setupEventListeners();
      this.setupNavigation();
      this.setupThemeToggle();
      await this.loadDashboard();
      
      console.log('✅ AdminPanel inicializado com sucesso!');

    } catch (error) {
      console.error('❌ Erro ao inicializar painel:', error);
      alert('Erro ao carregar painel de administrador: ' + error.message);
      window.location.href = '/home.html';
    }
  }

  // ===== EVENT LISTENERS =====

  setupEventListeners() {
    console.log('🔧 Configurando event listeners...');
    
    // Buttons para modais
    const btnAddBook = document.getElementById('btnAddBook');
    const btnAddUser = document.getElementById('btnAddUser');
    
    console.log('btnAddBook:', btnAddBook);
    console.log('btnAddUser:', btnAddUser);
    
    if (btnAddBook) {
      btnAddBook.addEventListener('click', () => {
        console.log('✅ Clicado em btnAddBook');
        this.openBookModal();
      });
    }
    
    if (btnAddUser) {
      btnAddUser.addEventListener('click', () => {
        console.log('✅ Clicado em btnAddUser');
        this.openUserModal();
      });
    }

    // Fechar modais
    const closeBookBtn = document.getElementById('closeBookModal');
    const closeUserBtn = document.getElementById('closeUserModal');
    
    if (closeBookBtn) {
      closeBookBtn.addEventListener('click', () => this.closeBookModal());
    }
    
    if (closeUserBtn) {
      closeUserBtn.addEventListener('click', () => this.closeUserModal());
    }

    // Submissão de formulários
    const bookForm = document.getElementById('bookForm');
    const userForm = document.getElementById('userForm');
    
    if (bookForm) {
      bookForm.addEventListener('submit', (e) => this.handleBookSubmit(e));
    }
    
    if (userForm) {
      userForm.addEventListener('submit', (e) => this.handleUserSubmit(e));
    }

    // Fechar modal ao clicar fora (no overlay)
    window.addEventListener('click', (e) => {
      const bookModal = document.getElementById('bookModal');
      const userModal = document.getElementById('userModal');
      
      // Se clicou no modal inteiro (overlay)
      if (bookModal && e.target === bookModal) {
        this.closeBookModal();
      }
      if (userModal && e.target === userModal) {
        this.closeUserModal();
      }
    });

    // Fechar modal ao pressionar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeBookModal();
        this.closeUserModal();
      }
    });
    
    console.log('✅ Event listeners configurados!');
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('[data-tab]');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const tab = e.target.closest('[data-tab]')?.dataset.tab;
        if (tab) {
          navItems.forEach(i => i.classList.remove('active'));
          e.target.closest('[data-tab]').classList.add('active');
          this.navigateTo(tab);
        }
      });
    });
  }

  setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggleAdmin');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
          document.body.classList.remove('dark-mode');
          localStorage.setItem('theme', 'light');
        } else {
          document.body.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
        }
      });

      // Load saved theme preference
      const savedTheme = localStorage.getItem('theme') || 'light';
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }

  // ===== NAVEGAÇÃO =====

  async navigateTo(tab) {
    this.currentPage = tab;
    
    // Esconder todas as tabs
    document.querySelectorAll('.admin-tab-content').forEach(el => {
      el.classList.remove('active');
    });
    
    // Mostrar a tab selecionada
    const selectedTab = document.getElementById(`${tab}-tab`);
    if (selectedTab) {
      selectedTab.classList.add('active');
    }
    
    try {
      switch(tab) {
        case 'dashboard':
          await this.loadDashboard();
          break;
        case 'books':
          await this.loadBooks();
          break;
        case 'users':
          await this.loadUsers();
          break;
        case 'reservations':
          await this.loadReservations();
          break;
        default:
          await this.loadDashboard();
      }
    } catch (error) {
      console.error('Erro ao navegar:', error);
    }
  }

  // ===== DASHBOARD =====

  async loadDashboard() {
    try {
      const stats = await adminApi.getDashboardStats();
      
      // Atualizar valores do dashboard
      document.getElementById('totalBooksValue').textContent = stats.totalBooks || 0;
      document.getElementById('totalUsersValue').textContent = stats.totalUsers || 0;
      document.getElementById('weekReservationsValue').textContent = stats.weekReservations || 0;
      document.getElementById('topBookValue').textContent = stats.topBook || '—';
      
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  }

  // ===== LIVROS =====

  async loadBooks() {
    try {
      this.books = await adminApi.getAdminBooks();
      this.renderBooks();
    } catch (error) {
      console.error('Erro ao carregar livros:', error);
      const booksList = document.getElementById('booksList');
      if (booksList) {
        booksList.innerHTML = '<p>Erro ao carregar livros</p>';
      }
    }
  }

  renderBooks() {
    const booksList = document.getElementById('booksList');
    if (!booksList) return;
    
    let html = '<div class="books-grid">';

    this.books.forEach(book => {
      const coverUrl = book.cover_url || 'https://via.placeholder.com/200x300?text=Sem+Capa';
      html += `
        <div class="book-card">
          <div class="book-card-image">
            <img src="${coverUrl}" alt="${this.escapeHtml(book.title)}" style="opacity:0;transition:opacity 0.3s" onload="this.style.opacity=1" onerror="this.src='https://via.placeholder.com/200x300?text=Sem+Capa'" />
          </div>
          <div class="book-card-info">
            <h3>${this.escapeHtml(book.title)}</h3>
            <p class="book-author">${this.escapeHtml(book.author)}</p>
            <p class="book-genre">${book.genre || 'N/A'}</p>
            <div class="book-card-actions">
              <button class="btn btn-sm btn-edit" onclick="adminPanel.editBook(${book.id})">Editar</button>
              <button class="btn btn-sm btn-delete" onclick="adminPanel.deleteBook(${book.id})">Deletar</button>
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    booksList.innerHTML = html || '<p class="empty-state">Nenhum livro encontrado</p>';
  }

  editBook(bookId) {
    const book = this.books.find(b => b.id === bookId);
    if (book) {
      document.getElementById('bookId').value = book.id;
      document.getElementById('bookTitle').value = book.title;
      document.getElementById('bookAuthor').value = book.author;
      document.getElementById('bookISBN').value = book.isbn || '';
      document.getElementById('bookQuantity').value = book.quantity || 0;
      document.getElementById('bookModalTitle').textContent = 'Editar Livro';
      this.openBookModal();
    }
  }

  async deleteBook(bookId) {
    if (confirm('Tem certeza que deseja deletar este livro?')) {
      try {
        await adminApi.deleteAdminBook(bookId);
        alert('Livro deletado com sucesso!');
        this.loadBooks();
      } catch (error) {
        console.error('Erro ao deletar livro:', error);
        alert('Erro ao deletar livro');
      }
    }
  }

  // ===== MODAL DE LIVRO =====

  openBookModal() {
    // Limpar formulário para novo livro
    document.getElementById('bookId').value = '';
    document.getElementById('bookForm').reset();
    document.getElementById('bookModalTitle').textContent = 'Novo Livro';
    document.getElementById('bookRating').value = '4';
    const modal = document.getElementById('bookModal');
    if (modal) {
      modal.classList.add('active');
    }
    console.log('📖 openBookModal - modal:', modal);
  }

  closeBookModal() {
    const modal = document.getElementById('bookModal');
    if (modal) {
      modal.classList.remove('active');
    }
    console.log('📖 closeBookModal');
  }

  async handleBookSubmit(e) {
    e.preventDefault();

    const bookId = document.getElementById('bookId').value;
    const bookData = {
      title: document.getElementById('bookTitle').value,
      author: document.getElementById('bookAuthor').value,
      genre: document.getElementById('bookGenre').value,
      rating: parseFloat(document.getElementById('bookRating').value),
      cover_url: document.getElementById('bookCover').value,
      pages: parseInt(document.getElementById('bookPages').value) || 0,
      description: document.getElementById('bookDescription').value
    };

    try {
      if (bookId) {
        // Editar
        await adminApi.updateAdminBook(bookId, bookData);
        alert('Livro atualizado com sucesso!');
      } else {
        // Criar novo
        await adminApi.createAdminBook(bookData);
        alert('Livro criado com sucesso!');
      }

      this.closeBookModal();
      this.loadBooks();
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      alert('Erro ao salvar livro: ' + error.message);
    }
  }

  // ===== USUÁRIOS =====

  async loadUsers() {
    try {
      this.users = await adminApi.getAdminUsers();
      this.renderUsers();
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      const usersList = document.getElementById('usersList');
      if (usersList) {
        usersList.innerHTML = '<p>Erro ao carregar usuários</p>';
      }
    }
  }

  renderUsers() {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;
    
    let html = '';

    this.users.forEach(user => {
      const isAdmin = user.is_superuser ? 'Sim' : 'Não';
      html += `
        <div class="user-item">
          <div class="user-info">
            <h3>${this.escapeHtml(user.name)}</h3>
            <p>Email: ${this.escapeHtml(user.email)}</p>
            <p>Telefone: ${user.phone || 'N/A'}</p>
            <p>Admin: ${isAdmin}</p>
          </div>
          <div class="user-actions">
            <button class="btn btn-sm btn-delete" onclick="adminPanel.deleteUser(${user.id})">Deletar</button>
          </div>
        </div>
      `;
    });

    usersList.innerHTML = html || '<p>Nenhum usuário encontrado</p>';
  }

  async deleteUser(userId) {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await adminApi.deleteAdminUser(userId);
        alert('Usuário deletado com sucesso!');
        this.loadUsers();
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        alert('Erro ao deletar usuário');
      }
    }
  }

  // ===== MODAL DE USUÁRIO =====

  openUserModal() {
    document.getElementById('userForm').reset();
    const modal = document.getElementById('userModal');
    if (modal) {
      modal.classList.add('active');
    }
    console.log('👥 openUserModal - modal:', modal);
  }

  closeUserModal() {
    const modal = document.getElementById('userModal');
    if (modal) {
      modal.classList.remove('active');
    }
    console.log('👥 closeUserModal');
  }

  async handleUserSubmit(e) {
    e.preventDefault();

    const userData = {
      name: document.getElementById('userName').value,
      email: document.getElementById('userEmail').value,
      password: document.getElementById('userPassword').value
    };

    try {
      await adminApi.createAdminUser(userData);
      alert('Usuário criado com sucesso!');
      this.closeUserModal();
      this.loadUsers();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      alert('Erro ao criar usuário: ' + error.message);
    }
  }

  // ===== RESERVAS =====

  async loadReservations() {
    try {
      this.reservations = await adminApi.getAdminReservations();
      this.renderReservations();
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
      const reservationsList = document.getElementById('reservationsList');
      if (reservationsList) {
        reservationsList.innerHTML = '<p>Erro ao carregar reservas</p>';
      }
    }
  }

  renderReservations() {
    const reservationsList = document.getElementById('reservationsList');
    if (!reservationsList) return;
    
    let html = '';

    this.reservations.forEach(reservation => {
      html += `
        <div class="reservation-item">
          <div class="reservation-info">
            <h3>${this.escapeHtml(reservation.name || reservation.userName || 'N/A')}</h3>
            <p><strong>Email:</strong> ${this.escapeHtml(reservation.email || 'N/A')}</p>
            <p><strong>Livro:</strong> ${this.escapeHtml(reservation.title || reservation.bookTitle || 'N/A')}</p>
            <p><strong>Autor:</strong> ${this.escapeHtml(reservation.author || 'N/A')}</p>
            <p><strong>Data da Reserva:</strong> ${this.formatDate(reservation.added_at || reservation.created_at)}</p>
            <p><strong>Status:</strong> ${this.escapeHtml(reservation.status || 'Ativo')}</p>
          </div>
          <div class="reservation-actions">
            <button class="btn btn-sm btn-delete" onclick="adminPanel.deleteReservation(${reservation.id})">Cancelar</button>
          </div>
        </div>
      `;
    });

    reservationsList.innerHTML = html || '<p>Nenhuma reserva encontrada</p>';
  }

  async deleteReservation(reservationId) {
    if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
      try {
        await adminApi.deleteAdminReservation(reservationId);
        alert('Reserva cancelada com sucesso!');
        this.loadReservations();
      } catch (error) {
        console.error('Erro ao cancelar reserva:', error);
        alert('Erro ao cancelar reserva');
      }
    }
  }

  // ===== UTILITÁRIOS =====

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  logout() {
    localStorage.removeItem('bibliotec_token');
    localStorage.removeItem('bibliotec_user');
    window.location.href = '/login.html';
  }
}

// Criar instância global
const adminPanel = new AdminPanel();

// Inicializar quando página carregar
document.addEventListener('DOMContentLoaded', () => {
  adminPanel.init();
});
