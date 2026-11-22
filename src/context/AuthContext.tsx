import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AppUser, UserRole } from '../types';

const USERS_KEY = 'nexo_users';
const SESSION_KEY = 'nexo_session_user_id';

// Cuentas de demostración precargadas (coinciden con los perfiles de la app).
// Permiten iniciar sesión de inmediato sin tener que registrarse.
const DEMO_USERS: AppUser[] = [
  {
    id: 'usr-demo-proveedor',
    name: 'Sofía Rojas',
    company: 'TecnoParts C.A.',
    email: 'proveedor@nexocarga.com',
    password: 'demo123',
    role: 'proveedor'
  },
  {
    id: 'usr-demo-galpon',
    name: 'Manuel Mendoza',
    company: 'Logística Castillito C.A.',
    email: 'galpon@nexocarga.com',
    password: 'demo123',
    role: 'dueno_galpon'
  },
  {
    id: 'usr-demo-transportista',
    name: 'Pedro Alvarado',
    company: 'Trans-Carabobo Express',
    email: 'transportista@nexocarga.com',
    password: 'demo123',
    role: 'transportista'
  }
];

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
}

interface AuthContextType {
  currentUser: AppUser | null;
  login: (email: string, password: string) => AuthResult;
  register: (data: RegisterData) => AuthResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppUser[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return DEMO_USERS;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<AppUser[]>(() => loadUsers());
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const id = localStorage.getItem(SESSION_KEY);
      if (!id) return null;
      return loadUsers().find(u => u.id === id) || null;
    } catch {
      return null;
    }
  });

  // Asegura que las cuentas demo existan siempre y persiste la lista de usuarios.
  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  const login = (email: string, password: string): AuthResult => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) return { ok: false, error: 'No existe una cuenta con ese correo.' };
    if (user.password !== password) return { ok: false, error: 'Contraseña incorrecta.' };
    setCurrentUser(user);
    try { localStorage.setItem(SESSION_KEY, user.id); } catch { /* ignore */ }
    return { ok: true };
  };

  const register = (data: RegisterData): AuthResult => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!data.name.trim()) return { ok: false, error: 'Ingresa tu nombre.' };
    if (!cleanEmail) return { ok: false, error: 'Ingresa un correo.' };
    if (data.password.length < 6) return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
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

  const logout = () => {
    setCurrentUser(null);
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
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
