import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { db, collection, onSnapshot } from '../config/firebase';
import { Zap, Flame, Star, Shield, LogIn, LogOut, Sun, Moon, ChevronDown, Sparkles, Check, X } from 'lucide-react';
import { ExperienceId, AppViewMode } from '../types';
import { GOALS_EXPERIENCES } from '../config/experiencesConfig';

interface HeaderProps {
  activeExperience: AppViewMode;
  onNavigateHome: () => void;
  onOpenProfile: () => void;
  onOpenAdmin?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onOpenMiniApps?: () => void;
  onSelectExperience?: (expId: ExperienceId) => void;
}

const ALL_MINIAPPS = [
  {
    id: 'school' as ExperienceId,
    name: 'Escuela IA',
    shortName: 'Escuela',
    badge: 'Tutor OCR',
    tagline: 'Tutor Multimodal de Cuadernos',
    logoUrl: GOALS_EXPERIENCES.school?.logoUrl || '/assets/miniapps/school_logo.png',
    color: 'text-emerald-400',
    border: 'border-emerald-500/40',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    activeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-950/40'
  },
  {
    id: 'languages' as ExperienceId,
    name: 'Idiomas Voz',
    shortName: 'Idiomas',
    badge: 'Voz IA',
    tagline: 'Profesor Particular en Directo',
    logoUrl: GOALS_EXPERIENCES.languages?.logoUrl || '/assets/miniapps/languages_logo.png',
    color: 'text-cyan-400',
    border: 'border-cyan-500/40',
    badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    activeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-cyan-950/40'
  },
  {
    id: 'astro' as ExperienceId,
    name: 'Cosmos 3D',
    shortName: 'Cosmos 3D',
    badge: '3D NASA',
    tagline: 'Astrofísica & Simulador Espacial',
    logoUrl: GOALS_EXPERIENCES.astro?.logoUrl || '/assets/miniapps/cosmos_logo.png',
    color: 'text-indigo-400',
    border: 'border-indigo-500/40',
    badgeBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    activeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-indigo-950/40'
  },
  {
    id: 'verify' as ExperienceId,
    name: 'Criterio',
    shortName: 'Criterio',
    badge: 'Rigor IA',
    tagline: 'Pensamiento Crítico & Medios',
    logoUrl: GOALS_EXPERIENCES.verify?.logoUrl || '/assets/miniapps/verify_logo.png',
    color: 'text-amber-400',
    border: 'border-amber-500/40',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    activeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-950/40'
  },
  {
    id: 'ai-lab' as ExperienceId,
    name: 'IA Lab',
    shortName: 'IA Lab',
    badge: 'Lab IA',
    tagline: 'Laboratorio Forense de IA',
    logoUrl: GOALS_EXPERIENCES['ai-lab']?.logoUrl || '/assets/miniapps/ailab_logo.png',
    color: 'text-purple-400',
    border: 'border-purple-500/40',
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    activeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-purple-950/40'
  }
];

