/**
 * scripts/pipelineKnowledge.ts
 * Script CLI de Ingesta, Validación y Chunking de la Knowledge Base de GOALS
 * 
 * Uso:
 *   npx tsx scripts/pipelineKnowledge.ts [--sync-firebase] [--domain=astronomy]
 */

import * as fs from 'fs';
import * as path from 'path';
import { KnowledgeParser } from '../src/core/pipeline/KnowledgeParser';
import { KnowledgeValidator } from '../src/core/pipeline/KnowledgeValidator';

const args = process.argv.slice(2);
const shouldSyncFirebase = args.includes('--sync-firebase');
const domainFilter = args.find(a => a.startsWith('--domain='))?.split('=')[1] || 'all';

const ROOT_DIR = process.cwd();
const KNOWLEDGE_DIR = path.join(ROOT_DIR, 'content', 'knowledge');

async function processKnowledge() {
  console.log('🚀 [GOALS Knowledge Pipeline] Iniciando procesamiento de la Knowledge Base...');

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error(`❌ Directorio no encontrado: ${KNOWLEDGE_DIR}`);
    process.exit(1);
  }

  function getMarkdownFiles(dir: string): string[] {
    let results: string[] = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getMarkdownFiles(fullPath));
      } else if (file.endsWith('.md')) {
        results.push(fullPath);
      }
    });
    return results;
  }

  const files = getMarkdownFiles(KNOWLEDGE_DIR);
  console.log(`📄 Encontrados ${files.length} documentos maestros en ${KNOWLEDGE_DIR}`);

  let totalProcessed = 0;
  let totalChunks = 0;
  let totalErrors = 0;

  for (const filePath of files) {
    const relativePath = path.relative(KNOWLEDGE_DIR, filePath);
    const domain = relativePath.split(path.sep)[0] as any;

    if (domainFilter !== 'all' && domain !== domainFilter) continue;

    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = KnowledgeParser.parse(raw, domain);
    const validation = KnowledgeValidator.validate(parsed);

    if (!validation.isValid) {
      console.error(`\n❌ Error de validación en: ${relativePath}`);
      validation.criticalErrors.forEach(e => console.error(`   - [${e.code}] ${e.message}`));
      totalErrors++;
      continue;
    }

    console.log(`✅ [${parsed.item.id}] "${parsed.item.title}" -> ${parsed.chunks.length} chunks generados.`);
    totalProcessed++;
    totalChunks += parsed.chunks.length;
  }

  console.log('\n======================================================');
  console.log(`🎉 Ingesta Completada: ${totalProcessed} documentos procesados, ${totalChunks} chunks generados. (${totalErrors} errores).`);
  console.log('======================================================\n');
}

processKnowledge().catch(console.error);
