import React from 'react';
import { useNexo } from '../../context/NexoContext';
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Award
} from 'lucide-react';

export const CarrierDashboard: React.FC = () => {
  const { dispatch, simulateStep2Pickup, simulateStep3Delivery, setActiveTab } = useNexo();

  const carrier = dispatch.assignedCarrier;
  const isStep2Done = dispatch.step2CarrierPickup.completed;
  const isStep3Done = dispatch.step3ClientDelivery.completed;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] p-6 space-y-6">
      {/* Carrier Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={carrier.avatarUrl}
              alt={carrier.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900">{carrier.name}</h1>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold border border-amber-200">
                TRANSPORTISTA NIVEL ORO
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {carrier.vehicleModel} • Placas: <strong className="text-slate-800 font-mono">{carrier.licensePlate}</strong>
            </div>
            <div className="text-[11px] text-slate-400">
              {carrier.company} • RIF: {carrier.rif}
            </div>
          </div>
        </div>

        {/* Balance Badge */}
        <div className="bg-slate-900 text-white p-3.5 rounded-xl flex items-center gap-4 shrink-0 shadow-sm">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Fletes Acumulados Mes</div>
            <div className="text-xl font-black font-mono text-emerald-400">$680.00 USD</div>
            <div className="text-[10px] text-slate-300">Pago Móvil C2P Inmediato al Entregar</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4 Candados Audit Status */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Protocolo de 4 Candados de Seguridad Patrimonial</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Expediente auditado y revalidado quincenalmente ante INTT y SAIME.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            AUDITORÍA 100% VIGENTE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">1. Documentación Legal</div>
              <div className="text-[11px] text-slate-500">RIF vigente, Licencia Grado 5, Certificado M-3 al día.</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">2. Biometría Facial</div>
              <div className="text-[11px] text-slate-500">Cotejo facial en tiempo real SAIME (99.8% coincidencia).</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">3. Custodia Financiera</div>
              <div className="text-[11px] text-slate-500">Cobro garantizado en Smart Escrow sin riesgo de impago.</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">4. Trazabilidad & GPS</div>
              <div className="text-[11px] text-slate-500">5.0 ★ Reputación con 142 viajes sin siniestro vial.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Trip Card */}
      <div className="bg-white rounded-2xl border border-blue-400 ring-2 ring-blue-500/20 p-5 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                VIAJE ASIGNADO EN CURSO
              </span>
              <span className="font-bold text-slate-900 text-sm">{dispatch.dispatchNumber}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {dispatch.cargoSummary} • Guía SADA {dispatch.sadaGuide}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 font-bold uppercase">Pago de Flete Asignado</div>
            <div className="text-xl font-black font-mono text-emerald-600">
              ${dispatch.financials.carrierFreightFee.toFixed(2)} USD
            </div>
          </div>
        </div>

        {/* Route Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Origen (Retiro de Mercancía)</span>
            </div>
            <div className="font-semibold text-slate-900">{dispatch.originWarehouse.name}</div>
            <div className="text-[11px] text-slate-500">{dispatch.originWarehouse.address}</div>

            {!isStep2Done ? (
              <button
                onClick={simulateStep2Pickup}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <QrCode className="w-4 h-4" />
                <span>Escanear QR #1 en Portón de Galpón</span>
              </button>
            ) : (
              <div className="text-emerald-700 font-bold flex items-center gap-1 text-[11px] pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Custodia retirada {dispatch.step2CarrierPickup.timestamp}</span>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Destino (Entrega Comercial)</span>
            </div>
            <div className="font-semibold text-slate-900">{dispatch.destination.name}</div>
            <div className="text-[11px] text-slate-500">{dispatch.destination.address}</div>

            {isStep2Done && !isStep3Done ? (
              <button
                onClick={simulateStep3Delivery}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Escanear QR #2 de Entrega Conforme</span>
              </button>
            ) : isStep3Done ? (
              <div className="text-emerald-700 font-bold flex items-center gap-1 text-[11px] pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Entregado y cobrado vía PagoMóvil C2P</span>
              </div>
            ) : (
              <div className="text-slate-400 text-[11px] pt-1">
                Completa primero el retiro en el galpón.
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={() => setActiveTab('despachos')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>Ver consola completa de Despacho & Escrow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
