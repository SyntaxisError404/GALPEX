import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useNexo } from '../../context/NexoContext';
import {
  Truck,
  Building2,
  Navigation,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Layers,
  MapPin,
  ShieldCheck,
  Clock,
  Compass,
  Info
} from 'lucide-react';

// Coordenadas reales sobre la Autopista Regional del Centro (ARC) hasta Cagua (coordenadas del usuario: 10.03132, -67.48301)
const ARC_ROUTE_COORDINATES: [number, number][] = [
  [10.1872, -67.9543], // Origen: Castillito Norte (Valencia)
  [10.1985, -67.9250], // Big Low Center (San Diego)
  [10.2100, -67.8990], // Distribuidor Los Guayos
  [10.2280, -67.8760], // Guacara ARC
  [10.2450, -67.8300], // Tramo Yagua - Guacara
  [10.2600, -67.7850], // San Joaquín ARC
  [10.2950, -67.7120], // Mariara ARC
  [10.2850, -67.6700], // Límite Carabobo - Aragua
  [10.2700, -67.6400], // Peaje Santa Clara / Cabrera
  [10.2450, -67.6150], // Distribuidor Maracay San Vicente
  [10.2200, -67.5750], // Distribuidor Tapa Tapa
  [10.1950, -67.5350], // Palo Negro / Intercomunal
  [10.1400, -67.5100], // Tramo Turmero - La Encrucijada
  [10.0850, -67.4950], // La Encrucijada de Turmero
  [10.0550, -67.4890], // Entrada a Cagua
  [10.03132, -67.48301] // Destino Cliente: Cagua Zona Industrial (Coordenada exacta OSM)
];

// Puntos de control (Hitos) de la ruta para el tracking
const ROUTE_WAYPOINTS = [
  { name: 'Galpón Castillito Norte (Valencia)', km: 0, index: 0 },
  { name: 'Distribuidor San Diego / Big Low', km: 4, index: 1 },
  { name: 'Peaje Guacara', km: 12, index: 3 },
  { name: 'San Joaquín', km: 23, index: 5 },
  { name: 'Túnel La Cabrera / Límite Aragua', km: 38, index: 8 },
  { name: 'Maracay - San Vicente', km: 46, index: 9 },
  { name: 'La Encrucijada de Cagua', km: 62, index: 13 },
  { name: 'Destino: Ferretería El Tornillo (Cagua)', km: 68, index: 15 }
];

// Coordenadas geoespaciales de los galpones de la red KARGON
const WAREHOUSE_COORDINATES: Record<string, { lat: number; lng: number; tag: string }> = {
  'wh-castillito-norte': { lat: 10.1872, lng: -67.9543, tag: 'Galpón Castillito Norte (Valencia)' },
  'wh-big-low-san-diego': { lat: 10.1985, lng: -67.9250, tag: 'Centro Big Low Park (San Diego)' },
  'wh-los-guayos-ind': { lat: 10.1810, lng: -67.8920, tag: 'Depósito Los Guayos (Carabobo)' },
  'wh-maracay-san-vicente': { lat: 10.2350, lng: -67.6250, tag: 'Hub San Vicente (Maracay)' },
  'wh-ensenada-refrig': { lat: 10.4720, lng: -68.0180, tag: 'Frigoríficos La Ensenada (Pto. Cabello)' },
  'wh-caracas-yaguara': { lat: 10.4850, lng: -66.9650, tag: 'MegaDepósito La Yaguara (Caracas)' }
};

interface OpenStreetMapTrackingProps {
  mode?: 'client' | 'carrier';
  height?: string;
  onWarehouseSelect?: (warehouseId: string) => void;
}

