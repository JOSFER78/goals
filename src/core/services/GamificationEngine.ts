/**
 * src/core/services/GamificationEngine.ts
 * Motor Central de Gamificación Unificada GOALS.
 * Implementa: Ecuación de Fusión Universal (Shannon), 100 Niveles Cósmicos,
 * Master Key, 5 Monedas de Dominio y Logros Cruzados.
 * SSOT: docs/gamificacion/03_ARQUITECTURA_META_NIVEL_AVATAR_SINERGIAS.md
 */
import {
  DomainCurrencies,
  DomainCurrencyId,
  CosmicRankInfo,
  MasterKeyStatus,
  CrossAppBadge,
  DEFAULT_MASTER_KEY
} from '../types/gamification';

// ─────────────────────────────────────────────────────────────
// 1. LOS 10 RANGOS CÓSMICOS (10 Tiers × 10 Niveles)
// ─────────────────────────────────────────────────────────────

interface TierDef {
  tier: number;
  name: string;
  haloHex: string;
}

export const COSMIC_TIERS: TierDef[] = [
  { tier: 1, name: 'Cadete Planetario', haloHex: '#10B981' },
  { tier: 2, name: 'Piloto Orbital', haloHex: '#0284C7' },
  { tier: 3, name: 'Navegante Estelar', haloHex: '#6366F1' },
  { tier: 4, name: 'Estratega de Sistemas', haloHex: '#8B5CF6' },
  { tier: 5, name: 'Comandante Cuántico', haloHex: '#F59E0B' },
  { tier: 6, name: 'Maestro de Constelaciones', haloHex: '#EF4444' },
  { tier: 7, name: 'Arquitecto Galáctico', haloHex: '#06B6D4' },
  { tier: 8, name: 'Guardián del Hiperespacio', haloHex: '#1E1B4B' },
  { tier: 9, name: 'Oráculo del Vacío', haloHex: '#E0E7FF' },
  { tier: 10, name: 'Almirante Supremo Universal', haloHex: '#FFFFFF' }
];

const MAX_LEVEL = 100;

/** XP requerida para ALCANZAR el nivel L (acumulada). Nivel 1 = 0 XP. */
export const xpRequiredForLevel = (level: number): number => {
  if (level <= 1) return 0;
  const L = level - 1;
  return Math.floor(120 * Math.pow(L, 1.85) + 250 * L);
};

/** Nivel global (1-100) a partir del XP universal acumulado. */
export const getLevelFromXP = (xp: number): number => {
  let level = 1;
  while (level < MAX_LEVEL && xp >= xpRequiredForLevel(level + 1)) {
    level++;
  }
  return level;
};

/** Información completa del Rango Cósmico actual. */
export const getCosmicRank = (xp: number): CosmicRankInfo => {
  const level = getLevelFromXP(xp);
  const tierIndex = Math.min(Math.floor((level - 1) / 10), 9);
  const tierDef = COSMIC_TIERS[tierIndex];
  const xpCur = xpRequiredForLevel(level);
  const isMax = level >= MAX_LEVEL;
  const xpNext = isMax ? Infinity : xpRequiredForLevel(level + 1);
  const progressPct = isMax
    ? 100
    : Math.max(0, Math.min(100, Math.round(((xp - xpCur) / (xpNext - xpCur)) * 100)));
  return {
    tier: tierDef.tier,
    tierName: tierDef.name,
    level,
    levelInTier: level - tierIndex * 10,
    haloHex: tierDef.haloHex,
    xpForCurrentLevel: xpCur,
    xpForNextLevel: xpNext,
    progressPct,
    isMaxLevel: isMax
  };
};

// ─────────────────────────────────────────────────────────────
// 2. FACTOR DE ARMONÍA DE SHANNON (Φ ∈ [1.0, 1.5])
// ─────────────────────────────────────────────────────────────

const EPSILON = 1.0;
const CURRENCY_KEYS: DomainCurrencyId[] = ['stardust', 'bytes', 'flow', 'synapse', 'forgeCrystals'];

/**
 * Entropía de Shannon normalizada sobre la distribución de XP por dominio.
 * Premia el aprendizaje polimático equilibrado (hasta +50% XP).
 */
export const getHarmonyFactor = (currencies: DomainCurrencies): number => {
  const values = CURRENCY_KEYS.map((k) => (currencies[k] || 0) + EPSILON);
  const total = values.reduce((a, b) => a + b, 0);
  if (total <= 0) return 1.0;
  let entropy = 0;
  for (const v of values) {
    const p = v / total;
    if (p > 0) entropy -= p * (Math.log(p) / Math.log(5));
  }
  const phi = 1.0 + 0.5 * Math.max(0, Math.min(1, entropy));
  return Math.round(phi * 1000) / 1000;
};

/** Multiplicador de racha: 1.0 base, +0.05 por día hasta 2.0 con racha ≥ 20 */
export const getStreakMultiplier = (streak: number): number => {
  if (streak >= 20) return 2.0;
  if (streak >= 7) return 1.5;
  if (streak >= 3) return 1.2;
  return 1.0;
};

// ─────────────────────────────────────────────────────────────
// 3. THE MASTER KEY (Llave Maestra Estelar)
// ─────────────────────────────────────────────────────────────

export const MASTER_KEY_MIN_MINUTES = 15;
export const MASTER_KEY_HONESTY_THRESHOLD = 0.8;
export const MASTER_KEY_GUESS_MAX = 0.3;

