import { AIForensicCase, SocialFeedPost } from '../types';

export const AI_FORENSIC_CASES: AIForensicCase[] = [
  {
    id: 'hallucination-books',
    type: 'text_hallucination',
    title: 'La cita bibliográfica inexistente',
    scenario: 'Un estudiante le pide a la IA que cite 3 libros históricos sobre la alimentación de los dinosaurios en la Península Ibérica.',
    aiOutput: '«1. "Paleodietas del Cretácico Ibérico", Dr. Antonio Ruiz (2018), Ediciones Universidad de Salamanca.\n2. "Fósiles y Nutrición en Teruel", Dra. Elena Gómez (2021).\n3. "Herbívoros del Mesozoico Español", Instituto Paleontológico Nacional (2019).»',
    realFact: 'Ninguno de esos 3 libros existe en el ISBN ni en el catálogo de la Biblioteca Nacional. La IA combinó nombres de científicos y universidades reales para fabricar títulos que suenan convincentes.',
    inspectionClues: [
      'Búsqueda en Google Académico / ISBN con cero resultados.',
      'Títulos genéricos que encajan a la perfección con la pregunta.',
      'Fechas recientes (2018-2021) sin referencia a páginas ni editoriales reales.'
    ],
    howToCatch: 'Copia el título exacto entre comillas en Google o en el catálogo de la Biblioteca Nacional de España. Si no existe, es una alucinación.',
    difficulty: 'medio'
  },
  {
    id: 'synthetic-catastrophe',
    type: 'image_synthetic',
    title: 'La supuesta explosión en el Pentágono',
    scenario: 'Circula una imagen hiperrealista de una columna de humo negro gigante saliendo junto a un edificio gubernamental en Washington D.C., causando caídas momentáneas en la bolsa.',
    aiOutput: 'Imagen generada por IA que muestra una fachada blanca con humo denso y árboles circundantes.',
    realFact: 'El Departamento de Bomberos de Arlington y la policía del Pentágono confirmaron oficialmente que no hubo ninguna explosión ni incidente en la zona.',
    inspectionClues: [
      'Las columnas del edificio se doblan y fusionan de forma imposible.',
      'La valla metálica de seguridad desaparece en la acera.',
      'Ningún peatón ni vehículo de emergencia aparece en la imagen a pesar de la magnitud del humo.',
      'Cero cobertura en agencias de noticias oficiales sobre el terreno.'
    ],
    howToCatch: 'Analiza la geometría arquitectónica y busca confirmación de servicios de emergencia locales en Twitter/X antes de compartir imágenes de catástrofes.',
    difficulty: 'fácil'
  },
  {
    id: 'voice-ceo-transfer',
    type: 'voice_clone',
    title: 'La llamada del director financiero',
    scenario: 'El empleado de una empresa recibe una llamada telefónica con la voz exacta de su jefe pidiéndole que haga una transferencia bancaria urgente a una cuenta nueva para cerrar un contrato.',
    aiOutput: 'Audio sintético de 20 segundos con el timbre, pausas y acento idéntico al director de la compañía.',
    realFact: 'Los ciberdelincuentes utilizaron un software de clonación neuronal entrenado con grabaciones públicas de conferencias de YouTube del director.',
    inspectionClues: [
      'Falta de modulación emocional natural ante preguntas imprevistas.',
      'Urgencia artificial y negativa a realizar una videollamada.',
      'Petición de saltarse los protocolos de seguridad habituales de la empresa.'
    ],
    howToCatch: 'Establece un protocolo de verificación en dos pasos o una palabra clave de confirmación hablada que no esté publicada en internet.',
    difficulty: 'experto'
  }
];

export const SOCIAL_FEED_POSTS: SocialFeedPost[] = [
  {
    id: 'feed-1',
    authorName: 'Noticias Al Minuto 24h',
    authorHandle: '@noticias_urgentes_ok',
    authorAvatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=100&auto=format&fit=crop&q=80',
    verified: false,
    timeAgo: 'hace 4 min',
    content: '🚨 ¡ALERTA MÁXIMA! ¡Esto no te lo van a contar en la tele! Se filtra documento confidencial que cambiará todo. ¡Compártelo antes de que lo borren de las redes! 😱💥',
    category: 'sensational',
    stats: {
      likes: 14200,
      shares: 6800,
      comments: 2100
    },
    emotionalIntensity: 9,
    factualBacking: 1,
    algorithmImpact: 'Multiplica la retención por rabia y miedo (+40% exposición en feeds)'
  },
  {
    id: 'feed-2',
    authorName: 'Instituto Astrofísico & Espacio',
    authorHandle: '@astro_ciencia_oficial',
    authorAvatar: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100&auto=format&fit=crop&q=80',
    verified: true,
    timeAgo: 'hace 22 min',
    content: '🔭 El telescopio espacial James Webb publica los datos espectroscópicos del exoplaneta LHS 1140 b. Los datos sugieren una posible atmósfera rica en nitrógeno, aunque se requieren más observaciones para confirmar presencia de vapor de agua.',
    category: 'scientific',
    stats: {
      likes: 1200,
      shares: 340,
      comments: 45
    },
    emotionalIntensity: 2,
    factualBacking: 10,
    algorithmImpact: 'Bajo enganche emocional; requiere búsqueda activa o comunidades temáticas'
  },
  {
    id: 'feed-3',
    authorName: 'Gamer Pro Leaks',
    authorHandle: '@gamer_trucos_free',
    authorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&auto=format&fit=crop&q=80',
    verified: false,
    timeAgo: 'hace 35 min',
    content: '🎮 ¡Consigue 50.000 monedas y skins gratis por tiempo limitado! Solo tienes que entrar al enlace de mi biografía y seguir 3 pasos sencillos. ¡A mí me ha funcionado a la primera! 🎁👇',
    category: 'gaming',
    stats: {
      likes: 8900,
      shares: 3100,
      comments: 980
    },
    emotionalIntensity: 7,
    factualBacking: 0,
    algorithmImpact: 'Alto índice de clics salientes impulsado por promesas de recompensas gratuitas'
  },
  {
    id: 'feed-4',
    authorName: 'Debate Caliente TV',
    authorHandle: '@debate_extremo',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    verified: false,
    timeAgo: 'hace 1h',
    content: '🔥 ¿Es la generación actual la más vaga de la historia humana o las anteriores no entienden el mundo moderno? ¡Comenta y pelea abajo! 👇🤬',
    category: 'extreme_debate',
    stats: {
      likes: 22400,
      shares: 9800,
      comments: 14500
    },
    emotionalIntensity: 10,
    factualBacking: 2,
    algorithmImpact: 'Máxima amplificación algorítmica por volumen masivo de comentarios y confrontación'
  }
];
