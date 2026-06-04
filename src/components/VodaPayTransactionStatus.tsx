'use client';

import { useState } from 'react';
import { createSandboxClient, createMockClient } from '@/lib/vodapay/client';
import { toast } from 'react-hot-toast';

interface VodaPayTransactionStatusProps {
  transactionId: string;
  onStatusUpdate?: (status: any) => void;
}

export default function VodaPayTransactionStatus({ transactionId, onStatusUpdate }: VodaPayTransactionStatusProps) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(true);

  const checkTransaction = async () => {
    setLoading(true);
    try {
      const client = useMock ? createMockClient() : createSandboxClient();
      const result = await client.getTransaction(transactionId);
      
      if (result.success && result.transaction) {
        setStatus(result.transaction);
        onStatusUpdate?.(result.transaction);
        toast.success('Transaction found!');
      } else {
        toast.error(result.error || 'Transaction not found');
      }
    } catch (error) {
      toast.error('Failed to check transaction');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'Settled': return 'text-green-600 bg-green-50';
      case 'Authorised': return 'text-blue-600 bg-blue-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      case 'Cancelled': return 'text-red-600 bg-red-50';
      case 'Refunded': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium">Transaction ID:</span>
        <code className="text-xs bg-gray-200 px-2 py-1 rounded">{transactionId}</code>
      </div>

      <div className="flex items-center justify-between">
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
        <button
          onClick={checkTransaction}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check Status'}
        </button>
      </div>

      {status && (
        <div className={`p-4 rounded-lg ${getStatusColor(status.statusType)}`}>
          <h3 className="font-semibold mb-3">Transaction Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="opacity-75">Transaction ID:</span>
              <span className="font-mono">{status.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Status:</span>
              <span className="font-semibold">{status.statusType}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Amount:</span>
              <span>R{status.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Card Used:</span>
              <span>{status.maskedCardNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Response Code:</span>
              <span>{status.authBankResponseCode} - {status.authBankResponseMessage}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-75">Date:</span>
              <span>{new Date(status.dateCreated).toLocaleString()}</span>
            </div>
            {status.dateSettled && (
              <div className="flex justify-between">
                <span className="opacity-75">Settled Date:</span>
                <span>{new Date(status.dateSettled).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="opacity-75">Trace ID:</span>
              <span className="font-mono text-xs">{status.traceId}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
