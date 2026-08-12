import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { X, Zap, Check, Gift, Download, Brain, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ApkDownloadGuideModal } from './ApkDownloadGuideModal';
import { checkForApkUpdate, UpdateInfo } from '../services/updateService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminDashboard: () => void;
}

const AVATAR_OPTIONS = ['🧑‍🚀', '👩‍🚀', '👽', '🚀', '🛰️', '🪐', '☄️', '🛸', '🌌', '⭐'];
const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenAdminDashboard
}) => {
  const { user, isCloud, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, updateUserProfileData, authError, setAuthError } = useAuth();
  const { userData, totalStars, maxStars, claimReto, getRankInfo, getRetosList, showToast } = useProgress();

  const [activeTab, setActiveTab] = useState<'retos' | 'racha' | 'cuenta' | 'about' | 'admin'>('retos');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Update checking state
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  // Editing Profile State
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');
  const [selectedAvatar, setSelectedAvatar] = useState('👽');

  // Auth Form State for Guests
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckForUpdates = async () => {
    setIsCheckingUpdate(true);
    try {
      const info = await checkForApkUpdate();
      setUpdateInfo(info);
      if (info.hasUpdate) {
        showToast(`🔔 ¡Nueva versión v${info.latestVersion} lista para descargar!`);
        setIsGuideOpen(true);
      } else {
        showToast(`✅ Tu aplicación está en la versión más reciente (v${info.currentVersion})`);
      }
    } catch (e: any) {
      showToast("Error al conectar con el servidor de actualizaciones");
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'about' && !updateInfo) {
      handleCheckForUpdates();
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const isGuest = user?.isAnonymous || !isCloud;
  const rank = getRankInfo(userData.xp);
  const retosList = getRetosList();
  const currentStars = totalStars();
  const maxPossibleStars = maxStars();

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (authMode === 'login') {
        await signInWithEmail(email, password);
        showToast("Sesión iniciada correctamente");
      } else {
        await signUpWithEmail(signupName, email, password);
        showToast("Cuenta creada en GOALS");
      }
    } catch (err) {
      // Error manejado en AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!newDisplayName.trim()) return;
    try {
      await updateUserProfileData(newDisplayName.trim());
      showToast("Perfil guardado con éxito");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        <div className="bg-[#0b0f19] border border-indigo-500/30 rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col relative hide-scrollbar font-display">
          
          {/* HEADER COMPACTO */}
          <div className="p-3.5 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#0b0f19]/95 backdrop-blur-md z-20">
            <div className="flex items-center gap-2">
              <span className="text-xl">🚀</span>
              <div>
                <h2 className="font-extrabold text-base text-white leading-tight">Centro de Astronauta</h2>
                <p className="text-[10px] text-slate-400 font-medium">{rank.title}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Contenido principal */}
          <div className="p-3 space-y-3">
            
            {/* NAVEGACIÓN DE PESTAÑAS */}
            {!isGuest && (
              <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/5 text-[10px] font-extrabold overflow-x-auto hide-scrollbar">
                <button 
                  onClick={() => setActiveTab('retos')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${activeTab === 'retos' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  ⚡ Retos
                </button>
                <button 
                  onClick={() => setActiveTab('racha')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${activeTab === 'racha' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  🔥 Racha & ⭐
                </button>
                <button 
                  onClick={() => setActiveTab('cuenta')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${activeTab === 'cuenta' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  👤 Perfil
                </button>
                <button 
                  onClick={() => setActiveTab('about')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${activeTab === 'about' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-400 hover:text-white'}`}
                >
                  📲 Actualizaciones
                </button>
                <button 
                  onClick={() => { setActiveTab('admin'); onOpenAdminDashboard(); }}
                  className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap ${activeTab === 'admin' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  ⚙️ Admin
                </button>
              </div>
            )}

            {isGuest ? (
               /* VISTA INVITADO */
               <div className="bg-slate-900/50 border border-indigo-500/30 rounded-2xl p-4 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-2xl mx-auto border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    🚀
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white mb-0.5">
                      {authMode === 'login' ? 'Iniciar Sesión en GOALS' : 'Crear tu Cuenta GOALS'}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Guarda tus estrellas, racha y XP en la nube en todas tus aplicaciones.
                    </p>
                  </div>

                  {authError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-bold text-center">
                      {authError}
                    </div>
                  )}

                  <form onSubmit={handleAuthSubmit} className="space-y-2.5 text-left">
                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-[9px] font-bold text-slate-300 mb-1 uppercase tracking-wider">Nombre Completo</label>
                        <input
                          type="text" required value={signupName} onChange={(e) => setSignupName(e.target.value)}
                          placeholder="Tu nombre"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[9px] font-bold text-slate-300 mb-1 uppercase tracking-wider">Correo Electrónico</label>
                      <input
                        type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="estudiante@email.com"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-slate-300 mb-1 uppercase tracking-wider">Contraseña</label>
                      <input
                        type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:border-indigo-500 outline-none transition-all"
                      />
                    </div>

                    <button
                      type="submit" disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 active:scale-95"
                    >
                      {isSubmitting ? 'Procesando...' : authMode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                    </button>
                  </form>

                  <div className="relative py-0.5">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                    <div className="relative flex justify-center text-[9px] uppercase text-slate-500 font-bold bg-[#0b0f19] px-2">o bien</div>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      setIsSubmitting(true);
                      try {
                        await signInWithGoogle();
                        showToast("Sesión iniciada con Google");
                      } catch (e) {
                        // Handled by context
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 active:scale-95"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>{authMode === 'login' ? 'Iniciar sesión con Google' : 'Registrarme con Google'}</span>
                  </button>

                  <div className="pt-0.5 text-center">
                    <button
                      type="button"
                      onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(null); }}
                      className="text-indigo-400 hover:text-indigo-300 font-bold text-xs"
                    >
                      {authMode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión aquí'}
                    </button>
                  </div>
               </div>
            ) : (
              /* VISTAS DE USUARIO REGISTRADO */
              <>
                {/* TAB ⚡ RETOS DIARIOS */}
                {activeTab === 'retos' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/30 rounded-2xl p-3 text-center relative overflow-hidden">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-extrabold text-amber-300 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 fill-amber-400" /> {userData.xp} XP Acumulados
                        </span>
                        <span className="font-bold text-indigo-300 text-[10px]">
                          Nivel {rank.level}: {rank.title}
                        </span>
                      </div>

                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div 
                          className="bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-500 h-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, (userData.xp / rank.nextXp) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-300 uppercase tracking-wider px-1">
                        <span>Misiones Espaciales del Día</span>
                        <span className="text-amber-400 text-[10px]">¡Reclama tu XP!</span>
                      </div>

                      {retosList.map((r) => (
                        <div 
                          key={r.id}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 transition-all ${
                            r.claimed
                              ? 'bg-slate-950/50 border-slate-800 opacity-60'
                              : r.cond
                              ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                              : 'bg-slate-900/60 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <span className="text-2xl p-1.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0">{r.icon}</span>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-extrabold text-xs text-white truncate">{r.title}</h4>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{r.desc}</p>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {r.claimed ? (
                              <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 font-bold text-[10px] flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-400" /> Reclamado
                              </span>
                            ) : r.cond ? (
                              <button
                                onClick={() => claimReto(r.id, r.xp)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] uppercase tracking-wider transition-all shadow-md shadow-emerald-500/30 active:scale-95 flex items-center gap-1 animate-pulse"
                              >
                                <Gift className="w-3 h-3" /> +{r.xp} XP
                              </button>
                            ) : (
                              <span className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-amber-400/70 font-bold text-[10px]">
                                +{r.xp} XP
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 🔥 RACHA DIARIA */}
                {activeTab === 'racha' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="bg-gradient-to-br from-rose-950/60 via-slate-900 to-amber-950/60 border border-rose-500/30 rounded-2xl p-4 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-3xl mx-auto shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                        🔥
                      </div>
                      <div>
                        <h3 className="font-black text-2xl text-white">{userData.streak} Días de Racha</h3>
                        <p className="text-xs text-slate-300">¡Conéctate mañana para mantener encendida tu llama astronómica!</p>
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Actividad de la Semana</div>
                        <div className="flex justify-center gap-2">
                          {WEEKDAYS.map((day, idx) => {
                            const active = userData.weeklyActivity?.[idx];
                            return (
                              <div key={day} className="flex flex-col items-center gap-1">
                                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-black transition-all ${
                                  active 
                                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.4)]' 
                                    : 'bg-slate-950 border-slate-800 text-slate-600'
                                }`}>
                                  {active ? '🔥' : day}
                                </div>
                                <span className="text-[9px] text-slate-500 font-bold">{day}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-xl bg-slate-950 border border-slate-800">⭐</span>
                        <div>
                          <h4 className="font-extrabold text-sm text-white">{currentStars} / {maxPossibleStars} Estrellas</h4>
                          <p className="text-[10px] text-slate-400">Consigue 3 estrellas completando tests al 100%</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-black">
                        {Math.round((currentStars / (maxPossibleStars || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                )}

                {/* TAB 👤 PERFIL */}
                {activeTab === 'cuenta' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="bg-slate-900/50 border border-indigo-500/20 rounded-2xl p-3.5 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-indigo-500 flex items-center justify-center text-2xl shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.5)] relative">
                        {selectedAvatar}
                        <div className="absolute inset-0 rounded-full ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-[#0b0f19]"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-base text-white truncate">{user?.displayName || 'Estudiante'}</h3>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-3 space-y-2.5">
                      <h4 className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest">Datos del Perfil Único</h4>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-300 mb-1">Nombre Completo</label>
                        <input 
                          type="text" 
                          value={newDisplayName}
                          onChange={(e) => setNewDisplayName(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none transition-all"
                        />
                      </div>
                      <button 
                        onClick={handleSaveProfile}
                        className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all active:scale-95"
                      >
                        Guardar Cambios de Perfil
                      </button>
                    </div>

                    <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-3 space-y-2">
                      <h4 className="text-[10px] font-extrabold text-cyan-300 uppercase tracking-widest">Selecciona Distintivo / Avatar:</h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {AVATAR_OPTIONS.map((av) => (
                          <button
                            key={av}
                            onClick={() => setSelectedAvatar(av)}
                            className={`w-8 h-8 rounded-xl bg-slate-950 border flex items-center justify-center text-base transition-all ${
                              selectedAvatar === av 
                                ? 'border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] scale-110' 
                                : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                            }`}
                          >
                            {av}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={signOut}
                      className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs transition-all"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}

                {/* TAB 📲 BUSCADOR Y DESCARGA DINÁMICA DE ACTUALIZACIONES */}
                {activeTab === 'about' && (
                  <div className="space-y-3 animate-fadeIn">
                    
                    {/* Tarjeta de Verificación Dinámica */}
                    <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                            <Download className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-extrabold text-sm text-white">GOALS App v2.0</h4>
                            <p className="text-[10px] text-emerald-300 font-mono">Comprobador Remoto In-App</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Nativa Android
                        </span>
                      </div>

                      {/* Botón dinámico de Comprobar Actualización en la Nube */}
                      <button
                        type="button"
                        onClick={handleCheckForUpdates}
                        disabled={isCheckingUpdate}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
                      >
                        <RefreshCw className={`w-4 h-4 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                        <span>{isCheckingUpdate ? 'Consultando Servidor de Actualizaciones...' : 'Buscar Actualización en la Nube'}</span>
                      </button>
                    </div>

                    {/* Resultado Dinámico de la Comprobación */}
                    {updateInfo && (
                      <div className={`p-3.5 rounded-2xl border ${
                        updateInfo.hasUpdate 
                          ? 'bg-emerald-950/50 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                          : 'bg-slate-900/60 border-slate-800'
                      } space-y-2.5`}>
                        <div className="flex items-center justify-between text-xs font-bold text-white">
                          <span className="flex items-center gap-1.5">
                            {updateInfo.hasUpdate ? (
                              <span className="text-amber-400">🔔 ¡Nueva versión v{updateInfo.latestVersion} disponible!</span>
                            ) : (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Tu app está en la versión más reciente (v{updateInfo.currentVersion})
                              </span>
                            )}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed font-sans bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          {updateInfo.releaseNotes}
                        </p>

                        <button
                          type="button"
                          onClick={() => setIsGuideOpen(true)}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 hover:from-emerald-500 hover:to-teal-300 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Descargar goalskid.zip (v{updateInfo.latestVersion})</span>
                        </button>
                      </div>
                    )}

                    {/* Estado del Servidor de IA */}
                    <div className="bg-slate-900/60 border border-indigo-500/30 rounded-2xl p-3.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between font-bold text-white">
                        <span className="flex items-center gap-1.5 text-indigo-300">
                          <Brain className="w-4 h-4 text-indigo-400" />
                          <span>Servidor de IA Unificado</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">
                          model: "auto"
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                        Integración activa y automatizada para todas las mini apps.
                      </p>
                    </div>

                  </div>
                )}

              </>
            )}

          </div>
        </div>
      </div>

      {/* Modal Explicativo de Instalación en Android */}
      <ApkDownloadGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </>
  );
};
