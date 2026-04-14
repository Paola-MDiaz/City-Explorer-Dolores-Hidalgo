const SupabaseService = (() => {

  // REEMPLAZA con tus credenciales de https://supabase.com
  const URL = 'https://upfsqqsypzmoutvcined.supabase.co';
  const KEY  = 'sb_publishable_NJap5BmpTV7UlPwF_whg6A_aIEWPE9_';

  const HEADERS = {
    'Content-Type':  'application/json',
    'apikey':        KEY,
    'Authorization': `Bearer ${KEY}`,
  };

  const renderList = (items) => {
    const ul = document.getElementById('fav-list');
    if (!items.length) {
      ul.innerHTML = '<li class="text-gray-600 italic">Sin favoritos aún.</li>';
      return;
    }
    ul.innerHTML = items.map(i => `
      <li class="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-1.5">
        <span class="text-teal-400">⭐</span>
        <span>${i.name}</span>
        <span class="text-gray-600 text-xs ml-auto">
          ${new Date(i.created_at).toLocaleDateString('es-MX')}
        </span>
      </li>`).join('');
  };

  return {
    async init() { await this.loadFavorites(); },

    async loadFavorites() {
      try {
        const res = await fetch(
          `${URL}/rest/v1/favorites?select=*&order=created_at.desc&limit=10`,
          { headers: HEADERS }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        renderList(await res.json());
      } catch (err) {
        console.error('[SupabaseService]', err);
        renderList([]);
      }
    },

    async saveFavorite(name) {
      try {
        const res = await fetch(`${URL}/rest/v1/favorites`, {
          method: 'POST',
          headers: { ...HEADERS, 'Prefer': 'return=representation' },
          body: JSON.stringify({ name }),
        });
        return res.ok;
      } catch (err) {
        console.error('[SupabaseService]', err);
        return false;
      }
    }
  };
})();