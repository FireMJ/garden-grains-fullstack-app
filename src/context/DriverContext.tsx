"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';
import { DeliveryOrder, DriverProfile, DeliveryEarning } from '@/types/driver';

interface DriverContextType {
  driverProfile: DriverProfile | null;
  availableOrders: DeliveryOrder[];
  activeOrders: DeliveryOrder[];
  completedOrders: DeliveryOrder[];
  earnings: DeliveryEarning[];
  loading: boolean;
  acceptOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: DeliveryOrder['status']) => Promise<void>;
  updateLocation: (lat: number, lng: number) => Promise<void>;
  setDriverStatus: (status: DriverProfile['status']) => Promise<void>;
  getEarningsSummary: () => { today: number; week: number; month: number; total: number };
  refreshData: () => Promise<void>;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export function DriverProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [availableOrders, setAvailableOrders] = useState<DeliveryOrder[]>([]);
  const [activeOrders, setActiveOrders] = useState<DeliveryOrder[]>([]);
  const [completedOrders, setCompletedOrders] = useState<DeliveryOrder[]>([]);
  const [earnings, setEarnings] = useState<DeliveryEarning[]>([]);
  const [loading, setLoading] = useState(true);

  // Load driver profile
  useEffect(() => {
    if (!user) return;

    const loadDriverProfile = async () => {
      try {
        const driversRef = collection(db, 'drivers');
        const q = query(driversRef, where('uid', '==', user.uid));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          setDriverProfile({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as DriverProfile);
        }
      } catch (error) {
        console.error('Error loading driver profile:', error);
      }
    };

    loadDriverProfile();
  }, [user]);

  // Listen to available orders
  useEffect(() => {
    if (!driverProfile || driverProfile.status !== 'available') return;

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('status', '==', 'pending'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orders: DeliveryOrder[] = [];
      snapshot.forEach(doc => {
        orders.push({ id: doc.id, ...doc.data() } as DeliveryOrder);
      });
      setAvailableOrders(orders);
    });

    return () => unsubscribe();
  }, [driverProfile]);

  // Listen to active orders
  useEffect(() => {
    if (!driverProfile) return;

    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('driverId', '==', driverProfile.id));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const active: DeliveryOrder[] = [];
      const completed: DeliveryOrder[] = [];
      
      snapshot.forEach(doc => {
        const order = { id: doc.id, ...doc.data() } as DeliveryOrder;
        if (order.status === 'delivered' || order.status === 'cancelled') {
          completed.push(order);
        } else if (order.status !== 'pending') {
          active.push(order);
        }
      });
      
      setActiveOrders(active);
      setCompletedOrders(completed);
    });

    return () => unsubscribe();
  }, [driverProfile]);

  const acceptOrder = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        driverId: driverProfile?.id,
        status: 'accepted',
        acceptedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error accepting order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: DeliveryOrder['status']) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const updates: any = { status };
      
      if (status === 'delivered') {
        updates.deliveredAt = serverTimestamp();
        
        // Calculate earning
        const order = [...activeOrders, ...availableOrders].find(o => o.id === orderId);
        if (order && driverProfile) {
          const earning: Partial<DeliveryEarning> = {
            orderId,
            driverId: driverProfile.id,
            amount: order.deliveryFee,
            distance: order.distance,
            status: 'completed',
            completedAt: new Date().toISOString()
          };
          await addDoc(collection(db, 'driverEarnings'), earning);
        }
      }
      
      await updateDoc(orderRef, updates);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const updateLocation = async (lat: number, lng: number) => {
    if (!driverProfile) return;
    
    try {
      const driverRef = doc(db, 'drivers', driverProfile.id);
      await updateDoc(driverRef, {
        currentLocation: { lat, lng, updatedAt: new Date().toISOString() }
      });
      setDriverProfile(prev => prev ? { ...prev, currentLocation: { lat, lng, updatedAt: new Date().toISOString() } } : null);
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const setDriverStatus = async (status: DriverProfile['status']) => {
    if (!driverProfile) return;
    
    try {
      const driverRef = doc(db, 'drivers', driverProfile.id);
      await updateDoc(driverRef, { status });
      setDriverProfile(prev => prev ? { ...prev, status } : null);
    } catch (error) {
      console.error('Error updating driver status:', error);
      throw error;
    }
  };

  const getEarningsSummary = () => {
    const today = new Date().toDateString();
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date();
    monthStart.setDate(1);
    
    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;
    let totalAll = 0;
    
    earnings.forEach(earning => {
      if (earning.status === 'completed') {
        totalAll += earning.amount;
        
        if (earning.completedAt) {
          const earningDate = new Date(earning.completedAt);
          if (earningDate.toDateString() === today) todayTotal += earning.amount;
          if (earningDate >= weekStart) weekTotal += earning.amount;
          if (earningDate >= monthStart) monthTotal += earning.amount;
        }
      }
    });
    
    return { today: todayTotal, week: weekTotal, month: monthTotal, total: totalAll };
  };

  const refreshData = async () => {
    setLoading(true);
    // Refresh logic here
    setLoading(false);
  };

  return (
    <DriverContext.Provider value={{
      driverProfile,
      availableOrders,
      activeOrders,
      completedOrders,
      earnings,
      loading,
      acceptOrder,
      updateOrderStatus,
      updateLocation,
      setDriverStatus,
      getEarningsSummary,
      refreshData
    }}>
      {children}
    </DriverContext.Provider>
  );
}

export function useDriver() {
  const context = useContext(DriverContext);
  if (context === undefined) {
    throw new Error('useDriver must be used within a DriverProvider');
  }
  return context;
}
