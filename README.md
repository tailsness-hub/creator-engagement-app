# Creator Engagement App

## The "Blast Off" Button for Your Content 🚀

A professional multi-platform social media management app that allows content creators to instantly notify their audience across Discord, Instagram, and Twitter with a single button press.

### The Problem

Many content creators struggle to effectively notify their audience across multiple platforms when new content goes live. This initial engagement window is critical for algorithm success and building momentum.

### The Solution

This app provides a simple, one-touch "blast off" button that sends pre-configured announcements to all connected social platforms simultaneously, ensuring maximum reach and engagement for new content.

## Features ✅

### **Multi-Platform Integration**
- **Discord**: OAuth authentication + webhook posting with rich embeds
- **Instagram**: Business API integration for photo/video posts  
- **Twitter**: OAuth 1.0a with 280-character tweet posting
- **Real-time Status**: Live connection monitoring for all platforms

### **Modern Design System**
- **Consistent UI**: Professional design tokens and reusable components
- **Platform Branding**: Each platform maintains visual identity within unified system
- **Mobile-Optimized**: Touch-friendly interactions with proper spacing and feedback
- **Loading States**: Professional handling of all user scenarios

### **Smart Composer**
- **Multi-Platform Posting**: Toggle platforms on/off for each blast
- **Character Validation**: Real-time limits (280 for Twitter, custom for others)
- **Rich Content**: Support for images, embeds, and custom titles
- **Error Handling**: Graceful failure with detailed user feedback

### **Robust Architecture**
- **Service Layer**: Clean separation of API calls and business logic
- **Caching System**: Local storage for connection status and user data
- **Error Recovery**: Fallback mechanisms and retry logic
- **Environment Config**: Secure credential management

## Project Structure

```
creator-engagement-app/
├── backend/                    # Node.js Express API server
│   ├── api/                   # API route handlers
│   │   ├── discord.js         # Discord OAuth and webhook posting
│   │   ├── instagram.js       # Instagram Business API integration
│   │   ├── twitter.js         # Twitter OAuth and posting
│   │   └── test.js           # Health check endpoints
│   ├── .env.example          # Environment variables template
│   ├── index.js              # Main server file with CORS and sessions
│   └── package.json          # Dependencies and scripts
├── frontend/                  # React Native (Expo) mobile app
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Design system components
│   │   │   ├── Button.js    # Modern button with variants
│   │   │   ├── Card.js      # Elevated card container
│   │   │   ├── Text.js      # Typography system
│   │   │   ├── Input.js     # Form input with validation
│   │   │   └── index.js     # Component exports
│   │   ├── DiscordConnection.js      # Discord OAuth UI (modernized)
│   │   ├── InstagramConnection.js    # Instagram OAuth UI (modernized)
│   │   ├── TwitterConnection.js      # Twitter OAuth UI (modern design)
│   │   ├── DiscordWebhookSetup.js    # Discord webhook configuration
│   │   ├── InstagramImageSetup.js    # Instagram media setup
│   │   └── BlastOffComposer.js       # Multi-platform composer
│   ├── constants/           # Design system and configuration
│   │   └── Theme.js        # Colors, typography, spacing tokens
│   ├── services/           # API integration layer
│   │   ├── discord.js      # Discord API calls
│   │   ├── instagram.js    # Instagram API calls
│   │   └── twitter.js      # Twitter API calls (new)
│   ├── App.js             # Main app component with navigation
│   └── package.json       # Dependencies and Expo configuration
└── README.md              # Project documentation (this file)
```

## Getting Started

This project consists of two main components:

1. **Backend** - Node.js/Express API server with OAuth integrations
2. **Frontend** - React Native (Expo) mobile app with modern UI

### Prerequisites

- Node.js v20.8.0 or higher
- npm v10 or higher  
- Expo CLI (`npm install -g @expo/cli`)
- Mobile device with Expo Go app (or iOS/Android simulator)

### Quick Start

#### 1. Set Up the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template and configure APIs
cp .env.example .env
# Edit .env with your API credentials (see Configuration section)

# Start the server
node index.js
```

The backend runs on `http://localhost:3000` with endpoints:
- Discord OAuth: `/auth/discord`
- Instagram OAuth: `/auth/instagram/login`  
- Twitter OAuth: `/auth/twitter/login`
- Multi-platform posting: `/blast-off/{platform}`

#### 2. Set Up the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

**Testing Options:**
- **Web**: Press `w` to open in browser (recommended for development)
- **Mobile**: Scan QR code with Expo Go app
- **Simulator**: Press `i` (iOS) or `a` (Android)

## Configuration

### Required API Credentials

#### Discord Integration
```env
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback
```

#### Instagram Integration  
```env
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/auth/instagram/callback
```

#### Twitter Integration
```env
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
```

### Getting API Keys

