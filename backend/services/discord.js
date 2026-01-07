/**
 * Discord Service - Handle Discord API interactions
 * 
 * This service manages Discord-specific functionality including:
 * - Webhook posting
 * - Channel message posting
 * - Guild/server management
 * - User presence updates
 */

class DiscordService {
  constructor() {
    this.apiBase = 'https://discord.com/api/v10';
  }

  /**
   * Post a "Blast Off" message to Discord using webhook
   * @param {string} webhookUrl - Discord webhook URL
   * @param {Object} message - Message object
   * @returns {Promise<Object>} - Post result
   */
  async postViaWebhook(webhookUrl, message) {
    try {
      const payload = {
        content: message.content,
        username: message.username || 'Creator Blast Off',
        avatar_url: message.avatar_url || null,
        embeds: message.embeds || []
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Webhook post failed: ${response.status} ${errorData?.message || response.statusText}`);
      }

      return {
        success: true,
        message: 'Message posted successfully via webhook',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Discord webhook error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create a rich embed for "Blast Off" announcements
   * @param {Object} options - Embed options
   * @returns {Object} - Discord embed object
   */
  createBlastOffEmbed(options = {}) {
    const {
      title = '🚀 Going Live Now!',
      description = 'Jump in and join the action!',
      color = 0x00ff00, // Green color
      platform,
      url,
      thumbnailUrl,
      footerText
    } = options;

    const embed = {
      title,
      description,
      color,
      timestamp: new Date().toISOString(),
      fields: []
    };

    if (platform) {
      embed.fields.push({
        name: 'Platform',
        value: platform,
        inline: true
      });
    }

    if (url) {
      embed.url = url;
      embed.fields.push({
        name: 'Direct Link',
        value: `[Click to Join](${url})`,
        inline: true
      });
    }

    if (thumbnailUrl) {
      embed.thumbnail = {
        url: thumbnailUrl
      };
    }

    if (footerText) {
      embed.footer = {
        text: footerText
      };
    }

    return embed;
  }

  /**
   * Post message to Discord channel using bot token
   * @param {string} channelId - Discord channel ID
   * @param {Object} message - Message content
   * @param {string} botToken - Discord bot token
   * @returns {Promise<Object>} - Post result
   */
  async postToChannel(channelId, message, botToken) {
    try {
      const payload = {
        content: message.content,
        embeds: message.embeds || []
      };

      const response = await fetch(`${this.apiBase}/channels/${channelId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bot ${botToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Channel post failed: ${response.status} ${errorData?.message || response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        messageId: result.id,
        channelId: result.channel_id,
        timestamp: result.timestamp
      };

    } catch (error) {
      console.error('Discord channel post error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user's guilds (Discord servers) they can post to
   * @param {string} accessToken - User's Discord access token
   * @returns {Promise<Array>} - Array of guilds
   */
  async getUserGuilds(accessToken) {
    try {
      const response = await fetch(`${this.apiBase}/users/@me/guilds`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch guilds: ${response.status}`);
      }

      const guilds = await response.json();
      
      // Filter to guilds where user has manage messages permission
      return guilds.filter(guild => {
        // Check if user has MANAGE_MESSAGES permission (bit 13)
        return (guild.permissions & 0x2000) === 0x2000;
      });

    } catch (error) {
      console.error('Discord guilds fetch error:', error);
      return [];
    }
  }

  /**
   * Get channels in a guild where user can post
   * @param {string} guildId - Discord guild ID
   * @param {string} accessToken - User's Discord access token
   * @returns {Promise<Array>} - Array of channels
   */
  async getGuildChannels(guildId, accessToken) {
    try {
      const response = await fetch(`${this.apiBase}/guilds/${guildId}/channels`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch channels: ${response.status}`);
      }

      const channels = await response.json();
      
      // Filter to text channels only
      return channels.filter(channel => channel.type === 0);

    } catch (error) {
      console.error('Discord channels fetch error:', error);
      return [];
    }
  }

  /**
   * Validate Discord webhook URL
   * @param {string} webhookUrl - Discord webhook URL
   * @returns {boolean} - True if valid webhook URL
   */
  isValidWebhookUrl(webhookUrl) {
    const webhookRegex = /^https:\/\/discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/;
    return webhookRegex.test(webhookUrl);
  }

  /**
   * Test webhook connection
   * @param {string} webhookUrl - Discord webhook URL
   * @returns {Promise<Object>} - Test result
   */
  async testWebhook(webhookUrl) {
    if (!this.isValidWebhookUrl(webhookUrl)) {
      return {
        success: false,
        error: 'Invalid webhook URL format'
      };
    }

    try {
      // Send a test message
      const testMessage = {
        content: '✅ Test message from Creator Engagement App - Webhook is working!',
        username: 'Creator App Test'
      };

      const result = await this.postViaWebhook(webhookUrl, testMessage);
      return result;

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = DiscordService;