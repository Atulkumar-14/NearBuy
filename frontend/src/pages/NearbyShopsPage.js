import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MapComponent from '../components/MapComponent';

const NearbyShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(5); // Default 5km radius

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to access your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  }, []);

  // Fetch nearby shops when user location is available
  useEffect(() => {
    const fetchNearbyShops = async () => {
      if (!userLocation) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/shops/nearby`, {
          params: {
            lat: userLocation.latitude,
            lng: userLocation.longitude,
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

    fetchNearbyShops();
  }, [userLocation, radius]);

  const handleRadiusChange = (e) => {
    setRadius(Number(e.target.value));
  };

  if (loading && !userLocation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          <p className="ml-3 text-lg">Getting your location...</p>
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
      
      {/* Radius Filter */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
          Search Radius (km): {radius}
        </label>
        <input
          type="range"
          id="radius"
          name="radius"
          min="1"
          max="20"
          value={radius}
          onChange={handleRadiusChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1km</span>
          <span>20km</span>
        </div>
      </div>

      {/* Map View */}
      {userLocation && (
        <div className="mb-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-96">
            <MapComponent
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              zoom={12}
              markers={[
                {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                  title: 'Your Location'
                },
                ...shops.map(shop => ({
                  latitude: shop.address?.latitude,
                  longitude: shop.address?.longitude,
                  title: shop.shop_name
                })).filter(marker => marker.latitude && marker.longitude)
              ]}
              height="400px"
            />
          </div>
        </div>
      )}

      {/* Shops List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : shops.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg">No shops found within {radius}km of your location.</p>
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
                  
                  {shop.distance && (
                    <div className="mt-2 text-sm">
                      <p className="text-primary-600 font-semibold">
                        {shop.distance} km away
                      </p>
                    </div>
                  )}
                  
                  {shop.timings && (
                    <div className="mt-2 text-sm">
                      <p className={`${shop.is_open ? 'text-green-600' : 'text-red-600'} font-semibold`}>
                        {shop.is_open ? 'Open Now' : 'Closed'}
                      </p>
                    </div>
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

export default NearbyShopsPage;