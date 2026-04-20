import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if we have valid config
const hasValidConfig = () => {
  return !!(firebaseConfig.apiKey && 
            firebaseConfig.authDomain && 
            firebaseConfig.projectId && 
            firebaseConfig.apiKey !== 'YOUR_API_KEY_HERE');
};

// Initialize Firebase app
let firebaseApp;
let db;
let auth;
let storage;
let isInitialized = false;

if (hasValidConfig() && !isInitialized) {
  try {
    // Initialize or get existing app
    if (!getApps().length) {
      firebaseApp = initializeApp(firebaseConfig);
      console.log('🔥 Firebase initialized successfully');
    } else {
      firebaseApp = getApp();
    }

    // Initialize Firestore - don't use initializeFirestore if already initialized
    if (!db) {
      try {
        db = getFirestore(firebaseApp);
        // Enable offline persistence only on client side
        if (typeof window !== 'undefined') {
          enableIndexedDbPersistence(db).catch((err) => {
            if (err.code === 'failed-precondition') {
              console.warn('Multiple tabs open, persistence enabled in first tab only');
            } else if (err.code === 'unimplemented') {
              console.warn('Browser doesn\'t support persistence');
            }
          });
        }
      } catch (err) {
        console.warn('Firestore already initialized, using existing instance');
        db = getFirestore(firebaseApp);
      }
    }

    // Initialize Auth with persistence
    if (!auth) {
      auth = getAuth(firebaseApp);
      if (typeof window !== 'undefined') {
        setPersistence(auth, browserLocalPersistence).catch(console.error);
      }
    }

    // Initialize Storage
    if (!storage) {
      storage = getStorage(firebaseApp);
    }

    isInitialized = true;

    console.log(`📁 Project: ${firebaseConfig.projectId}`);
    console.log(`🌐 Auth Domain: ${firebaseConfig.authDomain}`);
  } catch (error: any) {
    console.error('❌ Firebase initialization error:', error.message);
    firebaseApp = null;
    db = null;
    auth = null;
    storage = null;
  }
} else if (!hasValidConfig()) {
  console.warn('⚠️ Firebase configuration incomplete - running in limited mode');
} else {
  console.log('✅ Firebase already initialized');
}

// Helper to check if Firebase is ready
export const isFirebaseReady = () => {
  return !!db && !!auth && !!storage;
};

// Export initialized services
export { firebaseApp as app, firebaseApp, db, auth, storage };

// Firestore helpers
export const collections = {
  orders: 'orders',
  users: 'users',
  menu: 'menu',
  drivers: 'drivers',
  addresses: 'addresses',
  reviews: 'reviews',
  promotions: 'promotions',
  settings: 'settings'
};

// Firestore utility functions
export const firestoreUtils = {
  // Create a document
  createDoc: async (collectionName: string, data: any, id?: string) => {
    if (!db) throw new Error('Firestore not initialized');
    const { collection, doc, setDoc, addDoc } = await import('firebase/firestore');
    if (id) {
      await setDoc(doc(db, collectionName, id), data);
      return id;
    } else {
      const docRef = await addDoc(collection(db, collectionName), data);
      return docRef.id;
    }
  },

  // Get a document
  getDoc: async (collectionName: string, id: string) => {
    if (!db) throw new Error('Firestore not initialized');
    const { doc, getDoc } = await import('firebase/firestore');
    const docSnap = await getDoc(doc(db, collectionName, id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  },

  // Update a document
  updateDoc: async (collectionName: string, id: string, data: any) => {
    if (!db) throw new Error('Firestore not initialized');
    const { doc, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(db, collectionName, id), data);
  },

  // Query documents
  queryDocs: async (collectionName: string, constraints: any[] = []) => {
    if (!db) throw new Error('Firestore not initialized');
    const { collection, query, getDocs } = await import('firebase/firestore');
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // Real-time listener
  listenToCollection: (collectionName: string, callback: (data: any[]) => void) => {
    if (!db) throw new Error('Firestore not initialized');
    const { collection, onSnapshot } = require('firebase/firestore');
    return onSnapshot(collection(db, collectionName), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  }
};

// Export Firebase status
export const getFirebaseStatus = () => {
  return {
    initialized: isFirebaseReady(),
    hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    hasStorageBucket: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    hasMessagingSenderId: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    hasAppId: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  };
};