const todayStr = () => new Date().toISOString().slice(0, 10);

/**
 * Evalúa si una sesión de School activa la Master Key.
 * Requisitos canónicos: ≥15 min efectivos + honestidad ≥ 0.80 + guess ≤ 0.30.
 */
export const evaluateMasterKeyActivation = (
  current: MasterKeyStatus,
  session: { minutes: number; honestyScore: number; guessRate: number },
  streak: number
): MasterKeyStatus => {
  const today = todayStr();
  const minutesToday =
    current.activatedOn === today ? current.schoolMinutesToday : 0;
  const totalMinutes = minutesToday + session.minutes;
  const honest =
    session.honestyScore >= MASTER_KEY_HONESTY_THRESHOLD &&
    session.guessRate <= MASTER_KEY_GUESS_MAX;

  const isActive = totalMinutes >= MASTER_KEY_MIN_MINUTES && honest;
  return {
    isActive,
    activatedOn: isActive ? today : current.activatedOn,
    multiplier: isActive ? (streak >= 7 ? 2.5 : 2.0) : 1.0,
    schoolMinutesToday: totalMinutes,
    lastHonestyScore: session.honestyScore
  };
};

/** ¿Sigue activa hoy la Master Key? */
export const isMasterKeyActiveToday = (mk: MasterKeyStatus | undefined): boolean => {
  if (!mk) return false;
  return mk.isActive && mk.activatedOn === todayStr();
};

export const getMasterKeyMultiplier = (mk: MasterKeyStatus | undefined): number =>
  isMasterKeyActiveToday(mk) ? (mk?.multiplier || 2.0) : DEFAULT_MASTER_KEY.multiplier;

// ─────────────────────────────────────────────────────────────
// 4. ECUACIÓN DE FUSIÓN UNIVERSAL DE XP
// ─────────────────────────────────────────────────────────────

export interface XpAwardInput {
  baseXp: number;
  currencies: DomainCurrencies;
  masterKey?: MasterKeyStatus;
  streak: number;
}

/**
 * XP final = base × Φ_harmony × M_streak × M_school
 * (Φ se calcula sobre la distribución ANTES de acreditar el nuevo XP).
 */
export const computeUniversalXp = (input: XpAwardInput): { finalXp: number; harmony: number; streakMult: number; schoolMult: number } => {
  const harmony = getHarmonyFactor(input.currencies);
  const streakMult = getStreakMultiplier(input.streak);
  const schoolMult = getMasterKeyMultiplier(input.masterKey);
  const finalXp = Math.round(input.baseXp * harmony * streakMult * schoolMult);
  return { finalXp, harmony, streakMult, schoolMult };
};

// ─────────────────────────────────────────────────────────────
// 5. LOGROS CRUZADOS MULTI-APP (Cross-App Synergy Badges)
// ─────────────────────────────────────────────────────────────

export const CROSS_APP_BADGES: CrossAppBadge[] = [
  {
    id: 'astro_coder',
    name: 'Astro-Coder',
    description: 'Domina el cosmos y el código: 500 Stardust + 500 Bytes.',
    icon: '🛰️',
    requirements: { stardust: 500, bytes: 500 }
  },
  {
    id: 'consul_verdad',
    name: 'Cónsul de la Verdad',
    description: 'Guardián del rigor: 500 Synapse + 300 Flow.',
    icon: '⚖️',
    requirements: { synapse: 500, flow: 300 }
  },
  {
    id: 'topografo_estelar',
    name: 'Topógrafo Estelar',
    description: 'Cartógrafo del saber: 800 Stardust + 400 Forge Crystals.',
    icon: '🗺️',
    requirements: { stardust: 800, forgeCrystals: 400 }
  },
  {
    id: 'arquitecto_etico',
    name: 'Arquitecto Ético',
    description: 'IA con criterio: 500 Bytes + 500 Synapse.',
    icon: '🧠',
    requirements: { bytes: 500, synapse: 500 }
  },
  {
    id: 'polimatia_cosmica',
    name: 'Polimatía Cósmica',
    description: 'Equilibrio total: 300+ en las 5 monedas de dominio.',
    icon: '🌟',
    requirements: { stardust: 300, bytes: 300, flow: 300, synapse: 300, forgeCrystals: 300 }
  }
];

/** Evalúa qué badges se desbloquean con el balance actual de monedas. */
export const evaluateCrossAppBadges = (
  currencies: DomainCurrencies,
  alreadyEarned: Record<string, number>
): CrossAppBadge[] => {
  const newlyEarned: CrossAppBadge[] = [];
  for (const badge of CROSS_APP_BADGES) {
    if (alreadyEarned[badge.id]) continue;
    const ok = Object.entries(badge.requirements).every(
      ([currency, min]) => (currencies[currency as DomainCurrencyId] || 0) >= (min || 0)
    );
    if (ok) newlyEarned.push(badge);
  }
  return newlyEarned;
};

export const GamificationEngine = {
  xpRequiredForLevel,
  getLevelFromXP,
  getCosmicRank,
  getHarmonyFactor,
  getStreakMultiplier,
  evaluateMasterKeyActivation,
  isMasterKeyActiveToday,
  getMasterKeyMultiplier,
  computeUniversalXp,
  evaluateCrossAppBadges,
  COSMIC_TIERS,
  CROSS_APP_BADGES
};
