from flask import Blueprint, jsonify, request
from models import db, Product, ProductCategory, ProductImage, ProductReview, ShopProduct, User, SearchHistory
from routes.auth_routes import token_required

bp = Blueprint('products', __name__, url_prefix='/api/products')

@bp.route('/', methods=['GET'])
def get_products():
    try:
        # Get query parameters for filtering
        category_id = request.args.get('category_id', type=int)
        brand = request.args.get('brand')
        limit = request.args.get('limit', 20, type=int)
        offset = request.args.get('offset', 0, type=int)
        
        # Build query
        query = Product.query
        
        if category_id:
            query = query.filter(Product.category_id == category_id)
        
        if brand:
            query = query.filter(Product.brand.ilike(f'%{brand}%'))
        
        # Execute query with pagination
        products = query.order_by(Product.product_id).limit(limit).offset(offset).all()
        
        result = []
        for product in products:
            product_data = {
                'product_id': product.product_id,
                'product_name': product.product_name,
                'brand': product.brand,
                'description': product.description,
                'color': product.color,
                'category': product.category.category_name if product.category else None,
                'images': [img.image_url for img in product.images]
            }
            
            # Get price range across shops
            shop_products = ShopProduct.query.filter_by(product_id=product.product_id).all()
            if shop_products:
                prices = [sp.price for sp in shop_products]
                product_data['min_price'] = min(prices)
                product_data['max_price'] = max(prices)
                product_data['available_in_shops'] = len(shop_products)
            
            result.append(product_data)
        
        return jsonify(result)
    except Exception as e:
        # print(e)
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        
        # Get all shops that have this product
        shops_with_product = []
        for shop_product in product.shop_products:
            shop = shop_product.shop
            shops_with_product.append({
                'shop_id': shop.shop_id,
                'shop_name': shop.shop_name,
                'price': shop_product.price,
                'stock': shop_product.stock,
                'area': shop.address.area if shop.address else None,
                'city': shop.address.city if shop.address else None
            })
        
        # Get product reviews
        reviews = []
        for review in product.reviews:
            reviews.append({
                'review_id': review.review_id,
                'user_name': review.user.name,
                'rating': review.rating,
                'review_text': review.review_text,
                'created_at': review.created_at
            })
        
        # Calculate average rating
        avg_rating = 0
        if reviews:
            avg_rating = sum(review['rating'] for review in reviews) / len(reviews)
        
        result = {
            'product_id': product.product_id,
            'product_name': product.product_name,
            'brand': product.brand,
            'description': product.description,
            'color': product.color,
            'category': product.category.category_name if product.category else None,
            'images': [img.image_url for img in product.images],
            'shops': shops_with_product,
            'reviews': reviews,
            'avg_rating': round(avg_rating, 1),
            'review_count': len(reviews)
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/search', methods=['GET'])
def search_products():
    try:
        query = request.args.get('q', '')
        user_id = request.args.get('user_id', type=int)
        
        if not query:
            return jsonify({'error': 'Search query is required'}), 400
        
        # Save search history if user_id is provided
        if user_id:
            try:
                search_history = SearchHistory(
                    user_id=user_id,
                    search_item=query
                )
                db.session.add(search_history)
                db.session.commit()
            except:
                db.session.rollback()
        
        # Search in product name, description, and brand
        products = Product.query.filter(
            db.or_(
                Product.product_name.ilike(f'%{query}%'),
                Product.description.ilike(f'%{query}%'),
                Product.brand.ilike(f'%{query}%')
            )
        ).all()
        
        result = []
        for product in products:
            product_data = {
                'product_id': product.product_id,
                'product_name': product.product_name,
                'brand': product.brand,
                'description': product.description[:100] + '...' if len(product.description) > 100 else product.description,
                'category': product.category.category_name if product.category else None,
                'image': product.images[0].image_url if product.images else None
            }
            
            # Get price range across shops
            shop_products = ShopProduct.query.filter_by(product_id=product.product_id).all()
            if shop_products:
                prices = [sp.price for sp in shop_products]
                product_data['min_price'] = min(prices)
                product_data['max_price'] = max(prices)
                product_data['available_in_shops'] = len(shop_products)
            
            result.append(product_data)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = ProductCategory.query.all()
        result = []
        
        for category in categories:
            result.append({
                'category_id': category.category_id,
                'category_name': category.category_name,
                'category_description': category.category_description,
                'product_count': Product.query.filter_by(category_id=category.category_id).count()
            })
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:product_id>/reviews', methods=['POST'])
@token_required
def add_review(current_user, product_id):
    try:
        product = Product.query.get_or_404(product_id)
        data = request.get_json()
        
        # Check if required fields are present
        if 'rating' not in data or 'review_text' not in data:
            return jsonify({'error': 'Rating and review text are required'}), 400
        
        # Validate rating
        rating = float(data['rating'])
        if rating < 1.0 or rating > 5.0:
            return jsonify({'error': 'Rating must be between 1.0 and 5.0'}), 400
        
        # Create new review
        new_review = ProductReview(
            user_id=current_user.user_id,
            product_id=product_id,
            rating=rating,
            review_text=data['review_text']
        )
        
        db.session.add(new_review)
        db.session.commit()
        
        return jsonify({
            'message': 'Review added successfully',
            'review_id': new_review.review_id
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500