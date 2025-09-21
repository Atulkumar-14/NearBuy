from flask import Blueprint, jsonify, request
from models import db, Shop, ShopAddress, ShopTiming, ShopProduct, Product
import math

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
                'created_at': shop.created_at.isoformat() if shop.created_at else None
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

@bp.route('/nearby', methods=['GET'])
def get_nearby_shops():
    try:
        # Get location parameters
        latitude = request.args.get('latitude', type=float)
        longitude = request.args.get('longitude', type=float)
        radius = request.args.get('radius', default=10, type=float)  # Default 10km radius
        
        if not latitude or not longitude:
            return jsonify({'error': 'Latitude and longitude are required'}), 400
        
        # Get all shops with addresses and calculate distance
        shops = Shop.query.join(ShopAddress).filter(
            ShopAddress.latitude.isnot(None),
            ShopAddress.longitude.isnot(None)
        ).all()
        
        nearby_shops = []
        
        for shop in shops:
            if shop.address and shop.address.latitude and shop.address.longitude:
                # Calculate distance using Haversine formula
                distance = calculate_distance(
                    latitude, longitude,
                    float(shop.address.latitude), float(shop.address.longitude)
                )
                
                if distance <= radius:
                    shop_data = {
                        'shop_id': shop.shop_id,
                        'shop_name': shop.shop_name,
                        'description': shop.description,
                        'address': {
                            'city': shop.address.city,
                            'area': shop.address.area,
                            'pincode': shop.address.pincode,
                            'latitude': float(shop.address.latitude),
                            'longitude': float(shop.address.longitude)
                        } if shop.address else None,
                        'phone': shop.phone,
                        'email': shop.email,
                        'website': shop.website,
                        'latitude': float(shop.address.latitude),
                        'longitude': float(shop.address.longitude),
                        'image': shop.shop_image,
                        'distance': round(distance, 2)
                    }
                    nearby_shops.append(shop_data)
        
        # Sort by distance
        nearby_shops.sort(key=lambda x: x['distance'])
        
        return jsonify(nearby_shops)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points using Haversine formula"""
    # Radius of the Earth in kilometers
    R = 6371.0
    
    # Convert latitude and longitude from degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Calculate the differences
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    # Apply Haversine formula
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    # Distance in kilometers
    distance = R * c
    
    return distance

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