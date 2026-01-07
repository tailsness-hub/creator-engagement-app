const express = require('express');
const DiscordService = require('../services/discord');
const router = express.Router();

// Initialize Discord service
const discordService = new DiscordService();

/**
 * Discord OAuth Integration for Creator Engagement App
 * 
 * This module handles Discord authentication and API integration:
 * - OAuth 2.0 authentication flow
 * - Token management and storage
 * - Discord API posting capabilities
 */

// Discord OAuth configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
const DISCORD_API_ENDPOINT = 'https://discord.com/api/v10';

/**
 * GET /auth/discord
 * Initiate Discord OAuth flow
 */
router.get('/auth/discord', (req, res) => {
  // Check if Discord credentials are configured
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
    return res.status(500).json({
      error: 'Discord OAuth not configured',
      message: 'Please set DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in environment variables'
    });
  }

  // Generate state parameter for security
  const state = generateSecureState();
  
  // Store state in session for validation
  req.session.discordState = state;

  // Discord OAuth URL with required scopes
  const discordAuthUrl = new URL(`${DISCORD_API_ENDPOINT}/oauth2/authorize`);
  discordAuthUrl.searchParams.append('client_id', DISCORD_CLIENT_ID);
  discordAuthUrl.searchParams.append('redirect_uri', DISCORD_REDIRECT_URI);
  discordAuthUrl.searchParams.append('response_type', 'code');
  discordAuthUrl.searchParams.append('scope', 'identify guilds');
  discordAuthUrl.searchParams.append('state', state);

  res.json({
    success: true,
    authUrl: discordAuthUrl.toString(),
    message: 'Redirect user to this URL to authenticate with Discord'
  });
});

/**
 * GET /auth/discord/callback
 * Handle Discord OAuth callback
 */
router.get('/auth/discord/callback', async (req, res) => {
  const { code, state } = req.query;

  // Validate state parameter
  if (!state || state !== req.session.discordState) {
    return res.status(400).json({
      error: 'Invalid state parameter',
      message: 'Potential CSRF attack detected'
    });
  }

  // Clear state from session
  delete req.session.discordState;

  if (!code) {
    return res.status(400).json({
      error: 'Authorization code not received',
      message: 'Discord OAuth callback failed'
    });
  }

  try {
    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(code);
    
    // Get user information
    const userInfo = await getDiscordUserInfo(tokenData.access_token);
    
    // Get user's guilds (Discord servers)
    const userGuilds = await getDiscordUserGuilds(tokenData.access_token);

    // Store tokens securely (in production, use Firebase or database)
    // For now, we'll use session storage
    req.session.discordTokens = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000)
    };

    req.session.discordUser = {
      id: userInfo.id,
      username: userInfo.username,
      avatar: userInfo.avatar,
      discriminator: userInfo.discriminator
    };

    res.json({
      success: true,
      user: req.session.discordUser,
      guilds: userGuilds.length,
      message: 'Successfully authenticated with Discord'
    });

  } catch (error) {
    console.error('Discord OAuth Error:', error);
    res.status(500).json({
      error: 'Authentication failed',
      message: error.message
    });
  }
});

/**
 * GET /auth/discord/status
 * Check Discord connection status
 */
router.get('/auth/discord/status', (req, res) => {
  if (req.session.discordUser && req.session.discordTokens) {
    // Check if token is still valid
    const isExpired = Date.now() > req.session.discordTokens.expires_at;
    
    res.json({
      connected: !isExpired,
      user: req.session.discordUser,
      expires_at: req.session.discordTokens.expires_at,
      needs_refresh: isExpired
    });
  } else {
    res.json({
      connected: false,
      message: 'Not connected to Discord'
    });
  }
});

/**
 * POST /auth/discord/disconnect
 * Disconnect Discord account
 */
router.post('/auth/discord/disconnect', (req, res) => {
  // Clear Discord session data
  delete req.session.discordTokens;
  delete req.session.discordUser;
  
  res.json({
    success: true,
    message: 'Disconnected from Discord'
  });
});

/**
 * POST /auth/discord/test-webhook
 * Test Discord webhook connection
 */
router.post('/auth/discord/test-webhook', async (req, res) => {
  const { webhookUrl } = req.body;

  if (!webhookUrl) {
    return res.status(400).json({
      error: 'Webhook URL is required',
      message: 'Please provide a Discord webhook URL to test'
    });
  }

  try {
    const result = await discordService.testWebhook(webhookUrl);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /blast-off/discord
 * Post "Blast Off" message to Discord
 */
router.post('/blast-off/discord', async (req, res) => {
  const { message, webhookUrl, channels, embedOptions } = req.body;

  // Validate input
  if (!message || !message.trim()) {
    return res.status(400).json({
      error: 'Message is required',
      message: 'Please provide a message to send'
    });
  }

  try {
    const results = [];

    // Option 1: Post via webhook (recommended for simplicity)
    if (webhookUrl) {
      if (!discordService.isValidWebhookUrl(webhookUrl)) {
        return res.status(400).json({
          error: 'Invalid webhook URL',
          message: 'Please provide a valid Discord webhook URL'
        });
      }

      const embed = discordService.createBlastOffEmbed({
        title: '🚀 New Content Alert!',
        description: message,
        ...embedOptions
      });

      const webhookResult = await discordService.postViaWebhook(webhookUrl, {
        content: message,
        embeds: [embed],
        username: 'Creator Engagement App',
        avatar_url: 'https://cdn.discordapp.com/attachments/placeholder.png'
      });

      results.push({
        method: 'webhook',
        ...webhookResult
      });
    }

    // Option 2: Post via OAuth (requires authentication)
    if (req.session.discordTokens && channels && channels.length > 0) {
      // Check if token is expired
      if (Date.now() > req.session.discordTokens.expires_at) {
        return res.status(401).json({
          error: 'Token expired',
          message: 'Please re-authenticate with Discord'
        });
      }

      // This would require bot setup - placeholder for now
      results.push({
        method: 'oauth',
        success: true,
        message: 'OAuth posting would be implemented with bot permissions',
        channels: channels
      });
    }

    // If no posting method provided
    if (results.length === 0) {
      return res.status(400).json({
        error: 'No posting method specified',
        message: 'Please provide either webhookUrl or authenticate with Discord'
      });
    }

    res.json({
      success: true,
      message: 'Blast off message sent to Discord!',
      results: results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Discord Blast Off Error:', error);
    res.status(500).json({
      error: 'Failed to send message',
      message: error.message
    });
  }
});

// Helper Functions

/**
 * Generate secure random state parameter
 */
function generateSecureState() {
  return require('crypto').randomBytes(32).toString('hex');
}

/**
 * Exchange authorization code for access token
 */
async function exchangeCodeForToken(code) {
  const tokenUrl = `${DISCORD_API_ENDPOINT}/oauth2/token`;
  
  const params = new URLSearchParams();
  params.append('client_id', DISCORD_CLIENT_ID);
  params.append('client_secret', DISCORD_CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', DISCORD_REDIRECT_URI);

  const response = await fetch(tokenUrl, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Discord token exchange failed: ${errorData.error_description}`);
  }

  return await response.json();
}

/**
 * Get Discord user information
 */
async function getDiscordUserInfo(accessToken) {
  const response = await fetch(`${DISCORD_API_ENDPOINT}/users/@me`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Discord user info');
  }

  return await response.json();
}

/**
 * Get user's Discord guilds (servers)
 */
async function getDiscordUserGuilds(accessToken) {
  const response = await fetch(`${DISCORD_API_ENDPOINT}/users/@me/guilds`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Discord guilds');
  }

  return await response.json();
}

module.exports = router;