import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import MapComponent from '../components/MapComponent';
import useUserLocation from '../utils/useLocation';
import { formatAddress } from '../utils/formatters';

const NearbyShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [radius, setRadius] = useState(10); // Default 10km radius
  const { userLocation, locationError, isLoading, getUserLocation } = useUserLocation();

  useEffect(() => {
    if (userLocation) {
      fetchNearbyShops(userLocation);
    } else {
      fetchAllShops();
      setLoading(false);
    }
  }, [userLocation, radius]);

  const fetchAllShops = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/shops/`);
      setShops(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch shops. Please try again later.');
      setLoading(false);
      console.error('Error fetching shops:', err);
    }
  };

  const fetchNearbyShops = async (location) => {
    try {
      setLoading(true);
      const response = await api.get(`/shops/nearby`, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          radius: radius
        }
      });
      setShops(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch nearby shops. Please try again later.');
      setLoading(false);
      console.error('Error fetching nearby shops:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shops Near You</h1>
      
      {!userLocation && !isLoading && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
          <h2 className="text-2xl font-semibold mb-4">Enable Location Services</h2>
          <p className="text-gray-600 mb-6">
            To find shops near you, we need access to your location.
          </p>
          <button 
            onClick={getUserLocation}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Enable Location
          </button>
          
          {locationError && (
            <div className="mt-4 text-red-600">
              {locationError}
            </div>
          )}
        </div>
      )}
      
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      )}
      
      {userLocation && (
        <div>
          {/* Radius Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Search Radius</h2>
            <div className="flex items-center">
              <input
                type="range"
                min="1"
                max="50"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-4 min-w-[60px] text-center">{radius} km</span>
            </div>
          </div>
          
          {/* Map View */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Map View</h2>
            {userLocation && userLocation.latitude && userLocation.longitude ? (
              <MapComponent 
                latitude={userLocation.latitude}
                longitude={userLocation.longitude}
                zoom={12}
                markers={shops.map(shop => ({
                  latitude: shop.latitude,
                  longitude: shop.longitude,
                  title: shop.shop_name
                })).filter(shop => shop.latitude && shop.longitude)}
                height="400px"
              />
            ) : (
              <div className="h-96 bg-gray-100 flex items-center justify-center rounded-lg">
                <div className="text-center text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm">Location not available</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          )}
          
          {/* Error message */}
          {error && !loading && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>{error}</p>
            </div>
          )}
          
          {/* Shops List */}
          {!loading && !error && (
            shops.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-lg">No shops found within {radius} km of your location.</p>
                <p className="text-gray-500 mt-2">Try increasing your search radius.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shops.map(shop => (
                  <Link to={`/shops/${shop.shop_id}`} key={shop.shop_id}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 h-full">
                      <div className="h-48 bg-gray-200">
                        {shop.image && (
                          <img 
                            src={shop.image || shop.shop_image} 
                            alt={shop.shop_name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg">{shop.shop_name}</h3>
                        <p className="text-gray-600 mt-1">{formatAddress(shop.address)}</p>
                        <div className="flex items-center mt-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-600 ml-1">{shop.distance ? `${shop.distance.toFixed(1)} km away` : 'Distance unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyShopsPage;