from functools import wraps
from flask import request, jsonify
import jwt
from .config import Config
from .models import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
            user_email = data['sub']
            
            # Get user from Supabase
            response = User.get_by_email(user_email)
            if not response.data:
                return jsonify({'error': 'User not found'}), 401
                
            current_user = response.data[0]
            
        except Exception as e:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated
