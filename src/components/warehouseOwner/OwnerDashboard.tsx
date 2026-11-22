import React, { useState } from 'react';
import { useNexo } from '../../context/NexoContext';
import { 
  Building2, 
  DollarSign, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp,
  Search,
  Filter,
  FileText,
  Plus,
  Scale,
  Truck,
  CheckCircle2,
  Download
} from 'lucide-react';
import { PublishWarehouseModal } from './PublishWarehouseModal';

export const OwnerDashboard: React.FC = () => {
  const { 
    inventory, 
    bcvRate, 
    executeAutomaticReturn, 
    createNewDispatchFromLot,
    setActiveReceptionReceipt 
  } = useNexo();

  const [searchTerm, setSearchTerm] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Search filter
  const filteredInventory = inventory.filter(item => 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lotCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReturnAction = (lotId: string) => {
    if (confirm('¿Ejecutar Cláusula 5 de Retorno Automático? El depósito de garantía de $30.00 USD cubrirá el flete de despacho de vuelta al origen, liberando el espacio sin costo para el galpón.')) {
      executeAutomaticReturn(lotId);
    }
  };

  const handleDispatchAction = (lotId: string) => {
    createNewDispatchFromLot(
      lotId,
      'Ferretería El Tornillo C.A.',
      'Av. Universidad, C.C. Naguanagua Plaza, Naguanagua'
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] p-6 space-y-6">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            CONSOLA OPERATIVA / GALPÓN SAN DIEGO - NAVE B
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Monetización & Ocupación
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Control de custodias y rendimiento de tu galpón.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Reporte Fiscal</span>
          </button>

          <button
            onClick={() => setShowPayoutModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition"
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Retirar Escrow ($1,840.00)</span>
          </button>

          <button
            onClick={() => setShowPublishModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Publicar Espacio</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards (Matches Screenshot 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Espacio Monetizado */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              ESPACIO MONETIZADO
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono flex items-baseline gap-1.5">
            <span>68%</span>
            <span className="text-xs font-semibold text-slate-400">(540 m²)</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% vs mes anterior</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>

        {/* KPI 2: Ingresos del Mes */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              INGRESOS DEL MES
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            $1,840.00
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Escrow Liquidable Inmediato</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Tasa fijada: Bs. {bcvRate.toFixed(2)} / USD
          </div>
        </div>

        {/* KPI 3: Lotes Activos */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              LOTES ACTIVOS
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            12 Proveedores
          </div>
          <div className="text-[11px] text-slate-500 truncate mt-1">
            TecnoParts, Polar, FerreQuim...
          </div>
          <div className="text-[10px] text-blue-600 font-semibold mt-1">
            • 92 paletas en custodia física
          </div>
        </div>

        {/* KPI 4: Garantías Anti-Abandono */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              GARANTÍAS ANTI-ABANDONO
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            $360.00
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            12 depósitos de $30 en custodia
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">
            Riesgo calculado: 0% Mora Histórica
          </div>
        </div>
      </div>

      {/* Main Table: Control de Galpón (Matches Screenshot 3) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Table Header Filter bar */}
        <div className="p-4.5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              Mi Inventario & Control de Galpón
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Estancias, depósitos y vencimientos en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar SKU, proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-64"
              />
            </div>
            <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">SKU / LOTE</th>
                <th className="py-3 px-4">NOMBRE DEL PROVEEDOR</th>
                <th className="py-3 px-4">PALETAS</th>
                <th className="py-3 px-4">DÍAS RESTANTES</th>
                <th className="py-3 px-4">GARANTÍA ESCROW</th>
                <th className="py-3 px-4">ESTADO OPERATIVO</th>
                <th className="py-3 px-4 text-right">ACCIÓN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredInventory.map((item) => {
                const isUrgent = item.remainingDays <= 3 || item.status === 'vence_pronto';
                const isAutoReturned = item.status === 'retorno_automatico';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    {/* SKU / Lote */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 font-mono">
                        {isUrgent && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                        <span>{item.sku}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans">
                        {item.lotCode}
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.providerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">RIF: {item.providerRif}</div>
                    </td>

                    {/* Pallets */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.palletsCount}
                    </td>

                    {/* Remaining Days */}
                    <td className="py-3.5 px-4 font-mono">
                      {isAutoReturned ? (
                        <span className="text-red-600 font-bold">Mora Saldada</span>
                      ) : isUrgent ? (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                          • {item.remainingDays} días
                        </span>
                      ) : (
                        <span className="text-slate-600">{item.remainingDays} días</span>
                      )}
                    </td>

                    {/* Escrow Guarantee */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-emerald-700 font-mono">
                        ${item.antiAbandonmentDeposit.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400">Protegido</div>
                    </td>

                    {/* Operating Status */}
                    <td className="py-3.5 px-4">
                      {isAutoReturned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold">
                          Retorno Automático Activado
                        </span>
                      ) : isUrgent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Vence en 2 días - Retorno listo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Almacenamiento Normal
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      {isAutoReturned ? (
                        <span className="text-[11px] text-slate-400 font-medium">
                          En tránsito de regreso
                        </span>
                      ) : isUrgent ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDispatchAction(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition"
                          >
                            Generar Acta / Despachar
                          </button>
                          <button
                            onClick={() => handleReturnAction(item.id)}
                            title="Ejecutar Retorno Automático con Depósito de Garantía (Cláusula 5)"
                            className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] border border-amber-300 transition"
                          >
                            Retorno Auto
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveReceptionReceipt(item)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition"
                        >
                          Ver Detalles
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Mostrando {filteredInventory.length} de 12 lotes almacenados</span>
          <span className="text-slate-500">Actualizado vía SADA / SICA en tiempo real</span>
        </div>
      </div>

      {/* Bottom Information Cards (Matches Screenshot 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Blindaje Legal Automatizado
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Actas de recepción con firma criptográfica y foto que eliminan disputas de conteo o mermas.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Flete de Respaldo (Anti-Abandono)
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Al vencer el plazo, la carga regresa usando el depósito de $30, liberando tu espacio sin pérdidas.
            </p>
          </div>
        </div>
      </div>

      {/* Publish Warehouse Modal */}
      {showPublishModal && (
        <PublishWarehouseModal onClose={() => setShowPublishModal(false)} />
      )}

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Retiro de Fondos Escrow Acumulados
                </h3>
              </div>
              <button onClick={() => setShowPayoutModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <div className="text-xs text-emerald-800 font-semibold">Saldo Liquidable Inmediato</div>
              <div className="text-3xl font-black text-emerald-950 font-mono mt-1">$1,840.00 USD</div>
              <div className="text-xs text-emerald-700 mt-1 font-mono">
                ≈ {(1840.00 * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 2 })} VES (Tasa BCV {bcvRate.toFixed(2)})
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">Destino de Transferencia</label>
              <div className="p-3 rounded-lg border border-slate-300 bg-slate-50 space-y-1">
                <div className="font-bold text-slate-900">Banesco Banco Universal (Cuenta Corriente)</div>
                <div className="text-slate-500 font-mono text-[11px]">0134-0239-12-0001928391 • RIF: J-31098234-9</div>
                <div className="text-slate-500 text-[11px]">Logística Castillito C.A.</div>
              </div>
            </div>

            <button
              onClick={() => {
                alert('¡Solicitud de retiro procesada! Los fondos se reflejarán en tu cuenta Banesco en los próximos minutos vía liquidación interbancaria SUDEBAN.');
                setShowPayoutModal(false);
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition"
            >
              Confirmar Retiro Inmediato
            </button>
          </div>
        </div>
      )}

      {/* Fiscal Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Reporte Fiscal & Retenciones SENIAT
                </h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Resumen tributario conforme a la Providencia Administrativa SENIAT sobre facturación electrónica y retención de IVA e ISLR en depósitos mercantiles:
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono">
                <div className="flex justify-between"><span>Base Imponible Almacenaje:</span><strong>$1,840.00 USD</strong></div>
                <div className="flex justify-between text-slate-500"><span>Equivalente BCV:</span><strong>{(1840 * bcvRate).toLocaleString()} Bs.</strong></div>
                <div className="flex justify-between"><span>Comisión KARGON (10%):</span><strong>$184.00 USD</strong></div>
                <div className="flex justify-between"><span>Retención ISLR Estimada (2%):</span><strong>$36.80 USD</strong></div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-[11px]">
                Facturación fiscal automática emitida con número de control y RIF al día.
              </div>
            </div>

            <button
              onClick={() => {
                alert('Reporte en formato PDF descargado.');
                setShowReportModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
            >
              Descargar Comprobante Fiscal PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
