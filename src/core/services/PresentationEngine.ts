/**
 * src/core/services/PresentationEngine.ts
 * Motor de Presentación Adaptativa de GOALS
 * Modula dinámicamente la profundidad conceptual, densidad visual,
 * estilo de interacción y formato de evaluación según la edad (6–15 años).
 */

import { 
  PresentationProfile, 
  AgeTranche, 
  EducationalStage,
  TextDepth,
  VisualDensity,
  InteractionMode,
  QuizFormat
} from '../types/adaptiveCurriculum';

export class PresentationEngine {
  /**
   * Obtiene el tramo de edad normativo a partir de los años cumplidos
   */
  public static getTrancheForAge(age: number): AgeTranche {
    if (age <= 7) return '6-7';
    if (age <= 9) return '8-9';
    if (age <= 11) return '10-11';
    if (age <= 13) return '12-13';
    return '14-15';
  }

  /**
   * Obtiene la etapa educativa formal (LOMLOE) según la edad
   */
  public static getEducationalStage(age: number): EducationalStage {
    if (age <= 7) return 'primaria_1_ciclo';
    if (age <= 9) return 'primaria_2_ciclo';
    if (age <= 11) return 'primaria_3_ciclo';
    if (age <= 13) return 'eso_1_ciclo';
    return 'eso_2_ciclo';
  }

  /**
   * Genera el perfil de presentación multidimensional (alias para computeProfile)
   */
  public static computeProfile(age: number): PresentationProfile {
    return this.getPresentationProfile(age);
  }

  public static getPresentationProfile(age: number): PresentationProfile {
    const tranche = this.getTrancheForAge(age);

    switch (tranche) {
      case '6-7':
        return {
          ageTranche: '6-7',
          lomloeReference: '1º-2º Primaria',
          analogyDomain: 'juguetes, animales, naturaleza y cuentos cotidianos',
          scaffoldingLevel: 'high_guided',
          tone: 'juguetón, entusiasta, muy cariñoso y de frases cortas',
          maxResponseSentences: 2,
          textDepth: 'concise',
          visualDensity: 'spacious',
          interactionMode: 'playful_guided',
          quizFormat: 'binary_emoji',
          showSourcesDirectly: false,
          show3DParameters: false,
          allowCameraFreeFlight: false,
          aiPersona: 'cosmic_pet',
          aiPromptInstructions: 'Habla como una mascota espacial juguetona y entusiasta. Usa frases cortas (<15 palabras), muchas analogías con juguetes, naturaleza y animales. Refuerza siempre el esfuerzo y evita terminología abstracta o números complejos.'
        };

      case '8-9':
        return {
          ageTranche: '8-9',
          lomloeReference: '3º-4º Primaria',
          analogyDomain: 'deportes, construcción, inventos y exploración',
          scaffoldingLevel: 'moderate_scaffolding',
          tone: 'curioso, cercano, motivador y explorador',
          maxResponseSentences: 3,
          textDepth: 'concise',
          visualDensity: 'balanced',
          interactionMode: 'playful_guided',
          quizFormat: 'multiple_choice_3',
          showSourcesDirectly: false,
          show3DParameters: false,
          allowCameraFreeFlight: true,
          aiPersona: 'friendly_tutor',
          aiPromptInstructions: 'Habla como un guía de expedición espacial amigable. Plantea preguntas curiosas, usa comparaciones cotidianas y explica el porqué de los fenómenos con ejemplos visuales.'
        };

      case '10-11':
        return {
          ageTranche: '10-11',
          lomloeReference: '5º-6º Primaria',
          analogyDomain: 'experimentos científicos, viajes espaciales y escalas del sistema solar',
          scaffoldingLevel: 'autonomous_socratic',
          tone: 'socrático, estructurado, motivador y reflexivo',
          maxResponseSentences: 4,
          textDepth: 'standard',
          visualDensity: 'balanced',
          interactionMode: 'tactile_interactive',
          quizFormat: 'standard_4',
          showSourcesDirectly: true,
          show3DParameters: true,
          allowCameraFreeFlight: true,
          aiPersona: 'socratic_mentor',
          aiPromptInstructions: 'Actúa como un mentor socrático. Guía al estudiante a deducir las respuestas mediante pistas lógicas, menciona misiones espaciales reales y datos cuantitativos sencillos (km/h, distancias en UA).'
        };

      case '12-13':
        return {
          ageTranche: '12-13',
          lomloeReference: '1º-2º ESO',
          analogyDomain: 'física aplicada, tecnología espacial y modelos matemáticos introductorios',
          scaffoldingLevel: 'autonomous_socratic',
          tone: 'académico, riguroso, analítico y respetuoso',
          maxResponseSentences: 5,
          textDepth: 'in_depth',
          visualDensity: 'dense',
          interactionMode: 'tactile_interactive',
          quizFormat: 'standard_4',
          showSourcesDirectly: true,
          show3DParameters: true,
          allowCameraFreeFlight: true,
          aiPersona: 'socratic_mentor',
          aiPromptInstructions: 'Actúa como un profesor de ciencias riguroso y estimulante. Introduce conceptos de física elemental (gravedad newtoniana, óptica, velocidades orbitales), exige precisión en el vocabulario y cita descubrimientos actuales.'
        };

      case '14-15':
      default:
        return {
          ageTranche: '14-15',
          lomloeReference: '3º-4º ESO',
          analogyDomain: 'astrofísica teórica, relatividad, física cuántica y ecuaciones formales',
          scaffoldingLevel: 'rigorous_formal',
          tone: 'formal, de alta precisión científica, con rigor pre-universitario',
          maxResponseSentences: 6,
          textDepth: 'in_depth',
          visualDensity: 'dense',
          interactionMode: 'analytical_formal',
          quizFormat: 'analytical_calc',
          showSourcesDirectly: true,
          show3DParameters: true,
          allowCameraFreeFlight: true,
          aiPersona: 'science_colleague',
          aiPromptInstructions: 'Comunícate como un investigador astrofísico con un estudiante avanzado. Emplea notación científica, ecuaciones LaTeX (Leyes de Kepler, energía oscura Lambda-CDM, radiación de cuerpo negro), telemetría exacta y análisis crítico de evidencias empíricas.'
        };
    }
  }

  /**
   * Formatea la etiqueta de nivel para la UI (ej: "3º de Primaria • 8-9 años")
   */
  public static getLevelBadge(age: number): { label: string; stageTitle: string; color: string } {
    const stage = this.getEducationalStage(age);
    switch (stage) {
      case 'primaria_1_ciclo':
        return { label: '1º-2º Primaria (6–7 años)', stageTitle: 'Etapa Inicial', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'primaria_2_ciclo':
        return { label: '3º-4º Primaria (8–9 años)', stageTitle: 'Explorador', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' };
      case 'primaria_3_ciclo':
        return { label: '5º-6º Primaria (10–11 años)', stageTitle: 'Avanzado', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'eso_1_ciclo':
        return { label: '1º-2º ESO (12–13 años)', stageTitle: 'Científico Junior', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'eso_2_ciclo':
        return { label: '3º-4º ESO (14–15 años)', stageTitle: 'Astrofísico Pre-Uni', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
    }
  }
}
