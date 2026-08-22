import { CriterioModule } from '../../types';

/**
 * TRAMO 2 · 8-9 AÑOS (3.º y 4.º de Primaria)
 * Arquetipo: "El Constructor de Maestría" (docs/gamificacion/02_PSICOLOGIA_DESARROLLO_3_FRANJAS_EDAD.md)
 * Reglas de diseño: feedback rápido estructurado, sesiones 15-25 min,
 * error = pista socrática guiada (nunca castigo), economía de cristales.
 * SSOT curricular: docs/criterio/00_MASTER_PLAN_CURRICULAR.md (U2.1 – U2.7)
 */
export const TRAMO_2_MODULES: CriterioModule[] = [
  {
    id: 201,
    slug: 'quien-lo-dice',
    title: 'U2.1 · ¿Quién lo Dice? Autoridad y Fuentes',
    subtitle: 'Testigo, experto o loro repetidor',
    shortDescription: 'Aprende a clasificar quién te cuenta algo: ¿lo vio, lo estudió o solo lo repite?',
    fullDescription: 'No todas las personas que afirman algo saben lo mismo sobre el tema. Un dentista sabe de dientes, un testigo vio el accidente, y un loro repetidor solo cuenta lo que oyó por ahí. ¡Aprende a detectarlos!',
    ageBracket: '8-9',
    competency: 'sources',
    iconName: 'Users',
    badgeTag: 'CAZA-FUENTES',
    accentColor: '#F59E0B',
    xpReward: 30,
    durationMinutes: 8,
    keyTakeaways: [
      'Un TESTIGO DIRECTO vio el hecho con sus propios ojos.',
      'Un EXPERTO estudió el tema durante años (médicos, científicos, profesores).',
      'Un REPETIDOR solo cuenta lo que oyó: su palabra vale menos.',
      'Pregunta siempre: «¿Tú lo viste, lo estudiaste o te lo contaron?»'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'Los tres tipos de fuentes',
        subtitle: 'Testigo, experto y repetidor',
        content: 'Imagina que alguien dice: *«¡El nuevo videojuego es el mejor del año!»*\n\n👀 **Testigo directo:** quien lo jugó 20 horas y puede contarte por qué.\n🎓 **Experto:** un periodista de videojuegos que probó 50 juegos este año y los compara.\n🦜 **Repetidor:** quien solo escuchó el rumor en el patio y lo repite sin haber jugado.\n\nLos tres pueden hablar, ¡pero su palabra no pesa lo mismo!',
        keyTakeaway: 'La misma frase vale más o menos según quién la diga y por qué lo sabe.',
        wowFact: 'Los periodistas profesionales siempre citan a sus fuentes: escriben «según el médico...» o «según el testigo...» para que tú sepas quién habla.'
      },
      {
        id: 2,
        type: 'interactive_diagram',
        title: 'La Pirámide de la Autoridad',
        subtitle: '¿Quién sabe más?',
        content: 'En la base están los repetidores (muchos, pero con poca información fiable). En el medio, los testigos directos. En la cima, los expertos que estudiaron el tema. Cuanto más arriba, más sólida es la fuente.',
        diagramType: 'scale',
        keyTakeaway: 'Cuanto más cerca esté la fuente del hecho o del estudio, más fiable es.'
      },
      {
        id: 3,
        type: 'socratic_question',
        title: '¡Clasifica la fuente!',
        subtitle: 'El consejo del dolor de barriga',
        content: 'Te duele la barriga. Tres personas te dan un consejo:\n1. Tu abuela: *«Tómate una manzanilla, a mí me funciona»*.\n2. Un vídeo de internet: *«Bebe refresco con sal, cura todo»*.\n3. Tu pediatra: *«Vamos a ver qué te pasa antes de tomar nada»*.',
        keyTakeaway: 'El experto estudia el tema; el repetidor de internet ni siquiera sabe quién eres.',
        question: {
          prompt: '¿A quién haces caso?',
          options: [
            {
              id: 'a',
              text: '🩺 Al pediatra: es el experto que estudió medicina y te conoce.',
              isNuanced: true,
              score: 100,
              explanation: '¡Exacto! Para temas de salud, el experto es el médico. La abuela tiene cariño y experiencia, y el vídeo de internet... ¡ni sabe quién eres! 🎓'
            },
            {
              id: 'b',
              text: '📱 Al vídeo de internet: tiene un millón de visitas.',
              isNuanced: false,
              score: 20,
              explanation: 'Un millón de visitas no convierten a nadie en médico. Los repetidores pueden tener mucha audiencia y cero conocimiento. ¡Cuidado con los remedios mágicos!'
            },
            {
              id: 'c',
              text: '👵 Solo a la abuela, porque es familia.',
              isNuanced: false,
              score: 50,
              explanation: 'La abuela te quiere y su consejo viene del cariño, ¡eso vale mucho! Pero para la salud, lo mejor es combinar: cariño de abuela + ciencia del médico. 💛🩺'
            }
          ]
        }
      },
      {
        id: 4,
        type: 'evidence_reveal',
        title: 'La pregunta del caza-fuentes',
        subtitle: 'Tu herramienta secreta',
        content: 'Cada vez que alguien te cuente algo importante, clasifícalo en tu cabeza: ¿lo VIÓ 👀, lo ESTUDIÓ 🎓 o se lo CONTARON 🦜? Esa simple pregunta te convierte en un caza-fuentes de élite.',
        keyTakeaway: '«¿Tú lo viste, lo estudiaste o te lo contaron?» — la pregunta que revela la fuente.'
      }
    ]
  },
  {
    id: 202,
    slug: 'generalizacion-apresurada',
    title: 'U2.2 · La Trampa de la Generalización',
    subtitle: '«Un perro me ladró, todos son malos»',
    shortDescription: 'Descubre por qué juzgar a todos por culpa de uno es una trampa mental.',
    fullDescription: 'Cuando algo malo nos pasa UNA vez, nuestro cerebro quiere creer que pasará SIEMPRE. «Un perro me ladró, todos los perros son malos». ¡Pero eso es una trampa! Los contraejemplos la desmontan.',
    ageBracket: '8-9',
    competency: 'nuance',
    iconName: 'Puzzle',
    badgeTag: 'DESMONTA-TRAMPAS',
    accentColor: '#3B82F6',
    xpReward: 30,
    durationMinutes: 8,
    keyTakeaways: [
      'Un solo caso NO demuestra cómo son TODOS.',
      'Los contraejemplos (casos que contradicen) desmontan las generalizaciones.',
      'Palabras como «todos», «siempre», «nunca» suelen esconder trampas.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El caso del perro que ladró',
        subtitle: 'De UNO a TODOS... demasiado rápido',
        content: 'A Leo le ladró un perro el lunes. El martes dijo: *«TODOS los perros son malos y peligrosos»*.\n\nPero espera: la perrita de su vecina es cariñosa, el perro guía del señor ciego es un héroe, y su primo tiene un labrador que le deja dormir encima. 🐕💛\n\nLeo cayó en la trampa de la **generalización apresurada**: juzgar a todos por culpa de uno.',
        keyTakeaway: 'Un caso malo no convierte a todos en malos. ¡Busca contraejemplos!',
        wowFact: 'Los científicos necesitan estudiar MUCHOS casos antes de decir «esto funciona así». A uno solo se le llama... anécdota.'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: '¡Desmonta la trampa!',
        subtitle: 'El partido perdido',
        content: 'Tu equipo perdió el sábado y un compañero dice: *«NUNCA vamos a ganar, somos los PEORES del torneo»*. ¿Qué le respondes?',
        keyTakeaway: 'Un partido perdido no borra los que sí ganasteis.',
        question: {
          prompt: '¿Cuál es la mejor respuesta?',
          options: [
            {
              id: 'a',
              text: '🔍 «¿Nunca? ¿Y los tres partidos que ganamos el mes pasado?»',
              isNuanced: true,
              score: 100,
              explanation: '¡Contraejemplo perfecto! Recordar los casos que contradicen desmonta la trampa. Un mal día no define a un equipo. 🏆'
            },
            {
              id: 'b',
              text: '😞 «Tienes razón, somos malísimos».',
              isNuanced: false,
              score: 20,
              explanation: '¡Ojo! Si aceptas la generalización sin comprobar, la trampa gana. Un partido perdido es solo... un partido perdido.'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'evidence_reveal',
        title: 'El radar de palabras trampa',
        subtitle: 'Todos, siempre, nunca',
        content: 'Cuando escuches «TODOS son...», «SIEMPRE pasa...», «NUNCA se puede...», enciende tu radar 🚨. Casi siempre hay contraejemplos. Pregunta: *«¿De verdad todos? ¿Ni uno solo?»*. Verás cómo la frase exagerada se desinfla.',
        keyTakeaway: 'Las palabras absolutas (todos/siempre/nunca) son la señal de una generalización.'
      }
    ]
  },
  {
    id: 203,
    slug: 'causa-vs-coincidencia',
    title: 'U2.3 · Causa vs Coincidencia',
    subtitle: 'Los calcetines rojos no dan notas',
    shortDescription: 'Aprende a distinguir lo que DE VERDAD causa algo de lo que solo pasó a la vez.',
    fullDescription: '«Llevaba calcetines rojos y saqué un 10». ¿Los calcetines causaron la nota? ¡No! Pasaron a la vez, pero una cosa no causó la otra. Distinguir causa de coincidencia es un superpoder científico.',
    ageBracket: '8-9',
    competency: 'nuance',
    iconName: 'GitMerge',
    badgeTag: 'DETECTIVE CAUSAL',
    accentColor: '#10B981',
    xpReward: 30,
    durationMinutes: 8,
    keyTakeaways: [
      'Que dos cosas pasen a la vez NO significa que una cause la otra.',
      'Una causa real explica POR QUÉ ocurre el efecto.',
      'Las supersticiones nacen de confundir coincidencias con causas.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El misterio de los calcetines rojos',
        subtitle: '¿Magia o casualidad?',
        content: 'Marta llevó calcetines rojos el día del examen y sacó un 10. Ahora cree que los calcetines dan suerte y no se los quita ni para dormir. 🧦✨\n\nPero pensemos: ¿los calcetines saben matemáticas? ¿Le metieron las respuestas en la cabeza? ¡No! Marta sacó el 10 porque **estudió tres días**. Los calcetines solo estaban ahí. Eso es una **coincidencia**, no una causa.',
        keyTakeaway: 'La causa real explica el PORQUÉ. Si no hay explicación lógica, es coincidencia.',
        wowFact: 'Los helados y los ahogamientos en la playa aumentan a la vez en verano. ¿Los helados causan ahogamientos? ¡No! Ambos suben porque hace calor. ☀️'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: '¿Causa o coincidencia?',
        subtitle: 'El paraguas y la lluvia',
        content: 'Cada vez que Ana lleva paraguas, llueve. Ana dice: *«Mi paraguas atrae la lluvia»*. ¿Qué piensas tú?',
        keyTakeaway: 'Ana lleva paraguas PORQUE el parte del tiempo anuncia lluvia: la causa está al revés.',
        question: {
          prompt: '¿Cuál es la explicación real?',
          options: [
            {
              id: 'a',
              text: '🌧️ Ana mira el parte del tiempo: si anuncian lluvia, coge el paraguas. La causa es el pronóstico, no el paraguas.',
              isNuanced: true,
              score: 100,
              explanation: '¡Brillante! Has encontrado la causa real. El paraguas no atrae nubes: Ana lo coge porque sabe que va a llover. 🕵️‍♀️'
            },
            {
              id: 'b',
              text: '☂️ Es verdad, su paraguas debe tener poderes mágicos.',
              isNuanced: false,
              score: 20,
              explanation: '¡Jaja, ojalá los paraguas tuvieran poderes! Pero piensa: ¿cómo iba un paraguas a mover las nubes? Busca siempre la explicación lógica.'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'evidence_reveal',
        title: 'La prueba del porqué',
        subtitle: 'El test definitivo',
        content: 'Para saber si algo es causa de verdad, hazte esta pregunta: *«¿Puede EXPLICAR por qué lo causa?»*. Estudiar explica el 10. Los calcetines rojos... no explican nada. Si no hay explicación lógica, es coincidencia o superstición.',
        keyTakeaway: 'Causa real = tiene una explicación lógica de por qué ocurre.'
      }
    ]
  },
  {
    id: 204,
    slug: 'espejo-emociones-publicidad',
    title: 'U2.4 · El Espejo de las Emociones',
    subtitle: 'Cómo te venden sin que te des cuenta',
    shortDescription: 'Descubre los trucos de la publicidad: colores, música y sonrisas para que compres.',
    fullDescription: 'Los anuncios de juguetes y golosinas no solo te enseñan el producto: usan música alegre, colores brillantes y niños sonriendo para que tu corazón diga «¡lo quiero!» antes de que tu cabeza piense.',
    ageBracket: '8-9',
    competency: 'pause_method',
    iconName: 'Camera',
    badgeTag: 'ANTI-TRUCOS PUBLICITARIOS',
    accentColor: '#EC4899',
    xpReward: 30,
    durationMinutes: 8,
    keyTakeaways: [
      'La publicidad usa emociones (alegría, sorpresa) para que compres sin pensar.',
      'El anuncio muestra el juguete en su MEJOR momento, no el día normal.',
      'Preguntar «¿qué me hace sentir este anuncio?» te da el control.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El laboratorio de anuncios',
        subtitle: 'Los trucos invisibles',
        content: 'Mira un anuncio de cereales: 🥣✨\n\n🎵 Música súper alegre.\n🌈 Colores brillantes.\n😄 Niños riendo mientras desayunan.\n🎁 Un regalo dentro de la caja.\n\n¿Te has fijado? Casi no te han contado cómo saben los cereales. Te han hecho SENTIR alegría para que digas «¡mamá, cómpramelos!». Eso es vender con emociones.',
        keyTakeaway: 'Si un anuncio te hace sentir algo muy fuerte, está usando su truco favorito.',
        wowFact: 'Las empresas gastan millones en estudiar qué colores y músicas dan más ganas de comprar. ¡El rojo y el amarillo son los reyes de la comida rápida!'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: '¡Detecta el truco!',
        subtitle: 'El juguete volador',
        content: 'En el anuncio, un dron de juguete hace piruetas increíbles con música épica. Cuando tu amigo lo compra, apenas vuela dos metros y se cae. ¿Qué pasó?',
        keyTakeaway: 'El anuncio enseña el mejor momento (a veces con trucos de cámara), no la realidad.',
        question: {
          prompt: '¿Por qué el juguete real no era como el del anuncio?',
          options: [
            {
              id: 'a',
              text: '🎬 El anuncio muestra el MEJOR momento, con música y quizá trucos de cámara. La realidad es más normal.',
              isNuanced: true,
              score: 100,
              explanation: '¡Exacto! Los anuncios son como un tráiler de película: enseñan lo mejor de lo mejor. Por eso conviene leer opiniones de gente que ya lo compró. 🛒'
            },
            {
              id: 'b',
              text: '😡 La tienda le vendió uno falso a tu amigo.',
              isNuanced: false,
              score: 30,
              explanation: 'Podría pasar, pero es más raro. Lo normal es que el anuncio simplemente... exagera con sus trucos. ¡Por eso hay que verlo con ojos de detective!'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'reflection',
        title: 'Tu escudo anti-trucos',
        subtitle: 'Misión de esta semana',
        content: 'Esta semana, cuando veas un anuncio (en la tele, en un juego o en internet), hazte dos preguntas: 1) *¿Qué me hace sentir?* 2) *¿Qué me cuenta del producto de verdad?* Si el anuncio solo te hace sentir y no te cuenta nada... ya sabes qué está pasando. 😎',
        keyTakeaway: 'Nombrar la emoción que te provoca un anuncio rompe su hechizo.'
      }
    ]
  },
  {
    id: 205,
    slug: 'si-entonces',
    title: 'U2.5 · El Juego del Si-Entonces',
    subtitle: 'Tu primer razonamiento lógico',
    shortDescription: 'Aprende a razonar como un detective con la regla del «si pasa esto, entonces pasa aquello».',
    fullDescription: '«Si llueve, la calle se moja. La calle está seca... ¡entonces no ha llovido!» Este juego mental se llama razonamiento condicional, ¡y es la base de la lógica y de la programación!',
    ageBracket: '8-9',
    competency: 'nuance',
    iconName: 'Lightbulb',
    badgeTag: 'CEREBRO LÓGICO',
    accentColor: '#EAB308',
    xpReward: 35,
    durationMinutes: 8,
    keyTakeaways: [
      'Un SI-ENTONES conecta dos cosas: si ocurre la primera, ocurre la segunda.',
      'Si la segunda NO ocurrió, la primera tampoco (¡razonamiento inverso!).',
      'Los detectives y los programadores usan este truco todos los días.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'La máquina del si-entonces',
        subtitle: 'Razonar hacia adelante y hacia atrás',
        content: 'Imagina una máquina con una regla: **SI llueve → ENTONCES la calle se moja**. 🌧️➡️💦\n\nHacia adelante: está lloviendo → la calle estará mojada. ✅\n\nHacia atrás (¡el truco detective!): la calle está SECA → entonces NO ha llovido. ✅\n\nEste razonamiento hacia atrás lo usan los detectives para descartar sospechas... ¡y los ordenadores para funcionar!',
        keyTakeaway: 'Si el resultado no ocurrió, la causa tampoco pudo ocurrir.',
        wowFact: 'Los videojuegos están llenos de si-entonces: SI pulsas saltar, ENTONCES el personaje salta. ¡Programar es encadenar si-entonces!'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: '¡Razona hacia atrás!',
        subtitle: 'El misterio de la merienda',
        content: 'Regla de casa: **SI viene la abuela, ENTONCES hay tarta de manzana**. 🥧 Hoy llegas y NO hay tarta. ¿Qué puedes deducir?',
        keyTakeaway: 'Sin tarta → la abuela no vino (si la regla siempre se cumple).',
        question: {
          prompt: '¿Qué deduces como detective?',
          options: [
            {
              id: 'a',
              text: '🕵️ La abuela no ha venido hoy (si viniera, habría tarta).',
              isNuanced: true,
              score: 100,
              explanation: '¡Razonamiento inverso perfecto! Sin resultado (tarta), no hubo causa (abuela). Sherlock Holmes estaría orgulloso. 🔍'
            },
            {
              id: 'b',
              text: '🤷 No se puede saber nada.',
              isNuanced: false,
              score: 40,
              explanation: '¡Sí se puede! Si la regla siempre se cumple, la ausencia de tarta nos dice algo. Prueba el razonamiento hacia atrás: sin efecto, no hay causa.'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'evidence_reveal',
        title: '¡Cuidado con el truco inverso!',
        subtitle: 'La trampa del razonamiento mal hecho',
        content: 'Ojo: si la calle está mojada... ¿ha llovido seguro? ¡No necesariamente! Alguien pudo regar con una manguera. 🚿 El si-entonces funciona hacia atrás para NEGAR (sin tarta → sin abuela), pero el resultado puede tener varias causas. ¡Un buen detective comprueba todas!',
        keyTakeaway: 'Un efecto puede tener varias causas: no te quedes con la primera.'
      }
    ]
  },
  {
    id: 206,
    slug: 'cambiar-de-opinion',
    title: 'U2.6 · El Desafío de Cambiar de Opinión',
    subtitle: 'La valentía de decir «me equivoqué»',
    shortDescription: 'Descubre por qué cambiar de opinión ante una prueba nueva es de sabios, no de débiles.',
    fullDescription: 'A nadie le gusta equivocarse. Pero los mejores científicos del mundo cambian de opinión cuando aparece una prueba nueva. ¡Decir «me equivoqué» es una de las cosas más valientes e inteligentes que existen!',
    ageBracket: '8-9',
    competency: 'nuance',
    iconName: 'Heart',
    badgeTag: 'VALENTÍA CIENTÍFICA',
    accentColor: '#14B8A6',
    xpReward: 30,
    durationMinutes: 7,
    keyTakeaways: [
      'Cambiar de opinión ante una prueba nueva es de sabios.',
      'Los científicos cambian de idea constantemente: así avanza la ciencia.',
      '«Me equivoqué» son dos palabras que te hacen más fuerte, no más débil.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El científico que cambió de idea',
        subtitle: 'La historia de Barry Marshall',
        content: 'Durante 100 años, TODOS los médicos creían que las úlceras de estómago las causaba el estrés. Un doctor llamado Barry Marshall descubrió que era una bacteria. 🦠\n\nNadie le creyó. ¡Se rió todo el mundo! Pero él tenía pruebas. Siguió investigando y en 2005 ganó el Premio Nobel. Los demás médicos tuvieron que hacer algo muy difícil: cambiar de opinión.',
        keyTakeaway: 'La ciencia avanza cuando alguien tiene la valentía de cambiar de idea ante las pruebas.',
        wowFact: 'Barry Marshall se bebió un vaso lleno de la bacteria para demostrar que causaba la enfermedad. ¡Y se curó con antibióticos! (No lo intentes en casa 😅)'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: 'El momento difícil',
        subtitle: '¿Qué harías tú?',
        content: 'Defendiste en clase que los murciélagos son pájaros. 🦇 Tu profe enseña un vídeo: los murciélagos son mamíferos, tienen pelo y dan leche a sus crías. Todos te miran.',
        keyTakeaway: 'Aceptar la prueba nueva con elegancia es de mentes fuertes.',
        question: {
          prompt: '¿Cuál es la respuesta más valiente?',
          options: [
            {
              id: 'a',
              text: '💪 «¡Anda, pues es verdad! Me equivoqué, los murciélagos son mamíferos. Gracias por enseñármelo».',
              isNuanced: true,
              score: 100,
              explanation: '¡Eso es valentía científica! Cambiar de opinión ante una prueba te hace más sabio, no más tonto. Los Nobel hacen esto todos los días. 🏅'
            },
            {
              id: 'b',
              text: '😤 «Me da igual el vídeo, yo sigo pensando que son pájaros».',
              isNuanced: false,
              score: 20,
              explanation: 'Entendemos que da rabia equivocarse... pero rechazar una prueba clara es como taparse los ojos. La verdad sigue ahí aunque no la mires.'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'reflection',
        title: 'Tu medalla de valentía',
        subtitle: 'Reto personal',
        content: 'Piensa en algo que creías y descubriste que era diferente (una película que pensabas que sería aburrida, una comida que no querías probar...). ¿Cómo se siente uno al decir «me equivoqué y ahora sé más»? Esa sensación es tu cerebro creciendo. 🧠✨',
        keyTakeaway: 'Cada «me equivoqué» es un escalón más hacia ser más sabio.'
      }
    ]
  },
  {
    id: 207,
    slug: 'tribunal-de-animales',
    title: 'U2.7 · El Tribunal de los Animales',
    subtitle: 'El gran dilema del bosque',
    shortDescription: 'Participa en un juicio simulado: ¿qué hacemos con el lobo que ataca a las ovejas?',
    fullDescription: 'En el bosque hay un problema real: el lobo se come las ovejas de los granjeros, pero el lobo también es necesario para el equilibrio del bosque. ¡No hay respuesta fácil! Aprende a escuchar todas las partes antes de decidir.',
    ageBracket: '8-9',
    competency: 'nuance',
    iconName: 'Gavel',
    badgeTag: 'JUEZ DEL BOSQUE',
    accentColor: '#8B5CF6',
    xpReward: 35,
    durationMinutes: 10,
    keyTakeaways: [
      'Los problemas difíciles tienen varias partes con razones válidas.',
      'Un buen juez escucha a TODOS antes de decidir.',
      'Las soluciones justas buscan el equilibrio, no un ganador absoluto.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El caso del lobo y los granjeros',
        subtitle: 'Todos tienen una parte de razón',
        content: '🐺 **El lobo:** necesita comer para vivir. Es su naturaleza. Además, sin lobos, los ciervos se multiplican y se comen todos los árboles del bosque.\n\n👨‍🌾 **El granjero:** sus ovejas son su trabajo y su comida. Cada oveja perdida es un problema para su familia.\n\n🌳 **El bosque:** necesita al lobo para estar sano y equilibrado.\n\n¿Quién tiene razón? ¡Todos un poco! Por eso es un dilema de verdad.',
        keyTakeaway: 'En un dilema real, cada parte tiene razones que merecen ser escuchadas.',
        wowFact: 'Cuando reintrodujeron lobos en el parque de Yellowstone (EE.UU.), ¡hasta los ríos cambiaron de forma! Los lobos equilibran todo el ecosistema.'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: '¡Dicta sentencia!',
        subtitle: 'El tribunal te escucha',
        content: 'Eres el juez del bosque. Las opciones sobre la mesa:\nA) Echar a todos los lobos.\nB) Dejar que los lobos campen a sus anchas.\nC) Proteger a los lobos Y ayudar a los granjeros con vallas y perros guardianes.',
        keyTakeaway: 'La solución justa protege a las dos partes, no solo a una.',
        question: {
          prompt: '¿Cuál es la sentencia más justa?',
          options: [
            {
              id: 'a',
              text: '⚖️ Opción C: proteger al lobo Y ayudar al granjero (vallas, perros guardianes, compensaciones).',
              isNuanced: true,
              score: 100,
              explanation: '¡Sentencia de juez sabio! Las soluciones justas cuidan de todas las partes. Así se resuelven los problemas difíciles del mundo real. 🏛️'
            },
            {
              id: 'b',
              text: '🐺 Opción A: fuera lobos, las ovejas primero.',
              isNuanced: false,
              score: 40,
              explanation: 'Entendemos al granjero... pero sin lobos el bosque se desequilibra (¡recuerda Yellowstone!). Una solución que ignora a una parte crea problemas nuevos.'
            },
            {
              id: 'c',
              text: '🤷 Opción B: que la naturaleza haga lo que quiera, sin ayudar a nadie.',
              isNuanced: false,
              score: 40,
              explanation: 'La naturaleza es sabia, pero los granjeros también necesitan vivir. Ignorar a una de las partes no es justo. ¡El juez debe escuchar a todos!'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'reflection',
        title: 'El juramento del juez',
        subtitle: 'Tu compromiso',
        content: 'Los jueces del Tribunal de los Animales juran: *«Escucharé a todas las partes, buscaré pruebas y decidiré con equilibrio, aunque sea difícil»*. La próxima vez que veas una discusión (en el patio, en casa, en las noticias), prueba a escuchar las DOS versiones antes de opinar.',
        keyTakeaway: 'Escuchar a todas las partes antes de decidir: esa es la marca de un juez justo.'
      }
    ]
  }
];
