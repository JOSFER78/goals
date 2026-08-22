import { CriterioModule } from '../../types';

/**
 * TRAMO 5 · 14-15 AÑOS (3.º y 4.º de ESO)
 * Arquetipo: "El Estratega Autónomo" — nivel máximo: epistemología, filosofía, gobernanza.
 * SSOT curricular: docs/criterio/00_MASTER_PLAN_CURRICULAR.md (U5.1 – U5.7)
 * Temas: juicio reflexivo (King & Kitchener / Kuhn), lógica de predicados + Argdown,
 * prebunking, fundamentos morales (Haidt), ética de la IA y EU AI Act, tranvía/coches autónomos, juicio de Sócrates.
 */
export const TRAMO_5_MODULES: CriterioModule[] = [
  {
    id: 501,
    slug: 'juicio-reflexivo',
    title: 'U5.1 · Modelos de Juicio Reflexivo',
    subtitle: 'Del relativismo ingenuo al compromiso reflexivo',
    shortDescription: 'Aprende los estadios del pensamiento maduro: por qué «todo es opinable» es una trampa y cómo se pondera evidencia.',
    fullDescription: 'King & Kitchener y Deanna Kuhn describieron cómo evoluciona el juicio: del pensamiento pre-reflexivo (las respuestas son absolutas), pasando por el relativismo ingenuo («todo vale, nada se puede saber»), hasta el juicio reflexivo: las conclusiones se sostienen por el PESO de la evidencia, y son revisables.',
    ageBracket: '14-15',
    competency: 'nuance',
    iconName: 'Brain',
    badgeTag: 'PENSADOR REFLEXIVO',
    accentColor: '#6366F1',
    xpReward: 60,
    durationMinutes: 12,
    keyTakeaways: [
      'Pre-reflexivo: las respuestas son absolutas y las da la autoridad.',
      'Relativismo ingenuo: «todo es opinable», ninguna conclusión puede justificarse.',
      'Juicio reflexivo: las conclusiones se justifican por peso de evidencia y son revisables.',
      '«Es mi opinión» no es un escudo: las opiniones se evalúan por sus razones.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Los tres estadios del juicio',
        subtitle: 'King & Kitchener: el modelo reflexivo',
        content: 'Ante una pregunta difícil («¿es justa esta ley?»), las personas razonan en tres niveles evolutivos:\n\n**1. Pre-reflexivo:** la respuesta existe y es absoluta; la tiene la autoridad. No hay incertidumbre legítima.\n**2. Relativismo ingenuo:** «cada uno tiene su verdad», todo vale igual, nada puede justificarse. Es la etapa donde muchos se atascan, porque parece sofisticada... pero es una rendición disfrazada.\n**3. Juicio reflexivo:** hay incertidumbre real, PERO las conclusiones se pueden ordenar por peso de evidencia. Una opinión bien argumentada vale más que una sin razones. Y toda conclusión es revisable si llega mejor evidencia.',
        keyTakeaway: 'El relativismo ingenuo no es pensamiento crítico: es su abandono elegante.',
        wowFact: 'Deanna Kuhn demostró en «The Skills of Argument» (1991) que muchos adultos nunca superan el relativismo ingenuo: confunden «no hay certeza absoluta» con «nada se puede saber».'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: 'El escudo de la opinión',
        subtitle: 'Cuando «es mi opinión» cierra el debate',
        content: 'En un debate sobre vacunas, alguien dice: «Yo respeto todas las opiniones, y la mía es que no funcionan. Es mi opinión y todas valen igual». ¿Cuál es la respuesta reflexiva?',
        keyTakeaway: 'Las opiniones no valen igual: se evalúan por la evidencia que las sostiene.',
        question: {
          prompt: '¿Qué distingue al juicio reflexivo aquí?',
          options: [
            {
              id: 'a',
              text: 'Respetar a la PERSONA, pero evaluar la OPINIÓN: los ensayos clínicos con millones de participantes pesan más que una creencia sin evidencia. Respeto ≠ equivalencia epistémica.',
              isNuanced: true,
              score: 100,
              explanation: 'Exacto: el juicio reflexivo separa el respeto personal de la evaluación epistémica. Todas las personas merecen respeto; no todas las afirmaciones merecen el mismo crédito. 🎓'
            },
            {
              id: 'b',
              text: 'Darle la razón: si todo es opinable, su opinión vale igual que la ciencia.',
              isNuanced: false,
              score: 20,
              explanation: 'Eso es relativismo ingenuo: confunde igualdad de personas con igualdad de evidencias. Si todo vale igual, la palabra «evidencia» pierde su significado.'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'evidence_reveal',
        title: 'La balanza de evidencia',
        subtitle: 'El instrumento del juicio reflexivo',
        content: 'Ante cualquier cuestión disputada, el pensador reflexivo hace tres operaciones: 1) listar las afirmaciones en juego; 2) asignar a cada una su evidencia y su calidad (ensayo controlado > observacional > testimonio > intuición); 3) concluir con un grado de confianza explícito («la evidencia apunta a X con confianza alta, revisable»). Eso es pensar con balanza, no con eslogan.',
        keyTakeaway: 'Juicio reflexivo = conclusiones ponderadas por calidad de evidencia, con confianza explícita.'
      }
    ]
  },
  {
    id: 502,
    slug: 'logica-predicados-argdown',
    title: 'U5.2 · Lógica de Predicados y Argdown',
    subtitle: 'Cuantificadores y mapas de argumentos',
    shortDescription: 'Sube de nivel: de la lógica proposicional a la de predicados (∀, ∃) y al mapeo formal de controversias con Argdown.',
    fullDescription: 'La lógica de predicados (L1) permite expresar «todos» y «algunos» y razonar sobre estructuras internas de las proposiciones. Combinada con Argdown (sintaxis para diagramar argumentos como grafos), te da el instrumental completo para mapear controversias complejas.',
    ageBracket: '14-15',
    competency: 'nuance',
    iconName: 'GitMerge',
    badgeTag: 'ARQUITECTO FORMAL',
    accentColor: '#8B5CF6',
    xpReward: 60,
    durationMinutes: 13,
    keyTakeaways: [
      '∀ (cuantificador universal): «para todo x». ∃ (existencial): «existe al menos un x».',
      'La negación invierte cuantificadores: ¬∀x P(x) ≡ ∃x ¬P(x).',
      'Los silogismos clásicos se formalizan en L1: «Todos los humanos son mortales; Sócrates es humano; luego Sócrates es mortal».',
      'Argdown representa argumentos como grafos: tesis, premisas, ataques y apoyos con sintaxis legible.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'De L0 a L1: el poder de los cuantificadores',
        subtitle: 'Todos, algunos, ninguno',
        content: 'La lógica proposicional (L0) trata las frases como átomos. La de predicados (L1) abre el átomo:\n\n**∀x (Humano(x) → Mortal(x))** — «todos los humanos son mortales».\n**Humano(Sócrates)** — «Sócrates es humano».\n**∴ Mortal(Sócrates)** — conclusión por instanciación universal.\n\nLos cuantificadores tienen reglas de negación que la gente viola constantemente:\n¬∀x P(x) ≡ ∃x ¬P(x): «no todos son P» equivale a «alguno no es P». Por eso «no todos los políticos mienten» NO significa «todos dicen la verdad».',
        keyTakeaway: 'Negar «todos» produce «alguno no», no «ninguno». La mayoría de las discusiones políticas violan esta regla.',
        wowFact: 'Gottlob Frege formalizó la lógica de predicados en 1879 («Begriffsschrift»). Es la base de las matemáticas modernas y de los lenguajes de programación con tipos.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'Argdown: el grafo de la controversia',
        subtitle: 'Mapear debates como ingeniero',
        content: 'Argdown permite escribir un debate como un grafo legible:\n\n[1] Los deberes mejoran el rendimiento\n  + [2] Los estudios de Cooper (1989) muestran correlación positiva en secundaria\n  - [3] La correlación no prueba causalidad: quizá los alumnos aventajados hacen más deberes\n    + [4] Los experimentos controlados de Trautwein encuentran efectos pequeños\n\nCada nodo es una tesis; + es apoyo, - es ataque. El resultado: un mapa donde se ve exactamente dónde está el desacuerdo.',
        diagramType: 'network',
        keyTakeaway: 'Un mapa de argumento convierte un debate caótico en un grafo auditable.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'La negación del cuantificador',
        subtitle: 'El error clásico',
        content: 'Alguien afirma: «Todos los estudios dicen que X es seguro». Tú encuentras UN estudio riguroso que muestra riesgos. ¿Qué has refutado exactamente?',
        keyTakeaway: 'Un contraejemplo refuta el «todos», no la seguridad general de X.',
        question: {
          prompt: '¿Cuál es la refutación lógicamente correcta?',
          options: [
            {
              id: 'a',
              text: 'He refutado el cuantificador universal: ¬∀x P(x) ≡ ∃x ¬P(x). La afirmación «todos los estudios» es falsa. Pero eso NO demuestra que X sea inseguro: solo que la evidencia no es unánime.',
              isNuanced: true,
              score: 100,
              explanation: 'Precisión de lógico: refutas el «todos» sin saltar al «ninguno». La conclusión honesta es «la evidencia está disputada», que es exactamente el estado epistémico correcto. 🎯'
            },
            {
              id: 'b',
              text: 'He demostrado que X es peligroso y no debería usarse.',
              isNuanced: false,
              score: 20,
              explanation: 'Eso es la falacia inversa: de «no todos los estudios dicen seguro» no se sigue «es inseguro». Un contraejemplo tumba el universal, no establece el universal contrario.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'Tu primer mapa Argdown',
        subtitle: 'Ejercicio de arquitectura',
        content: 'Toma una controversia real (energía nuclear, redes sociales y menores, IA en educación) y construye su mapa: tesis central, 2 apoyos, 2 ataques, y para cada ataque su posible contra-ataque. Verás algo sorprendente: la mayoría de los debates públicos son grafos de 4 nodos donde la gente discute como si fueran de 40.',
        keyTakeaway: 'Mapear la controversia revela su tamaño real: casi siempre más pequeño de lo que parece.'
      }
    ]
  },
  {
    id: 503,
    slug: 'prebunking-inmunologia',
    title: 'U5.3 · Inmunología Cognitiva',
    subtitle: 'Prebunking e Inoculation Theory',
    shortDescription: 'La ciencia de vacunarse contra la manipulación: exponerse a versiones débiles del ataque para desarrollar anticuerpos mentales.',
    fullDescription: 'La Inoculation Theory (McGuire, 1961) demostró que las actitudes se pueden «vacunar»: exponer a la persona a una versión débil del argumento manipulativo, junto con su refutación, genera resistencia duradera. El prebunking es la aplicación moderna: campañas que avisan de las TÉCNICAS de desinformación antes de encontrarlas.',
    ageBracket: '14-15',
    competency: 'pause_method',
    iconName: 'ShieldAlert',
    badgeTag: 'INMUNIDAD COGNITIVA',
    accentColor: '#10B981',
    xpReward: 60,
    durationMinutes: 12,
    keyTakeaways: [
      'Inoculation Theory: exposición a ataques débiles + refutación = resistencia duradera.',
      'El prebunking avisa de la TÉCNICA antes del ataque, no del contenido concreto.',
      'Las técnicas de manipulación son reutilizables: quien conoce la técnica, la detecta en cualquier tema.',
      'El debunking (desmentir después) es más difícil: el efecto de influencia continuada hace persistente la desinformación.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'La vacuna mental',
        subtitle: 'McGuire y la inoculación psicológica',
        content: 'William McGuire se preguntó en los 60: ¿por qué las creencias de la gente colapsan ante la primera contra-propaganda bien hecha? Su respuesta: porque nunca se habían expuesto a ataques. Como un sistema inmune sin contacto con patógenos.\n\nSu experimento: a un grupo le daba la creencia sin más; a otro, la creencia + un ataque débil refutado. Cuando llegaba el ataque fuerte, el segundo grupo resistía; el primero, no. Nacía la **Inoculation Theory**: dosis pequeñas de contra-argumento generan anticuerpos cognitivos.',
        keyTakeaway: 'La resistencia a la manipulación se entrena: exposición gradual + refutación.',
        wowFact: 'Los experimentos modernos de prebunking (Roozenbeek & van der Linden, Cambridge) muestran reducciones medibles de la susceptibilidad a fake news con vídeos de 2 minutos. La vacuna cognitiva funciona a escala.'
      },
      {
        id: 2,
        type: 'concept',
        title: 'Prebunking vs Debunking',
        subtitle: 'Antes o después: la asimetría crítica',
        content: '**Debunking** (desmentir después): llega tarde. El **efecto de influencia continuada** demuestra que la desinformación sigue influyendo incluso después de desmentida: el cerebro la almacenó con carga emocional y la recupera.\n\n**Prebunking** (vacunar antes): enseña la TÉCNICA («así se fabrica un falso dilema», «así se usa un experto falso») con ejemplos genéricos. Cuando el ataque real llega —con otro tema, otro idioma, otro formato—, la técnica ya es reconocible. Por eso el prebunking escala: las técnicas son finitas y reutilizables; los bulos, infinitos.',
        keyTakeaway: 'Desmentir bulos uno a uno es achicar agua; enseñar las técnicas es tapar la vía.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'Diseña tu propia vacuna',
        subtitle: 'El ejercicio de inoculación',
        content: 'Sabes que en época de exámenes circulan «métodos milagro para aprobar sin estudiar». Diseña un prebunking para tu clase.',
        keyTakeaway: 'El prebunking eficaz nombra la técnica, muestra el ejemplo débil y da la refutación.',
        question: {
          prompt: '¿Cuál es el prebunking mejor construido?',
          options: [
            {
              id: 'a',
              text: '«Ojo: estos días veréis anuncios de métodos milagro. Usan la técnica del testimonio emocional + urgencia + autoridad falsa. Ejemplo típico: "aprobé sin estudiar gracias a X". La refutación: ningún método sustituye al estudio; si existiera, los colegios lo usarían».',
              isNuanced: true,
              score: 100,
              explanation: 'Vacuna completa: técnica nombrada, ejemplo débil expuesto, refutación lista. Cuando llegue el ataque real, tu clase lo reconocerá en segundos. 💉'
            },
            {
              id: 'b',
              text: 'Esperar a que alguien caiga y entonces desmentir el método concreto.',
              isNuanced: false,
              score: 30,
              explanation: 'Eso es debunking: llega tarde y solo cubre UN bulo. Mañana vendrá otro con la misma técnica y distinto disfraz. El prebunking ataca la técnica, que es reutilizable.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'El catálogo de técnicas',
        subtitle: 'Tu cartilla de vacunación',
        content: 'Las técnicas que más se repiten en desinformación: apelación emocional extrema, falso experto, falso dilema, chivo expiatorio, «tú también» (whataboutism), conspiración de silencio («no quieren que lo sepas»). Construye tu cartilla: una entrada por técnica, con ejemplo y refutación. Cada entrada es una dosis de vacuna.',
        keyTakeaway: 'Técnicas finitas, bulos infinitos: vacuna contra la técnica, no contra el contenido.'
      }
    ]
  },
  {
    id: 504,
    slug: 'fundamentos-morales-haidt',
    title: 'U5.4 · Las 6 Matrices Morales',
    subtitle: 'La teoría de Jonathan Haidt',
    shortDescription: 'Entiende por qué la gente buena disagree: todos razonamos desde 6 matrices morales, pero cada cultura y persona las pondera distinto.',
    fullDescription: 'Jonathan Haidt (The Righteous Mind, 2012) demostró que el juicio moral no es puro razonamiento: es intuición primero, justificación después. Y las intuiciones se organizan en 6 matrices: Cuidado, Justicia, Lealtad, Autoridad, Santidad y Libertad. Los conflictos políticos son, a menudo, choques de ponderaciones entre matrices.',
    ageBracket: '14-15',
    competency: 'nuance',
    iconName: 'Heart',
    badgeTag: 'CARTÓGRAFO MORAL',
    accentColor: '#EC4899',
    xpReward: 60,
    durationMinutes: 12,
    keyTakeaways: [
      'Las 6 matrices: Cuidado/Daño, Justicia/Trampa, Lealtad/Traición, Autoridad/Subversión, Santidad/Degradación, Libertad/Opresión.',
      'El juicio moral es intuición rápida + justificación posterior (el «jinete y el elefante»).',
      'Los desacuerdos políticos suelen ser ponderaciones distintas de las mismas matrices, no maldad.',
      'Identificar la matriz del otro permite discutir el fondo sin caricaturizarlo.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El jinete y el elefante',
        subtitle: 'Intuición primero, razón después',
        content: 'Haidt usa una metáfora: la intuición moral es un elefante (rápido, potente, automático); el razonamiento es el jinete (lento, elocuente, y a menudo solo justifica hacia dónde ya iba el elefante).\n\nExperimento clásico: se describe una acción inofensiva pero tabú y la mayoría la condena AL INSTANTE, y luego busca razones. El juicio moral funciona al revés de lo que creemos: no razonamos para sentir; sentimos y luego razonamos para justificar.',
        keyTakeaway: 'Tu elefante moral decide en milisegundos; tu jinete llega después a redactar el comunicado.',
        wowFact: 'Haidt desarrolló su teoría tras años de investigación transcultural en Brasil, India y EE.UU.: las matrices morales varían en ponderación entre culturas, pero aparecen en todas.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'Las 6 matrices',
        subtitle: 'El espectro moral completo',
        content: '1. **Cuidado/Daño:** proteger a los vulnerables.\n2. **Justicia/Trampa:** proporcionalidad y juego limpio.\n3. **Lealtad/Traición:** pertenencia al grupo.\n4. **Autoridad/Subversión:** respeto a la jerarquía legítima.\n5. **Santidad/Degradación:** pureza, lo sagrado.\n6. **Libertad/Opresión:** resistencia al dominio.\n\nCada persona y cultura pondera las seis de forma distinta. Dos personas buenas pueden chocar frontalmente porque una prioriza Cuidado y la otra Lealtad.',
        diagramType: 'scale',
        keyTakeaway: 'El desacuerdo moral suele ser una diferencia de ponderación, no de humanidad.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'El choque de matrices',
        subtitle: 'El debate del himno',
        content: 'Debate escolar: ¿debe ser obligatorio cantar el himno antes de los partidos? Ana: «Es una imposición, libertad individual». Bruno: «Es un gesto de lealtad al equipo y al colegio». ¿Qué está pasando realmente?',
        keyTakeaway: 'No discuten hechos: ponderan matrices distintas (Libertad vs Lealtad).',
        question: {
          prompt: '¿Cuál es el análisis más preciso?',
          options: [
            {
              id: 'a',
              text: 'Es un choque de matrices: Ana pondera Libertad, Bruno pondera Lealtad. Ninguno es inmoral; el debate real es cómo equilibrar ambas ponderaciones en una norma común.',
              isNuanced: true,
              score: 100,
              explanation: 'Cartografía moral exacta. Cuando identificas las matrices, el debate deja de ser «yo tengo razón, tú eres malo» y se convierte en «cómo ponderamos». Eso es madurez ética. 🗺️'
            },
            {
              id: 'b',
              text: 'Uno de los dos está objetivamente equivocado y hay que demostrarlo.',
              isNuanced: false,
              score: 30,
              explanation: 'Ese enfoque asume que hay una ponderación «correcta» única. La teoría de Haidt muestra que ambos razonan desde matrices legítimas: el trabajo es equilibrarlas, no eliminar una.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'reflection',
        title: 'Tu perfil moral',
        subtitle: 'Autoconocimiento estratégico',
        content: 'Puntúa del 1 al 10 cuánto pesa cada matriz en tus decisiones. Luego haz lo mismo con alguien que piense distinto a ti en un tema concreto. Compara: ¿el desacuerdo es de hechos o de ponderaciones? La mayoría de las discusiones eternas son lo segundo. Nombrarlo es el primer paso para resolverlo.',
        keyTakeaway: 'Conocer tu perfil de ponderación moral te hace más difícil de manipular y mejor negociador.'
      }
    ]
  },
  {
    id: 505,
    slug: 'etica-ia-ai-act',
    title: 'U5.5 · Ética de la IA y el EU AI Act',
    subtitle: 'Juicios a sistemas algorítmicos de alto riesgo',
    shortDescription: 'Analiza los riesgos reales de la IA (sesgo en contratación, justicia predictiva) y el marco regulatorio europeo que los gobierna.',
    fullDescription: 'El Reglamento Europeo de IA (2024/1689) es la primera ley integral del mundo sobre inteligencia artificial: clasifica los sistemas por riesgo y prohíbe los inaceptables. Estudiar sus casos límite —sesgo en contratación, scoring social, justicia predictiva— es estudiar la ética aplicada del siglo XXI.',
    ageBracket: '14-15',
    competency: 'ai_literacy',
    iconName: 'Landmark',
    badgeTag: 'AUDITOR DE IA',
    accentColor: '#06B6D4',
    xpReward: 65,
    durationMinutes: 13,
    keyTakeaways: [
      'El EU AI Act clasifica sistemas en 4 niveles: riesgo inaceptable (prohibido), alto, limitado y mínimo.',
      'Riesgo inaceptable: scoring social, manipulación subliminal, explotación de vulnerables.',
      'Riesgo alto: contratación, crédito, justicia, educación — exigen evaluación, transparencia y supervisión humana.',
      'El sesgo algorítmico no es un bug exótico: es el resultado de entrenar con datos históricos sesgados.',
      'La auditoría de IA exige: datos de entrenamiento, métricas de equidad y derecho a explicación.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El caso del algoritmo que discriminaba',
        subtitle: 'Cuando el dato histórico es el prejuicio',
        content: 'Caso real documentado: una gran empresa tecnológica entrenó un sistema para filtrar currículums. El sistema aprendió de 10 años de contrataciones pasadas... donde la mayoría de contratados eran hombres. Resultado: el algoritmo penalizaba currículums que contenían la palabra «mujeres» (ej. «capitana del equipo de mujeres»). Hubo que retirarlo.\n\nLa lección: un sistema de aprendizaje automático no aprende cómo DEBERÍA ser el mundo; aprende cómo FUE. Si el pasado contiene sesgo, el algoritmo lo industrializa.',
        keyTakeaway: 'Los algoritmos no heredan la neutralidad: heredan los sesgos de sus datos de entrenamiento.',
        wowFact: 'El EU AI Act (Reglamento 2024/1689) se aprobó tras años de negociación y su despliegue es gradual: las prohibiciones de riesgo inaceptable fueron las primeras en aplicar.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'La pirámide de riesgo del AI Act',
        subtitle: 'Los 4 niveles regulatorios',
        content: '🚫 **Inaceptable (prohibido):** scoring social gubernamental, manipulación subliminal dañina, explotación de vulnerables, identificación biométrica remota en tiempo real (con excepciones tasadas).\n⚠️ **Alto (regulado):** selección de personal, concesión de crédito, admisión educativa, justicia predictiva, infraestructuras críticas. Exigen: evaluación de riesgos, calidad de datos, trazabilidad, supervisión humana.\n📋 **Limitado:** chatbots y deepfakes — obligación de transparencia («estás hablando con una IA»).\n✅ **Mínimo:** filtros de spam, videojuegos — sin obligaciones extra.',
        diagramType: 'scale',
        keyTakeaway: 'Cuanto más afecta la IA a derechos fundamentales, más obligaciones: ese es el principio del AI Act.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'Audita el sistema',
        subtitle: 'El caso de la beca denegada',
        content: 'Un sistema de IA deniega becas a estudiantes de ciertos códigos postales. La administración dice: «el algoritmo es objetivo, solo usa datos». Como auditor, ¿qué exiges?',
        keyTakeaway: '«Solo usa datos» no es neutralidad: los datos pueden codificar desigualdad histórica.',
        question: {
          prompt: '¿Cuál es la auditoría correcta?',
          options: [
            {
              id: 'a',
              text: 'Exigir: variables de entrenamiento (¿el código postal es proxy de renta/etnia?), métricas de equidad por grupo, trazabilidad de la decisión y supervisión humana con derecho a recurso. Clasificación: riesgo alto (educación), obligaciones del AI Act.',
              isNuanced: true,
              score: 100,
              explanation: 'Auditoría de libro: detectas la variable proxy, exiges métricas de equidad y aplicas el marco de riesgo alto. El código postal es el proxy clásico de segregación: el algoritmo puede discriminar sin mencionar jamás la palabra prohibida. 🔬'
            },
            {
              id: 'b',
              text: 'Aceptar la explicación: si el algoritmo es matemático, es objetivo por definición.',
              isNuanced: false,
              score: 15,
              explanation: 'La objetividad matemática es un mito cuando los datos de entrada son históricos: la matemática ejecuta el sesgo con precisión industrial. «Es objetivo porque es un algoritmo» es la nueva versión de «lo dice la autoridad».'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'El kit del auditor de IA',
        subtitle: 'Cinco preguntas ante cualquier sistema',
        content: '1. ¿Con qué datos se entrenó y qué sesgos históricos contienen?\n2. ¿Qué variables proxy pueden codificar atributos protegidos?\n3. ¿Hay métricas de equidad por grupo publicadas?\n4. ¿Hay supervisión humana real y derecho a recurso?\n5. ¿Qué nivel de riesgo le asigna el AI Act y qué obligaciones conlleva?\n\nCinco preguntas que separan al ciudadano crítico del usuario pasivo.',
        keyTakeaway: 'La IA no se audita con fe: se audita con datos, métricas y marco legal.'
      }
    ]
  },
  {
    id: 506,
    slug: 'tranvia-coches-autonomos',
    title: 'U5.6 · El Dilema del Tranvía y los Coches Autónomos',
    subtitle: 'Utilitarismo vs Deontología en código',
    shortDescription: 'El dilema filosófico clásico se convierte en línea de código: ¿cómo debe decidir un coche autónomo en un accidente inevitable?',
    fullDescription: 'El dilema del tranvía (Foot, 1967) dejó de ser un experimento mental: los coches autónomos necesitan programar decisiones ante accidentes inevitables. Utilitarismo (minimizar daño total) contra deontología kantiana (no usar personas como medios): la filosofía moral ahora compila.',
    ageBracket: '14-15',
    competency: 'nuance',
    iconName: 'Scale',
    badgeTag: 'FILÓSOFO DEL CÓDIGO',
    accentColor: '#F59E0B',
    xpReward: 65,
    durationMinutes: 13,
    keyTakeaways: [
      'Utilitarismo (Bentham/Mill): la acción correcta maximiza el bienestar total.',
      'Deontología (Kant): hay acciones prohibidas en sí mismas, independientemente de sus consecuencias; nunca usar personas como meros medios.',
      'Los coches autónomos convierten el dilema en ingeniería: alguien debe programar la política de decisión.',
      'El experimento Moral Machine (MIT) mostró que las preferencias morales varían entre culturas.',
      'La responsabilidad legal (¿fabricante? ¿programador? ¿pasajero?) es parte del dilema.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El tranvía original',
        subtitle: 'Philippa Foot, 1967',
        content: 'Un tranvía sin frenos avanza hacia cinco personas atadas a la vía. Puedes tirar de una palanca para desviarlo a una vía secundaria donde hay UNA persona. ¿Tiras de la palanca?\n\nLa mayoría dice que sí. Pero cambia el escenario: ahora la única forma de salvar a los cinco es EMPUJAR a una persona desde un puente para detener el tranvía. La mayoría dice que no. Mismo balance aritmético (1 vs 5), intuiciones opuestas.\n\nAhí viven las dos grandes tradiciones: el **utilitarismo** (solo cuenta el resultado neto) y la **deontología** (empujar es usar a alguien como medio: prohibido, pase lo que pase).',
        keyTakeaway: 'El mismo cálculo produce intuiciones opuestas según el mecanismo: eso revela que no somos utilitaristas puros.',
        wowFact: 'El experimento Moral Machine del MIT recogió 40 millones de decisiones en 233 países: las culturas difieren sistemáticamente en si priorizan jóvenes, mayores, peatones o pasajeros.'
      },
      {
        id: 2,
        type: 'concept',
        title: 'Cuando el dilema compila',
        subtitle: 'El coche autónomo y la política de decisión',
        content: 'Un coche autónomo detecta un accidente inevitable: frenar no basta. Opción A: mantener trayectoria, atropella a tres peatones. Opción B: desviarse, estrella al coche contra un muro, muere el pasajero.\n\nEl coche no «decide» en el momento: ejecuta una política programada por alguien. Es decir: una empresa, unos ingenieros y unos reguladores han tenido que ELEGIR una ética y escribirla en código. El dilema del tranvía ya no es filosofía de salón: es especificación de producto, con responsabilidad legal (¿quién responde: fabricante, programador, dueño?).',
        keyTakeaway: 'Programar un coche autónomo es hacer filosofía moral con consecuencias legales.',
        wowFact: 'Alemania fue pionera con directrices éticas (2017): prohibió discriminar por edad, género o condición física en las decisiones del algoritmo. La ética se convierte en norma técnica.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'La comisión de ética',
        subtitle: 'Tu voto razonado',
        content: 'Formas parte de la comisión que debe redactar la política de decisión del coche autónomo. Tienes que justificar tu posición ante utilitaristas y deontologistas.',
        keyTakeaway: 'La posición más defendible combina principios con transparencia y supervisión pública.',
        question: {
          prompt: '¿Cuál es la posición más sólida?',
          options: [
            {
              id: 'a',
              text: 'Política pública y transparente, deliberada democráticamente (no por una empresa en secreto), con mínimos deontológicos (no discriminar personas por características) y evaluación continua de resultados. Ni utilitarismo ciego ni deontología rígida: marco deliberado y auditable.',
              isNuanced: true,
              score: 100,
              explanation: 'Posición de comisión real: reconoces que ninguna teoría pura resuelve el caso, y trasladas la decisión al terreno correcto: deliberación pública, transparencia y auditoría. Así se gobierna la tecnología en una democracia. 🏛️'
            },
            {
              id: 'b',
              text: 'Que decida el mercado: cada fabricante programa lo que quiera y el cliente elige.',
              isNuanced: false,
              score: 25,
              explanation: 'Privatizar la ética de vida o muerte genera incentivos perversos (coches que protegen a su pasajero a toda costa) y externaliza el dilema al consumidor. Las decisiones de este calibre exigen deliberación pública.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'reflection',
        title: 'Tu posición documentada',
        subtitle: 'El ejercicio del filósofo',
        content: 'Escribe en 200 palabras tu política de decisión para el coche autónomo, indicando qué tradición ética sigues y qué excepciones admites. Luego escribe la mejor objeción contra tu propia posición. Quien no puede formular la mejor objeción a su postura, todavía no la defiende: la habita.',
        keyTakeaway: 'La madurez filosófica se mide por la calidad de las objeciones que puedes formular contra ti mismo.'
      }
    ]
  },
  {
    id: 507,
    slug: 'juicio-de-socrates',
    title: 'U5.7 · El Juicio de Sócrates Revisitado',
    subtitle: 'Libertad de expresión, verdad incómoda y responsabilidad cívica',
    shortDescription: 'Simula el tribunal más famoso de la historia: ¿fue justa la condena de Sócrates? El dilema fundacional de la democracia.',
    fullDescription: 'Atenas, 399 a.C.: Sócrates es juzgado por corromper a la juventud y no creer en los dioses de la ciudad. Condenado a muerte por un jurado ciudadano. El caso fundacional del debate sobre libertad de expresión, los límites de la democracia y el precio de la verdad incómoda.',
    ageBracket: '14-15',
    competency: 'nuance',
    iconName: 'Gavel',
    badgeTag: 'TRIBUNAL FILOSÓFICO',
    accentColor: '#14B8A6',
    xpReward: 70,
    durationMinutes: 14,
    keyTakeaways: [
      'Sócrates fue condenado por el procedimiento legal de su democracia: la legalidad no garantiza la justicia.',
      'La Apología de Platón documenta su defensa: la vida examinada, la obediencia a la verdad antes que a la multitud.',
      'El caso plantea el límite democrático: ¿puede una mayoría legítima condenar la disidencia?',
      'La libertad de expresión existe precisamente para proteger las ideas incómodas, no las cómodas.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El juicio',
        subtitle: 'Atenas, 399 a.C.',
        content: 'Sócrates, 70 años, es llevado a juicio por dos cargos: **corromper a la juventud** e **introducir divinidades nuevas**. El procedimiento era democrático: 501 ciudadanos como jurado, turnos de palabra, votación.\n\nSu defensa (la Apología de Platón) no pide piedad: explica que su misión es interrogar a la ciudad, que «una vida sin examen no merece ser vivida», y que prefiere morir diciendo la verdad a vivir adulando al jurado. El jurado lo condena por un margen estrecho. La pena: beber la cicuta.\n\nSócrates pudo exiliarse antes del juicio; eligió quedarse y acatar la sentencia de su ciudad, aunque la considerara injusta.',
        keyTakeaway: 'El procedimiento fue legal y democrático; el resultado, para la historia, una injusticia. Legalidad ≠ justicia.',
        wowFact: 'La votación de condena fue aproximadamente 280 contra 221. Platón, presente en el juicio, tenía unos 28 años. Su relato fundó la filosofía occidental.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'Los tres frentes del caso',
        subtitle: 'Lo que realmente estaba en juego',
        content: '**1. Libertad de expresión:** ¿tiene una democracia derecho a silenciar al disidente que incomoda?\n**2. Responsabilidad del intelectual:** Sócrates aceptó las consecuencias de su método; no huyó. ¿Qué debe el que habla a la ciudad que lo escucha?\n**3. Límites de la mayoría:** la democracia decide por mayoría, pero ¿hay derechos que ninguna mayoría puede votar? (Hoy los llamaríamos derechos fundamentales.)',
        diagramType: 'split',
        keyTakeaway: 'El juicio de Sócrates es el primer caso documentado de los tres grandes debates de la libertad de expresión.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: 'El tribunal de la historia',
        subtitle: 'Tu veredicto razonado',
        content: 'Eres el jurado del tribunal filosófico. La acusación sostiene que Sócrates socavaba la cohesión social enseñando a los jóvenes a cuestionarlo todo. La defensa sostiene que cuestionar es precisamente lo que mantiene sana a una sociedad.',
        keyTakeaway: 'El veredicto exige ponderar cohesión social contra libertad de examen: el dilema sigue abierto.',
        question: {
          prompt: '¿Cuál es el veredicto mejor argumentado?',
          options: [
            {
              id: 'a',
              text: 'Absolución: una sociedad que condena el examen se priva de su mecanismo de corrección. La cohesión basada en silencio es frágil; la que sobrevive a las preguntas es robusta. La libertad de expresión protege precisamente lo incómodo.',
              isNuanced: true,
              score: 100,
              explanation: 'Veredicto con la mejor tradición a favor: identificas que el examen crítico es el sistema inmune de la sociedad, y que la libertad de expresión no existe para lo cómodo. Sócrates absuelto, y el principio queda escrito. ⚖️'
            },
            {
              id: 'b',
              text: 'Condena: la estabilidad social vale más que las preguntas de un individuo.',
              isNuanced: false,
              score: 40,
              explanation: 'Es la posición histórica de la acusación y merece ser entendida: las sociedades necesitan cohesión. Pero la historia mostró el coste: la ciudad que silenció a su mejor examinador se privó de su mejor medicina. El argumento es legítimo; el veredicto, no.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'reflection',
        title: 'La pregunta socrática final',
        subtitle: 'El examen que no termina',
        content: 'Sócrates dijo que su sabiduría consistía en saber que no sabía. Termina el curso con su método: elige una certeza tuya (sobre ti, sobre el mundo, sobre lo que crees) y sométela a tres preguntas honestas: ¿cómo lo sé?, ¿qué evidencia tendría si fuera falso?, ¿estaría dispuesto a cambiar de opinión? Si respondes las tres, has hecho lo que el jurado de Atenas no supo hacer: examinar.',
        keyTakeaway: 'El pensamiento crítico no es un temario: es el hábito de examinarse a uno mismo.'
      }
    ]
  }
];
