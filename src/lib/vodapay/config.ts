export const VodaPayConfig = {
  sandbox: {
    apiUrl: 'https://api.vodapaygatewayuat.vodacom.co.za/v2',
    apiKey: process.env.NEXT_PUBLIC_VODAPAY_SANDBOX_API_KEY || 'd605f89b-079c-11ed-b83a-06c42a9d493e',
    test: true
  },
  currentEnv: 'sandbox',
  currency: 'ZAR',
  merchantId: process.env.NEXT_PUBLIC_VODAPAY_MERCHANT_ID || 'VPS00000000000',
};
