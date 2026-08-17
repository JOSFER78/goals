import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { db, collection, onSnapshot } from '../config/firebase';
import { Zap, Flame, Star, ArrowLeft, Shield, LogIn, User, Sparkles, LogOut } from 'lucide-react';
import { ExperienceId, AppViewMode } from '../types';
import { GOALS_EXPERIENCES } from '../config/experiencesConfig';

interface HeaderProps {
  activeExperience: AppViewMode;
  onNavigateHome: () => void;
  onOpenProfile: () => void;
  onOpenAdmin?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onOpenMiniApps?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeExperience,
  onNavigateHome,
  onOpenProfile,
  onOpenAdmin,
  onOpenAuth,
  onOpenMiniApps
}) => {
  const { user, logout } = useAuth();
  const { userData, totalStars, adminSimulatedAge, setAdminSimulatedAge, effectiveAge } = useProgress();
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);

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

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigateHome();
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const initial = user?.displayName ? user.displayName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'E');
  const activeExpConfig = activeExperience ? GOALS_EXPERIENCES[activeExperience] : null;

  return (
    <header className="px-2.5 sm:px-6 py-2 flex justify-between items-center border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl z-50 sticky top-0 shadow-sm select-none transition-all w-full max-w-full">
      
      {/* Sección Izquierda: Logotipo GOALS + Botón MiniApps + Migas de Navegación */}
      <div className="flex items-center gap-2 min-w-0">
        <button 
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer group shrink-0 text-left bg-transparent border-0 p-0 focus:outline-none transition-transform active:scale-95"
          title="Ir al Inicio de GOALS"
        >
          <img 
            src="/goals_platform_logo.png" 
            alt="GOALS Logo" 
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-slate-700/60 shadow-sm object-cover group-hover:border-indigo-500/50 transition-all shrink-0" 
          />
          {!activeExpConfig && (
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-sm tracking-tight text-white leading-none">
                GOALS
              </span>
              <span className="hidden md:inline text-[10px] text-slate-400 font-medium tracking-tight">Plataforma Educativa IA</span>
            </div>
          )}
        </button>

        {/* Botón Desplegable Explorador de MiniApps */}
        {onOpenMiniApps && (
          <button
            type="button"
            onClick={onOpenMiniApps}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 text-xs font-bold text-slate-200 hover:text-white transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
            title="Abrir Explorador de MiniApps"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">MiniApps</span>
            <span className="px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">5</span>
          </button>
        )}

        {activeExpConfig && (
          <div className="flex items-center gap-1.5 min-w-0 animate-fadeIn">
            <button
              type="button"
              onClick={onOpenMiniApps || onNavigateHome}
              className={`px-2.5 py-1 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 shadow-sm truncate hover:opacity-90 transition-opacity cursor-pointer ${activeExpConfig.badgeClass}`}
              title="Cambiar de MiniApp"
            >
              <activeExpConfig.icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{activeExpConfig.name}</span>
            </button>
          </div>
        )}
      </div>

      {/* Sección Derecha: Admin, Gamificación, Perfil y Salida */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        
        {/* Conmutador Super Admin de Etapa / Edad */}
        {isAdmin && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-300">
            <span className="hidden sm:inline text-[10px] text-amber-400/90 font-mono">👑 Nivel:</span>
            <select
              value={adminSimulatedAge ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                setAdminSimulatedAge(val ? parseInt(val, 10) : null);
              }}
              className="bg-slate-900 text-amber-300 border border-amber-500/40 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold outline-none cursor-pointer"
              title="Conmutador Super Admin: Simula cómo ve la plataforma cualquier franja de edad"
            >
              <option value="">👤 Real ({effectiveAge}a)</option>
              <option value="7">🎒 6-7a (1º-2º Pri)</option>
              <option value="9">🚀 8-9a (3º-4º Pri)</option>
              <option value="11">🔭 10-11a (5º-6º Pri)</option>
              <option value="13">🧬 12-13a (1º-2º ESO)</option>
              <option value="15">🌌 14-15a (3º-4º ESO)</option>
            </select>
          </div>
        )}

        {/* Botón Admin */}
        {isAdmin && onOpenAdmin && (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="px-2 py-1 rounded-lg text-xs font-semibold bg-slate-900 border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 transition-all flex items-center gap-1 relative shadow-sm cursor-pointer active:scale-95 shrink-0"
            title="Panel de Administración"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Admin</span>
            {pendingCount > 0 && (
              <span className="px-1 py-0.1 bg-rose-500 text-white font-bold text-[9px] rounded-full shadow-sm animate-pulse">
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
              className="hidden sm:flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1 rounded-lg border border-amber-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
              title="Tus Puntos de Experiencia (XP)"
            >
              <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{userData?.xp || 0}</span>
            </button>
            
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1 text-rose-400 font-bold text-xs bg-rose-500/10 hover:bg-rose-500/20 px-2 py-1 rounded-lg border border-rose-500/20 transition-all active:scale-95 cursor-pointer shrink-0"
              title="Tu Racha Diaria"
            >
              <Flame className="w-3 h-3 fill-rose-400 text-rose-400" />
              <span>{userData?.streak || 1}</span>
            </button>

            <button
              type="button"
              onClick={onOpenProfile}
              className="hidden md:flex items-center gap-1 text-amber-300 font-bold text-xs bg-amber-400/10 hover:bg-amber-400/20 px-2 py-1 rounded-lg border border-amber-400/20 transition-all active:scale-95 cursor-pointer shrink-0"
              title="Tus Estrellas Conseguidas"
            >
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{totalStars()}</span>
            </button>

            {/* Avatar de Perfil */}
            <button
              type="button"
              onClick={onOpenProfile}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-slate-700/80 bg-slate-900 hover:border-indigo-500/50 text-indigo-300 flex items-center justify-center font-bold text-xs transition-all active:scale-95 shadow-sm overflow-hidden cursor-pointer shrink-0"
              title="Ver Perfil de Usuario"
            >
              {user?.photoURL && (user.photoURL.startsWith('http') || user.photoURL.startsWith('/') || user.photoURL.startsWith('data:')) ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-indigo-200 font-bold">{initial}</span>
              )}
            </button>

            {/* Botón Salir / Logout */}
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 flex items-center justify-center transition-all active:scale-90 cursor-pointer shrink-0"
              title="Cerrar Sesión"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          /* Botón de Acceso / Registro */
          <button
            type="button"
            onClick={() => onOpenAuth?.('login')}
            className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1 active:scale-95 cursor-pointer shrink-0"
            title="Acceso o Registro de Usuario"
          >
            <LogIn className="w-3 h-3" />
            <span>Acceso</span>
          </button>
        )}

      </div>

      {/* Modal Discreto y Elegante de Confirmación para Cerrar Sesión */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn font-display">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 shrink-0">
                <LogOut className="w-4 h-4 text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">¿Cerrar sesión de GOALS?</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Podrás volver a ingresar en cualquier momento.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowLogoutConfirm(false);
                  await logout();
                  onNavigateHome();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-md shadow-rose-600/20 cursor-pointer"
              >
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


