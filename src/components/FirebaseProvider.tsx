'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isFirebaseReady, getFirebaseStatus, db, auth, storage } from '@/lib/firebase';

interface FirebaseContextType {
  isReady: boolean;
  status: ReturnType<typeof getFirebaseStatus>;
  db: typeof db;
  auth: typeof auth;
  storage: typeof storage;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within FirebaseProvider');
  }
  return context;
};

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [status, setStatus] = useState(getFirebaseStatus());

  useEffect(() => {
    // Check if Firebase is ready after mount
    const checkFirebase = () => {
      const ready = isFirebaseReady();
      setIsReady(ready);
      setStatus(getFirebaseStatus());
      
      if (ready) {
        console.log('✅ Firebase is ready and connected');
      }
    };

    checkFirebase();
    
    // No need for interval - Firebase doesn't change after initialization
  }, []);

  return (
    <FirebaseContext.Provider value={{ isReady, status, db, auth, storage }}>
      {children}
    </FirebaseContext.Provider>
  );
}
