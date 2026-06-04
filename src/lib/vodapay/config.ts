export const VodaPayConfig = {
  // Sandbox Environment (Testing with virtual test cards)
  sandbox: {
    apiUrl: 'https://api.vodapaygatewayuat.vodacom.co.za/v2',
    transactionsUrl: 'https://transactionsapi.vodapaygatewayuat.vodacom.co.za/transaction',
    // Use one of the provided virtual test API keys
    apiKey: process.env.NEXT_PUBLIC_VODAPAY_SANDBOX_API_KEY || 'd605f89b-079c-11ed-b83a-06c42a9d493e',
    merchantId: process.env.NEXT_PUBLIC_VODAPAY_SANDBOX_MERCHANT_ID || 'VPS00000000000',
    test: true
  },
  
  // Current environment (sandbox for testing)
  currentEnv: 'sandbox',
  
  // Test Cards for Sandbox
  testCards: {
    approved: {
      number: '4444444444444400',
      response: '00 - Approved',
      message: 'Approved or completed successfully'
    },
    doNotHonour: {
      number: '4444444444444405', 
      response: '05 - Do not honour',
      message: 'Do not honour'
    },
    insufficientFunds: {
      number: '4444444444444451',
      response: '51 - Insufficient Funds', 
      message: 'Insufficient Funds'
    },
    cardExpired: {
      number: '4444444444444454',
      response: '54 - Payment Token Expired',
      message: 'Payment Token Expired'
    },
    threeDSecureFail: {
      number: '4444444444444499',
      response: '99 - 3DSecure Fail',
      message: '3DSecure Fail'
    },
    systemMalfunction: {
      number: '4444444444444496',
      response: '96 - System malfunction',
      message: 'System malfunction'
    }
  },

  // Virtual Test API Keys
  testApiKeys: [
    'd605f89b-079c-11ed-b83a-06c42a9d493e',
    'd60d60ab-079c-11ed-b83a-06c42a9d493e',
    'd6135e0e-079c-11ed-b83a-06c42a9d493e',
    'd61964f8-079c-11ed-b83a-06c42a9d493e',
    'd61f77bf-079c-11ed-b83a-06c42a9d493e',
    'd6266bcd-079c-11ed-b83a-06c42a9d493e',
    'd62c1dd5-079c-11ed-b83a-06c42a9d493e',
    'd632a880-079c-11ed-b83a-06c42a9d493e',
    'd638a39d-079c-11ed-b83a-06c42a9d493e',
    'd63eb719-079c-11ed-b83a-06c42a9d493e'
  ],
  
  // Currency
  currency: 'ZAR',
  currencyCode: '710',
  
  // Session timeout (15 minutes)
  sessionTimeout: 15 * 60 * 1000,
  
  isSandbox: () => true,
  
  getEndpoint: (path: string) => `https://api.vodapaygatewayuat.vodacom.co.za/v2${path}`,
  getTransactionsEndpoint: () => 'https://transactionsapi.vodapaygatewayuat.vodacom.co.za/transaction'
};
