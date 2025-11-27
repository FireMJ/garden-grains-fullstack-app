"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserData {
  uid: string;
  email: string;
  role?: string;
  displayName?: string;
  photoURL?: string;
  preferences?: any;
}

interface UserDataContextType {
  userData: UserData | null;
  loading: boolean;
}

const UserDataContext = createContext<UserDataContextType>({
  userData: null,
  loading: true,
});

export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.id),
      (doc) => {
        if (doc.exists()) {
          setUserData(doc.data() as UserData);
        } else {
          setUserData(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <UserDataContext.Provider value={{ userData, loading }}>
      {children}
    </UserDataContext.Provider>
  );
};
