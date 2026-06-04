'use server';

import { createVodaPayAPI, PaymentRequest } from '@/lib/vodapay/api';

export async function initiateVodaPayPayment(paymentData: PaymentRequest) {
  try {
    const api = createVodaPayAPI(paymentData.testApiKey);
    const result = await api.initiatePayment(paymentData);
    return result;
  } catch (error) {
    console.error('Server action payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed'
    };
  }
}

export async function getVodaPayTransactionStatus(transactionId: string, apiKey?: string) {
  try {
    const api = createVodaPayAPI(apiKey);
    const status = await api.getTransactionStatus(transactionId);
    return status;
  } catch (error) {
    console.error('Server action status error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get status'
    };
  }
}
