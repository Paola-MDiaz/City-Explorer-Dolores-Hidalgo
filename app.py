from flask import Flask, jsonify, request
from flask_cors import CORS
import json, os, jwt, datetime

app = Flask(__name__)
CORS(app)

SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '')
JWT_SECRET   = os.environ.get('JWT_SECRET', 'cityexplorer_secret_2026')

HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': f'Bearer {SUPABASE_KEY}',
    'Content-Type': 'application/json'
}

def require_admin(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Token requerido'}), 401
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
            if payload.get('role') != 'admin':
                return jsonify({'error': 'Acceso denegado'}), 403
            request.user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/auth/login', methods=['POST'])
def login():
    import urllib.request as ur
    body = request.get_json()
    email    = body.get('email', '').strip()
    password = body.get('password', '').strip()
    if not email or not password:
        return jsonify({'error': 'Email y password requeridos'}), 400
    try:
        url = f"{SUPABASE_URL}/rest/v1/users?email=eq.{email}&select=*"
        req = ur.Request(url, headers=HEADERS)
        with ur.urlopen(req) as res:
            users = json.loads(res.read())
    except Exception as e:
        return jsonify({'error': f'Error BD: {str(e)}'}), 500
    if not users:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    user = users[0]
    if user['password'] != password:
        return jsonify({'error': 'Contraseña incorrecta'}), 401
    payload = {
        'id':    user['id'],
        'email': user['email'],
        'role':  user['role'],
        'exp':   datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    return jsonify({'token': token, 'role': user['role'], 'email': user['email']})

@app.route('/api/places', methods=['GET'])
def get_places():
    import urllib.request as ur
    category = request.args.get('category')
    try:
        url = f"{SUPABASE_URL}/rest/v1/places?select=*&order=id.asc"
        if category:
            url += f"&category=eq.{category}"
        req = ur.Request(url, headers=HEADERS)
        with ur.urlopen(req) as res:
            places = json.loads(res.read())
        return jsonify({'total': len(places), 'places': places})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/places/<int:place_id>', methods=['GET'])
def get_place(place_id):
    import urllib.request as ur
    try:
        url = f"{SUPABASE_URL}/rest/v1/places?id=eq.{place_id}&select=*"
        req = ur.Request(url, headers=HEADERS)
        with ur.urlopen(req) as res:
            places = json.loads(res.read())
        if not places:
            return jsonify({'error': 'No encontrado'}), 404
        return jsonify(places[0])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/places', methods=['POST'])
@require_admin
def create_place():
    import urllib.request as ur
    body = request.get_json()
    try:
        data = json.dumps(body).encode('utf-8')
        url  = f"{SUPABASE_URL}/rest/v1/places"
        req  = ur.Request(url, data=data, headers={**HEADERS, 'Prefer': 'return=representation'}, method='POST')
        with ur.urlopen(req) as res:
            result = json.loads(res.read())
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/places/<int:place_id>', methods=['PUT'])
@require_admin
def update_place(place_id):
    import urllib.request as ur
    body = request.get_json()
    try:
        data = json.dumps(body).encode('utf-8')
        url  = f"{SUPABASE_URL}/rest/v1/places?id=eq.{place_id}"
        req  = ur.Request(url, data=data, headers={**HEADERS, 'Prefer': 'return=representation'}, method='PATCH')
        with ur.urlopen(req) as res:
            result = json.loads(res.read())
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/places/<int:place_id>', methods=['DELETE'])
@require_admin
def delete_place(place_id):
    import urllib.request as ur
    try:
        url = f"{SUPABASE_URL}/rest/v1/places?id=eq.{place_id}"
        req = ur.Request(url, headers=HEADERS, method='DELETE')
        ur.urlopen(req)
        return jsonify({'message': 'Eliminado correctamente'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/events')
def get_events():
    import urllib.request as ur
    try:
        url = f"{SUPABASE_URL}/rest/v1/places?category=eq.evento&select=*"
        req = ur.Request(url, headers=HEADERS)
        with ur.urlopen(req) as res:
            events = json.loads(res.read())
        return jsonify({'total': len(events), 'events': events})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/search')
def search():
    import urllib.request as ur
    q = request.args.get('q', '').lower()
    try:
        url = f"{SUPABASE_URL}/rest/v1/places?select=*"
        req = ur.Request(url, headers=HEADERS)
        with ur.urlopen(req) as res:
            data = json.loads(res.read())
        results = [p for p in data if q in p.get('name','').lower()
                   or q in p.get('description','').lower()
                   or q in p.get('category','').lower()]
        return jsonify({'query': q, 'total': len(results), 'results': results})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/favorites', methods=['POST'])
def save_favorite():
    import urllib.request as ur
    body = request.get_json()
    try:
        data = json.dumps(body).encode('utf-8')
        url  = f"{SUPABASE_URL}/rest/v1/favorites"
        req  = ur.Request(url, data=data, headers={**HEADERS, 'Prefer': 'return=representation'}, method='POST')
        with ur.urlopen(req) as res:
            result = json.loads(res.read())
        return jsonify(result), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'proyecto': 'CityExplorer API'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 3000))
    app.run(debug=False, host='0.0.0.0', port=port)
