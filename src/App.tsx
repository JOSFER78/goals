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
import { ExperienceId, AppViewMode } from './core/types';
import { GOALS_EXPERIENCES } from './core/config/experiencesConfig';

// Mini Apps Integradas
import { SchoolView } from './experiences/school/SchoolView';
import { LanguagesView } from './experiences/languages/LanguagesView';
import { VerifyView } from './experiences/verify/VerifyView';
import { AstroExperience } from './experiences/astro/AstroExperience';
import { AILabExperience } from './experiences/ai-lab/AILabExperience';
import { PendingApprovalView } from './core/views/PendingApprovalView';
import { CookieBanner } from './core/components/CookieBanner';
import { ApkDownloadGuideModal } from './core/components/ApkDownloadGuideModal';
import { FloatingAIContextWidget } from './core/components/FloatingAIContextWidget';
import { InitialOnboardingGate } from './core/components/onboarding/InitialOnboardingGate';
import { PendingApprovalGate } from './core/components/auth/PendingApprovalGate';
import { MiniAppPortalGate } from './core/components/miniapps/MiniAppPortalGate';
import { MiniAppsDrawer } from './core/components/navigation/MiniAppsDrawer';

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
  const [activeExperience, setActiveExperience] = useState<AppViewMode>(null);

  // Modales y Drawers
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [isMiniAppsDrawerOpen, setIsMiniAppsDrawerOpen] = useState<boolean>(false);
  const [isPendingDismissed, setIsPendingDismissed] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'warning' } | null>(null);

  // Configuración de Calidad Gráfica
  const [graphicsConfig, setGraphicsConfig] = useState({
    sunIntensity: 2.2,
    ambientIntensity: 0.7,
    rotationSpeed: 1.0,
    atmosphereGlow: true,
    highResTextures: true,
    shadowsEnabled: true,
    xpMultiplier: 1,
    fpsLimit: 60,
    fxaa: true,
    shadows: true,
    pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1
  });

  // Estado minimizado de la mascota
  const [isMascotMinimized, setIsMascotMinimized] = useState<boolean>(() => {
    try {
      return localStorage.getItem('goals_mascot_minimized') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleMascotMinimize = () => {
    setIsMascotMinimized((prev) => {
      const next = !prev;
      localStorage.setItem('goals_mascot_minimized', String(next));
      return next;
    });
  };

  const isAuthenticated = !!(user && !user.isAnonymous);
  const isApproved = isAdmin || userData?.isApproved === true || user?.isApproved === true;
  const hasCompletedOnboarding = isAdmin || (
    Boolean(userData?.learnerProfile?.onboarding?.globalCompleted) ||
    (Boolean(userData?.learnerProfile?.education?.age) && Number(userData?.learnerProfile?.education?.age) >= 6) ||
    (Boolean(userData?.childProfile?.age) && Number(userData?.childProfile?.age) >= 6)
  );

  const handleUpdateGraphicsConfig = (newCfg: Partial<typeof graphicsConfig>) => {
    setGraphicsConfig((prev) => ({ ...prev, ...newCfg }));
  };

  const handleNavigateHome = () => {
    setActiveExperience(null);
    setIsAuthViewOpen(false);
    setIsProfileOpen(false);
    setIsAdminDashboardOpen(false);
    setIsMiniAppsDrawerOpen(false);
    setIsGuideOpen(false);
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative z-10 flex flex-col h-screen w-full mx-auto overflow-hidden bg-slate-950/95 backdrop-blur-xl">
      
      {/* Halo de luz ambiental reactivo por Mini App */}
      {activeExperience && GOALS_EXPERIENCES[activeExperience] && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700 opacity-60"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${GOALS_EXPERIENCES[activeExperience].ambientGlow} 0%, transparent 70%)`
          }}
        />
      )}

      {/* Sticky Header Estandarizado de GOALS (Unificado para todas las páginas) */}
      <Header
        activeExperience={activeExperience}
        onNavigateHome={handleNavigateHome}
        onOpenProfile={() => setActiveExperience('profile')}
        onOpenAdmin={() => setActiveExperience('admin')}
        onOpenMiniApps={() => setIsMiniAppsDrawerOpen(true)}
        onOpenAuth={(mode) => {
          setAuthViewMode(mode);
          setIsAuthViewOpen(true);
        }}
      />

      {/* Área Principal de Contenido */}
      <main className={(activeExperience === 'astro' || activeExperience === 'admin' || activeExperience === 'profile') ? 'flex-1 relative p-0 overflow-hidden h-full w-full flex flex-col' : isAuthViewOpen ? 'flex-1 overflow-y-auto relative flex flex-col items-center justify-start p-4 scrollbar-thin' : 'flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth relative flex flex-col justify-between'}>
        <div className={(activeExperience === 'astro' || activeExperience === 'admin' || activeExperience === 'profile') ? 'flex-1 w-full h-full relative p-0 flex flex-col' : 'p-0 sm:p-2 flex-1 w-full flex flex-col items-center justify-start h-full'}>
          {isAuthViewOpen ? (
            /* Pantalla Estándar de Autenticación de Firebase */
            <AuthView
              initialMode={authViewMode}
              onBackToLanding={() => setIsAuthViewOpen(false)}
              onSuccess={() => setIsAuthViewOpen(false)}
              onOpenDownloadGuide={() => setIsGuideOpen(true)}
            />
          ) : !isAuthenticated && !activeExperience ? (
            /* Landing Page Pública Scrollable con Bloqueo de Acceso a No Registrados */
            <GoalsLanding
              onOpenAuth={(mode) => {
                setAuthViewMode(mode);
                setIsAuthViewOpen(true);
              }}
              onSelectExperience={() => {
                setAuthViewMode('signup');
                setIsAuthViewOpen(true);
              }}
            />
          ) : !isAuthenticated ? (
            /* Si no está registrado y trata de navegar directamente, mostrar Pantalla de Invitación / Registro */
            <AuthView
              initialMode="signup"
              onBackToLanding={() => {
                setActiveExperience(null);
                setIsAuthViewOpen(false);
              }}
              onSuccess={() => {
                setIsAuthViewOpen(false);
              }}
              onOpenDownloadGuide={() => setIsGuideOpen(true)}
            />
          ) : !isApproved ? (
            /* Compuerta de Autorización: Cuenta pendiente de aprobación por el Administrador */
            <PendingApprovalGate />
          ) : !hasCompletedOnboarding ? (
            /* Onboarding Gate Obligatorio: Presentación de GOALS + Ficha Alumno */
            <InitialOnboardingGate
              onComplete={() => {
                handleNavigateHome();
              }}
            />
          ) : !activeExperience ? (
            /* Dashboard Principal para Usuario Registrado, Aprobado y Calibrado */
            <GoalsHome
              onSelectExperience={(expId) => {
                setActiveExperience(expId);
              }}
              onOpenProfile={() => setActiveExperience('profile')}
              onOpenMiniApps={() => setIsMiniAppsDrawerOpen(true)}
            />
          ) : activeExperience === 'admin' ? (
            /* Vista Integrada de Super Administración y 3D Genesis IA Studio */
            <AdminDashboard
              isOpen={true}
              isEmbedded={true}
              onClose={handleNavigateHome}
              graphicsConfig={graphicsConfig}
              onUpdateGraphicsConfig={handleUpdateGraphicsConfig}
            />
          ) : activeExperience === 'profile' ? (
            /* Vista Integrada del Perfil de Usuario y Gamificación */
            <ProfileModal
              isOpen={true}
              isEmbedded={true}
              onClose={handleNavigateHome}
              onOpenAdminDashboard={() => setActiveExperience('admin')}
            />
          ) : (
            /* Cada MiniApp cuenta con su Mini-Portada Inmersiva y Prueba de Nivel Específica */
            <MiniAppPortalGate
              experienceId={activeExperience}
              onBackToGoals={handleNavigateHome}
            >
              {activeExperience === 'school' ? (
                <SchoolView onOpenAuth={(mode) => { setAuthViewMode(mode); setIsAuthViewOpen(true); }} />
              ) : activeExperience === 'languages' ? (
                <LanguagesView onOpenAuth={(mode) => { setAuthViewMode(mode); setIsAuthViewOpen(true); }} />
              ) : activeExperience === 'verify' ? (
                <VerifyView onOpenAuth={(mode) => { setAuthViewMode(mode); setIsAuthViewOpen(true); }} />
              ) : activeExperience === 'ai-lab' ? (
                <AILabExperience onOpenAuth={(mode) => { setAuthViewMode(mode); setIsAuthViewOpen(true); }} />
              ) : activeExperience === 'astro' ? (
                <AstroExperience
                  onBackToGoals={handleNavigateHome}
                  onOpenProfile={() => setActiveExperience('profile')}
                  onOpenAuth={(mode) => { setAuthViewMode(mode); setIsAuthViewOpen(true); }}
                />
              ) : null}
            </MiniAppPortalGate>
          )}
        </div>

        {/* Footer únicamente en la Landing Page pública sin logearse */}
        {!isAuthenticated && !activeExperience && !isAuthViewOpen && (
          <Footer onSelectExperience={(expId) => setActiveExperience(expId)} />
        )}
      </main>

      {/* Drawer Desplegable de MiniApps */}
      <MiniAppsDrawer
        isOpen={isMiniAppsDrawerOpen}
        onClose={() => setIsMiniAppsDrawerOpen(false)}
        onSelectExperience={(expId) => {
          setActiveExperience(expId);
          setIsMiniAppsDrawerOpen(false);
        }}
        activeExperience={activeExperience}
      />

      {/* Modal Explicativo de Instalación en Android */}
      <ApkDownloadGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Componente Global Toast */}
      <Toast />

      {/* Banner Global de Consentimiento de Cookies */}
      <CookieBanner />

      {/* Copilot IA Contextual Flotante Continuo (Lee la pantalla activa) */}
      <FloatingAIContextWidget
        activeExperience={activeExperience}
        onOpenAuth={(mode) => {
          setAuthViewMode(mode);
          setIsAuthViewOpen(true);
        }}
        isMinimized={isMascotMinimized}
        onToggleMinimize={handleToggleMascotMinimize}
      />

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
