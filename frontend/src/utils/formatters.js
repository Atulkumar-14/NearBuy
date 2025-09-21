/**
 * Utility functions for formatting data in the application
 */

/**
 * Format a distance in meters to a human-readable string
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance string
 */
export const formatDistance = (meters) => {
  if (meters === undefined || meters === null) {
    return 'Unknown distance';
  }
  
  // Convert to kilometers if distance is 1000m or more
  if (meters >= 1000) {
    const km = (meters / 1000).toFixed(1);
    return `${km} km`;
  }
  
  // Round to nearest meter
  const m = Math.round(meters);
  return `${m} m`;
};

/**
 * Format a price with currency symbol
 * @param {number} price - Price value
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currency = 'USD') => {
  if (price === undefined || price === null) {
    return 'N/A';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
};

/**
 * Format a date to a human-readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Format address object to a human-readable string
 * @param {Object} address - Address object with properties like area, city, pincode
 * @returns {string} Formatted address string
 */
export const formatAddress = (address) => {
  if (!address || typeof address !== 'object') {
    return 'Address not available';
  }
  
  const parts = [];
  
  if (address.area) parts.push(address.area);
  if (address.city) parts.push(address.city);
  if (address.pincode) parts.push(address.pincode);
  
  return parts.length > 0 ? parts.join(', ') : 'Address not available';
};