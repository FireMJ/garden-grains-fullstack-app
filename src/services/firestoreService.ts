import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';

// Order Service
export const orderService = {
  async createOrder(orderData: any) {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
    return docRef.id;
  },

  async getOrder(orderId: string) {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() };
    }
    return null;
  },

  async getUserOrders(userId: string) {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('customerId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateOrderStatus(orderId: string, status: string) {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status, updatedAt: serverTimestamp() });
  },

  // Real-time subscription to a single order
  subscribeToOrder(orderId: string, callback: (order: any) => void): Unsubscribe {
    const orderRef = doc(db, 'orders', orderId);
    return onSnapshot(orderRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  },

  // Real-time subscription to user orders
  subscribeToUserOrders(userId: string, callback: (orders: any[]) => void): Unsubscribe {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('customerId', '==', userId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(orders);
    });
  },

  // Subscribe to all orders (for admin)
  subscribeToAllOrders(callback: (orders: any[]) => void): Unsubscribe {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(orders);
    });
  }
};

// Driver Service
export const driverService = {
  async getDrivers() {
    const driversRef = collection(db, 'drivers');
    const querySnapshot = await getDocs(driversRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getAvailableDrivers() {
    const driversRef = collection(db, 'drivers');
    const q = query(driversRef, where('status', '==', 'available'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateDriverLocation(driverId: string, location: { lat: number; lng: number }) {
    const driverRef = doc(db, 'drivers', driverId);
    await updateDoc(driverRef, {
      currentLocation: location,
      lastActive: serverTimestamp()
    });
  },

  subscribeToDriverLocation(driverId: string, callback: (location: any) => void): Unsubscribe {
    const driverRef = doc(db, 'drivers', driverId);
    return onSnapshot(driverRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data().currentLocation);
      }
    });
  }
};

// Stats Service
export const statsService = {
  async incrementVisitCount() {
    const statsRef = doc(db, 'stats', 'visits');
    const statsSnap = await getDoc(statsRef);
    if (statsSnap.exists()) {
      const currentCount = statsSnap.data().count || 0;
      await updateDoc(statsRef, { count: currentCount + 1 });
    } else {
      await addDoc(collection(db, 'stats'), { id: 'visits', count: 1 });
    }
  },

  async getVisitCount() {
    const statsRef = doc(db, 'stats', 'visits');
    const statsSnap = await getDoc(statsRef);
    return statsSnap.exists() ? statsSnap.data().count || 0 : 0;
  },

  async incrementLikeCount() {
    const statsRef = doc(db, 'stats', 'likes');
    const statsSnap = await getDoc(statsRef);
    if (statsSnap.exists()) {
      const currentCount = statsSnap.data().count || 0;
      await updateDoc(statsRef, { count: currentCount + 1 });
    } else {
      await addDoc(collection(db, 'stats'), { id: 'likes', count: 1 });
    }
  },

  async getLikeCount() {
    const statsRef = doc(db, 'stats', 'likes');
    const statsSnap = await getDoc(statsRef);
    return statsSnap.exists() ? statsSnap.data().count || 0 : 0;
  },

  subscribeToStats(statId: string, callback: (stat: any) => void): Unsubscribe {
    const statRef = doc(db, 'stats', statId);
    return onSnapshot(statRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback({ id: statId, count: 0 });
      }
    });
  }
};
