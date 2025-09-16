import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    area: '',
    city: '',
  });

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        let url = 'http://localhost:5000/api/shops';
        
        // Add query parameters for filtering
        const params = new URLSearchParams();
        if (filters.area) params.append('area', filters.area);
        if (filters.city) params.append('city', filters.city);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await axios.get(url);
        setShops(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch shops. Please try again later.');
        setLoading(false);
        console.error('Error fetching shops:', err);
      }
    };

    fetchShops();
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
      <h1 className="text-3xl font-bold mb-6">Shops Near You</h1>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">City</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Filter by city"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2">Area</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Filter by area"
              value={filters.area}
              onChange={(e) => handleFilterChange('area', e.target.value)}
            />
          </div>
          
          <div className="flex items-end">
            <button 
              className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition duration-300"
              onClick={() => setFilters({ city: '', area: '' })}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* Shops Grid */}
      {shops.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">No shops found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map(shop => (
            <Link to={`/shops/${shop.shop_id}`} key={shop.shop_id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 h-full flex flex-col">
                <div className="h-48 bg-gray-200 relative">
                  {/* Placeholder for shop image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl text-gray-400">{shop.shop_name.charAt(0)}</span>
                  </div>
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="font-semibold text-lg mb-1">{shop.shop_name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{shop.address?.area}, {shop.address?.city}</p>
                  
                  {shop.timings && (
                    <div className="mt-2 text-sm">
                      <p className={`${shop.is_open ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                        {shop.is_open ? 'Open Now' : 'Closed'}
                      </p>
                      <p className="text-gray-600">
                        {shop.timings.opening_time} - {shop.timings.closing_time}
                      </p>
                    </div>
                  )}
                  
                  {shop.product_count > 0 && (
                    <p className="text-sm text-primary-600 mt-2">
                      {shop.product_count} {shop.product_count === 1 ? 'product' : 'products'} available
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

export default ShopsPage;