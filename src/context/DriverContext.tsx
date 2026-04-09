"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './AuthContext';

export interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryInstructions: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  distance: number;
  estimatedTime: number;
  createdAt: string;
  scheduledTime?: string;
  driverId?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface DriverProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: 'car' | 'motorcycle' | 'bicycle';
  licensePlate: string;
  status: 'available' | 'busy' | 'offline';
  rating: number;
  totalDeliveries: number;
  earnings: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  currentLocation?: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
  documents: {
    driversLicense: boolean;
    vehicleRegistration: boolean;
    backgroundCheck: boolean;
  };
}

export interface DeliveryEarning {
  id: string;
  orderId: string;
  driverId: string;
  amount: number;
  distance: number;
  timeSpent: number;
  status: 'pending' | 'completed' | 'failed';
  completedAt?: string;
}

interface DriverContextType {
  driverProfile: DriverProfile | null;
  availableOrders: DeliveryOrder[];
  activeOrders: DeliveryOrder[];
  completedOrders: DeliveryOrder[];
  earnings: DeliveryEarning[];
  loading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  // Load driver profile
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const loadDriverProfile = async () => {
      try {
        const driversRef = collection(db, 'drivers');
        const q = query(driversRef, where('uid', '==', user.uid));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data();
          setDriverProfile({ id: snapshot.docs[0].id, ...docData } as DriverProfile);
        } else {
          // No driver profile found - user is not a driver
          setDriverProfile(null);
        }
      } catch (err: any) {
        console.error('Error loading driver profile:', err);
        if (err.code === 'permission-denied') {
          setError('Firebase permissions not configured. Please check Firestore rules.');
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDriverProfile();
  }, [user]);

  // Listen to available orders (only if driver is available)
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
    }, (err) => {
      console.error('Error loading available orders:', err);
      if (err.code === 'permission-denied') {
        setError('Unable to load orders. Please check Firestore permissions.');
      }
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
    }, (err) => {
      console.error('Error loading active orders:', err);
    });

    return () => unsubscribe();
  }, [driverProfile]);

  const acceptOrder = async (orderId: string) => {
    if (!driverProfile) return;
    
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        driverId: driverProfile.id,
        status: 'accepted',
        acceptedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Error accepting order:', err);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId: string, status: DeliveryOrder['status']) => {
    if (!driverProfile) return;
    
    try {
      const orderRef = doc(db, 'orders', orderId);
      const updates: any = { status };
      
      if (status === 'delivered') {
        updates.deliveredAt = serverTimestamp();
        
        // Calculate earning
        const order = [...activeOrders, ...availableOrders].find(o => o.id === orderId);
        if (order) {
          const earning: Partial<DeliveryEarning> = {
            orderId,
            driverId: driverProfile.id,
            amount: order.deliveryFee,
            distance: order.distance,
            status: 'completed',
            completedAt: new Date().toISOString()
          };
          try {
            await addDoc(collection(db, 'driverEarnings'), earning);
          } catch (err) {
            console.error('Error saving earning:', err);
          }
        }
      }
      
      await updateDoc(orderRef, updates);
    } catch (err) {
      console.error('Error updating order status:', err);
      throw err;
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
    } catch (err) {
      console.error('Error updating location:', err);
    }
  };

  const setDriverStatus = async (status: DriverProfile['status']) => {
    if (!driverProfile) return;
    
    try {
      const driverRef = doc(db, 'drivers', driverProfile.id);
      await updateDoc(driverRef, { status });
      setDriverProfile(prev => prev ? { ...prev, status } : null);
    } catch (err) {
      console.error('Error updating driver status:', err);
      throw err;
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
    try {
      if (user) {
        const driversRef = collection(db, 'drivers');
        const q = query(driversRef, where('uid', '==', user.uid));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
          setDriverProfile({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as DriverProfile);
        }
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DriverContext.Provider value={{
      driverProfile,
      availableOrders,
      activeOrders,
      completedOrders,
      earnings,
      loading,
      error,
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
