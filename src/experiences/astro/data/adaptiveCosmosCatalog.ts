/**
 * src/experiences/astro/data/adaptiveCosmosCatalog.ts
 * Catálogo Curricular Maestro Adaptativo de Astronomía 3D (Cosmos)
 * Proporciona unidades didácticas calibradas pedagógicamente para los 5 tramos:
 * - Tramo 6-7 (Primaria 1º ciclo / Inicial)
 * - Tramo 8-9 (Primaria 2º ciclo / Explorador)
 * - Tramo 10-11 (Primaria 3º ciclo / Avanzado)
 * - Tramo 12-13 (ESO 1º ciclo / Científico Junior)
 * - Tramo 14-15 (ESO 2º ciclo / Pre-Universitario)
 */

import { CurriculumUnit, AgeTranche } from '../../../core/types/adaptiveCurriculum';

// =========================================================================
// 1. TRAMO 6-7 AÑOS: ETAPA INICIAL (Lenguaje sensorial, sin fórmulas, juego)
// =========================================================================
const UNITS_6_7: CurriculumUnit[] = [
  {
    id: 'astro_6_7_u01_earth_shield',
    canonicalNumber: 1,
    disciplineId: 'astro',
    ageTranche: '6-7',
    targetAge: 7,
    title: 'La Tierra y su Manta Protectora',
    subtitle: 'El aire azul que respiramos y los astronautas en el espacio',
    tag: 'Nivel 1 • 6-7 Años • Descubrimiento',
    icon: '🌍',
    heroImage: 'https://images-assets.nasa.gov/image/iss064e007861/iss064e007861~orig.jpg',
    xpReward: 40,
    estimatedMinutes: 5,
    knowledgeSlugs: ['astronomy.earth.atmosphere', 'astronomy.satellites.iss'],
    competencies: [{
      code: 'LOMLOE.CN.1.1',
      title: 'Observación y cuidado del entorno terrestre',
      description: 'Identificar la atmósfera como la capa de aire que nos cuida y protege.',
      stage: 'primaria_1_ciclo'
    }],
    prerequisites: [],
    coreConcepts: ['tierra_redonda', 'atmosfera_aire', 'astronautas_espacio'],
    steps: [
      {
        stepNumber: 1,
        type: 'concept',
        title: 'Nuestra Casa es una Gran Esfera Azul',
        content: '¿Sabías que vivimos sobre una bola gigante y hermosa que flota en el espacio? Desde arriba se ve de color azul brillante por los grandes océanos y blanca por las nubes esponjosas.',
        icon: '🌍',
        wowFact: '¡La Tierra es el único planeta conocido con agua líquida y plantas para respirar!',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/iss064e007861/iss064e007861~orig.jpg',
          caption: 'La Tierra vista desde el espacio como un hogar brillante',
          credit: 'NASA'
        }
      },
      {
        stepNumber: 2,
        type: 'concept',
        title: 'Una Manta Invisible de Aire',
        content: 'Alrededor de la Tierra hay una capa de aire transparente llamada atmósfera. Es como una mantita suave que nos da aire fresco para respirar y nos protege del frío del espacio exterior.',
        icon: '🛡️',
        wowFact: 'Cuando caen piedrecitas del espacio, esta manta de aire las frena y se convierten en estrellas fugaces luminosas.',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/iss064e007861/iss064e007861~orig.jpg',
          caption: 'El halo azul de la atmósfera alrededor del planeta',
          credit: 'NASA'
        }
      },
      {
        stepNumber: 3,
        type: 'concept',
        title: 'La Casa Espacial donde Flotan los Astronautas',
        content: 'Muy arriba en el cielo vuela una nave gigante llamada Estación Espacial Internacional. Allí viven astronautas que flotan por los pasillos como si nadaran en el aire porque están cayendo en un viaje sin fin alrededor de la Tierra.',
        icon: '👨‍🚀',
        wowFact: '¡Los astronautas dan una vuelta completa a la Tierra cada 90 minutos y ven 16 amaneceres al día!',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/PIA00118/PIA00118~orig.jpg',
          caption: 'La Estación Espacial Internacional con sus grandes alas doradas',
          credit: 'NASA'
        }
      }
    ],
    linkedTestId: 'test_astro_6_7_u01',
    test: {
      id: 'test_astro_6_7_u01',
      lessonId: 'astro_6_7_u01_earth_shield',
      disciplineId: 'astro',
      title: '¡Misión Explorador: La Tierra!',
      passScorePercent: 66,
      xpReward: 30,
      version: 1,
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      questions: [
        {
          id: 1,
          type: 'choice',
          prompt: '¿De qué color principal se ve la Tierra desde el espacio? 🌍',
          options: ['Azul brillante por el agua de los mares 🌊', 'Verde entera como una lechuga 🥬', 'Roja como un tomate 🍅'],
          correctAnswer: 0,
          explanation: '¡Exacto! El agua de los océanos le da ese color azul precioso.',
          difficulty: 'easy',
          xp: 15
        },
        {
          id: 2,
          type: 'choice',
          prompt: '¿Cómo se mueven los astronautas dentro de la nave espacial? 🚀',
          options: ['Flotando suavemente por el aire 🤸', 'Caminando con botas de plomo muy pesadas 🥾', 'Nadando en una piscina de agua 🏊'],
          correctAnswer: 0,
          explanation: '¡Muy bien! Flotan porque la estación espacial está en caída libre continua alrededor del planeta.',
          difficulty: 'easy',
          xp: 15
        }
      ]
    },
    version: 1,
    status: 'published',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'astro_6_7_u02_day_night',
    canonicalNumber: 2,
    disciplineId: 'astro',
    ageTranche: '6-7',
    targetAge: 7,
    title: 'La Tierra Gira como una Peonza: Día y Noche',
    subtitle: '¿Por qué el Sol aparece por la mañana y se esconde por la tarde?',
    tag: 'Nivel 1 • 6-7 Años • Movimientos',
    icon: '🌞',
    heroImage: 'https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~orig.jpg',
    xpReward: 40,
    estimatedMinutes: 5,
    knowledgeSlugs: ['astronomy.earth.rotation'],
    competencies: [{
      code: 'LOMLOE.CN.1.2',
      title: 'Comprensión del ciclo día y noche',
      description: 'Reconocer que el día y la noche se producen por el giro continuo de la Tierra.',
      stage: 'primaria_1_ciclo'
    }],
    prerequisites: ['astro_6_7_u01_earth_shield'],
    coreConcepts: ['giro_tierra', 'dia_sol', 'noche_estrellas'],
    steps: [
      {
        stepNumber: 1,
        type: 'concept',
        title: 'La Peonza que Nunca se Detiene',
        content: 'Imagina que tienes una peonza que da vueltas sin parar. La Tierra hace lo mismo en el espacio: gira sobre sí misma todo el tiempo de forma suave y sin que nosotros nos mareemos.',
        icon: '🌀',
        wowFact: 'Aunque no lo sientas, la Tierra tarda exactamente 24 horas (un día entero) en dar una vuelta completa.',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/iss064e007861/iss064e007861~orig.jpg',
          caption: 'La Tierra girando continuamente iluminada por el Sol',
          credit: 'NASA'
        }
      },
      {
        stepNumber: 2,
        type: 'concept',
        title: 'El Sol nos Saluda y luego Descansamos',
        content: 'El Sol está quieto en el centro como una gran lámpara. Cuando la parte de la Tierra donde vives mira hacia el Sol, es de **DÍA** y podemos jugar. Cuando gira y queda de espaldas, llega la **NOCHE** para dormir y ver las estrellas.',
        icon: '🌙',
        wowFact: '¡Mientras tú duermes por la noche, los niños al otro lado del mundo en Japón o Australia están jugando de día!',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~orig.jpg',
          caption: 'El Sol iluminando una mitad del planeta mientras la otra descansa',
          credit: 'NASA'
        }
      }
    ],
    linkedTestId: 'test_astro_6_7_u02',
    test: {
      id: 'test_astro_6_7_u02',
      lessonId: 'astro_6_7_u02_day_night',
      disciplineId: 'astro',
      title: '¡Misión Día y Noche!',
      passScorePercent: 66,
      xpReward: 30,
      version: 1,
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      questions: [
        {
          id: 1,
          type: 'choice',
          prompt: '¿Por qué se hace de noche en tu casa? 🌙',
          options: [
            'Porque nuestra parte de la Tierra gira y queda de espaldas al Sol 🌍',
            'Porque el Sol se apaga como una bombilla 💡',
            'Porque una nube gigante tapa todo el cielo ☁️'
          ],
          correctAnswer: 0,
          explanation: '¡Genial! La Tierra gira continuamente y cuando nos ponemos de espaldas al Sol llega la noche.',
          difficulty: 'easy',
          xp: 15
        }
      ]
    },
    version: 1,
    status: 'published',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'astro_6_7_u03_planets_family',
    canonicalNumber: 3,
    disciplineId: 'astro',
    ageTranche: '6-7',
    targetAge: 7,
    title: 'La Familia del Sol: Los 8 Planetas',
    subtitle: 'Conoce a nuestros vecinos espaciales',
    tag: 'Nivel 1 • 6-7 Años • Sistema Solar',
    icon: '🪐',
    heroImage: 'https://images-assets.nasa.gov/image/PIA21971/PIA21971~orig.jpg',
    xpReward: 40,
    estimatedMinutes: 6,
    knowledgeSlugs: ['astronomy.solar_system.planets'],
    competencies: [{
      code: 'LOMLOE.CN.1.3',
      title: 'Identificación de los planetas vecinos',
      description: 'Reconocer los planetas principales como compañeros de viaje alrededor del Sol.',
      stage: 'primaria_1_ciclo'
    }],
    prerequisites: ['astro_6_7_u02_day_night'],
    coreConcepts: ['planetas_rocosos', 'planetas_gigantes', 'sol_estrella'],
    steps: [
      {
        stepNumber: 1,
        type: 'concept',
        title: 'El Sol: El Gran Rey de Fuego',
        content: 'El Sol es una estrella gigante, caliente y dorada. Es tan grande que dentro cabrían más de un millón de Tierras. Todos los planetas giran contentos a su alrededor en un círculo invisible.',
        icon: '☀️',
        wowFact: '¡El Sol nos da luz y calor para que podamos vivir y las plantas puedan crecer!',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/PIA24179/PIA24179~orig.jpg',
          caption: 'El Sol brillando con inmensa energía en el centro del sistema',
          credit: 'NASA'
        }
      },
      {
        stepNumber: 2,
        type: 'concept',
        title: 'Pequeños de Roca y Gigantes con Anillos',
        content: 'Cerca del Sol viven 4 planetas rocosos de suelo firme: Mercurio, Venus, nuestra Tierra y Marte (el planeta rojo). Más lejos viven los gigantes de gas como Júpiter (el más grandote) y Saturno con sus preciosos anillos de hielo.',
        icon: '🪐',
        wowFact: '¡Los anillos de Saturno están hechos de millones de trocitos de hielo y polvo brillante que parecen pistas de carreras!',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/PIA21971/PIA21971~orig.jpg',
          caption: 'Júpiter y Saturno, los gigantes del Sistema Solar',
          credit: 'NASA'
        }
      }
    ],
    linkedTestId: 'test_astro_6_7_u03',
    test: {
      id: 'test_astro_6_7_u03',
      lessonId: 'astro_6_7_u03_planets_family',
      disciplineId: 'astro',
      title: '¡Misión Familia Solar!',
      passScorePercent: 66,
      xpReward: 30,
      version: 1,
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      questions: [
        {
          id: 1,
          type: 'choice',
          prompt: '¿Qué planeta tiene los anillos más famosos y bonitos? 🪐',
          options: ['Saturno con sus anillos brillantes 🪐', 'La Luna 🌙', 'El Sol ☀️'],
          correctAnswer: 0,
          explanation: '¡Fantástico! Saturno es conocido por sus espectaculares anillos de hielo y roca.',
          difficulty: 'easy',
          xp: 15
        }
      ]
    },
    version: 1,
    status: 'published',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

