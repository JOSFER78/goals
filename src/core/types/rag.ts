/**
 * src/core/types/rag.ts
 * Tipos para el Motor de Búsqueda Semántica (RAG) y Tutoría con IA Fundamentada (Grounded)
 */

import { KnowledgeChunk, KnowledgeItem, SourceReference } from './knowledge';

export interface SemanticSearchQuery {
  text: string;
  domain?: string;
  targetAge?: number;
  maxResults?: number;
  minSimilarity?: number; // 0.0 a 1.0
}

export interface SemanticSearchResult {
  chunk: KnowledgeChunk;
  knowledgeItem: KnowledgeItem;
  similarityScore: number;    // 0.0 a 1.0
  matchedKeywords: string[];
  snippet: string;
}

export interface GroundedAIContext {
  userQuery: string;
  studentProfile?: {
    age?: number;
    level?: string;
    learningPreferences?: string;
  };
  retrievedChunks: KnowledgeChunk[];
  verifiedSources: SourceReference[];
  systemGroundingPrompt: string;
}

export interface GroundedAIResponse {
  answerMarkdown: string;
  usedKnowledgeIds: string[];
  citedSources: SourceReference[];
  confidence: number;
  suggestedFollowUpQuestions: string[];
}
