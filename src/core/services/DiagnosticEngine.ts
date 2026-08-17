/**
 * src/core/services/DiagnosticEngine.ts
 * Motor de Diagnóstico Inicial Adaptativo (6–15 años)
 * Calibra el punto de entrada pedagógico del estudiante mediante
 * un micro-test de 4 a 5 ítems de búsqueda conceptual por tramos de edad.
 */

import { 
  DiagnosticItem, 
  DiagnosticSession, 
  DiagnosticResult, 
  StudentLearningState,
  AgeTranche
} from '../types/adaptiveCurriculum';
import { PresentationEngine } from './PresentationEngine';
import { AdaptiveCosmosCatalogService } from '../../experiences/astro/data/adaptiveCosmosCatalog';

export const ASTRO_DIAGNOSTIC_BANK: DiagnosticItem[] = [
  // ==========================================
  // 6-7 años (Primaria 1º ciclo)
  // ==========================================
  {
    id: 'diag_astro_6_01',
    disciplineId: 'astro',
    conceptKey: 'tierra_redonda',
    ageTranche: '6-7',
    difficulty: 'easy',
    prompt: '¿Qué forma tiene nuestro planeta Tierra en el espacio? 🌍',
    options: [
      'Una esfera redonda como una pelota azul ⚽',
      'Plana como una moneda o una mesa 🪙',
      'Un cubo con esquinas cuadradas 📦'
    ],
    correctAnswer: 0,
    explanation: 'La Tierra es una gran esfera redonda que flota en el espacio.',
    targetUnitId: 'astro_6_7_u01_earth_shield'
  },
  {
    id: 'diag_astro_6_02',
    disciplineId: 'astro',
    conceptKey: 'dia_sol',
    ageTranche: '6-7',
    difficulty: 'easy',
    prompt: '¿Por qué se hace de noche en tu casa para dormir? 🌙',
    options: [
      'Porque la Tierra gira sobre sí misma como una peonza 🌍',
      'Porque el Sol se apaga y se va a dormir 😴',
      'Porque una nube gigante tapa el cielo ☁️'
    ],
    correctAnswer: 0,
    explanation: 'La Tierra está girando continuamente. Cuando nuestra parte queda de espaldas al Sol, es de noche.',
    targetUnitId: 'astro_6_7_u02_day_night'
  },
  {
    id: 'diag_astro_6_03',
    disciplineId: 'astro',
    conceptKey: 'sol_estrella',
    ageTranche: '6-7',
    difficulty: 'easy',
    prompt: '¿Qué es el Sol que brilla por la mañana? ☀️',
    options: [
      'Una estrella gigante muy caliente y brillante ☀️',
      'Un planeta hecho de roca y arena 🪨',
      'Un satélite como la Luna 🛰️'
    ],
    correctAnswer: 0,
    explanation: 'El Sol es una estrella luminosa en el centro de nuestro Sistema Solar.',
    targetUnitId: 'astro_6_7_u03_planets_family'
  },
  {
    id: 'diag_astro_6_04',
    disciplineId: 'astro',
    conceptKey: 'astronautas_espacio',
    ageTranche: '6-7',
    difficulty: 'easy',
    prompt: '¿Cómo se mueven los astronautas dentro de su nave espacial? 👨‍🚀',
    options: [
      'Flotando suavemente por el aire sin tocar el suelo 🤸',
      'Caminando con zapatos de plomo muy pesados 🥾',
      'Buceando en agua con tubo 🤿'
    ],
    correctAnswer: 0,
    explanation: 'Flotan porque viajan en caída libre continua alrededor de la Tierra.',
    targetUnitId: 'astro_6_7_u01_earth_shield'
  },

  // ==========================================
  // 8-9 años (Primaria 2º ciclo)
  // ==========================================
  {
    id: 'diag_astro_8_01',
    disciplineId: 'astro',
    conceptKey: 'linea_karman',
    ageTranche: '8-9',
    difficulty: 'medium',
    prompt: '¿A qué altitud se sitúa la Línea de Kármán donde comienza el espacio exterior?',
    options: [
      'A los 100 km de altura sobre el nivel del mar',
      'A los 10 km donde vuelan los aviones comerciales',
      'A 1.000.000 km de distancia'
    ],
    correctAnswer: 0,
    explanation: 'La Línea de Kármán a 100 km es el límite internacional acordado donde comienza el espacio.',
    targetUnitId: 'astro_8_9_u01_atmosphere_satellites'
  },
  {
    id: 'diag_astro_8_02',
    disciplineId: 'astro',
    conceptKey: 'eclipse_solar',
    ageTranche: '8-9',
    difficulty: 'medium',
    prompt: '¿Qué ocurre durante un Eclipse Total de Sol como el que ocurrirá en España en 2026?',
    options: [
      'La Luna se coloca exactamente entre el Sol y la Tierra, proyectando su sombra',
      'La Tierra se aleja tanto del Sol que se congela el cielo',
      'El Sol pasa por detrás de la Luna y de Marte a la vez'
    ],
    correctAnswer: 0,
    explanation: 'La Luna pasa entre el Sol y la Tierra y bloquea el disco solar durante unos minutos.',
    targetUnitId: 'astro_8_9_u02_eclipses_spain'
  },
  {
    id: 'diag_astro_8_03',
    disciplineId: 'astro',
    conceptKey: 'inclinacion_estaciones',
    ageTranche: '8-9',
    difficulty: 'medium',
    prompt: '¿Cuál es la causa principal de que tengamos cuatro estaciones (primavera, verano, otoño, invierno)?',
    options: [
      'La inclinación de 23,44° del eje de la Tierra mientras viaja alrededor del Sol',
      'Que la Tierra está mucho más cerca del Sol en verano',
      'Que el Sol arde con mayor potencia en los meses de verano'
    ],
    correctAnswer: 0,
    explanation: 'La inclinación axial hace que los rayos solares incidan más directos en verano.',
    targetUnitId: 'astro_8_9_u02_eclipses_spain'
  },
  {
    id: 'diag_astro_8_04',
    disciplineId: 'astro',
    conceptKey: 'planetas_sistema_solar',
    ageTranche: '8-9',
    difficulty: 'medium',
    prompt: '¿Cuántos planetas oficiales forman el Sistema Solar alrededor del Sol?',
    options: [
      '8 planetas (4 rocosos interiores y 4 gigantes exteriores)',
      '15 planetas todos rocosos',
      '3 planetas gigantes'
    ],
    correctAnswer: 0,
    explanation: 'El Sistema Solar cuenta con 8 planetas oficiales tras la reclasificación de Plutón.',
    targetUnitId: 'astro_8_9_u01_atmosphere_satellites'
  },

  // ==========================================
  // 10-11 años (Primaria 3º ciclo)
  // ==========================================
  {
    id: 'diag_astro_10_01',
    disciplineId: 'astro',
    conceptKey: 'gravedad_09g',
    ageTranche: '10-11',
    difficulty: 'medium',
    prompt: '¿Por qué flotan los astronautas en la Estación Espacial Internacional a 418 km de altura?',
    options: [
      'Porque están en caída libre continua a 27.600 km/h alrededor de la curvatura terrestre',
      'Porque a esa altitud la gravedad de la Tierra es exactamente 0',
      'Porque la nave contiene un gas antigravitatorio especial',
      'Porque la Luna tira de ellos con la misma fuerza que la Tierra'
    ],
    correctAnswer: 0,
    explanation: 'La gravedad a esa altura sigue siendo el 90% de la superficie; flotan por caída libre continua orbital.',
    targetUnitId: 'astro_10_11_u01_orbital_mechanics'
  },
  {
    id: 'diag_astro_10_02',
    disciplineId: 'astro',
    conceptKey: 'ano_luz_distancias',
    ageTranche: '10-11',
    difficulty: 'hard',
    prompt: '¿Qué mide exactamente un Año Luz en astrofísica?',
    options: [
      'La distancia recorrida por la luz en el vacío durante un año (~9,46 billones de km)',
      'El tiempo que tarda la Tierra en dar una vuelta completa al Sol',
      'El brillo fotométrico emitido por una estrella gigante',
      'La velocidad de una sonda espacial interestelar'
    ],
    correctAnswer: 0,
    explanation: 'El año luz es una unidad astronómica de longitud y distancia.',
    targetUnitId: 'astro_10_11_u01_orbital_mechanics'
  },

  // ==========================================
  // 12-13 años (ESO 1º ciclo)
  // ==========================================
  {
    id: 'diag_astro_12_01',
    disciplineId: 'astro',
    conceptKey: 'curva_rotacion_plana',
    ageTranche: '12-13',
    difficulty: 'hard',
    prompt: '¿Qué evidencia observacional demostró la existencia de un halo de Materia Oscura en la Vía Láctea?',
    options: [
      'Las curvas de rotación galácticas planas donde las estrellas exteriores giran a la misma velocidad (~220 km/s)',
      'Que el centro de la galaxia no emite radiación electromagnética',
      'Que las galaxias elípticas tienen formas geométricas esféricas',
      'Que los eclipses solares duran exactamente 2 minutos'
    ],
    correctAnswer: 0,
    explanation: 'La velocidad constante de rotación en los brazos exteriores requiere una masa invisible no bariónica.',
    targetUnitId: 'astro_12_13_u01_gravitation_black_holes'
  },
  {
    id: 'diag_astro_12_02',
    disciplineId: 'astro',
    conceptKey: 'sagitario_a_estrella',
    ageTranche: '12-13',
    difficulty: 'hard',
    prompt: '¿Qué tipo de objeto astronómico es Sagitario A* ubicado en el centro de la Vía Láctea?',
    options: [
      'Un agujero negro supermasivo de más de 4 millones de masas solares',
      'Una estrella gigante roja en fase de supernova',
      'Un cúmulo de 100 planetas rocosos errantes',
      'Una nebulosa de emisión de hidrógeno'
    ],
    correctAnswer: 0,
    explanation: 'Sagitario A* es el agujero negro supermasivo central de nuestra galaxia.',
    targetUnitId: 'astro_12_13_u01_gravitation_black_holes'
  },

  // ==========================================
  // 14-15 años (ESO 2º ciclo)
  // ==========================================
  {
    id: 'diag_astro_14_01',
    disciplineId: 'astro',
    conceptKey: 'fondo_microondas_cmb_2_725K',
    ageTranche: '14-15',
    difficulty: 'hard',
    prompt: '¿Por qué el diámetro del Universo Observable mide ~93.000 millones de años luz si su edad es de 13.800 millones de años?',
    options: [
      'Porque el propio tejido del espacio-tiempo se ha expandido continuamente mientras la luz viajaba',
      'Porque los fotones superan la velocidad c en el vacío intergaláctico',
      'Porque la constante cosmológica disminuye la velocidad temporal',
      'Porque el horizonte de eventos genera un efecto de lente gravitatoria infinito'
    ],
    correctAnswer: 0,
    explanation: 'La expansión métrica comóvil del espacio sitúa el horizonte de partículas actual en un radio de ~46.500 millones de al.',
    targetUnitId: 'astro_14_15_u01_cosmology_cmb_lambda_cdm'
  },
  {
    id: 'diag_astro_14_02',
    disciplineId: 'astro',
    conceptKey: 'energia_oscura_lambda_cdm',
    ageTranche: '14-15',
    difficulty: 'hard',
    prompt: 'En el modelo cosmológico estándar Lambda-CDM, ¿qué componente representa aproximadamente el 68% de la densidad de energía del Universo?',
    options: [
      'La Energía Oscura (constante cosmológica Lambda que acelera la expansión)',
      'La materia bariónica ordinaria (átomos, estrellas y planetas)',
      'La radiación de neutrinos primordiales',
      'El campo magnético intergaláctico'
    ],
    correctAnswer: 0,
    explanation: 'La Energía Oscura compone ~68% del Universo y es responsable de la expansión acelerada.',
    targetUnitId: 'astro_14_15_u01_cosmology_cmb_lambda_cdm'
  }
];

