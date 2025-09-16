import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = 'http://localhost:5000/api/products';
        
        // Add query parameters for filtering
        const params = new URLSearchParams();
        if (filters.category) params.append('category_id', filters.category);
        if (filters.brand) params.append('brand', filters.brand);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await axios.get(url);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
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
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Category</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Brand</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Search by brand"
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <button 
              className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition duration-300"
              onClick={() => setFilters({ category: '', brand: '' })}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <Link to={`/products/${product.product_id}`} key={product.product_id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 h-full flex flex-col">
                <div className="h-48 bg-gray-200 relative">
                  {product.images && product.images.length > 0 && (
                    <img 
                      src={product.images[0]} 
                      alt={product.product_name} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.product_name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                  
                  {product.min_price && (
                    <div className="mt-2">
                      {product.min_price === product.max_price ? (
                        <p className="text-lg font-bold">₹{product.min_price}</p>
                      ) : (
                        <p className="text-lg font-bold">₹{product.min_price} - ₹{product.max_price}</p>
                      )}
                    </div>
                  )}
                  
                  {product.available_in_shops && (
                    <p className="text-sm text-green-600 mt-1">
                      Available in {product.available_in_shops} {product.available_in_shops === 1 ? 'shop' : 'shops'}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;