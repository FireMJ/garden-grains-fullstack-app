'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { FaClock, FaCheck, FaSpinner, FaBell, FaUtensils } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

interface Order {
  id: string;
  customerName: string;
  items: any[];
  totalPrice: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  createdAt: any;
  prepStartTime?: Date;
  readyAt?: Date;
  specialInstructions?: string;
  orderType?: 'delivery' | 'pickup';
}

export default function KitchenDashboard() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready'>('pending');

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (userRole !== 'admin' && userRole !== 'staff') router.push('/');
    }
  }, [user, userRole, loading, router]);

  useEffect(() => {
    if (!user) return;

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders: Order[] = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        newOrders.push({ 
          id: doc.id, 
          customerName: data.customerName || 'Customer',
          items: data.items || [],
          totalPrice: data.total || data.totalPrice || 0,
          status: data.status || 'pending',
          createdAt: data.createdAt,
          prepStartTime: data.prepStartTime?.toDate(),
          readyAt: data.readyAt?.toDate(),
          specialInstructions: data.specialInstructions || '',
          orderType: data.orderType || 'pickup'
        } as Order);
      });
      setOrders(newOrders);
    });
    
    return () => unsubscribe();
  }, [user]);

  const startPreparation = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'preparing',
        prepStartTime: new Date(),
        estimatedReadyTime: new Date(Date.now() + 30 * 60000) // 30 minutes
      });
      toast.success(`Started preparing order #${orderId.slice(-6)}`);
    } catch (error) {
      console.error('Error starting preparation:', error);
      toast.error('Failed to start preparation');
    }
  };

  const markAsReady = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'ready',
        readyAt: new Date()
      });
      toast.success(`Order #${orderId.slice(-6)} is ready!`);
    } catch (error) {
      console.error('Error marking as ready:', error);
      toast.error('Failed to mark as ready');
    }
  };

  const getFilteredOrders = () => orders.filter(order => order.status === activeTab);
  const filteredOrders = getFilteredOrders();
  
  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
  };

  const formatTime = (date?: Date) => {
    if (!date) return 'Not started';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading kitchen dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Kitchen Dashboard</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
            <p className="text-sm text-gray-500">New Orders</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{stats.preparing}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Ready</p>
            <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-6">
          <button onClick={() => setActiveTab('pending')} className={`px-6 py-2 rounded-lg ${activeTab === 'pending' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}>
            New Orders ({stats.pending})
          </button>
          <button onClick={() => setActiveTab('preparing')} className={`px-6 py-2 rounded-lg ${activeTab === 'preparing' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}>
            Preparing ({stats.preparing})
          </button>
          <button onClick={() => setActiveTab('ready')} className={`px-6 py-2 rounded-lg ${activeTab === 'ready' ? 'bg-green-600 text-white' : 'bg-white text-gray-600'}`}>
            Ready ({stats.ready})
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 bg-orange-50 border-l-4 border-orange-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono font-medium">#{order.id.slice(-6)}</p>
                    <p className="text-xs text-gray-500 mt-1">Ordered: {formatTime(order.createdAt?.toDate())}</p>
                  </div>
                  <p className="font-bold text-green-600">R{order.totalPrice?.toFixed(2)}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium mb-2">Items ({order.items?.length})</p>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm mb-1">
                    <span>{item.quantity}x {item.name}</span>
                    <span>R{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t">
                {order.status === 'pending' && (
                  <button onClick={() => startPreparation(order.id)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 text-center">Started: {formatTime(order.prepStartTime)}</p>
                    <button onClick={() => markAsReady(order.id)} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                      Mark as Ready
                    </button>
                  </div>
                )}
                {order.status === 'ready' && (
                  <div className="text-center">
                    <p className="text-green-600">Ready for {order.orderType === 'delivery' ? 'delivery' : 'pickup'}</p>
                    <p className="text-xs text-gray-500 mt-1">Ready at: {formatTime(order.readyAt)}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
