import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// For now, we'll use a simple approach without admin credentials
// You can add these later for more advanced features

let adminApp;
let adminDb;

try {
  if (!adminApp) {
    adminApp = initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }, 'admin');
  }
  adminDb = getFirestore(adminApp);
} catch {
  console.log('Firebase Admin not configured (optional for now)');
}

export { adminDb };