const express = require('express');
const { TwitterApi } = require('twitter-api-v2');
const router = express.Router();

// Store for OAuth tokens (in production, use database)
const oauthTokens = new Map();

// Twitter API configuration check
const hasTwitterConfig = () => {
  return process.env.TWITTER_API_KEY && 
         process.env.TWITTER_API_SECRET && 
         process.env.TWITTER_ACCESS_TOKEN && 
         process.env.TWITTER_ACCESS_TOKEN_SECRET;
};

// Twitter OAuth 1.0a configuration - only initialize if credentials exist
let twitterClient = null;
if (hasTwitterConfig()) {
  twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });
  console.log('Twitter API client initialized successfully');
} else {
  console.warn('Twitter API credentials not configured - Twitter features disabled');
}

/**
 * Initiate Twitter OAuth flow
 */
router.get('/auth/twitter/login', async (req, res) => {
  try {
    if (!hasTwitterConfig()) {
      return res.status(503).json({
        success: false,
        error: 'Twitter API not configured',
        details: 'Twitter API credentials are missing from server configuration'
      });
    }

    console.log('Starting Twitter OAuth flow...');

    // Generate OAuth request token
    const authLink = await twitterClient.generateAuthLink(
      `${process.env.BACKEND_URL || 'http://localhost:3000'}/auth/twitter/callback`,
      { linkMode: 'authorize' } // Use 'authorize' for web apps
    );

    // Store OAuth token and secret for callback
    oauthTokens.set(authLink.oauth_token, {
      oauth_token_secret: authLink.oauth_token_secret,
      timestamp: Date.now()
    });

    console.log('Twitter auth link generated:', authLink.url);
    
    // Return the authorization URL for the client to redirect to
    res.json({
      success: true,
      authUrl: authLink.url,
      oauth_token: authLink.oauth_token
    });

  } catch (error) {
    console.error('Twitter OAuth initiation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initiate Twitter OAuth',
      details: error.message
    });
  }
});

/**
 * Handle Twitter OAuth callback
 */
router.get('/auth/twitter/callback', async (req, res) => {
  try {
    const { oauth_token, oauth_verifier } = req.query;
    
    console.log('Twitter callback received:', { oauth_token, oauth_verifier });

    if (!oauth_token || !oauth_verifier) {
      throw new Error('Missing oauth_token or oauth_verifier');
    }

    // Retrieve stored OAuth token secret
    const storedTokenData = oauthTokens.get(oauth_token);
    if (!storedTokenData) {
      throw new Error('OAuth token not found or expired');
    }

    // Create client with OAuth tokens
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: oauth_token,
      accessSecret: storedTokenData.oauth_token_secret,
    });

    // Get access tokens
    const { accessToken, accessSecret, screenName, userId } = await client.login(oauth_verifier);

    // Store user data in session
    req.session.twitter = {
      accessToken,
      accessSecret,
      screenName,
      userId,
      connected: true,
      connectedAt: new Date().toISOString()
    };

    // Clean up temporary OAuth token
    oauthTokens.delete(oauth_token);

    console.log('Twitter OAuth successful for user:', screenName);

    // Redirect to success page or close popup
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:19006';
    res.redirect(`${frontendUrl}?twitter_auth=success&user=${screenName}`);

  } catch (error) {
    console.error('Twitter OAuth callback error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:19006';
    res.redirect(`${frontendUrl}?twitter_auth=error&message=${encodeURIComponent(error.message)}`);
  }
});

/**
 * Get Twitter connection status
 */
router.get('/auth/twitter/status', (req, res) => {
  try {
    if (!hasTwitterConfig()) {
      return res.json({
        connected: false,
        user: null,
        error: 'Twitter API not configured'
      });
    }

    const twitterData = req.session.twitter;
    
    if (twitterData && twitterData.connected) {
      res.json({
        connected: true,
        user: {
          screenName: twitterData.screenName,
          userId: twitterData.userId
        },
        connectedAt: twitterData.connectedAt
      });
    } else {
      res.json({
        connected: false,
        user: null
      });
    }
  } catch (error) {
    console.error('Twitter status check error:', error);
    res.status(500).json({
      connected: false,
      error: 'Failed to check Twitter status',
      details: error.message
    });
  }
});

/**
 * Disconnect Twitter account
 */
router.post('/auth/twitter/disconnect', (req, res) => {
  try {
    // Clear Twitter session data
    if (req.session.twitter) {
      delete req.session.twitter;
    }

    res.json({
      success: true,
      message: 'Successfully disconnected from Twitter'
    });

    console.log('Twitter account disconnected');
  } catch (error) {
    console.error('Twitter disconnect error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to disconnect Twitter account',
      details: error.message
    });
  }
});

/**
 * Test Twitter posting (for debugging)
 */
router.post('/auth/twitter/test-post', async (req, res) => {
  try {
    const twitterData = req.session.twitter;
    
    if (!twitterData || !twitterData.connected) {
      return res.status(401).json({
        success: false,
        error: 'Not connected to Twitter'
      });
    }

    // Create authenticated client
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: twitterData.accessToken,
      accessSecret: twitterData.accessSecret,
    });

    // Post a test tweet
    const testMessage = `Test tweet from Creator Engagement App! 🚀 ${new Date().toLocaleTimeString()}`;
    
    const tweet = await client.v2.tweet(testMessage);

    res.json({
      success: true,
      message: 'Test tweet posted successfully!',
      tweetId: tweet.data.id,
      text: tweet.data.text
    });

    console.log('Test tweet posted:', tweet.data);

  } catch (error) {
    console.error('Twitter test post error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to post test tweet',
      details: error.message
    });
  }
});

/**
 * Post tweet via BlastOff
 */
router.post('/blast-off/twitter', async (req, res) => {
  try {
    const { message, mediaUrl } = req.body;
    const twitterData = req.session.twitter;

    if (!twitterData || !twitterData.connected) {
      return res.status(401).json({
        success: false,
        error: 'Not connected to Twitter'
      });
    }

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Check tweet length (Twitter has 280 character limit)
    if (message.length > 280) {
      return res.status(400).json({
        success: false,
        error: 'Tweet exceeds 280 character limit'
      });
    }

    // Create authenticated client
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: twitterData.accessToken,
      accessSecret: twitterData.accessSecret,
    });

    let tweetOptions = { text: message };

    // Handle media if provided
    if (mediaUrl) {
      try {
        // Download and upload media (simplified version)
        // In production, you'd want to handle different media types and validation
        const mediaId = await client.v1.uploadMedia(mediaUrl);
        tweetOptions.media = { media_ids: [mediaId] };
      } catch (mediaError) {
        console.error('Media upload error:', mediaError);
        // Continue without media rather than failing the entire post
      }
    }

    // Post the tweet
    const tweet = await client.v2.tweet(tweetOptions);

    res.json({
      success: true,
      message: 'Tweet posted successfully!',
      tweetId: tweet.data.id,
      text: tweet.data.text,
      platform: 'twitter'
    });

    console.log('BlastOff tweet posted:', tweet.data);

  } catch (error) {
    console.error('BlastOff Twitter post error:', error);
    
    // Handle specific Twitter API errors
    if (error.code === 403) {
      res.status(403).json({
        success: false,
        error: 'Not authorized to post. Check Twitter API permissions.',
        details: error.message
      });
    } else if (error.code === 429) {
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
        details: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to post tweet',
        details: error.message
      });
    }
  }
});

module.exports = router;