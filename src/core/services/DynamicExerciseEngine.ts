/**
 * src/core/services/DynamicExerciseEngine.ts
 * Motor Agéntico de Generación Dinámica de Ejercicios por IA Real (Cero Hardcoding)
 */

import { askAI, getChildProfile } from './aiService';
import { PresentationEngine } from './PresentationEngine';
import { 
  DynamicExerciseBatch, 
  DynamicExerciseItem, 
  ExerciseGenerationOptions, 
  DynamicExerciseType 
} from '../types/dynamicExercise';

export class DynamicExerciseEngine {
  /**
   * Genera al vuelo una batería de ejercicios 100% adaptada al contexto actual.
   */
  public static async generateExerciseBatch(
    options: ExerciseGenerationOptions = {}
  ): Promise<DynamicExerciseBatch> {
    const profile = getChildProfile();
    const childAge = profile.age || 9;
    const tranche = PresentationEngine.getTrancheForAge(childAge);
    const presProfile = PresentationEngine.computeProfile(childAge);

    const questionCount = Math.min(Math.max(options.questionCount || 3, 2), 6);
    const discipline = options.discipline || 'school';
    const allowedTypes: DynamicExerciseType[] = options.allowedTypes || ['choice', 'fill_gap', 'boolean', 'numeric_calc'];

    // 1. Extraer o inferir el tema del contexto conversacional o del parámetro
    let topicToUse = options.topic || '';
    if (!topicToUse && options.customContextText) {
      topicToUse = options.customContextText.slice(0, 150);
    } else if (!topicToUse && options.conversationHistory && options.conversationHistory.length > 0) {
      const lastMessages = options.conversationHistory.slice(-4).map(m => m.content).join(' ');
      topicToUse = lastMessages.slice(0, 180);
    }

    if (!topicToUse.trim()) {
      topicToUse = `Conceptos fundamentales de ${discipline === 'astro' ? 'Astronomía y Física Espacial' : discipline === 'languages' ? 'Gramática y Vocabulario en Inglés' : discipline === 'ai-lab' ? 'Inteligencia Artificial y Lógica' : 'Ciencias y Matemáticas'}`;
    }

    // 2. Construir Prompt de Sistema y Schema Estricto para el Modelo
    const systemPrompt = `Eres el Diseñador Pedagógico Agéntico de GOALS.
Tu función es analizar el tema proporcionado y generar una batería interactiva de ${questionCount} ejercicios formativos de altísima calidad pedagógica para un alumno de ${childAge} años (${presProfile.lomloeReference}).

REGLAS DE DISEÑO DIDÁCTICO:
1. ADAPTACIÓN COGNITIVA: Tono ${presProfile.tone}. Nivel de andamiaje: ${presProfile.scaffoldingLevel}.
2. CERO REPETICIÓN: Cada ejercicio debe evaluar un aspecto o matiz diferente del tema.
3. TIPOS PERMITIDOS: Puedes usar combinaciones de los siguientes tipos: ${allowedTypes.join(', ')}.
   - "choice": Pregunta de opción múltiple con 3 o 4 opciones claras y un 'correctIndex' (índice 0-based).
   - "boolean": Afirmación con respuesta verdadera o falsa ('booleanAnswer': true|false).
   - "fill_gap": Frase con marcadores {gap1}, {gap2} en 'templateSentence', 'gapOptions' (distractores + respuestas) y 'correctGaps' en orden.
   - "numeric_calc": Problema de cálculo numérico. Incluye fórmula LaTeX en 'latexFormula' (escapando las barras con doble barra \\\\), 'targetValue' (número), 'tolerance' (ej: 0.1 o 0), 'unit' y 'stepByStepSolution'.
4. PISTAS DIDÁCTICAS: El campo 'hint' debe dar una pista orientadora sin revelar directamente la respuesta final.
5. EXPLICACIONES: El campo 'explanation' debe explicar claramente por qué la solución es correcta y qué principio científico o conceptual lo respalda.
6. MATEMÁTICAS / LATEX: Si hay expresiones matemáticas o científicas, usa formato LaTeX estándar dentro de 'latexFormula' o en los textos (ej: \\\\frac{a}{b}, x^2 + 5x = 0).

FORMATO DE SALIDA OBLIGATORIO:
Debes responder ÚNICAMENTE con un objeto JSON válido (sin comentarios ni texto introductorio) con esta estructura exacta:
{
  "title": "Título descriptivo del reto",
  "topic": "Tema central sintetizado",
  "difficulty": "easy",
  "items": [
    {
      "id": "ex_1",
      "type": "choice",
      "prompt": "Enunciado claro de la pregunta",
      "latexFormula": "Fórmula opcional en LaTeX",
      "hint": "Pista pedagógica socrática",
      "explanation": "Explicación formativa completa",
      "xpReward": 25,
      "timeLimitSeconds": 60,
      "options": ["Opción A", "Opción B", "Opción C"],
      "correctIndex": 0
    }
  ]
}`;

    const userPrompt = `TEMA O CONTEXTO ACTUAL DE APRENDIZAJE:
"${topicToUse}"

ASIGNATURA/DISCIPLINA: ${discipline}
EDAD DEL ALUMNO: ${childAge} años (Tramo ${tranche})
INTERESES DEL ALUMNO: ${profile.interests.join(', ') || 'Exploración, ciencia, videojuegos'}
NÚMERO DE EJERCICIOS A GENERAR: ${questionCount}

Genera la batería de ejercicios en formato JSON válido según el esquema.`;

    // 3. Ejecución contra el Proxy Real de IA (askAI)
    const rawAiResponse = await askAI({
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    // 4. Parser y Normalizador Robusto con Auto-Corrección
    const batch = this.parseAndValidateResponse(rawAiResponse, {
      topic: topicToUse,
      discipline,
      childAge,
      tranche
    });

    return batch;
  }

  private static parseAndValidateResponse(
    rawText: string,
    meta: { topic: string; discipline: any; childAge: number; tranche: any }
  ): DynamicExerciseBatch {
    let cleanJson = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleanJson);
    } catch (err) {
      console.warn('[DynamicExerciseEngine] Error al parsear JSON de IA. Intentando reparación...', err);
      const repaired = cleanJson
        .replace(/,\s*([\]}])/g, '$1')
        .replace(/\\'/g, "'");
      parsed = JSON.parse(repaired);
    }

