"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const TrackingPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [trackingInfo, setTrackingInfo] = useState<{
    status: 'preparing' | 'dispatched' | 'en_route' | 'arriving' | 'delivered';
    progress: number;
    estimatedArrival: number;
  } | null>(null);
  
  const [driverEta, setDriverEta] = useState("Calculating...");
  const [currentTime, setCurrentTime] = useState("");

  // Example drop-off location
  const EXAMPLE_DROPOFF = {
    address: "123 Example Street, Observatory, Cape Town"
  };

  // Stable simulation
  const simulateLiveTracking = (id: string) => {
    // Use order ID for stable simulation
    const hash = id.split('').reduce((acc: number, char) => acc + char.charCodeAt(0), 0);
    const progress = (hash % 70) + 15; // 15-85%
    
    let status: 'preparing' | 'dispatched' | 'en_route' | 'arriving' | 'delivered';
    
    if (progress < 25) status = 'preparing';
    else if (progress < 35) status = 'dispatched';
    else if (progress < 85) status = 'en_route';
    else if (progress < 100) status = 'arriving';
    else status = 'delivered';
    
    return {
      status,
      progress,
      estimatedArrival: Math.max(0, Math.round((100 - progress) / 2))
    };
  };

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    // Initial load - client only
    const info = simulateLiveTracking(orderId);
    setTrackingInfo(info);
    
    if (info.estimatedArrival > 0) {
      setDriverEta(`~${info.estimatedArrival} minutes`);
    } else {
      setDriverEta("Arriving now");
    }

    // Update time on client
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 30000);

    // Update progress every 30 seconds
    const progressInterval = setInterval(() => {
      const updatedInfo = simulateLiveTracking(orderId);
      setTrackingInfo(updatedInfo);
      setDriverEta(`~${updatedInfo.estimatedArrival} minutes`);
    }, 30000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(progressInterval);
    };
  }, [orderId, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return '👨‍🍳';
      case 'dispatched': return '🚗';
      case 'en_route': return '📍';
      case 'arriving': return '🏠';
      case 'delivered': return '✅';
      default: return '📦';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'Preparing your order';
      case 'dispatched': return 'Dispatched with driver';
      case 'en_route': return 'On the way to you';
      case 'arriving': return 'Almost there!';
      case 'delivered': return 'Delivered';
      default: return 'Processing';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return 'text-yellow-600';
      case 'dispatched': return 'text-blue-600';
      case 'en_route': return 'text-green-600';
      case 'arriving': return 'text-orange-600';
      case 'delivered': return 'text-green-700';
      default: return 'text-gray-600';
    }
  };

  // Show loading state during initial hydration
  if (!trackingInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#264653] to-[#2A9D8F] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading tracking information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#264653] to-[#2A9D8F] py-8">
      <div className="container mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center text-[#E9C46A] hover:text-[#F4A261] mb-6"
        >
          ← Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Order #{orderId}
                </h1>
                <p className="text-gray-600">Tracking your Garden Grains delivery</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Estimated Arrival</div>
                <div className="text-xl font-bold text-[#264653]">{driverEta}</div>
              </div>
            </div>
          </div>

          {/* Tracking Progress */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{getStatusIcon(trackingInfo.status)}</span>
                <div>
                  <h2 className={`text-xl font-bold ${getStatusColor(trackingInfo.status)}`}>
                    {getStatusText(trackingInfo.status)}
                  </h2>
                  <p className="text-gray-600">
                    Last updated: {currentTime || "Updating..."}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-[#264653]">
                  {Math.round(trackingInfo.progress)}%
                </div>
                <div className="text-sm text-gray-500">Progress</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Order placed</span>
                <span>Delivered</span>
              </div>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#E9C46A] to-[#F4A261] rounded-full transition-all duration-500"
                  style={{ width: `${trackingInfo.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">Preparing</span>
                <span className="text-xs text-gray-500">Dispatched</span>
                <span className="text-xs text-gray-500">On the way</span>
                <span className="text-xs text-gray-500">Arriving</span>
                <span className="text-xs text-gray-500">Delivered</span>
              </div>
            </div>

            {/* Driver Info */}
            {trackingInfo.status !== 'preparing' && trackingInfo.status !== 'delivered' && (
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Driver Information</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#E9C46A] rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                      JD
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">John Doe</h4>
                      <p className="text-sm text-gray-600">Driver #DG-{orderId.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">ETA to your location</div>
                    <div className="text-xl font-bold text-[#264653]">{driverEta}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-semibold text-gray-800 mb-4">Delivery Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">Delivery Address</div>
                  <div className="font-medium text-gray-800">{EXAMPLE_DROPOFF.address}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-sm text-gray-500 mb-1">Order Total</div>
                  <div className="font-medium text-gray-800">R189.50</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Tracking Info */}
          <div className="mt-6 text-center text-white text-sm">
            <p className="mb-2">📍 Live tracking updates every 30 seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
