document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const passEl = document.getElementById('password');
  const confirmEl = document.getElementById('confirmPassword');

  const eName = document.getElementById('err-name');
  const eEmail = document.getElementById('err-email');
  const ePass = document.getElementById('err-password');
  const eConfirm = document.getElementById('err-confirm');

  function showError(el, msgEl, msg) {
    msgEl.textContent = msg;
    el.style.boxShadow = '0 0 0 2px rgba(255,0,0,.6)';
  }
  function clearError(el, msgEl) {
    msgEl.textContent = '';
    el.style.boxShadow = '';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    let ok = true;
    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const pass = passEl.value.trim();
    const confirm = confirmEl.value.trim();

    clearError(nameEl, eName);
    clearError(emailEl, eEmail);
    clearError(passEl, ePass);
    clearError(confirmEl, eConfirm);

    if (name.length < 3) { showError(nameEl, eName, 'Mínimo 3 caracteres'); ok = false; }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) { showError(emailEl, eEmail, 'Correo inválido'); ok = false; }
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,}$/;
    if (!strong.test(pass)) { showError(passEl, ePass, 'Min 8 con mayúscula, minúscula y número'); ok = false; }
    if (pass !== confirm) { showError(confirmEl, eConfirm, 'No coinciden'); ok = false; }

    if (!ok) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
      showError(emailEl, eEmail, 'Correo ya registrado');
      return;
    }

    users.push({ name, email, password: pass });
    localStorage.setItem('users', JSON.stringify(users));

    alert('Cuenta creada con éxito ✅');
    window.location.href = "/Home/Index"; // Ajusta ruta si tu login.html está en otra carpeta
  });
});
