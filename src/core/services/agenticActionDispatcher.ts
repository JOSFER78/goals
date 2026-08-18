/**
 * src/core/services/agenticActionDispatcher.ts
 * Clasificador semántico de intenciones de navegación y despachador de acciones
 */

import { AgenticActionPayload, AgenticTourStep } from '../types/mascotSpatial';
import { MascotSpatialRegistry } from './mascotSpatialRegistry';

export class AgenticActionDispatcher {
  private static readonly INTENT_RULES: Array<{
    patterns: RegExp[];
    targetId: string;
    speech: string;
  }> = [
    {
      patterns: [/hacer ejercicios/i, /vamos a practicar/i, /quiero problemas/i, /tarea/i, /ejercicio/i, /practicar/i, /criterio-exercises/i],
      targetId: 'exercises',
      speech: '¡Vamos a practicar! He aterrizado junto a tu panel de ejercicios.',
    },
    {
      patterns: [/pizarra/i, /expl[ií]camelo en la pizarra/i, /dib[uú]jalo/i, /esquema/i, /gr[aá]fico/i, /apuntes a mano/i],
      targetId: 'whiteboard',
      speech: '¡Aquí tienes la pizarra didáctica! Mira cómo se estructura paso a paso.',
    },
    {
      patterns: [/apuntes/i, /escanear apuntes/i, /ocr/i, /c[aá]mara de apuntes/i, /mis notas/i],
      targetId: 'ocr-scanner',
      speech: '¡He llegado al escáner OCR! Coloca aquí tus apuntes para analizarlos.',
    },
    {
      patterns: [/infograf[ií]a/i, /mapa conceptual/i, /diagrama visual/i, /resumen visual/i, /esquema visual/i],
      targetId: 'infographics',
      speech: '¡Fíjate en esta infografía interactiva! Te explica todos los detalles.',
    },
    {
      patterns: [/temario/i, /mapa de la asignatura/i, /curr[ií]culo/i, /lecciones/i, /cosmic-path/i],
      targetId: 'curriculum-map',
      speech: '¡Este es tu mapa de ruta de aprendizaje! Elige tu próxima lección.',
    },
    {
      patterns: [/sistema solar/i, /[oó]rbitas/i, /planetas/i, /simulador 3d/i, /orrery/i],
      targetId: 'orrery-3d',
      speech: '¡Exploremos el modelo 3D del espacio! Pulsa en cualquier planeta.',
    },
    {
      patterns: [/retos celestes/i, /c[aá]lculo orbital/i, /f[ií]sica espacial/i, /kepler/i],
      targetId: 'celestial-quiz',
      speech: '¡Aquí tienes los retos de física y cálculos orbitales!',
    },
    {
      patterns: [/infograf[ií]a astron[oó]mica/i, /esquema c[oó]smico/i, /universo/i],
      targetId: 'astronomy-infographic',
      speech: '¡Pizarrón cósmico activo con distancias y escalas astronómicas!',
    },
    {
      patterns: [/vocabulario/i, /vocab builder/i, /palabras/i, /aprender palabras/i],
      targetId: 'vocab-builder',
      speech: '¡Panel de vocabulario y retos de léxico listo para ti!',
    },
    {
      patterns: [/hablar/i, /conversar/i, /speaking/i, /voz en vivo/i, /pronunciaci[oó]n/i],
      targetId: 'speaking-lab',
      speech: '¡Laboratorio de voz activo! Háblame al micrófono para conversar.',
    },
    {
      patterns: [/gram[aá]tica/i, /conjugaci[oó]n/i, /tiempos verbales/i, /mapa de verbos/i],
      targetId: 'grammar-infographic',
      speech: '¡Aquí tienes el mapa visual de gramática y conjugación verbal!',
    },
    {
      patterns: [/falacia/i, /detector de falacias/i, /trampa l[oó]gica/i, /ad hominem/i, /hombre de paja/i],
      targetId: 'fallacy-detector',
      speech: '¡Detector de falacias activo! Vamos a desmontar trampas retóricas.',
    },
    {
      patterns: [/sesgos/i, /sesgo cognitivo/i, /matriz de sesgos/i, /atajo mental/i],
      targetId: 'cognitive-biases-matrix',
      speech: '¡Matriz de sesgos cognitivos! Descubre cómo evitar el autoengaño.',
    },
    {
      patterns: [/dilemas [eé]ticos/i, /[eé]tica/i, /[aá]rbol de decisi[oó]n/i, /moral/i],
      targetId: 'ethical-dilemmas',
      speech: '¡Laboratorio de dilemas éticos y árboles de decisión moral!',
    },
    {
      patterns: [/debate socr[aá]tico/i, /debate/i, /may[eé]utica/i, /s[oó]crates/i],
      targetId: 'debate-arena',
      speech: '¡Entrando en la Arena Socrática! Pon a prueba tus argumentos.',
    },
    {
      patterns: [/red neuronal/i, /perceptr[oó]n/i, /deep learning/i, /backprop/i],
      targetId: 'neural-infographics',
      speech: '¡Visualizador de redes neuronales y límites de decisión 2D!',
    },
    {
      patterns: [/prompt/i, /rcrf/i, /ingenier[ií]a de prompts/i, /prompt studio/i],
      targetId: 'prompt-crafting',
      speech: '¡Estudio de prompts RCRF! Aprende a instruir a la IA con rigor.',
    },
    {
      patterns: [/c[oó]digo/i, /canvas de c[oó]digo/i, /algoritmo/i, /programar/i, /javascript/i],
      targetId: 'code-canvas',
      speech: '¡Canvas de código interactivo! Ejecuta y analiza algoritmos reales.',
    }
  ];

