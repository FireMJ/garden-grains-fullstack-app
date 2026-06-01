'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { toast, Toaster } from 'react-hot-toast';

interface Order {
  id: string;
  customerName: string;
  totalPrice: number;
  status: string;
  createdAt: any;
}

export default function DashboardPage() {
  const { user, userRole, loading, updateUserProfile } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ pending: 0, preparing: 0, ready: 0, delivered: 0 });
  const [displayName, setDisplayName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    if (!loading) {
      if (!user || (userRole !== 'admin' && userRole !== 'staff')) {
        router.push('/login');
      }
    }
  }, [user, userRole, loading, router]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      // Load phone from localStorage
      const savedPhone = localStorage.getItem(`user_phone_${user.uid}`);
      if (savedPhone) setPhoneNumber(savedPhone);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders: Order[] = [];
      let pendingCount = 0, preparingCount = 0, readyCount = 0, deliveredCount = 0;
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const order = { 
          id: doc.id, 
          customerName: data.customerName || 'Customer',
          totalPrice: data.total || data.totalPrice || 0,
          status: data.status || 'pending',
          createdAt: data.createdAt
        } as Order;
        newOrders.push(order);
        
        switch (order.status) {
          case 'pending': pendingCount++; break;
          case 'preparing': preparingCount++; break;
          case 'ready': readyCount++; break;
          case 'delivered': deliveredCount++; break;
        }
      });
      
      setOrders(newOrders);
      setStats({ pending: pendingCount, preparing: preparingCount, ready: readyCount, delivered: deliveredCount });
    });
    
    return () => unsubscribe();
  }, [user]);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      await updateUserProfile({ displayName });
      if (phoneNumber) {
        localStorage.setItem(`user_phone_${user?.uid}`, phoneNumber);
      }
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || (userRole !== 'admin' && userRole !== 'staff')) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
            <p className="text-sm text-gray-500">Pending Orders</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Preparing</p>
            <p className="text-2xl font-bold text-blue-600">{stats.preparing}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Ready</p>
            <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-gray-500">
            <p className="text-sm text-gray-500">Delivered</p>
            <p className="text-2xl font-bold text-gray-600">{stats.delivered}</p>
          </div>
        </div>
        
        {/* Profile Update Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Profile Settings</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Phone number"
                />
              </div>
            </div>
            <button
              onClick={handleUpdateProfile}
              disabled={isUpdating}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </div>
        
        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 text-sm font-mono">#{order.id.slice(-8)}</td>
                    <td className="px-6 py-4 text-sm">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm">R{order.totalPrice?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'ready' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