// =========================================================================
// 2. TRAMO 8-9 AÑOS: EXPLORADOR (Conceptos guiados, modelos 3D, sin fórmulas duras)
// =========================================================================
const UNITS_8_9: CurriculumUnit[] = [
  {
    id: 'astro_8_9_u01_atmosphere_satellites',
    canonicalNumber: 1,
    disciplineId: 'astro',
    ageTranche: '8-9',
    targetAge: 8,
    title: 'La Atmósfera Terrestre y los Satélites Artificiales',
    subtitle: 'La frontera del espacio a 100 km y la Estación Espacial',
    tag: 'Nivel 2 • 8-9 Años • Explorador',
    icon: '🌍',
    heroImage: 'https://images-assets.nasa.gov/image/iss064e007861/iss064e007861~orig.jpg',
    xpReward: 50,
    estimatedMinutes: 7,
    knowledgeSlugs: ['astronomy.earth.atmosphere', 'astronomy.satellites.iss'],
    competencies: [{
      code: 'LOMLOE.CN.2.1',
      title: 'Estructura de la atmósfera y exploración tecnológica',
      description: 'Comprender las capas de la atmósfera y la función de los satélites en órbita.',
      stage: 'primaria_2_ciclo'
    }],
    prerequisites: [],
    coreConcepts: ['linea_karman', 'capas_atmosfera', 'satelites_iss'],
    steps: [
      {
        stepNumber: 1,
        type: 'concept',
        title: 'La Línea de Kármán: La Frontera Oficial del Espacio',
        content: 'Si subes en un avión cada vez hay menos aire. A los **100 kilómetros de altura** se sitúa la *Línea de Kármán*, el límite donde la atmósfera se vuelve tan delgada que las alas de un avión ya no pueden volar y comienza oficialmente el espacio exterior.',
        icon: '🚀',
        wowFact: 'Si la Tierra tuviera el tamaño de un balón de fútbol, toda la atmósfera respirable sería tan fina como una hoja de papel envolviendo el balón.',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/iss064e007861/iss064e007861~orig.jpg',
          caption: 'La atmósfera terrestre vista como un fino borde azul brillante',
          credit: 'NASA'
        }
      },
      {
        stepNumber: 2,
        type: 'concept',
        title: 'Vivir y Trabajar a 400 km de Altura',
        content: 'A unos 400 km de altura vuela la **Estación Espacial Internacional (ISS)**. Da una vuelta entera al planeta cada hora y media a una velocidad increíble de 27.600 km/h. Los astronautas hacen experimentos científicos para aprender cómo viajar a Marte.',
        icon: '🛰️',
        wowFact: 'Los paneles solares de la ISS son tan grandes que cubren la superficie de un campo de fútbol entero.',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/PIA00118/PIA00118~orig.jpg',
          caption: 'La ISS con sus grandes alas de paneles solares fotovoltaicos',
          credit: 'NASA'
        }
      }
    ],
    linkedTestId: 'test_astro_8_9_u01',
    test: {
      id: 'test_astro_8_9_u01',
      lessonId: 'astro_8_9_u01_atmosphere_satellites',
      disciplineId: 'astro',
      title: 'Evaluación: Atmósfera y Satélites',
      passScorePercent: 70,
      xpReward: 35,
      version: 1,
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      questions: [
        {
          id: 1,
          type: 'choice',
          prompt: '¿A qué altitud se sitúa la Línea de Kármán que marca el inicio del espacio?',
          options: ['A los 100 km de altura', 'A los 10 km de altura', 'A 1.000.000 km de altura'],
          correctAnswer: 0,
          explanation: 'La Línea de Kármán a 100 km es el límite internacional acordado donde comienza el espacio.',
          difficulty: 'medium',
          xp: 20
        },
        {
          id: 2,
          type: 'choice',
          prompt: '¿Cuánto tarda la Estación Espacial Internacional en dar una vuelta completa a la Tierra?',
          options: ['Aproximadamente 90 minutos (hora y media)', 'Exactamente 24 horas', '30 días completos'],
          correctAnswer: 0,
          explanation: 'A 27.600 km/h, la ISS completa una órbita entera alrededor de la Tierra cada 90 minutos.',
          difficulty: 'medium',
          xp: 20
        }
      ]
    },
    version: 1,
    status: 'published',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'astro_8_9_u02_eclipses_spain',
    canonicalNumber: 2,
    disciplineId: 'astro',
    ageTranche: '8-9',
    targetAge: 8,
    title: 'Eclipses y el Gran Eclipse Solar de 2026 en España',
    subtitle: 'Cuando la Luna proyecta su sombra y oscurece el día',
    tag: 'Nivel 2 • 8-9 Años • Astronomía Práctica',
    icon: '🌘',
    heroImage: 'https://images-assets.nasa.gov/image/PIA24179/PIA24179~orig.jpg',
    xpReward: 50,
    estimatedMinutes: 8,
    knowledgeSlugs: ['astronomy.moon.eclipses', 'astronomy.eclipse_2026_spain'],
    competencies: [{
      code: 'LOMLOE.CN.2.3',
      title: 'Geometría del sistema Sol-Tierra-Luna',
      description: 'Explicar los eclipses solares y lunares mediante la alineación astronómica.',
      stage: 'primaria_2_ciclo'
    }],
    prerequisites: ['astro_8_9_u01_atmosphere_satellites'],
    coreConcepts: ['eclipse_solar', 'eclipse_lunar', 'sombra_luna', 'eclipse_2026'],
    steps: [
      {
        stepNumber: 1,
        type: 'concept',
        title: 'El Juego de Sombras Cósmicas',
        content: 'Un eclipse ocurre cuando tres cuerpos celestes se alinean en línea recta: el Sol, la Luna y la Tierra. Cuando la Luna pasa exactamente entre el Sol y la Tierra, tapa la luz del Sol y su sombra se proyecta sobre nosotros: ¡es un **Eclipse Solar Total**!',
        icon: '🌑',
        wowFact: 'Durante un eclipse total de Sol, el cielo se oscurece tanto en pleno mediodía que se pueden ver las estrellas y los pájaros se van a dormir.',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/PIA24179/PIA24179~orig.jpg',
          caption: 'La corona solar brillando durante la totalidad de un eclipse',
          credit: 'NASA'
        }
      },
      {
        stepNumber: 2,
        type: 'concept',
        title: 'El Gran Evento de Agosto de 2026 en España',
        content: 'El **12 de agosto de 2026**, España vivirá un eclipse solar total histórico. La franja de oscuridad total cruzará el norte y centro de la península (Galicia, Asturias, Castilla y León, Aragón, Valencia y Baleares) justo antes del atardecer.',
        icon: '🇪🇸',
        wowFact: '¡Hacía más de un siglo que no se presenciaba un eclipse solar total en la península ibérica!',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/PIA24179/PIA24179~orig.jpg',
          caption: 'Alineación precisa que ocurrirá en 2026 sobre la península ibérica',
          credit: 'NASA / ESA'
        }
      }
    ],
    linkedTestId: 'test_astro_8_9_u02',
    test: {
      id: 'test_astro_8_9_u02',
      lessonId: 'astro_8_9_u02_eclipses_spain',
      disciplineId: 'astro',
      title: 'Evaluación: Eclipses y España 2026',
      passScorePercent: 70,
      xpReward: 35,
      version: 1,
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      questions: [
        {
          id: 1,
          type: 'choice',
          prompt: '¿Qué cuerpo celeste se interpone entre el Sol y la Tierra durante un Eclipse Solar?',
          options: ['La Luna', 'Marte', 'Júpiter'],
          correctAnswer: 0,
          explanation: 'La Luna pasa exactamente entre el Sol y la Tierra y bloquea la luz solar.',
          difficulty: 'medium',
          xp: 20
        },
        {
          id: 2,
          type: 'choice',
          prompt: '¿En qué fecha ocurrirá el histórico eclipse solar total visible en España?',
          options: ['12 de agosto de 2026', '25 de diciembre de 2030', '1 de enero de 2024'],
          correctAnswer: 0,
          explanation: 'El 12 de agosto de 2026 será visible en una amplia franja de la península ibérica y Baleares.',
          difficulty: 'medium',
          xp: 20
        }
      ]
    },
    version: 1,
    status: 'published',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

