'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FaEnvelope, FaLock, FaArrowRight, FaGift, FaUserTie } from 'react-icons/fa';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const promoEmail = searchParams?.get('email') || '';
  const promoCode = searchParams?.get('promo') || '';
  
  const [formData, setFormData] = useState({
    email: promoEmail,
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPromoMessage, setShowPromoMessage] = useState(!!promoCode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const ensureUserDocument = async (user: any) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          role: 'customer',
          phone: '',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log('✅ User document created');
      }
      return userSnap.data();
    } catch (error) {
      console.error('Error ensuring user document:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Ensure user document exists in Firestore
      const userData = await ensureUserDocument(user);
      const userRole = userData?.role || 'customer';
      
      // Redirect based on role
      const promoPending = localStorage.getItem('gardenGrainsPromoIntent');
      if (promoPending === 'true' || promoCode) {
        localStorage.removeItem('gardenGrainsPromoIntent');
        router.push('/menu?promo=ready');
      } else if (userRole === 'admin' || userRole === 'staff') {
        router.push('/dashboard');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-md">
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            <FaUserTie />
            <span>Staff/Admin login here</span>
          </div>
        </div>
        
        {showPromoMessage && (
          <div className="mb-6 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white rounded-xl p-4 text-center">
            <FaGift className="inline-block mr-2" />
            <span className="font-semibold">20% OFF Welcome Bonus!</span>
            <p className="text-sm mt-1 opacity-90">Login to claim your discount</p>
          </div>
        )}
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-green-100 mt-1">Login to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••"
                />
              </div>
            </div>
            
            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Logging in...' : (
                <>
                  Login
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>
          
          <div className="px-6 pb-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-green-600 hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
