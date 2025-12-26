/**
 * API Configuration
 * 
 * Update the API_BASE_URL to point to your backend server
 */

// For local development
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'
  : 'https://your-production-api.com';

// API endpoints - Discord and Instagram routes are mounted at root level
const ENDPOINTS = {
  // Discord endpoints
  DISCORD_AUTH: '/auth/discord',
  DISCORD_CALLBACK: '/auth/discord/callback', 
  DISCORD_STATUS: '/auth/discord/status',
  DISCORD_DISCONNECT: '/auth/discord/disconnect',
  DISCORD_TEST_WEBHOOK: '/auth/discord/test-webhook',
  DISCORD_BLAST_OFF: '/blast-off/discord',
  
  // Instagram endpoints
  INSTAGRAM_AUTH: '/auth/instagram',
  INSTAGRAM_CALLBACK: '/auth/instagram/callback',
  INSTAGRAM_STATUS: '/auth/instagram/status',
  INSTAGRAM_DISCONNECT: '/auth/instagram/disconnect',
  INSTAGRAM_TEST_POST: '/auth/instagram/test-post',
  INSTAGRAM_BLAST_OFF: '/blast-off/instagram'
};

export default {
  API_BASE_URL,
  ENDPOINTS,
};
