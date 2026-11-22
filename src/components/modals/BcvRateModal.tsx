import React, { useState } from 'react';
import { useNexo } from '../../context/NexoContext';
import { X, Landmark, ShieldCheck } from 'lucide-react';

export const BcvRateModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { bcvRate, setBcvRate } = useNexo();
  const [tempRate, setTempRate] = useState<number>(bcvRate);

  if (!isOpen) return null;

  const handleSave = () => {
    if (tempRate > 0) {
      setBcvRate(tempRate);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-xs text-slate-800">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Tasa Oficial del Banco Central de Venezuela
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-500 leading-relaxed">
          En cumplimiento del marco cambiario venezolano, todas las cotizaciones de almacenaje y fletes pueden liquidarse en Bolívares indexados a la tasa oficial BCV:
        </p>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Tasa Oficial (Bs. / USD)</label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={tempRate}
              onChange={(e) => setTempRate(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold font-mono text-slate-900 focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
              VES/USD
            </span>
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            La indexación se congela durante 48 horas al emitir la orden y se ajusta automáticamente a la tasa oficial del día de la dispersión final.
          </span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow transition"
          >
            Actualizar Tasa
          </button>
        </div>
      </div>
    </div>
  );
};
