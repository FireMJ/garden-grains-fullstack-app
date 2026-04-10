'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaBox, FaClock, FaCheckCircle, FaTruck, FaReceipt } from 'react-icons/fa';

interface Order {
  orderId: string;
  orderNumber?: string;
  transactionId?: string;
  amount: number;
  items: any[];
  orderType: 'delivery' | 'pickup';
  paymentStatus: string;
  status: string;
  timestamp: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadOrders();
  }, [user, router]);

  const loadOrders = () => {
    setIsLoading(true);
    try {
      const ordersStr = localStorage.getItem('orders');
      const allOrders = ordersStr ? JSON.parse(ordersStr) : [];
      
      // Sort by date (newest first)
      allOrders.sort((a: Order, b: Order) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'preparing':
        return 'bg-yellow-100 text-yellow-700';
      case 'ready':
        return 'bg-blue-100 text-blue-700';
      case 'out-for-delivery':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/profile" className="text-gray-600 hover:text-green-600 transition">
            ← Back to Profile
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <div className="w-20"></div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <FaBox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
            <Link
              href="/menu"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.orderId} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
                <div className="flex justify-between items-start mb-4 pb-3 border-b">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FaReceipt className="text-gray-400" />
                      <span className="font-mono text-sm text-gray-600">
                        {order.orderNumber || order.orderId.slice(-8)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(order.timestamp)}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      <FaCheckCircle className="w-3 h-3" />
                      {order.status?.toUpperCase() || 'PAID'}
                    </span>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      R{order.amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity}</span>
                      <span>R{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-xs text-gray-500">+{order.items.length - 3} more items</p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {order.orderType === 'delivery' ? (
                      <>
                        <FaTruck className="text-green-600" />
                        <span>Delivery</span>
                      </>
                    ) : (
                      <>
                        <FaClock className="text-green-600" />
                        <span>Pickup</span>
                      </>
                    )}
                  </div>
                  <Link
                    href={`/order-tracking/${order.orderId}`}
                    className="px-4 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Track Order →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
