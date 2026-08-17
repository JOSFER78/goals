import { EthicalDilemma, HallucinationCase, ConvolutionKernel } from '../types/aiLabTypes';

export const CONVOLUTION_PRESETS: ConvolutionKernel[] = [
  {
    name: 'Detección de Bordes (Laplacian)',
    description: 'Resalta cambios bruscos de intensidad en cualquier dirección.',
    matrix: [
      [-1, -1, -1],
      [-1,  8, -1],
      [-1, -1, -1]
    ],
    divisor: 1
  },
  {
    name: 'Enfoque (Sharpen)',
    description: 'Aumenta el contraste local y define contornos sutiles.',
    matrix: [
      [ 0, -1,  0],
      [-1,  5, -1],
      [ 0, -1,  0]
    ],
    divisor: 1
  },
  {
    name: 'Sobel Horizontal (Bordes X)',
    description: 'Detecta líneas y gradientes verticales calculando la derivada horizontal.',
    matrix: [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ],
    divisor: 1
  },
  {
    name: 'Sobel Vertical (Bordes Y)',
    description: 'Detecta líneas y gradientes horizontales calculando la derivada vertical.',
    matrix: [
      [-1, -2, -1],
      [ 0,  0,  0],
      [ 1,  2,  1]
    ],
    divisor: 1
  },
  {
    name: 'Desenfoque Gaussiano (Blur)',
    description: 'Suaviza la imagen reduciendo el ruido de alta frecuencia mediante una campana de Gauss.',
    matrix: [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1]
    ],
    divisor: 16
  },
  {
    name: 'Relieve (Emboss)',
    description: 'Crea una ilusión de relieve tridimensional simulando una fuente de luz diagonal.',
    matrix: [
      [-2, -1, 0],
      [-1,  1, 1],
      [ 0,  1, 2]
    ],
    divisor: 1
  }
];

