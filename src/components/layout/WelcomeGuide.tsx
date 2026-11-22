import React, { useState } from 'react';
import { useNexo } from '../../context/NexoContext';
import type { UserRole } from '../../types';
import {
  Sparkles,
  X,
  ArrowRight,
  Compass,
  Truck,
  ShieldCheck,
  Package
} from 'lucide-react';

const STORAGE_KEY = 'nexo_welcome_dismissed';

// Explicación de cada perfil y el flujo recomendado de la demo.
const ROLE_GUIDE: Record<UserRole, {
  who: string;
  does: string;
  steps: { icon: typeof Compass; label: string; tab: 'explorar' | 'inventario' | 'despachos' | 'escrow' }[];
}> = {
  proveedor: {
    who: 'Eres Sofía (Proveedor / TecnoParts C.A.)',
    does: 'Buscas un galpón con espacio libre y reservas solo por los días y paletas que necesitas.',
    steps: [
      { icon: Compass, label: '1. Explora y reserva un galpón', tab: 'explorar' },
      { icon: Truck, label: '2. Genera el despacho y escanea el QR', tab: 'despachos' },
      { icon: ShieldCheck, label: '3. Observa la liberación del pago (Escrow)', tab: 'escrow' }
    ]
  },
  dueno_galpon: {
    who: 'Eres Manuel (Dueño de Galpón / Logística Castillito)',
    does: 'Monetizas el espacio ocioso de tu galpón y controlas los lotes almacenados en tiempo real.',
    steps: [
      { icon: Package, label: '1. Revisa tu inventario y vencimientos', tab: 'inventario' },
      { icon: Truck, label: '2. Despacha un lote con doble QR', tab: 'despachos' },
      { icon: ShieldCheck, label: '3. Retira tus ingresos del Escrow', tab: 'escrow' }
    ]
  },
  transportista: {
    who: 'Eres Pedro (Transportista / Trans-Carabobo Express)',
    does: 'Recibes viajes con tarifa garantizada y cobras al confirmar la entrega con el segundo QR.',
    steps: [
      { icon: Truck, label: '1. Abre tu viaje asignado', tab: 'explorar' },
      { icon: Compass, label: '2. Escanea el QR de retiro y entrega', tab: 'despachos' },
      { icon: ShieldCheck, label: '3. Verifica tu pago liberado', tab: 'escrow' }
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
    <div className="mx-6 mt-6 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50/40 shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Bienvenido a la demo de NexoCarga
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold border border-blue-200">
                  GUÍA RÁPIDA
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                <strong className="text-slate-900">{guide.who}.</strong> {guide.does}
                {' '}Cambia de perfil cuando quieras con los botones azul/verde/ámbar de la barra superior.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleDismiss(false)}
            title="Ocultar guía"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pasos del flujo, clicables para navegar */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {guide.steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <button
                key={i}
                onClick={() => setActiveTab(step.tab)}
                className="group flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm text-left transition"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center shrink-0 transition">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-blue-700 leading-tight">
                  {step.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 ml-auto shrink-0 transition" />
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-end">
          <button
            onClick={() => handleDismiss(true)}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            Entendido, no volver a mostrar
          </button>
        </div>
      </div>
    </div>
  );
};
