"use client";

import { useState } from 'react';
import { Package, Clock, MapPin, DollarSign, CheckCircle, XCircle } from 'lucide-react';

const ORDERS_HISTORY = [
  {
    id: 'ORD-789001',
    date: '2024-01-15',
    time: '10:30 AM',
    restaurant: 'Garden Grains - Observatory',
    customer: 'Sarah M.',
    status: 'completed',
    earnings: 45.00,
    distance: 3.2,
    duration: '25 min',
    rating: 5
  },
  {
    id: 'ORD-789002',
    date: '2024-01-15',
    time: '11:45 AM',
    restaurant: 'Garden Grains - City Bowl',
    customer: 'John D.',
    status: 'completed',
    earnings: 32.50,
    distance: 2.8,
    duration: '20 min',
    rating: 4
  },
  {
    id: 'ORD-789003',
    date: '2024-01-14',
    time: '02:15 PM',
    restaurant: 'Garden Grains - Sea Point',
    customer: 'Emily R.',
    status: 'completed',
    earnings: 38.75,
    distance: 4.5,
    duration: '35 min',
    rating: 5
  },
  {
    id: 'ORD-789004',
    date: '2024-01-14',
    time: '06:30 PM',
    restaurant: 'Garden Grains - Observatory',
    customer: 'Michael T.',
    status: 'completed',
    earnings: 42.00,
    distance: 3.8,
    duration: '28 min',
    rating: 4
  },
  {
    id: 'ORD-789005',
    date: '2024-01-13',
    time: '12:45 PM',
    restaurant: 'Garden Grains - City Bowl',
    customer: 'Jessica L.',
    status: 'cancelled',
    earnings: 0.00,
    distance: 1.5,
    duration: 'N/A',
    rating: null
  },
  {
    id: 'ORD-789006',
    date: '2024-01-13',
    time: '08:15 PM',
    restaurant: 'Garden Grains - Sea Point',
    customer: 'David K.',
    status: 'completed',
    earnings: 40.50,
    distance: 5.2,
    duration: '40 min',
    rating: 5
  },
];

export default function DriverOrdersPage() {
  const [timeFilter, setTimeFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = ORDERS_HISTORY.filter(order => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  }).filter(order => {
    if (timeFilter === 'all') return true;
    if (timeFilter === 'today') return order.date === '2024-01-15';
    if (timeFilter === 'week') return true; // Simplified for demo
    return true;
  });

  const totalEarnings = filteredOrders.reduce((sum, order) => sum + order.earnings, 0);
  const completedOrders = filteredOrders.filter(order => order.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track your past deliveries and earnings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-3xl font-bold text-gray-900">R{totalEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed Orders</p>
                <p className="text-3xl font-bold text-gray-900">{completedOrders}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900">4.8</p>
              </div>
              <div className="flex">
                <span className="text-yellow-500 text-2xl">★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="block w-full md:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full md:w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <button className="self-end px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{order.id}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{order.restaurant}</p>
                        <p className="text-xs text-gray-400">{order.date} • {order.time}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      {order.rating && (
                        <div className="flex items-center mt-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm text-gray-600 ml-1">{order.rating}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-900">{order.distance} km</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-900">{order.duration}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <DollarSign className="w-5 h-5 text-green-500 mr-2" />
                        <span className="font-bold text-green-600">R{order.earnings.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.status === 'completed' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders found for the selected filters.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredOrders.length} of {ORDERS_HISTORY.length} orders
          </p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
