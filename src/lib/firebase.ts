import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration - these should be set in your environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// Validate that all required config values are present
const requiredConfigs = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId'
];

const missingConfigs = requiredConfigs.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingConfigs.length > 0 && !isDev) {
  console.error(`Missing Firebase configuration: ${missingConfigs.join(', ')}`);
  console.error('Please check your environment variables.');
}

// Initialize Firebase only if it hasn't been initialized
let firebaseApp;
let db;
let auth;
let storage;

// Check if we have valid config before initializing
const hasValidConfig = firebaseConfig.apiKey && 
                       firebaseConfig.authDomain && 
                       firebaseConfig.projectId && 
                       firebaseConfig.apiKey !== 'YOUR_API_KEY_HERE';

if (hasValidConfig) {
  try {
    // Check if Firebase is already initialized
    if (getApps().length > 0) {
      firebaseApp = getApp();
    } else {
      firebaseApp = initializeApp(firebaseConfig);
    }

    // Initialize services
    db = getFirestore(firebaseApp);
    auth = getAuth(firebaseApp);
    storage = getStorage(firebaseApp);

    if (!isDev) {
      console.log('🔥 Firebase initialized successfully');
      console.log(`📁 Project ID: ${firebaseConfig.projectId}`);
      console.log(`🌐 Auth Domain: ${firebaseConfig.authDomain}`);
    }
  } catch (error: any) {
    console.error('❌ Firebase initialization failed:', error.message);
    console.warn('⚠️ Running in limited mode - some features may not work');
    
    // Create mock objects for development
    db = null;
    auth = null;
    storage = null;
    firebaseApp = null;
  }
} else {
  if (!isDev) {
    console.warn('⚠️ Firebase configuration incomplete - running in limited mode');
  }
  db = null;
  auth = null;
  storage = null;
  firebaseApp = null;
}

// Export initialized services (with both names for compatibility)
export { firebaseApp as app, firebaseApp, db, auth, storage };

// Helper function to check if Firebase is available
export const isFirebaseAvailable = () => {
  return !!db && !!auth;
};

// Helper function to get Firebase config status
export const getFirebaseStatus = () => {
  return {
    initialized: !!db && !!auth,
    hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    hasStorageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    hasMessagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    hasAppId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    hasMeasurementId: !!process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
};
