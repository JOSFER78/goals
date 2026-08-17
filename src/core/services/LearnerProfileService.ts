/**
 * src/core/services/LearnerProfileService.ts
 * Servicio Central de Gestión y Persistencia del Perfil Educativo Global del Alumno (LearnerProfile).
 * Arquitectura Cache-First (L1 RAM -> L2 LocalStorage -> L4 Firestore).
 */

import { LearnerProfile, EducationalStage, AgeTranche } from '../types/adaptiveCurriculum';
import { LegacyProfileAdapter } from './LegacyProfileAdapter';
import { PresentationEngine } from './PresentationEngine';
import { db, doc, getDoc, setDoc } from '../config/firebase';

const CACHE_PREFIX = 'goals_learner_profile_';

export class LearnerProfileService {
  private static instance: LearnerProfileService;
  private memoryCache = new Map<string, LearnerProfile>();

  private constructor() {}

  public static getInstance(): LearnerProfileService {
    if (!LearnerProfileService.instance) {
      LearnerProfileService.instance = new LearnerProfileService();
    }
    return LearnerProfileService.instance;
  }

  /**
   * Obtiene el perfil del alumno garantizando fallback y migración legacy
   */
  public async getProfile(userId: string = 'guest'): Promise<LearnerProfile> {
    // 1. L1: RAM Cache
    if (this.memoryCache.has(userId)) {
      return this.memoryCache.get(userId)!;
    }

    // 2. L2: LocalStorage
    try {
      const local = localStorage.getItem(`${CACHE_PREFIX}${userId}`);
      if (local) {
        const parsed = JSON.parse(local) as LearnerProfile;
        this.memoryCache.set(userId, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('[LearnerProfileService] Error leyendo LocalStorage:', e);
    }

    // 3. L4: Firestore
    if (db && userId && userId !== 'guest') {
      try {
        const userRef = doc(db, 'users', userId);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.learnerProfile) {
            const profile = data.learnerProfile as LearnerProfile;
            this.saveLocalCache(userId, profile);
            return profile;
          } else if (data.childProfile) {
            // Migración automática de childProfile
            const migrated = LegacyProfileAdapter.toLearnerProfile(data.childProfile, userId);
            await this.saveProfile(migrated);
            return migrated;
          }
        }
      } catch (err) {
        console.warn(`[LearnerProfileService] Error consultando Firestore para ${userId}:`, err);
      }
    }

    // 4. Fallback por defecto
    const defaultProfile = LegacyProfileAdapter.toLearnerProfile(null, userId);
    this.saveLocalCache(userId, defaultProfile);
    return defaultProfile;
  }

  /**
   * Guarda y persiste el perfil educativo en L1, L2 y L4
   */
  public async saveProfile(profile: LearnerProfile): Promise<void> {
    const updated: LearnerProfile = {
      ...profile,
      updatedAt: Date.now()
    };

    // Actualizar cache local
    this.saveLocalCache(updated.userId, updated);

    // Guardar en Firestore
    if (db && updated.userId && updated.userId !== 'guest') {
      try {
        const userRef = doc(db, 'users', updated.userId);
        const cleanPayload = JSON.parse(JSON.stringify(updated));
        await setDoc(userRef, { 
          learnerProfile: cleanPayload,
          // Mantener childProfile para retrocompatibilidad
          childProfile: LegacyProfileAdapter.toChildProfile(updated),
          updatedAt: Date.now()
        }, { merge: true });
      } catch (err) {
        console.error('[LearnerProfileService] Error guardando perfil en Firestore:', err);
      }
    }
  }

  /**
   * Crea un nuevo LearnerProfile completo
   */
  public createProfile(params: {
    userId: string;
    name: string;
    age: number;
    grade?: string;
    avatar?: string;
    interests?: string[];
    favoriteSubjects?: string[];
    learningStyle?: 'visual' | 'auditivo' | 'practico' | 'general';
  }): LearnerProfile {
    const age = Math.min(15, Math.max(6, params.age));
    const stage = PresentationEngine.getEducationalStage(age);
    const tranche = PresentationEngine.getTrancheForAge(age);
    const grade = params.grade || PresentationEngine.getLevelBadge(age).label.split(' (')[0];

    return {
      userId: params.userId,
      identity: {
        name: params.name.trim() || 'Estudiante',
        avatar: params.avatar || 'astrobot'
      },
      education: {
        age,
        grade,
        educationalStage: stage,
        ageTranche: tranche
      },
      preferences: {
        interests: params.interests || ['Espacio y Astronomía 🚀', 'Simulación 3D 🪐'],
        favoriteSubjects: params.favoriteSubjects || ['Ciencias Naturales', 'Astrofísica 🌌'],
        learningStyle: params.learningStyle || (age <= 9 ? 'visual' : 'practico')
      },
      goals: ['Explorar el Cosmos paso a paso'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      onboarding: {
        globalCompleted: true,
        completedAt: Date.now()
      }
    };
  }

  private saveLocalCache(userId: string, profile: LearnerProfile): void {
    this.memoryCache.set(userId, profile);
    try {
      localStorage.setItem(`${CACHE_PREFIX}${userId}`, JSON.stringify(profile));
    } catch (e) {
      console.warn('[LearnerProfileService] Error escribiendo LocalStorage:', e);
    }
  }
}

export const learnerProfileService = LearnerProfileService.getInstance();
