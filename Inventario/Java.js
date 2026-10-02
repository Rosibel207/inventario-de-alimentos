// Alternar visibilidad de la contraseña (mostrar/ocultar con el ojo)
function togglePasswordVisibility(inputId, btnElement) {
  const input = document.getElementById(inputId);
  if (!input) return;

  if (input.type === 'password') {
    input.type = 'text';
    btnElement.textContent = '🙈';
  } else {
    input.type = 'password';
    btnElement.textContent = '👁️';
  }
}

// Obtener la lista de cuentas desde localStorage
function getCuentasRegistradas() {
  return JSON.parse(localStorage.getItem("cuentasInventario")) || [];
}

// Guardar una nueva cuenta en localStorage
function guardarCuenta(nuevaCuenta) {
  const cuentas = getCuentasRegistradas();
  cuentas.push(nuevaCuenta);
  localStorage.setItem("cuentasInventario", JSON.stringify(cuentas));
}

// Cambiar de pantalla visible
function navigateTo(targetScreenId) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => screen.classList.remove('active'));

  const target = document.getElementById(targetScreenId);
  if (target) {
    target.classList.add('active');
  }
}

function irAIniciarSesion() {
  navigateTo('loginScreen');
}

function irARegistrarse() {
  navigateTo('registerScreen');
}

// VALIDACIÓN E INICIO DE SESIÓN
function handleLogin(event) {
  event.preventDefault();
  const emailInput = document.getElementById('loginEmail').value.trim().toLowerCase();
  const passwordInput = document.getElementById('loginPassword').value;

  const cuentas = getCuentasRegistradas();
  
  // Buscar usuario registrado en localStorage
  const usuarioEncontrado = cuentas.find(c => c.correo.toLowerCase() === emailInput);

  if (!usuarioEncontrado) {
    alert("⚠️ Acceso denegado: La cuenta no existe o aún no ha sido creada. Por favor, primero haz clic en 'Registrarse'.");
    return;
  }

  if (usuarioEncontrado.password && usuarioEncontrado.password !== passwordInput) {
    alert("⚠️ La contraseña ingresada es incorrecta.");
    return;
  }

  // Guardar la sesión activa
  localStorage.setItem("cuentaActivaInventario", usuarioEncontrado.id);

  alert(`✅ Sesión iniciada correctamente. Bienvenido/a, ${usuarioEncontrado.nombre}.`);

  // =========================================================================
  // REDIRECCIÓN TRAS INICIAR SESIÓN:
  // Reemplaza 'AQUI_LA_SIGUIENTE_PAGINA.html' por la ruta o archivo de tu siguiente código
  // =========================================================================
  window.location.href = 'panel.html';
}

// REGISTRO DE NUEVA CUENTA
function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const password = document.getElementById('regPassword').value;

  const cuentas = getCuentasRegistradas();
  const yaExiste = cuentas.some(c => c.correo.toLowerCase() === email);

  if (yaExiste) {
    alert("⚠️ Este correo ya se encuentra registrado. Procede a Iniciar Sesión.");
    navigateTo('loginScreen');
    return;
  }

  // Objeto de la nueva cuenta
  const nuevaCuenta = {
    id: Date.now().toString(),
    nombre: name,
    correo: email,
    password: password,
    rol: "Administrador",
    foto: ""
  };

  // Guardar en localStorage
  guardarCuenta(nuevaCuenta);

  alert(`✅ Cuenta creada con éxito para ${name}. Ahora ya puedes Iniciar Sesión.`);
  document.getElementById('registerForm').reset();
  navigateTo('loginScreen');
}

function forgotPassword(event) {
  event.preventDefault();
  const email = prompt("Ingresa tu correo institucional para recuperar tu clave:");
  if (email) {
    alert(`Se ha enviado una solicitud de restablecimiento a: ${email}`);
  }
}