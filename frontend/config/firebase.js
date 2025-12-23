/**
 * Firebase Configuration for Frontend
 * 
 * This file contains the Firebase configuration for the React Native app.
 * To use Firebase:
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Add a Web app to your Firebase project
 * 3. Copy the configuration values below
 * 4. Install Firebase: npm install firebase
 * 5. Uncomment the initialization code below
 */

const firebaseConfig = {
  apiKey: "your_firebase_api_key_here",
  authDomain: "your_project_id.firebaseapp.com",
  projectId: "your_project_id_here",
  storageBucket: "your_project_id.appspot.com",
  messagingSenderId: "your_sender_id_here",
  appId: "your_app_id_here"
};

/**
 * Initialize Firebase
 * Uncomment the following lines once you have installed firebase:
 * npm install firebase
 */

// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// export { auth, db };

export default firebaseConfig;
