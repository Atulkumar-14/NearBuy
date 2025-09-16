# Routes package initialization
from flask import Blueprint

# Import all route blueprints
from routes.product_routes import bp as product_bp
from routes.shop_routes import bp as shop_bp
from routes.user_routes import bp as user_bp
from routes.auth_routes import bp as auth_bp

def register_blueprints(app):
    """
    Register all API blueprints with the Flask application
    """
    app.register_blueprint(product_bp)
    app.register_blueprint(shop_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(auth_bp)