"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Truck, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface DeliveryOrder {
  id: string;
  customerName: string;
  address: string;
  distance: number;
  status: 'pending' | 'accepted' | 'picked_up' | 'delivered';
  estimatedTime: string;
  deliveryFee: number;
}

export default function DriverPage() {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);

  useEffect(() => {
    // Simulate loading orders
    setTimeout(() => {
      const mockOrders: DeliveryOrder[] = [
        {
          id: 'ORD-001',
          customerName: 'John Doe',
          address: 'Cape Town City Centre, Cape Town',
          distance: 8.5,
          status: 'pending',
          estimatedTime: '30-45 min',
          deliveryFee: 45
        },
        {
          id: 'ORD-002',
          customerName: 'Jane Smith',
          address: 'Claremont, Cape Town',
          distance: 12.3,
          status: 'pending',
          estimatedTime: '35-50 min',
          deliveryFee: 55
        }
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'accepted':
        return <CheckCircle size={16} className="text-blue-500" />;
      case 'picked_up':
        return <Truck size={16} className="text-purple-500" />;
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'picked_up':
        return 'Picked Up';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  const handleAcceptOrder = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    // In production, this would call an API to accept the order
    alert(`Order ${order.id} accepted!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-8">
          <Truck size={32} className="text-[#2F5D50]" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
            <p className="text-gray-500">Manage your deliveries</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F5D50] mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading orders...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Available Orders */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Deliveries</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.customerName}</h3>
                        <p className="text-sm text-gray-500">Order #{order.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm text-gray-600">{getStatusText(order.status)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{order.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck size={14} className="text-gray-400" />
                        <span>{order.distance} km from restaurant</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={14} className="text-gray-400" />
                        <span>Est. delivery: {order.estimatedTime}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-lg font-bold text-[#2F5D50]">R {order.deliveryFee.toFixed(2)}</span>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleAcceptOrder(order)}
                          className="px-4 py-2 bg-[#2F5D50] text-white rounded-lg hover:bg-[#23483E] transition-colors"
                        >
                          Accept Delivery
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Current Delivery */}
            {selectedOrder && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sticky top-24">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Delivery</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium">{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Customer</p>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm">{selectedOrder.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Delivery Fee</p>
                      <p className="text-lg font-bold text-[#2F5D50]">R {selectedOrder.deliveryFee.toFixed(2)}</p>
                    </div>
                    <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Navigate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-[#2F5D50] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
