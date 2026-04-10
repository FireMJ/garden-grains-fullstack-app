'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Only allow admin users (you can set your email as admin)
  const isAdmin = user?.email === 'admin@example.com'; // Change to your email

  if (!user) {
    router.push('/login');
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleAddRestaurantStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/add-restaurant-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, name }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ ' + data.message);
        setUserId('');
        setEmail('');
        setName('');
      } else {
        setMessage('❌ Error: ' + data.error);
      }
    } catch (error) {
      setMessage('❌ Error adding restaurant staff');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Restaurant Staff</h2>
          
          <form onSubmit={handleAddRestaurantStaff} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID (Required)
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Firebase User UID"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Get this from Firebase Console → Authentication → Users
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="user@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Staff Name"
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Restaurant Staff'}
            </button>
          </form>
          
          {message && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm">{message}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 bg-yellow-50 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">How to get User ID:</h3>
          <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Go to Firebase Console</li>
            <li>Select your project</li>
            <li>Go to "Authentication" → "Users"</li>
            <li>Find the user you want to make restaurant staff</li>
            <li>Copy their "User UID"</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
