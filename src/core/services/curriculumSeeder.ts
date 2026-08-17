/**
 * CurriculumSeeder — Migrador / Sembrador de Contenidos a Firebase Firestore
 * Sube las 12 lecciones y 12 tests a la colección /curriculums/astro si no existen.
 */
import { db, doc, setDoc, getDoc } from '../config/firebase';
import { LESSONS } from '../../experiences/astro/data/lessonsIndex';

export async function seedAstroCurriculumToFirestore(): Promise<{ success: boolean; count: number; message: string }> {
  if (!db) {
    return { success: false, count: 0, message: 'Firestore no está disponible o inicializado' };
  }

  try {
    // 1. Guardar documento raíz de la disciplina
    const disciplineRef = doc(db, 'curriculums', 'astro');
    await setDoc(disciplineRef, {
      id: 'astro',
      title: 'Astronomía 3D y Escalera Cósmica',
      subtitle: 'De la Tierra al Confín del Universo Observable',
      category: 'stem',
      gradeLevel: 'all',
      icon: '🌌',
      color: 'from-cyan-500 to-indigo-600',
      totalLessons: LESSONS.length,
      totalXp: LESSONS.length * 150,
      version: 2,
      isPublished: true,
      updatedAt: Date.now()
    }, { merge: true });

    let seededCount = 0;

    // 2. Sembrar cada una de las 12 lecciones y sus tests
    for (const lesson of LESSONS) {
      const lessonDocRef = doc(db, 'curriculums', 'astro', 'lessons', `lesson_${lesson.id}`);
      await setDoc(lessonDocRef, {
        id: `lesson_${lesson.id}`,
        disciplineId: 'astro',
        order: lesson.id,
        title: lesson.title,
        tag: lesson.tag,
        icon: lesson.icon,
        heroImage: lesson.hero,
        xpReward: 50,
        estimatedMinutes: 8,
        version: 2,
        status: 'published',
        linkedTestId: `test_astro_${lesson.id}`,
        steps: lesson.steps,
        updatedAt: Date.now()
      }, { merge: true });

      const testDocRef = doc(db, 'curriculums', 'astro', 'tests', `test_astro_${lesson.id}`);
      await setDoc(testDocRef, {
        id: `test_astro_${lesson.id}`,
        lessonId: `lesson_${lesson.id}`,
        disciplineId: 'astro',
        title: `Test de Evaluación: ${lesson.title}`,
        passScorePercent: 75,
        xpReward: 100,
        questions: lesson.test,
        version: 2,
        status: 'published',
        updatedAt: Date.now()
      }, { merge: true });

      seededCount++;
    }

    console.log(`[CurriculumSeeder] ✅ ${seededCount} lecciones y tests sincronizados con Firestore`);
    return { success: true, count: seededCount, message: `Sincronizadas ${seededCount} lecciones y tests` };
  } catch (error: any) {
    console.warn('[CurriculumSeeder] Error al sembrar currículum en Firestore:', error);
    return { success: false, count: 0, message: error?.message || 'Error desconocido' };
  }
}
