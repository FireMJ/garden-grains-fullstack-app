'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface TransactionStatus {
  id: string;
  merchantId: string;
  traceId: string;
  amount: number;
  currencyId: string;
  statusType: 'Pending' | 'Authorised' | 'Settled' | 'Cancelled' | 'Refunded' | 'Failed';
  dateCreated: string;
  dateAuthorised?: string;
  dateSettled?: string;
  authBankResponseCode: string;
  authBankResponseMessage: string;
  maskedCardNumber: string;
  paymentToken?: string;
}

export default function VodaPayTransactionChecker() {
  const [transactionId, setTransactionId] = useState('');
  const [transaction, setTransaction] = useState<TransactionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'onceoff' | 'recurring'>('onceoff');
  const [paymentToken, setPaymentToken] = useState('');
  const [recurringData, setRecurringData] = useState<any>(null);

  const checkTransaction = async () => {
    if (!transactionId) {
      toast.error('Please enter a Transaction ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/vodapay/transaction/OnceOff/${transactionId}`, {
        headers: { 'api-key': 'd605f89b-079c-11ed-b83a-06c42a9d493e' }
      });
      const data = await response.json();
      
      if (data.succeeded && data.data) {
        setTransaction(data.data);
        toast.success('Transaction found!');
      } else {
        toast.error('Transaction not found');
        setTransaction(null);
      }
    } catch (error) {
      toast.error('Failed to fetch transaction');
    } finally {
      setLoading(false);
    }
  };

  const checkRecurring = async () => {
    if (!paymentToken) {
      toast.error('Please enter a Payment Token');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/vodapay/transaction/Recurring/${paymentToken}`, {
        headers: { 'api-key': 'd605f89b-079c-11ed-b83a-06c42a9d493e' }
      });
      const data = await response.json();
      
      if (data.succeeded && data.data) {
        setRecurringData(data.data);
        toast.success('Recurring transaction found!');
      } else {
        toast.error('Recurring transaction not found');
        setRecurringData(null);
      }
    } catch (error) {
      toast.error('Failed to fetch recurring transaction');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Settled': return 'text-green-600 bg-green-50';
      case 'Authorised': return 'text-blue-600 bg-blue-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      case 'Failed': return 'text-red-600 bg-red-50';
      case 'Cancelled': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getResponseCodeMessage = (code: string) => {
    const messages: Record<string, string> = {
      '00': 'Approved or completed successfully',
      '05': 'Do not honour',
      '41': 'Payment Token Blocked',
      '51': 'Insufficient Funds',
      '54': 'Payment Token Expired',
      '68': 'Message Timeout',
      '69': 'No Response',
      '91': 'Issuer or switch inoperative',
      '96': 'System malfunction',
      '99': '3DSecure Fail'
    };
    return messages[code] || 'Unknown response code';
  };

  return (
    <div className="space-y-6">
      {/* Search Type Toggle */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setSearchType('onceoff')}
          className={`px-4 py-2 text-sm font-medium transition ${
            searchType === 'onceoff'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Once-Off Transaction
        </button>
        <button
          onClick={() => setSearchType('recurring')}
          className={`px-4 py-2 text-sm font-medium transition ${
            searchType === 'recurring'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Recurring Transaction
        </button>
      </div>

      {/* Once-Off Search */}
      {searchType === 'onceoff' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter Transaction ID (UUID format)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            />
            <button
              onClick={checkTransaction}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Status'}
            </button>
          </div>

          {transaction && (
            <div className={`p-4 rounded-lg ${getStatusColor(transaction.statusType)}`}>
              <h3 className="font-semibold mb-3">Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="opacity-75">Transaction ID:</span>
                  <span className="font-mono text-xs">{transaction.id}</span>
                  
                  <span className="opacity-75">Status:</span>
                  <span className="font-semibold">{transaction.statusType}</span>
                  
                  <span className="opacity-75">Amount:</span>
                  <span>R{transaction.amount.toFixed(2)}</span>
                  
                  <span className="opacity-75">Card Used:</span>
                  <span>{transaction.maskedCardNumber}</span>
                  
                  <span className="opacity-75">Response Code:</span>
                  <span>
                    {transaction.authBankResponseCode} - {getResponseCodeMessage(transaction.authBankResponseCode)}
                  </span>
                  
                  <span className="opacity-75">Response Message:</span>
                  <span>{transaction.authBankResponseMessage}</span>
                  
                  <span className="opacity-75">Created:</span>
                  <span>{new Date(transaction.dateCreated).toLocaleString()}</span>
                  
                  {transaction.dateSettled && (
                    <>
                      <span className="opacity-75">Settled:</span>
                      <span>{new Date(transaction.dateSettled).toLocaleString()}</span>
                    </>
                  )}
                  
                  <span className="opacity-75">Trace ID:</span>
                  <span className="font-mono text-xs">{transaction.traceId}</span>
                  
                  {transaction.paymentToken && (
                    <>
                      <span className="opacity-75">Payment Token:</span>
                      <span className="font-mono text-xs">{transaction.paymentToken}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recurring Search */}
      {searchType === 'recurring' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={paymentToken}
              onChange={(e) => setPaymentToken(e.target.value)}
              placeholder="Enter Payment Token"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
            />
            <button
              onClick={checkRecurring}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Recurring'}
            </button>
          </div>

          {recurringData && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-3">Recurring Transaction Details</h3>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="opacity-75">Payment Token:</span>
                  <span className="font-mono text-xs">{recurringData.paymentToken}</span>
                  
                  <span className="opacity-75">Once-Off Amount:</span>
                  <span>R{recurringData.onceOffAmount.toFixed(2)}</span>
                  
                  <span className="opacity-75">Last Transaction:</span>
                  <span>R{recurringData.lastTransactionAmount.toFixed(2)}</span>
                  
                  <span className="opacity-75">Number of Transactions:</span>
                  <span>{recurringData.numberOfRecurringTransactions}</span>
                  
                  <span className="opacity-75">Card Used:</span>
                  <span>{recurringData.maskedCardNumber}</span>
                  
                  <span className="opacity-75">Created:</span>
                  <span>{new Date(recurringData.dateCreated).toLocaleString()}</span>
                  
                  <span className="opacity-75">Last Transaction Date:</span>
                  <span>{new Date(recurringData.lastTransactionDate).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test Cards Reference */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">Test Cards Response Codes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <div className="p-2 bg-green-50 rounded"><span className="font-mono">4444444444444400</span><br /><span className="text-green-600">00 - Approved</span></div>
          <div className="p-2 bg-red-50 rounded"><span className="font-mono">4444444444444405</span><br /><span className="text-red-600">05 - Do not honour</span></div>
          <div className="p-2 bg-red-50 rounded"><span className="font-mono">4444444444444441</span><br /><span className="text-red-600">41 - Token Blocked</span></div>
          <div className="p-2 bg-red-50 rounded"><span className="font-mono">4444444444444451</span><br /><span className="text-red-600">51 - Insufficient Funds</span></div>
          <div className="p-2 bg-red-50 rounded"><span className="font-mono">4444444444444454</span><br /><span className="text-red-600">54 - Card Expired</span></div>
          <div className="p-2 bg-red-50 rounded"><span className="font-mono">4444444444444499</span><br /><span className="text-red-600">99 - 3DSecure Fail</span></div>
        </div>
      </div>
    </div>
  );
}
