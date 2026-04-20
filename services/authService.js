const AuthService = (() => {

  // 🔧 Misma URL de tu API Flask
  const API_BASE = 'https://city-explorer-dolores-hidalgo-production.up.railway.app';

  // Token guardado en memoria (no en localStorage)
  let token = null;
  let currentUser = null;

  return {

    // Inicia sesión contra Flask
    async login(email, password) {
      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Error al iniciar sesión');

        token       = data.token;
        currentUser = { email: data.email, role: data.role };
        return { success: true, role: data.role };

      } catch (err) {
        return { success: false, error: err.message };
      }
    },

    logout() {
      token       = null;
      currentUser = null;
    },

    getToken()   { return token; },
    getUser()    { return currentUser; },
    isAdmin()    { return currentUser?.role === 'admin'; },
    isLoggedIn() { return token !== null; },

    // Header listo para peticiones protegidas
    authHeaders() {
      return {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`
      };
    }
  };
})();
