import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { db, collection, onSnapshot } from '../config/firebase';
import { Zap, Flame, Star, ArrowLeft, Shield, LogIn, User, Bot } from 'lucide-react';
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
  const { user, isCloud } = useAuth();
  const { userData, totalStars } = useProgress();
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
  const activeExpConfig = activeExperience ? GOALS_EXPERIENCES[activeExperience] : null;

  return (
    <header className="p-2 px-3 sm:px-5 flex justify-between items-center border-b border-slate-800 bg-slate-950/95 backdrop-blur-md z-50 sticky top-0 shadow-lg select-none">
      
      {/* Sección Izquierda: Logotipo [G] GOALS SIEMPRE VISIBLE + Migas de Pan */}
      <div className="flex items-center gap-2">
        <button 
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-2 cursor-pointer group shrink-0 text-left bg-transparent border-0 p-0 focus:outline-none"
          title="Ir al Inicio de GOALS"
        >
          <img 
            src="/goals_platform_logo.png" 
            alt="GOALS Logo" 
            className="w-8 h-8 rounded-lg border border-slate-700/80 shadow-md object-cover group-hover:scale-105 transition-transform shrink-0" 
          />
          {!activeExpConfig && (
            <div className="flex flex-col">
              <h1 className="font-display font-black text-sm tracking-wide text-white leading-none">
                GOALS
              </h1>
              <p className="text-[9.5px] text-amber-400/90 font-semibold tracking-tight">Tu Plataforma Educativa IA</p>
            </div>
          )}
        </button>

        {activeExpConfig && (
          <div className="flex items-center gap-1.5 ml-1">
            <span className="text-slate-600 text-xs font-bold">/</span>
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer"
              title="Volver a GOALS"
            >
              <ArrowLeft className="w-3 h-3 text-slate-400" />
              <span className="hidden sm:inline text-[11px]">Volver</span>
            </button>
            <span className="text-slate-600 text-xs font-bold">/</span>
            <div className={`px-2 py-0.5 rounded-full border text-[10px] font-extrabold flex items-center gap-1 ${activeExpConfig.badgeClass}`}>
              <activeExpConfig.icon className="w-3 h-3" />
              <span>{activeExpConfig.name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sección Derecha: Botón Pet IA, Admin, Métricas de Gamificación y Perfil */}
      <div className="flex items-center gap-2">
        
        {/* Toggle Mascota IA */}
        {onToggleMascot && (
          <button
            type="button"
            onClick={onToggleMascot}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
              isMascotMinimized
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/50'
            }`}
            title={isMascotMinimized ? "Mostrar Mascota Asomada" : "Ocultar / Minimizar Mascota"}
          >
            <Bot className={`w-3.5 h-3.5 ${isMascotMinimized ? 'text-slate-500' : 'text-indigo-400 animate-pulse'} shrink-0`} />
            <span className="hidden sm:inline">{isMascotMinimized ? 'Pet Inactivo' : 'Pet IA'}</span>
          </button>
        )}

        {/* Botón Admin */}
        {isAdmin && onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5 relative shadow-sm cursor-pointer active:scale-95"
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

        {/* Si el usuario ESTÁ AUTENTICADO: muestra métricas y botón de perfil */}
        {isAuthenticated ? (
          <>
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-400/10 hover:bg-amber-400/20 px-2 py-1 rounded-lg border border-amber-400/20 transition-all active:scale-95 cursor-pointer"
              title="Tus Puntos de Experiencia (XP) - Ver Perfil"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{userData?.xp || 0}</span>
            </button>
            
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1 text-rose-400 font-bold text-xs bg-rose-400/10 hover:bg-rose-400/20 px-2 py-1 rounded-lg border border-rose-400/20 transition-all active:scale-95 cursor-pointer"
              title="Tu Racha Diaria de Conexión - Ver Perfil"
            >
              <Flame className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>{userData?.streak || 1}</span>
            </button>

            <button
              type="button"
              onClick={onOpenProfile}
              className="hidden sm:flex items-center gap-1 text-yellow-400 font-bold text-xs bg-yellow-400/10 hover:bg-yellow-400/20 px-2 py-1 rounded-lg border border-yellow-400/20 transition-all active:scale-95 cursor-pointer"
              title="Tus Estrellas Conseguidas - Ver Perfil"
            >
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span>{totalStars()}</span>
            </button>

            {/* Avatar de Perfil de Usuario Autenticado */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="w-7 h-7 rounded-lg border border-indigo-500/40 bg-slate-900 hover:bg-indigo-950/60 text-indigo-300 flex items-center justify-center font-bold text-xs transition-all transform hover:scale-105 active:scale-95 shadow-md overflow-hidden cursor-pointer shrink-0"
              title="Ver Perfil de Usuario"
            >
              {user?.photoURL && (user.photoURL.startsWith('http') || user.photoURL.startsWith('/') || user.photoURL.startsWith('data:')) ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm">{user?.photoURL || initial || '👽'}</span>
              )}
            </button>
          </>
        ) : (
          /* Si NO ESTÁ AUTENTICADO: ÚNICAMENTE botón de Acceso / Registro (sin icono de perfil ni salir) */
          <button
            type="button"
            onClick={() => onOpenAuth?.('login')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-extrabold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
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

