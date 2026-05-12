"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  updateUserPhone: (phoneNumber: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          displayName: name,
          createdAt: new Date(),
          phoneNumber: '',
        });

        await userCredential.user.reload();
        setUser({ ...userCredential.user });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!auth.currentUser) throw new Error("No user logged in");

    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL
      });
      
      // Update Firestore
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, { displayName }, { merge: true });

      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserPhone = async (phoneNumber: string) => {
    if (!auth.currentUser) throw new Error("No user logged in");

    setLoading(true);
    try {
      // Store phone number in Firestore (Firebase Auth requires re-authentication for phone updates)
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, { phoneNumber }, { merge: true });
      
      // Also store in localStorage for quick access
      localStorage.setItem(`user_phone_${auth.currentUser.uid}`, phoneNumber);
    } catch (error: any) {
      console.error('Phone update error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithGoogle,
    logout,
    signup,
    resetPassword,
    updateUserProfile,
    updateUserPhone,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Add to existing AuthContext
export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: 'customer' | 'staff' | 'admin';
  phone?: string;
}

// Add to the AuthContext return value
// Make sure userRole is included
