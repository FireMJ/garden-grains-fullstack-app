export interface VodaPayCallbackData {
  echoData: string;
  sessionId: string;
  responseCode: string;
  responseMessage: string;
  paymentToken?: string | null;
  retrievalReferenceNumber?: string;
  retrievalReferenceNumberExtended?: string;
  merchantId?: string;
  merchantName?: string;
  transactionAmount: number;
  currencyCode?: string;
  transactionId: string;
  paymentMethod?: string;
  transmissionDateTime?: string;
  assuranceData?: string;
  traceId?: string;
}

// Test card response mapping
export const TEST_CARD_RESPONSES: Record<string, { code: string; message: string; description: string }> = {
  '4444444444444400': { code: '00', message: 'Approved or completed successfully', description: 'Successful transaction - Payment approved' },
  '4444444444444405': { code: '05', message: 'Do not honour', description: 'Card declined - Do not honour' },
  '4444444444444441': { code: '41', message: 'Payment Token Blocked', description: 'Payment token has been blocked' },
  '4444444444444451': { code: '51', message: 'Insufficient Funds', description: 'Insufficient funds on card' },
  '4444444444444454': { code: '54', message: 'Payment Token Expired', description: 'Payment token has expired' },
  '4444444444444468': { code: '68', message: 'Message Timeout', description: 'Request timed out' },
  '4444444444444469': { code: '69', message: 'No Response', description: 'No response from issuer' },
  '4444444444444491': { code: '91', message: 'Issuer or switch inoperative', description: 'Issuer unavailable' },
  '4444444444444496': { code: '96', message: 'System malfunction', description: 'System error' },
  '4444444444444499': { code: '99', message: '3DSecure Fail', description: '3D Secure verification failed' }
};

export function parseVodaPayCallback(encodedData: string): VodaPayCallbackData | null {
  try {
    const decoded = Buffer.from(encodedData, 'base64').toString('utf-8');
    console.log('Decoded callback data:', decoded.substring(0, 200));
    
    const parsed = JSON.parse(decoded);
    
    return {
      echoData: parsed.echoData || '',
      sessionId: parsed.sessionId || '',
      responseCode: parsed.responseCode || '',
      responseMessage: parsed.responseMessage || '',
      paymentToken: parsed.paymentToken || null,
      retrievalReferenceNumber: parsed.retrievalReferenceNumber,
      retrievalReferenceNumberExtended: parsed.retrievalReferenceNumberExtended,
      merchantId: parsed.merchantId,
      merchantName: parsed.merchantName,
      transactionAmount: parsed.transactionAmount || 0,
      currencyCode: parsed.currencyCode,
      transactionId: parsed.transactionId || '',
      paymentMethod: parsed.paymentMethod,
      transmissionDateTime: parsed.transmissionDateTime,
      assuranceData: parsed.assuranceData,
      traceId: parsed.traceId
    };
  } catch (error) {
    console.error('Failed to parse VodaPay callback:', error);
    return null;
  }
}

export function centsToRands(cents: number): number {
  return cents / 100;
}

export function formatAmount(cents: number): string {
  return `R${(cents / 100).toFixed(2)}`;
}

export function getTestCardInfo(responseCode: string): { cardNumber: string; description: string } | null {
  for (const [cardNumber, info] of Object.entries(TEST_CARD_RESPONSES)) {
    if (info.code === responseCode) {
      return { cardNumber, description: info.description };
    }
  }
  return null;
}

export function getPaymentStatus(responseCode: string): { status: string; message: string; isSuccess: boolean; color: string } {
  const statusMap: Record<string, { status: string; message: string; isSuccess: boolean; color: string }> = {
    '00': { status: 'Settled', message: 'Payment successful', isSuccess: true, color: 'green' },
    '05': { status: 'Failed', message: 'Do not honour', isSuccess: false, color: 'red' },
    '41': { status: 'Failed', message: 'Payment Token Blocked', isSuccess: false, color: 'red' },
    '51': { status: 'Failed', message: 'Insufficient Funds', isSuccess: false, color: 'red' },
    '54': { status: 'Failed', message: 'Payment Token Expired', isSuccess: false, color: 'orange' },
    '68': { status: 'Failed', message: 'Message Timeout', isSuccess: false, color: 'orange' },
    '69': { status: 'Failed', message: 'No Response', isSuccess: false, color: 'orange' },
    '91': { status: 'Failed', message: 'Issuer inoperative', isSuccess: false, color: 'red' },
    '96': { status: 'Failed', message: 'System malfunction', isSuccess: false, color: 'red' },
    '99': { status: 'Failed', message: '3DSecure Fail', isSuccess: false, color: 'red' }
  };
  return statusMap[responseCode] || { status: 'Unknown', message: 'Unknown response', isSuccess: false, color: 'gray' };
}
