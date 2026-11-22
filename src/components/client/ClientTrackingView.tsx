import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNexo } from '../../context/NexoContext';
import { OpenStreetMapTracking } from '../map/OpenStreetMapTracking';
import { CustodyStepper, QrCustodyCard } from '../dispatch/CustodyComponents';
import {
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  ShieldCheck,
  Truck
} from 'lucide-react';

export const ClientTrackingView: React.FC = () => {
  const { currentUser } = useAuth();
  const { dispatch, simulateStep3Delivery } = useNexo();

  const carrier = dispatch.assignedCarrier;
  const picked = dispatch.step2CarrierPickup.completed;
  const delivered = dispatch.step3ClientDelivery.completed;

  // El cliente debe verificar físicamente la carga antes de confirmar la recepción.
  const [checks, setChecks] = useState({ seal: false, count: false, condition: false });
  const allChecked = checks.seal && checks.count && checks.condition;

  const status = delivered
    ? { label: 'Entregado', icon: CheckCircle2, cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' }
    : picked
    ? { label: 'En camino', icon: Truck, cls: 'bg-blue-50 text-blue-700 ring-blue-200' }
    : { label: 'En preparación en el galpón', icon: Clock, cls: 'bg-amber-50 text-amber-700 ring-amber-200' };
  const StatusIcon = status.icon;

  const companyName = currentUser?.company || dispatch.destination.name;
  const phoneDigits = carrier.phone.replace(/\D/g, '');
  const whatsappText = encodeURIComponent(
    `Hola ${carrier.name}, te escribo desde GALPEX como receptor del despacho ${dispatch.dispatchNumber}. ¿Por dónde vienes? Así tengo el portón listo para la descarga.`
  );

  const cargoDetails = [
    { label: 'Despacho', value: dispatch.dispatchNumber },
    { label: 'Carga', value: dispatch.cargoSummary },
    { label: 'Paletas / cajas', value: `${dispatch.palletsCount} paletas · ${dispatch.boxesCount} cajas` },
    { label: 'Peso verificado', value: `${dispatch.weightKg.toLocaleString('es-VE')} kg` },
    { label: 'Guía SADA / SICA', value: dispatch.sadaGuide },
    { label: 'Origen', value: dispatch.originWarehouse.name }
  ];

  const checklist: { key: keyof typeof checks; label: string }[] = [
    { key: 'seal', label: 'El precinto de seguridad está intacto al abrir el furgón' },
    { key: 'count', label: `Conté ${dispatch.palletsCount} paletas completas (${dispatch.boxesCount} cajas)` },
    { key: 'condition', label: 'La mercancía llegó sin golpes ni humedad' }
  ];

  return (
    <div className="flex-1 min-w-0 bg-slate-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Encabezado del receptor */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-medium text-slate-500">Portal del receptor</div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight mt-0.5 truncate">{companyName}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
              {currentUser?.rif && <span>RIF {currentUser.rif}</span>}
              {(currentUser?.legalRepName || currentUser?.name) && (
                <span>Rep. legal: {currentUser?.legalRepName || currentUser?.name}</span>
              )}
              {currentUser?.phone && <span>Tlf. {currentUser.phone}</span>}
            </div>
          </div>
          <div className="shrink-0">
            <div className="text-xs text-slate-500 md:text-right">Estado de tu pedido</div>
            <span className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ring-1 ring-inset ${status.cls}`}>
              <StatusIcon className="w-4 h-4" /> {status.label}
            </span>
          </div>
        </section>

        {/* Progreso */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Seguimiento del despacho {dispatch.dispatchNumber}</h2>
          <CustodyStepper dispatch={dispatch} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Columna principal: mapa y detalle de la carga */}
          <div className="lg:col-span-2 space-y-5">
            <section className="space-y-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> Ubicación del camión
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Rastreo GPS en vivo por la Autopista Regional del Centro.</p>
              </div>
              <OpenStreetMapTracking mode="client" height="420px" />
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" /> Carga que vas a recibir
                </h2>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100">
                {cargoDetails.map((d) => (
                  <div key={d.label} className="bg-white px-5 py-3 min-w-0">
                    <dt className="text-xs text-slate-500">{d.label}</dt>
                    <dd className="text-sm font-medium text-slate-900 mt-0.5 truncate" title={d.value}>{d.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="m-5 mt-4 flex items-start gap-2.5 rounded-lg bg-slate-50 p-3 text-xs text-slate-600 leading-relaxed">
                <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-px" />
                <span>
                  Antes de mostrar el QR #2, revisa que el precinto esté intacto y cuenta las paletas. Si algo no
                  cuadra, no confirmes y comunícate con el transportista (Art. 535 del Código de Comercio).
                </span>
              </div>
            </section>
          </div>

          {/* Columna lateral: QR de entrega, confirmación y contacto */}
          <div className="space-y-5">
            <QrCustodyCard dispatch={dispatch} kind="entrega" />

            {/* Confirmación de recepción */}
            {delivered ? (
              <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-emerald-900">Recepción confirmada</h3>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                      {dispatch.step3ClientDelivery.timestamp ? `${dispatch.step3ClientDelivery.timestamp}. ` : ''}
                      El contrato quedó cerrado y el pago en custodia se liberó al galpón y al transportista.
                    </p>
                  </div>
                </div>
              </section>
            ) : picked ? (
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-slate-900">Confirmar recepción</h3>
                <p className="text-xs text-slate-500 mt-0.5">Marca cada punto después de revisar la carga.</p>
                <div className="mt-3 space-y-2">
                  {checklist.map((item) => (
                    <label
                      key={item.key}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                        checks[item.key] ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checks[item.key]}
                        onChange={(e) => setChecks({ ...checks, [item.key]: e.target.checked })}
                        className="mt-0.5 w-4 h-4 accent-emerald-600"
                      />
                      <span className="text-sm text-slate-700">{item.label}</span>
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={!allChecked}
                  onClick={simulateStep3Delivery}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-semibold transition"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirmar recepción conforme
                </button>
                <p className="mt-2 text-[11px] text-slate-500 text-center">
                  {allChecked
                    ? 'Al confirmar se registra el escaneo del QR #2 y se libera el pago.'
                    : 'Completa los 3 puntos para habilitar la confirmación.'}
                </p>
              </section>
            ) : (
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Tu carga aún está en el galpón</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Podrás confirmar la recepción cuando el transportista la retire de {dispatch.originWarehouse.name}.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Transportista */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Transportista asignado</h3>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verificado
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-slate-900">{carrier.name}</div>
                  <div className="text-xs text-slate-500 truncate">{carrier.company}</div>
                  <div className="text-xs text-slate-500">
                    {carrier.rating.toFixed(1)} ★ · {carrier.completedTrips} viajes
                  </div>
                </div>
              </div>
              <dl className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Vehículo</dt>
                  <dd className="font-medium text-slate-800 text-right">{carrier.vehicleModel}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Placa</dt>
                  <dd className="font-mono font-medium text-slate-800">{carrier.licensePlate}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">Teléfono</dt>
                  <dd className="font-medium text-slate-800">{carrier.phone}</dd>
                </div>
              </dl>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${phoneDigits}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-medium text-white transition"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
                <a
                  href={`tel:${carrier.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  <Phone className="w-4 h-4" /> Llamar
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
