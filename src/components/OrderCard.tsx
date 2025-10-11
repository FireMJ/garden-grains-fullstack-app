"use client";

import React, { useState } from "react";
import { Package, CheckCircle, Loader, Truck, XCircle } from "lucide-react";

interface Order {
  id: string;
  customerName?: string;
  items: { name: string; quantity: number }[];
  total: number;
  status: string;
  deliveryStatus: string;
  createdAt: string;
  deliveredAt?: string | null;
}

export default function OrderCard({
  order,
  refreshOrders,
}: {
  order: Order;
  refreshOrders: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDeliveryUpdate = async (status: "IN_TRANSIT" | "DELIVERED") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${order.id}/deliver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update delivery status");
      refreshOrders();
    } catch (err) {
      console.error(err);
      alert("Could not update delivery status");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-800",
    READY: "bg-blue-100 text-blue-800",
    OUT_FOR_DELIVERY: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  }[order.status] || "bg-gray-100 text-gray-700";

  const deliveryColor = {
    PENDING: "bg-yellow-50 text-yellow-600",
    IN_TRANSIT: "bg-purple-50 text-purple-600",
    DELIVERED: "bg-green-50 text-green-600",
  }[order.deliveryStatus] || "bg-gray-50 text-gray-600";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Order #{order.id.slice(0, 6).toUpperCase()}
          </h2>
          <p className="text-sm text-gray-500">
            {order.customerName || "Walk-in"} ·{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
            {order.status.replaceAll("_", " ")}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${deliveryColor}`}>
            {order.deliveryStatus.replaceAll("_", " ")}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 my-3" />

      <ul className="space-y-1 mb-3">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between text-gray-700 text-sm">
            <span>{item.name}</span>
            <span>x{item.quantity}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-800">
          Total: R{order.total.toFixed(2)}
        </p>

        <div className="flex gap-2">
          {order.deliveryStatus === "PENDING" && (
            <button
              onClick={() => handleDeliveryUpdate("IN_TRANSIT")}
              disabled={loading}
              className="flex items-center gap-1 bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600 text-sm"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
              Mark In Transit
            </button>
          )}

          {order.deliveryStatus === "IN_TRANSIT" && (
            <button
              onClick={() => handleDeliveryUpdate("DELIVERED")}
              disabled={loading}
              className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Mark Delivered
            </button>
          )}
        </div>
      </div>

      {order.deliveredAt && (
        <p className="mt-2 text-sm text-gray-500">
          Delivered At: {new Date(order.deliveredAt).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
