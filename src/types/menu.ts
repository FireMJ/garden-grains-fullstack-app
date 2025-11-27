export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface Fry {
  id: string;
  name: string;
  price: number;
}

export interface Juice {
  id: string;
  name: string;
  price: number;
  size?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  addOns?: AddOn[];
  friesUpsell?: Fry[];
  juiceUpsell?: Juice[];
}