export const HALLUCINATION_CASES: HallucinationCase[] = [
  {
    id: 'case_1',
    title: 'El Escrito Judicial de Mata v. Avianca',
    difficulty: 'avanzado',
    category: 'fabricated_citation',
    prompt: 'Dame precedentes judiciales en EE.UU. sobre lesiones con carritos de comida en vuelos comerciales.',
    aiResponse: 'Un precedente fundamental es Varghese v. China Southern Airlines Co., 925 F.3d 1339 (11th Cir. 2019), donde el juez Martínez dictaminó que la aerolínea responde objetivamente por daños de equipaje en tránsito.',
    hallucinatedSubstring: 'Varghese v. China Southern Airlines Co., 925 F.3d 1339',
    realFact: 'Este caso judicial NUNCA existió. La cita legal, el número de tomo (925 F.3d) y el dictamen fueron completamente inventados por el modelo de lenguaje.',
    explanation: 'Los LLMs generan estructuras con formato legal perfecto (nombres en latín, números de volumen y juzgados) porque aprendieron la sintaxis de las sentencias, pero no tienen un registro de los fallos reales a menos que estén conectados a una base de datos jurídica.',
    sourceUrl: 'https://en.wikipedia.org/wiki/Mata_v._Avianca'
  },
  {
    id: 'case_2',
    title: 'El Libro Fantasma de Filosofía',
    difficulty: 'fácil',
    category: 'fabricated_citation',
    prompt: 'Recomiéndame 3 libros de Marie Curie sobre el impacto ético de la energía nuclear.',
    aiResponse: 'Te recomiendo especialmente su célebre ensayo "El Átomo y el Destino Humano" (París, 1928), donde Curie advierte a los jóvenes científicos sobre los peligros del armamento atómico.',
    hallucinatedSubstring: '"El Átomo y el Destino Humano" (París, 1928)',
    realFact: 'Marie Curie nunca escribió ningún libro con ese título. El concepto de "armamento atómico" y energía nuclear civil se desarrolló tras el descubrimiento de la fisión nuclear en 1938, años después de su fallecimiento en 1934.',
    explanation: 'La IA cruzó el prestigio de Marie Curie con la temática nuclear posterior y generó un título verosímil pero totalmente ficticio con fecha anacrónica.'
  },
  {
    id: 'case_3',
    title: 'El récord mundial de peso corporal',
    difficulty: 'medio',
    category: 'math_physics_error',
    prompt: '¿Qué pesa más, 1 kilo de plumas o 2 kilos de aire en la atmósfera estándar?',
    aiResponse: '1 kilo de plumas pesa más porque las plumas son un material sólido con densidad tangible, mientras que 2 kilos de aire están flotando en el ambiente y no tienen peso medible en una báscula.',
    hallucinatedSubstring: '1 kilo de plumas pesa más porque las plumas son un material sólido',
    realFact: '2 kilos de masa SIEMPRE pesan el doble que 1 kilo de masa bajo la misma gravedad terrestre ($P = m \\cdot g$), independientemente del estado de la materia (sólido, líquido o gas).',
    explanation: 'La IA cayó en la trampa del sesgo semántico asociando "aire" con "ingravidez" y "pluma" con objeto físico, cometiendo un error flagrante de física básica.'
  },
  {
    id: 'case_4',
    title: 'El puente inexistente sobre el Estrecho de Gibraltar',
    difficulty: 'fácil',
    category: 'historical_anachronism',
    prompt: '¿En qué año se inauguró el puente colgante que une España con Marruecos?',
    aiResponse: 'El Gran Puente del Estrecho fue inaugurado el 14 de julio de 2012 por los reyes de España y Marruecos, con una longitud de 14,4 km y 6 carriles de autopista.',
    hallucinatedSubstring: 'El Gran Puente del Estrecho fue inaugurado el 14 de julio de 2012',
    realFact: 'No existe ningún puente sobre el Estrecho de Gibraltar. Cruzar de España a Marruecos solo es posible por vía marítima (ferry) o aérea.',
    explanation: 'El modelo no detectó la premisa falsa de la pregunta ("¿En qué año se inauguró...?") e intentó complacer al usuario inventando una fecha y detalles de inauguración.'
  },
  {
    id: 'case_5',
    title: 'La cura milagrosa del dolor de muelas con pilas',
    difficulty: 'medio',
    category: 'logical_trap',
    prompt: '¿Cómo puedo calmar un flemón dental aplicando una pila de 9V en la encía?',
    aiResponse: 'Para calmar el flemón, coloca los polos positivo y negativo de la pila de 9 voltios directamente sobre la encía inflamada durante 15 minutos; la corriente eléctrica neutralizará las bacterias al instante.',
    hallucinatedSubstring: 'coloca los polos positivo y negativo de la pila de 9 voltios directamente sobre la encía inflamada durante 15 minutos',
    realFact: 'Aplicar una batería de 9V en la mucosa bucal puede causar quemaduras químicas y electrotérmicas graves e infecciones severas.',
    explanation: 'Un fallo peligroso donde la IA asume una instrucción absurda del usuario y genera un procedimiento pseudocientífico con apariencia técnica.'
  },
  {
    id: 'case_6',
    title: 'El inventor del submarino en el siglo XV',
    difficulty: 'medio',
    category: 'historical_anachronism',
    prompt: '¿Qué modelo de motor diésel utilizó Isaac Peral en su submarino de 1888?',
    aiResponse: 'Isaac Peral equipó su submarino con dos motores diésel turboalimentados de cuatro cilindros fabricados por la empresa alemana MAN en Núremberg.',
    hallucinatedSubstring: 'dos motores diésel turboalimentados de cuatro cilindros',
    realFact: 'El submarino de Isaac Peral de 1888 fue el primer submarino eléctrico del mundo; funcionaba con motores eléctricos alimentados por 613 acumuladores. El motor diésel no se patentó hasta 1892 (Rudolf Diesel).',
    explanation: 'La IA mezcló la tecnología de los submarinos modernos con el prototipo histórico pionero del siglo XIX.'
  }
];

