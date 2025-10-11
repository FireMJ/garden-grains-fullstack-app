"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Fetch initially and every 60s
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
            <td className="p-2 border">{order.user?.email}</td>
            <td className="p-2 border">R{order.total.toFixed(2)}</td>
            <td className={`p-2 border font-bold ${order.status === 'paid' ? 'text-green-600' : order.status === 'failed' ? 'text-red-600' : 'text-yellow-600'}`}>
              {order.status.toUpperCase()}
            </td>
            <td className="p-2 border">{order.scheduledFor ? new Date(order.scheduledFor).toLocaleString() : "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
