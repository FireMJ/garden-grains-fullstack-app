import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth, User } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Firebase configuration with fallbacks for build
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'mock.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'mock-project-id',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'mock.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1234567890:web:mockappid',
};

// Check if we're on the server
const isServer = typeof window === 'undefined';

// Initialize Firebase with proper typing
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

if (!isServer) {
  // Client-side initialization
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Fallback to mock objects
    app = { name: '[DEFAULT]' } as FirebaseApp;
    db = {} as Firestore;
    auth = createMockAuth();
    storage = {} as FirebaseStorage;
  }
} else {
  // Server-side: use mock objects
  app = { name: '[DEFAULT]' } as FirebaseApp;
  db = {} as Firestore;
  auth = createMockAuth();
  storage = {} as FirebaseStorage;
}

// Helper function to create mock auth object
function createMockAuth(): Auth {
  return {
    currentUser: null,
    onAuthStateChanged: (observer: (user: User | null) => void) => {
      observer(null);
      return () => {};
    },
    signOut: async () => {},
    signInWithEmailAndPassword: async () => ({ user: null } as any),
    createUserWithEmailAndPassword: async () => ({ user: null } as any),
    sendPasswordResetEmail: async () => {},
    confirmPasswordReset: async () => {},
    getProvider: () => null, // Add the missing getProvider method
    // Required properties
    app: { name: '[DEFAULT]' } as FirebaseApp,
    name: '[DEFAULT]',
    config: {},
    // Add other required methods
    updateCurrentUser: async () => {},
    signInWithPopup: async () => ({ user: null } as any),
    signInWithRedirect: async () => {},
    getRedirectResult: async () => ({ user: null } as any),
    setPersistence: async () => {},
    useDeviceLanguage: () => {},
  } as any;
}

export { app, db, auth, storage };
