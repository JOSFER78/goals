import { MascotSkinId } from '../types/mascot';

export interface ContextualDialogue {
  text: string;
  type: 'greeting' | 'lesson_cheer' | 'view_reaction' | 'didactic_tip' | 'idle_thought';
  durationMs: number;
}

export class MascotDialogueEngine {
  /**
   * 1. Saludos según la hora exacta del día
   */
  public static getTimeGreeting(skinId: MascotSkinId, studentName?: string): ContextualDialogue {
    const hour = new Date().getHours();
    const nameStr = studentName ? ` ${studentName}` : '';

    if (hour >= 6 && hour < 12) {
      const greetings: Record<MascotSkinId, string[]> = {
        sparky: [
          `¡Buenos días${nameStr}! ¡Mi llama arde al 100% lista para aprender hoy! 🔥`,
          `¡Arriba esa energía! ¿Qué nueva misión o curiosidad exploramos hoy?`,
        ],
        astrobot: [
          `¡Buenos días${nameStr}! Sistemas ópticos al 100% para investigar hoy. 🤖`,
          `¡Protocolo matutino activado! Telemetría lista para tus metas.`,
        ],
        buho: [
          `¡Feliz amanecer${nameStr}! La mente despierta es el mayor telescopio. 🦉`,
          `¡Buen día! Una mañana de estudio es un día ganado para el saber.`,
        ],
        dragon: [
          `¡Buenos días${nameStr}! Mi fuego cósmico está listo para superar desafíos. 🐲`,
          `¡Despierta, explorador! Hoy conquistaremos nuevas metas.`,
        ],
        gatito: [
          `¡Miau, buenos días${nameStr}! Me he estirado y estoy listo para acompañarte. ✨`,
          `¡Ronroneo matutino! Vamos a brillar en cada lección hoy.`,
        ],
        slime: [
          `¡Boing! ¡Buenos días${nameStr}! Rebotando de energía para resolver enigmas. 🟢`,
          `¡Saludos elásticos! Listos para multiplicar tus conocimientos.`,
        ]
      };
      const list = greetings[skinId] || greetings.sparky;
      return {
        text: list[Math.floor(Math.random() * list.length)],
        type: 'greeting',
        durationMs: 5000,
      };
    }

    if (hour >= 12 && hour < 20) {
      const greetings: Record<MascotSkinId, string[]> = {
        sparky: [
          `¡Buenas tardes${nameStr}! Mantén encendida la chispa de la curiosidad. 🔥`,
          `¡Hola de nuevo! Gran momento para sumar puntos de experiencia (XP).`,
        ],
        astrobot: [
          `¡Buenas tardes${nameStr}! Sensores calibrados para maximizar tu progreso.`,
          `¡Excelente momento para un repaso científico intensivo!`,
        ],
        buho: [
          `¡Buenas tardes${nameStr}! Continuemos cultivando la sabiduría con rigor.`,
          `¡Saludos! La perseverancia de la tarde forja el conocimiento duradero.`,
        ],
        dragon: [
          `¡Buenas tardes! Despleguemos las alas para superar el siguiente reto.`,
          `¡Energía a tope${nameStr}! Nada frena nuestro progreso hoy.`,
        ],
        gatito: [
          `¡Buenas tardes${nameStr}! He encontrado datos supercuriosos para ti. 🐾`,
          `¡Hola, explorador! Sigamos practicando juntos.`,
        ],
        slime: [
          `¡Splash! ¡Tarde perfecta para conectar ideas y resolver patrones! 🟢`,
          `¡Boing boing! Tu mente está más flexible que nunca.`,
        ]
      };
      const list = greetings[skinId] || greetings.sparky;
      return {
        text: list[Math.floor(Math.random() * list.length)],
        type: 'greeting',
        durationMs: 5000,
      };
    }

    // Noche (20:00 a 24:00) o Madrugada (00:00 a 06:00)
    const greetingsNight: Record<MascotSkinId, string[]> = {
      sparky: [
        `¡Buenas noches${nameStr}! Una brasa cálida para tu último repaso del día. 🔥`,
        `¡Brillante jornada! Recuerda descansar para volver a arder de energía mañana.`,
      ],
      astrobot: [
        `¡Buenas noches${nameStr}! Sensores en modo nocturno. Excelente momento para repasar.`,
        `¡Órbita nocturna activa! Los mejores científicos estudian bajo las estrellas.`,
      ],
      buho: [
        `¡Buenas noches${nameStr}! La noche es el santuario de la contemplación y el saber.`,
        `¡Saludos nocturnos! Recuerda consolidar lo aprendido antes de descansar.`,
      ],
      dragon: [
        `¡Noche estelar${nameStr}! Tu esfuerzo de hoy ha sido legendario.`,
        `¡Buenas noches! Nuestras metas brillan en la constelación.`,
      ],
      gatito: [
        `¡Buenas noches${nameStr}! Mis ojos espaciales brillan en la oscuridad. ¡Buen repaso! 🌙`,
        `¡Hora de estrellas y calma! Qué gran día de descubrimientos.`,
      ],
      slime: [
        `¡Boing suave! Repasito tranquilo antes de recargar elasticidad. 🟢`,
        `¡Buenas noches, campeón! Todo lo aprendido se asienta mientras duermes.`,
      ]
    };
    const list = greetingsNight[skinId] || greetingsNight.sparky;
    return {
      text: list[Math.floor(Math.random() * list.length)],
      type: 'greeting',
      durationMs: 5000,
    };
  }

