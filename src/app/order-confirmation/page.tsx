"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle, 
  Home, 
  ShoppingBag, 
  Receipt, 
  Clock, 
  MapPin, 
  Truck, 
  Phone, 
  Mail,
  Coffee,
  Milk,
  EggFried,
  UtensilsCrossed,
  Salad,
  Apple,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Helper to get add-on icon
const getAddOnIcon = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('cheese')) return <Sparkles size={12} className="text-yellow-600" />;
  if (lowerName.includes('egg')) return <EggFried size={12} className="text-orange-500" />;
  if (lowerName.includes('bacon')) return <UtensilsCrossed size={12} className="text-red-600" />;
  if (lowerName.includes('milk') || lowerName.includes('cream')) return <Milk size={12} className="text-blue-500" />;
  if (lowerName.includes('salad') || lowerName.includes('lettuce')) return <Salad size={12} className="text-green-600" />;
  if (lowerName.includes('fruit') || lowerName.includes('berry')) return <Apple size={12} className="text-red-500" />;
  return <Coffee size={12} className="text-gray-500" />;
};

function OrderConfirmationContent() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [orderNumber, setOrderNumber] = useState("");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Get order details from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const lastOrder = orders[orders.length - 1];
    
    if (lastOrder) {
      setOrderDetails(lastOrder);
      setOrderNumber(lastOrder.id || `ORD-${Date.now()}`);
    } else {
      // If no order found, check sessionStorage for pending order
      const pendingOrder = sessionStorage.getItem('pendingOrder');
      if (pendingOrder) {
        const order = JSON.parse(pendingOrder);
        setOrderDetails(order);
        setOrderNumber(`ORD-${Date.now()}`);
        
        // Save to localStorage
        const newOrder = {
          ...order,
          id: `ORD-${Date.now()}`,
          timestamp: new Date().toISOString()
        };
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        sessionStorage.removeItem('pendingOrder');
      } else {
        // No order found, redirect to menu after 3 seconds
        setTimeout(() => {
          router.push('/menu');
        }, 3000);
      }
    }
  }, [router]);

  const toggleExpandItem = (itemId: string) => {
    setExpandedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  // Calculate item total including add-ons
  const getItemTotal = (item: any) => {
    let total = item.price * item.quantity;
    if (item.addOns && item.addOns.length > 0) {
      const addOnsTotal = item.addOns.reduce((sum: number, addon: any) => sum + (addon.price * addon.quantity), 0);
      total += addOnsTotal;
    }
    return total;
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F5D50] mb-4"></div>
        <p className="text-gray-600">Loading order details...</p>
        <p className="text-sm text-gray-400 mt-2">Redirecting to menu if no order found...</p>
      </div>
    );
  }

  const isDelivery = orderDetails.orderType === 'delivery';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Success Icon */}
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-500 mb-6">Thank you for your order</p>
            
            {/* Order Number */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="text-lg font-mono font-bold text-[#2F5D50]">{orderNumber}</p>
            </div>
          </div>
          
          {/* Order Details with Add-ons and Instructions */}
          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Receipt size={18} className="text-[#2F5D50]" />
              Order Details
            </h3>
            
            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
              {orderDetails.items?.map((item: any, index: number) => (
                <div key={index} className="border-b border-gray-200 last:border-0 pb-3 last:pb-0">
                  {/* Item Header */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-semibold text-gray-900">{item.quantity}x </span>
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">R {getItemTotal(item).toFixed(2)}</span>
                  </div>
                  
                  {/* Add-ons Section */}
                  {item.addOns && item.addOns.length > 0 && (
                    <div className="mt-2 pl-3 border-l-2 border-[#2F5D50]">
                      <button
                        onClick={() => toggleExpandItem(item.id)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#2F5D50] transition-colors mb-1"
                      >
                        {expandedItems[item.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        <span>Extras ({item.addOns.length})</span>
                      </button>
                      
                      {expandedItems[item.id] && (
                        <div className="space-y-1 mt-1">
                          {item.addOns.map((addon: any) => (
                            <div key={addon.id} className="flex justify-between items-center text-xs">
                              <div className="flex items-center gap-1.5">
                                {getAddOnIcon(addon.name)}
                                <span className="text-gray-600">{addon.name}</span>
                                {addon.quantity > 1 && (
                                  <span className="text-gray-400">x{addon.quantity}</span>
                                )}
                              </div>
                              <span className="text-green-600 font-medium">
                                +R {(addon.price * addon.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Special Instructions */}
                  {item.specialInstructions && (
                    <div className="mt-2 text-xs text-gray-500 bg-white p-2 rounded-lg border border-gray-100">
                      <span className="font-medium text-gray-700">📝 Special Instructions:</span>
                      <p className="text-gray-600 mt-0.5">{item.specialInstructions}</p>
                    </div>
                  )}
                  
                  {/* Item Price Breakdown */}
                  {item.addOns && item.addOns.length > 0 && (
                    <div className="mt-2 text-xs text-gray-400 flex justify-end">
                      Base: R {(item.price * item.quantity).toFixed(2)} + Extras: R {(getItemTotal(item) - (item.price * item.quantity)).toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Price Summary */}
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">R {orderDetails.subtotal?.toFixed(2)}</span>
                </div>
                {orderDetails.discount && orderDetails.discount.amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({orderDetails.discount.percentage}%)</span>
                    <span>-R {orderDetails.discount.amount?.toFixed(2)}</span>
                  </div>
                )}
                {isDelivery && orderDetails.deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span>R {orderDetails.deliveryFee?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold pt-2 mt-1 border-t">
                  <span>Total Paid</span>
                  <span className="text-[#2F5D50]">R {orderDetails.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Type & Address */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              {isDelivery ? (
                <>
                  <Truck size={18} className="text-[#2F5D50] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Delivery Address</p>
                    <p className="text-sm text-gray-600">{orderDetails.address?.street}</p>
                    {orderDetails.distance && (
                      <p className="text-xs text-gray-500 mt-1">
                        Distance: {orderDetails.distance.toFixed(1)} km • Est. delivery: 30-45 min
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Clock size={18} className="text-[#2F5D50] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Pickup</p>
                    <p className="text-sm text-gray-600">Uitsig Wine Farm, Constantia, Cape Town</p>
                    <p className="text-xs text-gray-500 mt-1">Ready in 20-30 minutes</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Customer Info */}
          {orderDetails.customer && (
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold text-gray-900">Customer Information</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-700">Name:</span>
                  <span>{orderDetails.customer.name || 'Guest'}</span>
                </div>
                {orderDetails.customer.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-gray-400" />
                    <span>{orderDetails.customer.email}</span>
                  </div>
                )}
                {orderDetails.customer.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={14} className="text-gray-400" />
                    <span>{orderDetails.customer.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* What's Next */}
          <div className="bg-[#2F5D50]/5 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#2F5D50] font-bold">1.</span>
                <span>You'll receive a confirmation SMS shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2F5D50] font-bold">2.</span>
                <span>We'll prepare your order with care</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2F5D50] font-bold">3.</span>
                <span>
                  {isDelivery 
                    ? 'Your driver will deliver your order within 30-45 minutes'
                    : 'Your order will be ready for pickup in 20-30 minutes'}
                </span>
              </li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#2F5D50] text-white px-6 py-3 rounded-lg hover:bg-[#23483E] transition-all"
            >
              <Home size={18} />
              Return Home
            </Link>
            <Link
              href="/menu"
              className="flex-1 inline-flex items-center justify-center gap-2 border border-[#2F5D50] text-[#2F5D50] px-6 py-3 rounded-lg hover:bg-[#2F5D50]/5 transition-all"
            >
              <ShoppingBag size={18} />
              Order More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F5D50]"></div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
