'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { 
  CheckCircle, Clock, CookingPot, Package, Truck, 
  Home, ArrowLeft, AlertCircle, Timer, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

interface Order {
  id: string;
  customerName: string;
  status: 'pending' | 'preparing' | 'ready' | 'picked_up' | 'delivered';
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  total: number;
  createdAt: any;
  prepStartTime?: any;
  readyAt?: any;
  pickedUpAt?: any;
  deliveredAt?: any;
  estimatedReadyTime?: any;
  estimatedArrival?: any;
  items: any[];
  driverName?: string;
  driverPhone?: string;
  driverLat?: number;
  driverLng?: number;
  restaurantLat?: number;
  restaurantLng?: number;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [driverEta, setDriverEta] = useState<number | null>(null);
  const [distanceRemaining, setDistanceRemaining] = useState<number | null>(null);

  const orderId = params?.id as string;

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  // Calculate time remaining for preparation
  useEffect(() => {
    if (!order) return;

    if (order.status === 'preparing' && order.estimatedReadyTime) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const readyTime = getDateValue(order.estimatedReadyTime);
        const remaining = Math.max(0, Math.ceil((readyTime - now) / 1000 / 60));
        setTimeRemaining(remaining);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [order]);

  // Calculate driver ETA and distance
  useEffect(() => {
    if (!order || order.status !== 'picked_up' || !order.driverLat || !order.driverLng) return;

    const updateDriverLocation = () => {
      const remainingDistance = 5.2;
      const averageSpeed = 30;
      const etaMinutes = Math.ceil((remainingDistance / averageSpeed) * 60);
      
      setDistanceRemaining(remainingDistance);
      setDriverEta(etaMinutes);
    };

    updateDriverLocation();
    const interval = setInterval(updateDriverLocation, 30000);
    return () => clearInterval(interval);
  }, [order]);

  // Helper function to safely get date value
  const getDateValue = (dateField: any): number => {
    if (!dateField) return 0;
    if (dateField.toDate) {
      return dateField.toDate().getTime();
    }
    if (dateField instanceof Date) {
      return dateField.getTime();
    }
    if (typeof dateField === 'string') {
      return new Date(dateField).getTime();
    }
    if (typeof dateField === 'number') {
      return dateField;
    }
    return 0;
  };

  // Helper function to format date consistently
  const formatDateTime = (dateField: any): string => {
    if (!dateField) return 'Pending';
    
    try {
      let date: Date;
      if (dateField.toDate) {
        date = dateField.toDate();
      } else if (dateField instanceof Date) {
        date = dateField;
      } else if (typeof dateField === 'string') {
        date = new Date(dateField);
      } else if (typeof dateField === 'number') {
        date = new Date(dateField);
      } else {
        return 'Invalid date';
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return date.toLocaleString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date error';
    }
  };

  const formatTime = (dateField: any): string => {
    if (!dateField) return 'Pending';
    
    try {
      let date: Date;
      if (dateField.toDate) {
        date = dateField.toDate();
      } else if (dateField instanceof Date) {
        date = dateField;
      } else if (typeof dateField === 'string') {
        date = new Date(dateField);
      } else if (typeof dateField === 'number') {
        date = new Date(dateField);
      } else {
        return 'Pending';
      }
      
      if (isNaN(date.getTime())) {
        return 'Pending';
      }
      
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Pending';
    }
  };

  // Real-time order updates directly from Firestore
  useEffect(() => {
    if (!orderId) return;

    console.log('Setting up real-time listener for order:', orderId);
    
    const orderRef = doc(db, 'orders', orderId);
    
    const unsubscribe = onSnapshot(orderRef, 
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const orderData = { id: docSnapshot.id, ...docSnapshot.data() } as Order;
          setOrder(orderData);
          console.log('Order updated:', orderData.status);
          console.log('Created at:', orderData.createdAt);
        } else {
          console.log('Order not found:', orderId);
          setOrder(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching order:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up listener for order:', orderId);
      unsubscribe();
    };
  }, [orderId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-6 h-6 text-orange-500" />;
      case 'preparing': return <CookingPot className="w-6 h-6 text-blue-500" />;
      case 'ready': return <Package className="w-6 h-6 text-green-500" />;
      case 'picked_up': return <Truck className="w-6 h-6 text-purple-500" />;
      case 'delivered': return <Home className="w-6 h-6 text-green-600" />;
      default: return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Order Placed',
      'preparing': 'Preparing Your Meal',
      'ready': 'Ready for Pickup',
      'picked_up': 'On the Way',
      'delivered': 'Delivered',
      'pending_payment': 'Awaiting Payment',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find your order.</p>
          <Link href="/menu" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const timelineEvents = [
    { 
      key: 'pending', 
      label: 'Order Placed', 
      time: order.createdAt,
      description: 'Your order has been received',
      icon: Clock
    },
    { 
      key: 'preparing', 
      label: 'Preparing', 
      time: order.prepStartTime,
      description: order.status === 'preparing' && timeRemaining !== null && timeRemaining > 0 
        ? `Estimated ready in ${timeRemaining} minutes` 
        : 'Chefs are preparing your meal',
      icon: CookingPot
    },
    { 
      key: 'ready', 
      label: 'Ready for Pickup/Delivery', 
      time: order.readyAt,
      description: order.status === 'ready' ? 'Your order is ready and waiting' : null,
      icon: Package
    },
    { 
      key: 'picked_up', 
      label: 'On the Way', 
      time: order.pickedUpAt,
      description: order.status === 'picked_up' && driverEta !== null 
        ? `Driver arriving in approximately ${driverEta} minutes` 
        : 'Driver is on the way to you',
      icon: Truck
    },
    { 
      key: 'delivered', 
      label: 'Delivered', 
      time: order.deliveredAt,
      description: 'Your order has been delivered. Enjoy your meal!',
      icon: Home
    },
  ];

  const currentStatusIndex = timelineEvents.findIndex(e => e.key === order.status);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link href="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Track Your Order</h1>
                <p className="text-green-100 text-sm mt-1">Order #{orderId.slice(-8)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-100">Order Status</p>
                <p className="font-semibold">{getStatusText(order.status)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Driver ETA Banner */}
            {order.status === 'picked_up' && driverEta !== null && (
              <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Timer className="w-8 h-8 text-purple-600 animate-pulse" />
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Driver ETA</p>
                      <p className="text-2xl font-bold text-purple-700">{driverEta} minutes</p>
                    </div>
                  </div>
                  {distanceRemaining && (
                    <div className="text-right">
                      <p className="text-xs text-purple-600">Distance remaining</p>
                      <p className="text-sm font-semibold text-purple-700">{distanceRemaining.toFixed(1)} km</p>
                    </div>
                  )}
                </div>
                <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-600 rounded-full h-2 transition-all duration-500" style={{ width: '65%' }}></div>
                </div>
              </div>
            )}

            {/* Preparation Countdown */}
            {order.status === 'preparing' && timeRemaining !== null && timeRemaining > 0 && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Timer className="w-8 h-8 text-blue-600 animate-pulse" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Preparation Time</p>
                      <p className="text-2xl font-bold text-blue-700">{timeRemaining} minutes remaining</p>
                    </div>
                  </div>
                </div>
                <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 rounded-full h-2 transition-all duration-500" style={{ width: '60%' }}></div>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Estimated ready time: {formatTime(order.estimatedReadyTime)}
                </p>
              </div>
            )}

            {/* Timeline */}
            <div className="relative mb-8">
              {timelineEvents.map((event, index) => {
                const isCompleted = index <= currentStatusIndex;
                const Icon = event.icon;
                const isCurrent = index === currentStatusIndex;
                
                return (
                  <div key={event.key} className="relative flex items-start mb-8 last:mb-0">
                    <div className="relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {index < timelineEvents.length - 1 && (
                        <div className={`absolute top-10 left-5 w-0.5 h-24 ${
                          isCompleted ? 'bg-green-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                        {event.label}
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {formatDateTime(event.time)}
                      </div>
                      {event.description && isCurrent && (
                        <div className="mt-1 text-sm text-green-600 font-medium">
                          {event.description}
                        </div>
                      )}
                      {isCurrent && order.status === 'delivered' && (
                        <div className="mt-2 p-2 bg-green-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 inline mr-1" />
                          <span className="text-sm text-green-700">Enjoy your meal! Thank you for ordering.</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Order Details */}
            <div className="border-t pt-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Type</p>
                  <p className="font-medium">{order.orderType === 'delivery' ? '🚚 Delivery' : '📦 Pickup'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Total</p>
                  <p className="font-bold text-green-600">R{order.total?.toFixed(2)}</p>
                </div>
              </div>
              
              {order.orderType === 'delivery' && order.deliveryAddress && (
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    {order.deliveryAddress}
                  </p>
                </div>
              )}
              
              {order.driverName && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-500">Driver Information</p>
                  <p className="text-sm font-medium text-gray-900">{order.driverName}</p>
                  {order.driverPhone && (
                    <p className="text-sm text-gray-600">📞 {order.driverPhone}</p>
                  )}
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Items Ordered</p>
                <div className="space-y-1">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.quantity}x {item.name}</span>
                      <span className="text-gray-900 font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Link href="/menu" className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition text-center font-semibold">
            Continue Shopping
          </Link>
          <Link href="/orders" className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition text-center font-semibold">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
