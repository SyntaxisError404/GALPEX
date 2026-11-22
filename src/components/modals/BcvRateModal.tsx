import React, { useState, useEffect } from 'react';
import { useNexo } from '../../context/NexoContext';
import { X, Landmark, ShieldCheck, RefreshCw, ExternalLink, CheckCircle2 } from 'lucide-react';

export const BcvRateModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { bcvRate, setBcvRate, bcvLastUpdated, bcvLoading, bcvSource, fetchLiveBcvRate } = useNexo();
  const [tempRate, setTempRate] = useState<number>(bcvRate);

  useEffect(() => {
    setTempRate(bcvRate);
  }, [bcvRate]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (tempRate > 0) {
      setBcvRate(tempRate);
      onClose();
    }
  };

  const formattedDate = bcvLastUpdated
    ? new Date(bcvLastUpdated).toLocaleString('es-VE', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    : 'Hoy en vivo';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-xs text-slate-800">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Tasa Oficial BCV en Vivo
              </h3>
              <div className="text-[10px] text-slate-400">
                Sincronización DolarApi Venezuela
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live API Info Banner */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              API en Tiempo Real
            </span>
            <button
              onClick={() => fetchLiveBcvRate()}
              disabled={bcvLoading}
              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-emerald-300 shadow-xs"
            >
              <RefreshCw className={`w-3 h-3 ${bcvLoading ? 'animate-spin' : ''}`} />
              <span>{bcvLoading ? 'Actualizando...' : 'Actualizar'}</span>
            </button>
          </div>
          <div className="text-[10px] text-emerald-700">
            Fuente: <strong>{bcvSource}</strong> • {formattedDate}
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">
            Tasa Oficial Aplicada (Bs. / USD)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={tempRate}
              onChange={(e) => setTempRate(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-base font-black font-mono text-slate-900 focus:ring-2 focus:ring-blue-500 pr-20"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
              VES/USD
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            Cotizada vía endpoint oficial <code className="text-blue-600 font-mono">ve.dolarapi.com</code>
          </p>
        </div>

        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600 text-[11px] flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Todas las órdenes retienen los fondos en USD y liquidan en Bolívares conforme a la tasa BCV oficial al momento exacto de la dispersión final por QR.
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow transition"
          >
            Fijar Tasa
          </button>
        </div>
      </div>
    </div>
  );
};
