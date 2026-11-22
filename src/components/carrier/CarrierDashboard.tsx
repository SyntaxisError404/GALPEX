import React, { useState } from 'react';
import { useNexo } from '../../context/NexoContext';
import { OpenStreetMapTracking } from '../map/OpenStreetMapTracking';
import {
  Truck,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Award,
  Navigation,
  MessageSquare,
  Radio,
  Zap,
  Lock,
  ChevronRight,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CarrierDashboard: React.FC = () => {
  const { dispatch, simulateStep2Pickup, simulateStep3Delivery, setActiveTab, bcvRate } = useNexo();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  const carrier = dispatch.assignedCarrier;
  const isStep2Done = dispatch.step2CarrierPickup.completed;
  const isStep3Done = dispatch.step3ClientDelivery.completed;

  const handleWithdraw = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    setWithdrawn(true);
    setTimeout(() => {
      setShowWithdrawModal(false);
      setWithdrawn(false);
    }, 2500);
  };

  const whatsappClientMessage = encodeURIComponent(
    `Hola, te escribe Pedro Alvarado de GALPEX (Camión NPR placas ${carrier.licensePlate}). Estoy en ruta con tu despacho (${dispatch.cargoSummary}). ¿Tienes el portón y montacargas listos para la descarga?`
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#070d20] text-slate-100 p-4 sm:p-6 space-y-6">
      
      {/* ============================================================== */}
      {/* 1. COCKPIT SUPERIOR: HUD FUTURISTA DEL CONDUCTOR               */}
      {/* ============================================================== */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-950 via-[#0d1838] to-[#0a1128] border border-blue-500/30 p-5 sm:p-6 shadow-2xl overflow-hidden">
        {/* Resplandor y patrón de rejilla ciber-logística */}
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Identificación del Conductor con Insignia Vectorial (Sin fotos falsas) */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {/* Insignia Vectorial Minimalista Futurista */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-cyan-500 p-[2px] shadow-lg shadow-blue-500/25">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-sm"></div>
                  <Truck className="w-7 h-7 text-cyan-400 relative z-10" />
                  <span className="text-[9px] font-black tracking-widest text-blue-300 font-mono mt-0.5">INTT-5</span>
                </div>
              </div>
              {/* Baliza de GPS Activo */}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse shadow-md shadow-emerald-500/50"></span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{carrier.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/20 to-amber-400/10 text-amber-300 border border-amber-500/40 shadow-sm flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  NIVEL ORO • 5.0 ★
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  ID: KRG-TR-8492
                </span>
              </div>

              {/* Datos Técnicos del Camión */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mt-1.5">
                <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  {carrier.vehicleModel}
                </span>
                <span>•</span>
                <span>Placas INTT: <strong className="font-mono text-cyan-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700">{carrier.licensePlate}</strong></span>
                <span>•</span>
                <span className="text-slate-400">{carrier.company} (RIF: {carrier.rif})</span>
              </div>
            </div>
          </div>

          {/* Métricas HUD del Conductor: Billetera & Estadísticas Rápidas */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            
            {/* Tarjeta de Fletes Acumulados */}
            <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Récord en Ruta</div>
              <div className="text-base font-black text-white mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>142 Fletes</span>
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">0 Siniestros • 100% Efectividad</div>
            </div>

            {/* Billetera Escrow / Saldo Retirable */}
            <div className="px-4 py-3 rounded-xl bg-gradient-to-br from-blue-950/80 to-slate-900 border border-blue-500/40 backdrop-blur-md shadow-lg shadow-blue-900/20">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 flex items-center justify-between gap-3">
                <span>Fletes en Escrow</span>
                <span className="text-[9px] text-emerald-400 font-mono">DISPONIBLE</span>
              </div>
              <div className="text-xl font-black font-mono text-white mt-0.5">
                $680.00 <span className="text-xs font-normal text-slate-400">USD</span>
              </div>
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="mt-1.5 text-[10px] font-black text-cyan-300 hover:text-cyan-200 flex items-center gap-1 transition"
              >
                <span>⚡ Pago Móvil C2P Inmediato</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MISIÓN ACTIVA: FICHA DEL VIAJE EN CURSO                      */}
      {/* ============================================================== */}
      <div className="rounded-2xl bg-slate-900/90 border border-blue-500/40 p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-blue-600/30 border border-blue-400/50 text-blue-300 text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
                MISIÓN DE RUTA ASIGNADA
              </span>
              <span className="font-mono font-black text-white text-sm">{dispatch.dispatchNumber}</span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{dispatch.cargoSummary}</span>
              <span>•</span>
              <span className="font-mono text-amber-300">Guía SADA: {dispatch.sadaGuide}</span>
            </div>
          </div>

          <div className="flex sm:text-right items-center sm:items-end justify-between sm:justify-start gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Honorario del Flete</div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                ${dispatch.financials.carrierFreightFee.toFixed(2)} <span className="text-xs text-slate-400">USD</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                ~{(dispatch.financials.carrierFreightFee * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 0 })} Bs (Tasa BCV)
              </div>
            </div>
          </div>
        </div>

        {/* Nodos de Navegación: Origen ➔ Destino */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Nodo 1: Origen (Retiro) */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>PUNTO A: RETIRO DE MERCANCÍA</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase ${
                isStep2Done ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {isStep2Done ? 'Retirado' : 'Pendiente'}
              </span>
            </div>

            <div>
              <div className="font-bold text-sm text-slate-100">{dispatch.originWarehouse.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">{dispatch.originWarehouse.address}</div>
            </div>

            {!isStep2Done ? (
              <button
                onClick={simulateStep2Pickup}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
              >
                <QrCode className="w-4 h-4 text-cyan-300" />
                <span>Escanear QR #1 en Portón del Galpón</span>
              </button>
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custodia asumida legalmente ({dispatch.step2CarrierPickup.timestamp})</span>
              </div>
            )}
          </div>

          {/* Nodo 2: Destino (Entrega) */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>PUNTO B: ENTREGA COMERCIAL</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase ${
                isStep3Done ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}>
                {isStep3Done ? 'Completado' : 'En Espera'}
              </span>
            </div>

            <div>
              <div className="font-bold text-sm text-slate-100">{dispatch.destination.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">{dispatch.destination.address}</div>
            </div>

            {isStep2Done && !isStep3Done ? (
              <div className="space-y-2">
                <button
                  onClick={simulateStep3Delivery}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Escanear QR #2 de Entrega Conforme</span>
                </button>

                <a
                  href={`https://wa.me/584249182390?text=${whatsappClientMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Avisar al Cliente por WhatsApp</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </div>
            ) : isStep3Done ? (
              <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Entregado y cobrado en cuenta bancaria vía PagoMóvil</span>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Completa primero el retiro en el galpón para habilitar la entrega.</span>
              </div>
            )}
          </div>

        </div>

        {/* Barra de Acciones Rápidas */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-300 font-semibold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart Escrow: Fondos Asegurados</span>
            </span>
          </div>

          <button
            onClick={() => setActiveTab('despachos')}
            className="text-cyan-400 hover:text-cyan-300 font-extrabold flex items-center gap-1 transition"
          >
            <span>Ver Consola Detallada de Despacho & Escrow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. PROTOCOLO DE 4 CANDADOS: AUDITORÍA DE SEGURIDAD PATRIMONIAL */}
      {/* ============================================================== */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              Protocolo de 4 Candados de Seguridad Vial (INTT & SAIME)
            </span>
          </div>
          <span className="text-[10px] font-black tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            100% AUDITADO
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. Documentación INTT</span>
            </div>
            <p className="text-[11px] text-slate-400">Licencia 5ta Grado, RIF V-16829102 y Certificado M-3 al día.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>2. Biometría SAIME</span>
            </div>
            <p className="text-[11px] text-slate-400">Cotejo facial en registro 99.8% match biométrico verificado.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>3. Custodia Financiera</span>
            </div>
            <p className="text-[11px] text-slate-400">Flete garantizado en Smart Escrow sin riesgo de impago.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>4. Telemetría Satelital</span>
            </div>
            <p className="text-[11px] text-slate-400">Transmisión GPS en vivo sobre la Autopista Regional del Centro.</p>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. MAPA SATELITAL OPENSTREETMAP: RUTA ARC & GALPONES          */}
      {/* ============================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-200">
              Navegación Satelital OpenStreetMap • Red de Galpones ARC
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            Coordenadas activas: <strong className="text-cyan-300 font-mono">Valencia ➔ Cagua (10.03132, -67.48301)</strong>
          </span>
        </div>

        <OpenStreetMapTracking mode="carrier" height="480px" />
      </div>

      {/* ============================================================== */}
      {/* MODAL DE RETIRO DE FLETES (PAGO MÓVIL C2P INMEDIATO)           */}
      {/* ============================================================== */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-base">Retiro de Fletes en Escrow</h3>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Saldo Disponible en Fideicomiso:</div>
                <div className="text-3xl font-black font-mono text-emerald-400 mt-1">$680.00 USD</div>
                <div className="text-xs text-slate-400 mt-1">
                  Equivalente en Bolívares: <strong className="text-white">~{(680 * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 0 })} Bs</strong> (Tasa Oficial BCV {bcvRate.toFixed(2)})
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-300">Cuenta de Destino Pre-Registrada:</div>
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-300 space-y-1">
                  <div><strong>Beneficiario:</strong> Pedro Alvarado (V-16.829.102)</div>
                  <div><strong>Método:</strong> Pago Móvil Interbancario C2P</div>
                  <div><strong>Banco:</strong> Banesco (0134) • Teléfono: 0412-8921092</div>
                </div>
              </div>

              {withdrawn ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>¡Liquidación C2P Exitosa! Fondos acreditados.</span>
                </div>
              ) : (
                <button
                  onClick={handleWithdraw}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>Transferir $680.00 USD a Pago Móvil Ahora</span>
                </button>
              )}

              <p className="text-[10px] text-slate-400 text-center">
                Sin comisiones de retiro. Fondos acreditados de forma inmediata mediante cámara de compensación interbancaria.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
