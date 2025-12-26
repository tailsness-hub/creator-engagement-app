const express = require('express');
const InstagramService = require('../services/instagram');

const router = express.Router();
const instagramService = new InstagramService();

/**
 * Instagram OAuth Routes
 * 
 * Handles Instagram authentication and posting functionality
 */

/**
 * Initiate Instagram OAuth flow
 */
router.get('/auth/instagram', (req, res) => {
  try {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000/auth/instagram/callback';
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state in session for validation
    req.session.instagramOAuthState = state;
    
    if (!clientId) {
      return res.status(500).json({ 
        error: 'Instagram OAuth not configured',
        message: 'INSTAGRAM_CLIENT_ID environment variable is required'
      });
    }
    
    const authUrl = instagramService.getInstagramAuthUrl(clientId, redirectUri, state);
    
    res.json({
      authUrl: authUrl,
      message: 'Redirect to this URL to authenticate with Instagram'
    });
  } catch (error) {
    console.error('Instagram OAuth initiation error:', error);
    res.status(500).json({ 
      error: 'Failed to initiate Instagram OAuth',
      message: error.message 
    });
  }
});

/**
 * Handle Instagram OAuth callback
 */
router.get('/auth/instagram/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    // Validate state parameter
    if (state !== req.session.instagramOAuthState) {
      return res.status(400).json({
        error: 'Invalid state parameter',
        message: 'OAuth state validation failed'
      });
    }
    
    if (!code) {
      return res.status(400).json({
        error: 'Authorization code not provided',
        message: 'Instagram OAuth callback missing code parameter'
      });
    }
    
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
    const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000/auth/instagram/callback';
    
    if (!clientId || !clientSecret) {
      return res.status(500).json({
        error: 'Instagram OAuth not configured',
        message: 'Missing Instagram client credentials'
      });
    }
    
    // Exchange code for access token
    const tokenData = await instagramService.exchangeCodeForToken(
      clientId, 
      clientSecret, 
      redirectUri, 
      code
    );
    
    // Get long-lived token
    const longLivedToken = await instagramService.getLongLivedToken(
      clientSecret, 
      tokenData.access_token
    );
    
    // Get user profile
    const userProfile = await instagramService.getUserProfile(longLivedToken.access_token);
    
    // Store tokens and user info in session
    req.session.instagram = {
      accessToken: longLivedToken.access_token,
      tokenType: tokenData.token_type,
      expiresIn: longLivedToken.expires_in,
      userId: userProfile.id,
      username: userProfile.username,
      connectedAt: new Date().toISOString()
    };
    
    // Clean up OAuth state
    delete req.session.instagramOAuthState;
    
    res.json({
      success: true,
      message: 'Successfully connected to Instagram',
      user: {
        id: userProfile.id,
        username: userProfile.username,
        accountType: userProfile.account_type,
        mediaCount: userProfile.media_count
      }
    });
    
  } catch (error) {
    console.error('Instagram OAuth callback error:', error);
    res.status(500).json({
      error: 'Instagram OAuth failed',
      message: error.message
    });
  }
});

/**
 * Check Instagram connection status
 */
router.get('/auth/instagram/status', async (req, res) => {
  try {
    if (!req.session.instagram) {
      return res.json({
        connected: false,
        message: 'Not connected to Instagram'
      });
    }
    
    // Validate token by making API call
    const validation = await instagramService.validateToken(req.session.instagram.accessToken);
    
    if (!validation.valid) {
      // Clear invalid session
      delete req.session.instagram;
      return res.json({
        connected: false,
        message: 'Instagram token expired or invalid'
      });
    }
    
    res.json({
      connected: true,
      user: {
        id: req.session.instagram.userId,
        username: req.session.instagram.username,
        connectedAt: req.session.instagram.connectedAt
      }
    });
    
  } catch (error) {
    console.error('Instagram status check error:', error);
    res.status(500).json({
      error: 'Failed to check Instagram status',
      message: error.message
    });
  }
});

/**
 * Disconnect from Instagram
 */
router.post('/auth/instagram/disconnect', (req, res) => {
  try {
    if (req.session.instagram) {
      delete req.session.instagram;
    }
    
    res.json({
      success: true,
      message: 'Successfully disconnected from Instagram'
    });
  } catch (error) {
    console.error('Instagram disconnect error:', error);
    res.status(500).json({
      error: 'Failed to disconnect from Instagram',
      message: error.message
    });
  }
});

/**
 * Test Instagram posting (requires image URL)
 */
router.post('/auth/instagram/test-post', async (req, res) => {
  try {
    if (!req.session.instagram) {
      return res.status(401).json({
        error: 'Not connected to Instagram',
        message: 'Please authenticate with Instagram first'
      });
    }
    
    const { imageUrl, caption } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({
        error: 'Image URL required',
        message: 'Instagram posts require a publicly accessible image URL'
      });
    }
    
    const testCaption = caption || 'Test post from Creator Engagement App! 🚀\n\n#test #creatortools #socialmedia';
    
    const result = await instagramService.postToInstagram(
      req.session.instagram.accessToken,
      imageUrl,
      testCaption
    );
    
    res.json({
      success: true,
      message: 'Test post successful',
      result: result
    });
    
  } catch (error) {
    console.error('Instagram test post error:', error);
    res.status(500).json({
      error: 'Test post failed',
      message: error.response?.data?.error?.message || error.message
    });
  }
});

/**
 * Send Blast Off message to Instagram
 */
router.post('/blast-off/instagram', async (req, res) => {
  try {
    if (!req.session.instagram) {
      return res.status(401).json({
        error: 'Not connected to Instagram',
        message: 'Please authenticate with Instagram first'
      });
    }
    
    const { message, title, platform, url, imageUrl } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: 'Message is required',
        message: 'Please provide a message to post'
      });
    }
    
    if (!imageUrl) {
      return res.status(400).json({
        error: 'Image URL is required',
        message: 'Instagram posts require a publicly accessible image URL'
      });
    }
    
    // Create Instagram-formatted post
    const postData = instagramService.createBlastOffPost({
      message,
      title,
      platform,
      url,
      imageUrl
    });
    
    // Post to Instagram
    const result = await instagramService.postToInstagram(
      req.session.instagram.accessToken,
      postData.imageUrl,
      postData.caption
    );
    
    res.json({
      success: true,
      message: 'Successfully posted to Instagram',
      platform: 'Instagram',
      username: req.session.instagram.username,
      result: result
    });
    
  } catch (error) {
    console.error('Instagram Blast Off error:', error);
    res.status(500).json({
      error: 'Failed to post to Instagram',
      message: error.response?.data?.error?.message || error.message,
      details: error.response?.data || null
    });
  }
});

module.exports = router;