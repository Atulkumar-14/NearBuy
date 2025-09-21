import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { formatDistance, formatAddress } from '../utils/formatters';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyShops, setNearbyShops] = useState([]);
  const [nearbyProducts, setNearbyProducts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    if (userLocation) {
      fetchNearbyData();
    }
  }, [userLocation]);

  const fetchNearbyData = async () => {
    if (!userLocation) return;
    
    setIsLoadingData(true);
    try {
      const { latitude, longitude } = userLocation;
      
      // Fetch nearby shops
      const shopsResponse = await api.get(`/shops/nearby?lat=${latitude}&lng=${longitude}&radius=10000`);
      setNearbyShops(shopsResponse.data || []);
      
      // Fetch nearby products
      const productsResponse = await api.get(`/products/nearby?lat=${latitude}&lng=${longitude}&radius=10000`);
      setNearbyProducts(productsResponse.data || []);
    } catch (error) {
      console.error('Error fetching nearby data:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        setLocationError('Unable to retrieve your location');
        setIsLoadingLocation(false);
        console.error('Geolocation error:', error);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Products Near You</h1>
            <p className="text-xl mb-8 opacity-90">Find the best local shops and products in your neighborhood</p>
            
            <div className="flex justify-center mb-8">
               {!currentUser ? (
                 <div className="relative flex space-x-4">
                   <button 
                     onClick={() => setShowLoginOptions(!showLoginOptions)}
                     className="bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition duration-300 shadow-md flex items-center"
                   >
                     Login
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                     </svg>
                   </button>
                   <Link to="/register" className="bg-yellow-400 hover:bg-yellow-500 text-primary-800 px-6 py-3 rounded-lg font-medium transition duration-300 shadow-md">Sign Up</Link>
                   
                   {showLoginOptions && (
                     <div className="absolute mt-2 bg-white rounded-lg shadow-xl p-4 z-50">
                       <div className="flex flex-col space-y-2">
                         <Link to="/login" className="text-primary-700 hover:bg-gray-100 px-4 py-2 rounded transition">User Login</Link>
                         <Link to="/admin-login" className="text-primary-700 hover:bg-gray-100 px-4 py-2 rounded transition">Admin Login</Link>
                       </div>
                     </div>
                   )}
                 </div>
               ) : (
                 <Link to="/profile" className="bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition duration-300 shadow-md">My Profile</Link>
               )}
             </div>
            
            <form onSubmit={handleSearch} className="max-w-lg mx-auto">
              <div className="flex shadow-lg rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="flex-grow px-6 py-4 text-gray-800 focus:outline-none text-lg"
                />
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-primary-800 font-medium px-6 py-4 transition duration-300"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Location-based Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Discover What's Near You</h2>
          
          {!userLocation && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md mx-auto">
              <div className="mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-lg mb-6 text-gray-600">Enable location services to see shops and products near you</p>
              <button
                onClick={getUserLocation}
                disabled={isLoadingLocation}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition duration-300 font-medium shadow-md"
              >
                {isLoadingLocation ? 'Getting Location...' : 'Enable Location'}
              </button>
              
              {isLoadingLocation && (
                <div className="mt-6">
                  <LoadingSpinner />
                </div>
              )}
              
              {locationError && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
                  <p>{locationError}</p>
                </div>
              )}
            </div>
          )}
          
          {userLocation && (
            <>
              {isLoadingData ? (
                <div className="flex justify-center my-12">
                  <LoadingSpinner />
                </div>
              ) : (
                <div>
                  {/* Nearby Shops */}
                  <div className="mb-16">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Shops Near You</h3>
                      {nearbyShops.length > 4 && (
                        <Link 
                          to="/shops/nearby" 
                          className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                        >
                          View all
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      )}
                    </div>
                    
                    {nearbyShops.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {nearbyShops.slice(0, 4).map(shop => (
                          <Link 
                            to={`/shops/${shop.shop_id}`} 
                            key={shop.shop_id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
                          >
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={shop.image || shop.shop_image || 'https://via.placeholder.com/300x200?text=Shop'} 
                                alt={shop.shop_name || shop.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-5">
                              <h4 className="font-bold text-lg mb-2 text-gray-800">{shop.shop_name || shop.name}</h4>
                              <p className="text-gray-600 text-sm mb-3">{formatAddress(shop.address)}</p>
                              <div className="flex items-center text-primary-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm font-medium">
                                  {formatDistance(shop.distance)} away
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <p className="text-gray-500">No shops found nearby</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Nearby Products */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800">Products Near You</h3>
                      {nearbyProducts.length > 4 && (
                        <Link 
                          to="/products/nearby" 
                          className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
                        >
                          View all
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      )}
                    </div>
                    
                    {nearbyProducts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {nearbyProducts.slice(0, 4).map(product => (
                          <Link 
                            to={`/products/${product.product_id}`} 
                            key={product.product_id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
                          >
                            <div className="h-48 overflow-hidden relative">
                              <img 
                                src={product.image || (product.images && product.images[0]) || 'https://via.placeholder.com/300x200?text=Product'} 
                                alt={product.product_name || product.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-0 right-0 bg-yellow-400 text-primary-800 font-bold px-3 py-1 m-2 rounded-full text-sm">
                                ${product.min_price ? product.min_price.toFixed(2) : 'N/A'}
                              </div>
                            </div>
                            <div className="p-5">
                              <h4 className="font-bold text-lg mb-1 text-gray-800">{product.product_name || product.name}</h4>
                              <p className="text-gray-600 text-sm mb-3">{product.brand}</p>
                              <div className="flex items-center text-gray-500 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span>{product.shop_name}</span>
                                <span className="mx-2">•</span>
                                <span>{formatDistance(product.distance)} away</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl shadow-md p-8 text-center">
                        <p className="text-gray-500">No products found nearby</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;