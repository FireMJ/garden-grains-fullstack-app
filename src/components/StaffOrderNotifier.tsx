'use client';

import { useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

// Simple notification function without sonner
const showNotification = (title: string, body: string) => {
  if (typeof window !== 'undefined' && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      });
    }
  }
  // Also log to console
  console.log(`🔔 ${title}: ${body}`);
};

export default function StaffOrderNotifier() {
  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        // Check if user is staff (you can add logic here)
        const isStaff = user.email?.includes('admin') || user.email?.includes('staff');
        
        if (isStaff) {
          // Listen for new orders
          const ordersQuery = query(
            collection(db, 'orders'),
            where('status', '==', 'pending')
          );
          
          const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
              if (change.type === 'added') {
                const orderData = change.doc.data();
                showNotification(
                  'New Order!',
                  `New order #${orderData.orderNumber || orderData.orderId} received`
                );
              }
            });
          });
          
          return () => unsubscribeOrders();
        }
      }
    });
    
    return () => unsubscribeAuth();
  }, []);
  
  return null;
}
