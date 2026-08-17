/**
 * src/core/__tests__/adaptiveCurriculum.real-user-path.test.ts
 * 
 * SUITE DE VALIDACIÓN AUTOMATIZADA DE CURRÍCULO ADAPTATIVO REAL
 * 
 * DIRECTIVA OBLIGATORIA:
 * Este test DEBE fallar explícitamente si un usuario de 6 años y uno de 15 años
 * reciben el mismo currículo, las mismas lecciones o la misma ruta de aprendizaje.
 */

import { PresentationEngine } from '../services/PresentationEngine';
import { AdaptiveCosmosCatalogService } from '../../experiences/astro/data/adaptiveCosmosCatalog';
import { DiagnosticEngine } from '../services/DiagnosticEngine';
import { LearningPathEngine } from '../services/LearningPathEngine';
import { StudentLearningState, AgeTranche } from '../types/adaptiveCurriculum';

export function runRealUserPathTestSuite(): { total: number; passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, testName: string, failureMessage: string) {
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      failed++;
      const errMsg = `❌ [FAIL] ${testName}: ${failureMessage}`;
      errors.push(errMsg);
      console.error(`  ${errMsg}`);
    }
  }

  console.log('================================================================');
  console.log('🧪 EJECUTANDO SUITE: adaptiveCurriculum.real-user-path.test');
  console.log('================================================================\n');

  // ------------------------------------------------------------------------
  // TEST 1: Tramo de Edad y Perfiles de Presentación
  // ------------------------------------------------------------------------
  console.log('📋 GRUPO 1: Calibración de Tramo de Edad y Perfil de Presentación');
  {
    const tranche6 = PresentationEngine.getTrancheForAge(6);
    const tranche15 = PresentationEngine.getTrancheForAge(15);
    assert(tranche6 === '6-7', 'Edad 6 años mapea a tramo 6-7', `Recibido: ${tranche6}`);
    assert(tranche15 === '14-15', 'Edad 15 años mapea a tramo 14-15', `Recibido: ${tranche15}`);

    const pres6 = PresentationEngine.computeProfile(6);
    const pres15 = PresentationEngine.computeProfile(15);

    assert(
      pres6.textDepth === 'concise' && pres6.visualDensity === 'spacious',
      'Perfil 6 años: Texto conciso y espaciado',
      `Recibido: textDepth=${pres6.textDepth}, visualDensity=${pres6.visualDensity}`
    );
    assert(
      pres15.textDepth === 'in_depth' && pres15.visualDensity === 'dense',
      'Perfil 15 años: Texto profundo y denso',
      `Recibido: textDepth=${pres15.textDepth}, visualDensity=${pres15.visualDensity}`
    );
    assert(
      pres6.aiPersona === 'cosmic_pet' && pres15.aiPersona === 'science_colleague',
      'IA Persona diferenciada: cosmic_pet (6 años) vs science_colleague (15 años)',
      `Recibido: 6yo=${pres6.aiPersona}, 15yo=${pres15.aiPersona}`
    );
  }

  // ------------------------------------------------------------------------
  // TEST 2: Fuga Curricular (FAIL CRITICAL SI 6 AÑOS Y 15 AÑOS RECIBEN LO MISMO)
  // ------------------------------------------------------------------------
  console.log('\n📋 GRUPO 2: Incompatibilidad Estricta de Rutas Curriculares (Anti-Fuga)');
  {
    const units6 = AdaptiveCosmosCatalogService.getUnitsForTranche('6-7');
    const units15 = AdaptiveCosmosCatalogService.getUnitsForTranche('14-15');

    assert(units6.length > 0, 'Tramo 6-7 tiene unidades definidas', `Longitud: ${units6.length}`);
    assert(units15.length > 0, 'Tramo 14-15 tiene unidades definidas', `Longitud: ${units15.length}`);

    const ids6 = units6.map(u => u.id);
    const ids15 = units15.map(u => u.id);

    // Comprobar que NO comparten el mismo ID de unidad inicial ni conjunto de unidades
    const sameFirstUnit = ids6[0] === ids15[0];
    assert(
      !sameFirstUnit,
      'Unidad inicial de 6 años es radicalmente distinta a la de 15 años',
      `Ambos tienen la misma unidad inicial: ${ids6[0]}`
    );

    const intersection = ids6.filter(id => ids15.includes(id));
    assert(
      intersection.length === 0,
      'Cero solapamiento de IDs de unidades pedagógicas entre 6 y 15 años',
      `Unidades solapadas encontradas: ${intersection.join(', ')}`
    );

    // Comprobar contenidos conceptuales
    const firstUnit6Title = units6[0].title;
    const firstUnit15Title = units15[0].title;
    assert(
      firstUnit6Title !== firstUnit15Title,
      'Títulos de unidades pedagógicas diferenciados por madurez cognitiva',
      `Títulos idénticos: "${firstUnit6Title}"`
    );
  }

  // ------------------------------------------------------------------------
  // TEST 3: Evaluación Diagnóstica Calibrada
  // ------------------------------------------------------------------------
  console.log('\n📋 GRUPO 3: Diagnóstico Conceptual Adaptativo');
  {
    const diagItems6 = DiagnosticEngine.getDiagnosticItemsForStudent('astro', 6);
    const diagItems15 = DiagnosticEngine.getDiagnosticItemsForStudent('astro', 15);

    assert(diagItems6.length >= 2, 'Banco diagnóstico para 6 años contiene preguntas calibradas', `Recibido: ${diagItems6.length}`);
    assert(diagItems15.length >= 2, 'Banco diagnóstico para 15 años contiene preguntas avanzadas', `Recibido: ${diagItems15.length}`);

    // Simulación de evaluación para estudiante de 6 años con 100% aciertos
    const answers6 = diagItems6.map(item => ({
      itemId: item.id,
      selectedOption: item.correctAnswer,
      isCorrect: true,
      conceptKey: item.conceptKey
    }));

    const evalResult6 = DiagnosticEngine.evaluateDiagnostic(
      'student_6',
      'astro',
      6,
      answers6
    );

    assert(
      evalResult6.initialMasteryPercent === 100,
      'Estudiante de 6 años con respuestas correctas obtiene 100% de maestría inicial',
      `Recibido: ${evalResult6.initialMasteryPercent}%`
    );
    assert(
      evalResult6.recommendedStartUnitId.includes('6_7'),
      'Unidad de inicio recomendada para 6 años pertenece al tramo 6-7',
      `Recibido: ${evalResult6.recommendedStartUnitId}`
    );
  }

  // ------------------------------------------------------------------------
  // TEST 4: Generación Dinámica de Learning Path
  // ------------------------------------------------------------------------
  console.log('\n📋 GRUPO 4: Motor de Generación Dinámica de Learning Path');
  {
    const units8 = AdaptiveCosmosCatalogService.getUnitsForTranche('8-9');
    const firstUnitId = units8[0].id; // 'astro_8_9_u01_atmosphere_satellites'
    const secondUnitId = units8[1]?.id || 'astro_8_9_u02_eclipses_2026';

    const stateFresh: StudentLearningState = {
      userId: 'user_test_8yo',
      disciplineId: 'astro',
      age: 8,
      grade: '3º de Primaria',
      diagnosticStatus: 'completed',
      ageTranche: '8-9',
      currentUnitId: firstUnitId,
      completedUnitIds: [],
      conceptMastery: {},
      weakConcepts: [],
      strengths: [],
      sessionHistory: [],
      updatedAt: Date.now()
    };

    const path = LearningPathEngine.computeLearningPath(stateFresh, units8);

    assert(
      path.currentUnit.unitId === firstUnitId,
      'LearningPath asigna la primera unidad como activa para estudiante nuevo',
      `Recibido: ${path.currentUnit.unitId}`
    );
    assert(
      path.completedUnitsCount === 0 && path.progressPercent === 0,
      'Progreso inicial es 0%',
      `Recibido: ${path.progressPercent}%`
    );

    // Simular que completa la unidad 1 con maestría
    const stateUnit1Done: StudentLearningState = {
      ...stateFresh,
      completedUnitIds: [firstUnitId],
      conceptMastery: {
        'astronomy.earth.atmosphere': {
          conceptKey: 'astronomy.earth.atmosphere',
          scorePercent: 95,
          totalAttempts: 1,
          lastPracticedAt: Date.now(),
          status: 'mastered'
        }
      },
      currentUnitId: secondUnitId
    };

    const pathUpdated = LearningPathEngine.computeLearningPath(stateUnit1Done, units8);
    assert(
      pathUpdated.completedUnitsCount === 1,
      'LearningPath refleja 1 unidad completada',
      `Recibido: ${pathUpdated.completedUnitsCount}`
    );
    assert(
      pathUpdated.progressPercent > 0,
      'Porcentaje de progreso calculado reactivamente (>0%)',
      `Recibido: ${pathUpdated.progressPercent}%`
    );
  }

  // ------------------------------------------------------------------------
  // RESUMEN FINAL
  // ------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`📊 RESULTADOS: ${passed} PASADOS, ${failed} FALLADOS (TOTAL: ${passed + failed})`);
  console.log('================================================================\n');

  if (failed > 0) {
    console.error('❌ LA SUITE DE TESTS ADAPTATIVOS HA FALLADO.');
  } else {
    console.log('✨ TODOS LOS TESTS DE CURRÍCULO ADAPTATIVO HAN SIDO SATISFECHOS AL 100%.');
  }

  return { total: passed + failed, passed, failed, errors };
}

// Ejecutar directamente si corre en CLI
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('real-user-path.test')) {
  const res = runRealUserPathTestSuite();
  if (res.failed > 0) {
    process.exit(1);
  }
}
