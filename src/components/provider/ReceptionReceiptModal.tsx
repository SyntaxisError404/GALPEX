import React from 'react';
import { StoredLot } from '../../types';
import {
  CheckCircle2,
  ShieldCheck,
  Scale,
  Hash,
  X,
  ArrowRight
} from 'lucide-react';
import { useNexo } from '../../context/NexoContext';

export const ReceptionReceiptModal: React.FC<{
  lot: StoredLot;
  onClose: () => void;
}> = ({ lot, onClose }) => {
  const { setActiveTab, createNewDispatchFromLot, bcvRate } = useNexo();

  const handleImmediateDispatch = () => {
    onClose();
    createNewDispatchFromLot(
      lot.id,
      'Ferretería El Tornillo C.A.',
      'Av. Universidad, C.C. Naguanagua Plaza, Naguanagua'
    );
  };

  const handleGoToInventory = () => {
    onClose();
    setActiveTab('inventario');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-extrabold flex items-center gap-2">
                <span>Acta Digital de Recepción y Pesaje en Galpón</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                  CONFORME
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Registro criptográfico formal según Código de Comercio y SADA
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Main Info Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">N° Acta Digital</span>
              <strong className="text-slate-800 font-mono">ADR-2026-{lot.sku.slice(-4)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Almacén Receptor</span>
              <strong className="text-slate-800 truncate block">{lot.warehouseName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Volumen Verificado</span>
              <strong className="text-slate-800">{lot.palletsCount} Paletas ({lot.boxesCount} cajas)</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Guía SADA / SICA</span>
              <strong className="text-emerald-700 font-mono font-bold">{lot.sadaGuide}</strong>
            </div>
          </div>

          {/* Photo & Audit Inspection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-100 relative group">
              <img 
                src={lot.photoUrl} 
                alt="Mercancía inspeccionada en paletas" 
                className="w-full h-44 object-cover"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[11px] text-white flex items-center justify-between">
                <span>Fotografía de Entrada (Bahía 04)</span>
                <span className="text-emerald-400 font-mono font-bold">PRECINTOS OK</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
                <Scale className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-blue-900">Pesaje Báscula Industrial Homologada</div>
                  <div className="text-blue-700 mt-0.5">Peso neto verificado: <strong>{(lot.palletsCount * 450).toLocaleString()} kg</strong></div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">Inspección Biométrica del Operador</div>
                  <div className="text-slate-600 mt-0.5">Operador de galpón validado en portón y precintos intactos sin novedad.</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                <Hash className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                <div className="overflow-hidden">
                  <div className="font-bold text-slate-800">Firma Criptográfica de Custodia (SHA-256)</div>
                  <div className="text-slate-500 font-mono text-[10px] truncate mt-0.5">{lot.cryptographicHash}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Financial summary of escrow deposit */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs">
            <div className="flex items-center justify-between font-bold text-emerald-950 mb-1">
              <span>Fondos Protegidos en Bóveda Escrow</span>
              <span className="text-sm font-extrabold text-emerald-700">
                ${((lot.palletsCount * lot.contractedDays * lot.dailyRate) + lot.antiAbandonmentDeposit).toFixed(2)} USD
              </span>
            </div>
            <p className="text-emerald-800 text-[11px] leading-relaxed">
              Equivalente indexado: <strong>{(((lot.palletsCount * lot.contractedDays * lot.dailyRate) + lot.antiAbandonmentDeposit) * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 0 })} VES</strong>. Incluye ${lot.antiAbandonmentDeposit.toFixed(2)} USD del Fondo de Garantía Anti-Abandono 100% reembolsable al completar el despacho.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={handleGoToInventory}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition"
          >
            Ver en Mi Inventario
          </button>
          <button
            onClick={handleImmediateDispatch}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition"
          >
            <span>Generar Orden de Despacho & QR Inmediato</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
