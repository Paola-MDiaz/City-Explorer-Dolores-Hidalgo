document.addEventListener('DOMContentLoaded', async () => {
  console.log('CityExplorer iniciado');

  // Mostrar modal de login al cargar
  showLoginModal();
});

// ── Modal de login ────────────────────────────────────────────
function showLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) modal.classList.remove('hidden');

  // Botón login
  document.getElementById('login-btn').addEventListener('click', async () => {
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();
    const errorDiv = document.getElementById('login-error');
    const btn      = document.getElementById('login-btn');

    if (!email || !password) {
      errorDiv.textContent = 'Completa email y contraseña.';
      errorDiv.classList.remove('hidden');
      return;
    }

    btn.textContent = 'Iniciando sesión…';
    btn.disabled    = true;

    const result = await AuthService.login(email, password);

    if (result.success) {
      closeLoginModal();
      initApp(result.role);
    } else {
      errorDiv.textContent = result.error;
      errorDiv.classList.remove('hidden');
      btn.textContent = 'Iniciar Sesión como Admin';
      btn.disabled    = false;
    }
  });

  // Botón visitante
  document.getElementById('guest-btn').addEventListener('click', () => {
    closeLoginModal();
    initApp('visitante');
  });

  // Enter en password
  document.getElementById('login-password').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('login-btn').click();
  });
}

function closeLoginModal() {
  document.getElementById('login-modal').classList.add('hidden');
}

// ── Inicializar app según rol ──────────────────────────────────
async function initApp(role) {
  console.log(`Rol detectado: ${role}`);

  // Mostrar panel admin si es admin
  if (role === 'admin') {
    const panel = document.getElementById('admin-panel');
    if (panel) panel.classList.remove('hidden');
    const label = document.getElementById('admin-user-label');
    if (label) label.textContent = `👑 ${AuthService.getUser().email}`;
  }

  // Inicializar todos los servicios
  // Inicializar todos los servicios
  MapboxService.init();
  await WeatherService.init();
  await UnsplashService.init();
  await StoreService.init();
  await SupabaseService.init();
  await CityExplorerService.init();

  // YouTube — crear player directamente
  if (window.YT && window.YT.Player) {
    YoutubeService.createPlayer();
  } else {
    window.onYouTubeIframeAPIReady = () => YoutubeService.createPlayer();
  }
}

// ── Acciones globales ─────────────────────────────────────────
window.saveFavorite = async () => {
  const input  = document.getElementById('fav-input');
  const status = document.getElementById('fav-status');
  const name   = input.value.trim();

  if (!name) { status.textContent = 'Escribe el nombre de un lugar.'; return; }

  status.textContent = 'Guardando…';
  const ok = await SupabaseService.saveFavorite(name);

  if (ok) {
    status.textContent = `✅ "${name}" guardado.`;
    input.value = '';
    await SupabaseService.loadFavorites();
  } else {
    status.textContent = '❌ Error al guardar.';
  }
};

window.filterPlaces = (category, event) => {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  CityExplorerService.renderPlaces(category);
};

window.onYouTubeIframeAPIReady = () => {
  YoutubeService.createPlayer();
};

// ── Panel Admin ───────────────────────────────────────────────
window.adminLogout = () => {
  AuthService.logout();
  document.getElementById('admin-panel').classList.add('hidden');
  showLoginModal();
  document.getElementById('login-error').classList.add('hidden');
  document.getElementById('login-btn').textContent = 'Iniciar Sesión como Admin';
  document.getElementById('login-btn').disabled = false;
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
};

window.addPlace = async () => {
  const status = document.getElementById('admin-status');
  const place  = {
    emoji:       document.getElementById('new-emoji').value.trim(),
    name:        document.getElementById('new-name').value.trim(),
    category:    document.getElementById('new-category').value.trim(),
    address:     document.getElementById('new-address').value.trim(),
    rating:      parseFloat(document.getElementById('new-rating').value) || 0,
    visit_hours: document.getElementById('new-hours').value.trim(),
    description: document.getElementById('new-description').value.trim(),
  };

  if (!place.name || !place.category) {
    status.textContent = '⚠️ Nombre y categoría son obligatorios.';
    return;
  }

  status.textContent = 'Guardando…';

  try {
    const res = await fetch('http://127.0.0.1:3000/api/places', {
      method:  'POST',
      headers: AuthService.authHeaders(),
      body:    JSON.stringify(place)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al guardar');
    }

    status.textContent = `✅ "${place.name}" agregado correctamente.`;

    // Limpiar formulario
    ['new-emoji','new-name','new-category','new-address',
     'new-rating','new-hours','new-description'].forEach(id => {
      document.getElementById(id).value = '';
    });

    // Refrescar lista de lugares
    await CityExplorerService.init();

  } catch (err) {
    status.textContent = `❌ ${err.message}`;
  }
};