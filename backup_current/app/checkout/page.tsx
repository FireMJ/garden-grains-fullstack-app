import FixedHeader from '@/components/FixedHeader';
<FixedHeader />
<FixedHeader />

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { estimateDeliveryTime, getDeliverySlots } from "@/utils/deliveryTime";

const CheckoutPage = () => {
  const { cart, getCartTotal, getDeliveryFee } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [deliveryEstimate, setDeliveryEstimate] = useState<{
    minTime: number;
    maxTime: number;
    avgTime: number;
    distance: number;
    traffic: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = getCartTotal();
  const deliveryFee = getDeliveryFee();
  const finalTotal = cartTotal + deliveryFee;

  // Example drop-off coordinates (in production, geocode address)
  const EXAMPLE_DROPOFF = {
    lat: -33.9180,  // Example: Observatory, Cape Town
    lng: 18.4472
  };

  useEffect(() => {
    if (deliveryAddress) {
      // In production, geocode address to get coordinates
      const estimate = estimateDeliveryTime(EXAMPLE_DROPOFF.lat, EXAMPLE_DROPOFF.lng, {
        orderSize: cart.length > 3 ? 'large' : cart.length > 1 ? 'medium' : 'small'
      });
      setDeliveryEstimate(estimate);
    }
  }, [deliveryAddress, cart.length]);

  const deliverySlots = getDeliverySlots();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      alert("Order placed successfully! Redirecting to payment...");
      setIsProcessing(false);
      // In production, redirect to payment gateway
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#264653] to-[#2A9D8F] py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6">
              Add some delicious bowls to your cart first!
            </p>
            <Link
              href="/menu"
              className="inline-block bg-[#E9C46A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#F4A261] transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#264653] to-[#2A9D8F] py-8">
      <div className="container mx-auto px-4">
        <Link
          href="/cart"
          className="inline-flex items-center text-[#E9C46A] hover:text-[#F4A261] mb-6"
        >
          ← Back to Cart
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Order Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Order Summary
            </h1>

            <div className="space-y-4 mb-6">
              {cart.map((item: any, index) => (
                <div key={index} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {item.quantity} × {item.name}
                      </h3>
                      {item.base && (
                        <p className="text-sm text-gray-600">
                          Base: {item.base}
                          {item.baseExtra > 0 && ` (+R${item.baseExtra.toFixed(2)})`}
                        </p>
                      )}
                      {item.dressing && (
                        <p className="text-sm text-gray-600">
                          Dressing: {item.dressing}
                        </p>
                      )}
                      {item.addOns && item.addOns.length > 0 && (
                        <div className="mt-1">
                          <p className="text-sm font-medium text-gray-700">Add-ons:</p>
                          <ul className="text-sm text-gray-600">
                            {item.addOns.map((addon: any, i) => (
                              <li key={i}>
                                • {addon.name} {addon.price > 0 ? `+R${addon.price.toFixed(2)}` : ""}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {item.fries && (
                        <p className="text-sm text-gray-600">
                          • {item.fries.name} (+R{item.fries.price.toFixed(2)})
                        </p>
                      )}
                      {item.juice && (
                        <p className="text-sm text-gray-600">
                          • {item.juice.name} (+R{item.juice.price.toFixed(2)})
                        </p>
                      )}
                      {item.specialInstructions && (
                        <p className="text-sm text-gray-500 italic mt-1">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>
                    <span className="font-semibold text-gray-800">
                      R{((item.price + (item.addOns?.reduce((sum: number, a) => sum + (a.price || 0), 0) || 0) + 
                        (item.fries?.price || 0) + (item.juice?.price || 0)) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span className={deliveryFee === 0 ? "text-green-600 font-semibold" : ""}>
                  {deliveryFee === 0 ? "FREE!" : `R${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              {deliveryFee > 0 && cartTotal < 850 && (
                <div className="text-sm text-[#2A9D8F] font-medium">
                  ⓘ Add R{(850 - cartTotal).toFixed(2)} more for free delivery!
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-3">
                <span>Total</span>
                <span>R{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Delivery Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Delivery Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Address */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Delivery Address *
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F4A261] focus:border-transparent"
                  placeholder="Enter your full delivery address..."
                  required
                />
                {deliveryAddress && deliveryEstimate && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Delivery Estimate:</span>
                      <span className="font-bold text-[#264653]">
                        {deliveryEstimate.minTime}-{deliveryEstimate.maxTime} minutes
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span>{deliveryEstimate.distance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Traffic:</span>
                        <span className="capitalize">{deliveryEstimate.traffic}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average time:</span>
                        <span>{deliveryEstimate.avgTime} minutes</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      ⓘ Time includes food preparation and travel
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Time Slot */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Preferred Delivery Time
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {deliverySlots.map((slot: any, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`p-3 border rounded-md text-center transition-colors ${
                        selectedSlot === slot.time
                          ? "border-[#F4A261] bg-[#F4A261] text-white"
                          : slot.available
                          ? "border-gray-300 hover:border-[#F4A261]"
                          : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!slot.available}
                    >
                      <div className="font-medium">{slot.display}</div>
                      <div className="text-sm">
                        {slot.available ? "Available" : "Unavailable"}
                      </div>
                    </button>
                  ))}
                </div>
                {selectedSlot && (
                  <div className="mt-2 text-sm text-[#2A9D8F]">
                    ✅ Delivery scheduled for {deliverySlots.find(s => s.time === selectedSlot)?.display}
                  </div>
                )}
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Delivery Notes (Optional)
                </label>
                <textarea
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F4A261] focus:border-transparent"
                  placeholder="Gate code, building instructions, contact details..."
                />
              </div>

              {/* Pickup Location Info */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <h3 className="font-medium text-yellow-800 mb-2">📍 Pickup Location</h3>
                <p className="text-sm text-yellow-700">
                  Orders are prepared at our kitchen in Uitsig Constantia. Delivery times are calculated from this location.
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Live tracking will be available once your order is dispatched.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !deliveryAddress}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
                  isProcessing || !deliveryAddress
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#E9C46A] to-[#F4A261] hover:from-[#F4A261] hover:to-[#E76F51] shadow-lg hover:shadow-xl"
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Place Order - R${finalTotal.toFixed(2)}`
                )}
              </button>

              <p className="text-sm text-gray-500 text-center">
                You'll be redirected to a secure payment page after order confirmation.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
