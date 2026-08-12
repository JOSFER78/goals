import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { db, collection, onSnapshot } from '../config/firebase';
import { Zap, Flame, ArrowLeft, Shield, LogIn, UserPlus } from 'lucide-react';
import { ExperienceId } from '../types';

interface HeaderProps {
  activeExperience: ExperienceId | null;
  onNavigateHome: () => void;
  onOpenProfile: () => void;
  onOpenAdmin?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeExperience,
  onNavigateHome,
  onOpenProfile,
  onOpenAdmin,
  onOpenAuth
}) => {
  const { user, isCloud } = useAuth();
  const { userData } = useProgress();
  const [pendingCount, setPendingCount] = useState<number>(0);

  const isAdmin = user?.email === 'josferestudio@gmail.com';
  const isAuthenticated = isCloud && user && !user.isAnonymous;

  useEffect(() => {
    if (!isAdmin || !db) return;
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      let count = 0;
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.email !== 'josferestudio@gmail.com' && data.isApproved !== true) {
          count++;
        }
      });
      setPendingCount(count);
    });
    return () => unsub();
  }, [isAdmin]);

  const initial = user?.displayName ? user.displayName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'E');

  const EXPERIENCE_TITLES: Record<ExperienceId, { name: string; tag: string }> = {
    astro: { name: 'Astro', tag: 'Astrofísica 3D' },
    languages: { name: 'Idiomas', tag: 'AstroLingo' },
    school: { name: 'Escolar', tag: 'Tutor IA' },
    verify: { name: 'Verifica', tag: 'Investigación' },
    galaxy: { name: 'Galaxy', tag: 'Exploración' }
  };

  return (
    <header className="p-2 px-3 sm:px-5 flex justify-between items-center border-b border-slate-800 bg-slate-950/95 backdrop-blur-md z-30 sticky top-0 shadow-md">
      
      {/* Sección Izquierda: Logotipo o Migas de Pan */}
      <div className="flex items-center gap-2">
        {activeExperience ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95"
              title="Volver al Dashboard de GOALS"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Volver a GOALS</span>
              <span className="sm:hidden">GOALS</span>
            </button>
            <span className="text-slate-600 text-xs font-bold">/</span>
            <div className="flex items-center gap-1">
              <span className="font-display font-bold text-xs sm:text-sm tracking-tight text-white">
                {EXPERIENCE_TITLES[activeExperience]?.name || 'Astro'}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-semibold">
                GOALS
              </span>
            </div>
          </div>
        ) : (
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={onNavigateHome}
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-display font-black text-indigo-400 text-xs shadow-sm group-hover:scale-105 transition-transform">
              G
            </div>
            <div>
              <h1 className="font-display font-bold text-sm tracking-tight text-white leading-none">
                GOALS
              </h1>
              <p className="text-[9px] text-slate-400 font-medium">Plataforma Educativa</p>
            </div>
          </div>
        )}
      </div>

      {/* Sección Derecha: Métricas, Perfil o Autenticación (Limpio y Espacioso) */}
      <div className="flex items-center gap-2">
        
        {isAdmin && onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-amber-500/40 text-amber-300 hover:bg-slate-800 transition-all flex items-center gap-1.5 relative shadow-sm"
            title="Panel de Administración"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Admin</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white font-black text-[10px] rounded-full animate-bounce shadow-sm">
                {pendingCount}
              </span>
            )}
          </button>
        )}

        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{userData.xp}</span>
            </div>
            
            <div className="flex items-center gap-1 text-rose-400 font-bold text-xs bg-rose-400/10 px-2 py-1 rounded-lg border border-rose-400/20">
              <Flame className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>{userData.streak}</span>
            </div>

            <button
              onClick={onOpenProfile}
              className="w-7 h-7 rounded-lg border border-emerald-500/40 bg-slate-900 text-emerald-300 flex items-center justify-center font-bold text-xs transition-all transform hover:scale-105 active:scale-95 shadow-md overflow-hidden"
              title="Ver Perfil"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{initial}</span>
              )}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenAuth?.('login')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1 active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar Sesión</span>
            </button>
            <button
              onClick={() => onOpenAuth?.('signup')}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Registrarse</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
