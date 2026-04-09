import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, name, email, phone, vehicleType, licensePlate } = body;

    // Validate required fields
    if (!uid || !name || !email || !phone || !vehicleType || !licensePlate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In a real app, you would save to Firestore here
    // For now, return a success response
    console.log('Driver registration:', { uid, name, email, phone, vehicleType, licensePlate });

    return NextResponse.json({ 
      success: true, 
      driverId: `driver_${uid}`,
      message: 'Driver registered successfully'
    });
  } catch (error) {
    console.error('Driver registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
