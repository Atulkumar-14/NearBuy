import os
from dotenv import load_dotenv
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import pyodbc

def test_connection():
    # Load environment variables
    load_dotenv()
    
    # Create a minimal Flask app
    app = Flask(__name__)
    
    # Get database URI from environment or use default
    db_uri = os.getenv('DATABASE_URI', 'mssql+pyodbc:///?odbc_connect=DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=NearBuy;Trusted_Connection=yes')
    
    # Configure the app
    app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize SQLAlchemy
    db = SQLAlchemy(app)
    
    # Test connection
    try:
        # Create an application context
        with app.app_context():
            # Execute a simple query using the updated SQLAlchemy syntax
            with db.engine.connect() as connection:
                result = connection.execute(db.text('SELECT 1'))
                print("Database connection successful!")
                print(f"Connected to: {db.engine.url}")
                return True
    except Exception as e:
        print(f"Database connection failed: {str(e)}")
        return False

def test_direct_pyodbc_connection():
    # Load environment variables
    load_dotenv()
    
    # Get connection details from environment or use defaults
    db_uri = os.getenv('DATABASE_URI', '')
    
    # For demonstration purposes, use a hardcoded connection string
    # This should be replaced with your actual server details
    conn_str = "DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost;DATABASE=NearBuy;Trusted_Connection=yes"
    
    # If using the connection string format from env, parse it
    if db_uri and 'odbc_connect=' in db_uri:
        try:
            # Extract the connection parameters
            conn_str = db_uri.split('odbc_connect=')[1]
            # Remove any URL encoding if present
            conn_str = conn_str.replace('%7B', '{').replace('%7D', '}')
            print(f"Using connection string from environment: {conn_str}")
        except Exception as e:
            print(f"Error parsing connection string from environment: {str(e)}")
            print("Using default connection string instead")
    
    try:
        # Try to connect directly with pyodbc
        print(f"Attempting to connect with: {conn_str}")
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cursor.execute('SELECT 1')
        result = cursor.fetchone()
        print("Direct PYODBC connection successful!")
        print(f"Result: {result[0]}")
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"Direct PYODBC connection failed: {str(e)}")
        return False

if __name__ == '__main__':
    print("Testing SQLAlchemy connection...")
    sqlalchemy_result = test_connection()
    
    print("\nTesting direct PYODBC connection...")
    pyodbc_result = test_direct_pyodbc_connection()
    
    if sqlalchemy_result and pyodbc_result:
        print("\nAll connection tests passed!")
    else:
        print("\nSome connection tests failed. Please check your configuration.")