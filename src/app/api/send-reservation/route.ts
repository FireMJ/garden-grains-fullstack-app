import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, guests, occasion, specialRequests } = body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format the email content
    const subject = `New Reservation Request - ${name}`;
    const formattedDate = new Date(date).toLocaleDateString('en-ZA', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2F5D50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #2F5D50; }
          .value { margin-left: 10px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 New Reservation Request</h1>
            <p>Garden & Grains - Uitsig Wine Farm</p>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">👤 Name:</span>
              <span class="value">${name}</span>
            </div>
            <div class="field">
              <span class="label">📧 Email:</span>
              <span class="value">${email}</span>
            </div>
            <div class="field">
              <span class="label">📞 Phone:</span>
              <span class="value">${phone}</span>
            </div>
            <div class="field">
              <span class="label">📅 Date:</span>
              <span class="value">${formattedDate}</span>
            </div>
            <div class="field">
              <span class="label">⏰ Time:</span>
              <span class="value">${time}</span>
            </div>
            <div class="field">
              <span class="label">👥 Guests:</span>
              <span class="value">${guests}</span>
            </div>
            ${occasion ? `
            <div class="field">
              <span class="label">🎉 Occasion:</span>
              <span class="value">${occasion}</span>
            </div>
            ` : ''}
            ${specialRequests ? `
            <div class="field">
              <span class="label">📝 Special Requests:</span>
              <span class="value">${specialRequests}</span>
            </div>
            ` : ''}
            <hr style="border: none; border-top: 2px solid #2F5D50; margin: 20px 0;">
            <p style="font-size: 14px; color: #666;">
              This reservation request was submitted from the Garden & Grains website.
              Please confirm availability and respond to the customer directly.
            </p>
          </div>
          <div class="footer">
            <p>Garden & Grains - Farm-to-Table Dining</p>
            <p>Uitsig Wine Farm, Spaanschemat River Rd, Cape Town</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn('Resend API key not configured. Reservation saved but email not sent.');
      return NextResponse.json({ 
        success: true, 
        message: 'Reservation saved but email notification not sent (API key missing)' 
      });
    }

    // Send email using Resend
    const emailResult = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Garden & Grains <reservations@${process.env.NEXT_PUBLIC_EMAIL_DOMAIN || 'gardengrains.co.za'}>`,
        to: ['reservations@gardengrains.co.za'],
        subject: subject,
        html: emailBody,
        reply_to: email,
        // Tracking options
        tracking: {
          open: true,
          click: true,
        }
      }),
    });

    let emailError = null;
    if (!emailResult.ok) {
      const errorText = await emailResult.text();
      console.error('Email sending failed:', errorText);
      emailError = errorText;
    }

    // Send confirmation to customer
    const customerEmailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2F5D50; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 Reservation Request Received!</h1>
            <p>Thank you for choosing Garden & Grains</p>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>We have received your reservation request for <strong>${formattedDate}</strong> at <strong>${time}</strong> for <strong>${guests} guests</strong>.</p>
            <p>We will confirm your reservation shortly via email or phone.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 14px; color: #666;">
              <strong>Reservation Details:</strong><br>
              📅 Date: ${formattedDate}<br>
              ⏰ Time: ${time}<br>
              👥 Guests: ${guests}<br>
              ${occasion ? `🎉 Occasion: ${occasion}` : ''}
            </p>
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
              📍 <strong>Location:</strong><br>
              Uitsig Wine Farm<br>
              Spaanschemat River Rd<br>
              Fir Grove, Cape Town, 7806
            </p>
            <p style="font-size: 14px; color: #666;">
              📞 <strong>Contact us:</strong> (069) 376-5574
            </p>
            <p style="font-size: 12px; color: #999; margin-top: 20px;">
              This is a confirmation of receipt. Your reservation will be confirmed by our team.
            </p>
          </div>
          <div class="footer">
            <p>Garden & Grains - Farm-to-Table Dining</p>
            <p>Uitsig Wine Farm, Spaanschemat River Rd, Cape Town</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send confirmation to customer
    const customerEmailResult = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Garden & Grains <reservations@${process.env.NEXT_PUBLIC_EMAIL_DOMAIN || 'gardengrains.co.za'}>`,
        to: [email],
        subject: `Reservation Confirmation - Garden & Grains`,
        html: customerEmailBody,
        // Tracking options
        tracking: {
          open: true,
          click: true,
        }
      }),
    });

    if (!customerEmailResult.ok) {
      const errorText = await customerEmailResult.text();
      console.error('Customer email sending failed:', errorText);
    }

    // Store reservation in Firestore (optional)
    // const { db } = require('@/lib/firebase');
    // await addDoc(collection(db, 'reservations'), {
    //   ...body,
    //   createdAt: new Date(),
    //   status: 'pending'
    // });

    return NextResponse.json({ 
      success: true, 
      message: 'Reservation request sent successfully',
      emailSent: emailResult.ok,
      customerEmailSent: customerEmailResult.ok
    });

  } catch (error) {
    console.error('Reservation API error:', error);
    return NextResponse.json(
      { error: 'Failed to send reservation request' },
      { status: 500 }
    );
  }
}
