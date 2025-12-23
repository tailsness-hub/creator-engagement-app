/**
 * API Configuration
 * 
 * Update the API_BASE_URL to point to your backend server
 */

// For local development
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'
  : 'https://your-production-api.com/api';

export default {
  API_BASE_URL,
};
