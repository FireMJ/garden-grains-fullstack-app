import { db, collections, firestoreUtils } from '@/lib/firebase';
import { where, orderBy, limit } from 'firebase/firestore';

// Order Service
export const orderService = {
  // Create a new order
  createOrder: async (orderData: any) => {
    const order = {
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return await firestoreUtils.createDoc(collections.orders, order);
  },

  // Get order by ID
  getOrder: async (orderId: string) => {
    return await firestoreUtils.getDoc(collections.orders, orderId);
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string, driverId?: string) => {
    const updates: any = { status, updatedAt: new Date().toISOString() };
    if (driverId) updates.driverId = driverId;
    await firestoreUtils.updateDoc(collections.orders, orderId, updates);
  },

  // Get user orders
  getUserOrders: async (userId: string) => {
    return await firestoreUtils.queryDocs(collections.orders, [
      where('customer.id', '==', userId),
      orderBy('createdAt', 'desc')
    ]);
  },

  // Get pending orders for drivers
  getPendingOrders: async () => {
    return await firestoreUtils.queryDocs(collections.orders, [
      where('status', '==', 'pending'),
      where('orderType', '==', 'delivery'),
      orderBy('createdAt', 'asc')
    ]);
  },

  // Subscribe to order updates (real-time)
  subscribeToOrder: (orderId: string, callback: (order: any) => void) => {
    if (!db) throw new Error('Firestore not initialized');
    const { doc, onSnapshot } = require('firebase/firestore');
    return onSnapshot(doc(db, collections.orders, orderId), (snapshot: any) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() });
      }
    });
  }
};

// Menu Service
export const menuService = {
  // Get all menu items
  getMenuItems: async (category?: string) => {
    const constraints = [];
    if (category) {
      constraints.push(where('category', '==', category));
    }
    constraints.push(orderBy('name', 'asc'));
    return await firestoreUtils.queryDocs(collections.menu, constraints);
  },

  // Get featured items
  getFeaturedItems: async () => {
    return await firestoreUtils.queryDocs(collections.menu, [
      where('featured', '==', true),
      limit(6)
    ]);
  },

  // Get item by ID
  getMenuItem: async (itemId: string) => {
    return await firestoreUtils.getDoc(collections.menu, itemId);
  },

  // Admin: Add menu item
  addMenuItem: async (itemData: any) => {
    const item = {
      ...itemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return await firestoreUtils.createDoc(collections.menu, item);
  },

  // Admin: Update menu item
  updateMenuItem: async (itemId: string, itemData: any) => {
    await firestoreUtils.updateDoc(collections.menu, itemId, {
      ...itemData,
      updatedAt: new Date().toISOString()
    });
  }
};

// User Service
export const userService = {
  // Create/Update user profile
  saveUserProfile: async (userId: string, userData: any) => {
    const profile = {
      ...userData,
      updatedAt: new Date().toISOString()
    };
    await firestoreUtils.updateDoc(collections.users, userId, profile);
  },

  // Get user profile
  getUserProfile: async (userId: string) => {
    return await firestoreUtils.getDoc(collections.users, userId);
  },

  // Save user address
  saveUserAddress: async (userId: string, address: any) => {
    const user = await firestoreUtils.getDoc(collections.users, userId);
    const addresses = user?.addresses || [];
    addresses.push({ ...address, id: Date.now().toString(), isDefault: addresses.length === 0 });
    await firestoreUtils.updateDoc(collections.users, userId, { addresses });
    return addresses;
  }
};

// Review Service
export const reviewService = {
  // Add review
  addReview: async (reviewData: any) => {
    const review = {
      ...reviewData,
      createdAt: new Date().toISOString(),
      verified: false
    };
    return await firestoreUtils.createDoc(collections.reviews, review);
  },

  // Get restaurant reviews
  getRestaurantReviews: async () => {
    return await firestoreUtils.queryDocs(collections.reviews, [
      where('type', '==', 'restaurant'),
      orderBy('createdAt', 'desc')
    ]);
  },

  // Get average rating
  getAverageRating: async () => {
    const reviews = await firestoreUtils.queryDocs(collections.reviews, [
      where('type', '==', 'restaurant')
    ]);
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    return total / reviews.length;
  }
};