// =========================================================================
// BANCOS DE DIAGNÓSTICO PARA EL RESTO DE MINIAPPS
// =========================================================================

export const SCHOOL_DIAGNOSTIC_BANK: DiagnosticItem[] = [
  // 6-7
  {
    id: 'diag_school_6_01',
    disciplineId: 'school',
    conceptKey: 'mates_sumas_basicas',
    ageTranche: '6-7',
    difficulty: 'easy',
    prompt: 'Si tienes 4 manzanas 🍎 y recoges 3 manzanas más 🍎, ¿cuántas manzanas tienes en total?',
    options: ['7 manzanas', '6 manzanas', '8 manzanas'],
    correctAnswer: 0,
    explanation: '4 + 3 = 7 manzanas.',
    targetUnitId: 'school_u01_sumas'
  },
  {
    id: 'diag_school_6_02',
    disciplineId: 'school',
    conceptKey: 'ciencias_seres_vivos',
    ageTranche: '6-7',
    difficulty: 'easy',
    prompt: '¿Qué necesitan las plantas para crecer verdes y sanas? 🌿',
    options: ['Agua, luz del Sol y tierra con nutrientes ☀️', 'Caramelos y zumo de naranja 🍬', 'Solo oscuridad'],
    correctAnswer: 0,
    explanation: 'Las plantas realizan la fotosíntesis con luz solar, agua y minerales.',
    targetUnitId: 'school_u02_plantas'
  },
  // 8-9
  {
    id: 'diag_school_8_01',
    disciplineId: 'school',
    conceptKey: 'mates_multiplicacion',
    ageTranche: '8-9',
    difficulty: 'medium',
    prompt: 'Un paquete contiene 6 lápices de colores. Si compras 7 paquetes, ¿cuántos lápices tienes en total?',
    options: ['42 lápices', '36 lápices', '48 lápices', '35 lápices'],
    correctAnswer: 0,
    explanation: '6 × 7 = 42 lápices.',
    targetUnitId: 'school_u03_multiplicacion'
  },
  {
    id: 'diag_school_8_02',
    disciplineId: 'school',
    conceptKey: 'ciencias_ecosistemas',
    ageTranche: '8-9',
    difficulty: 'medium',
    prompt: 'En la cadena alimentaria de un bosque, ¿qué ser vivo actúa como organismo productor?',
    options: ['Los árboles y las plantas verdes (fotosíntesis)', 'El lobo ibérico', 'El conejo de campo', 'Las bacterias del suelo'],
    correctAnswer: 0,
    explanation: 'Las plantas producen su propio alimento mediante la fotosíntesis, iniciando la cadena trófica.',
    targetUnitId: 'school_u04_cadenas_troficas'
  },
  // 10-11
  {
    id: 'diag_school_10_01',
    disciplineId: 'school',
    conceptKey: 'mates_fracciones',
    ageTranche: '10-11',
    difficulty: 'medium',
    prompt: '¿Cuál es el resultado simplificado de sumar 1/4 + 2/4 de una pizza?',
    options: ['3/4 de pizza', '3/8 de pizza', '2/4 de pizza', '1 pizza entera'],
    correctAnswer: 0,
    explanation: 'Al tener el mismo denominador, sumamos numeradores: 1 + 2 = 3, quedando 3/4.',
    targetUnitId: 'school_u05_fracciones'
  },
  // 12-13
  {
    id: 'diag_school_12_01',
    disciplineId: 'school',
    conceptKey: 'mates_ecuaciones_1_grado',
    ageTranche: '12-13',
    difficulty: 'hard',
    prompt: 'Resuelve la ecuación: 3x - 5 = 16. ¿Cuál es el valor de x?',
    options: ['x = 7', 'x = 6', 'x = 8', 'x = 5'],
    correctAnswer: 0,
    explanation: '3x = 16 + 5 = 21 -> x = 21 / 3 = 7.',
    targetUnitId: 'school_u06_algebra'
  },
  // 14-15
  {
    id: 'diag_school_14_01',
    disciplineId: 'school',
    conceptKey: 'fisica_cinematica_newton',
    ageTranche: '14-15',
    difficulty: 'hard',
    prompt: 'Un vehículo se desplaza a una velocidad constante de 25 m/s durante 12 segundos. ¿Qué distancia total recorre?',
    options: ['300 metros', '250 metros', '320 metros', '150 metros'],
    correctAnswer: 0,
    explanation: 'd = v · t = 25 m/s · 12 s = 300 m.',
    targetUnitId: 'school_u07_cinematica'
  }
];

