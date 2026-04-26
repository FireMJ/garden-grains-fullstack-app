"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MapPin, Truck, Clock, CheckCircle, Package, Phone, MessageCircle } from 'lucide-react';

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/track?orderId=${orderId}`);
        const data = await response.json();
        if (data.success) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Simulate real-time tracking updates every 10 seconds
    const interval = setInterval(() => {
      // In production, this would fetch actual driver location
      setDriverLocation({ lat: -34.0425 + Math.random() * 0.01, lng: 18.4412 + Math.random() * 0.01 });
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-500" size={24} />;
      case 'preparing': return <Package className="text-blue-500" size={24} />;
      case 'ready': return <CheckCircle className="text-green-500" size={24} />;
      case 'out_for_delivery': return <Truck className="text-purple-500" size={24} />;
      case 'delivered': return <CheckCircle className="text-green-600" size={24} />;
      default: return <Clock className="text-gray-500" size={24} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Order Received';
      case 'preparing': return 'Preparing Your Order';
      case 'ready': return 'Ready for Pickup/Delivery';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const statuses = ['pending', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
  const currentStep = order ? statuses.indexOf(order.status) : -1;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F5D50]"></div></div>;
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Order not found</p></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
            <p className="text-gray-500 mt-1">Order #{order.id}</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0">
                <div className="h-full bg-[#2F5D50] transition-all duration-500" style={{ width: `${(currentStep / (statuses.length - 1)) * 100}%` }}></div>
              </div>
              {statuses.map((status, idx) => (
                <div key={status} className="relative z-10 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idx <= currentStep ? 'bg-[#2F5D50] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {getStatusIcon(status)}
                  </div>
                  <span className="text-xs mt-2 text-center">{getStatusText(status)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-sm py-1">
                <span>{item.quantity}x {item.name}</span>
                <span>R {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>R {order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Driver Info */}
          {order.driverId && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Truck className="text-blue-600" />
                <h3 className="font-semibold text-gray-900">Driver Information</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Driver:</span> {order.driverName || 'Assigned Driver'}</p>
                <p><span className="text-gray-500">Vehicle:</span> {order.driverVehicle || 'Car'}</p>
                <p><span className="text-gray-500">Contact:</span> <a href={`tel:${order.driverPhone}`} className="text-blue-600 hover:underline">{order.driverPhone || 'Loading...'}</a></p>
              </div>
            </div>
          )}

          {/* Contact Buttons */}
          <div className="flex gap-4">
            <a href={`tel:${order.restaurantPhone || '+27693765574'}`} className="flex-1 flex items-center justify-center gap-2 bg-[#2F5D50] text-white py-3 rounded-xl hover:bg-[#23483E] transition-colors">
              <Phone size={18} /> Call Restaurant
            </a>
            <a href={`https://wa.me/${order.restaurantWhatsApp || '27693765574'}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl hover:bg-[#1da851] transition-colors">
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
