# Creator Engagement App - API Documentation

## Overview

The Creator Engagement App backend provides RESTful APIs for multi-platform social media integration, supporting Discord, Instagram, and Twitter OAuth flows and posting capabilities.

**Base URL**: `http://localhost:3000`  
**Authentication**: Session-based OAuth tokens  
**Response Format**: JSON

## Authentication Flow

### Session Management
The API uses Express sessions to maintain OAuth tokens across requests. All OAuth callbacks store credentials in `req.session.{platform}`.

```javascript
// Session structure example
req.session.discord = {
  accessToken: "...",
  refreshToken: "...", 
  user: { username: "...", id: "..." },
  connected: true
}
```

## Discord Integration

### OAuth Endpoints

#### `GET /auth/discord`
Initiates Discord OAuth flow.

**Response**:
```json
{
  "success": true,
  "authUrl": "https://discord.com/api/oauth2/authorize?..."
}
```

#### `GET /auth/discord/callback`
Handles Discord OAuth callback (automatic redirect).

**Query Parameters**:
- `code` - Authorization code from Discord

#### `GET /auth/discord/status`
Check Discord connection status.

**Response**:
```json
{
  "connected": true,
  "user": {
    "username": "creator123",
    "id": "123456789"
  },
  "connectedAt": "2025-12-26T10:30:00.000Z"
}
```

#### `POST /auth/discord/disconnect`
Disconnect Discord account.

**Response**:
```json
{
  "success": true,
  "message": "Successfully disconnected from Discord"
}
```

### Posting Endpoints

#### `POST /blast-off/discord`
Post message to Discord via webhook or bot.

**Request Body**:
```json
{
  "message": "🚀 New content is live!",
  "webhookUrl": "https://discord.com/api/webhooks/...", // Optional
  "embedOptions": {
    "title": "Content Alert",
    "platform": "YouTube", 
    "url": "https://youtube.com/watch?v=...",
    "color": "#FF0000"
  }
}
```

**Response**:
```json
{
  "success": true,
  "messageId": "987654321",
  "webhookId": "123456789"
}
```

## Instagram Integration

### OAuth Endpoints

#### `GET /auth/instagram/login`
Initiates Instagram OAuth flow.

**Response**:
```json
{
  "success": true,
  "authUrl": "https://api.instagram.com/oauth/authorize?..."
}
```

#### `GET /auth/instagram/callback`
Handles Instagram OAuth callback.

#### `GET /auth/instagram/status`
Check Instagram connection status.

**Response**:
```json
{
  "connected": true,
  "user": {
    "username": "creator_account",
    "id": "17841400123456789"
  },
  "connectedAt": "2025-12-26T10:30:00.000Z"
}
```

#### `POST /auth/instagram/disconnect`
Disconnect Instagram account.

### Posting Endpoints

#### `POST /blast-off/instagram`
Post content to Instagram.

**Request Body**:
```json
{
  "message": "Check out my latest content! 📸",
  "imageUrl": "https://example.com/image.jpg", // Required
  "title": "New Post Alert",
  "platform": "Blog",
  "url": "https://myblog.com/latest"
}
```

**Response**:
```json
{
  "success": true,
  "postId": "17841400987654321_17841400123456789",
  "username": "creator_account"
}
```

## Twitter Integration

### OAuth Endpoints

#### `GET /auth/twitter/login`
Initiates Twitter OAuth 1.0a flow.

**Response**:
```json
{
  "success": true,
  "authUrl": "https://api.twitter.com/oauth/authorize?...",
  "oauth_token": "temp_oauth_token"
}
```

#### `GET /auth/twitter/callback`
Handles Twitter OAuth callback.

**Query Parameters**:
- `oauth_token` - OAuth token
- `oauth_verifier` - OAuth verifier

#### `GET /auth/twitter/status`
Check Twitter connection status.

**Response**:
```json
{
  "connected": true,
  "user": {
    "screenName": "creator_handle",
    "userId": "123456789"
  },
  "connectedAt": "2025-12-26T10:30:00.000Z"
}
```

#### `POST /auth/twitter/disconnect`
Disconnect Twitter account.

#### `POST /auth/twitter/test-post`
Post a test tweet (for debugging).

**Response**:
```json
{
  "success": true,
  "tweetId": "1234567890123456789",
  "text": "Test tweet from Creator Engagement App! 🚀"
}
```

