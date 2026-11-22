import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppUser, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const USERS_KEY = 'nexo_users';
const SESSION_KEY = 'nexo_session_user_id';

// Cuentas de demostración (solo para el modo local sin Supabase).
const DEMO_USERS: AppUser[] = [
  { id: 'usr-demo-proveedor', name: 'Sofía Rojas', company: 'TecnoParts C.A.', email: 'proveedor@nexocarga.com', password: 'demo123', role: 'proveedor' },
  { id: 'usr-demo-galpon', name: 'Manuel Mendoza', company: 'Logística Castillito C.A.', email: 'galpon@nexocarga.com', password: 'demo123', role: 'dueno_galpon' },
  { id: 'usr-demo-transportista', name: 'Pedro Alvarado', company: 'Trans-Carabobo Express', email: 'transportista@nexocarga.com', password: 'demo123', role: 'transportista' }
];

interface Perfil {
  nombre_completo?: string;
  empresa?: string;
  rol?: UserRole;
}

interface RegisterData {
  name: string;
  company: string;
  email: string;
  password: string;
  role: UserRole;
}

interface AuthResult {
  ok: boolean;
  error?: string;
  info?: string;
}

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  usesSupabase: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Traduce los mensajes de error de Supabase al español.
function translateError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login')) return 'Correo o contraseña incorrectos.';
  if (m.includes('already registered') || m.includes('already been registered')) return 'Ya existe una cuenta con ese correo.';
  if (m.includes('email not confirmed')) return 'Debes confirmar tu correo antes de entrar.';
  if (m.includes('password should be at least')) return 'La contraseña debe tener al menos 6 caracteres.';
  return msg;
}

// ---------- Modo local (localStorage) para cuando Supabase no está configurado ----------
function loadUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppUser[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return DEMO_USERS;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<AppUser[]>(() => loadUsers());

  // Trae el perfil (nombre, empresa, rol) de un usuario de Supabase Auth.
  const setUserFromSupabase = async (sbUser: { id: string; email?: string }) => {
    let profile: Perfil | null = null;
    try {
      const { data } = await supabase!.from('perfiles').select('*').eq('id', sbUser.id).single();
      profile = (data as unknown as Perfil | null) ?? null;
    } catch { /* la tabla puede no existir aún */ }

    setCurrentUser({
      id: sbUser.id,
      name: profile?.nombre_completo || (sbUser.email ?? 'Usuario'),
      company: profile?.empresa || '',
      email: sbUser.email ?? '',
      password: '',
      role: profile?.rol || 'proveedor'
    });
  };

  useEffect(() => {
    // Modo Supabase: restaura la sesión y escucha cambios de autenticación.
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      client.auth.getSession().then(async ({ data }) => {
        if (data.session?.user) await setUserFromSupabase(data.session.user);
        setLoading(false);
      });
      const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUserFromSupabase(session.user);
        } else {
          setCurrentUser(null);
        }
      });
      return () => sub.subscription.unsubscribe();
    }

    // Modo local: restaura la sesión guardada en el navegador.
    try {
      const id = localStorage.getItem(SESSION_KEY);
      if (id) setCurrentUser(loadUsers().find(u => u.id === id) || null);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  // Persiste los usuarios locales (solo modo local).
  useEffect(() => {
    if (isSupabaseConfigured) return;
    try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch { /* ignore */ }
  }, [users]);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
      if (error) return { ok: false, error: translateError(error.message) };
      return { ok: true };
    }

    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) return { ok: false, error: 'No existe una cuenta con ese correo.' };
    if (user.password !== password) return { ok: false, error: 'Contraseña incorrecta.' };
    setCurrentUser(user);
    try { localStorage.setItem(SESSION_KEY, user.id); } catch { /* ignore */ }
    return { ok: true };
  };

  const register = async (data: RegisterData): Promise<AuthResult> => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!data.name.trim()) return { ok: false, error: 'Ingresa tu nombre.' };
    if (!cleanEmail) return { ok: false, error: 'Ingresa un correo.' };
    if (data.password.length < 6) return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };

    if (isSupabaseConfigured && supabase) {
      const { data: signUp, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: data.password,
        options: {
          data: {
            nombre_completo: data.name.trim(),
            empresa: data.company.trim() || 'Independiente',
            rol: data.role
          }
        }
      });
      if (error) return { ok: false, error: translateError(error.message) };
      // Si la confirmación por correo está activa, no hay sesión todavía.
      if (!signUp.session) {
        return { ok: true, info: 'Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.' };
      }
      return { ok: true };
    }

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
    }
    const newUser: AppUser = {
      id: `usr-${Date.now()}`,
      name: data.name.trim(),
      company: data.company.trim() || 'Independiente',
      email: cleanEmail,
      password: data.password,
      role: data.role
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    try { localStorage.setItem(SESSION_KEY, newUser.id); } catch { /* ignore */ }
    return { ok: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
      setCurrentUser(null);
      return;
    }
    setCurrentUser(null);
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, usesSupabase: isSupabaseConfigured, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
