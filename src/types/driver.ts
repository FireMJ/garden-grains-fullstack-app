export interface DeliveryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryInstructions: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  distance: number;
  estimatedTime: number;
  createdAt: string;
  scheduledTime?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface DriverProfile {
  id: string;
  uid: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: 'car' | 'motorcycle' | 'bicycle';
  licensePlate: string;
  status: 'available' | 'busy' | 'offline';
  rating: number;
  totalDeliveries: number;
  earnings: {
    today: number;
    week: number;
    month: number;
    total: number;
  };
  currentLocation?: {
    lat: number;
    lng: number;
    updatedAt: string;
  };
  documents: {
    driversLicense: boolean;
    vehicleRegistration: boolean;
    backgroundCheck: boolean;
  };
}

export interface DeliveryEarning {
  id: string;
  orderId: string;
  driverId: string;
  amount: number;
  distance: number;
  timeSpent: number;
  status: 'pending' | 'completed' | 'failed';
  completedAt?: string;
}