export const LANGUAGES_DIAGNOSTIC_BANK: DiagnosticItem[] = [
  // 6-7
  {
    id: 'diag_lang_6_01',
    disciplineId: 'languages',
    conceptKey: 'vocabulario_saludos_colores',
    ageTranche: '6-7',
    difficulty: 'easy',
    prompt: '¿Cómo dices "Hola, buenos días" a tu amigo en inglés? 🇬🇧',
    options: ['Hello, good morning! 👋', 'Goodbye, good night! 🌙', 'Thank you very much! 🙏'],
    correctAnswer: 0,
    explanation: 'Hello es Hola y Good Morning es Buenos Días.',
    targetUnitId: 'lang_u01_greetings'
  },
  // 8-9
  {
    id: 'diag_lang_8_01',
    disciplineId: 'languages',
    conceptKey: 'grammar_to_be_present',
    ageTranche: '8-9',
    difficulty: 'medium',
    prompt: 'Completa la frase: "She _____ an astronaut exploring the space station."',
    options: ['is', 'are', 'am', 'be'],
    correctAnswer: 0,
    explanation: 'Con la 3ª persona del singular (She/He/It) se usa el verbo "is".',
    targetUnitId: 'lang_u02_verb_to_be'
  },
  // 10-11
  {
    id: 'diag_lang_10_01',
    disciplineId: 'languages',
    conceptKey: 'grammar_present_continuous',
    ageTranche: '10-11',
    difficulty: 'medium',
    prompt: 'Which sentence correctly describes an action happening right now?',
    options: [
      'We are looking at Jupiter through the telescope right now.',
      'We look at Jupiter yesterday.',
      'We will looks at Jupiter now.',
      'We looking at Jupiter.'
    ],
    correctAnswer: 0,
    explanation: 'Present Continuous is formed with subject + verb to be + verb(-ing): "are looking".',
    targetUnitId: 'lang_u03_present_continuous'
  },
  // 12-13
  {
    id: 'diag_lang_12_01',
    disciplineId: 'languages',
    conceptKey: 'grammar_past_simple_irregular',
    ageTranche: '12-13',
    difficulty: 'hard',
    prompt: 'Complete with the correct irregular past: "Last year, the science team _____ (go) to the European observatory."',
    options: ['went', 'goed', 'gone', 'was gone'],
    correctAnswer: 0,
    explanation: 'The past simple of the irregular verb "go" is "went".',
    targetUnitId: 'lang_u04_past_simple'
  },
  // 14-15
  {
    id: 'diag_lang_14_01',
    disciplineId: 'languages',
    conceptKey: 'grammar_present_perfect_conditionals',
    ageTranche: '14-15',
    difficulty: 'hard',
    prompt: 'Choose the correct second conditional sentence:',
    options: [
      'If I had the opportunity, I would travel to Mars on the next mission.',
      'If I have the opportunity, I would traveled to Mars.',
      'If I will have the opportunity, I travel to Mars.',
      'If I had had the opportunity, I travel to Mars.'
    ],
    correctAnswer: 0,
    explanation: 'Second conditional structure: If + Past Simple, would + infinitive.',
    targetUnitId: 'lang_u05_conditionals'
  }
];