export const OpenStreetMapTracking: React.FC<OpenStreetMapTrackingProps> = ({
  mode = 'client',
  height = '500px',
  onWarehouseSelect
}) => {
  const { warehouses } = useNexo();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const truckMarkerRef = useRef<L.Marker | null>(null);
  const activePolylineRef = useRef<L.Polyline | null>(null);
  const glowPolylineRef = useRef<L.Polyline | null>(null);

  // Estado de simulación del camión
  const [currentStep, setCurrentStep] = useState<number>(10); // Empieza cerca de Maracay/Encrucijada
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('wh-castillito-norte');

  // Calcular telemetría en base al paso actual
  const currentCoord = ARC_ROUTE_COORDINATES[currentStep] || ARC_ROUTE_COORDINATES[0];
  const progressPercent = Math.round((currentStep / (ARC_ROUTE_COORDINATES.length - 1)) * 100);
  const remainingKm = Math.max(0, Math.round((1 - currentStep / (ARC_ROUTE_COORDINATES.length - 1)) * 68));
  const remainingMinutes = Math.max(2, Math.round((remainingKm / 62) * 60));

  // Generador de ícono SVG vectorial para el Camión (NO emojis)
  const createTruckIcon = (speedText: string) => {
    const svgHtml = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
        <!-- Ondas de telemetría GPS pulsante -->
        <div style="position: absolute; top: 12px; width: 44px; height: 44px; border-radius: 50%; background: rgba(37, 99, 235, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        
        <!-- Insignia vectorial del camión -->
        <div style="position: relative; width: 44px; height: 44px; background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0284c7 100%); border-radius: 12px; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.45); display: flex; align-items: center; justify-content: center;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <!-- Chasis y furgón de carga -->
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
            <path d="M15 18H9" />
            <!-- Cabina del camión -->
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14v10" />
            <!-- Ruedas -->
            <circle cx="7" cy="18" r="2" fill="#1e293b" />
            <circle cx="17" cy="18" r="2" fill="#1e293b" />
          </svg>
        </div>

        <!-- Etiqueta flotante con datos de telemetría -->
        <div style="margin-top: 4px; background: #0f172a; color: #38bdf8; font-family: ui-monospace, SFMono-Regular, monospace; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 6px; border: 1px solid #334155; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          NPR • ${speedText}
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'kargon-truck-div-icon',
      html: svgHtml,
      iconSize: [44, 60],
      iconAnchor: [22, 30]
    });
  };

  // Generador de ícono SVG vectorial para Galpones
  const createWarehouseIcon = (name: string, isOrigin: boolean) => {
    const bgColor = isOrigin ? '#10b981' : '#6366f1';
    const borderColor = isOrigin ? '#059669' : '#4f46e5';
    const svgHtml = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="width: 34px; height: 34px; background: ${bgColor}; border-radius: 10px; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
            <path d="M10 6h4"/>
            <path d="M10 10h4"/>
            <path d="M10 14h4"/>
            <path d="M10 18h4"/>
          </svg>
        </div>
        <div style="margin-top: 3px; background: rgba(15, 23, 42, 0.95); color: #ffffff; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; border: 1px solid ${borderColor}; white-space: nowrap; max-width: 130px; overflow: hidden; text-overflow: ellipsis; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
          ${name}
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'kargon-warehouse-div-icon',
      html: svgHtml,
      iconSize: [34, 52],
      iconAnchor: [17, 26]
    });
  };

  // Generador de ícono SVG para el Destino del Cliente (Cagua)
  const createDestinationIcon = () => {
    const svgHtml = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <div style="width: 36px; height: 36px; background: #9333ea; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4); display: flex; align-items: center; justify-content: center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div style="margin-top: 2px; background: #581c87; color: #f3e8ff; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; border: 1px solid #a855f7; white-space: nowrap;">
          Cliente: Ferretería El Tornillo
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'kargon-dest-div-icon',
      html: svgHtml,
      iconSize: [36, 54],
      iconAnchor: [18, 27]
    });
  };

  // Inicialización del Mapa Leaflet con OpenStreetMap
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Crear mapa centrado en el corredor ARC (entre Maracay y Cagua 10.03132, -67.48301)
    const map = L.map(mapContainerRef.current, {
      center: [10.1650, -67.6300],
      zoom: 11,
      zoomControl: false,
      attributionControl: true
    });

    // Control de Zoom en posición superior derecha
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Capa de mosaicos oscura estilo Command Center (CartoDB Dark Matter sobre OpenStreetMap)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a> • KARGON Satelital',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    // Trazar Ruta resaltada sobre la ARC
    // 1. Resplandor exterior (Glow)
    const glow = L.polyline(ARC_ROUTE_COORDINATES, {
      color: '#38bdf8',
      weight: 9,
      opacity: 0.4,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    glowPolylineRef.current = glow;

    // 2. Línea principal (Azul intenso institucional)
    const mainLine = L.polyline(ARC_ROUTE_COORDINATES, {
      color: '#2563eb',
      weight: 4.5,
      opacity: 0.95,
      dashArray: '6, 6',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    activePolylineRef.current = mainLine;

    // Agregar Marcadores de Galpones
    warehouses.forEach((wh) => {
      const geo = WAREHOUSE_COORDINATES[wh.id];
      if (geo) {
        const isOrigin = wh.id === 'wh-castillito-norte';
        const marker = L.marker([geo.lat, geo.lng], {
          icon: createWarehouseIcon(wh.name.replace('Galpón Modular ', '').replace('Centro Logístico ', ''), isOrigin)
        }).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; font-size: 12px; color: #1e293b; max-width: 240px; line-height: 1.4;">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px;">${wh.name}</div>
            <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">${wh.address}</div>
            
            <div style="background: #f1f5f9; padding: 6px 8px; border-radius: 6px; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #475569;">Espacio disponible:</span>
                <strong style="color: #059669;">${wh.availableM2} m²</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #475569;">Tarifa estimada:</span>
                <strong>$${wh.dailyRatePerPallet.toFixed(2)} / paleta / día</strong>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 4px; color: #0284c7; font-size: 10px; font-weight: 700;">
              <span>Galpón Auditado con CCTV y Art. 535 C.Com</span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          setSelectedWarehouseId(wh.id);
          if (onWarehouseSelect) onWarehouseSelect(wh.id);
        });
      }
    });

    // Agregar Marcador de Destino del Cliente (Cagua - exacto del usuario)
    const destCoord: [number, number] = [10.03132, -67.48301];
    const destMarker = L.marker(destCoord, {
      icon: createDestinationIcon()
    }).addTo(map);

    destMarker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; color: #1e293b;">
        <div style="font-weight: 800; font-size: 13px; color: #6b21a8;">Punto de Entrega (Receptor)</div>
        <div style="font-weight: 600; margin-top: 2px;">Ferretería El Tornillo C.A.</div>
        <div style="color: #64748b; font-size: 11px;">Zona Industrial Cagua, Estado Aragua</div>
        <div style="color: #7e22ce; font-size: 10px; font-weight: 700; margin-top: 4px;">Coords: 10.03132, -67.48301 (OpenStreetMap)</div>
      </div>
    `);

    // Marcador del Camión en tiempo real con SVG Vectorial
    const initialPos = ARC_ROUTE_COORDINATES[currentStep];
    const truckMarker = L.marker(initialPos, {
      icon: createTruckIcon('62 km/h'),
      zIndexOffset: 1000
    }).addTo(map);

    truckMarker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; color: #1e293b;">
        <div style="font-weight: 800; font-size: 13px; color: #1d4ed8;">Flete Activo KARGON #DSP-2026-9941</div>
        <div style="color: #475569; margin-top: 2px;">Chofer: <strong>Pedro Alvarado</strong></div>
        <div style="color: #475569;">Vehículo: <strong>Chevrolet NPR 4.5T (Placas A38CD2K)</strong></div>
        <div style="margin-top: 4px; padding: 4px; background: #eff6ff; border-radius: 4px; color: #1e40af; font-size: 10px;">
          Telemetría GPS enlazada por red celular 4G
        </div>
      </div>
    `);

    truckMarkerRef.current = truckMarker;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Simulación del camión avanzando paso a paso sobre la ruta
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= ARC_ROUTE_COORDINATES.length - 1) {
          return 0; // Reiniciar ruta al terminar para demostración continua
        }
        return prev + 1;
      });
    }, 2800);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Actualizar posición del marcador del camión en el mapa Leaflet
  useEffect(() => {
    if (!truckMarkerRef.current || !mapInstanceRef.current) return;

    const newPos = ARC_ROUTE_COORDINATES[currentStep];
    truckMarkerRef.current.setLatLng(newPos);

    // Si estamos en modo cliente, centrar suavemente en el camión cada pocos pasos
    if (mode === 'client' && currentStep % 3 === 0) {
      mapInstanceRef.current.panTo(newPos, { animate: true, duration: 1 });
    }
  }, [currentStep, mode]);

  // Enfocar en un galpón específico o en toda la ruta
  const handleFocusWarehouse = (whId: string) => {
    setSelectedWarehouseId(whId);
    const geo = WAREHOUSE_COORDINATES[whId];
    if (geo && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([geo.lat, geo.lng], 13, { duration: 1.2 });
    }
  };

  const handleFitRoute = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.fitBounds(ARC_ROUTE_COORDINATES, { padding: [40, 40] });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Barra de Controles y Telemetría Superior */}
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wide text-white uppercase">
                OpenStreetMap Satelital • Autopista Regional del Centro
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                GPS VIVO
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Coordenadas Destino: <strong className="text-blue-300 font-mono">10.03132, -67.48301 (Cagua)</strong></span>
              <span>•</span>
              <span>Camión: <strong className="text-white">NPR 4.5T</strong></span>
            </div>
          </div>
        </div>

        {/* Botones de control de simulación */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-600 text-white hover:bg-emerald-500'
            }`}
            title={isPlaying ? 'Pausar simulación de GPS' : 'Reanudar simulación en vivo'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pausar Rastreo' : 'Reanudar GPS'}</span>
          </button>

          <button
            onClick={() => setCurrentStep(0)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Reiniciar ruta desde Valencia"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleFitRoute}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
            title="Ver toda la ruta completa"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ver Ruta Completa</span>
          </button>
        </div>
      </div>

      {/* Contenedor del Mapa Leaflet con OpenStreetMap */}
      <div className="relative w-full" style={{ height }}>
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Tarjeta Flotante Informativa: Telemetría de la Carga */}
        <div className="absolute top-3 left-3 z-[400] max-w-xs bg-slate-900/90 backdrop-blur-md text-white p-3.5 rounded-xl border border-slate-700 shadow-xl pointer-events-auto">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-blue-400" />
              <span>Telemetría en Ruta</span>
            </span>
            <span className="font-mono text-emerald-400 font-extrabold text-[11px]">
              {progressPercent}% completado
            </span>
          </div>

          <div className="mt-2.5 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Velocidad media:</span>
              <strong className="text-white font-mono">62 km/h</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Distancia restante:</span>
              <strong className="text-blue-300 font-mono">~{remainingKm} km</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tiempo de arribo (ETA):</span>
              <strong className="text-amber-300 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> ~{remainingMinutes} min
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Precinto de Seguridad:</span>
              <strong className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Intacto (#9941-A)
              </strong>
            </div>
          </div>

          {/* Barra de Progreso */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Selector Flotante de Galpones para el Transportista y Cliente */}
        <div className="absolute bottom-3 left-3 right-3 z-[400] bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 shadow-lg pointer-events-auto flex items-center gap-2 overflow-x-auto">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 px-2 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Galpones en la Red:</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {warehouses.map((wh) => {
              const isSelected = selectedWarehouseId === wh.id;
              return (
                <button
                  key={wh.id}
                  onClick={() => handleFocusWarehouse(wh.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}`}></span>
                  <span>{wh.city}: {wh.name.replace('Galpón Modular ', '').replace('Centro Logístico ', '').replace('Almacenes Frigoríficos ', '')}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pie descriptivo institucional */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Mapa provisto por <strong>OpenStreetMap</strong> con enrutamiento dinámico en la Autopista Regional del Centro (Valencia ➔ San Diego ➔ Maracay ➔ Cagua).
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Ubicación satelital verificada bajo normas de seguridad de transporte terrestre (INTT).
        </div>
      </div>
    </div>
  );
};
