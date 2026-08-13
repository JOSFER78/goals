import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { db, collection, onSnapshot } from '../config/firebase';
import { Zap, Flame, Star, ArrowLeft, Shield, LogIn, User, Bot, Sparkles } from 'lucide-react';
import { ExperienceId } from '../types';
import { GOALS_EXPERIENCES } from '../config/experiencesConfig';

interface HeaderProps {
  activeExperience: ExperienceId | null;
  onNavigateHome: () => void;
  onOpenProfile: () => void;
  onOpenAdmin?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  isMascotMinimized?: boolean;
  onToggleMascot?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeExperience,
  onNavigateHome,
  onOpenProfile,
  onOpenAdmin,
  onOpenAuth,
  isMascotMinimized = false,
  onToggleMascot
}) => {
  const { user } = useAuth();
  const { userData, totalStars } = useProgress();
  const [pendingCount, setPendingCount] = useState<number>(0);

  const isAdmin = user?.email === 'josferestudio@gmail.com';
  const isAuthenticated = !!(user && !user.isAnonymous);

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
  const activeExpConfig = activeExperience ? GOALS_EXPERIENCES[activeExperience] : null;

  return (
    <header className="px-3 sm:px-6 py-2.5 flex justify-between items-center border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl z-50 sticky top-0 shadow-sm select-none transition-all">
      
      {/* Sección Izquierda: Logotipo GOALS + Migas de Navegación */}
      <div className="flex items-center gap-2.5">
        <button 
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0 text-left bg-transparent border-0 p-0 focus:outline-none transition-transform active:scale-95"
          title="Ir al Inicio de GOALS"
        >
          <img 
            src="/goals_platform_logo.png" 
            alt="GOALS Logo" 
            className="w-8 h-8 rounded-xl border border-slate-700/60 shadow-sm object-cover group-hover:border-indigo-500/50 transition-all shrink-0" 
          />
          {!activeExpConfig && (
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm tracking-tight text-white leading-none">
                GOALS
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight">Plataforma Educativa IA</span>
            </div>
          )}
        </button>

        {activeExpConfig && (
          <div className="flex items-center gap-1.5 ml-1 animate-fadeIn">
            <span className="text-slate-600 text-xs font-semibold">/</span>
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
              title="Volver a GOALS"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline text-[11px]">Inicio</span>
            </button>
            <span className="text-slate-600 text-xs font-semibold">/</span>
            <div className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 shadow-sm ${activeExpConfig.badgeClass}`}>
              <activeExpConfig.icon className="w-3.5 h-3.5" />
              <span>{activeExpConfig.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sección Derecha: Mascota IA, Admin, Gamificación y Perfil */}
      <div className="flex items-center gap-2">
        
        {/* Toggle Mascota IA */}
        {onToggleMascot && (
          <button
            type="button"
            onClick={onToggleMascot}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
              isMascotMinimized
                ? 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                : 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/40'
            }`}
            title={isMascotMinimized ? "Activar Mascota IA" : "Minimizar Mascota IA"}
          >
            <Bot className={`w-3.5 h-3.5 ${isMascotMinimized ? 'text-slate-500' : 'text-indigo-400'} shrink-0`} />
            <span className="hidden sm:inline">{isMascotMinimized ? 'Pet Inactivo' : 'Pet IA'}</span>
          </button>
        )}

        {/* Botón Admin */}
        {isAdmin && onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900/90 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all flex items-center gap-1.5 relative shadow-sm cursor-pointer active:scale-95"
            title="Panel de Administración"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Admin</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-500 text-white font-bold text-[10px] rounded-full shadow-sm animate-pulse">
                {pendingCount}
              </span>
            )}
          </button>
        )}

        {/* Métricas de Usuario Autenticado */}
        {isAuthenticated ? (
          <>
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 text-amber-400 font-bold text-xs bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/20 transition-all active:scale-95 cursor-pointer"
              title="Tus Puntos de Experiencia (XP) - Ver Perfil"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{userData?.xp || 0}</span>
            </button>
            
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 text-rose-400 font-bold text-xs bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-500/20 transition-all active:scale-95 cursor-pointer"
              title="Tu Racha Diaria - Ver Perfil"
            >
              <Flame className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>{userData?.streak || 1}</span>
            </button>

            <button
              type="button"
              onClick={onOpenProfile}
              className="hidden sm:flex items-center gap-1.5 text-amber-300 font-bold text-xs bg-amber-400/10 hover:bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/20 transition-all active:scale-95 cursor-pointer"
              title="Tus Estrellas Conseguidas - Ver Perfil"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{totalStars()}</span>
            </button>

            {/* Avatar de Perfil */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-xl border border-slate-700/80 bg-slate-900 hover:border-indigo-500/50 text-indigo-300 flex items-center justify-center font-bold text-xs transition-all active:scale-95 shadow-sm overflow-hidden cursor-pointer shrink-0"
              title="Ver Perfil de Usuario"
            >
              {user?.photoURL && (user.photoURL.startsWith('http') || user.photoURL.startsWith('/') || user.photoURL.startsWith('data:')) ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-indigo-200">{initial}</span>
              )}
            </button>
          </>
        ) : (
          /* Botón de Acceso / Registro */
          <button
            type="button"
            onClick={() => onOpenAuth?.('login')}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
            title="Acceso o Registro de Usuario"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Acceso / Registro</span>
          </button>
        )}

      </div>
    </header>
  );
};


