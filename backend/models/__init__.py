from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import all models to make them available
from .user import User
from .shop_owner import ShopOwner
from .shop import Shop, ShopAddress, ShopTiming
from .product import ProductCategory, Product, ProductImage, ProductReview, ShopProduct
from .search_history import SearchHistory