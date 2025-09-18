document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailEl = document.getElementById('email');
  const passEl = document.getElementById('password');
  const eEmail = document.getElementById('err-email');
  const ePass = document.getElementById('err-pass');

  // Función para mostrar error
  function showError(msgEl, msg) {
    msgEl.textContent = msg;
    msgEl.classList.add('show'); // Aplica clase para mostrar con CSS
  }

  // Función para limpiar error
  function clearError(msgEl) {
    msgEl.textContent = '';
    msgEl.classList.remove('show'); // Oculta el mensaje
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const email = emailEl.value.trim();
    const pass = passEl.value.trim();

    // Limpiar mensajes previos
    clearError(eEmail);
    clearError(ePass);

    // Validación de campos vacíos
    if (!email) {
      showError(eEmail, 'Ingresa tu correo');
      return;
    }
    if (!pass) {
      showError(ePass, 'Ingresa tu contraseña');
      return;
    }

    // Obtener usuarios almacenados
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === pass);

    // Validar credenciales
    if (!user) {
      showError(eEmail, 'Correo o contraseña incorrectos');
      return;
    }

    // Guardar usuario activo y redirigir
    localStorage.setItem('usuarioActivo', JSON.stringify(user));
    alert(`Bienvenido ${user.name} 👋`);
    window.location.href = "/Home/Dashboard";
  });
});
