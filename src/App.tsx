import React, { useState } from 'react';
import { NexoProvider, useNexo } from './context/NexoContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import type { UserRole } from './types';
import { AuthScreen } from './components/auth/AuthScreen';
import { LandingScreen } from './components/landing/LandingScreen';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { WelcomeGuide } from './components/layout/WelcomeGuide';
import { WarehouseCatalog } from './components/provider/WarehouseCatalog';
import { OwnerDashboard } from './components/warehouseOwner/OwnerDashboard';
import { DispatchView } from './components/dispatch/DispatchView';
import { EscrowVaultView } from './components/escrow/EscrowVaultView';
import { CarrierDashboard } from './components/carrier/CarrierDashboard';
import { ClientTrackingView } from './components/client/ClientTrackingView';
import { BcvRateModal } from './components/modals/BcvRateModal';
import { ReceptionReceiptModal } from './components/provider/ReceptionReceiptModal';
import { ProviderOnboardingModal } from './components/provider/ProviderOnboardingModal';

const MainAppContent: React.FC = () => {
  const { 
    role, 
    activeTab, 
    activeReceptionReceipt, 
    setActiveReceptionReceipt,
    showOnboardingModal,
    setShowOnboardingModal,
    cargoProfile,
    saveCargoProfile
  } = useNexo();
  const [showBcvModal, setShowBcvModal] = useState(false);

  const renderCurrentView = () => {
    // Si el usuario es el cliente/receptor final, mostrar su portal de seguimiento satelital y recepción
    if (role === 'cliente') {
      return <ClientTrackingView />;
    }

    // If user is in transportista role and exploring, show Carrier dashboard
    if (role === 'transportista' && activeTab === 'explorar') {
      return <CarrierDashboard />;
    }

    switch (activeTab) {
      case 'explorar':
        return <WarehouseCatalog />;
      case 'inventario':
        return <OwnerDashboard />;
      case 'despachos':
        return <DispatchView />;
      case 'escrow':
        return <EscrowVaultView />;
      default:
        return <WarehouseCatalog />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans">
      {/* Top Navbar */}
      <Navbar onOpenBcvModal={() => setShowBcvModal(true)} />

      {/* Main Layout: Sidebar + View */}
      <div className="flex-1 flex flex-col md:flex-row min-w-0">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <WelcomeGuide />
          {renderCurrentView()}
        </main>
      </div>

      {/* BCV Rate Adjustment Modal */}
      <BcvRateModal isOpen={showBcvModal} onClose={() => setShowBcvModal(false)} />

      {/* Cuestionario Obligatorio de Clasificación de Carga para Proveedores */}
      <ProviderOnboardingModal
        isOpen={showOnboardingModal && role === 'proveedor'}
        initialProfile={cargoProfile}
        onComplete={(profile) => saveCargoProfile(profile)}
        onClose={cargoProfile ? () => setShowOnboardingModal(false) : undefined}
      />

      {/* Reception Receipt Modal if active */}
      {activeReceptionReceipt && (
        <ReceptionReceiptModal
          lot={activeReceptionReceipt}
          onClose={() => setActiveReceptionReceipt(null)}
        />
      )}
    </div>
  );
};

// Decide qué mostrar: landing pública → login/registro → app con el rol del usuario.
const AuthedApp: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const [view, setView] = useState<'landing' | 'auth'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('proveedor');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1128] text-slate-300">
        <div className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-blue-400 animate-spin"></span>
          <span>Cargando KARGON...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    if (view === 'auth') {
      return (
        <AuthScreen
          initialMode={authMode}
          initialRole={selectedRole}
          onBack={() => setView('landing')}
        />
      );
    }
    return (
      <LandingScreen
        onLogin={() => { setAuthMode('login'); setView('auth'); }}
        onRegister={(roleToSet?: UserRole) => {
          setAuthMode('register');
          if (roleToSet) setSelectedRole(roleToSet);
          setView('auth');
        }}
      />
    );
  }

  return (
    // key por usuario: al cambiar de sesión, el estado de la app se reinicia limpio
    <NexoProvider key={currentUser.id} initialRole={currentUser.role}>
      <MainAppContent />
    </NexoProvider>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AuthedApp />
    </AuthProvider>
  );
}

export default App;
