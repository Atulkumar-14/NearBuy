from app import app, db
from models.admin import Admin

with app.app_context():
    # Create tables if they don't exist
    db.create_all()
    
    # Check if admin already exists
    existing_admin = Admin.query.filter_by(userId='admin').first()
    
    if not existing_admin:
        # Create admin user
        admin = Admin(userId='admin', password='admin123')
        db.session.add(admin)
        db.session.commit()
        print('Admin user created successfully!')
    else:
        print('Admin user already exists!')