"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  FaArrowLeft, 
  FaBox, 
  FaClock, 
  FaCheckCircle, 
  FaTruck, 
  FaUtensils,
  FaStar,
  FaReceipt
} from "react-icons/fa";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  deliveryAddress?: string;
  orderType: 'delivery' | 'pickup';
  estimatedDelivery?: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadOrders();
  }, [user, router]);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // Load orders from localStorage (will connect to Firebase later)
      const savedOrders = localStorage.getItem(`orders_${user?.uid}`);
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        // Mock orders for demonstration
        const mockOrders: Order[] = [
          {
            id: '1',
            orderNumber: 'ORD-20241215-001',
            date: '2024-12-15T14:30:00',
            status: 'delivered',
            total: 245.00,
            orderType: 'delivery',
            deliveryAddress: '123 Main St, Cape Town',
            items: [
              { id: '1', name: 'Buddha Bowl', price: 85, quantity: 2, image: '/images/menu/buddha-bowl.jpg' },
              { id: '2', name: 'Green Smoothie', price: 75, quantity: 1, image: '/images/menu/green-smoothie.jpg' }
            ],
            estimatedDelivery: '2024-12-15T15:00:00'
          },
          {
            id: '2',
            orderNumber: 'ORD-20241210-002',
            date: '2024-12-10T12:15:00',
            status: 'delivered',
            total: 180.00,
            orderType: 'pickup',
            items: [
              { id: '3', name: 'Protein Bowl', price: 95, quantity: 1, image: '/images/menu/protein-bowl.jpg' },
              { id: '4', name: 'Fresh Juice', price: 85, quantity: 1, image: '/images/menu/fresh-juice.jpg' }
            ]
          },
          {
            id: '3',
            orderNumber: 'ORD-20241218-003',
            date: '2024-12-18T18:45:00',
            status: 'preparing',
            total: 320.00,
            orderType: 'delivery',
            deliveryAddress: '456 Oak Ave, Cape Town',
            items: [
              { id: '5', name: 'Family Feast', price: 250, quantity: 1, image: '/images/menu/family-feast.jpg' },
              { id: '6', name: 'Smoothie Pack', price: 70, quantity: 1, image: '/images/menu/smoothie-pack.jpg' }
            ],
            estimatedDelivery: '2024-12-18T19:45:00'
          }
        ];
        setOrders(mockOrders);
        localStorage.setItem(`orders_${user?.uid}`, JSON.stringify(mockOrders));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: Order['status']) => {
    const configs = {
      pending: { label: 'Pending', color: 'bg-yellow-500', icon: FaClock },
      confirmed: { label: 'Confirmed', color: 'bg-blue-500', icon: FaCheckCircle },
      preparing: { label: 'Preparing', color: 'bg-purple-500', icon: FaUtensils },
      'out-for-delivery': { label: 'Out for Delivery', color: 'bg-orange-500', icon: FaTruck },
      delivered: { label: 'Delivered', color: 'bg-green-500', icon: FaCheckCircle },
      cancelled: { label: 'Cancelled', color: 'bg-red-500', icon: FaBox }
    };
    return configs[status];
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    if (filter === 'active') {
      return orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
    }
    return orders.filter(o => o.status === 'delivered');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <Link href="/profile" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition">
            <FaArrowLeft /> Back to Profile
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <div className="w-20"></div> {/* Spacer for balance */}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg p-1 shadow">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'active', label: 'Active' },
            { key: 'completed', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`flex-1 py-2 px-4 rounded-lg transition font-medium ${
                filter === tab.key
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <FaBox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'active' 
                ? "You don't have any active orders" 
                : "You haven't placed any orders yet"}
            </p>
            <Link
              href="/menu"
              className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusConfig(order.status).icon;
              return (
                <div key={order.id} className="bg-white rounded-xl shadow hover:shadow-lg transition p-6">
                  {/* Order Header */}
                  <div className="flex justify-between items-start mb-4 pb-3 border-b">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FaReceipt className="text-gray-400" />
                        <span className="font-mono text-sm text-gray-600">{order.orderNumber}</span>
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm ${getStatusConfig(order.status).color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {getStatusConfig(order.status).label}
                      </div>
                      <p className="text-lg font-bold text-gray-900 mt-2">
                        R{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} width={48} height={48} className="rounded-lg object-cover" />
                          ) : (
                            <FaUtensils className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-gray-900">
                          R{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div>
                      <p className="text-sm text-gray-600">
                        {order.orderType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
                      </p>
                      {order.deliveryAddress && (
                        <p className="text-xs text-gray-500 mt-1">{order.deliveryAddress}</p>
                      )}
                      {order.estimatedDelivery && order.status !== 'delivered' && (
                        <p className="text-xs text-green-600 mt-1">
                          Est. {new Date(order.estimatedDelivery).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'delivered' && (
                        <button className="flex items-center gap-1 px-3 py-1 text-sm bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition">
                          <FaStar /> Rate Order
                        </button>
                      )}
                      <Link
                        href={`/orders/${order.id}`}
                        className="px-4 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                      >
                        View Details
                      </Link>
                      {order.status === 'preparing' && (
                        <button className="px-4 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
