import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { db, doc, setDoc, onSnapshot } from '../config/firebase';
import { UserData, LessonProgress, EvolutionEntry, RetoItem, RankInfo, ExperienceId } from '../types';
import { LESSONS } from '../../experiences/astro/data/lessonsData';
import { checkStreak } from '../../experiences/astro/utils/streak';
import { PresentationEngine } from '../services/PresentationEngine';
import {
  GamificationEngine,
  getCosmicRank,
  getHarmonyFactor,
  isMasterKeyActiveToday,
  getMasterKeyMultiplier
} from '../services/GamificationEngine';
import { entitlementService } from '../services/EntitlementService';
import {
  DomainCurrencies,
  MasterKeyStatus,
  CosmicRankInfo,
  GoalsEntitlements,
  GoalsPlanId,
  DEFAULT_CURRENCIES,
  DEFAULT_MASTER_KEY,
  DEFAULT_ENTITLEMENTS,
  EXPERIENCE_CURRENCY,
  DomainCurrencyId
} from '../types/gamification';

interface ProgressContextType {
  userData: UserData;
  adminBypass: boolean;
  toggleAdminBypass: () => void;
  adminSimulatedAge: number | null;
  setAdminSimulatedAge: (age: number | null) => void;
  isUserAdmin: boolean;
  effectiveAge: number;
  lessonProg: (id: number) => LessonProgress;
  lessonUnlocked: (id: number) => boolean;
  isLessonUnlocked: (id: number) => boolean;
  isTestUnlocked: (id: number) => boolean;
  completeStep: (lessonId: number, stepIndex?: number) => void;
  finishTest: (lessonId: number, score: number, total: number) => { stars: number; xpGained: number; isFirstCompletion: boolean };
  totalStars: () => number;
  maxStars: () => number;
  claimReto: (id: string, xpReward: number) => void;
  getRankInfo: (xp: number) => RankInfo;
  getRetosList: () => RetoItem[];
  addXP: (amount: number, expId?: ExperienceId | string, reason?: string) => void;
  addCustomEvolution: (entry: Omit<EvolutionEntry, 'id' | 'timestamp' | 'dateStr'>) => void;
  saveChildProfileData: (profile: Record<string, any>) => void;
  saveMascotData: (mascot: Record<string, any>) => void;
  toastMsg: string | null;
  showToast: (msg: string) => void;
  hideToast: () => void;
  resetProgress: () => void;
  // ── Gamificación Unificada GOALS ──
  currencies: DomainCurrencies;
  masterKey: MasterKeyStatus;
  cosmicRank: CosmicRankInfo;
  harmonyFactor: number;
  masterKeyActive: boolean;
  entitlements: GoalsEntitlements;
  synergyBadges: Record<string, number>;
  canAccessExperience: (expId: ExperienceId | string) => boolean;
  activatePlan: (plan: GoalsPlanId) => void;
  registerSchoolSession: (session: { minutes: number; honestyScore: number; guessRate: number }) => void;
}

const getInitialWeeklyActivity = (): boolean[] => {
  const day = new Date().getDay(); // 0 = Dom, 1 = Lun, ... 6 = Sab
  const weekdayIndex = day === 0 ? 6 : day - 1; // Lun=0 ... Dom=6
  const activity = [false, false, false, false, false, false, false];
  activity[weekdayIndex] = true;
  return activity;
};

const updateWeeklyActivityToday = (current?: boolean[]): boolean[] => {
  const day = new Date().getDay();
  const weekdayIndex = day === 0 ? 6 : day - 1;
  const base = current && current.length === 7 ? [...current] : [false, false, false, false, false, false, false];
  base[weekdayIndex] = true;
  return base;
};