export const VERIFY_DIAGNOSTIC_BANK: DiagnosticItem[] = [
  // 6-8
  {
    id: 'diag_ver_8_01',
    disciplineId: 'verify',
    conceptKey: 'criterio_noticias_reales',
    ageTranche: '8-9',
    difficulty: 'medium',
    prompt: 'Ves un vídeo en internet que dice: "¡Descubren un dinosaurio vivo caminando por Madrid hoy!". ¿Qué es lo más prudente hacer?',
    options: [
      'Dudar, no compartirlo y contrastar la noticia en fuentes científicas y prensa oficial',
      'Compartirlo rápidamente con todos tus amigos para ser el primero',
      'Creérselo inmediatamente porque sale en un vídeo'
    ],
    correctAnswer: 0,
    explanation: 'Las afirmaciones extraordinarias requieren pruebas verificadas en fuentes oficiales.',
    targetUnitId: 'verify_u01_noticias_falsas'
  },
  // 10-11
  {
    id: 'diag_ver_10_01',
    disciplineId: 'verify',
    conceptKey: 'criterio_clickbait_titulares',
    ageTranche: '10-11',
    difficulty: 'medium',
    prompt: '¿Cuál de estos titulares es un ejemplo claro de "Clickbait" (cebo de clics sensacionalista)?',
    options: [
      '"¡NO TE CREERÁS lo que cayó del cielo en este pueblo! ¡MIRA EL VÍDEO ANTES DE QUE LO BORREN!"',
      '"El Instituto Geográfico Nacional registra un sismo de magnitud 2.3 en Granada"',
      '"La Agencia Espacial Europea publica el mapa de la misión Gaia"',
      '"El Ministerio de Educación publica el calendario escolar 2026-2027"'
    ],
    correctAnswer: 0,
    explanation: 'El clickbait utiliza mayúsculas, misterio exagerado y llamadas emocionales para forzar el clic.',
    targetUnitId: 'verify_u02_clickbait'
  },
  // 12-13
  {
    id: 'diag_ver_12_01',
    disciplineId: 'verify',
    conceptKey: 'criterio_busqueda_inversa',
    ageTranche: '12-13',
    difficulty: 'hard',
    prompt: 'Para verificar si una fotografía impactante de un supuesto accidente es real o antigua y sacada de contexto, ¿qué técnica forense digital es la más eficaz?',
    options: [
      'Realizar una búsqueda inversa de imágenes (Google Lens / TinEye) para encontrar la fecha y fuente original',
      'Preguntar en los comentarios del post de la red social',
      'Fijarse únicamente en cuántos "likes" tiene la publicación',
      'Hacer captura de pantalla y volver a subirla'
    ],
    correctAnswer: 0,
    explanation: 'La búsqueda inversa de imágenes localiza la primera publicación histórica del archivo y su autor original.',
    targetUnitId: 'verify_u03_forense_imagenes'
  },
  // 14-15
  {
    id: 'diag_ver_14_01',
    disciplineId: 'verify',
    conceptKey: 'criterio_sesgo_algoritmo',
    ageTranche: '14-15',
    difficulty: 'hard',
    prompt: 'En sociología digital, ¿qué es una "Cámara de Eco" (Echo Chamber) creada por los algoritmos de recomendación de redes sociales?',
    options: [
      'Un entorno donde el algoritmo sólo te muestra contenidos afines a tus opiniones previas, aislando visiones críticas',
      'Un fallo técnico del servidor de audio de la aplicación',
      'Una sala de chat con efecto de reverberación de voz',
      'Un filtro de seguridad que bloquea anuncios publicitarios'
    ],
    correctAnswer: 0,
    explanation: 'Los algoritmos optimizan el tiempo de retención mostrando solo lo que confirma tus sesgos previos.',
    targetUnitId: 'verify_u04_camaras_eco'
  }
];

