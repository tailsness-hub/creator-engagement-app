import axios from 'axios';
import config from '../config/api';

/**
 * Instagram API Service
 * 
 * Handles Instagram-specific API interactions
 */

const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session cookies
});

/**
 * Check Instagram connection status
 */
export const checkInstagramStatus = async () => {
  try {
    const response = await apiClient.get(config.ENDPOINTS.INSTAGRAM_STATUS);
    return response.data;
  } catch (error) {
    console.error('Error checking Instagram status:', error);
    throw error;
  }
};

/**
 * Get Instagram OAuth URL
 */
export const getInstagramAuthUrl = async () => {
  try {
    const response = await apiClient.get(config.ENDPOINTS.INSTAGRAM_AUTH);
    return response.data;
  } catch (error) {
    console.error('Error getting Instagram auth URL:', error);
    throw error;
  }
};

/**
 * Disconnect from Instagram
 */
export const disconnectInstagram = async () => {
  try {
    const response = await apiClient.post(config.ENDPOINTS.INSTAGRAM_DISCONNECT);
    return response.data;
  } catch (error) {
    console.error('Error disconnecting from Instagram:', error);
    throw error;
  }
};

/**
 * Test Instagram posting
 */
export const testInstagramPost = async (imageUrl, caption) => {
  try {
    const response = await apiClient.post(config.ENDPOINTS.INSTAGRAM_TEST_POST, {
      imageUrl,
      caption
    });
    return response.data;
  } catch (error) {
    console.error('Error testing Instagram post:', error);
    throw error;
  }
};

/**
 * Send blast off message to Instagram
 */
export const sendInstagramBlastOff = async (messageData) => {
  try {
    const response = await apiClient.post(config.ENDPOINTS.INSTAGRAM_BLAST_OFF, messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending Instagram blast off:', error);
    throw error;
  }
};

/**
 * Validate Instagram image URL format
 * Instagram requires publicly accessible HTTPS URLs
 */
export const validateImageUrl = (url) => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && 
           (url.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i) !== null);
  } catch {
    return false;
  }
};

export default {
  checkInstagramStatus,
  getInstagramAuthUrl, 
  disconnectInstagram,
  testInstagramPost,
  sendInstagramBlastOff,
  validateImageUrl
};