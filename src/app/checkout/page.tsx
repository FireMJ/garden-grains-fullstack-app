"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { CreditCard, Home, Calendar, Loader, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { cart, clearCart, schedule } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'summary' | 'processing' | 'success' | 'error'>('summary');
  const [orderId, setOrderId] = useState<string | null>(null);

  // Total calculation
  const total = cart.reduce((sum, item) => {
    const base = item.price * item.quantity;
    const addOns = item.addOns?.reduce((acc, o) => acc + o.price * (o.quantity ?? 1), 0) ?? 0;
    const fries = item.fries?.reduce((acc, o) => acc + o.price * (o.quantity ?? 1), 0) ?? 0;
    const juices = item.juices?.reduce((acc, o) => acc + o.price * (o.quantity ?? 1), 0) ?? 0;
    return sum + base + addOns + fries + juices;
  }, 0);

  const formatScheduleDate = (dt?: string) => {
    if (!dt) return "";
    return new Date(dt).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // === Payment Handler ===
  const handlePayment = async () => {
    if (status === "unauthenticated" || !session) {
      if (confirm("You need to sign in to complete payment. Sign in now?")) {
        signIn(undefined, { callbackUrl: "/checkout" });
      }
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);
    setPaymentStep('processing');

    try {
      // 1️⃣ Create order as PENDING
      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart, total, schedule, paymentStatus: "PENDING" }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Order creation failed");

      const newOrderId = orderData.order.id;
      setOrderId(newOrderId);

      // 2️⃣ Create Yoco payment
      const paymentRes = await fetch("/api/create-yoco-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "ZAR",
          metadata: { orderId: newOrderId, userId: session.user.id, schedule }
        }),
      });
      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error(paymentData.error || "Payment creation failed");

      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl; // redirect to Yoco checkout
        return;
      }

    } catch (err: any) {
      console.error(err);
      alert(`Payment failed: ${err.message}`);
      setPaymentStep('error');
      setLoading(false);
    }
  };

  // === Poll Order Status After Payment ===
  useEffect(() => {
    if (!orderId) return;
    if (paymentStep === 'success') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.order?.status === "PAID") {
          clearCart(); // safe to clear now
          setPaymentStep('success');
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error polling order status:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, paymentStep, clearCart]);

  // === UI States ===
  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-green-600"/>
          <h2 className="text-xl font-bold mb-2">Processing Payment</h2>
          <p className="text-gray-600 mb-4">Please wait...</p>
          <p className="text-sm text-gray-500">Do not refresh or close this page.</p>
        </div>
      </div>
    );
  }

  if (paymentStep === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600"/>
          <h2 className="text-xl font-bold mb-2">Payment Failed</h2>
          <button onClick={() => setPaymentStep('summary')} className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold">Try Again</button>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <h2 className="text-xl font-bold mb-4 text-green-600">Payment Successful!</h2>
          <p className="text-gray-700 mb-4">Thank you for your order.</p>
          <button onClick={() => router.push("/")} className="py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">Back to Menu</button>
        </div>
      </div>
    );
  }

  // === Main Checkout Summary ===
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-[#1E4259] flex items-center gap-2">
          <CreditCard className="w-6 h-6"/> Checkout
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Your cart is empty.</p>
            <button onClick={() => router.push("/")} className="px-4 py-2 bg-[#1E4259] text-white rounded-lg hover:bg-[#2A536B] flex items-center gap-2 justify-center">
              <Home className="w-4 h-4"/> Back to Menu
            </button>
          </div>
        ) : (
          <>
            {status === "unauthenticated" && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700"><strong>Note:</strong> Sign in to complete your order.</p>
              </div>
            )}

            {schedule && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 font-medium">
                  <Calendar className="w-5 h-5"/> Scheduled Order
                </div>
                <p className="mt-1 text-blue-600">{formatScheduleDate(schedule)}</p>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">Order Summary</h2>
              <ul className="divide-y divide-gray-200">
                {cart.map((item, i) => <CartItem key={item.id || i} item={item} total={calculateItemTotal(item)}/>)}
              </ul>
            </div>

            <div className="flex justify-between items-center mb-6 text-lg font-bold border-t border-gray-200 pt-4">
              <span className="text-gray-800">Total Amount:</span>
              <span className="text-green-600">R{total.toFixed(2)}</span>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center gap-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4"/> Secure payment powered by Yoco
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => router.push("/")} disabled={loading} className="flex-1 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold flex justify-center items-center gap-2 disabled:opacity-50">
                <Home className="w-5 h-5"/> Continue Shopping
              </button>
              <button onClick={handlePayment} disabled={loading || cart.length === 0 || status === "unauthenticated"} className="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold flex justify-center items-center gap-2 disabled:opacity-50">
                {loading ? <Loader className="w-5 h-5 animate-spin"/> : <CreditCard className="w-5 h-5"/>}
                {loading ? "Processing..." : `Pay R${total.toFixed(2)}`}
              </button>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              Your payment information is secure. We do not store card details.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// === Helpers ===
function CartItem({ item, total }: { item: any; total: number }) {
  return (
    <li className="py-4">
      <div className="flex justify-between">
        <span className="font-semibold text-gray-800">{item.name}</span>
        <span className="text-gray-700">R{total.toFixed(2)}</span>
      </div>
      <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>

      {item.addOns?.length > 0 && <DetailSection title="Add-ons" items={item.addOns}/>}
      {item.fries?.length > 0 && <DetailSection title="Fries" items={item.fries}/>}
      {item.juices?.length > 0 && <DetailSection title="Juices" items={item.juices}/>}

      {item.specialInstructions && (
        <div className="mt-2 ml-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 italic text-sm rounded">
          <span className="font-medium text-gray-700">Note:</span> <span className="text-gray-600">{item.specialInstructions}</span>
        </div>
      )}
    </li>
  );
}

function DetailSection({ title, items }: { title: string; items: any[] }) {
  return (
    <div className="mt-2 ml-2">
      <p className="text-sm font-medium text-gray-700">{title}:</p>
      <ul className="ml-4 text-sm text-gray-600">
        {items.map((item, idx) => (
          <li key={idx}>
            + {item.name} {item.size && `(${item.size})`} (R{item.price.toFixed(2)}) {item.quantity > 1 && `× ${item.quantity}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

function calculateItemTotal(item: any): number {
  const base = item.price * item.quantity;
  const addOns = item.addOns?.reduce((acc: number, o: any) => acc + o.price * (o.quantity ?? 1), 0) ?? 0;
  const fries = item.fries?.reduce((acc: number, o: any) => acc + o.price * (o.quantity ?? 1), 0) ?? 0;
  const juices = item.juices?.reduce((acc: number, o: any) => acc + o.price * (o.quantity ?? 1), 0) ?? 0;
  return base + addOns + fries + juices;
}
