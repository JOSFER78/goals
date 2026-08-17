/**
 * src/core/services/StudentStateService.ts
 * Servicio de Persistencia y Gestión del Expediente de Aprendizaje del Alumno (L1 RAM -> L2 LocalStorage -> L4 Firestore)
 */

import { StudentLearningState } from '../types/adaptiveCurriculum';
import { db, doc, getDoc, setDoc } from '../config/firebase';

const CACHE_PREFIX = 'goals_student_state_';

export class StudentStateService {
  private static instance: StudentStateService;
  private memoryCache = new Map<string, StudentLearningState>();

  private constructor() {}

  public static getInstance(): StudentStateService {
    if (!StudentStateService.instance) {
      StudentStateService.instance = new StudentStateService();
    }
    return StudentStateService.instance;
  }

  private getCacheKey(userId: string, disciplineId: string): string {
    return `${userId}_${disciplineId}`;
  }

  /**
   * Obtiene el estado del alumno para una disciplina concreta
   */
  public async getStudentState(userId: string, disciplineId: string = 'astro'): Promise<StudentLearningState | null> {
    const key = this.getCacheKey(userId, disciplineId);

    // 1. Nivel L1: Memoria RAM
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key)!;
    }

    // 2. Nivel L2: LocalStorage
    try {
      const local = localStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (local) {
        const parsed = JSON.parse(local) as StudentLearningState;
        this.memoryCache.set(key, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('[StudentStateService] Error leyendo LocalStorage:', e);
    }

    // 3. Nivel L4: Firestore
    if (db && userId && userId !== 'guest') {
      try {
        const stateRef = doc(db, 'users', userId, 'learningStates', disciplineId);
        const snap = await getDoc(stateRef);
        if (snap.exists()) {
          const stateData = snap.data() as StudentLearningState;
          this.saveLocalCache(userId, disciplineId, stateData);
          return stateData;
        }
      } catch (err) {
        console.warn(`[StudentStateService] No se pudo leer Firestore para ${key}:`, err);
      }
    }

    return null;
  }

  /**
   * Guarda o actualiza el estado del alumno en L1, L2 y L4
   */
  public async saveStudentState(state: StudentLearningState): Promise<void> {
    const updated: StudentLearningState = {
      ...state,
      updatedAt: Date.now(),
      lastActiveAt: Date.now()
    };

    // Guardar en RAM y LocalStorage
    this.saveLocalCache(updated.userId, updated.disciplineId, updated);

    // Sincronizar en Firestore
    if (db && updated.userId && updated.userId !== 'guest') {
      try {
        const cleanPayload = JSON.parse(JSON.stringify(updated));
        await setDoc(doc(db, 'users', updated.userId, 'learningStates', updated.disciplineId), cleanPayload, { merge: true });
      } catch (err) {
        console.error(`[StudentStateService] Error sincronizando con Firestore:`, err);
      }
    }
  }

  /**
   * Marca una unidad como completada y actualiza el mastery del alumno
   */
  public async completeUnit(
    userId: string,
    disciplineId: string,
    unitId: string,
    scorePercent: number,
    xpEarned: number,
    nextUnitId?: string
  ): Promise<StudentLearningState> {
    const loadedState = await this.getStudentState(userId, disciplineId);

    const finalState: StudentLearningState = loadedState || {
      userId,
      disciplineId,
      experienceId: disciplineId,
      firstVisit: false,
      onboardingCompleted: true,
      age: 9,
      grade: '4º de Primaria',
      diagnosticStatus: 'completed',
      recommendedStartUnitId: unitId,
      currentUnitId: unitId,
      completedUnitIds: [],
      conceptMastery: {},
      weakConcepts: [],
      strengths: [],
      sessionHistory: [],
      lastActiveAt: Date.now(),
      updatedAt: Date.now()
    };

    // Registrar sesión en historial
    finalState.sessionHistory.push({
      unitId,
      completedAt: Date.now(),
      scorePercent,
      xpEarned,
      attempts: 1
    });

    // Añadir a completadas si no estaba
    if (!finalState.completedUnitIds.includes(unitId)) {
      finalState.completedUnitIds.push(unitId);
    }

    // Avanzar a la siguiente unidad si procede
    if (nextUnitId) {
      finalState.currentUnitId = nextUnitId;
    }

    await this.saveStudentState(finalState);
    return finalState;
  }

  private saveLocalCache(userId: string, disciplineId: string, state: StudentLearningState): void {
    const key = this.getCacheKey(userId, disciplineId);
    this.memoryCache.set(key, state);
    try {
      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(state));
    } catch (e) {
      console.warn('[StudentStateService] Error escribiendo LocalStorage:', e);
    }
  }
}

export const studentStateService = StudentStateService.getInstance();
