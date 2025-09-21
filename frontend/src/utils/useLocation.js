import { useState, useEffect } from 'react';

const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check if we have a stored location that's not too old (30 minutes)
  const getStoredLocation = () => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      const { location, timestamp } = JSON.parse(storedLocation);
      // Check if the stored location is less than 30 minutes old
      if (Date.now() - timestamp < 30 * 60 * 1000) {
        return location;
      }
    }
    return null;
  };

  // Function to get the user's current location
  const getUserLocation = () => {
    setIsLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        
        // Store the location with a timestamp
        localStorage.setItem('userLocation', JSON.stringify({
          location,
          timestamp: Date.now()
        }));
        
        setUserLocation(location);
        setIsLoading(false);
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}`);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  useEffect(() => {
    // Try to get stored location first
    const storedLocation = getStoredLocation();
    if (storedLocation) {
      setUserLocation(storedLocation);
    } else {
      // If no valid stored location, try to get current location
      getUserLocation();
    }
  }, []);

  return { userLocation, locationError, isLoading, getUserLocation };
};

export default useUserLocation;