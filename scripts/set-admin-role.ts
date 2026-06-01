import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Firebase configuration (use your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function setAdminRole() {
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
    console.log('Usage: npm run set-admin <email> <password>');
    console.log('Example: npm run set-admin admin@example.com mypassword123');
    process.exit(1);
  }
  
  try {
    // Try to sign in to get user ID
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user role to admin in Firestore
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      role: 'admin',
      updatedAt: new Date()
    });
    
    console.log(`✅ User ${email} has been upgraded to ADMIN!`);
    console.log(`You can now login at /login and access /admin/staff`);
    
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      console.log(`❌ User ${email} not found. Please sign up first.`);
    } else {
      console.error('Error:', error.message);
    }
  }
}

setAdminRole();
