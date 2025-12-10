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
  });

  closeSignup.addEventListener('click', () => {
    signupModal.style.display = 'none';
  });

  loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = 'none';
  });

  signupModal.addEventListener('click', (e) => {
    if (e.target === signupModal) {
      signupModal.style.display = 'none';
    }
  });

  // Atualizar atributo 'value' em tempo real para animação de label
  const inputs = document.querySelectorAll('.input-contain input');
  inputs.forEach(input => {
    input.addEventListener('keyup', () => {
      input.setAttribute('value', input.value);
    });
  });

  // Registro
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;

    if (!name || !email || !password || !confirm) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirm) {
      alert('As senhas não conferem');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const button = signupForm.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'Registrando...';

      await api.register(name, email, password);

      alert('Conta criada com sucesso! Fazendo login...');
      
      // Auto-login após registro
      const loginResult = await api.login(email, password);
      window.location.href = 'home.html';
    } catch (error) {
      alert('Erro ao registrar: ' + error.message);
    } finally {
      const button = signupForm.querySelector('button[type="submit"]');
      button.disabled = false;
      button.textContent = 'Registrar';
    }
  });

  // Login
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert('Por favor, preencha email e senha');
      return;
    }

    try {
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'Entrando...';

      await api.login(email, password);
      window.location.href = 'home.html';
    } catch (error) {
      alert('Erro ao fazer login: ' + error.message);
      const button = form.querySelector('button[type="submit"]');
      button.disabled = false;
      button.textContent = 'Entrar';
    }
  });
});
