import React, { useState } from 'react';
import { useNexo } from '../../context/NexoContext';
import { Warehouse, CargoCategory, ProviderCargoProfile } from '../../types';
import {
  MapPin,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  ThermometerSnowflake,
  AlertTriangle,
  Info,
  Clock,
  Landmark,
  Ban,
  ShieldAlert,
  Eye,
  CheckCircle2,
  X
} from 'lucide-react';
import { LegalFooterBanner } from '../layout/LegalFooterBanner';

// Imagen de respaldo si la URL de un galpón no carga (evita tarjetas en negro).
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80';

const formatCategoryName = (cat: CargoCategory | string): string => {
  switch (cat) {
    case 'carga_seca': return 'Carga Seca';
    case 'alimentos_empacados': return 'Alimentos Empacados (SACS)';
    case 'repuestos_ferreteria': return 'Repuestos & Ferretería';
    case 'refrigerado': return 'Refrigerado (Cadena de Frío)';
    default: return cat;
  }
};

// Modal explicativo interactivo de por qué un galpón no es apto para la carga del proveedor
const IncompatibleWarehouseModal: React.FC<{
  warehouse: Warehouse | null;
  cargoProfile: ProviderCargoProfile | null;
  selectedCategory: CargoCategory;
  onClose: () => void;
  onSelectCompatibleOnly: () => void;
}> = ({ warehouse, cargoProfile, selectedCategory, onClose, onSelectCompatibleOnly }) => {
  if (!warehouse) return null;

  const targetCategory = cargoProfile ? cargoProfile.productType : selectedCategory;
  const targetName = cargoProfile?.productName || formatCategoryName(targetCategory);

  const getReasonDetails = () => {
    if (targetCategory === 'refrigerado' && !warehouse.temperatureControl) {
      return {
        headline: 'Falta de Cadena de Frío Controlada',
        description: `Tu producto "${targetName}" exige refrigeración constante activa (2°C a 8°C) con monitoreo telemétrico y respaldo eléctrico continuo. ${warehouse.name} opera exclusivamente a temperatura ambiente para carga seca.`,
        normative: 'Art. 42 de las Normas de Buenas Prácticas de Fabricación y Almacenamiento Sanitario (Gaceta Oficial N° 36.081).'
      };
    }
    if (targetCategory === 'alimentos_empacados' && !warehouse.categoriesAccepted.includes('alimentos_empacados')) {
      return {
        headline: 'Incompatibilidad Sanitaria & Riesgo de Contaminación Cruzada (SACS / SICA)',
        description: `Almacenar alimentos de consumo humano ("${targetName}") en este galpón está estrictamente prohibido, dado que alberga repuestos mecánicos, grasas, lubricantes o herramientas pesadas que liberan residuos y olores incompatibles con la inocuidad alimentaria.`,
        normative: 'Reglamento General de Alimentos y Disposiciones Sanitarias del SACS (MPPS).'
      };
    }
    if (targetCategory === 'repuestos_ferreteria' && !warehouse.categoriesAccepted.includes('repuestos_ferreteria')) {
      return {
        headline: 'Recinto Frigorífico Especializado Exclusivo',
        description: `Este galpón opera bajo hermeticidad biosegura para alimentos perecederos. No cuenta con andenes para piezas automotrices pesadas ni autorización para almacenamiento de metales o ferretería industrial.`,
        normative: 'Protocolos de Inocuidad y Segregación Absoluta GALPEX Smart Escrow.'
      };
    }
    return {
      headline: 'Rubro Fuera de Certificación Técnica',
      description: `Las características constructivas, pólizas de seguros y licencias de este recinto no contemplan el resguardo de "${targetName}".`,
      normative: 'Cláusula 4 del Contrato Marco de Depósito Mercantil GALPEX.'
    };
  };

  const details = getReasonDetails();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-red-200 relative overflow-hidden">
        {/* Top warning ribbon */}
        <div className="bg-red-600 text-white px-4 py-2 -mx-6 -mt-6 mb-5 flex items-center justify-between text-xs font-black tracking-wider uppercase">
          <div className="flex items-center gap-1.5">
            <Ban className="w-4 h-4" />
            <span>Restricción de Seguridad & Segregación de Carga</span>
          </div>
          <button onClick={onClose} className="text-white hover:text-red-200 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 leading-snug">
              {warehouse.name} no puede utilizarse para tu mercancía
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {warehouse.city}, {warehouse.state} · {warehouse.industrialZone}
            </p>
          </div>
        </div>

        {/* Comparison grid */}
        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-4">
          <div className="border-r border-slate-200 pr-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Tu Mercancía Declarada
            </span>
            <div className="font-extrabold text-slate-900 text-xs">
              {targetName}
            </div>
            <div className="text-[11px] text-blue-700 font-semibold mt-0.5">
              Rubro: {formatCategoryName(targetCategory)}
            </div>
            {cargoProfile?.requiresTemperatureControl && (
              <span className="inline-block mt-1 text-[10px] bg-cyan-100 text-cyan-800 font-bold px-1.5 py-0.5 rounded">
                Requiere Frío (2°C - 8°C)
              </span>
            )}
            {cargoProfile?.hasSadaOrSica && (
              <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                Control SACS / SICA
              </span>
            )}
          </div>

          <div className="pl-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Capacidad del Galpón
            </span>
            <div className="font-bold text-slate-800 text-[11px]">
              Admite exclusivamente:
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              {warehouse.categoriesAccepted.map(formatCategoryName).join(' · ')}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-medium">
              Condición: {warehouse.temperatureControl || 'Ambiente (Sin Frío)'}
            </div>
          </div>
        </div>

        {/* Motivo Detallado */}
        <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200 text-red-950 text-xs space-y-2 mb-4">
          <div className="flex items-center gap-1.5 font-extrabold text-red-900">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{details.headline}</span>
          </div>
          <p className="text-xs text-red-900/90 leading-relaxed">
            {details.description}
          </p>
          <div className="pt-2 border-t border-red-200/60 text-[11px] text-red-800">
            <strong>Fundamento Normativo:</strong> {details.normative}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <button
            onClick={() => {
              onSelectCompatibleOnly();
              onClose();
            }}
            className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Ver solo galpones aptos para mi carga</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

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

  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<CargoCategory>(cargoProfile?.productType || 'repuestos_ferreteria');
  const [estimatedPallets, setEstimatedPallets] = useState<number>(cargoProfile?.estimatedPallets || 50);
  const [contractDays, setContractDays] = useState<number>(15);
  const [sortBy, setSortBy] = useState<'disponibilidad' | 'precio'>('disponibilidad');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pagomovil' | 'transferencia' | 'zelle'>('pagomovil');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // El proveedor ve el catálogo COMPLETO por defecto (todos los galpones del país,
  // compatibles primero). Puede filtrar a "Solo Aptos" con el toggle si lo desea.
  const [showAllWarehouses, setShowAllWarehouses] = useState<boolean>(true);
  const [selectedIncompatibleWh, setSelectedIncompatibleWh] = useState<Warehouse | null>(null);

  // Sincroniza el rubro y volumen con el perfil de carga, pero NO limita la zona:
  // el catálogo arranca mostrando todas las ubicaciones para verlo completo.
  React.useEffect(() => {
    if (cargoProfile) {
      setSelectedCategory(cargoProfile.productType);
      if (cargoProfile.estimatedPallets) {
        setEstimatedPallets(cargoProfile.estimatedPallets);
      }
    }
  }, [cargoProfile]);

  // Regla de compatibilidad estricta
  const isWarehouseCompatible = (wh: Warehouse) => {
    const targetCat = cargoProfile ? cargoProfile.productType : selectedCategory;
    return wh.categoriesAccepted.includes(targetCat);
  };

  // Helper de información de incompatibilidad
  const getIncompatibilityInfo = (wh: Warehouse) => {
    const targetName = cargoProfile?.productName || formatCategoryName(selectedCategory);
    const targetCat = cargoProfile ? cargoProfile.productType : selectedCategory;

    if (targetCat === 'refrigerado' && !wh.temperatureControl) {
      return {
        badge: 'Sin Cadena de Frío',
        title: 'Requiere Control Térmico (2°C - 8°C)',
        reason: `Tu producto "${targetName}" exige refrigeración activa y continua. Este galpón opera a temperatura ambiente para carga seca.`,
      };
    }

    if (targetCat === 'alimentos_empacados' && !wh.categoriesAccepted.includes('alimentos_empacados')) {
      return {
        badge: 'Riesgo Contaminación Cruzada',
        title: 'Incompatibilidad Sanitaria (SACS)',
        reason: `Tu producto "${targetName}" es de consumo masivo. Este galpón almacena repuestos, autopartes o ferretería que pondrían en riesgo la inocuidad.`,
      };
    }

    if (targetCat === 'repuestos_ferreteria' && !wh.categoriesAccepted.includes('repuestos_ferreteria')) {
      return {
        badge: 'Frigorífico Exclusivo',
        title: 'Solo Grado Alimentario',
        reason: `Este centro logístico opera como cámara frigorífica hermética; no admite repuestos automotrices, herramientas pesadas o ferretería.`,
      };
    }

    return {
      badge: 'Rubro No Autorizado',
      title: 'Especificaciones Incompatibles',
      reason: `Este galpón no cuenta con condiciones técnicas ni permisos de seguros para almacenar "${targetName}".`,
    };
  };

  // Filter warehouses by location
  const locationFiltered = warehouses.filter(wh => {
    if (selectedLocation !== 'all' && !wh.industrialZone.toLowerCase().includes(selectedLocation.toLowerCase()) && !wh.city.toLowerCase().includes(selectedLocation.toLowerCase())) {
      return false;
    }
    return true;
  });

  const compatibleCount = locationFiltered.filter(isWarehouseCompatible).length;
  const totalCount = locationFiltered.length;

  // Then apply compatibility filter if cargoProfile exists and user hasn't chosen "show all"
  const filteredWarehouses = locationFiltered.filter(wh => {
    if (cargoProfile && !showAllWarehouses) {
      return isWarehouseCompatible(wh);
    }
    return true;
  }).sort((a, b) => {
    // Si se muestran todos, colocar los compatibles primero
    if (cargoProfile && showAllWarehouses) {
      const aComp = isWarehouseCompatible(a);
      const bComp = isWarehouseCompatible(b);
      if (aComp && !bComp) return -1;
      if (!aComp && bComp) return 1;
    }
    if (sortBy === 'disponibilidad') {
      return b.availableM2 - a.availableM2;
    }
    return a.dailyRatePerPallet - b.dailyRatePerPallet;
  });

  // Mantener galpón seleccionado (preferir el primero compatible)
  const firstCompatible = locationFiltered.find(isWarehouseCompatible) || locationFiltered[0] || warehouses[0];
  const selectedWh = selectedWarehouseForReservation || firstCompatible;
  const selectedCompatible = isWarehouseCompatible(selectedWh);

  // Calculations
  const antiAbandonmentDeposit = 25.00;
  const storageCost = estimatedPallets * contractDays * selectedWh.dailyRatePerPallet;
  const totalEscrowUsd = storageCost + antiAbandonmentDeposit;
  const totalEscrowVes = totalEscrowUsd * bcvRate;

  const handleConfirmReservation = () => {
    if (!selectedCompatible) return;
    setIsSubmitting(true);
    setTimeout(() => {
      reserveWarehouse({
        warehouse: selectedWh,
        pallets: estimatedPallets,
        days: contractDays,
        category: selectedCategory,
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        productName: cargoProfile?.productName || (selectedCategory === 'repuestos_ferreteria' ? 'Repuestos Automotrices y Ferretería' : 'Lote Comercial Clasificado')
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
      {/* Modal explicativo de incompatibilidad */}
      <IncompatibleWarehouseModal
        warehouse={selectedIncompatibleWh}
        cargoProfile={cargoProfile}
        selectedCategory={selectedCategory}
        onClose={() => setSelectedIncompatibleWh(null)}
        onSelectCompatibleOnly={() => {
          setShowAllWarehouses(false);
          if (firstCompatible) setSelectedWarehouseForReservation(firstCompatible);
        }}
      />

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
                    Tu carga declarada es <strong className="text-white capitalize">{formatCategoryName(cargoProfile.productType)}</strong>.
                    GALPEX aplica reglas de <strong>Cero Contaminación Cruzada</strong>.
                  </p>
                </div>
              </div>

              {/* Controles: Opción de visualizar otros galpones o solo compatibles */}
              <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-blue-800/50 text-xs">
                  <button
                    onClick={() => setShowAllWarehouses(false)}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                      !showAllWarehouses
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    title="Ver solo galpones que admiten tu mercancía"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Solo Aptos ({compatibleCount})</span>
                  </button>
                  <button
                    onClick={() => setShowAllWarehouses(true)}
                    className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
                      showAllWarehouses
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    title="Ver todos los galpones del país aunque no admitan tu rubro"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Todos ({totalCount})</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowOnboardingModal(true)}
                  className="text-xs font-bold text-blue-300 hover:text-white px-3 py-1.5 rounded-xl bg-blue-900/50 hover:bg-blue-800/60 border border-blue-700/40 transition shrink-0"
                >
                  Modificar Encuesta
                </button>
              </div>
            </div>
          )}

          {/* Aviso contextual cuando se activa "Ver Todos" */}
          {cargoProfile && showAllWarehouses && (
            <div className="mb-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-start sm:items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                <div className="text-xs">
                  <span className="font-extrabold text-amber-950">Visualizando catálogo completo de Venezuela: </span>
                  Los galpones con etiqueta <span className="bg-red-100 text-red-800 font-bold px-1.5 py-0.5 rounded border border-red-200">⛔ NO APTO</span> están restringidos para tu mercancía ({cargoProfile.productName}) por razones de bioseguridad, segregación de rubros y normas SACS/SICA.
                </div>
              </div>
              <button
                onClick={() => setShowAllWarehouses(false)}
                className="text-xs font-bold text-amber-800 underline hover:text-amber-950 shrink-0 whitespace-nowrap"
              >
                Filtrar solo compatibles ({compatibleCount})
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Galpones Verificados {cargoProfile && !showAllWarehouses ? `(Aptos para tu carga: ${compatibleCount})` : ''}
              </h2>
              <p className="text-xs text-slate-500">
                Reserva fraccional por paleta y día, respaldada con Bóveda Smart Escrow.
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
              const compatible = isWarehouseCompatible(wh);
              const isSelected = selectedWh.id === wh.id;
              const incompatInfo = getIncompatibilityInfo(wh);

              return (
                <div
                  key={wh.id}
                  onClick={() => {
                    setSelectedWarehouseForReservation(wh);
                    if (!compatible) {
                      setSelectedIncompatibleWh(wh);
                    }
                  }}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between group shadow-sm cursor-pointer ${
                    isSelected
                      ? compatible
                        ? 'border-blue-600 ring-2 ring-blue-600/30'
                        : 'border-red-500 ring-2 ring-red-500/30'
                      : compatible
                      ? 'border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                      : 'border-amber-300/80 bg-amber-50/20 hover:border-amber-400'
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
                      className={`w-full h-full object-cover group-hover:scale-105 transition duration-300 ${
                        compatible ? 'opacity-90' : 'opacity-60 grayscale-[40%]'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent"></div>

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                      {compatible ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/95 text-white text-[10px] font-bold backdrop-blur-sm shadow-sm">
                          <CheckCircle2 className="w-3 h-3 text-emerald-100" />
                          Apto para tu Producto
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/95 text-white text-[10px] font-black backdrop-blur-sm shadow-sm animate-pulse">
                          <Ban className="w-3 h-3" />
                          NO APTO PARA TU CARGA
                        </span>
                      )}

                      {wh.temperatureControl && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-600/90 text-white text-[10px] font-bold backdrop-blur-sm shadow-sm">
                          <ThermometerSnowflake className="w-3 h-3" />
                          {wh.temperatureControl.split('(')[0].trim()}
                        </span>
                      )}
                    </div>

                    {/* Overlay si es incompatible para que quede inequívocamente claro */}
                    {!compatible && (
                      <div className="absolute inset-0 flex items-center justify-center p-3 pointer-events-none">
                        <div className="bg-slate-950/85 border border-red-500/40 rounded-xl px-3 py-1.5 text-center shadow-lg backdrop-blur-sm">
                          <div className="text-xs font-black text-red-300 flex items-center justify-center gap-1">
                            <Ban className="w-3.5 h-3.5 text-red-400" />
                            <span>Incompatible</span>
                          </div>
                          <div className="text-[10px] text-slate-300 font-medium">
                            {incompatInfo.badge}
                          </div>
                        </div>
                      </div>
                    )}

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

                      {/* Tarjeta explicativa si NO es compatible */}
                      {!compatible && (
                        <div className="p-3 rounded-xl bg-red-50/90 border border-red-200 text-red-950 text-xs mb-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 font-bold text-red-900">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                              <span>{incompatInfo.title}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedIncompatibleWh(wh);
                              }}
                              className="text-[10px] font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-0.5"
                            >
                              <Info className="w-3 h-3" /> ¿Por qué?
                            </button>
                          </div>
                          <p className="text-[11px] text-red-800 leading-snug">
                            {incompatInfo.reason}
                          </p>
                          <div className="pt-1 text-[10px] text-slate-600 font-medium border-t border-red-200/60">
                            <span>Admite solo: </span>
                            <strong className="text-slate-800">
                              {wh.categoriesAccepted.map(formatCategoryName).join(', ')}
                            </strong>
                          </div>
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

                      {compatible ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWarehouseForReservation(wh);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-sm ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-blue-600/30'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          <span>{isSelected ? 'Seleccionado' : 'Reservar Espacio'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWarehouseForReservation(wh);
                            setSelectedIncompatibleWh(wh);
                          }}
                          className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 hover:border-red-300 flex items-center gap-1.5 transition"
                          title="Ver por qué no puedes utilizar este galpón"
                        >
                          <Ban className="w-3.5 h-3.5 text-red-500" />
                          <span>No Apto (Ver Motivo)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Reservation & Escrow Summary Panel */}
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
            <div className={`p-3 rounded-xl border ${
              selectedCompatible 
                ? 'bg-slate-50 border-slate-200/80' 
                : 'bg-red-50/70 border-red-200'
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span>{selectedWh.name}</span>
                {selectedCompatible ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <Ban className="w-3.5 h-3.5 text-red-500 shrink-0" />
                )}
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

            {/* Total Escrow Box */}
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
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-black text-red-800">
                  <Ban className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Reserva Bloqueada: Galpón Incompatible</span>
                </div>
                <p className="text-[11px] text-red-800 leading-snug">
                  <strong>{selectedWh.name}</strong> no está habilitado para <strong>{cargoProfile?.productName || formatCategoryName(selectedCategory)}</strong>.
                </p>
                <p className="text-[10px] text-red-700 leading-tight">
                  GALPEX Smart Escrow no permite constituir depósitos en garantía para recintos incompatibles para evitar siniestros de contaminación y rechazos en inspección física.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const comp = warehouses.find(isWarehouseCompatible);
                    if (comp) setSelectedWarehouseForReservation(comp);
                  }}
                  className="mt-1 text-[11px] font-black text-blue-700 hover:text-blue-900 underline block"
                >
                  Seleccionar un galpón compatible automáticamente →
                </button>
              </div>
            )}

            {/* Confirm & Protect Escrow CTA Button */}
            <button
              onClick={handleConfirmReservation}
              disabled={isSubmitting || !selectedCompatible}
              className={`w-full py-3.5 px-4 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition transform active:scale-[0.98] ${
                selectedCompatible
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              {selectedCompatible ? (
                <>
                  <ShieldCheck className="w-5 h-5 text-white" />
                  <span>{isSubmitting ? 'Procesando Bóveda Escrow...' : 'Confirmar y Proteger Pago en Escrow'}</span>
                </>
              ) : (
                <>
                  <Ban className="w-5 h-5 text-slate-500" />
                  <span>Bloqueado: Incompatible con tu Producto</span>
                </>
              )}
            </button>

            {/* Trust disclaimer */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Custodia Garantizada:</strong> los fondos se liberan solo al validar la entrega física con el QR.
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
