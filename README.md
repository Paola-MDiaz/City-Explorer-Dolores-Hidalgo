# 🗺️ CityExplorer: Dolores Hidalgo

> Aplicación web de una sola página (SPA) desarrollada con Arquitectura Orientada a Servicios (SOA) que integra 7 APIs independientes para ofrecer una experiencia turística digital completa sobre el municipio de Dolores Hidalgo, Guanajuato.

![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222222?logo=github)
![Flask](https://img.shields.io/badge/Backend-Flask-000000?logo=flask)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript)
![Supabase](https://img.shields.io/badge/DB-Supabase-3ECF8E?logo=supabase)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens)

🌐 **Aplicacion Desplegada:** [https://paola-mdiaz.github.io/City-Explorer-Dolores-Hidalgo/](https://paola-mdiaz.github.io/City-Explorer-Dolores-Hidalgo/)

---

## 👥 Equipo de Desarrollo

| Integrante | Rol Técnico | Responsabilidad |
|---|---|---|
| Paola Moya Díaz | Full Stack Lead | Arquitectura SOA, API propia Flask, autenticación JWT, Supabase, despliegue |
| Nataly Victoria González Áviles | Frontend & Integrations Dev | HTML5, CSS3, JavaScript ES6+, UI/UX, panel admin, consumo de las 6 APIs |

**Universidad:** UTNG · Universidad Tecnológica del Norte de Guanajuato  
**Materia:** Aplicaciones Web Orientadas a Servicios  
**Docente:** Anastacio Rodríguez García  
**Grupo:** GTID153 · Abril 2026

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Problema que Resuelve](#-problema-que-resuelve)
- [Arquitectura SOA](#-arquitectura-soa)
- [APIs Integradas](#-apis-integradas)
- [Sistema de Roles y Autenticación](#-sistema-de-roles-y-autenticación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación del Código](#-documentación-del-código)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Endpoints de la API Propia](#-endpoints-de-la-api-propia)
- [Despliegue](#-despliegue)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)

---

## 📖 Descripción del Proyecto

**CityExplorer: Dolores Hidalgo** es una aplicación web moderna que centraliza información turística del municipio de Dolores Hidalgo, Guanajuato — Cuna de la Independencia Nacional. Permite a visitantes explorar el municipio de forma digital mediante un mapa interactivo, galería fotográfica, clima en tiempo real, video turístico y tienda de artesanías locales.

La aplicación implementa un sistema de autenticación JWT con dos roles diferenciados:
- **Administrador:** gestión completa del contenido (CRUD de lugares)
- **Visitante:** exploración libre y guardado de favoritos

---

## 🎯 Problema que Resuelve

Dolores Hidalgo carece de una plataforma digital unificada que centralice su oferta turística. Los visitantes encuentran información dispersa y desactualizada, los artesanos locales no tienen visibilidad digital y no existe un sistema de gestión seguro que permita administrar el contenido con control de acceso.

**CityExplorer resuelve:**
- ✅ Información turística centralizada e interactiva
- ✅ Gestión segura de contenido con autenticación JWT
- ✅ Visibilidad para artesanos y comerciantes locales
- ✅ Experiencia de usuario completa y responsiva

---

## 🏗️ Arquitectura SOA

El sistema implementa tres capas independientes bajo el patrón de Arquitectura Orientada a Servicios:

```
┌─────────────────────────────────────────────┐
│         CAPA DE PRESENTACIÓN                │
│   index.html · style.css · Tailwind CSS     │
│   UI responsiva, modal de login, panel admin│
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         CAPA DE PROCESOS / LÓGICA           │
│         main.js · auth.js                   │
│  Orquestación, JWT, control de vistas       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         CAPA DE SERVICIOS / APIs            │
│   services/*.js  →  6 APIs de terceros      │
│   api/app.py     →  API REST propia Flask   │
│   Supabase       →  PostgreSQL cloud        │
└─────────────────────────────────────────────┘
```

Las capas se comunican **unidireccionalmente**: Presentación → Procesos → Servicios → Base de Datos.

---

## 🔌 APIs Integradas

| # | API | Tipo | Función |
|---|-----|------|---------|
| 1 | **Mapbox GL JS** | Terceros | Mapa interactivo con 6 marcadores geolocalizados y popups informativos |
| 2 | **OpenWeatherMap** | Terceros | Temperatura, humedad, viento y sensación térmica en tiempo real |
| 3 | **Unsplash API** | Terceros | Galería fotográfica con múltiples queries en paralelo y crédito de autor |
| 4 | **YouTube IFrame** | Terceros | Video turístico embebido con SDK asíncrono |
| 5 | **FakeStoreAPI** | Terceros | Tienda simulada de artesanías y souvenirs locales |
| 6 | **Supabase** | Terceros | Base de datos PostgreSQL cloud (users, places, favorites) |
| 7 | **CityExplorer API** | **PROPIA** | Login JWT, CRUD de lugares protegido por rol Admin |

---

## 🔐 Sistema de Roles y Autenticación

### Flujo JWT

```
Usuario → Modal Login → POST /api/auth/login → Flask valida en Supabase
       → Genera token JWT con rol → Frontend detecta rol → Ajusta vista
       → Rutas protegidas verifican token → Error 401 si no autorizado
```

### Roles

| Rol | Permisos |
|-----|----------|
| **👑 Admin** | Ver todo · Panel exclusivo · Agregar/Editar/Eliminar lugares en Supabase |
| **🧭 Visitante** | Ver mapa/clima/galería/video/tienda · Explorar lugares · Guardar favoritos |

### Credenciales de prueba
```
Email:    admin@cityexplorer.com
Password: admin123
```

---

## 📁 Estructura del Proyecto

```
City-Explorer-Dolores-Hidalgo/
│
├── index.html                    # SPA principal con modal de login y panel admin
├── style.css                     # Estilos globales (Tailwind CDN + custom)
├── main.js                       # Orquestador principal (Capa de Procesos)
│
├── services/                     # Capa de Servicios - una clase por API
│   ├── authService.js            # Autenticación JWT - login/logout/token
│   ├── mapboxService.js          # API Mapbox - mapa interactivo
│   ├── weatherService.js         # API OpenWeatherMap - clima en tiempo real
│   ├── unsplashService.js        # API Unsplash - galería fotográfica
│   ├── youtubeService.js         # API YouTube IFrame - video turístico
│   ├── storeService.js           # FakeStoreAPI - tienda de artesanías
│   ├── supabaseService.js        # Supabase - favoritos del visitante
│   └── cityExplorerService.js    # API propia - lugares y eventos
│
└── api/                          # Backend Python + Flask (API propia)
    ├── app.py                    # Servidor Flask con JWT y endpoints CRUD
    ├── requirements.txt          # Dependencias Python
    ├── routes/
    │   ├── __init__.py
    │   ├── places.py             # Rutas de lugares
    │   ├── events.py             # Rutas de eventos
    │   └── artisans.js           # Rutas de artesanos
    └── data/
        └── dolores.json          # Datos de respaldo locales
```

---

## 📚 Documentación del Código

### `main.js` — Orquestador Principal

```javascript
/**
 * main.js — Capa de Procesos
 * 
 * Responsabilidades:
 * - Mostrar modal de login al cargar la app
 * - Inicializar todos los servicios según el rol del usuario
 * - Exponer funciones globales (saveFavorite, filterPlaces, addPlace)
 * - Manejar el callback de YouTube IFrame API
 */

// Punto de entrada — espera a que el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
  showLoginModal(); // Siempre muestra el login primero
});

// initApp(role) — inicializa servicios según rol detectado por JWT
async function initApp(role) {
  if (role === 'admin') {
    // Muestra panel de administración exclusivo
    document.getElementById('admin-panel').classList.remove('hidden');
  }
  // Inicializa todos los servicios en secuencia
  MapboxService.init();
  await WeatherService.init();
  await UnsplashService.init();
  // ... etc
}
```

---

### `services/authService.js` — Autenticación JWT

```javascript
/**
 * authService.js — Servicio de Autenticación
 * 
 * Patrón: Módulo (IIFE) para encapsular estado privado
 * 
 * Estado privado:
 *   - token: string | null  → JWT generado por Flask
 *   - currentUser: object   → { email, role }
 * 
 * Métodos públicos:
 *   - login(email, password) → POST /api/auth/login → guarda token
 *   - logout()               → limpia token y usuario
 *   - isAdmin()              → boolean, verifica rol en token
 *   - authHeaders()          → headers con Bearer token para peticiones protegidas
 */

const AuthService = (() => {
  const API_BASE = 'http://127.0.0.1:3000';
  let token = null;        // Token JWT en memoria (no en localStorage)
  let currentUser = null;  // Datos del usuario autenticado

  return {
    async login(email, password) {
      // POST al endpoint de Flask con credenciales
      // Flask valida contra tabla users en Supabase
      // Si correcto: devuelve JWT firmado con rol del usuario
    },
    authHeaders() {
      // Retorna headers con Authorization: Bearer {token}
      // Requerido por endpoints protegidos con @require_admin
    }
  };
})();
```

---

### `services/mapboxService.js` — Mapa Interactivo

```javascript
/**
 * mapboxService.js — API Mapbox GL JS v3
 * 
 * Funcionalidad:
 *   - Renderiza mapa dark centrado en Dolores Hidalgo (21.1561, -100.9308)
 *   - Agrega 4 marcadores de colores con popups informativos
 *   - Incluye controles de zoom y navegación
 * 
 * Configuración requerida:
 *   - ACCESS_TOKEN: token público de https://account.mapbox.com
 *     (empieza con pk.eyJ1...)
 */

const MapboxService = (() => {
  const TOKEN  = 'TU_MAPBOX_TOKEN';
  const CENTER = [-100.9308, 21.1561]; // Coordenadas de Dolores Hidalgo
  
  const MARKERS = [
    { coords: [-100.9308, 21.1561], label: '🏛️ Jardín Principal',     color: '#14b8a6' },
    { coords: [-100.9305, 21.1563], label: '⛪ Parroquia de Dolores',  color: '#f59e0b' },
    { coords: [-100.9302, 21.1557], label: '🎭 Museo Casa Hidalgo',    color: '#ef4444' },
    { coords: [-100.9311, 21.1548], label: '🏺 Mercado de Artesanías', color: '#8b5cf6' },
  ];

  return {
    init() {
      // Inicializa el mapa con estilo dark-v11
      // Agrega marcadores personalizados con popups
    }
  };
})();
```

---

### `services/weatherService.js` — Clima en Tiempo Real

```javascript
/**
 * weatherService.js — API OpenWeatherMap
 * 
 * Endpoint: GET /data/2.5/weather?q=Dolores+Hidalgo,MX&units=metric
 * 
 * Datos mostrados:
 *   - Temperatura actual en °C
 *   - Descripción del clima en español
 *   - Emoji dinámico según código meteorológico
 *   - Humedad, velocidad del viento y sensación térmica
 * 
 * Configuración requerida:
 *   - API_KEY: clave gratuita de https://openweathermap.org/api
 *     (puede tardar 2 horas en activarse tras el registro)
 */

const WeatherService = (() => {
  const API_KEY  = 'TU_OPENWEATHER_KEY';
  const ENDPOINT = `https://api.openweathermap.org/data/2.5/weather
                    ?q=Dolores+Hidalgo,MX&units=metric&lang=es&appid=${API_KEY}`;

  // Mapeo de códigos meteorológicos a emojis
  const emoji = (code) => {
    if (code >= 200 && code < 300) return '⛈️'; // Tormenta
    if (code >= 300 && code < 600) return '🌧️'; // Lluvia
    if (code === 800)              return '☀️'; // Despejado
    if (code > 800)                return '⛅'; // Nublado parcial
    return '🌡️';
  };
})();
```

---

### `services/unsplashService.js` — Galería Fotográfica

```javascript
/**
 * unsplashService.js — API Unsplash
 * 
 * Estrategia: múltiples queries en paralelo con Promise.all()
 * para garantizar suficientes fotos de arquitectura colonial
 * (Unsplash tiene pocas fotos específicas de Dolores Hidalgo)
 * 
 * Queries utilizadas:
 *   1. 'Guanajuato+Mexico+colonial'
 *   2. 'Mexico+arquitectura+colonial'
 *   3. 'Guanajuato+callejones+coloridos'
 *   4. 'Mexico+iglesia+colonial'
 * 
 * Deduplicación por ID para evitar fotos repetidas
 * Crédito de autor requerido por Terms of Service de Unsplash
 * 
 * Configuración requerida:
 *   - ACCESS_KEY: clave de https://unsplash.com/developers
 */

const UnsplashService = (() => {
  const ACCESS_KEY = 'TU_UNSPLASH_KEY';
  
  // Múltiples queries para garantizar variedad de fotos
  const QUERIES = [
    'Guanajuato+Mexico+colonial',
    'Mexico+arquitectura+colonial',
    'Guanajuato+callejones+coloridos',
    'Mexico+iglesia+colonial',
  ];

  return {
    async init() {
      // Promise.all ejecuta todas las queries en paralelo
      const results = await Promise.all(QUERIES.map(q => fetchPhotos(q)));
      // Deduplicación por ID con Set
      const seen = new Set();
      const photos = results.flat().filter(p => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
    }
  };
})();
```

---

### `services/youtubeService.js` — Video Turístico

```javascript
/**
 * youtubeService.js — YouTube IFrame API
 * 
 * El SDK de YouTube se carga de forma asíncrona mediante
 * el script src="https://www.youtube.com/iframe_api"
 * 
 * Flujo de inicialización:
 *   1. SDK carga → dispara window.onYouTubeIframeAPIReady
 *   2. main.js intercepta el callback
 *   3. Verifica si YT.Player ya está disponible
 *   4. Llama a YoutubeService.createPlayer()
 * 
 * Configuración:
 *   - VIDEO_ID: ID del video de YouTube (después de ?v= en la URL)
 *     Ejemplo: https://youtube.com/watch?v=J6GA7tQmrAY → 'J6GA7tQmrAY'
 */

const YoutubeService = (() => {
  const VIDEO_ID = 'J6GA7tQmrAY'; // Vlog de Dolores Hidalgo - Canal Once

  return {
    createPlayer() {
      // Crea el player con aspect ratio 16:9
      // autoplay: 0 (no reproducción automática)
      // rel: 0 (no muestra videos relacionados al terminar)
      // modestbranding: 1 (reduce logo de YouTube)
    }
  };
})();
```

---

### `services/storeService.js` — Tienda de Artesanías

```javascript
/**
 * storeService.js — Tienda Local de Artesanías
 * 
 * Usa datos locales curados (no FakeStoreAPI externa)
 * para simular una tienda de productos artesanales de
 * Dolores Hidalgo con precios en MXN.
 * 
 * Productos incluidos:
 *   - Talavera Decorativa — $280 MXN
 *   - Jarrón de Barro Negro — $350 MXN
 *   - Dulces Típicos Surtidos — $120 MXN
 *   - Figura de Talavera Catrina — $450 MXN
 *   - Rebozo Artesanal de Seda — $680 MXN
 *   - Jarra de Barro — $190 MXN
 *   - Set de Tazas Talavera x4 — $520 MXN
 *   - Voucher Nieves de Sabores — $80 MXN
 * 
 * Renderiza un carrusel horizontal con scroll suave
 */
```

---

### `services/supabaseService.js` — Base de Datos Cloud

```javascript
/**
 * supabaseService.js — Supabase REST API
 * 
 * Tablas utilizadas:
 *   - users     → autenticación y roles (gestionada por Flask)
 *   - places    → lugares turísticos del municipio
 *   - favorites → lugares guardados por el visitante
 * 
 * Operaciones:
 *   - loadFavorites() → GET /rest/v1/favorites → renderiza lista
 *   - saveFavorite()  → POST /rest/v1/favorites → guarda en BD
 * 
 * Autenticación con Supabase:
 *   Headers requeridos:
 *     apikey: SUPABASE_ANON_KEY
 *     Authorization: Bearer SUPABASE_ANON_KEY
 * 
 * Configuración requerida:
 *   - SUPABASE_URL: URL del proyecto en https://supabase.com
 *   - SUPABASE_KEY: anon public key (Settings → API)
 */
```

---

### `services/cityExplorerService.js` — API Propia

```javascript
/**
 * cityExplorerService.js — Consume la API REST propia (Flask)
 * 
 * Endpoint principal: GET http://127.0.0.1:3000/api/places
 * 
 * Funcionalidades:
 *   - Carga lugares desde Supabase via API Flask
 *   - Renderiza grid de cards con emoji, nombre, descripción y categoría
 *   - Filtrado por categoría sin nueva petición HTTP (manipulación del DOM)
 *   - Fallback a datos locales si el backend no está disponible
 * 
 * Filtros disponibles:
 *   - all         → todos los lugares
 *   - historico   → sitios históricos
 *   - gastronomia → restaurantes y comida típica
 *   - artesania   → talleres y mercados artesanales
 *   - evento      → festivales y eventos locales
 */
```

---

### `api/app.py` — Backend Flask

```python
"""
app.py — CityExplorer REST API
Backend desarrollado con Python + Flask

Características principales:
  - Autenticación JWT con PyJWT
  - CRUD completo de lugares turísticos
  - Protección de rutas con decorador @require_admin
  - Conexión a Supabase PostgreSQL via REST API
  - CORS habilitado para peticiones desde el frontend

Decorador @require_admin:
  - Extrae token del header Authorization: Bearer {token}
  - Verifica firma y expiración del JWT
  - Verifica que el rol sea 'admin'
  - Devuelve 401 si no hay token o está expirado
  - Devuelve 403 si el rol no es admin

Configuración requerida (variables en el archivo):
  - SUPABASE_URL: URL del proyecto Supabase
  - SUPABASE_KEY: anon key de Supabase
  - JWT_SECRET: clave secreta para firmar tokens
  - JWT_EXPIRATION_H: horas de validez del token (default: 24)
"""

# Ejemplo del decorador de protección:
def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({ 'error': 'Token requerido' }), 401
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        if payload.get('role') != 'admin':
            return jsonify({ 'error': 'Acceso denegado' }), 403
        return f(*args, **kwargs)
    return decorated
```

---

## ⚙️ Instalación y Configuración

### Requisitos previos
- Python 3.12+
- pip
- Cuenta en Supabase
- Cuenta en Mapbox
- Cuenta en OpenWeatherMap
- Cuenta en Unsplash Developers

### 1. Clonar el repositorio
```bash
git clone https://github.com/Paola-MDiaz/City-Explorer-Dolores-Hidalgo.git
cd City-Explorer-Dolores-Hidalgo
```

### 2. Instalar dependencias del backend
```bash
cd api
pip install flask flask-cors PyJWT bcrypt
```

### 3. Configurar variables en `api/app.py`
```python
SUPABASE_URL = 'https://TU_PROYECTO.supabase.co'
SUPABASE_KEY = 'TU_SUPABASE_ANON_KEY'
JWT_SECRET   = 'tu_clave_secreta_aqui'
```

### 4. Configurar API Keys en los servicios
```javascript
// services/mapboxService.js
const TOKEN = 'pk.eyJ1...'; // Tu Mapbox public token

// services/weatherService.js
const API_KEY = 'TU_OPENWEATHER_KEY';

// services/unsplashService.js
const ACCESS_KEY = 'TU_UNSPLASH_ACCESS_KEY';

// services/supabaseService.js
const URL = 'https://TU_PROYECTO.supabase.co';
const KEY = 'TU_SUPABASE_ANON_KEY';
```

### 5. Crear tablas en Supabase
Ejecutar en el SQL Editor de Supabase:
```sql
CREATE TABLE IF NOT EXISTS users (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  password   TEXT NOT NULL,
  role       TEXT NOT NULL DEFAULT 'visitante',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS places (
  id          BIGSERIAL PRIMARY KEY,
  emoji       TEXT,
  name        TEXT NOT NULL,
  description TEXT,
  category    TEXT,
  address     TEXT,
  rating      NUMERIC(2,1),
  visit_hours TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorites (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin de prueba
INSERT INTO users (email, password, role)
VALUES ('admin@cityexplorer.com', 'admin123', 'admin');
```

### 6. Correr el backend
```bash
cd api
python app.py
# API corriendo en http://127.0.0.1:3000
```

### 7. Abrir el frontend
Abre `index.html` con **Live Server** en VS Code o directamente en el navegador.

---

## 🔑 Variables de Entorno

| Variable | Archivo | Descripción |
|---|---|---|
| `SUPABASE_URL` | `api/app.py` | URL del proyecto Supabase |
| `SUPABASE_KEY` | `api/app.py` | Anon key de Supabase |
| `JWT_SECRET` | `api/app.py` | Clave secreta para firmar JWT |
| `TOKEN` | `mapboxService.js` | Token público de Mapbox |
| `API_KEY` | `weatherService.js` | Key de OpenWeatherMap |
| `ACCESS_KEY` | `unsplashService.js` | Access key de Unsplash |

---

## 🛣️ Endpoints de la API Propia

| Método | Endpoint | Rol | Descripción |
|--------|----------|-----|-------------|
| `POST` | `/api/auth/login` | Público | Genera token JWT con rol |
| `GET` | `/api/places` | Público | Lista todos los lugares |
| `GET` | `/api/places?category=historico` | Público | Filtra por categoría |
| `GET` | `/api/places/:id` | Público | Obtiene un lugar por ID |
| `POST` | `/api/places` | **Admin** | Crea nuevo lugar en Supabase |
| `PUT` | `/api/places/:id` | **Admin** | Edita lugar existente |
| `DELETE` | `/api/places/:id` | **Admin** | Elimina lugar |
| `GET` | `/api/events` | Público | Solo eventos y festividades |
| `GET` | `/api/search?q=texto` | Público | Búsqueda global |
| `POST` | `/api/favorites` | Público | Guarda favorito del visitante |
| `GET` | `/api/health` | Público | Health check del servidor |

---

## 🚀 Despliegue

### Frontend — GitHub Pages
El frontend está desplegado automáticamente en GitHub Pages:
```
https://paola-mdiaz.github.io/City-Explorer-Dolores-Hidalgo/
```

### Backend — Railway / Render (recomendado)
Para desplegar el backend Flask:
1. Crear cuenta en [Railway](https://railway.app) o [Render](https://render.com)
2. Conectar el repositorio
3. Configurar las variables de entorno
4. Actualizar `API_BASE` en `cityExplorerService.js` con la URL del backend desplegado

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** — Estructura semántica
- **CSS3** — Estilos y animaciones
- **JavaScript ES6+** — Lógica y consumo de APIs (Vanilla, sin frameworks)
- **Tailwind CSS** — Framework de utilidades CSS (CDN)

### Backend
- **Python 3.12** — Lenguaje del backend
- **Flask** — Framework web minimalista
- **Flask-CORS** — Habilita peticiones cross-origin
- **PyJWT** — Generación y validación de tokens JWT

### Base de Datos
- **Supabase** — PostgreSQL en la nube
- **Row Level Security** — Seguridad a nivel de fila

### APIs de Terceros
- **Mapbox GL JS v3** — Mapas interactivos
- **OpenWeatherMap** — Datos meteorológicos
- **Unsplash API** — Fotografías de alta calidad
- **YouTube IFrame API** — Videos embebidos
- **FakeStoreAPI** — Datos de productos simulados

### Herramientas
- **Git + GitHub** — Control de versiones
- **GitHub Pages** — Despliegue del frontend
- **VS Code + Live Server** — Entorno de desarrollo

---

## 📄 Licencia

Proyecto académico desarrollado para la materia **Aplicaciones Web Orientadas a Servicios** en la **UTNG** · 2026.

---
