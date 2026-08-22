/**
 * src/core/services/EntitlementService.ts
 * Servicio de Entitlements Freemium GOALS.
 * Criterio = GRATIS para siempre (app reclamo). School/Cosmos/IA-Lab/Idiomas = PREMIUM.
 *
 * NOTA DE TRANSPARENCIA (AGENTS.md): la activación premium es SIMULADA
 * (sin pasarela de pago real todavía). El entitlement se persiste en
 * Firestore `users/{uid}.entitlements` y en LocalStorage como respaldo.
 */
import { ExperienceId } from '../types';
import {
  GoalsEntitlements,
  GoalsPlanId,
  PlanDefinition,
  DEFAULT_ENTITLEMENTS,
  ALWAYS_FREE_EXPERIENCES,
  PREMIUM_EXPERIENCES
} from '../types/gamification';

export const GOALS_PLANS: PlanDefinition[] = [
  {
    id: 'free',
    name: 'GOALS Free Cadet',
    priceLabel: '0 € / siempre',
    tagline: 'Empieza a explorar con Criterio, gratis para siempre.',
    features: [
      '🧭 Criterio completo: sesgos, falacias y verificación',
      '1 reto diario gratuito en cada miniapp',
      'Diagnóstico inicial adaptativo',
      'Perfil educativo con edad y curso'
    ],
    unlocksAll: false
  },
  {
    id: 'family_pro',
    name: 'GOALS Family Pro',
    priceLabel: '9,99 € / mes',
    tagline: 'El tutor particular de IA para 2 hijos.',
    features: [
      '📐 Escuela IA: tutor personalizado ilimitado',
      '🌌 Cosmos 3D completo + mazmorras de conocimiento',
      '🤖 IA Lab: Python real y redes neuronales',
      '🗣️ Idiomas Voz: profesor particular en vivo',
      'Master Key: 2.0x XP global'
    ],
    unlocksAll: true
  },
  {
    id: 'family_pass',
    name: 'GOALS Family Pass',
    priceLabel: '79,99 € / año',
    tagline: 'El ecosistema completo para toda la familia.',
    features: [
      'Todo lo de Family Pro',
      'Hasta 4 perfiles infantiles',
      'Informes familiares diarios',
      'Soporte prioritario'
    ],
    unlocksAll: true
  }
];

const LOCAL_KEY = (uid: string) => `goals_entitlements_${uid}`;

export const entitlementService = {
  /** Carga entitlements (LocalStorage primero; Firestore se sincroniza vía ProgressContext). */
  loadLocal(uid: string): GoalsEntitlements {
    try {
      const raw = localStorage.getItem(LOCAL_KEY(uid));
      if (raw) {
        const parsed = JSON.parse(raw) as GoalsEntitlements;
        return { ...DEFAULT_ENTITLEMENTS, ...parsed };
      }
    } catch (e) {
      console.warn('EntitlementService: error leyendo local', e);
    }
    return { ...DEFAULT_ENTITLEMENTS };
  },

  saveLocal(uid: string, entitlements: GoalsEntitlements): void {
    try {
      localStorage.setItem(LOCAL_KEY(uid), JSON.stringify(entitlements));
    } catch (e) {
      console.warn('EntitlementService: error guardando local', e);
    }
  },

  /** ¿Puede el usuario acceder a esta experiencia? */
  canAccess(expId: ExperienceId | string, entitlements: GoalsEntitlements | undefined, isAdmin: boolean): boolean {
    if (isAdmin) return true;
    if (ALWAYS_FREE_EXPERIENCES.includes(expId as ExperienceId)) return true;
    if (!PREMIUM_EXPERIENCES.includes(expId as ExperienceId)) return true; // admin/profile/etc.
    const ent = entitlements || DEFAULT_ENTITLEMENTS;
    if (ent.plan === 'family_pro' || ent.plan === 'family_pass') return true;
    return ent.unlockedExperiences.includes(expId as ExperienceId);
  },

  /** Activación SIMULADA de plan (demo / panel admin). Sin pasarela real. */
  activatePlanSimulated(
    current: GoalsEntitlements | undefined,
    plan: GoalsPlanId
  ): GoalsEntitlements {
    const base = current || { ...DEFAULT_ENTITLEMENTS };
    return {
      ...base,
      plan,
      unlockedExperiences: plan === 'free' ? [] : [...PREMIUM_EXPERIENCES],
      activatedAt: Date.now(),
      currentPeriodEnd: plan === 'free' ? undefined : Date.now() + 365 * 24 * 3600 * 1000
    };
  },

  /** Desbloquea una experiencia individual (regalo / canje). */
  unlockExperience(
    current: GoalsEntitlements | undefined,
    expId: ExperienceId
  ): GoalsEntitlements {
    const base = current || { ...DEFAULT_ENTITLEMENTS };
    if (base.unlockedExperiences.includes(expId)) return base;
    return { ...base, unlockedExperiences: [...base.unlockedExperiences, expId] };
  },

  getPlan(planId: GoalsPlanId): PlanDefinition | undefined {
    return GOALS_PLANS.find((p) => p.id === planId);
  },

  isPremiumExperience(expId: ExperienceId | string): boolean {
    return PREMIUM_EXPERIENCES.includes(expId as ExperienceId);
  },

  isFreeExperience(expId: ExperienceId | string): boolean {
    return ALWAYS_FREE_EXPERIENCES.includes(expId as ExperienceId);
  }
};
