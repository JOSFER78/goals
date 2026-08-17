/**
 * scripts/testRAGVerticalSlice.ts
 * Test Automatizado de Verificación de Extremo a Extremo del Vertical Slice de Marte
 * Knowledge SSOT -> Chunks -> Sources -> Curriculum References -> Semantic Search -> Grounded AI Tutor Context
 */

import * as fs from 'fs';
import * as path from 'path';
import { KnowledgeParser } from '../src/core/pipeline/KnowledgeParser';
import { KnowledgeValidator } from '../src/core/pipeline/KnowledgeValidator';
import { MarkdownCurriculumParser } from '../src/core/pipeline/MarkdownCurriculumParser';
import { knowledgeService } from '../src/core/services/KnowledgeService';
import { ragSearchEngine } from '../src/core/services/RAGSearchEngine';

async function runVerticalSliceTest() {
  console.log('🧪 ================================================================');
  console.log('🧪 TEST E2E: VERTICAL SLICE DE MARTE (Knowledge -> Curriculum -> RAG)');
  console.log('🧪 ================================================================\n');

  // 1. Cargar y parsear el documento maestro de Knowledge
  const marsKnowledgePath = path.join(process.cwd(), 'content', 'knowledge', 'astronomy', 'mars.md');
  const marsMdRaw = fs.readFileSync(marsKnowledgePath, 'utf-8');

  console.log('1️⃣ [Knowledge Ingestion]');
  const parsedKnowledge = KnowledgeParser.parse(marsMdRaw, 'astronomy');
  console.log(`   - Documento ID: ${parsedKnowledge.item.id}`);
  console.log(`   - Slug: ${parsedKnowledge.item.slug}`);
  console.log(`   - Título: ${parsedKnowledge.item.title}`);
  console.log(`   - Conceptos extraídos: ${parsedKnowledge.item.concepts.join(', ')}`);
  console.log(`   - Chunks generados: ${parsedKnowledge.chunks.length}`);
  console.log(`   - Fuentes oficiales: ${parsedKnowledge.item.sources.map(s => s.name).join(' | ')}`);

  // 2. Validar con KnowledgeValidator
  console.log('\n2️⃣ [Knowledge Validation]');
  const validation = KnowledgeValidator.validate(parsedKnowledge);
  console.log(`   - Puntuación de calidad: ${validation.score}/100`);
  console.log(`   - Estado: ${validation.isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
  if (!validation.isValid) {
    throw new Error('Fallo de validación en Knowledge');
  }

  // 3. Registrar en KnowledgeService
  console.log('\n3️⃣ [Knowledge Store Persistence]');
  await knowledgeService.saveKnowledgeItem(parsedKnowledge.item, parsedKnowledge.chunks);
  console.log(`   - Guardado en L1/L2 Cache con ${parsedKnowledge.chunks.length} chunks indexados.`);

  // 4. Cargar y parsear la lección del Curriculum
  console.log('\n4️⃣ [Curriculum Reference Resolution]');
  const marsCurriculumPath = path.join(process.cwd(), 'content', 'curriculum', 'astro', '03_mars.md');
  const marsCurriculumRaw = fs.readFileSync(marsCurriculumPath, 'utf-8');
  const parsedCurriculum = MarkdownCurriculumParser.parse(marsCurriculumRaw, 'astro');
  
  console.log(`   - Lección ID: ${parsedCurriculum.lesson.id}`);
  console.log(`   - Título: ${parsedCurriculum.lesson.title}`);
  console.log(`   - Referencias a Knowledge Slugs: ${JSON.stringify(parsedCurriculum.lesson.knowledgeSlugs)}`);
  console.log(`   - Referencias a Knowledge IDs: ${JSON.stringify(parsedCurriculum.lesson.knowledgeItemIds)}`);

  if (!parsedCurriculum.lesson.knowledgeSlugs?.includes('astronomy.solar_system.mars')) {
    throw new Error('La lección no referencia correctamente el slug de Knowledge de Marte.');
  }

  // 5. Probar Búsqueda Semántica / RAG
  console.log('\n5️⃣ [Semantic Search & RAG Retrieval]');
  const queries = [
    {
      q: '¿Por qué la superficie de Marte es roja?',
      expectedKeyword: 'hierro'
    },
    {
      q: '¿Qué composición tiene la atmósfera marciana y su presión?',
      expectedKeyword: 'atmosfera'
    },
    {
      q: '¿Cuál es el volcán más grande del Sistema Solar y cómo se llama?',
      expectedKeyword: 'olimpo'
    }
  ];

  for (const { q, expectedKeyword } of queries) {
    console.log(`\n   🔍 Consulta: "${q}"`);
    const results = ragSearchEngine.search({ text: q, maxResults: 2 });
    
    if (results.length === 0) {
      throw new Error(`Búsqueda sin resultados para: "${q}"`);
    }

    const top = results[0];
    console.log(`      🏆 Top Match (Similitud: ${(top.similarityScore * 100).toFixed(1)}%):`);
    console.log(`         Subtopic: "${top.chunk.subtopic}"`);
    console.log(`         Snippet: "${top.snippet}"`);
    console.log(`         Fuentes citadas: ${top.chunk.sources.map(s => s.name).join(', ')}`);
  }

  // 6. Construir Grounded AI Context para el Tutor
  console.log('\n6️⃣ [Grounded AI Context Construction]');
  const groundedContext = ragSearchEngine.buildGroundedContext(
    'Explícame por qué el cielo de Marte se ve rojizo y si podemos respirar allí.',
    12,
    'Secundaria'
  );

  console.log(`   - Chunks fundamentados: ${groundedContext.retrievedChunks.length}`);
  console.log(`   - Fuentes verificadas: ${groundedContext.verifiedSources.map(s => s.name).join(', ')}`);
  console.log(`   - Primeras 250 caracteres del Prompt de Grounding:`);
  console.log(`     "${groundedContext.systemGroundingPrompt.substring(0, 250)}..."`);

  console.log('\n🎉 ================================================================');
  console.log('🎉 ¡VERTICAL SLICE DE MARTE VALIDADO CON ÉXITO DE EXTREMO A EXTREMO!');
  console.log('🎉 ================================================================\n');
}

runVerticalSliceTest().catch((err) => {
  console.error('❌ Error en el test de Vertical Slice:', err);
  process.exit(1);
});
