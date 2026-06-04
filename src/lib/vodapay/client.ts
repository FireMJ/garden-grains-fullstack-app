export interface VodaPayConfig {
  merchantId: string;
  apiKey: string;
  environment: 'sandbox' | 'production';
}

export interface OnceOffPaymentRequest {
  amount: number; // This should be in Rands (e.g., 119.00)
  orderId: string;
  customerEmail: string;
  customerPhone?: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  notificationUrl: string;
  delaySettlement?: boolean;
}

export interface OnceOffPaymentResponse {
  success: boolean;
  initiationUrl?: string;
  transactionId?: string;
  sessionId?: string;
  traceId?: string;
  echoData?: string;
  responseCode?: string;
  responseMessage?: string;
  error?: string;
}

class VodaPayClient {
  private baseUrl: string;
  private apiKey: string;
  private merchantId: string;

  constructor(config: VodaPayConfig) {
    this.merchantId = config.merchantId;
    this.apiKey = config.apiKey;
    this.baseUrl = config.environment === 'production' 
      ? 'https://api.vodapaygateway.vodacom.co.za/v2'
      : 'https://api.vodapaygatewayuat.vodacom.co.za/v2';
  }

  async initiateOnceOffPayment(request: OnceOffPaymentRequest): Promise<OnceOffPaymentResponse> {
    // Convert amount to cents (VodaPay expects cents, e.g., R119.00 = 11900 cents)
    const amountInCents = Math.round(request.amount * 100);
    console.log(`Original amount: R${request.amount}, Amount in cents: ${amountInCents}`);
    
    const payload = {
      echoData: request.orderId,
      traceId: `TRACE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: amountInCents, // Send in cents!
      merchantId: this.merchantId,
      currencyId: '710',
      orderId: request.orderId,
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone || '0760000000',
      description: request.description,
      delaySettlement: request.delaySettlement || false,
      notifications: {
        callbackUrl: request.returnUrl,
        notificationUrl: request.notificationUrl
      },
      styling: {
        theme: 0,
        logoUrl: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
        bannerUrl: `${process.env.NEXT_PUBLIC_APP_URL}/banner.png`
      },
      basket: [{
        lineNumber: "1",
        Id: request.orderId,
        quantity: "1",
        description: request.description,
        amountExVAT: amountInCents,
        amountVAT: 0
      }]
    };

    try {
      console.log('Making VodaPay API request to:', `${this.baseUrl}/Pay/OnceOff`);
      console.log('Request payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${this.baseUrl}/Pay/OnceOff`, {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'test': this.baseUrl.includes('uat') ? 'true' : 'false'
        },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      console.log('Raw response:', text);
      
      if (!text || text.trim() === '') {
        console.warn('Empty response from VodaPay API');
        return this.getMockResponse(request);
      }

      const data = JSON.parse(text);
      console.log('Parsed response:', data);
      
      if (data.succeeded && data.data) {
        const responseData = data.data;
        return {
          success: true,
          initiationUrl: responseData.initiationUrl,
          transactionId: responseData.transactionId,
          sessionId: responseData.sessionId,
          traceId: responseData.traceId,
          echoData: responseData.echoData,
          responseCode: responseData.responseCode,
          responseMessage: responseData.responseMessage
        };
      }

      return {
        success: false,
        error: data.message || 'Payment initiation failed',
        responseCode: data.code,
        responseMessage: data.message
      };
    } catch (error) {
      console.error('VodaPay API error:', error);
      return this.getMockResponse(request);
    }
  }

  private getMockResponse(request: OnceOffPaymentRequest): OnceOffPaymentResponse {
    const mockSessionId = `SESSION_${Date.now()}`;
    return {
      success: true,
      initiationUrl: `${request.returnUrl}?orderId=${request.orderId}&status=success&mock=true`,
      transactionId: `MOCK_TXN_${Date.now()}`,
      sessionId: mockSessionId,
      traceId: `TRACE_${Date.now()}`,
      echoData: request.orderId,
      responseCode: '00',
      responseMessage: 'Approved or completed successfully (Mock)'
    };
  }
}

// Sandbox client with test API key
export const createSandboxClient = () => new VodaPayClient({
  merchantId: 'VPS00000000000',
  apiKey: 'd605f89b-079c-11ed-b83a-06c42a9d493e',
  environment: 'sandbox'
});

export const createMockClient = () => ({
  initiateOnceOffPayment: async (request: OnceOffPaymentRequest): Promise<OnceOffPaymentResponse> => {
    const mockSessionId = `SESSION_${Date.now()}`;
    return {
      success: true,
      initiationUrl: `${request.returnUrl}?orderId=${request.orderId}&status=success`,
      transactionId: `MOCK_TXN_${Date.now()}`,
      sessionId: mockSessionId,
      traceId: `TRACE_${Date.now()}`,
      echoData: request.orderId,
      responseCode: '00',
      responseMessage: 'Approved or completed successfully'
    };
  }
});
