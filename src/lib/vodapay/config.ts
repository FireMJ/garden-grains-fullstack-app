// VodaPay Gateway Configuration - Sandbox Testing
export const VodaPayConfig = {
  // Sandbox Environment (for testing)
  sandbox: {
    apiUrl: 'https://api.vodapaygatewayuat.vodacom.co.za/v2',
    transactionsUrl: 'https://transactionsapi.vodapaygatewayuat.vodacom.co.za/transaction',
    apiKey: process.env.NEXT_PUBLIC_VODAPAY_SANDBOX_API_KEY || 'd605f89b-079c-11ed-b83a-06c42a9d493e',
    test: true,
    merchantId: process.env.NEXT_PUBLIC_VODAPAY_MERCHANT_ID || 'VPS00000000000'
  },
  
  // Current environment (sandbox for testing)
  currentEnv: 'sandbox',
  
  // Currency
  currency: 'ZAR',
  currencyCode: '710', // ZAR ISO code
  
  // Return URLs
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/cancel`,
  notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vodapay/webhook`,
};

// Virtual test cards for Sandbox testing
export const TestCards = {
  approved: {
    number: '4444444444444400',
    responseCode: '00',
    message: 'Approved or completed successfully',
    expiry: '12/25',
    cvv: '123'
  },
  doNotHonour: {
    number: '4444444444444405',
    responseCode: '05',
    message: 'Do not honour',
    expiry: '12/25',
    cvv: '123'
  },
  insufficientFunds: {
    number: '4444444444444451',
    responseCode: '51',
    message: 'Insufficient Funds',
    expiry: '12/25',
    cvv: '123'
  },
  cardExpired: {
    number: '4444444444444454',
    responseCode: '54',
    message: 'Card Expired',
    expiry: '12/20',
    cvv: '123'
  },
  threeDSecureFail: {
    number: '4444444444444499',
    responseCode: '99',
    message: '3DSecure Fail',
    expiry: '12/25',
    cvv: '123'
  },
  systemMalfunction: {
    number: '4444444444444496',
    responseCode: '96',
    message: 'System malfunction',
    expiry: '12/25',
    cvv: '123'
  }
};

// Available payment methods through VodaPay
export const PaymentMethods = {
  CARD: 'CARD',
  INSTANT_EFT: 'INSTANT_EFT',
  QR_CODE: 'QR_CODE',
  DIGITAL_WALLET: 'DIGITAL_WALLET',
  BNPL: 'BNPL'
};

export const getVodaPayHeaders = (testMode: boolean = true) => {
  const config = VodaPayConfig.sandbox;
  
  return {
    'api-key': config.apiKey,
    'test': testMode,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};
