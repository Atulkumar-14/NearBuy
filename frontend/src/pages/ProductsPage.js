import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    productsPerPage: 20,
    totalProducts: 0,
    hasMore: true
  });
  
  const location = useLocation();

  // Set up initial search term from URL if present
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchParam = queryParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
      setDebouncedSearchTerm(searchParam);
    }
  }, [location.search]);

  // Only update debouncedSearchTerm when search button is clicked
  const fetchProducts = useCallback(async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      
      let url = 'http://localhost:5000/api/products';
      
      // Add query parameters for filtering and pagination
      const params = new URLSearchParams();
      if (filters.category) params.append('category_id', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      
      // Add pagination parameters
      const offset = (page - 1) * pagination.productsPerPage;
      params.append('limit', pagination.productsPerPage);
      params.append('offset', offset);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url);
      
      if (append) {
        setProducts(prev => [...prev, ...response.data]);
      } else {
        setProducts(response.data);
      }
      
      // Update pagination state
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        hasMore: response.data.length === prev.productsPerPage
      }));
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products. Please try again later.');
      setLoading(false);
      console.error('Error fetching products:', err);
    }
  }, [filters, debouncedSearchTerm, pagination.productsPerPage]);

  // Handle search button click
  const handleSearch = () => {
    setDebouncedSearchTerm(searchTerm);
    // Reset pagination when search changes
    setPagination(prev => ({ ...prev, currentPage: 1, hasMore: true }));
  };

  useEffect(() => {
    fetchProducts(1, false);
  }, [fetchProducts]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset pagination when filters change
    setPagination(prev => ({ ...prev, currentPage: 1, hasMore: true }));
  };

  // Load more products
  const loadMoreProducts = () => {
    const nextPage = pagination.currentPage + 1;
    fetchProducts(nextPage, true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            className="bg-primary-600 text-white px-4 py-2 rounded-r hover:bg-primary-700 transition duration-300"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      
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
              onClick={() => {
                setFilters({ category: '', brand: '' });
                setSearchTerm('');
                setDebouncedSearchTerm('');
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      )}
      
      {/* Error message */}
      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {/* Products Grid */}
      {!loading && !error && (
        products.length === 0 ? (
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
        )
      )}
      
      {/* Load More Button */}
      {!loading && !error && products.length > 0 && pagination.hasMore && (
        <div className="text-center mt-8">
          <button 
            onClick={loadMoreProducts}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition duration-300"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;