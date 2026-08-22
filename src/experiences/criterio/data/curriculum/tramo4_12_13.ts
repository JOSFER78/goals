import { CriterioModule } from '../../types';

/**
 * TRAMO 4 · 12-13 AÑOS (1.º y 2.º de ESO)
 * Arquetipo: "El Estratega Autónomo" — estética terminal de control, telemetría, rigor formal.
 * SSOT curricular: docs/criterio/00_MASTER_PLAN_CURRICULAR.md (U4.1 – U4.7)
 * Temas: lógica proposicional, Toulmin, cronolocalización SunCalc, deepfakes/C2PA,
 * burbujas algorítmicas, falacias avanzadas, debate Karl Popper.
 */
export const TRAMO_4_MODULES: CriterioModule[] = [
  {
    id: 401,
    slug: 'logica-proposicional',
    title: 'U4.1 · Lógica Proposicional (L0)',
    subtitle: 'AND, OR, NOT y las tablas de verdad',
    shortDescription: 'Domina los operadores lógicos que usan los ordenadores, los matemáticos y los detectives.',
    fullDescription: 'La lógica proposicional convierte frases en símbolos y las combina con operadores (AND, OR, NOT, →). Es el idioma de los circuitos, de las matemáticas y del razonamiento impecable. Con tablas de verdad sabrás si un argumento es válido siempre.',
    ageBracket: '12-13',
    competency: 'nuance',
    iconName: 'Cpu',
    badgeTag: 'OPERADOR LÓGICO',
    accentColor: '#6366F1',
    xpReward: 50,
    durationMinutes: 12,
    keyTakeaways: [
      'AND (∧): verdadero solo si AMBAS proposiciones son verdaderas.',
      'OR (∨): verdadero si AL MENOS UNA es verdadera.',
      'NOT (¬): invierte el valor de verdad.',
      'La implicación (P → Q) solo es falsa cuando P es verdadera y Q es falsa.',
      'Una tabla de verdad agota TODOS los casos: si la conclusión sale siempre verdadera, el argumento es válido.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Proposiciones: frases con valor de verdad',
        subtitle: 'El átomo de la lógica',
        content: 'Una **proposición** es una frase que puede ser verdadera o falsa (no las dos, no ninguna):\n\n✅ «Madrid es la capital de España» → V\n✅ «2 + 2 = 5» → F\n❌ «¡Cierra la puerta!» → no es proposición (es una orden)\n❌ «¿Qué hora es?» → no es proposición (es una pregunta)\n\nA cada proposición le asignamos una letra: P, Q, R... Y luego las combinamos con operadores lógicos, como piezas de un circuito.',
        keyTakeaway: 'Solo las frases que pueden ser V o F son proposiciones: el resto queda fuera de la lógica formal.',
        wowFact: 'George Boole inventó este sistema en 1854. Un siglo después, Claude Shannon demostró que los circuitos eléctricos podían implementarlo: así nació la informática. Tu móvil es lógica proposicional con electricidad.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'Los operadores y sus tablas',
        subtitle: 'AND, OR, NOT, →',
        content: '**P ∧ Q (AND):** V solo si P=V y Q=V. «Llueve Y hace frío».\n**P ∨ Q (OR):** V si al menos una es V. «Llueve O hace frío».\n**¬P (NOT):** lo contrario de P.\n**P → Q (implicación):** falsa SOLO cuando P=V y Q=V→F. «Si llueve, la calle se moja».\n\nLa implicación es la estrella de los teoremas: «si P, entonces Q». Y su trampa favorita: cuando P es falsa, la implicación es verdadera pase lo que pase (vacuidad).',
        diagramType: 'network',
        keyTakeaway: 'La tabla de verdad de la implicación tiene un solo caso falso: P verdadera con Q falsa.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'Modus ponens y modus tollens',
        subtitle: 'Las dos reglas de oro',
        content: 'Dada la regla «Si un número es divisible por 4, entonces es par» (P → Q), tienes dos movimientos válidos:\n\n**Modus ponens:** P es verdad → Q es verdad. (12 es divisible por 4 → 12 es par ✅)\n**Modus tollens:** Q es falsa → P es falsa. (15 no es par → 15 no es divisible por 4 ✅)',
        keyTakeaway: 'Ponens afirma el antecedente; tollens niega el consecuente. Los dos son válidos; sus inversos, no.',
        question: {
          prompt: '¿Cuál de estos razonamientos es INVÁLIDO?',
          options: [
            {
              id: 'a',
              text: '«15 no es par, luego 15 no es divisible por 4» (modus tollens).',
              isNuanced: false,
              score: 30,
              explanation: 'Ese es modus tollens: ¬Q → ¬P. Es VÁLIDO. Busca el razonamiento que afirma el consecuente o niega el antecedente.'
            },
            {
              id: 'b',
              text: '«12 es par, luego 12 es divisible por 4» (afirmar el consecuente).',
              isNuanced: true,
              score: 100,
              explanation: '¡Exacto! Q → P es la falacia de afirmar el consecuente: 12 es par, sí, pero también lo es 10 y no es divisible por 4. La implicación no funciona al revés. 🎯'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'La tabla de verdad como juez final',
        subtitle: 'Agota todos los casos',
        content: 'Cuando dudes de si un argumento es válido, construye su tabla de verdad: una fila por cada combinación posible de V/F. Si en TODAS las filas donde las premisas son verdaderas la conclusión también lo es, el argumento es válido. Sin excepciones. Es un método mecánico, infalible y el mismo que verifica los circuitos de tu ordenador.',
        keyTakeaway: 'Validez = no existe ningún caso con premisas verdaderas y conclusión falsa.'
      }
    ]
  },
  {
    id: 402,
    slug: 'modelo-toulmin',
    title: 'U4.2 · El Modelo de Toulmin',
    subtitle: 'La anatomía completa del argumento',
    shortDescription: 'Disecciona cualquier argumento en sus 6 piezas: tesis, datos, garantía, respaldo, reserva y calificador.',
    fullDescription: 'El filósofo Stephen Toulmin demostró que los argumentos reales no son simples silogismos: tienen 6 componentes. Dominar su modelo te permite analizar discursos políticos, publicidad y debates con precisión quirúrgica.',
    ageBracket: '12-13',
    competency: 'nuance',
    iconName: 'Scale',
    badgeTag: 'ANATOMISTA DE ARGUMENTOS',
    accentColor: '#8B5CF6',
    xpReward: 50,
    durationMinutes: 12,
    keyTakeaways: [
      'CLAIM (tesis): lo que se afirma.',
      'GROUNDS (datos): la evidencia que la sostiene.',
      'WARRANT (garantía): el puente que conecta datos y tesis.',
      'BACKING (respaldo): el apoyo adicional de la garantía.',
      'REBUTTAL (reserva): las excepciones admitidas.',
      'QUALIFIER (calificador): la fuerza de la afirmación («probablemente», «siempre»).',
      'Los argumentos débiles suelen fallar en la garantía o ignorar la reserva.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Las 6 piezas del argumento',
        subtitle: 'El modelo Toulmin completo',
        content: 'Argumento real: *«Deberíamos irnos ya al aeropuerto (CLAIM), porque el vuelo sale en 2 horas (GROUNDS), y los controles de seguridad pueden tardar más de una hora (WARRANT). Los aeropuertos grandes recomiendan llegar 2h antes (BACKING), salvo que llevemos el check-in hecho y poco equipaje (REBUTTAL). Así que probablemente lleguemos justos (QUALIFIER)»*.\n\nCada pieza tiene una función. La más invisible y decisiva es la GARANTÍA: el supuesto que conecta los datos con la tesis. Si la garantía es débil, el argumento se cae aunque los datos sean ciertos.',
        keyTakeaway: 'La garantía es el puente invisible: atácala o defiéndela ahí y ganarás el debate.',
        wowFact: 'Stephen Toulmin publicó este modelo en 1958 («The Uses of Argument»). Sigue siendo la herramienta estándar en derecho, periodismo y debate académico.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'El mapa del argumento',
        subtitle: 'De los datos a la tesis',
        content: 'GROUNDS ──(WARRANT)──▶ CLAIM\n   │                        ▲\nBACKING (apoya la garantía) │\nREBUTTAL (excepciones) ─────┘\nQUALIFIER modula la fuerza del CLAIM.\n\nVisualiza cualquier discurso político o anuncio como este mapa: verás inmediatamente qué piezas faltan.',
        diagramType: 'network',
        keyTakeaway: 'Un argumento incompleto (sin garantía o sin reserva) es un mapa con carreteras cortadas.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'Disecciona el discurso',
        subtitle: 'El anuncio político',
        content: 'Un político afirma: *«Hay que bajar los impuestos (CLAIM) porque la recaudación ha subido este año (GROUNDS)»*. No dice nada más. ¿Qué pieza crítica falta para evaluar el argumento?',
        keyTakeaway: 'Sin garantía, no sabemos por qué más recaudación implicaría bajar impuestos.',
        question: {
          prompt: '¿Cuál es la pieza ausente más importante?',
          options: [
            {
              id: 'a',
              text: 'La GARANTÍA: el puente que explique por qué una mayor recaudación justificaría bajar impuestos (¿y no gastar más, o ahorrar?). Sin ella, el dato no sostiene la tesis.',
              isNuanced: true,
              score: 100,
              explanation: 'Análisis quirúrgico. El dato puede ser cierto y la tesis puede sonar bien, pero sin garantía no hay conexión lógica. Además faltan REBUTTAL y QUALIFIER: el argumento está en los huesos. 🔬'
            },
            {
              id: 'b',
              text: 'El BACKING: necesita más estadísticas de recaudación.',
              isNuanced: false,
              score: 40,
              explanation: 'Más datos ayudarían, pero el problema no es la cantidad de grounds: es que no hay puente entre el dato y la tesis. Primero la garantía, luego el respaldo.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'Tu plantilla de disección',
        subtitle: 'Aplicación inmediata',
        content: 'Ante cualquier argumento importante (un discurso, un anuncio, un debate familiar), rellena mentalmente las 6 casillas: ¿tesis? ¿datos? ¿garantía? ¿respaldo? ¿reserva? ¿calificador? Las casillas vacías te dicen exactamente dónde es débil el argumento... y dónde preguntar.',
        keyTakeaway: 'Seis casillas vacías = seis preguntas letales en cualquier debate.'
      }
    ]
  },
  {
    id: 403,
    slug: 'cronolocalizacion-suncalc',
    title: 'U4.3 · Cronolocalización con Sombras',
    subtitle: 'Verifica fotos con trigonometría solar',
    shortDescription: 'Usa la geometría de las sombras y herramientas como SunCalc para verificar cuándo y dónde se tomó una foto.',
    fullDescription: 'Cada sombra en una foto es un reloj y una brújula: su dirección y longitud dependen de la posición del sol, que es calculable con precisión. Los verificadores usan esto para demostrar que una foto «reciente» se tomó en otro lugar u otra época.',
    ageBracket: '12-13',
    competency: 'lateral_search',
    iconName: 'Compass',
    badgeTag: 'FORENSE SOLAR',
    accentColor: '#F59E0B',
    xpReward: 55,
    durationMinutes: 12,
    keyTakeaways: [
      'La sombra de un objeto revela la dirección y altura del sol en ese momento.',
      'tan(γ) = altura del objeto / longitud de la sombra: con eso calculas el ángulo solar.',
      'SunCalc permite simular la posición del sol en cualquier fecha, hora y lugar.',
      'Si la sombra de la foto no coincide con la fecha/lugar declarados, la foto está descontextualizada.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'La sombra delata',
        subtitle: 'Cada foto lleva un reloj escondido',
        content: 'Mira una foto de un edificio con su sombra. Esa sombra es una firma astronómica:\n\n📐 **Longitud:** al mediodía solar las sombras son cortas; a primera hora y al atardecer, larguísimas.\n🧭 **Dirección:** en el hemisferio norte, al mediodía las sombras apuntan al NORTE.\n\nCon la fórmula **tan(γ) = h/s** (altura del objeto dividida por la longitud de su sombra) obtienes el ángulo de elevación del sol γ. Ese ángulo, combinado con la dirección, reduce las fechas y lugares posibles a una ventana muy estrecha.',
        keyTakeaway: 'Una sombra es un testimonio astronómico: no miente, solo hay que saber leerla.',
        wowFact: 'Eratóstenes midió la circunferencia de la Tierra hace 2.200 años comparando sombras en dos ciudades. La misma geometría sirve hoy para cazar fotos falsas.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'El flujo del forense solar',
        subtitle: 'De la foto a la verificación',
        content: '1. Mide la sombra y un objeto de altura conocida en la foto.\n2. Calcula el ángulo solar: tan(γ) = h/s.\n3. Identifica la dirección de la sombra (brújula).\n4. Simula en SunCalc: ¿qué fechas/horas producen ese ángulo y dirección en el lugar declarado?\n5. Si ninguna coincide → la foto NO es de ese lugar o de esa fecha.',
        diagramType: 'chain',
        keyTakeaway: 'Cinco pasos convierten una sombra en una prueba de verificación.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'El caso de la foto «en directo»',
        subtitle: 'Aplica el método',
        content: 'Una cuenta publica: «¡AHORA MISMO, manifestación masiva en la plaza!» con una foto donde las sombras de las farolas son larguísimas y apuntan al este. En esa ciudad, al mediodía las sombras son cortas y apuntan al norte.',
        keyTakeaway: 'Sombras largas hacia el este = atardecer, no mediodía. La foto no es «ahora mismo».',
        question: {
          prompt: '¿Qué concluyes del análisis de sombras?',
          options: [
            {
              id: 'a',
              text: 'La foto no puede ser del mediodía actual: sombras largas hacia el este indican otra hora (atardecer) u otro momento del año. Está descontextualizada.',
              isNuanced: true,
              score: 100,
              explanation: 'Veredicto forense correcto. La firma astronómica contradice el «AHORA MISMO». Siguiente paso: búsqueda inversa para encontrar cuándo se publicó originalmente. 🔍'
            },
            {
              id: 'b',
              text: 'Las sombras no dicen nada fiable: puede ser cualquier hora.',
              isNuanced: false,
              score: 20,
              explanation: 'La posición del sol es predecible con precisión de minutos para cualquier fecha y lugar. Las sombras son de las pruebas más fiables de la verificación geolocal.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'El arsenal geolocal',
        subtitle: 'Herramientas del verificador',
        content: 'Además de SunCalc (sombras solares), los verificadores combinan: búsqueda inversa de imágenes, mapas satelitales para comparar edificios, y los metadatos EXIF cuando existen. Ninguna herramienta sola basta; combinadas, son casi infalibles.',
        keyTakeaway: 'La verificación moderna es un trabajo de detective con herramientas astronómicas y cartográficas.'
      }
    ]
  },
  {
    id: 404,
    slug: 'forense-deepfakes-c2pa',
    title: 'U4.4 · Análisis Forense de Deepfakes',
    subtitle: 'Microexpresiones, sincronía labial y C2PA',
    shortDescription: 'Aprende las técnicas profesionales para detectar vídeos y audios sintéticos: del análisis visual a la procedencia criptográfica.',
    fullDescription: 'Los deepfakes ya superan el ojo humano en muchos casos. Pero dejan huellas: asincronía labial, microexpresiones inconsistentes, artefactos en bordes... y sobre todo, carecen de procedencia verificable. El estándar C2PA firma criptográficamente el contenido auténtico.',
    ageBracket: '12-13',
    competency: 'ai_literacy',
    iconName: 'Bot',
    badgeTag: 'FORENSE DE MEDIOS',
    accentColor: '#F43F5E',
    xpReward: 55,
    durationMinutes: 12,
    keyTakeaways: [
      'La asincronía labial y el parpadeo anómalo son huellas clásicas del deepfake.',
      'Las microexpresiones FACS inconsistentes delatan rostros sintetizados.',
      'C2PA es un estándar de procedencia: firma criptográfica (metadatos JUMBF) que certifica el origen y las ediciones de un medio.',
      'Ante la duda, la pregunta no es «¿parece real?» sino «¿quién lo publica y con qué procedencia?»'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Las huellas del sintético',
        subtitle: 'Lo que la IA aún hace mal',
        content: 'Los deepfakes modernos son excelentes, pero dejan rastros detectables:\n\n👄 **Asincronía labial:** los labios no encajan perfectamente con el audio.\n👁️ **Parpadeo y microexpresiones:** el sistema FACS (Facial Action Coding System) cataloga 44 movimientos faciales; los rostros sintéticos suelen combinar mal los sutiles.\n🖼️ **Bordes y reflejos:** pelo, orejas, gafas y joyas generan artefactos.\n🔊 **Audio:** respiraciones ausentes, entonación plana, ruido de fondo inconsistente.\n\nNinguna huella sola es definitiva; la acumulación de varias sí.',
        keyTakeaway: 'El deepfake se detecta por acumulación de micro-inconsistencias, no por un fallo gordo.',
        wowFact: 'El sistema FACS fue desarrollado por Paul Ekman en los 70 y se usa en psicología forense. Cada microexpresión dura menos de medio segundo.'
      },
      {
        id: 2,
        type: 'concept',
        title: 'C2PA: la firma de procedencia',
        subtitle: 'Criptografía contra la duda',
        content: 'El enfoque moderno no es solo detectar lo falso, sino CERTIFICAR lo auténtico. El estándar **C2PA** (Coalition for Content Provenance and Authenticity) incrusta en el archivo un manifiesto firmado criptográficamente (formato JUMBF) que registra:\n\n📸 Qué cámara o software creó el contenido.\n✏️ Cada edición posterior, firmada por su autor.\n🏢 Qué organización respalda la cadena.\n\nUn medio con cadena C2PA íntegra tiene un certificado de nacimiento. Uno sin ella no es falso automáticamente... pero pierde la presunción de autenticidad.',
        keyTakeaway: 'La pregunta del futuro no es «¿es real?» sino «¿tiene procedencia verificable?»',
        wowFact: 'C2PA lo impulsan Adobe, Microsoft, Intel, BBC y Reuters. Las cámaras profesionales ya empiezan a firmar las fotos en el momento de capturarlas.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'El vídeo del político',
        subtitle: 'Caso práctico',
        content: 'Se viraliza un vídeo de un político diciendo algo escandaloso. Observas: parpadeo casi nulo, labios ligeramente desincronizados con el audio, y la cuenta que lo publica tiene 3 días de vida. No hay manifiesto C2PA ni cobertura de medios acreditados.',
        keyTakeaway: 'Huellas técnicas + fuente sin reputación + ausencia de cobertura = alerta máxima.',
        question: {
          prompt: '¿Cuál es tu veredicto provisional?',
          options: [
            {
              id: 'a',
              text: 'Sospecha fundada de sintético: múltiples huellas de deepfake, fuente sin historial y cero procedencia. No compartir; esperar verificación de medios acreditados o análisis forense.',
              isNuanced: true,
              score: 100,
              explanation: 'Protocolo forense impecable: acumulación de indicios + evaluación de fuente + prudencia. La viralidad no es verificación. 🛡️'
            },
            {
              id: 'b',
              text: 'El vídeo se ve bastante real, así que probablemente sea auténtico.',
              isNuanced: false,
              score: 20,
              explanation: '«Se ve real» es exactamente la propiedad que un deepfake bueno garantiza. El criterio moderno no es la apariencia: es la procedencia y la cobertura independiente.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'Protocolo de 4 capas',
        subtitle: 'Tu checklist forense',
        content: '1. **Visual:** parpadeo, labios, bordes, reflejos.\n2. **Audio:** respiración, entonación, ruido de fondo.\n3. **Fuente:** quién publica, desde cuándo, con qué historial.\n4. **Procedencia:** ¿manifiesto C2PA? ¿cobertura independiente?\n\nCuatro capas superadas = confianza razonable. Una sola capa no basta nunca.',
        keyTakeaway: 'La autenticidad se verifica en capas: visual, audio, fuente y procedencia.'
      }
    ]
  },
  {
    id: 405,
    slug: 'burbujas-algoritmos',
    title: 'U4.5 · Burbujas de Filtro y Algoritmos',
    subtitle: 'La máquina que maximiza tu tiempo de pantalla',
    shortDescription: 'Entiende cómo los sistemas de recomendación crean cámaras de eco que polarizan opiniones.',
    fullDescription: 'Los algoritmos de recomendación no buscan la verdad ni tu bienestar: maximizan el tiempo de pantalla porque ahí está el dinero. El efecto colateral: burbujas de filtro donde solo ves lo que refuerza tus ideas, y polarización creciente.',
    ageBracket: '12-13',
    competency: 'algorithms',
    iconName: 'Cpu',
    badgeTag: 'AUDITOR DE ALGORITMOS',
    accentColor: '#8B5CF6',
    xpReward: 50,
    durationMinutes: 11,
    keyTakeaways: [
      'La función objetivo del algoritmo es la retención: tiempo de pantalla = ingresos publicitarios.',
      'El contenido polarizante genera más interacción, así que se amplifica.',
      'La burbuja de filtro hace parecer universal lo que solo es tu nicho.',
      'Puedes re-entrenar tu algoritmo: buscar activamente contenido diverso y de calidad.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'La función objetivo',
        subtitle: 'Qué optimiza realmente la máquina',
        content: 'Un algoritmo de recomendación es una función matemática con un objetivo medible. En casi todas las plataformas, ese objetivo es **maximizar el tiempo de sesión y la interacción**, porque cada minuto extra son más anuncios mostrados.\n\n¿Qué contenido retiene más? El que provoca reacciones fuertes: indignación, sorpresa, tribalismo. Resultado: el sistema aprende a servirte exactamente lo que te activa, no lo que te informa. No hay malicia: hay una función objetivo mal alineada con tu interés.',
        keyTakeaway: 'El algoritmo no te conoce: conoce tu patrón de retención. Y lo explota.',
        wowFact: 'Los experimentos internos de las plataformas (filtrados en los últimos años) muestran que el contenido con indignación moral se comparte significativamente más por cada palabra emocional añadida.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'La formación de la burbuja',
        subtitle: 'Del clic al aislamiento informativo',
        content: '1. Ves 3 vídeos de un tema → el sistema infiere interés.\n2. Te sirve 10 más del mismo corte → tu feed se especializa.\n3. Dejas de ver perspectivas contrarias → tu visión del mundo se estrecha.\n4. Lo que ves parece «lo que todo el mundo piensa» → falsa percepción de consenso.\n\nEso es la burbuja de filtro (Pariser, 2011): un aislamiento informativo invisible, porque no notas lo que NO ves.',
        diagramType: 'loop',
        keyTakeaway: 'La burbuja es invisible desde dentro: por eso hay que asomarse a propósito.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'Audita tu propio feed',
        subtitle: 'Experimento personal',
        content: 'Piensa en tu red social favorita. ¿Cuándo fue la última vez que viste una opinión bien argumentada CONTRARIA a la tuya? Si no lo recuerdas, probablemente tu algoritmo las está filtrando.',
        keyTakeaway: 'La ausencia de desacuerdo en tu feed es un síntoma, no una casualidad.',
        question: {
          prompt: '¿Qué movimiento re-entrena tu algoritmo?',
          options: [
            {
              id: 'a',
              text: 'Buscar activamente fuentes y autores diversos (incluidos los que piensan distinto), seguir cuentas de calidad y usar «no me interesa» en el contenido cebo.',
              isNuanced: true,
              score: 100,
              explanation: 'Exacto: el algoritmo aprende de tus señales. Si le das señales diversas, tu feed se diversifica. Eres el entrenador de tu propia máquina. 🎛️'
            },
            {
              id: 'b',
              text: 'Borrar la cuenta: es la única solución.',
              isNuanced: false,
              score: 40,
              explanation: 'Es una opción radical válida, pero no la única. Entender y re-entrenar el algoritmo te da control sin renunciar a la herramienta. La alfabetización algorítmica es el objetivo.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'Dieta informativa consciente',
        subtitle: 'El hábito del estratega',
        content: 'Los auditores de algoritmos aplican tres hábitos: 1) revisar semanalmente QUÉ les muestra el feed y qué falta; 2) seguir deliberadamente fuentes de calidad con perspectivas distintas; 3) salir de la plataforma para verificar (lectura lateral). El feed es un aperitivo, no la dieta completa.',
        keyTakeaway: 'Tu dieta informativa la decides tú, no tu función de retención.'
      }
    ]
  },
  {
    id: 406,
    slug: 'falacias-avanzadas',
    title: 'U4.6 · Falacias Avanzadas',
    subtitle: 'Falso dilema, pendiente resbaladiza y falsa causa',
    shortDescription: 'Domina las tres falacias que dominan el debate público: o blanco o negro, la cuesta abajo imaginaria y la causa inventada.',
    fullDescription: 'El falso dilema reduce problemas complejos a dos opciones. La pendiente resbaladiza inventa una cadena catastrófica sin pruebas. La falsa causa confunde correlación con causalidad. Son las tres falacias más rentables del debate público.',
    ageBracket: '12-13',
    competency: 'nuance',
    iconName: 'ShieldAlert',
    badgeTag: 'CAZA-FALACIAS NIVEL 2',
    accentColor: '#F43F5E',
    xpReward: 50,
    durationMinutes: 11,
    keyTakeaways: [
      'FALSO DILEMA: «o estás conmigo o contra mí» — ignora el espectro de opciones.',
      'PENDIENTE RESBALADIZA: «si permitimos A, acabará pasando Z» sin demostrar la cadena.',
      'FALSA CAUSA (post hoc): «B pasó después de A, luego A causó B» — correlación ≠ causalidad.',
      'Antídoto universal: pedir la cadena de evidencia de cada salto.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El falso dilema',
        subtitle: 'El mundo no es binario',
        content: '«O apoyas esta ley al 100% o estás a favor de los criminales». «O estudias una carrera de ciencias o serás un fracasado».\n\nEl **falso dilema** (o falsa dicotomía) presenta solo dos opciones cuando existe un espectro: puedes apoyar una ley con matices, puedes triunfar en mil campos. Su poder está en la presión tribal: te obliga a elegir bando antes de pensar.\n\nAntídoto: pregunta *«¿de verdad solo hay dos opciones?»* y enumera la tercera, la cuarta...',
        keyTakeaway: 'Cada vez que te den solo dos puertas, busca la tercera: casi siempre existe.'
      },
      {
        id: 2,
        type: 'concept',
        title: 'La pendiente resbaladiza y la falsa causa',
        subtitle: 'Cadenas imaginarias',
        content: '**Pendiente resbaladiza:** «Si dejamos usar calculadora en clase, acabarán sin saber sumar, luego sin saber pensar, y terminaremos con una generación de inútiles». Cada salto de la cadena necesita su propia evidencia; sin ella, es ficción catastrofista.\n\n**Falsa causa (post hoc ergo propter hoc):** «Desde que pusieron el nuevo semáforo, ha llovido más». Que B siga a A no implica que A cause B. La correlación exige mecanismo causal y, idealmente, experimento controlado.',
        keyTakeaway: 'Cada eslabón de una cadena causal necesita su propia prueba.',
        wowFact: 'La falacia post hoc tiene nombre latino del siglo XVII. Los humanos llevamos siglos inventando causas: antes de la ciencia moderna, cada eclipse tenía una explicación sobrenatural distinta.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'Identifica la falacia',
        subtitle: 'Tres discursos, tres trampas',
        content: 'Clasifica: 1) «O prohibimos todos los videojuegos o los jóvenes estarán perdidos». 2) «Si permitimos mascotas en clase, mañana querrán traer caballos y pasado un zoo». 3) «Desde que mi equipo ganó la liga, me puse el mismo jersey: el jersey trae suerte».',
        keyTakeaway: '1 = falso dilema, 2 = pendiente resbaladiza, 3 = falsa causa.',
        question: {
          prompt: '¿Cuál es la clasificación correcta?',
          options: [
            {
              id: 'a',
              text: '1: falso dilema (hay opciones intermedias). 2: pendiente resbaladiza (cadena sin evidencia). 3: falsa causa (correlación sin mecanismo).',
              isNuanced: true,
              score: 100,
              explanation: 'Tres de tres. Ya ves las matrices del debate público: estas tres falacias sostienen la mayoría de los discursos polarizantes. 🎯'
            },
            {
              id: 'b',
              text: 'Las tres son ad hominem.',
              isNuanced: false,
              score: 20,
              explanation: 'El ad hominem ataca a la persona. Aquí ninguna frase ataca a nadie: manipulan las opciones, las consecuencias y las causas. Repasa las definiciones.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'El antídoto universal',
        subtitle: 'Pide la cadena',
        content: 'Ante cualquier falacia estructural, la misma pregunta funciona: *«¿Puedes mostrar la evidencia de cada salto?»*. El falso dilema se rompe listando alternativas; la pendiente resbaladiza, pidiendo evidencia eslabón a eslabón; la falsa causa, exigiendo mecanismo y control. Una pregunta, tres desmontajes.',
        keyTakeaway: '«¿Y la evidencia de cada salto?» desmonta las tres falacias estructurales.'
      }
    ]
  },
  {
    id: 407,
    slug: 'debate-karl-popper',
    title: 'U4.7 · Debate Competitivo Karl Popper',
    subtitle: 'Turnos, réplica y evidencia verificada',
    shortDescription: 'Aprende el formato de debate académico: turnos cronometrados, réplica cruzada y victoria por evidencia.',
    fullDescription: 'El formato Karl Popper es el estándar del debate educativo internacional: dos equipos, turnos de 3 minutos, réplica cruzada con preguntas directas, y evaluación basada en la calidad de la evidencia, no en el volumen de la voz.',
    ageBracket: '12-13',
    competency: 'nuance',
    iconName: 'MessageCircle',
    badgeTag: 'DEBATIENTE POPPER',
    accentColor: '#06B6D4',
    xpReward: 55,
    durationMinutes: 12,
    keyTakeaways: [
      'El formato Popper enfrenta dos equipos con turnos cronometrados (3 min) y roles definidos.',
      'La réplica cruzada permite preguntas directas: ahí se ganan y pierden los debates.',
      'Se evalúa la evidencia verificada y la estructura AER/Toulmin, no la retórica vacía.',
      'El respeto al turno y al rival es parte de la puntuación.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'La estructura del debate Popper',
        subtitle: 'Reglas del juego',
        content: 'El formato Karl Popper (por el filósofo de la ciencia) estructura el debate así:\n\n⏱️ **Turnos cronometrados:** cada orador tiene 3 minutos exactos. Se acabó el tiempo, se acabó el turno.\n🎭 **Roles:** afirmación (defiende la moción) y negación (la refuta), con oradores de construcción y de refutación.\n⚔️ **Réplica cruzada:** tras cada discurso, el rival hace preguntas directas. Las respuestas evasivas puntúan en contra.\n📊 **Evaluación:** evidencia verificada, estructura lógica, respeto al turno.\n\nNo gana quien grita más: gana quien sostiene mejor sus afirmaciones bajo fuego de preguntas.',
        keyTakeaway: 'El debate Popper convierte la discusión en deporte con reglas: gana la evidencia, no el volumen.',
        wowFact: 'Karl Popper defendió que una teoría solo es científica si puede ser refutada. El formato de debate lleva su nombre porque honra esa idea: toda afirmación debe sobrevivir al intento de refutación.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'El flujo del enfrentamiento',
        subtitle: 'De la moción al veredicto',
        content: '1. Moción: «Esta casa prohibiría los deberes escolares».\n2. Afirmación construye su caso (AER + Toulmin).\n3. Negación refuta: ataca garantías y reservas.\n4. Réplicas cruzadas: preguntas directas, respuestas bajo presión.\n5. Discursos finales: resumen y weighing (comparación de impactos).\n6. Veredicto del juez: evidencia, lógica, forma.',
        diagramType: 'chain',
        keyTakeaway: 'Cada fase tiene un objetivo: construir, refutar, presionar y comparar.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'La réplica letal',
        subtitle: 'Bajo presión',
        content: 'En la réplica cruzada, tu rival afirma: «Los deberes causan ansiedad, lo dice un estudio». Tienes 30 segundos para la pregunta más incisiva.',
        keyTakeaway: 'La mejor pregunta ataca la garantía o la fuente: ¿qué estudio, con qué muestra, midiendo qué?',
        question: {
          prompt: '¿Cuál es la pregunta de réplica más fuerte?',
          options: [
            {
              id: 'a',
              text: '«¿Qué estudio concreto es, con cuántos alumnos, y mide ansiedad causada por los deberes o solo correlacionada con ellos?»',
              isNuanced: true,
              score: 100,
              explanation: 'Réplica de manual: pides fuente, muestra y distinción causa/correlación. Si el rival no responde con precisión, su garantía se derrumba ante el juez. ⚔️'
            },
            {
              id: 'b',
              text: '«¿Y tú qué sabes, si ni estudias?»',
              isNuanced: false,
              score: 10,
              explanation: 'Eso es un ad hominem: en formato Popper resta puntos y credibilidad. Las preguntas letales atacan argumentos, nunca personas.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'reflection',
        title: 'Tu primer caso',
        subtitle: 'Prepara la moción',
        content: 'Elige una moción («Esta casa prohibiría los móviles en las aulas») y prepara ambos lados: tres argumentos AER para la afirmación y tres para la negación. Preparar los dos bandos es el ejercicio definitivo de pensamiento crítico: te obliga a entender la mejor versión del argumento contrario.',
        keyTakeaway: 'Quien puede defender ambos lados de una moción entiende el problema de verdad.'
      }
    ]
  }
];
