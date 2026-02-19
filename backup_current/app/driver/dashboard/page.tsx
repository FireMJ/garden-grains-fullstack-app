import FixedHeader from '@/components/FixedHeader';
<FixedHeader />
<FixedHeader />

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Package, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  Navigation, 
  Battery,
  Wifi,
  Bell,
  LogOut
} from 'lucide-react';

// Mock driver data
const DRIVER_PROFILE = {
  name: 'John Driver',
  rating: 4.8,
  totalDeliveries: 342,
  earnings: 12560.50,
  online: true,
  vehicle: 'Toyota Corolla',
  vehiclePlate: 'CA 123-456',
  currentLocation: 'Observatory, Cape Town'
};

// Mock nearby orders
const NEARBY_ORDERS = [
  {
    id: 'ORD-789012',
    restaurant: 'Garden Grains - Observatory',
    distance: 1.2, // km
    pickupAddress: '123 Main St, Observatory, Cape Town',
    deliveryAddress: '45 University Rd, Rondebosch, Cape Town',
    deliveryDistance: 3.5, // km
    estimatedEarnings: 45.00,
    items: ['Beef Glow Bowl', 'Sweet Potato Fries', 'Orange Juice'],
    readyTime: '5-10 minutes',
    priority: 'high' // high/medium/low
  },
  {
    id: 'ORD-789013',
    restaurant: 'Garden Grains - City Bowl',
    distance: 2.8,
    pickupAddress: '45 Kloof St, Gardens, Cape Town',
    deliveryAddress: '22 Bree St, CBD, Cape Town',
    deliveryDistance: 1.2,
    estimatedEarnings: 32.50,
    items: ['Chicken Power Bowl', 'Green Smoothie'],
    readyTime: '15 minutes',
    priority: 'medium'
  },
  {
    id: 'ORD-789014',
    restaurant: 'Garden Grains - Sea Point',
    distance: 4.5,
    pickupAddress: '78 Main Rd, Sea Point, Cape Town',
    deliveryAddress: '12 Beach Rd, Mouille Point, Cape Town',
    deliveryDistance: 1.8,
    estimatedEarnings: 38.75,
    items: ['Veggie Delight Bowl', 'Fries', 'Apple Juice'],
    readyTime: '10 minutes',
    priority: 'low'
  }
];

// Active order mock
const ACTIVE_ORDER = {
  id: 'ORD-789011',
  status: 'pickup', // pickup, enroute, delivered
  restaurant: 'Garden Grains - Observatory',
  customer: 'Sarah Johnson',
  customerPhone: '+27 123 456 789',
  pickupAddress: '123 Main St, Observatory, Cape Town',
  deliveryAddress: '78 University Ave, Rondebosch, Cape Town',
  items: [
    { name: 'Beef Glow Bowl', quantity: 1 },
    { name: 'Sweet Potato Fries', quantity: 1 },
    { name: 'Fresh Orange Juice', quantity: 1 }
  ],
  totalAmount: 189.99,
  deliveryFee: 45.00,
  specialInstructions: 'Please call upon arrival',
  pickupCode: 'A7B9',
  estimatedPickup: '11:30 AM',
  estimatedDelivery: '11:45 AM'
};

