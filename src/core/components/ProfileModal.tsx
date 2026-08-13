import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { X, Zap, Check, Gift, Download, Brain, RefreshCw, CheckCircle2, Sliders, Volume2, Target, Flame, Star, Bot, User, Smartphone, ShieldCheck, Sparkles, Award, BarChart3 } from 'lucide-react';
import { ApkDownloadGuideModal } from './ApkDownloadGuideModal';
import { checkForApkUpdate, UpdateInfo } from '../services/updateService';
import { MASCOT_SKINS } from '../config/mascotSkins';
import { MascotSkinId } from '../types/mascot';
import { MascotPet } from './mascot/MascotPet';
import { GOALS_EXPERIENCES } from '../config/experiencesConfig';
import { getChildAge, setChildAge, getChildProfile, setChildProfile, getCustomMascotName, setCustomMascotName } from '../services/aiService';
import { ChildLearningProfile, AVAILABLE_GRADES, AVAILABLE_SUBJECTS, AVAILABLE_EXTRACURRICULARS, AVAILABLE_INTERESTS } from '../types/childProfile';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdminDashboard: () => void;
}

const AVATAR_OPTIONS = [
  { id: 'astrobot', label: 'AstroBot Cyberpunk', icon: '🤖' },
  { id: 'astronaut', label: 'Cyber-Astronauta', icon: '🧑‍🚀' },
  { id: 'dragon', label: 'Dragón Neón', icon: '🐲' },
  { id: 'owl', label: 'Búho Cuántico', icon: '🦉' },
  { id: 'cat', label: 'Gato Galáctico', icon: '🐱' },
  { id: 'ufo', label: 'Piloto Matrix', icon: '🛸' },
  { id: 'star', label: 'Archonte Estelar', icon: '🌌' },
  { id: 'rocket', label: 'Cohete Plasma', icon: '🚀' },
  { id: 'sat', label: 'Sonda Alfa', icon: '🛰️' },
  { id: 'planet', label: 'Núcleo Cósmico', icon: '🪐' }
];

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenAdminDashboard
}) => {
  const { user, isCloud, signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, updateUserProfileData, authError, setAuthError } = useAuth();
  const { userData, totalStars, maxStars, claimReto, getRankInfo, getRetosList, showToast } = useProgress();

  const [activeTab, setActiveTab] = useState<'retos' | 'racha' | 'stats' | 'ficha_niño' | 'mascota' | 'cuenta' | 'about' | 'admin'>('retos');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Child Learning Profile State
  const [childProfile, setChildProfileState] = useState<ChildLearningProfile>(() => getChildProfile());

  const handleSaveChildProfile = (updated: ChildLearningProfile) => {
    setChildProfileState(updated);
    setChildProfile(updated);
    showToast('¡Ficha del Alumno guardada e inyectada en la IA!');
  };

  // Mascot customization state
  const [customMascotName, setCustomMascotNameState] = useState<string>(() => getCustomMascotName());
  const [mascotSkinId, setMascotSkinId] = useState<MascotSkinId>(() => {
    return (localStorage.getItem('goals_mascot_skin') as MascotSkinId) || 'astrobot';
  });
  const [mascotScale, setMascotScale] = useState<number>(() => {
    return parseFloat(localStorage.getItem('goals_mascot_scale') || '1.2');
  });
  const [mascotAnimState, setMascotAnimState] = useState<'idle' | 'hover' | 'thinking' | 'speaking' | 'dragging'>('idle');
  const [mascotSoulPrompt, setMascotSoulPrompt] = useState<string>(() => {
    const skinName = MASCOT_SKINS[mascotSkinId]?.name || 'el tutor de GOALS';
    return localStorage.getItem('goals_mascot_soul') || `Eres ${skinName}, un mentor súper divertido y sabio experto en ciencia, idiomas y tecnología. Explicas conceptos complejos con metáforas emocionantes.`;
  });
  const [mascotPitch, setMascotPitch] = useState<number>(() => {
    return parseFloat(localStorage.getItem('goals_mascot_pitch') || '1.15');
  });
  const [mascotRate, setMascotRate] = useState<number>(() => {
    return parseFloat(localStorage.getItem('goals_mascot_rate') || '1.0');
  });

  const handleSelectMascotSkin = (skinId: MascotSkinId) => {
    setMascotSkinId(skinId);
    localStorage.setItem('goals_mascot_skin', skinId);
    window.dispatchEvent(new CustomEvent('goals_mascot_updated', { detail: { skinId, scale: mascotScale } }));
    showToast(`Mascota cambiada a ${MASCOT_SKINS[skinId].name}`);
  };

  const handleScaleChange = (scale: number) => {
    setMascotScale(scale);
    localStorage.setItem('goals_mascot_scale', String(scale));
    window.dispatchEvent(new CustomEvent('goals_mascot_updated', { detail: { skinId: mascotSkinId, scale } }));
  };

  const handleSoulPromptChange = (prompt: string) => {
    setMascotSoulPrompt(prompt);
    localStorage.setItem('goals_mascot_soul', prompt);
    window.dispatchEvent(new CustomEvent('goals_mascot_updated', { detail: { soulPrompt: prompt } }));
    showToast("Personalidad IA (Soul System Prompt) actualizada");
  };

  // Update checking state
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  // Editing Profile State
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.photoURL || '👽');
  const [childAge, setChildAgeState] = useState<number>(() => getChildAge());

  const handleAgeChange = (newAge: number) => {
    setChildAgeState(newAge);
    setChildAge(newAge);
    showToast(`Edad adaptativa ajustada a ${newAge} años`);
  };

  useEffect(() => {
    if (user?.displayName) setNewDisplayName(user.displayName);
    if (user?.photoURL) setSelectedAvatar(user.photoURL);
  }, [user]);

  // Auth Form State for Guests
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isGuest = !user || user.isAnonymous;
  const rank = getRankInfo(userData?.xp || 0);

  const currentStars = typeof totalStars === 'function' ? totalStars() : 0;
  const maxPossibleStars = typeof maxStars === 'function' ? maxStars() : 18;
  const retosList = typeof getRetosList === 'function' ? getRetosList() : [];

  const handleCheckForUpdates = async () => {
    setIsCheckingUpdate(true);
    try {
      const info = await checkForApkUpdate();
      setUpdateInfo(info);
      if (info.hasUpdate) {
        showToast(`Nueva versión v${info.latestVersion} lista para descargar`);
        setIsGuideOpen(true);
      } else {
        showToast(`Tu aplicación está en la versión más reciente (v${info.currentVersion})`);
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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);
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
      await updateUserProfileData(newDisplayName.trim(), selectedAvatar);
      showToast("¡Perfil y avatar de usuario actualizados!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn cursor-pointer font-sans">
        <div onClick={(e) => e.stopPropagation()} className="bg-slate-950/95 border border-indigo-500/30 rounded-3xl w-full max-w-2xl h-[85vh] max-h-[680px] overflow-hidden shadow-2xl backdrop-blur-xl flex flex-col relative cursor-default animate-in fade-in zoom-in-95 duration-200">
          
          {/* HEADER COMPACTO CON ICONO SVG */}
          {/* Cabecera del Modal */}
          <div className="p-4 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-lg shadow-md font-bold overflow-hidden">
                {user?.photoURL && (user.photoURL.startsWith('http') || user.photoURL.startsWith('/') || user.photoURL.startsWith('data:')) ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.photoURL || '👽'}</span>
                )}
              </div>
              <div>
                <h2 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <span className="max-w-[180px] sm:max-w-[280px] truncate">{user?.displayName || 'Centro de Usuario'}</span>
                  {user?.email === 'josferestudio@gmail.com' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 shrink-0">
                      ADMIN
                    </span>
                  )}
                </h2>
                <p className="text-[10px] text-slate-400 font-mono">
                  {rank.title}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Contenido principal */}
          <div className="p-4 flex-1 overflow-y-auto hide-scrollbar space-y-4">
            
            {/* NAVEGACIÓN DE PESTAÑAS (Accesibles para la experiencia de todos los usuarios) */}
            <div className="flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 text-xs font-extrabold overflow-x-auto hide-scrollbar shrink-0">
              <button 
                onClick={() => setActiveTab('retos')}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'retos' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <Target className="w-4 h-4 text-amber-400" />
                <span>Retos</span>
              </button>
              <button 
                onClick={() => setActiveTab('racha')}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'racha' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Racha</span>
              </button>
              <button 
                onClick={() => setActiveTab('stats')}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'stats' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <BarChart3 className="w-4 h-4 text-amber-300" />
                <span>Estadísticas</span>
              </button>
              <button 
                onClick={() => setActiveTab('mascota')}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'mascota' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <Bot className="w-4 h-4 text-purple-300" />
                <span>Mascota</span>
              </button>
              <button 
                onClick={() => setActiveTab('ficha_niño')}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'ficha_niño' ? 'bg-pink-600 text-white shadow' : 'text-pink-300 hover:text-white'}`}
              >
                <Brain className="w-4 h-4 text-pink-300" />
                <span>Ficha Alumno 👧</span>
              </button>
              <button 
                onClick={() => setActiveTab('cuenta')}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'cuenta' ? 'bg-cyan-600 text-white shadow' : 'text-cyan-300 hover:text-white'}`}
              >
                <User className="w-4 h-4 text-cyan-300" />
                <span>Perfil</span>
              </button>
              {user?.email === 'josferestudio@gmail.com' && (
                <button 
                  onClick={() => { onClose(); onOpenAdminDashboard(); }}
                  className="px-3 py-2 rounded-xl transition-all whitespace-nowrap text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5 ml-auto"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              )}
            </div>

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

                {/* TAB 📊 ESTADÍSTICAS GLOBALES DE MINI APPS */}
                {activeTab === 'stats' && (
                  <div className="space-y-3 animate-fadeIn">
                    {/* Resumen Global */}
                    <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/30 rounded-2xl p-4 text-center space-y-2">
                      <h3 className="font-black text-sm text-white flex items-center justify-center gap-2">
                        <BarChart3 className="w-4 h-4 text-indigo-400" />
                        <span>Ecosistema GOALS — Métricas Globales</span>
                      </h3>
                      <p className="text-[11px] text-slate-300">
                        Puntos de Experiencia (XP), racha y estrellas agregadas en tiempo real.
                      </p>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                        <div className="bg-slate-950/60 p-2 rounded-xl border border-amber-500/30">
                          <p className="text-[10px] text-slate-400 font-bold">XP Total</p>
                          <p className="font-extrabold text-sm text-amber-400 flex items-center justify-center gap-1">
                            <Zap className="w-3.5 h-3.5 fill-amber-400" /> {userData.xp}
                          </p>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-xl border border-rose-500/30">
                          <p className="text-[10px] text-slate-400 font-bold">Racha</p>
                          <p className="font-extrabold text-sm text-rose-400 flex items-center justify-center gap-1">
                            <Flame className="w-3.5 h-3.5 fill-rose-400" /> {userData.streak} D
                          </p>
                        </div>
                        <div className="bg-slate-950/60 p-2 rounded-xl border border-yellow-500/30">
                          <p className="text-[10px] text-slate-400 font-bold">Estrellas</p>
                          <p className="font-extrabold text-sm text-yellow-400 flex items-center justify-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-400" /> {totalStars()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Desglose por Mini App */}
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider px-1">
                        Desglose por Mini App
                      </h4>

                      {Object.values(GOALS_EXPERIENCES).map((exp) => {
                        const IconComp = exp.icon;
                        const expXp = userData.experiences?.[exp.id]?.xp || (exp.id === 'astro' ? userData.xp : 0);
                        return (
                          <div 
                            key={exp.id} 
                            className={`p-3 rounded-2xl bg-gradient-to-r ${exp.bgGradientClass} border ${exp.borderClass} shadow-md flex items-center justify-between gap-3`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 ${exp.iconColorClass}`}>
                                <IconComp className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="font-extrabold text-xs text-white">{exp.name}</h5>
                                <p className="text-[10px] text-slate-400">{exp.tagline}</p>
                              </div>
                            </div>

                            <div className="text-right space-y-1">
                              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${exp.badgeClass}`}>
                                {exp.badge}
                              </span>
                              <div className="flex items-center gap-1 text-amber-400 font-bold text-xs justify-end">
                                <Zap className="w-3 h-3 fill-amber-400" />
                                <span>{expXp} XP</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 🐾 MASCOTA PET (CONFIGURACIÓN COMPLETA DE SOUL PROMPT, ESCALA, VOZ Y ANIMACIÓN) */}
                {activeTab === 'mascota' && (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Tarjeta de Previsualización Centrada y Nítida */}
                    <div className="bg-gradient-to-b from-purple-950/40 to-slate-900 border border-purple-500/30 rounded-3xl p-5 text-center space-y-3 relative overflow-hidden shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bot className="w-5 h-5 text-purple-400" />
                          <h3 className="font-extrabold text-sm text-white">Vista Previa de Mascota en Vivo</h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                          {MASCOT_SKINS[mascotSkinId]?.name}
                        </span>
                      </div>

                      {/* Pedestal Luminoso Centrado para la Mascota */}
                      <div className="w-36 h-36 rounded-full bg-slate-950/80 border-2 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.35)] flex items-center justify-center mx-auto relative group">
                        <div className="absolute inset-0 rounded-full bg-purple-500/10 animate-pulse opacity-30 pointer-events-none" />
                        <MascotPet skinId={mascotSkinId} animState={mascotAnimState} scale={mascotScale} />
                      </div>

                      <p className="text-xs text-slate-300 font-medium max-w-sm mx-auto">
                        {MASCOT_SKINS[mascotSkinId]?.subtitle}
                      </p>

                      {/* Probador de Estados de Animación */}
                      <div className="flex items-center justify-center gap-1.5 pt-1">
                        {(['idle', 'hover', 'thinking', 'speaking', 'dragging'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setMascotAnimState(st)}
                            className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold capitalize transition-all cursor-pointer ${
                              mascotAnimState === st
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Nombre Personalizado de la Mascota */}
                    <div className="bg-slate-900/60 border border-purple-500/40 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-purple-300 flex items-center gap-1.5">
                          <Bot className="w-4 h-4 text-purple-400" />
                          <span>Nombre Personalizado de tu Mascota</span>
                        </h4>
                        <span className="text-[9px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                          Nombre Propio
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Escribe el nombre con el que tu mascota se presentará y te hablará de viva voz:
                      </p>
                      <input
                        type="text"
                        value={customMascotName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomMascotNameState(val);
                          setCustomMascotName(val);
                        }}
                        placeholder="Ej. Búho Sabio, Sabiondo, Toby, AstroBot..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-purple-500/40 text-xs font-black text-white focus:border-purple-400 outline-none transition-all"
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {['🦉 Búho Sabio', '🤖 AstroBot', '🐲 Dragón Cósmico', '🐱 Gatito Galáctico'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              const clean = preset.split(' ').slice(1).join(' ');
                              setCustomMascotNameState(clean);
                              setCustomMascotName(clean);
                              showToast(`Nombre ajustado a ${clean}`);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[10px] font-extrabold hover:bg-purple-900/50 transition-all cursor-pointer"
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Selector de Skins en Grilla */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>Elige tu Especie / Avatar 3D</span>
                      </h4>

                      <div className="grid grid-cols-2 gap-2.5">
                        {Object.values(MASCOT_SKINS).map((skin) => (
                          <button
                            key={skin.id}
                            type="button"
                            onClick={() => handleSelectMascotSkin(skin.id as MascotSkinId)}
                            className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                              mascotSkinId === skin.id
                                ? 'bg-purple-950/70 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-[1.02]'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <span className="text-2xl p-1.5 bg-slate-900 rounded-xl border border-white/5 shrink-0">{skin.avatarIcon}</span>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-extrabold text-xs text-white truncate">{skin.name}</h5>
                              <p className="text-[9px] text-slate-400 truncate">{skin.subtitle}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Personalización del Soul System Prompt de la IA */}
                    <div className="bg-slate-900/50 border border-indigo-500/30 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-indigo-300 flex items-center gap-1.5">
                          <Brain className="w-4 h-4 text-indigo-400" />
                          <span>Soul & Personalidad IA (System Prompt)</span>
                        </h4>
                        <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
                          model: "auto"
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Define la personalidad y el tono didáctico con el que la Mascota IA te guiará en GOALS:
                      </p>

                      <textarea
                        rows={3}
                        value={mascotSoulPrompt}
                        onChange={(e) => handleSoulPromptChange(e.target.value)}
                        placeholder="Escribe el System Prompt o tono de personalidad de tu Mascota IA..."
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 outline-none font-mono"
                      />

                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSoulPromptChange("Eres AstroBot, un mentor espacial súper divertido y sabio experto en ciencia, física y programación. Explicas conceptos complejos con metáforas espaciales emocionantes.")}
                          className="px-2 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[9px] font-extrabold hover:bg-cyan-900/50 transition-all cursor-pointer"
                        >
                          🤖 AstroBot STEM
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSoulPromptChange("Eres el Búho Sabio. Tu tono es calmado, motivador y sumamente didáctico. Valoras la verificación empírica y la curiosidad de investigación.")}
                          className="px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[9px] font-extrabold hover:bg-emerald-900/50 transition-all cursor-pointer"
                        >
                          🦉 Búho Sabio
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSoulPromptChange("Eres el Dragón Cósmico. Tu misión es animar al estudiante a mantener su racha de conexión, superar sus misiones y alcanzar el rango máximo.")}
                          className="px-2 py-1 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[9px] font-extrabold hover:bg-blue-900/50 transition-all cursor-pointer"
                        >
                          🐲 Dragón Metas
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSoulPromptChange("Eres el Gatito Galáctico. Hablas con energía contagiosa y ayudas al estudiante a practicar fluidez verbal en inglés y otros idiomas.")}
                          className="px-2 py-1 rounded-lg bg-pink-950/60 border border-pink-500/30 text-pink-300 text-[9px] font-extrabold hover:bg-pink-900/50 transition-all cursor-pointer"
                        >
                          🐱 Gatito Idiomas
                        </button>
                      </div>
                    </div>

                    {/* Slider de Tamaño de la Mascota */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-purple-400" />
                          <span>Escala de Pantalla (Tamaño de la Mascota)</span>
                        </span>
                        <span className="font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/30">{mascotScale.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min={0.6}
                        max={2.5}
                        step={0.1}
                        value={mascotScale}
                        onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                        className="w-full h-2 accent-purple-500 cursor-pointer"
                      />
                      <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                        <span>0.6x (Compacto)</span>
                        <span>1.5x (Estándar)</span>
                        <span>2.5x (Gigante)</span>
                      </div>
                    </div>

                    {/* Control de Sintetizador de Voz TTS */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-extrabold text-white flex items-center gap-1.5">
                          <Volume2 className="w-4 h-4 text-purple-400" />
                          <span>Sintetizador de Voz (TTS)</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            if ('speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                              const skin = MASCOT_SKINS[mascotSkinId];
                              const nameToSay = customMascotName || skin.name;
                              const greetingName = childProfile.childName ? ` ${childProfile.childName}` : '';
                              const utt = new SpeechSynthesisUtterance(`¡Hola${greetingName}! Soy ${nameToSay}. Estoy listo para guiarte en GOALS.`);
                              utt.lang = 'es-ES';
                              utt.pitch = mascotPitch;
                              utt.rate = mascotRate;
                              setMascotAnimState('speaking');
                              utt.onend = () => setMascotAnimState('idle');
                              window.speechSynthesis.speak(utt);
                            }
                          }}
                          className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Probar Voz</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">Tono de Voz: {mascotPitch.toFixed(2)}</label>
                          <input
                            type="range"
                            min={0.5}
                            max={1.6}
                            step={0.05}
                            value={mascotPitch}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setMascotPitch(val);
                              localStorage.setItem('goals_mascot_pitch', String(val));
                            }}
                            className="w-full h-1.5 accent-purple-500 cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">Velocidad: {mascotRate.toFixed(2)}x</label>
                          <input
                            type="range"
                            min={0.7}
                            max={1.5}
                            step={0.05}
                            value={mascotRate}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setMascotRate(val);
                              localStorage.setItem('goals_mascot_rate', String(val));
                            }}
                            className="w-full h-1.5 accent-purple-500 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* TAB 👧 FICHA COMPLETA DEL ALUMNO / NIÑO */}
                {activeTab === 'ficha_niño' && (
                  <div className="space-y-4 animate-fadeIn">
                    
                    {/* Banner Explicativo */}
                    <div className="bg-gradient-to-r from-pink-950/80 via-slate-900 to-purple-950/80 border border-pink-500/30 rounded-2xl p-4 space-y-1.5 shadow-lg">
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <Brain className="w-4 h-4 text-pink-400" />
                        <span>Expediente & Ficha Personal del Alumno</span>
                      </h3>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                        Esta información se inyecta directamente en el <b>System Prompt</b> de la Mascota IA para adaptar las metáforas, el tono y las explicaciones a sus intereses y necesidades reales.
                      </p>
                    </div>

                    {/* 1. Datos Personales y Escolares */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                      <h4 className="text-xs font-extrabold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-pink-400" />
                        <span>1. Datos del Estudiante & Colegio</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">Nombre del Alumno/a</label>
                          <input
                            type="text"
                            value={childProfile.childName}
                            onChange={(e) => setChildProfileState({ ...childProfile, childName: e.target.value })}
                            placeholder="Ej. Mateo, Sofía..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-pink-500 outline-none transition-all font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">Edad ({childProfile.age} Años)</label>
                          <select
                            value={childProfile.age}
                            onChange={(e) => setChildProfileState({ ...childProfile, age: parseInt(e.target.value, 10) })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-200 font-bold focus:border-pink-500 outline-none transition-all cursor-pointer"
                          >
                            {Array.from({ length: 11 }, (_, i) => i + 6).map((a) => (
                              <option key={a} value={a} className="bg-slate-900 text-white">
                                {a} Años
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">Colegio / Centro Educativo</label>
                          <input
                            type="text"
                            value={childProfile.schoolName}
                            onChange={(e) => setChildProfileState({ ...childProfile, schoolName: e.target.value })}
                            placeholder="Ej. CEIP San José, Colegio Montserrat..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-pink-500 outline-none transition-all font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">Curso Escolar Actual</label>
                          <select
                            value={childProfile.grade}
                            onChange={(e) => setChildProfileState({ ...childProfile, grade: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-bold focus:border-pink-500 outline-none transition-all cursor-pointer"
                          >
                            {AVAILABLE_GRADES.map((g) => (
                              <option key={g} value={g} className="bg-slate-900 text-white">
                                {g}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 2. Asignaturas Favoritas ⭐ */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                      <h4 className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                        <span>2. Asignaturas Favoritas</span>
                      </h4>
                      <p className="text-[10px] text-slate-400">Toca para marcar las materias que más le gustan:</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {AVAILABLE_SUBJECTS.map((sub) => {
                          const isSelected = childProfile.favoriteSubjects.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => {
                                const next = isSelected
                                  ? childProfile.favoriteSubjects.filter((s) => s !== sub)
                                  : [...childProfile.favoriteSubjects, sub];
                                setChildProfileState({ ...childProfile, favoriteSubjects: next });
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-500/20 border border-emerald-500/60 text-emerald-300 shadow-sm'
                                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {isSelected ? '⭐ ' : ''}{sub}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Asignaturas a Reforzar 🎯 */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                      <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-amber-400" />
                        <span>3. Asignaturas a Reforzar (Le Cuentan Más)</span>
                      </h4>
                      <p className="text-[10px] text-slate-400">La IA será especialmente paciente y explicativa en estas materias:</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {AVAILABLE_SUBJECTS.map((sub) => {
                          const isSelected = childProfile.weakSubjects.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => {
                                const next = isSelected
                                  ? childProfile.weakSubjects.filter((s) => s !== sub)
                                  : [...childProfile.weakSubjects, sub];
                                setChildProfileState({ ...childProfile, weakSubjects: next });
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-500/20 border border-amber-500/60 text-amber-300 shadow-sm'
                                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {isSelected ? '🎯 ' : ''}{sub}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. Actividades Extraescolares */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                      <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        <span>4. Actividades Extraescolares</span>
                      </h4>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {AVAILABLE_EXTRACURRICULARS.map((ext) => {
                          const isSelected = childProfile.extracurriculars.includes(ext);
                          return (
                            <button
                              key={ext}
                              type="button"
                              onClick={() => {
                                const next = isSelected
                                  ? childProfile.extracurriculars.filter((e) => e !== ext)
                                  : [...childProfile.extracurriculars, ext];
                                setChildProfileState({ ...childProfile, extracurriculars: next });
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-cyan-500/20 border border-cyan-500/60 text-cyan-300 shadow-sm'
                                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {ext}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 5. Intereses & Hobbies Personales 🚀🎮 */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                      <h4 className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>5. Intereses & Hobbies (Para Analogías de la IA)</span>
                      </h4>
                      <p className="text-[10px] text-slate-400">La IA usará estos temas para ponerle ejemplos divertidos:</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {AVAILABLE_INTERESTS.map((inte) => {
                          const isSelected = childProfile.interests.includes(inte);
                          return (
                            <button
                              key={inte}
                              type="button"
                              onClick={() => {
                                const next = isSelected
                                  ? childProfile.interests.filter((i) => i !== inte)
                                  : [...childProfile.interests, inte];
                                setChildProfileState({ ...childProfile, interests: next });
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-500/20 border border-purple-500/60 text-purple-300 shadow-sm'
                                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {inte}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 6. Estilo de Aprendizaje */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                      <h4 className="text-xs font-extrabold text-pink-300 uppercase tracking-wider">
                        6. Estilo de Aprendizaje
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'visual', label: 'Visual 🎨' },
                          { id: 'auditivo', label: 'Auditivo 🎧' },
                          { id: 'practico', label: 'Práctico 🛠️' },
                          { id: 'general', label: 'General 📚' }
                        ].map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setChildProfileState({ ...childProfile, learningStyle: st.id as any })}
                            className={`py-2 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer ${
                              childProfile.learningStyle === st.id
                                ? 'bg-pink-600 text-white shadow-md'
                                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Botón de Guardado Prominente */}
                    <button
                      type="button"
                      onClick={() => handleSaveChildProfile(childProfile)}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-black text-xs transition-all shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Guardar Ficha e Inyectar Contexto en la IA 👧✨</span>
                    </button>

                  </div>
                )}

                {/* TAB 👤 PERFIL & AVATARES DE ALTA TECNOLOGÍA */}
                {activeTab === 'cuenta' && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="bg-slate-900/50 border border-indigo-500/30 rounded-2xl p-4 flex items-center gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-950 border-2 border-indigo-500 flex items-center justify-center text-3xl shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.5)] relative overflow-hidden">
                        {selectedAvatar}
                        <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold text-base text-white truncate">{user?.displayName || 'Estudiante GOALS'}</h3>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                        <p className={`text-[10px] font-extrabold ${rank.color} mt-0.5`}>{rank.title}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                      <h4 className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Datos del Perfil Único</span>
                      </h4>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">Nombre de Usuario</label>
                        <input 
                          type="text" 
                          value={newDisplayName}
                          onChange={(e) => setNewDisplayName(e.target.value)}
                          placeholder="Tu nombre o apodo de astronauta..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none transition-all font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-amber-300 mb-1 flex items-center justify-between">
                          <span>Edad del Estudiante / Niño</span>
                          <span className="text-[9px] text-slate-400 font-normal">Ajusta el lenguaje de la IA</span>
                        </label>
                        <select
                          value={childAge}
                          onChange={(e) => handleAgeChange(parseInt(e.target.value, 10))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/40 text-xs text-amber-200 font-bold focus:border-amber-400 outline-none transition-all cursor-pointer"
                        >
                          {Array.from({ length: 11 }, (_, i) => i + 6).map((age) => (
                            <option key={age} value={age} className="bg-slate-900 text-white">
                              {age} Años {age <= 9 ? '(Primaria Inicial - Frases sencillas)' : age <= 13 ? '(Primaria / ESO - Dinámico)' : '(Secundaria - Analítico y Conciso)'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button 
                        onClick={handleSaveProfile}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all active:scale-95 shadow-md shadow-indigo-600/30 cursor-pointer"
                      >
                        Guardar Cambios de Perfil
                      </button>
                    </div>

                    {/* Galería de Avatares Futuristas Cyberpunk */}
                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                      <h4 className="text-[10px] font-extrabold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Colección de Avatares Cyberpunk & Galácticos</span>
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Selecciona un avatar futurista para que sustituya tu foto de perfil en toda la plataforma:
                      </p>
                      <div className="grid grid-cols-5 gap-2">
                        {AVATAR_OPTIONS.map((av) => (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => {
                              setSelectedAvatar(av.icon);
                              updateUserProfileData(newDisplayName.trim() || 'Estudiante', av.icon);
                              showToast(`Avatar ${av.label} seleccionado`);
                            }}
                            title={av.label}
                            className={`p-2 rounded-2xl bg-slate-950 border flex flex-col items-center justify-center text-xl transition-all cursor-pointer group ${
                              selectedAvatar === av.icon 
                                ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_15px_rgba(34,211,238,0.5)] scale-105' 
                                : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <span>{av.icon}</span>
                            <span className="text-[8px] font-bold text-slate-400 group-hover:text-white truncate w-full text-center mt-1">{av.label.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={signOut}
                      className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs transition-all cursor-pointer"
                    >
                      Cerrar Sesión
                    </button>
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