export const AI_LAB_DIAGNOSTIC_BANK: DiagnosticItem[] = [
  // 8-9
  {
    id: 'diag_ai_8_01',
    disciplineId: 'ai-lab',
    conceptKey: 'ai_instrucciones_datos',
    ageTranche: '8-9',
    difficulty: 'medium',
    prompt: '¿Cómo aprende un modelo de Inteligencia Artificial a reconocer fotos de gatos? 🐱',
    options: [
      'Analizando miles de ejemplos de fotos de gatos identificando patrones y formas 📊',
      'Tiene ojos mágicos y cerebro biológico como una persona 🧠',
      'Nace sabiendo todo desde el primer día sin entrenar'
    ],
    correctAnswer: 0,
    explanation: 'La IA aprende mediante entrenamiento (Machine Learning) reconociendo patrones matemáticos en grandes conjuntos de datos.',
    targetUnitId: 'ailab_u01_como_aprende_ia'
  },
  // 10-11
  {
    id: 'diag_ai_10_01',
    disciplineId: 'ai-lab',
    conceptKey: 'ai_prompt_engineering_basico',
    ageTranche: '10-11',
    difficulty: 'medium',
    prompt: 'Para que un tutor de Inteligencia Artificial te dé la mejor respuesta para estudiar un examen, ¿cuál es el mejor prompt?',
    options: [
      '"Actúa como un profesor de ciencias de 5º de Primaria y explícame el ciclo del agua con un ejemplo cotidiano y 3 preguntas de práctica."',
      '"Dime cosas de ciencias."',
      '"Hazme la tarea rápido."'
    ],
    correctAnswer: 0,
    explanation: 'Un prompt efectivo incluye rol, contexto, tarea específica y formato de salida.',
    targetUnitId: 'ailab_u02_prompts_efectivos'
  },
  // 12-13
  {
    id: 'diag_ai_12_01',
    disciplineId: 'ai-lab',
    conceptKey: 'ai_alucinaciones_verificacion',
    ageTranche: '12-13',
    difficulty: 'hard',
    prompt: '¿Qué es una "alucinación" en un modelo de lenguaje de Inteligencia Artificial (LLM)?',
    options: [
      'Cuando el modelo genera información falsa o inventada con total apariencia de seguridad y coherencia gramatical',
      'Cuando la pantalla del ordenador parpadea con colores extraños',
      'Cuando el modelo se apaga por falta de memoria RAM',
      'Cuando la IA se vuelve consciente de sí misma'
    ],
    correctAnswer: 0,
    explanation: 'Los LLMs predicen la palabra más probable estadísticamente, lo que puede producir datos plausibles pero falsos.',
    targetUnitId: 'ailab_u03_alucinaciones_llm'
  },
  // 14-15
  {
    id: 'diag_ai_14_01',
    disciplineId: 'ai-lab',
    conceptKey: 'ai_etica_sesgos_algoritmicos',
    ageTranche: '14-15',
    difficulty: 'hard',
    prompt: '¿Por qué un sistema de Inteligencia Artificial puede presentar "sesgos algorítmicos" (bias) en sus predicciones?',
    options: [
      'Porque los datos históricos utilizados en su entrenamiento contienen prejuicios, desequilibrios o desigualdades humanas previas',
      'Porque los ordenadores tienen sentimientos y preferencias personales',
      'Porque el código binario 0 y 1 favorece a ciertos grupos sociales',
      'Porque la tarjeta gráfica se sobrecalienta'
    ],
    correctAnswer: 0,
    explanation: 'La IA refleja y amplifica los sesgos presentes en los datasets masivos con los que fue entrenada.',
    targetUnitId: 'ailab_u04_sesgos_y_etica'
  }
];

