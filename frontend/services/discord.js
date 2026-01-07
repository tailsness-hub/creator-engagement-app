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
export const checkDiscordStatus = async () => {
  try {
    const response = await apiClient.get(config.ENDPOINTS.DISCORD_STATUS);
    return response.data;
  } catch (error) {
    console.error('Error checking Discord status:', error);
    throw error;
  }
};

/**
 * Get Discord OAuth URL
 */
export const getDiscordAuthUrl = async () => {
  try {
    const response = await apiClient.get(config.ENDPOINTS.DISCORD_AUTH);
    return response.data;
  } catch (error) {
    console.error('Error getting Discord auth URL:', error);
    throw error;
  }
};

/**
 * Disconnect from Discord
 */
export const disconnectDiscord = async () => {
  try {
    const response = await apiClient.post(config.ENDPOINTS.DISCORD_DISCONNECT);
    return response.data;
  } catch (error) {
    console.error('Error disconnecting from Discord:', error);
    throw error;
  }
};

/**
 * Test Discord webhook
 */
export const testDiscordWebhook = async (webhookUrl) => {
  try {
    const response = await apiClient.post(config.ENDPOINTS.DISCORD_TEST_WEBHOOK, {
      webhookUrl
    });
    return response.data;
  } catch (error) {
    console.error('Error testing Discord webhook:', error);
    throw error;
  }
};

/**
 * Send blast off message to Discord
 */
export const sendDiscordBlastOff = async (messageData) => {
  try {
    const response = await apiClient.post(config.ENDPOINTS.DISCORD_BLAST_OFF, messageData);
    return response.data;
  } catch (error) {
    console.error('Error sending Discord blast off:', error);
    throw error;
  }
};

/**
 * Validate Discord webhook URL format
 */
export const validateWebhookUrl = (url) => {
  const webhookRegex = /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[\w-]+$/;
  return webhookRegex.test(url);
};

export default {
  checkDiscordStatus,
  getDiscordAuthUrl, 
  disconnectDiscord,
  testDiscordWebhook,
  sendDiscordBlastOff,
  validateWebhookUrl
};