export const Header: React.FC<HeaderProps> = ({
  activeExperience,
  onNavigateHome,
  onOpenProfile,
  onOpenAdmin,
  onOpenAuth,
  onOpenMiniApps,
  onSelectExperience
}) => {
  const { user, logout } = useAuth();
  const { userData, totalStars, adminSimulatedAge, setAdminSimulatedAge, effectiveAge } = useProgress();
  const { theme, toggleTheme, isDark } = useTheme();
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isAdmin = user?.email === 'josferestudio@gmail.com';
  const isAuthenticated = !!(user && !user.isAnonymous);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAppMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAppMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
    }, (err) => {
      console.debug("[Header] Users listener disconnected:", err.code);
    });
    return () => unsub();
  }, [isAdmin]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAppMenuOpen(false);
    onNavigateHome();
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMiniApp = (id: ExperienceId) => {
    setIsAppMenuOpen(false);
    if (onSelectExperience) {
      onSelectExperience(id);
    } else if (onOpenMiniApps) {
      onOpenMiniApps();
    }
    const mainEl = document.querySelector('main');
    if (mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const initial = user?.displayName ? user.displayName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'E');
  const activeExpConfig = activeExperience ? GOALS_EXPERIENCES[activeExperience] : null;

  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  return (
    <header className={`px-2.5 sm:px-6 py-2.5 flex justify-between items-center border-b z-50 sticky top-0 select-none transition-all w-full max-w-full backdrop-blur-xl ${
      isDark 
        ? 'border-slate-800/80 bg-[#0c101c]/95 text-slate-100 shadow-lg shadow-black/30' 
        : 'border-slate-200 bg-white/95 text-slate-900 shadow-sm'
    }`}>
      
      {/* Sección Izquierda: Logotipo Adaptativo + Selector de Experiencias por Click */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0" ref={dropdownRef}>
        <div className="relative">
          <button 
            type="button"
            onClick={() => setIsAppMenuOpen((prev) => !prev)}
            className={`flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0 text-left p-1.5 -m-1.5 rounded-2xl transition-all border ${
              isAppMenuOpen
                ? isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-100 border-slate-300'
                : 'border-transparent hover:bg-slate-800/30'
            }`}
            title="Haz clic para cambiar de experiencia o ir al inicio"
            aria-expanded={isAppMenuOpen}
          >
            <div className="relative">
              <img 
                src={activeExpConfig ? activeExpConfig.logoUrl : "/goalskid_logo.png"} 
                alt={activeExpConfig ? activeExpConfig.name : "Goalskid Logo"} 
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-700/80 shadow-md object-cover group-hover:scale-105 group-hover:border-slate-500 transition-all duration-200 shrink-0" 
              />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className={`font-display font-black text-sm sm:text-base tracking-tight transition-colors leading-tight ${
                  isDark ? 'text-white group-hover:text-slate-200' : 'text-slate-900 group-hover:text-indigo-600'
                }`}>
                  {activeExpConfig ? activeExpConfig.name : "Goalskid"}
                </span>
                {activeExpConfig ? (
                  <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-mono font-bold uppercase border hidden sm:inline-block ${activeExpConfig.badgeClass}`}>
                    {activeExpConfig.badge}
                  </span>
                ) : null}
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isAppMenuOpen ? 'rotate-180 text-indigo-400' : 'group-hover:text-slate-200'}`} />
              </div>
              <span className={`hidden md:inline text-[9px] font-medium tracking-tight -mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {activeExpConfig ? activeExpConfig.tagline : "Ecosistema Educativo IA"}
              </span>
            </div>
          </button>

          {/* Menú Desplegable de MiniApps (Abre por Click de forma controlada) */}
          {isAppMenuOpen && (
            <>
              {/* Overlay invisible para cerrar al tocar fuera en móvil y desktop */}
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setIsAppMenuOpen(false)} 
              />
              <div className="absolute top-full left-0 mt-2.5 w-[calc(100vw-2rem)] max-w-xs sm:w-80 z-50 animate-fadeIn">
                <div className={`backdrop-blur-2xl border rounded-2xl p-2 sm:p-2.5 shadow-2xl space-y-1.5 max-h-[80vh] overflow-y-auto scrollbar-thin ${
                  isDark ? 'bg-[#0c101c]/98 border-slate-800 shadow-black/80' : 'bg-white/98 border-slate-200 shadow-slate-300/80'
                }`}>
                
                {/* Cabecera del Menú */}
                <div className={`px-2 py-1.5 border-b flex items-center justify-between ${
                  isDark ? 'border-slate-800/80' : 'border-slate-100'
                }`}>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {activeExperience ? 'Cambiar Experiencia' : 'Experiencias GOALS'}
                  </span>
                  <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${
                    isDark ? 'text-slate-400 bg-slate-900 border-slate-800' : 'text-slate-600 bg-slate-100 border-slate-200'
                  }`}>
                    {activeExperience ? `${ALL_MINIAPPS.length - 1} MiniApps` : `${ALL_MINIAPPS.length} MiniApps`}
                  </span>
                </div>

                {/* Si estamos dentro de una MiniApp, mostrar botón para Volver al Inicio Matriz (Hub) */}
                {activeExperience && (
                  <>
                    <button
                      type="button"
                      onClick={handleLogoClick}
                      className={`w-full p-2 rounded-xl flex items-center gap-2.5 sm:gap-3 transition-all text-left group cursor-pointer border ${
                        isDark 
                          ? 'bg-slate-900/60 hover:bg-slate-800/90 border-slate-800 text-slate-200 hover:text-white' 
                          : 'bg-indigo-50/60 hover:bg-indigo-100/80 border-indigo-200 text-indigo-900'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-slate-700/80 shadow-sm flex items-center justify-center bg-slate-950">
                        <img src="/goalskid_logo.png" alt="GOALS" className="w-5 h-5 object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs group-hover:text-amber-300 transition-colors">
                            ⭐ GOALS • Portal Principal
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md border bg-amber-500/20 text-amber-300 border-amber-500/30">
                            HUB
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">Volver al panel central</p>
                      </div>
                    </button>

                    <div className="h-px bg-slate-800/60 my-1"></div>
                  </>
                )}

                {/* Lista de MiniApps (Si estamos en una MiniApp, muestra las otras 4; si estamos en GOALS, muestra las 5) */}
                <div className="space-y-1">
                  {ALL_MINIAPPS
                    .filter((app) => !activeExperience || app.id !== activeExperience)
                    .map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => handleSelectMiniApp(app.id)}
                        className={`w-full p-2 rounded-xl flex items-center gap-2.5 sm:gap-3 transition-all text-left group cursor-pointer border ${
                          isDark 
                            ? 'hover:bg-slate-900/80 hover:border-slate-800 border-transparent text-slate-300 hover:text-white' 
                            : 'hover:bg-slate-50 hover:border-slate-200 border-transparent text-slate-700 hover:text-slate-900'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-slate-700/80 shadow-sm group-hover:scale-105 group-hover:border-slate-600 transition-all">
                          <img 
                            src={app.logoUrl} 
                            alt={app.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`font-bold text-xs transition-colors truncate ${
                              isDark ? 'text-white group-hover:text-slate-100' : 'text-slate-900 group-hover:text-indigo-600'
                            }`}>
                              {app.name}
                            </span>
                            <span className={`text-[9px] font-medium px-1.5 py-0.2 rounded-md font-mono border ${app.badgeBg}`}>
                              {app.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5 font-normal">{app.tagline}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
        </div>
      </div>

      {/* Sección Derecha: Admin, Gamificación, Perfil y Salida */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        
        {/* Conmutador Super Admin de Etapa / Edad (Solo en Localhost) */}
        {isAdmin && isLocalhost && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-300">
            <span className="hidden sm:inline text-[10px] text-amber-400/90 font-mono">👑 Dev Nivel:</span>
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
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Botón de Acceso / Registro */}
            <button
              type="button"
              onClick={() => onOpenAuth?.('login')}
              className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1 active:scale-95 cursor-pointer shrink-0"
              title="Acceso o Registro de Usuario"
            >
              <LogIn className="w-3 h-3" />
              <span>Acceso</span>
            </button>
          </div>
        )}

        {/* Conmutador Global de Tema (Light / Dark) para Invitados y Registrados */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl border flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0 ${
            isDark 
              ? 'bg-slate-900 border-slate-700/80 text-amber-300 hover:text-amber-200 hover:border-slate-600 shadow-sm' 
              : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 shadow-sm'
          }`}
          title={isDark ? "Cambiar a Modo Claro (Light Mode)" : "Cambiar a Modo Oscuro (Dark Mode)"}
        >
          {isDark ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

      </div>

      {/* Modal Discreto y Elegante de Confirmación para Cerrar Sesión (en Portal Global) */}
      {showLogoutConfirm && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-display select-none"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div 
            className="bg-slate-900/95 border border-slate-700/80 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 relative z-10 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">¿Cerrar sesión de GOALS?</h3>
                <p className="text-xs text-slate-400 mt-1">Podrás volver a ingresar en cualquier momento con tus credenciales.</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs transition-all active:scale-95 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowLogoutConfirm(false);
                  onNavigateHome();
                  try {
                    await logout();
                  } catch (e) {
                    console.warn("Logout error:", e);
                  }
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all active:scale-95 shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Sí, salir
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};


