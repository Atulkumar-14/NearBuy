import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import MapComponent from '../components/MapComponent';

const ShopDetailPage = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [shopProducts, setShopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        const shopResponse = await axios.get(`http://localhost:5000/api/shops/${shopId}`);
        setShop(shopResponse.data);
        
        const productsResponse = await axios.get(`http://localhost:5000/api/shops/${shopId}/products`);
        setShopProducts(productsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch shop details. Please try again later.');
        setLoading(false);
        console.error('Error fetching shop details:', err);
      }
    };

    fetchShopDetails();
  }, [shopId]);

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

  if (!shop) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Shop not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/shops" className="text-primary-600 hover:text-primary-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Shops
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="md:flex">
          {/* Shop Image/Banner */}
          <div className="md:w-1/3 bg-gray-200 h-64 flex items-center justify-center">
            <span className="text-6xl text-gray-400">{shop.shop_name.charAt(0)}</span>
          </div>
          
          {/* Shop Info */}
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold mb-2">{shop.shop_name}</h1>
              <div className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${shop.is_open ? 'bg-green-500' : 'bg-red-500'}`}>
                {shop.is_open ? 'Open Now' : 'Closed'}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600">
                {shop.address?.street}, {shop.address?.area}, {shop.address?.city}, {shop.address?.state} - {shop.address?.pincode}
              </p>
            </div>
            
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Business Hours</h2>
              {shop.timings ? (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-gray-600">Monday - Friday:</p>
                    <p className="font-medium">{shop.timings.opening_time} - {shop.timings.closing_time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Saturday - Sunday:</p>
                    <p className="font-medium">{shop.timings.weekend_opening_time || shop.timings.opening_time} - {shop.timings.weekend_closing_time || shop.timings.closing_time}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Business hours not available</p>
              )}
            </div>
            
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
              {shop.owner && (
                <div>
                  <p className="text-gray-600">Owner: {shop.owner.owner_name}</p>
                  <p className="text-gray-600">Phone: {shop.owner.phone}</p>
                  <p className="text-gray-600">Email: {shop.owner.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Shop Products */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Products Available</h2>
        
        {shopProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No products available in this shop.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shopProducts.map(product => (
              <Link to={`/products/${product.product_id}`} key={product.product_id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 h-full flex flex-col">
                  <div className="h-48 bg-gray-200 relative">
                    {product.image && (
                      <img 
                        src={product.image} 
                        alt={product.product_name} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.product_name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{product.brand}</p>
                    
                    <div className="mt-2">
                      <p className="text-lg font-bold">₹{product.price}</p>
                    </div>
                    
                    <p className={`text-sm mt-1 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <h2 className="text-2xl font-bold p-6 border-b">Location</h2>
        {shop.address?.latitude && shop.address?.longitude ? (
          <div className="h-96">
            <MapComponent 
              latitude={shop.address.latitude} 
              longitude={shop.address.longitude}
              zoom={15}
              markers={[{
                latitude: shop.address.latitude,
                longitude: shop.address.longitude,
                title: shop.shop_name
              }]}
              height="400px"
            />
          </div>
        ) : (
          <div className="h-96 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-600">Location information not available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetailPage;