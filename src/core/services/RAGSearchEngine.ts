/**
 * src/core/services/RAGSearchEngine.ts
 * Motor de Búsqueda Semántica (RAG) y Generador de Contexto Fundamentado (Grounded) para Tutoría con IA
 */

import { KnowledgeChunk, KnowledgeItem, SourceReference } from '../types/knowledge';
import { 
  SemanticSearchQuery, 
  SemanticSearchResult, 
  GroundedAIContext, 
  GroundedAIResponse 
} from '../types/rag';
import { knowledgeService } from './KnowledgeService';

export class RAGSearchEngine {
  private static instance: RAGSearchEngine;

  private constructor() {}

  public static getInstance(): RAGSearchEngine {
    if (!RAGSearchEngine.instance) {
      RAGSearchEngine.instance = new RAGSearchEngine();
    }
    return RAGSearchEngine.instance;
  }

  /**
   * Ejecuta una búsqueda semántica basada en keywords y scoring sobre la Knowledge Base
   */
  public search(query: SemanticSearchQuery): SemanticSearchResult[] {
    const rawChunks = knowledgeService.getAllChunks();
    const queryTokens = this.tokenize(query.text);
    const results: SemanticSearchResult[] = [];

    for (const chunk of rawChunks) {
      const item = knowledgeService.getKnowledgeItem(chunk.knowledgeId);
      if (!item) continue;

      if (query.domain && item.domain !== query.domain) continue;

      // Calcular similitud basada en matching de tokens y ponderación de keywords
      const score = this.calculateSimilarity(queryTokens, chunk, item);

      if (score >= (query.minSimilarity || 0.15)) {
        results.push({
          chunk,
          knowledgeItem: item,
          similarityScore: score,
          matchedKeywords: this.getMatchedKeywords(queryTokens, chunk),
          snippet: this.createSnippet(chunk.content, queryTokens)
        });
      }
    }

    // Ordenar de mayor a menor relevancia
    results.sort((a, b) => b.similarityScore - a.similarityScore);

    const maxResults = query.maxResults || 3;
    return results.slice(0, maxResults);
  }

  /**
   * Construye el contexto fundamentado (Grounded Context) para enviar a Gemini
   */
  public buildGroundedContext(userQuery: string, studentAge: number = 14, studentLevel: string = 'Intermedio'): GroundedAIContext {
    const searchResults = this.search({
      text: userQuery,
      maxResults: 4,
      minSimilarity: 0.15
    });

    const retrievedChunks = searchResults.map(r => r.chunk);
    const sourceMap = new Map<string, SourceReference>();

    searchResults.forEach(r => {
      r.chunk.sources.forEach(s => sourceMap.set(s.sourceId, s));
    });

    const verifiedSources = Array.from(sourceMap.values());

    // Ensamblar el System Prompt con restricciones de Grounding estricto
    let knowledgeText = '';
    retrievedChunks.forEach((c, idx) => {
      knowledgeText += `\n[DOCUMENTO DE CONOCIMIENTO #${idx + 1} - ${c.subtopic}]\n${c.content}\n`;
    });

    let sourcesText = '';
    verifiedSources.forEach(s => {
      sourcesText += `- ${s.name} (${s.url}) [Autoridad: ${s.authority}]\n`;
    });

    const systemGroundingPrompt = `Eres el Tutor Educativo de GOALS.
Tu misión es explicar conceptos científicos y pedagógicos adaptados a un estudiante de ${studentAge} años (Nivel: ${studentLevel}).

REGLAS ESTRICTAS DE FUNDAMENTACIÓN (ZERO-HALLUCINATION GROUNDING):
1. Debes responder basándote EXCLUSIVAMENTE en los Documentos de Conocimiento verificados que se te proporcionan a continuación.
2. NUNCA inventes datos, fechas ni teorías que no estén presentes en el contexto.
3. Si el estudiante pregunta algo que no está en los documentos, indica amablemente que aún estamos investigando ese tema y responde con lo que sí esté verificado.
4. Cita las fuentes oficiales relevantes al final de tu explicación.
5. Utiliza un tono motivador, riguroso y con analogías memorables.

DOCUMENTOS DE CONOCIMIENTO VERIFICADOS DE GOALS:
${knowledgeText || 'No se encontraron documentos específicos. Responde con prudencia científica general.'}

FUENTES OFICIALES ASOCIADAS:
${sourcesText || '- Base de Conocimiento Oficial de GOALS'}
`;

    return {
      userQuery,
      studentProfile: {
        age: studentAge,
        level: studentLevel
      },
      retrievedChunks,
      verifiedSources,
      systemGroundingPrompt
    };
  }

  private tokenize(text: string): string[] {
    const stopWords = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'para', 'por', 'con', 'que', 'como', 'es', 'son', 'su', 'sus', 'al', 'se', 'ha', 'muy', 'mas', 'más', 'porque', 'por que', 'cual', 'cuál']);
    
    return text
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !stopWords.has(w));
  }

  private calculateSimilarity(queryTokens: string[], chunk: KnowledgeChunk, item: KnowledgeItem): number {
    if (queryTokens.length === 0) return 0;

    let matchCount = 0;
    const chunkTokens = new Set(this.tokenize(`${chunk.subtopic} ${chunk.content} ${item.title} ${item.concepts.join(' ')}`));
    const keywordSet = new Set(chunk.keywords.map(k => k.toLowerCase()));

    for (const qToken of queryTokens) {
      if (chunkTokens.has(qToken)) {
        matchCount += 1.0;
      }
      if (keywordSet.has(qToken)) {
        matchCount += 1.5; // Mayor peso si coincide con una keyword curada
      }
    }

    const maxPossibleScore = queryTokens.length * 2.5;
    let score = matchCount / maxPossibleScore;

    return Math.min(1.0, score);
  }

  private getMatchedKeywords(queryTokens: string[], chunk: KnowledgeChunk): string[] {
    const qSet = new Set(queryTokens);
    return chunk.keywords.filter(k => qSet.has(k.toLowerCase()));
  }

  private createSnippet(content: string, _queryTokens: string[]): string {
    if (content.length <= 160) return content;
    return content.substring(0, 157) + '...';
  }
}

export const ragSearchEngine = RAGSearchEngine.getInstance();
