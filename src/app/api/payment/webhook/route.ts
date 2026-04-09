import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, status, responseCode } = body;

    console.log('Payment webhook received:', { transactionId, status, responseCode });

    // Process webhook - update order status in database
    // await updateOrderStatus(transactionId, status);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
