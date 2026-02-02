
import React, { useState } from 'react';
import { ATKItem } from '../types';
import { Send, Package, User, Calendar, Hash, ArrowLeft, CheckCircle } from 'lucide-react';

interface UserPortalProps {
  items: ATKItem[];
  onSubmit: (data: any) => void;
  onBack: () => void;
}

const UserPortal: React.FC<UserPortalProps> = ({ items, onSubmit, onBack }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: 1,
    userName: '',
    department: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemId || !formData.userName) return;
    
    onSubmit(formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ itemId: '', quantity: 1, userName: '', department: '', date: new Date().toISOString().split('T')[0] });
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-sm w-full animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Berhasil Dikirim!</h2>
          <p className="text-slate-500 mb-6">Permintaan ATK kamu sudah masuk ke sistem HRGA. Silahkan ambil barangnya ya!</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
          >
            Buat Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium text-sm">Kembali</span>
          </button>
          <h1 className="font-bold text-slate-800 flex items-center gap-2">
            <Package size={20} className="text-emerald-600" />
            Portal Ambil ATK
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-1 p-6 flex flex-col items-center">
        <div className="max-w-md w-full">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800">Butuh ATK, Beb?</h2>
            <p className="text-slate-500">Silahkan isi form di bawah untuk mencatat pengambilan barang kamu.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <User size={16} className="text-emerald-500" />
                Nama Pemakai
              </label>
              <input
                type="text"
                required
                placeholder="Masukkan nama lengkap kamu"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                value={formData.userName}
                onChange={e => setFormData({ ...formData, userName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Calendar size={16} className="text-emerald-500" />
                  Tanggal Ambil
                </label>
                <input
                  type="date"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Hash size={16} className="text-emerald-500" />
                  Jumlah
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={formData.quantity}
                  onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Package size={16} className="text-emerald-500" />
                Pilih Barang
              </label>
              <select
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                value={formData.itemId}
                onChange={e => setFormData({ ...formData, itemId: e.target.value })}
              >
                <option value="">-- Pilih Barang --</option>
                {items.filter(i => i.stock > 0).map(item => (
                  <option key={item.id} value={item.id}>{item.name} (Tersedia: {item.stock} {item.unit})</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transform active:scale-95"
            >
              <Send size={20} />
              Kirim Ke HRGA
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Pencatatan ini membantu HRGA memastikan stok ATK selalu tersedia untuk kamu. Terima kasih!
          </p>
        </div>
      </main>
    </div>
  );
};

export default UserPortal;