  /**
   * Analiza una consulta en lenguaje natural y determina si contiene una intención espacial
   */
  public static parseIntent(query: string): AgenticActionPayload | null {
    const clean = query.trim().toLowerCase();

    for (const rule of this.INTENT_RULES) {
      if (rule.patterns.some((regex) => regex.test(clean))) {
        const target = MascotSpatialRegistry.getTarget(rule.targetId);
        if (target) {
          return {
            action: 'NAVIGATE',
            targetId: rule.targetId,
            speech: rule.speech,
            highlight: true,
          };
        }
      }
    }

    return null;
  }

  /**
   * Genera un tour guiado estándar para la vista actual
   */
  public static getTourForExperience(_experienceId: string | null): AgenticTourStep[] {
    const availableTargets = MascotSpatialRegistry.scanTargets();
    const targetMap = new Map(availableTargets.map((t) => [t.id, t]));

    const steps: AgenticTourStep[] = [];

    if (targetMap.has('curriculum-map')) {
      steps.push({
        targetId: 'curriculum-map',
        speechText: '¡Comencemos por el mapa curricular! Aquí ves todo tu progreso y temas desbloqueados.',
        highlightDurationMs: 4000,
      });
    }

    if (targetMap.has('exercises')) {
      steps.push({
        targetId: 'exercises',
        speechText: 'En esta tarjeta tienes ejercicios adaptados a tu ritmo con pistas reflexivas.',
        highlightDurationMs: 4000,
      });
    }

    if (targetMap.has('ocr-scanner')) {
      steps.push({
        targetId: 'ocr-scanner',
        speechText: '¿Tienes apuntes en tu cuaderno? ¡Súbelos aquí para que los digitalicemos con IA!',
        highlightDurationMs: 4000,
      });
    }

    if (targetMap.has('infographics')) {
      steps.push({
        targetId: 'infographics',
        speechText: 'Y aquí cuentas con infografías visuales que sintetizan los conceptos clave.',
        highlightDurationMs: 4000,
      });
    }

    if (targetMap.has('orrery-3d')) {
      steps.push({
        targetId: 'orrery-3d',
        speechText: '¡Aquí tienes el simulador espacial 3D WebGL2 con telemetría y órbitas heliocéntricas!',
        highlightDurationMs: 4000,
      });
    }

    if (targetMap.has('fallacy-detector')) {
      steps.push({
        targetId: 'fallacy-detector',
        speechText: '¡En el Detector Forense de Falacias aprenderás a desmontar trampas retóricas!',
        highlightDurationMs: 4000,
      });
    }

    if (targetMap.has('code-canvas')) {
      steps.push({
        targetId: 'code-canvas',
        speechText: '¡En el Code Canvas puedes ejecutar algoritmos reales como descenso de gradiente y BPE!',
        highlightDurationMs: 4000,
      });
    }

    if (targetMap.has('speaking-lab')) {
      steps.push({
        targetId: 'speaking-lab',
        speechText: '¡En el Laboratorio de Voz puedes conversar en tiempo real en cualquier idioma!',
        highlightDurationMs: 4000,
      });
    }

    return steps;
  }
}
