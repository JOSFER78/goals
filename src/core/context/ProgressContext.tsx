import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db, doc, setDoc, getDoc } from '../config/firebase';
import { UserData, LessonProgress, EvolutionEntry, RetoItem, RankInfo } from '../types';
import { LESSONS } from '../../experiences/astro/data/lessonsData';
import { checkStreak } from '../../experiences/astro/utils/streak';

interface ProgressContextType {
  userData: UserData;
  lessonProg: (id: number) => LessonProgress;
  lessonUnlocked: (id: number) => boolean;
  completeStep: (lessonId: number) => void;
  finishTest: (lessonId: number, score: number, total: number) => { stars: number; xpGained: number; isFirstCompletion: boolean };
  totalStars: () => number;
  maxStars: () => number;
  claimReto: (id: string, xpReward: number) => void;
  getRankInfo: (xp: number) => RankInfo;
  getRetosList: () => RetoItem[];
  toastMsg: string | null;
  showToast: (msg: string) => void;
  hideToast: () => void;
  resetProgress: () => void;
}

const DEFAULT_USER_DATA: UserData = {
  xp: 0,
  streak: 1,
  lastDay: new Date().toDateString(),
  claimedRetos: {},
  weeklyActivity: [true, false, false, false, false, false, false],
  experiences: {
    astro: {
      xp: 0,
      lessons: {}
    }
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
  const { userData, setUserData } = useState<UserData>(DEFAULT_USER_DATA);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const dataKey = useCallback(() => {
    return 'goals_data_' + (user?.uid || 'guest');
  }, [user]);

  const legacyKey = useCallback(() => {
    return 'al_data_' + (user?.uid || 'guest');
  }, [user]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const hideToast = () => {
    setToastMsg(null);
  };

  const persistData = useCallback(async (data: UserData) => {
    const key = dataKey();
    try {
      localStorage.setItem(key, JSON.stringify(data));
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

    if (isCloud && db && user?.uid && !user.isAnonymous) {
      try {
        await setDoc(doc(db, 'users', user.uid), data, { merge: true });
      } catch (err) {
        console.warn("Firestore save error", err);
      }
    }
  }, [dataKey, legacyKey, isCloud, user]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      let loadedData: UserData | null = null;

      if (isCloud && db && user?.uid && !user.isAnonymous) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            loadedData = snap.data() as UserData;
          }
        } catch (e) {
          console.warn("Firestore load error, falling back to local", e);
        }
      }

      if (!loadedData) {
        try {
          const raw = localStorage.getItem(dataKey()) || localStorage.getItem(legacyKey());
          if (raw) loadedData = JSON.parse(raw);
        } catch (e) {
          console.warn("LocalStorage parse error", e);
        }
      }

      if (!loadedData) {
        loadedData = JSON.parse(JSON.stringify(DEFAULT_USER_DATA));
      }

      const isAdminUser = user?.email === 'josferestudio@gmail.com';
      if (isAdminUser) {
        loadedData.isApproved = true;
      } else if (loadedData.isApproved === undefined) {
        loadedData.isApproved = false;
      }

      loadedData.lessons = loadedData.lessons || {};
      loadedData.claimedRetos = loadedData.claimedRetos || {};
      loadedData.weeklyActivity = loadedData.weeklyActivity || [true, true, true, false, false, false, false];
      loadedData.evolutions = loadedData.evolutions || [];
      loadedData.experiences = loadedData.experiences || {};
      if (!loadedData.experiences.astro) {
        loadedData.experiences.astro = {
          xp: loadedData.xp || 0,
          lessons: loadedData.lessons || {}
        };
      }

      const streakResult = checkStreak(loadedData.lastDay, loadedData.streak);
      loadedData.streak = streakResult.streak;
      loadedData.lastDay = streakResult.lastDay;

      if (isMounted) {
        setUserData(loadedData);
        if (isCloud && db && user?.uid && !user.isAnonymous) {
          try {
            setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              displayName: user.displayName,
              isApproved: loadedData.isApproved
            }, { merge: true });
          } catch (e) {}
        }
        persistData(loadedData);
      }
    };

    load();

    return () => { isMounted = false; };
  }, [user, isCloud, dataKey, legacyKey, persistData]);

  const getAstroLessons = (data: UserData) => {
    return data.experiences?.astro?.lessons || data.lessons || {};
  };

  const lessonProg = (id: number): LessonProgress => {
    const astroLessons = getAstroLessons(userData);
    if (!astroLessons[id]) {
      return { steps: 0, testDone: false, stars: 0 };
    }
    return astroLessons[id];
  };

  const lessonUnlocked = (id: number): boolean => {
    if (id === 1) return true;
    const prevProg = lessonProg(id - 1);
    return prevProg.testDone;
  };

  const completeStep = (lessonId: number) => {
    setUserData((prev) => {
      const astroLessons = { ...getAstroLessons(prev) };
      const current = astroLessons[lessonId] || { steps: 0, testDone: false, stars: 0 };
      const lessonDef = LESSONS.find((l) => l.id === lessonId);
      const maxSteps = lessonDef ? lessonDef.steps.length : 4;
      
      const newSteps = Math.min(maxSteps, current.steps + 1);
      const newXp = prev.xp + 10;
      
      astroLessons[lessonId] = { ...current, steps: newSteps };

      const newEvolutions: EvolutionEntry[] = [...(prev.evolutions || [])];
      if (newSteps === maxSteps && current.steps < maxSteps) {
        showToast('🎯 ¡Test de Astro desbloqueado!');
        newEvolutions.unshift({
          id: 'evo_' + Date.now(),
          timestamp: Date.now(),
          dateStr: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
          type: 'lesson_finished',
          title: `Astro - Lección ${lessonId}: ${lessonDef?.title || 'Completada'}`,
          xpEarned: 10,
          experienceId: 'astro'
        });
      }

      const updated: UserData = {
        ...prev,
        xp: newXp,
        lessons: astroLessons,
        experiences: {
          ...prev.experiences,
          astro: {
            xp: (prev.experiences?.astro?.xp || 0) + 10,
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

    let isFirstCompletion = false;

    setUserData((prev) => {
      const astroLessons = { ...getAstroLessons(prev) };
      const current = astroLessons[lessonId] || { steps: 0, testDone: false, stars: 0 };
      isFirstCompletion = !current.testDone;

      const newStars = Math.max(current.stars || 0, stars);
      astroLessons[lessonId] = { ...current, testDone: true, stars: newStars };

      const lessonDef = LESSONS.find((l) => l.id === lessonId);
      const newEvolutions: EvolutionEntry[] = [
        {
          id: 'evo_' + Date.now(),
          timestamp: Date.now(),
          dateStr: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          type: 'test_completed',
          title: `Astro - Test ${lessonId}: ${lessonDef?.title || ''}`,
          score: `${score}/${total}`,
          stars,
          xpEarned: xpGained,
          experienceId: 'astro'
        },
        ...(prev.evolutions || [])
      ];

      const updated: UserData = {
        ...prev,
        xp: prev.xp + xpGained,
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

      const newEvolutions: EvolutionEntry[] = [
        {
          id: 'evo_' + Date.now(),
          timestamp: Date.now(),
          dateStr: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
          type: 'reto_claimed',
          title: `Reto Reclamado: +${xpReward} XP`,
          xpEarned: xpReward,
          experienceId: 'astro'
        },
        ...(prev.evolutions || [])
      ];

      const updated: UserData = {
        ...prev,
        xp: newXp,
        claimedRetos: claimed,
        evolutions: newEvolutions
      };

      showToast(`🎉 ¡Has reclamado +${xpReward} XP de tu reto!`);
      persistData(updated);
      return updated;
    });
  };

  const getRetosList = (): RetoItem[] => {
    const astroLessons = getAstroLessons(userData);
    const lessonValues = Object.values(astroLessons);
    const claimed = userData.claimedRetos || {};

    const RETOS: Omit<RetoItem, 'claimed'>[] = [
      {
        id: 'r1',
        icon: '🔥',
        title: 'Racha de Fuego',
        desc: 'Alcanza o mantén 3 días seguidos de racha.',
        xp: 50,
        cond: userData.streak >= 3
      },
      {
        id: 'r2',
        icon: '⭐',
        title: 'Dominio de Artemis',
        desc: 'Consigue 3 estrellas en el Test de la Lección 1.',
        xp: 100,
        cond: astroLessons[1]?.stars === 3
      },
      {
        id: 'r3',
        icon: '📖',
        title: 'Lectura Cósmica',
        desc: 'Completa al menos 2 lecciones de astrofísica.',
        xp: 75,
        cond: lessonValues.filter((l) => l.testDone || (l.steps && l.steps >= 3)).length >= 2
      },
      {
        id: 'r4',
        icon: '🚀',
        title: 'Explorador 3D NASA',
        desc: 'Realiza cualquier test o lección en AstroLingo 3D.',
        xp: 120,
        cond: lessonValues.some((l) => l.testDone || l.steps > 0)
      },
      {
        id: 'r5',
        icon: '🏆',
        title: 'Examen Perfecto',
        desc: 'Supera cualquier test con el 100% de aciertos (3 estrellas).',
        xp: 150,
        cond: lessonValues.some((l) => l.stars === 3)
      }
    ];

    return RETOS.map((r) => ({
      ...r,
      claimed: !!claimed[r.id]
    }));
  };

  const resetProgress = () => {
    const empty: UserData = JSON.parse(JSON.stringify(DEFAULT_USER_DATA));
    setUserData(empty);
    persistData(empty);
    showToast("Progreso reiniciado");
  };

  return (
    <ProgressContext.Provider value={{
      userData,
      lessonProg,
      lessonUnlocked,
      completeStep,
      finishTest,
      totalStars,
      maxStars,
      claimReto,
      getRankInfo,
      getRetosList,
      toastMsg,
      showToast,
      hideToast,
      resetProgress
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