// =========================================================================
// 3. TRAMO 10-11 AÑOS: AVANZADO (Causalidad física, unidades UA, gravedad)
// =========================================================================
const UNITS_10_11: CurriculumUnit[] = [
  {
    id: 'astro_10_11_u01_orbital_mechanics',
    canonicalNumber: 1,
    disciplineId: 'astro',
    ageTranche: '10-11',
    targetAge: 10,
    title: 'Dinámica de Vuelo Orbital y Caída Libre',
    subtitle: 'Por qué la gravedad a 400 km sigue activa y cómo vuelan los satélites',
    tag: 'Nivel 3 • 10-11 Años • Física Espacial',
    icon: '🛰️',
    heroImage: 'https://images-assets.nasa.gov/image/PIA00118/PIA00118~orig.jpg',
    xpReward: 60,
    estimatedMinutes: 9,
    knowledgeSlugs: ['astronomy.earth.atmosphere', 'astronomy.satellites.iss', 'astronomy.physics.gravity'],
    competencies: [{
      code: 'LOMLOE.CN.3.1',
      title: 'Comprensión de fuerzas gravitatorias y órbitas',
      description: 'Diferenciar entre ingravidez aparente por caída libre y ausencia de gravedad.',
      stage: 'primaria_3_ciclo'
    }],
    prerequisites: [],
    coreConcepts: ['gravedad_09g', 'caida_libre_orbital', 'velocidad_tangencial_28000'],
    steps: [
      {
        stepNumber: 1,
        type: 'concept',
        title: 'El Mito de la Gravedad Cero',
        content: 'Existe una creencia muy común de que en el espacio "no hay gravedad". En realidad, a 418 km de altitud (donde vuela la ISS), la atracción gravitatoria de la Tierra es todavía del **90% ($g \approx 8,7\text{ m/s}^2$)** de la que sentimos en el suelo.',
        icon: '⚖️',
        wowFact: 'Si construyeras una torre gigante de 400 km y te pesaras en una báscula arriba, pesarías casi lo mismo que en tu casa.',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/PIA00118/PIA00118~orig.jpg',
          caption: 'Astronautas en caída libre continua dentro del laboratorio orbital',
          credit: 'NASA'
        }
      },
      {
        stepNumber: 2,
        type: 'concept',
        title: '¿Por qué Flotan? La Caída Libre Continua',
        content: 'Para no estrellarse contra el suelo, la estación viaja lateralmente a **$27.600\text{ km/h}$ ($7,66\text{ km/s}$)**. La nave cae continuamente hacia el centro de la Tierra, pero viaja tan rápido de lado que el suelo se curva debajo de ella al mismo ritmo. Los astronautas flotan porque la nave y sus cuerpos caen juntos a la misma velocidad.',
        icon: '📐',
        wowFact: 'Esta idea fue imaginada por Isaac Newton en el siglo XVII con su famoso experimento mental del cañón en la cima de una montaña.',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/iss064e007861/iss064e007861~orig.jpg',
          caption: 'Curvatura terrestre que compensa la caída de los satélites en órbita',
          credit: 'NASA'
        }
      }
    ],
    linkedTestId: 'test_astro_10_11_u01',
    test: {
      id: 'test_astro_10_11_u01',
      lessonId: 'astro_10_11_u01_orbital_mechanics',
      disciplineId: 'astro',
      title: 'Evaluación: Dinámica Orbital',
      passScorePercent: 75,
      xpReward: 40,
      version: 1,
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      questions: [
        {
          id: 1,
          type: 'choice',
          prompt: '¿Qué porcentaje aproximado de gravedad terrestre existe a la altitud de la ISS (418 km)?',
          options: ['Aproximadamente el 90%', '0% (ingravidez absoluta)', '50% exactamente', '10%'],
          correctAnswer: 0,
          explanation: 'A 418 km la gravedad sigue siendo del 90%; flotan debido a la caída libre continua en órbita.',
          difficulty: 'hard',
          xp: 25
        }
      ]
    },
    version: 1,
    status: 'published',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

