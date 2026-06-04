// VodaPay Sandbox API - No 'use server' directive

export const SANDBOX_API_KEYS = [
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
];

export const SANDBOX_TEST_CARDS = {
  approved: { number: '4444444444444400', responseCode: '00', message: 'Approved' },
  doNotHonour: { number: '4444444444444405', responseCode: '05', message: 'Do not honour' },
  insufficientFunds: { number: '4444444444444451', responseCode: '51', message: 'Insufficient Funds' },
  cardExpired: { number: '4444444444444454', responseCode: '54', message: 'Card Expired' },
  threeDSecureFail: { number: '4444444444444499', responseCode: '99', message: '3DSecure Fail' },
  systemMalfunction: { number: '4444444444444496', responseCode: '96', message: 'System malfunction' }
};

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail: string;
  customerPhone?: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  notifyUrl: string;
  testApiKey?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  redirectUrl?: string;
  error?: string;
  errorCode?: string;
}

class VodaPayAPI {
  private baseUrl: string;
  private apiKey: string;
  private merchantId: string;

  constructor(apiKey?: string) {
    this.baseUrl = 'https://api.vodapaygatewayuat.vodacom.co.za/v2';
    this.apiKey = apiKey || SANDBOX_API_KEYS[0];
    this.merchantId = 'VPS00000000000';
  }

  private async request(endpoint: string, method: string, body?: any) {
    const headers = {
      'api-key': this.apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'test': 'true'
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      });

      // Check if response has content
      const text = await response.text();
      
      if (!text || text.trim() === '') {
        throw new Error('Empty response from VodaPay API');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('VodaPay request error:', error);
      throw error;
    }
  }

  async initiatePayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const payload = {
        merchantId: this.merchantId,
        amount: paymentData.amount,
        currencyId: '710',
        orderId: paymentData.orderId,
        customerEmail: paymentData.customerEmail,
        customerPhone: paymentData.customerPhone || '0760000000',
        description: paymentData.description,
        returnUrl: paymentData.returnUrl,
        cancelUrl: paymentData.cancelUrl,
        notifyUrl: paymentData.notifyUrl,
        paymentMethod: 'CARD'
      };

      const response = await this.request('/payment/initiate', 'POST', payload);
      
      if (response.succeeded && response.data) {
        return {
          success: true,
          transactionId: response.data.transactionId,
          redirectUrl: response.data.redirectUrl
        };
      }
      
      return {
        success: false,
        error: response.message || 'Payment initiation failed',
        errorCode: response.code
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment gateway error'
      };
    }
  }
}

export const createVodaPayAPI = (apiKey?: string) => new VodaPayAPI(apiKey);
export const vodapayAPI = new VodaPayAPI();
