import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend'; // Or your email service

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, orderSummary } = await request.json();

    if (!customerEmail || !orderSummary) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email using your email service
    const { data, error } = await resend.emails.send({
      from: 'Garden & Grains <orders@gardenandgrains.com>',
      to: customerEmail,
      subject: '🌱 Your Order Confirmation',
      text: orderSummary,
      html: `<pre>${orderSummary}</pre>` // Simple HTML version
    });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send order error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}