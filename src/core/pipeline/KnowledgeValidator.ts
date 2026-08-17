/**
 * src/core/pipeline/KnowledgeValidator.ts
 * Validador de Integridad y Rigor de Elementos de la Knowledge Base
 */

import { ParsedKnowledgeDocument } from './KnowledgeParser';

export interface KnowledgeValidationIssue {
  severity: 'critical' | 'warning' | 'info';
  code: string;
  field: string;
  message: string;
}

export interface KnowledgeValidationReport {
  isValid: boolean;
  score: number; // 0 a 100
  criticalErrors: KnowledgeValidationIssue[];
  warnings: KnowledgeValidationIssue[];
  infos: KnowledgeValidationIssue[];
  summary: string;
}

export class KnowledgeValidator {
  public static validate(doc: ParsedKnowledgeDocument): KnowledgeValidationReport {
    const issues: KnowledgeValidationIssue[] = [];
    const { item, chunks } = doc;

    // 1. Validar Identificadores
    if (!item.id || !item.id.startsWith('know_')) {
      issues.push({
        severity: 'critical',
        code: 'INVALID_KNOWLEDGE_ID',
        field: 'id',
        message: 'El ID de knowledge debe comenzar con "know_"'
      });
    }

    if (!item.slug || !item.slug.includes('.')) {
      issues.push({
        severity: 'critical',
        code: 'INVALID_SLUG',
        field: 'slug',
        message: 'El slug debe seguir el formato jerárquico domain.subject.topic (ej: astronomy.solar_system.mars)'
      });
    }

    if (!item.title || item.title.length < 5) {
      issues.push({
        severity: 'critical',
        code: 'SHORT_TITLE',
        field: 'title',
        message: 'El título debe tener al menos 5 caracteres.'
      });
    }

    // 2. Validar Fuentes Oficiales
    if (!item.sources || item.sources.length === 0) {
      issues.push({
        severity: 'critical',
        code: 'MISSING_SOURCES',
        field: 'sources',
        message: 'Todo elemento de la Knowledge Base debe tener al menos 1 fuente oficial verificada (NASA, ESA, etc.).'
      });
    } else {
      item.sources.forEach((s, idx) => {
        if (!s.url || !s.url.startsWith('http')) {
          issues.push({
            severity: 'warning',
            code: 'INVALID_SOURCE_URL',
            field: `sources[${idx}].url`,
            message: `La fuente ${s.name} no tiene una URL válida.`
          });
        }
      });
    }

    // 3. Validar Chunks
    if (!chunks || chunks.length === 0) {
      issues.push({
        severity: 'critical',
        code: 'NO_CHUNKS_EXTRACTED',
        field: 'chunks',
        message: 'No se pudieron extraer fragmentos (chunks) de texto para la búsqueda semántica. Añade encabezados ##.'
      });
    } else {
      chunks.forEach((c, idx) => {
        if (!c.content || c.content.length < 50) {
          issues.push({
            severity: 'warning',
            code: 'SHORT_CHUNK_CONTENT',
            field: `chunks[${idx}].content`,
            message: `El chunk "${c.subtopic}" tiene un contenido demasiado breve (${c.content.length} caracteres).`
          });
        }
      });
    }

    // 4. Validar Hechos (Facts)
    if (!item.facts || item.facts.length === 0) {
      issues.push({
        severity: 'warning',
        code: 'NO_FACTS',
        field: 'facts',
        message: 'Se recomienda incluir al menos 2 hechos contrastados (facts) con wowFactor.'
      });
    }

    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;

    let score = 100 - (criticalCount * 35) - (warningCount * 10) - (infoCount * 2);
    if (score < 0) score = 0;

    const isValid = criticalCount === 0;

    return {
      isValid,
      score,
      criticalErrors: issues.filter(i => i.severity === 'critical'),
      warnings: issues.filter(i => i.severity === 'warning'),
      infos: issues.filter(i => i.severity === 'info'),
      summary: isValid 
        ? `✅ Knowledge Item Válido (Calidad: ${score}/100) — ${chunks.length} chunks listos para RAG.`
        : `🛑 Fallo de Integridad: ${criticalCount} errores críticos.`
    };
  }
}
