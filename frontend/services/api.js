import axios from 'axios';
import config from '../config/api';

/**
 * API Service
 * 
 * Handles all API requests to the backend
 */

const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Test API connection
 */
export const testConnection = async () => {
  try {
    const response = await apiClient.get('/test');
    return response.data;
  } catch (error) {
    console.error('API connection test failed:', error);
    throw error;
  }
};

/**
 * Send blast off notification
 * (Placeholder - to be implemented)
 */
export const sendBlastOff = async (data) => {
  try {
    const response = await apiClient.post('/blastoff', data);
    return response.data;
  } catch (error) {
    console.error('Blast off failed:', error);
    throw error;
  }
};

export default {
  testConnection,
  sendBlastOff,
};
