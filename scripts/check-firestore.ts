import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

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

async function checkFirestore() {
  console.log('Checking Firestore access...');
  
  try {
    // Try to read moments collection
    const momentsRef = collection(db, 'moments');
    const snapshot = await getDocs(momentsRef);
    console.log(`✅ Read ${snapshot.size} moments successfully`);
  } catch (error: any) {
    console.error('❌ Error reading moments:', error.message);
    console.log('Permission denied - need to update Firestore rules');
  }
  
  try {
    // Try to create a test moment
    const momentsRef = collection(db, 'moments');
    const docRef = await addDoc(momentsRef, {
      author: 'Test User',
      content: 'Testing Firestore permissions',
      date: serverTimestamp(),
      likes: 0,
      comments: 0,
      verified: false,
      category: 'test'
    });
    console.log(`✅ Created test moment with ID: ${docRef.id}`);
    
    // Clean up - delete test moment
    // await deleteDoc(docRef);
  } catch (error: any) {
    console.error('❌ Error creating moment:', error.message);
  }
}

checkFirestore();
