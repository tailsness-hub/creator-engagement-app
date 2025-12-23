/**
 * Firebase Configuration
 * 
 * This file contains the Firebase configuration for the Creator Engagement App.
 * To use Firebase:
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Enable Authentication and Firestore Database
 * 3. Copy your configuration values from Firebase Console
 * 4. Update the .env file with your Firebase credentials
 */

require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

/**
 * Initialize Firebase
 * Uncomment the following lines once you have installed firebase-admin:
 * npm install firebase-admin
 */

// const admin = require('firebase-admin');
// admin.initializeApp(firebaseConfig);
// const db = admin.firestore();
// const auth = admin.auth();

// module.exports = { admin, db, auth };

module.exports = { firebaseConfig };