### Posting Endpoints

#### `POST /blast-off/twitter`
Post tweet to Twitter.

**Request Body**:
```json
{
  "message": "🚀 New video is live! Check it out: https://youtube.com/watch?v=...",
  "mediaUrl": "https://example.com/thumbnail.jpg" // Optional
}
```

**Response**:
```json
{
  "success": true,
  "tweetId": "1234567890123456789",
  "text": "🚀 New video is live! Check it out: https://...",
  "platform": "twitter"
}
```

**Validation**:
- Message must be ≤ 280 characters
- Message cannot be empty
- Media URL is optional but validated if provided

## Utility Endpoints

### `GET /`
API health check and endpoint listing.

**Response**:
```json
{
  "message": "Creator Engagement App - Backend API",
  "version": "1.0.0",
  "endpoints": {
    "discord_auth": "/auth/discord",
    "instagram_auth": "/auth/instagram/login",
    "twitter_auth": "/auth/twitter/login",
    "blast_off_discord": "/blast-off/discord",
    "blast_off_instagram": "/blast-off/instagram",
    "blast_off_twitter": "/blast-off/twitter"
  }
}
```

### `GET /api/test`
Simple test endpoint.

**Response**:
```json
{
  "message": "Creator Engagement Backend is running!",
  "timestamp": "2025-12-26T10:30:00.000Z"
}
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": "Human-readable error message",
  "details": "Technical error details", // Optional
  "code": "ERROR_CODE" // Optional
}
```

### Common HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not connected to platform)
- `403` - Forbidden (insufficient permissions)
- `429` - Rate Limited
- `500` - Internal Server Error

### Platform-Specific Errors

#### Discord
- `DISCORD_NOT_CONNECTED` - User not authenticated with Discord
- `WEBHOOK_INVALID` - Webhook URL is malformed or expired
- `MESSAGE_TOO_LONG` - Message exceeds Discord's limits

#### Instagram  
- `INSTAGRAM_NOT_CONNECTED` - User not authenticated with Instagram
- `IMAGE_REQUIRED` - Image URL is required for Instagram posts
- `BUSINESS_ACCOUNT_REQUIRED` - Personal accounts not supported

#### Twitter
- `TWITTER_NOT_CONNECTED` - User not authenticated with Twitter
- `TWEET_TOO_LONG` - Tweet exceeds 280 character limit
- `RATE_LIMIT_EXCEEDED` - Twitter API rate limit hit

## Environment Configuration

### Required Environment Variables

```bash
# Server Configuration
PORT=3000
SESSION_SECRET=your-super-secret-session-key
FRONTEND_URL=http://localhost:19006

# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback
DISCORD_BOT_TOKEN=your_discord_bot_token

# Instagram OAuth
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/auth/instagram/callback

# Twitter OAuth
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
BACKEND_URL=http://localhost:3000
```

## Rate Limits

### Platform Limits
- **Discord**: 5 requests per 5 seconds per webhook
- **Instagram**: 200 requests per hour per user
- **Twitter**: 300 tweets per 15 minutes per user

### API Protection
The backend implements basic rate limiting and error handling to prevent abuse and provide graceful degradation when platform limits are exceeded.

## Security

### OAuth Implementation
- **Discord**: OAuth 2.0 with PKCE
- **Instagram**: OAuth 2.0 with state validation  
- **Twitter**: OAuth 1.0a with signature verification

### Session Security
- Secure session cookies in production
- CORS configuration for specific frontend domains
- Environment-based secret management
- No sensitive data in client-side storage

## Development Notes

### Testing Endpoints
Use tools like Postman or curl to test endpoints:

```bash
# Check API health
curl http://localhost:3000/

# Check platform status (requires session)
curl -b cookies.txt http://localhost:3000/auth/discord/status

# Post to platform (requires authentication)
curl -X POST -H "Content-Type: application/json" \
  -d '{"message":"Test message"}' \
  -b cookies.txt \
  http://localhost:3000/blast-off/discord
```

### Debugging
- Enable debug logs with `NODE_ENV=development`
- Check console output for OAuth flow details
- Monitor network requests for API call failures
- Verify environment variables are loaded correctly

---

**API Version**: 1.0.0  
**Last Updated**: December 26, 2025