# Creator Engagement App

## The "Blast Off" Button for Your Content

The Creator Engagement App is designed to help content creators get the crucial initial engagement they need right when they go live or publish new content.

### The Problem

Many new and growing content creators struggle to notify their audience effectively across all platforms the moment new content drops. This initial window is critical for algorithms and for building momentum.

### The Solution

This app provides a simple, one-touch "blast off" button that creators can press right before going live or publishing. It will send out pre-configured announcements to their selected social channels, letting their audience know it's time to engage.

## Features (Planned)

*   Connect multiple social media accounts (Twitter, Discord, etc.).
*   Customize "blast off" message templates.
*   A simple, one-button interface to send announcements.
*   Analytics to track click-through rates from announcements.

## Project Structure

```
creator-engagement-app/
├── backend/          # Node.js Express API server
│   ├── api/          # API route handlers
│   ├── config/       # Configuration files (Firebase, etc.)
│   ├── index.js      # Main server file
│   └── README.md     # Backend setup instructions
├── frontend/         # React Native (Expo) mobile app
│   ├── assets/       # Images and static assets
│   ├── config/       # App configuration
│   ├── services/     # API services
│   ├── App.js        # Main app component
│   └── README.md     # Frontend setup instructions
└── README.md         # This file
```

## Getting Started

This project consists of two main components:

1. **Backend** - A Node.js/Express API server that handles business logic and external integrations
2. **Frontend** - A React Native mobile app built with Expo for iOS and Android

### Prerequisites

- Node.js v14 or higher
- npm v6 or higher
- Expo Go app (for mobile testing)

### Quick Start

#### 1. Set Up the Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start the server
npm start
```

The backend will run on `http://localhost:3000` by default.

See [backend/README.md](backend/README.md) for detailed backend setup instructions.

#### 2. Set Up the Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Expo development server
npm start
```

Use the Expo Go app on your phone to scan the QR code, or press `i` for iOS simulator or `a` for Android emulator.

See [frontend/README.md](frontend/README.md) for detailed frontend setup instructions.

## Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express
- **Database:** Firebase (Firestore for data, Auth for authentication)
- **Key Packages:** cors, body-parser, dotenv

### Frontend
- **Framework:** React Native
- **Platform:** Expo
- **Navigation:** React Navigation
- **HTTP Client:** Axios
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