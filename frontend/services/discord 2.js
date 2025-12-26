import axios from 'axios';
import config from '../config/api';

/**
 * Discord API Service
 * 
 * Handles Discord-specific API interactions
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
 * Check Discord connection status
 */
export const getDiscordStatus = async () => {
  try {
    const response = await apiClient.get('/auth/discord/status');
    return response.data;
  } catch (error) {
    console.error('Discord status check failed:', error);
    throw error;
  }
};

/**
 * Initiate Discord OAuth flow
 */
export const initDiscordAuth = async () => {
  try {
    const response = await apiClient.get('/auth/discord');
    return response.data;
  } catch (error) {
    console.error('Discord auth initiation failed:', error);
    throw error;
  }
};

/**
 * Disconnect Discord account
 */
export const disconnectDiscord = async () => {
  try {
    const response = await apiClient.post('/auth/discord/disconnect');
    return response.data;
  } catch (error) {
    console.error('Discord disconnect failed:', error);
    throw error;
  }
};

/**
 * Test Discord webhook
 */
export const testDiscordWebhook = async (webhookUrl) => {
  try {
    const response = await apiClient.post('/auth/discord/test-webhook', {
      webhookUrl
    });
    return response.data;
  } catch (error) {
    console.error('Discord webhook test failed:', error);
    throw error;
  }
};

/**
 * Send Discord blast off message
 */
export const sendDiscordBlastOff = async (messageData) => {
  try {
    const response = await apiClient.post('/blast-off/discord', messageData);
    return response.data;
  } catch (error) {
    console.error('Discord blast off failed:', error);
    throw error;
  }
};

export default {
  getDiscordStatus,
  initDiscordAuth,
  disconnectDiscord,
  testDiscordWebhook,
  sendDiscordBlastOff,
};