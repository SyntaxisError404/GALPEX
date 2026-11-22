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
  Download,
  X
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
  const [showLegalContract, setShowLegalContract] = useState(false);

  // Search filter
  const filteredInventory = inventory.filter(item => 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lotCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReturnAction = (lotId: string) => {
    if (confirm('¿Ejecutar devolución de mercancía por tiempo vencido? El depósito de garantía de $25.00 USD ya cubrió el flete de regreso al cliente, por lo que tu espacio quedará libre de inmediato y sin costo para ti.')) {
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
            PANEL DE CONTROL DE TU GALPÓN / SAN DIEGO - NAVE B
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Control de Alquiler y Espacio Ocupado
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Supervisa los clientes que guardan mercancía en tu galpón y el dinero que vas ganando.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowLegalContract(true)}
            className="px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-900 font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Scale className="w-3.5 h-3.5 text-blue-700" />
            <span>Contrato Mercantil (Art. 535)</span>
          </button>

          <button
            onClick={() => setShowReportModal(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Descargar Resumen</span>
          </button>

          <button
            onClick={() => setShowPayoutModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition"
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Cobrar Dinero Acumulado ($960.00)</span>
          </button>

          <button
            onClick={() => setShowPublishModal(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Publicar Espacio Disponible</span>
          </button>
        </div>
      </div>

      {/* BANNER INSTITUCIONAL: PUNTO 3 (DEPOSITARIO MERCANTIL) Y PUNTO 4 (COBRO EN CUSTODIA) */}
      <div className="p-4.5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-900/40">
        <div className="flex items-start md:items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black text-white">
                Galpón Afiliado como Depositario Mercantil (Código de Comercio)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                RIF: J-31098234-9 Auditado
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed max-w-3xl">
              <strong>Garantía de Confianza:</strong> Bajo el <strong>Art. 535 del Código de Comercio</strong>, este galpón asume responsabilidad legal por la custodia de la mercancía. Los clientes pagan a la cuenta de custodia GALPEX y los fondos se liberan al completarse el resguardo. Si se detectara una gotera o daño imputable al galpón, <strong>los fondos se retienen de forma preventiva para indemnizar al cliente</strong>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowLegalContract(true)}
            className="text-xs font-black text-cyan-300 hover:text-white px-3.5 py-2 rounded-xl bg-blue-900/60 hover:bg-blue-800/80 border border-blue-700/50 transition whitespace-nowrap shadow-sm"
          >
            Ver Marco Legal & Retenciones
          </button>
        </div>
      </div>

      {/* 4 KPI Cards en lenguaje sencillo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Espacio Alquilado */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              ESPACIO ALQUILADO
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono flex items-baseline gap-1.5">
            <span>68%</span>
            <span className="text-xs font-semibold text-slate-400">(540 m² de 800 m²)</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1 mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% de ocupación este mes</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '68%' }}></div>
          </div>
        </div>

        {/* KPI 2: Dinero Ganado */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              DINERO GANADO ESTE MES
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            $960.00 USD
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Listo para transferir a tu cuenta</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            Tasa oficial BCV: Bs. {bcvRate.toFixed(2)} / USD
          </div>
        </div>

        {/* KPI 3: Clientes y Cargas */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              CLIENTES GUARDANDO CARGA
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            12 Clientes
          </div>
          <div className="text-[11px] text-slate-500 truncate mt-1">
            TecnoParts, Polar, FerreQuim...
          </div>
          <div className="text-[10px] text-blue-600 font-semibold mt-1">
            • 92 paletas guardadas en tu galpón
          </div>
        </div>

        {/* KPI 4: Garantía de Salida */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
              GARANTÍAS DE DESOCUPACIÓN
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            $300.00 USD
          </div>
          <div className="text-[11px] text-slate-600 mt-1">
            12 depósitos de $25 (flete cubierto)
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1">
            Garantizado: Si no retiran, el camión ya está pago
          </div>
        </div>
      </div>

      {/* Main Table: Control de Galpón */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Table Header Filter bar */}
        <div className="p-4.5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              Mercancía Almacenada en tu Galpón
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Revisa los días que le quedan a cada cliente y el estado de sus pagos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar cliente, producto, código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 sm:w-64"
              />
            </div>
            <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 transition">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filtrar</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-200/80">
                <th className="py-3 px-4">CÓDIGO / LOTE</th>
                <th className="py-3 px-4">CLIENTE / EMPRESA</th>
                <th className="py-3 px-4">PALETAS</th>
                <th className="py-3 px-4">TIEMPO RESTANTE</th>
                <th className="py-3 px-4">DEPÓSITO EN GARANTÍA</th>
                <th className="py-3 px-4">ESTADO ACTUAL</th>
                <th className="py-3 px-4 text-right">OPCIONES</th>
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
                        Lote: {item.lotCode}
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.providerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">RIF: {item.providerRif}</div>
                    </td>

                    {/* Pallets */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.palletsCount} paletas
                    </td>

                    {/* Remaining Days */}
                    <td className="py-3.5 px-4 font-mono">
                      {isAutoReturned ? (
                        <span className="text-slate-500 font-bold">Tiempo completado</span>
                      ) : isUrgent ? (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                          • Quedan {item.remainingDays} días
                        </span>
                      ) : (
                        <span className="text-slate-600">{item.remainingDays} días pagados</span>
                      )}
                    </td>

                    {/* Escrow Guarantee */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-emerald-700 font-mono">
                        ${item.antiAbandonmentDeposit.toFixed(2)} USD
                      </div>
                      <div className="text-[10px] text-slate-400">Flete garantizado</div>
                    </td>

                    {/* Operating Status */}
                    <td className="py-3.5 px-4">
                      {isAutoReturned ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold">
                          Devuelto al cliente (flete cubierto)
                        </span>
                      ) : isUrgent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          Vence pronto (quedan 2 días)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Almacenado al día
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      {isAutoReturned ? (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Espacio desocupado
                        </span>
                      ) : isUrgent ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDispatchAction(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition"
                          >
                            Dar Salida
                          </button>
                          <button
                            onClick={() => handleReturnAction(item.id)}
                            title="Regresar la carga usando el depósito de garantía que dejó el cliente"
                            className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] border border-amber-300 transition"
                          >
                            Devolver Carga
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveReceptionReceipt(item)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition"
                        >
                          Ver Comprobante con Foto
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
          <span>Mostrando {filteredInventory.length} de 12 clientes almacenando mercancía</span>
          <span className="text-slate-500">Registro seguro con fotos y firmas digitales</span>
        </div>
      </div>

      {/* Bottom Information Cards en lenguaje sencillo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Comprobante Digital con Foto al Recibir
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Cada vez que entra un camión se toma foto de las paletas y se firma digitalmente. Así nadie puede reclamar que faltó mercancía o que venía rota.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-100">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900">
              Garantía de Desocupación de Espacio
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Cada cliente deja un depósito de garantía de $25. Si vence su tiempo y no retira su mercancía, el sistema paga el camión de regreso a su origen para que tu espacio quede libre sin pérdidas.
            </p>
          </div>
        </div>
      </div>

      {/* Publish Warehouse Modal */}
      {showPublishModal && (
        <PublishWarehouseModal onClose={() => setShowPublishModal(false)} />
      )}

      {/* Payout Modal en lenguaje sencillo */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Transferir tu Dinero a tu Banco
                </h3>
              </div>
              <button onClick={() => setShowPayoutModal(false)} className="text-slate-400 hover:text-slate-600 font-bold p-1">
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <div className="text-xs text-emerald-800 font-semibold">Dinero Total Acumulado para Cobrar</div>
              <div className="text-3xl font-black text-emerald-950 font-mono mt-1">$960.00 USD</div>
              <div className="text-xs text-emerald-700 mt-1 font-mono">
                Equivalente oficial: {(960.00 * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 2 })} Bolívares (Tasa BCV {bcvRate.toFixed(2)})
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 block">Tu Cuenta Bancaria Registrada:</label>
              <div className="p-3 rounded-xl border border-slate-300 bg-slate-50 space-y-1">
                <div className="font-bold text-slate-900">Banesco Banco Universal (Cuenta Corriente)</div>
                <div className="text-slate-500 font-mono text-[11px]">0134-0239-12-0001928391 • RIF: J-31098234-9</div>
                <div className="text-slate-600 text-[11px] font-semibold">Logística Castillito C.A.</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              La transferencia se envía de inmediato a tu cuenta registrada mediante liquidación bancaria nacional o transferencia en divisas.
            </p>

            <button
              onClick={() => {
                alert('¡Transferencia procesada! Tu dinero de $960.00 USD ha sido enviado a tu cuenta bancaria Banesco.');
                setShowPayoutModal(false);
              }}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition"
            >
              Confirmar Transferencia a mi Cuenta Bancaria
            </button>
          </div>
        </div>
      )}

      {/* Fiscal Report Modal en lenguaje claro */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Resumen de Ingresos y Facturación
                </h3>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600 font-bold p-1">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Detalle claro de las operaciones de alquiler de tu galpón durante este período:
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono">
                <div className="flex justify-between"><span>Total Facturado por Alquiler:</span><strong>$1,840.00 USD</strong></div>
                <div className="flex justify-between text-slate-500"><span>Equivalente en Bolívares (BCV):</span><strong>{(1840 * bcvRate).toLocaleString()} Bs.</strong></div>
                <div className="flex justify-between"><span>Comisión GALPEX (10%):</span><strong>$184.00 USD</strong></div>
                <div className="flex justify-between"><span>Retención de Impuestos (2%):</span><strong>$36.80 USD</strong></div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-[11px]">
                Todas las facturas se emiten automáticamente con RIF y número de control fiscal.
              </div>
            </div>

            <button
              onClick={() => {
                alert('Resumen descargado en PDF.');
                setShowReportModal(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition"
            >
              Descargar Resumen en PDF
            </button>
          </div>
        </div>
      )}

      {/* Modal de Contrato Mercantil & Protocolo de Retención (Puntos 3 y 4) */}
      {showLegalContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 my-auto max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-700" />
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">
                    Régimen de Depositario Mercantil & Bóveda Escrow
                  </h3>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Artículos 535 al 543 del Código de Comercio de Venezuela
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowLegalContract(false)} 
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700 overflow-y-auto flex-1 pr-1 leading-relaxed">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] space-y-1">
                <div><strong>Galpón Auditado:</strong> Centro Logístico San Diego - Nave B</div>
                <div><strong>Razón Social:</strong> Inversiones Big Low Logistic C.A. (RIF: J-40192839-2)</div>
                <div><strong>Estatus Operativo:</strong> Depositario Mercantil Certificado Activo</div>
              </div>

              <div className="space-y-2">
                <h5 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Punto 3: ¿Por qué el dueño del galpón responde legalmente? (Art. 535 C.Com)
                </h5>
                <p className="text-[11px] text-slate-600">
                  En la legislación mercantil venezolana, el depósito no es un simple alquiler pasivo. Quien recibe mercancía ajena como negocio asume la figura de <strong>Depositario Mercantil</strong>. El Art. 535 del Código de Comercio estipula que el depositario responde civil y penalmente por cualquier daño, deterioro o pérdida si mintió sobre sus instalaciones o si incurrió en negligencia.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  Punto 4: ¿Cómo protege GALPEX el dinero si el galpón mintió? (Retención de Fondos)
                </h5>
                <p className="text-[11px] text-slate-600">
                  El cliente <strong>no paga dinero por adelantado en mano al dueño</strong>. Los fondos están en la <strong>cuenta de custodia GALPEX</strong>:
                </p>
                <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-1">
                  <li><strong>Liberación escalonada:</strong> El dueño cobra conforme pasan los días y se confirma que no hay incidencias.</li>
                  <li><strong>Protocolo de Congelamiento Inmediato:</strong> Si un cliente o chofer reporta que una gotera mojó su mercancía o que el galpón no tiene las cámaras prometidas, el sistema <strong>retiene de inmediato los fondos acumulados del galpón</strong> hasta que se indemnice al cliente.</li>
                  <li><strong>Cobertura de Pérdidas:</strong> Los saldos retenidos del galpón se aplican directamente para resarcir la pérdida sin que el cliente tenga que demandar por su cuenta.</li>
                </ul>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Mecanismo contractual activo en cada orden de custodia generada en GALPEX.</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowLegalContract(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition"
              >
                Cerrar Ventana Informativa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
