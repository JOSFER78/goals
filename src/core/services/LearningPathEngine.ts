/**
 * src/core/services/LearningPathEngine.ts
 * Motor de Generación del Camino del Alumno ("Mi Camino")
 * Calcula de forma determinista la ruta personalizada según el tramo de edad,
 * identificando la unidad activa, próximas metas y cápsulas de refuerzo adaptativo.
 */

import { 
  LearningPath, 
  LearningPathItem, 
  StudentLearningState, 
  CurriculumUnit,
  AgeTranche
} from '../types/adaptiveCurriculum';
import { PresentationEngine } from './PresentationEngine';
import { AdaptiveCosmosCatalogService } from '../../experiences/astro/data/adaptiveCosmosCatalog';

export class LearningPathEngine {
  /**
   * Genera la estructura completa de "Mi Camino" para el alumno (alias para computeLearningPath)
   */
  public static computeLearningPath(
    state: StudentLearningState,
    customUnits?: CurriculumUnit[]
  ): LearningPath {
    return this.calculateLearningPath(state, customUnits);
  }

  public static calculateLearningPath(
    state: StudentLearningState,
    customUnits?: CurriculumUnit[]
  ): LearningPath {
    const tranche: AgeTranche = state.ageTranche || PresentationEngine.getTrancheForAge(state.age || 9);
    const units: CurriculumUnit[] = customUnits || AdaptiveCosmosCatalogService.getUnitsForTranche(tranche);
    const completedList = state.completedUnitIds || (state as any).completedUnits || [];
    const completedIds = new Set<string>(completedList);

    // Determinar la unidad actual efectiva
    const validCurrentUnitId = (state.currentUnitId && units.some(u => u.id === state.currentUnitId))
      ? state.currentUnitId
      : (units.find(u => !completedIds.has(u.id))?.id || units[0]?.id || 'astro_8_9_u01_atmosphere_satellites');

    const pathItems: LearningPathItem[] = units.map((unit: CurriculumUnit) => {
      const isCompleted = completedIds.has(unit.id);
      const prereqsMet = (unit.prerequisites || []).every((pId: string) => completedIds.has(pId));
      
      let status: LearningPathItem['status'] = 'locked';
      if (isCompleted) {
        status = 'completed';
      } else if (unit.id === validCurrentUnitId) {
        status = 'current';
      } else if (prereqsMet) {
        status = 'upcoming';
      }

      const mastery = state.conceptMastery?.[unit.id]?.scorePercent;

      return {
        unitId: unit.id,
        canonicalNumber: unit.canonicalNumber,
        title: unit.title,
        subtitle: unit.subtitle,
        icon: unit.icon,
        xpReward: unit.xpReward,
        ageTranche: unit.ageTranche,
        status,
        masteryPercent: mastery,
        prerequisitesMet: prereqsMet
      };
    });

    const completedUnits = pathItems.filter(i => i.status === 'completed');
    
    // Unidad actual
    let currentUnit = pathItems.find(i => i.unitId === validCurrentUnitId);
    if (!currentUnit) {
      currentUnit = pathItems.find(i => i.status === 'upcoming') || pathItems[0];
    }

    // Próximas 2 o 3 unidades
    const upcomingUnits = pathItems
      .filter(i => i.unitId !== currentUnit?.unitId && (i.status === 'upcoming' || i.status === 'locked'))
      .slice(0, 3);

    // Unidad de refuerzo si hay lagunas conceptuales
    let reinforcementUnit: LearningPathItem | undefined;
    if (state.weakConcepts && state.weakConcepts.length > 0) {
      const weakConcept = state.weakConcepts[0];
      const matchingUnit = pathItems.find(u => u.unitId.includes(weakConcept) || completedIds.has(u.unitId));
      if (matchingUnit) {
        reinforcementUnit = {
          ...matchingUnit,
          status: 'reinforcement',
          title: `Refuerzo: ${matchingUnit.title}`,
          subtitle: 'Consolida los conceptos con una práctica rápida'
        };
      }
    }

    const progressPercent = Math.round((completedUnits.length / Math.max(1, units.length)) * 100);

    return {
      userId: state.userId,
      disciplineId: state.disciplineId,
      totalUnitsInCurriculum: units.length,
      completedUnitsCount: completedUnits.length,
      progressPercent,
      currentUnit: currentUnit || pathItems[0],
      upcomingUnits,
      completedUnits,
      reinforcementUnit,
      activeStreak: 1,
      totalStars: completedUnits.length * 3
    };
  }
}
