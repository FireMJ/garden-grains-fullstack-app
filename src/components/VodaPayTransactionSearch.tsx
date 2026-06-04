'use client';

import { useState } from 'react';
import { createSandboxClient, createMockClient } from '@/lib/vodapay/client';
import { toast } from 'react-hot-toast';

export default function VodaPayTransactionSearch() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(true);

  const searchTransactions = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please select both from and to dates');
      return;
    }

    setLoading(true);
    try {
      const client = useMock ? createMockClient() : createSandboxClient();
      const result = await client.searchTransactions(fromDate, toDate, 20, 0);
      
      setTransactions(result.transactions);
      toast.success(`Found ${result.count} transactions`);
    } catch (error) {
      toast.error('Failed to search transactions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'Settled': return 'text-green-600';
      case 'Authorised': return 'text-blue-600';
      case 'Pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex gap-2">
          <button
            onClick={() => setUseMock(true)}
            className={`px-3 py-1 rounded text-sm ${useMock ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Mock Mode
          </button>
          <button
            onClick={() => setUseMock(false)}
            className={`px-3 py-1 rounded text-sm ${!useMock ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Live Sandbox
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <button
        onClick={searchTransactions}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Searching...' : 'Search Transactions'}
      </button>

      {transactions.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-mono text-xs">{tx.id}</p>
                  <p className={`text-sm font-semibold ${getStatusColor(tx.statusType)}`}>{tx.statusType}</p>
                </div>
                <p className="font-bold text-green-600">R{tx.amount.toFixed(2)}</p>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Card: {tx.maskedCardNumber}</p>
                <p>Date: {new Date(tx.dateCreated).toLocaleString()}</p>
                <p>Response: {tx.authBankResponseCode} - {tx.authBankResponseMessage}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
