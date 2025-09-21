import axios from "axios";
import config from "./config";

const API_URL = config.API_URL;

// Normal user API instance
const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach user token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-logout user on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ✅ Admin API instance (with /admin in baseURL)
export const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: { "Content-Type": "application/json" },
});

// Attach admin token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-logout admin on 401/403
adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      window.location.href = "/admin-login";
    }
    return Promise.reject(err);
  }
);

export default api;

// Example grouped API helpers
export const productApi = {
  getAllProducts: (params) => api.get("/products", { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  searchProducts: (query) => api.get(`/products/search?q=${query}`),
  getProductsByCategory: (category) => api.get(`/products/category/${category}`),
};

export const shopApi = {
  getAllShops: (params) => api.get("/shops", { params }),
  getShopById: (id) => api.get(`/shops/${id}`),
  getShopProducts: (id) => api.get(`/shops/${id}/products`),
  searchShops: (query) => api.get(`/shops/search?q=${query}`),
};

export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  verifyToken: () => api.get("/auth/verify"),
};

export const userApi = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (userData) => api.put("/users/profile", userData),
  changePassword: (passwordData) => api.put("/users/password", passwordData),
};
