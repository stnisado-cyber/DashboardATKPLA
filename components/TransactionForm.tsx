
import React, { useState } from 'react';
import { ATKItem, TransactionType } from '../types';
import { ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface TransactionFormProps {
  items: ATKItem[];
  onAddTransaction: (data: any) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ items, onAddTransaction }) => {
  const [type, setType] = useState<TransactionType>('OUT');
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 1,
    userName: '',
    department: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemId || !formData.userName) return;
    
    const selectedItem = items.find(i => i.id === formData.itemId);
    onAddTransaction({
      ...formData,
      type,
      itemName: selectedItem?.name || '',
      date: new Date().toISOString().split('T')[0]
    });
    
    // Reset
    setFormData({ itemId: '', quantity: 1, userName: '', department: '', note: '' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Input Transaksi Baru</h2>
      
      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setType('IN')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 transition-all ${
            type === 'IN' 
            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
            : 'border-slate-100 text-slate-400'
          }`}
        >
          <ArrowDownLeft size={18} />
          Barang Masuk
        </button>
        <button
          type="button"
          onClick={() => setType('OUT')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border-2 transition-all ${
            type === 'OUT' 
            ? 'border-rose-500 bg-rose-50 text-rose-700' 
            : 'border-slate-100 text-slate-400'
          }`}
        >
          <ArrowUpRight size={18} />
          Barang Keluar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Item</label>
          <select
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={formData.itemId}
            onChange={e => setFormData({ ...formData, itemId: e.target.value })}
            required
          >
            <option value="">-- Pilih Barang --</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>{item.name} (Sisa: {item.stock})</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah</label>
            <input
              type="number"
              min="1"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama User</label>
            <input
              type="text"
              placeholder="e.g. Budi Santoso"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={formData.userName}
              onChange={e => setFormData({ ...formData, userName: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Departemen</label>
          <input
            type="text"
            placeholder="e.g. Finance"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            value={formData.department}
            onChange={e => setFormData({ ...formData, department: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
          <textarea
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            rows={2}
            value={formData.note}
            onChange={e => setFormData({ ...formData, note: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-indigo-200"
        >
          <CheckCircle2 size={20} />
          Simpan Transaksi
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
