"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope } from "react-icons/fa";

interface OrderDetails {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: any[];
  deliveryAddress?: string;
  orderType: string;
  paymentMethod: string;
  specialInstructions?: string;
}

export default function OrderDetailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadOrderDetails();
  }, [user, router, params.id]);

  const loadOrderDetails = async () => {
    setIsLoading(true);
    try {
      // Load from localStorage (will connect to Firebase later)
      const orders = JSON.parse(localStorage.getItem(`orders_${user?.uid}`) || '[]');
      const foundOrder = orders.find((o: any) => o.id === params.id);
      setOrder(foundOrder || null);
    } catch (error) {
      console.error('Error loading order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6">
          <FaArrowLeft /> Back to Orders
        </Link>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : !order ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <p className="text-gray-600">Order not found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-xl shadow p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Details</h1>
              <p className="text-gray-600">Order #{order.orderNumber}</p>
              <p className="text-sm text-gray-500">{new Date(order.date).toLocaleString()}</p>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b last:border-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-lg object-cover" />
                      ) : (
                        <span className="text-2xl">🍽️</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-600">R{item.price.toFixed(2)} each</p>
                    </div>
                    <p className="font-semibold text-gray-900">R{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>R{order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Delivery/Pickup Info */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {order.orderType === 'delivery' ? 'Delivery Information' : 'Pickup Information'}
              </h2>
              {order.orderType === 'delivery' ? (
                <div className="flex gap-3">
                  <FaMapMarkerAlt className="text-green-600 mt-1" />
                  <div>
                    <p className="text-gray-900 font-medium">Delivery Address</p>
                    <p className="text-gray-600">{order.deliveryAddress}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <FaClock className="text-green-600 mt-1" />
                  <div>
                    <p className="text-gray-900 font-medium">Pickup Location</p>
                    <p className="text-gray-600">Uitsig Wine Farm, Spaanschemat River Rd, Cape Town</p>
                  </div>
                </div>
              )}
            </div>

            {/* Need Help? */}
            <div className="bg-gray-100 rounded-xl p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help With Your Order?</h3>
              <p className="text-sm text-gray-600 mb-3">Contact our support team</p>
              <div className="flex justify-center gap-4">
                <a href="tel:+27693765574" className="flex items-center gap-2 text-green-600 hover:underline">
                  <FaPhone /> Call Us
                </a>
                <a href="mailto:hello@gardengrains.co.za" className="flex items-center gap-2 text-green-600 hover:underline">
                  <FaEnvelope /> Email
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
