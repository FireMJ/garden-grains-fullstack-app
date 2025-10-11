"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader, RefreshCw, AlertCircle, Package, TrendingUp, Users, Bell } from "lucide-react";

// Components
import AdminOrdersTable from "@/components/AdminOrdersTable";
import OrderCard from "@/components/OrderCard";

// Types
interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [reconciling, setReconciling] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  
  // Audio ref for ringing tone
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/ringtone.mp3"); // Add a ringtone file to your public folder
    audioRef.current.volume = 0.7;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Real-time order monitoring
  useEffect(() => {
    if (status !== "authenticated" || session?.user?.role !== "ADMIN") return;

    const checkNewOrders = async () => {
      try {
        const res = await fetch("/api/orders?countOnly=true");
        const data = await res.json();
        const currentOrderCount = data.totalCount || 0;
        
        if (currentOrderCount > lastOrderCount) {
          const newOrders = currentOrderCount - lastOrderCount;
          setNewOrdersCount(newOrders);
          setShowNewOrderAlert(true);
          
          // Play ringing tone
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
          }
          
          // Auto-hide alert after 5 seconds
          setTimeout(() => {
            setShowNewOrderAlert(false);
          }, 5000);
        }
        
        setLastOrderCount(currentOrderCount);
      } catch (error) {
        console.error("Error checking new orders:", error);
      }
    };

    // Check every 3 seconds for new orders
    const orderInterval = setInterval(checkNewOrders, 3000);
    
    // Initial check
    checkNewOrders();

    return () => clearInterval(orderInterval);
  }, [status, session, lastOrderCount]);

  // Redirect non-admin users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }
    
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/");
      return;
    }
  }, [session, status, router]);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Trigger reconciliation manually
  const handleReconcile = async () => {
    setReconciling(true);
    try {
      const res = await fetch("/api/orders/reconcile", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reconcile orders");
      
      setRefreshCount(prev => prev + 1);
      await fetchStats(); // Refresh stats after reconciliation
      alert("Orders reconciled successfully!");
    } catch (err: any) {
      console.error("Reconciliation error:", err);
      alert(err.message || "Failed to reconcile orders");
    }
    setReconciling(false);
  };

  // Refresh orders manually
  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
    fetchStats();
    setShowNewOrderAlert(false); // Hide new order alert on manual refresh
  };

  // Auto-refresh stats when component mounts and every 30 seconds
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchStats();
      
      const interval = setInterval(fetchStats, 30000);
      return () => clearInterval(interval);
    }
  }, [status, session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-[#1E4259]" />
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* New Order Alert */}
      {showNewOrderAlert && (
        <div className="fixed top-4 right-4 z-50 animate-pulse">
          <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <Bell className="w-6 h-6 animate-ring" />
            <div>
              <p className="font-bold">🚨 New Order Received!</p>
              <p className="text-sm">{newOrdersCount} new order{newOrdersCount > 1 ? 's' : ''}</p>
            </div>
            <button 
              onClick={() => setShowNewOrderAlert(false)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">
                Monitor orders, payments, and manage your restaurant operations.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className={`w-3 h-3 rounded-full ${showNewOrderAlert ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
              Live Updates {showNewOrderAlert && '• New Orders!'}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<Package className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={<Loader className="w-6 h-6" />}
            color="yellow"
          />
          <StatCard
            title="Completed Orders"
            value={stats.completedOrders}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
          />
          <StatCard
            title="Total Revenue"
            value={`R${stats.totalRevenue.toFixed(2)}`}
            icon={<Users className="w-6 h-6" />}
            color="purple"
          />
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Order Management</h2>
              
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 text-sm font-medium ${
                    viewMode === 'table' 
                      ? 'bg-[#1E4259] text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } rounded-l-md`}
                >
                  Table View
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1 text-sm font-medium ${
                    viewMode === 'cards' 
                      ? 'bg-[#1E4259] text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } rounded-r-md`}
                >
                  Card View
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 font-medium disabled:opacity-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              {/* Reconcile Button */}
              <button
                onClick={handleReconcile}
                disabled={reconciling}
                className="flex items-center gap-2 bg-[#1E4259] text-white py-2 px-4 rounded-md hover:bg-[#2A536B] font-medium disabled:opacity-50 transition-colors"
              >
                {reconciling ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {reconciling ? "Reconciling..." : "Reconcile Payments"}
              </button>
            </div>
          </div>
        </div>

        {/* Orders Display */}
        <div key={refreshCount} className="bg-white rounded-lg shadow-sm overflow-hidden">
          {viewMode === 'table' ? (
            <AdminOrdersTable />
          ) : (
            <CardViewOrders />
          )}
        </div>

        {/* Last Updated */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
            {showNewOrderAlert && ' • New orders alert active!'}
          </p>
        </div>
      </div>

      {/* Hidden audio element for ringtone */}
      <audio preload="auto">
        <source src="/ringtone.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

// Statistics Card Component
function StatCard({ title, value, icon, color }: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Card View Component
function CardViewOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader className="w-6 h-6 animate-spin mx-auto text-[#1E4259]" />
        <p className="mt-2 text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid gap-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} refreshOrders={fetchOrders} />
        ))}
      </div>
    </div>
  );
}