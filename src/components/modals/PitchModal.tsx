import React, { useState, useEffect } from 'react';
import { useNexo } from '../../context/NexoContext';
import { 
  Award, 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const PitchModal: React.FC = () => {
  const { showPitchModal, setShowPitchModal } = useNexo();
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSecondsLeft(sec => {
        if (sec <= 1) {
          setIsActive(false);
          return 0;
        }
        return sec - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(60);
  };

  if (!showPitchModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        {/* Pitch Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
                  HACKATÓN VALENVALLEY 2026
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  LOGÍSTICA
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white mt-0.5">
                Guion Ejecutivo de Presentación (Pitch de 60 Segundos)
              </h2>
            </div>
          </div>

          <button 
            onClick={() => setShowPitchModal(false)}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Control Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-mono text-xl font-black text-slate-900">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Cronómetro de Pitch</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition ${
                isActive 
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-600' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isActive ? 'Pausar' : 'Comenzar Pitch'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-200 transition"
              title="Reiniciar a 60s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pitch Body & Speech */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Executive Speech Box (from prompt page 6) */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border-2 border-amber-200/90 text-slate-900 space-y-3 shadow-inner">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Texto para Pronunciar ante los Jueces:</span>
            </div>

            <blockquote className="text-sm italic font-medium text-slate-800 leading-relaxed border-l-4 border-amber-500 pl-4 py-1">
              "En Venezuela, más del 45% de los galpones industriales pasan medio vacíos generando gastos fijos, mientras miles de proveedores no pueden expandirse a otras ciudades porque alquilar un depósito propio es carísimo y enviar cajas sueltas desde lejos destruye su margen.<br/><br/>
              Por eso creamos <strong>NexoCarga</strong>: el primer ecosistema de almacenamiento bajo demanda y transporte verificado del país. Conectamos galpones con espacio ocioso en zonas como Valencia o Caracas con proveedores que pagan solo por los días y paletas que usan.<br/><br/>
              Cuando cae una venta, nuestra red de transportistas verificados bajo <strong>cuatro candados de seguridad</strong> retira la mercancía mediante un <strong>doble escaneo QR y pago protegido en custodia</strong>. Al confirmar la entrega, el dinero se reparte automáticamente: el dueño del galpón monetiza su espacio vacío, el proveedor entrega el mismo día ahorrando un 70% en costos fijos, el transportista cobra seguro, y nosotros retenemos un 10% de comisión.<br/><br/>
              NexoCarga convierte metros cuadrados vacíos en la red logística más ágil de Venezuela."
            </blockquote>
          </div>

          {/* Key Bullet Points for Presentation */}
          <div className="space-y-2">
            <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
              Puntos Clave para la Ronda de Preguntas:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">45% de Capacidad Ociosa</strong>
                  <p className="text-slate-500 mt-0.5 text-[11px]">Validado por reportes gremiales de Conindustria en Carabobo y Aragua.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Ahorro &gt; 70% vs. Alquiler Fijo</strong>
                  <p className="text-slate-500 mt-0.5 text-[11px]">El proveedor pasa de $800+/mes fijo a $110 por operación sin depósito retenido.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Protocolo de 4 Candados</strong>
                  <p className="text-slate-500 mt-0.5 text-[11px]">Legal, Biometría SAIME, Escrow financiero y Reputación sin siniestros.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Cláusula Anti-Abandono</strong>
                  <p className="text-slate-500 mt-0.5 text-[11px]">Depósito de garantía activa retorno al día 15 o liquidación al día 30.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            NexoCarga — Hackatón ValenValley 2026
          </div>
          <button
            onClick={() => setShowPitchModal(false)}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            Cerrar Modal
          </button>
        </div>
      </div>
    </div>
  );
};
