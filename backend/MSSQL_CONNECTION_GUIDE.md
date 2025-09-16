# MSSQL Database Connection Guide for NearBuy Application

## Prerequisites

1. Microsoft SQL Server installed (Express, Developer, or Standard edition)
2. ODBC Driver for SQL Server installed (version 17 or later recommended)
3. Python packages installed: `pyodbc`, `flask-sqlalchemy` (already in requirements.txt)

## Configuration Steps

### 1. Set Up Your Database

- Create a database named `NearBuy` in your SQL Server instance
- Ensure the login you plan to use has appropriate permissions on this database

### 2. Configure Connection String

Edit the `.env` file in the backend directory with your database connection details:

#### For Windows Authentication (recommended for development):

```
DATABASE_URI=mssql+pyodbc:///?odbc_connect=DRIVER={ODBC Driver 17 for SQL Server};SERVER=your_server_name;DATABASE=NearBuy;Trusted_Connection=yes
```

#### For SQL Server Authentication:

```
DATABASE_URI=mssql+pyodbc:///?odbc_connect=DRIVER={ODBC Driver 17 for SQL Server};SERVER=your_server_name;DATABASE=NearBuy;UID=your_username;PWD=your_password
```

#### For SQL Server Express:

```
DATABASE_URI=mssql+pyodbc:///?odbc_connect=DRIVER={ODBC Driver 17 for SQL Server};SERVER=localhost\SQLEXPRESS;DATABASE=NearBuy;Trusted_Connection=yes
```

### 3. Test Your Connection

Run the test script to verify your connection:

```
python test_db_connection.py
```

### 4. Troubleshooting

#### Common Issues:

1. **Driver Not Found**
   - Ensure you have the ODBC Driver for SQL Server installed
   - Check the driver version and update the connection string accordingly

2. **Server Not Found**
   - Verify the server name is correct
   - Check that SQL Server is running
   - Ensure SQL Server is configured to allow remote connections
   - Check firewall settings

3. **Authentication Failed**
   - Verify username and password if using SQL Authentication
   - Ensure the Windows user has access if using Windows Authentication

4. **Database Not Found**
   - Verify the database name exists on the server
   - Check that the login has access to the database

### 5. Database Schema

The application will automatically create the necessary tables based on the models defined in the `models` directory. If you need to modify the schema, update the corresponding model files.

### 6. Running Migrations

If you make changes to the models, you'll need to run migrations to update the database schema. This can be done using Flask-Migrate (not currently installed, but can be added if needed).

## Additional Resources

- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Flask-SQLAlchemy Documentation](https://flask-sqlalchemy.palletsprojects.com/)
- [Microsoft SQL Server Documentation](https://docs.microsoft.com/en-us/sql/)
- [pyodbc Documentation](https://github.com/mkleehammer/pyodbc/wiki)