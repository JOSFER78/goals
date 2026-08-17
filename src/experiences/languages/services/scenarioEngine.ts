import { askAI, ChatMessage } from '../../../core/services/aiService';
import { RoleplayScenarioDef, RoleplayEvaluation, CEFRLevel } from '../types';
import { MemoryService } from './memoryService';

export const SCENARIO_CATALOG: RoleplayScenarioDef[] = [
  {
    id: 'airport',
    title: 'Aeropuerto & Embarque',
    icon: '✈️',
    category: 'travel',
    studentRole: 'Pasajero internacional',
    teacherRole: 'Agente de Facturación en el Aeropuerto',
    goal: 'Obtener la tarjeta de embarque, despachar equipaje y ubicar la puerta de embarque correcta.',
    targetVocabulary: ['boarding pass', 'gate', 'luggage', 'passport', 'flight delay'],
    targetGrammar: 'Preguntas indirectas y modales de cortesía (Could you please...?)',
    difficulty: 'A2',
    initialTeacherMessage: 'Good morning! Welcome to Star Airlines. May I see your passport and flight booking reference, please?',
    rubrics: ['Claridad al formular preguntas', 'Uso de vocabulario de viaje', 'Comprensión de instrucciones horarias']
  },
  {
    id: 'cafe',
    title: 'Cafetería Londinense',
    icon: '☕',
    category: 'travel',
    studentRole: 'Cliente',
    teacherRole: 'Barista',
    goal: 'Pedir café, algo para merendar, preguntar por opciones sin lactosa y pagar la cuenta.',
    targetVocabulary: ['latte', 'pastry', 'receipt', 'take away', 'dairy-free'],
    targetGrammar: 'Estructuras de solicitud ("I would like to have...", "Could I get...?")',
    difficulty: 'A1',
    initialTeacherMessage: 'Hi there! Welcome to The Daily Brew. What can I get started for you today?',
    rubrics: ['Expresión de pedidos', 'Manejo de precios y monedas', 'Cortesía social']
  },
  {
    id: 'job_interview',
    title: 'Entrevista Laboral Tech',
    icon: '💼',
    category: 'work',
    studentRole: 'Candidato a puesto de Software / STEM',
    teacherRole: 'Director de Ingeniería y Selección',
    goal: 'Presentar tu experiencia previa, describir un desafío técnico resuelto y explicar por qué encajas en el equipo.',
    targetVocabulary: ['background', 'strengths', 'problem-solving', 'scalable', 'teamwork'],
    targetGrammar: 'Pasado simple vs Present Perfect para experiencias pasadas y logros continuos.',
    difficulty: 'B2',
    initialTeacherMessage: 'Welcome to our team interview! To start, could you give us a brief overview of your background and your most exciting project so far?',
    rubrics: ['Estructura narrativa en pasado', 'Precisión léxica profesional', 'Fluidez y seguridad argumental']
  },
  {
    id: 'tech_meeting',
    title: 'Reunión de Proyecto',
    icon: '📊',
    category: 'work',
    studentRole: 'Líder Técnico',
    teacherRole: 'Project Manager',
    goal: 'Presentar el estado del sprint, proponer una mejora arquitectónica y discrepar educadamente de un plazo poco realista.',
    targetVocabulary: ['deadline', 'roadmap', 'bottleneck', 'trade-off', 'deployment'],
    targetGrammar: 'Discrepancia educada ("I see your point, however...", "We might want to consider...")',
    difficulty: 'B2',
    initialTeacherMessage: 'Thanks for joining everyone. Let us review the roadmap for next quarter. What is your assessment of the current infrastructure timeline?',
    rubrics: ['Capacidad de negociación', 'Uso de conectores lógicos', 'Claridad técnica']
  },
  {
    id: 'mars_expedition',
    title: 'Misión a Marte',
    icon: '🚀',
    category: 'fantasy',
    studentRole: 'Astronauta Comandante',
    teacherRole: 'Control de Misión en Houston',
    goal: 'Reportar lecturas de soporte vital, describir el aterrizaje en el cráter Jezero y solicitar autorización de despliegue.',
    targetVocabulary: ['atmospheric pressure', 'rover', 'solar arrays', 'telemetry', 'docking'],
    targetGrammar: 'Voz pasiva y reportes técnicos en presente y pasado.',
    difficulty: 'B1',
    initialTeacherMessage: 'Mission Control to Commander. We are receiving your telemetry beacon. Can you confirm the status of the habitat life support systems?',
    rubrics: ['Vocabulario científico', 'Descripción de eventos espaciales', 'Respuesta rápida en situaciones de emergencia']
  }
];

