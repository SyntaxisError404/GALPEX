import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';
import {
  Layers,
  Mail,
  Lock,
  User,
  Building2,
  Package,
  Truck,
  ShieldCheck,
  AlertCircle,
  LogIn,
  UserPlus,
  ArrowLeft
} from 'lucide-react';

const ROLE_OPTIONS: { id: UserRole; label: string; desc: string; icon: typeof Package; color: string }[] = [
  { id: 'proveedor', label: 'Proveedor', desc: 'Reservo espacio y despacho mi mercancía', icon: Package, color: 'blue' },
  { id: 'dueno_galpon', label: 'Dueño de Galpón', desc: 'Monetizo el espacio ocioso de mi galpón', icon: Building2, color: 'emerald' },
  { id: 'transportista', label: 'Transportista', desc: 'Realizo fletes verificados y cobro seguro', icon: Truck, color: 'amber' }
];

const DEMO_ACCOUNTS = [
  { email: 'proveedor@nexocarga.com', label: 'Proveedor' },
  { email: 'galpon@nexocarga.com', label: 'Dueño de Galpón' },
  { email: 'transportista@nexocarga.com', label: 'Transportista' }
];

interface AuthScreenProps {
  initialMode?: 'login' | 'register';
  onBack?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ initialMode = 'login', onBack }) => {
  const { login, register, usesSupabase } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  // Campos
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState<UserRole>('proveedor');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await login(email, password);
    setBusy(false);
    if (!res.ok) setError(res.error || 'No se pudo iniciar sesión.');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    setInfo('');
    const res = await register({ name, company, email, password, role });
    setBusy(false);
    if (!res.ok) setError(res.error || 'No se pudo crear la cuenta.');
    else if (res.info) { setInfo(res.info); setMode('login'); }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
    setError('');
  };

  const switchMode = (m: 'login' | 'register') => {
    setMode(m);
    setError('');
    setInfo('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1128] via-slate-900 to-slate-950 p-4">
      <div className="w-full max-w-md">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </button>
        )}

        {/* Marca */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white tracking-tight">KARGON</div>
            <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Logística B2B · Venezuela</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-200">
            <button
              onClick={() => switchMode('login')}
              className={`py-3 text-sm font-bold flex items-center justify-center gap-1.5 transition ${
                mode === 'login' ? 'bg-white text-blue-700 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-4 h-4" /> Iniciar sesión
            </button>
            <button
              onClick={() => switchMode('register')}
              className={`py-3 text-sm font-bold flex items-center justify-center gap-1.5 transition ${
                mode === 'register' ? 'bg-white text-blue-700 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Crear cuenta
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {info && (
              <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{info}</span>
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-3.5">
                <Field icon={Mail} label="Correo" type="email" value={email} onChange={setEmail} placeholder="tucorreo@empresa.com" />
                <Field icon={Lock} label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition"
                >
                  <LogIn className="w-4 h-4" /> {busy ? 'Entrando...' : 'Entrar'}
                </button>

                {/* Accesos rápidos de prueba (solo en modo local sin Supabase) */}
                {!usesSupabase && (
                  <div className="pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Cuentas de prueba (clic para rellenar)
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {DEMO_ACCOUNTS.map(acc => (
                        <button
                          key={acc.email}
                          type="button"
                          onClick={() => fillDemo(acc.email)}
                          className="px-1.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[10px] font-bold text-slate-600 hover:text-blue-700 transition"
                        >
                          {acc.label}
                        </button>
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1.5 text-center">Contraseña demo: <strong>demo123</strong></div>
                  </div>
                )}
                {usesSupabase && (
                  <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
                    ¿Primera vez? Crea tu cuenta en la pestaña <strong>Crear cuenta</strong>.
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3.5">
                <Field icon={User} label="Nombre completo" value={name} onChange={setName} placeholder="ej. Ana Pérez" />
                <Field icon={Building2} label="Empresa (opcional)" value={company} onChange={setCompany} placeholder="ej. Distribuidora XYZ C.A." />
                <Field icon={Mail} label="Correo" type="email" value={email} onChange={setEmail} placeholder="tucorreo@empresa.com" />
                <Field icon={Lock} label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="Mínimo 6 caracteres" />

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">¿Qué rol usarás?</label>
                  <div className="space-y-2">
                    {ROLE_OPTIONS.map(opt => {
                      const Icon = opt.icon;
                      const active = role === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setRole(opt.id)}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition ${
                            active
                              ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500/30'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                            <div className="text-[11px] text-slate-500">{opt.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition"
                >
                  <UserPlus className="w-4 h-4" /> {busy ? 'Creando...' : 'Crear cuenta y entrar'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {usesSupabase
              ? 'Tus credenciales se protegen con cifrado en Supabase.'
              : 'Demo: tus datos se guardan solo en este navegador.'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Campo de formulario reutilizable con ícono
const Field: React.FC<{
  icon: typeof Mail;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}> = ({ icon: Icon, label, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label className="text-xs font-bold text-slate-700 block mb-1">{label}</label>
    <div className="relative">
      <Icon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);