export const ALL_DIAGNOSTIC_ITEMS: DiagnosticItem[] = [
  ...ASTRO_DIAGNOSTIC_BANK,
  ...SCHOOL_DIAGNOSTIC_BANK,
  ...LANGUAGES_DIAGNOSTIC_BANK,
  ...VERIFY_DIAGNOSTIC_BANK,
  ...AI_LAB_DIAGNOSTIC_BANK
];

export class DiagnosticEngine {
  /**
   * Obtiene los ítems diagnósticos para un estudiante según disciplina y edad
   */
  public static getDiagnosticItemsForStudent(disciplineId: string, age: number): DiagnosticItem[] {
    const tranche = PresentationEngine.getTrancheForAge(age);
    const normalizedDisc = (disciplineId === 'criterio' ? 'verify' : disciplineId);
    
    let bank = ALL_DIAGNOSTIC_ITEMS.filter(item => item.disciplineId === normalizedDisc);
    if (bank.length === 0) {
      bank = ASTRO_DIAGNOSTIC_BANK;
    }

    const exactTrancheItems = bank.filter(i => i.ageTranche === tranche);
    const otherItems = bank.filter(i => i.ageTranche !== tranche);

    const selected = [...exactTrancheItems, ...otherItems].slice(0, 4);
    return selected.length >= 2 ? selected : bank.slice(0, 4);
  }

