"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import OrderCard from "@/components/OrderCard";
import AdminOrdersTable from "@/components/AdminOrdersTable";
import {
  Bell,
  Package,
  TrendingUp,
  Users,
  UserPlus,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pageVisits: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🔊 Load sound
  useEffect(() => {
    audioRef.current = new Audio("/ringtone.mp3");
    audioRef.current.volume = 0.7;
    return () => audioRef.current?.pause();
  }, []);

  // 🔐 Auth protection
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") router.push("/signin");
    if (status === "authenticated" && session?.user?.role !== "ADMIN")
      router.push("/");
  }, [status, session, router]);

  // 🧾 Fetch Orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders || []);

      const pending = data.orders.filter((o: any) => o.status === "PENDING").length;
      const completed = data.orders.filter((o: any) => o.status === "COMPLETED").length;

      setMetrics((prev) => ({
        ...prev,
        totalOrders: data.orders.length,
        pendingOrders: pending,
        completedOrders: completed,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 📊 Fetch Dashboard Stats
  const fetchMetrics = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (!res.ok) throw new Error("Failed to fetch metrics");
      const data = await res.json();
      setMetrics((prev) => ({ ...prev, ...data }));

      // Mock Chart Data from server response
      const ordersTrend = Array.from({ length: 7 }).map((_, i) => ({
        day: `Day ${i + 1}`,
        orders: Math.floor(Math.random() * 15) + 5,
      }));
      setChartData(ordersTrend);

      const userTrend = Array.from({ length: 7 }).map((_, i) => ({
        day: `Day ${i + 1}`,
        users: Math.floor(Math.random() * 25) + 10,
      }));
      setUserActivity(userTrend);
    } catch (err) {
      console.error(err);
    }
  };

  // ⏳ Initialize
  useEffect(() => {
    fetchOrders();
    fetchMetrics();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🔔 Detect new orders
  useEffect(() => {
    const checkNewOrders = async () => {
      try {
        const res = await fetch("/api/orders?countOnly=true");
        if (!res.ok) return;
        const data = await res.json();
        const count = data.totalCount || 0;
        if (count > lastOrderCount) {
          setNewOrdersCount(count - lastOrderCount);
          setShowNewOrderAlert(true);
          audioRef.current?.play().catch(() => {});
          setTimeout(() => setShowNewOrderAlert(false), 5000);
        }
        setLastOrderCount(count);
      } catch (err) {
        console.error(err);
      }
    };
    const interval = setInterval(checkNewOrders, 5000);
    return () => clearInterval(interval);
  }, [lastOrderCount]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 🔔 New Order Notification */}
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

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <LogoutButton />
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <DashboardCard icon={<Users />} label="Total Clients" value={metrics.totalUsers} />
        <DashboardCard icon={<UserPlus />} label="Active Users" value={metrics.activeUsers} />
        <DashboardCard icon={<Eye />} label="Page Visits" value={metrics.pageVisits} />
        <DashboardCard icon={<Package />} label="Pending Orders" value={metrics.pendingOrders} />
        <DashboardCard icon={<TrendingUp />} label="Completed" value={metrics.completedOrders} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">📈 Orders Trend (7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <Line type="monotone" dataKey="orders" stroke="#1E4259" strokeWidth={2} />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">👥 Active Users Trend (7 Days)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#1E4259" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders Section */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewMode("table")}
          className={`px-3 py-1 rounded-md font-medium ${
            viewMode === "table"
              ? "bg-[#1E4259] text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Table View
        </button>
        <button
          onClick={() => setViewMode("cards")}
          className={`px-3 py-1 rounded-md font-medium ${
            viewMode === "cards"
              ? "bg-[#1E4259] text-white"
              : "bg-white text-gray-700"
          }`}
        >
          Card View
        </button>
      </div>

      {/* Orders Display */}
      <div>
        {viewMode === "table" ? (
          <AdminOrdersTable />
        ) : (
          <div className="grid gap-6">
            {loading ? (
              <p>Loading orders...</p>
            ) : (
              orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  refreshOrders={fetchOrders}
                />
              ))
            )}
          </div>
        )}
      </div>

      <audio preload="auto">
        <source src="/ringtone.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

function DashboardCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
      <div className="text-[#1E4259]">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
