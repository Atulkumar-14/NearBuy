import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon issue in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapComponent = ({ latitude, longitude, zoom = 13, markers = [], height = '400px' }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Validate coordinates
  const isValidCoordinate = (coord) => {
    return coord !== null && coord !== undefined && !isNaN(coord) && isFinite(coord);
  };

  const hasValidCoordinates = isValidCoordinate(latitude) && isValidCoordinate(longitude);

  useEffect(() => {
    // Validate coordinates before creating map
    if (!hasValidCoordinates) {
      console.warn('Invalid coordinates provided to MapComponent:', { latitude, longitude });
      return;
    }

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current && mapRef.current) {
      // Create map instance
      mapInstanceRef.current = L.map(mapRef.current).setView([latitude, longitude], zoom);

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Add main marker
      L.marker([latitude, longitude])
        .addTo(mapInstanceRef.current)
        .bindPopup('Selected Location')
        .openPopup();
    } else if (mapInstanceRef.current) {
      // Update view if map already exists
      mapInstanceRef.current.setView([latitude, longitude], zoom);
    }

    // Add additional markers if provided (with validation)
    if (mapInstanceRef.current && markers.length > 0) {
      markers.forEach(marker => {
        if (marker.latitude && marker.longitude && !isNaN(marker.latitude) && !isNaN(marker.longitude)) {
          L.marker([marker.latitude, marker.longitude])
            .addTo(mapInstanceRef.current)
            .bindPopup(marker.title || 'Location');
        } else {
          console.warn('Invalid marker coordinates:', marker);
        }
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom, markers, hasValidCoordinates]);

  if (!hasValidCoordinates) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden shadow-md" style={{ height, width: '100%' }}>
        <div className="text-center text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm">Location not available</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapRef} style={{ height, width: '100%' }} className="rounded-lg overflow-hidden shadow-md" />
  );
};

export default MapComponent;