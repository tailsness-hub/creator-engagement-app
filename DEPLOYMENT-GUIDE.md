# Deployment Guide

## Creator Engagement App - Production Deployment

### Overview

This guide covers deploying the Creator Engagement App to production, including backend server deployment and mobile app distribution.

## Prerequisites

### Required Accounts
- **Backend Hosting**: Railway, Heroku, DigitalOcean, or AWS
- **Mobile Distribution**: Apple Developer Program ($99/year) and/or Google Play Console ($25 one-time)
- **API Keys**: Discord, Instagram (Facebook), Twitter developer accounts

### Development Environment
- Node.js v20.8.0+
- Expo CLI (`npm install -g @expo/cli`)
- Git for version control

## Backend Deployment

### Environment Setup

#### Production Environment Variables
```bash
# Server Configuration
PORT=3000
NODE_ENV=production
SESSION_SECRET=your-super-secure-production-secret-key-min-32-chars
FRONTEND_URL=https://your-app-domain.com

# Discord OAuth (Production App)
DISCORD_CLIENT_ID=your_production_discord_client_id
DISCORD_CLIENT_SECRET=your_production_discord_client_secret
DISCORD_REDIRECT_URI=https://your-api-domain.com/auth/discord/callback
DISCORD_BOT_TOKEN=your_production_discord_bot_token

# Instagram OAuth (Production App)
INSTAGRAM_CLIENT_ID=your_production_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_production_instagram_client_secret
INSTAGRAM_REDIRECT_URI=https://your-api-domain.com/auth/instagram/callback

# Twitter OAuth (Production App)
TWITTER_API_KEY=your_production_twitter_api_key
TWITTER_API_SECRET=your_production_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_production_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_production_twitter_access_token_secret
BACKEND_URL=https://your-api-domain.com
```

### Railway Deployment (Recommended)

#### 1. Setup Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init
```

#### 2. Deploy Backend
```bash
# From backend directory
cd backend

# Add start script to package.json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}

# Deploy to Railway
railway up
```

#### 3. Configure Environment Variables
```bash
# Set environment variables in Railway dashboard
# Or use CLI
railway variables set SESSION_SECRET=your-production-secret
railway variables set DISCORD_CLIENT_ID=your-client-id
# ... set all required variables
```

### Alternative: Heroku Deployment

#### 1. Setup Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create creator-engagement-api
```

#### 2. Configure Environment
```bash
# Set environment variables
heroku config:set SESSION_SECRET=your-production-secret
heroku config:set DISCORD_CLIENT_ID=your-client-id
heroku config:set NODE_ENV=production
# ... set all required variables

# Set buildpack
heroku buildpacks:set heroku/nodejs
```

#### 3. Deploy
```bash
# Deploy from backend directory
cd backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a creator-engagement-api
git push heroku main
```

### SSL Certificate

#### Railway SSL
- Automatic SSL certificates provided
- Custom domain SSL available in pro plan

#### Manual SSL Setup
```bash
# For custom server deployment
# Generate SSL certificate (Let's Encrypt)
sudo certbot --nginx -d your-api-domain.com

# Update nginx config
server {
  listen 443 ssl;
  ssl_certificate /etc/letsencrypt/live/your-api-domain.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/your-api-domain.com/privkey.pem;
  
  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

## Frontend Deployment

### Expo Application Services (EAS)

#### 1. Setup EAS
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

#### 2. Configure app.config.js
```javascript
// app.config.js
export default {
  expo: {
    name: "Creator Engagement App",
    slug: "creator-engagement-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.yourcompany.creatorengagement",
      buildNumber: "1"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      package: "com.yourcompany.creatorengagement",
      versionCode: 1
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://your-api-domain.com',
      eas: {
        projectId: "your-eas-project-id"
      }
    },
    scheme: "creator-engagement-app"
  }
};
```

#### 3. Build for Production
```bash
# Build for iOS
eas build --platform ios

# Build for Android  
eas build --platform android

# Build for both
eas build --platform all
```

### App Store Distribution

#### iOS App Store

1. **Prepare Assets**
   ```bash
   # Required assets
   - App icon (1024x1024)
   - Screenshots (various sizes)
   - App preview video (optional)
   ```

2. **App Store Connect Setup**
   - Create app in App Store Connect
   - Configure app information
   - Set pricing and availability
   - Add app description and keywords

3. **Submit for Review**
   ```bash
   # Submit build from EAS
   eas submit --platform ios
   
   # Or upload manually via Xcode or Application Loader
   ```

#### Google Play Store

1. **Prepare Assets**
   ```bash
   # Required assets
   - High-res icon (512x512)
   - Feature graphic (1024x500)
   - Screenshots (phone and tablet)
   ```

2. **Play Console Setup**
   - Create app in Google Play Console
   - Configure app information
   - Set content rating
   - Add store listing details

3. **Submit for Review**
   ```bash
   # Submit build from EAS
   eas submit --platform android
   
   # Or upload AAB file manually
   ```

### Web Deployment (Progressive Web App)

#### 1. Configure for Web
```bash
# Install web dependencies
cd frontend
npx expo install @expo/webpack-config react-native-web react-dom

