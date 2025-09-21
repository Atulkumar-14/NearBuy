from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Admin(db.Model):
    __tablename__ = 'admin'
    
    userId = db.Column(db.String(50), primary_key=True)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __init__(self, userId, password):
        self.userId = userId
        self.set_password(password)
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def to_dict(self):
        return {
            'userId': self.userId,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }