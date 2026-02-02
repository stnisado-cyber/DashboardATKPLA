
import React from 'react';
import { LayoutDashboard, Package, History, Users, Settings, LogOut, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan', icon: <LayoutDashboard size={20} /> },
    { id: 'inventory', label: 'Stok Barang', icon: <Package size={20} /> },
    { id: 'transactions', label: 'Riwayat In/Out', icon: <History size={20} /> },
    { id: 'users', label: 'User Pemakai', icon: <Users size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-slate-300 flex flex-col border-r border-slate-800 shadow-xl z-50">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Package size={18} className="text-white" />
          </div>
          ATK-Master
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">HRGA Dashboard</p>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </div>
            {activeTab === item.id && <ChevronRight size={14} />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-indigo-400">
              BE
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">Beb Admin</p>
              <p className="text-xs text-slate-500 truncate">hrga@office.com</p>
            </div>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 p-3 text-slate-400 hover:text-rose-400 transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
