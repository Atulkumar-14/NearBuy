from . import db
from datetime import datetime

class Shop(db.Model):
    __tablename__ = 'Shops'
    
    shop_id = db.Column(db.Integer, primary_key=True)
    shop_name = db.Column(db.String(200))
    owner_id = db.Column(db.Integer, db.ForeignKey('Shop_Owners.owner_id', ondelete='CASCADE'))
    shop_image = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    address = db.relationship('ShopAddress', backref='shop', lazy=True, uselist=False)
    timings = db.relationship('ShopTiming', backref='shop', lazy=True)
    products = db.relationship('ShopProduct', backref='shop', lazy=True)
    
    def __repr__(self):
        return f'<Shop {self.shop_name}>'


class ShopAddress(db.Model):
    __tablename__ = 'Shop_Address'
    
    address_id = db.Column(db.Integer, primary_key=True)
    shop_id = db.Column(db.Integer, db.ForeignKey('Shops.shop_id', ondelete='CASCADE'))
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    pincode = db.Column(db.String(10))
    landmark = db.Column(db.String(200))
    area = db.Column(db.String(200))
    latitude = db.Column(db.Numeric(precision=10, scale=6))
    longitude = db.Column(db.Numeric(precision=10, scale=6))
    
    def __repr__(self):
        return f'<ShopAddress {self.area}, {self.city}>'


class ShopTiming(db.Model):
    __tablename__ = 'Shop_Timings'
    
    timing_id = db.Column(db.Integer, primary_key=True)
    shop_id = db.Column(db.Integer, db.ForeignKey('Shops.shop_id', ondelete='CASCADE'))
    day = db.Column(db.String(20))
    open_time = db.Column(db.Time)
    close_time = db.Column(db.Time)
    
    def __repr__(self):
        return f'<ShopTiming {self.day}: {self.open_time}-{self.close_time}>'