const axios = require('axios');
const FormData = require('form-data');

/**
 * Instagram API Service
 * 
 * Handles Instagram Graph API interactions for content publishing
 * Uses Instagram Basic Display API for authentication and Instagram Graph API for posting
 */
class InstagramService {
  constructor() {
    this.baseURL = 'https://graph.instagram.com';
    this.facebookGraphURL = 'https://graph.facebook.com';
  }

  /**
   * Get Instagram OAuth URL for user authentication
   */
  getInstagramAuthUrl(clientId, redirectUri, state) {
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'user_profile,user_media,instagram_content_publish',
      response_type: 'code',
      state: state
    });

    return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(clientId, clientSecret, redirectUri, code) {
    try {
      const formData = new FormData();
      formData.append('client_id', clientId);
      formData.append('client_secret', clientSecret);
      formData.append('grant_type', 'authorization_code');
      formData.append('redirect_uri', redirectUri);
      formData.append('code', code);

      const response = await axios.post('https://api.instagram.com/oauth/access_token', formData, {
        headers: formData.getHeaders()
      });

      return response.data;
    } catch (error) {
      console.error('Error exchanging Instagram code for token:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get long-lived access token from short-lived token
   */
  async getLongLivedToken(clientSecret, accessToken) {
    try {
      const params = new URLSearchParams({
        grant_type: 'ig_exchange_token',
        client_secret: clientSecret,
        access_token: accessToken
      });

      const response = await axios.get(`${this.facebookGraphURL}/access_token?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error getting long-lived Instagram token:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get Instagram user profile information
   */
  async getUserProfile(accessToken) {
    try {
      const params = new URLSearchParams({
        fields: 'id,username,account_type,media_count',
        access_token: accessToken
      });

      const response = await axios.get(`${this.baseURL}/me?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error getting Instagram user profile:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create Instagram media container (first step of posting)
   */
  async createMediaContainer(accessToken, imageUrl, caption) {
    try {
      const params = new URLSearchParams({
        image_url: imageUrl,
        caption: caption,
        access_token: accessToken
      });

      const response = await axios.post(`${this.baseURL}/me/media`, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating Instagram media container:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Publish Instagram media container (second step of posting)
   */
  async publishMedia(accessToken, creationId) {
    try {
      const params = new URLSearchParams({
        creation_id: creationId,
        access_token: accessToken
      });

      const response = await axios.post(`${this.baseURL}/me/media_publish`, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error publishing Instagram media:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Post to Instagram (complete workflow)
   * Note: Instagram requires a publicly accessible image URL
   */
  async postToInstagram(accessToken, imageUrl, caption) {
    try {
      // Step 1: Create media container
      const containerResult = await this.createMediaContainer(accessToken, imageUrl, caption);
      
      if (!containerResult.id) {
        throw new Error('Failed to create media container');
      }

      // Step 2: Publish the media
      const publishResult = await this.publishMedia(accessToken, containerResult.id);
      
      return {
        success: true,
        containerId: containerResult.id,
        mediaId: publishResult.id,
        message: 'Successfully posted to Instagram'
      };
    } catch (error) {
      console.error('Error posting to Instagram:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create a Blast Off post for Instagram
   * Formats the message for Instagram posting
   */
  createBlastOffPost(messageData) {
    const { message, title, platform, url, imageUrl } = messageData;
    
    let caption = '';
    
    if (title) {
      caption += `${title}\n\n`;
    }
    
    caption += message;
    
    if (platform) {
      caption += `\n\n#${platform.toLowerCase().replace(/\s+/g, '')}`;
    }
    
    if (url) {
      caption += `\n\nLink in bio or DM for: ${url}`;
    }
    
    // Instagram hashtags
    caption += '\n\n#content #creator #socialmedia #blastoff';
    
    return {
      caption: caption,
      imageUrl: imageUrl || null
    };
  }

  /**
   * Validate Instagram access token
   */
  async validateToken(accessToken) {
    try {
      const profile = await this.getUserProfile(accessToken);
      return {
        valid: true,
        username: profile.username,
        userId: profile.id
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }
}

module.exports = InstagramService;