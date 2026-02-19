import { NextRequest } from 'next/server';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  recentOrders: Array<{
    id: string;
    status: string;
    total: number;
    createdAt: string;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    // Get date range from query parameters (optional)
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Fetch users count
    const usersQuery = query(collection(db, 'users'));
    const usersSnapshot = await getDocs(usersQuery);
    const totalUsers = usersSnapshot.size;

    // Fetch orders with optional date filtering
    let ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    if (startDate && endDate) {
      ordersQuery = query(
        collection(db, 'orders'),
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate),
        orderBy('createdAt', 'desc')
      );
    }

    const ordersSnapshot = await getDocs(ordersQuery);
    const orders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Array<{
      id: string;
      status: string;
      total: number;
      createdAt: string;
    }>;

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum: number, order) => sum + (order.total || 0), 0);
    const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
    const completedOrders = orders.filter(order => order.status === 'DELIVERED').length;
    const recentOrders = orders.slice(0, 5);

    const stats: DashboardStats = {
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      recentOrders
    };

    return new Response(JSON.stringify({ stats }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: unknown) {
    // Proper error handling without 'any'
    console.error('Dashboard stats API error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to fetch dashboard statistics';

    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}