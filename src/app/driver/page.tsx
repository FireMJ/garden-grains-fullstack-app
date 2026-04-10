"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  FaTruck, 
  FaMapMarkerAlt, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaWallet,
  FaBell
} from "react-icons/fa";
import { orderService, Order } from "@/services/orderService";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";

interface DeliveryOrder extends Order {
  distance?: number;
  pickupReady?: boolean;
}

export default function DriverDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'history'>('available');
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<DeliveryOrder[]>([]);
  const [completedOrders, setCompletedOrders] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    totalDeliveries: 0,
    rating: 4.8,
    onlineTime: '0h'
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Load driver profile and stats
    loadDriverProfile();
    
    // Listen to available deliveries (orders that are ready for pickup)
    const unsubscribeAvailable = orderService.listenToRestaurantOrders((orders) => {
      const readyForPickup = orders.filter(o => 
        o.status === 'ready' && 
        o.orderType === 'delivery' &&
        !o.driverId
      );
      setAvailableOrders(readyForPickup as DeliveryOrder[]);
    });
    
    // Listen to driver's active orders
    if (user.uid) {
      const unsubscribeActive = orderService.listenToDriverOrders(user.uid, (orders) => {
        const active = orders.filter(o => o.status === 'out-for-delivery');
        const completed = orders.filter(o => o.status === 'delivered');
        setActiveOrders(active as DeliveryOrder[]);
        setCompletedOrders(completed as DeliveryOrder[]);
        
        // Update stats
        const totalEarnings = completed.reduce((sum, order) => sum + order.deliveryFee, 0);
        setStats(prev => ({
          ...prev,
          todayEarnings: totalEarnings,
          totalDeliveries: completed.length
        }));
      });
      
      return () => {
        unsubscribeActive();
      };
    }
    
    return () => {
      unsubscribeAvailable();
    };
  }, [user, router]);

  const loadDriverProfile = async () => {
    if (!user?.uid) return;
    
    try {
      const driverRef = doc(db, 'drivers', user.uid);
      const driverSnap = await getDoc(driverRef);
      
      if (driverSnap.exists()) {
        const driverData = driverSnap.data();
        setIsAvailable(driverData.isAvailable || false);
        setStats(prev => ({
          ...prev,
          rating: driverData.rating || 4.8,
          totalDeliveries: driverData.totalDeliveries || 0,
          todayEarnings: driverData.todayEarnings || 0
        }));
      } else {
        // Create driver profile if doesn't exist
        await setDoc(driverRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          isAvailable: false,
          rating: 5.0,
          totalDeliveries: 0,
          todayEarnings: 0,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error loading driver profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAvailability = async () => {
    if (!user?.uid) return;
    
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    
    try {
      const driverRef = doc(db, 'drivers', user.uid);
      await updateDoc(driverRef, {
        isAvailable: newStatus,
        lastStatusChange: new Date(),
      });
    } catch (error) {
      console.error('Error updating availability:', error);
      setIsAvailable(!newStatus);
    }
  };

  const acceptDelivery = async (order: DeliveryOrder) => {
    if (!user?.uid || !order.id) return;
    
    try {
      // Assign driver to order
      await orderService.assignDriver(order.id, user.uid, user.displayName || 'Driver');
      
      // Update local state
      setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
      setActiveOrders(prev => [...prev, { ...order, status: 'out-for-delivery', driverId: user.uid }]);
      
      // Show notification
      alert(`You accepted order ${order.orderNumber}. Please proceed to pickup.`);
    } catch (error) {
      console.error('Error accepting delivery:', error);
      alert('Failed to accept delivery. Please try again.');
    }
  };

  const completeDelivery = async (order: DeliveryOrder) => {
    if (!order.id) return;
    
    try {
      await orderService.updateOrderStatus(order.id, 'delivered');
      
      // Update local state
      setActiveOrders(prev => prev.filter(o => o.id !== order.id));
      setCompletedOrders(prev => [...prev, { ...order, status: 'delivered' }]);
      
      // Update earnings
      setStats(prev => ({
        ...prev,
        todayEarnings: prev.todayEarnings + order.deliveryFee,
        totalDeliveries: prev.totalDeliveries + 1
      }));
      
      alert(`Delivery completed! You earned R${order.deliveryFee.toFixed(2)}`);
    } catch (error) {
      console.error('Error completing delivery:', error);
      alert('Failed to mark delivery as complete.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-700';
      case 'out-for-delivery': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Ready for Pickup';
      case 'out-for-delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return status;
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Driver Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FaTruck className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            
            <button
              onClick={toggleAvailability}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                isAvailable 
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isAvailable ? '● Online' : '○ Offline'}
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <FaWallet className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">R{stats.todayEarnings}</p>
              <p className="text-sm text-gray-500">Today's Earnings</p>
            </div>
            <div className="text-center">
              <FaTruck className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.totalDeliveries}</p>
              <p className="text-sm text-gray-500">Total Deliveries</p>
            </div>
            <div className="text-center">
              <FaStar className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.rating}</p>
              <p className="text-sm text-gray-500">Rating</p>
            </div>
            <div className="text-center">
              <FaClock className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-gray-900">{stats.onlineTime}</p>
              <p className="text-sm text-gray-500">Online Time</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow">
          {[
            { key: 'available', label: `Available (${availableOrders.length})`, icon: FaBell },
            { key: 'active', label: `Active (${activeOrders.length})`, icon: FaTruck },
            { key: 'history', label: `History (${completedOrders.length})`, icon: FaCheckCircle }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition font-medium ${
                activeTab === tab.key
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Available Deliveries */}
            {activeTab === 'available' && (
              <>
                {availableOrders.length === 0 ? (
                  <div className="bg-white rounded-xl shadow p-12 text-center">
                    <FaTruck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No available deliveries at the moment</p>
                    {!isAvailable && (
                      <p className="text-sm text-gray-500 mt-2">
                        Turn on your status to receive deliveries
                      </p>
                    )}
                  </div>
                ) : (
                  availableOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-sm text-gray-600">{order.orderNumber}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <FaMapMarkerAlt className="text-green-600 mt-1" />
                              <div>
                                <p className="font-medium text-gray-900">Pickup: Garden & Grains Restaurant</p>
                                <p className="text-sm text-gray-500">Uitsig Wine Farm, Cape Town</p>
                              </div>
                            </div>
                            
                            {order.deliveryAddress && (
                              <div className="flex items-start gap-2">
                                <FaMapMarkerAlt className="text-red-600 mt-1" />
                                <div>
                                  <p className="font-medium text-gray-900">Dropoff: {order.customerName}</p>
                                  <p className="text-sm text-gray-500">{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
                                  {order.deliveryAddress.distance && (
                                    <p className="text-xs text-gray-500">{order.deliveryAddress.distance.toFixed(1)} km away</p>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>💰 R{order.deliveryFee.toFixed(2)} delivery fee</span>
                              <span>📦 {order.items.length} items</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 min-w-[160px]">
                          <a href={`tel:${order.customerPhone}`} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                            <FaPhone /> Call Customer
                          </a>
                          <button
                            onClick={() => acceptDelivery(order)}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                          >
                            Accept Delivery
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* Active Deliveries */}
            {activeTab === 'active' && (
              <>
                {activeOrders.length === 0 ? (
                  <div className="bg-white rounded-xl shadow p-12 text-center">
                    <FaTruck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No active deliveries</p>
                  </div>
                ) : (
                  activeOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-sm text-gray-600">{order.orderNumber}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                              <strong>Customer:</strong> {order.customerName}
                            </p>
                            {order.deliveryAddress && (
                              <p className="text-sm text-gray-600">
                                <strong>Address:</strong> {order.deliveryAddress.street}, {order.deliveryAddress.city}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 min-w-[160px]">
                          <a href={`tel:${order.customerPhone}`} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                            <FaPhone /> Call Customer
                          </a>
                          <button
                            onClick={() => completeDelivery(order)}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                          >
                            Complete Delivery
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* History */}
            {activeTab === 'history' && (
              <>
                {completedOrders.length === 0 ? (
                  <div className="bg-white rounded-xl shadow p-12 text-center">
                    <FaCheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No completed deliveries yet</p>
                  </div>
                ) : (
                  completedOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl shadow p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-mono text-sm text-gray-600">{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">{order.customerName}</p>
                          <p className="text-xs text-gray-400">
                            {order.createdAt?.toDate().toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">R{order.deliveryFee.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Completed</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
