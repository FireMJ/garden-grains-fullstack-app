"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Order {
  id: string;
  user?: { email?: string };
  total: number;
  status: string;
  scheduledFor?: string;
}

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "orders"));
      const data: Order[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <table className="w-full border border-gray-200 rounded-md">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Order ID</th>
          <th className="p-2 border">User</th>
          <th className="p-2 border">Total</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Scheduled</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="text-center">
            <td className="p-2 border">{order.id}</td>
            <td className="p-2 border">{order.user?.email || "-"}</td>
            <td className="p-2 border">R{order.total.toFixed(2)}</td>
            <td
              className={`p-2 border font-bold ${
                order.status === "paid"
                  ? "text-green-600"
                  : order.status === "failed"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {order.status.toUpperCase()}
            </td>
            <td className="p-2 border">
              {order.scheduledFor ? new Date(order.scheduledFor).toLocaleString() : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
