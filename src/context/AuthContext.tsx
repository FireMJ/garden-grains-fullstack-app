'use client';

<<<<<<< HEAD
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
=======
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
>>>>>>> 7b0f95a157f33be0f529e4c63f22d02af4ccc9fc

interface AuthContextType {
  user: User | null;
  userData: any | null;
  userRole: string | null;
  loading: boolean;
<<<<<<< HEAD
  userRole: string | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
=======
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
>>>>>>> 7b0f95a157f33be0f529e4c63f22d02af4ccc9fc
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchUserData = async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        setUserRole(data.role || 'customer');
        return data;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    return null;
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  };

  useEffect(() => {
    if (!auth) {
      console.warn('Auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
<<<<<<< HEAD
      
      if (user) {
        // Fetch user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role || 'customer');
          } else {
            setUserRole('customer');
            // Create user document if it doesn't exist
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              role: 'customer',
              displayName: user.displayName || '',
              createdAt: new Date()
            });
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('customer');
        }
      } else {
        setUserRole(null);
      }
      
=======
      if (user) {
        await fetchUserData(user.uid);
      } else {
        setUserData(null);
        setUserRole(null);
      }
>>>>>>> 7b0f95a157f33be0f529e4c63f22d02af4ccc9fc
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

<<<<<<< HEAD
  const signUp = async (email: string, password: string) => {
    if (!auth) throw new Error('Auth not initialized');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    setUser(result.user);
    setUserRole('customer');
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      email: result.user.email,
      role: 'customer',
      createdAt: new Date()
    });
  };

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Auth not initialized');
    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser(result.user);
  };

  const signInWithGoogle = async () => {
    if (!auth) throw new Error('Auth not initialized');
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    setUser(result.user);
    setUserRole('customer');
    
    // Create user document in Firestore if it doesn't exist
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName,
        role: 'customer',
        createdAt: new Date()
      });
    }
  };

  const logout = async () => {
    if (!auth) throw new Error('Auth not initialized');
    await signOut(auth);
    setUser(null);
    setUserRole(null);
  };

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!auth || !auth.currentUser) throw new Error('No user logged in');
    
    await updateProfile(auth.currentUser, data);
    
    // Update Firestore user document
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      displayName: data.displayName || '',
      photoURL: data.photoURL || '',
      updatedAt: new Date()
    });
    
    // Refresh user object
    setUser({ ...auth.currentUser });
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Auth not initialized');
    await sendPasswordResetEmail(auth, email);
=======
  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserData(userCredential.user.uid);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      uid: userCredential.user.uid,
      email,
      name,
      role: 'customer',
      phone: '',
      createdAt: new Date()
    });
    
    await fetchUserData(userCredential.user.uid);
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
    setUserRole(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    userData,
    userRole,
    loading,
    signIn,
    signUp,
    logout,
    resetPassword,
    refreshUserData
>>>>>>> 7b0f95a157f33be0f529e4c63f22d02af4ccc9fc
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      userRole,
      signUp,
      signIn,
      signInWithGoogle,
      logout,
      updateUserProfile,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
<<<<<<< HEAD
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to set user role (for admin/staff setup)
export async function setUserRole(userId: string, role: 'admin' | 'staff' | 'customer') {
  try {
    await setDoc(doc(db, 'users', userId), { role }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error setting user role:', error);
    return false;
  }
}
=======
};
>>>>>>> 7b0f95a157f33be0f529e4c63f22d02af4ccc9fc