  public static getItems(disciplineId: string, age: number): DiagnosticItem[] {
    return this.getDiagnosticItemsForStudent(disciplineId, age);
  }

  /**
   * Evalúa el resultado del diagnóstico y selecciona la unidad de partida dentro del tramo
   */
  public static evaluateDiagnostic(
    userId: string,
    disciplineId: string,
    declaredAge: number,
    answers: Array<{ itemId: string; selectedOption: number; isCorrect: boolean; conceptKey: string }>
  ): DiagnosticResult {
    let correctCount = 0;
    const strengths: string[] = [];
    const weakConcepts: string[] = [];

    const tranche = PresentationEngine.getTrancheForAge(declaredAge);
    const trancheUnits = AdaptiveCosmosCatalogService.getUnitsForTranche(tranche);
    let fallbackUnitId = trancheUnits[0]?.id || 'astro_8_9_u01_atmosphere_satellites';

    answers.forEach(ans => {
      if (ans.isCorrect) {
        correctCount++;
        strengths.push(ans.conceptKey);
      } else {
        weakConcepts.push(ans.conceptKey);
        const item = ALL_DIAGNOSTIC_ITEMS.find(i => i.id === ans.itemId);
        if (item && item.targetUnitId) {
          fallbackUnitId = item.targetUnitId;
        }
      }
    });

    const percent = Math.round((correctCount / Math.max(1, answers.length)) * 100);
    
    // Asignación de unidad de inicio dentro de su tramo pedagógico
    let startUnitId = trancheUnits[0]?.id || fallbackUnitId;
    if (percent === 100 && trancheUnits.length > 1) {
      // Dominio total en diagnóstico inicial -> Avanzar a la unidad intermedia de su tramo
      startUnitId = trancheUnits[Math.min(trancheUnits.length - 1, 1)]?.id || trancheUnits[0]?.id;
    } else if (percent >= 50) {
      startUnitId = trancheUnits[0]?.id;
    } else {
      startUnitId = fallbackUnitId;
    }

    return {
      userId,
      disciplineId,
      estimatedAgeLevel: declaredAge,
      recommendedStartUnitId: startUnitId,
      detectedStrengths: strengths,
      detectedWeakConcepts: weakConcepts,
      initialMasteryPercent: percent
    };
  }

