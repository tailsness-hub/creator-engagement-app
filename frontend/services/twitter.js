import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3000';

// Storage keys
const TWITTER_STATUS_KEY = 'twitter_connection_status';
const TWITTER_USER_KEY = 'twitter_user_data';

/**
 * Twitter Service
 * Handles all Twitter-related API calls and authentication flow
 */
export class TwitterService {
  /**
   * Get current Twitter connection status
   */
  static async getTwitterStatus() {
    try {
      console.log('Fetching Twitter connection status...');
      
      const response = await fetch(`${BASE_URL}/auth/twitter/status`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the status locally
      await AsyncStorage.setItem(TWITTER_STATUS_KEY, JSON.stringify(data));
      if (data.user) {
        await AsyncStorage.setItem(TWITTER_USER_KEY, JSON.stringify(data.user));
      }

      console.log('Twitter status retrieved:', data);
      return data;

    } catch (error) {
      console.error('Failed to get Twitter status:', error);
      
      // Try to return cached data if available
      try {
        const cachedStatus = await AsyncStorage.getItem(TWITTER_STATUS_KEY);
        if (cachedStatus) {
          console.log('Returning cached Twitter status');
          return JSON.parse(cachedStatus);
        }
      } catch (cacheError) {
        console.error('Failed to get cached Twitter status:', cacheError);
      }

      // Return default disconnected state
      return {
        connected: false,
        user: null,
        error: error.message
      };
    }
  }

  /**
   * Initialize Twitter OAuth flow
   */
  static async initTwitterAuth() {
    try {
      console.log('Initiating Twitter OAuth flow...');
      
      const response = await fetch(`${BASE_URL}/auth/twitter/login`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.authUrl) {
        throw new Error(data.error || 'Failed to get Twitter auth URL');
      }

      console.log('Twitter auth URL received:', data.authUrl);
      return {
        success: true,
        authUrl: data.authUrl,
        oauthToken: data.oauth_token
      };

    } catch (error) {
      console.error('Twitter OAuth initiation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Disconnect Twitter account
   */
  static async disconnectTwitter() {
    try {
      console.log('Disconnecting Twitter account...');
      
      const response = await fetch(`${BASE_URL}/auth/twitter/disconnect`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Clear local cache
        await AsyncStorage.removeItem(TWITTER_STATUS_KEY);
        await AsyncStorage.removeItem(TWITTER_USER_KEY);
        console.log('Twitter account disconnected successfully');
      }

      return data;

    } catch (error) {
      console.error('Failed to disconnect Twitter:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Post a test tweet
   */
  static async postTestTweet() {
    try {
      console.log('Posting test tweet...');
      
      const response = await fetch(`${BASE_URL}/auth/twitter/test-post`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Test tweet posted:', data);
      return data;

    } catch (error) {
      console.error('Failed to post test tweet:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Post tweet via BlastOff
   */
  static async postTweet(message, mediaUrl = null) {
    try {
      console.log('Posting tweet via BlastOff...');
      
      // Validate message length
      if (!message || message.trim().length === 0) {
        throw new Error('Tweet message is required');
      }

      if (message.length > 280) {
        throw new Error('Tweet exceeds 280 character limit');
      }

      const requestBody = {
        message: message.trim(),
        mediaUrl: mediaUrl
      };

      const response = await fetch(`${BASE_URL}/blast-off/twitter`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Tweet posted successfully:', data);
      return data;

    } catch (error) {
      console.error('Failed to post tweet:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Check if user is connected to Twitter
   */
  static async isConnected() {
    try {
      const status = await this.getTwitterStatus();
      return status.connected === true;
    } catch (error) {
      console.error('Failed to check Twitter connection:', error);
      return false;
    }
  }

  /**
   * Get cached user data
   */
  static async getCachedUser() {
    try {
      const userData = await AsyncStorage.getItem(TWITTER_USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to get cached Twitter user:', error);
      return null;
    }
  }

  /**
   * Validate tweet message
   */
  static validateTweet(message) {
    const errors = [];
    
    if (!message || message.trim().length === 0) {
      errors.push('Tweet message is required');
    }
    
    if (message && message.length > 280) {
      errors.push('Tweet exceeds 280 character limit');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      characterCount: message ? message.length : 0,
      remainingCharacters: message ? 280 - message.length : 280
    };
  }
}

// Convenience exports
export const getTwitterStatus = TwitterService.getTwitterStatus;
export const initTwitterAuth = TwitterService.initTwitterAuth;
export const disconnectTwitter = TwitterService.disconnectTwitter;
export const postTestTweet = TwitterService.postTestTweet;
export const postTweet = TwitterService.postTweet;
export const isTwitterConnected = TwitterService.isConnected;
export const validateTweet = TwitterService.validateTweet;