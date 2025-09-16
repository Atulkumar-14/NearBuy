from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from models import User
from models import db
# Load environment variables
load_dotenv()

app = Flask(__name__)

# Configure CORS
CORS(app)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'mssql+pyodbc:///?odbc_connect=DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=NearBuy;Trusted_Connection=yes')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev_key_change_in_production')

# db = SQLAlchemy(app)
db.init_app(app) 
# Import routes after app initialization to avoid circular imports
from routes import register_blueprints

# Register all blueprints
register_blueprints(app)

@app.route('/')
def index():
    # with app.app_context():
    #     users = User.query.all()
    # print(User.query.all())
    return jsonify({'message': 'Welcome to NearBuyfgg'})

if __name__ == '__main__':
    app.run(debug=True)