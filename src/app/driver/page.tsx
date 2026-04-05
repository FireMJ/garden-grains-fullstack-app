"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useDriver } from "@/context/DriverContext";
import { 
  FaMotorcycle, 
  FaCar, 
  FaBicycle, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaStar,
  FaDollarSign,
  FaClipboardList,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaUserCheck,
  FaSignOutAlt,
  FaMap,
  FaLocationArrow
} from "react-icons/fa";

export default function DriverPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { 
    driverProfile, 
    availableOrders, 
    activeOrders, 
    completedOrders,
    acceptOrder,
    updateOrderStatus,
    updateLocation,
    setDriverStatus,
    getEarningsSummary,
    loading 
  } = useDriver();

  const [isTracking, setIsTracking] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(!driverProfile);

  // Track location
  useEffect(() => {
    if (!isTracking || !driverProfile) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        updateLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      { enableHighAccuracy: true, interval: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isTracking, driverProfile]);

  const earnings = getEarningsSummary();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading driver portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  // Onboarding - Driver Sign Up
  if (showOnboarding) {
    return <DriverOnboarding onComplete={() => setShowOnboarding(false)} />;
  }

  if (!driverProfile) {
    return <DriverOnboarding onComplete={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1e4259] to-[#2c536b] text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaTruck className="text-2xl" />
              <div>
                <h1 className="text-xl font-bold">Driver Portal</h1>
                <p className="text-sm text-white/80">{driverProfile?.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsTracking(!isTracking)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  isTracking 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-600 hover:bg-gray-700'
                }`}
              >
                {isTracking ? '📍 Live' : 'Start Tracking'}
              </button>
              <button
                onClick={() => setDriverStatus(driverProfile.status === 'available' ? 'offline' : 'available')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  driverProfile.status === 'available' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {driverProfile.status === 'available' ? 'Available' : 'Offline'}
              </button>
              <button
                onClick={logout}
                className="px-3 py-1 bg-red-600 rounded-lg text-sm font-medium hover:bg-red-700 transition"
              >
                <FaSignOutAlt className="inline mr-1" /> Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Today's Earnings</p>
                <p className="text-2xl font-bold text-green-600">R{earnings.today.toFixed(2)}</p>
              </div>
              <FaDollarSign className="text-3xl text-green-200" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">This Week</p>
                <p className="text-2xl font-bold text-[#1e4259]">R{earnings.week.toFixed(2)}</p>
              </div>
              <FaClipboardList className="text-3xl text-[#1e4259]/20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Deliveries</p>
                <p className="text-2xl font-bold text-[#1e4259]">{driverProfile.totalDeliveries}</p>
              </div>
              <FaCheckCircle className="text-3xl text-green-200" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Rating</p>
                <p className="text-2xl font-bold text-yellow-500">{driverProfile.rating.toFixed(1)}</p>
              </div>
              <FaStar className="text-3xl text-yellow-200" />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Available Orders */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaClock className="text-green-600" />
              Available Orders ({availableOrders.length})
            </h2>
            <div className="space-y-4">
              {availableOrders.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <FaTruck className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No available orders at the moment</p>
                </div>
              ) : (
                availableOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">Order #{order.orderNumber}</h3>
                        <p className="text-sm text-gray-500">{order.items.length} items</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">R{order.deliveryFee}</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        {order.customerAddress}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaClock className="text-gray-400" />
                        {order.estimatedTime} min estimated
                      </p>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => acceptOrder(order.id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm"
                      >
                        Accept Order
                      </button>
                    </div>
                    
                    {selectedOrder === order.id && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                        <p><strong>Customer:</strong> {order.customerName}</p>
                        <p><strong>Phone:</strong> {order.customerPhone}</p>
                        <p><strong>Instructions:</strong> {order.deliveryInstructions || 'None'}</p>
                        <div className="mt-2">
                          <strong>Items:</strong>
                          <ul className="list-disc list-inside mt-1">
                            {order.items.map((item, i) => (
                              <li key={i}>{item.name} x{item.quantity} - R{item.price}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Orders */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaTruck className="text-blue-600" />
              Active Deliveries ({activeOrders.length})
            </h2>
            <div className="space-y-4">
              {activeOrders.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <FaUserCheck className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No active deliveries</p>
                </div>
              ) : (
                activeOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl shadow p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900">Order #{order.orderNumber}</h3>
                        <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 mt-1">
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-green-600">R{order.deliveryFee}</span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        {order.customerAddress}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaPhone className="text-gray-400" />
                        {order.customerPhone}
                      </p>
                    </div>
                    
                    {/* Order Status Actions */}
                    <div className="mt-3 flex gap-2">
                      {order.status === 'accepted' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'picked_up')}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                          Mark as Picked Up
                        </button>
                      )}
                      {order.status === 'picked_up' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'in_transit')}
                          className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-sm"
                        >
                          Start Delivery
                        </button>
                      )}
                      {order.status === 'in_transit' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm"
                        >
                          Complete Delivery
                        </button>
                      )}
                      <button
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        className="px-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Completed Orders History */}
        {completedOrders.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-green-600" />
              Completed Deliveries ({completedOrders.length})
            </h2>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order #</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {completedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">#{order.orderNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.customerName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">R{order.deliveryFee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Live Location Map */}
        {isTracking && driverProfile.currentLocation && (
          <div className="mt-8 bg-white rounded-xl shadow p-4">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FaLocationArrow className="text-green-600" />
              Live Location Tracking
            </h3>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">
                📍 Latitude: {driverProfile.currentLocation.lat.toFixed(6)}<br />
                📍 Longitude: {driverProfile.currentLocation.lng.toFixed(6)}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Location updates every 5 seconds when tracking is enabled
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Driver Onboarding Component
function DriverOnboarding({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    vehicleType: 'car',
    licensePlate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/driver/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, uid: user?.uid })
      });

      if (response.ok) {
        onComplete();
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <FaTruck className="text-5xl text-green-600 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-900">Become a Driver</h1>
            <p className="text-gray-600">Register to start delivering with Garden & Grains</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as any })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="car">🚗 Car</option>
                <option value="motorcycle">🏍️ Motorcycle</option>
                <option value="bicycle">🚲 Bicycle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
              <input
                type="text"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., CA 123-456"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register as Driver'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
