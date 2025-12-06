'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  pastOrdersCount: number;
}

interface UserDataContextType {
  userData: UserData | null;
  loading: boolean;
  refreshUserData: () => void;
}

const UserDataContext = createContext<UserDataContextType>({
  userData: null,
  loading: true,
  refreshUserData: () => {},
});

export function useUserData() {
  return useContext(UserDataContext);
}

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = () => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Force re-fetch by toggling loading state
    setTimeout(() => setLoading(false), 100);
  };

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setUserData({
            id: docSnapshot.id,
            name: data.name || user.displayName || '',
            email: data.email || user.email || '',
            phone: data.phone || '',
            address: data.address || '',
            pastOrdersCount: data.pastOrdersCount || 0,
          });
        } else {
          // Create default user data
          setUserData({
            id: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            pastOrdersCount: 0,
          });
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
    <UserDataContext.Provider value={{ userData, loading, refreshUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}
