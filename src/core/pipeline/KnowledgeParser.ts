/**
 * src/core/pipeline/KnowledgeParser.ts
 * Parser de Documentos Markdown de la Knowledge Base de GOALS
 * Extrae Metadatos YAML, Facts, Conceptos y Chunks Granulares para RAG y Búsqueda Semántica.
 */

import { 
  KnowledgeItem, 
  KnowledgeChunk, 
  KnowledgeFact, 
  SourceReference,
  KnowledgeDomain 
} from '../types/knowledge';

export interface ParsedKnowledgeDocument {
  item: KnowledgeItem;
  chunks: KnowledgeChunk[];
}

export class KnowledgeParser {
  private static FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
  private static SECTION_HEADER_REGEX = /^##\s+(?:(\d+)\.|\d+)?\s*(.+)$/m;

  public static parse(markdownContent: string, defaultDomain: KnowledgeDomain = 'astronomy'): ParsedKnowledgeDocument {
    const raw = markdownContent.trim();
    const { frontmatter, contentWithoutFrontmatter } = this.parseFrontmatter(raw);

    const domain = (frontmatter.domain || defaultDomain) as KnowledgeDomain;
    const knowledgeId = frontmatter.id || `know_${domain}_${frontmatter.slug ? frontmatter.slug.replace(/\./g, '_') : 'item'}`;
    const slug = frontmatter.slug || `${domain}.${frontmatter.topic || 'general'}`;
    const title = frontmatter.title || 'Elemento de Conocimiento sin título';
    const summary = frontmatter.summary || '';
    const concepts: string[] = Array.isArray(frontmatter.concepts) ? frontmatter.concepts : [];

    const sources: SourceReference[] = Array.isArray(frontmatter.sources) ? frontmatter.sources.map((s: any) => ({
      sourceId: s.sourceId || s.id || 'src_default',
      name: s.name || 'Fuente Oficial',
      url: s.url || '',
      authority: s.authority || 'verified_web',
      dateAccessed: s.dateAccessed || new Date().toISOString().split('T')[0],
      version: s.version
    })) : [];

    const facts: KnowledgeFact[] = Array.isArray(frontmatter.facts) ? frontmatter.facts.map((f: any) => ({
      fact: typeof f === 'string' ? f : f.fact,
      verified: typeof f === 'object' ? f.verified !== false : true,
      wowFactor: typeof f === 'object' ? f.wowFactor : undefined,
      sourceRefId: typeof f === 'object' ? f.sourceRefId : undefined
    })) : [];

    // Extraer Chunks a partir de las secciones H2 (## 1. ...)
    const sectionChunks = contentWithoutFrontmatter.split(/(?=^##\s+)/m).filter(c => c.trim().length > 0);
    const chunks: KnowledgeChunk[] = [];

    let seq = 1;
    for (const chunkBlock of sectionChunks) {
      if (!chunkBlock.startsWith('## ')) continue;

      const firstLineEnd = chunkBlock.indexOf('\n');
      const headerLine = firstLineEnd === -1 ? chunkBlock : chunkBlock.substring(0, firstLineEnd).trim();
      const body = firstLineEnd === -1 ? '' : chunkBlock.substring(firstLineEnd).trim();

      const headerMatch = headerLine.match(this.SECTION_HEADER_REGEX);
      const subtopic = headerMatch ? headerMatch[2].trim() : headerLine.replace(/^##\s*/, '').trim();

      // Limpiar markdown del texto del chunk
      const cleanContent = body
        .replace(/> \[!(?:NOTE|TIP|IMPORTANT|WARNING|WOW|NOW)\][^\n]*\n(?:>[^\n]*\n?)*/gi, '')
        .replace(/!\[.*?\]\(.*?\)\s*\n\*Crédito:.*?\*/gi, '')
        .replace(/---/g, '')
        .trim();

      // Extraer palabras clave del subtopic y del contenido
      const keywords = this.extractKeywords(`${subtopic} ${cleanContent}`);

      const chunkId = `chunk_${knowledgeId.replace(/^know_/, '')}_${String(seq).padStart(2, '0')}`;

      chunks.push({
        id: chunkId,
        knowledgeId,
        sequence: seq,
        subtopic,
        content: cleanContent,
        keywords,
        sources
      });

      seq++;
    }

    const item: KnowledgeItem = {
      id: knowledgeId,
      slug,
      domain,
      subject: frontmatter.subject || 'General',
      topic: frontmatter.topic || 'General',
      title,
      summary,
      concepts,
      ageMin: Number(frontmatter.ageMin || 6),
      ageMax: Number(frontmatter.ageMax || 99),
      difficulty: frontmatter.difficulty || 'beginner',
      facts,
      sources,
      chunks,
      version: String(frontmatter.version || '1.0.0'),
      status: frontmatter.status || 'published',
      createdAt: Number(frontmatter.createdAt || Date.now()),
      updatedAt: Number(frontmatter.updatedAt || Date.now())
    };

    return { item, chunks };
  }

  private static parseFrontmatter(markdown: string): { frontmatter: Record<string, any>; contentWithoutFrontmatter: string } {
    const match = markdown.match(this.FRONTMATTER_REGEX);
    if (!match) {
      return { frontmatter: {}, contentWithoutFrontmatter: markdown };
    }

    const yamlBlock = match[1];
    const contentWithoutFrontmatter = markdown.substring(match[0].length).trim();
    const frontmatter: Record<string, any> = {};

    const lines = yamlBlock.split(/\r?\n/);
    let currentKey: string | null = null;
    let inArrayOfObjects = false;
    let currentObj: Record<string, any> | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      // Lista de objetos YAML (ej: sources o facts)
      if (trimmed.startsWith('- ') && trimmed.includes(':')) {
        inArrayOfObjects = true;
        currentObj = {};
        if (currentKey) {
          if (!Array.isArray(frontmatter[currentKey])) frontmatter[currentKey] = [];
          frontmatter[currentKey].push(currentObj);
        }
        const itemLine = trimmed.substring(2);
        const cIdx = itemLine.indexOf(':');
        if (cIdx !== -1) {
          const k = itemLine.substring(0, cIdx).trim();
          const v = itemLine.substring(cIdx + 1).trim();
          currentObj[k] = this.castValue(v);
        }
        continue;
      }

      // Propiedades adicionales dentro de un objeto de la lista
      if (inArrayOfObjects && currentObj && line.startsWith('    ') && trimmed.includes(':')) {
        const cIdx = trimmed.indexOf(':');
        if (cIdx !== -1) {
          const k = trimmed.substring(0, cIdx).trim();
          const v = trimmed.substring(cIdx + 1).trim();
          currentObj[k] = this.castValue(v);
        }
        continue;
      }

      // Lista simple de strings
      if (trimmed.startsWith('- ') && currentKey && !inArrayOfObjects) {
        if (!Array.isArray(frontmatter[currentKey])) frontmatter[currentKey] = [];
        frontmatter[currentKey].push(this.castValue(trimmed.substring(2).trim()));
        continue;
      }

      // Clave: Valor raíz
      const colonIdx = line.indexOf(':');
      if (colonIdx !== -1 && !line.startsWith('  ')) {
        inArrayOfObjects = false;
        currentObj = null;
        const key = line.substring(0, colonIdx).trim();
        const rawVal = line.substring(colonIdx + 1).trim();

        if (rawVal === '') {
          currentKey = key;
          frontmatter[key] = [];
        } else {
          currentKey = null;
          frontmatter[key] = this.castValue(rawVal);
        }
      }
    }

    return { frontmatter, contentWithoutFrontmatter };
  }

  private static castValue(val: string): any {
    if (val === 'true') return true;
    if (val === 'false') return false;
    if (val === 'null') return null;
    if (!isNaN(Number(val)) && val !== '') return Number(val);
    if (val.startsWith('[') && val.endsWith(']')) {
      return val.substring(1, val.length - 1).split(',').map(s => this.castValue(s.trim()));
    }
    return val.replace(/^["'](.*)["']$/, '$1');
  }

  private static extractKeywords(text: string): string[] {
    const stopWords = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'en', 'para', 'por', 'con', 'sin', 'sobre', 'que', 'como', 'es', 'son', 'fue', 'era', 'sus', 'su', 'al', 'se', 'ha', 'muy', 'mas', 'más', 'pero', 'o', 'y', 'e']);
    
    const words = text
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.has(w));

    return Array.from(new Set(words)).slice(0, 15);
  }
}
