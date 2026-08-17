/**
 * CurriculumValidator.ts
 * Validador de Integridad, Consistencia Pedagógica y Derechos de Autor
 */

import { ParsedCurriculumDocument } from './MarkdownCurriculumParser';

export interface ValidationIssue {
  severity: 'critical' | 'warning' | 'info';
  code: string;
  field: string;
  message: string;
  suggestion?: string;
}

export interface ValidationReport {
  isValid: boolean;
  score: number; // 0 a 100
  criticalErrors: ValidationIssue[];
  warnings: ValidationIssue[];
  infos: ValidationIssue[];
  summary: string;
}

export class CurriculumValidator {
  public static validate(doc: ParsedCurriculumDocument): ValidationReport {
    const issues: ValidationIssue[] = [];
    const { lesson, test } = doc;

    // 1. Validar Frontmatter y Metadatos de la Lección
    if (!lesson.title || lesson.title === 'Lección sin título') {
      issues.push({
        severity: 'critical',
        code: 'MISSING_TITLE',
        field: 'title',
        message: 'La lección carece de título principal en el frontmatter.',
        suggestion: 'Agrega title: "Nombre de la Lección" en el encabezado YAML.'
      });
    }

    if (!lesson.disciplineId) {
      issues.push({
        severity: 'critical',
        code: 'MISSING_DISCIPLINE',
        field: 'disciplineId',
        message: 'No se ha especificado la disciplina educativa (disciplineId).',
        suggestion: 'Define disciplineId: "astro" | "languages_en" | "school_math".'
      });
    }

    if (!lesson.heroImage) {
      issues.push({
        severity: 'warning',
        code: 'MISSING_HERO_IMAGE',
        field: 'heroImage',
        message: 'La lección no tiene imagen de portada (heroImage).',
        suggestion: 'Asigna una imagen panorámica de alta resolución de Unsplash o NASA.'
      });
    }

    // 2. Validar Pasos Teóricos (Steps)
    if (!lesson.steps || lesson.steps.length === 0) {
      issues.push({
        severity: 'critical',
        code: 'EMPTY_STEPS',
        field: 'steps',
        message: 'La lección no contiene ningún paso teórico (## Paso X).',
        suggestion: 'Añade al menos 3 pasos estructurados con contenido didáctico.'
      });
    } else if (lesson.steps.length < 3) {
      issues.push({
        severity: 'warning',
        code: 'INSUFFICIENT_STEPS',
        field: 'steps',
        message: `La lección solo tiene ${lesson.steps.length} pasos. El estándar recomendado es entre 3 y 6 pasos.`,
        suggestion: 'Amplía la lección dividiendo conceptos densos en pasos más asimilables.'
      });
    }

    lesson.steps.forEach((step, idx) => {
      const stepNum = step.stepNumber || idx + 1;
      
      if (!step.title || step.title.trim().length === 0) {
        issues.push({
          severity: 'critical',
          code: 'STEP_MISSING_TITLE',
          field: `steps[${idx}].title`,
          message: `El paso #${stepNum} no tiene título.`
        });
      }

      if (!step.content || step.content.trim().length < 40) {
        issues.push({
          severity: 'critical',
          code: 'STEP_CONTENT_TOO_SHORT',
          field: `steps[${idx}].content`,
          message: `El paso #${stepNum} tiene un texto demasiado breve (${step.content?.length || 0} caracteres). Mínimo 40.`,
          suggestion: 'Aporta rigor científico y explicaciones intuitivas.'
        });
      }

      // Validación de Fotos y Atribución
      if (step.photo) {
        if (!step.photo.url || !step.photo.url.startsWith('http')) {
          issues.push({
            severity: 'critical',
            code: 'INVALID_PHOTO_URL',
            field: `steps[${idx}].photo.url`,
            message: `El paso #${stepNum} tiene una URL de imagen inválida o vacía.`
          });
        }
        if (!step.photo.credit || step.photo.credit.trim().length === 0) {
          issues.push({
            severity: 'warning',
            code: 'MISSING_PHOTO_CREDIT',
            field: `steps[${idx}].photo.credit`,
            message: `El paso #${stepNum} incluye foto sin crédito o atribución de autor (ej: NASA / JPL).`,
            suggestion: 'Indica la fuente en el formato ![Caption](url "Crédito").'
          });
        }
      }

      // Didáctica interactiva
      if (!step.wowFact) {
        issues.push({
          severity: 'info',
          code: 'MISSING_WOW_FACT',
          field: `steps[${idx}].wowFact`,
          message: `El paso #${stepNum} no contiene alerta con un dato asombroso.`,
          suggestion: 'Añade una analogía memorable para aumentar la retención del estudiante.'
        });
      }
    });

    // 3. Validar Banco de Preguntas (Test)
    if (!test.questions || test.questions.length === 0) {
      issues.push({
        severity: 'critical',
        code: 'EMPTY_QUESTIONS',
        field: 'test.questions',
        message: 'No se encontraron preguntas de evaluación en la sección ## Test.',
        suggestion: 'Agrega preguntas con formato ### Pregunta 1: Enunciado y opciones - [x] / - [ ].'
      });
    } else if (test.questions.length < 3) {
      issues.push({
        severity: 'warning',
        code: 'FEW_QUESTIONS',
        field: 'test.questions',
        message: `El test solo tiene ${test.questions.length} preguntas. Recomendado: 4-6 preguntas.`,
        suggestion: 'Crea una mezcla equilibrada de preguntas choice y order.'
      });
    }

    test.questions.forEach((q, qIdx) => {
      const qNum = q.id || qIdx + 1;

      if (!q.prompt || q.prompt.trim().length === 0) {
        issues.push({
          severity: 'critical',
          code: 'QUESTION_EMPTY_PROMPT',
          field: `questions[${qIdx}].prompt`,
          message: `La pregunta #${qNum} carece de enunciado.`
        });
      }

      if (q.type === 'choice') {
        if (!q.options || q.options.length < 2) {
          issues.push({
            severity: 'critical',
            code: 'QUESTION_INSUFFICIENT_OPTIONS',
            field: `questions[${qIdx}].options`,
            message: `La pregunta #${qNum} (Choice) debe tener al menos 2 opciones.`
          });
        }
        if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || (q.options && q.correctAnswer >= q.options.length)) {
          issues.push({
            severity: 'critical',
            code: 'INVALID_CORRECT_ANSWER',
            field: `questions[${qIdx}].correctAnswer`,
            message: `La pregunta #${qNum} no tiene una respuesta correcta válida marcada con - [x].`
          });
        }
      } else if (q.type === 'order') {
        if (!q.orderItems || q.orderItems.length < 3) {
          issues.push({
            severity: 'critical',
            code: 'ORDER_TOO_FEW_ITEMS',
            field: `questions[${qIdx}].orderItems`,
            message: `La pregunta #${qNum} (Order) requiere al menos 3 elementos ordenables.`
          });
        }
      }

      if (!q.explanation || q.explanation.includes('Revisa el material')) {
        issues.push({
          severity: 'info',
          code: 'GENERIC_EXPLANATION',
          field: `questions[${qIdx}].explanation`,
          message: `La pregunta #${qNum} tiene una explicación pedagógica genérica o ausente.`,
          suggestion: 'Añade > **Explicación**: Razón científica por la que la opción correcta es verídica.'
        });
      }
    });

    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;

    let score = 100 - (criticalCount * 30) - (warningCount * 10) - (infoCount * 2);
    if (score < 0) score = 0;

    const isValid = criticalCount === 0;

    return {
      isValid,
      score,
      criticalErrors: issues.filter(i => i.severity === 'critical'),
      warnings: issues.filter(i => i.severity === 'warning'),
      infos: issues.filter(i => i.severity === 'info'),
      summary: isValid 
        ? `✅ Lección Válida (Puntuación de Calidad: ${score}/100) con ${warningCount} advertencias.`
        : `🛑 Fallo de Integridad: ${criticalCount} errores críticos que impiden la compilación.`
    };
  }
}
