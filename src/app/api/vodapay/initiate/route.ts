import { NextRequest, NextResponse } from 'next/server';

// VodaPay Sandbox Configuration
const VODAPAY_API_URL = process.env.VODAPAY_API_URL || 'https://api.vodapaygatewayuat.vodacom.co.za/v2';
const VODAPAY_API_KEY = process.env.VODAPAY_API_KEY || 'd605f89b-079c-11ed-b83a-06c42a9d493e';
const VODAPAY_MERCHANT_ID = process.env.VODAPAY_MERCHANT_ID || 'TEST_MERCHANT';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, orderId, customerEmail, customerPhone, returnUrl, cancelUrl } = body;

    console.log('VodaPay payment initiation request:', { amount, currency, orderId, customerEmail });

    // Generate a unique transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Prepare the payment request for VodaPay
    const paymentRequest = {
      transactionId: transactionId,
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'ZAR',
      merchantId: VODAPAY_MERCHANT_ID,
      orderId: orderId,
      returnUrl: returnUrl,
      cancelUrl: cancelUrl,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      description: `Garden & Grains Order ${orderId}`,
      paymentMethods: ['CARD', 'MOBILE_MONEY'],
    };

    console.log('Sending request to VodaPay:', paymentRequest);

    // For sandbox testing, we'll simulate a successful response
    // In production, replace with actual API call to VodaPay
    if (process.env.NODE_ENV === 'development' || true) {
      // Simulate VodaPay API response for testing
      const mockPaymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/vodapay/mock-payment?transactionId=${transactionId}&amount=${amount}`;
      
      return NextResponse.json({
        success: true,
        paymentUrl: mockPaymentUrl,
        transactionId: transactionId,
        message: 'Payment initiated successfully (Sandbox Mode)',
      });
    }

    // Actual VodaPay API call (for production)
    const response = await fetch(`${VODAPAY_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': VODAPAY_API_KEY,
        'test': 'true', // Sandbox mode
      },
      body: JSON.stringify(paymentRequest),
    });

    const data = await response.json();

    if (response.ok && data.paymentUrl) {
      return NextResponse.json({
        success: true,
        paymentUrl: data.paymentUrl,
        transactionId: transactionId,
      });
    } else {
      throw new Error(data.message || 'Payment initiation failed');
    }
  } catch (error: any) {
    console.error('VodaPay API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to initiate payment',
        error: error.toString()
      },
      { status: 500 }
    );
  }
}
