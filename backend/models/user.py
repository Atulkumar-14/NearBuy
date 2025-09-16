from . import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'Users'
    
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    email = db.Column(db.String(200), unique=True)
    password = db.Column(db.String(255))
    phone = db.Column(db.String(15), unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    reviews = db.relationship('ProductReview', backref='user', lazy=True)
    search_history = db.relationship('SearchHistory', backref='user', lazy=True)
    
    def __repr__(self):
        return f'<User {self.name}>'