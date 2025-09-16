from flask import Blueprint, jsonify, request
from models import db, User, SearchHistory, ProductReview
from werkzeug.security import generate_password_hash

bp = Blueprint('users', __name__, url_prefix='/api/users')

@bp.route('/', methods=['GET'])
def get_users():
    # Admin only endpoint - would require authentication in production
    try:
        users = User.query.all()
        result = []
        for user in users:
            result.append({
                'user_id': user.user_id,
                'name': user.name,
                'email': user.email,
                'phone': user.phone,
                'created_at': user.created_at
            })
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    # Get a specific user - would require authentication in production
    try:
        user = User.query.get_or_404(user_id)
        return jsonify({
            'user_id': user.user_id,
            'name': user.name,
            'email': user.email,
            'phone': user.phone,
            'created_at': user.created_at
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:user_id>/reviews', methods=['GET'])
def get_user_reviews(user_id):
    # Get all reviews by a specific user
    try:
        user = User.query.get_or_404(user_id)
        reviews = []
        
        for review in user.reviews:
            reviews.append({
                'review_id': review.review_id,
                'product_id': review.product_id,
                'product_name': review.product.product_name,
                'rating': review.rating,
                'review_text': review.review_text,
                'created_at': review.created_at
            })
        
        return jsonify(reviews)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:user_id>/search-history', methods=['GET'])
def get_user_search_history(user_id):
    # Get search history for a specific user
    try:
        user = User.query.get_or_404(user_id)
        history = []
        
        for search in user.search_history:
            history.append({
                'history_id': search.history_id,
                'search_item': search.search_item,
                'timestamp': search.timestamp
            })
        
        return jsonify(history)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    # Update user information - would require authentication in production
    try:
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        if 'name' in data:
            user.name = data['name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'email' in data:
            user.email = data['email']
        if 'password' in data:
            user.password = generate_password_hash(data['password'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'User updated successfully',
            'user_id': user.user_id
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500