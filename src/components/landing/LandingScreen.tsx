import React from 'react';
import type { UserRole } from '../../types';
import {
  Layers,
  QrCode,
  ShieldCheck,
  Scale,
  ArrowRight,
  ChevronDown,
  Building2,
  Package,
  Truck,
  Store
} from 'lucide-react';

interface LandingScreenProps {
  onLogin: () => void;
  onRegister: (role?: UserRole) => void;
}

const NAV_LINKS = [
  { label: 'Galpones Verificados', href: '#features' },
  { label: 'Cadena de Custodia', href: '#features' },
  { label: 'Smart Escrow', href: '#features' },
  { label: 'Calculadora m²', href: '#features' }
];

const FEATURES = [
  {
    icon: QrCode,
    title: 'Doble Escaneo QR',
    desc: 'Transferencia de custodia legal garantizada en cada punto de relevo de carga.',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
  },
  {
    icon: ShieldCheck,
    title: 'Smart Escrow B2B',
    desc: 'Fondos protegidos en USD o Bs. liberados solo tras confirmación de inspección.',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    icon: Scale,
    title: 'Garantía Anti-Abandono',
    desc: 'Aval contractual regido bajo el Código de Comercio de la República de Venezuela.',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  }
];

const AUDIENCES = [
  { dot: 'bg-blue-400', label: 'Proveedores e Importadores' },
  { dot: 'bg-emerald-400', label: 'Dueños de Galpones y Patios' },
  { dot: 'bg-amber-400', label: 'Flotas y Transportistas Certificados' },
  { dot: 'bg-purple-400', label: 'Comercios y Receptores Finales' }
];

export const LandingScreen: React.FC<LandingScreenProps> = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-screen bg-[#070d20] text-white flex flex-col relative overflow-hidden">
      {/* Fondo: degradado + patrón de puntos + destellos de color */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1430] via-[#070d20] to-[#05080f]"></div>
        <div className="absolute inset-0 opacity-[0.15] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:22px_22px]"></div>
        <div className="absolute top-24 left-[12%] w-2 h-2 rounded-sm bg-blue-500/60 rotate-12"></div>
        <div className="absolute top-40 right-[18%] w-2 h-2 rounded-sm bg-emerald-500/60 -rotate-12"></div>
        <div className="absolute top-72 left-[22%] w-1.5 h-1.5 rounded-sm bg-amber-500/60 rotate-45"></div>
        <div className="absolute top-60 right-[30%] w-1.5 h-1.5 rounded-sm bg-blue-400/50"></div>
        <div className="absolute top-96 left-[40%] w-1.5 h-1.5 rounded-sm bg-cyan-400/50 rotate-12"></div>
      </div>

      {/* Barra de navegación */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold tracking-tight">GAL<span className="text-blue-400">PEX</span></div>
              <div className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">Venezuela</div>
            </div>
            <span className="hidden lg:inline text-[9px] font-bold text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded tracking-wider">
              LOGÍSTICA B2B
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className="hover:text-white transition">{l.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={onLogin} className="hidden sm:inline text-xs font-bold text-slate-200 hover:text-white transition">
              Iniciar Sesión
            </button>
            <button
              onClick={() => onRegister()}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition"
            >
              Registrar Empresa
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-5 w-full flex flex-col items-center text-center pt-14 pb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Plataforma Logística B2B · Galpones Fraccionales & Fletes Verificados
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05] max-w-3xl">
          Impulsa tu logística con la red de custodia y pagos garantizados
        </h1>

        <p className="mt-6 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Reserva metros cuadrados por paleta/día en <strong className="text-slate-200">Valencia</strong>,{' '}
          <strong className="text-slate-200">Maracay</strong> y <strong className="text-slate-200">Caracas</strong>.
          Trazabilidad inmutable con doble QR y fideicomiso <strong className="text-slate-200">Smart Escrow</strong> contra siniestros.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onLogin}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm transition"
          >
            <span>Explorar Galpones</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={onLogin}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition"
          >
            <span>Iniciar Sesión / Entrar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tarjetas de características */}
        <div id="features" className="mt-16 w-full grid grid-cols-1 md:grid-cols-3 gap-4 scroll-mt-20">
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-left hover:border-white/20 transition">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 ${f.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Llamado final a registrarse por rol */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5">
          {[
            { icon: Package, label: 'Soy Proveedor', role: 'proveedor' as const },
            { icon: Building2, label: 'Tengo un Galpón', role: 'dueno_galpon' as const },
            { icon: Truck, label: 'Soy Transportista', role: 'transportista' as const },
            { icon: Store, label: 'Soy Cliente / Receptor', role: 'cliente' as const }
          ].map(r => {
            const Icon = r.icon;
            return (
              <button
                key={r.label}
                onClick={() => onRegister(r.role)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 text-xs font-bold text-slate-200 transition"
              >
                <Icon className="w-4 h-4 text-blue-400" />
                {r.label}
              </button>
            );
          })}
        </div>
      </main>

      {/* Pie: audiencia segmentada */}
      <footer className="relative z-10 border-t border-white/5 bg-black/20">
        <div className="max-w-6xl mx-auto px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-center">
            <span className="text-slate-500 font-semibold">Acceso segmentado para la industria venezolana:</span>
            {AUDIENCES.map(a => (
              <span key={a.label} className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${a.dot}`}></span>
                {a.label}
              </span>
            ))}
          </div>
          <span className="text-slate-600">© 2026 GALPEX Venezuela S.A.</span>
        </div>
      </footer>
    </div>
  );
};