// =========================================================================
// 4. TRAMO 12-13 AÑOS: CIENTÍFICO JUNIOR (Física, vectores, espectro, astrofísica)
// =========================================================================
const UNITS_12_13: CurriculumUnit[] = [
  {
    id: 'astro_12_13_u01_gravitation_black_holes',
    canonicalNumber: 1,
    disciplineId: 'astro',
    ageTranche: '12-13',
    targetAge: 12,
    title: 'Estructura Galáctica, Materia Oscura y Sagitario A*',
    subtitle: 'Curvas de rotación galácticas y el agujero negro supermasivo central',
    tag: 'Nivel 4 • 12-13 Años • Astrofísica Moderna',
    icon: '🌀',
    heroImage: 'https://images-assets.nasa.gov/image/PIA14293/PIA14293~orig.jpg',
    xpReward: 70,
    estimatedMinutes: 10,
    knowledgeSlugs: ['astronomy.galaxies.milky_way', 'astronomy.black_holes.sagittarius_a'],
    competencies: [{
      code: 'LOMLOE.BG.1.4',
      title: 'Dinámica de galaxias y agujeros negros',
      description: 'Analizar la evidencia de materia oscura y la física de los agujeros negros supermasivos.',
      stage: 'eso_1_ciclo'
    }],
    prerequisites: [],
    coreConcepts: ['curva_rotacion_plana', 'materia_oscura_halo', 'sagitario_a_estrella', 'horizonte_sucesos'],
    steps: [
      {
        stepNumber: 1,
        type: 'concept',
        title: 'El Misterio de la Curva de Rotación Plana',
        content: 'Según las leyes de Kepler y Newton, las estrellas en el borde exterior de la Vía Láctea deberían orbitar mucho más lento que las interiores. Sin embargo, las mediciones demuestran que giran a la misma velocidad constante (~$220\\text{ km/s}$). Esto demostró la existencia de un halo masivo invisible de **Materia Oscura** que representa el 85% de la masa total de la galaxia.',
        icon: '🌌',
        wowFact: 'La astrofísica Vera Rubin descubrió esta anomalía en los años 70 estudiando la rotación de galaxias espirales.',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/PIA14293/PIA14293~orig.jpg',
          caption: 'Mapa infrarrojo de la Vía Láctea revelando su disco y brazos espirales',
          credit: 'NASA / JPL'
        }
      },
      {
        stepNumber: 2,
        type: 'concept',
        title: 'Sagitario A*: El Monstruo de 4 Millones de Masas Solares',
        content: 'En el núcleo exacto de nuestra galaxia, a 26.000 años luz de la Tierra, se encuentra **Sagitario A*** ($Sgr A^*$), un agujero negro supermasivo con una masa equivalente a 4,15 millones de Soles concentrada en una región menor que la órbita de Mercurio.',
        icon: '🕳️',
        wowFact: 'En 2022, el Event Horizon Telescope (EHT) capturó la primera imagen directa de la sombra y el anillo brillante de Sagitario A*.',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/PIA14293/PIA14293~orig.jpg',
          caption: 'Centro galáctico donde residen miles de estrellas orbitando a velocidades relativistas',
          credit: 'NASA / EHT'
        }
      }
    ],
    linkedTestId: 'test_astro_12_13_u01',
    test: {
      id: 'test_astro_12_13_u01',
      lessonId: 'astro_12_13_u01_gravitation_black_holes',
      disciplineId: 'astro',
      title: 'Evaluación: Vía Láctea y Materia Oscura',
      passScorePercent: 75,
      xpReward: 45,
      version: 1,
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      questions: [
        {
          id: 1,
          type: 'choice',
          prompt: '¿Qué evidencia observacional confirmó la presencia de Materia Oscura en las galaxias?',
          options: [
            'Curvas de rotación planas donde las estrellas exteriores giran a la misma velocidad constante',
            'Que el centro de las galaxias no emite ninguna luz visible',
            'La presencia de anillos de hielo en Saturno',
            'Que los eclipses solares duran exactamente 2 minutos'
          ],
          correctAnswer: 0,
          explanation: 'La velocidad constante de rotación en los bordes galácticos requiere una gran cantidad de masa invisible (materia oscura).',
          difficulty: 'hard',
          xp: 30
        }
      ]
    },
    version: 1,
    status: 'published',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

