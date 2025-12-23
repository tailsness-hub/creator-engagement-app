# Creator Engagement App - Frontend

This is the frontend mobile application for the Creator Engagement App, built with React Native and Expo.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Expo Go app on your mobile device (for testing on physical device)
- iOS Simulator (Mac only) or Android Emulator (optional)

## Setup Instructions

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the API endpoint:**
   - Open `config/api.js`
   - Update the `API_BASE_URL` to point to your backend server
   - For local development, ensure your backend is running on `http://localhost:3000`

4. **Start the development server:**
   ```bash
   npm start
   ```

   This will open the Expo Developer Tools in your browser.

5. **Run on a device or simulator:**
   - **iOS Simulator (Mac only):** Press `i` in the terminal or click "Run on iOS simulator" in Expo Dev Tools
   - **Android Emulator:** Press `a` in the terminal or click "Run on Android device/emulator" in Expo Dev Tools
   - **Physical Device:** 
     - Install the Expo Go app from the App Store or Google Play
     - Scan the QR code shown in the terminal or Expo Dev Tools

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator (Mac only)
- `npm run web` - Run in web browser

## Project Structure

```
frontend/
├── assets/           # Images, fonts, and other static assets
├── config/           # Configuration files
│   ├── api.js        # API endpoint configuration
│   └── firebase.js   # Firebase configuration (placeholder)
├── services/         # API services and utilities
│   └── api.js        # API service methods
├── App.js            # Main application component with "Blast Off" button
├── app.json          # Expo configuration
├── package.json      # Project dependencies and scripts
└── README.md         # This file
```

## Features

### Current Features
- **Blast Off Button** - A placeholder UI for the main "blast off" functionality
- **API Service** - Pre-configured axios client for backend communication
- **Firebase Config** - Placeholder configuration for Firebase integration

### Planned Features
- Social media account connections
- Customizable message templates
- Real-time notification sending
- Analytics dashboard
- User authentication

## Connecting to Backend

The app is pre-configured to connect to the backend API. Make sure:

1. The backend server is running (see `backend/README.md`)
2. The `API_BASE_URL` in `config/api.js` points to your backend
3. For physical device testing, use your computer's local IP instead of `localhost`

Example for physical device:
```javascript
const API_BASE_URL = 'http://192.168.1.100:3000/api';
```

## Firebase Setup

To enable Firebase features:

1. Create a Firebase project at https://console.firebase.google.com/
2. Add a Web app to your project
3. Copy the configuration to `config/firebase.js`
4. Install Firebase:
   ```bash
   npm install firebase
   ```
5. Uncomment the Firebase initialization code in `config/firebase.js`

## Troubleshooting

### Common Issues

**Metro bundler not starting:**
```bash
npm start -- --clear
```

**Cannot connect to backend:**
- Verify backend is running
- Check API_BASE_URL configuration
- For physical devices, use your computer's IP address instead of localhost

**Expo Go app shows error:**
- Make sure you're on the same network as your development machine
- Try restarting the Expo development server

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)

## License

ISC
