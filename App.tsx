
import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import InventoryTable from './components/InventoryTable';
import TransactionForm from './components/TransactionForm';
import UserPortal from './components/UserPortal';
import { initialItems, initialTransactions } from './mockData';
import { ATKItem, Transaction, AppView } from './types';
import { supabase } from './supabaseClient';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Package, AlertTriangle, 
  Search, Clock, ArrowRight, ShieldCheck, UserCircle, Loader2, Database, Wifi, WifiOff, Info, AlertCircle
} from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [items, setItems] = useState<ATKItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<'connected' | 'offline'>('offline');
  const [dbError, setDbError] = useState<string | null>(null);

  const TABLE_INVENTORY = 'PortalATK';
  const TABLE_TRANSACTIONS = 'transactions';

  const fetchData = async () => {
    setIsLoading(true);
    setDbError(null);
    try {
      // 1. Ambil Barang (Tanpa ORDER BY 'name' agar tidak crash jika kolom beda)
      const { data: itemsData, error: itemsError } = await supabase
        .from(TABLE_INVENTORY)
        .select('*');
      
      if (itemsError) throw itemsError;
      
      // 2. Ambil Transaksi
      const { data: txData, error: txError } = await supabase
        .from(TABLE_TRANSACTIONS)
        .select('*')
        .order('date', { ascending: false })
        .limit(50);

      // Map data untuk memastikan case-insensitivity minimal
      const normalizedItems = (itemsData || []).map((item: any) => ({
        ...item,
        name: item.name || item.nama || item.item_name || 'Tanpa Nama',
        min_stock: item.min_stock || item.minStock || 0,
        last_updated: item.last_updated || item.lastUpdated || new Date().toISOString()
      })) as ATKItem[];

      setItems(normalizedItems);
      setTransactions(txData || []);
      setDbStatus('connected');
    } catch (err: any) {
      console.error("Supabase Error:", err.message);
      setDbError(err.message);
      setDbStatus('offline');
      // Fallback ke mock data
      if (items.length === 0) setItems(initialItems);
      if (transactions.length === 0) setTransactions(initialTransactions);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const lowStock = items.filter(i => i.stock <= (i.min_stock || 0)).length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const totalIn = monthlyTransactions.filter(t => t.type === 'IN').reduce((acc, t) => acc + t.quantity, 0);
    const totalOut = monthlyTransactions.filter(t => t.type === 'OUT').reduce((acc, t) => acc + t.quantity, 0);

    return {
      totalItems: items.length,
      lowStockItems: lowStock,
      totalInThisMonth: totalIn,
      totalOutThisMonth: totalOut
    };
  }, [items, transactions]);

  const updateItemStock = async (itemId: string, quantityChange: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return false;
    const newStock = item.stock + quantityChange;

    try {
      const { error } = await supabase
        .from(TABLE_INVENTORY)
        .update({ 
          stock: newStock, 
          last_updated: new Date().toISOString().split('T')[0] 
        })
        .eq('id', itemId);
      
      if (error) throw error;
      return true;
    } catch (err: any) {
      console.error("Gagal update stok:", err.message);
      return false;
    }
  };

  const handleAddTransaction = async (newTx: any) => {
    const tx = {
      item_id: newTx.itemId,
      item_name: newTx.itemName,
      type: newTx.type,
      quantity: newTx.quantity,
      user_name: newTx.userName,
      department: newTx.department,
      date: new Date().toISOString().split('T')[0],
      note: newTx.note
    };
    
    try {
      const { data, error } = await supabase.from(TABLE_TRANSACTIONS).insert([tx]).select();
      if (error) throw error;
      
      const success = await updateItemStock(newTx.itemId, newTx.type === 'IN' ? newTx.quantity : -newTx.quantity);
      if (success) {
        if (data) setTransactions(prev => [data[0], ...prev]);
        setItems(prev => prev.map(i => i.id === newTx.itemId ? { ...i, stock: i.stock + (newTx.type === 'IN' ? newTx.quantity : -newTx.quantity) } : i));
      }
    } catch (err: any) {
      alert(`Gagal Simpan: ${err.message}. Pastikan tabel 'transactions' sudah ada.`);
    }
  };

  const handleUserRequest = async (data: any) => {
    const selectedItem = items.find(i => i.id === data.itemId);
    const tx = {
      item_id: data.itemId,
      item_name: selectedItem?.name || 'Item',
      type: 'OUT',
      quantity: data.quantity,
      user_name: data.userName,
      department: data.department || 'Staff',
      date: data.date,
      note: 'Portal User'
    };

    try {
      const { error } = await supabase.from(TABLE_TRANSACTIONS).insert([tx]);
      if (error) throw error;
      
      const success = await updateItemStock(data.itemId, -data.quantity);
      if (success) {
        setItems(prev => prev.map(item => item.id === data.itemId ? { ...item, stock: item.stock - data.quantity } : item));
        fetchData();
      }
    } catch (err: any) {
      console.error("User request failed:", err.message);
      alert(`Ups, gagal Beb! Error: ${err.message}`);
    }
  };

  const chartData = useMemo(() => items.slice(0, 10).map(i => ({ name: i.name, stock: i.stock })), [items]);

  if (isLoading && view !== 'landing') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Menyambungkan ke database...</p>
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px]"></div>
        <div className="max-w-4xl w-full relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">ATK-Master <span className="text-indigo-400">Portal</span></h1>
            <p className="text-slate-400 text-lg">Manajemen Inventaris Terkoneksi ke PortalATK.</p>
            <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${dbStatus === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
               {dbStatus === 'connected' ? <Wifi size={12} /> : <WifiOff size={12} />}
               {dbStatus === 'connected' ? 'Database Online' : 'Mode Offline / Masalah Koneksi'}
            </div>
            {dbError && (
              <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center justify-center gap-2 mx-auto max-w-md">
                <AlertCircle size={14} />
                <span>Error: {dbError}</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button onClick={() => setView('user')} className="group bg-slate-800/50 hover:bg-emerald-600 border border-slate-700 hover:border-emerald-500 p-8 rounded-[2.5rem] text-left transition-all duration-500 shadow-2xl">
              <div className="bg-slate-700 group-hover:bg-white/20 p-4 rounded-3xl w-fit mb-6 transition-colors">
                <UserCircle size={40} className="text-emerald-400 group-hover:text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Portal Ambil ATK</h2>
              <p className="text-slate-400 group-hover:text-emerald-50 mb-8 leading-relaxed">Catat pengambilan barang secara mandiri di sini.</p>
              <div className="flex items-center gap-2 text-emerald-400 group-hover:text-white font-bold">Mulai Sekarang <ArrowRight size={18} /></div>
            </button>
            <button onClick={() => setView('admin')} className="group bg-slate-800/50 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 p-8 rounded-[2.5rem] text-left transition-all duration-500 shadow-2xl">
              <div className="bg-slate-700 group-hover:bg-white/20 p-4 rounded-3xl w-fit mb-6 transition-colors">
                <ShieldCheck size={40} className="text-indigo-400 group-hover:text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Dashboard HRGA</h2>
              <p className="text-slate-400 group-hover:text-indigo-50 mb-8 leading-relaxed">Monitor stok di tabel PortalATK dan kelola data.</p>
              <div className="flex items-center gap-2 text-indigo-400 group-hover:text-white font-bold">Buka Dashboard <ArrowRight size={18} /></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'user') return <UserPortal items={items} onSubmit={handleUserRequest} onBack={() => setView('landing')} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ml-64 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <button onClick={() => setView('landing')} className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest">Portal Utama</button>
               <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${dbStatus === 'connected' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                 {dbStatus === 'connected' ? <Wifi size={10} /> : <WifiOff size={10} />}
                 {dbStatus === 'connected' ? 'SINKRON: AKTIF' : 'SINKRON: GAGAL'}
               </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Halo Beb! 👋</h1>
            <p className="text-slate-500 font-medium">Dashboard pemantauan PortalATK.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchData} className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-indigo-600 transition-colors shadow-sm" title="Refresh Data"><Database size={20} /></button>
          </div>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Item" value={stats.totalItems} sub="Di database" icon={<Package size={24} />} color="indigo" />
              <StatCard title="Stok Kritis" value={stats.lowStockItems} sub="Segera Order" icon={<AlertTriangle size={24} />} color="rose" isWarning={stats.lowStockItems > 0} />
              <StatCard title="Masuk (Bln ini)" value={stats.totalInThisMonth} sub="Unit" icon={<TrendingUp size={24} />} color="emerald" />
              <StatCard title="Keluar (Bln ini)" value={stats.totalOutThisMonth} sub="Unit" icon={<TrendingDown size={24} />} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">Level Persediaan</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="stock" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <TransactionForm items={items} onAddTransaction={handleAddTransaction} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && <InventoryTable items={items} />}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h2 className="text-lg font-bold text-slate-800">Log Transaksi</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold">
                  <tr><th className="px-6 py-4">Waktu</th><th className="px-6 py-4">Item</th><th className="px-6 py-4">Qty</th><th className="px-6 py-4">User</th><th className="px-6 py-4">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400">Belum ada transaksi di database.</td></tr>
                  ) : (
                    transactions.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50 text-sm">
                        <td className="px-6 py-4 text-slate-500">{t.date}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{t.item_name}</td>
                        <td className="px-6 py-4 font-bold">{t.quantity}</td>
                        <td className="px-6 py-4"><div>{t.user_name}</div><div className="text-[10px] text-slate-400">{t.department}</div></td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.type === 'IN' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {t.type === 'IN' ? 'STOCK IN' : 'STOCK OUT'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard: React.FC<{title: string; value: number; sub: string; icon: React.ReactNode; color: string; isWarning?: boolean;}> = ({ title, value, sub, icon, color, isWarning }) => {
  const colors: any = { indigo: 'bg-indigo-50 text-indigo-600', emerald: 'bg-emerald-50 text-emerald-600', rose: 'bg-rose-50 text-rose-600', amber: 'bg-amber-50 text-amber-600' };
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border transition-all ${isWarning ? 'border-rose-300 ring-4 ring-rose-50' : 'border-slate-200 hover:shadow-md'}`}>
      <div className="flex justify-between items-start mb-4"><div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div></div>
      <div><h3 className="text-slate-500 text-sm font-semibold">{title}</h3><div className="text-3xl font-bold text-slate-900 my-1">{value}</div><p className="text-slate-400 text-xs font-medium">{sub}</p></div>
    </div>
  );
};

export default App;