export default function DriverDashboard() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [activeOrder, setActiveOrder] = useState(ACTIVE_ORDER);
  const [nearbyOrders, setNearbyOrders] = useState(NEARBY_ORDERS);
  const [driverProfile, setDriverProfile] = useState(DRIVER_PROFILE);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Simulate real-time updates
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      // Refresh nearby orders periodically
      setNearbyOrders(prev => [...prev]);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isOnline]);

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      // Driver went online - refresh orders
      setNearbyOrders(NEARBY_ORDERS);
    }
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setShowAcceptModal(true);
  };

  const handleAcceptOrder = () => {
    if (!selectedOrder) return;
    
    // Set as active order
    setActiveOrder({
      ...selectedOrder,
      status: 'pickup',
      pickupCode: Math.random().toString(36).substr(2, 4).toUpperCase(),
      estimatedPickup: new Date(Date.now() + 15*60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDelivery: new Date(Date.now() + 30*60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    // Remove from nearby orders
    setNearbyOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
    setShowAcceptModal(false);
    setSelectedOrder(null);
  };

  const handleRejectOrder = () => {
    if (!selectedOrder) return;
    
    // Remove from nearby orders
    setNearbyOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
    setShowAcceptModal(false);
    setSelectedOrder(null);
  };

  const handlePickupConfirm = () => {
    setActiveOrder(prev => ({ ...prev, status: 'enroute' }));
  };

  const handleDeliveryConfirm = () => {
    setActiveOrder(null);
    // Add to earnings
    setDriverProfile(prev => ({
      ...prev,
      totalDeliveries: prev.totalDeliveries + 1,
      earnings: prev.earnings + (activeOrder?.deliveryFee || 0)
    }));
  };

  const handleLogout = () => {
    router.push('/driver/login');
  };

  if (!isOnline) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-8">
              <Navigation className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
            <p className="text-gray-300 mb-8">
              Go online to start receiving delivery requests and earning money.
            </p>
            <button
              onClick={handleToggleOnline}
              className="w-full py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg"
            >
              Go Online
            </button>
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Total Deliveries</p>
                  <p className="text-xl font-bold">{driverProfile.totalDeliveries}</p>
                </div>
                <div>
                  <p className="text-gray-400">Total Earnings</p>
                  <p className="text-xl font-bold">R{driverProfile.earnings.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Navigation className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Driver Portal</h1>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-600">{driverProfile.currentLocation}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-medium text-gray-900">{driverProfile.name}</p>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600 ml-1">{driverProfile.rating}</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              </div>
              
              <button
                onClick={handleToggleOnline}
                className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Go Offline
              </button>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Active Order */}
          <div className="lg:col-span-2 space-y-6">
            {activeOrder ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Active Delivery</h2>
                    <p className="text-gray-600">Order {activeOrder.id}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeOrder.status === 'pickup' ? 'bg-yellow-100 text-yellow-800' :
                    activeOrder.status === 'enroute' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {activeOrder.status === 'pickup' ? 'Ready for Pickup' :
                     activeOrder.status === 'enroute' ? 'On the Way' : 'Delivered'}
                  </div>
                </div>

                {/* Order Progress */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Pickup at {activeOrder.restaurant}</p>
                        <p className="text-sm text-gray-600">{activeOrder.pickupAddress}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Pickup Code</p>
                      <p className="text-2xl font-bold text-blue-600">{activeOrder.pickupCode}</p>
                    </div>
                  </div>

                  <div className="my-4 flex items-center justify-center">
                    <div className="w-full h-1 bg-gray-200 relative">
                      <div className={`absolute top-0 left-0 h-full ${
                        activeOrder.status === 'pickup' ? 'w-1/2' : 'w-full'
                      } bg-blue-500`}></div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Deliver to {activeOrder.customer}</p>
                      <p className="text-sm text-gray-600">{activeOrder.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Order Details</h3>
                  <div className="space-y-2">
                    {activeOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity} × {item.name}</span>
                        <span className="text-gray-600">R{(item.quantity * 129.99).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3">
                    <div className="flex justify-between font-bold">
                      <span>Delivery Fee:</span>
                      <span className="text-green-600">R{activeOrder.deliveryFee.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {activeOrder.status === 'pickup' ? (
                    <button
                      onClick={handlePickupConfirm}
                      className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Confirm Pickup
                    </button>
                  ) : (
                    <button
                      onClick={handleDeliveryConfirm}
                      className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Confirm Delivery
                    </button>
                  )}
                  
                  <button className="w-full py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                    Contact Customer
                  </button>
                  
                  {activeOrder.specialInstructions && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Special Instructions:</span> {activeOrder.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Delivery</h2>
                <p className="text-gray-600 mb-6">
                  You're online and ready to accept delivery requests. Nearby orders will appear below.
                </p>
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Ready for orders</span>
                </div>
              </div>
            )}

            {/* Nearby Orders */}
            {nearbyOrders.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Nearby Orders</h2>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                    {nearbyOrders.length} available
                  </span>
                </div>

                <div className="space-y-4">
                  {nearbyOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center mb-1">
                            <span className="font-bold text-gray-900">{order.id}</span>
                            {order.priority === 'high' && (
                              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Priority</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{order.restaurant}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">R{order.estimatedEarnings.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">Earnings</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Pickup Distance</p>
                          <p className="font-medium">{order.distance} km</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Delivery Distance</p>
                          <p className="font-medium">{order.deliveryDistance} km</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Ready In</p>
                          <p className="font-medium">{order.readyTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Items</p>
                          <p className="font-medium">{order.items.length}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleViewOrder(order)}
                        className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Deliveries Completed</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-500" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Today's Earnings</p>
                    <p className="text-2xl font-bold">R360.50</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Online Time</p>
                    <p className="text-2xl font-bold">4h 22m</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-500" />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Acceptance Rate</p>
                    <p className="text-2xl font-bold">94%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <button
                  onClick={() => router.push('/driver/earnings')}
                  className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  View Earnings Details
                </button>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicle Info</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Vehicle</span>
                  <span className="font-medium">{driverProfile.vehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">License Plate</span>
                  <span className="font-medium">{driverProfile.vehiclePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-green-600">Verified ✓</span>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-blue-600 mr-2" />
                  <p className="text-sm text-blue-700">
                    Keep your vehicle documents updated for seamless deliveries.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/driver/orders')}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Order History
                </button>
                <button
                  onClick={() => router.push('/driver/profile')}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Driver Profile
                </button>
                <button className="w-full py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Set Destination
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accept Order Modal */}
      {showAcceptModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setShowAcceptModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-blue-800">Order {selectedOrder.id}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Priority</span>
                  </div>
                  <p className="text-blue-700">{selectedOrder.restaurant}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Pickup Distance</p>
                    <p className="font-bold text-lg">{selectedOrder.distance} km</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Delivery Distance</p>
                    <p className="font-bold text-lg">{selectedOrder.deliveryDistance} km</p>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Ready in:</span> {selectedOrder.readyTime}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                  <ul className="space-y-1">
                    {selectedOrder.items.map((item: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Estimated Earnings</p>
                      <p className="text-2xl font-bold text-green-600">R{selectedOrder.estimatedEarnings.toFixed(2)}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAcceptOrder}
                  className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors"
                >
                  Accept Order
                </button>
                <button
                  onClick={handleRejectOrder}
                  className="w-full py-4 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Reject Order
                </button>
                <button
                  onClick={() => setShowAcceptModal(false)}
                  className="w-full py-3 text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
