
import React from 'react';
import { ATKItem } from '../types';
import { Edit2, Trash2, Plus, AlertCircle } from 'lucide-react';

interface InventoryTableProps {
  items: ATKItem[];
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Data Stok PortalATK</h2>
          <p className="text-sm text-slate-500">Monitoring real-time inventaris kantor.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium">
          <Plus size={18} />
          Tambah Item
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Nama Barang</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4 text-center">Stok</th>
              <th className="px-6 py-4">Satuan</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => {
              const isLow = item.stock <= (item.min_stock || 0);
              return (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono uppercase">{item.id.substring(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-extrabold text-lg ${isLow ? 'text-rose-600' : 'text-slate-800'}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{item.unit}</td>
                  <td className="px-6 py-4">
                    {isLow ? (
                      <span className="flex items-center gap-1 text-rose-600 text-[10px] font-bold bg-rose-50 px-2 py-1 rounded-full w-fit border border-rose-100">
                        <AlertCircle size={10} />
                        RE-ORDER
                      </span>
                    ) : (
                      <span className="text-emerald-600 text-[10px] font-bold bg-emerald-50 px-2 py-1 rounded-full w-fit border border-emerald-100">
                        AMAN
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
