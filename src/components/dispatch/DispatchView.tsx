import React, { useState } from 'react';
import { useNexo } from '../../context/NexoContext';
import { QrCodeImage } from '../common/QrCodeImage';
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Phone,
  Navigation,
  Lock,
  Unlock,
  Scale,
  UserCheck,
  CheckCheck,
  Maximize2,
  Truck
} from 'lucide-react';

export const DispatchView: React.FC = () => {
  const {
    dispatch,
    simulateStep2Pickup,
    simulateStep3Delivery
  } = useNexo();

  const [showQrExpanded, setShowQrExpanded] = useState(false);
  const [showGpsModal, setShowGpsModal] = useState(false);

  const step1 = dispatch.step1WarehouseCheckIn;
  const step2 = dispatch.step2CarrierPickup;
  const step3 = dispatch.step3ClientDelivery;

  const isStep2Completed = step2.completed;
  const isStep3Completed = step3.completed;

  // Valor REAL codificado en el QR #1 de custodia (verificable al escanear).
  const qr1Value = `https://syntaxiserror404.github.io/KARGON/?custodia=1&despacho=${encodeURIComponent(dispatch.dispatchNumber)}&guia=${encodeURIComponent(dispatch.sadaGuide)}&hash=${step2.pickupQrHash}`;
  const qr1HashShort = `${step2.pickupQrHash.slice(0, 7)}...${step2.pickupQrHash.slice(-4)}`;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] p-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[10px] tracking-wide">
              {dispatch.status === 'entregado' ? 'ENVÍO COMPLETADO' : 'ENVÍO ACTIVO'}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
              Guía SADA / SICA: <strong className="text-emerald-700">{dispatch.sadaGuide}</strong>
            </span>
          </div>

          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{dispatch.dispatchNumber} — {dispatch.originWarehouse.zone}</span>
            <span className="text-slate-400">→</span>
            <span>{dispatch.destination.city} ({dispatch.destination.name.split(' ')[0]})</span>
          </h1>

          <p className="text-xs text-slate-500 mt-0.5">
            Carga: <strong>{dispatch.cargoSummary}</strong> • Manifiesto: {dispatch.manifestNumber} • Precinto Verificado
          </p>
        </div>

        {/* Escrow Badge */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3.5 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
            {isStep3Completed ? <Unlock className="w-5 h-5 text-emerald-600" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
              {isStep3Completed ? 'Smart Escrow Liquidado' : 'Garantía Smart Escrow'}
            </div>
            <div className="text-base font-black text-slate-900 font-mono">
              {isStep3Completed ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCheck className="w-4 h-4" /> Dispersado
                </span>
              ) : (
                `$${dispatch.financials.totalEscrow.toFixed(2)} USD`
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {isStep3Completed ? 'Fondos repartidos a partes' : 'Fondos Retenidos en Bóveda'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Steps & Driver / Right QR & Settlement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        {/* Left Column: Chain of Custody (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Section Heading */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-extrabold text-slate-900">
                  Cadena de Custodia Inmutable (Double-QR)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Registro criptográfico de traspaso de responsabilidad legal y física.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Corredor Carabobo
            </span>
          </div>

          {/* Step 1: Warehouse Check-in (Completed) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Paso 1: Recepción y Pesaje en Galpón
                  </h3>
                  <div className="text-[11px] text-slate-400">
                    {step1.timestamp} • {dispatch.originWarehouse.name}
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                <Lock className="w-3 h-3" />
                QR VALIDADO
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              Lote de {dispatch.palletsCount} paletas selladas y verificadas con precinto SADA. Custodia inicial asumida por operador Galponero certificado.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 pt-1">
              <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Inspección Biométrica: <strong>Aprobada</strong></span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-600" />
                <span>Peso: <strong>{dispatch.weightKg.toLocaleString()} kg</strong></span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 col-span-2 sm:col-span-1 truncate font-mono text-[10px] flex items-center gap-1">
                <span className="text-slate-400">Hash:</span>
                <strong className="text-slate-700">{step1.hashSignature}</strong>
              </div>
            </div>
          </div>

          {/* Step 2: Carrier Pickup (Actionable) */}
          <div className={`bg-white rounded-2xl border p-4.5 shadow-sm space-y-3 transition-all ${
            isStep2Completed 
              ? 'border-emerald-200 bg-emerald-50/20' 
              : 'border-blue-400 ring-2 ring-blue-500/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  isStep2Completed 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-blue-600 text-white animate-pulse'
                }`}>
                  {isStep2Completed ? '✓' : '2'}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Paso 2: Retiro por Transportista Verificado
                  </h3>
                  <div className="text-[11px] text-slate-400">
                    {step2.timestamp ? step2.timestamp : 'Turno Asignado: 10:45 AM • En rampa de despacho'}
                  </div>
                </div>
              </div>

              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isStep2Completed
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isStep2Completed ? 'CUSTODIA ASUMIDA' : 'EN ESPERA DE ESCANEO'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              El conductor escanea el QR #1 para asumir la custodia y activar el monitoreo satelital.
            </p>

            {/* Simulación Button Step 2 */}
            {!isStep2Completed ? (
              <div className="pt-2">
                <button
                  onClick={simulateStep2Pickup}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-slate-900/20 transition active:scale-[0.98]"
                >
                  <QrCode className="w-4 h-4 text-blue-400" />
                  <span>Simular Escaneo QR Retiro (Chofer)</span>
                </button>
                <div className="text-[10px] text-center text-slate-400 mt-1.5">
                  Haz clic para transferir custodia legal física hacia el vehículo instantáneamente.
                </div>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Custodia transferida legalmente al camión NPR (Placas: A82BK1V).
                </span>
                <span className="text-[10px] font-mono text-emerald-700">{step2.timestamp}</span>
              </div>
            )}
          </div>

          {/* Step 3: Client Final Delivery (Actionable after Step 2) */}
          <div className={`bg-white rounded-2xl border p-4.5 shadow-sm space-y-3 transition-all ${
            isStep3Completed
              ? 'border-emerald-300 bg-emerald-50/30'
              : isStep2Completed
              ? 'border-blue-500 ring-2 ring-blue-500/20'
              : 'border-slate-200 opacity-70'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  isStep3Completed 
                    ? 'bg-emerald-600 text-white' 
                    : isStep2Completed 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-300 text-slate-600'
                }`}>
                  {isStep3Completed ? '✓' : '3'}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Paso 3: Entrega al Cliente Final
                  </h3>
                  <div className="text-[11px] text-slate-400">
                    {dispatch.destination.name} • {dispatch.destination.address}
                  </div>
                </div>
              </div>

              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                isStep3Completed
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : isStep2Completed
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {isStep3Completed ? (
                  <>
                    <CheckCheck className="w-3 h-3 text-emerald-600" />
                    ENTREGA CONFORME
                  </>
                ) : isStep2Completed ? (
                  'LISTO PARA RECIBIR'
                ) : (
                  <>
                    <Lock className="w-3 h-3" />
                    ESCANEO BLOQUEADO
                  </>
                )}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Al escanear el QR del receptor se confirma la entrega y se dispersan los ${dispatch.financials.totalEscrow.toFixed(2)} del Escrow.
            </p>

            {/* Action button step 3 */}
            {isStep2Completed && !isStep3Completed && (
              <div className="pt-2">
                <button
                  onClick={simulateStep3Delivery}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition active:scale-[0.98]"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Simular Escaneo QR Entrega (Destinatario)</span>
                </button>
                <div className="text-[10px] text-center text-slate-400 mt-1.5">
                  Desencadena la dispersión bancaria automática hacia el galpón, chofer y plataforma.
                </div>
              </div>
            )}

            {!isStep2Completed && (
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Requiere completar Paso 2 (Retiro en Galpón) para habilitar escaneo de entrega.</span>
              </div>
            )}

            {isStep3Completed && (
              <div className="p-3 rounded-xl bg-emerald-100/70 border border-emerald-300 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCheck className="w-4 h-4 text-emerald-700" />
                  ¡Despacho completado con éxito!
                </div>
                <div className="text-[11px] text-emerald-800">
                  Receptor: <strong>{step3.recipientName}</strong>. Fondos dispersados a cuentas destino vía PagoMóvil y transferencia bancaria.
                </div>
              </div>
            )}
          </div>

          {/* Transportista Profile Card with 4 Candados Protocol */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-800 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm shrink-0">
                  <Truck className="w-6 h-6 text-cyan-400" />
                  <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">
                      {dispatch.assignedCarrier.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-200">
                      CHOFER VERIFICADO
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {dispatch.assignedCarrier.vehicleModel} • Placas: <strong className="text-slate-700">{dispatch.assignedCarrier.licensePlate}</strong>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {dispatch.assignedCarrier.company} • RIF: {dispatch.assignedCarrier.rif}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => alert(`Llamando a Pedro Alvarado (${dispatch.assignedCarrier.phone})...`)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Llamar Chofer</span>
                </button>
                <button
                  onClick={() => setShowGpsModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Compartir GPS en Vivo</span>
                </button>
              </div>
            </div>

            {/* Protocolo de 4 Candados Display */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Protocolo de 4 Candados Activo
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-semibold">RIF / Licencia</div>
                  <div className="font-extrabold text-slate-800 text-xs mt-0.5">Grado 5</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Verificado INTT</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-semibold">Biometría</div>
                  <div className="font-extrabold text-slate-800 text-xs mt-0.5">Facial OK</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Cotejo 99.8%</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-semibold">Póliza de Carga</div>
                  <div className="font-extrabold text-slate-800 text-xs mt-0.5">Activa</div>
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Mercantil $25k</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-semibold">Reputación</div>
                  <div className="font-extrabold text-amber-600 text-xs mt-0.5">5.0 ★</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">142 fletes sin siniestros</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive QR & Escrow Dispersion (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* QR Code Container (Matches Screenshot 2) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm text-center space-y-4">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100 text-left">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Código QR de Custodia Legal #1
                </h3>
                <div className="text-[11px] text-slate-400">
                  Custodia Legal Vigente: Almacén Castillito Norte
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isStep2Completed
                  ? 'bg-slate-100 text-slate-500 border-slate-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {isStep2Completed ? 'UTILIZADO' : 'ACTIVO'}
              </span>
            </div>

            {/* Interactive QR Display */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 inline-block relative group">
              <div
                onClick={() => setShowQrExpanded(true)}
                className="w-48 h-48 bg-white p-2 rounded-xl shadow-inner border border-slate-200 flex items-center justify-center cursor-pointer relative overflow-hidden"
              >
                {/* Código QR REAL escaneable (codifica la guía SADA y el hash de custodia) */}
                <QrCodeImage value={qr1Value} size={176} />

                {/* Hover zoom pill */}
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1">
                  <Maximize2 className="w-4 h-4" />
                  <span>Ampliar</span>
                </div>
              </div>

              {/* Hash Display */}
              <div className="mt-2.5 text-[10px] font-mono text-slate-500 bg-white py-1 px-2 rounded border border-slate-200 truncate max-w-xs">
                HASH: <strong>{qr1HashShort}</strong> (SHA-256)
              </div>
            </div>

            <p className="text-xs text-slate-500 px-4">
              El chofer escanea este código para asumir la custodia legal física y transferir la responsabilidad civil.
            </p>
          </div>

          {/* Desglose y Liberación Escrow (Matches right card in Screenshot 2) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="font-extrabold text-slate-900 text-sm">
                Desglose y Liberación Escrow
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                TASA BCV FIJADA
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Fondos bajo resguardo seguro en fideicomiso GALPEX. Al confirmar el segundo escaneo QR, se dispersan automáticamente:
            </p>

            {/* Split breakdown */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Tarifa Galpón (Almacenaje Temporal 24h)</span>
                <strong className="text-slate-900 font-mono">${dispatch.financials.warehouseFee.toFixed(2)} USD</strong>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/70 border border-blue-100">
                <span className="text-blue-900 font-medium">Flete Transportista Verificado (4.5 Ton)</span>
                <strong className="text-blue-900 font-mono">${dispatch.financials.carrierFreightFee.toFixed(2)} USD</strong>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Comisión Plataforma GALPEX (10%)</span>
                <strong className="text-slate-900 font-mono">${dispatch.financials.platformCommission.toFixed(2)} USD</strong>
              </div>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">MONTO TOTAL PROTEGIDO</div>
                <div className="text-[10px] text-slate-400">Sin comisiones ocultas</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black font-mono text-slate-900">
                  ${dispatch.financials.totalEscrow.toFixed(2)}
                </div>
                <div className="text-[10px] font-bold text-emerald-600">USD FIDEICOMISO</div>
              </div>
            </div>

            {/* Cláusula de Liberación Automática */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cláusula de Liberación Automática</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Al completarse el segundo escaneo QR en destino, los fondos se liberan instantáneamente a las billeteras de cada actor vía PagoMóvil interbancario o dólares líquidos.
              </p>
            </div>

            {/* Route strip */}
            <div className="p-2.5 rounded-lg bg-slate-900 text-white text-[11px] flex items-center justify-between font-mono">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="truncate">{dispatch.routeNotes}</span>
              </div>
              <span className="text-emerald-400 font-bold shrink-0">ACTIVA</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Zoom Modal */}
      {showQrExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900">
              QR Custodia Legal #1 — Bahía 04
            </h3>
            <div className="w-64 h-64 bg-white p-4 rounded-2xl mx-auto border border-slate-200 flex items-center justify-center">
              <QrCodeImage value={qr1Value} size={224} />
            </div>
            <div className="text-xs text-slate-500 font-mono break-all p-2 bg-slate-50 rounded-lg">
              {dispatch.step2CarrierPickup.pickupQrHash}
            </div>
            <button
              onClick={() => setShowQrExpanded(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* GPS Simulation Modal */}
      {showGpsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Monitoreo Satelital en Tiempo Real (GPS)
                </h3>
              </div>
              <button 
                onClick={() => setShowGpsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Map Preview Simulation */}
            <div className="h-56 bg-slate-900 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              {/* Route lines */}
              <div className="relative text-center text-white space-y-2 z-10 px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Transmisión Satelital Activa (CanBus + GPS)
                </div>
                <div className="text-sm font-bold">Autopista del Este • Km 162</div>
                <div className="text-xs text-slate-400 font-mono">
                  Coordenadas: 10.1812° N, 67.9892° W • Velocidad: 62 km/h
                </div>
                <div className="text-[11px] text-cyan-300">
                  Estimado de llegada a Naguanagua: <strong>18 minutos</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>Conductor: <strong>Pedro Alvarado (NPR 4.5T)</strong></span>
              <span>Telemetría: <strong>Precinto SADA Intacto</strong></span>
            </div>

            <button
              onClick={() => setShowGpsModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              Cerrar Telemetría
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