1. **Discord**: Create app at [Discord Developer Portal](https://discord.com/developers/applications)
2. **Instagram**: Set up at [Facebook Developers](https://developers.facebook.com/) (Business account required)
3. **Twitter**: Apply for API access at [Twitter Developer Platform](https://developer.twitter.com/)

## Technology Stack

### Backend
- **Runtime:** Node.js v20.8.0
- **Framework:** Express.js with CORS and sessions
- **Authentication:** OAuth 2.0 (Discord, Instagram) & OAuth 1.0a (Twitter)
- **Key Dependencies:** 
  - `twitter-api-v2` - Twitter API integration
  - `axios` - HTTP client for Instagram/Discord APIs
  - `express-session` - Session management
  - `form-data` - Multipart form handling

### Frontend  
- **Framework:** React Native with Expo SDK 54
- **UI System:** Custom design system with reusable components
- **State Management:** React Hooks (useState, useEffect)
- **Storage:** AsyncStorage for caching connection status
- **HTTP Client:** Fetch API with error handling and retries

## Design System

### Component Library
The app uses a modern, consistent design system built around reusable components:

#### **Core Components**
- **Card**: Elevated containers with shadow variants (`base`, `flat`, `outlined`, `elevated`, `subtle`)
- **Button**: Modern buttons with variants (`primary`, `secondary`, `outline`, `ghost`, `success`, `warning`, `error`)
- **Text**: Typography system with semantic variants (`display`, `title`, `heading`, `subheading`, `body`, `caption`, `small`)
- **Input**: Form inputs with floating labels and validation states

#### **Theme Tokens**
```javascript
// Colors - Semantic and platform-specific
Colors.primary.main, Colors.discord, Colors.instagram, Colors.twitter
Colors.success.main, Colors.error.main, Colors.warning.main

// Typography - Consistent scale
Typography.size.display (32px) to Typography.size.small (12px)
Typography.weight.light (300) to Typography.weight.black (900)

// Spacing - 8pt grid system  
Spacing.xs (4px), Spacing.sm (8px), Spacing.md (16px), Spacing.lg (24px)

// Shadows - Elevation system
Shadows.sm, Shadows.md, Shadows.lg for depth hierarchy
```

## Usage

### Basic Workflow

1. **Connect Platforms**: Use OAuth flows to connect Discord, Instagram, and/or Twitter accounts
2. **Compose Message**: Write your announcement in the BlastOff Composer (280 character limit)
3. **Select Platforms**: Toggle which connected platforms to post to
4. **Add Enhancements**: Optional custom title, images, or embed URLs
5. **Blast Off**: Single button press posts to all selected platforms simultaneously

### Platform-Specific Features

#### **Discord**
- Rich embed support with custom titles and colors
- Webhook URL fallback for servers without OAuth
- Real-time connection status monitoring

#### **Instagram** 
- Business account integration (personal accounts not supported)
- Image/video posting with captions
- Account verification and permissions handling

#### **Twitter**
- 280-character limit with real-time validation  
- Image attachment support
- OAuth 1.0a secure authentication flow

## Development

### Project Status: ✅ Production Ready

- **Multi-Platform Integration**: Complete Discord, Instagram, Twitter support
- **Modern UI/UX**: Professional design system with consistent branding
- **Error Handling**: Graceful failure modes with user feedback
- **Mobile Optimized**: Touch-friendly interactions and responsive design
- **Secure Authentication**: Industry-standard OAuth implementations

### Architecture Highlights

- **Service Layer Pattern**: Clean separation of API calls and UI logic
- **Component-Based Design**: Reusable UI components with consistent APIs  
- **Error Boundary System**: Comprehensive error handling with user recovery options
- **Caching Strategy**: Local storage for offline functionality and performance
- **Environment Configuration**: Secure credential management with validation

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow existing code patterns and design system
4. Test across all platforms (Discord, Instagram, Twitter)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built for creators, by creators** 🚀  
*Maximize your content's reach with professional-grade social media management*
- **Styling:** React Native StyleSheet

## Development Workflow

1. Start the backend server: `cd backend && npm start`
2. In a new terminal, start the frontend: `cd frontend && npm start`
3. Open the app on your device using Expo Go or a simulator
4. Make changes to either backend or frontend - both support hot reloading

## Firebase Configuration

Both frontend and backend include placeholder Firebase configuration files:
- Backend: `backend/config/firebase.js`
- Frontend: `frontend/config/firebase.js`

To enable Firebase features:
1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication and Firestore Database
3. Update the configuration files with your Firebase credentials
4. Add credentials to `backend/.env` file

## Next Steps

- [ ] Configure Firebase for authentication and database
- [ ] Implement user registration and login
- [ ] Add social media platform integrations (Twitter, Discord, etc.)
- [ ] Create template management system
- [ ] Implement the actual "blast off" notification logic
- [ ] Add analytics tracking
- [ ] Create settings and profile screens
- [ ] Implement push notifications

## Contributing

This is a personal project for content creators. Contributions, issues, and feature requests are welcome!

## License

ISC