    const items: DynamicExerciseItem[] = [];
    const rawItems: any[] = Array.isArray(parsed.items) ? parsed.items : [];

    rawItems.forEach((rawItem, idx) => {
      const type: DynamicExerciseType = ['choice', 'fill_gap', 'boolean', 'numeric_calc'].includes(rawItem.type)
        ? rawItem.type
        : 'choice';

      const base = {
        id: `dyn_ex_${Date.now()}_${idx + 1}`,
        type,
        prompt: String(rawItem.prompt || 'Resuelve la siguiente cuestión:'),
        difficulty: (['easy', 'medium', 'hard'].includes(rawItem.difficulty) ? rawItem.difficulty : 'medium') as any,
        xpReward: Number(rawItem.xpReward) || 25,
        timeLimitSeconds: Number(rawItem.timeLimitSeconds) || 60,
        hint: String(rawItem.hint || 'Revisa con calma los conceptos clave vistos en la lección.'),
        explanation: String(rawItem.explanation || '¡Muy buen trabajo aplicando el razonamiento didáctico!'),
        latexFormula: rawItem.latexFormula ? String(rawItem.latexFormula) : undefined,
        contextTag: meta.topic.slice(0, 30)
      };

      if (type === 'choice') {
        const options = Array.isArray(rawItem.options) && rawItem.options.length >= 2
          ? rawItem.options.map(String)
          : ['Opción A', 'Opción B', 'Opción C'];
        const correctIndex = typeof rawItem.correctIndex === 'number' && rawItem.correctIndex >= 0 && rawItem.correctIndex < options.length
          ? rawItem.correctIndex
          : 0;

        items.push({
          ...base,
          type: 'choice',
          options,
          correctIndex
        });
      } else if (type === 'fill_gap') {
        const templateSentence = String(rawItem.templateSentence || 'El resultado es {gap1}.');
        const correctGaps = Array.isArray(rawItem.correctGaps) ? rawItem.correctGaps.map(String) : ['correcto'];
        const gapOptions = Array.isArray(rawItem.gapOptions) && rawItem.gapOptions.length > 0
          ? rawItem.gapOptions.map(String)
          : [...correctGaps, 'distractor1', 'distractor2'];

        items.push({
          ...base,
          type: 'fill_gap',
          templateSentence,
          gapOptions,
          correctGaps
        });
      } else if (type === 'boolean') {
        items.push({
          ...base,
          type: 'boolean',
          booleanAnswer: Boolean(rawItem.booleanAnswer),
          trueLabel: rawItem.trueLabel || 'Verdadero',
          falseLabel: rawItem.falseLabel || 'Falso'
        });
      } else if (type === 'numeric_calc') {
        items.push({
          ...base,
          type: 'numeric_calc',
          targetValue: Number(rawItem.targetValue ?? 0),
          tolerance: Number(rawItem.tolerance ?? 0.01),
          unit: rawItem.unit ? String(rawItem.unit) : undefined,
          stepByStepSolution: Array.isArray(rawItem.stepByStepSolution) ? rawItem.stepByStepSolution.map(String) : undefined
        });
      }
    });

    const totalXp = items.reduce((acc, it) => acc + it.xpReward, 0);

    return {
      id: `batch_${Date.now()}`,
      title: parsed.title || `Desafío Dinámico: ${meta.topic.slice(0, 40)}`,
      topic: parsed.topic || meta.topic,
      discipline: meta.discipline,
      ageTranche: meta.tranche,
      targetAge: meta.childAge,
      difficulty: parsed.difficulty || 'medium',
      totalXp,
      items,
      generatedAt: Date.now(),
      sourceContextSummary: meta.topic
    };
  }
}
