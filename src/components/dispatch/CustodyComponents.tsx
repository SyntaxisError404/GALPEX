import React, { useState } from 'react';
import type { Dispatch } from '../../types';
import { QrCodeImage } from '../common/QrCodeImage';
import {
  Building2,
  Truck,
  MapPin,
  Check,
  Lock,
  Unlock,
  Copy,
  Maximize2,
  X,
  ShieldCheck
} from 'lucide-react';

const APP_URL = 'https://syntaxiserror404.github.io/GALPEX/';

/* -------------------------------------------------------------------------- */
/* Progreso de la cadena de custodia (3 pasos)                                 */
/* -------------------------------------------------------------------------- */

export const CustodyStepper: React.FC<{ dispatch: Dispatch; variant?: 'light' | 'dark' }> = ({
  dispatch,
  variant = 'light'
}) => {
  const dark = variant === 'dark';
  const steps = [
    {
      icon: Building2,
      title: 'Recepción en galpón',
      detail: dispatch.originWarehouse.name,
      time: dispatch.step1WarehouseCheckIn.timestamp,
      done: dispatch.step1WarehouseCheckIn.completed
    },
    {
      icon: Truck,
      title: 'Retiro con QR #1',
      detail: `${dispatch.assignedCarrier.name} · ${dispatch.assignedCarrier.licensePlate}`,
      time: dispatch.step2CarrierPickup.timestamp,
      done: dispatch.step2CarrierPickup.completed
    },
    {
      icon: MapPin,
      title: 'Entrega con QR #2',
      detail: dispatch.destination.name,
      time: dispatch.step3ClientDelivery.timestamp,
      done: dispatch.step3ClientDelivery.completed
    }
  ];
  const current = steps.findIndex((s) => !s.done);

  return (
    <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0">
      {steps.map((step, i) => {
        const state = step.done ? 'done' : i === current ? 'current' : 'pending';
        const Icon = step.icon;

        const circle =
          state === 'done'
            ? 'bg-emerald-500 text-white'
            : state === 'current'
            ? dark
              ? 'bg-blue-500 text-white ring-4 ring-blue-500/20'
              : 'bg-blue-600 text-white ring-4 ring-blue-100'
            : dark
            ? 'bg-slate-800 text-slate-500'
            : 'bg-slate-100 text-slate-400';

        const stateText =
          state === 'done'
            ? step.time || 'Completado'
            : state === 'current'
            ? 'En curso'
            : 'Pendiente';

        const stateColor =
          state === 'done'
            ? dark ? 'text-emerald-400' : 'text-emerald-600'
            : state === 'current'
            ? dark ? 'text-blue-300' : 'text-blue-600'
            : dark ? 'text-slate-500' : 'text-slate-400';

        return (
          <li key={step.title} className="relative flex sm:flex-col gap-3 sm:gap-2.5 sm:pr-6">
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className={`hidden sm:block absolute top-4 left-11 right-2 h-0.5 rounded-full ${
                  step.done ? 'bg-emerald-500' : dark ? 'bg-slate-700' : 'bg-slate-200'
                }`}
              />
            )}
            <span className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${circle}`}>
              {step.done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            </span>
            <div className="min-w-0">
              <div
                className={`text-sm font-semibold ${
                  state === 'pending'
                    ? dark ? 'text-slate-500' : 'text-slate-400'
                    : dark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                {step.title}
              </div>
              <div className={`text-xs truncate ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{step.detail}</div>
              <div className={`text-xs font-medium mt-0.5 ${stateColor}`}>{stateText}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

/* -------------------------------------------------------------------------- */
/* Tarjeta de QR de custodia (QR #1 retiro / QR #2 entrega)                    */
/* -------------------------------------------------------------------------- */

type QrStatus = 'activo' | 'usado' | 'bloqueado';

const STATUS_PILL: Record<QrStatus, { label: string; cls: string }> = {
  activo: { label: 'Activo', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  usado: { label: 'Usado', cls: 'bg-slate-100 text-slate-600 ring-slate-200' },
  bloqueado: { label: 'Aún no disponible', cls: 'bg-amber-50 text-amber-700 ring-amber-200' }
};

export const QrCustodyCard: React.FC<{
  dispatch: Dispatch;
  kind: 'retiro' | 'entrega';
  size?: number;
}> = ({ dispatch, kind, size = 184 }) => {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isRetiro = kind === 'retiro';
  const hash = isRetiro ? dispatch.step2CarrierPickup.pickupQrHash : dispatch.step3ClientDelivery.deliveryQrHash;
  const value = isRetiro
    ? `${APP_URL}?custodia=1&despacho=${encodeURIComponent(dispatch.dispatchNumber)}&guia=${encodeURIComponent(dispatch.sadaGuide)}&hash=${hash}`
    : `${APP_URL}?recepcion=1&despacho=${encodeURIComponent(dispatch.dispatchNumber)}&hash=${hash}`;

  const status: QrStatus = isRetiro
    ? dispatch.step2CarrierPickup.completed ? 'usado' : 'activo'
    : dispatch.step3ClientDelivery.completed
    ? 'usado'
    : dispatch.step2CarrierPickup.completed
    ? 'activo'
    : 'bloqueado';

  const usedAt = isRetiro ? dispatch.step2CarrierPickup.timestamp : dispatch.step3ClientDelivery.timestamp;
  const title = isRetiro ? 'QR #1 · Retiro en galpón' : 'QR #2 · Entrega al cliente';
  const subtitle = isRetiro
    ? `Lo escanea el transportista en ${dispatch.originWarehouse.name}`
    : `Lo muestra ${dispatch.destination.name} al recibir la carga`;

  const instruction: Record<QrStatus, string> = {
    activo: isRetiro
      ? 'El transportista escanea este código en el portón del galpón para recibir la custodia de la carga.'
      : 'Muestra este código al transportista al recibir la carga. Al escanearlo se confirma la entrega y se libera el pago.',
    usado: isRetiro
      ? `Escaneado ${usedAt ?? ''}. La carga está bajo custodia del transportista.`
      : `Escaneado ${usedAt ?? ''}. Entrega confirmada y pago liberado.`,
    bloqueado: 'Se activa cuando el transportista retire la carga del galpón.'
  };

  const accent = isRetiro ? '#0f172a' : '#4c1d95';
  const hashShort = `${hash.slice(0, 8)}…${hash.slice(-6)}`;
  const pill = STATUS_PILL[status];

  const copyHash = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Portapapeles no disponible: no hacemos nada
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <span className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${pill.cls}`}>
          {pill.label}
        </span>
      </div>

      <div className="p-5 flex flex-col items-center gap-4">
        <div className="relative rounded-xl border border-slate-200 p-3 bg-white">
          {status === 'bloqueado' ? (
            <div
              style={{ width: size, height: size }}
              className="flex flex-col items-center justify-center gap-2 rounded-lg bg-slate-50 text-slate-400"
            >
              <Lock className="w-8 h-8" />
              <span className="text-xs font-medium">Bloqueado</span>
            </div>
          ) : (
            <>
              <QrCodeImage value={value} size={size} dark={accent} className={status === 'usado' ? 'opacity-20' : ''} />
              {status === 'usado' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold shadow">
                    <Check className="w-3.5 h-3.5" /> Escaneado
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {status !== 'bloqueado' && (
          <div className="w-full flex items-center justify-between gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
            <div className="min-w-0">
              <div className="text-[11px] text-slate-500">Código de verificación (SHA-256)</div>
              <div className="font-mono text-xs text-slate-800 truncate">{hashShort}</div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={copyHash}
                title="Copiar código"
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white transition"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
              {status === 'activo' && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  title="Ver en grande"
                  className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-white transition"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        <p className="text-xs text-slate-600 text-center leading-relaxed">{instruction[status]}</p>

        {status === 'activo' && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            <Maximize2 className="w-4 h-4" /> Mostrar en pantalla completa
          </button>
        )}
      </div>

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          onClick={() => setExpanded(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 text-left">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Despacho {dispatch.dispatchNumber}</p>
              </div>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-5 inline-block rounded-2xl border border-slate-200 p-4">
              <QrCodeImage value={value} size={256} dark={accent} />
            </div>
            <p className="mt-4 text-xs text-slate-500">Sube el brillo de la pantalla para facilitar el escaneo.</p>
            <div className="mt-3 font-mono text-[11px] text-slate-600 break-all bg-slate-50 rounded-lg p-2.5">{hash}</div>
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Resumen del pago en custodia (Escrow)                                       */
/* -------------------------------------------------------------------------- */

export const EscrowSummary: React.FC<{ dispatch: Dispatch; bcvRate?: number }> = ({ dispatch, bcvRate }) => {
  const f = dispatch.financials;
  const released = dispatch.step3ClientDelivery.completed;
  const rows = [
    { label: 'Almacenaje', who: dispatch.originWarehouse.name, amount: f.warehouseFee },
    { label: 'Flete', who: dispatch.assignedCarrier.name, amount: f.carrierFreightFee },
    { label: 'Comisión GALPEX (10%)', who: 'Plataforma', amount: f.platformCommission }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Pago en custodia (Escrow)</h3>
          <p className="text-xs text-slate-500 mt-0.5">Cómo se reparte al confirmar la entrega</p>
        </div>
        <span
          className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${
            released ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-amber-50 text-amber-700 ring-amber-200'
          }`}
        >
          {released ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          {released ? 'Liberado' : 'Retenido'}
        </span>
      </div>

      <div className="p-5">
        <div className="text-xs text-slate-500">Total protegido</div>
        <div className="text-2xl font-semibold text-slate-900 tabular-nums">
          ${f.totalEscrow.toFixed(2)} <span className="text-sm font-normal text-slate-500">USD</span>
        </div>
        {bcvRate ? (
          <div className="text-xs text-slate-500 tabular-nums">
            ≈ {(f.totalEscrow * bcvRate).toLocaleString('es-VE', { maximumFractionDigits: 2 })} Bs a tasa BCV
          </div>
        ) : null}

        <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <div className="text-sm text-slate-800">{row.label}</div>
                <div className="text-xs text-slate-500 truncate">{row.who}</div>
              </div>
              <div className="text-sm font-medium text-slate-900 tabular-nums">${row.amount.toFixed(2)}</div>
            </li>
          ))}
        </ul>

        <div
          className={`mt-3 flex items-start gap-2 rounded-lg p-3 text-xs leading-relaxed ${
            released ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-600'
          }`}
        >
          <ShieldCheck className={`w-4 h-4 shrink-0 mt-px ${released ? 'text-emerald-600' : 'text-slate-500'}`} />
          <span>
            {released
              ? 'Los pagos se transfirieron a cada parte al confirmarse la entrega.'
              : 'El dinero queda protegido y solo se libera cuando el cliente confirma la entrega con el QR #2.'}
          </span>
        </div>
      </div>
    </div>
  );
};
