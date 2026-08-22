import { CriterioModule } from '../../types';

/**
 * TRAMO 1 · 6-7 AÑOS (1.º y 2.º de Primaria)
 * Arquetipo: "El Explorador Curioso" (docs/gamificacion/02_PSICOLOGIA_DESARROLLO_3_FRANJAS_EDAD.md)
 * Reglas de diseño: Zero-Penalty (el error nunca resta), feedback inmediato,
 * sesiones de 5-10 min, botones grandes, criaturas cósmicas como guías.
 * SSOT curricular: docs/criterio/00_MASTER_PLAN_CURRICULAR.md (U1.1 – U1.7)
 */
export const TRAMO_1_MODULES: CriterioModule[] = [
  {
    id: 101,
    slug: 'detective-hechos-opiniones',
    title: 'U1.1 · El Detective de Hechos y Opiniones',
    subtitle: '¿Se puede comprobar o es lo que alguien siente?',
    shortDescription: 'Conviértete en detective y descubre qué frases se pueden comprobar y cuáles son solo gustos.',
    fullDescription: 'Un detective de la verdad sabe que hay frases que se pueden medir y comprobar (hechos) y frases que cuentan lo que alguien siente o prefiere (opiniones). ¡Las dos están bien, pero no son lo mismo!',
    ageBracket: '6-7',
    competency: 'fact_opinion',
    iconName: 'Search',
    badgeTag: 'DETECTIVE NIVEL 1',
    accentColor: '#F59E0B',
    xpReward: 20,
    durationMinutes: 5,
    keyTakeaways: [
      'Un HECHO se puede comprobar midiendo, mirando o preguntando a quien lo vio.',
      'Una OPINIÓN es lo que alguien siente o prefiere: no es falsa, pero no es una prueba.',
      'Los detectives preguntan: «¿Cómo lo podemos comprobar?»'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'La lupa mágica del detective',
        subtitle: 'Hechos y opiniones',
        content: 'Mira estas dos frases:\n\n🔍 *«La mesa mide 1 metro»* → ¡Podemos coger una cinta métrica y medirlo! Eso es un **HECHO**.\n\n🍦 *«El helado de fresa es el más rico»* → Eso es lo que siente una persona. Tu amigo puede preferir el de chocolate. Eso es una **OPINIÓN**.\n\nLos dos valen, ¡pero el detective solo puede comprobar los hechos!',
        keyTakeaway: 'Si se puede medir o comprobar, es un hecho. Si es un gusto, es una opinión.',
        wowFact: 'Los detectives de verdad usan una lupa para encontrar pistas pequeñitas. ¡Tu lupa es la pregunta «¿cómo lo compruebo?»!'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: '¡Turno de detective!',
        subtitle: '¿Hecho o opinión?',
        content: 'Alguien dice: *«Los perros tienen cuatro patas»*. ¿Qué clase de frase es?',
        keyTakeaway: 'Podemos mirar un perro y contar sus patas: ¡eso se comprueba!',
        question: {
          prompt: '¿Es un hecho o una opinión?',
          options: [
            {
              id: 'a',
              text: '🔍 Un HECHO: puedo contar las patas de un perro.',
              isNuanced: true,
              score: 100,
              explanation: '¡Súper! Se puede comprobar mirando y contando. Eres un gran detective. 🕵️'
            },
            {
              id: 'b',
              text: '🍦 Una OPINIÓN: cada persona piensa lo que quiere.',
              isNuanced: false,
              score: 40,
              explanation: '¡Buen intento! Las opiniones son gustos. Pero contar patas se puede comprobar, así que es un hecho. ¡Sigue practicando, detective!'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'evidence_reveal',
        title: 'La insignia del detective',
        subtitle: 'Tu primera pista de oro',
        content: 'Cuando alguien te diga algo sorprendente, saca tu lupa imaginaria y pregunta con una sonrisa: *«¿Y cómo lo podemos comprobar?»*. Si te saben responder, ¡genial! Si no... quizá sea solo una opinión disfrazada.',
        keyTakeaway: 'La pregunta mágica del detective: «¿Cómo lo podemos comprobar?»'
      }
    ]
  },
  {
    id: 102,
    slug: 'apariencias-enganan',
    title: 'U1.2 · Las Apariencias Engañan',
    subtitle: 'Tus ojos a veces cuentan cuentos',
    shortDescription: 'Descubre con ilusiones ópticas que tus ojos pueden equivocarse... ¡y eso es normal!',
    fullDescription: 'A veces vemos cosas que parecen de una manera pero son de otra. Los científicos llaman a esto "ilusiones". ¡Nuestro cerebro es tan rápido que a veces se inventa un poquito de la historia!',
    ageBracket: '6-7',
    competency: 'context',
    iconName: 'Eye',
    badgeTag: 'OJOS DE Lince',
    accentColor: '#3B82F6',
    xpReward: 20,
    durationMinutes: 5,
    keyTakeaways: [
      'A veces los ojos nos muestran algo que no es exactamente así.',
      'Cuando algo nos sorprende mucho, conviene mirar otra vez con calma.',
      'Preguntar «¿será verdad?» no es ser pesado: es ser listo.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El truco de magia de los ojos',
        subtitle: 'Ilusiones ópticas',
        content: '¿Has visto alguna vez un lápiz dentro de un vaso de agua? ¡Parece que está doblado o roto! Pero si lo sacas... está perfecto. 🥤✏️\n\nEso pasa porque la luz viaja diferente por el agua y tus ojos cuentan una historia un poquito equivocada. ¡Tus ojos son geniales, pero a veces necesitan una segunda mirada!',
        keyTakeaway: 'Si algo parece raro, mira otra vez con calma antes de creerlo.',
        wowFact: 'Los magos usan ilusiones ópticas para sus trucos. ¡Tu cerebro hace magia sin querer!'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: '¡Segunda mirada!',
        subtitle: '¿Qué harías tú?',
        content: 'Ves por la ventana algo que parece un monstruo grande y peludo en el jardín. ¡Qué susto! 😱 ¿Qué hace un explorador listo?',
        keyTakeaway: 'Mirar otra vez con calma casi siempre explica el misterio.',
        question: {
          prompt: '¿Cuál es la mejor idea?',
          options: [
            {
              id: 'a',
              text: '👀 Mirar otra vez con calma y acercarme: quizá es el perro del vecino con una manta.',
              isNuanced: true,
              score: 100,
              explanation: '¡Perfecto! Casi todos los "monstruos" se explican mirando dos veces. Eres un explorador valiente y listo. 🌟'
            },
            {
              id: 'b',
              text: '🏃 Gritar a todos que hay un monstruo sin mirar más.',
              isNuanced: false,
              score: 40,
              explanation: '¡Entendemos el susto! Pero si avisamos sin comprobar, todos se asustan por algo que quizá no existe. Primero mirar, luego contar.'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'evidence_reveal',
        title: 'El superpoder de la segunda mirada',
        subtitle: 'Regla del explorador',
        content: 'Los exploradores espaciales tienen una regla: antes de decir «¡he visto algo increíble!», miran DOS veces y hacen una foto. Tú puedes hacer lo mismo: mirar otra vez, y si puedes, enseñárselo a alguien más.',
        keyTakeaway: 'Dos ojos miran mejor que uno... ¡y dos personas mejor que una sola!'
      }
    ]
  },
  {
    id: 103,
    slug: 'telefono-roto',
    title: 'U1.3 · El Secreto del Teléfono Roto',
    subtitle: 'Cómo se deforma un cuento al pasar de boca en boca',
    shortDescription: 'Juega al teléfono escacharrado y descubre por qué los rumores cambian al viajar.',
    fullDescription: 'Cuando un mensaje pasa de una persona a otra, cada vez se parece menos al original. ¡Como en el juego del teléfono escacharrado! Por eso los rumores casi nunca cuentan la verdad completa.',
    ageBracket: '6-7',
    competency: 'sources',
    iconName: 'PhoneCall',
    badgeTag: 'CAZA-RUMORES',
    accentColor: '#10B981',
    xpReward: 20,
    durationMinutes: 5,
    keyTakeaways: [
      'Cuando un mensaje viaja de persona en persona, se va cambiando sin querer.',
      'Un rumor no es una noticia: nadie sabe quién lo dijo primero.',
      'Si quieres saber la verdad, pregunta a la persona que lo vio de verdad.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El juego del teléfono escacharrado',
        subtitle: 'Un mensaje que viaja',
        content: 'Imagina que el profe dice: *«El viernes traed una fruta para el almuerzo»*. 🍎\n\nUn niño le cuenta a otro: *«El viernes traed fruta»*.\nOtro cuenta: *«El viernes no hay almuerzo»*.\n¡Y el último dice: *«El viernes NO HAY COLE»*! 🎉\n\n¿Qué pasó? Nadie mintió a propósito... pero el mensaje se fue rompiendo como un vaso que cae al suelo.',
        keyTakeaway: 'Cada vez que un mensaje pasa de boca en boca, puede cambiar un poquito.',
        wowFact: 'Este juego existe en todos los países del mundo. En inglés se llama "Chinese whispers" y en francés "téléphone arabe".'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: '¡Caza el rumor!',
        subtitle: '¿A quién preguntas?',
        content: 'En el patio, un amigo te dice: *«¡Me han dicho que mañana ponen helado para todos!»*. 🍦 Te hace mucha ilusión. ¿Qué hace un caza-rumores?',
        keyTakeaway: 'La persona que sabe la verdad es la que organiza el almuerzo: el profe.',
        question: {
          prompt: '¿Cómo compruebas si es verdad?',
          options: [
            {
              id: 'a',
              text: '🙋 Preguntar al profe, que es quien organiza el almuerzo.',
              isNuanced: true,
              score: 100,
              explanation: '¡Genial! Preguntar a la persona que lo sabe de verdad es el truco del caza-rumores. Así no te llevas chascos. 🍦✅'
            },
            {
              id: 'b',
              text: '📣 Contárselo a toda la clase para que todos se alegren.',
              isNuanced: false,
              score: 40,
              explanation: '¡Qué buena intención! Pero si el rumor es falso, todos se llevarán una decepción. Primero comprobar, luego contar.'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'evidence_reveal',
        title: 'La regla de oro del caza-rumores',
        subtitle: '¿Quién lo vio primero?',
        content: 'Cuando alguien te cuente algo que empezó con *«me han dicho que...»*, pregunta con cariño: *«¿Y quién lo vio primero?»*. Si nadie lo sabe... ¡es un rumor viajero, no una noticia!',
        keyTakeaway: 'Los rumores viajan rápido, pero la verdad tiene nombre y apellidos.'
      }
    ]
  },
  {
    id: 104,
    slug: 'zapatos-del-otro',
    title: 'U1.4 · Ponerse en los Zapatos del Otro',
    subtitle: 'Dos personas pueden ver lo mismo de forma diferente',
    shortDescription: 'Aprende que tu amigo puede ver la misma situación de otra manera... ¡y los dos tenéis razón!',
    fullDescription: 'A veces dos amigos ven la misma cosa y cuentan historias diferentes. No es que uno mienta: ¡es que cada persona mira desde su propio sitio! A esto los científicos lo llaman "Teoría de la Mente".',
    ageBracket: '6-7',
    competency: 'nuance',
    iconName: 'Heart',
    badgeTag: 'CORAZÓN EMPÁTICO',
    accentColor: '#EC4899',
    xpReward: 20,
    durationMinutes: 5,
    keyTakeaways: [
      'Dos personas pueden ver la misma cosa y contarla diferente.',
      'Escuchar la versión del otro nos ayuda a entender mejor.',
      'Preguntar «¿tú qué viste?» es de amigos inteligentes.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El número mágico',
        subtitle: '¿6 o 9?',
        content: 'Imagina un número pintado en el suelo del patio. Ana lo mira desde un lado y dice: *«¡Es un 6!»*. Leo lo mira desde el otro lado y dice: *«¡No! ¡Es un 9!»*.\n\n¿Quién miente? ¡NADIE! Los dos dicen la verdad desde su sitio. Solo se pusieron en los zapatos del otro cuando se cambiaron de lado. 👟✨',
        keyTakeaway: 'A veces los dos amigos tienen razón: solo miran desde sitios diferentes.',
        wowFact: 'Los científicos llaman a esto "Teoría de la Mente": entender que los demás piensan desde su propio punto de vista.'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: 'El partido del recreo',
        subtitle: '¿Qué pasó de verdad?',
        content: 'Dos amigos discuten por una jugada: uno dice que el balón salió fuera, el otro dice que no. Los dos están seguros. ¿Qué propone un corazón empático?',
        keyTakeaway: 'Escuchar las dos versiones nos acerca a lo que pasó de verdad.',
        question: {
          prompt: '¿Qué harías tú?',
          options: [
            {
              id: 'a',
              text: '👂 Escuchar a los dos y preguntar: «¿Tú qué viste?», y luego decidir juntos.',
              isNuanced: true,
              score: 100,
              explanation: '¡Qué bien! Escuchar las dos versiones es de amigos sabios. Así se resuelven casi todas las discusiones. 💛'
            },
            {
              id: 'b',
              text: '🗣️ Dar la razón a mi amigo sin escuchar al otro.',
              isNuanced: false,
              score: 40,
              explanation: 'Es normal querer ayudar a un amigo, pero si no escuchamos al otro, quizá nos equivocamos. ¡Los dos merecen ser escuchados!'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'reflection',
        title: 'Tu misión de hoy',
        subtitle: 'El reto de los zapatos mágicos',
        content: 'Hoy, cuando alguien te cuente algo distinto a lo que tú viste, prueba a decir: *«Cuéntame qué viste tú»*. Después, imagina que te pones sus zapatos. ¿Se entiende mejor su versión? ¡Ese es el superpoder de la empatía!',
        keyTakeaway: 'Entender al otro no significa darle la razón: significa escucharle de verdad.'
      }
    ]
  },
  {
    id: 105,
    slug: 'por-que-de-las-preguntas',
    title: 'U1.5 · El Porqué de las Preguntas',
    subtitle: 'La regla de los 3 «¿Por qué?»',
    shortDescription: 'Aprende a preguntar «¿por qué?» tres veces para llegar al fondo de las cosas.',
    fullDescription: 'Los grandes pensadores de la historia, como Sócrates, preguntaban "¿por qué?" una y otra vez hasta llegar a la razón de verdad. ¡Tú también puedes jugar a ser Sócrates con la regla de los 3 porqués!',
    ageBracket: '6-7',
    competency: 'nuance',
    iconName: 'Lightbulb',
    badgeTag: 'PEQUEÑO SÓCRATES',
    accentColor: '#EAB308',
    xpReward: 20,
    durationMinutes: 4,
    keyTakeaways: [
      'Preguntar «¿por qué?» no es ser pesado: es querer entender.',
      'Con 3 porqués seguidos se llega casi siempre a la razón de fondo.',
      'Las normas tienen un porqué: entenderlo ayuda a cumplirlas mejor.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'La escalera de los porqués',
        subtitle: 'Baja hasta el fondo',
        content: 'Mamá dice: *«Hay que lavarse las manos antes de cenar»*.\n\n🧒 ¿Por qué? → *«Porque tienen gérmenes»*.\n🧒 ¿Y por qué son malos los gérmenes? → *«Porque pueden darnos dolor de barriga»*.\n🧒 ¿Y por qué...? → *«Porque queremos estar sanos y fuertes para jugar»* 💪\n\n¡Tres escalones y llegaste a la razón de verdad: la salud!',
        keyTakeaway: 'Cada «¿por qué?» es un escalón que baja hasta la razón de fondo.',
        wowFact: 'Sócrates fue un filósofo griego que enseñaba haciendo preguntas. ¡Vivió hace más de 2.400 años y su truco sigue funcionando!'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: '¡Turno de preguntar!',
        subtitle: 'La norma del cole',
        content: 'En clase hay una norma: *«No se corre por los pasillos»*. Un compañero dice que esa norma es aburrida. ¿Qué le preguntas tú?',
        keyTakeaway: 'Las normas casi siempre existen para cuidarnos.',
        question: {
          prompt: '¿Cuál es la mejor pregunta?',
          options: [
            {
              id: 'a',
              text: '🤔 «¿Por qué existe esa norma?» — y pensar juntos la razón.',
              isNuanced: true,
              score: 100,
              explanation: '¡Exacto! Si preguntamos el porqué, descubrimos que es para no chocarnos ni hacernos daño. Las normas cuidan. 🛡️'
            },
            {
              id: 'b',
              text: '😤 «Pues yo corro porque quiero».',
              isNuanced: false,
              score: 40,
              explanation: 'Entendemos las ganas de correr, ¡el patio es para eso! Pero en los pasillos podemos chocar con alguien. Preguntar el porqué nos ayuda a entenderlo.'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'evidence_reveal',
        title: 'El juego de los 3 porqués',
        subtitle: 'Reto familiar',
        content: 'Esta noche, en casa, elige una norma (ir pronto a la cama, recoger los juguetes...) y baja la escalera de los 3 porqués con tu familia. ¡A ver a qué razón de fondo llegáis! Los filósofos antiguos lo llamarían "misión cumplida".',
        keyTakeaway: 'Quien entiende el porqué de una norma, la cumple con alegría.'
      }
    ]
  },
  {
    id: 106,
    slug: 'promesa-y-verdad',
    title: 'U1.6 · La Promesa y la Verdad',
    subtitle: 'Qué pasa cuando decimos la verdad o la escondemos',
    shortDescription: 'Descubre por qué decir la verdad construye confianza y las mentiras la rompen.',
    fullDescription: 'La confianza es como un puente entre dos personas. Cada verdad que dices hace el puente más fuerte. Cada mentirijilla lo agrieta un poquito. ¡Vamos a aprender a cuidar nuestros puentes!',
    ageBracket: '6-7',
    competency: 'fact_opinion',
    iconName: 'Users',
    badgeTag: 'PUENTE DE CONFIANZA',
    accentColor: '#14B8A6',
    xpReward: 20,
    durationMinutes: 5,
    keyTakeaways: [
      'La confianza se construye diciendo la verdad, poco a poco.',
      'Una mentira puede romper la confianza y cuesta mucho arreglarla.',
      'Decir la verdad aunque sea difícil es de valientes.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El puente de la confianza',
        subtitle: 'Verdad = puente fuerte',
        content: 'Imagina que la confianza entre tú y tu mejor amigo es un puente de madera. 🌉\n\nCada vez que dices la verdad, se añade una tabla nueva y el puente se hace más fuerte.\n\nPero si un día dices una mentira... ¡crac! Se rompe una tabla. Pedir perdón ayuda a repararla, pero la marca queda. Por eso los amigos de verdad cuidan sus puentes.',
        keyTakeaway: 'La verdad construye confianza; la mentira la agrieta.',
        wowFact: 'En muchos colegios del mundo existe la "palabra de honor": una promesa que vale más que un contrato firmado.'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: 'El jarrón roto',
        subtitle: 'Un momento difícil',
        content: 'Jugando en casa, rompes sin querer un jarrón. Nadie te ha visto. El corazón te va muy rápido. ¿Qué hace un constructor de puentes?',
        keyTakeaway: 'Decir la verdad rápido y pedir perdón repara el puente casi entero.',
        question: {
          prompt: '¿Qué harías?',
          options: [
            {
              id: 'a',
              text: '🙋 Contarlo enseguida: «He roto el jarrón sin querer, lo siento».',
              isNuanced: true,
              score: 100,
              explanation: '¡Eso es ser valiente de verdad! Al principio da un poco de miedo, pero la confianza crece muchísimo. Los valientes dicen la verdad. 💛'
            },
            {
              id: 'b',
              text: '🙈 Esconder los trozos y decir que fue el gato.',
              isNuanced: false,
              score: 40,
              explanation: 'Entendemos el miedo al enfado... pero si culpas al gato, se rompe una tabla del puente. Y los gatos no saben hablar para defenderse. 🐱'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'reflection',
        title: 'El juramento del explorador',
        subtitle: 'Tu promesa de hoy',
        content: 'Los exploradores de GOALS tienen un juramento: *«Diré la verdad aunque me cueste, porque mi puente de confianza vale más que cualquier excusa»*. ¿Lo aceptas? Dilo en voz alta y habrás ganado tu insignia de hoy.',
        keyTakeaway: 'Una promesa de verdad es un tesoro que se cuida todos los días.'
      }
    ]
  },
  {
    id: 107,
    slug: 'reglas-justas',
    title: 'U1.7 · Reglas Justas para Todos',
    subtitle: 'Diseña las normas de un juego sin favoritismos',
    shortDescription: 'Crea las reglas de un juego nuevo del patio donde nadie tenga ventaja injusta.',
    fullDescription: '¿Qué hace que un juego sea justo? Que las reglas sean iguales para todos y que nadie pueda cambiarlas a su favor. ¡Hoy serás el inventor de un juego justo!',
    ageBracket: '6-7',
    competency: 'nuance',
    iconName: 'Gavel',
    badgeTag: 'INVENTOR DE JUEGOS JUSTOS',
    accentColor: '#8B5CF6',
    xpReward: 25,
    durationMinutes: 6,
    keyTakeaways: [
      'Un juego es justo cuando las reglas son iguales para todos.',
      'Cambiar las reglas a mitad de partida para ganar es hacer trampa.',
      'Escuchar las ideas de todos hace las reglas mejores.'
    ],
    steps: [
      {
        id: 1,
        type: 'concept',
        title: 'El partido imposible',
        subtitle: 'Cuando las reglas son injustas',
        content: 'Imagina un partido donde un equipo puede tocar el balón con la mano, pero el otro no. Y además, el árbitro es el hermano mayor del primer equipo. 😱\n\n¿Sería divertido? ¡No! Los juegos solo son divertidos cuando las reglas son IGUALES para todos y el árbitro no tiene favoritos.',
        keyTakeaway: 'Reglas iguales para todos + árbitro sin favoritos = juego justo.',
        wowFact: 'En los Juegos Olímpicos hay un libro enorme con las reglas de cada deporte, ¡para que nadie tenga ventaja injusta!'
      },
      {
        id: 2,
        type: 'socratic_question',
        title: '¡Inventa las reglas!',
        subtitle: 'El juego de la pelota voladora',
        content: 'Tu clase inventa un juego nuevo con una pelota. Un niño propone: *«El que inventó el juego puede elegir equipo primero SIEMPRE»*. ¿Es una regla justa?',
        keyTakeaway: 'Una regla que da ventaja siempre a la misma persona no es justa.',
        question: {
          prompt: '¿Qué propones tú?',
          options: [
            {
              id: 'a',
              text: '⚖️ Elegir los equipos por sorteo, para que todos tengan la misma suerte.',
              isNuanced: true,
              score: 100,
              explanation: '¡Bravo! El sorteo es justo porque nadie tiene ventaja. Así todos quieren jugar. 🎲✨'
            },
            {
              id: 'b',
              text: '👑 Dejar que el inventor elija siempre, porque el juego es suyo.',
              isNuanced: false,
              score: 40,
              explanation: 'Es verdad que inventó el juego, ¡qué guay! Pero si elige siempre primero, los demás jugarán menos. Las reglas justas piensan en TODOS.'
            }
          ]
        }
      },
      {
        id: 3,
        type: 'reflection',
        title: 'Tu juego justo',
        subtitle: 'Misión del inventor',
        content: 'Piensa en tu juego favorito del patio. ¿Sus reglas son iguales para todos? ¿Hay algo que cambiarías para que fuera MÁS justo? Cuéntaselo a tu profe o a tu familia. ¡Los inventores de juegos justos mejoran el mundo, patio a patio!',
        keyTakeaway: 'La justicia empieza en las cosas pequeñas: como las reglas de un juego.'
      }
    ]
  }
];
