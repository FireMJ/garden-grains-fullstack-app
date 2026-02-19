import { NextRequest } from 'next/server';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DeliveryUpdateRequest {
  orderId: string;
  deliveryStatus: string;
  deliveryPerson?: string;
  estimatedDelivery?: string;
}

interface OrderData {
  deliveryStatus: string;
  updatedAt: string;
  deliveryPerson?: string;
  estimatedDelivery?: string;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: DeliveryUpdateRequest = await request.json();
    const { orderId, deliveryStatus, deliveryPerson, estimatedDelivery } = body;

    // Validate required fields
    if (!orderId || !deliveryStatus) {
      return new Response(JSON.stringify({ 
        error: 'Order ID and delivery status are required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate delivery status
    const validStatuses = ['PENDING', 'PREPARING', 'READY', 'ENROUTE', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(deliveryStatus)) {
      return new Response(JSON.stringify({ 
        error: `Invalid delivery status. Must be one of: ${validStatuses.join(', ')}` 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if order exists
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      return new Response(JSON.stringify({ 
        error: 'Order not found' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Prepare update data
    const updateData: Partial<OrderData> = {
      deliveryStatus,
      updatedAt: new Date().toISOString()
    };

    // Add optional fields if provided
    if (deliveryPerson) {
      updateData.deliveryPerson = deliveryPerson;
    }

    if (estimatedDelivery) {
      updateData.estimatedDelivery = estimatedDelivery;
    }

    // Update order in Firestore
    await updateDoc(orderRef, updateData);

    // Get updated order data
    const updatedOrderDoc = await getDoc(orderRef);
    const updatedOrder = {
      id: updatedOrderDoc.id,
      ...updatedOrderDoc.data()
    };

    return new Response(JSON.stringify({ 
      message: 'Delivery status updated successfully',
      order: updatedOrder
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    // Proper error handling without 'any'
    console.error('Delivery status update error:', error);
    
    let errorMessage = 'Failed to update delivery status';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Handle specific Firestore errors
      if (errorMessage.includes('permission-denied')) {
        errorMessage = 'Access denied. You do not have permission to update orders.';
        statusCode = 403;
      } else if (errorMessage.includes('not-found')) {
        errorMessage = 'Order not found.';
        statusCode = 404;
      } else if (errorMessage.includes('invalid-argument')) {
        errorMessage = 'Invalid data provided.';
        statusCode = 400;
      }
    }

    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), { 
      status: statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Optional: GET endpoint to fetch delivery status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return new Response(JSON.stringify({ 
        error: 'Order ID is required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return new Response(JSON.stringify({ 
        error: 'Order not found' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const orderData = orderDoc.data() as OrderData;

    return new Response(JSON.stringify({ 
      order: {
        id: orderDoc.id,
        ...orderData
      }
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Fetch delivery status error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to fetch delivery status';

    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}