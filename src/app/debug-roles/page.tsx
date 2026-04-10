'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function DebugRolesPage() {
  const { user } = useAuth();
  const [isRestaurantUser, setIsRestaurantUser] = useState(false);
  const [isDriverUser, setIsDriverUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addingRole, setAddingRole] = useState(false);

  useEffect(() => {
    const checkRoles = async () => {
      if (user?.uid) {
        const restaurantRef = doc(db, 'restaurant_staff', user.uid);
        const restaurantSnap = await getDoc(restaurantRef);
        setIsRestaurantUser(restaurantSnap.exists());
        
        const driverRef = doc(db, 'drivers', user.uid);
        const driverSnap = await getDoc(driverRef);
        setIsDriverUser(driverSnap.exists());
      }
      setLoading(false);
    };
    
    if (user) {
      checkRoles();
    } else {
      setLoading(false);
    }
  }, [user]);

  const addRestaurantRole = async () => {
    if (!user?.uid) return;
    
    setAddingRole(true);
    try {
      const restaurantRef = doc(db, 'restaurant_staff', user.uid);
      await setDoc(restaurantRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        role: 'restaurant_staff',
        permissions: ['view_orders', 'update_status', 'manage_menu'],
        createdAt: new Date(),
      });
      setIsRestaurantUser(true);
      alert('✅ Restaurant staff role added successfully! Refresh the page to see the link.');
    } catch (error) {
      console.error('Error adding role:', error);
      alert('Error adding role. Check console for details.');
    } finally {
      setAddingRole(false);
    }
  };

  const addDriverRole = async () => {
    if (!user?.uid) return;
    
    setAddingRole(true);
    try {
      const driverRef = doc(db, 'drivers', user.uid);
      await setDoc(driverRef, {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        isAvailable: true,
        isOnline: true,
        rating: 5.0,
        totalDeliveries: 0,
        todayEarnings: 0,
        createdAt: new Date(),
      });
      setIsDriverUser(true);
      alert('✅ Driver role added successfully! Refresh the page to see the link.');
    } catch (error) {
      console.error('Error adding role:', error);
      alert('Error adding role. Check console for details.');
    } finally {
      setAddingRole(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login First</h1>
          <p className="text-gray-600">You need to be logged in to manage roles.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Role Management</h1>
        
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current User</h2>
          <div className="space-y-2">
            <p><strong>UID:</strong> {user.uid}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.displayName || 'Not set'}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Roles</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Restaurant Staff:</span>
              <span className={isRestaurantUser ? "text-green-600 font-semibold" : "text-red-600"}>
                {isRestaurantUser ? "✓ Active" : "✗ Not Assigned"}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Driver:</span>
              <span className={isDriverUser ? "text-green-600 font-semibold" : "text-red-600"}>
                {isDriverUser ? "✓ Active" : "✗ Not Assigned"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Roles</h2>
          <div className="space-y-4">
            <button
              onClick={addRestaurantRole}
              disabled={isRestaurantUser || addingRole}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {addingRole ? 'Adding...' : 'Add Restaurant Staff Role'}
            </button>
            <button
              onClick={addDriverRole}
              disabled={isDriverUser || addingRole}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {addingRole ? 'Adding...' : 'Add Driver Role'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Note: These roles will give you access to the Restaurant and Driver dashboards in the header.
          </p>
        </div>
      </div>
    </div>
  );
}
