import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNexo } from '../../context/NexoContext';
import { OpenStreetMapTracking } from '../map/OpenStreetMapTracking';
import { QrCodeImage } from '../common/QrCodeImage';
import {
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  QrCode,
  FileText,
  Package,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ClientTrackingView: React.FC = () => {
  const { currentUser } = useAuth();
  const { dispatch } = useNexo();
  const [delivered, setDelivered] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [cargoCondition, setCargoCondition] = useState({
    sealIntact: true,
    completePallets: true,
    noDamage: true
  });

  // Valor REAL del QR #2 de recepción que el receptor muestra al chofer para liberar el Escrow.
  const qr2Value = `https://syntaxiserror404.github.io/KARGON/?recepcion=1&despacho=${encodeURIComponent(dispatch.dispatchNumber)}&hash=${dispatch.step3ClientDelivery.deliveryQrHash}`;

  // Datos del chofer asignado (demo conectado al transportista de GALPEX)
  const driver = {
    name: 'Pedro Alvarado',
    ci: 'V-16.829.102',
    phone: '+58 412-8921092',
    cleanPhone: '584128921092',
    vehicle: 'Chevrolet NPR 4.5 Toneladas',
    plate: 'A38CD2K',
    company: 'Trans-Carabobo Express',
    rating: 4.9,
    trips: 142
  };

  const handleConfirmReception = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setDelivered(true);
    setShowQrModal(false);
  };

  const whatsappMessage = encodeURIComponent(
    `Hola ${driver.name}, te contacto desde la app GALPEX como receptor de la carga (Guía ${dispatch.sadaGuide || 'SADA-VE-2026-9941'}). ¿A qué altura de la vía vienes para tener listo el portón y los caleteros para la descarga?`
  );

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Encabezado del Receptor */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white border border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-300 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              Portal del Cliente / Receptor Final
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentUser?.company || 'Ferretería El Tornillo C.A.'}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-purple-200 mt-2">
              <span><strong>RIF:</strong> {currentUser?.rif || 'J-40192831-5'}</span>
              <span>•</span>
              <span><strong>Rep. Legal:</strong> {currentUser?.legalRepName || currentUser?.name || 'Gustavo Morales'}</span>
              <span>•</span>
              <span><strong>C.I.:</strong> {currentUser?.legalRepCi || 'V-12.983.412'}</span>
              <span>•</span>
              <span><strong>Tlf:</strong> {currentUser?.phone || '+58 424-9182390'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-purple-800/40 border border-purple-400/30 backdrop-blur-sm text-left">
              <div className="text-[10px] uppercase font-bold text-purple-300">Estado de tu Pedido</div>
              <div className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                {delivered ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Mercancía Entregada</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span className="text-amber-300">En Tránsito (ETA: 18 min)</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal: Tracking en Vivo + Tarjeta de Contacto Directo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda (2 cols): Mapa de Rastreo y Estado de Ruta */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card de Ruta GPS con OpenStreetMap en Vivo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Rastreo Satelital en Tiempo Real (OpenStreetMap)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Ruta en vivo Valencia ➔ San Diego ➔ Guacara ➔ Maracay ➔ Cagua con telemetría de camión vectorial.
                </p>
              </div>
            </div>

            {/* Mapa Interactivo Leaflet / OpenStreetMap */}
            <OpenStreetMapTracking mode="client" height="420px" />

            {/* Checkpoints de custodia legal */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Precinto de Seguridad SADA:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Intacto (#VE-9941-A)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Carga Asegurada por:</span>
                <span className="font-bold text-blue-700 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Smart Escrow ($450 USD)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Liberación de Pago:</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <QrCode className="w-3.5 h-3.5 text-purple-600" /> Contra Escaneo al Portón
                </span>
              </div>
            </div>
          </div>

          {/* Manifiesto de la Mercancía que Viene en Camino */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              Detalle de la Carga a Recibir
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">SKU / Lote</th>
                    <th className="py-2.5 px-3">Descripción</th>
                    <th className="py-2.5 px-3">Paletas</th>
                    <th className="py-2.5 px-3">Peso Est.</th>
                    <th className="py-2.5 px-3">Guía Legal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">FERR-VAL-902</td>
                    <td className="py-3 px-3 font-semibold">Tornillería y Anclajes Estructurales de Alta Resistencia</td>
                    <td className="py-3 px-3 font-bold">12 Paletas</td>
                    <td className="py-3 px-3">2.400 kg</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[10px]">
                        SADA-VE-2026-9941
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-purple-900 flex items-start gap-2.5">
              <FileText className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong>Nota de Recepción Legal (Art. 535 C.Com):</strong> Al llegar el vehículo a tus instalaciones, debes verificar que los precintos no hayan sido alterados y confirmar el conteo físico de paletas antes de suministrar el código QR de cierre al chofer.
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha (1 col): Tarjeta del Transportista y Acción de Recepción */}
        <div className="space-y-6">
          
          {/* Ficha del Transportista con Enlace Directo WhatsApp y Llamada */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Transportista Asignado</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verificado GALPEX
              </span>
            </div>

            {/* Chofer info */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 font-extrabold text-lg shadow-sm">
                PA
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">{driver.name}</h4>
                <p className="text-xs text-slate-500">{driver.company}</p>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  C.I. <strong>{driver.ci}</strong> · ⭐ {driver.rating} ({driver.trips} viajes)
                </div>
              </div>
            </div>

            {/* Datos del camión */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-700 mb-5">
              <div className="flex justify-between">
                <span className="text-slate-500">Vehículo:</span>
                <span className="font-bold text-slate-800">{driver.vehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Placas del Camión:</span>
                <span className="font-mono font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  {driver.plate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Teléfono Chofer:</span>
                <span className="font-bold text-slate-800">{driver.phone}</span>
              </div>
            </div>

            {/* BOTONES DE CONTACTO DIRECTO: WhatsApp y Llamada */}
            <div className="space-y-2.5">
              <a
                href={`https://wa.me/${driver.cleanPhone}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contactar por WhatsApp Directo</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>

              <a
                href={`tel:${driver.phone}`}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Llamar al Chofer por Teléfono</span>
              </a>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 text-center">
              Coordinación de llegada al portón, demoras en alcabalas o despeje de bahía de descarga.
            </p>
          </div>

          {/* Botón Principal: Confirmar Recepción con QR */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-6 text-white border border-slate-800 shadow-lg text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-extrabold text-base">¿El camión llegó a tu portón?</h4>
              <p className="text-xs text-slate-300 mt-1">
                Verifica el cargamento y escanea o genera el código QR para liberar el pago al chofer.
              </p>
            </div>

            {delivered ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Recepción Confirmada Exitosamente</span>
              </div>
            ) : (
              <button
                onClick={() => setShowQrModal(true)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition transform hover:-translate-y-0.5"
              >
                <QrCode className="w-4 h-4" />
                <span>Confirmar Recepción y Liberar Escrow</span>
              </button>
            )}

            <div className="text-[10px] text-slate-400">
              Al confirmar, el contrato mercantil se cierra en mutua conformidad y se emite el recibo digital con sello de tiempo.
            </div>
          </div>

        </div>
      </div>

      {/* Modal de Confirmación de Recepción con QR */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-purple-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Acta de Recepción de Mercancía</h3>
              </div>
              <button
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-xs text-slate-600">
                Como receptor legal (<strong className="text-slate-900">{currentUser?.company || 'Ferretería El Tornillo C.A.'}</strong>, RIF: {currentUser?.rif || 'J-40192831-5'}), marca las casillas de verificación física:
              </p>

              {/* Checklist de recepción física */}
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={cargoCondition.sealIntact}
                    onChange={(e) => setCargoCondition({ ...cargoCondition, sealIntact: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">
                    Precinto de seguridad SADA #VE-9941-A intacto al abrir el furgón
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={cargoCondition.completePallets}
                    onChange={(e) => setCargoCondition({ ...cargoCondition, completePallets: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">
                    Conteo verificado: 12 paletas completas descargadas en bahía
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={cargoCondition.noDamage}
                    onChange={(e) => setCargoCondition({ ...cargoCondition, noDamage: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span className="font-semibold text-slate-800">
                    Mercancía sin daños por humedad o golpes de transporte
                  </span>
                </label>
              </div>

              {/* Código QR Simulado para escanear entre chofer y cliente */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Muestra este QR al chofer {driver.name}
                </div>
                <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border-2 border-dashed border-purple-400 flex items-center justify-center shadow-inner">
                  <QrCodeImage value={qr2Value} size={128} dark="#581c87" />
                </div>
                <div className="text-[11px] text-slate-500">
                  Hash Criptográfico de Custodia: <span className="font-mono text-purple-600 font-bold">{dispatch.step3ClientDelivery.deliveryQrHash.slice(0, 7)}...{dispatch.step3ClientDelivery.deliveryQrHash.slice(-4)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={!cargoCondition.sealIntact || !cargoCondition.completePallets || !cargoCondition.noDamage}
                  onClick={handleConfirmReception}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Firmar Conforme y Liberar Escrow</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
