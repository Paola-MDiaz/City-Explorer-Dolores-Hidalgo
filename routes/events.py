from flask import Blueprint, jsonify
import json, os

events_bp = Blueprint('events', __name__)

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'dolores.json')
with open(DATA_PATH, encoding='utf-8') as f:
    data = json.load(f)

# GET /api/events
@events_bp.route('/', methods=['GET'])
def get_events():
    events = [p for p in data if p['category'] == 'evento']
    return jsonify({ 'total': len(events), 'events': events })