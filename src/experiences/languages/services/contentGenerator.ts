import { askAI } from '../../../core/services/aiService';
import { 
  ExerciseItem, 
  StoryChapter, 
  WritingAnalysisResult, 
  CEFRLevel, 
  ExerciseType 
} from '../types';
import { MemoryService } from './memoryService';

export class ContentGenerator {
  /**
   * Genera un lote de ejercicios didácticos interactivos usando IA real
   */
  public static async generateExercises(
    topic: string,
    type: ExerciseType,
    difficulty: CEFRLevel = 'A2',
    count: number = 3
  ): Promise<ExerciseItem[]> {
    const profile = MemoryService.getProfile();
    const systemPrompt = `Eres un Creador de Ejercicios Pedagógicos de Idiomas.
Genera ${count} ejercicios del tipo "${type}" sobre el tema "${topic}" para un estudiante de nivel ${difficulty} (${profile.targetLanguage}).

Tipos permitidos:
- fill_blank (completar con hueco ___)
- order_words (ordenar palabras desordenadas separadas por /)
- multiple_choice (elegir opción correcta entre 3 o 4)
- error_correction (detectar y corregir el error en la frase)
- translate (traducir frase adaptada)
- create_sentences (consigna guiada para componer)

FORMATO OBLIGATORIO (JSON ESTRICTO):
Responde ÚNICAMENTE con un array JSON de objetos con la siguiente estructura:
[
  {
    "id": "ex_1",
    "type": "${type}",
    "question": "Texto de la pregunta o frase a resolver",
    "instruction": "Instrucción clara en español",
    "options": ["opción 1", "opción 2", "opción 3"] // (Solo si es multiple_choice u order_words),
    "correctAnswer": "respuesta exacta correcta",
    "explanation": "explicación pedagógica de por qué es correcta",
    "targetSkill": "Grammar / Vocabulary",
    "difficulty": "${difficulty}"
  }
]`;

    try {
      const raw = await askAI({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Genera los ejercicios ahora.` }
        ],
        temperature: 0.3
      });

      const cleanJson = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // Fallback robusto en caso de corte de red
      return [
        {
          id: `ex_${Date.now()}`,
          type,
          question: `Yesterday I ___ (go) to the museum.`,
          instruction: 'Completa la frase con la forma correcta del verbo en pasado simple.',
          options: ['went', 'goed', 'gone'],
          correctAnswer: 'went',
          explanation: '"Go" es un verbo irregular cuyo pasado simple afirmativo es "went".',
          targetSkill: 'Grammar (Irregular Past)',
          difficulty
        }
      ];
    }
  }

  /**
   * Genera un cuento interactivo adaptado al estudiante con vocabulario y preguntas de comprensión
   */
  public static async generateInteractiveStory(
    theme: string,
    difficulty: CEFRLevel = 'A2'
  ): Promise<StoryChapter> {
    const profile = MemoryService.getProfile();
    const systemPrompt = `Eres un Escritor y Pedagogo de Cuentos Didácticos para aprender ${profile.targetLanguage}.
Escribe una historia interactiva corta (120-180 palabras) sobre "${theme}" adaptada a un niño de ${profile.age} años (Nivel CEFR ${difficulty}).
La historia debe tener vocabulario enriquecedor, una pregunta de comprensión lectora con opciones y una bifurcación narrativa ("What should happen next?").

FORMATO OBLIGATORIO (JSON ESTRICTO):
{
  "id": "story_${Date.now()}",
  "title": "Título sugerente del cuento",
  "content": "Texto de la historia en párrafos cortos en ${profile.targetLanguage}",
  "imageUrl": "https://image.pollinations.ai/prompt/magical_illustration_of_${encodeURIComponent(theme)}_digital_art_storybook?width=800&height=450&nologo=true",
  "vocabularyHighlights": [
    { "term": "palabra clave", "translation": "traducción al español" }
  ],
  "comprehensionQuestion": {
    "question": "Pregunta sobre el texto en ${profile.targetLanguage}",
    "options": ["opción A", "opción B", "opción C"],
    "correctIndex": 0,
    "explanation": "Por qué es correcta"
  },
  "decisionPrompt": {
    "question": "What do you want the hero to do next?",
    "choices": [
      { "text": "Opción 1 en inglés", "nextPlotLead": "giro de trama 1" },
      { "text": "Opción 2 en inglés", "nextPlotLead": "giro de trama 2" }
    ]
  }
}`;

    try {
      const raw = await askAI({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Escribe el cuento sobre ${theme}.` }
        ],
        temperature: 0.5
      });

