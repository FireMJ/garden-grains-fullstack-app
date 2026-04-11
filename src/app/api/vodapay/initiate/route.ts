import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency, orderId, customerEmail, customerPhone, returnUrl, cancelUrl } = body;

    // Generate a unique transaction ID
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Mock payment URL for testing
    const mockPaymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/vodapay/mock-payment?transactionId=${transactionId}&amount=${amount}`;

    return NextResponse.json({
      success: true,
      paymentUrl: mockPaymentUrl,
      transactionId: transactionId,
      message: 'Payment initiated successfully (Sandbox Mode)',
    });
  } catch (error) {
    console.error('VodaPay API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to initiate payment',
      },
      { status: 500 }
    );
  }
}
