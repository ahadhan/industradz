// src/utils/reverseGeocode.js

import axios from 'axios';

/**
 * Reverse geocode coordinates to get city and country names.
 * @param {number} latitude - Latitude of the location.
 * @param {number} longitude - Longitude of the location.
 * @returns {Promise<{ city: string, country: string }>} - City and country names.
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        format: 'jsonv2',
        lat: latitude,
        lon: longitude,
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'IndustrialApp/1.0 (your.email@example.com)', // Replace with your app name and contact email
        'Accept-Language': 'en',
      },
    });

    const address = response.data.address;

    const city =
      address.city ||
      address.town ||
      address.village ||
      address.hamlet ||
      address.county ||
      'Unknown';
    const country = address.country || 'Unknown';

    return { city, country };
  } catch (error) {
    console.error('Reverse Geocoding Error:', error);
    throw new Error('Unable to retrieve location details.');
  }
};
