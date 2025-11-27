export interface CartItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  instructions?: string;
  dip?: string;
  addOns?: AddOnItem[];
  fries?: AddOnItem[];
  juices?: { id: string; name: string; price: number; size: string }[];
  specialInstructions?: string;
  base?: string;
  dressing?: string;
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface JuiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };
