const MapboxService = (() => {

  // REEMPLAZA con tu token de https://account.mapbox.com
  const TOKEN = 'pk.eyJ1IjoicGFvbGFtZDI1IiwiYSI6ImNtbmxhdDY4ODE3ODkycnBwYm44OHJkdnIifQ.UnCOSTBpWaYQbl0q8V-_Fw';

  const CENTER  = [-100.9308, 21.1561];
  const MARKERS = [
  { coords: [-100.9308, 21.1561], label: '🏛️ Jardín Principal — Centro Histórico',    color: '#14b8a6' },
  { coords: [-100.9305, 21.1563], label: '⛪ Parroquia de los Dolores — Plaza Principal', color: '#f59e0b' },
  { coords: [-100.9302, 21.1557], label: '🎭 Museo Casa Hidalgo — Morelos 1',           color: '#ef4444' },
  { coords: [-100.9311, 21.1548], label: '🏺 Mercado de Artesanías — Av. Hidalgo',      color: '#8b5cf6' },
  { coords: [-100.9315, 21.1552], label: '🍦 Nieves de Sabores — Portal Guadalupe',     color: '#f97316' },
  { coords: [-100.9320, 21.1545], label: '🎨 Taller de Barro Negro — Barrio de la Cruz', color: '#ec4899' },
];

  return {
    init() {
      document.getElementById('map-loading')?.remove();
      mapboxgl.accessToken = TOKEN;

      const map = new mapboxgl.Map({
        container: 'mapbox-container',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: CENTER,
        zoom: 14
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      MARKERS.forEach(({ coords, label, color }) => {
        const el = document.createElement('div');
        el.style.cssText = `width:14px;height:14px;border-radius:50%;
          background:${color};border:2px solid white;cursor:pointer;`;

        new mapboxgl.Marker({ element: el })
          .setLngLat(coords)
          .setPopup(new mapboxgl.Popup({ offset: 12 }).setText(label))
          .addTo(map);
      });
    }
  };
})();