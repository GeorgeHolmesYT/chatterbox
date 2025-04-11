from flask import Blueprint, request, jsonify
from ..models import Message, Channel
from ..middleware import token_required
from .. import socketio

bp = Blueprint('messages', __name__, url_prefix='/api/messages')

@bp.route('/channels', methods=['GET'])
@token_required
def get_channels(current_user):
    try:
        response = Channel.get_all()
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/channels', methods=['POST'])
@token_required
def create_channel(current_user):
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Channel name is required'}), 400
    
    try:
        channel_data = {
            'name': data['name'],
            'created_by': current_user['id'],
            'description': data.get('description', '')
        }
        response = Channel.create(channel_data)
        return jsonify(response.data[0]), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/channels/<channel_id>', methods=['GET'])
@token_required
def get_channel_messages(current_user, channel_id):
    try:
        response = Message.get_by_channel(channel_id)
        return jsonify(response.data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/channels/<channel_id>', methods=['POST'])
@token_required
def send_message(current_user, channel_id):
    data = request.get_json()
    
    if not data or not data.get('content'):
        return jsonify({'error': 'Message content is required'}), 400
    
    try:
        message_data = {
            'channel_id': channel_id,
            'user_id': current_user['id'],
            'content': data['content'],
            'created_at': 'now()'
        }
        response = Message.create(message_data)
        
        # Emit the message to all connected clients
        message = response.data[0]
        socketio.emit('new_message', message, room=channel_id)
        
        return jsonify(message), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500
