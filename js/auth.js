// ===== GESTÃO DE AUTENTICAÇÃO =====

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.querySelector('.form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const signupLink = document.getElementById('signup-link');
  const loginLink = document.getElementById('login-link');
  const signupModal = document.getElementById('signupModal');
  const closeSignup = document.getElementById('closeSignup');
  const signupForm = document.getElementById('signup-form');

  // Verificar se já está autenticado
  const token = localStorage.getItem('bibliotec_token');
  if (token) {
    const verified = await api.verifyToken();
    if (verified && verified.valid) {
      window.location.href = 'home.html';
      return;
    }
  }

  // Event Listeners para Modal de Registro
  signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'flex';
    signupForm.reset();
    clearAllErrors();
  });

  closeSignup.addEventListener('click', () => {
    signupModal.style.display = 'none';
    signupForm.reset();
    clearAllErrors();
  });

  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'none';
    signupForm.reset();
    clearAllErrors();
  });

  signupModal.addEventListener('click', (e) => {
    if (e.target === signupModal) {
      signupModal.style.display = 'none';
      signupForm.reset();
      clearAllErrors();
    }
  });

  // Atualizar atributo 'value' em tempo real para animação de label
  const inputs = document.querySelectorAll('.input-contain input');
  inputs.forEach(input => {
    input.addEventListener('keyup', () => {
      input.setAttribute('value', input.value);
      // Limpar erro ao digitar
      clearInputError(input);
    });

    // Validação em tempo real para campos específicos
    if (input.id === 'signup-password' || input.id === 'signup-confirm') {
      input.addEventListener('change', () => {
        validatePasswordMatch();
      });
    }

    if (input.id === 'signup-email') {
      input.addEventListener('blur', () => {
        validateEmail(input.value);
      });
    }
  });

  // Registro
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;

    // Validações
    let isValid = true;

    if (!name) {
      showInputError(document.getElementById('signup-name'), 'Nome é obrigatório');
      isValid = false;
    } else if (name.length < 3) {
      showInputError(document.getElementById('signup-name'), 'Nome deve ter pelo menos 3 caracteres');
      isValid = false;
    }

    if (!email) {
      showInputError(document.getElementById('signup-email'), 'Email é obrigatório');
      isValid = false;
    } else if (!validateEmailFormat(email)) {
      showInputError(document.getElementById('signup-email'), 'Email inválido');
      isValid = false;
    }

    if (!password) {
      showInputError(document.getElementById('signup-password'), 'Senha é obrigatória');
      isValid = false;
    } else if (password.length < 6) {
      showInputError(document.getElementById('signup-password'), 'Senha deve ter pelo menos 6 caracteres');
      isValid = false;
    } else if (!validatePasswordStrength(password)) {
      showInputError(
        document.getElementById('signup-password'),
        'Senha deve conter letra e número'
      );
      isValid = false;
    }

    if (!confirm) {
      showInputError(document.getElementById('signup-confirm'), 'Confirmação de senha é obrigatória');
      isValid = false;
    } else if (password !== confirm) {
      showInputError(document.getElementById('signup-confirm'), 'As senhas não coincidem');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      const button = signupForm.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'Registrando...';

      const response = await api.register(name, email, password);

      // Sucesso na criação
      showSuccessMessage('Conta criada com sucesso! Redirecionando...');
      
      // Auto-login após registro
      setTimeout(async () => {
        try {
          await api.login(email, password);
          window.location.href = 'home.html';
        } catch (loginError) {
          // Se o auto-login falhar, redirecionar para login
          console.error('Erro no auto-login:', loginError);
          alert('Conta criada! Por favor, faça login com suas credenciais.');
          signupModal.style.display = 'none';
          signupForm.reset();
        }
      }, 1500);
    } catch (error) {
      let errorMessage = 'Erro ao registrar';
      
      if (error.message.includes('email')) {
        showInputError(document.getElementById('signup-email'), 'Este email já está registrado');
      } else if (error.message) {
        errorMessage = error.message;
        showFormError(signupForm, errorMessage);
      } else {
        showFormError(signupForm, errorMessage);
      }

      const button = signupForm.querySelector('button[type="submit"]');
      button.disabled = false;
      button.textContent = 'Registrar';
    }
  });

  // Login
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let isValid = true;

    if (!email) {
      showInputError(emailInput, 'Email é obrigatório');
      isValid = false;
    }

    if (!password) {
      showInputError(passwordInput, 'Senha é obrigatória');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'Entrando...';

      await api.login(email, password);
      window.location.href = 'home.html';
    } catch (error) {
      showFormError(form, 'Email ou senha incorretos');
      const button = form.querySelector('button[type="submit"]');
      button.disabled = false;
      button.textContent = 'Entrar';
    }
  });

  // Funções auxiliares de validação
  function validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validateEmail(email) {
    const emailInput = document.getElementById('signup-email');
    if (email && !validateEmailFormat(email)) {
      showInputError(emailInput, 'Email inválido');
      return false;
    } else {
      clearInputError(emailInput);
      return true;
    }
  }

  function validatePasswordStrength(password) {
    // Mínimo: uma letra e um número
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasLetter && hasNumber;
  }

  function validatePasswordMatch() {
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const confirmInput = document.getElementById('signup-confirm');

    if (password && confirm && password !== confirm) {
      showInputError(confirmInput, 'As senhas não coincidem');
      return false;
    } else if (password && confirm && password === confirm) {
      clearInputError(confirmInput);
      return true;
    }
  }

  function showInputError(input, message) {
    const container = input.closest('.input-contain');
    if (!container) return;

    // Remover erro anterior se existir
    let errorMsg = container.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.remove();
    }

    // Adicionar classe de erro
    container.classList.add('error');

    // Criar e adicionar mensagem de erro
    errorMsg = document.createElement('span');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    container.appendChild(errorMsg);
  }

  function clearInputError(input) {
    const container = input.closest('.input-contain');
    if (!container) return;

    container.classList.remove('error');
    const errorMsg = container.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
  }

  function clearAllErrors() {
    const containers = document.querySelectorAll('.input-contain');
    containers.forEach(container => {
      container.classList.remove('error');
      const errorMsg = container.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.remove();
      }
    });
    const formError = document.querySelector('.form-error-message');
    if (formError) {
      formError.remove();
    }
  }

  function showFormError(form, message) {
    const existingError = form.querySelector('.form-error-message');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message';
    errorDiv.textContent = message;
    form.insertBefore(errorDiv, form.firstChild);
  }

  function showSuccessMessage(message) {
    const existingSuccess = document.querySelector('.form-success-message');
    if (existingSuccess) {
      existingSuccess.remove();
    }

    const successDiv = document.createElement('div');
    successDiv.className = 'form-success-message';
    successDiv.textContent = message;
    signupForm.insertBefore(successDiv, signupForm.firstChild);
  }
});
