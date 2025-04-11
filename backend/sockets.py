from . import socketio
from flask_socketio import join_room, leave_room, emit
from .middleware import token_required

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('join')
def handle_join(data):
    room = data['channel_id']
    join_room(room)
    emit('status', {'message': f'User joined channel {room}'}, room=room)

@socketio.on('leave')
def handle_leave(data):
    room = data['channel_id']
    leave_room(room)
    emit('status', {'message': f'User left channel {room}'}, room=room)

@socketio.on('message')
def handle_message(data):
    room = data['channel_id']
    emit('new_message', data, room=room)
