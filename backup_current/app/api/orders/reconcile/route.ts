// src/app/api/orders/reconcile/route.ts

import { NextRequest } from 'next/server';
import { collection, getDocs, query, where, orderBy, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Define proper TypeScript interfaces
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: { name: string; price: number };
  addOns?: Array<{ name: string; price: number }>;
}

interface OrderData {
  id: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod?: string;
  deliveryStatus?: string;
}

interface ReconciliationResult {
  orderId: string;
  calculatedTotal: number;
  recordedTotal: number;
  discrepancy: number;
  status: 'MATCH' | 'MISMATCH';
  items: OrderItem[];
}

interface ReconciliationSummary {
  totalOrders: number;
  matchedOrders: number;
  mismatchedOrders: number;
  totalDiscrepancy: number;
  results: ReconciliationResult[];
}

interface DateRange {
  startDate: string;
  endDate: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: DateRange = await request.json();
    const { startDate, endDate } = body;

    // Validate date range
    if (!startDate || !endDate) {
      return new Response(JSON.stringify({ 
        error: 'Start date and end date are required' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch orders within date range
    const ordersQuery = query(
      collection(db, 'orders'),
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      orderBy('createdAt', 'desc')
    );

    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as OrderData[];

    // Reconcile each order
    const reconciliationResults: ReconciliationResult[] = orders.map(order => {
      // Calculate total from items
      const calculatedTotal = order.items.reduce((total: number, item: OrderItem) => {
        const itemTotal = item.price * item.quantity;
        const sizePrice = item.size?.price || 0;
        const addOnsTotal = item.addOns?.reduce((sum: number, addOn: { price: number }) => sum + addOn.price, 0) || 0;
        return total + (itemTotal + sizePrice + addOnsTotal);
      }, 0);

      const discrepancy = calculatedTotal - order.total;
      const status: 'MATCH' | 'MISMATCH' = Math.abs(discrepancy) < 0.01 ? 'MATCH' : 'MISMATCH';

      return {
        orderId: order.id,
        calculatedTotal: Math.round(calculatedTotal * 100) / 100, // Round to 2 decimal places
        recordedTotal: order.total,
        discrepancy: Math.round(discrepancy * 100) / 100,
        status,
        items: order.items
      };
    });

    // Calculate summary
    const mismatchedOrders = reconciliationResults.filter(result => result.status === 'MISMATCH');
    const totalDiscrepancy = mismatchedOrders.reduce((sum: number, order: ReconciliationResult) => sum + order.discrepancy, 0);

    const summary: ReconciliationSummary = {
      totalOrders: orders.length,
      matchedOrders: reconciliationResults.filter(result => result.status === 'MATCH').length,
      mismatchedOrders: mismatchedOrders.length,
      totalDiscrepancy: Math.round(totalDiscrepancy * 100) / 100,
      results: reconciliationResults
    };

    // If there are mismatches, optionally update the orders (commented out for safety)
    if (mismatchedOrders.length > 0) {
      console.warn(`Found ${mismatchedOrders.length} orders with payment discrepancies`);
      
      // Uncomment to automatically fix discrepancies (use with caution)
      // await fixDiscrepancies(mismatchedOrders);
    }

    return new Response(JSON.stringify({ 
      summary,
      message: `Reconciliation complete. ${mismatchedOrders.length} orders with discrepancies found.`
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Order reconciliation error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to reconcile orders';

    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Optional: Function to fix discrepancies (commented out for safety)
async function fixDiscrepancies(mismatchedOrders: ReconciliationResult[]): Promise<void> {
  try {
    const batch = writeBatch(db);

    mismatchedOrders.forEach(order => {
      const orderRef = doc(db, 'orders', order.orderId);
      batch.update(orderRef, {
        total: order.calculatedTotal,
        updatedAt: new Date().toISOString(),
        reconciliationNote: `Auto-corrected from ${order.recordedTotal} to ${order.calculatedTotal}`
      });
    });

    await batch.commit();
    console.log(`Fixed ${mismatchedOrders.length} order discrepancies`);
  } catch (error: unknown) {
    console.error('Error fixing discrepancies:', error);
    throw new Error('Failed to fix order discrepancies');
  }
}

// GET endpoint to get reconciliation report
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return new Response(JSON.stringify({ 
        error: 'Start date and end date are required as query parameters' 
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch and reconcile orders (same logic as POST)
    const ordersQuery = query(
      collection(db, 'orders'),
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      orderBy('createdAt', 'desc')
    );

    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as OrderData[];

    const reconciliationResults: ReconciliationResult[] = orders.map(order => {
      const calculatedTotal = order.items.reduce((total: number, item: OrderItem) => {
        const itemTotal = item.price * item.quantity;
        const sizePrice = item.size?.price || 0;
        const addOnsTotal = item.addOns?.reduce((sum: number, addOn: { price: number }) => sum + addOn.price, 0) || 0;
        return total + (itemTotal + sizePrice + addOnsTotal);
      }, 0);

      const discrepancy = calculatedTotal - order.total;
      const status: 'MATCH' | 'MISMATCH' = Math.abs(discrepancy) < 0.01 ? 'MATCH' : 'MISMATCH';

      return {
        orderId: order.id,
        calculatedTotal: Math.round(calculatedTotal * 100) / 100,
        recordedTotal: order.total,
        discrepancy: Math.round(discrepancy * 100) / 100,
        status,
        items: order.items
      };
    });

    const mismatchedOrders = reconciliationResults.filter(result => result.status === 'MISMATCH');
    const totalDiscrepancy = mismatchedOrders.reduce((sum: number, order: ReconciliationResult) => sum + order.discrepancy, 0);

    const summary: ReconciliationSummary = {
      totalOrders: orders.length,
      matchedOrders: reconciliationResults.filter(result => result.status === 'MATCH').length,
      mismatchedOrders: mismatchedOrders.length,
      totalDiscrepancy: Math.round(totalDiscrepancy * 100) / 100,
      results: reconciliationResults
    };

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    console.error('Get reconciliation report error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to get reconciliation report';

    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}