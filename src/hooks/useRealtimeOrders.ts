import { useEffect, useState } from 'react';
import { orderService } from '@/services/firestoreService';
import { useAuth } from '@/context/AuthContext';

export function useRealtimeOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const loadOrders = async () => {
      try {
        const userOrders = await orderService.getUserOrders(user.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  return { orders, loading };
}

export function useRealtimeOrder(orderId: string) {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const unsubscribe = orderService.subscribeToOrder(orderId, (updatedOrder) => {
      setOrder(updatedOrder);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  return { order, loading };
}
