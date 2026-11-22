import React, { useState } from 'react';
import { useNexo } from '../../context/NexoContext';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import {
  Bell,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  Database,
  LogOut
} from 'lucide-react';

const ROLE_META: Record<UserRole, { label: string; badge: string; avatarBg: string }> = {
  proveedor: { label: 'Proveedor', badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30', avatarBg: 'bg-blue-600' },
  dueno_galpon: { label: 'Dueño de Galpón', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', avatarBg: 'bg-emerald-600' },
  transportista: { label: 'Transportista', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30', avatarBg: 'bg-amber-600' }
};

export const Navbar: React.FC<{ onOpenBcvModal: () => void }> = ({ onOpenBcvModal }) => {
  const { bcvRate, isCloudSynced } = useNexo();
  const { currentUser, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const meta = currentUser ? ROLE_META[currentUser.role] : ROLE_META.proveedor;
  const initials = currentUser ? currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('') : '';

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 select-none">
      {/* Top micro bar: estado y tasa BCV */}
      <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/80 flex flex-wrap items-center justify-end text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-4 text-xs">
          {isCloudSynced && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supabase Conectado</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Contratos Auditados</span>
          </div>

          <button
            onClick={onOpenBcvModal}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition"
            title="Click para ajustar la tasa oficial BCV"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Tasa BCV Oficial: <strong>{bcvRate.toFixed(2)} Bs/$</strong></span>
          </button>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Rol del usuario */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${meta.badge}`}>
            {meta.label}
          </span>
        </div>

        {/* Right: Notificaciones y perfil con sesión */}
        <div className="flex items-center gap-3">
          <button
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg relative transition"
            title="Notificaciones operativas"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>

          {/* User badge */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-800/80 transition"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-100">{currentUser?.name}</div>
                <div className="text-[11px] text-slate-400">{currentUser?.company}</div>
              </div>
              <div className={`w-8 h-8 rounded-full ${meta.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow`}>
                {initials}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-2.5 border-b border-slate-800">
                  <div className="font-bold text-slate-100">{currentUser?.name}</div>
                  <div className="text-[10px] text-slate-400">{currentUser?.email}</div>
                  <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold ${meta.badge}`}>
                    {meta.label}
                  </span>
                </div>
                <button
                  onClick={() => { setShowMenu(false); logout(); }}
                  className="w-full text-left px-3 py-2.5 hover:bg-slate-800 flex items-center gap-2 text-red-300 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
