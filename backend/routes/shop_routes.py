from flask import Blueprint, jsonify, request
from models import db, Shop, ShopAddress, ShopTiming, ShopProduct, Product

bp = Blueprint('shops', __name__, url_prefix='/api/shops')

@bp.route('/', methods=['GET'])
def get_shops():
    # Get all shops with optional filtering
    try:
        shops = Shop.query.all()
        result = []
        for shop in shops:
            shop_data = {
                'shop_id': shop.shop_id,
                'shop_name': shop.shop_name,
                'shop_image': shop.shop_image,
                'created_at': shop.created_at
            }
            if shop.address:
                shop_data['address'] = {
                    'city': shop.address.city,
                    'area': shop.address.area,
                    'pincode': shop.address.pincode,
                    'latitude': float(shop.address.latitude),
                    'longitude': float(shop.address.longitude)
                }
            result.append(shop_data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:shop_id>', methods=['GET'])
def get_shop(shop_id):
    # Get details of a specific shop
    try:
        shop = Shop.query.get_or_404(shop_id)
        shop_data = {
            'shop_id': shop.shop_id,
            'shop_name': shop.shop_name,
            'shop_image': shop.shop_image,
            'created_at': shop.created_at
        }
        
        # Add address information
        if shop.address:
            shop_data['address'] = {
                'city': shop.address.city,
                'area': shop.address.area,
                'landmark': shop.address.landmark,
                'pincode': shop.address.pincode,
                'country': shop.address.country,
                'latitude': float(shop.address.latitude),
                'longitude': float(shop.address.longitude)
            }
        
        # Add timing information
        timings = []
        for timing in shop.timings:
            timings.append({
                'day': timing.day,
                'open_time': timing.open_time.strftime('%H:%M'),
                'close_time': timing.close_time.strftime('%H:%M')
            })
        shop_data['timings'] = timings
        
        return jsonify(shop_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/nearby', methods=['GET'])
def get_nearby_shops():
    # Get shops near a specific location
    try:
        latitude = float(request.args.get('lat', 0))
        longitude = float(request.args.get('lng', 0))
        radius = float(request.args.get('radius', 5))  # Default 5km radius
        
        # Import math for more accurate distance calculation
        import math
        
        # Function to calculate distance using Haversine formula
        def calculate_distance(lat1, lon1, lat2, lon2):
            # Earth radius in kilometers
            R = 6371.0
            
            # Convert latitude and longitude from degrees to radians
            lat1_rad = math.radians(lat1)
            lon1_rad = math.radians(lon1)
            lat2_rad = math.radians(lat2)
            lon2_rad = math.radians(lon2)
            
            # Differences in coordinates
            dlon = lon2_rad - lon1_rad
            dlat = lat2_rad - lat1_rad
            
            # Haversine formula
            a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            distance = R * c
            
            return distance
        
        # Fetch all shops and filter by distance
        shops = Shop.query.join(ShopAddress).all()
        nearby_shops = []
        
        for shop in shops:
            if shop.address and shop.address.latitude and shop.address.longitude:
                # Calculate distance using Haversine formula
                distance = calculate_distance(
                    latitude, 
                    longitude, 
                    float(shop.address.latitude), 
                    float(shop.address.longitude)
                )
                
                if distance <= radius:
                    # Get current day and time to check if shop is open
                    from datetime import datetime
                    current_day = datetime.now().strftime('%A')
                    current_time = datetime.now().time()
                    
                    # Check if shop is open
                    is_open = False
                    for timing in shop.timings:
                        if timing.day.lower() == current_day.lower() and timing.open_time <= current_time <= timing.close_time:
                            is_open = True
                            break
                    
                    nearby_shops.append({
                        'shop_id': shop.shop_id,
                        'shop_name': shop.shop_name,
                        'distance': round(distance, 2),
                        'is_open': is_open,
                        'address': {
                            'area': shop.address.area,
                            'city': shop.address.city,
                            'latitude': float(shop.address.latitude),
                            'longitude': float(shop.address.longitude)
                        }
                    })
        
        return jsonify(nearby_shops)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/<int:shop_id>/products', methods=['GET'])
def get_shop_products(shop_id):
    # Get all products available in a specific shop
    try:
        shop = Shop.query.get_or_404(shop_id)
        products = []
        
        for shop_product in shop.products:
            product = shop_product.product
            products.append({
                'product_id': product.product_id,
                'product_name': product.product_name,
                'brand': product.brand,
                'price': shop_product.price,
                'stock': shop_product.stock,
                'category': product.category.category_name if product.category else None
            })
        
        return jsonify(products)
    except Exception as e:
        return jsonify({'error': str(e)}), 500