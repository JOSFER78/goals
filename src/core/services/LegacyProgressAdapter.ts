/**
 * src/core/services/LegacyProgressAdapter.ts
 * Adaptador bidireccional entre el progreso numérico legacy (1 a 12) y el estado moderno de aprendizaje (StudentLearningState).
 */

import { StudentLearningState, ConceptMasteryRecord } from '../types/adaptiveCurriculum';
import { LessonProgress, UserData } from '../types';
import { LegacyCurriculumAdapter } from './LegacyCurriculumAdapter';

export class LegacyProgressAdapter {
  /**
   * Extrae o crea un StudentLearningState a partir de los datos históricos de UserData
   */
  public static migrateLegacyProgressToState(
    userData: UserData,
    userId: string,
    disciplineId: string = 'astro'
  ): StudentLearningState {
    const age = Number(userData.childProfile?.age) || 9;
    const grade = userData.childProfile?.grade || '4º de Primaria';
    
    // Obtener lecciones de astro
    const rawLessons: Record<string | number, LessonProgress> = 
      userData.experiences?.astro?.lessons || userData.lessons || {};

    const completedUnitIds: string[] = [];
    const conceptMastery: Record<string, ConceptMasteryRecord> = {};

    Object.entries(rawLessons).forEach(([lessonIdStr, prog]) => {
      const numId = parseInt(lessonIdStr, 10);
      if (!isNaN(numId) && (prog.read || prog.testDone)) {
        const canonicalId = LegacyCurriculumAdapter.numericToCanonicalId(numId);
        completedUnitIds.push(canonicalId);
        
        conceptMastery[canonicalId] = {
          conceptKey: `concepto_astro_${numId}`,
          scorePercent: prog.testDone ? 100 : 75,
          totalAttempts: 1,
          lastPracticedAt: Date.now(),
          status: prog.testDone ? 'mastered' : 'in_progress'
        };
      }
    });

    const startUnitId = completedUnitIds.length > 0
      ? LegacyCurriculumAdapter.numericToCanonicalId(Math.min(12, completedUnitIds.length + 1))
      : 'astro_u01_earth_atmosphere';

    return {
      userId,
      experienceId: 'astro',
      disciplineId,
      firstVisit: completedUnitIds.length === 0,
      onboardingCompleted: completedUnitIds.length > 0,
      age,
      grade,
      diagnosticStatus: completedUnitIds.length > 0 ? 'completed' : 'pending',
      diagnosticScore: completedUnitIds.length > 0 ? 80 : undefined,
      recommendedStartUnitId: startUnitId,
      currentUnitId: startUnitId,
      completedUnitIds,
      conceptMastery,
      weakConcepts: [],
      strengths: completedUnitIds.map(id => `concepto_${id}`),
      sessionHistory: [],
      lastActiveAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  /**
   * Refleja los cambios de StudentLearningState en el formato legacy de UserData
   */
  public static syncStateToUserData(
    state: StudentLearningState,
    currentData: UserData
  ): UserData {
    const updated = { ...currentData };
    if (!updated.experiences) updated.experiences = {};
    if (!updated.experiences.astro) updated.experiences.astro = { xp: 0, lessons: {} };

    state.completedUnitIds.forEach(unitId => {
      const numId = LegacyCurriculumAdapter.canonicalToNumericId(unitId);
      if (!updated.experiences!.astro!.lessons[numId]) {
        updated.experiences!.astro!.lessons[numId] = {
          steps: 5,
          testDone: true,
          stars: 3,
          read: true,
          score: 100
        };
      }
    });

    return updated;
  }
}
