// ===== CONFIGURAÇÃO DA API =====
const API_BASE_URL = 'http://localhost:3000/api';

class BiblioTecAPI {
  constructor() {
    this.token = localStorage.getItem('bibliotec_token');
  }

  // ===== MÉTODOS DE AUTENTICAÇÃO =====

  async register(name, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registrar');
      }

      return data;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // Salvar token
      this.token = data.token;
      localStorage.setItem('bibliotec_token', data.token);
      localStorage.setItem('bibliotec_user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('bibliotec_token');
    localStorage.removeItem('bibliotec_user');
  }

  async verifyToken() {
    if (!this.token) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.ok) {
        return await response.json();
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      this.logout();
      return false;
    }
  }

  getAuthHeader() {
    if (!this.token) {
      throw new Error('Usuário não autenticado');
    }
    return {
      'Authorization': `Bearer ${this.token}`
    };
  }

  // ===== MÉTODOS DE LIVROS =====

  async getBooks() {
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      if (!response.ok) {
        throw new Error('Erro ao buscar livros');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      throw error;
    }
  }

  async getBook(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar livro');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      throw error;
    }
  }

  async addBook(bookData) {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify(bookData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao adicionar livro');
      }

      return data;
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      throw error;
    }
  }

  async updateBook(id, bookData) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
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

  async deleteBook(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
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

  // ===== MÉTODOS DE BIBLIOTECA DO USUÁRIO =====

  async getUserLibrary() {
    try {
      const response = await fetch(`${API_BASE_URL}/user-library`, {
        method: 'GET',
        headers: this.getAuthHeader()
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar biblioteca');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar biblioteca:', error);
      throw error;
    }
  }

  async addToLibrary(bookId) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-library/${bookId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao adicionar livro');
      }

      return data;
    } catch (error) {
      console.error('Erro ao adicionar livro:', error);
      throw error;
    }
  }

  async updateLibraryProgress(bookId, progress) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-library/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify({ progress })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar progresso');
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      throw error;
    }
  }

  async removeFromLibrary(bookId) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-library/${bookId}`, {
        method: 'DELETE',
        headers: this.getAuthHeader()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao remover livro');
      }

      return data;
    } catch (error) {
      console.error('Erro ao remover livro:', error);
      throw error;
    }
  }

  // ===== MÉTODOS DE RESERVA =====
  async reserveBook(bookId) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-library/${bookId}/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao reservar livro');
      }

      return data;
    } catch (error) {
      console.error('Erro ao reservar livro:', error);
      throw error;
    }
  }

  // ===== MÉTODOS DE FAVORITO =====
  async toggleFavorite(bookId) {
    try {
      const response = await fetch(`${API_BASE_URL}/user-library/${bookId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alternar favorito');
      }

      return data;
    } catch (error) {
      console.error('Erro ao alternar favorito:', error);
      throw error;
    }
  }

  // Atualizar perfil do usuário
  async updateProfile(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao atualizar perfil');
      }

      return data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  // Alterar senha
  async changePassword(passwordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader()
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao alterar senha');
      }

      return data;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  }

  // Deletar conta
  async deleteAccount() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: 'DELETE',
        headers: this.getAuthHeader()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao deletar conta');
      }

      return data;
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      throw error;
    }
  }
}

// Criar instância global
const api = new BiblioTecAPI();
