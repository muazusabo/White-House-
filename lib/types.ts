export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: string | number;
  imageUrl?: string | null;
  available: boolean;
  stock?: number | null;
  categoryId: number;
  category?: Category;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: string | number;
  quantity: number;
  subtotal: string | number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  lodgeNumber?: string | null;
  phone: string;
  email?: string | null;
  note?: string | null;
  paymentProofUrl?: string | null;
  collectionDate: string;
  collectionTime: string;
  status: OrderStatus;
  total: string | number;
  items: OrderItem[];
  createdAt: string;
}

export interface RestaurantSettings {
  restaurantName: string;
  logoUrl?: string | null;
  phone?: string | null;
  location?: string | null;
  openingHours?: string | null;
  collectionInstructions?: string | null;
  bankName?: string | null;
  accountName?: string | null;
  accountNumber?: string | null;
  paymentInstructions?: string | null;
}

export interface CartLine {
  product: Product;
  quantity: number;
}

export interface DashboardSummary {
  totalOrdersToday: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  completedOrders: number;
  totalSalesToday: string | number;
  availableProducts: number;
  unavailableProducts: number;
  topItems?: { productId: number; name: string; _sum: { quantity: number | null; subtotal: string | number | null } }[];
}
