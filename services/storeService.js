const StoreService = (() => {

  // Productos artesanales reales de Dolores Hidalgo
  const PRODUCTOS = [
    {
      id: 1,
      title: 'Talavera Decorativa — Plato Artesanal',
      price: 280,
      category: 'Talavera',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80',
      description: 'Hecho a mano por artesanos locales'
    },
    {
      id: 2,
      title: 'Jarrón de Barro Negro Tradicional',
      price: 350,
      category: 'Barro Negro',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80',
      description: 'Técnica prehispánica heredada'
    },
    {
      id: 3,
      title: 'Dulces Típicos — Caja Surtida',
      price: 120,
      category: 'Gastronomía',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      description: 'Cajeta, jamoncillo y dulce de leche'
    },
    {
      id: 4,
      title: 'Figura de Talavera — Catrina',
      price: 450,
      category: 'Talavera',
      image: 'https://images.unsplash.com/photo-1547558902-c0e053edd7b7?w=400&q=80',
      description: 'Pieza única pintada a mano'
    },
    {
      id: 5,
      title: 'Rebozo Artesanal de Seda',
      price: 680,
      category: 'Textiles',
      image: 'https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400&q=80',
      description: 'Tejido tradicional guanajuatense'
    },
    {
      id: 6,
      title: 'Jarra de Barro — Aguas Frescas',
      price: 190,
      category: 'Barro Negro',
      image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80',
      description: 'Ideal para agua de jamaica o horchata'
    },
    {
      id: 7,
      title: 'Set de Tazas Talavera x4',
      price: 520,
      category: 'Talavera',
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80',
      description: 'Diseños florales pintados a mano'
    },
    {
      id: 8,
      title: 'Nieves de Sabores — Voucher x2',
      price: 80,
      category: 'Gastronomía',
      image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&q=80',
      description: 'Canjeable en las neverías del Jardín'
    },
  ];

  return {
    async init() {
      const carousel = document.getElementById('store-carousel');
      try {
        carousel.innerHTML = PRODUCTOS.map(p => `
          <div class="product-card">
            <img src="${p.image}" alt="${p.title}" loading="lazy"
                 onerror="this.src='https://placehold.co/200x200/374151/9ca3af?text=Artesania'" />
            <p class="prod-category">${p.category}</p>
            <p class="prod-title">${p.title}</p>
            <p style="font-size:0.75rem;color:#9ca3af;margin-top:-4px">${p.description}</p>
            <p class="prod-price">$${p.price} MXN</p>
            <button onclick="alert('¡Agregado al carrito! Funcionalidad próximamente 🛒')"
              class="mt-auto bg-teal-600 hover:bg-teal-500 text-white text-xs
                     font-medium py-1.5 px-3 rounded-lg w-full transition">
              🛒 Agregar
            </button>
          </div>`).join('');
      } catch (err) {
        console.error('[StoreService]', err);
        carousel.innerHTML = `<p class="text-red-400 text-sm py-8">⚠️ Error al cargar productos.</p>`;
      }
    }
  };
})();