  /**
   * 2. Reacciones a la vista / experiencia activa
   */
  public static getViewReaction(view: string | null, skinId: MascotSkinId): ContextualDialogue | null {
    if (!view) {
      return {
        text: '¡Estamos en el Dashboard de GOALS! Elige una mini app para comenzar tu viaje.',
        type: 'view_reaction',
        durationMs: 4000,
      };
    }

    const reactions: Record<string, string[]> = {
      astro: [
        '🌌 ¡Cosmos 3D activado! Mecánica celeste pura. ¿Sabías que la luz solar tarda ~8 min en llegar?',
        '🪐 ¡Explorador estelar! Puedes arrastrar los planetas y observar sus órbitas en tiempo real.',
      ],
      verify: [
        '🔍 ¡Sala de Criterio! Aquí contrastamos fuentes y aprendemos a detectar desinformación.',
        '🛡️ ¡Pensamiento crítico al máximo! Pregúntate siempre: ¿Quién publica esto y con qué evidencia?',
      ],
      criterio: [
        '🔍 ¡Sala de Criterio! Aquí contrastamos fuentes y aprendemos a detectar desinformación.',
        '🛡️ ¡Pensamiento crítico al máximo! Pregúntate siempre: ¿Quién publica esto y con qué evidencia?',
      ],
      languages: [
        '🗣️ ¡Laboratorio de Idiomas! Háblame claro al micrófono para afinar fonética y fluidez.',
        '🌍 ¡Aprender lenguas abre universos enteros! Practica en voz alta sin miedo a equivocarte.',
      ],
      school: [
        '📚 ¡Tutor Escolar & OCR! Si tienes dudas con tus deberes, muéstrame tu cuaderno y lo resolvemos paso a paso.',
        '✏️ ¡Mesa de estudio lista! Analicemos conceptos clave para dominar tu temario.',
      ],
      'ai-lab': [
        '🧠 ¡IA Lab! Experimenta con prompts, modelos neuronales y visión artificial.',
        '⚡ ¡Creando el futuro! La IA es una herramienta para multiplicar tu ingenio humano.',
      ],
    };

    const options = reactions[view];
    if (!options) return null;

    return {
      text: options[Math.floor(Math.random() * options.length)],
      type: 'view_reaction',
      durationMs: 5500,
    };
  }

  /**
   * 3. Ánimos y felicitaciones al completar lecciones
   */
  public static getLessonCompletionCheer(
    lessonTitle: string,
    stars: number = 3,
    xpGained: number = 25,
    skinId: MascotSkinId = 'sparky'
  ): ContextualDialogue {
    const starStr = stars === 3 ? '⭐⭐⭐ ¡Puntuación perfecta!' : '⭐⭐ ¡Magnífico trabajo!';

    const cheers: Record<MascotSkinId, string[]> = {
      sparky: [
        `🔥 ¡FUEGO PURO! Has completado "${lessonTitle}". ${starStr} (+${xpGained} XP)`,
        `🎉 ¡Chispa imparable! Lección superada. ¡Tus puntos de racha están que arden!`,
      ],
      astrobot: [
        `🎉 ¡Misión cumplida! Has completado "${lessonTitle}". ${starStr} (+${xpGained} XP)`,
        `🚀 ¡Telemetría impecable! Lección superada con éxito. Datos registrados.`,
      ],
      buho: [
        `🦉 ¡Extraordinario avance! "${lessonTitle}" asimilada con sabiduría. ${starStr}`,
        `📖 ¡Un peldaño más en la escalera del saber! Excelente rigor en tus respuestas.`,
      ],
      dragon: [
        `🔥 ¡Victoria rotunda! Has dominado "${lessonTitle}". ¡Tus XP brillan con fuerza!`,
        `🐲 ¡Insuperable! Tu determinación forja un verdadero maestro del conocimiento.`,
      ],
      gatito: [
        `🐾 ¡Bravísimo! Has bordado "${lessonTitle}". ${starStr} ¡Estoy dando saltos de alegría!`,
        `✨ ¡Ronroneo de victoria! Qué orgullo ver cómo superas cada reto.`,
      ],
      slime: [
        `🟢 ¡Boing magistral! "${lessonTitle}" completada. ${starStr} (+${xpGained} XP)`,
        `🎯 ¡Precisión elástica! Has resuelto todos los desafíos con soltura.`,
      ]
    };

    const list = cheers[skinId] || cheers.sparky;
    return {
      text: list[Math.floor(Math.random() * list.length)],
      type: 'lesson_cheer',
      durationMs: 6000,
    };
  }

  /**
   * 4. Consejos didácticos espontáneos
   */
  public static getSpontaneousTip(view: string | null): ContextualDialogue {
    const generalTips = [
      '💡 Consejo Didáctico: Explicar un concepto con tus propias palabras es la mejor forma de fijarlo en la memoria.',
      '👀 Regla 20-20-20: Cada 20 minutos de pantalla, mira a 6 metros de distancia durante 20 segundos para descansar la vista.',
      '🎯 La constancia vence a la prisa: 15 minutos diarios de práctica rinden más que horas de estudio improvisado.',
      '💧 ¡Recuerda beber un sorbo de agua! El cerebro hidratado procesa información con mayor agilidad.',
    ];

    return {
      text: generalTips[Math.floor(Math.random() * generalTips.length)],
      type: 'didactic_tip',
      durationMs: 6000,
    };
  }
}
