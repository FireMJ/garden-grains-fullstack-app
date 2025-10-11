// src/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase config from the console
const firebaseConfig = {
  apiKey: "AIzaSyBQsV1yx7OtTfja4fznPpe4TcVR2HRhCqo",
  authDomain: "garden-grains-fullstack-app.firebaseapp.com",
  projectId: "garden-grains-fullstack-app",
  storageBucket: "garden-grains-fullstack-app.firebasestorage.app",
  messagingSenderId: "215335407041",
  appId: "1:215335407041:web:3d1bbe2f2e70daafb63340",
  measurementId: "G-LCQFMS0BJD"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
