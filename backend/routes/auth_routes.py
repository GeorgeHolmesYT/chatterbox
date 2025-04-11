from flask import Blueprint, request, jsonify
import jwt
import datetime
from ..models import User
from ..config import Config

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password') or not data.get('username'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create user in Supabase
    try:
        response = User.create({
            'username': data['username'],
            'email': data['email'],
            'password': data['password']  # Note: In production, use Supabase Auth
        })
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Validate input
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    # In a real app, you would verify credentials with Supabase Auth
    # For demo purposes, we'll create a token directly
    token = jwt.encode({
        'sub': data['email'],
        'iat': datetime.datetime.utcnow(),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }, Config.SECRET_KEY, algorithm='HS256')
    
    return jsonify({'token': token}), 200
