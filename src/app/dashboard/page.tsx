'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
<<<<<<< HEAD
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { toast, Toaster } from 'react-hot-toast';
=======
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { FaPhone, FaMapMarkerAlt, FaClock, FaCheck, FaTimes, FaSpinner, FaBell, FaMotorcycle, FaSearch } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import AdminNavbar from '@/components/AdminNavbar';

const playNotificationSound = () => {
  const audio = new Audio('/sounds/new-order.mp3');
  audio.play().catch(e => console.log('Audio playback failed:', e));
};
>>>>>>> 7b0f95a157f33be0f529e4c63f22d02af4ccc9fc

interface Order {
  id: string;
  customerName: string;
<<<<<<< HEAD
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
=======
  customerPhone?: string;
  deliveryAddress?: string;
  items: any[];
  totalPrice: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'rejected';
  createdAt: any;
  specialInstructions?: string;
}

export default function DashboardPage() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready' | 'delivered'>('pending');
  const [showNotifications, setShowNotifications] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ pending: 0, preparing: 0, ready: 0, delivered: 0 });
>>>>>>> 7b0f95a157f33be0f529e4c63f22d02af4ccc9fc

  useEffect(() => {
    if (!loading) {
      if (!user || (userRole !== 'admin' && userRole !== 'staff')) {
        router.push('/login');
      }
    }
  }, [user, userRole, loading, router]);

  useEffect(() => {
<<<<<<< HEAD
    if (user) {
      setDisplayName(user.displayName || '');
      // Load phone from localStorage
      const savedPhone = localStorage.getItem(`user_phone_${user.uid}`);
      if (savedPhone) setPhoneNumber(savedPhone);
    }
  }, [user]);

  useEffect(() => {
=======
>>>>>>> 7b0f95a157f33be0f529e4c63f22d02af4ccc9fc
    if (!user) return;

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders: Order[] = [];
      let pendingCount = 0, preparingCount = 0, readyCount = 0, deliveredCount = 0;
      
<<<<<<< HEAD
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
        
=======
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' && change.doc.data().status === 'pending' && showNotifications) {
          playNotificationSound();
          toast.success(`New order #${change.doc.id.slice(-6)}!`, { duration: 5000, icon: '🛎️' });
        }
      });
      
      snapshot.docs.forEach(doc => {
        const order = { id: doc.id, ...doc.data() } as Order;
        newOrders.push(order);
>>>>>>> 7b0f95a157f33be0f529e4c63f22d02af4ccc9fc
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
<<<<<<< HEAD
  }, [user]);
=======
  }, [user, showNotifications]);
>>>>>>> 7b0f95a157f33be0f529e4c63f22d02af4ccc9fc

  useEffect(() => {
    let filtered = orders.filter(order => order.status === activeTab);
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredOrders(filtered);
  }, [orders, activeTab, searchTerm]);

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
<<<<<<< HEAD
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
=======
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus, updatedAt: new Date() });
      toast.success(`Order #${orderId.slice(-6)} marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const formatTime = (date: any) => {
    if (!date) return 'Just now';
    const d = date.toDate ? date.toDate() : new Date(date);
    const minutes = Math.floor((new Date().getTime() - d.getTime()) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    return d.toLocaleTimeString();
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-100 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </>
>>>>>>> 7b0f95a157f33be0f529e4c63f22d02af4ccc9fc
    );
  }

  if (!user || (userRole !== 'admin' && userRole !== 'staff')) {
    return null;
  }

<<<<<<< HEAD
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
=======
  const tabs = [
    { id: 'pending', label: 'Pending', color: 'orange', count: stats.pending, icon: FaBell },
    { id: 'preparing', label: 'Preparing', color: 'blue', count: stats.preparing, icon: FaSpinner },
    { id: 'ready', label: 'Ready', color: 'green', count: stats.ready, icon: FaCheck },
    { id: 'delivered', label: 'Delivered', color: 'gray', count: stats.delivered, icon: FaMotorcycle },
  ];

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <p className="text-sm text-gray-500">Manage incoming orders in real-time</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-full relative ${showNotifications ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
              >
                <FaBell />
              </button>
            </div>
          </div>
          
          <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="text-sm" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id ? 'bg-white text-green-600' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No {activeTab} orders</h3>
              <p className="text-gray-500 mt-1">Orders will appear here when they're {activeTab}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className={`p-4 ${
                    order.status === 'pending' ? 'bg-orange-50 border-l-4 border-orange-500' :
                    order.status === 'preparing' ? 'bg-blue-50 border-l-4 border-blue-500' :
                    order.status === 'ready' ? 'bg-green-50 border-l-4 border-green-500' :
                    'bg-gray-50 border-l-4 border-gray-500'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500 font-mono">#{order.id.slice(-6)}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <FaClock className="text-xs" /> {formatTime(order.createdAt)}
                        </p>
                      </div>
                      <p className="font-bold text-green-600">R{order.totalPrice?.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <FaPhone className="text-gray-400 mt-0.5 text-sm" />
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName || 'Customer'}</p>
                        {order.customerPhone && <p className="text-sm text-gray-600">{order.customerPhone}</p>}
                      </div>
                    </div>
                    
                    {order.deliveryAddress && (
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-gray-400 mt-0.5 text-sm" />
                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                      </div>
                    )}
                    
                    <div className="border-t pt-3">
                      <p className="text-sm font-medium text-gray-900 mb-2">Items:</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.quantity}x {item.name}</span>
                            <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {order.specialInstructions && (
                      <div className="bg-yellow-50 p-2 rounded-lg">
                        <p className="text-xs text-yellow-800">
                          <span className="font-medium">Note:</span> {order.specialInstructions}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                          >
                            <FaCheck /> Accept
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'rejected')}
                            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                          >
                            <FaTimes /> Reject
                          </button>
                        </>
                      )}
                      {order.status === 'preparing' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                          <FaCheck /> Mark as Ready
                        </button>
                      )}
                      {order.status === 'ready' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                        >
                          <FaMotorcycle /> Mark as Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
>>>>>>> 7b0f95a157f33be0f529e4c63f22d02af4ccc9fc
        </div>
      </div>
    </>
  );
}