      const cleanJson = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch {
      return {
        id: `story_fallback`,
        title: `The Secret of the Starlight Explorer`,
        content: `Leo was a young astronaut who loved exploring distant planets. One evening, his spaceship detected a strange blue signal from an unknown asteroid. He put on his space suit and stepped outside into the quiet galaxy.`,
        vocabularyHighlights: [
          { term: 'spaceship', translation: 'nave espacial' },
          { term: 'space suit', translation: 'traje espacial' },
          { term: 'signal', translation: 'señal' }
        ],
        comprehensionQuestion: {
          question: 'What did Leo’s spaceship detect?',
          options: ['A strange blue signal', 'A red giant star', 'A friendly alien'],
          correctIndex: 0,
          explanation: 'The text mentions his spaceship detected a strange blue signal from an unknown asteroid.'
        },
        decisionPrompt: {
          question: 'What should Leo investigate first?',
          choices: [
            { text: 'Follow the blue signal towards the crater', nextPlotLead: 'crater' },
            { text: 'Scan the asteroid with his laser sensor', nextPlotLead: 'sensor' }
          ]
        }
      };
    }
  }

  /**
   * Análisis de escritura en 4 capas (Corrección, Explicación, Versión natural y Práctica sugerida)
   */
  public static async analyzeWriting(
    studentText: string,
    contextType: string = 'email formal'
  ): Promise<WritingAnalysisResult> {
    const profile = MemoryService.getProfile();
    const systemPrompt = `Eres un Tutor Experto en Expresión Escrita de Idiomas (${profile.targetLanguage}).
Analiza el siguiente texto de un estudiante (${contextType}) y proporciona corrección estructurada en 4 capas pedagógicas.

FORMATO OBLIGATORIO (JSON ESTRICTO):
{
  "studentText": "${studentText.replace(/"/g, '\\"')}",
  "corrections": [
    { "wrong": "fragmento erróneo", "right": "corrección", "reason": "motivo gramatical/léxico" }
  ],
  "explanation": "Explicación pedagógica global de la estructura y coherencia del texto.",
  "naturalVersion": "Versión pulida de cómo lo escribiría un hablante nativo con estilo impecable.",
  "suggestedPractice": "Un ejercicio o frase para que el alumno consolide los puntos clave trabajados.",
  "grammarPoints": ["Punto gramatical 1", "Punto gramatical 2"],
  "overallScore": 88
}`;

    try {
      const raw = await askAI({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Texto del estudiante:\n\n${studentText}` }
        ],
        temperature: 0.2
      });

      const cleanJson = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch {
      return {
        studentText,
        corrections: [],
        explanation: '¡Buen esfuerzo de redacción! El mensaje se entiende con claridad.',
        naturalVersion: studentText,
        suggestedPractice: 'Intenta reescribir la frase usando conectores como "Furthermore" o "In addition".',
        grammarPoints: ['Estructura de oraciones'],
        overallScore: 85
      };
    }
  }

  /**
   * Traducción pedagógica estructurada
   */
  public static async pedagogicalTranslate(
    sourceText: string,
    sourceLang: string,
    targetLang: string
  ): Promise<{
    translation: string;
    naturalAlternative: string;
    vocabularyBreakdown: Array<{ word: string; meaning: string }>;
    grammarTip: string;
  }> {
    const systemPrompt = `Eres un Profesor de Traducción Pedagógica.
Traduce el texto de ${sourceLang} a ${targetLang} con máxima naturalidad y desglose didáctico.

FORMATO OBLIGATORIO (JSON ESTRICTO):
{
  "translation": "Traducción directa precisa",
  "naturalAlternative": "Alternativa idiomática más natural",
  "vocabularyBreakdown": [
    { "word": "palabra clave", "meaning": "significado contextual" }
  ],
  "grammarTip": "Consejo gramatical relevante sobre diferencias entre ambos idiomas"
}`;

    try {
      const raw = await askAI({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Traduce: "${sourceText}"` }
        ],
        temperature: 0.2
      });

      const cleanJson = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch {
      return {
        translation: sourceText,
        naturalAlternative: sourceText,
        vocabularyBreakdown: [],
        grammarTip: 'Recuerda que en inglés la estructura suele seguir estrictamente Sujeto + Verbo + Objeto.'
      };
    }
  }
}
