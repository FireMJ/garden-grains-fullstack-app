"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  userId: string;
  items: any[];
  total: number;
  status: string;
  createdAt: any;
  customerEmail: string;
  customerName: string;
  orderType: string;
}

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkStaffAccess = async () => {
      if (!user) {
        router.push("/auth");
        return;
      }

      try {
        // Check if user is staff by Firestore role or email
        const userDocRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Check if user has staff or admin role
          if (userData.role === "staff" || userData.role === "admin") {
            setIsStaff(true);
            fetchOrders();
          } else {
            router.push("/");
          }
        } else {
          // If no user document, redirect to home
          router.push("/");
        }
      } catch (error) {
        console.error("Error checking staff access:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkStaffAccess();
  }, [user, router]);

  const fetchOrders = async () => {
    try {
      const ordersRef = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersRef);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      // Sort by creation date, newest first
      ordersData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      // Refresh orders to show updated status
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E4259] text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261] mx-auto mb-4"></div>
          <p>Loading staff dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isStaff) {
    return (
      <div className="min-h-screen bg-[#1E4259] text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#F4A261] mb-4">Access Denied</h1>
          <p className="text-gray-300">Staff access required.</p>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');

  return (
    <main className="min-h-screen bg-[#1E4259] text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-[#F4A261]">Staff Dashboard</h1>
            <p className="text-gray-300">Manage kitchen orders and operations</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">Welcome, {user?.name}</span>
            <button
              onClick={handleSignOut}
              className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[#F4A261] mb-2">{orders.length}</div>
            <div className="text-gray-300">Total Orders</div>
          </div>
          <div className="bg-blue-500/20 rounded-xl p-6 text-center border border-blue-500/30">
            <div className="text-3xl font-bold text-blue-300 mb-2">{pendingOrders.length}</div>
            <div className="text-blue-300">Pending</div>
          </div>
          <div className="bg-yellow-500/20 rounded-xl p-6 text-center border border-yellow-500/30">
            <div className="text-3xl font-bold text-yellow-300 mb-2">{preparingOrders.length}</div>
            <div className="text-yellow-300">Preparing</div>
          </div>
          <div className="bg-green-500/20 rounded-xl p-6 text-center border border-green-500/30">
            <div className="text-3xl font-bold text-green-300 mb-2">{readyOrders.length}</div>
            <div className="text-green-300">Ready</div>
          </div>
        </div>

        {/* Orders Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pending Orders */}
          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-300 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Pending Orders ({pendingOrders.length})
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pendingOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusUpdate={updateOrderStatus}
                  availableStatuses={['preparing', 'cancelled']}
                />
              ))}
              {pendingOrders.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No pending orders
                </div>
              )}
            </div>
          </div>

          {/* Preparing Orders */}
          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-yellow-300 flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
              Preparing ({preparingOrders.length})
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {preparingOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusUpdate={updateOrderStatus}
                  availableStatuses={['ready', 'cancelled']}
                />
              ))}
              {preparingOrders.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No orders in preparation
                </div>
              )}
            </div>
          </div>

          {/* Ready Orders */}
          <div className="bg-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-300 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Ready for Pickup ({readyOrders.length})
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {readyOrders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  onStatusUpdate={updateOrderStatus}
                  availableStatuses={['completed', 'cancelled']}
                />
              ))}
              {readyOrders.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No ready orders
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={fetchOrders}
              className="bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition font-semibold"
            >
              Refresh Orders
            </button>
            <button
              onClick={() => window.print()}
              className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition font-semibold"
            >
              Print Kitchen Tickets
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// Order Card Component
function OrderCard({ order, onStatusUpdate, availableStatuses }: { 
  order: Order; 
  onStatusUpdate: (orderId: string, status: string) => void;
  availableStatuses: string[];
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500/20 text-blue-300';
      case 'preparing': return 'bg-yellow-500/20 text-yellow-300';
      case 'ready': return 'bg-green-500/20 text-green-300';
      case 'completed': return 'bg-gray-500/20 text-gray-300';
      case 'cancelled': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getNextStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending': return 'Start Preparing';
      case 'preparing': return 'Mark Ready';
      case 'ready': return 'Complete Order';
      default: return 'Update';
    }
  };

  const nextStatus = availableStatuses[0] === 'cancelled' ? 'cancelled' : 
                   availableStatuses.find(s => s !== 'cancelled') || availableStatuses[0];

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-semibold text-white">Order #{order.id.slice(-6)}</div>
          <div className="text-sm text-gray-300">{order.customerName}</div>
          <div className="text-xs text-gray-400">{order.orderType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}</div>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-gray-300 mb-1">
          {order.items.length} item{order.items.length !== 1 ? 's' : ''} • R{order.total?.toFixed(2)}
        </div>
        <div className="text-xs text-gray-400">
          {order.createdAt?.toDate?.()?.toLocaleTimeString() || 'Time unknown'}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onStatusUpdate(order.id, nextStatus)}
          className="flex-1 bg-[#F4A261] text-white py-2 px-3 rounded text-sm hover:bg-[#e68e42] transition font-semibold"
        >
          {getNextStatusLabel(order.status)}
        </button>
        
        {availableStatuses.includes('cancelled') && (
          <button
            onClick={() => onStatusUpdate(order.id, 'cancelled')}
            className="bg-red-500/20 text-red-300 py-2 px-3 rounded text-sm hover:bg-red-500/30 transition font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
