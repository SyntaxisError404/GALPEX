import React, { useState } from 'react';
import { useNexo } from '../../context/NexoContext';
import { Warehouse, CargoCategory } from '../../types';
import {
  MapPin,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  ThermometerSnowflake,
  AlertTriangle,
  Info,
  Clock,
  Landmark
} from 'lucide-react';
import { LegalFooterBanner } from '../layout/LegalFooterBanner';

// Imagen de respaldo si la URL de un galpón no carga (evita tarjetas en negro).
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';

export const WarehouseCatalog: React.FC = () => {
  const { 
    warehouses, 
    bcvRate, 
    selectedWarehouseForReservation, 
    setSelectedWarehouseForReservation,
    reserveWarehouse,
    cargoProfile,
    setShowOnboardingModal
  } = useNexo();

  const [selectedLocation, setSelectedLocation] = useState<string>(cargoProfile?.preferredZone || 'all');
  const [selectedCategory, setSelectedCategory] = useState<CargoCategory>(cargoProfile?.productType || 'repuestos_ferreteria');
  const [estimatedPallets, setEstimatedPallets] = useState<number>(cargoProfile?.estimatedPallets || 50);
  const [contractDays, setContractDays] = useState<number>(15);
  const [sortBy, setSortBy] = useState<'disponibilidad' | 'precio'>('disponibilidad');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pagomovil' | 'transferencia' | 'zelle'>('pagomovil');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if cargo profile updates
  React.useEffect(() => {
    if (cargoProfile) {
      setSelectedCategory(cargoProfile.productType);
      if (cargoProfile.preferredZone && cargoProfile.preferredZone !== 'all') {
        setSelectedLocation(cargoProfile.preferredZone);
      }
      if (cargoProfile.estimatedPallets) {
        setEstimatedPallets(cargoProfile.estimatedPallets);
      }
    }
  }, [cargoProfile]);

  // Filter warehouses
  const filteredWarehouses = warehouses.filter(wh => {
    if (selectedLocation !== 'all' && !wh.industrialZone.toLowerCase().includes(selectedLocation.toLowerCase()) && !wh.city.toLowerCase().includes(selectedLocation.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'disponibilidad') {
      return b.availableM2 - a.availableM2;
    }
    return a.dailyRatePerPallet - b.dailyRatePerPallet;
  });

  const selectedWh = selectedWarehouseForReservation || filteredWarehouses[0] || warehouses[0];
  const selectedCompatible = selectedWh.categoriesAccepted.includes(selectedCategory);

  // Calculations
  const antiAbandonmentDeposit = 30.00;
  const storageCost = estimatedPallets * contractDays * selectedWh.dailyRatePerPallet;
  const totalEscrowUsd = storageCost + antiAbandonmentDeposit;
  const totalEscrowVes = totalEscrowUsd * bcvRate;

  // Compatibility test
  const isCompatibleWithSelectedCategory = (wh: Warehouse) => {
    return wh.categoriesAccepted.includes(selectedCategory);
  };

  const handleConfirmReservation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      reserveWarehouse({
        warehouse: selectedWh,
        pallets: estimatedPallets,
        days: contractDays,
        category: selectedCategory,
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        productName: selectedCategory === 'repuestos_ferreteria' ? 'Repuestos Automotrices y Ferretería' : 'Lote Comercial Clasificado'
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
      {/* Top Filter Bar */}
      <div className="bg-white border-b border-slate-200/90 px-6 py-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Location Dropdown */}
          <div className="flex flex-col gap-1 min-w-[240px]">
            <label className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
              Ubicación Estratégica
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-8 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">Todas las zonas industriales de Venezuela</option>
                <option value="Castillito">Valencia - Z.I. Castillito (Carabobo)</option>
                <option value="San Diego">San Diego - Autopista Reg. del Centro</option>
                <option value="Los Guayos">Los Guayos - Zona Ind. El Tigre</option>
                <option value="San Vicente">Maracay - Z.I. San Vicente</option>
                <option value="La Yaguara">Caracas - Eje La Yaguara / Antímano</option>
                <option value="Puerto Cabello">Puerto Cabello - Corredor Marítimo</option>
              </select>
            </div>
          </div>

          {/* Cargo Category Pills */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                Tipo de Mercancía
              </label>
              <span className="text-[10px] text-blue-600 font-semibold hidden sm:inline">
                Filtro Anti-Contaminación Cruzada
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'carga_seca', label: 'Carga Seca' },
                { id: 'alimentos_empacados', label: 'Alimentos Empacados' },
                { id: 'repuestos_ferreteria', label: 'Repuestos / Ferretería' },
                { id: 'refrigerado', label: 'Refrigerado', icon: ThermometerSnowflake },
              ].map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as CargoCategory)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-900'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`} />}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Estimated Slider */}
          <div className="flex flex-col gap-1 min-w-[200px]">
            <div className="flex items-center justify-between text-xs">
              <label className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
                Volumen Estimado
              </label>
              <span className="font-extrabold text-blue-600 font-mono text-sm">
                {estimatedPallets} paletas
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold">5</span>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={estimatedPallets}
                onChange={(e) => setEstimatedPallets(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 font-bold">250</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Catalog Grid & Right Reservation Drawer */}
      <div className="flex-1 flex flex-col xl:flex-row gap-6 p-6 min-w-0">
        {/* Left: Warehouse Cards Grid */}
        <div className="flex-1 min-w-0">
          {/* Active Cargo Profile Banner if provider has answered the questionnaire */}
          {cargoProfile && (
            <div className="mb-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-blue-900/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">
                      Perfil Logístico Activo: {cargoProfile.productName || cargoProfile.productType.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      Auditado
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Mostrando galpones habilitados para <strong className="text-white capitalize">{cargoProfile.productType.replace('_', ' ')}</strong> con <strong>Cero Contaminación Cruzada</strong>.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOnboardingModal(true)}
                className="text-xs font-bold text-blue-300 hover:text-white px-3 py-1.5 rounded-xl bg-blue-900/50 hover:bg-blue-800/60 border border-blue-700/40 transition shrink-0"
              >
                Modificar Cuestionario
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Galpones Verificados
              </h2>
              <p className="text-xs text-slate-500">
                Reserva por paleta y día, con pago protegido.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 hidden sm:inline">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-300 text-slate-700 rounded-md px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="disponibilidad">Mayor Disponibilidad</option>
                <option value="precio">Menor Tarifa Diaria</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWarehouses.map((wh) => {
              const compatible = isCompatibleWithSelectedCategory(wh);
              const isSelected = selectedWh.id === wh.id;

              return (
                <div
                  key={wh.id}
                  onClick={() => { if (compatible) setSelectedWarehouseForReservation(wh); }}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between group shadow-sm ${
                    compatible ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed'
                  } ${
                    isSelected
                      ? 'border-blue-600 ring-2 ring-blue-600/30'
                      : compatible
                      ? 'border-slate-200/90 hover:border-slate-300'
                      : 'border-slate-200 opacity-60'
                  }`}
                >
                  {/* Image & Badges */}
                  <div className="relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={wh.imageUrl}
                      alt={wh.name}
                      loading="lazy"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src !== FALLBACK_IMAGE) img.src = FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold backdrop-blur-sm shadow-sm">
                        <ShieldCheck className="w-3 h-3" />
                        Seguridad 24/7 Verificada
                      </span>
                      {wh.temperatureControl && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-600/90 text-white text-[10px] font-bold backdrop-blur-sm shadow-sm">
                          <ThermometerSnowflake className="w-3 h-3" />
                          {wh.temperatureControl.split('(')[0].trim()}
                        </span>
                      )}
                    </div>

                    {/* Bottom overlay text */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-white">
                      <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                        {wh.subtitle}
                      </div>
                      <div className="text-sm font-bold truncate">
                        {wh.name}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Location & Address */}
                      <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{wh.city}, {wh.state} • {wh.industrialZone}</span>
                      </div>

                      {/* Capacity Meter */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500 font-medium">Capacidad Ociosa:</span>
                          <span className="font-extrabold text-blue-700">
                            {wh.idlePercentage}% Disp. ({wh.availableM2} m²)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${wh.idlePercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Feature Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {wh.features.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                          >
                            {f}
                          </span>
                        ))}
                      </div>

                      {/* Incompatibility Alert if category doesn't match */}
                      {!compatible && (
                        <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-1.5 mb-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>
                            No habilitado para {selectedCategory.replace('_', ' ')}. Selecciona rubro compatible.
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                      <div>
                        <div className="text-lg font-black text-slate-900 font-mono">
                          ${wh.dailyRatePerPallet.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">paleta / día</div>
                      </div>

                      <button
                        disabled={!compatible}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (compatible) setSelectedWarehouseForReservation(wh);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-sm ${
                          !compatible
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : isSelected
                            ? 'bg-blue-600 text-white shadow-blue-600/30'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        <span>{!compatible ? 'No disponible' : isSelected ? 'Seleccionado' : 'Reservar Espacio'}</span>
                        {compatible && <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Reservation & Escrow Summary Panel (Matches Screenshot 1 exactly) */}
        <div className="w-full xl:w-96 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-lg p-5 sticky top-24 space-y-4">
            {/* Header Badge */}
            <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-100">
              <span className="font-extrabold text-[11px] uppercase tracking-wider text-slate-400">
                ORDEN DE CUSTODIA NEXO
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200 text-[10px]">
                <Clock className="w-3 h-3 text-amber-600" />
                Fijación 48h
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Resumen de Reserva
              </h3>
            </div>

            {/* Selected Warehouse Info */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span>{selectedWh.name}</span>
                <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {selectedWh.city}, {selectedWh.state} — {selectedWh.industrialZone}
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">Espacio Asignado:</span>
                <span className="font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono">
                  {estimatedPallets} paletas
                </span>
              </div>
            </div>

            {/* Days Duration Picker */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Días de resguardo contratados:</span>
                <span className="font-bold text-slate-900 font-mono">{contractDays} días</span>
              </div>
              <div className="flex items-center gap-2">
                {[5, 10, 15, 30].map(d => (
                  <button
                    key={d}
                    onClick={() => setContractDays(d)}
                    className={`flex-1 py-1 rounded text-xs font-bold transition ${
                      contractDays === d
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center justify-between text-slate-600">
                <div>
                  <span>Almacenamiento Temporal</span>
                  <div className="text-[10px] text-slate-400">
                    {estimatedPallets} paletas × {contractDays} días (${selectedWh.dailyRatePerPallet.toFixed(2)}/día)
                  </div>
                </div>
                <strong className="text-slate-900 font-mono">
                  ${storageCost.toFixed(2)}
                </strong>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-1">
                  <span>Depósito Anti-Abandono</span>
                  <span 
                    title="100% Retornable al despachar la carga. Garantiza el flete de retorno si no retiras a tiempo (Cláusula 5)."
                    className="cursor-help"
                  >
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                  </span>
                </div>
                <div className="text-right">
                  <strong className="text-slate-900 font-mono">${antiAbandonmentDeposit.toFixed(2)}</strong>
                  <div className="text-[10px] text-emerald-600 font-semibold">100% Retornable</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Landmark className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tasa Oficial BCV Asegurada:</span>
                </div>
                <strong className="text-slate-700 font-mono">{bcvRate.toFixed(2)} VES/USD</strong>
              </div>
            </div>

            {/* Total Escrow Box (Matches dark-emerald box in Screenshot 1) */}
            <div className="p-4 rounded-xl bg-slate-950 text-white space-y-1.5 shadow-md">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-300">
                <span>TOTAL EN CUSTODIA ESCROW</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  FONDOS SEGREGADOS
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-white flex items-baseline gap-1.5">
                <span>${totalEscrowUsd.toFixed(2)}</span>
                <span className="text-xs font-semibold text-slate-400">USD LIQUIDABLES</span>
              </div>
              <div className="text-xs text-emerald-400 font-mono font-medium pt-1 border-t border-slate-800 flex items-center justify-between">
                <span>Equivalente estimado en Bolívares:</span>
                <strong>{totalEscrowVes.toLocaleString('es-VE', { maximumFractionDigits: 2 })} VES</strong>
              </div>
            </div>

            {/* Aviso si el galpón seleccionado no admite el rubro elegido */}
            {!selectedCompatible && (
              <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  {selectedWh.name} no admite <strong>{selectedCategory.replace(/_/g, ' ')}</strong>. Selecciona otro galpón compatible para continuar.
                </span>
              </div>
            )}

            {/* Confirm & Protect Escrow CTA Button */}
            <button
              onClick={handleConfirmReservation}
              disabled={isSubmitting || !selectedCompatible}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition transform active:scale-[0.98] ${
                selectedCompatible
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : 'bg-slate-300 cursor-not-allowed shadow-none'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-white" />
              <span>{isSubmitting ? 'Procesando Bóveda Escrow...' : !selectedCompatible ? 'Galpón no compatible' : 'Confirmar y Proteger Pago en Escrow'}</span>
            </button>

            {/* Trust disclaimer */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Custodia Garantizada:</strong> los fondos se liberan solo al validar la entrega con el QR.
              </span>
            </div>

            {/* Payment Methods */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                MÉTODOS ACEPTADOS EN BÓVEDA ESCROW
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold">
                <div 
                  onClick={() => setSelectedPaymentMethod('pagomovil')}
                  className={`p-1.5 rounded-md border cursor-pointer ${
                    selectedPaymentMethod === 'pagomovil'
                      ? 'bg-blue-50 border-blue-400 text-blue-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Pago Móvil C2P
                </div>
                <div 
                  onClick={() => setSelectedPaymentMethod('transferencia')}
                  className={`p-1.5 rounded-md border cursor-pointer ${
                    selectedPaymentMethod === 'transferencia'
                      ? 'bg-blue-50 border-blue-400 text-blue-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Transferencia Banesco/Mercantil
                </div>
                <div 
                  onClick={() => setSelectedPaymentMethod('zelle')}
                  className={`p-1.5 rounded-md border cursor-pointer ${
                    selectedPaymentMethod === 'zelle'
                      ? 'bg-blue-50 border-blue-400 text-blue-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  Zelle / Wire USD
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Venezuelan Legal Framework Banner */}
      <LegalFooterBanner />
    </div>
  );
};