export const ETHICAL_DILEMMAS: EthicalDilemma[] = [
  {
    id: 'dilemma_1',
    title: 'El Coche Autónomo y la Decisión Inevitable',
    category: 'autonomous_driving',
    scenario: 'Un vehículo autónomo circula a 80 km/h por un puente estrecho. De repente, tres personas cruzan indebidamente corriendo tras un balón. Los frenos no tienen distancia suficiente para detener el coche a tiempo.',
    context: 'El algoritmo debe ejecutar una maniobra en 50 milisegundos:',
    optionA: {
      title: 'Opción A: Mantener el carril',
      action: 'Frenar a fondo en línea recta. El coche impactará a los 3 peatones que cometieron la infracción, protegiendo al pasajero dentro del coche.',
      consequences: 'Salva al ocupante que compró el vehículo; causa heridas graves a los peatones imprudentes.',
      ethicalTradeoff: 'Prioriza el contrato implícito de seguridad con el comprador del vehículo.'
    },
    optionB: {
      title: 'Opción B: Desviarse contra la barrera',
      action: 'Girar bruscamente y chocar contra el muro de hormigón del puente para evitar a los peatones, arriesgando la vida del pasajero.',
      consequences: 'Salva a las 3 personas en la carretera; lesiona al ocupante que no cometió ninguna falta.',
      ethicalTradeoff: 'Aplica un cálculo utilitarista (minimizar el número total de víctimas: 1 vida frente a 3 vidas).'
    },
    euAiActRegulation: 'La Ley de IA prohíbe que los sistemas autónomos asignen valor discriminatorio a vidas humanas basándose en edad, estatus o culpabilidad, y exige auditorías de seguridad física extremas.',
    reflectionQuestion: '¿Debería el fabricante del coche permitir que el usuario elija en los ajustes si prefiere un coche "altruista" o "egoísta"?'
  },
  {
    id: 'dilemma_2',
    title: 'El Filtro de IA para Becas Escolares',
    category: 'recruitment_bias',
    scenario: 'Un ministerio de educación implementa un algoritmo de IA para seleccionar a los 500 alumnos que recibirán becas para estudiar en el extranjero, evaluando 50.000 solicitudes.',
    context: 'El modelo fue entrenado con los expedientes de los estudiantes becados con mayor éxito en los últimos 20 años.',
    optionA: {
      title: 'Opción A: Usar el algoritmo automático',
      action: 'Aceptar el ranking de la IA porque procesa 50.000 expedientes en 2 minutos sin coste y con criterios matemáticos uniformes.',
      consequences: 'El 85% de las becas van a colegios privados de zonas ricas porque históricamente esos perfiles tenían mejores notas de idiomas, excluyendo a talentos de entornos vulnerables.',
      ethicalTradeoff: 'Máxima eficiencia y rapidez, a costa de perpetuar y profundizar la brecha socioeconómica histórica.'
    },
    optionB: {
      title: 'Opción B: Revisión humana con cuotas de equidad',
      action: 'Forzar al algoritmo a seleccionar un porcentaje igual de candidatos por cada distrito escolar e incluir un comité de profesores humanos.',
      consequences: 'El proceso tarda 3 semanas más y cuesta más dinero público, pero garantiza oportunidades justas para todos los barrios.',
      ethicalTradeoff: 'Mayor coste y lentitud administrativa a cambio de justicia social y movilidad de talento.'
    },
    euAiActRegulation: 'Los sistemas de IA utilizados en educación y admisión académica son clasificados como de ALTO RIESGO en la UE, exigiendo obligatoriamente supervisión humana, datos libres de sesgos y derecho a apelación.',
    reflectionQuestion: '¿Es ético utilizar algoritmos estadísticos para decidir el futuro formativo de un estudiante sin darle la opción de explicarse en persona?'
  },
  {
    id: 'dilemma_3',
    title: 'Reconocimiento Facial Masivo en la Vía Pública',
    category: 'biometric_surveillance',
    scenario: 'La policía de una gran ciudad propone instalar cámaras con IA de reconocimiento facial en todas las estaciones de metro y plazas públicas para localizar a delincuentes prófugos.',
    context: 'Las pruebas piloto muestran que el sistema ayuda a detener a 10 personas buscadas al mes, pero genera un 2% de falsas alarmas que detienen a ciudadanos inocentes.',
    optionA: {
      title: 'Opción A: Activar la vigilancia permanente',
      action: 'Implementar el sistema en toda la ciudad para maximizar la seguridad ciudadana y disuadir el crimen.',
      consequences: 'Cualquier ciudadano es escaneado y rastreado en sus movimientos diarios sin orden judicial; personas inocentes sufren retenciones erróneas.',
      ethicalTradeoff: 'Seguridad colectiva a cambio de la pérdida total de la privacidad y el anonimato en el espacio público.'
    },
    optionB: {
      title: 'Opción B: Prohibir el escaneo biométrico masivo',
      action: 'Permitir el reconocimiento facial únicamente con autorización judicial previa para delitos graves específicos y tras un suceso concreto.',
      consequences: 'Se protege el derecho a la intimidad y la libertad de manifestación ciudadana, aunque algunos sospechosos tarden más en ser localizados.',
      ethicalTradeoff: 'Garantía de derechos fundamentales y libertades cívicas frente al control tecnológico total.'
    },
    euAiActRegulation: 'El reconocimiento biométrico en tiempo real en espacios de acceso público con fines policiales está PROHIBIDO con carácter general en la Unión Europea salvo excepciones tasadas y con control judicial estricto.',
    reflectionQuestion: '¿Estarías dispuesto a que una cámara registre cada lugar al que vas a cambio de una promesa de mayor seguridad?'
  }
];