// =========================================================================
// 5. TRAMO 14-15 AÑOS: PRE-UNIVERSITARIO (Formulación matemática, CMB, Lambda-CDM)
// =========================================================================
const UNITS_14_15: CurriculumUnit[] = [
  {
    id: 'astro_14_15_u01_cosmology_cmb_lambda_cdm',
    canonicalNumber: 1,
    disciplineId: 'astro',
    ageTranche: '14-15',
    targetAge: 15,
    title: 'Cosmología Cuantitativa: Modelo $\\Lambda\\text{-CDM}$ y Radiación CMB',
    subtitle: 'Expansión métrica del espacio, horizonte de partículas y el eco del Big Bang',
    tag: 'Nivel 5 • 14-15 Años • Astrofísica Teórica',
    icon: '⚛️',
    heroImage: 'https://images-assets.nasa.gov/image/PIA16873/PIA16873~orig.jpg',
    xpReward: 80,
    estimatedMinutes: 12,
    knowledgeSlugs: ['astronomy.cosmology.observable_universe', 'astronomy.cosmology.cmb_radiation'],
    competencies: [{
      code: 'LOMLOE.FQ.4.4',
      title: 'Cosmología y modelos de evolución del Universo',
      description: 'Modelizar la expansión cósmica mediante la ley de Hubble-Lemaître y el fondo cósmico de microondas.',
      stage: 'eso_2_ciclo'
    }],
    prerequisites: [],
    coreConcepts: ['fondo_microondas_cmb_2_725K', 'horizonte_particulas_46_5_Gly', 'energia_oscura_lambda_cdm', 'ley_hubble_lemaitre'],
    steps: [
      {
        stepNumber: 1,
        type: 'concept',
        title: 'El Fondo Cósmico de Microondas ($T = 2,7255\\text{ K}$)',
        content: 'El **Fondo Cósmico de Microondas (CMB)** es el resplandor remanente del Big Bang emitido 380.000 años después del origen, durante la época de la recombinación cuando los electrones se unieron a los protones formando hidrógeno neutro. La radiación se ha enfriado por la expansión métrica del espacio hasta una temperatura de cuerpo negro casi perfecta de **$2,7255\\text{ K}$** con anisotropías diminutas de $\\Delta T / T \\sim 10^{-5}$.',
        icon: '📡',
        wowFact: 'El telescopio espacial Planck de la ESA mapeó estas fluctuaciones térmicas primordiales con una precisión de microkelvins.',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/PIA16873/PIA16873~orig.jpg',
          caption: 'Mapa de anisotropías del CMB generado por el telescopio espacial Planck de la ESA',
          credit: 'ESA / NASA / Planck Collaboration'
        }
      },
      {
        stepNumber: 2,
        type: 'concept',
        title: 'Horizonte de Partículas y Escala Cósmica ($R \\approx 46.500\\text{ millones de al}$)',
        content: 'Aunque el Universo tiene una edad finita de **$13.787\\text{ millones de años}$**, el diámetro del Universo Observable mide aproximadamente **$93.000\\text{ millones de años luz}$ ($28,5\\text{ Gpc}$)**. Esta aparente paradoja se explica por la expansión comóvil del espacio-tiempo regida por las ecuaciones de Friedmann con parámetro de densidad $\\Omega_m \\approx 0,31$ y $\\Omega_\\Lambda \\approx 0,69$.',
        icon: '🌌',
        wowFact: 'Las galaxias más lejanas se alejan de nosotros a velocidades de recesión superiores a $c$ debido a la expansión métrica del tejido espacial entre ellas y nosotros.',
        media: {
          type: 'image',
          url: 'https://images-assets.nasa.gov/image/PIA16873/PIA16873~orig.jpg',
          caption: 'Evolución a gran escala del espacio-tiempo y filamentos galácticos',
          credit: 'NASA / ESA'
        }
      }
    ],
    linkedTestId: 'test_astro_14_15_u01',
    test: {
      id: 'test_astro_14_15_u01',
      lessonId: 'astro_14_15_u01_cosmology_cmb_lambda_cdm',
      disciplineId: 'astro',
      title: 'Evaluación Cuantitativa: Cosmología $\\Lambda\\text{-CDM}$',
      passScorePercent: 75,
      xpReward: 50,
      version: 1,
      status: 'published',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      questions: [
        {
          id: 1,
          type: 'choice',
          prompt: '¿Por qué el radio del Universo Observable mide ~46.500 millones de años luz si su edad es de 13.800 millones de años?',
          options: [
            'Porque el espacio-tiempo se ha expandido continuamente mientras los fotones viajaban hacia nosotros',
            'Porque la velocidad de la luz era infinitamente mayor en el pasado',
            'Porque los fotones se aceleran al cruzar campos gravitatorios',
            'Porque los instrumentos tienen un margen de error del 300%'
          ],
          correctAnswer: 0,
          explanation: 'La expansión métrica comóvil del espacio traslada el punto emisor original a una distancia actual de 46.500 millones de años luz.',
          difficulty: 'hard',
          xp: 35
        }
      ]
    },
    version: 1,
    status: 'published',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

// =========================================================================
// 6. MAPA MAESTRO POR TRAMOS Y HELPERS
// =========================================================================
export const ADAPTIVE_COSMOS_CATALOG_BY_TRANCHE: Record<AgeTranche, CurriculumUnit[]> = {
  '6-7': UNITS_6_7,
  '8-9': UNITS_8_9,
  '10-11': UNITS_10_11,
  '12-13': UNITS_12_13,
  '14-15': UNITS_14_15
};

export class AdaptiveCosmosCatalogService {
  /**
   * Obtiene las unidades didácticas específicas para un tramo de edad
   */
  public static getUnitsForTranche(tranche: AgeTranche): CurriculumUnit[] {
    return ADAPTIVE_COSMOS_CATALOG_BY_TRANCHE[tranche] || UNITS_8_9;
  }

  /**
   * Obtiene todas las unidades de todos los tramos
   */
  public static getAllUnits(): CurriculumUnit[] {
    return [
      ...UNITS_6_7,
      ...UNITS_8_9,
      ...UNITS_10_11,
      ...UNITS_12_13,
      ...UNITS_14_15
    ];
  }

  /**
   * Busca una unidad por su ID en todos los tramos
   */
  public static getUnitById(unitId: string): CurriculumUnit | undefined {
    return this.getAllUnits().find(u => u.id === unitId);
  }
}
