import FixedHeader from '@/components/FixedHeader';
<FixedHeader />
<FixedHeader />

import { useState } from 'react';
import { DollarSign, TrendingUp, Calendar, Download, Filter } from 'lucide-react';

const EARNINGS_DATA = {
  daily: [
    { day: 'Mon', earnings: 320.50 },
    { day: 'Tue', earnings: 280.25 },
    { day: 'Wed', earnings: 410.75 },
    { day: 'Thu', earnings: 380.00 },
    { day: 'Fri', earnings: 520.50 },
    { day: 'Sat', earnings: 610.25 },
    { day: 'Sun', earnings: 480.75 },
  ],
  weekly: [
    { week: 'Week 1', earnings: 2150.25 },
    { week: 'Week 2', earnings: 1980.50 },
    { week: 'Week 3', earnings: 2340.75 },
    { week: 'Week 4', earnings: 1890.25 },
  ],
  monthly: [
    { month: 'Jan', earnings: 8250.50 },
    { month: 'Feb', earnings: 7890.25 },
    { month: 'Mar', earnings: 9120.75 },
    { month: 'Apr', earnings: 8450.00 },
  ],
};

const TRANSACTIONS = [
  { id: 'TXN-001', date: '2024-01-15', description: 'Delivery earnings', amount: 45.00, type: 'credit' },
  { id: 'TXN-002', date: '2024-01-15', description: 'Bonus: Fast delivery', amount: 10.00, type: 'credit' },
  { id: 'TXN-003', date: '2024-01-14', description: 'Delivery earnings', amount: 32.50, type: 'credit' },
  { id: 'TXN-004', date: '2024-01-14', description: 'Cash withdrawal', amount: -200.00, type: 'debit' },
  { id: 'TXN-005', date: '2024-01-13', description: 'Delivery earnings', amount: 38.75, type: 'credit' },
  { id: 'TXN-006', date: '2024-01-13', description: 'Bonus: High rating', amount: 5.00, type: 'credit' },
  { id: 'TXN-007', date: '2024-01-12', description: 'Delivery earnings', amount: 42.00, type: 'credit' },
];

export default function DriverEarningsPage() {
  const [timeframe, setTimeframe] = useState('daily');
  const [period, setPeriod] = useState('week');
  const [balance, setBalance] = useState(1560.25);

  const currentEarnings = EARNINGS_DATA[timeframe as keyof typeof EARNINGS_DATA];
  const maxEarnings = Math.max(...currentEarnings.map(e => e.earnings));

  const handleWithdraw = () => {
    if (balance > 0) {
      alert(`Withdrawal request submitted for R${balance.toFixed(2)}`);
      setBalance(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Earnings</h1>
          <p className="text-gray-600">Track your earnings and withdraw funds</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <p className="text-blue-200 mb-2">Available Balance</p>
              <p className="text-5xl font-bold mb-4">R{balance.toFixed(2)}</p>
              <p className="text-blue-200">
                <TrendingUp className="inline w-5 h-5 mr-1" />
                +12.5% from last week
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <button
                onClick={handleWithdraw}
                disabled={balance <= 0}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  balance <= 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg'
                }`}
              >
                Withdraw Funds
              </button>
              <p className="text-blue-200 text-sm mt-3">Withdrawals processed within 24 hours</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <div className="lg:col-span-2">
            {/* Chart Controls */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Earnings Overview</h2>
                  <p className="text-gray-600">Track your earnings over time</p>
                </div>
                <div className="flex space-x-4 mt-4 md:mt-0">
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>

              {/* Chart */}
              <div className="h-64 flex items-end space-x-2">
                {currentEarnings.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-3/4 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all hover:opacity-90"
                      style={{ height: `${(item.earnings / maxEarnings) * 100}%` }}
                    ></div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium text-gray-900">R{item.earnings.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{item.day || item.week || item.month}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">R8,250.50</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-green-500" />
                </div>
                <p className="text-sm text-green-600 mt-2">+15.2% from last month</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg. per Delivery</p>
                    <p className="text-2xl font-bold text-gray-900">R42.75</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-blue-500" />
                </div>
                <p className="text-sm text-blue-600 mt-2">+R3.50 from last month</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Delivery Count</p>
                    <p className="text-2xl font-bold text-gray-900">193</p>
                  </div>
                  <Calendar className="w-10 h-10 text-purple-500" />
                </div>
                <p className="text-sm text-purple-600 mt-2">+24 deliveries this month</p>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Transactions */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                <button className="flex items-center text-blue-600 hover:text-blue-800">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </button>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto">
                {TRANSACTIONS.map((transaction) => (
                  <div key={transaction.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                        <p className="text-xs text-gray-400 mt-1">{transaction.id}</p>
                      </div>
                      <div className={`text-right ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <p className="font-bold">
                          {transaction.type === 'credit' ? '+' : '-'}R{Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{transaction.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <button className="w-full py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                  View All Transactions
                </button>
              </div>
            </div>

            {/* Withdrawal Info */}
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Withdrawal Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Withdrawal</span>
                  <span className="font-medium">R100.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Time</span>
                  <span className="font-medium">24-48 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Fee</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Tip:</span> Withdraw on Fridays to receive funds before the weekend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
