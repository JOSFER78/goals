import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './core/context/AuthContext';
import { ProgressProvider, useProgress } from './core/context/ProgressContext';
import { Header } from './core/components/Header';
import { Footer } from './core/components/Footer';
import { ProfileModal } from './core/components/ProfileModal';
import { AdminDashboard } from './core/views/AdminDashboard';
import { Toast } from './core/components/Toast';
import { GoalsLanding } from './core/views/GoalsLanding';
import { AuthView } from './core/views/AuthView';
import { GoalsHome } from './core/views/GoalsHome';
import { ExperienceId } from './core/types';

// Mini Apps Integradas
import { SchoolView } from './experiences/school/SchoolView';
import { LanguagesView } from './experiences/languages/LanguagesView';
import { VerifyView } from './experiences/verify/VerifyView';
import { AstroExperience } from './experiences/astro/AstroExperience';
import { PendingApprovalView } from './core/views/PendingApprovalView';
import { CookieBanner } from './core/components/CookieBanner';

const StarField: React.FC = () => {
  useEffect(() => {
    const container = document.getElementById('star-container');
    if (!container || container.childElementCount > 0) return;
    for (let i = 0; i < 70; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 100 + '%';
      const w = Math.random() * 2.2 + 'px';
      s.style.width = w;
      s.style.height = w;
      s.style.animationDelay = Math.random() * 3 + 's';
      container.appendChild(s);
    }
  }, []);

  return <div id="star-container" className="fixed inset-0 z-0 pointer-events-none" />;
};

const MainContent: React.FC = () => {
  const { user, isCloud, isAdmin } = useAuth();
  const { userData } = useProgress();

  // Modo de Vista Global
  const [authViewMode, setAuthViewMode] = useState<'login' | 'signup'>('login');
  const [isAuthViewOpen, setIsAuthViewOpen] = useState<boolean>(false);
  const [activeExperience, setActiveExperience] = useState<ExperienceId | null>(null);

  // Modales
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [isPendingDismissed, setIsPendingDismissed] = useState<boolean>(false);

  // Configuración de Gráficos de Astro 3D
  const [graphicsConfig, setGraphicsConfig] = useState({
    sunIntensity: 2.2,
    ambientIntensity: 0.7,
    rotationSpeed: 1.0,
    atmosphereGlow: true,
    highResTextures: true,
    shadowsEnabled: true,
    xpMultiplier: 1
  });

  const isAuthenticated = isCloud && user && !user.isAnonymous;
  const isApproved = isAdmin || userData?.isApproved === true || user?.isApproved === true;

  const handleUpdateGraphicsConfig = (newCfg: Partial<typeof graphicsConfig>) => {
    setGraphicsConfig((prev) => ({ ...prev, ...newCfg }));
  };

  const handleNavigateHome = () => {
    setActiveExperience(null);
  };

  return (
    <div className={`relative z-10 flex flex-col h-screen w-full mx-auto overflow-hidden ${
      activeExperience === 'astro' 
        ? 'max-w-none w-full h-full bg-transparent shadow-none border-none p-0' 
        : 'max-w-4xl bg-slate-950/90 backdrop-blur-xl shadow-2xl border-x border-slate-800/80'
    }`}>
      
      {/* Sticky Header Estandarizado de GOALS */}
      {activeExperience !== 'astro' && (
        <Header
          activeExperience={activeExperience}
          onNavigateHome={handleNavigateHome}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenAdmin={() => setIsAdminDashboardOpen(true)}
          onOpenAuth={(mode) => {
            setAuthViewMode(mode);
            setIsAuthViewOpen(true);
          }}
        />
      )}

      {/* Área Principal de Contenido */}
      <main className={activeExperience === 'astro' ? 'flex-1 relative p-0 overflow-hidden h-full w-full flex flex-col' : 'flex-1 overflow-y-auto relative flex flex-col justify-between'}>
        <div className={activeExperience === 'astro' ? 'flex-1 w-full h-full relative p-0' : 'p-3 flex-1'}>
          {isAuthViewOpen ? (
            /* Pantalla Estándar de Autenticación de Firebase */
            <AuthView
              initialMode={authViewMode}
              onBackToLanding={() => setIsAuthViewOpen(false)}
              onSuccess={() => setIsAuthViewOpen(false)}
            />
          ) : isAuthenticated && !isApproved && !isPendingDismissed ? (
            /* Pantalla de Espera de Autorización (con botón 'X' para cerrar y continuar) */
            <PendingApprovalView onClose={() => setIsPendingDismissed(true)} />
          ) : !isAuthenticated && !activeExperience ? (
            /* Landing Page Pública Scrollable con Escuela #1 y Flechas */
            <GoalsLanding
              onOpenAuth={(mode) => {
                setAuthViewMode(mode);
                setIsAuthViewOpen(true);
              }}
              onSelectExperience={(expId) => {
                setActiveExperience(expId);
              }}
            />
          ) : !activeExperience ? (
            /* Dashboard Principal para Usuario Registrado */
            <GoalsHome
              onSelectExperience={(expId) => {
                setActiveExperience(expId);
              }}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          ) : activeExperience === 'school' ? (
            /* Mini App Escuela Integradora */
            <SchoolView />
          ) : activeExperience === 'languages' ? (
            /* Mini App Idiomas Integradora */
            <LanguagesView />
          ) : activeExperience === 'verify' ? (
            /* Mini App Verifica Integradora */
            <VerifyView />
          ) : activeExperience === 'astro' ? (
            /* Mini App AstroLingo 100% IDÉNTICA A LA APP ORIGINAL */
            <AstroExperience
              onBackToGoals={handleNavigateHome}
              onOpenProfile={() => setIsProfileOpen(true)}
            />
          ) : null}
        </div>

        {/* Footer elegante para navegación estándar */}
        {activeExperience !== 'astro' && (
          <Footer onSelectExperience={(expId) => setActiveExperience(expId)} />
        )}
      </main>

      {/* Modal de Perfil del Estudiante */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Dashboard Completo de Super Administración */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        graphicsConfig={graphicsConfig}
        onUpdateGraphicsConfig={handleUpdateGraphicsConfig}
      />

      {/* Componente Global Toast */}
      <Toast />

      {/* Banner Global de Consentimiento de Cookies */}
      <CookieBanner />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProgressProvider>
        <div className="h-screen w-screen relative bg-[#030509] overflow-hidden">
          <StarField />
          <MainContent />
        </div>
      </ProgressProvider>
    </AuthProvider>
  );
};

export default App;
