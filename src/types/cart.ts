export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  instructions?: string;
  selectedSize?: string;
  addOns?: any[];
  fries?: any[];
  juices?: any[];
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
