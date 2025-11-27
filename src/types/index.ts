export type { CartItem, CartState, CartAction } from './cart';

// Add missing types
export interface Order {
  id: string;
  status: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  total: number;
  customerName: string;
  customerEmail: string;
  createdAt: string | Date;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED';

// Re-export other types as needed
export type { User } from './user';
export type { Product } from './product';

// Add Order types

