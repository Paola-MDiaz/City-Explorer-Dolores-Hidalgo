from flask import Blueprint, jsonify
import json, os

artisans_bp = Blueprint('artisans', __name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'dolores.json')
with open(DATA_PATH, encoding='utf-8') as f:
    data = json.load(f)

# GET /api/artisans
@artisans_bp.route('/', methods=['GET'])
def get_artisans():
    artisans = [p for p in data if p['category'] == 'artesania']
    return jsonify({ 'total': len(artisans), 'artisans': artisans })