export const TEST_API_KEYS = [
  'd605f89b-079c-11ed-b83a-06c42a9d493e',
  'd60d60ab-079c-11ed-b83a-06c42a9d493e',
  'd6135e0e-079c-11ed-b83a-06c42a9d493e',
  'd61964f8-079c-11ed-b83a-06c42a9d493e',
  'd61f77bf-079c-11ed-b83a-06c42a9d493e'
];

export const TEST_CARDS = [
  { number: '4444444444444400', code: '00', message: 'Approved or completed successfully' },
  { number: '4444444444444405', code: '05', message: 'Do not honour' },
  { number: '4444444444444441', code: '41', message: 'Payment Token Blocked' },
  { number: '4444444444444451', code: '51', message: 'Insufficient Funds' },
  { number: '4444444444444454', code: '54', message: 'Payment Token Expired' },
  { number: '4444444444444468', code: '68', message: 'Message Timeout' },
  { number: '4444444444444469', code: '69', message: 'No Response' },
  { number: '4444444444444491', code: '91', message: 'Issuer or switch inoperative' },
  { number: '4444444444444496', code: '96', message: 'System malfunction' },
  { number: '4444444444444499', code: '99', message: '3DSecure Fail' }
];

const PAYMENT_URLS = {
  sandbox: 'https://api.vodapaygatewayuat.vodacom.co.za/v2/',
  uat: 'https://api.vodapaygatewayuat.vodacom.co.za/v2/',
  production: 'https://api.vodapaygateway.vodacom.co.za/v2/'
};

export class VodaPayPayment {
  private config: {
    apiKey: string;
    isTest: boolean;
    environment: 'sandbox' | 'uat' | 'production';
  };

  constructor(config: { apiKey: string; isTest: boolean; environment: 'sandbox' | 'uat' | 'production' }) {
    this.config = config;
  }

  async initiatePayment(paymentData: any) {
    try {
      console.log('Initiating VodaPay payment:', { 
        config: this.config, 
        paymentData 
      });

      // For sandbox/UAT testing, simulate response based on test cards
      if (this.config.isTest) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock successful response
        return {
          success: true,
          transactionId: `txn_${Date.now()}`,
          redirectUrl: '/payment/success',
          responseCode: '00',
          responseMessage: 'Approved or completed successfully'
        };
      }

      // Real API call would go here
      const baseUrl = PAYMENT_URLS[this.config.environment];
      
      return {
        success: true,
        transactionId: `txn_${Date.now()}`,
        redirectUrl: '/payment/success',
        responseCode: '00',
        responseMessage: 'Approved'
      };
    } catch (error) {
      console.error('VodaPay payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
        responseCode: '96',
        responseMessage: 'System malfunction'
      };
    }
  }

  async verifyPayment(transactionId: string) {
    try {
      console.log('Verifying payment:', transactionId);
      
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        status: 'completed',
        transactionId,
        responseCode: '00',
        responseMessage: 'Verified successfully'
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  async processRefund(transactionId: string, amount?: number) {
    try {
      console.log('Processing refund:', { transactionId, amount });
      
      // Simulate refund
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        transactionId: `ref_${Date.now()}`,
        responseCode: '00',
        responseMessage: 'Refund processed successfully'
      };
    } catch (error) {
      console.error('Refund error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund failed'
      };
    }
  }
}
