import React, { useState } from 'react';
import { useNexo } from '../../context/NexoContext';
import {
  Lock,
  Unlock,
  Landmark,
  Percent,
  FileCheck2,
  TrendingUp
} from 'lucide-react';
import { LegalFooterBanner } from '../layout/LegalFooterBanner';

export const EscrowVaultView: React.FC = () => {
  const { escrowTransactions, bcvRate } = useNexo();
  const [calcUsd, setCalcUsd] = useState<number>(100);

  const totalRetainedUsd = escrowTransactions
    .filter(t => t.status === 'retenido')
    .reduce((acc, t) => acc + t.amountUsd, 0);

  const totalLiquidatedUsd = escrowTransactions
    .filter(t => t.status === 'liquidado')
    .reduce((acc, t) => acc + t.amountUsd, 0);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] p-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            BÓVEDA DE CUSTODIA INTELIGENTE
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Pagos en Custodia & Smart Escrow</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-200">
              SEGREGACIÓN BANCARIA 100%
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Los fondos se liberan solo tras el doble escaneo QR de entrega.
          </p>
        </div>

        {/* BCV badge */}
        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-3 shrink-0 shadow-sm">
          <Landmark className="w-5 h-5 text-amber-400" />
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Tasa Oficial BCV</div>
            <div className="text-sm font-black font-mono text-amber-300">{bcvRate.toFixed(2)} Bs / USD</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              FONDOS EN CUSTODIA (ESCROW ACTIVO)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ${totalRetainedUsd.toFixed(2)} USD
          </div>
          <div className="text-xs text-amber-700 font-semibold mt-1">
            ≈ {(totalRetainedUsd * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 2 })} VES
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              FONDOS DISPERSADOS (LIQUIDADOS)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Unlock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-900 font-mono">
            ${totalLiquidatedUsd.toFixed(2)} USD
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">
            Liberados a choferes y galponeros
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              COMISIÓN OPERATIVA PLATAFORMA
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-900 font-mono">
            10.0%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Retenida únicamente al completarse la entrega
          </div>
        </div>
      </div>

      {/* BCV Live Calculator & Model Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive BCV indexer */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Calculadora de Indexación Oficial BCV
            </h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Operaciones en USD, liquidadas a la tasa BCV oficial.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Monto en USD</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  value={calcUsd}
                  onChange={(e) => setCalcUsd(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm font-bold font-mono bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 text-white space-y-2">
              <div className="text-[11px] text-slate-400 font-medium flex justify-between">
                <span>Tasa Aplicada (Banco Central de Venezuela):</span>
                <strong className="text-amber-300">{bcvRate.toFixed(2)} Bs / $</strong>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {(calcUsd * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 2 })} VES
              </div>
              <div className="text-[10px] text-slate-400">
                Liquidación inmediata mediante Pago Móvil Interbancario C2P.
              </div>
            </div>
          </div>
        </div>

        {/* Operational Split Mechanics */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              ¿Cómo se reparten $145 de una operación?
            </h3>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Ejemplo real: al confirmarse la entrega por QR, los fondos retenidos se dispersan automáticamente a cada actor. NexoCarga solo cobra el 10% de comisión.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase">DUEÑO DEL GALPÓN</div>
              <div className="text-lg font-black text-slate-900 font-mono">$45.00</div>
              <div className="text-[11px] text-slate-600">Almacenaje por día/paleta devengado.</div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
              <div className="text-[10px] font-bold text-blue-700 uppercase">TRANSPORTISTA</div>
              <div className="text-lg font-black text-blue-900 font-mono">$85.00</div>
              <div className="text-[11px] text-blue-800">Flete de última milla verificado por QR.</div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">NEXOCARGA (10%)</div>
              <div className="text-lg font-black text-emerald-900 font-mono">$15.00</div>
              <div className="text-[11px] text-emerald-800">Comisión por custodia, software y SADA.</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong>Protección Anti-Fraude:</strong> El sistema previene disputas mediante hash criptográfico SHA-256 generado al momento de la admisión física y liberado al firmar el receptor en destino.
          </div>
        </div>
      </div>

      {/* Escrow Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-4.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Libro Mayor de Transacciones Escrow
            </h3>
            <p className="text-xs text-slate-500">
              Auditoría inmutable de depósitos, retenciones y liquidaciones.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {escrowTransactions.length} Movimientos Registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">FECHA / HORA</th>
                <th className="py-3 px-4">REFERENCIA</th>
                <th className="py-3 px-4">CONCEPTO</th>
                <th className="py-3 px-4">BENEFICIARIO</th>
                <th className="py-3 px-4">MÉTODO</th>
                <th className="py-3 px-4">MONTO (USD)</th>
                <th className="py-3 px-4 text-right">ESTADO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {escrowTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 text-slate-500">{tx.timestamp}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{tx.referenceCode}</td>
                  <td className="py-3.5 px-4 text-slate-900 max-w-xs truncate">{tx.concept}</td>
                  <td className="py-3.5 px-4 text-slate-600">{tx.beneficiary}</td>
                  <td className="py-3.5 px-4 font-medium uppercase text-[10px] text-slate-500">
                    {tx.method.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ${tx.amountUsd.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      tx.status === 'liquidado'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {tx.status === 'liquidado' ? 'Liquidado' : 'Retenido en Custodia'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LegalFooterBanner />
    </div>
  );
};
