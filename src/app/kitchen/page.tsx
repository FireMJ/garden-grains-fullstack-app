'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { FaClock, FaCheck, FaSpinner, FaBell, FaUtensils, FaMotorcycle, FaUserCheck, FaHourglassHalf, FaTruck, FaEye } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import OrderDetailModal from '@/components/OrderDetailModal';

interface Order {
  id: string;
  customerName: string;
  items: any[];
  totalPrice: number;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'rejected' | 'paused';
  createdAt: any;
  acceptedAt?: Date;
  prepStartTime?: Date;
  readyAt?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  estimatedReadyTime?: Date;
  estimatedDeliveryTime?: Date;
  specialInstructions?: string;
  orderType?: 'delivery' | 'pickup';
  driverName?: string;
  driverPhone?: string;
}

const calculatePrepTime = (items: any[]): number => {
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  let prepTime = 20 + (totalItems * 5);
  return Math.min(prepTime, 45);
};

const calculateDeliveryTime = (prepTime: number): number => {
  return prepTime + 20;
};

export default function KitchenDashboard() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'delivered' | 'rejected' | 'paused'>('pending');
  const [timers, setTimers] = useState<Record<string, { remaining: number; total: number; type: string }>>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (userRole !== 'admin' && userRole !== 'staff') router.push('/');
    }
  }, [user, userRole, loading, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers: Record<string, { remaining: number; total: number; type: string }> = {};
      
      orders.forEach(order => {
        if (order.status === 'preparing' && order.estimatedReadyTime) {
          const now = new Date().getTime();
          const readyTime = new Date(order.estimatedReadyTime).getTime();
          const remaining = Math.max(0, Math.ceil((readyTime - now) / 1000));
          const total = calculatePrepTime(order.items) * 60;
          newTimers[order.id] = { remaining, total, type: 'prep' };
        }
        if (order.status === 'picked_up' && order.estimatedDeliveryTime) {
          const now = new Date().getTime();
          const deliveryTime = new Date(order.estimatedDeliveryTime).getTime();
          const remaining = Math.max(0, Math.ceil((deliveryTime - now) / 1000));
          const total = calculateDeliveryTime(calculatePrepTime(order.items)) * 60;
          newTimers[order.id] = { remaining, total, type: 'delivery' };
        }
      });
      setTimers(newTimers);
    }, 1000);
    return () => clearInterval(interval);
  }, [orders]);

  useEffect(() => {
    if (!user) return;

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders: Order[] = [];
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const order = { 
          id: doc.id, 
          customerName: data.customerName || 'Customer',
          items: data.items || [],
          totalPrice: data.total || data.totalPrice || 0,
          status: data.status || 'pending',
          createdAt: data.createdAt,
          acceptedAt: data.acceptedAt?.toDate(),
          prepStartTime: data.prepStartTime?.toDate(),
          readyAt: data.readyAt?.toDate(),
          pickedUpAt: data.pickedUpAt?.toDate(),
          deliveredAt: data.deliveredAt?.toDate(),
          estimatedReadyTime: data.estimatedReadyTime?.toDate(),
          estimatedDeliveryTime: data.estimatedDeliveryTime?.toDate(),
          specialInstructions: data.specialInstructions || '',
          orderType: data.orderType || 'pickup',
          driverName: data.driverName,
          driverPhone: data.driverPhone
        } as Order;
        newOrders.push(order);
      });
      setOrders(newOrders);
    });
    return () => unsubscribe();
  }, [user]);

  const acceptOrder = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'accepted', acceptedAt: new Date() });
      toast.success(`Order #${orderId.slice(-6)} accepted`);
    } catch (error) {
      toast.error('Failed to accept order');
    }
  };

  const startPreparation = async (orderId: string, order: Order) => {
    const prepTimeSeconds = calculatePrepTime(order.items) * 60;
    const estimatedReadyTime = new Date(Date.now() + prepTimeSeconds * 1000);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'preparing',
        prepStartTime: new Date(),
        estimatedReadyTime: estimatedReadyTime
      });
      toast.success(`Started preparing order #${orderId.slice(-6)}`);
    } catch (error) {
      toast.error('Failed to start preparation');
    }
  };

  const markAsReady = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'ready', readyAt: new Date() });
      toast.success(`Order #${orderId.slice(-6)} is ready for pickup!`);
    } catch (error) {
      toast.error('Failed to mark as ready');
    }
  };

  const confirmPickup = async (orderId: string, order: Order) => {
    const deliveryTimeSeconds = calculateDeliveryTime(calculatePrepTime(order.items)) * 60;
    const estimatedDeliveryTime = new Date(Date.now() + deliveryTimeSeconds * 1000);
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: 'picked_up',
        pickedUpAt: new Date(),
        estimatedDeliveryTime: estimatedDeliveryTime
      });
      toast.success(`Order #${orderId.slice(-6)} picked up - Driver on the way!`);
    } catch (error) {
      toast.error('Failed to confirm pickup');
    }
  };

  const confirmDelivery = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'delivered', deliveredAt: new Date() });
      toast.success(`Order #${orderId.slice(-6)} delivered successfully!`);
    } catch (error) {
      toast.error('Failed to confirm delivery');
    }
  };

  const getFilteredOrders = () => orders.filter(order => order.status === activeTab);
  const filteredOrders = getFilteredOrders();

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Ready!';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (date: any) => {
    if (!date) return 'Pending';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    accepted: orders.filter(o => o.status === 'accepted').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    picked_up: orders.filter(o => o.status === 'picked_up').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    rejected: orders.filter(o => o.status === 'rejected').length,
    paused: orders.filter(o => o.status === 'paused').length,
  };

  const tabs = [
    { id: 'pending', label: 'New', icon: FaBell, count: stats.pending, color: 'red' },
    { id: 'accepted', label: 'Accepted', icon: FaCheck, count: stats.accepted, color: 'blue' },
    { id: 'preparing', label: 'Preparing', icon: FaSpinner, count: stats.preparing, color: 'orange' },
    { id: 'ready', label: 'Ready', icon: FaUtensils, count: stats.ready, color: 'green' },
    { id: 'picked_up', label: 'On Delivery', icon: FaMotorcycle, count: stats.picked_up, color: 'purple' },
    { id: 'delivered', label: 'Delivered', icon: FaUserCheck, count: stats.delivered, color: 'emerald' },
    { id: 'paused', label: 'Paused', icon: FaClock, count: stats.paused, color: 'gray' },
    { id: 'rejected', label: 'Rejected', icon: FaTruck, count: stats.rejected, color: 'gray' },
  ];

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div></div>;

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Kitchen Dashboard</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`bg-white rounded-lg shadow-sm p-3 text-center transition-all ${activeTab === tab.id ? `ring-2 ring-${tab.color}-500 shadow-md` : ''}`}
            >
              <tab.icon className={`text-xl mx-auto mb-1 ${activeTab === tab.id ? `text-${tab.color}-600` : 'text-gray-400'}`} />
              <p className="text-xs text-gray-500">{tab.label}</p>
              <p className="text-xl font-bold">{tab.count}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const timer = timers[order.id];
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className={`p-4 ${order.status === 'pending' ? 'bg-red-50' : order.status === 'accepted' ? 'bg-blue-50' : order.status === 'preparing' ? 'bg-orange-50' : order.status === 'ready' ? 'bg-green-50' : order.status === 'picked_up' ? 'bg-purple-50' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-mono font-medium">#{order.id.slice(-6)}</p>
                      <p className="text-xs text-gray-500">{order.createdAt?.toDate?.()?.toLocaleTimeString() || 'Just now'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{order.orderType === 'delivery' ? '🚚 Delivery' : '📦 Pickup'}</p>
                      <p className="font-bold text-green-600">R{order.totalPrice?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="font-medium text-gray-900">{order.customerName}</p>
                  <p className="text-xs text-gray-500 mt-1">{order.items?.length} items</p>
                  
                  {order.status === 'preparing' && timer?.type === 'prep' && (
                    <div className="mt-3 p-2 bg-orange-50 rounded">
                      <div className="flex justify-between text-sm">
                        <span>Prep time:</span>
                        <span className="font-mono font-bold">{formatTimeRemaining(timer.remaining)}</span>
                      </div>
                      <div className="w-full bg-orange-200 rounded-full h-1.5 mt-1">
                        <div className="bg-orange-600 rounded-full h-1.5" style={{ width: `${(timer.remaining / timer.total) * 100}%` }} />
                      </div>
                    </div>
                  )}
                  
                  {order.status === 'picked_up' && timer?.type === 'delivery' && (
                    <div className="mt-3 p-2 bg-purple-50 rounded">
                      <div className="flex justify-between text-sm">
                        <span>Delivery ETA:</span>
                        <span className="font-mono font-bold">{formatTimeRemaining(timer.remaining)}</span>
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-1.5 mt-1">
                        <div className="bg-purple-600 rounded-full h-1.5" style={{ width: `${(timer.remaining / timer.total) * 100}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-3 bg-gray-50 border-t flex gap-2">
                  <button onClick={() => setSelectedOrder(order)} className="flex-1 bg-gray-600 text-white py-1.5 rounded-lg hover:bg-gray-700 text-sm flex items-center justify-center gap-1">
                    <FaEye /> View
                  </button>
                  
                  {order.status === 'pending' && (
                    <button onClick={() => acceptOrder(order.id)} className="flex-1 bg-blue-600 text-white py-1.5 rounded-lg hover:bg-blue-700 text-sm">Accept</button>
                  )}
                  {order.status === 'accepted' && (
                    <button onClick={() => startPreparation(order.id, order)} className="flex-1 bg-orange-600 text-white py-1.5 rounded-lg hover:bg-orange-700 text-sm">Start</button>
                  )}
                  {order.status === 'preparing' && (
                    <button onClick={() => markAsReady(order.id)} className="flex-1 bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 text-sm">Ready</button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => confirmPickup(order.id, order)} className="flex-1 bg-purple-600 text-white py-1.5 rounded-lg hover:bg-purple-700 text-sm">Pickup</button>
                  )}
                  {order.status === 'picked_up' && (
                    <button onClick={() => confirmDelivery(order.id)} className="flex-1 bg-emerald-600 text-white py-1.5 rounded-lg hover:bg-emerald-700 text-sm">Deliver</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdate={() => {
            // Refresh orders
          }}
        />
      )}
    </div>
  );
}
