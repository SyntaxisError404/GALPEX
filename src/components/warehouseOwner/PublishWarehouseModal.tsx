import React, { useState } from 'react';
import { useNexo } from '../../context/NexoContext';
import { CargoCategory } from '../../types';
import {
  Building2,
  X,
  Check,
  Camera,
  Video,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Sparkles,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';

// Fotos de muestra reales de galpones industriales para facilitar la publicación
const SAMPLE_WAREHOUSE_PHOTOS = [
  {
    title: 'Galpón Techado con Andén',
    tag: 'Andén de Carga',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Nave Amplia con Racks',
    tag: 'Racks y Montacargas',
    url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Piso Nivelado y Portón Grande',
    tag: 'Piso Concreto',
    url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Cámara Frigorífica (Frío)',
    tag: 'Cuarto Frío',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80'
  }
];

export const PublishWarehouseModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { publishWarehouse } = useNexo();

  // Datos básicos
  const [name, setName] = useState('');
  const [city, setCity] = useState('Valencia');
  const [industrialZone, setIndustrialZone] = useState('Z.I. Castillito');
  const [address, setAddress] = useState('');

  // Medidas y precio
  const [totalM2, setTotalM2] = useState<number>(600);
  const [availableM2, setAvailableM2] = useState<number>(250);
  const [dailyRate, setDailyRate] = useState<number>(0.45); // Tarifa realista ~$13.50/mes por paleta

  // Imágenes del galpón
  const [imageUrl, setImageUrl] = useState<string>(SAMPLE_WAREHOUSE_PHOTOS[0].url);
  const [customPhotoSelected, setCustomPhotoSelected] = useState<boolean>(false);

  // Requisito OBLIGATORIO: Seguridad con cámaras de vigilancia
  const [hasCctv, setHasCctv] = useState<boolean>(false);
  const [hasArmedGuard, setHasArmedGuard] = useState<boolean>(true);
  const [hasPowerBackup, setHasPowerBackup] = useState<boolean>(false);
  const [hasFireSystem, setHasFireSystem] = useState<boolean>(true);

  // Asegurar el estado del galpón (condiciones físicas verificadas)
  const [hasLeakProofRoof, setHasLeakProofRoof] = useState<boolean>(true);
  const [hasLevelFloor, setHasLevelFloor] = useState<boolean>(true);
  const [hasHeavyGate, setHasHeavyGate] = useState<boolean>(true);
  const [hasGoodLighting, setHasGoodLighting] = useState<boolean>(true);
  const [hasPestControl, setHasPestControl] = useState<boolean>(true);
  const [conditionDescription, setConditionDescription] = useState<string>(
    'Galpón en óptimas condiciones, techo de acerolit sin goteras, piso de concreto pulido para montacargas, portón corredizo de 5m con acceso directo para gandolas.'
  );

  // Fotos de comprobación técnica (auditoría anti-mentiras)
  const [cctvProofPhoto, setCctvProofPhoto] = useState<string>('https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80');
  const [roofProofPhoto, setRoofProofPhoto] = useState<string>('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80');
  const [showVerificationInfo, setShowVerificationInfo] = useState<boolean>(true);

  // Tipos de mercancía aceptada
  const [selectedCategories, setSelectedCategories] = useState<CargoCategory[]>([
    'carga_seca',
    'repuestos_ferreteria'
  ]);

  const [validationError, setValidationError] = useState<string>('');

  const handleToggleCategory = (cat: CargoCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  // Carga de foto desde el dispositivo del usuario
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
          setCustomPhotoSelected(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim()) {
      setValidationError('Por favor escribe el nombre de tu galpón o empresa.');
      return;
    }

    // Validación obligatoria: CÁMARAS DE SEGURIDAD
    if (!hasCctv) {
      setValidationError('Es obligatorio confirmar que el galpón cuenta con cámaras de seguridad (CCTV) para poder publicarlo en la plataforma.');
      return;
    }

    const featuresList: string[] = ['CCTV HD 24/7'];
    if (hasArmedGuard) featuresList.push('Vigilancia en garita');
    if (hasPowerBackup) featuresList.push('Planta eléctrica de respaldo');
    if (hasLevelFloor) featuresList.push('Piso para montacargas');
    if (hasHeavyGate) featuresList.push('Andén para gandolas');

    const badgesList: string[] = ['Cámaras 24/7 Verificadas'];
    if (hasLeakProofRoof) badgesList.push('Techo Hermético Sin Goteras');
    if (hasPestControl) badgesList.push('Control de Plagas al Día');

    publishWarehouse({
      name: name.trim(),
      subtitle: `${industrialZone} • Nave Lista para Alquilar`,
      city,
      state: city === 'Maracay' ? 'Aragua' : city === 'Caracas' ? 'Distrito Capital' : 'Carabobo',
      industrialZone,
      address: address.trim() || `Av. Principal ${industrialZone}, Manzana 8`,
      totalM2,
      availableM2,
      idlePercentage: Math.round((availableM2 / totalM2) * 100),
      dailyRatePerPallet: dailyRate,
      categoriesAccepted: selectedCategories,
      temperatureControl: selectedCategories.includes('refrigerado') ? 'Frío Controlado (2°C - 8°C)' : undefined,
      features: featuresList,
      securityBadges: badgesList,
      imageUrl,
      conditionDescription,
      hasCctvCameraSecurity: true,
      verifiedOwner: {
        id: 'usr-owner-active',
        name: 'Manuel Mendoza',
        company: name.trim() || 'Almacenadora Castillito C.A.',
        rif: 'J-31098234-9',
        phone: '+58 414-4328901',
        rating: 5.0
      }
    });

    onClose();
  };

  // Cálculo de ganancia estimada mensual para animar al dueño del galpón
  const estimatedPallets = Math.floor(availableM2 / 2); // Aprox 2m2 por paleta con pasillo
  const estimatedMonthlyIncome = estimatedPallets * dailyRate * 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-auto max-h-[92vh] flex flex-col">
        {/* Encabezado sin términos difíciles */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                Publicar Espacio en mi Galpón
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Pon a producir los metros cuadrados que tienes vacíos y cobra seguro cada mes.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario scrolleable */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto text-xs flex-1">
          {/* Alerta de error si falta la cámara */}
          {validationError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs flex items-start gap-2.5 shadow-sm">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="font-bold">{validationError}</div>
            </div>
          )}

          {/* 1. SECCIÓN: DATOS DEL GALPÓN */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                1
              </span>
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Datos de tu Galpón y Ubicación
              </h4>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Nombre de tu Galpón o Empresa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ej. Centro Logístico Castillito - Nave Central"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Ciudad</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                >
                  <option value="Valencia">Valencia (Carabobo)</option>
                  <option value="San Diego">San Diego (Carabobo)</option>
                  <option value="Los Guayos">Los Guayos (Carabobo)</option>
                  <option value="Puerto Cabello">Puerto Cabello (Carabobo)</option>
                  <option value="Maracay">Maracay (Aragua)</option>
                  <option value="Caracas">Caracas (Distrito Capital)</option>
                </select>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Zona Industrial</label>
                <input
                  type="text"
                  value={industrialZone}
                  onChange={(e) => setIndustrialZone(e.target.value)}
                  placeholder="ej. Z.I. Castillito, San Vicente, El Tigre"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dirección de acceso (para camiones y gandolas)</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="ej. Av. Este-Oeste 3, Manzana B, Portón Verde frente al andén"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* 2. SECCIÓN: FOTOS DEL GALPÓN */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                  2
                </span>
                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Fotos del Galpón (Muestra tus Instalaciones)
                </h4>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" /> Las fotos aumentan las reservas
              </span>
            </div>

            {/* Vista previa de la foto seleccionada */}
            <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group shadow-sm">
              <img
                src={imageUrl}
                alt="Vista previa del galpón"
                className="w-full h-full object-cover group-hover:scale-102 transition duration-300 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Foto Principal Lista
                </span>
                {hasCctv && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-md">
                    <Video className="w-3.5 h-3.5" /> CCTV 24/7
                  </span>
                )}
              </div>

              <div className="absolute bottom-2.5 left-3 text-white">
                <div className="text-[10px] uppercase font-bold text-slate-300">Así lo verán los clientes:</div>
                <div className="text-xs font-black">{name || 'Nombre de tu Galpón'} · {city}</div>
              </div>
            </div>

            {/* Botón para subir foto propia + selección de fotos rápidas */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-sm">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Subir foto desde mi teléfono o PC</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-slate-400">o elige una foto de muestra que se parezca a tu galpón:</span>
              </div>

              {/* Selector de fotos de muestra */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {SAMPLE_WAREHOUSE_PHOTOS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImageUrl(sample.url);
                      setCustomPhotoSelected(false);
                    }}
                    className={`p-1.5 rounded-xl border text-left transition overflow-hidden group ${
                      imageUrl === sample.url && !customPhotoSelected
                        ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="h-14 rounded-lg overflow-hidden mb-1 relative">
                      <img src={sample.url} alt={sample.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[8px] font-bold px-1 rounded">
                        {sample.tag}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-800 truncate">{sample.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. SECCIÓN: SEGURIDAD OBLIGATORIA CON CÁMARAS (CCTV) */}
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white shadow-md border border-blue-800/40 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm text-white">
                      Seguridad Obligatoria: Cámaras de Vigilancia (CCTV)
                    </h4>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                      Requisito Indispensable
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Para prevenir robos, extravíos y darle total tranquilidad a los clientes, KARGON <strong>solo acepta galpones que tengan cámaras de seguridad activas las 24 horas</strong>.
                  </p>
                </div>
              </div>

              {/* Checkbox OBLIGATORIO */}
              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasCctv}
                    onChange={(e) => setHasCctv(e.target.checked)}
                    className="w-4 h-4 rounded mt-0.5 accent-emerald-500 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-extrabold text-white block">
                      Confirmo que mi galpón cuenta con cámaras de seguridad (CCTV) grabando 24/7 en entradas, salidas y pasillos.
                    </span>
                    <span className="text-[11px] text-slate-300 block mt-0.5">
                      Al marcar esta casilla, certificas que tus cámaras están operativas para respaldar cualquier revisión o custodia.
                    </span>
                  </div>
                </label>
              </div>

              {/* Opciones adicionales de seguridad */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-slate-200">
                <label className="flex items-center gap-2 cursor-pointer bg-white/5 p-2 rounded-lg hover:bg-white/10 transition">
                  <input
                    type="checkbox"
                    checked={hasArmedGuard}
                    onChange={(e) => setHasArmedGuard(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Vigilancia en garita / 24h</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-white/5 p-2 rounded-lg hover:bg-white/10 transition">
                  <input
                    type="checkbox"
                    checked={hasPowerBackup}
                    onChange={(e) => setHasPowerBackup(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Planta eléctrica</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer bg-white/5 p-2 rounded-lg hover:bg-white/10 transition">
                  <input
                    type="checkbox"
                    checked={hasFireSystem}
                    onChange={(e) => setHasFireSystem(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Extintores al día</span>
                </label>
              </div>
            </div>
          </div>

          {/* 4. SECCIÓN: ASEGURAR EL ESTADO FÍSICO DEL GALPÓN */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                3
              </span>
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Asegurar el Estado Físico del Galpón
              </h4>
            </div>

            <p className="text-[11px] text-slate-500">
              Marca las condiciones de mantenimiento que garantizas a los clientes que alquilen tu espacio:
            </p>

            {/* Checklists de condiciones aseguradas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLeakProofRoof}
                  onChange={(e) => setHasLeakProofRoof(e.target.checked)}
                  className="rounded w-4 h-4 accent-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-800 text-xs">Techo sin filtraciones</div>
                  <div className="text-[10px] text-slate-500">Sin goteras que puedan mojar la mercancía</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLevelFloor}
                  onChange={(e) => setHasLevelFloor(e.target.checked)}
                  className="rounded w-4 h-4 accent-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-800 text-xs">Piso de concreto nivelado</div>
                  <div className="text-[10px] text-slate-500">Resistente para montacargas y estiba alta</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasHeavyGate}
                  onChange={(e) => setHasHeavyGate(e.target.checked)}
                  className="rounded w-4 h-4 accent-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-800 text-xs">Portón de seguridad reforzado</div>
                  <div className="text-[10px] text-slate-500">Cierre seguro para descarga de gandolas</div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPestControl}
                  onChange={(e) => setHasPestControl(e.target.checked)}
                  className="rounded w-4 h-4 accent-emerald-600"
                />
                <div>
                  <div className="font-bold text-slate-800 text-xs">Control de plagas al día</div>
                  <div className="text-[10px] text-slate-500">Fumigado y limpio de roedores/insectos</div>
                </div>
              </label>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Escribe en tus palabras el estado y ventajas de tu galpón:
              </label>
              <textarea
                rows={2}
                value={conditionDescription}
                onChange={(e) => setConditionDescription(e.target.value)}
                placeholder="ej. Galpón limpio, altura de 8 metros, patio de maniobra amplio donde gira una gandola sin problema, portón eléctrico..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* SECCIÓN DE VERIFICACIÓN ANTI-FRAUDE / FOTOS DE RESPALDO */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 border border-slate-800">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h5 className="font-black text-xs text-white">
                      Fotos de Comprobación Técnica (Revisión de Seguridad)
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Sube o confirma fotos reales de tu sistema de cámaras y el estado del techo:
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  Auditado
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Foto 1: Cámaras */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-cyan-400" />
                      1. Monitor de Cámaras CCTV
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold">Verificado</span>
                  </div>
                  <div className="h-24 rounded-lg overflow-hidden border border-slate-800 relative group">
                    <img src={cctvProofPhoto} alt="Monitor CCTV" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-[10px] font-bold text-white gap-1">
                      <Upload className="w-3.5 h-3.5" /> Cambiar foto
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const r = new FileReader();
                            r.onload = () => { if (typeof r.result === 'string') setCctvProofPhoto(r.result); };
                            r.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="text-[10px] text-slate-400">Foto del monitor o DVR grabando en vivo</div>
                </div>

                {/* Foto 2: Techo y piso */}
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      2. Foto Interior (Techo / Piso)
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold">Verificado</span>
                  </div>
                  <div className="h-24 rounded-lg overflow-hidden border border-slate-800 relative group">
                    <img src={roofProofPhoto} alt="Techo y piso" className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-[10px] font-bold text-white gap-1">
                      <Upload className="w-3.5 h-3.5" /> Cambiar foto
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const r = new FileReader();
                            r.onload = () => { if (typeof r.result === 'string') setRoofProofPhoto(r.result); };
                            r.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="text-[10px] text-slate-400">Demuestra que no hay filtraciones ni roturas</div>
                </div>
              </div>

              {/* Los 3 Candados de Verificación KARGON */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-1.5 text-[11px]">
                <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>¿Por qué nadie puede mentir al publicar en KARGON?</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px] text-slate-300">
                  <div className="bg-black/30 p-2 rounded border border-white/5">
                    <strong className="text-white block mb-0.5">1. Revisión en Terreno:</strong>
                    El transportista certificado valida físicamente las cámaras y el techo con fotos en la primera descarga.
                  </div>
                  <div className="bg-black/30 p-2 rounded border border-white/5">
                    <strong className="text-white block mb-0.5">2. Responsabilidad Legal:</strong>
                    El galpón firma como Depositario Mercantil con su RIF bajo el Código de Comercio venezolano (Art. 535).
                  </div>
                  <div className="bg-black/30 p-2 rounded border border-white/5">
                    <strong className="text-white block mb-0.5">3. Pago Protegido:</strong>
                    Los fondos del alquiler se transfieren solo si la carga se mantiene segura sin quejas ni daños.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. SECCIÓN: METROS DISPONIBLES Y PRECIO */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                4
              </span>
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                Espacio Disponible y Precio por Paleta
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Metros Totales (M²)</label>
                <input
                  type="number"
                  min="50"
                  value={totalM2}
                  onChange={(e) => setTotalM2(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Metros Vacíos para Alquilar</label>
                <input
                  type="number"
                  min="20"
                  max={totalM2}
                  value={availableM2}
                  onChange={(e) => setAvailableM2(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-bold text-blue-700"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Precio USD por paleta / día</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">$</span>
                  <input
                    type="number"
                    step="0.05"
                    min="0.25"
                    max="3.00"
                    value={dailyRate}
                    onChange={(e) => setDailyRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-6 pr-2 py-2.5 text-xs font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Calculadora sencilla de ganancias */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold">
                  Con tus {availableM2} m² vacíos (~{estimatedPallets} paletas) puedes generar:
                </span>
              </div>
              <div className="text-sm font-black font-mono text-emerald-800">
                ~${estimatedMonthlyIncome.toFixed(0)} USD / mes
              </div>
            </div>
          </div>

          {/* 6. SECCIÓN: TIPOS DE CARGA QUE ACEPTAS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                5
              </span>
              <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                ¿Qué tipo de mercancía aceptas en tu galpón?
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { 
                  id: 'carga_seca', 
                  label: 'Carga Seca General', 
                  desc: 'Cajas, mercancía general, plástico, textil (sin olores).' 
                },
                { 
                  id: 'repuestos_ferreteria', 
                  label: 'Repuestos & Ferretería', 
                  desc: 'Autopartes, piezas mecánicas, herramientas, tornillería.' 
                },
                { 
                  id: 'alimentos_empacados', 
                  label: 'Alimentos Empacados (SACS)', 
                  desc: 'Arroz, harina, pasta. Requiere galpón muy limpio y sin químicos.' 
                },
                { 
                  id: 'refrigerado', 
                  label: 'Refrigerado / Cuarto Frío', 
                  desc: 'Solo si tienes cuartos fríos operativos (lácteos, embutidos).' 
                }
              ].map((c) => {
                const checked = selectedCategories.includes(c.id as CargoCategory);
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => handleToggleCategory(c.id as CargoCategory)}
                    className={`p-3 rounded-xl border text-left transition flex items-start justify-between ${
                      checked
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900">{c.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{c.desc}</div>
                    </div>
                    {checked && <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Publicación gratuita · Pagos garantizados por cliente</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-white shadow-lg transition flex items-center justify-center gap-2 ${
                  hasCctv
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30 cursor-pointer'
                    : 'bg-slate-800 hover:bg-slate-700 text-white cursor-pointer'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Publicar mi Espacio</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
