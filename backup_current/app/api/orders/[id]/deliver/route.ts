import { NextRequest, NextResponse } from 'next/server';

// Mock data
let orders = [
  { id: '1', status: 'pending', items: [], total: 0 },
  { id: '2', status: 'preparing', items: [], total: 0 }
];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const orderIndex = orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    orders[orderIndex].status = 'delivered';
    
    return NextResponse.json(orders[orderIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
