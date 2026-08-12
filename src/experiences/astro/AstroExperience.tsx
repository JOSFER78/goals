import React, { useEffect } from 'react';
import { Lock } from 'lucide-react';
import { useProgress } from '../../core/context/ProgressContext';
import { useAuth } from '../../core/context/AuthContext';

interface AstroExperienceProps {
  onBackToGoals: () => void;
  onOpenProfile: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const AstroExperience: React.FC<AstroExperienceProps> = ({
  onBackToGoals,
  onOpenProfile,
  onOpenAuth
}) => {
  const { finishTest, claimReto, completeStep } = useProgress();
  const { user, isCloud } = useAuth();
  const isAuthenticated = isCloud && user && !user.isAnonymous;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'back-to-goals') {
        onBackToGoals();
      } else if (event.data === 'open-profile') {
        onOpenProfile();
      } else if (event.data === 'AUTH_REQUIRED') {
        onOpenAuth?.('signup');
      } else if (event.data && typeof event.data === 'object') {
        const { type, lessonId, score, total, retoId, xp } = event.data;
        if (!isAuthenticated && (type === 'TEST_COMPLETED' || type === 'STEP_COMPLETED' || type === 'START_TEST')) {
          onOpenAuth?.('signup');
          return;
        }
        if (type === 'TEST_COMPLETED') {
          finishTest(lessonId, score, total);
        } else if (type === 'CLAIM_RETO') {
          claimReto(retoId, xp);
        } else if (type === 'CELESTIAL_RETO_COMPLETED') {
          claimReto(retoId || 'reto_celestial', xp || 100);
        } else if (type === 'STEP_COMPLETED') {
          completeStep(lessonId);
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onBackToGoals, onOpenProfile, onOpenAuth, isAuthenticated, finishTest, claimReto, completeStep]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-transparent">
      {/* Banner de Modo Exploración Libre 3D si no ha iniciado sesión */}
      {!isAuthenticated && (
        <div className="p-2.5 px-4 bg-indigo-950/90 border-b border-indigo-500/40 flex flex-wrap items-center justify-between gap-3 text-indigo-200 text-xs shrink-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Navegación 3D Libre: Explora los astros. Inicia sesión o regístrate para realizar lecciones y tests.</span>
          </div>
          <button
            onClick={() => onOpenAuth?.('signup')}
            className="px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black shrink-0 transition-all text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-95"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Desbloquear Lecciones</span>
          </button>
        </div>
      )}

      {/* Visor 100% Idéntico a astrolingo.web.app usando el HTML original */}
      <iframe
        src="/astrolingo-app.html"
        title="AstroLingo 3D"
        className="w-full h-full flex-1 border-0 bg-transparent"
      />
    </div>
  );
};

