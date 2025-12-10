// Admin Panel Manager
class AdminManager {
  constructor() {
    this.api = window.BiblioTecAPI;
    this.books = [];
    this.users = [];
    this.reservations = [];
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupThemeToggle();
    this.restoreSidebarState();
    this.loadDashboardData();
  }

  restoreSidebarState() {
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const sidebar = document.getElementById('adminSidebar');
    if (sidebarCollapsed) {
      sidebar.classList.add('collapsed');
    }
  }

  setupEventListeners() {
    // Sidebar toggle
    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    if (sidebarToggleBtn) {
      sidebarToggleBtn.addEventListener('click', () => this.toggleSidebar());
    }

    // Tab navigation
    document.querySelectorAll('.sidebar-item').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchTab(e.target.closest('.sidebar-item')));
    });

    // Books section
    document.getElementById('btnAddBook').addEventListener('click', () => this.openBookModal());
    document.getElementById('closeBookModal').addEventListener('click', () => this.closeBookModal());
    document.getElementById('bookForm').addEventListener('submit', (e) => this.handleBookSubmit(e));
    document.getElementById('bookSearchInput').addEventListener('input', (e) => this.filterBooks(e.target.value));

    // Users section
    document.getElementById('btnAddUser').addEventListener('click', () => this.openUserModal());
    document.getElementById('closeUserModal').addEventListener('click', () => this.closeUserModal());
    document.getElementById('userForm').addEventListener('submit', (e) => this.handleUserSubmit(e));
    document.getElementById('userSearchInput').addEventListener('input', (e) => this.filterUsers(e.target.value));

    // Reservations section
    document.getElementById('reservationSearchInput').addEventListener('input', (e) => this.filterReservations(e.target.value));

    // Modal overlay close
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          e.target.closest('.modal').classList.remove('active');
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
          document.body.classList.add('light-mode');
          localStorage.setItem('theme', 'light');
        } else {
          document.body.classList.remove('light-mode');
          document.body.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
        }
      });

      // Load saved theme preference
      const savedTheme = localStorage.getItem('theme') || 'dark';
      document.body.classList.remove('light-mode', 'dark-mode');
      document.body.classList.add(savedTheme + '-mode');
    }
  }

  toggleSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const isCollapsed = sidebar.classList.toggle('collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  }

  switchTab(tabElement) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.sidebar-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

    // Add active class to clicked tab and corresponding content
    tabElement.classList.add('active');
    const tabName = tabElement.dataset.tab;
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Load data for the tab if needed
    if (tabName === 'books') this.loadBooks();
    if (tabName === 'users') this.loadUsers();
    if (tabName === 'reservations') this.loadReservations();
  }

  // ===== DASHBOARD =====
  async loadDashboardData() {
    try {
      // Load all data
      await Promise.all([
        this.loadBooks(),
        this.loadUsers(),
        this.loadReservations()
      ]);

      // Update hero cards
      document.getElementById('totalBooksValue').textContent = this.books.length;
      document.getElementById('totalUsersValue').textContent = this.users.length;

      // Calculate this week's reservations
      const thisWeekReservations = this.getThisWeekReservations();
      document.getElementById('weekReservationsValue').textContent = thisWeekReservations.length;

      // Get top book
      const topBook = this.getTopBook();
      document.getElementById('topBookValue').textContent = topBook ? topBook.title.substring(0, 30) : '—';

      // Initialize charts
      this.initializeCharts();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  getThisWeekReservations() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return this.reservations.filter(r => {
      const reserveDate = new Date(r.reserve_date || r.created_at);
      return reserveDate >= oneWeekAgo;
    });
  }

  getTopBook() {
    if (this.reservations.length === 0) return null;

    const bookReservationCount = {};
    this.reservations.forEach(r => {
      bookReservationCount[r.book_id] = (bookReservationCount[r.book_id] || 0) + 1;
    });

    const topBookId = Object.keys(bookReservationCount).reduce((a, b) =>
      bookReservationCount[a] > bookReservationCount[b] ? a : b
    );

    return this.books.find(b => b.id == topBookId);
  }

  initializeCharts() {
    this.createReservationsChart();
    this.createTopBooksChart();
  }

  createReservationsChart() {
    const ctx = document.getElementById('reservationsChart');
    if (!ctx) return;

    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const data = new Array(7).fill(0);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    this.reservations.forEach(r => {
      const reserveDate = new Date(r.reserve_date || r.created_at);
      if (reserveDate >= oneWeekAgo) {
        const dayIndex = reserveDate.getDay();
        data[dayIndex]++;
      }
    });

    if (window.reservationsChartInstance) {
      window.reservationsChartInstance.data.datasets[0].data = data;
      window.reservationsChartInstance.update();
    } else {
      window.reservationsChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: days,
          datasets: [{
            label: 'Reservas',
            data: data,
            borderColor: '#6750a4',
            backgroundColor: 'rgba(103, 80, 164, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: '#6750a4',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }
  }

  createTopBooksChart() {
    const ctx = document.getElementById('topBooksChart');
    if (!ctx) return;

    const bookReservationCount = {};
    this.reservations.forEach(r => {
      bookReservationCount[r.book_id] = (bookReservationCount[r.book_id] || 0) + 1;
    });

    const topBooks = Object.entries(bookReservationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const labels = topBooks.map(([bookId]) => {
      const book = this.books.find(b => b.id == bookId);
      return book ? book.title.substring(0, 20) : 'Desconhecido';
    });

    const data = topBooks.map(([, count]) => count);

    if (window.topBooksChartInstance) {
      window.topBooksChartInstance.data.labels = labels;
      window.topBooksChartInstance.data.datasets[0].data = data;
      window.topBooksChartInstance.update();
    } else {
      window.topBooksChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Reservas',
            data: data,
            backgroundColor: '#6750a4',
            borderColor: '#6750a4',
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      });
    }
  }

  // ===== BOOKS MANAGEMENT =====
  async loadBooks() {
    try {
      const response = await this.api.getBooks();
      this.books = Array.isArray(response) ? response : [];
      
      // Se não houver livros da API, tenta carregar do localStorage
      if (this.books.length === 0) {
        const stored = localStorage.getItem('biblioTecBooks');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed) {
              // Flatten the structure if it's organized by carousels
              if (typeof parsed === 'object' && !Array.isArray(parsed)) {
                this.books = Object.values(parsed).flat();
              } else {
                this.books = parsed;
              }
            }
          } catch (e) {
            console.warn('Could not parse stored books');
          }
        }
      }
      
      this.renderBooks();
      
      if (this.books.length === 0) {
        this.showEmptyState('booksList', 'Nenhum livro no catálogo. Adicione um novo livro para começar.');
      }
    } catch (error) {
      console.error('Error loading books:', error);
      this.showEmptyState('booksList', 'Erro ao carregar livros');
    }
  }

  renderBooks(books = this.books) {
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = '';

    if (books.length === 0) {
      this.showEmptyState('booksList', 'Nenhum livro no catálogo');
      return;
    }

    books.forEach(book => {
      const item = document.createElement('div');
      item.className = 'list-item';
      item.innerHTML = `
        <img src="${book.cover_url || 'images/placeholder.jpg'}" alt="${book.title}" class="list-item-image">
        <div class="list-item-content">
          <h3 class="list-item-title">${book.title}</h3>
          <p class="list-item-subtitle">${book.author}</p>
          <div class="list-item-meta">
            <div class="list-item-meta-item">
              <span class="list-item-meta-label">Gênero</span>
              <span class="list-item-meta-value">${book.genre || '—'}</span>
            </div>
            <div class="list-item-meta-item">
              <span class="list-item-meta-label">Páginas</span>
              <span class="list-item-meta-value">${book.pages || '—'}</span>
            </div>
            <div class="list-item-meta-item">
              <span class="list-item-meta-label">Avaliação</span>
              <span class="list-item-meta-value">⭐ ${book.rating || '0'}</span>
            </div>
          </div>
        </div>
        <div class="list-item-actions">
          <button class="btn btn-sm btn-primary" onclick="adminManager.openBookModal(${book.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="adminManager.deleteBook(${book.id})">Deletar</button>
        </div>
      `;
      booksList.appendChild(item);
    });
  }

  filterBooks(searchTerm) {
    const filtered = this.books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (book.genre && book.genre.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    this.renderBooks(filtered);
  }

  openBookModal(bookId = null) {
    const modal = document.getElementById('bookModal');
    const form = document.getElementById('bookForm');

    // Reset form
    form.reset();
    document.getElementById('bookId').value = '';

    if (bookId) {
      const book = this.books.find(b => b.id === bookId);
      if (book) {
        document.getElementById('bookModalTitle').textContent = 'Editar Livro';
        document.getElementById('bookId').value = book.id;
        document.getElementById('bookTitle').value = book.title;
        document.getElementById('bookAuthor').value = book.author;
        document.getElementById('bookGenre').value = book.genre;
        document.getElementById('bookRating').value = book.rating;
        document.getElementById('bookCover').value = book.cover_url;
        document.getElementById('bookPages').value = book.pages || '';
        document.getElementById('bookDescription').value = book.description || '';
      }
    } else {
      document.getElementById('bookModalTitle').textContent = 'Adicionar Novo Livro';
    }

    modal.classList.add('active');
  }

  closeBookModal() {
    document.getElementById('bookModal').classList.remove('active');
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
      pages: document.getElementById('bookPages').value ? parseInt(document.getElementById('bookPages').value) : null,
      description: document.getElementById('bookDescription').value
    };

    try {
      if (bookId) {
        await this.api.updateBook(bookId, bookData);
      } else {
        await this.api.addBook(bookData);
      }

      this.closeBookModal();
      await this.loadBooks();
      this.showNotification('Livro salvo com sucesso!');
    } catch (error) {
      console.error('Error saving book:', error);
      this.showNotification('Erro ao salvar livro', 'error');
    }
  }

  async deleteBook(bookId) {
    if (confirm('Tem certeza que deseja deletar este livro?')) {
      try {
        await this.api.deleteBook(bookId);
        await this.loadBooks();
        this.showNotification('Livro deletado com sucesso!');
      } catch (error) {
        console.error('Error deleting book:', error);
        this.showNotification('Erro ao deletar livro', 'error');
      }
    }
  }

  // ===== USERS MANAGEMENT =====
  async loadUsers() {
    try {
      // Try to load from API first
      try {
        const response = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          this.users = await response.json();
          if (Array.isArray(this.users)) {
            this.renderUsers();
            return;
          }
        }
      } catch (apiError) {
        console.warn('API users endpoint not available');
      }

      // Fallback 1: try to load test users from localStorage
      const testUsers = localStorage.getItem('testUsers');
      if (testUsers) {
        try {
          this.users = JSON.parse(testUsers);
          if (Array.isArray(this.users) && this.users.length > 0) {
            this.renderUsers();
            return;
          }
        } catch (e) {
          console.warn('Could not parse test users');
        }
      }

      // Fallback 2: create a demo user from userData localStorage
      const userData = localStorage.getItem('userData');
      this.users = [];
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.users.push({
            id: 1,
            name: user.name || 'Usuário Demo',
            email: user.email || 'demo@bibliotec.com',
            active: true,
            created_at: new Date().toISOString()
          });
        } catch (e) {
          console.warn('Could not parse user data');
        }
      }
      
      this.renderUsers();
      
      if (this.users.length === 0) {
        this.showEmptyState('usersList', 'Nenhum usuário encontrado. Crie um novo usuário para começar.');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
      this.showEmptyState('usersList', 'Erro ao carregar usuários');
    }
  }

  renderUsers(users = this.users) {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';

    if (users.length === 0) {
      this.showEmptyState('usersList', 'Nenhum usuário encontrado');
      return;
    }

    users.forEach(user => {
      const item = document.createElement('div');
      item.className = 'list-item';
      item.innerHTML = `
        <div class="list-item-content" style="flex: 1;">
          <h3 class="list-item-title">${user.name}</h3>
          <p class="list-item-subtitle">${user.email}</p>
          <div class="list-item-meta">
            <div class="list-item-meta-item">
              <span class="list-item-meta-label">Status</span>
              <span class="status-badge ${user.active ? 'status-active' : 'status-inactive'}">
                ${user.active ? 'Ativo' : 'Inativo'}
              </span>
            </div>
            <div class="list-item-meta-item">
              <span class="list-item-meta-label">Cadastro</span>
              <span class="list-item-meta-value">${this.formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>
        <div class="list-item-actions">
          <button class="btn btn-sm btn-primary" onclick="adminManager.openUserModal(${user.id})">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="adminManager.deleteUser(${user.id})">Deletar</button>
        </div>
      `;
      usersList.appendChild(item);
    });
  }

  filterUsers(searchTerm) {
    const filtered = this.users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    this.renderUsers(filtered);
  }

  openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');

    form.reset();
    document.getElementById('userId').value = '';
    document.getElementById('userPassword').required = true;

    if (userId) {
      const user = this.users.find(u => u.id === userId);
      if (user) {
        document.getElementById('userModalTitle').textContent = 'Editar Usuário';
        document.getElementById('userId').value = user.id;
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPassword').required = false;
        document.getElementById('userPassword').placeholder = 'Deixe em branco para manter a senha';
      }
    } else {
      document.getElementById('userModalTitle').textContent = 'Adicionar Novo Usuário';
    }

    modal.classList.add('active');
  }

  closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
  }

  async handleUserSubmit(e) {
    e.preventDefault();

    const userId = document.getElementById('userId').value;
    const userData = {
      name: document.getElementById('userName').value,
      email: document.getElementById('userEmail').value
    };

    const password = document.getElementById('userPassword').value;
    if (password) {
      userData.password = password;
    }

    try {
      if (userId) {
        await fetch(`/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(userData)
        });
      } else {
        if (!password) {
          this.showNotification('Senha é obrigatória para novos usuários', 'error');
          return;
        }

        await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(userData)
        });
      }

      this.closeUserModal();
      await this.loadUsers();
      this.showNotification('Usuário salvo com sucesso!');
    } catch (error) {
      console.error('Error saving user:', error);
      this.showNotification('Erro ao salvar usuário', 'error');
    }
  }

  async deleteUser(userId) {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        await this.loadUsers();
        this.showNotification('Usuário deletado com sucesso!');
      } catch (error) {
        console.error('Error deleting user:', error);
        this.showNotification('Erro ao deletar usuário', 'error');
      }
    }
  }

  // ===== RESERVATIONS MANAGEMENT =====
  async loadReservations() {
    try {
      try {
        const response = await fetch('/api/reservations', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          this.reservations = await response.json();
          if (Array.isArray(this.reservations)) {
            this.renderReservations();
            return;
          }
        }
      } catch (apiError) {
        console.warn('API reservations endpoint not available');
      }

      // Fallback: try to load test reservations from localStorage
      const testReservations = localStorage.getItem('testReservations');
      if (testReservations) {
        try {
          this.reservations = JSON.parse(testReservations);
          if (Array.isArray(this.reservations) && this.reservations.length > 0) {
            this.renderReservations();
            return;
          }
        } catch (e) {
          console.warn('Could not parse test reservations');
        }
      }

      // Fallback to empty array
      this.reservations = [];
      this.renderReservations();
      
      if (this.reservations.length === 0) {
        this.showEmptyState('reservationsList', 'Nenhuma reserva encontrada');
      }
    } catch (error) {
      console.error('Error loading reservations:', error);
      this.reservations = [];
      this.showEmptyState('reservationsList', 'Nenhuma reserva encontrada');
    }
  }

  renderReservations(reservations = this.reservations) {
    const reservationsList = document.getElementById('reservationsList');
    reservationsList.innerHTML = '';

    if (reservations.length === 0) {
      this.showEmptyState('reservationsList', 'Nenhuma reserva encontrada');
      return;
    }

    reservations.forEach(reservation => {
      const book = this.books.find(b => b.id === reservation.book_id);
      const user = this.users.find(u => u.id === reservation.user_id);

      const item = document.createElement('div');
      item.className = 'list-item';
      item.innerHTML = `
        <img src="${book?.cover_url || 'images/placeholder.jpg'}" alt="${book?.title}" class="list-item-image" style="width: 60px; height: 90px;">
        <div class="list-item-content" style="flex: 1;">
          <h3 class="list-item-title">${book?.title || 'Livro Desconhecido'}</h3>
          <p class="list-item-subtitle">${user?.name || 'Usuário Desconhecido'}</p>
          <div class="list-item-meta">
            <div class="list-item-meta-item">
              <span class="list-item-meta-label">Status</span>
              <span class="status-badge status-${reservation.status}">
                ${this.formatReservationStatus(reservation.status)}
              </span>
            </div>
            <div class="list-item-meta-item">
              <span class="list-item-meta-label">Data da Reserva</span>
              <span class="list-item-meta-value">${this.formatDate(reservation.reserve_date)}</span>
            </div>
          </div>
        </div>
        <div class="list-item-actions">
          <select onchange="adminManager.updateReservationStatus(${reservation.id}, this.value)" class="btn btn-sm" style="padding: 0.5rem;">
            <option value="reserved" ${reservation.status === 'reserved' ? 'selected' : ''}>Reservado</option>
            <option value="ready" ${reservation.status === 'ready' ? 'selected' : ''}>Pronto</option>
            <option value="completed" ${reservation.status === 'completed' ? 'selected' : ''}>Completo</option>
            <option value="canceled" ${reservation.status === 'canceled' ? 'selected' : ''}>Cancelado</option>
          </select>
        </div>
      `;
      reservationsList.appendChild(item);
    });
  }

  filterReservations(searchTerm) {
    const filtered = this.reservations.filter(r => {
      const book = this.books.find(b => b.id === r.book_id);
      const user = this.users.find(u => u.id === r.user_id);
      return (
        (book?.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user?.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
    this.renderReservations(filtered);
  }

  async updateReservationStatus(reservationId, status) {
    try {
      await fetch(`/api/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      await this.loadReservations();
      this.showNotification('Status da reserva atualizado!');
    } catch (error) {
      console.error('Error updating reservation:', error);
      this.showNotification('Erro ao atualizar status', 'error');
    }
  }

  // ===== UTILITY FUNCTIONS =====
  showEmptyState(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📭</div>
        <p>${message}</p>
      </div>
    `;
  }

  formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  formatReservationStatus(status) {
    const statuses = {
      'reserved': 'Reservado',
      'ready': 'Pronto',
      'completed': 'Completo',
      'canceled': 'Cancelado',
      'pending': 'Pendente'
    };
    return statuses[status] || status;
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? '#4caf50' : '#b3261e'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 2000;
      animation: slideInUp 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Modal close functions (for inline onclick handlers)
function closeBookModal() {
  document.getElementById('bookModal').classList.remove('active');
}

function closeUserModal() {
  document.getElementById('userModal').classList.remove('active');
}

// Initialize admin manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.adminManager = new AdminManager();
});

// Add slide in animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

