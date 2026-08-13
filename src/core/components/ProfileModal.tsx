import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { 
  X, Zap, Check, Gift, Download, Brain, RefreshCw, CheckCircle2, Sliders, Volume2, 
  Target, Flame, Star, Bot, User, Smartphone, ShieldCheck, Sparkles, Award, BarChart3,
  Eye, Headphones, Wrench, BookOpen, Compass, Orbit
} from 'lucide-react';
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
  { id: 'astrobot', label: 'AstroBot', iconComp: Bot, color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10' },
  { id: 'astronaut', label: 'Astronauta', iconComp: User, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
  { id: 'dragon', label: 'Dragón', iconComp: Sparkles, color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' },
  { id: 'owl', label: 'Búho', iconComp: Eye, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
  { id: 'compass', label: 'Explorador', iconComp: Compass, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
  { id: 'orbit', label: 'Cosmos', iconComp: Orbit, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
  { id: 'zap', label: 'Energía', iconComp: Zap, color: 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10' },
  { id: 'shield', label: 'Guardián', iconComp: ShieldCheck, color: 'text-teal-400 border-teal-500/40 bg-teal-500/10' },
  { id: 'star', label: 'Estelar', iconComp: Star, color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
  { id: 'award', label: 'Maestro', iconComp: Award, color: 'text-pink-400 border-pink-500/40 bg-pink-500/10' }
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

  const [childProfile, setChildProfileState] = useState<ChildLearningProfile>(() => getChildProfile());

  const handleSaveChildProfile = (updated: ChildLearningProfile) => {
    setChildProfileState(updated);
    setChildProfile(updated);
    showToast('Ficha del Alumno guardada e inyectada en la IA');
  };

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
    return localStorage.getItem('goals_mascot_soul') || `Eres ${skinName}, un mentor didáctico y sabio experto en ciencia, idiomas y tecnología. Explicas conceptos complejos con analogías claras.`;
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
    showToast("Personalidad IA actualizada");
  };

  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.photoURL || 'astrobot');
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
      showToast("Perfil de usuario actualizado");
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const currentAvatarConfig = AVATAR_OPTIONS.find(a => a.id === selectedAvatar || a.label === selectedAvatar) || AVATAR_OPTIONS[0];
  const CurrentAvatarIcon = currentAvatarConfig.iconComp;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-display">
        <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${currentAvatarConfig.color} shadow-sm shrink-0`}>
                <CurrentAvatarIcon className="w-5 h-5" />
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

          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            
            <div className="flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold overflow-x-auto scrollbar-none shrink-0">
              <button 
                onClick={() => setActiveTab('retos')}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${activeTab === 'retos' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <Target className="w-4 h-4 text-amber-400" />
                <span>Retos</span>
              </button>
              <button 
                onClick={() => setActiveTab('racha')}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${activeTab === 'racha' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Racha</span>
              </button>
              <button 
                onClick={() => setActiveTab('stats')}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${activeTab === 'stats' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <BarChart3 className="w-4 h-4 text-amber-300" />
                <span>Estadísticas</span>
              </button>
              <button 
                onClick={() => setActiveTab('mascota')}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${activeTab === 'mascota' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <Bot className="w-4 h-4 text-purple-300" />
                <span>Mascota</span>
              </button>
              <button 
                onClick={() => setActiveTab('ficha_niño')}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${activeTab === 'ficha_niño' ? 'bg-pink-600 text-white shadow-sm' : 'text-pink-300 hover:text-white'}`}
              >
                <Brain className="w-4 h-4 text-pink-300" />
                <span>Ficha Alumno</span>
              </button>
              <button 
                onClick={() => setActiveTab('cuenta')}
                className={`px-3 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${activeTab === 'cuenta' ? 'bg-cyan-600 text-white shadow-sm' : 'text-cyan-300 hover:text-white'}`}
              >
                <User className="w-4 h-4 text-cyan-300" />
                <span>Perfil</span>
              </button>
              {user?.email === 'josferestudio@gmail.com' && (
                <button 
                  onClick={() => { onClose(); onOpenAdminDashboard(); }}
                  className="px-3 py-2 rounded-xl transition-all whitespace-nowrap text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1.5 ml-auto cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin</span>
                </button>
              )}
            </div>

            {isGuest ? (
               <div className="bg-slate-900/50 border border-indigo-500/30 rounded-2xl p-5 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto border border-indigo-500/40 text-indigo-400 shadow-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white mb-0.5">
                      {authMode === 'login' ? 'Iniciar Sesión en GOALS' : 'Crear tu Cuenta GOALS'}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-tight">
                      Guarda tus estrellas, racha y XP en la nube en todo el ecosistema.
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
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm disabled:opacity-50 active:scale-95 cursor-pointer"
                    >
                      {isSubmitting ? 'Procesando...' : authMode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                    </button>
                  </form>

                  <div className="relative py-0.5">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                    <div className="relative flex justify-center text-[9px] uppercase text-slate-500 font-bold bg-slate-950 px-2">o bien</div>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      setIsSubmitting(true);
                      try {
                        await signInWithGoogle();
                        showToast("Sesión iniciada con Google");
                      } catch (e) {
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 active:scale-95 cursor-pointer"
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
                      className="text-indigo-400 hover:text-indigo-300 font-bold text-xs cursor-pointer"
                    >
                      {authMode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión aquí'}
                    </button>
                  </div>
               </div>
            ) : (
              <>
                {activeTab === 'retos' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-3.5 text-center relative overflow-hidden">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-amber-300 flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-amber-400" /> {userData.xp} XP Acumulados
                        </span>
                        <span className="font-bold text-indigo-300 text-[10px]">
                          Nivel {rank.level}: {rank.title}
                        </span>
                      </div>

                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div 
                          className="bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-500 h-full transition-all duration-500 rounded-full" 
                          style={{ width: `${Math.min(100, (userData.xp / rank.nextXp) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider px-1">
                        <span>Misiones del Día</span>
                        <span className="text-amber-400 text-[10px]">Reclamar XP</span>
                      </div>

                      {retosList.map((r) => (
                        <div 
                          key={r.id}
                          className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                            r.claimed
                              ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                              : r.cond
                              ? 'bg-slate-900/80 border-emerald-500/40 shadow-sm'
                              : 'bg-slate-900/60 border-slate-800/80'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-indigo-400 shrink-0">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-xs text-white truncate">{r.title}</h4>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{r.desc}</p>
                            </div>
                          </div>

                          <div className="shrink-0">
                            {r.claimed ? (
                              <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-400 font-bold text-[10px] flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-400" /> Reclamado
                              </span>
                            ) : r.cond ? (
                              <button
                                onClick={() => claimReto(r.id, r.xp)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer"
                              >
                                <Gift className="w-3 h-3" /> +{r.xp} XP
                              </button>
                            ) : (
                              <span className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-amber-400/80 font-bold text-[10px]">
                                +{r.xp} XP
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'racha' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="bg-slate-900/60 border border-rose-500/20 rounded-2xl p-5 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto shadow-sm">
                        <Flame className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-2xl text-white">{userData.streak} Días de Racha</h3>
                        <p className="text-xs text-slate-400">Conéctate diariamente para mantener tu racha activa.</p>
                      </div>

                      <div className="pt-3 border-t border-slate-800">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Actividad de la Semana</div>
                        <div className="flex justify-center gap-2">
                          {WEEKDAYS.map((day, idx) => {
                            const active = userData.weeklyActivity?.[idx];
                            return (
                              <div key={day} className="flex flex-col items-center gap-1">
                                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center text-xs font-bold transition-all ${
                                  active 
                                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' 
                                    : 'bg-slate-950 border-slate-800 text-slate-600'
                                }`}>
                                  {active ? <Flame className="w-4 h-4 text-rose-400" /> : day}
                                </div>
                                <span className="text-[9px] text-slate-500 font-medium">{day}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400">
                          <Star className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white">{currentStars} / {maxPossibleStars} Estrellas</h4>
                          <p className="text-[10px] text-slate-400">Consigue estrellas completando evaluaciones formativas</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-400/20 text-xs font-bold">
                        {Math.round((currentStars / (maxPossibleStars || 1)) * 100)}%
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center space-y-2.5">
                      <h3 className="font-bold text-sm text-white flex items-center justify-center gap-2">
                        <BarChart3 className="w-4 h-4 text-indigo-400" />
                        <span>Métricas del Ecosistema</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Experiencia acumulada, días de racha y progreso en tiempo real.
                      </p>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <p className="text-[10px] text-slate-400 font-medium">XP Total</p>
                          <p className="font-bold text-sm text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                            <Zap className="w-3.5 h-3.5 text-amber-400" /> {userData.xp}
                          </p>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <p className="text-[10px] text-slate-400 font-medium">Racha</p>
                          <p className="font-bold text-sm text-rose-400 flex items-center justify-center gap-1 mt-0.5">
                            <Flame className="w-3.5 h-3.5 text-rose-400" /> {userData.streak} D
                          </p>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <p className="text-[10px] text-slate-400 font-medium">Estrellas</p>
                          <p className="font-bold text-sm text-yellow-400 flex items-center justify-center gap-1 mt-0.5">
                            <Star className="w-3.5 h-3.5 text-yellow-400" /> {totalStars()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider px-1">
                        Progreso por Área
                      </h4>

                      {Object.values(GOALS_EXPERIENCES).map((exp) => {
                        const IconComp = exp.icon;
                        const expXp = userData.experiences?.[exp.id]?.xp || (exp.id === 'astro' ? userData.xp : 0);
                        return (
                          <div 
                            key={exp.id} 
                            className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 ${exp.iconColorClass}`}>
                                <IconComp className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="font-bold text-xs text-white">{exp.name}</h5>
                                <p className="text-[10px] text-slate-400">{exp.tagline}</p>
                              </div>
                            </div>

                            <div className="text-right space-y-0.5">
                              <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold ${exp.badgeClass}`}>
                                {exp.badge}
                              </span>
                              <div className="flex items-center gap-1 text-amber-400 font-bold text-xs justify-end">
                                <Zap className="w-3 h-3 text-amber-400" />
                                <span>{expXp} XP</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'mascota' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-5 text-center space-y-3 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-purple-400" />
                          <h3 className="font-bold text-xs text-white">Vista Previa de Mascota</h3>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-300 text-[10px] font-bold border border-purple-500/20">
                          {MASCOT_SKINS[mascotSkinId]?.name}
                        </span>
                      </div>

                      <div className="w-32 h-32 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto relative group">
                        <MascotPet skinId={mascotSkinId} animState={mascotAnimState} scale={mascotScale} />
                      </div>

                      <p className="text-xs text-slate-300 font-medium max-w-sm mx-auto">
                        {MASCOT_SKINS[mascotSkinId]?.subtitle}
                      </p>

                      <div className="flex items-center justify-center gap-1.5 pt-1">
                        {(['idle', 'hover', 'thinking', 'speaking', 'dragging'] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setMascotAnimState(st)}
                            className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold capitalize transition-all cursor-pointer ${
                              mascotAnimState === st
                                ? 'bg-purple-600 text-white shadow-sm'
                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5 text-purple-400" />
                          <span>Nombre de tu Mascota</span>
                        </h4>
                      </div>
                      <input
                        type="text"
                        value={customMascotName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomMascotNameState(val);
                          setCustomMascotName(val);
                        }}
                        placeholder="Ej. Búho Sabio, AstroBot..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-white focus:border-purple-400 outline-none transition-colors"
                      />
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>Selecciona Skin de Mascota</span>
                      </h4>

                      <div className="grid grid-cols-2 gap-2">
                        {Object.values(MASCOT_SKINS).map((skin) => (
                          <button
                            key={skin.id}
                            type="button"
                            onClick={() => handleSelectMascotSkin(skin.id as MascotSkinId)}
                            className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                              mascotSkinId === skin.id
                                ? 'bg-purple-950/40 border-purple-500/80 shadow-sm'
                                : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                            }`}
                          >
                            <div className="p-1.5 bg-slate-900 rounded-lg border border-slate-800 text-purple-400 shrink-0">
                              <Bot className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-xs text-white truncate">{skin.name}</h5>
                              <p className="text-[9px] text-slate-400 truncate">{skin.subtitle}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                          <Brain className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Personalidad IA (System Prompt)</span>
                        </h4>
                      </div>

                      <textarea
                        rows={3}
                        value={mascotSoulPrompt}
                        onChange={(e) => handleSoulPromptChange(e.target.value)}
                        placeholder="Escribe el tono de personalidad de tu Mascota IA..."
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 outline-none font-sans"
                      />
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                        <span className="flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-purple-400" />
                          <span>Tamaño en Pantalla</span>
                        </span>
                        <span className="font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 text-[10px]">{mascotScale.toFixed(1)}x</span>
                      </div>
                      <input
                        type="range"
                        min={0.6}
                        max={2.5}
                        step={0.1}
                        value={mascotScale}
                        onChange={(e) => handleScaleChange(parseFloat(e.target.value))}
                        className="w-full h-1.5 accent-purple-500 cursor-pointer"
                      />
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                          <span>Sintetizador de Voz</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            if ('speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                              const skin = MASCOT_SKINS[mascotSkinId];
                              const nameToSay = customMascotName || skin.name;
                              const greetingName = childProfile.childName ? ` ${childProfile.childName}` : '';
                              const utt = new SpeechSynthesisUtterance(`Hola${greetingName}. Soy ${nameToSay}.`);
                              utt.lang = 'es-ES';
                              utt.pitch = mascotPitch;
                              utt.rate = mascotRate;
                              setMascotAnimState('speaking');
                              utt.onend = () => setMascotAnimState('idle');
                              window.speechSynthesis.speak(utt);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>Probar Voz</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">Tono: {mascotPitch.toFixed(2)}</label>
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

                {activeTab === 'ficha_niño' && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-1.5">
                      <h3 className="font-bold text-xs text-white flex items-center gap-2">
                        <Brain className="w-4 h-4 text-pink-400" />
                        <span>Ficha y Preferencias de Aprendizaje</span>
                      </h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Esta información personaliza el tono, las analogías y los ejemplos prácticos de la IA en todas las asignaturas.
                      </p>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                      <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-pink-400" />
                        <span>1. Datos del Estudiante</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">Nombre</label>
                          <input
                            type="text"
                            value={childProfile.childName}
                            onChange={(e) => setChildProfileState({ ...childProfile, childName: e.target.value })}
                            placeholder="Ej. Mateo..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-pink-500 outline-none transition-colors font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">Edad ({childProfile.age} Años)</label>
                          <select
                            value={childProfile.age}
                            onChange={(e) => setChildProfileState({ ...childProfile, age: parseInt(e.target.value, 10) })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 font-bold focus:border-pink-500 outline-none transition-colors cursor-pointer"
                          >
                            {Array.from({ length: 11 }, (_, i) => i + 6).map((a) => (
                              <option key={a} value={a} className="bg-slate-900 text-white">
                                {a} Años
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">Centro Educativo</label>
                          <input
                            type="text"
                            value={childProfile.schoolName}
                            onChange={(e) => setChildProfileState({ ...childProfile, schoolName: e.target.value })}
                            placeholder="Ej. CEIP..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-pink-500 outline-none transition-colors font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-300 mb-1">Curso Actual</label>
                          <select
                            value={childProfile.grade}
                            onChange={(e) => setChildProfileState({ ...childProfile, grade: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-300 font-bold focus:border-pink-500 outline-none transition-colors cursor-pointer"
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

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-emerald-400" />
                        <span>2. Asignaturas Favoritas</span>
                      </h4>
                      
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
                                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {sub}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-amber-400" />
                        <span>3. Asignaturas a Reforzar</span>
                      </h4>
                      
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
                                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              {sub}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                      <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider">
                        4. Estilo de Aprendizaje
                      </h4>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { id: 'visual', label: 'Visual', icon: Eye },
                          { id: 'auditivo', label: 'Auditivo', icon: Headphones },
                          { id: 'practico', label: 'Práctico', icon: Wrench },
                          { id: 'general', label: 'General', icon: BookOpen }
                        ].map((st) => {
                          const StyleIcon = st.icon;
                          return (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => setChildProfileState({ ...childProfile, learningStyle: st.id as any })}
                              className={`py-2 rounded-xl text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                                childProfile.learningStyle === st.id
                                  ? 'bg-pink-600 text-white shadow-sm'
                                  : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                              }`}
                            >
                              <StyleIcon className="w-3.5 h-3.5" />
                              <span>{st.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveChildProfile(childProfile)}
                      className="w-full py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Guardar Ficha del Alumno</span>
                    </button>
                  </div>
                )}

                {activeTab === 'cuenta' && (
                  <div className="space-y-3.5 animate-fadeIn">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
                      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${currentAvatarConfig.color} shrink-0`}>
                        <CurrentAvatarIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-white truncate">{user?.displayName || 'Estudiante GOALS'}</h3>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                        <p className={`text-[10px] font-bold ${rank.color} mt-0.5`}>{rank.title}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-3">
                      <h4 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Datos de la Cuenta</span>
                      </h4>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">Nombre de Usuario</label>
                        <input 
                          type="text" 
                          value={newDisplayName}
                          onChange={(e) => setNewDisplayName(e.target.value)}
                          placeholder="Tu nombre..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-indigo-500 outline-none transition-colors font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1">Edad Adaptativa</label>
                        <select
                          value={childAge}
                          onChange={(e) => handleAgeChange(parseInt(e.target.value, 10))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-200 font-bold focus:border-indigo-500 outline-none transition-colors cursor-pointer"
                        >
                          {Array.from({ length: 11 }, (_, i) => i + 6).map((age) => (
                            <option key={age} value={age} className="bg-slate-900 text-white">
                              {age} Años
                            </option>
                          ))}
                        </select>
                      </div>

                      <button 
                        onClick={handleSaveProfile}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all active:scale-95 shadow-sm cursor-pointer"
                      >
                        Guardar Cambios
                      </button>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
                      <h4 className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Colección de Avatares</span>
                      </h4>
                      <div className="grid grid-cols-5 gap-2">
                        {AVATAR_OPTIONS.map((av) => {
                          const IconC = av.iconComp;
                          const isSelected = selectedAvatar === av.id || selectedAvatar === av.label;
                          return (
                            <button
                              key={av.id}
                              type="button"
                              onClick={() => {
                                setSelectedAvatar(av.id);
                                updateUserProfileData(newDisplayName.trim() || 'Estudiante', av.id);
                                showToast(`Avatar ${av.label} seleccionado`);
                              }}
                              title={av.label}
                              className={`p-2 rounded-xl bg-slate-950 border flex flex-col items-center justify-center transition-all cursor-pointer group ${
                                isSelected 
                                  ? 'border-cyan-400 bg-cyan-950/40 shadow-sm scale-105' 
                                  : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                              }`}
                            >
                              <IconC className={`w-5 h-5 ${av.color.split(' ')[0]}`} />
                              <span className="text-[8px] font-bold text-slate-400 group-hover:text-white truncate w-full text-center mt-1">{av.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={signOut}
                      className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 font-bold text-xs transition-all cursor-pointer"
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

      <ApkDownloadGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </>
  );
};
