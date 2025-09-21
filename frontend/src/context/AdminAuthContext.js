import React, { createContext, useState, useContext, useEffect } from 'react';
import { adminApi } from '../utils/api';
import axios from 'axios';
import config from '../utils/config';

const AdminAuthContext = createContext();

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export function AdminAuthProvider({ children }) {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // checks session
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Check session on mount
  useEffect(() => {
    const checkAdminAuthStatus = async () => {
      const token = localStorage.getItem('adminToken');
      const adminData = localStorage.getItem('adminData');
      if (token && adminData) {
        try {
          const res = await adminApi.get('/verify-token');
          if (res.data.valid) {
            setCurrentAdmin(JSON.parse(adminData));
          } else {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminData');
          }
        } catch (err) {
          console.error('Token validation error:', err);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminData');
        }
      }
      setLoading(false);
    };
    checkAdminAuthStatus();
  }, []);

  // Auto-hide login success
  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => setLoginSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess]);

  const login = async (userId, password) => {
    try {
      setError('');
      const res = await adminApi.post('/login', { userId, password });
      if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminData', JSON.stringify(res.data.admin));
        setCurrentAdmin(res.data.admin);
        setLoginSuccess(true);
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setCurrentAdmin(null);
  };

  const isAuthenticated = !!currentAdmin; // ✅ important flag for dashboard

  const value = {
    currentAdmin,
    login,
    logout,
    error,
    loginSuccess,
    isAuthenticated,
    loading
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {!loading && children} {/* Render children only after checking session */}
    </AdminAuthContext.Provider>
  );
}
