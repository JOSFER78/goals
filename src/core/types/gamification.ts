/**
 * src/core/types/gamification.ts
 * Contratos SSOT del Sistema de Gamificación Unificado GOALS.
 * Canónico según docs/gamificacion/03_ARQUITECTURA_META_NIVEL_AVATAR_SINERGIAS.md
 */
import { ExperienceId } from './index';

/** Las 5 monedas de dominio temático */
export type DomainCurrencyId = 'stardust' | 'bytes' | 'flow' | 'synapse' | 'forgeCrystals';

export interface DomainCurrencies {
  /** Cosmos 3D — Astrofísica */
  stardust: number;
  /** IA Lab / Cortex — Algoritmos y código */
  bytes: number;
  /** Idiomas / Vox — Fonética y fluidez */
  flow: number;
  /** Criterio — Pensamiento crítico y forense */
  synapse: number;
  /** School — Cristales Estelares de Forja (Master Key) */
  forgeCrystals: number;
}

export const DEFAULT_CURRENCIES: DomainCurrencies = {
  stardust: 0,
  bytes: 0,
  flow: 0,
  synapse: 0,
  forgeCrystals: 0
};

/** Mapeo miniapp → moneda de dominio */
export const EXPERIENCE_CURRENCY: Record<string, DomainCurrencyId> = {
  astro: 'stardust',
  'ai-lab': 'bytes',
  aiLab: 'bytes',
  languages: 'flow',
  verify: 'synapse',
  criterio: 'synapse',
  school: 'forgeCrystals'
};

/** Estado de la Llave Maestra Estelar (Master Key) */
export interface MasterKeyStatus {
  isActive: boolean;
  /** Fecha (YYYY-MM-DD) en que se activó por última vez */
  activatedOn: string | null;
  /** Multiplicador vigente: 1.0 standby, 2.0 activo, 2.5 racha >= 7 */
  multiplier: number;
  /** Minutos de School acumulados hoy */
  schoolMinutesToday: number;
  /** Honestidad pedagógica de la última sesión (0-1) */
  lastHonestyScore: number;
}

export const DEFAULT_MASTER_KEY: MasterKeyStatus = {
  isActive: false,
  activatedOn: null,
  multiplier: 1.0,
  schoolMinutesToday: 0,
  lastHonestyScore: 0
};

/** Información de un Rango Cósmico (10 Tiers × 10 niveles = 100 niveles) */
export interface CosmicRankInfo {
  tier: number;          // 1..10
  tierName: string;      // "Cadete Planetario" ...
  level: number;         // 1..100 global
  levelInTier: number;   // 1..10 dentro del tier
  haloHex: string;       // color del halo distintivo
  xpForCurrentLevel: number;
  xpForNextLevel: number; // Infinity si nivel 100
  progressPct: number;   // 0..100 hacia el siguiente nivel
  isMaxLevel: boolean;
}

/** Insignia de sinergia cruzada multi-app */
export interface CrossAppBadge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  /** XP mínima requerida en cada dominio implicado */
  requirements: Partial<Record<DomainCurrencyId, number>>;
  earnedAt?: number; // timestamp de desbloqueo
}

/** Avatar Modular Evolutivo — Visual Rig de 5 ranuras */
export interface ModularAvatarState {
  helmet: string | null;      // Slot 1 — Cortex
  propulsion: string | null;  // Slot 2 — Cosmos
  communicator: string | null;// Slot 3 — Vox
  shield: string | null;      // Slot 4 — Criterio
  drone: string | null;       // Slot 5 — School
}

export const DEFAULT_MODULAR_AVATAR: ModularAvatarState = {
  helmet: null,
  propulsion: null,
  communicator: null,
  shield: null,
  drone: null
};

// ─────────────────────────────────────────────────────────────
// ENTITLEMENTS / FREEMIUM
// ─────────────────────────────────────────────────────────────

export type GoalsPlanId = 'free' | 'family_pro' | 'family_pass';

export interface GoalsEntitlements {
  plan: GoalsPlanId;
  /** Experiencias premium desbloqueadas explícitamente */
  unlockedExperiences: ExperienceId[];
  /** Activado por el panel admin o por compra simulada */
  activatedAt?: number;
  /** Fin del periodo (timestamp ms) si aplica */
  currentPeriodEnd?: number;
}

export const DEFAULT_ENTITLEMENTS: GoalsEntitlements = {
  plan: 'free',
  unlockedExperiences: []
};

/** Criterio es GRATIS para siempre — nunca se gatea */
export const ALWAYS_FREE_EXPERIENCES: ExperienceId[] = ['verify', 'criterio'];

/** Experiencias premium del ecosistema */
export const PREMIUM_EXPERIENCES: ExperienceId[] = ['school', 'astro', 'ai-lab', 'languages'];

export interface PlanDefinition {
  id: GoalsPlanId;
  name: string;
  priceLabel: string;
  tagline: string;
  features: string[];
  unlocksAll: boolean;
}