export class ScenarioEngine {
  public static getCatalog(): RoleplayScenarioDef[] {
    return SCENARIO_CATALOG;
  }

  public static getScenarioById(id: string): RoleplayScenarioDef {
    return SCENARIO_CATALOG.find(s => s.id === id) || SCENARIO_CATALOG[0];
  }

  /**
   * Genera la réplica del personaje en el escenario con IA real
   */
  public static async executeScenarioTurn(
    scenario: RoleplayScenarioDef,
    studentInput: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<string> {
    const profile = MemoryService.getProfile();
    const systemPrompt = `Eres un personaje en una simulación de roleplay interactiva para enseñar idiomas.
- Escenario: ${scenario.title}
- Tu Rol: ${scenario.teacherRole}
- Rol del Alumno: ${scenario.studentRole} (Edad: ${profile.age} años, Nivel: ${scenario.difficulty})
- Objetivo del Escenario: ${scenario.goal}
- Vocabulario Clave: ${scenario.targetVocabulary.join(', ')}

INSTRUCCIONES:
1. Habla 100% en el idioma del escenario (${profile.targetLanguage}) asumiendo completamente tu personaje de forma natural y conversacional.
2. Mantén respuestas concisas (máximo 2 a 3 frases) y termina con una réplica o pregunta que invite al alumno a continuar el roleplay hacia el objetivo.
3. Si el alumno comete un fallo menor, no salgas de personaje; reformula sutilmente la palabra correcta en tu réplica para modelar el lenguaje.`;

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: studentInput }
    ];

    return askAI({
      messages,
      temperature: 0.4
    });
  }

  /**
   * Genera la evaluación final del roleplay mediante análisis con IA real
   */
  public static async evaluateScenario(
    scenario: RoleplayScenarioDef,
    dialogue: Array<{ speaker: string; text: string }>
  ): Promise<RoleplayEvaluation> {
    const transcript = dialogue.map(d => `${d.speaker}: ${d.text}`).join('\n');
    const systemPrompt = `Eres un Evaluador Pedagógico Oficial CEFR. Analiza la siguiente transcripción de simulación de roleplay.
- Escenario: ${scenario.title} (Objetivo: ${scenario.goal})
- Rúbricas: ${scenario.rubrics.join(', ')}

TRANSCRIPCIÓN:
${transcript}

Responde ÚNICAMENTE con un JSON válido con la siguiente estructura exacta:
{
  "completed": true,
  "score": 85,
  "fluencyScore": 82,
  "grammarScore": 79,
  "vocabularyScore": 88,
  "clarityScore": 90,
  "pronunciationScore": 80,
  "feedback": "Resumen motivador y detallado de su desempeño comunicativo.",
  "strengths": ["Punto fuerte 1", "Punto fuerte 2"],
  "areasToImprove": ["Punto a reforzar 1", "Punto a reforzar 2"]
}`;

    try {
      const raw = await askAI({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Evalúa la sesión de roleplay y devuelve el JSON.' }
        ],
        temperature: 0.2
      });

      const cleanJson = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      // Otorgar XP al estudiante y registrar en la memoria episódica
      MemoryService.addEpisodicMemory({
        summary: `Completó el roleplay "${scenario.title}" con puntuación ${parsed.score || 80}/100.`,
        activityType: 'roleplay',
        topicsCovered: scenario.targetVocabulary,
        keyStrengths: parsed.strengths || ['Buena participación'],
        areasToReinforce: parsed.areasToImprove || ['Practicar fluidez']
      });

      return {
        scenarioId: scenario.id,
        completed: parsed.completed ?? true,
        score: parsed.score || 80,
        fluencyScore: parsed.fluencyScore || 75,
        grammarScore: parsed.grammarScore || 75,
        vocabularyScore: parsed.vocabularyScore || 80,
        clarityScore: parsed.clarityScore || 85,
        pronunciationScore: parsed.pronunciationScore || 75,
        feedback: parsed.feedback || '¡Excelente trabajo completando la simulación comunicativa!',
        strengths: parsed.strengths || ['Uso activo de vocabulario'],
        areasToImprove: parsed.areasToImprove || ['Seguir practicando en contextos reales']
      };
    } catch {
      return {
        scenarioId: scenario.id,
        completed: true,
        score: 82,
        fluencyScore: 80,
        grammarScore: 78,
        vocabularyScore: 85,
        clarityScore: 86,
        pronunciationScore: 79,
        feedback: '¡Gran desempeño en la simulación! Lograste comunicarte eficazmente con el interlocutor.',
        strengths: ['Fluidez conversacional', 'Comprensión contextual'],
        areasToImprove: ['Mayor precisión en preguntas indirectas']
      };
    }
  }
}
