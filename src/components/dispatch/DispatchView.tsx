import React from 'react';
import { useNexo } from '../../context/NexoContext';
import { CustodyStepper, QrCustodyCard, EscrowSummary } from './CustodyComponents';
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Unlock,
  MessageSquare,
  Phone,
  QrCode,
  ShieldCheck,
  Truck
} from 'lucide-react';

export const DispatchView: React.FC = () => {
  const { dispatch, simulateStep2Pickup, simulateStep3Delivery, bcvRate } = useNexo();

  const carrier = dispatch.assignedCarrier;
  const picked = dispatch.step2CarrierPickup.completed;
  const delivered = dispatch.step3ClientDelivery.completed;
  const completedSteps = [
    dispatch.step1WarehouseCheckIn.completed,
    picked,
    delivered
  ].filter(Boolean).length;

  const status = delivered
    ? { label: 'Entregado', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' }
    : picked
    ? { label: 'En tránsito', cls: 'bg-blue-50 text-blue-700 ring-blue-200' }
    : { label: 'Esperando retiro', cls: 'bg-amber-50 text-amber-700 ring-amber-200' };

  const meta = [
    { label: 'Carga', value: dispatch.cargoSummary },
    { label: 'Peso verificado', value: `${dispatch.weightKg.toLocaleString('es-VE')} kg` },
    { label: 'Guía SADA / SICA', value: dispatch.sadaGuide },
    { label: 'Manifiesto', value: dispatch.manifestNumber }
  ];

  const verifications = [
    'Licencia de 5to grado y RIF vigentes',
    `Biometría facial verificada (${carrier.fourLocks.facialBiometricsMatch}%)`,
    `Póliza de carga por $${carrier.fourLocks.cargoInsuranceCoverageUsd.toLocaleString('en-US')}`,
    `${carrier.completedTrips} viajes sin incidentes · ${carrier.rating.toFixed(1)} ★`
  ];

  const phoneDigits = carrier.phone.replace(/\D/g, '');
  const whatsappText = encodeURIComponent(
    `Hola ${carrier.name}, te escribo desde GALPEX por el despacho ${dispatch.dispatchNumber}.`
  );

  return (
    <div className="flex-1 min-w-0 bg-slate-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Encabezado del despacho */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Despacho</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${status.cls}`}>
                  {status.label}
                </span>
              </div>
              <h1 className="text-xl font-semibold text-slate-900 tracking-tight mt-1">{dispatch.dispatchNumber}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span className="font-medium text-slate-800">{dispatch.originWarehouse.name}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="font-medium text-slate-800">{dispatch.destination.name}</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                {dispatch.originWarehouse.zone} → {dispatch.destination.city}
              </div>
            </div>

            <div className="md:text-right shrink-0">
              <div className="text-xs text-slate-500">Monto en custodia</div>
              <div className="text-2xl font-semibold text-slate-900 tabular-nums">
                ${dispatch.financials.totalEscrow.toFixed(2)} <span className="text-sm font-normal text-slate-500">USD</span>
              </div>
              <div
                className={`mt-0.5 inline-flex items-center gap-1 text-xs font-medium ${
                  delivered ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {delivered ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                {delivered ? 'Liberado a las partes' : 'Retenido hasta la entrega'}
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border-t border-slate-100">
            {meta.map((m) => (
              <div key={m.label} className="bg-white px-5 py-3.5 min-w-0">
                <dt className="text-xs text-slate-500">{m.label}</dt>
                <dd className="text-sm font-medium text-slate-900 mt-0.5 truncate" title={m.value}>
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Progreso de la cadena de custodia */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Cadena de custodia</h2>
            <span className="text-xs text-slate-500">{completedSteps} de 3 pasos completados</span>
          </div>
          <CustodyStepper dispatch={dispatch} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-5">
            {/* Siguiente paso */}
            {delivered ? (
              <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h2 className="text-base font-semibold text-emerald-900">Despacho completado</h2>
                    <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                      Recibido por {dispatch.step3ClientDelivery.recipientName || dispatch.destination.name}
                      {dispatch.step3ClientDelivery.timestamp ? ` · ${dispatch.step3ClientDelivery.timestamp}` : ''}. Los
                      pagos del Escrow se transfirieron al galpón, al transportista y a la plataforma.
                    </p>
                  </div>
                </div>
              </section>
            ) : (
              <section className="rounded-2xl border border-blue-200 bg-white shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <QrCode className="w-5 h-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-blue-600">
                      Siguiente paso · {picked ? 'Paso 3 de 3' : 'Paso 2 de 3'}
                    </div>
                    <h2 className="text-base font-semibold text-slate-900 mt-0.5">
                      {picked ? 'Entrega al cliente con el QR #2' : 'Retiro en el galpón con el QR #1'}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {picked
                        ? `Al llegar a ${dispatch.destination.name}, el cliente revisa la carga y muestra el QR #2. Cuando el transportista lo escanea, la entrega queda confirmada y se libera el pago.`
                        : `${carrier.name} escanea el QR #1 en el portón de ${dispatch.originWarehouse.name}. Con eso la custodia de la carga pasa al transportista y empieza el rastreo GPS.`}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:pl-12">
                  <button
                    type="button"
                    onClick={picked ? simulateStep3Delivery : simulateStep2Pickup}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition"
                  >
                    <QrCode className="w-4 h-4" />
                    {picked ? 'Registrar escaneo del QR #2' : 'Registrar escaneo del QR #1'}
                  </button>
                  <span className="text-xs text-slate-500">
                    Modo demo: simula el escaneo que hace el transportista {picked ? 'en el destino' : 'en el galpón'}.
                  </span>
                </div>
              </section>
            )}

            {/* Transportista asignado */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2">
                      <h2 className="text-sm font-semibold text-slate-900">{carrier.name}</h2>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verificado
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {carrier.company} · RIF {carrier.rif}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {carrier.vehicleModel} · Placa{' '}
                      <span className="font-mono font-medium text-slate-800">{carrier.licensePlate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <a
                    href={`tel:${carrier.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Phone className="w-4 h-4" /> Llamar
                  </a>
                  <a
                    href={`https://wa.me/${phoneDigits}?text=${whatsappText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-medium text-white transition"
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs font-medium text-slate-500 mb-2">Verificaciones del transportista</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {verifications.map((v) => (
                    <li key={v} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Columna lateral: QR vigente y pago */}
          <div className="space-y-5">
            <QrCustodyCard dispatch={dispatch} kind={picked ? 'entrega' : 'retiro'} />
            <EscrowSummary dispatch={dispatch} bcvRate={bcvRate} />
          </div>
        </div>
      </div>
    </div>
  );
};
