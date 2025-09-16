from . import db
from datetime import datetime

class ProductCategory(db.Model):
    __tablename__ = 'Product_Categories'
    
    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String(100), unique=True)
    category_description = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='category', lazy=True)
    
    def __repr__(self):
        return f'<ProductCategory {self.category_name}>'


class Product(db.Model):
    __tablename__ = 'Products'
    
    product_id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(200))
    category_id = db.Column(db.Integer, db.ForeignKey('Product_Categories.category_id', ondelete='CASCADE'))
    brand = db.Column(db.String(100))
    description = db.Column(db.String(1000))
    color = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    images = db.relationship('ProductImage', backref='product', lazy=True)
    reviews = db.relationship('ProductReview', backref='product', lazy=True)
    shop_products = db.relationship('ShopProduct', backref='product', lazy=True)
    
    def __repr__(self):
        return f'<Product {self.product_name}>'


class ProductImage(db.Model):
    __tablename__ = 'Product_Images'
    
    image_id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('Products.product_id', ondelete='CASCADE'))
    image_url = db.Column(db.String(500))
    
    def __repr__(self):
        return f'<ProductImage {self.image_id} for product {self.product_id}>'


class ProductReview(db.Model):
    __tablename__ = 'Product_Reviews'
    
    review_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id', ondelete='CASCADE'))
    product_id = db.Column(db.Integer, db.ForeignKey('Products.product_id', ondelete='CASCADE'))
    rating = db.Column(db.Float, db.CheckConstraint('rating BETWEEN 1.0 AND 5.0'))
    review_text = db.Column(db.String(1000))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<ProductReview {self.review_id} by user {self.user_id}>'


class ShopProduct(db.Model):
    __tablename__ = 'Shop_Product'
    
    shop_product_id = db.Column(db.Integer, primary_key=True)
    shop_id = db.Column(db.Integer, db.ForeignKey('Shops.shop_id', ondelete='CASCADE'))
    product_id = db.Column(db.Integer, db.ForeignKey('Products.product_id', ondelete='CASCADE'))
    price = db.Column(db.Numeric(precision=10, scale=2))
    stock = db.Column(db.Integer)
    
    def __repr__(self):
        return f'<ShopProduct {self.shop_product_id}>'