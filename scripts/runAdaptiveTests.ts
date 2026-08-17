/**
 * scripts/runAdaptiveTests.ts
 * Runner de pruebas unitarias y de integración para la arquitectura adaptativa de GOALS
 */

import { runRealUserPathTestSuite } from '../src/core/__tests__/adaptiveCurriculum.real-user-path.test';

console.log('🚀 INICIANDO EJECUCIÓN DE PRUEBAS ADAPTATIVAS DE GOALS...\n');

try {
  const result = runRealUserPathTestSuite();
  if (result.failed > 0) {
    console.error(`\n❌ Se encontraron ${result.failed} fallos en la suite de pruebas.`);
    process.exit(1);
  } else {
    console.log(`\n🎉 Todas las ${result.passed} aserciones pasaron satisfactoriamente.`);
    process.exit(0);
  }
} catch (err) {
  console.error('💥 Error inesperado durante la ejecución de los tests:', err);
  process.exit(1);
}
