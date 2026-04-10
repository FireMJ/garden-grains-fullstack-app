'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle, FaClock, FaUtensils, FaTruck, FaHome, FaStore, FaArrowLeft } from 'react-icons/fa';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  orderId: string;
  orderNumber?: string;
  transactionId?: string;
  amount: number;
  items: OrderItem[];
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: any;
  paymentStatus: string;
  status: string;
  timestamp: string;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const orderId = params?.id as string;
    if (!orderId) {
      console.log('No order ID in params:', params);
      setIsLoading(false);
      return;
    }

    console.log('Loading order:', orderId);

    // Load order from localStorage
    const loadOrder = () => {
      try {
        const ordersStr = localStorage.getItem('orders');
        const allOrders = ordersStr ? JSON.parse(ordersStr) : [];
        
        console.log('All orders:', allOrders);
        
        const foundOrder = allOrders.find((o: any) => o.orderId === orderId);
        
        if (foundOrder) {
          console.log('Found order:', foundOrder);
          setOrder(foundOrder);
        } else {
          console.log('Order not found:', orderId);
        }
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [params]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
      case 'paid':
        return <FaClock className="w-8 h-8 text-yellow-500" />;
      case 'preparing':
        return <FaUtensils className="w-8 h-8 text-blue-500" />;
      case 'ready':
        return <FaCheckCircle className="w-8 h-8 text-green-500" />;
      case 'out-for-delivery':
        return <FaTruck className="w-8 h-8 text-purple-500" />;
      case 'delivered':
        return <FaHome className="w-8 h-8 text-green-600" />;
      default:
        return <FaClock className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Received';
      case 'paid':
        return 'Payment Confirmed';
      case 'preparing':
        return 'Preparing Your Order';
      case 'ready':
        return 'Ready for Pickup/Delivery';
      case 'out-for-delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Order Placed';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Link href="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6">
            <FaArrowLeft /> Back to Orders
          </Link>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find your order. Please check your order history.</p>
            <Link
              href="/orders"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const orderStatus = order.status || 'paid';
  let statusSteps = ['paid', 'preparing', 'ready'];
  if (order.orderType === 'delivery') {
    statusSteps = ['paid', 'preparing', 'ready', 'out-for-delivery', 'delivered'];
  } else {
    statusSteps = ['paid', 'preparing', 'ready', 'delivered'];
  }
  
  const currentStepIndex = statusSteps.findIndex(step => step === orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6">
          <FaArrowLeft /> Back to Orders
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-white">
            <h1 className="text-2xl font-bold mb-2">Order Tracking</h1>
            <p className="text-green-100">Order #{order.orderNumber || order.orderId.slice(-8)}</p>
            <p className="text-green-100 text-sm mt-1">Placed on {formatDate(order.timestamp)}</p>
          </div>

          {/* Status Timeline */}
          <div className="p-6 border-b">
            <div className="relative">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step} className="flex items-start mb-8 last:mb-0">
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}>
                      {step === 'paid' && <FaCheckCircle className="w-6 h-6" />}
                      {step === 'preparing' && <FaUtensils className="w-6 h-6" />}
                      {step === 'ready' && <FaStore className="w-6 h-6" />}
                      {step === 'out-for-delivery' && <FaTruck className="w-6 h-6" />}
                      {step === 'delivered' && <FaHome className="w-6 h-6" />}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {getStatusText(step)}
                      </h3>
                      {isCurrent && (
                        <p className="text-sm text-green-600 mt-1">Current status</p>
                      )}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className={`absolute left-6 w-0.5 h-12 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-200'
                      }`} style={{ top: '48px' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>R{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Total Paid</span>
                  <span>R{order.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery/Pickup Info */}
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {order.orderType === 'delivery' ? 'Delivery Information' : 'Pickup Information'}
            </h2>
            {order.orderType === 'delivery' && order.deliveryAddress ? (
              <div className="flex items-start gap-3">
                <FaTruck className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-gray-800">{order.deliveryAddress.street}</p>
                  <p className="text-gray-600">{order.deliveryAddress.city}</p>
                  {order.deliveryAddress.distance && (
                    <p className="text-sm text-gray-500 mt-2">
                      Distance: {order.deliveryAddress.distance.toFixed(1)} km
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <FaStore className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-gray-800">Uitsig Wine Farm</p>
                  <p className="text-gray-600">Spaanschemat River Rd, Fir Grove</p>
                  <p className="text-gray-600">Cape Town, 7806</p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50 flex gap-3">
            <Link
              href="/orders"
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition text-center"
            >
              View All Orders
            </Link>
            <Link
              href="/menu"
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-center"
            >
              Order More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
