from flask import Blueprint, jsonify, request
import json, os

places_bp = Blueprint('places', __name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'dolores.json')
with open(DATA_PATH, encoding='utf-8') as f:
    data = json.load(f)

# GET /api/places
# GET /api/places?category=historico
@places_bp.route('/', methods=['GET'])
def get_places():
    category = request.args.get('category')
    limit    = int(request.args.get('limit', 50))

    places = data
    if category:
        places = [p for p in places if p['category'] == category]

    return jsonify({ 'total': len(places), 'places': places[:limit] })

# GET /api/places/1
@places_bp.route('/<int:place_id>', methods=['GET'])
def get_place(place_id):
    place = next((p for p in data if p['id'] == place_id), None)
    if not place:
        return jsonify({ 'error': 'Lugar no encontrado' }), 404
    return jsonify(place)