
import { ATKItem, Transaction } from './types';

export const initialItems: ATKItem[] = [
  // Fix property names from camelCase to snake_case to match ATKItem interface
  { id: '1', name: 'Kertas A4 80gr', category: 'Kertas', stock: 45, unit: 'Rim', min_stock: 10, last_updated: '2024-05-15' },
  { id: '2', name: 'Pulpen Gel Hitam', category: 'Alat Tulis', stock: 120, unit: 'Pcs', min_stock: 24, last_updated: '2024-05-14' },
  { id: '3', name: 'Tinta Printer HP Black', category: 'Tinta/Tonner', stock: 4, unit: 'Pcs', min_stock: 5, last_updated: '2024-05-10' },
  { id: '4', name: 'Map Snelhecter Biru', category: 'Arsip', stock: 50, unit: 'Pcs', min_stock: 20, last_updated: '2024-05-12' },
  { id: '5', name: 'Spidol Whiteboard', category: 'Alat Tulis', stock: 30, unit: 'Pcs', min_stock: 12, last_updated: '2024-05-16' },
  { id: '6', name: 'Buku Agenda', category: 'Kertas', stock: 15, unit: 'Pcs', min_stock: 5, last_updated: '2024-05-01' },
];

export const initialTransactions: Transaction[] = [
  // Fix property names from camelCase to snake_case to match Transaction interface
  { id: 't1', item_id: '1', item_name: 'Kertas A4 80gr', type: 'OUT', quantity: 5, user_name: 'Budi Santoso', department: 'Finance', date: '2024-05-16', note: 'Laporan Bulanan' },
  { id: 't2', item_id: '2', item_name: 'Pulpen Gel Hitam', type: 'OUT', quantity: 12, user_name: 'Ani Wijaya', department: 'HRD', date: '2024-05-15', note: 'Stok Tim HR' },
  { id: 't3', item_id: '3', item_name: 'Tinta Printer HP Black', type: 'IN', quantity: 10, user_name: 'Samsul', department: 'GA', date: '2024-05-14', note: 'Restock Vendor A' },
  { id: 't4', item_id: '1', item_name: 'Kertas A4 80gr', type: 'OUT', quantity: 10, user_name: 'Dewi Rahma', department: 'Legal', date: '2024-05-13', note: 'Draft Kontrak' },
  { id: 't5', item_id: '5', item_name: 'Spidol Whiteboard', type: 'OUT', quantity: 4, user_name: 'Eko', department: 'IT', date: '2024-05-12', note: 'Meeting Mingguan' },
];
