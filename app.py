from flask import Flask, jsonify, request
from flask_cors import CORS
from routes.places   import places_bp
from routes.events   import events_bp
from routes.artisans import artisans_bp
import json, os, jwt, bcrypt, datetime

app = Flask(__name__)
CORS(app)

# ── Configuración ─────────────────────────────────────────────
# 🔑 REEMPLAZA con tus credenciales de Supabase
SUPABASE_URL      = 'https://upfsqqsypzmoutvcined.supabase.co'
SUPABASE_KEY      = 'sb_publishable_NJap5BmpTV7UlPwF_whg6A_aIEWPE9_'
JWT_SECRET        = 'cityexplorer_secret_2026'  # cámbialo por algo más seguro
JWT_EXPIRATION_H  = 24

HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json'
}

# Registrar blueprints
app.register_blueprint(places_bp,   url_prefix='/api/places')
app.register_blueprint(events_bp,   url_prefix='/api/events')
app.register_blueprint(artisans_bp, url_prefix='/api/artisans')

# ── Cargar datos locales ──────────────────────────────────────
DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'dolores.json')
with open(DATA_PATH, encoding='utf-8') as f:
    data = json.load(f)

# ── Decorador para proteger rutas de admin ────────────────────
def require_admin(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({ 'error': 'Token requerido' }), 401
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            if payload.get('role') != 'admin':
                return jsonify({ 'error': 'Acceso denegado. Se requiere rol admin' }), 403
            request.user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({ 'error': 'Token expirado' }), 401
        except jwt.InvalidTokenError:
            return jsonify({ 'error': 'Token inválido' }), 401
        return f(*args, **kwargs)
    return decorated

# ── LOGIN ─────────────────────────────────────────────────────
@app.route('/api/auth/login', methods=['POST'])
def login():
    import urllib.request
    body = request.get_json()
    email    = body.get('email', '').strip()
    password = body.get('password', '').strip()

    if not email or not password:
        return jsonify({ 'error': 'Email y password requeridos' }), 400

    # Buscar usuario en Supabase
    try:
        url = f"{SUPABASE_URL}/rest/v1/users?email=eq.{email}&select=*"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req) as res:
            users = json.loads(res.read())
    except Exception as e:
        return jsonify({ 'error': f'Error al consultar BD: {str(e)}' }), 500

    if not users:
        return jsonify({ 'error': 'Usuario no encontrado' }), 404

    user = users[0]

    # Verificar password (soporta texto plano por ahora)
    stored_pw = user['password']
    if stored_pw != password:
        return jsonify({ 'error': 'Contraseña incorrecta' }), 401

    # Generar token JWT
    payload = {
        'id':    user['id'],
        'email': user['email'],
        'role':  user['role'],
        'exp':   datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXPIRATION_H)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')

    return jsonify({
        'token': token,
        'role':  user['role'],
        'email': user['email'],
        'message': f'Bienvenido, {user["role"]}'
    })

# ── PLACES con Supabase ───────────────────────────────────────
@app.route('/api/places', methods=['GET'])
def get_places():
    import urllib.request
    category = request.args.get('category')
    try:
        url = f"{SUPABASE_URL}/rest/v1/places?select=*&order=id.asc"
        if category:
            url += f"&category=eq.{category}"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req) as res:
            places = json.loads(res.read())
        return jsonify({ 'total': len(places), 'places': places })
    except Exception as e:
        return jsonify({ 'error': str(e) }), 500

@app.route('/api/places/<int:place_id>', methods=['GET'])
def get_place(place_id):
    import urllib.request
    try:
        url = f"{SUPABASE_URL}/rest/v1/places?id=eq.{place_id}&select=*"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req) as res:
            places = json.loads(res.read())
        if not places:
            return jsonify({ 'error': 'Lugar no encontrado' }), 404
        return jsonify(places[0])
    except Exception as e:
        return jsonify({ 'error': str(e) }), 500

@app.route('/api/places', methods=['POST'])
@require_admin
def create_place():
    import urllib.request
    body = request.get_json()
    try:
        data_bytes = json.dumps(body).encode('utf-8')
        url = f"{SUPABASE_URL}/rest/v1/places"
        req = urllib.request.Request(url, data=data_bytes, headers={
            **HEADERS, 'Prefer': 'return=representation'
        }, method='POST')
        with urllib.request.urlopen(req) as res:
            result = json.loads(res.read())
        return jsonify(result), 201
    except Exception as e:
        return jsonify({ 'error': str(e) }), 500

@app.route('/api/places/<int:place_id>', methods=['PUT'])
@require_admin
def update_place(place_id):
    import urllib.request
    body = request.get_json()
    try:
        data_bytes = json.dumps(body).encode('utf-8')
        url = f"{SUPABASE_URL}/rest/v1/places?id=eq.{place_id}"
        req = urllib.request.Request(url, data=data_bytes, headers={
            **HEADERS, 'Prefer': 'return=representation'
        }, method='PATCH')
        with urllib.request.urlopen(req) as res:
            result = json.loads(res.read())
        return jsonify(result)
    except Exception as e:
        return jsonify({ 'error': str(e) }), 500

@app.route('/api/places/<int:place_id>', methods=['DELETE'])
@require_admin
def delete_place(place_id):
    import urllib.request
    try:
        url = f"{SUPABASE_URL}/rest/v1/places?id=eq.{place_id}"
        req = urllib.request.Request(url, headers=HEADERS, method='DELETE')
        urllib.request.urlopen(req)
        return jsonify({ 'message': 'Lugar eliminado correctamente' })
    except Exception as e:
        return jsonify({ 'error': str(e) }), 500

# ── SEARCH ────────────────────────────────────────────────────
@app.route('/api/search')
def search():
    q = request.args.get('q', '').lower()
    results = [
        p for p in data
        if q in p['name'].lower()
        or q in p['description'].lower()
        or q in p['category'].lower()
    ]
    return jsonify({ 'query': q, 'total': len(results), 'results': results })

# ── FAVORITES ─────────────────────────────────────────────────
@app.route('/api/favorites', methods=['POST'])
def save_favorite():
    import urllib.request
    body = request.get_json()
    try:
        data_bytes = json.dumps(body).encode('utf-8')
        url = f"{SUPABASE_URL}/rest/v1/favorites"
        req = urllib.request.Request(url, data=data_bytes, headers={
            **HEADERS, 'Prefer': 'return=representation'
        }, method='POST')
        with urllib.request.urlopen(req) as res:
            result = json.loads(res.read())
        return jsonify(result), 201
    except Exception as e:
        return jsonify({ 'error': str(e) }), 500

# ── HEALTH ────────────────────────────────────────────────────
@app.route('/api/health')
def health():
    return jsonify({
        'status': 'ok',
        'proyecto': 'CityExplorer API',
        'municipio': 'Dolores Hidalgo, Gto.'
    })

if __name__ == '__main__':
    app.run(debug=True, port=3000)