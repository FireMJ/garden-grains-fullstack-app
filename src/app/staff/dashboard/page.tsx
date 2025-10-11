"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import OrderCard from "@/components/OrderCard";
import { Bell, RefreshCw, Package, Truck, CheckCircle } from "lucide-react";

type Order = {
  id: string;
  deliveryStatus: "PENDING" | "ENROUTE" | "DELIVERED";
  [key: string]: any;
};

export default function StaffDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const orderRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const [summary, setSummary] = useState({
    pending: 0,
    enroute: 0,
    delivered: 0,
  });

  useEffect(() => {
    audioRef.current = new Audio("/ringtone.mp3");
    audioRef.current.volume = 0.7;
    return () => audioRef.current?.pause();
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") router.push("/auth/signin");
    if (status === "authenticated" && session?.user?.role !== "STAFF")
      router.push("/");
  }, [status, session, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || []);

      const pending = data.orders.filter((o: any) => o.deliveryStatus === "PENDING").length;
      const enroute = data.orders.filter((o: any) => o.deliveryStatus === "ENROUTE").length;
      const delivered = data.orders.filter((o: any) => o.deliveryStatus === "DELIVERED").length;
      setSummary({ pending, enroute, delivered });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/orders?countOnly=true");
        if (!res.ok) return;
        const data = await res.json();
        const count = data.totalCount || 0;

        if (count > lastOrderCount) {
          const diff = count - lastOrderCount;
          setNewOrdersCount(diff);
          setShowNewOrderAlert(true);
          audioRef.current?.play().catch(() => {});
          setTimeout(() => setShowNewOrderAlert(false), 5000);

          const newestOrderId = data.orders?.[0]?.id || "";
          if (orderRefs.current[newestOrderId]) {
            orderRefs.current[newestOrderId]?.scrollIntoView({ behavior: "smooth" });
          }
        }

        setLastOrderCount(count);
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lastOrderCount]);

  const updateDeliveryStatus = async (orderId: string, status: "ENROUTE" | "DELIVERED") => {
    try {
      const res = await fetch(`/api/orders/${orderId}/update-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryStatus: status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">PENDING</span>;
      case "ENROUTE":
        return <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold">ENROUTE</span>;
      case "DELIVERED":
        return <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs font-semibold">DELIVERED</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {showNewOrderAlert && (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <Bell className="w-6 h-6" />
            <div>
              <p className="font-bold">🚨 New Order Received!</p>
              <p>{newOrdersCount} new order{newOrdersCount > 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => setShowNewOrderAlert(false)}>×</button>
          </div>
        </div>
      )}

      <header className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 z-20 py-2">
        <div>
          <h1 className="text-3xl font-bold">Staff Dashboard</h1>
          <p className="text-gray-600">Manage orders, update delivery statuses, and assist daily operations.</p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <LogoutButton />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard icon={<Package className="w-6 h-6 text-yellow-800" />} label="Pending Orders" value={summary.pending} color="yellow" />
        <SummaryCard icon={<Truck className="w-6 h-6 text-blue-800" />} label="Enroute Orders" value={summary.enroute} color="blue" />
        <SummaryCard icon={<CheckCircle className="w-6 h-6 text-green-800" />} label="Delivered Orders" value={summary.delivered} color="green" />
      </div>

      <div className="grid gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse h-36"></div>
          ))
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              ref={(el) => (orderRefs.current[order.id] = el)}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-3 border-l-4 transition-transform hover:scale-[1.01] animate-fadeIn"
            >
              <div className="flex justify-between items-start">
                <OrderCard order={order} refreshOrders={fetchOrders} />
                {getStatusBadge(order.deliveryStatus)}
              </div>

              <div className="flex gap-2 mt-2 flex-wrap">
                <button
                  onClick={() => updateDeliveryStatus(order.id, "ENROUTE")}
                  disabled={order.deliveryStatus !== "PENDING"}
                  className={`px-3 py-1 rounded-md font-medium text-white ${order.deliveryStatus !== "PENDING" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  Mark Enroute
                </button>
                <button
                  onClick={() => updateDeliveryStatus(order.id, "DELIVERED")}
                  disabled={order.deliveryStatus === "DELIVERED"}
                  className={`px-3 py-1 rounded-md font-medium text-white ${order.deliveryStatus === "DELIVERED" ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
                >
                  Mark Delivered
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <audio ref={audioRef} preload="auto">
        <source src="/ringtone.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

function SummaryCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className={`bg-${color}-100 rounded-lg shadow p-4 flex items-center gap-3`}>
      <div>{icon}</div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
