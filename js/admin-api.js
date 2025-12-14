// ===== API PARA PAINEL DE ADMIN =====

class AdminAPI extends BiblioTecAPI {
  // ===== DASHBOARD =====
  
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        method: 'GET',
        headers: this.getAuthHeader()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao obter estatísticas');
      }

      return data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  // ===== LIVROS =====

  async getAdminBooks() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/books`, {
        method: 'GET',
        headers: this.getAuthHeader()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar livros');
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      throw error;
    }
  }

  async createAdminBook(bookData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify(bookData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar livro');
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      throw error;
    }
  }

  async updateAdminBook(bookId, bookData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify(bookData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar livro');
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      throw error;
    }
  }

  async deleteAdminBook(bookId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/books/${bookId}`, {
        method: 'DELETE',
        headers: this.getAuthHeader()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar livro');
      }

      return data;
    } catch (error) {
      console.error('Erro ao deletar livro:', error);
      throw error;
    }
  }

  // ===== USUÁRIOS =====

  async getAdminUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'GET',
        headers: this.getAuthHeader()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar usuários');
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  async createAdminUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar usuário');
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async deleteAdminUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeader()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar usuário');
      }

      return data;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }

  // ===== RESERVAS =====

  async getAdminReservations() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reservations`, {
        method: 'GET',
        headers: this.getAuthHeader()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar reservas');
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      throw error;
    }
  }

  async updateAdminReservation(reservationId, reservationData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify(reservationData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar reserva');
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      throw error;
    }
  }

  async deleteAdminReservation(reservationId) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: this.getAuthHeader()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar reserva');
      }

      return data;
    } catch (error) {
      console.error('Erro ao deletar reserva:', error);
      throw error;
    }
  }

  // ===== VERIFICAÇÃO DE ACESSO =====

  async verifyAdminAccess() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-admin`, {
        method: 'GET',
        headers: this.getAuthHeader()
      });

      if (!response.ok) {
        throw new Error('Erro ao verificar acesso');
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar acesso de admin:', error);
      return false;
    }
  }
}

// Criar instância global para admin
const adminApi = new AdminAPI();
