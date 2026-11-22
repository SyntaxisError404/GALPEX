import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { useNexo } from '../../context/NexoContext';
import {
  Building2,
  Package,
  Truck,
  ShieldCheck,
  Lock,
  Layers
} from 'lucide-react';

type NavItem = {
  id: 'explorar' | 'inventario' | 'despachos' | 'escrow';
  label: string;
  icon: LucideIcon;
  badge?: string;
  highlight?: boolean;
};

export const Sidebar: React.FC = () => {
  const { role, activeTab, setActiveTab, totalEscrowBalance, bcvRate, warehouses, inventory } = useNexo();

  // Navegación adaptada a cada perfil: cada rol ve solo las secciones que le competen.
  const navByRole: Record<typeof role, NavItem[]> = {
    proveedor: [
      { id: 'explorar' as const, label: 'Explorar Galpones', icon: Building2, badge: String(warehouses.length) },
      { id: 'despachos' as const, label: 'Despachos & QR', icon: Truck, highlight: true },
      { id: 'escrow' as const, label: 'Pagos Escrow', icon: ShieldCheck }
    ],
    dueno_galpon: [
      { id: 'inventario' as const, label: 'Mi Inventario', icon: Package, badge: String(inventory.length) },
      { id: 'despachos' as const, label: 'Despachos & QR', icon: Truck, highlight: true },
      { id: 'escrow' as const, label: 'Pagos Escrow', icon: ShieldCheck }
    ],
    transportista: [
      { id: 'explorar' as const, label: 'Mis Viajes Asignados', icon: Truck, highlight: true },
      { id: 'despachos' as const, label: 'Despachos & QR', icon: Package },
      { id: 'escrow' as const, label: 'Pagos Escrow', icon: ShieldCheck }
    ]
  };

  const navItems = navByRole[role];

  return (
    <aside className="w-64 bg-[#0a1128] text-slate-300 flex flex-col justify-between border-r border-slate-800/80 min-h-[calc(100vh-84px)] select-none">
      <div>
        {/* Brand Logo & Title */}
        <div className="px-5 py-5 border-b border-slate-800/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>NexoCarga</span>
            </div>
            <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
              Logística B2B
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="px-5 pt-6 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Operaciones
        </div>

        {/* Navigation items */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600/90 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom Custodia Activa Badge */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/50">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Custodia Activa</span>
          </div>
          <div className="text-[11px] text-slate-400">Saldo Protegido en Escrow</div>
          <div className="text-lg font-black text-white font-mono mt-0.5">
            ${totalEscrowBalance.toFixed(2)} <span className="text-xs font-normal text-slate-400">USD</span>
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Tasa Asegurada BCV: {(totalEscrowBalance * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 0 })} VES
          </div>
        </div>
      </div>
    </aside>
  );
};
