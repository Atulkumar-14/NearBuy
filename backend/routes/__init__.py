# Routes package initialization
from flask import Blueprint

# Import all route blueprints
from .product_routes import bp as product_bp
from .shop_routes import bp as shop_bp
from .user_routes import bp as user_bp
from .auth_routes import bp as auth_bp
from .admin_routes import bp as admin_bp

def register_blueprints(app):
    """
    Register all API blueprints with the Flask application
    """
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(shop_bp, url_prefix='/api/shops')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')