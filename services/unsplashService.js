const UnsplashService = (() => {

  const ACCESS_KEY = 'CbS6jY0mkLmm2mZD2qwcFPxyODU1__iCbaYj8Ca59dU';

  // Varias queries para asegurar fotos bonitas de la región
  const QUERIES = [
    'Guanajuato+Mexico+colonial',
    'Mexico+arquitectura+colonial',
    'Guanajuato+callejones+coloridos',
    'Mexico+iglesia+colonial',
  ];

  const fetchPhotos = async (query) => {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=2&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.results;
  };

  return {
    async init() {
      const container = document.getElementById('unsplash-gallery');
      try {
        // Busca en paralelo todas las queries
        const results = await Promise.all(QUERIES.map(q => fetchPhotos(q)));

        // Aplana el array y elimina duplicados por ID
        const seen  = new Set();
        const photos = results.flat().filter(p => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });

        if (!photos.length) throw new Error('Sin resultados');

        container.innerHTML = photos.map(p => `
          <div class="photo-card">
            <img src="${p.urls.regular}"
                 alt="${p.alt_description ?? 'Foto de México'}"
                 loading="lazy"
                 onerror="this.src='https://placehold.co/400x300/1f2937/9ca3af?text=Foto+no+disponible'" />
            <a class="photo-credit" href="${p.user.links.html}" target="_blank">
              📷 Capturado por la comunidad: ${p.user.name}
            </a>
          </div>`).join('');

      } catch (err) {
        console.error('[UnsplashService]', err);
        container.innerHTML = `
          <p class="col-span-full text-red-400 text-sm text-center py-8">
            ⚠️ Error al cargar galería: ${err.message}
          </p>`;
      }
    }
  };
})();