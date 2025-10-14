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

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  addOns?: any[];
  friesUpsell?: any[];
  juiceUpsell?: any[];
}
