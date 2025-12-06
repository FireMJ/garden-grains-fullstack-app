"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Package, MapPin, Clock, CheckCircle } from 'lucide-react';

interface OrderStatus {
  status: 'preparing' | 'on-the-way' | 'delivered';
  time: string;
  description: string;
}

export default function TrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [orderStatus, setOrderStatus] = useState<OrderStatus[]>([
    { status: 'preparing', time: '10:30 AM', description: 'Order received and being prepared' },
    { status: 'preparing', time: '10:45 AM', description: 'Ingredients being assembled' },
    { status: 'on-the-way', time: '11:00 AM', description: 'Order picked up for delivery' },
  ]);
  
  const estimatedDelivery = '11:30 AM';
  const deliveryAddress = '123 Main St, Cape Town, 8001';
  const deliveryDriver = 'John D.';
  const driverContact = '+27 123 456 789';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
            <p className="text-gray-600">
              Tracking order: <span className="font-mono font-semibold text-blue-600">{orderId}</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Order Status */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Status</h2>
                
                <div className="space-y-6">
                  {orderStatus.map((status, index) => (
                    <div key={index} className="flex items-start">
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          status.status === 'delivered' ? 'bg-green-100' : 
                          status.status === 'on-the-way' ? 'bg-blue-100' : 'bg-yellow-100'
                        }`}>
                          {status.status === 'delivered' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <div className={`w-3 h-3 rounded-full ${
                              status.status === 'on-the-way' ? 'bg-blue-600' : 'bg-yellow-600'
                            }`} />
                          )}
                        </div>
                        {index < orderStatus.length - 1 && (
                          <div className="absolute left-4 top-8 w-0.5 h-12 bg-gray-200"></div>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-gray-900">
                            {status.status === 'preparing' ? 'Preparing Order' :
                             status.status === 'on-the-way' ? 'On the Way' : 'Delivered'}
                          </span>
                          <span className="ml-auto text-sm text-gray-500">{status.time}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{status.description}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Next Step */}
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center mb-1">
                        <span className="font-medium text-gray-400">Delivery</span>
                        <span className="ml-auto text-sm text-gray-400">{estimatedDelivery}</span>
                      </div>
                      <p className="text-gray-400 text-sm">Estimated delivery time</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map/Driver Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-700">Delivery Address</p>
                      <p className="text-gray-600">{deliveryAddress}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-700">Delivery Driver</p>
                      <p className="text-gray-600">{deliveryDriver}</p>
                      <p className="text-sm text-gray-500">{driverContact}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-700">Estimated Delivery</p>
                      <p className="text-gray-600">{estimatedDelivery} (30-45 minutes)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Items</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between text-sm">
                        <span>Beef Glow Bowl ×1</span>
                        <span>R129.99</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span>Sweet Potato Fries</span>
                        <span>R35.00</span>
                      </li>
                      <li className="flex justify-between text-sm">
                        <span>Fresh Orange Juice</span>
                        <span>R25.00</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>R189.99</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>R189.99</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <button className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 mb-3">
                      Contact Driver
                    </button>
                    <button className="w-full py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                      Need Help?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