const DEFAULT_USER_DATA: UserData = {
  xp: 0,
  streak: 1,
  lastDay: new Date().toDateString(),
  claimedRetos: {},
  weeklyActivity: getInitialWeeklyActivity(),
  experiences: {
    astro: { xp: 0, lessons: {} },
    school: { xp: 0, lessons: {} },
    languages: { xp: 0, lessons: {} },
    verify: { xp: 0, lessons: {} },
    'ai-lab': { xp: 0, lessons: {} }
  },
  lessons: {},
  evolutions: []
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const getRankInfo = (xp: number): RankInfo => {
  if (xp >= 1000) return { title: 'Astrofísico Principal 🌌', level: 5, color: 'text-purple-300', nextXp: 2000 };
  if (xp >= 600) return { title: 'Comandante de Misión 🛸', level: 4, color: 'text-cyan-300', nextXp: 1000 };
  if (xp >= 300) return { title: 'Piloto Lunar 🚀', level: 3, color: 'text-indigo-300', nextXp: 600 };
  if (xp >= 100) return { title: 'Cadete Espacial 👨‍🚀', level: 2, color: 'text-emerald-300', nextXp: 300 };
  return { title: 'Novato de la Tierra 🌍', level: 1, color: 'text-amber-300', nextXp: 100 };
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isCloud } = useAuth();
  const [userData, setUserData] = useState<UserData>(DEFAULT_USER_DATA);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const isSyncingFromRemote = useRef(false);

  const dataKey = useCallback(() => 'goals_data_' + (user?.uid || 'guest'), [user]);
  const legacyKey = useCallback(() => 'al_data_' + (user?.uid || 'guest'), [user]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 4500);
  }, []);

  const hideToast = useCallback(() => {
    setToastMsg(null);
  }, []);

  const sanitizeExperienceKey = (expId: string): string => {
    if (expId === 'aiLab') return 'ai-lab';
    return expId;
  };

  const persistData = useCallback(async (data: UserData) => {
    // 1. Persistencia síncrona en LocalStorage
    try {
      localStorage.setItem(dataKey(), JSON.stringify(data));
      localStorage.setItem(legacyKey(), JSON.stringify({
        xp: data.xp,
        streak: data.streak,
        lastDay: data.lastDay,
        claimedRetos: data.claimedRetos || {},
        lessons: data.experiences?.astro?.lessons || data.lessons || {}
      }));
    } catch (e) {
      console.warn("LocalStorage save error", e);
    }

    // 2. Persistencia en la nube con Firestore Merge
    if (isCloud && db && user?.uid && !user.isAnonymous) {
      try {
        await setDoc(doc(db, 'users', user.uid), data, { merge: true });
      } catch (err) {
        console.warn("Firestore save error", err);
      }
    }
  }, [dataKey, legacyKey, isCloud, user]);

  // SUSCRIPCIÓN EN TIEMPO REAL CON onSnapshot (Firestore)
  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    // Cargar datos locales de arranque inmediato
    try {
      const raw = localStorage.getItem(dataKey()) || localStorage.getItem(legacyKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        setUserData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {}

    if (isCloud && db && user?.uid && !user.isAnonymous) {
      const userDocRef = doc(db, 'users', user.uid);
      unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data() as UserData;
          isSyncingFromRemote.current = true;
          
          setUserData((prev) => {
            const merged: UserData = {
              ...DEFAULT_USER_DATA,
              ...prev,
              ...remoteData,
              weeklyActivity: updateWeeklyActivityToday(remoteData.weeklyActivity || prev.weeklyActivity),
              experiences: {
                ...DEFAULT_USER_DATA.experiences,
                ...(prev.experiences || {}),
                ...(remoteData.experiences || {})
              },
              evolutions: remoteData.evolutions || prev.evolutions || []
            };

            const streakRes = checkStreak(merged.lastDay, merged.streak);
            merged.streak = streakRes.streak;
            merged.lastDay = streakRes.lastDay;

            if (user?.email === 'josferestudio@gmail.com') {
              merged.isApproved = true;
            }

            try {
              localStorage.setItem(dataKey(), JSON.stringify(merged));
            } catch (e) {}

            return merged;
          });

          setTimeout(() => { isSyncingFromRemote.current = false; }, 100);
        } else {
          // Documento inicial nuevo en Firestore
          const initial = { ...DEFAULT_USER_DATA, email: user.email, displayName: user.displayName };
          setDoc(userDocRef, initial, { merge: true }).catch(console.warn);
        }
      }, (err) => {
        console.warn("Error en suscripción Firestore onSnapshot:", err);
      });
    }

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    };
  }, [user, isCloud, dataKey, legacyKey]);

  const getAstroLessons = (data: UserData) => {
    return data.experiences?.astro?.lessons || data.lessons || {};
  };

  const [adminBypass, setAdminBypass] = useState<boolean>(() => {
    try {
      return localStorage.getItem('goals_admin_bypass') === 'true';
    } catch {
      return false;
    }
  });

  const toggleAdminBypass = useCallback(() => {
    setAdminBypass(prev => {
      const next = !prev;
      try {
        localStorage.setItem('goals_admin_bypass', String(next));
      } catch {}
      return next;
    });
  }, []);

  const [adminSimulatedAge, setAdminSimulatedAgeState] = useState<number | null>(() => {
    try {
      const stored = localStorage.getItem('goals_admin_simulated_age');
      return stored ? parseInt(stored, 10) : null;
    } catch {
      return null;
    }
  });

  const setAdminSimulatedAge = useCallback((age: number | null) => {
    setAdminSimulatedAgeState(age);
    try {
      if (age !== null) {
        localStorage.setItem('goals_admin_simulated_age', String(age));
      } else {
        localStorage.removeItem('goals_admin_simulated_age');
      }
    } catch {}
  }, []);

  const isUserAdmin = Boolean(user?.email === 'josferestudio@gmail.com' || userData?.role === 'admin');
  const effectiveAge = (isUserAdmin && adminSimulatedAge !== null)
    ? adminSimulatedAge
    : (userData?.childProfile?.age || 9);

  const lessonProg = (id: number): LessonProgress => {
    const astroLessons = getAstroLessons(userData);
    return astroLessons[id] || { steps: 0, testDone: false, stars: 0 };
  };

  const lessonUnlocked = (id: number): boolean => {
    if (id === 1) return true;
    if (isUserAdmin) return true; // SuperAdmin siempre tiene acceso a todos los niveles
    const prevProg = lessonProg(id - 1);
    const prevDef = LESSONS.find(l => l.id === id - 1);
    const maxSteps = prevDef ? prevDef.steps.length : 4;
    return Boolean(prevProg.testDone || prevProg.read || prevProg.steps >= maxSteps);
  };

  const isLessonUnlocked = lessonUnlocked;

  const isTestUnlocked = (id: number): boolean => {
    if (isUserAdmin) return true; // SuperAdmin siempre tiene acceso a todos los tests
    if (!isLessonUnlocked(id)) return false;
    if (id === 1) return true;
    const current = lessonProg(id);
    const lessonDef = LESSONS.find((l) => l.id === id);
    const maxSteps = lessonDef ? lessonDef.steps.length : 4;
    return Boolean(current.read || current.steps >= maxSteps || current.testDone);
  };

  const completeStep = (lessonId: number, stepIndex?: number) => {
    const lessonDef = LESSONS.find((l) => l.id === lessonId);
    const maxSteps = lessonDef ? lessonDef.steps.length : 4;

    setUserData((prev) => {
      const astroLessons = { ...getAstroLessons(prev) };
      const current = astroLessons[lessonId] || { steps: 0, testDone: false, stars: 0, read: false };
      
      const newSteps = stepIndex !== undefined ? Math.max(current.steps, stepIndex + 1) : Math.min(maxSteps, current.steps + 1);
      const isNewlyFinished = newSteps >= maxSteps && !current.read;
      const addedXp = isNewlyFinished ? 25 : 5;
      const newXp = prev.xp + addedXp;

      astroLessons[lessonId] = { 
        ...current, 
        steps: newSteps,
        read: current.read || isNewlyFinished
      };

      const newEvolutions: EvolutionEntry[] = [...(prev.evolutions || [])];
      if (isNewlyFinished) {
        showToast(`📖 ¡Lección ${lessonId} leída! (+25 XP y Test desbloqueado)`);
        newEvolutions.unshift({
          id: 'evo_' + Date.now(),
          timestamp: Date.now(),
          dateStr: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          type: 'lesson_finished',
          title: `📖 Cosmos 3D - Lección ${lessonId}: ${lessonDef?.title || 'Completada'}`,
          xpEarned: 25,
          experienceId: 'astro',
          details: `Completada lectura de ${maxSteps} pasos conceptuales`
        });
      }

      const updated: UserData = {
        ...prev,
        xp: newXp,
        weeklyActivity: updateWeeklyActivityToday(prev.weeklyActivity),
        lessons: astroLessons,
        experiences: {
          ...prev.experiences,
          astro: {
            xp: ((prev.experiences?.astro?.xp || 0) + addedXp),
            lessons: astroLessons
          }
        },
        evolutions: newEvolutions
      };

      persistData(updated);
      return updated;
    });
  };

  const finishTest = (lessonId: number, score: number, total: number) => {
    const pct = score / total;
    const stars = pct >= 0.99 ? 3 : pct >= 0.6 ? 2 : 1;
    const xpGained = score * 15 + 10;
    const lessonDef = LESSONS.find((l) => l.id === lessonId);
    let isFirstCompletion = false;

    setUserData((prev) => {
      const astroLessons = { ...getAstroLessons(prev) };
      const current = astroLessons[lessonId] || { steps: 0, testDone: false, stars: 0 };
      isFirstCompletion = !current.testDone;

      const newStars = Math.max(current.stars || 0, stars);
      astroLessons[lessonId] = { ...current, testDone: true, stars: newStars, score };

      const starsEmoji = stars === 3 ? '⭐⭐⭐' : stars === 2 ? '⭐⭐' : '⭐';
      const evolutionTitle = `⭐ Superado Test de ${lessonDef?.title || `Lección ${lessonId}`} con ${stars} ${stars === 1 ? 'estrella' : 'estrellas'} (+${xpGained} XP)`;

      const newEvolutions: EvolutionEntry[] = [
        {
          id: 'evo_' + Date.now(),
          timestamp: Date.now(),
          dateStr: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          type: 'test_completed',
          title: evolutionTitle,
          score: `${score}/${total}`,
          stars,
          xpEarned: xpGained,
          experienceId: 'astro',
          details: `Aciertos: ${score} de ${total} preguntas (${Math.round(pct * 100)}%)`
        },
        ...(prev.evolutions || [])
      ];

      const updated: UserData = {
        ...prev,
        xp: prev.xp + xpGained,
        weeklyActivity: updateWeeklyActivityToday(prev.weeklyActivity),
        lessons: astroLessons,
        experiences: {
          ...prev.experiences,
          astro: {
            xp: (prev.experiences?.astro?.xp || 0) + xpGained,
            lessons: astroLessons
          }
        },
        evolutions: newEvolutions
      };

      showToast(`🎉 ¡${starsEmoji} Test superado! (+${xpGained} XP)`);
      persistData(updated);
      return updated;
    });

    return { stars, xpGained, isFirstCompletion };
  };

  const totalStars = () => {
    const astroLessons = getAstroLessons(userData);
    return Object.values(astroLessons).reduce((acc, l) => acc + (l.stars || 0), 0);
  };

  const maxStars = () => LESSONS.length * 3;

  const claimReto = (id: string, xpReward: number) => {
    setUserData((prev) => {
      const claimed = { ...(prev.claimedRetos || {}) };
      if (claimed[id]) return prev;

      claimed[id] = true;
      const newXp = prev.xp + xpReward;

      const retos = getRetosList();
      const retoDef = retos.find(r => r.id === id);

      const newEvolutions: EvolutionEntry[] = [
        {
          id: 'evo_' + Date.now(),
          timestamp: Date.now(),
          dateStr: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          type: 'reto_claimed',
          title: `🏆 Reto Reclamado: ${retoDef?.title || 'Misión Cumplida'} (+${xpReward} XP)`,
          xpEarned: xpReward,
          experienceId: 'astro',
          details: retoDef?.desc || 'Reto de gamificación'
        },
        ...(prev.evolutions || [])
      ];

      const updated: UserData = {
        ...prev,
        xp: newXp,
        weeklyActivity: updateWeeklyActivityToday(prev.weeklyActivity),
        claimedRetos: claimed,
        evolutions: newEvolutions
      };

      showToast(`🎉 ¡Has reclamado +${xpReward} XP del reto "${retoDef?.title || ''}"!`);
      persistData(updated);
      return updated;
    });
  };

  const getRetosList = (): RetoItem[] => {
    const astroLessons = getAstroLessons(userData);
    const lessonValues = Object.values(astroLessons);
    const claimed = userData.claimedRetos || {};

    const RETOS: Omit<RetoItem, 'claimed'>[] = [
      { id: 'r1', icon: '🔥', title: 'Racha de Fuego', desc: 'Alcanza o mantén 3 días seguidos de racha.', xp: 50, cond: userData.streak >= 3 },
      { id: 'r2', icon: '⭐', title: 'Dominio de Artemis', desc: 'Consigue 3 estrellas en el Test de la Lección 1.', xp: 100, cond: astroLessons[1]?.stars === 3 },
      { id: 'r3', icon: '📖', title: 'Lectura Cósmica', desc: 'Completa al menos 2 lecciones de astrofísica.', xp: 75, cond: lessonValues.filter((l) => l.testDone || (l.steps && l.steps >= 3)).length >= 2 },
      { id: 'r4', icon: '🚀', title: 'Explorador 3D NASA', desc: 'Realiza cualquier test o lección en AstroLingo 3D.', xp: 120, cond: lessonValues.some((l) => l.testDone || l.steps > 0) },
      { id: 'r5', icon: '🏆', title: 'Examen Perfecto', desc: 'Supera cualquier test con el 100% de aciertos (3 estrellas).', xp: 150, cond: lessonValues.some((l) => l.stars === 3) }
    ];

    return RETOS.map((r) => ({
      ...r,
      claimed: !!claimed[r.id]
    }));
  };

  // addXP MULTI-EXPERIENCIA CON MOTOR UNIFICADO:
  // XP final = base × Φ_harmony × M_streak × M_school (Master Key)
  // + acreditación automática de la moneda de dominio correspondiente
  const addXP = useCallback((amount: number, expId: ExperienceId | string = 'astro', reason?: string) => {
    const cleanExpId = sanitizeExperienceKey(expId) as ExperienceId;

    setUserData((prev) => {
      const currencies: DomainCurrencies = { ...DEFAULT_CURRENCIES, ...(prev.currencies || {}) };
      const masterKey: MasterKeyStatus = { ...DEFAULT_MASTER_KEY, ...(prev.masterKey || {}) };

      // Ecuación de Fusión Universal (Φ se calcula sobre la distribución previa)
      const { finalXp, harmony, streakMult, schoolMult } = GamificationEngine.computeUniversalXp({
        baseXp: amount,
        currencies,
        masterKey,
        streak: prev.streak || 1
      });

      // Acreditar moneda de dominio
      const currencyId: DomainCurrencyId | undefined = EXPERIENCE_CURRENCY[cleanExpId];
      if (currencyId) {
        currencies[currencyId] = (currencies[currencyId] || 0) + amount;
      }

      const newXp = prev.xp + finalXp;
      const currentExperiences = prev.experiences || {};
      const expData = currentExperiences[cleanExpId] || { xp: 0, lessons: {} };
      const updatedExpXp = (expData.xp || 0) + finalXp;

      const EXP_NAMES: Record<string, string> = {
        astro: 'Cosmos 3D',
        school: 'Escuela IA',
        languages: 'Idiomas',
        verify: 'Criterio',
        criterio: 'Criterio',
        'ai-lab': 'IA Lab'
      };

      const expLabel = EXP_NAMES[cleanExpId] || cleanExpId;
      const multLabel = harmony > 1.01 || schoolMult > 1 || streakMult > 1
        ? ` (×${(harmony * streakMult * schoolMult).toFixed(2)})`
        : '';
      const evoTitle = reason
        ? `✨ [${expLabel}] ${reason} (+${finalXp} XP${multLabel})`
        : `✨ [${expLabel}] Progreso completado (+${finalXp} XP${multLabel})`;

      const newEvolutions: EvolutionEntry[] = [
        {
          id: 'evo_' + Date.now(),
          timestamp: Date.now(),
          dateStr: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          type: 'experience_activity',
          title: evoTitle,
          xpEarned: finalXp,
          experienceId: cleanExpId,
          details: reason || 'Actividad formativa'
        },
        ...(prev.evolutions || [])
      ];

      // Evaluar logros cruzados multi-app
      const earned = GamificationEngine.evaluateCrossAppBadges(currencies, prev.synergyBadges || {});
      const synergyBadges = { ...(prev.synergyBadges || {}) };
      for (const badge of earned) {
        synergyBadges[badge.id] = Date.now();
        newEvolutions.unshift({
          id: 'evo_badge_' + Date.now() + '_' + badge.id,
          timestamp: Date.now(),
          dateStr: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          type: 'streak_level',
          title: `${badge.icon} ¡Insignia desbloqueada: ${badge.name}!`,
          xpEarned: 0,
          experienceId: cleanExpId,
          details: badge.description
        });
      }
      if (earned.length > 0) {
        setTimeout(() => showToast(`${earned[0].icon} ¡Nueva insignia: ${earned[0].name}!`), 600);
      }

      const updated: UserData = {
        ...prev,
        xp: newXp,
        weeklyActivity: updateWeeklyActivityToday(prev.weeklyActivity),
        currencies,
        synergyBadges,
        experiences: {
          ...currentExperiences,
          [cleanExpId]: {
            ...expData,
            xp: updatedExpXp
          }
        },
        evolutions: newEvolutions
      };

      persistData(updated);
      if (reason) showToast(`+${finalXp} XP${multLabel}: ${reason}`);
      return updated;
    });
  }, [persistData, showToast]);

  // ── MASTER KEY: registrar sesión de School (reactor de 15 min) ──
  const registerSchoolSession = useCallback((session: { minutes: number; honestyScore: number; guessRate: number }) => {
    setUserData((prev) => {
      const mk: MasterKeyStatus = { ...DEFAULT_MASTER_KEY, ...(prev.masterKey || {}) };
      const next = GamificationEngine.evaluateMasterKeyActivation(mk, session, prev.streak || 1);
      const wasActive = isMasterKeyActiveToday(mk);
      const updated: UserData = { ...prev, masterKey: next };
      persistData(updated);
      if (next.isActive && !wasActive) {
        showToast(`🔑 ¡Llave Maestra activada! XP ×${next.multiplier} en todo el ecosistema.`);
      }
      return updated;
    });
  }, [persistData, showToast]);

  // ── ENTITLEMENTS / FREEMIUM ──
  const activatePlan = useCallback((plan: GoalsPlanId) => {
    setUserData((prev) => {
      const next = entitlementService.activatePlanSimulated(prev.entitlements, plan);
      const updated: UserData = { ...prev, entitlements: next };
      persistData(updated);
      if (plan !== 'free') {
        entitlementService.saveLocal(user?.uid || 'guest', next);
        showToast('🚀 ¡Plan GOALS activado! Todas las miniapps desbloqueadas.');
      }
      return updated;
    });
  }, [persistData, showToast, user]);

  const canAccessExperience = useCallback((expId: ExperienceId | string): boolean => {
    return entitlementService.canAccess(expId, userData.entitlements, isUserAdmin);
  }, [userData.entitlements, isUserAdmin]);

  const addCustomEvolution = useCallback((entry: Omit<EvolutionEntry, 'id' | 'timestamp' | 'dateStr'>) => {
    setUserData((prev) => {
      const newEvolutions: EvolutionEntry[] = [
        {
          ...entry,
          id: 'evo_' + Date.now(),
          timestamp: Date.now(),
          dateStr: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        },
        ...(prev.evolutions || [])
      ];
      const updated: UserData = { ...prev, evolutions: newEvolutions };
      persistData(updated);
      return updated;
    });
  }, [persistData]);

  const saveChildProfileData = useCallback((profile: Record<string, any>) => {
    setUserData((prev) => {
      const updated: UserData = { ...prev, childProfile: profile };
      persistData(updated);
      return updated;
    });
  }, [persistData]);

  const saveMascotData = useCallback((mascot: Record<string, any>) => {
    setUserData((prev) => {
      const updated: UserData = { ...prev, mascotConfig: mascot };
      persistData(updated);
      return updated;
    });
  }, [persistData]);

  const resetProgress = () => {
    const empty: UserData = JSON.parse(JSON.stringify(DEFAULT_USER_DATA));
    setUserData(empty);
    persistData(empty);
    showToast("Progreso reiniciado");
  };

  // ── Valores derivados del Sistema de Gamificación Unificado ──
  const currencies: DomainCurrencies = { ...DEFAULT_CURRENCIES, ...(userData.currencies || {}) };
  const masterKey: MasterKeyStatus = { ...DEFAULT_MASTER_KEY, ...(userData.masterKey || {}) };
  const cosmicRank: CosmicRankInfo = getCosmicRank(userData.xp || 0);
  const harmonyFactor: number = getHarmonyFactor(currencies);
  const masterKeyActive: boolean = isMasterKeyActiveToday(masterKey);
  const entitlements: GoalsEntitlements = { ...DEFAULT_ENTITLEMENTS, ...(userData.entitlements || {}) };
  const synergyBadges: Record<string, number> = userData.synergyBadges || {};

  return (
    <ProgressContext.Provider value={{
      userData,
      adminBypass,
      toggleAdminBypass,
      adminSimulatedAge,
      setAdminSimulatedAge,
      isUserAdmin,
      effectiveAge,
      lessonProg,
      lessonUnlocked,
      isLessonUnlocked,
      isTestUnlocked,
      completeStep,
      finishTest,
      totalStars,
      maxStars,
      claimReto,
      getRankInfo,
      getRetosList,
      addXP,
      addCustomEvolution,
      saveChildProfileData,
      saveMascotData,
      toastMsg,
      showToast,
      hideToast,
      resetProgress,
      currencies,
      masterKey,
      cosmicRank,
      harmonyFactor,
      masterKeyActive,
      entitlements,
      synergyBadges,
      canAccessExperience,
      activatePlan,
      registerSchoolSession
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress debe usarse dentro de ProgressProvider");
  return context;
};

