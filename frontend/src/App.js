import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Layout Components
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShopsPage from './pages/ShopsPage';
import ShopDetailPage from './pages/ShopDetailPage';
import NearbyShopsPage from './pages/NearbyShopsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';


// Notification Component
const LoginNotification = () => {
  const { loginSuccess, currentUser } = useAuth();
  
  if (!loginSuccess || !currentUser) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 shadow-lg">
      <div className="flex">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
          </svg>
        </div>
        <div>
          <p className="font-bold">Welcome, {currentUser.name}!</p>
          <p className="text-sm">You have successfully logged in.</p>
        </div>
      </div>
    </div>
  );
};

// Auth Guard Components
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminPrivateRoute = ({ children }) => {
  const isAdminAuthenticated = localStorage.getItem('adminToken') !== null;
  return isAdminAuthenticated ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <LoginNotification />
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
        <Route path="/products/:productId" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/shops" element={<Layout><ShopsPage /></Layout>} />
        <Route path="/shops/nearby" element={<Layout><NearbyShopsPage /></Layout>} />
        <Route path="/shops/:shopId" element={<Layout><ShopDetailPage /></Layout>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminPrivateRoute>
              <AdminDashboard />
            </AdminPrivateRoute>
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Layout><ProfilePage /></Layout>
            </PrivateRoute>
          } 
        />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </AdminAuthProvider>
  );
}

export default App;
