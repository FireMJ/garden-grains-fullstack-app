'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { orderService, Order } from '@/services/orderService';
import { FaClock, FaCheckCircle, FaTruck, FaStore, FaBell, FaUsers, FaMotorcycle } from 'react-icons/fa';

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready' | 'completed'>('pending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Listen to real-time orders
    const unsubscribe = orderService.listenToRestaurantOrders((newOrders) => {
      setOrders(newOrders);
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, [user, router]);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    await orderService.updateOrderStatus(orderId, status);
    
    // If marking as ready, drivers will be automatically notified
    if (status === 'ready') {
      // Play notification sound (optional)
      const audio = new Audio('/notification.mp3');
      audio.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-700 border-green-200';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaClock className="w-4 h-4" />;
      case 'preparing': return <FaClock className="w-4 h-4" />;
      case 'ready': return <FaCheckCircle className="w-4 h-4" />;
      case 'out-for-delivery': return <FaMotorcycle className="w-4 h-4" />;
      case 'delivered': return <FaCheckCircle className="w-4 h-4" />;
      default: return <FaStore className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'pending') return order.status === 'pending';
    if (activeTab === 'preparing') return order.status === 'preparing';
    if (activeTab === 'ready') return order.status === 'ready';
    if (activeTab === 'completed') return ['delivered', 'cancelled'].includes(order.status);
    return true;
  });

  const stats = {
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    outForDelivery: orders.filter(o => o.status === 'out-for-delivery').length,
    total: orders.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Restaurant Dashboard</h1>
              <p className="text-sm text-gray-500">Manage orders in real-time</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.preparing}</div>
                <div className="text-xs text-gray-500">Preparing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.ready}</div>
                <div className="text-xs text-gray-500">Ready</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.outForDelivery}</div>
                <div className="text-xs text-gray-500">Out for Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            {[
              { key: 'pending', label: 'Pending', icon: FaBell, count: stats.pending },
              { key: 'preparing', label: 'Preparing', icon: FaClock, count: stats.preparing },
              { key: 'ready', label: 'Ready', icon: FaCheckCircle, count: stats.ready },
              { key: 'completed', label: 'Completed', icon: FaStore, count: orders.filter(o => ['delivered', 'cancelled'].includes(o.status)).length },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition ${
                  activeTab === tab.key
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.key ? 'bg-green-100 text-green-600' : 'bg-gray-100'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <FaStore className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className={`bg-white rounded-xl shadow-md border-l-4 ${getStatusColor(order.status)} p-6`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{order.orderNumber}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.toUpperCase()}
                      </span>
                      {order.driverName && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          <FaMotorcycle className="inline mr-1" />
                          Driver: {order.driverName}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {order.createdAt?.toDate().toLocaleTimeString()} - {order.createdAt?.toDate().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">R{order.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{order.orderType}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="font-medium text-gray-900 mb-2">Items:</p>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>R{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.deliveryAddress && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-600">
                      <strong>Delivery Address:</strong> {order.deliveryAddress.street}, {order.deliveryAddress.city}
                    </p>
                    <p className="text-sm text-gray-500">Distance: {order.deliveryAddress.distance?.toFixed(1)} km</p>
                  </div>
                )}

                {order.orderType === 'pickup' && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-600">
                      <strong>Pickup Location:</strong> Uitsig Wine Farm, Cape Town
                    </p>
                  </div>
                )}

                <div className="border-t pt-4 mt-4 flex gap-3">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id!, 'preparing')}
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id!, 'ready')}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Mark Ready for Pickup/Delivery
                    </button>
                  )}
                  {order.status === 'ready' && order.orderType === 'pickup' && (
                    <button
                      onClick={() => updateOrderStatus(order.id!, 'delivered')}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                      Complete Order
                    </button>
                  )}
                  {order.status === 'out-for-delivery' && (
                    <div className="flex-1 text-center text-purple-600 font-medium">
                      <FaMotorcycle className="inline mr-2" />
                      Driver Assigned: {order.driverName}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