  /**
   * Crea el StudentLearningState a partir de la evaluación
   */
  public static createStudentStateFromResult(
    userId: string,
    disciplineId: string,
    declaredAge: number,
    declaredGrade: string,
    result: DiagnosticResult
  ): StudentLearningState {
    const conceptMastery: StudentLearningState['conceptMastery'] = {};

    result.detectedStrengths.forEach(cKey => {
      conceptMastery[cKey] = {
        conceptKey: cKey,
        scorePercent: 100,
        totalAttempts: 1,
        lastPracticedAt: Date.now(),
        status: 'mastered'
      };
    });

    result.detectedWeakConcepts.forEach(cKey => {
      conceptMastery[cKey] = {
        conceptKey: cKey,
        scorePercent: 30,
        totalAttempts: 1,
        lastPracticedAt: Date.now(),
        status: 'needs_reinforcement'
      };
    });

    return {
      userId,
      experienceId: 'astro',
      disciplineId,
      firstVisit: false,
      onboardingCompleted: true,
      age: declaredAge,
      grade: declaredGrade,
      diagnosticStatus: 'completed',
      diagnosticScore: result.initialMasteryPercent,
      diagnosticDate: Date.now(),
      estimatedAgeLevel: result.estimatedAgeLevel,
      recommendedStartUnitId: result.recommendedStartUnitId,
      currentUnitId: result.recommendedStartUnitId,
      completedUnitIds: [],
      conceptMastery,
      weakConcepts: result.detectedWeakConcepts,
      strengths: result.detectedStrengths,
      sessionHistory: [],
      lastActiveAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  public static createSession(userId: string, disciplineId: string, age: number, grade: string): DiagnosticSession {
    const items = this.getDiagnosticItemsForStudent(disciplineId, age);
    return {
      sessionId: `diag_${userId}_${Date.now()}`,
      userId,
      disciplineId,
      declaredAge: age,
      declaredGrade: grade,
      currentStep: 0,
      totalSteps: items.length,
      items,
      answers: [],
      isCompleted: false
    };
  }
}
