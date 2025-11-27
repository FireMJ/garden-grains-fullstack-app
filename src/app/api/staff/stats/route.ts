import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    
    if (!payload || (payload.role !== 'admin' && payload.role !== 'staff')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Your existing stats logic here
    const stats = {
      totalOrders: 150,
      pendingOrders: 12,
      completedToday: 45,
      revenue: 12500,
    };

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
