export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedAddOns?: string[];
  selectedFries?: string[];
  selectedJuices?: string[];
  instructions?: string;
  selectedSize?: string;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (item: CartItem, newQuantity: number) => void;
  clearCart: () => void;
  schedule?: any;
}