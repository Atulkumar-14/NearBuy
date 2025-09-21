# NearBuy Project Documentation

## Project Overview
NearBuy is a location-based marketplace application that connects local shops with nearby customers. The application allows users to discover shops and products in their vicinity, while shop owners can list their businesses and products.

## Project Structure

### Backend Structure

#### Models
- **models/user.py**: User model for customer accounts with authentication and profile management.
- **models/admin.py**: Admin model with userId and password fields for administrative access.
- **models/shop.py**: Shop model representing retail establishments with location data.
- **models/product.py**: Product model for items sold by shops with details and pricing.
- **models/category.py**: Category model for organizing products into groups.

#### Routes
- **routes/auth_routes.py**: Handles user authentication (login, register, token validation).
- **routes/admin_routes.py**: Admin authentication and dashboard operations (login, analytics, user/shop management).
- **routes/user_routes.py**: User profile management and related operations.
- **routes/shop_routes.py**: Shop listing, searching, and management endpoints.
- **routes/product_routes.py**: Product listing, searching, and management endpoints.

#### Utils
- **utils/auth.py**: Authentication utilities including token verification middleware.
- **utils/geo.py**: Geolocation utilities for distance calculations and nearby searches.
- **utils/validators.py**: Input validation functions for request data.

### Frontend Structure

#### Components
- **components/layout/Navbar.js**: Main navigation bar with user dropdown and authentication status.
- **components/layout/Footer.js**: Site footer with links and information.
- **components/common/**: Reusable UI components (buttons, cards, forms, etc.).
- **components/shop/**: Shop-related components (listings, details, etc.).
- **components/product/**: Product-related components (listings, details, etc.).

#### Pages
- **pages/HomePage.js**: Landing page showing nearby shops and products.
- **pages/LoginPage.js**: User login form and authentication.
- **pages/RegisterPage.js**: User registration form.
- **pages/ProfilePage.js**: User profile management.
- **pages/ShopsPage.js**: Browse and search for shops.
- **pages/ProductsPage.js**: Browse and search for products.
- **pages/ShopDetailPage.js**: Detailed view of a specific shop.
- **pages/ProductDetailPage.js**: Detailed view of a specific product.
- **pages/StoreOwnerDashboard.js**: Dashboard for shop owners to manage their shops and products.
- **pages/AdminLoginPage.js**: Admin login interface.
- **pages/AdminDashboard.js**: Admin dashboard for site management.

#### Context
- **context/AuthContext.js**: User authentication state management.
- **context/AdminAuthContext.js**: Admin authentication state management.
- **context/CartContext.js**: Shopping cart state management.

#### Utils
- **utils/api.js**: API client with axios for making backend requests.
- **utils/config.js**: Application configuration settings.
- **utils/useLocation.js**: Custom hook for handling user geolocation.

## Authentication Flow

### User Authentication
1. User enters credentials on LoginPage or registers on RegisterPage
2. Credentials are sent to backend auth routes
3. Backend validates and returns JWT token
4. Frontend stores token in localStorage
5. AuthContext maintains user state and validates token on page refresh
6. Protected routes check authentication status via AuthContext

### Admin Authentication
1. Admin enters userId and password on AdminLoginPage
2. Credentials are sent to backend admin routes
3. Backend validates against Admin model and returns JWT token
4. Frontend stores token in localStorage
5. AdminAuthContext maintains admin state and validates token on page refresh
6. Admin-only routes check authentication status via AdminAuthContext

## Data Flow

### Shop Discovery
1. User location is obtained via browser geolocation API
2. Location coordinates are sent to backend
3. Backend queries database for shops within specified radius
4. Results are returned to frontend and displayed to user

### Product Browsing
1. User selects a shop or category
2. Request is sent to backend with filters
3. Backend queries database and returns matching products
4. Frontend displays products with pagination

## Deployment Architecture
- Frontend: React application served as static files
- Backend: Flask API server
- Database: SQL database (SQLite for development, can be configured for production)
- Authentication: JWT-based token authentication

## Security Considerations
- Passwords are hashed before storage
- JWT tokens are used for authentication
- Environment variables for sensitive configuration
- Input validation on all API endpoints