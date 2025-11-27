// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User,
} from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBQsV1yx7OtTfja4fznPpe4TcVR2HRhCqo",
  authDomain: "garden-grains-fullstack-app.firebaseapp.com",
  projectId: "garden-grains-fullstack-app",
  storageBucket: "garden-grains-fullstack-app.firebasestorage.app",
  messagingSenderId: "215335407041",
  appId: "1:215335407041:web:3d1bbe2f2e70daafb63340",
  measurementId: "G-LCQFMS0BJD"
};

// Initialize Firebase app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firestore
const db = getFirestore(app);

// Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ✅ Client-safe auth helpers
const googleSignIn = async (): Promise<User | null> => {
  if (typeof window === "undefined") return null; // Prevent server execution
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

const signOutUser = async () => {
  if (typeof window === "undefined") return;
  await signOut(auth);
};

// Wrapper for onAuthStateChanged
const onAuthStateChanged = (callback: (user: User | null) => void) => {
  if (typeof window === "undefined") return () => {}; // No-op on server
  return firebaseOnAuthStateChanged(auth, callback);
};

export { db, auth, googleSignIn, signOutUser, onAuthStateChanged };
