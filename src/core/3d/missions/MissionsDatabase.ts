/**
 * GOALS 3D Cosmos Engine - MissionsDatabase
 * Catálogo Pedagógico de Misiones Espaciales y Desafíos Formativos
 */

export interface MissionStep {
  id: string;
  instruction: string;
  targetKey: string;
  requiredMaxDistanceKm?: number;
  requiredScaleMode?: 'scientific' | 'didactic';
  hint: string;
}

export interface MissionQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  xpReward: number;
}

export interface SpaceMission {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  steps: MissionStep[];
  quiz: MissionQuiz;
  totalXp: number;
}

export const SPACE_MISSIONS: SpaceMission[] = [
  {
    id: 'mission_1_earth',
    number: 1,
    title: 'El Oasis Azul y su Escudo',
    subtitle: 'Misión 1/4 • Dinámica Terrestre y Terminador',
    badge: '🌍 Guardián Terrestre',
    description: 'Explora la Tierra desde el espacio, observa la atmósfera protectora de 100 km y descubre la franja del terminador solar donde el día se convierte en noche.',
    steps: [
      {
        id: 'step_1_focus_earth',
        instruction: 'Enfoca la Tierra y observa el manto de nubes y los continentes.',
        targetKey: 'earth',
        hint: 'Haz clic en el botón "🌍 Tierra" o tócala directamente en la escena 3D.'
      },
      {
        id: 'step_2_inspect_terminator',
        instruction: 'Gira la cámara hacia el lado derecho para ubicar el terminador solar y las luces nocturnas.',
        targetKey: 'earth',
        hint: 'Arrastra con el ratón o con un dedo para rotar la órbita de la cámara hacia la cara en sombra.'
      }
    ],
    quiz: {
      question: '¿Cuáles son los dos gases que componen más del 99% de la atmósfera terrestre protectora?',
      options: [
        'Oxígeno (80%) y Dióxido de Carbono (19%)',
        'Nitrógeno (78%) y Oxígeno (21%)',
        'Hidrógeno (75%) y Helio (24%)',
        'Argón (60%) y Metano (39%)'
      ],
      correctIndex: 1,
      explanation: 'La atmósfera terrestre está compuesta en un 78,08% por Nitrógeno molecular (N₂) y un 20,95% por Oxígeno (O₂), una mezcla perfecta que permite el agua líquida y filtra la radiación cósmica letal.',
      xpReward: 50
    },
    totalXp: 50
  },
  {
    id: 'mission_2_iss',
    number: 2,
    title: 'El Laboratorio Orbital Humano',
    subtitle: 'Misión 2/4 • Estación Espacial Internacional',
    badge: '🛰️ Comandante ISS',
    description: 'Navega hasta la ISS en órbita baja a 418 km de altitud y acércate a sus paneles solares fotovoltaicos para examinar su estructura de 109 metros.',
    steps: [
      {
        id: 'step_1_travel_iss',
        instruction: 'Viaja hacia la Estación Espacial Internacional (ISS).',
        targetKey: 'iss',
        hint: 'Selecciona "🛰️ ISS (5m)" en el navegador inferior.'
      },
      {
        id: 'step_2_close_zoom',
        instruction: 'Haz zoom extremo para situarte a menos de 50 metros de los módulos presurizados.',
        targetKey: 'iss',
        requiredMaxDistanceKm: 0.1, // Menos de 100 metros en escala de escena
        hint: 'Usa la rueda del ratón o haz pellizco con dos dedos en móvil para acercarte a los paneles.'
      }
    ],
    quiz: {
      question: '¿A qué velocidad media orbita la ISS y cuántos amaneceres presencian sus astronautas al día?',
      options: [
        'A 1.000 km/h y ven 1 amanecer cada 24 horas',
        'A 27.600 km/h (7,66 km/s) y presencian 16 amaneceres al día',
        'A 107.000 km/h y están en luz perpetua sin noches',
        'A 3.600 km/h y ven un amanecer cada 8 horas'
      ],
      correctIndex: 1,
      explanation: 'Para mantenerse en órbita baja sin caer a la Tierra, la ISS se desplaza a 7,66 km/s (27.600 km/h), completando una vuelta a la Tierra cada 92,9 minutos (16 órbitas y amaneceres diarios).',
      xpReward: 75
    },
    totalXp: 75
  },
  {
    id: 'mission_3_moon',
    number: 3,
    title: 'El Centinela de Mareas y Cráteres',
    subtitle: 'Misión 3/4 • Geología Lunar y Apolo 11',
    badge: '🌕 Pionero Lunar',
    description: 'Viaja a la Luna, activa la Escala Real 1:1 para experimentar el inmenso vacío de 384.400 km y explora el Mar de la Tranquilidad.',
    steps: [
      {
        id: 'step_1_travel_moon',
        instruction: 'Viaja hacia la Luna y observa sus llanuras basálticas (Mares).',
        targetKey: 'moon',
        hint: 'Selecciona "🌕 Luna" en el navegador de objetivos.'
      },
      {
        id: 'step_2_real_scale',
        instruction: 'Activa el modo "🔬 Real 1:1" para visualizar la distancia astronómica real.',
        targetKey: 'moon',
        requiredScaleMode: 'scientific',
        hint: 'Pulsa el botón "🔬 Real 1:1" en la esquina superior derecha.'
      }
    ],
    quiz: {
      question: '¿Por qué la Luna siempre muestra la misma cara visible hacia la Tierra?',
      options: [
        'Porque la Luna no rota sobre su propio eje',
        'Por el acoplamiento de marea: su periodo de rotación es idéntico al de traslación (~27,3 días)',
        'Porque el campo magnético del Sol la mantiene inmóvil',
        'Porque la cara oculta es más pesada y actúa como un lastre fijo'
      ],
      correctIndex: 1,
      explanation: 'La gravedad terrestre frenó gradualmente la rotación de la Luna a lo largo de eones hasta sincronizarla exactamente con su periodo orbital (27,3 días), un fenómeno físico llamado bloqueo o acoplamiento de marea.',
      xpReward: 100
    },
    totalXp: 100
  },
  {
    id: 'mission_4_jwst',
    number: 4,
    title: 'Los Ojos Infrarrojos del Universo',
    subtitle: 'Misión 4/4 • James Webb en el Punto L2',
    badge: '🌌 Astrónomo Profundo',
    description: 'Acompáñanos hasta el punto de Lagrange L2 a 1,5 millones de kilómetros para inspeccionar los 18 espejos hexagonales de berilio bañados en oro del telescopio James Webb.',
    steps: [
      {
        id: 'step_1_travel_jwst',
        instruction: 'Viaja hacia el Telescopio Espacial James Webb (JWST).',
        targetKey: 'jwst',
        hint: 'Selecciona "🌌 JWST L2" en el navegador.'
      }
    ],
    quiz: {
      question: '¿Por qué el telescopio James Webb debe situarse a 1,5 millones de km y operar a -233 °C?',
      options: [
        'Para evitar la gravedad de la Tierra y no caer al Sol',
        'Para observar en infrarrojo sin que el calor propio del telescopio ciegue sus detectores',
        'Para estar más cerca de la galaxia de Andrómeda',
        'Para utilizar el viento solar como combustible infinito'
      ],
      correctIndex: 1,
      explanation: 'Para detectar la tenue luz infrarroja de las primeras galaxias nacidas tras el Big Bang, los instrumentos del Webb deben estar ultra-enfriados a -233 °C (40 K), protegidos del calor del Sol, la Tierra y la Luna por su parasol de Kapton.',
      xpReward: 100
    },
    totalXp: 100
  }
];
