import { CriterioModule } from '../../types';

/**
 * TRAMO 3 · 10-11 AÑOS (5.º y 6.º de Primaria)
 * Arquetipo: "El Constructor de Maestría" — nivel avanzado.
 * SSOT curricular: docs/criterio/00_MASTER_PLAN_CURRICULAR.md (U3.1 – U3.7)
 * Temas: falacias informales, lectura lateral SHEG, clickbait, sesgo de confirmación, AER, dilemas éticos.
 */
export const TRAMO_3_MODULES: CriterioModule[] = [
  {
    id: 301,
    slug: 'falacias-ataque-personal',
    title: 'U3.1 · Falacias I: El Ataque Personal',
    subtitle: 'Ad Hominem y el Hombre de Paja',
    shortDescription: 'Aprende a detectar cuando alguien ataca a la persona en vez de responder al argumento.',
    fullDescription: 'En un debate, lo justo es responder a las IDEAS. Pero mucha gente ataca a la PERSONA («tú no sabes nada») o distorsiona lo que dijiste («o sea, que quieres prohibir todo»). Esas trampas tienen nombre: ad hominem y hombre de paja.',
    ageBracket: '10-11',
    competency: 'nuance',
    iconName: 'Gavel',
    badgeTag: 'CAZA-FALACIAS',
    accentColor: '#F43F5E',
    xpReward: 40,
    durationMinutes: 10,
    keyTakeaways: [
      'AD HOMINEM: atacar a la persona en vez de responder a su argumento.',
      'HOMBRE DE PAJA: distorsionar lo que dijo el otro para atacarlo más fácil.',
      'Cuando detectas una falacia, vuelve al argumento original con calma.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El ataque que esquiva el argumento',
        subtitle: 'Ad hominem: contra la persona',
        content: 'María dice en clase: *«Creo que deberíamos reciclar más en el cole, cada día tiramos kilos de papel»*.\n\nY alguien responde: *«Tú qué vas a decir, si suspendes mates»*.\n\n¿Qué tiene que ver suspender mates con el reciclaje? ¡NADA! Ese es un **ataque ad hominem** (en latín, «contra la persona»): en vez de responder a la idea, atacan a quien la dice para que parezca que su idea no vale.',
        keyTakeaway: 'El valor de una idea no depende de quién la diga. Atacar a la persona es esquivar el debate.',
        wowFact: '«Ad hominem» es latín, el idioma de los antiguos romanos. ¡Los filósofos llevan 2.000 años poniéndole nombre a estas trampas!'
      },
      {
        id: 2,
        type: 'concept',
        title: 'El muñeco de paja',
        subtitle: 'Distorsionar para ganar fácil',
        content: 'Ahora mira esta otra trampa. Leo dice: *«Deberíamos tener menos deberes los fines de semana»*.\n\nY le responden: *«¡O sea, que quieres que no estudiemos NUNCA y seamos unos ignorantes!»*.\n\n¿Leo dijo eso? ¡No! Han construido un **hombre de paja**: una versión exagerada y falsa de su idea, porque es más fácil de atacar que la idea real. Es como pelear contra un muñeco de paja en vez de contra el rival de verdad.',
        keyTakeaway: 'Si alguien responde a algo que tú NO dijiste, te han montado un hombre de paja.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: '¡Detecta la trampa!',
        subtitle: 'El debate del recreo',
        content: 'En el debate sobre el menú del comedor, Ana propone: *«Podríamos tener fruta de postre tres días»*. Bruno responde: *«Ana dice que comamos solo fruta como conejos, ¡y además ella ni se come la ensalada!»*.',
        keyTakeaway: 'Bruno mezcla las dos falacias: distorsiona la propuesta Y ataca a Ana.',
        question: {
          prompt: '¿Qué trampas está usando Bruno?',
          options: [
            {
              id: 'a',
              text: '🎯 Las dos: hombre de paja («solo fruta como conejos», que Ana no dijo) y ad hominem (atacarla por no comerse la ensalada).',
              isNuanced: true,
              score: 100,
              explanation: '¡Ojo de caza-falacias! Bruno no ha respondido a la propuesta real ni una sola vez. La respuesta correcta sería debatir si tres días de fruta es buena idea. 🏆'
            },
            {
              id: 'b',
              text: '🤔 Ninguna: Bruno solo está dando su opinión.',
              isNuanced: false,
              score: 20,
              explanation: 'Fíjate bien: ¿Ana dijo «solo fruta»? No. ¿Lo de la ensalada responde a la propuesta? Tampoco. Las dos son trampas clásicas de debate.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'El contraataque elegante',
        subtitle: 'Vuelve al argumento',
        content: 'Cuando te ataquen con una falacia, no te enfades ni ataques tú también. Usa la fórmula elegante: *«Eso que dices de mí no responde a mi propuesta. Mi propuesta es X. ¿Qué opinas de X?»*. Así devuelves el debate al terreno de las ideas, que es donde se gana de verdad.',
        keyTakeaway: 'La mejor respuesta a una falacia es volver al argumento original con calma.'
      }
    ]
  },
  {
    id: 302,
    slug: 'falacias-mayoria-autoridad',
    title: 'U3.2 · Falacias II: La Mayoría y la Autoridad',
    subtitle: '«Todo el mundo lo hace» no lo hace correcto',
    shortDescription: 'Descubre por qué la cantidad de gente que cree algo no lo convierte en verdad.',
    fullDescription: '«Todo el mundo lo hace», «lo dice un famoso con millones de seguidores»... Durante siglos, TODO EL MUNDO creyó que la Tierra era plana. La verdad no se vota: se demuestra con pruebas.',
    ageBracket: '10-11',
    competency: 'nuance',
    iconName: 'Users',
    badgeTag: 'PENSADOR INDEPENDIENTE',
    accentColor: '#8B5CF6',
    xpReward: 40,
    durationMinutes: 10,
    keyTakeaways: [
      'AD POPULUM: «lo cree mucha gente» no lo convierte en verdad.',
      'AD VERECUNDIAM: un famoso o autoridad solo es fiable EN su campo.',
      'La verdad se demuestra con pruebas, no con votos ni con fama.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Cuando todo el mundo se equivocaba',
        subtitle: 'Ad populum: la apelación a la mayoría',
        content: 'Hace 500 años, casi TODO EL MUNDO estaba seguro de que el Sol giraba alrededor de la Tierra. Los que decían lo contrario eran perseguidos.\n\n¿Tenía razón la mayoría? ¡No! La Tierra gira alrededor del Sol, lo vote quien lo vote. 🌍☀️\n\nA esta trampa se la llama **ad populum** («al pueblo»): creer que algo es verdad solo porque mucha gente lo cree. Las modas, los bulos virales y los rumores de patio funcionan así.',
        keyTakeaway: 'Millones de personas pueden estar equivocadas a la vez. La verdad no se vota.',
        wowFact: 'Galileo defendió que la Tierra se mueve alrededor del Sol cuando casi nadie lo creía. Tardaron 359 años en darle oficialmente la razón. ¡La paciencia de la ciencia!'
      },
      {
        id: 2,
        type: 'concept',
        title: 'El famoso que opina de todo',
        subtitle: 'Ad verecundiam: la apelación a la autoridad equivocada',
        content: 'Un futbolista famoso anuncia en un vídeo: *«Esta bebida energética es lo mejor para tu salud»*. ⚽🥤\n\n¿Es experto en salud? ¡No! Es experto en fútbol. Un premio Nobel de física tampoco sabe más de nutrición que un dietista.\n\nLas autoridades son valiosas... **en su campo**. Citar a un experto fuera de su especialidad es la falacia **ad verecundiam**.',
        keyTakeaway: 'Pregunta siempre: ¿esta persona es experta EN ESTE tema concreto?'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: '¡Evalúa el argumento!',
        subtitle: 'El reto viral',
        content: 'Un influencer con 10 millones de seguidores dice: *«No hace falta estudiar para el examen, yo nunca estudié y me va genial»*. Medio grupo de clase quiere copiarle.',
        keyTakeaway: 'El éxito del influencer es en redes, no en exámenes. Y un caso no es una regla.',
        question: {
          prompt: '¿Cuál es el análisis más crítico?',
          options: [
            {
              id: 'a',
              text: '🧠 Es experto en redes, no en aprobar exámenes. Además, su caso personal no demuestra que estudiar no sirva (generalización).',
              isNuanced: true,
              score: 100,
              explanation: '¡Análisis de nivel maestro! Detectaste las dos trampas: autoridad equivocada + generalización apresurada. Tu cerebro crítico está en plena forma. 🏅'
            },
            {
              id: 'b',
              text: '📱 Si lo dice alguien con 10 millones de seguidores, algo de razón tendrá.',
              isNuanced: false,
              score: 20,
              explanation: 'Los seguidores miden popularidad, no conocimiento. Un millón de personas pueden compartir un error... y de hecho lo hacen todos los días con los bulos.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'El filtro de las tres preguntas',
        subtitle: 'Antes de creer a la multitud',
        content: 'Cuando «todo el mundo» diga algo, pasa el filtro:\n1. ¿Qué PRUEBAS hay, aparte de que lo cree mucha gente?\n2. ¿Quién lo dice es experto EN ESTE tema?\n3. ¿Ha habido épocas donde «todo el mundo» creía algo falso?\n\nSi el filtro no deja pasar nada... ya sabes qué hacer: dudar con elegancia.',
        keyTakeaway: 'Pruebas > votos > fama. Ese es el orden del pensamiento crítico.'
      }
    ]
  },
  {
    id: 303,
    slug: 'lectura-lateral-sheg',
    title: 'U3.3 · Lectura Lateral: El Método Stanford',
    subtitle: 'Sal de la página para investigarla',
    shortDescription: 'Aprende la técnica de los verificadores profesionales: abrir pestañas nuevas para investigar quién está detrás de una web.',
    fullDescription: 'Los verificadores de la Universidad de Stanford descubrieron algo sorprendente: los profesionales NO se quedan leyendo la web sospechosa. Salen de ella y abren otras pestañas para investigar quién la financia y qué reputación tiene. Eso es lectura lateral.',
    ageBracket: '10-11',
    competency: 'lateral_search',
    iconName: 'Search',
    badgeTag: 'MÉTODO STANFORD',
    accentColor: '#06B6D4',
    xpReward: 45,
    durationMinutes: 10,
    keyTakeaways: [
      'Los profesionales investigan una web DESDE FUERA, no desde dentro.',
      'Abrir 2-3 pestañas nuevas y buscar quién está detrás = lectura lateral.',
      'Una web puede parecer seria y estar financiada por alguien con intereses ocultos.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El experimento de Stanford',
        subtitle: 'Historiadores vs estudiantes',
        content: 'La Universidad de Stanford (SHEG) hizo un experimento: dio a historiadores expertos y a estudiantes universitarios la misma web sospechosa sobre un tema médico.\n\nLos estudiantes se quedaron LEYENDO la web (diseño bonito, textos serios...). Los historiadores hicieron otra cosa: en 10 segundos abrieron pestañas nuevas y buscaron *«quién financia esta web»*. ¡Los expertos acertaron y los estudiantes fueron engañados!\n\nA esa técnica la llamaron **lectura lateral**: leer «hacia los lados», saliendo de la página.',
        keyTakeaway: 'Quedarte dentro de una web sospechosa es como preguntarle al zorro si las gallinas están seguras.',
        wowFact: 'El estudio SHEG de Stanford (Wineburg y McGrew) demostró que incluso estudiantes de universidades de élite caen en webs falsas si no leen lateralmente.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'Vertical vs Lateral',
        subtitle: 'Dos formas de leer una web',
        content: 'Lectura VERTICAL (la trampa): bajar por la página, mirar su diseño, sus fotos, su sección «Sobre nosotros»... todo lo que el propio autor quiere que veas.\n\nLectura LATERAL (el método pro): salir de la pestaña y buscar en otras fuentes: quién es el autor, quién financia la web, qué dicen otros sitios fiables de ella.',
        diagramType: 'split',
        keyTakeaway: 'La reputación de una web se descubre fuera de ella, no dentro.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: '¡Aplica el método!',
        subtitle: 'La web milagrosa',
        content: 'Encuentras una web llamada «Instituto Mundial de la Salud Natural» que asegura que beber agua con sal cura el dolor de cabeza. El diseño parece muy profesional.',
        keyTakeaway: 'El diseño profesional no es una prueba: se investiga desde fuera.',
        question: {
          prompt: '¿Qué hace un lector lateral?',
          options: [
            {
              id: 'a',
              text: '🔍 Abrir pestañas nuevas y buscar: «Instituto Mundial Salud Natural quién lo financia», «agua con sal dolor de cabeza evidencia médica».',
              isNuanced: true,
              score: 100,
              explanation: '¡Método Stanford en acción! Investigar desde fuera revela si el «instituto» es real, quién lo paga y qué dice la medicina de verdad. 🎓'
            },
            {
              id: 'b',
              text: '📄 Leer a fondo la web: si tiene sección de «Sobre nosotros» y fotos de médicos, será fiable.',
              isNuanced: false,
              score: 20,
              explanation: 'Eso es lectura vertical: todo lo que ves ahí lo eligió el propio autor. Cualquiera puede poner fotos de médicos y un diseño bonito. ¡Sal de la página!'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'Tu kit de lectura lateral',
        subtitle: '3 búsquedas que lo cambian todo',
        content: 'Guarda estas tres búsquedas para siempre:\n1. *«[nombre de la web] + fiabilidad / quién la financia»*\n2. *«[noticia concreta] + verificación / bulo»*\n3. *«[autor] + experto en qué»*\n\nCon esas tres pestañas tendrás más información que el 90% de la gente que solo lee verticalmente.',
        keyTakeaway: 'Tres pestañas laterales valen más que diez minutos de lectura vertical.'
      }
    ]
  },
  {
    id: 304,
    slug: 'clickbait-imagenes-falsas',
    title: 'U3.4 · Clickbait e Imágenes Falsas',
    subtitle: 'Titulares diseñados para tu clic',
    shortDescription: 'Descubre cómo los titulares sensacionalistas y las imágenes manipuladas buscan tu atención.',
    fullDescription: '«¡NO VAS A CREER lo que pasó!» «El secreto que NO quieren que sepas». El clickbait es un cebo emocional diseñado para que hagas clic sin pensar. Y las imágenes fuera de contexto son su mejor aliado.',
    ageBracket: '10-11',
    competency: 'context',
    iconName: 'Newspaper',
    badgeTag: 'ANTI-CLICKBAIT',
    accentColor: '#F59E0B',
    xpReward: 40,
    durationMinutes: 9,
    keyTakeaways: [
      'El clickbait usa MAYÚSCULAS, misterio y emoción para que hagas clic sin pensar.',
      'Una foto real puede mentir si se usa con un contexto falso.',
      'Si un titular te pica mucho la curiosidad o te enfada, sospecha: está diseñado así.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'La anatomía del cebo',
        subtitle: 'Cómo se fabrica un clickbait',
        content: 'Los creadores de clickbait tienen una receta:\n\n🎣 **Misterio sin resolver:** «El increíble truco que...» (¿cuál? ¡Haz clic!)\n😱 **Emoción fuerte:** «INDIGNANTE», «ATERRADOR», «NO VAS A CREER»\n⏰ **Urgencia:** «ÚLTIMA HORA», «Antes de que lo borren»\n🔢 **Listas mágicas:** «7 cosas que...»\n\nEl objetivo no es informarte: es que hagas clic para ganar dinero con la publicidad. Tu atención es su negocio.',
        keyTakeaway: 'Si el titular grita, exagera o esconde la información, es un cebo, no una noticia.',
        wowFact: 'Los estudios de seguimiento ocular muestran que la gente tarda menos de 1 segundo en decidir si hace clic. ¡Por eso los cebos atacan a la emoción instantánea!'
      },
      {
        id: 2,
        type: 'concept',
        title: 'La foto que viajó en el tiempo',
        subtitle: 'Imágenes reales con mentiras nuevas',
        content: 'Una técnica favorita de la desinformación: coger una foto REAL de hace años y presentarla como si fuera de hoy.\n\nEjemplo real: cada vez que hay lluvias fuertes, reaparecen fotos de inundaciones de hace 5 años en otra ciudad, con el texto «¡MIRA CÓMO ESTÁ TODO AHORA MISMO!».\n\nLa foto es auténtica... pero la historia que cuenta es falsa. Por eso los verificadores usan búsquedas inversas de imágenes: para saber CUÁNDO y DÓNDE se publicó por primera vez.',
        keyTakeaway: 'Una imagen real + contexto falso = mentira perfecta. Comprueba fecha y lugar.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: '¿Clic o no clic?',
        subtitle: 'El titular cebo',
        content: 'Ves este titular en redes: *«¡¡ATERRADOR!! El vídeo del profesor que está ESCANDALIZANDO a todo el país. Antes de que lo CENSUREN, míralo AQUÍ»*. No hay nombre del profesor ni del colegio.',
        keyTakeaway: 'Sin datos comprobables (quién, dónde, cuándo), el cebo campa a sus anchas.',
        question: {
          prompt: '¿Cuál es tu análisis?',
          options: [
            {
              id: 'a',
              text: '🚨 Clickbait de manual: emoción fuerte, urgencia, misterio y CERO datos comprobables. No hago clic y, si acaso, busco la noticia en medios serios.',
              isNuanced: true,
              score: 100,
              explanation: '¡Análisis perfecto! Todos los ingredientes del cebo detectados. Si la noticia fuera real, tendría nombres, lugares y cobertura seria. 🎣❌'
            },
            {
              id: 'b',
              text: '👀 Hago clic rápido antes de que lo censuren.',
              isNuanced: false,
              score: 20,
              explanation: '¡Justo lo que busca el cebo! La urgencia («antes de que lo borren») es el truco para que no pienses. Además, esos enlaces suelen llevar a publicidad o malware.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'El test anti-cebo',
        subtitle: 'Tres señales de alarma',
        content: 'Antes de hacer clic, pasa el test:\n1. ¿El titular da INFORMACIÓN o solo EMOCIÓN?\n2. ¿Hay datos comprobables (quién, dónde, cuándo)?\n3. ¿La «noticia» aparece en algún medio serio?\n\nSi las tres fallan, no es una noticia: es una trampa para tu atención.',
        keyTakeaway: 'Tu atención vale dinero: no la regales a cualquier cebo.'
      }
    ]
  },
  {
    id: 305,
    slug: 'sesgo-de-confirmacion',
    title: 'U3.5 · El Sesgo de Confirmación',
    subtitle: 'Por qué solo buscas lo que te da la razón',
    shortDescription: 'Descubre el sesgo más universal: tu cerebro adora tener razón y busca pruebas a favor ignorando las contrarias.',
    fullDescription: 'Todos tenemos un sesgo favorito: el de confirmación. Cuando creemos algo, buscamos (¡y recordamos!) solo las pruebas que nos dan la razón, y las contrarias nos resbalan. Conocerlo es el primer paso para vencerlo.',
    ageBracket: '10-11',
    competency: 'pause_method',
    iconName: 'Brain',
    badgeTag: 'DOMADOR DE SESGOS',
    accentColor: '#EC4899',
    xpReward: 40,
    durationMinutes: 9,
    keyTakeaways: [
      'El sesgo de confirmación nos hace buscar solo lo que apoya lo que ya creemos.',
      'Recordamos mejor los aciertos de nuestras creencias que sus fallos.',
      'El antídoto: buscar ACTIVAMENTE la versión contraria antes de decidir.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El cerebro abogado',
        subtitle: 'Defensor de tus ideas, no juez',
        content: 'Imagina que crees que tu equipo de fútbol es el mejor. ⚽\n\nCuando gana: *«¿Ves? ¡Somos los mejores!»*\nCuando pierde: *«Bueno, el árbitro fue injusto, el césped estaba mal...»*\n\nTu cerebro se comporta como un ABOGADO que defiende a su cliente (tu creencia), no como un JUEZ imparcial. Busca pruebas a favor, excusas para las contrarias, y recuerda las victorias mucho mejor que las derrotas. Eso es el **sesgo de confirmación**, y lo tenemos TODOS.',
        keyTakeaway: 'Tu cerebro prefiere tener razón a descubrir la verdad. Por eso hay que vigilarlo.',
        wowFact: 'En los experimentos, cuando a la gente se le muestran pruebas que contradicen sus creencias, su cerebro las procesa con MENOS atención. ¡Literalmente miramos hacia otro lado!'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'El filtro invisible',
        subtitle: 'Cómo el sesgo deforma lo que ves',
        content: 'Imagina un filtro delante de tus ojos: deja pasar las noticias que te dan la razón (brillantes, grandes) y hace borrosas las que te contradicen. En redes sociales, el algoritmo añade su propio filtro y te enseña aún más de lo mismo. Resultado: una burbuja donde parece que todo el mundo piensa como tú.',
        diagramType: 'funnel',
        keyTakeaway: 'Entre tu sesgo y el algoritmo, tu feed puede convertirse en un espejo, no en una ventana.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: '¡Rompe tu propio sesgo!',
        subtitle: 'El trabajo de ciencias',
        content: 'Estás convencido de que un compañero te tiene manía. Todo lo que hace te lo confirma: «mira, no me saludó», «se rió cuando fallé». ¿Qué haría un domador de sesgos?',
        keyTakeaway: 'Buscar activamente pruebas EN CONTRA de tu propia creencia.',
        question: {
          prompt: '¿Cuál es el movimiento anti-sesgo?',
          options: [
            {
              id: 'a',
              text: '🔍 Buscar pruebas en contra: ¿me saludó otros días? ¿se rió CONMIGO alguna vez? ¿pudo no verme? Y si puedo, preguntárselo con calma.',
              isNuanced: true,
              score: 100,
              explanation: '¡Movimiento maestro! Buscar activamente la versión contraria es el antídoto del sesgo de confirmación. Muchas «manías» resultan ser malentendidos. 🤝'
            },
            {
              id: 'b',
              text: '😤 Contárselo a mis amigos para que confirmen que me tiene manía.',
              isNuanced: false,
              score: 30,
              explanation: '¡Cuidado! Tus amigos te quieren y probablemente te dirán lo que quieres oír. Eso es buscar confirmación, no verdad. Mejor buscar pruebas en contra.'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'La pregunta incómoda',
        subtitle: 'El hábito de los pensadores de élite',
        content: 'Los mejores pensadores se hacen una pregunta incómoda antes de decidir: *«¿Y si estoy equivocado? ¿Qué pruebas habría si la cosa fuera al revés?»*. Duele un poquito, pero es como estirar antes del deporte: te hace más fuerte y más flexible a la vez.',
        keyTakeaway: '«¿Y si estoy equivocado?» — la pregunta que vence al sesgo de confirmación.'
      }
    ]
  },
  {
    id: 306,
    slug: 'estructura-argumento-aer',
    title: 'U3.6 · El Argumento Perfecto: AER',
    subtitle: 'Afirmación, Evidencia, Razonamiento',
    shortDescription: 'Aprende a construir defensas sólidas como un abogado: afirma, prueba y conecta.',
    fullDescription: 'Un buen argumento no es gritar más fuerte. Tiene tres piezas: una AFIRMACIÓN clara, una EVIDENCIA que la sostiene y un RAZONAMIENTO que las conecta. Con la estructura AER, tus ideas serán difíciles de tumbar.',
    ageBracket: '10-11',
    competency: 'nuance',
    iconName: 'Scale',
    badgeTag: 'CONSTRUCTOR DE ARGUMENTOS',
    accentColor: '#10B981',
    xpReward: 40,
    durationMinutes: 9,
    keyTakeaways: [
      'A = AFIRMACIÓN: lo que defiendes, en una frase clara.',
      'E = EVIDENCIA: datos, ejemplos o hechos que la sostienen.',
      'R = RAZONAMIENTO: la explicación de por qué la evidencia apoya la afirmación.',
      'Un argumento sin evidencia es solo una opinión con volumen.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Las tres piezas del argumento',
        subtitle: 'AER en acción',
        content: 'Imagina que quieres convencer a tu clase de crear una biblioteca de intercambio de libros. 📚\n\n**A (Afirmación):** «Deberíamos crear una biblioteca de intercambio en clase».\n**E (Evidencia):** «El curso pasado, el 60% de los alumnos dijo que tenía libros leídos en casa sin usar, y los libros nuevos cuestan de media 15€».\n**R (Razonamiento):** «Si intercambiamos, cada alumno puede leer más sin gastar dinero y damos segunda vida a los libros».\n\n¿Ves la diferencia con decir simplemente «yo quiero una biblioteca»? El AER convierte un deseo en un argumento.',
        keyTakeaway: 'Afirmación + Evidencia + Razonamiento = argumento difícil de tumbar.',
        wowFact: 'Los abogados ensayan sus argumentos con la estructura AER antes de los juicios. ¡Y los jueces deciden basándose en evidencias, no en gritos!'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: '¡Completa el AER!',
        subtitle: 'El debate del recreo largo',
        content: 'Tu amiga defiende: «El recreo debería durar 15 minutos más». Su evidencia: «Un estudio dice que los alumnos concentran mejor después de más descanso». ¿Qué pieza falta?',
        keyTakeaway: 'Sin razonamiento, la evidencia queda suelta: hay que conectarla.',
        question: {
          prompt: '¿Qué falta para completar el argumento?',
          options: [
            {
              id: 'a',
              text: '🔗 El RAZONAMIENTO: explicar POR QUÉ esa evidencia apoya la idea («si concentramos mejor con más descanso, 15 minutos extra mejorarían las clases de la tarde»).',
              isNuanced: true,
              score: 100,
              explanation: '¡Exacto! El razonamiento es el puente entre la evidencia y la afirmación. Sin puente, cada pieza queda en su isla. 🌉'
            },
            {
              id: 'b',
              text: '📢 Gritarlo más fuerte para que el profe se convenza.',
              isNuanced: false,
              score: 10,
              explanation: 'El volumen no sustituye al razonamiento. Un argumento susurrado con AER vale más que un grito sin estructura. 😄'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'reflection',
        title: 'Tu primer argumento AER',
        subtitle: 'Misión de constructor',
        content: 'Elige algo que te gustaría cambiar (en casa, en clase, en tu equipo deportivo) y construye tu AER completo en tres frases. Luego, preséntaselo a alguien con calma. Aunque no te digan que sí, habrás argumentado como un abogado. ¡Y eso se nota!',
        keyTakeaway: 'Quien argumenta con AER no necesita gritar: su estructura habla por él.'
      }
    ]
  },
  {
    id: 307,
    slug: 'dilemas-eticos-escuela',
    title: 'U3.7 · Dilemas Éticos: La Trampa del Examen',
    subtitle: 'Justicia vs Lealtad',
    shortDescription: 'Enfréntate a un dilema real: ¿denunciarías una trampa en un examen aunque fuera tu mejor amigo?',
    fullDescription: 'Los dilemas éticos no tienen respuesta fácil: dos valores importantes chocan entre sí. En este, la justicia choca con la lealtad. Pensar en dilemas entrena tu brújula moral para cuando lleguen los momentos difíciles de verdad.',
    ageBracket: '10-11',
    competency: 'nuance',
    iconName: 'Heart',
    badgeTag: 'BRÚJULA MORAL',
    accentColor: '#14B8A6',
    xpReward: 40,
    durationMinutes: 10,
    keyTakeaways: [
      'Un dilema ético enfrenta dos valores importantes: no hay respuesta «obvia».',
      'Pensar las consecuencias para TODOS ayuda a decidir mejor.',
      'La lealtad a un amigo no puede obligarte a ser injusto con los demás.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El dilema del examen',
        subtitle: 'Cuando dos valores chocan',
        content: 'Situación real: en el examen de mates, ves que tu MEJOR AMIGO está copiando con una chuleta. 📝\n\nSi no dices nada: tu amigo aprueba con trampa, pero los demás (que estudiaron de verdad) compiten en desventaja. Y si el profe lo pilla, puede suspender a toda la clase por desconfianza.\n\nSi lo dices: se hace justicia, pero tu amigo puede sentirse traicionado.\n\nJusticia contra lealtad. Dos valores buenos, en choque. Eso es un **dilema ético**: no hay respuesta perfecta, pero sí respuestas más pensadas que otras.',
        keyTakeaway: 'En un dilema ético, lo importante no es acertar a la primera: es pensar con todas las consecuencias.',
        wowFact: 'Los filósofos llevan 2.500 años debatiendo dilemas. Platón ya escribía sobre ellos en la antigua Grecia. ¡Entrenar la brújula moral es un deporte milenario!'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: '¿Qué harías tú?',
        subtitle: 'El momento de la verdad',
        content: 'Volvamos al examen. Tienes varias opciones posibles. Piensa en las consecuencias de cada una para TODOS: tu amigo, tus compañeros, tu profe y tú.',
        keyTakeaway: 'La mejor opción suele proteger la justicia sin destruir la amistad: hablar primero con el amigo.',
        question: {
          prompt: '¿Cuál es la opción más pensada?',
          options: [
            {
              id: 'a',
              text: '🤝 Hablar con mi amigo en privado: decirle que lo vi, que copie no es justo para los demás y animarle a confesar o a no repetirlo. Si sigue, entonces valorar contarlo.',
              isNuanced: true,
              score: 100,
              explanation: '¡Respuesta de brújula moral afinada! Proteges la justicia Y cuidas la amistad dándole la oportunidad de hacer lo correcto. Los dilemas se resuelven así: pensando en todos. 💛⚖️'
            },
            {
              id: 'b',
              text: '🙊 Callarme: es mi mejor amigo y la lealtad es lo primero.',
              isNuanced: false,
              score: 40,
              explanation: 'La lealtad es un valor precioso... pero no puede convertirte en cómplice de una injusticia contra los demás. La verdadera amistad también es decir las cosas difíciles.'
            },
            {
              id: 'c',
              text: '📢 Levantar la mano y denunciarlo delante de toda la clase.',
              isNuanced: false,
              score: 50,
              explanation: 'Defiendes la justicia, sí, pero humillar a tu amigo en público puede ser innecesario. A veces hay caminos que logran lo mismo con menos daño: hablar primero en privado.'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'reflection',
        title: 'Tu brújula moral',
        subtitle: 'El entrenamiento continúa',
        content: 'Los dilemas éticos son como el gimnasio de la moral: cada uno que piensas te hace más fuerte para los reales. Esta semana, cuando veas un conflicto (en el patio, en una serie, en las noticias), pregúntate: *¿Qué valores están chocando? ¿Qué consecuencias tiene cada opción para cada persona?*',
        keyTakeaway: 'Pensar dilemas no te da respuestas perfectas: te da una brújula afinada.'
      }
    ]
  }
];
