
export type TransactionType = 'IN' | 'OUT';
export type AppView = 'landing' | 'admin' | 'user';

export interface ATKItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  min_stock: number; // Menggunakan snake_case untuk DB
  last_updated: string; // Menggunakan snake_case untuk DB
}

export interface Transaction {
  id: string;
  item_id: string; // Menggunakan snake_case untuk DB
  item_name: string;
  type: TransactionType;
  quantity: number;
  user_name: string;
  department: string;
  date: string;
  note?: string;
}

export interface DashboardStats {
  totalItems: number;
  lowStockItems: number;
  totalInThisMonth: number;
  totalOutThisMonth: number;
}
