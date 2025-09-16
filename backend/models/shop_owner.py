from . import db

class ShopOwner(db.Model):
    __tablename__ = 'Shop_Owners'
    
    owner_id = db.Column(db.Integer, primary_key=True)
    owner_name = db.Column(db.String(150))
    phone = db.Column(db.String(15), unique=True)
    email = db.Column(db.String(200), unique=True)
    
    # Relationships
    shops = db.relationship('Shop', backref='owner', lazy=True)
    
    def __repr__(self):
        return f'<ShopOwner {self.owner_name}>'