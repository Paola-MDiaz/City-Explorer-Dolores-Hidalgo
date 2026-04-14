const CityExplorerService = (() => {

  const API_BASE = 'http://127.0.0.1:3000';
  let allPlaces  = [];

  const buildCard = (p) => `
    <div class="place-card">
      <div style="font-size:2rem">${p.emoji ?? '📍'}</div>
      <div style="font-weight:700;font-size:0.95rem;color:#f9fafb;margin-top:0.25rem">${p.name}</div>
      <div style="font-size:0.82rem;color:#9ca3af;margin-top:0.25rem">${p.description}</div>
      <span class="place-tag">${p.category}</span>
    </div>`;

  return {
    async init() {
      try {
        const res  = await fetch(`${API_BASE}/api/places`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        allPlaces  = data.places;
      } catch (err) {
        console.warn('[CityExplorerService] usando datos locales:', err.message);
        allPlaces = FALLBACK;
      }
      this.renderPlaces('all');
    },

    renderPlaces(category) {
      const grid     = document.getElementById('places-grid');
      const filtered = category === 'all'
        ? allPlaces
        : allPlaces.filter(p => p.category === category);
      grid.innerHTML = filtered.length
        ? filtered.map(buildCard).join('')
        : '<p class="text-gray-500 italic text-sm">Sin resultados.</p>';
    }
  };
})();

const FALLBACK = [
  { id:1, emoji:'🏛️', name:'Jardín Principal',           description:'Corazón histórico del municipio.',           category:'historico'   },
  { id:2, emoji:'⛪',  name:'Parroquia de los Dolores',   description:'Templo barroco del siglo XVIII.',             category:'historico'   },
  { id:3, emoji:'🍦',  name:'Nieves de Sabores Exóticos', description:'Más de 100 sabores únicos.',                  category:'gastronomia' },
  { id:4, emoji:'🫔',  name:'Enchiladas Dolorenses',      description:'Platillo emblemático con chiles locales.',    category:'gastronomia' },
  { id:5, emoji:'🏺',  name:'Talavera de Dolores',        description:'Cerámica artesanal pintada a mano.',          category:'artesania'   },
  { id:6, emoji:'🎨',  name:'Mercado de Artesanías',      description:'Más de 50 talleres de arte local.',           category:'artesania'   },
  { id:7, emoji:'🎉',  name:'Feria de la Independencia',  description:'Celebración anual en septiembre.',            category:'evento'      },
  { id:8, emoji:'🎵',  name:'Festival de Huapango',       description:'Música tradicional en el Jardín.',            category:'evento'      },
];