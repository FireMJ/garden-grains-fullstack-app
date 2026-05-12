'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FaUser, FaEnvelope, FaPhone, FaSave, FaArrowLeft } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function EditProfilePage() {
  const { user, userData, refreshUserData } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (userData) {
      setFormData({
        name: userData.name || user.displayName || '',
        email: user.email || '',
        phone: userData.phone || '',
      });
      setInitialLoading(false);
    } else if (user) {
      // Fallback to user object
      setFormData({
        name: user.displayName || '',
        email: user.email || '',
        phone: '',
      });
      setInitialLoading(false);
    }
  }, [user, userData, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update Firestore user document
      const userRef = doc(db, 'users', user!.uid);
      await updateDoc(userRef, {
        name: formData.name,
        phone: formData.phone,
        updatedAt: new Date(),
      });
      
      // Refresh user data in context
      await refreshUserData();
      
      toast.success('Profile updated successfully!');
      setTimeout(() => {
        router.push('/profile');
      }, 1500);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. Please make sure you are logged in.');
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition"
        >
          <FaArrowLeft /> Back
        </button>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
            <p className="text-green-100 text-sm mt-1">Update your personal information</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Your full name"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="+27 XX XXX XXXX"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your account information is secure and private
          </p>
        </div>
      </div>
    </div>
  );
}
