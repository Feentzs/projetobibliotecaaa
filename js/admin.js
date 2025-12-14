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
    this.setupTestDataButton();
    this.setupThemeToggle();
    this.restoreSidebarState();
    this.loadDashboardData();
    
    // Atualizar imagens dos estados vazios
    this.updateEmptyStateImages();
    
    // Observar mudanças de tema
    const darkModeStyle = document.getElementById('dark-mode-style');
    if (darkModeStyle) {
      const observer = new MutationObserver(() => this.updateEmptyStateImages());
      observer.observe(darkModeStyle, { attributes: true, attributeFilter: ['disabled'] });
    }
    
    // Auto-create demo data if no data exists (safe fallback)
    try {
      const hasBooks = !!localStorage.getItem('biblioTecBooks');
      const hasUsers = !!localStorage.getItem('testUsers');
      const hasReservations = !!localStorage.getItem('testReservations');
      if (!hasBooks && !hasUsers && !hasReservations) {
        // Slight delay so UI finishes setup before creating and loading data
        setTimeout(() => {
          if (typeof window.createTestData === 'function') {
            window.createTestData();
            // Reload data to reflect in UI
            this.loadDashboardData();
            this.showNotification('Dados de exemplo carregados');
          }
        }, 200);
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }

  setupTestDataButton() {
    const btn = document.getElementById('btnCreateTestData');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (typeof window.createTestData === 'function') {
        window.createTestData();
        // Reload data to reflect in UI
        this.loadDashboardData();
        // Switch to 'books' tab to show created books immediately
        document.querySelectorAll('.sidebar-item').forEach(t => t.classList.remove('active'));
        const booksTab = document.querySelector('.sidebar-item[data-tab="books"]');
        if (booksTab) booksTab.classList.add('active');
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        const booksContent = document.getElementById('books-tab');
        if (booksContent) booksContent.classList.add('active');
        this.showNotification('Dados de exemplo gerados com sucesso');
      } else {
        this.showNotification('Função de dados de teste indisponível', 'error');
      }
    });
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
    const btnAddBook = document.getElementById('btnAddBook');
    if (btnAddBook) btnAddBook.addEventListener('click', () => this.openBookModal());
    const closeBookBtn = document.getElementById('closeBookModal');
    if (closeBookBtn) closeBookBtn.addEventListener('click', () => this.closeBookModal());
    const bookForm = document.getElementById('bookForm');
    if (bookForm) bookForm.addEventListener('submit', (e) => this.handleBookSubmit(e));
    const bookSearchInput = document.getElementById('bookSearchInput');
    if (bookSearchInput) bookSearchInput.addEventListener('input', (e) => this.filterBooks(e.target.value));

    // Users section
    const btnAddUser = document.getElementById('btnAddUser');
    if (btnAddUser) btnAddUser.addEventListener('click', () => this.openUserModal());
    const closeUserBtn = document.getElementById('closeUserModal');
    if (closeUserBtn) closeUserBtn.addEventListener('click', () => this.closeUserModal());
    const userForm = document.getElementById('userForm');
    if (userForm) userForm.addEventListener('submit', (e) => this.handleUserSubmit(e));
    const userSearchInput = document.getElementById('userSearchInput');
    if (userSearchInput) userSearchInput.addEventListener('input', (e) => this.filterUsers(e.target.value));

    // Reservations section
    const reservationSearchInput = document.getElementById('reservationSearchInput');
    if (reservationSearchInput) reservationSearchInput.addEventListener('input', (e) => this.filterReservations(e.target.value));

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
    // Use the same dark-mode-style approach as scripts.js for consistency
    const darkModeStyle = document.getElementById('dark-mode-style');
    const headerSwitch = document.getElementById('theme-switch');
    
    if (!darkModeStyle) return; // Exit if dark-mode-style not available

    // Apply theme based on darkModeStyle.disabled state
    const applyTheme = () => {
      const isDark = !darkModeStyle.disabled;
      document.body.classList.remove('light-mode', 'dark-mode');
      document.body.classList.add(isDark ? 'dark-mode' : 'light-mode');
      if (headerSwitch) headerSwitch.checked = isDark;
    };

    // Initialize from localStorage or default
    const savedTheme = localStorage.getItem('theme') || 'light';
    darkModeStyle.disabled = (savedTheme === 'light');
    applyTheme();

    // Listen to header switch changes
    if (headerSwitch) {
      headerSwitch.addEventListener('change', () => {
        // Let scripts.js handle the main change, we just sync
        setTimeout(() => applyTheme(), 100);
      });
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

  // ===== FUNÇÕES DE ESTADOS VAZIOS =====

  updateEmptyStateImages() {
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

  showEmptyState(type, message = null) {
    const emptyState = document.getElementById(`${type}-empty`);
    const listElement = document.getElementById(`${type}List`);
    const titleElement = document.getElementById(`${type}-empty-title`);
    const subtitleElement = document.getElementById(`${type}-empty-subtitle`);
    
    if (emptyState && listElement) {
      if (message && titleElement) {
        titleElement.textContent = message;
      }
      
      // Verificar se há itens na lista
      const hasItems = listElement.children.length > 0;
      
      if (!hasItems) {
        emptyState.style.display = 'flex';
        listElement.style.display = 'none';
      } else {
        emptyState.style.display = 'none';
        listElement.style.display = 'block';
      }
    }
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
            borderColor: '#4A67DF',
            backgroundColor: 'rgba(74, 103, 223, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: '#4A67DF',
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
            backgroundColor: '#4A67DF',
            borderColor: '#4A67DF',
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

  // ===== LIVROS (ACERVO) =====
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
      this.showEmptyState('books', 'Nenhum livro no catálogo');
      
    } catch (error) {
      console.error('Error loading books:', error);
      this.books = [];
      this.showEmptyState('books', 'Erro ao carregar livros');
    }
  }

  renderBooks(books = this.books) {
    const booksList = document.getElementById('booksList');
    if (!booksList) return;

    booksList.innerHTML = '';
    
    if (!books || books.length === 0) {
      this.showEmptyState('books', 'Nenhum livro no catálogo');
      return;
    }

    books.forEach(book => {
      const item = document.createElement('div');
      item.className = 'list-item';
      item.innerHTML = `
        <img src="${book.cover_url || book.cover || 'images/placeholder.jpg'}" alt="${book.title}" class="list-item-image">
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
          <button class="btn btn-sm btn-primary" onclick="adminManager.openBookModal('${book.id}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="adminManager.deleteBook('${book.id}')">Deletar</button>
        </div>
      `;
      booksList.appendChild(item);
    });
    
    this.showEmptyState('books');
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
      const book = this.books.find(b => b.id == bookId);
      if (book) {
        document.getElementById('bookModalTitle').textContent = 'Editar Livro';
        document.getElementById('bookId').value = book.id;
        document.getElementById('bookTitle').value = book.title;
        document.getElementById('bookAuthor').value = book.author;
        document.getElementById('bookGenre').value = book.genre;
        document.getElementById('bookRating').value = book.rating;
        document.getElementById('bookCover').value = book.cover_url || book.cover || '';
        document.getElementById('bookPages').value = book.pages || '';
        document.getElementById('bookDescription').value = book.description || '';
      }
    } else {
      document.getElementById('bookModalTitle').textContent = 'Adicionar Novo Livro';
    }

    modal.classList.add('active');
    
    // Reset placeholder positions after modal opens
    setTimeout(() => {
      const inputs = form.querySelectorAll('.input-contain input');
      inputs.forEach(input => resetPlaceholder(input));
    }, 0);
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

  // ===== USUÁRIOS =====
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
            this.showEmptyState('users', 'Nenhum usuário encontrado');
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
            this.showEmptyState('users');
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
      this.showEmptyState('users', 'Nenhum usuário encontrado');
      
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [];
      this.showEmptyState('users', 'Erro ao carregar usuários');
    }
  }

  renderUsers(users = this.users) {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;

    usersList.innerHTML = '';
    
    if (!users || users.length === 0) {
      this.showEmptyState('users', 'Nenhum usuário encontrado');
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
          <button class="btn btn-sm btn-primary" onclick="adminManager.openUserModal('${user.id}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="adminManager.deleteUser('${user.id}')">Deletar</button>
        </div>
      `;
      usersList.appendChild(item);
    });
    
    this.showEmptyState('users');
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
      const user = this.users.find(u => u.id == userId);
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
    
    // Reset placeholder positions after modal opens
    setTimeout(() => {
      const inputs = form.querySelectorAll('.input-contain input');
      inputs.forEach(input => resetPlaceholder(input));
    }, 0);
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

  // ===== RESERVAS =====
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
            this.showEmptyState('reservations', 'Nenhuma reserva encontrada');
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
            this.showEmptyState('reservations');
            return;
          }
        } catch (e) {
          console.warn('Could not parse test reservations');
        }
      }

      // Fallback to empty array
      this.reservations = [];
      this.renderReservations();
      this.showEmptyState('reservations', 'Nenhuma reserva encontrada');
      
    } catch (error) {
      console.error('Error loading reservations:', error);
      this.reservations = [];
      this.showEmptyState('reservations', 'Erro ao carregar reservas');
    }
  }

  renderReservations(reservations = this.reservations) {
    const reservationsList = document.getElementById('reservationsList');
    if (!reservationsList) return;

    reservationsList.innerHTML = '';
    
    if (!reservations || reservations.length === 0) {
      this.showEmptyState('reservations', 'Nenhuma reserva encontrada');
      return;
    }

    reservations.forEach(reservation => {
      const book = this.books.find(b => b.id === reservation.book_id);
      const user = this.users.find(u => u.id === reservation.user_id);

      const item = document.createElement('div');
      item.className = 'list-item';
      item.innerHTML = `
        <img src="${book?.cover_url || book?.cover || 'images/placeholder.jpg'}" alt="${book?.title}" class="list-item-image" style="width: 60px; height: 90px;">
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
          <select onchange="adminManager.updateReservationStatus('${reservation.id}', this.value)" class="btn btn-sm" style="padding: 0.5rem;">
            <option value="reserved" ${reservation.status === 'reserved' ? 'selected' : ''}>Reservado</option>
            <option value="ready" ${reservation.status === 'ready' ? 'selected' : ''}>Pronto</option>
            <option value="completed" ${reservation.status === 'completed' ? 'selected' : ''}>Completo</option>
            <option value="canceled" ${reservation.status === 'canceled' ? 'selected' : ''}>Cancelado</option>
          </select>
        </div>
      `;
      reservationsList.appendChild(item);
    });
    
    this.showEmptyState('reservations');
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

  // ===== FUNÇÕES AUXILIARES =====
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

// Reset placeholder to normal position
function resetPlaceholder(input) {
  const label = input.nextElementSibling;
  if (label && label.classList.contains('placeholder-text')) {
    const text = label.querySelector('.text');
    text.style.transform = 'translate(0)';
    text.style.fontSize = '0.95rem';
  }
}

// Setup modal input placeholder animations
function setupModalInputAnimations() {
  const inputs = document.querySelectorAll('.modal-content .input-contain input');
  
  inputs.forEach(input => {
    // Check on load if input has a value
    if (input.value) {
      updatePlaceholder(input);
    }
    
    // Listen to input changes
    input.addEventListener('input', () => {
      updatePlaceholder(input);
    });
    
    // Listen to focus/blur
    input.addEventListener('focus', () => {
      updatePlaceholder(input);
    });
    
    input.addEventListener('blur', () => {
      updatePlaceholder(input);
    });
  });
  
  function updatePlaceholder(input) {
    const hasValue = input.value.trim() !== '';
    const label = input.nextElementSibling;
    
    if (label && label.classList.contains('placeholder-text')) {
      const text = label.querySelector('.text');
      if (hasValue || document.activeElement === input) {
        text.style.transform = 'translate(0, -150%)';
        text.style.fontSize = '0.75rem';
      } else {
        text.style.transform = 'translate(0)';
        text.style.fontSize = '0.95rem';
      }
    }
  }
}

// Initialize admin manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.adminManager = new AdminManager();
  
  // Setup modal input animations (placeholder text like login)
  setupModalInputAnimations();
  
  // Atualizar imagens de estado vazio após carregamento
  setTimeout(() => {
    if (window.adminManager && window.adminManager.updateEmptyStateImages) {
      window.adminManager.updateEmptyStateImages();
    }
  }, 100);
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