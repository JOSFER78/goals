import { Lesson } from '../types';

export const HERO_IMAGES = {
  moon: 'https://image.qwenlm.ai/public_source/3fb8701a-d9e7-41d8-9b02-6513c343669c/1e1f4b306-4777-4b8a-bd3a-4de4161ab38a.png',
  ship: 'https://image.qwenlm.ai/public_source/3fb8701a-d9e7-41d8-9b02-6513c343669c/19fd8d080-3345-4985-94ed-58e1accecc5d.png',
  voyager: 'https://image.qwenlm.ai/public_source/3fb8701a-d9e7-41d8-9b02-6513c343669c/1664f2481-e2f3-4dce-8626-a3ddcb2d3232.png',
  bh: 'https://image.qwenlm.ai/public_source/3fb8701a-d9e7-41d8-9b02-6513c343669c/19e6dfd14-75aa-46f0-a8bb-6125c8d64644.png'
};

export const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "Objetivo Luna: Artemis",
    icon: "🌙",
    hero: HERO_IMAGES.moon,
    tag: "La nueva carrera lunar",
    steps: [
      {
        icon: "🌙",
        t: "53 años después, volvemos",
        text: "En diciembre de 1972, el Apolo 17 despegó de la Luna y la humanidad no volvió a salir de la órbita baja… hasta ahora. El programa Artemis de NASA tiene un objetivo claro: volver a la Luna, y esta vez para quedarse.",
        wow: "Entre el último Apolo y Artemis II pasó más tiempo del que existe internet. ¡Déjalo ahí! 🤯",
        now: "Artemis II ya rodeó la Luna en abril de 2026 con 4 astronautas: el primer vuelo tripulado más allá de la órbita baja en 50 años.",
        scene: "earth-moon"
      },
      {
        icon: "🧑‍🚀",
        t: "Artemis II: el ensayo con humanos",
        text: "Durante ~10 días, Reid Wiseman, Victor Glover, Christina Koch y Jeremy Hansen probaron la cápsula Orión alrededor de la Luna: soporte vital, pilotaje manual y una reentrada a casi 40.000 km/h, como una piedra que rebota en la atmósfera.",
        wow: "A esa velocidad, el escudo térmico de Orión soporta ~2.800 °C: más caliente que la superficie de algunas estrellas frías.",
        now: "El 6 de abril de 2026 la tripulación rodeó la cara oculta de la Luna y el 10 de abril amerizó sin problemas. Hasta el astronauta del Apolo 13, Jim Lovell, les mandó un saludo por radio.",
        scene: "earth-moon"
      },
      {
        icon: "🐉",
        t: "La nueva carrera: ¿quién llega antes?",
        text: "Esta vez EE.UU. no está solo: China planea llevar taikonautas a la Luna en 2029-2030 con su cohete Larga Marcha 10, el módulo de aterrizaje Lanyue y la nave Mengzhou… y quiere construir una base permanente.",
        wow: "Por primera vez en la historia, dos superpotencias compiten por vivir en la Luna a la vez.",
        now: "China ya probó con éxito su nave lunar en 2026, y NASA 'pausó' la estación Gateway para centrar recursos en pisar la superficie cuanto antes.",
        scene: "moon"
      },
      {
        icon: "🏗️",
        t: "Vivir en la Luna: el plan real",
        text: "La meta no es plantar una bandera: es construir. El polo sur lunar tiene hielo de agua en cráteres en sombra (agua = oxígeno + combustible). Landers reutilizables, reactores nucleares compactos y la Luna como banco de pruebas para Marte.",
        wow: "Una noche lunar dura 14 días terrestres y baja a -170 °C: sin energía, no sobrevives ni a la primera noche.",
        now: "Artemis III (prueba tripulada en órbita terrestre) apunta a finales de 2027 y Artemis IV a principios de 2028: NASA quiere cadencia de misiones como nunca antes.",
        scene: "moon"
      }
    ],
    test: [
      {
        type: "choice",
        question: "¿Cuándo rodeó la Luna la misión tripulada Artemis II?",
        options: ["Abril de 2026", "En 1972", "En 2022", "En 2030"],
        answer: 0
      },
      {
        type: "choice",
        question: "¿Cuántos astronautas llevaba Artemis II?",
        options: ["4", "2", "7", "12"],
        answer: 0
      },
      {
        type: "order",
        question: "Ordena la historia lunar:",
        items: ["Artemis II (tripulada)", "Apolo 17", "Artemis III (prueba)", "Artemis I (sin tripulación)"],
        correctOrder: ["Apolo 17", "Artemis I (sin tripulación)", "Artemis II (tripulada)", "Artemis III (prueba)"]
      },
      {
        type: "choice",
        question: "¿Qué país planea llevar taikonautas a la Luna hacia 2030?",
        options: ["China", "India", "Rusia", "Japón"],
        answer: 0
      }
    ]
  },
  {
    id: 2,
    title: "Starship: el cohete que lo cambia todo",
    icon: "🚀",
    hero: HERO_IMAGES.ship,
    tag: "124 m de acero inoxidable",
    steps: [
      {
        icon: "🏢",
        t: "El edificio que vuela",
        text: "Starship es el cohete más grande y potente jamás construido: ~124 metros de alto (un edificio de 40 pisos), 9 m de diámetro, y 33 motores que generan ~81.000 kN de empuje al despegar: el doble que el Saturno V de Apolo.",
        wow: "Su empuje al despegue equivale a ~8.000 coches deportivos acelerando a la vez. 🏎️",
        now: "La versión V3 ya vuela en 2026: más alta y potente que la V2, y su booster se atrapa en el aire con los 'chopsticks' de la torre.",
        scene: "starship"
      },
      {
        icon: "⚙️",
        t: "Raptor 3: el motor del futuro",
        text: "Cada motor Raptor 3 produce ~280 toneladas de empuje pesando solo 1.525 kg: una relación empuje/peso bestial. Quema metano y oxígeno líquidos, es reutilizable y SpaceX los fabrica en serie como churros.",
        wow: "SpaceX acumula +30.000 segundos de pruebas de Raptor con 567 encendidos: aprenden a base de quemar motores en el banco.",
        now: "En mayo de 2026 (vuelo 12) los Raptor 3 volaron por primera vez: 33 encendidos a la vez en el Super Heavy.",
        scene: "starship"
      },
      {
        icon: "💥",
        t: "Aprender explotando: el método SpaceX",
        text: "En vez de 10 años puliendo un cohete en papel, SpaceX construye, vuela, falla, aprende y repite. En 2026: el vuelo 12 estrenó los Raptor 3, el vuelo 13 sufrió un aborto en julio, y el vuelo 14 prepara el primer vuelo 100% orbital.",
        wow: "Starship ya encendió un Raptor en el espacio: la maniobra clave para ir a la Luna y a Marte.",
        now: "Próximo hito (vuelo 14): primer vuelo orbital de Starship y posible primera captura de la nave por la torre.",
        scene: "starship"
      },
      {
        icon: "🎯",
        t: "¿Para qué sirve un gigante así?",
        text: "Con ~100 toneladas de carga a órbita y reutilización total, Starship es el lander lunar de NASA para Artemis, el camión de repostaje orbital, el lanzador de los satélites Starlink V3 y el sueño de siempre: humanos a Marte.",
        wow: "Si logra la reutilización total, el coste de poner 1 kg en órbita podría caer ~100 veces: de millones a miles de dólares.",
        now: "En 2026 SpaceX prepara el despliegue de los primeros Starlink V3, satélites gigantes que solo Starship puede lanzar.",
        scene: "starship"
      }
    ],
    test: [
      {
        type: "choice",
        question: "¿Cuánto mide la Starship V3 completa?",
        options: ["~124 metros", "80 metros", "200 metros", "50 metros"],
        answer: 0
      },
      {
        type: "choice",
        question: "¿Cuántos motores Raptor 3 enciende el booster Super Heavy?",
        options: ["33", "3", "13", "66"],
        answer: 0
      },
      {
        type: "choice",
        question: "¿Qué combustible usan los motores Raptor?",
        options: ["Metano y oxígeno líquidos", "Gasolina", "Carbón", "Hidrógeno sólido"],
        answer: 0
      },
      {
        type: "order",
        question: "Ordena los hitos de Starship en 2026:",
        items: ["Vuelo 14 (primer orbital)", "Vuelo 12 (debut Raptor 3)", "Vuelo 13"],
        correctOrder: ["Vuelo 12 (debut Raptor 3)", "Vuelo 13", "Vuelo 14 (primer orbital)"]
      }
    ]
  },
  {
    id: 3,
    title: "El Sistema Solar: tu barrio",
    icon: "☀️",
    hero: null,
    tag: "1 estrella, 8 planetas, mil secretos",
    steps: [
      {
        icon: "☀️",
        t: "El Sol manda",
        text: "Todo gira alrededor de una estrella de tamaño medio que concentra el 99,86% de la masa del sistema. En su núcleo fusiona 600 millones de toneladas de hidrógeno por segundo: esa energía es la que te da vida.",
        wow: "Dentro del Sol cabrían 1,3 millones de Tierras. Y aún le queda combustible para 5.000 millones de años.",
        now: "La sonda Parker llegó a volar por la corona solar a casi 700.000 km/h: el objeto humano más rápido de la historia.",
        scene: "solar"
      },
      {
        icon: "🪨",
        t: "Rocosos vs gigantes",
        text: "Cerca del Sol, 4 mundos rocosos (Mercurio, Venus, Tierra, Marte). Lejos, 4 gigantes de gas y hielo (Júpiter, Saturno, Urano, Neptuno) con anillos y decenas de lunas cada uno.",
        wow: "En Júpiter cabrían todos los demás planetas juntos… y sobraría sitio.",
        now: "La misión Europa Clipper viaja hacia Júpiter: llegará en 2030 para estudiar el océano oculto de Europa, uno de los mejores sitios para buscar vida.",
        scene: "solar"
      },
      {
        icon: "☄️",
        t: "Los vecinos pequeños",
        text: "Entre Marte y Júpiter vive el cinturón de asteroides, y más allá, billones de cometas en la nube de Oort. Algunos asteroides se acercan mucho a la Tierra… pero casi todos son inofensivos.",
        wow: "El asteroide Apofis pasará en 2029 a solo ~32.000 km: más cerca que los satélites geoestacionarios. ¡Y será visible a simple vista!",
        now: "La nave OSIRIS-Apex llegará a Apofis justo después de su paso de 2029 para estudiarlo de cerca.",
        scene: "solar"
      },
      {
        icon: "📏",
        t: "Un barrio ENORME",
        text: "La luz tarda 8 minutos en llegar del Sol a la Tierra… y más de 4 horas en llegar a Neptuno. Y eso que el sistema solar es solo el jardín delantero del universo.",
        wow: "Si el Sol fuera una pelota de baloncesto, la Tierra sería un grano de pimienta a 26 metros… y Neptuno, otro grano a 780 metros.",
        now: "Ninguna sonda ha salido aún de la nube de Oort: la Voyager 1 tardará ~300 años en llegar a ella.",
        scene: "solar"
      }
    ],
    test: [
      {
        type: "choice",
        question: "¿Cuál es el planeta más grande del Sistema Solar?",
        options: ["Júpiter", "Saturno", "Tierra", "Neptuno"],
        answer: 0
      },
      {
        type: "choice",
        question: "¿Qué luna con océano oculto estudiará Europa Clipper?",
        options: ["Europa", "Titán", "Fobos", "La nuestra"],
        answer: 0
      },
      {
        type: "choice",
        question: "¿Qué asteroide pasará muy cerca de la Tierra en 2029?",
        options: ["Apofis", "Bennu", "Halley", "Vesta"],
        answer: 0
      },
      {
        type: "order",
        question: "Ordena los planetas rocosos desde el Sol:",
        items: ["Marte", "Mercurio", "Tierra", "Venus"],
        correctOrder: ["Mercurio", "Venus", "Tierra", "Marte"]
      }
    ]
  },
  {
    id: 4,
    title: "Estrellas y galaxias",
    icon: "✨",
    hero: null,
    tag: "Ciudades de estrellas",
    steps: [
      {
        icon: "🌡️",
        t: "Fábricas de luz",
        text: "Una estrella es una bola de gas que produce energía por fusión nuclear. Su color delata su temperatura: rojas ~3.000 °C, amarillas ~5.500 °C (el Sol), azules +30.000 °C.",
        wow: "La luz que te da una bombilla… viene de una estrella. La de tu comida, también. Todo es energía solar disfrazada.",
        scene: "stars"
      },
      {
        icon: "🌌",
        t: "Galaxias: ciudades de estrellas",
        text: "Las estrellas se agrupan en galaxias: miles de millones de soles, gas y polvo unidos por gravedad. Las hay espirales, elípticas e irregulares. En el universo observable hay ~2 billones.",
        wow: "Andrómeda se ve a simple vista desde un cielo oscuro: es lo más lejos que puedes ver sin telescopio (2,5 millones de años luz).",
        scene: "galaxy"
      },
      {
        icon: "🔭",
        t: "JWST: la máquina del tiempo",
        text: "El telescopio James Webb mira en infrarrojo y ve galaxias tal como eran hace miles de millones de años. Cada récord que rompe nos acerca más al Big Bang.",
        wow: "Ver lejos = ver al pasado. Cuando Webb ve una galaxia lejana, la está viendo de bebé.",
        now: "En enero de 2026 JWST confirmó a MoM-z14 como la galaxia más lejana: la vemos como era solo 280 millones de años después del Big Bang, y es sorprendentemente brillante.",
        scene: "galaxy"
      },
      {
        icon: "🕳️",
        t: "El corazón de la Vía Láctea",
        text: "Nuestra galaxia es una espiral de ~200.000 millones de estrellas. En su centro vive Sagitario A*, un agujero negro de 4 millones de masas solares fotografiado en 2022.",
        wow: "El Sol tarda 230 millones de años en dar una vuelta a la galaxia: solo hemos completado ~20 'años galácticos'.",
        scene: "galaxy"
      }
    ],
    test: [
      {
        type: "choice",
        question: "¿De qué color son las estrellas MÁS calientes?",
        options: ["Azules", "Rojas", "Amarillas", "Verdes"],
        answer: 0
      },
      {
        type: "choice",
        question: "¿Cómo se llama la galaxia más lejana confirmada por JWST (2026)?",
        options: ["MoM-z14", "Andrómeda", "GN-z11", "El Sombrero"],
        answer: 0
      },
      {
        type: "choice",
        question: "¿Qué hay en el centro de la Vía Láctea?",
        options: ["Un agujero negro supermasivo", "Una estrella gigante", "Nada", "Un planeta"],
        answer: 0
      },
      {
        type: "order",
        question: "Ordena de MENOR a MAYOR tamaño:",
        items: ["Vía Láctea", "Tierra", "Sistema Solar", "Universo"],
        correctOrder: ["Tierra", "Sistema Solar", "Vía Láctea", "Universo"]
      }
    ]
  },
  {
    id: 5,
    title: "Al borde: Voyager y el universo",
    icon: "📡",
    hero: HERO_IMAGES.voyager,
    tag: "El viaje más largo de la humanidad",
    steps: [
      {
        icon: "✨",
        t: "Medir el cosmos",
        text: "El espacio es tan grande que los kilómetros no sirven: usamos el año luz, la distancia que recorre la luz en un año (~9,46 billones de km). Próxima Centauri está a 4,24 años luz.",
        wow: "Cuando miras las estrellas, literalmente miras al pasado: su luz tarda años en llegar.",
        scene: "stars"
      },
      {
        icon: "📡",
        t: "Voyager: 49 años de viaje",
        text: "Lanzada en 1977, la Voyager 1 es el objeto humano más lejano: ~26.000 millones de km, ya en el espacio interestelar. Lleva un disco de oro con saludos en 55 idiomas y música de la Tierra.",
        wow: "Viaja a ~60.000 km/h y aun así tarda 9 meses en recorrer la distancia que la luz cubre en 1 día.",
        now: "En noviembre de 2026, Voyager 1 será el primer objeto humano a 1 día-luz de la Tierra: su señal tardará 24 HORAS en llegarnos.",
        scene: "voyager"
      },
      {
        icon: "🕸️",
        t: "La red cósmica",
        text: "Las galaxias se agrupan en cúmulos, y los cúmulos en supercúmulos unidos por filamentos: la red cósmica. Nosotros vivimos en Laniakea, 'cielo inmenso' en hawaiano.",
        wow: "Laniakea mide 520 millones de años luz y contiene ~100.000 galaxias… y fluye entera hacia el misterioso Gran Atractor.",
        scene: "web"
      },
      {
        icon: "🌐",
        t: "El universo observable",
        text: "Solo vemos la burbuja cuya luz ha tenido tiempo de llegarnos desde el Big Bang: 93.000 millones de años luz de diámetro, ~2 billones de galaxias. Más allá… es un misterio.",
        wow: "El 95% del universo es materia y energía oscuras: no sabemos qué son. En serio.",
        scene: "universe"
      }
    ],
    test: [
      {
        type: "choice",
        question: "¿Qué es un año luz?",
        options: ["La distancia que recorre la luz en un año", "300.000 km", "Un año normal", "La distancia a la Luna"],
        answer: 0
      },
      {
        type: "choice",
        question: "¿Qué hito alcanzará Voyager 1 en noviembre de 2026?",
        options: ["Estar a 1 día-luz de la Tierra", "Volver a casa", "Llegar a Marte", "Apagarse"],
        answer: 0
      },
      {
        type: "choice",
        question: "¿Cuántos años tiene el universo?",
        options: ["13.800 millones", "4.500 millones", "1 millón", "Infinito"],
        answer: 0
      },
      {
        type: "order",
        question: "Ordena de más CERCANO a más LEJANO:",
        items: ["Próxima Centauri", "Luna", "Andrómeda", "Sol"],
        correctOrder: ["Luna", "Sol", "Próxima Centauri", "Andrómeda"]
      }
    ]
  },
  {
    id: 6,
    title: "Los grandes misterios",
    icon: "🕳️",
    hero: HERO_IMAGES.bh,
    tag: "Lo que la ciencia aún no explica",
    steps: [
      {
        icon: "🕳️",
        t: "Agujeros negros",
        text: "Cuando una estrella muy masiva muere, su núcleo colapsa en una región con gravedad tan brutal que ni la luz escapa. En el centro de casi cada galaxia hay uno supermasivo.",
        wow: "En 2019 fotografiamos el primero (M87*); en 2022, el nuestro: Sagitario A*. Una 'foto' hecha con telescopios de todo el planeta a la vez.",
        scene: "blackhole"
      },
      {
        icon: "🌑",
        t: "El lado oscuro",
        text: "La materia normal (estrellas, planetas, tú) es solo el 5% del universo. El 27% es materia oscura (no la vemos, pero su gravedad sujeta las galaxias) y el 68% energía oscura, que acelera la expansión.",
        wow: "Sabemos que la materia oscura existe por cómo giran las galaxias… pero nadie la ha detectado jamás.",
        scene: "blackhole"
      },
      {
        icon: "💥",
        t: "El Big Bang y su eco",
        text: "Hace 13.800 millones de años todo el universo observable estaba en un estado extremadamente caliente y denso, y empezó a expandirse. Ese eco aún nos llega: la radiación cósmica de fondo.",
        wow: "El universo no explotó EN el espacio: explotó EL espacio. Y sigue expandiéndose cada vez más rápido.",
        scene: "universe"
      },
      {
        icon: "👽",
        t: "¿Estamos solos?",
        text: "JWST ya analiza atmósferas de exoplanetas (planetas de otras estrellas) buscando biofirmas: gases como metano o CO₂ que podrían delatar vida. Hay miles de exoplanetas confirmados.",
        wow: "Solo en nuestra galaxia hay más planetas que estrellas: estadísticamente, la vida tiene muchas oportunidades.",
        now: "En 2026 JWST sigue cazando atmósferas de exoplanetas rocosos en zonas habitables: la búsqueda de biofirmas está en marcha.",
        scene: "stars"
      }
    ],
    test: [
      {
        type: "choice",
        question: "¿Qué es un agujero negro?",
        options: ["Una región con gravedad tan fuerte que ni la luz escapa", "Un agujero en el suelo", "Una nube oscura", "Una estrella fría"],
        answer: 0
      },
      {
        type: "choice",
        question: "¿Qué porcentaje del universo es materia normal?",
        options: ["El 5%", "El 50%", "El 95%", "El 100%"],
        answer: 0
      },
      {
        type: "choice",
        question: "¿Cómo se llama el 'eco' del Big Bang?",
        options: ["Radiación cósmica de fondo", "Un trueno", "El viento solar", "Una aurora"],
        answer: 0
      },
      {
        type: "choice",
        question: "¿Qué telescopio analiza atmósferas de exoplanetas buscando vida?",
        options: ["JWST", "Hubble", "Voyager", "Uno de juguete"],
        answer: 0
      }
    ]
  }
];
