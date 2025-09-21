export type OrderChannel = 'dine_in' | 'gofood' | 'grabfood' | 'shopeefood';

export interface Branch {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  pin: string;
  role: 'cashier' | 'supervisor' | 'owner';
}

export interface MenuItem {
  id: number;
  name: string;
  prices: { [key in OrderChannel]: number };
  cost: number;
  category: string;
  imageUrl?: string;
}

export interface OrderItem extends Omit<MenuItem, 'prices'> {
  quantity: number;
  price: number; // Price for the specific channel
  orderChannel: OrderChannel;
}

export interface CompletedOrder {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount?: number;
  discountDetails?: string;
  tax: number;
  total: number;
  paymentMethod: string;
  timestamp: string;
  cashier: string;
  orderChannel: OrderChannel;
  branchId: number;
}

export interface Expense {
    id: number;
    description: string;
    amount: number;
    timestamp: string;
}

export interface DailySession {
    date: string;
    startTime: string;
    initialCash: number;
    expenses: Expense[];
    cashierId: number;
    cashierName: string;
    branchId: number;
}

export type ReportType = 'detailed' | 'summary';
