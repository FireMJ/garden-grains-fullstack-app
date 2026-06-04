'use client';

import { useState } from 'react';
import { FaPrint, FaTimes, FaPause, FaTrash, FaCheck, FaSpinner, FaMotorcycle, FaUserCheck } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface OrderDetailModalProps {
  order: any;
  onClose: () => void;
  onOrderUpdate: () => void;
}

export default function OrderDetailModal({ order, onClose, onOrderUpdate }: OrderDetailModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDateTime = (date: any) => {
    if (!date) return 'Pending';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleString();
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
      <html>
        <head>
          <title>Order #${order.id.slice(-8)} - Garden & Grains</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; border-bottom: 2px solid #2F5D50; padding-bottom: 20px; margin-bottom: 20px; }
            .order-info { margin-bottom: 20px; }
            .items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items th, .items td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Garden & Grains</h1>
            <p>Order Receipt</p>
          </div>
          <div class="order-info">
            <p><strong>Order #:</strong> ${order.id.slice(-8)}</p>
            <p><strong>Customer:</strong> ${order.customerName}</p>
            <p><strong>Date:</strong> ${formatDateTime(order.createdAt)}</p>
            <p><strong>Type:</strong> ${order.orderType === 'delivery' ? 'Delivery' : 'Pickup'}</p>
            ${order.deliveryAddress ? `<p><strong>Address:</strong> ${order.deliveryAddress}</p>` : ''}
          </div>
          <table class="items">
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${order.items?.map((item: any) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>R${item.price.toFixed(2)}</td>
                  <td>R${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p><strong>Total: R${order.total?.toFixed(2)}</strong></p>
          </div>
          <div class="footer">
            <p>Thank you for choosing Garden & Grains!</p>
          </div>
        </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  const handleRejectOrder = async () => {
    if (confirm('Are you sure you want to reject this order? This action cannot be undone.')) {
      setIsProcessing(true);
      try {
        const orderRef = doc(db, 'orders', order.id);
        await updateDoc(orderRef, {
          status: 'rejected',
          rejectedAt: new Date(),
          rejectionReason: 'Rejected by kitchen'
        });
        toast.success(`Order #${order.id.slice(-6)} rejected`);
        onOrderUpdate();
        onClose();
      } catch (error) {
        console.error('Error rejecting order:', error);
        toast.error('Failed to reject order');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handlePauseOrder = async () => {
    if (confirm('Pause this order? You can resume it later.')) {
      setIsProcessing(true);
      try {
        const orderRef = doc(db, 'orders', order.id);
        await updateDoc(orderRef, {
          status: 'paused',
          pausedAt: new Date()
        });
        toast.success(`Order #${order.id.slice(-6)} paused`);
        onOrderUpdate();
        onClose();
      } catch (error) {
        console.error('Error pausing order:', error);
        toast.error('Failed to pause order');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleResumeOrder = async () => {
    setIsProcessing(true);
    try {
      const orderRef = doc(db, 'orders', order.id);
      await updateDoc(orderRef, {
        status: 'accepted',
        resumedAt: new Date()
      });
      toast.success(`Order #${order.id.slice(-6)} resumed`);
      onOrderUpdate();
      onClose();
    } catch (error) {
      console.error('Error resuming order:', error);
      toast.error('Failed to resume order');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      preparing: 'bg-orange-100 text-orange-800',
      ready: 'bg-green-100 text-green-800',
      picked_up: 'bg-purple-100 text-purple-800',
      delivered: 'bg-emerald-100 text-emerald-800',
      rejected: 'bg-red-100 text-red-800',
      paused: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Order Details</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Order Status Badge */}
          <div className="mb-4 flex justify-between items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.status)}`}>
              {order.status?.toUpperCase()}
            </span>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <FaPrint /> Print
            </button>
          </div>

          {/* Order Info */}
          <div className="space-y-3 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Order ID</p>
                <p className="font-mono font-medium">#{order.id.slice(-8)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Order Type</p>
                <p>{order.orderType === 'delivery' ? '🚚 Delivery' : '📦 Pickup'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Customer</p>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p>{order.customerPhone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Order Date</p>
                <p>{formatDateTime(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="font-bold text-green-600">R{order.total?.toFixed(2)}</p>
              </div>
            </div>

            {order.deliveryAddress && (
              <div>
                <p className="text-xs text-gray-500">Delivery Address</p>
                <p className="text-sm">{order.deliveryAddress}</p>
              </div>
            )}

            {order.specialInstructions && (
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-yellow-800">Special Instructions:</p>
                <p className="text-sm text-yellow-700">{order.specialInstructions}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">R{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-green-600">R{order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Order Timeline</h3>
            <div className="space-y-2">
              {order.createdAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Placed</span>
                  <span>{formatDateTime(order.createdAt)}</span>
                </div>
              )}
              {order.acceptedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Accepted</span>
                  <span>{formatDateTime(order.acceptedAt)}</span>
                </div>
              )}
              {order.prepStartTime && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Preparation Started</span>
                  <span>{formatDateTime(order.prepStartTime)}</span>
                </div>
              )}
              {order.readyAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ready</span>
                  <span>{formatDateTime(order.readyAt)}</span>
                </div>
              )}
              {order.pickedUpAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Picked Up</span>
                  <span>{formatDateTime(order.pickedUpAt)}</span>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivered</span>
                  <span>{formatDateTime(order.deliveredAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {order.status === 'pending' && (
              <>
                <button
                  onClick={handleRejectOrder}
                  disabled={isProcessing}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <FaTrash /> Reject Order
                </button>
                <button
                  onClick={handlePauseOrder}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2"
                >
                  <FaPause /> Pause Order
                </button>
              </>
            )}
            {order.status === 'paused' && (
              <button
                onClick={handleResumeOrder}
                disabled={isProcessing}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <FaCheck /> Resume Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