# Add web support to app.config.js
{
  "web": {
    "favicon": "./assets/favicon.png",
    "name": "Creator Engagement App",
    "shortName": "CreatorApp",
    "lang": "en",
    "scope": "/",
    "themeColor": "#3B82F6"
  }
}
```

#### 2. Build for Web
```bash
# Build web version
npx expo build:web

# Deploy to hosting service
# Netlify, Vercel, Firebase Hosting, etc.
```

#### 3. Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npx expo build:web
netlify deploy --prod --dir web-build
```

## API Configuration

### OAuth App Setup

#### Discord Developer Portal
1. Go to https://discord.com/developers/applications
2. Create new application
3. Configure OAuth2 settings:
   ```
   Redirect URI: https://your-api-domain.com/auth/discord/callback
   Scopes: identify, email
   ```
4. Copy Client ID and Secret

#### Facebook/Instagram Developers
1. Go to https://developers.facebook.com/
2. Create new app (Business type)
3. Add Instagram Basic Display product
4. Configure OAuth settings:
   ```
   Valid OAuth Redirect URI: https://your-api-domain.com/auth/instagram/callback
   ```
5. Switch to Instagram Business account
6. Copy App ID and Secret

#### Twitter Developer Platform
1. Go to https://developer.twitter.com/
2. Create new project and app
3. Configure authentication settings:
   ```
   App permissions: Read and write
   Callback URI: https://your-api-domain.com/auth/twitter/callback
   ```
4. Copy API keys and access tokens

## Monitoring and Analytics

### Backend Monitoring

#### Error Tracking (Sentry)
```javascript
// Install Sentry
npm install @sentry/node

// Configure in index.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Error handling middleware
app.use(Sentry.Handlers.errorHandler());
```

#### Performance Monitoring
```javascript
// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Frontend Analytics

#### Expo Analytics
```javascript
// Install Expo analytics
npx expo install expo-analytics-amplitude

// Configure in App.js
import { Amplitude } from 'expo-analytics-amplitude';

Amplitude.initialize('your-amplitude-api-key');
Amplitude.logEvent('app_opened');
```

#### Custom Event Tracking
```javascript
// Track platform connections
const trackConnection = (platform, success) => {
  Amplitude.logEvent('platform_connection', {
    platform,
    success,
    timestamp: new Date().toISOString()
  });
};

// Track blast off usage
const trackBlastOff = (platforms, success) => {
  Amplitude.logEvent('blast_off', {
    platforms: platforms.join(','),
    success,
    timestamp: new Date().toISOString()
  });
};
```

## Security Checklist

### Backend Security
- [ ] Use HTTPS in production
- [ ] Secure session configuration
- [ ] Environment variables properly configured
- [ ] CORS restricted to production domains
- [ ] API rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive information

### Frontend Security
- [ ] No sensitive data in AsyncStorage
- [ ] Deep link validation implemented
- [ ] API calls use HTTPS
- [ ] OAuth flows properly validated
- [ ] App transport security configured (iOS)
- [ ] ProGuard/R8 enabled (Android)

### OAuth Security
- [ ] Production redirect URIs configured
- [ ] State parameter validation (OAuth 2.0)
- [ ] PKCE implemented where supported
- [ ] Token refresh logic implemented
- [ ] Proper token storage and cleanup

## Performance Optimization

### Backend Optimization
```javascript
// Enable gzip compression
const compression = require('compression');
app.use(compression());

// Cache static assets
app.use('/static', express.static('public', {
  maxAge: '1d',
  etag: true
}));

// Connection pooling
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000
});
```

### Frontend Optimization
```javascript
// Image optimization
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  placeholder={blurhash}
  contentFit="cover"
  transition={200}
/>

// Bundle size optimization
// Use dynamic imports for large components
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

## Rollback Strategy

### Backend Rollback
```bash
# Railway rollback
railway rollback

# Heroku rollback
heroku rollback v123

# Manual deployment rollback
git revert <commit-hash>
git push origin main
```

### Frontend Rollback
```bash
# EAS rollback (not automatic - need new build)
# Prepare rollback build beforehand
eas build --platform all --profile rollback

# App Store/Play Store
# Use previous version or emergency patch
```

## Maintenance

### Regular Tasks
- [ ] Monitor error logs weekly
- [ ] Check API rate limits monthly
- [ ] Update dependencies quarterly
- [ ] Renew SSL certificates annually
- [ ] Review OAuth app permissions quarterly

### Backup Strategy
```bash
# Database backups (if using)
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Configuration backups
# Store environment variables in secure location
# Document all third-party integrations
```

## Troubleshooting

### Common Production Issues

#### OAuth Redirect Issues
```bash
# Check redirect URIs match exactly
# Verify HTTPS in production
# Check callback URL accessibility
curl -I https://your-api-domain.com/auth/discord/callback
```

#### Session Issues
```bash
# Check session secret is set
# Verify secure: true in production
# Check cookie domain settings
```

#### API Rate Limits
```bash
# Monitor rate limit headers
# Implement exponential backoff
# Add user feedback for rate limiting
```

---

**Deployment Version**: 1.0.0  
**Infrastructure**: Railway/Heroku + EAS  
**Last Updated**: December 26, 2025