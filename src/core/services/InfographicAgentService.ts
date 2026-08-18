/**
 * src/core/services/InfographicAgentService.ts
 * Generador Agéntico de Infografías y Desglose Visual de Cuadernos con IA Real
 */

import { askAI, askAIVision, getChildProfile } from './aiService';
import { EducationalInfographicPayload } from '../types/visualInfographic';

export class InfographicAgentService {
  /**
   * Genera una Infografía Conceptual Completa a partir de una duda o tema
   */
  static async generateConceptualInfographic(
    subject: string,
    topicOrQuery: string,
    age?: number
  ): Promise<EducationalInfographicPayload> {
    const profile = getChildProfile();
    const childAge = age || profile.age || 9;
    const hobbies = profile.interests.join(', ') || 'videojuegos, deportes, ciencia y naturaleza';

    const systemPrompt = `Eres el Agente Diseñador de Infografías y Esquemas Didácticos de GOALS.
Tu objetivo es estructurar una explicación en formato de Infografía Visual Interactiva y Modular para un estudiante de ${childAge} años.
Adapta el lenguaje, usa analogías con sus hobbies (${hobbies}) y estructura la respuesta ÚNICAMENTE en JSON válido con el siguiente esquema exacto:

{
  "mode": "conceptual",
  "title": "Título llamativo e impactante con emoji",
  "subtitle": "Subtítulo didáctico y contextualizador",
  "subject": "${subject}",
  "topic": "${topicOrQuery}",
  "summaryQuote": "Frase memorable o principio fundamental en una sola línea",
  "keyTakeaways": [
    {
      "id": "kt-1",
      "icon": "⚡",
      "title": "Punto clave 1",
      "description": "Explicación directa en 1 frase",
      "tag": "Esencial",
      "color": "emerald"
    }
  ],
  "flowDiagram": [
    {
      "stepNumber": 1,
      "title": "Paso o fase 1",
      "shortDesc": "Qué ocurre primero",
      "details": "Detalle pedagógico del paso",
      "connectorLabel": "luego produce"
    }
  ],
  "conceptCards": [
    {
      "id": "c-1",
      "concept": "Nombre del Concepto",
      "subtitle": "¿Qué significa realmente?",
      "simpleExplanation": "Explicación clara como para un niño de ${childAge} años.",
      "realWorldAnalogy": "Analogía cotidiana o con la vida real.",
      "formulaOrRule": "Fórmula matemática, regla mnemotécnica o dato clave",
      "inDepthNote": "Dato curioso o para profundizar"
    }
  ],
  "quickQuiz": [
    {
      "question": "Pregunta rápida para comprobar comprensión",
      "options": ["Opción A", "Opción B", "Opción C"],
      "correctIndex": 0,
      "explanation": "Por qué esta opción es la correcta."
    }
  ],
  "didacticTip": "Consejo de oro del tutor para no olvidar este concepto"
}`;

    const rawResponse = await askAI({
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Genera la infografía didáctica para la materia ${subject} sobre el tema: "${topicOrQuery}".` }
      ]
    });

    try {
      let cleanJson = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
      }
      const parsed = JSON.parse(cleanJson);
      return {
        ...parsed,
        id: `info_${Date.now()}`,
        generatedAt: Date.now(),
        targetAge: childAge
      };
    } catch (err) {
      console.error('Error parseando JSON de infografía:', err, rawResponse);
      throw new Error('No se pudo estructurar la infografía. Intenta de nuevo.');
    }
  }

  /**
   * Desglosa y genera una infografía interactiva analizando la foto de los apuntes o libreta escolar
   */
  static async deconstructStudentNotes(
    photoBase64OrUrl: string,
    subjectHint: string = 'General'
  ): Promise<EducationalInfographicPayload> {
    const profile = getChildProfile();
    const childAge = profile.age || 9;

    const visionSystemPrompt = `Eres un Profesor Tutor experto en visión artificial y didáctica escolar.
Analizas fotos de apuntes, cuadernos escolares, pizarras o diagramas dibujados a mano por alumnos.
Tu misión es desglosar la foto visualmente e identificar los puntos clave con coordenadas relativas (pines) y redactar una infografía explicativa punto por punto al lado de la imagen.

Devuelve ÚNICAMENTE un JSON válido con esta estructura:
{
  "mode": "notebook_deconstruction",
  "title": "Desglose de Apuntes: [Tema Detectado en la Libreta]",
  "subtitle": "Análisis didáctico visual paso a paso de tu cuaderno",
  "subject": "${subjectHint}",
  "topic": "Tema principal detectado",
  "summaryQuote": "Resumen en una frase de lo que el alumno escribió o dibujó",
  "keyTakeaways": [
    {
      "id": "kt-1",
      "icon": "📝",
      "title": "Idea Principal del Cuaderno",
      "description": "Resumen claro del contenido principal de la foto",
      "tag": "Detectado",
      "color": "cyan"
    }
  ],
  "notebookPins": [
    {
      "id": 1,
      "label": "1",
      "xPercent": 25,
      "yPercent": 30,
      "topicTitle": "Título de la sección o fórmula localizada aquí",
      "explanation": "Explicación clara y didáctica de lo que está escrito en esta zona del cuaderno.",
      "formulaOrKeyRule": "Fórmula corregida o regla clave",
      "teacherTip": "Consejo de corrección o felicitación por el apunte"
    }
  ],
  "conceptCards": [
    {
      "id": "c-1",
      "concept": "Concepto central del apunte",
      "subtitle": "Significado",
      "simpleExplanation": "Explicación simple",
      "realWorldAnalogy": "Ejemplo en la vida diaria"
    }
  ],
  "quickQuiz": [
    {
      "question": "Pregunta sobre lo que hay en tus apuntes",
      "options": ["Opción 1", "Opción 2", "Opción 3"],
      "correctIndex": 0,
      "explanation": "Por qué es correcto."
    }
  ],
  "didacticTip": "Excelente caligrafía/esquema. Recuerda revisar este punto antes del examen."
}`;

    const rawResponse = await askAIVision({
      imageBase64OrUrl: photoBase64OrUrl,
      promptText: `Examina con precisión esta foto de libreta escolar de ${subjectHint}. Identifica las zonas con fórmulas, diagramas o notas y desglósalas con coordenadas porcentuales para los pines interactivos.`,
      systemPrompt: visionSystemPrompt,
      temperature: 0.2
    });

    try {
      let cleanJson = rawResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
      }
      const parsed = JSON.parse(cleanJson);
      return {
        ...parsed,
        id: `info_notes_${Date.now()}`,
        notebookPhotoUrl: photoBase64OrUrl,
        generatedAt: Date.now(),
        targetAge: childAge
      };
    } catch (err) {
      console.error('Error parseando desglose de libreta:', err, rawResponse);
      throw new Error('No se pudo desglosar la foto de los apuntes. Asegúrate de que esté bien iluminada y enfocada.');
    }
  }
}
