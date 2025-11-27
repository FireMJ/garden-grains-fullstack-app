"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase/config";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
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
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        router.push("/auth");
        return;
      }

      try {
        // Check if user is admin by email or Firestore role
        const userDocRef = doc(db, "users", user.id);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Check if user has admin role or is the admin email
          if (userData.role === "admin" || user.email === process.env.ADMIN_EMAIL) {
            setIsAdmin(true);
            fetchOrders();
          } else {
            router.push("/");
          }
        } else {
          // If no user document, check if it's the admin email
          if (user.email === process.env.ADMIN_EMAIL) {
            setIsAdmin(true);
            fetchOrders();
          } else {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
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
      // In a real app, you would update the order status in Firestore
      console.log(`Updating order ${orderId} to status: ${newStatus}`);
      // await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      
      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E4259] text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4A261] mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#1E4259] text-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#F4A261] mb-4">Access Denied</h1>
          <p className="text-gray-300">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#1E4259] text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-[#F4A261]">Admin Dashboard</h1>
          <p className="text-gray-300">Manage orders and restaurant operations</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[#F4A261] mb-2">{orders.length}</div>
            <div className="text-gray-300">Total Orders</div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[#F4A261] mb-2">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-gray-300">Pending</div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[#F4A261] mb-2">
              {orders.filter(o => o.status === 'preparing').length}
            </div>
            <div className="text-gray-300">Preparing</div>
          </div>
          <div className="bg-white/10 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[#F4A261] mb-2">
              {orders.filter(o => o.status === 'completed').length}
            </div>
            <div className="text-gray-300">Completed</div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/10 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-6 text-white">Recent Orders</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-300">
              <div className="text-6xl mb-4">📦</div>
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-gray-300">Order ID</th>
                    <th className="text-left py-3 px-4 text-gray-300">Customer</th>
                    <th className="text-left py-3 px-4 text-gray-300">Items</th>
                    <th className="text-left py-3 px-4 text-gray-300">Total</th>
                    <th className="text-left py-3 px-4 text-gray-300">Status</th>
                    <th className="text-left py-3 px-4 text-gray-300">Date</th>
                    <th className="text-left py-3 px-4 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div className="font-mono text-xs text-gray-300">
                          {order.id.slice(-8)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{order.customerName}</div>
                        <div className="text-xs text-gray-400">{order.customerEmail}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-300">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#F4A261]">
                          R{order.total?.toFixed(2) || '0.00'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' 
                            ? 'bg-green-500/20 text-green-300'
                            : order.status === 'preparing'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-300">
                        {order.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#F4A261]"
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white/10 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-white">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={fetchOrders}
              className="bg-[#F4A261] text-white px-6 py-3 rounded-lg hover:bg-[#e68e42] transition font-semibold"
            >
              Refresh Orders
            </button>
            <button
              onClick={() => router.push('/menu')}
              className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition font-semibold"
            >
              View Menu
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition font-semibold"
            >
              View Site
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
