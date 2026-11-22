import React, { useState } from 'react';
import { useNexo } from '../../context/NexoContext';
import type { UserRole } from '../../types';
import {
  Sparkles,
  X,
  Compass,
  Truck,
  ShieldCheck,
  Package
} from 'lucide-react';

const STORAGE_KEY = 'nexo_welcome_dismissed';

// Flujo recomendado de la demo según el perfil activo.
const ROLE_GUIDE: Record<UserRole, {
  steps: { icon: typeof Compass; label: string; tab: 'explorar' | 'inventario' | 'despachos' | 'escrow' }[];
}> = {
  proveedor: {
    steps: [
      { icon: Compass, label: '1. Reservar galpón', tab: 'explorar' },
      { icon: Truck, label: '2. Despachar con QR', tab: 'despachos' },
      { icon: ShieldCheck, label: '3. Pago en Escrow', tab: 'escrow' }
    ]
  },
  dueno_galpon: {
    steps: [
      { icon: Package, label: '1. Mi inventario', tab: 'inventario' },
      { icon: Truck, label: '2. Despachar con QR', tab: 'despachos' },
      { icon: ShieldCheck, label: '3. Retirar ingresos', tab: 'escrow' }
    ]
  },
  transportista: {
    steps: [
      { icon: Truck, label: '1. Mi viaje', tab: 'explorar' },
      { icon: Compass, label: '2. Escanear QR', tab: 'despachos' },
      { icon: ShieldCheck, label: '3. Mi pago', tab: 'escrow' }
    ]
  },
  cliente: {
    steps: [
      { icon: Truck, label: '1. Rastrear flete en vivo', tab: 'despachos' },
      { icon: Compass, label: '2. Contactar chofer (WhatsApp)', tab: 'despachos' },
      { icon: ShieldCheck, label: '3. Firma QR al portón', tab: 'despachos' }
    ]
  }
};

export const WelcomeGuide: React.FC = () => {
  const { role, setActiveTab } = useNexo();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  const guide = ROLE_GUIDE[role];

  const handleDismiss = (permanent: boolean) => {
    setDismissed(true);
    if (permanent) {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="mx-6 mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Flujo</span>
        </div>

        {/* Pasos del flujo, clicables para navegar */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {guide.steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(step.tab)}
                className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 text-[11px] font-bold whitespace-nowrap transition shrink-0"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => handleDismiss(true)}
          title="Ocultar guía"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
