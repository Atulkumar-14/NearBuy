import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StoreOwnerDashboard = () => {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('shops');
  
  // Get user token from localStorage
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    const fetchOwnerData = async () => {
      try {
        setLoading(true);
        
        // Fetch owner's shops
        const shopsResponse = await axios.get('http://localhost:5000/api/shop-owner/shops', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setShops(shopsResponse.data);
        
        // If shops exist, fetch products for the first shop
        if (shopsResponse.data.length > 0) {
          const productsResponse = await axios.get(
            `http://localhost:5000/api/shops/${shopsResponse.data[0].shop_id}/products`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          setProducts(productsResponse.data);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching owner data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchOwnerData();
  }, [token]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Store Owner Dashboard</h1>
      
      {/* Dashboard Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block py-4 px-4 text-sm font-medium text-center ${activeTab === 'shops' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange('shops')}
            >
              My Shops
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-4 px-4 text-sm font-medium text-center ${activeTab === 'products' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange('products')}
            >
              Products
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-4 px-4 text-sm font-medium text-center ${activeTab === 'analytics' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange('analytics')}
            >
              Analytics
            </button>
          </li>
        </ul>
      </div>
      
      {/* Shops Tab */}
      {activeTab === 'shops' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">My Shops</h2>
            <Link to="/add-shop" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition duration-300">
              Add New Shop
            </Link>
          </div>
          
          {shops.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-4">You don't have any shops yet.</p>
              <Link to="/add-shop" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition duration-300">
                Add Your First Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map(shop => (
                <div key={shop.shop_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                  <div className="h-40 bg-gray-200 relative">
                    {/* Shop image placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl text-gray-400">{shop.shop_name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{shop.shop_name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{shop.address?.area}, {shop.address?.city}</p>
                    
                    <div className="flex space-x-2">
                      <Link to={`/edit-shop/${shop.shop_id}`} className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition duration-300 text-sm">
                        Edit
                      </Link>
                      <Link to={`/shop-products/${shop.shop_id}`} className="bg-primary-50 text-primary-700 px-3 py-1 rounded hover:bg-primary-100 transition duration-300 text-sm">
                        Manage Products
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Products</h2>
            <Link to="/add-product" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition duration-300">
              Add New Product
            </Link>
          </div>
          
          {products.length === 0 ? (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-4">No products available.</p>
              <Link to="/add-product" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition duration-300">
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Product Name</th>
                    <th className="py-3 px-4 text-left">Brand</th>
                    <th className="py-3 px-4 text-left">Category</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Stock</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map(product => (
                    <tr key={product.product_id}>
                      <td className="py-3 px-4">{product.product_name}</td>
                      <td className="py-3 px-4">{product.brand}</td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">₹{product.price}</td>
                      <td className="py-3 px-4">{product.stock}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link to={`/edit-product/${product.product_id}`} className="text-blue-600 hover:text-blue-800">
                            Edit
                          </Link>
                          <button className="text-red-600 hover:text-red-800">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Analytics</h2>
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-gray-600">Analytics features coming soon!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;