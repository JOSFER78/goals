import { CriterioModule } from '../types';

export const CRITERIO_MODULES: CriterioModule[] = [
  {
    id: 1,
    slug: 'por-que-informarme',
    title: '01 · ¿Por qué informarme?',
    subtitle: 'La información cambia decisiones reales',
    shortDescription: 'Descubre cómo la calidad de lo que lees afecta tus notas, tu dinero, tus amistades y tu futuro.',
    fullDescription: 'En la era digital, no estás indefenso: cada decisión que tomas (desde qué comprar hasta qué opinar) depende de la información que dejas entrar en tu mente.',
    ageBracket: '8-10',
    competency: 'nuance',
    iconName: 'Compass',
    badgeTag: 'DECISIONES REALES',
    accentColor: '#F59E0B',
    xpReward: 30,
    durationMinutes: 5,
    keyTakeaways: [
      'Una mala información te hace tomar malas decisiones.',
      'No todo lo que tiene muchos "likes" es cierto.',
      'Aprender a informarse te da libertad e independencia.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El dilema de la excursión escolar',
        subtitle: 'Un rumor en el grupo de clase',
        content: 'Imagínate que recibes un mensaje en el grupo de WhatsApp: *"¡Mañana se cancela la excursión al planetario porque va a llover a cántaros! No vayáis al cole"*. El mensaje no tiene firma de ningún profesor ni enlace al centro escolar. ¿Qué harías?',
        keyTakeaway: 'Un mensaje urgente y sin autor busca que reacciones rápido sin pensar.',
        wowFact: 'El 70% de las cadenas escolares falsas nacen de una broma o de una confusión sin contrastar.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'El Embudo de Verificación Personal',
        subtitle: 'Tú eres el filtro',
        content: 'Antes, los periódicos impresos tardaban horas en revisar las noticias antes de publicarlas. Hoy, cualquier mensaje viaja a la velocidad de la luz directamente a tu móvil. Nadie lo ha filtrado por ti: ahora tú eres tu propio editor.',
        diagramType: 'funnel',
        keyTakeaway: 'Si tú no filtras la información, la desinformación te utilizará a ti como altavoz.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'Pregunta Socrática',
        subtitle: 'Evalúa tu reacción',
        content: 'Un amigo te reenvía un mensaje diciendo que van a cerrar el videojuego que más juegas este viernes. ¿Cuál es el paso más inteligente?',
        keyTakeaway: 'Buscar la cuenta oficial de los creadores del juego antes de lamentarte o asustarte.',
        question: {
          prompt: '¿Qué harías antes de compartirlo con todos tus amigos?',
          options: [
            {
              id: 'a',
              text: 'Reenviarlo a todos los grupos para que se enteren rápido.',
              isNuanced: false,
              score: 0,
              explanation: 'Reenviar sin comprobar propaga el pánico y puede hacerte quedar en ridículo si es falso.'
            },
            {
              id: 'b',
              text: 'Comprobar en la web o red oficial del videojuego si han publicado un comunicado.',
              isNuanced: true,
              score: 100,
              explanation: '¡Excelente! Siempre que una noticia afecte a una empresa o servicio, su canal oficial es la fuente primaria.'
            },
            {
              id: 'c',
              text: 'Decir que todos los videojuegos son una estafa y borrarlo.',
              isNuanced: false,
              score: 10,
              explanation: 'El escepticismo extremo sin pruebas tampoco es pensamiento crítico; es simplemente desconfianza ciega.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'La Regla de Oro',
        subtitle: '«¿Y tú cómo lo sabes?»',
        content: 'Cada vez que alguien te cuente algo sorprendente o alarmante, no le ataques ni te burles. Hazle una pregunta sencilla con educación: *«Oye, ¿y tú cómo lo sabes? ¿De dónde ha salido la noticia?»*. Verás que muchas veces nadie sabe quién lo dijo primero.',
        keyTakeaway: 'La pregunta «¿Y tú cómo lo sabes?» desactiva el 90% de los rumores.'
      }
    ]
  },
  {
    id: 2,
    slug: 'el-mundo-que-ves',
    title: '02 · El mundo que ves',
    subtitle: 'Qué es una fuente y el encuadre visual',
    shortDescription: 'Comprende por qué lo que aparece en una pantalla no siempre cuenta toda la historia completa.',
    fullDescription: 'Una cámara solo puede grabar hacia donde apunta. Si alguien recorta la imagen o cambia el ángulo, la misma escena puede parecer un acto de violencia o un juego entre amigos.',
    ageBracket: '8-10',
    competency: 'context',
    iconName: 'Eye',
    badgeTag: 'ENCUADRE & CONTEXTO',
    accentColor: '#3B82F6',
    xpReward: 35,
    durationMinutes: 6,
    keyTakeaways: [
      'Una imagen real puede usarse para contar una mentira si se recorta el contexto.',
      'Una fuente primaria es quien estuvo allí o el documento original.',
      'El zoom y el encuadre eligen qué ves y qué se te oculta.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El misterio del perro peligroso',
        subtitle: 'La ilusión del encuadre cerrado',
        content: 'Mira una fotografía donde se ve a un perro enseñando los dientes con cara agresiva frente a una mano. Parece a punto de morder. Pero al alejar el zoom de la cámara, descubrimos que el perro estaba jugando a atrapar una pelota con su dueño en el parque.',
        keyTakeaway: 'El encuadre cerrado puede transformar un juego inocente en una amenaza aterradora.',
        wowFact: 'El encuadre fotográfico se inventó en el siglo XIX y sigue siendo la técnica publicitaria más utilizada.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'La Pirámide de las Fuentes',
        subtitle: '¿De dónde sale la información?',
        content: 'No todas las fuentes tienen el mismo peso. Una fuente primaria (quien vivió el hecho o el informe científico) es la base sólida. Los testimonios de oídas o capturas anónimas en redes son la parte más frágil.',
        diagramType: 'scale',
        keyTakeaway: 'Cuanto más cerca esté la fuente del hecho original, más sólida es la evidencia.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'Pregunta Socrática',
        subtitle: 'El vídeo viral sin fecha',
        content: 'Ves un vídeo de una calle inundada con el texto: *"¡Mira cómo está el centro de la ciudad ahora mismo!"*. No hay fecha ni hora en el vídeo.',
        keyTakeaway: 'Comprobar si el vídeo pertenece a una tormenta de hace 4 años.',
        question: {
          prompt: '¿Qué dato fundamental falta en este vídeo?',
          options: [
            {
              id: 'a',
              text: 'La música de fondo.',
              isNuanced: false,
              score: 0,
              explanation: 'La música es decorativa; no aporta información fáctica.'
            },
            {
              id: 'b',
              text: 'La fecha, hora y ubicación exacta comprobable con registros meteorológicos.',
              isNuanced: true,
              score: 100,
              explanation: '¡Exacto! Reciclar vídeos de inundaciones antiguas durante nuevas lluvias es un clásico de la desinformación para ganar clics.'
            },
            {
              id: 'c',
              text: 'El número de seguidores de la cuenta.',
              isNuanced: false,
              score: 10,
              explanation: 'Tener muchos seguidores no garantiza que una cuenta no cometa errores o publique vídeos antiguos.'
            }
          ]
        }
      }
    ]
  },
  {
    id: 3,
    slug: 'tu-cerebro-tambien-participa',
    title: '03 · Tu cerebro también participa',
    subtitle: 'La neurobiología de las emociones en redes',
    shortDescription: 'Aprende cómo el miedo, la rabia y la sorpresa desactivan tu pensamiento crítico.',
    fullDescription: 'Los creadores de contenidos sensacionalistas saben que si logran hacerte enfadar o asustarte, tu cerebro reaccionará en milisegundos pulsando "compartir" antes de que tu parte lógica pueda analizarlo.',
    ageBracket: '10-12',
    competency: 'pause_method',
    iconName: 'Brain',
    badgeTag: 'PSICOLOGÍA & SESGOS',
    accentColor: '#EC4899',
    xpReward: 35,
    durationMinutes: 6,
    keyTakeaways: [
      'La rabia y el miedo son las emociones que más rápido se viralizan en internet.',
      'El sesgo de confirmación te hace creer más fácilmente lo que ya coincide con tus gustos.',
      'Hacer una pausa de 30 segundos permite al cerebro racional tomar el control.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El secuestro de la amígdala',
        subtitle: 'Por qué reaccionamos antes de pensar',
        content: 'Tu cerebro tiene una alarma llamada amígdala que reacciona instantáneamente ante el peligro. Cuando lees un titular como *"¡Indignante! ¡Mira lo que nos quieren prohibir!"*, tu cuerpo segrega adrenalina. En ese estado, nadie se para a comprobar si es verdad.',
        keyTakeaway: 'Si un titular te produce una rabia instantánea desmedida, es muy probable que esté diseñado para manipularte.',
        wowFact: 'Un estudio de Science demostró que las noticias que apelan a la indignación moral se comparten un 20% más por cada palabra emocional añadida.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'El Bucle Emocional de la Red',
        subtitle: 'Estímulo vs Reflexión',
        content: 'Observa la diferencia entre el camino rápido del impulso (Estímulo $\\rightarrow$ Rabia $\\rightarrow$ Reenviar) y el camino del Criterio (Estímulo $\\rightarrow$ PAUSA $\\rightarrow$ Contrastar $\\rightarrow$ Decidir).',
        diagramType: 'loop',
        keyTakeaway: 'El Método PAUSA rompe el bucle de la manipulación emocional.'
      }
    ]
  },
  {
    id: 4,
    slug: 'el-viaje-de-una-informacion',
    title: '04 · El viaje de una información',
    subtitle: 'El teléfono escacharrado digital',
    shortDescription: 'Cómo un hecho real se deforma, recorta y titula con exageración al viralizarse.',
    fullDescription: 'Rastrea el ciclo de vida de una afirmación: desde un informe técnico de 50 páginas hasta un meme de 3 palabras que dice exactamente lo contrario de lo que descubrieron los científicos.',
    ageBracket: '10-12',
    competency: 'sources',
    iconName: 'GitMerge',
    badgeTag: 'TRAZABILIDAD',
    accentColor: '#10B981',
    xpReward: 40,
    durationMinutes: 7,
    keyTakeaways: [
      'A cada paso de retransmisión se pierden matices y advertencias.',
      'Los titulares de prensa suelen exagerar las conclusiones de los estudios.',
      'Volver al estudio o fuente original aclara la verdad.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El caso del chocolate y la longevidad',
        subtitle: 'De la ciencia al titular falso',
        content: 'Unos científicos publicaron: *"Un compuesto del cacao muestra propiedades antioxidantes en células de laboratorio bajo condiciones muy específicas"*. Tres días después, un periódico tituló: *"Comer tres tabletas de chocolate al día alarga la vida 10 años"*. ¿Qué ocurrió en el camino?',
        keyTakeaway: 'La búsqueda de clics suele convertir hipótesis científicas prudentes en promesas milagrosas falsas.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'La Cadena de Degradación Informativa',
        subtitle: '5 pasos de deformación',
        content: '1. Estudio científico original $\\rightarrow$ 2. Nota de prensa de la universidad $\\rightarrow$ 3. Artículo en blog digital $\\rightarrow$ 4. Hilo sensacionalista en redes $\\rightarrow$ 5. Meme falso.',
        diagramType: 'chain',
        keyTakeaway: 'Rastrear hacia atrás en la cadena te lleva a la fuente primaria.'
      }
    ]
  },
  {
    id: 5,
    slug: 'los-algoritmos-y-la-atencion',
    title: '05 · Los algoritmos y la atención',
    subtitle: 'La máquina que optimiza tu tiempo de pantalla',
    shortDescription: 'Entiende cómo funcionan los motores de recomendación de TikTok, Instagram y YouTube.',
    fullDescription: 'Los algoritmos no son seres conscientes ni tienen malicia. Su función matemática es muy simple: maximizar el tiempo que pasas mirando la pantalla para mostrarte más anuncios. Descubre cómo esto crea cámaras de eco.',
    ageBracket: '12-14',
    competency: 'algorithms',
    iconName: 'Cpu',
    badgeTag: 'ECONOMÍA DE LA ATENCIÓN',
    accentColor: '#8B5CF6',
    xpReward: 45,
    durationMinutes: 8,
    keyTakeaways: [
      'El algoritmo aprende de cada segundo que pasas mirando un vídeo, no solo de tus "likes".',
      'El contenido polarizante genera más comentarios y, por tanto, el algoritmo lo recomienda más.',
      'Tú puedes entrenar a tu algoritmo buscando activamente temas diversos y de calidad.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El negocio de la atención',
        subtitle: 'Si el servicio es gratis, el producto es tu atención',
        content: 'Una plataforma de redes sociales gana dinero vendiendo espacios publicitarios. Para que los anunciantes paguen, la plataforma necesita que pases el mayor tiempo posible conectado. Por eso el algoritmo premia el contenido adictivo.',
        keyTakeaway: 'El algoritmo no busca la verdad; busca la retención.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'El Bucle de la Cámara de Eco',
        subtitle: 'Cómo se estrecha tu visión del mundo',
        content: 'Si miras tres vídeos sobre una teoría conspirativa, el algoritmo asume que te interesa y te mostrará diez más. Pronto parecerá que todo el mundo habla de eso, cuando en realidad solo está en tu burbuja personalizada.',
        diagramType: 'network',
        keyTakeaway: 'Tu feed no es la realidad; es un reflejo de lo que el algoritmo cree que te retiene.'
      }
    ]
  },
  {
    id: 6,
    slug: 'hecho-opinion-evidencia',
    title: '06 · Hecho, Opinión y Evidencia',
    subtitle: 'Aprende a separar afirmaciones de realidades',
    shortDescription: 'Distingue entre un dato empírico comprobable, un juicio de valor subjetivo y una prueba sólida.',
    fullDescription: '«El helado de chocolate es el mejor del mundo» es una opinión. «El helado se derrite a más de 0 °C» es un hecho. Parece fácil, pero en internet las opiniones se disfrazan constantemente de hechos científicos.',
    ageBracket: '12-14',
    competency: 'fact_opinion',
    iconName: 'Scale',
    badgeTag: 'EPISTEMOLOGÍA BÁSICA',
    accentColor: '#EAB308',
    xpReward: 40,
    durationMinutes: 7,
    keyTakeaways: [
      'Un hecho es verificable mediante pruebas independientes.',
      'Una opinión es un sentimiento o preferencia que no puede tacharse de falsa, pero tampoco es una prueba.',
      'La evidencia es el conjunto de datos que respalda o refuta una afirmación.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El laboratorio de las frases',
        subtitle: '¿Hecho o valoración?',
        content: 'Analiza estas dos frases: 1) *"Este teléfono tiene una batería de 5000 mAh"*. 2) *"Este teléfono es una obra de arte insuperable"*. La primera puede medirse en un laboratorio; la segunda depende del gusto de quien habla.',
        keyTakeaway: 'Los adjetivos superlativos ("increíble", "terrible", "el mejor") suelen indicar opiniones, no hechos.'
      }
    ]
  },
  {
    id: 7,
    slug: 'aprender-a-buscar',
    title: '07 · Aprender a buscar y lectura lateral',
    subtitle: 'Cómo investigan los profesionales',
    shortDescription: 'Domina los operadores de búsqueda, la lectura lateral en varias pestañas y el rastreo de fuentes.',
    fullDescription: 'Los verificadores de élite no se quedan leyendo una sola página web sospechosa: abren inmediatamente tres pestañas nuevas para ver qué dicen otros sitios de referencia sobre esa misma entidad o noticia.',
    ageBracket: '14-16',
    competency: 'lateral_search',
    iconName: 'Search',
    badgeTag: 'LECTURA LATERAL',
    accentColor: '#06B6D4',
    xpReward: 45,
    durationMinutes: 8,
    keyTakeaways: [
      'La lectura lateral consiste en salir de la página sospechosa para investigarla desde fuera.',
      'Usar palabras clave neutrales sin sesgar la búsqueda da mejores resultados.',
      'Ignorar los primeros resultados patrocinados (anuncios) antes de seleccionar fuentes fiables.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'La técnica de las pestañas paralelas',
        subtitle: 'Nunca confíes solo en lo que una web dice sobre sí misma',
        content: 'Si entras en una web llamada *"Instituto Mundial de la Salud Natural"* que asegura que beber agua con sal cura todas las enfermedades, no busques la respuesta dentro de su propia web. Abre una pestaña y busca: *"Instituto Mundial Salud Natural fiabilidad consenso médico"* en Google Académico o Wikipedia.',
        keyTakeaway: 'Descubre la reputación de una fuente desde fuentes externas independientes.'
      }
    ]
  },
  {
    id: 8,
    slug: 'ia-cuando-la-maquina-inventa',
    title: '08 · IA: Cuando la máquina inventa',
    subtitle: 'Alucinaciones y límites de los LLMs',
    shortDescription: 'Por qué un chatbot puede responder con absoluta seguridad gramatical y estar completamente equivocado.',
    fullDescription: 'Los Modelos de Lenguaje (LLMs) son calculadoras probabilísticas de texto: predicen qué palabra suele ir después de otra con elegancia. No tienen consciencia ni comprueban la verdad por defecto.',
    ageBracket: '14-16',
    competency: 'ai_literacy',
    iconName: 'Bot',
    badgeTag: 'ALUCINACIONES IA',
    accentColor: '#6366F1',
    xpReward: 50,
    durationMinutes: 8,
    keyTakeaways: [
      'La elocuencia y buena ortografía de una IA no garantizan que el dato sea real.',
      'Las IAs pueden inventar libros, leyes, fechas y citas con títulos hiperrealistas (alucinación).',
      'Usa la IA como copiloto para resumir o estructurar ideas, pero comprueba siempre los datos clave con fuentes primarias.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El loro estocástico elocuente',
        subtitle: 'Predicción estadística vs comprensión del mundo',
        content: 'Cuando le pides a una IA que cite cinco artículos científicos sobre un tema raro, el modelo genera nombres de científicos que suenan creíbles y títulos que encajan perfectamente, aunque esos estudios nunca hayan existido en la realidad.',
        keyTakeaway: 'Nunca utilices una cita bibliográfica generada por una IA sin haberla buscado y comprobado en la vida real.'
      }
    ]
  },
  {
    id: 9,
    slug: 'ia-lo-que-ves-puede-ser-fabricado',
    title: '09 · IA: Lo que ves puede ser fabricado',
    subtitle: 'Deepfakes, clonación de voz y medios sintéticos',
    shortDescription: 'Aprende a analizar imágenes generadas, vídeos manipulados y audios clonados de forma segura.',
    fullDescription: 'Hasta hace pocos años, un vídeo o una fotografía eran pruebas indiscutibles de que algo había ocurrido. Hoy en día, cualquier imagen o voz puede ser sintetizada por ordenador en segundos.',
    ageBracket: '14-16',
    competency: 'ai_literacy',
    iconName: 'Sparkles',
    badgeTag: 'DEEPFAKES & SÍNTESIS',
    accentColor: '#F43F5E',
    xpReward: 50,
    durationMinutes: 9,
    keyTakeaways: [
      'Un vídeo o un audio ya no bastan por sí solos como prueba definitiva.',
      'Fíjate en anomalías en manos, orejas, texturas de piel, reflejos y sincronía labial.',
      'Si recibes un audio urgente de un familiar pidiendo dinero, verifica siempre llamándole directamente por otro canal.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'La caída del principio de verosimilitud visual',
        subtitle: 'Ver ya no es creer',
        content: 'Modelos como Midjourney, Stable Diffusion o Sora pueden crear escenas de desastres naturales o eventos históricos ficticios con iluminación fotográfica perfecta. La regla actual es: ¿hay cobertura de múltiples medios acreditados en el lugar de los hechos?',
        keyTakeaway: 'El contexto institucional y las fuentes múltiples valen más que un archivo visual aislado.'
      }
    ]
  },
  {
    id: 10,
    slug: 'el-metodo-pausa',
    title: '10 · El Método PAUSA',
    subtitle: 'La herramienta conductual en 5 pasos',
    shortDescription: 'Aprende el protocolo de emergencia antes de reaccionar o compartir cualquier contenido en redes.',
    fullDescription: 'Un método práctico y fácil de recordar que te protegerá de caer en bulos, estafas y manipulaciones emocionales en tu vida digital diaria.',
    ageBracket: '8-18',
    competency: 'pause_method',
    iconName: 'ShieldAlert',
    badgeTag: 'MÉTODO PAUSA',
    accentColor: '#14B8A6',
    xpReward: 40,
    durationMinutes: 6,
    keyTakeaways: [
      'P: Parar el impulso de reaccionar durante 30 segundos.',
      'A: Autor y fecha de origen comprobables.',
      'U: Ubicar el contexto completo de la historia.',
      'S: Sopesar qué dicen otras fuentes primarias.',
      'A: Actuar con criterio (dudar, no reenviar o aclarar).'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Los 5 pasos de PAUSA',
        subtitle: 'El cinturón de seguridad digital',
        content: '1. **P**ara el impulso: sal de la pantalla un momento.\n2. **A**utor: ¿quién lo dice y qué interés puede tener?\n3. **U**bica el contexto: ¿cuándo y dónde ocurrió realmente?\n4. **S**oporta con fuentes: ¿lo confirma algún organismo oficial?\n5. **A**ctúa con madurez: si dudas, no lo compartas.',
        keyTakeaway: 'Un segundo de reflexión evita horas de desinformación.'
      }
    ]
  },
  {
    id: 11,
    slug: 'misiones-de-campo',
    title: '11 · Misiones de campo adaptativas',
    subtitle: 'Entrenamiento con 60 situaciones reales',
    shortDescription: 'Pon a prueba tus habilidades resolviendo dilemas prácticos de colegios, videojuegos, redes y ciencia.',
    fullDescription: 'Enfréntate a capturas de chat, falsos sorteos de Discord, titulares sensacionalistas y retos virales. Cada decisión correcta suma puntos a tu radar de Criterio.',
    ageBracket: '8-18',
    competency: 'nuance',
    iconName: 'Award',
    badgeTag: '60 SITUACIONES REALES',
    accentColor: '#F59E0B',
    xpReward: 60,
    durationMinutes: 10,
    keyTakeaways: [
      'Aplica el método en casos de la vida real.',
      'Gana insignias por detectar matices e incertidumbre.',
      'Comprende el truco detrás de cada trampa digital.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Tu simulador de vuelo mental',
        subtitle: 'Práctica guiada sin penalizaciones',
        content: 'En las misiones de campo, equivocarse es una oportunidad para aprender. Cuando una opción no sea la más prudente, la plataforma te explicará exactamente qué detalle se te escapó para que lo domines la próxima vez.',
        keyTakeaway: 'El error reflexivo es la mejor escuela del pensamiento crítico.'
      }
    ]
  },
  {
    id: 12,
    slug: 'investigacion-y-matiza',
    title: '12 · Investigación & Laboratorio MATIZA',
    subtitle: 'El examen de autonomía epistémica',
    shortDescription: 'Utiliza el motor de rigor MATIZA para descomponer afirmaciones complejas y redactar conclusiones matizadas.',
    fullDescription: 'Aprende a usar la herramienta avanzada MATIZA de GOALS: analiza afirmaciones en vivo, desglosa hechos probados, detecta vacíos informativos y consulta fuentes primarias del BOE, NASA o CSIC.',
    ageBracket: '14-18',
    competency: 'nuance',
    iconName: 'FileText',
    badgeTag: 'LABORATORIO MATIZA',
    accentColor: '#F59E0B',
    xpReward: 75,
    durationMinutes: 12,
    keyTakeaways: [
      'Descompón cualquier noticia en 4 capas de rigor.',
      'Acepta los grados de confianza en lugar de respuestas absolutas.',
      'Construye opiniones informadas y fundamentadas en evidencia.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El método del análisis en 4 capas',
        subtitle: 'Rigor fáctico en acción',
        content: 'Toda investigación madura debe responder a 4 preguntas:\n1. ¿Cuál es la afirmación exacta?\n2. ¿Qué pruebas empíricas sólidas existen?\n3. ¿Qué datos faltan o no están confirmados?\n4. ¿Cuál es la conclusión matizada con su nivel de certeza?',
        keyTakeaway: 'Una conclusión matizada es el signo de una mente verdaderamente formada.'
      }
    ]
  }
];
