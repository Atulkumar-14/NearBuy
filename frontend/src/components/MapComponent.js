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

  useEffect(() => {
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

    // Add additional markers if provided
    if (mapInstanceRef.current && markers.length > 0) {
      markers.forEach(marker => {
        L.marker([marker.latitude, marker.longitude])
          .addTo(mapInstanceRef.current)
          .bindPopup(marker.title || 'Location');
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom, markers]);

  return (
    <div ref={mapRef} style={{ height, width: '100%' }} className="rounded-lg overflow-hidden shadow-md" />
  );
};

export default MapComponent;