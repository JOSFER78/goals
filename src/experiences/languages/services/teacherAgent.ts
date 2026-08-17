import { askAI, ChatMessage } from '../../../core/services/aiService';
import { MemoryService } from './memoryService';
import { CEFRLevel } from '../types';

export interface TeacherInteractionResult {
  teacherReply: string;
  pedagogicalTip?: string;
  detectedError?: {
    incorrect: string;
    correction: string;
    category: string;
    explanation: string;
  };
  newVocabulary?: Array<{ term: string; translation: string }>;
  suggestedFollowUp?: string;
  detectedSkillImprovement?: string;
  xpGranted: number;
}

export class TeacherAgent {
  /**
   * Procesa la entrada del alumno (voz o texto) y genera una respuesta pedagógica adaptativa
   */
  public static async interact(
    studentInput: string,
    targetLanguage: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<TeacherInteractionResult> {
    const contextSummary = MemoryService.getPedagogicalContextSummary();
    const profile = MemoryService.getProfile();

    const systemPrompt = `Eres el "Teacher Agent" de GOALS Languages, un profesor particular de ${targetLanguage} empático, altamente pedagógico y conversacional.

${contextSummary}

DIRECTIVAS PEDAGÓGICAS VITALES:
1. TONO Y NIVEL: Adáptate al nivel ${profile.overallLevel} y a la edad de ${profile.age} años. Habla en ${targetLanguage} usando vocabulario comprensible pero enriquecedor.
2. CONVERSACIÓN FLUIDA: Responde con naturalidad, calidez y brevedad (máximo 2 a 3 frases conversacionales).
3. CORRECCIÓN ADAPTATIVA:
   - Si el estudiante comete un error gramatical o léxico relevante (especialmente verbos irregulares, preposiciones o sintaxis), corrígelo con amabilidad e intégralo de forma constructiva.
4. PREGUNTA DE CIERRE: Termina siempre tu respuesta con una pregunta socrática corta para mantener activo el turno de conversación.
5. CONEXIÓN DE INTERESES: Cuando sea oportuno, vincula ejemplos a sus intereses (${profile.interests.join(', ')}).

FORMATO DE RESPUESTA OBLIGATORIO (JSON ESTRICTO):
Responde ÚNICAMENTE con un JSON válido con la siguiente estructura:
{
  "teacherReply": "Tu respuesta principal en ${targetLanguage} dirigiéndote al estudiante",
  "pedagogicalTip": "Consejo pedagógico breve en español si aplica, o null",
  "detectedError": {
    "incorrect": "palabra o frase incorrecta dicha por el alumno",
    "correction": "forma correcta en ${targetLanguage}",
    "category": "irregular_past | prepositions | syntax | phonetics | vocabulary",
    "explanation": "explicación breve y clara en español"
  } | null,
  "newVocabulary": [
    { "term": "palabra clave", "translation": "traducción al español" }
  ],
  "suggestedFollowUp": "Sugerencia rápida de respuesta para el alumno",
  "detectedSkillImprovement": "speaking | grammar | vocabulary | null",
  "xpGranted": 25
}`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: studentInput }
    ];

    try {
      const rawAiResponse = await askAI({
        messages,
        temperature: 0.3
      });

      // Limpiar markdown json si viene envuelto
      const cleanJson = rawAiResponse
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

      let parsed: any;
      try {
        parsed = JSON.parse(cleanJson);
      } catch {
        // Fallback de parseo seguro si la IA responde con texto plano
        parsed = {
          teacherReply: rawAiResponse,
          pedagogicalTip: null,
          detectedError: null,
          newVocabulary: [],
          suggestedFollowUp: 'Can you tell me more?',
          xpGranted: 20
        };
      }

      // Registrar error en la memoria pedagógica persistente si fue detectado
      if (parsed.detectedError && parsed.detectedError.incorrect) {
        MemoryService.recordError(
          parsed.detectedError.incorrect,
          parsed.detectedError.correction,
          parsed.detectedError.category || 'general'
        );
      }

      // Registrar vocabulario nuevo si fue detectado
      if (Array.isArray(parsed.newVocabulary)) {
        parsed.newVocabulary.forEach((v: any) => {
          if (v.term && v.translation) {
            MemoryService.addOrUpdateVocabulary(v.term, v.translation, 'active');
          }
        });
      }

      // Actualizar mastery de habilidad
      if (parsed.detectedSkillImprovement) {
        const skillKey = parsed.detectedSkillImprovement.toLowerCase();
        if (skillKey === 'speaking' || skillKey === 'grammar' || skillKey === 'vocabulary') {
          MemoryService.updateSkillMastery(skillKey as any, 1);
        }
      }

      return {
        teacherReply: parsed.teacherReply || rawAiResponse,
        pedagogicalTip: parsed.pedagogicalTip || undefined,
        detectedError: parsed.detectedError || undefined,
        newVocabulary: parsed.newVocabulary || [],
        suggestedFollowUp: parsed.suggestedFollowUp || undefined,
        detectedSkillImprovement: parsed.detectedSkillImprovement || undefined,
        xpGranted: parsed.xpGranted || 20
      };
    } catch (error: any) {
      console.warn('TeacherAgent error:', error);
      return {
        teacherReply: `Great effort! Keep practicing in ${targetLanguage}. What would you like to explore next?`,
        pedagogicalTip: 'Sigue practicando para aumentar tu fluidez verbal.',
        xpGranted: 10
      };
    }
  }

  /**
   * Genera una explicación pedagógica profunda de un punto gramatical o duda lingüística
   */
  public static async explainConcept(
    concept: string,
    targetLanguage: string
  ): Promise<string> {
    const profile = MemoryService.getProfile();
    const systemPrompt = `Eres un Profesor de Idiomas experto. Explica de forma súper visual, amena y estructurada el siguiente concepto en ${targetLanguage} adaptado a un estudiante de ${profile.age} años (Nivel ${profile.overallLevel}). Usa ejemplos claros, emojis y analogías cotidianas.`;

    return askAI({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Explícame por favor: ${concept}` }
      ],
      temperature: 0.3
    });
  }
}
