import React, { useState } from 'react';
import { useNexo } from '../../context/NexoContext';
import type { UserRole } from '../../types';
import { 
  RotateCcw, 
  Bell, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  Award,
  ChevronDown,
  Database
} from 'lucide-react';

export const Navbar: React.FC<{ onOpenBcvModal: () => void }> = ({ onOpenBcvModal }) => {
  const { role, setRole, bcvRate, resetDemoData, setShowPitchModal, isCloudSynced } = useNexo();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roleProfiles: Record<UserRole, { name: string; org: string; avatarBg: string }> = {
    proveedor: {
      name: 'Sofía Rojas',
      org: 'TecnoParts C.A.',
      avatarBg: 'bg-blue-600'
    },
    dueno_galpon: {
      name: 'Manuel Mendoza',
      org: 'Logística Castillito C.A.',
      avatarBg: 'bg-emerald-600'
    },
    transportista: {
      name: 'Pedro Alvarado',
      org: 'Trans-Carabobo Express',
      avatarBg: 'bg-amber-600'
    }
  };

  const currentProfile = roleProfiles[role];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 select-none">
      {/* Top micro bar for Hackathon indicator & BCV */}
      <div className="bg-slate-950/80 px-4 py-1.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            HACKATÓN VALENVALLEY 2026
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-300 font-medium">Logística & Cadena de Suministro B2B</span>
        </div>

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

          <button
            onClick={() => setShowPitchModal(true)}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:brightness-110 shadow-sm transition"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Pitch 60s</span>
          </button>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Role Switcher Tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-800/90 rounded-lg border border-slate-700/80">
            <button
              onClick={() => setRole('proveedor')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                role === 'proveedor'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Proveedor
            </button>
            <button
              onClick={() => setRole('dueno_galpon')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                role === 'dueno_galpon'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Dueño de Galpón
            </button>
            <button
              onClick={() => setRole('transportista')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                role === 'transportista'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              Transportista
            </button>
          </div>

          <button
            onClick={resetDemoData}
            title="Reiniciar datos de prueba a valores iniciales"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-700 border border-slate-700 rounded-md transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reiniciar Demo</span>
          </button>
        </div>

        {/* Right: Notifications & Current User Profile */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowPitchModal(true)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Guía y Guion de Presentación"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
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
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-800/80 transition"
            >
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-100">{currentProfile.name}</div>
                <div className="text-[11px] text-slate-400">{currentProfile.org}</div>
              </div>
              <div className={`w-8 h-8 rounded-full ${currentProfile.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow`}>
                {currentProfile.name.split(' ').map(n => n[0]).join('')}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-800 text-slate-400">
                  Cambiar Perfil Activo
                </div>
                <button
                  onClick={() => { setRole('proveedor'); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-200"
                >
                  <div>
                    <div className="font-semibold text-blue-400">Sofía Rojas</div>
                    <div className="text-[10px] text-slate-400">TecnoParts C.A. (Proveedor)</div>
                  </div>
                  {role === 'proveedor' && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                </button>
                <button
                  onClick={() => { setRole('dueno_galpon'); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-200"
                >
                  <div>
                    <div className="font-semibold text-emerald-400">Manuel Mendoza</div>
                    <div className="text-[10px] text-slate-400">Logística Castillito (Galpón)</div>
                  </div>
                  {role === 'dueno_galpon' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                </button>
                <button
                  onClick={() => { setRole('transportista'); setShowRoleMenu(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-200"
                >
                  <div>
                    <div className="font-semibold text-amber-400">Pedro Alvarado</div>
                    <div className="text-[10px] text-slate-400">Trans-Carabobo (Transportista)</div>
                  </div>
                  {role === 'transportista' && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
