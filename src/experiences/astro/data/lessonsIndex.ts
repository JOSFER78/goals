/**
 * Ensamblador Maestro Dinámico del Catálogo de Astronomía (12 Lecciones y 12 Tests)
 * Proporciona mapas de acceso en tiempo constante O(1) y helpers de progresión.
 */
import { Lesson } from '../types';

// 1. Importación modular de las 12 Lecciones Teóricas
import { lesson01_Earth } from './lessons/lesson01_Earth';
import { lesson02_Eclipses } from './lessons/lesson02_Eclipses';
import { lesson03_Rotation as lesson03_DayNight } from './lessons/lesson03_Rotation';
import { lesson04_Orbit } from './lessons/lesson04_Orbit';
import { lesson05_Seasons } from './lessons/lesson05_Seasons';
import { lesson06_Solarsystem as lesson06_SolarSystem } from './lessons/lesson06_Solarsystem';
import { lesson07_Oortvoyager as lesson07_OortVoyager } from './lessons/lesson07_Oortvoyager';
import { lesson08_Nearbystars as lesson08_NearbyStars } from './lessons/lesson08_Nearbystars';
import { lesson09_Milkyway as lesson09_MilkyWay } from './lessons/lesson09_Milkyway';
import { lesson10_Localgroup as lesson10_LocalGroup } from './lessons/lesson10_Localgroup';
import { lesson11_Laniakea } from './lessons/lesson11_Laniakea';
import { lesson12_Universe } from './lessons/lesson12_Universe';

// 2. Importación modular de los 12 Tests Evaluativos
import { test01_Earth } from './tests/test01_Earth';
import { test02_Eclipses } from './tests/test02_Eclipses';
import { test03_Rotation as test03_DayNight } from './tests/test03_Rotation';
import { test04_Orbit } from './tests/test04_Orbit';
import { test05_Seasons } from './tests/test05_Seasons';
import { test06_Solarsystem as test06_SolarSystem } from './tests/test06_Solarsystem';
import { test07_Oortvoyager as test07_OortVoyager } from './tests/test07_Oortvoyager';
import { test08_Nearbystars as test08_NearbyStars } from './tests/test08_Nearbystars';
import { test09_Milkyway as test09_MilkyWay } from './tests/test09_Milkyway';
import { test10_Localgroup as test10_LocalGroup } from './tests/test10_Localgroup';
import { test11_Laniakea } from './tests/test11_Laniakea';
import { test12_Universe } from './tests/test12_Universe';

const rawTheories = [
  lesson01_Earth,
  lesson02_Eclipses,
  lesson03_DayNight,
  lesson04_Orbit,
  lesson05_Seasons,
  lesson06_SolarSystem,
  lesson07_OortVoyager,
  lesson08_NearbyStars,
  lesson09_MilkyWay,
  lesson10_LocalGroup,
  lesson11_Laniakea,
  lesson12_Universe
];

const rawTests = [
  { id: 1, test: test01_Earth },
  { id: 2, test: test02_Eclipses },
  { id: 3, test: test03_DayNight },
  { id: 4, test: test04_Orbit },
  { id: 5, test: test05_Seasons },
  { id: 6, test: test06_SolarSystem },
  { id: 7, test: test07_OortVoyager },
  { id: 8, test: test08_NearbyStars },
  { id: 9, test: test09_MilkyWay },
  { id: 10, test: test10_LocalGroup },
  { id: 11, test: test11_Laniakea },
  { id: 12, test: test12_Universe }
];

const testByLessonId = new Map(rawTests.map(t => [t.id, t.test]));

// 3. Catálogo Maestro Ensamblado
export const LESSONS: Lesson[] = rawTheories
  .sort((a, b) => a.id - b.id)
  .map(theory => {
    const testQuestions = testByLessonId.get(theory.id) || [];
    return {
      ...theory,
      test: testQuestions
    } as Lesson;
  });

// Mapas de acceso en tiempo constante O(1)
export const LESSONS_BY_ID = new Map<number, Lesson>(
  LESSONS.map(l => [l.id, l])
);

export const getLessonById = (id: number): Lesson => {
  return LESSONS_BY_ID.get(id) || LESSONS[0];
};

export const getNextLessonId = (currentId: number): number | null => {
  return currentId < LESSONS.length ? currentId + 1 : null;
};

export const getTotalLessonsCount = (): number => LESSONS.length;
export const getMaxPossibleStars = (): number => LESSONS.length * 3;

export default LESSONS;
