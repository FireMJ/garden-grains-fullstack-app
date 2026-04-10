import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  addOns?: any[];
}

export interface DeliveryAddress {
  street: string;
  city: string;
  postalCode: string;
  coordinates?: { lat: number; lng: number };
  distance?: number;
}

export interface Order {
  id?: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: DeliveryAddress;
  pickupLocation?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  driverId?: string;
  driverName?: string;
  estimatedPreparationTime: number;
  estimatedDeliveryTime?: number;
  createdAt: any;
  updatedAt: any;
}

class OrderService {
  private ordersCollection = collection(db, 'orders');
  private driversCollection = collection(db, 'drivers');
  private restaurantCollection = collection(db, 'restaurant_orders');

  // Create new order
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'>): Promise<string> {
    try {
      // Generate unique order number
      const orderNumber = `GN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const order = {
        ...orderData,
        orderNumber,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        estimatedPreparationTime: 15, // 15 minutes default
      };
      
      const docRef = await addDoc(this.ordersCollection, order);
      
      // Also add to restaurant collection for kitchen display
      await addDoc(this.restaurantCollection, {
        ...order,
        orderId: docRef.id,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      
      // Notify nearby drivers (if delivery)
      if (orderData.orderType === 'delivery' && orderData.deliveryAddress?.coordinates) {
        await this.notifyNearbyDrivers(docRef.id, orderData.deliveryAddress.coordinates);
      }
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status'], additionalData?: any) {
    try {
      const orderRef = doc(this.ordersCollection, orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: serverTimestamp(),
        ...additionalData,
      });
      
      // Also update restaurant collection
      const restaurantQuery = query(this.restaurantCollection, where('orderId', '==', orderId));
      const restaurantDocs = await getDocs(restaurantQuery);
      restaurantDocs.forEach(async (doc) => {
        await updateDoc(doc.ref, { status, updatedAt: serverTimestamp() });
      });
      
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Update payment status
  async updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus'], transactionId?: string) {
    try {
      const orderRef = doc(this.ordersCollection, orderId);
      await updateDoc(orderRef, {
        paymentStatus,
        transactionId,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  // Notify nearby drivers for delivery
  async notifyNearbyDrivers(orderId: string, pickupCoordinates: { lat: number; lng: number }) {
    try {
      // Find available drivers within 5km radius
      const driversSnapshot = await getDocs(this.driversCollection);
      const availableDrivers = driversSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter((driver: any) => driver.isAvailable && driver.isOnline);
      
      // In production, use geohashing for better distance calculation
      // For now, create notifications for all available drivers
      const notificationsCollection = collection(db, 'driver_notifications');
      
      for (const driver of availableDrivers) {
        await addDoc(notificationsCollection, {
          driverId: driver.id,
          orderId,
          type: 'new_order',
          status: 'pending',
          createdAt: serverTimestamp(),
        });
      }
      
      return availableDrivers.length;
    } catch (error) {
      console.error('Error notifying drivers:', error);
      return 0;
    }
  }

  // Assign driver to order
  async assignDriver(orderId: string, driverId: string, driverName: string) {
    try {
      const orderRef = doc(this.ordersCollection, orderId);
      await updateDoc(orderRef, {
        driverId,
        driverName,
        status: 'out-for-delivery',
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error assigning driver:', error);
      throw error;
    }
  }

  // Listen to real-time order updates for restaurant
  listenToRestaurantOrders(callback: (orders: Order[]) => void) {
    const q = query(this.restaurantCollection, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      callback(orders);
    });
  }

  // Listen to real-time order updates for driver
  listenToDriverOrders(driverId: string, callback: (orders: Order[]) => void) {
    const q = query(this.ordersCollection, where('driverId', '==', driverId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const orders: Order[] = [];
      snapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      callback(orders);
    });
  }

  // Get order by ID
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const orderRef = doc(this.ordersCollection, orderId);
      const orderSnap = await getDoc(orderRef);
      if (orderSnap.exists()) {
        return { id: orderSnap.id, ...orderSnap.data() } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  // Get customer orders
  async getCustomerOrders(customerId: string): Promise<Order[]> {
    try {
      const q = query(this.ordersCollection, where('customerId', '==', customerId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const orders: Order[] = [];
      querySnapshot.forEach((doc) => {
        orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      return orders;
    } catch (error) {
      console.error('Error getting customer orders:', error);
      return [];
    }
  }
}

export const orderService = new OrderService();
