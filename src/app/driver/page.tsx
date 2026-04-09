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
  FaWallet
} from "react-icons/fa";

interface Delivery {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  restaurant: string;
  pickupTime: string;
  deliveryTime: string;
  status: 'pending' | 'picked_up' | 'delivered' | 'cancelled';
  distance: number;
  earnings: number;
}

export default function DriverDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'active' | 'history'>('available');
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
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
    loadDeliveries();
  }, [user, router]);

  const loadDeliveries = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockDeliveries: Delivery[] = [
        {
          id: '1',
          orderNumber: 'ORD-001',
          customerName: 'John Doe',
          customerAddress: '123 Main St, Cape Town',
          customerPhone: '+27 71 234 5678',
          restaurant: 'Garden & Grains',
          pickupTime: '12:30 PM',
          deliveryTime: '1:00 PM',
          status: 'pending',
          distance: 3.5,
          earnings: 45
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          customerName: 'Jane Smith',
          customerAddress: '456 Oak Ave, Cape Town',
          customerPhone: '+27 72 345 6789',
          restaurant: 'Garden & Grains',
          pickupTime: '1:15 PM',
          deliveryTime: '1:45 PM',
          status: 'pending',
          distance: 4.2,
          earnings: 50
        }
      ];
      setDeliveries(mockDeliveries);
      setStats({
        todayEarnings: 245,
        totalDeliveries: 8,
        rating: 4.8,
        onlineTime: '3.5h'
      });
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptDelivery = async (deliveryId: string) => {
    // Update delivery status in backend
    setDeliveries(prev => 
      prev.map(d => d.id === deliveryId ? { ...d, status: 'picked_up' } : d)
    );
  };

  const completeDelivery = async (deliveryId: string) => {
    setDeliveries(prev => 
      prev.map(d => d.id === deliveryId ? { ...d, status: 'delivered' } : d)
    );
    setStats(prev => ({
      ...prev,
      todayEarnings: prev.todayEarnings + (deliveries.find(d => d.id === deliveryId)?.earnings || 0),
      totalDeliveries: prev.totalDeliveries + 1
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'picked_up': return 'bg-blue-100 text-blue-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ready for Pickup';
      case 'picked_up': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const availableDeliveries = deliveries.filter(d => d.status === 'pending');
  const activeDeliveries = deliveries.filter(d => d.status === 'picked_up');
  const completedDeliveries = deliveries.filter(d => d.status === 'delivered');

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
              onClick={() => setIsAvailable(!isAvailable)}
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
            { key: 'available', label: `Available (${availableDeliveries.length})`, icon: FaTruck },
            { key: 'active', label: `Active (${activeDeliveries.length})`, icon: FaClock },
            { key: 'history', label: 'History', icon: FaCheckCircle }
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
            {activeTab === 'available' && availableDeliveries.length === 0 && (
              <div className="bg-white rounded-xl shadow p-12 text-center">
                <FaTruck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No available deliveries at the moment</p>
              </div>
            )}
            
            {activeTab === 'available' && availableDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-gray-600">{delivery.orderNumber}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(delivery.status)}`}>
                        {getStatusText(delivery.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-green-600 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Pickup: {delivery.restaurant}</p>
                          <p className="text-sm text-gray-500">Ready at {delivery.pickupTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <FaMapMarkerAlt className="text-red-600 mt-1" />
                        <div>
                          <p className="font-medium text-gray-900">Dropoff: {delivery.customerName}</p>
                          <p className="text-sm text-gray-500">{delivery.customerAddress}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>📏 {delivery.distance} km</span>
                        <span>💰 R{delivery.earnings}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <a href={`tel:${delivery.customerPhone}`} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                      <FaPhone /> Call
                    </a>
                    <button
                      onClick={() => acceptDelivery(delivery.id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Accept Delivery
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'active' && activeDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-gray-600">{delivery.orderNumber}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(delivery.status)}`}>
                        {getStatusText(delivery.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <strong>Customer:</strong> {delivery.customerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Address:</strong> {delivery.customerAddress}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <a href={`tel:${delivery.customerPhone}`} className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                      <FaPhone /> Call Customer
                    </a>
                    <button
                      onClick={() => completeDelivery(delivery.id)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Complete Delivery
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {activeTab === 'history' && completedDeliveries.map((delivery) => (
              <div key={delivery.id} className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-mono text-sm text-gray-600">{delivery.orderNumber}</p>
                    <p className="text-sm text-gray-500">{delivery.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">R{delivery.earnings}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
