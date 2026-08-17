/**
 * src/core/services/LegacyProfileAdapter.ts
 * Adaptador bidireccional para migrar perfiles legacy (ChildLearningProfile) hacia LearnerProfile maestro.
 */

import { LearnerProfile, EducationalStage, AgeTranche } from '../types/adaptiveCurriculum';
import { ChildLearningProfile, DEFAULT_CHILD_PROFILE } from '../types/childProfile';
import { PresentationEngine } from './PresentationEngine';

export class LegacyProfileAdapter {
  /**
   * Convierte un perfil legacy (o datos planos de childProfile) a LearnerProfile
   */
  public static toLearnerProfile(legacy: Partial<ChildLearningProfile> | null | undefined, userId: string = 'guest'): LearnerProfile {
    const age = Number(legacy?.age) || 9;
    const grade = legacy?.grade || PresentationEngine.getLevelBadge(age).label.split(' (')[0];
    const stage = PresentationEngine.getEducationalStage(age);
    const tranche = PresentationEngine.getTrancheForAge(age);
    const name = legacy?.childName?.trim() || 'Estudiante';

    return {
      userId,
      identity: {
        name,
        avatar: 'astrobot'
      },
      education: {
        age,
        grade,
        educationalStage: stage,
        ageTranche: tranche
      },
      preferences: {
        interests: legacy?.interests || DEFAULT_CHILD_PROFILE.interests,
        favoriteSubjects: legacy?.favoriteSubjects || DEFAULT_CHILD_PROFILE.favoriteSubjects,
        learningStyle: legacy?.learningStyle || (age <= 9 ? 'visual' : 'practico')
      },
      goals: ['Aprender ciencias espaciales', 'Completar misiones interactivas'],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      onboarding: {
        globalCompleted: Boolean(legacy?.age && legacy.age >= 6),
        completedAt: Date.now()
      }
    };
  }

  /**
   * Convierte un LearnerProfile al formato legacy ChildLearningProfile para retrocompatibilidad
   */
  public static toChildProfile(profile: LearnerProfile): ChildLearningProfile {
    return {
      childName: profile.identity.name,
      age: profile.education.age,
      schoolName: '',
      grade: profile.education.grade,
      favoriteSubjects: profile.preferences.favoriteSubjects,
      weakSubjects: [],
      extracurriculars: ['Robótica y Código 🤖'],
      interests: profile.preferences.interests,
      learningStyle: profile.preferences.learningStyle || 'visual',
      specialNotes: ''
    };
  }
}
