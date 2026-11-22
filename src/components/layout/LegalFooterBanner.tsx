import React from 'react';
import { ShieldCheck, Scale, Award } from 'lucide-react';

export const LegalFooterBanner: React.FC = () => {
  return (
    <div className="mx-6 my-4 p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>Marco Legal Venezolano & Custodia Escrow</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              PÓLIZA ACTIVA #NC-2025-VNZ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Alineado al <strong>Código de Comercio</strong> y la <strong>Ley de Almacenes Generales de Depósito</strong>, con pólizas que protegen a ambas partes.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Fideicomiso Auditado</span>
        </div>
        <div className="hidden lg:flex items-center gap-1 text-xs text-slate-500">
          <Award className="w-3.5 h-3.5 text-slate-400" />
          <span>Validación SADA / SICA</span>
        </div>
      </div>
    </div>
  );
};
