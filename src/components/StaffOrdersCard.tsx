"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Order, OrderStatus } from "@prisma/client";
import { Check, Loader, X } from "lucide-react";
import { toast } from "sonner";

interface StaffOrdersCardProps {}

export default function StaffOrdersCard({}: StaffOrdersCardProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // SSE connection for live orders
  useEffect(() => {
    const eventSource = new EventSource("/api/orders/stream");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setOrders(data);
      setLoading(false);

      // 🔔 Show toast when a new PENDING order comes in
      const newOrder = data.find((o: Order) => o.status === "PENDING");
      if (newOrder) {
        toast.success(`🛎️ New Order #${newOrder.id}`, {
          description: `Total: R${newOrder.total.toFixed(2)}`,
          duration: 5000,
          className: "bg-green-600 text-white text-lg font-bold shadow-lg",
        });
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );

      // 🎨 Distinctive themed toasts
      if (status === "PREPARING") {
        toast.info(`👨‍🍳 Order #${orderId} is now PREPARING`, {
          className: "bg-blue-600 text-white font-semibold text-lg shadow-lg",
        });
      } else if (status === "COMPLETED") {
        toast.success(`✅ Order #${orderId} COMPLETED`, {
          className: "bg-green-700 text-white font-bold text-lg shadow-lg",
        });
      } else if (status === "CANCELLED") {
        toast.error(`❌ Order #${orderId} CANCELLED`, {
          className: "bg-red-700 text-white font-bold text-lg shadow-lg",
        });
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("⚠️ Failed to update order status", {
        className: "bg-orange-600 text-white font-semibold",
      });
    }
  };

  if (loading) return <div>Loading staff orders...</div>;
  if (!orders.length) return <div>No orders at the moment.</div>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="p-4 border rounded-lg bg-white shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Order #{order.id}</span>
            <span
              className={`px-2 py-1 rounded text-sm ${
                order.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : order.status === "PREPARING"
                  ? "bg-blue-100 text-blue-800"
                  : order.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="text-sm text-gray-700 mb-2">
            <strong>Total:</strong> R{order.total.toFixed(2)}
          </div>

          <div className="text-sm text-gray-600 mb-2">
            <strong>Scheduled:</strong>{" "}
            {order.scheduledAt
              ? new Date(order.scheduledAt).toLocaleString()
              : "ASAP"}
          </div>

          <div className="mb-2">
            <strong>Items:</strong>
            <ul className="pl-4 list-disc text-gray-600">
              {order.items.map((item: any) => (
                <li key={item.id}>
                  {item.name} × {item.quantity}{" "}
                  {item.addOns && item.addOns.length > 0 && (
                    <span className="text-xs text-gray-500">
                      (Add-ons: {JSON.stringify(item.addOns)})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            {order.status === "PENDING" && (
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm flex items-center gap-1"
                onClick={() => updateOrderStatus(order.id, "PREPARING")}
              >
                <Loader className="w-4 h-4 animate-spin" />
                Start Preparing
              </button>
            )}
            {order.status === "PREPARING" && (
              <button
                className="px-3 py-1 bg-green-600 text-white rounded text-sm flex items-center gap-1"
                onClick={() => updateOrderStatus(order.id, "COMPLETED")}
              >
                <Check className="w-4 h-4" />
                Mark Completed
              </button>
            )}
            <button
              className="px-3 py-1 bg-red-600 text-white rounded text-sm flex items-center gap-1"
              onClick={() => updateOrderStatus(order.id, "CANCELLED")}
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
