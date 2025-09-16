from flask import Blueprint, jsonify, request
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import os

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Check if required fields are present
        required_fields = ['name', 'email', 'password', 'phone']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        if User.query.filter_by(phone=data['phone']).first():
            return jsonify({'error': 'Phone number already registered'}), 409
        
        # Create new user
        new_user = User(
            name=data['name'],
            email=data['email'],
            password=generate_password_hash(data['password']),
            phone=data['phone']
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'message': 'User registered successfully',
            'user_id': new_user.user_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        # Check if required fields are present
        if 'email' not in data or 'password' not in data:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user by email
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user.user_id,
            'name': user.name,
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, os.getenv('SECRET_KEY', 'dev_key_change_in_production'))
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'user_id': user.user_id,
                'name': user.name,
                'email': user.email
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Middleware function to verify token - can be used in other routes
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        
        # Check if token is in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            # Decode token
            data = jwt.decode(token, os.getenv('SECRET_KEY', 'dev_key_change_in_production'), algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
        except:
            return jsonify({'error': 'Token is invalid or expired'}), 401
        
        return f(current_user, *args, **kwargs)
    
    decorated.__name__ = f.__name__
    return decorated

@bp.route('/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'user_id': current_user.user_id,
        'name': current_user.name,
        'email': current_user.email,
        'phone': current_user.phone,
        'created_at': current_user.created_at
    })