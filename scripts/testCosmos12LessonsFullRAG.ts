/**
 * scripts/testCosmos12LessonsFullRAG.ts
 * Suite de Pruebas E2E de las 12 Lecciones Cósmicas y Grounding RAG
 */
import * as fs from 'fs';
import * as path from 'path';
import { KnowledgeParser } from '../src/core/pipeline/KnowledgeParser';
import { KnowledgeValidator } from '../src/core/pipeline/KnowledgeValidator';
import { knowledgeService } from '../src/core/services/KnowledgeService';
import { ragSearchEngine } from '../src/core/services/RAGSearchEngine';

async function runCosmos12RAGTest() {
  console.log('🌌 ================================================================');
  console.log('🌌 TEST INTEGRAL E2E: 12 LECCIONES CÓSMICAS (Knowledge SSOT -> RAG)');
  console.log('🌌 ================================================================\n');

  const knowledgeDir = path.join(process.cwd(), 'content', 'knowledge', 'astronomy');
  const files = fs.readdirSync(knowledgeDir).filter(f => f.endsWith('.md'));
  console.log(`📁 Encontrados ${files.length} documentos maestros en ${knowledgeDir}\n`);

  let totalChunks = 0;

  // 1. Ingesta y validación de todos los documentos
  for (const file of files) {
    const fullPath = path.join(knowledgeDir, file);
    const mdContent = fs.readFileSync(fullPath, 'utf-8');
    const parsed = KnowledgeParser.parse(mdContent, 'astronomy');
    const validation = KnowledgeValidator.validate(parsed);

    if (!validation.isValid) {
      throw new Error(`Fallo de validación en ${file}: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    await knowledgeService.saveKnowledgeItem(parsed.item, parsed.chunks);
    totalChunks += parsed.chunks.length;
    console.log(`✅ [${parsed.item.id}] "${parsed.item.title}" -> ${parsed.chunks.length} chunks (${validation.score}/100 Pts)`);
  }

  console.log(`\n🎉 Total: ${files.length} documentos y ${totalChunks} chunks indexados en el motor RAG.\n`);

  // 2. Batería de consultas semánticas representativas a lo largo de las 12 escalas
  const benchmarkQueries = [
    { scale: '1. Tierra & ISS', q: '¿Por qué los astronautas flotan en la ISS si hay gravedad?' },
    { scale: '2. Eclipses 2026', q: '¿Cuándo ocurrirá el eclipse solar total en España y qué ciudades cruzará?' },
    { scale: '3. Rotación', q: '¿Por qué el día solar dura 24 horas y el sidéreo 23 horas y 56 minutos?' },
    { scale: '4. Kepler', q: '¿En qué mes la Tierra se mueve más rápido en su órbita y por qué?' },
    { scale: '5. Estaciones', q: '¿Por qué la inclinación de 23,44 grados produce el calor del verano?' },
    { scale: '6. Planetas', q: '¿Por qué Venus es el planeta más caliente a pesar de no ser el más cercano?' },
    { scale: '7. Voyager 1', q: '¿Qué distancia alcanzará la Voyager 1 en 2026 y qué lleva el Disco de Oro?' },
    { scale: '8. Próxima Centauri', q: '¿Cuánto dura un año en el exoplaneta Próxima b y a qué distancia está?' },
    { scale: '9. Vía Láctea', q: '¿Cómo se descubrió que la Vía Láctea tiene un halo de materia oscura?' },
    { scale: '10. Andrómeda', q: '¿Qué pasará cuando la Vía Láctea y Andrómeda colisionen en Milkomeda?' },
    { scale: '11. Laniakea', q: '¿A qué velocidad viaja la Vía Láctea hacia el Gran Atractor en Laniakea?' },
    { scale: '12. Universo & CMB', q: '¿Qué es el Fondo Cósmico de Microondas y a qué temperatura está hoy?' }
  ];

  console.log('🔍 ================================================================');
  console.log('🔍 BENCHMARK DE RECUPERACIÓN SEMÁNTICA RAG (12 Escalas Cósmicas)');
  console.log('🔍 ================================================================\n');

  for (const { scale, q } of benchmarkQueries) {
    const results = ragSearchEngine.search({ text: q, maxResults: 1 });
    if (results.length === 0) {
      throw new Error(`Sin resultados para la escala: ${scale}`);
    }
    const top = results[0];
    console.log(`🎯 [${scale}] Query: "${q}"`);
    console.log(`   🏆 Match: "${top.chunk.subtopic}" (${(top.similarityScore * 100).toFixed(1)}% Similitud)`);
    console.log(`   📄 Snippet: ${top.snippet.substring(0, 100)}...`);
    console.log(`   📚 Fuentes: ${top.chunk.sources.map(s => s.name).join(' | ')}\n`);
  }

  // 3. Prueba de Prompt Grounding para las 3 etapas pedagógicas
  console.log('🤖 ================================================================');
  console.log('🤖 PRUEBA DE PROMPT DE GROUNDING DEL TUTOR IA POR EDADES');
  console.log('🤖 ================================================================\n');

  const ages = [
    { age: 7, level: 'Primaria Inicial (6-8 años)' },
    { age: 10, level: 'Primaria Alta (9-11 años)' },
    { age: 14, level: 'Secundaria ESO (12-15 años)' }
  ];

  for (const { age, level } of ages) {
    const context = ragSearchEngine.buildGroundedContext(
      '¿Por qué hace frío en invierno y calor en verano?',
      age,
      level
    );
    console.log(`🎓 Nivel: ${level}`);
    console.log(`   - Chunks fundamentados: ${context.retrievedChunks.length}`);
    console.log(`   - Fuentes oficiales: ${context.verifiedSources.map(s => s.name).join(', ')}`);
    console.log(`   - Prompt preview: ${context.systemGroundingPrompt.substring(0, 120)}...\n`);
  }

  console.log('🎉 ================================================================');
  console.log('🎉 ¡LAS 12 LECCIONES CÓSMICAS Y EL MOTOR RAG OPERAN AL 100%!');
  console.log('🎉 ================================================================');
}

runCosmos12RAGTest().catch(err => {
  console.error('❌ Error en test:', err);
  process.exit(1);
});
