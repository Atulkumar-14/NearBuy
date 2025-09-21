from flask import request, jsonify
from functools import wraps
import jwt
import os
from models import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        
        try:
            # Decode the token
            data = jwt.decode(token, os.getenv('SECRET_KEY', 'dev_key_change_in_production'), algorithms=["HS256"])
            current_user = User.query.filter_by(user_id=data['user_id']).first()
            
            if not current_user:
                return jsonify({'error': 'Invalid token!'}), 401
                
        except Exception as e:
            return jsonify({'error': 'Invalid token!', 'details': str(e)}), 401
            
        return f(current_user, *args, **kwargs)
    
    return decorated