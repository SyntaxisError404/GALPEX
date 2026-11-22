import React, { useState } from 'react';
import type { CargoCategory, ProviderCargoProfile } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Package,
  Wrench,
  Utensils,
  ThermometerSnowflake,
  Box,
  MapPin,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileCheck2,
  Sparkles
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onComplete: (profile: ProviderCargoProfile) => void;
  initialProfile?: ProviderCargoProfile | null;
  onClose?: () => void;
}

export const ProviderOnboardingModal: React.FC<Props> = ({
  isOpen,
  onComplete,
  initialProfile,
  onClose
}) => {
  const [step, setStep] = useState<number>(1);
  const [productType, setProductType] = useState<CargoCategory>(initialProfile?.productType || 'repuestos_ferreteria');
  const [productName, setProductName] = useState(initialProfile?.productName || '');
  const [hasSadaOrSica, setHasSadaOrSica] = useState(initialProfile?.hasSadaOrSica || false);
  const [requiresSacs, setRequiresSacs] = useState(initialProfile?.requiresSacs || false);
  const [requiresTemperatureControl, setRequiresTemperatureControl] = useState(initialProfile?.requiresTemperatureControl || false);
  const [hasChemicalOrOdors, setHasChemicalOrOdors] = useState(initialProfile?.hasChemicalOrOdors || false);
  const [estimatedPallets, setEstimatedPallets] = useState<number>(initialProfile?.estimatedPallets || 50);
  const [preferredZone, setPreferredZone] = useState<string>(initialProfile?.preferredZone || 'Castillito');

  if (!isOpen) return null;

  const handleSelectCategory = (cat: CargoCategory) => {
    setProductType(cat);
    if (cat === 'alimentos_empacados') {
      setHasSadaOrSica(true);
      setRequiresSacs(true);
      setRequiresTemperatureControl(false);
      setHasChemicalOrOdors(false);
      if (!productName) setProductName('Alimentos de Consumo Masivo (Harinas / Granos)');
    } else if (cat === 'refrigerado') {
      setHasSadaOrSica(true);
      setRequiresSacs(true);
      setRequiresTemperatureControl(true);
      setHasChemicalOrOdors(false);
      if (!productName) setProductName('Lácteos / Embutidos / Cadena de Frío');
    } else if (cat === 'repuestos_ferreteria') {
      setHasSadaOrSica(false);
      setRequiresSacs(false);
      setRequiresTemperatureControl(false);
      if (!productName) setProductName('Repuestos Automotrices & Ferretería');
    } else {
      setRequiresTemperatureControl(false);
      if (!productName) setProductName('Mercancía Seca General');
    }
  };

  const handleFinish = () => {
    const profile: ProviderCargoProfile = {
      productType,
      productName: productName.trim() || 'Lote Comercial Declarado',
      hasSadaOrSica,
      requiresSacs,
      requiresTemperatureControl,
      hasChemicalOrOdors,
      estimatedPallets,
      preferredZone,
      completedAt: new Date().toISOString()
    };
    onComplete(profile);
  };

  const categories = [
    {
      id: 'repuestos_ferreteria' as CargoCategory,
      title: 'Repuestos & Ferretería',
      desc: 'Piezas mecánicas, autopartes, tornillería, cables, herramientas industriales.',
      icon: Wrench,
      badge: 'Carga Pesada',
      color: 'blue'
    },
    {
      id: 'alimentos_empacados' as CargoCategory,
      title: 'Alimentos Empacados (SACS)',
      desc: 'Harina, arroz, pasta, enlatados, granos, cereales. Requiere cero contaminación.',
      icon: Utensils,
      badge: 'Grado Alimentario',
      color: 'emerald'
    },
    {
      id: 'refrigerado' as CargoCategory,
      title: 'Cadena de Frío (2°C a 8°C)',
      desc: 'Lácteos, embutidos, vacunas, fármacos sensibles. Requiere planta eléctrica 24/7.',
      icon: ThermometerSnowflake,
      badge: 'Temperatura Controlada',
      color: 'cyan'
    },
    {
      id: 'carga_seca' as CargoCategory,
      title: 'Carga Seca General',
      desc: 'Textiles, calzado, plásticos, juguetes, empaques, productos no perecederos.',
      icon: Box,
      badge: 'Estándar',
      color: 'amber'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 select-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-blue-400">
                  CUESTIONARIO DE CUMPLIMIENTO SANITARIO & LOGÍSTICO
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  OBLIGATORIO
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white mt-0.5">
                Clasificación de Mercancía del Proveedor
              </h2>
            </div>
          </div>

          {onClose && initialProfile && (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg hover:bg-slate-800 transition"
            >
              Cerrar
            </button>
          )}
        </div>

        {/* Stepper progress bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                    step === s
                      ? 'bg-blue-600 text-white shadow'
                      : step > s
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                <span
                  className={`font-semibold text-[11px] hidden sm:inline ${
                    step === s ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s === 1 ? 'Producto' : s === 2 ? 'Normativas' : s === 3 ? 'Volumen' : 'Diagnóstico'}
                </span>
                {s < 4 && <span className="text-slate-300 mx-1">›</span>}
              </div>
            ))}
          </div>

          <span className="text-[11px] font-bold text-slate-500">
            Paso {step} de 4
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* STEP 1: Product Nature */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  ¿Qué tipo de mercancía comercializa tu empresa?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Esta selección activa los filtros automáticos para prevenir contaminación cruzada y garantizar que tu inventario entre solo a galpones habilitados legalmente.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = productType === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => handleSelectCategory(cat.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {cat.badge}
                        </span>
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900 text-xs mb-1">
                          {cat.title}
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {cat.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Descripción comercial del lote o producto
                </label>
                <input
                  type="text"
                  placeholder="ej. Filtros de aceite y pastillas de freno para gandolas"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Sanitary and Legal Compliance */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Exigencias Sanitarias y Regulatorias en Venezuela
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conforme al Código de Comercio y la Ley de Almacenes Generales de Depósito, declaramos los requisitos para el resguardo:
                </p>
              </div>

              <div className="space-y-3">
                {/* Switch 1: SADA / SICA */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      <span>¿Tu producto requiere Guía de Movilización SADA / SICA / SUNAGRO?</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Obligatorio para rubros alimenticios, granos y productos regulados de consumo masivo en Venezuela.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasSadaOrSica(!hasSadaOrSica)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                      hasSadaOrSica ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        hasSadaOrSica ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 2: SACS */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>¿Requiere Certificación Sanitaria de Almacén SACS?</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      El galpón debe tener control de roedores/fumigación quincenal y permisos sanitarios al día.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRequiresSacs(!requiresSacs)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                      requiresSacs ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        requiresSacs ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 3: Temperature control */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ThermometerSnowflake className="w-4 h-4 text-cyan-600" />
                      <span>¿Requiere Cadena de Frío Continua (2°C a 8°C)?</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Solo se habilitarán almacenes con telemetría IoT activa y planta eléctrica de respaldo 150 kVA.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRequiresTemperatureControl(!requiresTemperatureControl)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                      requiresTemperatureControl ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        requiresTemperatureControl ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 4: Chemical / Odors */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-bold text-amber-950 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      <span>¿Desprende olores químicos, vapores, polvo o aceites?</span>
                    </div>
                    <p className="text-[11px] text-amber-800">
                      Fundamental para la separación física y evitar demandas por daño a mercancías vecinas.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasChemicalOrOdors(!hasChemicalOrOdors)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ${
                      hasChemicalOrOdors ? 'bg-amber-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                        hasChemicalOrOdors ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Volume and Location */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Volumen Estimado y Hub Estratégico en Venezuela
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ¿Dónde necesitas tener inventario para despachar el mismo día en menos de 24 horas?
                </p>
              </div>

              {/* Volume Slider */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-xs">
                    Volumen de resguardo estimado:
                  </span>
                  <span className="font-extrabold text-blue-600 font-mono text-base bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {estimatedPallets} paletas
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="250"
                  step="5"
                  value={estimatedPallets}
                  onChange={(e) => setEstimatedPallets(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>5 paletas (Lote PyME)</span>
                  <span>50 paletas</span>
                  <span>100 paletas</span>
                  <span>250 paletas (Distribución Masiva)</span>
                </div>
              </div>

              {/* Strategic Zone Selector */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Eje Logístico Preferido para Almacenamiento:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'Castillito', label: 'Valencia - Z.I. Castillito', state: 'Carabobo (Centro Industrial)' },
                    { id: 'San Diego', label: 'San Diego - Autopista Regional', state: 'Carabobo (Acceso Directo ARC)' },
                    { id: 'Los Guayos', label: 'Los Guayos - Parque El Tigre', state: 'Carabobo (Zona Gandolera)' },
                    { id: 'San Vicente', label: 'Maracay - Z.I. San Vicente', state: 'Aragua (Corredor Centro-Oriente)' },
                    { id: 'La Yaguara', label: 'Caracas - Eje La Yaguara', state: 'Distrito Capital (Última Milla)' },
                    { id: 'Puerto Cabello', label: 'Puerto Cabello - Muelle', state: 'Carabobo (Corredor Marítimo Frío)' },
                  ].map((zone) => {
                    const isSelected = preferredZone === zone.id;
                    return (
                      <div
                        key={zone.id}
                        onClick={() => setPreferredZone(zone.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 font-bold text-blue-950 shadow-sm'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="text-xs">{zone.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{zone.state}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Diagnosis and Match */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-extrabold text-emerald-950">
                  ¡Diagnóstico de Compatibilidad Logística Completado!
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  Tu perfil ha sido registrado formalmente. La plataforma prefiltrará automáticamente los galpones y bloqueará cualquier espacio incompatible para blindar tu patrimonio.
                </p>
              </div>

              {/* Diagnosis Details Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Resumen de tu Perfil Logístico
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[11px] block">Categoría de Mercancía:</span>
                    <strong className="text-slate-900 capitalize">
                      {productType.replace('_', ' ')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Producto Declarado:</span>
                    <strong className="text-slate-900 truncate block">
                      {productName || 'Carga Comercial'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Volumen Estimado:</span>
                    <strong className="text-blue-700 font-mono">
                      {estimatedPallets} paletas
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">Eje Preferido:</span>
                    <strong className="text-slate-900">
                      {preferredZone}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Filtro Anti-Contaminación Cruzada: <strong>ACTIVO</strong></span>
                  </div>
                  {hasSadaOrSica && (
                    <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
                      <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Validación obligatoria de Guía SADA / SICA en recepción</span>
                    </div>
                  )}
                  {requiresTemperatureControl && (
                    <div className="flex items-center gap-1.5 text-cyan-700 font-semibold">
                      <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Exclusivo para galpones con telemetría 2°C a 8°C y planta 150 kVA</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-slate-700 font-bold text-xs hover:bg-slate-200 flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Activar Perfil y Explorar Galpones Aptos</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
