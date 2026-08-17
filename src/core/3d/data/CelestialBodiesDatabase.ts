/**
 * GOALS 3D Cosmos Engine - CelestialBodiesDatabase
 * Base de Datos Astrofísica y Educativa Verificada (NASA / ESA / JPL)
 */

export interface Landmark {
  id: string;
  name: string;
  type: 'crater' | 'sea' | 'landing_site' | 'module' | 'instrument';
  coords: { lat: number; lon: number };
  description: string;
  significance: string;
}

export interface CelestialEntityInfo {
  key: string;
  name: string;
  category: 'planeta' | 'luna' | 'estacion' | 'telescopio' | 'satelite' | 'sistema';
  tagline: string;
  heroImage?: string;
  summary: string;
  stats: {
    diameter: string;
    mass: string;
    gravity: string;
    avgTemp: string;
    orbitalPeriod: string;
    orbitalSpeed: string;
    distanceOrAltitude: string;
  };
  structure: {
    layers: Array<{ name: string; desc: string; composition: string }>;
    atmosphere?: string;
  };
  exploration: {
    historicMissions: Array<{ name: string; year: string; agency: string; highlight: string }>;
  };
  landmarks?: Landmark[];
  didYouKnow: string[];
}

export const CELESTIAL_DATABASE: Record<string, CelestialEntityInfo> = {
  earth: {
    key: 'earth',
    name: 'Planeta Tierra',
    category: 'planeta',
    tagline: 'El Único Oasis de Vida Conocido en el Cosmos',
    summary: 'La Tierra es el tercer planeta desde el Sol y el único cuerpo celeste conocido que alberga vida. Su superficie está cubierta en un 71% por agua líquida y protegida por un campo magnético dipolar generado por su núcleo de hierro líquido.',
    stats: {
      diameter: '12.742 km',
      mass: '5,972 × 10²⁴ kg',
      gravity: '9,81 m/s² (1,0 g)',
      avgTemp: '15 °C (-89 °C a 58 °C)',
      orbitalPeriod: '365,256 días (1 Año)',
      orbitalSpeed: '29,78 km/s (107.200 km/h)',
      distanceOrAltitude: '149.597.870 km (1 AU)'
    },
    structure: {
      layers: [
        { name: 'Corteza', desc: 'Capa rocosa sólida exterior (5 a 70 km de espesor).', composition: 'Silicatos, granito y basalto.' },
        { name: 'Manto', desc: 'Roca semisólida que fluye lentamente por convección térmica.', composition: 'Peridotita rica en magnesio y hierro.' },
        { name: 'Núcleo Externo', desc: 'Hierro y níquel líquidos que generan la magnetosfera protectora.', composition: 'Fe (85%), Ni (5%), azufre y oxígeno.' },
        { name: 'Núcleo Interno', desc: 'Esfera metálica sólida a 5.400 °C sometida a presiones extremas.', composition: 'Aleación cristalina de hierro y níquel.' }
      ],
      atmosphere: '78,08% Nitrógeno (N₂), 20,95% Oxígeno (O₂), 0,93% Argón (Ar), 0,04% Dióxido de Carbono (CO₂) y vapor de agua.'
    },
    exploration: {
      historicMissions: [
        { name: 'Sputnik 1', year: '1957', agency: 'URSS', highlight: 'Primer satélite artificial en órbita terrestre.' },
        { name: 'Apolo 8', year: '1968', agency: 'NASA', highlight: 'Primera fotografía "Earthrise" (Salida de la Tierra) desde la Luna.' },
        { name: 'Flota Earth Observing System (EOS)', year: '1999-Act.', agency: 'NASA/ESA', highlight: 'Satélites Terra, Aqua y Landsat monitorizando el clima global.' }
      ]
    },
    didYouKnow: [
      'Si la Tierra no tuviera atmósfera ni efecto invernadero natural, su temperatura media global sería de -18 °C y los océanos estarían congelados.',
      'El campo magnético de la Tierra se extiende más de 60.000 km en el espacio, desviando el viento solar radiactivo hacia los polos donde crea las auroras.',
      'La Tierra no es una esfera perfecta: su rotación genera un ensanchamiento ecuatorial de 43 km en el diámetro.'
    ],
    landmarks: [
      {
        id: 'kennedy',
        name: 'Cabo Cañaveral (KSC)',
        type: 'landing_site',
        coords: { lat: 28.39, lon: -80.60 },
        description: 'Puerto espacial de la NASA en Florida desde donde despegaron las misiones Apolo, el Telescopio Hubble y el cohete SLS de Artemis.',
        significance: 'Cuna de la exploración espacial estadounidense.'
      },
      {
        id: 'chicxulub',
        name: 'Cráter de Chicxulub',
        type: 'crater',
        coords: { lat: 21.40, lon: -89.50 },
        description: 'Estructura de impacto de 180 km de diámetro causada por un asteroide de 10 km que provocó la extinción masiva del Cretácico hace 66 millones de años.',
        significance: 'El impacto cósmico más decisivo en la evolución de la vida.'
      },
      {
        id: 'baikonur',
        name: 'Cosmódromo de Baikonur',
        type: 'landing_site',
        coords: { lat: 45.96, lon: 63.30 },
        description: 'La base de lanzamiento espacial más antigua y activa del mundo. Desde aquí despegó el Sputnik 1 (1957) y Yuri Gagarin en el Vostok 1 (1961).',
        significance: 'Punto de partida de la era espacial tripulada.'
      },
      {
        id: 'kourou',
        name: 'Centro Espacial de Kourou',
        type: 'landing_site',
        coords: { lat: 5.23, lon: -52.77 },
        description: 'Puerto espacial de la Agencia Espacial Europea (ESA) situado cerca del ecuador para maximizar el impulso gravitatorio en los lanzamientos de Ariane 5 y el Telescopio James Webb.',
        significance: 'Eficiencia orbital óptima por rotación terrestre.'
      }
    ]
  },
  eclipses_2026: {
    key: 'eclipses_2026',
    name: 'Eclipses y el Gran Eclipse 2026',
    category: 'sistema',
    tagline: 'Alineamiento Cósmico, Sizigia y la Totalidad en España',
    summary: 'Los eclipses ocurren cuando el Sol, la Tierra y la Luna se alinean perfectamente en el espacio tridimensional (sizigia). El 12 de agosto de 2026, la Luna ocultará el 100% del disco solar en una franja que cruza la península ibérica.',
    stats: {
      diameter: '3.474 km (Luna) frente a 1.392.700 km (Sol)',
      mass: 'Coincidencia angular: 0,5° de tamaño aparente en el cielo',
      gravity: 'Inclinación orbital lunar: 5,14° respecto a la eclíptica',
      avgTemp: 'Descenso térmico de 5 a 10 °C bajo la sombra de la umbra',
      orbitalPeriod: 'Ciclo de Saros: 18 años, 11 días y 8 horas',
      orbitalSpeed: 'Velocidad de la sombra lunar: ~2.400 km/h sobre el suelo',
      distanceOrAltitude: '384.400 km de distancia media Tierra-Luna'
    },
    structure: {
      layers: [
        { name: 'Cono de Umbra', desc: 'Zona de oscuridad total donde el Sol queda 100% oculto.', composition: 'Sombra geométrica cónica de 100-300 km de ancho.' },
        { name: 'Cono de Penumbra', desc: 'Zona de eclipse parcial donde solo se oculta una fracción del Sol.', composition: 'Región periférica de atenuación lumínica.' },
        { name: 'Línea de Nodos Lunares', desc: 'Los dos puntos donde la órbita inclinada de la Luna corta el plano de la Tierra.', composition: 'Nodo ascendente y descendente requeridos para el alineamiento.' },
        { name: 'Corona Solar Visible', desc: 'Atmósfera externa de plasma solar visible solo durante la totalidad.', composition: 'Gas a 1-3 millones de grados K sostenido por campos magnéticos.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Expedición de Eddington (1919)', year: '1919', agency: 'Royal Astronomical Society', highlight: 'Comprobación de la Relatividad General de Einstein midiendo la curvatura de la luz estelar durante un eclipse total.' },
        { name: 'Observatorios SDO y Proba-3', year: '2024-2026', agency: 'ESA/NASA', highlight: 'Creación de coronografías artificiales en el espacio mediante vuelo en formación de satélites.' }
      ]
    },
    didYouKnow: [
      'El tamaño aparente del Sol y la Luna es exactamente el mismo (0,5°) porque el Sol es 400 veces más grande que la Luna pero está 400 veces más lejos.',
      'En el eclipse del 12 de agosto de 2026, España vivirá su primer eclipse solar total en más de un siglo (desde 1905).',
      'Durante los segundos previos a la totalidad se observan las "Perlas de Baily", destellos de luz solar que atraviesan los valles entre las montañas lunares.'
    ],
    landmarks: [
      {
        id: 'franja_burgos',
        name: 'Franja de Totalidad (Burgos)',
        type: 'landing_site',
        coords: { lat: 42.34, lon: -3.70 },
        description: 'Epicentro peninsular de la franja de totalidad con más de 1 minuto y 44 segundos de oscuridad diurna completa.',
        significance: 'Punto astronómico neurálgico del eclipse 2026 en España.'
      },
      {
        id: 'cabo_fisterra',
        name: 'Cabo de Fisterra (Galicia)',
        type: 'landing_site',
        coords: { lat: 42.91, lon: -9.26 },
        description: 'Punto de entrada peninsular donde la sombra de la Luna tocará tierra continental a más de 2.000 km/h.',
        significance: 'Primer contacto de la umbra con la península ibérica.'
      },
      {
        id: 'observatorio_teide',
        name: 'Observatorio del Teide (IAC)',
        type: 'landing_site',
        coords: { lat: 28.30, lon: -16.51 },
        description: 'Sede del Instituto de Astrofísica de Canarias para el estudio continuo de la física solar y la corona.',
        significance: 'Referente mundial en heliofísica y telescopios solares.'
      },
      {
        id: 'mallorca_sunset',
        name: 'Mallorca (Puesta de Sol)',
        type: 'landing_site',
        coords: { lat: 39.57, lon: 2.65 },
        description: 'El eclipse total ocurrirá con el Sol a solo 2° sobre el horizonte del mar Mediterráneo al atardecer.',
        significance: 'Espectáculo visual inigualable con la corona solar sobre el agua.'
      }
    ]
  },
  day_night_rotation: {
    key: 'day_night_rotation',
    name: 'Rotación Terrestre y Husos',
    category: 'planeta',
    tagline: 'El Giro Inercial de 24 Horas y la Medición del Tiempo',
    summary: 'La Tierra rota sobre su eje polar inclinado de Oeste a Este a una velocidad ecuatorial de 1.670 km/h. Este giro continuo genera la alternancia del día y la noche, el día sidéreo (23h 56m) y los 24 husos horarios UTC.',
    stats: {
      diameter: '12.742 km (Radio ecuatorial: 6.378 km)',
      mass: 'Velocidad ecuatorial: 1.670 km/h (465 m/s)',
      gravity: 'Aceleración centrífuga ecuatorial: 0,034 m/s²',
      avgTemp: 'Diferencia día/noche amortiguada por la atmósfera',
      orbitalPeriod: 'Día Sidéreo: 23 horas, 56 minutos y 4 segundos',
      orbitalSpeed: 'Día Solar Medio: 24 horas exactas (360° + ~1° de avance orbital)',
      distanceOrAltitude: '24 Husos Horarios de 15° de longitud cada uno'
    },
    structure: {
      layers: [
        { name: 'Eje de Rotación Inercial', desc: 'Línea imaginaria que une el Polo Norte y el Polo Sur apuntando hacia la estrella Polar.', composition: 'Orientación inercial estabilizada por el momento angular de la Tierra.' },
        { name: 'Terminador Solar (Línea Día/Noche)', desc: 'Frontera crepuscular móvil que separa la mitad iluminada de la mitad en sombra.', composition: 'Banda de transición con degradados Rayleigh de dispersión atmosférica.' },
        { name: '24 Husos Horarios (Meridianos)', desc: 'División geométrica de 15° de longitud por cada hora de giro terrestre.', composition: 'Sistema internacional UTC coordinado por relojes atómicos del BIPM.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Experimento de Eratóstenes (240 a.C.)', year: '240 a.C.', agency: 'Biblioteca de Alejandría', highlight: 'Primera medición geométrica del radio y perímetro de la Tierra utilizando la sombra de un palo en Siena y Alejandría.' },
        { name: 'Péndulo de Foucault (1851)', year: '1851', agency: 'Panteón de París', highlight: 'Demostración física directa de la rotación de la Tierra mediante la precesión del plano de oscilación del péndulo.' }
      ]
    },
    didYouKnow: [
      'Debido a que la Tierra se traslada alrededor del Sol mientras gira, necesita rotar unos 4 minutos adicionales cada día para que el Sol vuelva a estar en el cénit (por eso el día solar dura 24h y el sidéreo 23h 56m).',
      'En los polos la velocidad de rotación es de 0 km/h, mientras que en el ecuador es de 1.670 km/h.',
      'La rotación de la Tierra se frena unos 1,8 milisegundos cada siglo debido a la fricción de las mareas lunares.'
    ],
    landmarks: [
      {
        id: 'eratóstenes_alexandria',
        name: 'Alejandría y Siena (Eratóstenes)',
        type: 'landing_site',
        coords: { lat: 31.20, lon: 29.91 },
        description: 'Lugar donde Eratóstenes calculó la circunferencia terrestre con un error menor al 2% hace 2.200 años.',
        significance: 'Cuna de la geodesia y la astronomía matemática.'
      },
      {
        id: 'greenwich_meridian',
        name: 'Meridiano Real de Greenwich',
        type: 'landing_site',
        coords: { lat: 51.48, lon: 0.00 },
        description: 'Punto cero de longitud geográfica (0° 0\' 0") que define el Tiempo Universal Coordinado (UTC).',
        significance: 'Referencia horaria fundamental de la navegación global.'
      },
      {
        id: 'equador_line',
        name: 'Ecuador Terrestre (Quito)',
        type: 'landing_site',
        coords: { lat: 0.00, lon: -78.45 },
        description: 'Línea de máxima velocidad tangencial de rotación (1.670 km/h) y latitud 0°.',
        significance: 'Ubicación óptima para el impulso de despegues espaciales.'
      },
      {
        id: 'north_pole_axis',
        name: 'Polo Norte Geográfico',
        type: 'landing_site',
        coords: { lat: 90.00, lon: 0.00 },
        description: 'Extremo norte del eje de rotación donde todas las líneas de longitud convergen y el cielo gira en círculo plano.',
        significance: 'Punto de referencia inercial del giro planetario.'
      }
    ]
  },
  kepler_orbit: {
    key: 'kepler_orbit',
    name: 'Traslación Anual Kepleriana',
    category: 'sistema',
    tagline: 'Las Leyes de Kepler, Afelio, Perihelio y la Velocidad Orbital',
    summary: 'La Tierra describe una elipse kepleriana alrededor del Sol a una velocidad media de 107.200 km/h (29,78 km/s). En el perihelio (enero) se mueve a 30,3 km/s y en el afelio (julio) a 29,3 km/s, barriendo áreas iguales en tiempos iguales.',
    stats: {
      diameter: 'Semieje mayor: 149.597.870 km (1,000 UA)',
      mass: 'Excentricidad orbital: e = 0,0167 (casi circular)',
      gravity: 'Fuerza centrípeta provista por la gravitación solar',
      avgTemp: 'Insolación solar: 1.413 W/m² (Perihelio) a 1.321 W/m² (Afelio)',
      orbitalPeriod: 'Año Sidéreo: 365,25636 días solares',
      orbitalSpeed: 'Velocidad Orbital: 29,29 km/s (Afelio) a 30,29 km/s (Perihelio)',
      distanceOrAltitude: 'Distancia Solar: 147,1 Mkm (Enero) a 152,1 Mkm (Julio)'
    },
    structure: {
      layers: [
        { name: '1ª Ley de Kepler (Órbita Elíptica)', desc: 'La órbita es una elipse con el Sol ubicado en uno de los dos focos.', composition: 'Geometría cónica elíptica de baja excentricidad.' },
        { name: '2ª Ley de Kepler (Ley de las Áreas)', desc: 'El radio vector barre áreas iguales en intervalos de tiempo iguales (conservación del momento angular).', composition: 'Velocidad orbital variable más rápida cerca del Sol.' },
        { name: '3ª Ley de Kepler (Ley Armónica)', desc: 'El cuadrado del periodo orbital es proporcional al cubo del semieje mayor: P² = a³.', composition: 'Relación física universal para todos los cuerpos en órbita.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Johannes Kepler (1609-1619)', year: '1609', agency: 'Astronomía Nova', highlight: 'Formulación de las 3 leyes del movimiento planetario a partir de las observaciones de Marte de Tycho Brahe.' },
        { name: 'Parker Solar Probe (NASA)', year: '2018-2026', agency: 'NASA', highlight: 'La nave más rápida de la historia (700.000 km/h) volando a través de la corona solar.' }
      ]
    },
    didYouKnow: [
      'La Tierra está 5 millones de kilómetros más cerca del Sol en enero (pleno invierno en Europa) que en julio, demostrando que la distancia no causa las estaciones.',
      'En el segundo que tardas en leer esta frase, la Tierra ha recorrido 30 kilómetros en el espacio en su órbita alrededor del Sol.',
      'Si el Sol desapareciera instantáneamente, la Tierra continuaría en línea recta por la tangente orbital a 30 km/s tras 8 minutos y 20 segundos.'
    ],
    landmarks: [
      {
        id: 'perihelio_point',
        name: 'Punto de Perihelio (Enero - 147 Mkm)',
        type: 'landing_site',
        coords: { lat: 0.00, lon: 0.00 },
        description: 'Punto de máximo acercamiento al Sol a 147,1 millones de km con velocidad máxima de 30,29 km/s.',
        significance: 'Máxima aceleración orbital en el invierno boreal.'
      },
      {
        id: 'afelio_point',
        name: 'Punto de Afelio (Julio - 152 Mkm)',
        type: 'landing_site',
        coords: { lat: 0.00, lon: 180.00 },
        description: 'Punto de máximo alejamiento al Sol a 152,1 millones de km con velocidad orbital mínima de 29,29 km/s.',
        significance: 'Mínima velocidad orbital en el verano boreal.'
      },
      {
        id: 'foco_solar',
        name: 'Foco Solar Kepleriano',
        type: 'landing_site',
        coords: { lat: 15.00, lon: 45.00 },
        description: 'Posición física del centro de masa solar en uno de los dos focos de la elipse orbital.',
        significance: 'Epicentro gravitatorio del Sistema Solar.'
      },
      {
        id: 'parker_probe',
        name: 'Vector Sonda Parker Solar Probe',
        type: 'landing_site',
        coords: { lat: -20.00, lon: -60.00 },
        description: 'Trayectoria hiperbólica de asistencia gravitatoria en Venus para sumergirse en la corona solar a 700.000 km/h.',
        significance: 'Hito tecnológico de velocidad orbital extrema.'
      }
    ]
  },
  seasons_obliquity: {
    key: 'seasons_obliquity',
    name: 'Estaciones y Oblicuidad 23,44°',
    category: 'planeta',
    tagline: 'La Inclinación Axial, la Ley de Lambert y los Solsticios',
    summary: 'Las estaciones del año se producen exclusivamente por la inclinación de 23,44° del eje de rotación terrestre. Esta oblicuidad varía el ángulo de incidencia de los rayos solares (Ley del Coseno de Lambert: I = I₀ · cos θ) y la duración de las horas de luz.',
    stats: {
      diameter: 'Oblicuidad axial: 23° 26\' 14" (23,44°)',
      mass: 'Estabilidad giroscópica asegurada por la masa de la Luna',
      gravity: 'Precesión de los equinoccios: 25.772 años por ciclo',
      avgTemp: 'Diferencia estacional de hasta 40 °C en latitudes templadas',
      orbitalPeriod: 'Año Trópico: 365,2422 días (de equinoccio a equinoccio)',
      orbitalSpeed: 'Insolación Cenital: 1.361 W/m² en el cénit estacional',
      distanceOrAltitude: 'Variación de luz diurna de 0h a 24h en círculos polares'
    },
    structure: {
      layers: [
        { name: 'Solsticio de Junio (Verano Norte / Invierno Sur)', desc: 'El hemisferio norte se inclina hacia el Sol; rayos perpendiculares en el Trópico de Cáncer.', composition: 'Máxima concentración de energía y día más largo en Europa.' },
        { name: 'Solsticio de Diciembre (Invierno Norte / Verano Sur)', desc: 'El hemisferio norte se inclina lejos del Sol; rayos perpendiculares en el Trópico de Capricornio.', composition: 'Rayos oblicuos y noche más larga en Europa.' },
        { name: 'Equinoccios de Marzo y Septiembre', desc: 'Ningún hemisferio está inclinado hacia el Sol; rayos perpendiculares en el Ecuador.', composition: 'Día y noche duran exactamente 12 horas en todo el planeta.' },
        { name: 'Estabilizador Lunar', desc: 'La masa de la Luna evita que el eje de la Tierra oscile caóticamente como en Marte.', composition: 'Fuerza de marea que estabiliza el clima planetario a largo plazo.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Satélites CERES (NASA)', year: '2000-2026', agency: 'NASA / NOAA', highlight: 'Medición continua del balance de radiación solar y energía térmica absorbida por la Tierra.' }
      ]
    },
    didYouKnow: [
      'Si el eje de la Tierra no estuviera inclinado (0°), no existirían las estaciones y todos los días del año tendrían exactamente 12 horas de luz y 12 de oscuridad.',
      'En el Polo Norte el Sol no se pone durante 6 meses seguidos en verano y no sale durante 6 meses en invierno.',
      'El eje de la Tierra realiza un bamboleo como una peonza llamado precesión de los equinoccios que tarda 25.772 años en completar una vuelta.'
    ],
    landmarks: [
      {
        id: 'tropico_cancer',
        name: 'Trópico de Cáncer (23.44° N)',
        type: 'landing_site',
        coords: { lat: 23.44, lon: 0.00 },
        description: 'Latitud donde el Sol se sitúa en el cénit exacto a 90° al mediodía durante el Solsticio de Junio.',
        significance: 'Límite boreal de la radiación solar cenital directa.'
      },
      {
        id: 'tropico_capricornio',
        name: 'Trópico de Capricornio (23.44° S)',
        type: 'landing_site',
        coords: { lat: -23.44, lon: 0.00 },
        description: 'Latitud donde el Sol se sitúa en el cénit exacto al mediodía durante el Solsticio de Diciembre.',
        significance: 'Límite austral de la radiación solar cenital directa.'
      },
      {
        id: 'equador_equinox',
        name: 'Ecuador Cenital (Equinoccios)',
        type: 'landing_site',
        coords: { lat: 0.00, lon: 0.00 },
        description: 'Lugar donde el Sol cruza el ecuador celeste el 21 de marzo y el 23 de septiembre igualando el día y la noche.',
        significance: 'Punto de equilibrio solar global.'
      },
      {
        id: 'arctic_circle',
        name: 'Círculo Polar Ártico (66.56° N)',
        type: 'landing_site',
        coords: { lat: 66.56, lon: 15.00 },
        description: 'Frontera geográfica a partir de la cual ocurre el fenómeno del Sol de Medianoche en verano y la Noche Polar en invierno.',
        significance: 'Límite de la noche y el día continuo.'
      }
    ]
  },
  moon: {
    key: 'moon',
    name: 'La Luna',
    category: 'luna',
    tagline: 'El Centinela Nocturno y Testigo de la Historia Cósmica',
    summary: 'La Luna es el único satélite natural de la Tierra y el quinto más grande del Sistema Solar. Se encuentra en acoplamiento de marea síncrono con la Tierra, lo que significa que siempre muestra la misma cara hacia nuestro planeta.',
    stats: {
      diameter: '3.474,8 km (0,27 Tierras)',
      mass: '7,342 × 10²² kg (1/81 de la Tierra)',
      gravity: '1,62 m/s² (0,166 g)',
      avgTemp: '-20 °C (-233 °C noche a 123 °C día)',
      orbitalPeriod: '27,32 días (Mes Sidéreo)',
      orbitalSpeed: '1,022 km/s (3.679 km/h)',
      distanceOrAltitude: '384.400 km (~30 Tierras)'
    },
    structure: {
      layers: [
        { name: 'Regolito y Corteza', desc: 'Polvo fino y rocas fragmentadas por miles de millones de impactos.', composition: 'Anortosita, basalto y silicatos de aluminio.' },
        { name: 'Manto Lunar', desc: 'Manto rígido y frío sin placas tectónicas activas.', composition: 'Olivino, piroxeno e ilmenita.' },
        { name: 'Núcleo Pequeño', desc: 'Pequeño núcleo metálico parcialmente fundido.', composition: 'Hierro metálico con trazas de azufre y níquel.' }
      ],
      atmosphere: 'Prácticamente nula (Exosfera extremadamente tenue de helio, argón y sodio).'
    },
    exploration: {
      historicMissions: [
        { name: 'Luna 2', year: '1959', agency: 'URSS', highlight: 'Primer artefacto humano en impactar la superficie lunar.' },
        { name: 'Apolo 11', year: '1969', agency: 'NASA', highlight: 'Primeros seres humanos (Neil Armstrong y Buzz Aldrin) caminan sobre la Luna.' },
        { name: 'Chang\'e 4', year: '2019', agency: 'CNSA', highlight: 'Primer alunizaje con éxito en la cara oculta de la Luna.' },
        { name: 'Programa Artemis', year: '2024-2028', agency: 'NASA/ESA/JAXA', highlight: 'Regreso sostenible a la superficie y establecimiento de la estación lunar Gateway.' }
      ]
    },
    landmarks: [
      {
        id: 'sea_of_tranquility',
        name: 'Mar de la Tranquilidad (Mare Tranquillitatis)',
        type: 'sea',
        coords: { lat: 8.5, lon: 31.4 },
        description: 'Vasta llanura basáltica formada por antiguas erupciones de lava tras un impacto gigantesco.',
        significance: 'Lugar exacto del alunizaje del módulo lunar Eagle de la misión Apolo 11 en julio de 1969.'
      },
      {
        id: 'tycho_crater',
        name: 'Cráter Tycho',
        type: 'crater',
        coords: { lat: -43.3, lon: -11.2 },
        description: 'Cráter de impacto prominente de 85 km de diámetro con un sistema de rayos brillantes de 1.500 km.',
        significance: 'Uno de los cráteres más jóvenes de la Luna (~108 millones de años), visible a simple vista desde la Tierra.'
      },
      {
        id: 'copernicus_crater',
        name: 'Cráter Copérnico',
        type: 'crater',
        coords: { lat: 9.6, lon: -20.1 },
        description: 'Cráter con paredes aterrazadas de 3.800 metros de profundidad y tres picos montañosos centrales.',
        significance: 'Referencia fundamental para la estratigrafía y datación geológica de la era Copernicana lunar.'
      }
    ],
    didYouKnow: [
      'La Luna se aleja de la Tierra a un ritmo constante de 3,8 centímetros al año debido a la fricción gravitatoria de las mareas oceánicas.',
      'En los cráteres en sombra permanente de los polos lunares existen depósitos de cientos de millones de toneladas de hielo de agua pura.',
      'Las huellas dejadas por los astronautas del Apolo permanecerán intactas durante millones de años porque en la Luna no hay viento ni lluvia que las erosione.'
    ]
  },
  iss: {
    key: 'iss',
    name: 'Estación Espacial Internacional (ISS)',
    category: 'estacion',
    tagline: 'El Mayor Laboratorio y Puesto de Avanzada Humano en Órbita',
    summary: 'La ISS es un centro de investigación en microgravedad continuamente habitado desde noviembre del año 2000. Representa la mayor colaboración científica multinacional de la historia humana (NASA, Roscosmos, ESA, JAXA y CSA).',
    stats: {
      diameter: '109 m × 73 m (Tamaño de un campo de fútbol)',
      mass: '450.000 kg (450 Toneladas métricas)',
      gravity: 'Microgravedad (0,000001 g efectiva en caída libre)',
      avgTemp: 'Controlada internamente a 24 °C (-150 °C a 120 °C exterior)',
      orbitalPeriod: '92,9 minutos (16 amaneceres al día)',
      orbitalSpeed: '7,66 km/s (27.600 km/h)',
      distanceOrAltitude: '418 km (Órbita Terrestre Baja - LEO)'
    },
    structure: {
      layers: [
        { name: 'Módulos Presurizados', desc: 'Módulos habitables donde los astronautas viven, duermen y realizan experimentos.', composition: 'Aleación de aluminio-litio 2219 con blindaje Whipple antimeteoroides.' },
        { name: 'Estructura Integrada Truss (ITS)', desc: 'Viga de titanio de 109 metros que soporta los paneles solares y radiadores térmicos.', composition: 'Titanio, fibra de carbono y aluminio estructural.' },
        { name: 'Paneles Solares Fotovoltaicos (SAW)', desc: '8 alas de paneles solares que generan entre 84 y 120 kilovatios de electricidad continua.', composition: 'Células de silicio monocristalino e iROSA de arseniuro de galio.' },
        { name: 'Cúpula de Observación (Cupola)', desc: 'Módulo con 7 ventanas de cristal blindado para monitorizar actividades extravehiculares y observar la Tierra.', composition: 'Vidrio de cuarzo fundido con obturadores de aluminio.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Lanzamiento de Zarya', year: '1998', agency: 'Roscosmos/NASA', highlight: 'Puesta en órbita del primer módulo de propulsión y almacenamiento.' },
        { name: 'Expedición 1', year: '2000', agency: 'Multinacional', highlight: 'Llegada de la primera tripulación permanente (Shepherd, Gidzenko, Krikalev).' },
        { name: 'Instalación de la Cúpula', year: '2010', agency: 'ESA/NASA', highlight: 'Instalación del mayor observatorio óptico panorámico en el espacio.' }
      ]
    },
    didYouKnow: [
      'Los astronautas en la ISS experimentan 16 amaneceres y 16 atardeceres cada 24 horas debido a su velocidad de 27.600 km/h.',
      'El 98% del agua a bordo (incluyendo el sudor y la orina de la tripulación) se purifica y recicla continuamente en agua potable mediante el sistema ECLSS.',
      'La ISS ha sido visitada por más de 270 astronautas de 20 países diferentes y ha albergado más de 3.000 investigaciones científicas punteras.'
    ]
  },
  hubble: {
    key: 'hubble',
    name: 'Telescopio Espacial Hubble (HST)',
    category: 'telescopio',
    tagline: 'La Ventana que Redefinió Nuestra Comprensión del Universo',
    summary: 'Lanzado en 1990 por el transbordador Discovery, el Hubble orbita por encima de la atmósfera distorsionadora de la Tierra, capturando imágenes ultra-nítidas en luz ultravioleta, visible e infrarrojo cercano que han transformado la astrofísica moderna.',
    stats: {
      diameter: '13,2 m de largo • Espejo de 2,4 m',
      mass: '11.110 kg (11,1 Toneladas)',
      gravity: 'Caída libre orbital',
      avgTemp: 'Radiadores a -80 °C en instrumentos',
      orbitalPeriod: '95,4 minutos',
      orbitalSpeed: '7,59 km/s (27.300 km/h)',
      distanceOrAltitude: '535 km de altitud (Inclinación 28,47°)'
    },
    structure: {
      layers: [
        { name: 'Tubo Óptico Ritchey-Chrétien', desc: 'Configuración óptica de dos espejos hiperbólicos de alta precisión.', composition: 'Espejo primario de vidrio ULE (Ultra Low Expansion) bañado en aluminio y fluoruro de magnesio.' },
        { name: 'Wide Field Camera 3 (WFC3)', desc: 'Cámara principal panorámica para capturar nebulosas, galaxias y cúmulos estelares.', composition: 'Detectores CCD de silicio y detectores infrarrojos HgCdTe.' },
        { name: 'Giroscopios de Guiado Fino (FGS)', desc: 'Sensores de estabilidad capaces de apuntar a un objetivo con una precisión de 0,007 segundos de arco.', composition: 'Sistemas electromecánicos de precisión giroscópica.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Lanzamiento STS-31', year: '1990', agency: 'NASA', highlight: 'Puesta en órbita a bordo del transbordador espacial Discovery.' },
        { name: 'Misión de Servicio 1 (SM1)', year: '1993', agency: 'NASA', highlight: 'Instalación de la óptica correctiva COSTAR para reparar la aberración esférica del espejo.' },
        { name: 'Hubble Deep Field', year: '1995', agency: 'STScI', highlight: 'Exposición histórica de 10 días que reveló más de 3.000 galaxias en una porción de cielo aparentemente vacía.' }
      ]
    },
    didYouKnow: [
      'La precisión de apuntamiento del Hubble equivale a mantener un puntero láser enfocado sobre una moneda de 1 euro situada a 320 kilómetros de distancia.',
      'Los datos del Hubble han servido para calcular con exactitud la edad del Universo en 13.800 millones de años y descubrir que la expansión cósmica se está acelerando.',
      'Ha realizado más de 1,5 millones de observaciones científicas y generado más de 18.000 artículos de investigación arbitrados por pares.'
    ]
  },
  landsat: {
    key: 'landsat',
    name: 'Landsat 9 (Observación Terrestre)',
    category: 'satelite',
    tagline: 'Medición de la Salud y los Recursos de Nuestro Planeta',
    summary: 'Landsat 9 es el satélite más avanzado del programa de observación terrestre continuo más longevo de la historia (iniciado en 1972). Captura imágenes multiespectrales de toda la superficie terrestre cada 16 días.',
    stats: {
      diameter: '3,0 m × 3,1 m × 4,2 m',
      mass: '2.711 kg',
      gravity: 'Caída libre orbital',
      avgTemp: 'Sensores térmicos enfriados a -230 °C',
      orbitalPeriod: '98,8 minutos',
      orbitalSpeed: '7,50 km/s (27.000 km/h)',
      distanceOrAltitude: '705 km (Órbita Heliosíncrona • 98,2°)'
    },
    structure: {
      layers: [
        { name: 'Sensor OLI-2 (Operational Land Imager 2)', desc: 'Radiómetro multiespectral que captura 9 bandas del espectro visible, infrarrojo cercano y de onda corta con resolución radiométrica de 14 bits.', composition: 'Detectores de plano focal de silicio y arseniuro de indio-galio (InGaAs).' },
        { name: 'Sensor TIRS-2 (Thermal Infrared Sensor 2)', desc: 'Sensor infrarrojo térmico de 2 bandas para medir la temperatura de la superficie terrestre y la evapotranspiración de los cultivos.', composition: 'Microbolómetros QWIP de pozos cuánticos enfriados criogénicamente.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Landsat 1', year: '1972', agency: 'NASA/USGS', highlight: 'Primer satélite civil dedicado al mapeo ambiental de la Tierra.' },
        { name: 'Lanzamiento Landsat 9', year: '2021', agency: 'NASA/USGS', highlight: 'Garantiza la continuidad de 50 años de registro ambiental ininterrumpido.' }
      ]
    },
    didYouKnow: [
      'Todas las imágenes y datos de Landsat son 100% públicos y gratuitos, lo que ahorra miles de millones de dólares en agricultura de precisión y gestión del agua.',
      'Su órbita heliosíncrona cruza el ecuador terrestre siempre a la misma hora solar local (10:11 AM ± 15 min) para garantizar ángulos de sombra idénticos en comparativas temporales.',
      'Puede detectar si un campo de cultivo sufre estrés hídrico semanas antes de que las hojas muestren signos visibles de sequedad a simple vista.'
    ]
  },
  jwst: {
    key: 'jwst',
    name: 'Telescopio Espacial James Webb (JWST)',
    category: 'telescopio',
    tagline: 'El Observatorio Infrarrojo que Ve las Primeras Luces del Cosmos',
    summary: 'El JWST es el telescopio espacial más potente jamás construido. Diseñado para observar el universo en longitudes de onda infrarrojas, orbita alrededor del punto de Lagrange Sol-Tierra L2 a 1,5 millones de kilómetros de la Tierra.',
    stats: {
      diameter: 'Espejo de 6,5 m • Parasol de 21,2 m × 14,2 m',
      mass: '6.500 kg (6,5 Toneladas)',
      gravity: 'Órbita Halo en el Punto de Lagrange L2',
      avgTemp: '-233 °C (40 Kelvin) en instrumentos • 85 °C lado caliente',
      orbitalPeriod: '180 días (Órbita Halo alrededor de L2)',
      orbitalSpeed: '0,20 km/s en órbita halo L2',
      distanceOrAltitude: '1.500.000 km de la Tierra (4 veces la distancia a la Luna)'
    },
    structure: {
      layers: [
        { name: 'Espejo Primario de 18 Segmentos', desc: 'Malla hexagonal de 6,5 metros de diámetro con actuadores nanométricos.', composition: 'Berilio ultraligero bañado con 48 gramos de oro puro de 100 nm de espesor.' },
        { name: 'Parasol Térmico de 5 Capas', desc: 'Escudo del tamaño de una pista de tenis que bloquea el calor del Sol, la Tierra y la Luna.', composition: 'Película polimérica de Kapton recubierta de aluminio y silicio tratado.' },
        { name: 'Instrumentos Infrarrojos (NIRCam, NIRSpec, MIRI, FGS/NIRISS)', desc: 'Cámaras y espectrógrafos para analizar atmósferas de exoplanetas y galaxias tempranas.', composition: 'Detectores de telururo de cadmio-mercurio (HgCdTe) y silicio dopado con arsénico.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Lanzamiento Ariane 5', year: '2021', agency: 'NASA/ESA/CSA', highlight: 'Inserción orbital de precisión impecable desde el puerto espacial de Kourou.' },
        { name: 'Despliegue Completo en el Espacio', year: '2022', agency: 'NASA/ESA/CSA', highlight: 'Más de 300 puntos de fallo único completados con éxito durante el viaje a L2.' },
        { name: 'Primer Campo Profundo (SMACS 0723)', year: '2022', agency: 'STScI', highlight: 'La imagen infrarroja más profunda y nítida del universo lejano jamás obtenida.' }
      ]
    },
    didYouKnow: [
      'El parasol de 5 capas crea una diferencia de temperatura de más de 300 °C: mientras el lado que mira al Sol está a +85 °C, el lado de los instrumentos está a -233 °C.',
      'La capa de oro que recubre los 18 espejos hexagonales tiene un espesor de apenas 100 nanómetros (mil veces más delgada que un cabello humano).',
      'Es tan sensible que podría detectar la firma térmica de un abejorro situado a la distancia de la Luna.'
    ]
  },
  system: {
    key: 'system',
    name: 'Sistema Solar',
    category: 'sistema',
    tagline: 'Nuestro Vecindario Cósmico en la Vía Láctea',
    summary: 'El Sistema Solar es el sistema planetario ligado gravitacionalmente al Sol, una estrella enana amarilla de tipo espectral G2V que concentra el 99,86% de la masa total del sistema.',
    stats: {
      diameter: '287.460.000.000 km (Heliopausa ~100 AU)',
      mass: '1,989 × 10³⁰ kg (Masa del Sol: 333.000 Tierras)',
      gravity: 'Dominada por el potencial gravitatorio solar',
      avgTemp: '5.500 °C (Superficie solar) a -240 °C (Nube de Oort)',
      orbitalPeriod: '230 millones de años alrededor de la Vía Láctea',
      orbitalSpeed: '220 km/s (Velocidad del Sol en la Galaxia)',
      distanceOrAltitude: '26.000 años luz del Centro Galáctico'
    },
    structure: {
      layers: [
        { name: 'Planetas Rocosos Interiores', desc: 'Mercurio, Venus, Tierra y Marte con superficies sólidas y densas.', composition: 'Silicatos y núcleos metálicos de hierro-níquel.' },
        { name: 'Cinturón de Asteroides', desc: 'Región entre Marte y Júpiter poblada por cientos de miles de restos primordiales.', composition: 'Rocas de silicato, carbono y metales pesados (Ceres, Vesta).' },
        { name: 'Gigantes Gaseosos y de Hielo', desc: 'Júpiter, Saturno, Urano y Neptuno con extensos sistemas de anillos y lunas.', composition: 'Hidrógeno, helio, agua, metano y amoníaco comprimidos.' },
        { name: 'Cinturón de Kuiper y Nube de Oort', desc: 'Reino gélido exterior hogar de planetas enanos y cometas de largo periodo.', composition: 'Hielos volátiles de nitrógeno, metano y monóxido de carbono (Plutón, Eris).' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Misiones Voyager 1 y 2', year: '1977-Act.', agency: 'NASA', highlight: 'Exploración del Gran Tour planetario y cruce de la heliopausa hacia el espacio interestelar.' },
        { name: 'Misión Cassini-Huygens', year: '1997-2017', agency: 'NASA/ESA/ASI', highlight: 'Estudio exhaustivo del sistema de Saturno y aterrizaje del módulo Huygens en Titán.' },
        { name: 'New Horizons', year: '2006-Act.', agency: 'NASA', highlight: 'Primer sobrevuelo cercano del planeta enano Plutón y el objeto de Kuiper Arrokoth.' }
      ]
    },
    didYouKnow: [
      'El Sol consume 600 millones de toneladas de hidrógeno por segundo mediante fusión nuclear, convirtiéndolas en 596 millones de toneladas de helio y liberando energía pura.',
      'Si el Sol fuera del tamaño de una pelota de baloncesto en el centro de Madrid, la Tierra sería una cabeza de alfiler a 26 metros y Neptuno estaría a casi 800 metros de distancia.',
      'Voyager 1 es el objeto fabricado por el ser humano más lejano de la Tierra, situándose a más de 24.000 millones de kilómetros de distancia.'
    ],
    landmarks: [
      {
        id: 'mercury_caloris',
        name: 'Mercurio (Cráter Caloris)',
        type: 'crater',
        coords: { lat: 30.50, lon: -160.00 },
        description: 'La cuenca de impacto más grande de Mercurio (1.550 km de diámetro) producida por un asteroide gigante.',
        significance: 'Estructura geológica más dominante del planeta más interior.'
      },
      {
        id: 'venus_maxwell',
        name: 'Venus (Montes Maxwell)',
        type: 'landing_site',
        coords: { lat: 65.20, lon: 3.30 },
        description: 'Macizo montañoso de 11.000 metros de altitud sobre la superficie infernal a 465 °C y 92 atmósferas de presión.',
        significance: 'El punto más elevado del planeta gemelo de la Tierra.'
      },
      {
        id: 'jupiter_red_spot',
        name: 'Júpiter (Gran Mancha Roja)',
        type: 'landing_site',
        coords: { lat: -22.00, lon: 0.00 },
        description: 'Tormenta anticiclónica gigantesca más grande que toda la Tierra que lleva activa más de 350 años.',
        significance: 'El vórtice meteorológico más colosal del Sistema Solar.'
      },
      {
        id: 'saturn_rings',
        name: 'Saturno (Anillo B)',
        type: 'landing_site',
        coords: { lat: 0.00, lon: 90.00 },
        description: 'El anillo más brillante y denso de Saturno compuesto por miles de millones de fragmentos de hielo puro de agua.',
        significance: 'La joya visual más emblemática del Sistema Solar.'
      }
    ]
  },
  oort: {
    key: 'oort',
    name: 'Nube de Oort y Sonda Voyager 1',
    category: 'sistema',
    tagline: 'El Límite Gravitatorio del Sistema Solar',
    summary: 'La Nube de Oort es una gigantesca envoltura esférica teórica situada entre 2.000 y 100.000 UA del Sol. Alberga billones de cometas primordiales remanentes de la formación del Sistema Solar.',
    stats: {
      diameter: '200.000 UA (Más de 3 años luz de diámetro)',
      mass: 'Estimada en 5 a 100 masas terrestres',
      gravity: 'Influencia gravitatoria solar infinitesimal pero ligada',
      avgTemp: '4 Kelvin (-269 °C, rozando el cero absoluto)',
      orbitalPeriod: 'Cometas con periodos orbitales de hasta 30 millones de años',
      orbitalSpeed: '17 km/s (Velocidad de escape de Voyager 1)',
      distanceOrAltitude: '100.000 UA (Límite exterior hacia Alfa Centauri)'
    },
    structure: {
      layers: [
        { name: 'Heliopausa e Interfase Interestelar', desc: 'Frontera donde el viento solar choca contra el medio interestelar.', composition: 'Plasma de hidrógeno y helio interestelar ionizado.' },
        { name: 'Nube de Oort Interior (Disco de Hills)', desc: 'Estructura en forma de toroide densamente poblada por cometas de periodo largo.', composition: 'Hielos de agua, metano, amoníaco y cianógeno.' },
        { name: 'Nube de Oort Exterior Esférica', desc: 'Envoltura isotrópica débilmente ligada y perturbada por las mareas galácticas.', composition: 'Restos de planetesimales primordiales eyectados por los gigantes gaseosos.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Voyager 1', year: '1977-Act.', agency: 'NASA', highlight: 'Cruzó la heliopausa en 2012; tardará ~300 años en alcanzar la Nube de Oort y 30.000 años en atravesarla.' },
        { name: 'Voyager 2', year: '1977-Act.', agency: 'NASA', highlight: 'Segunda sonda en entrar al espacio interestelar con instrumentos de plasma operativos.' }
      ]
    },
    didYouKnow: [
      'A pesar de viajar a 61.000 km/h, la sonda Voyager 1 tardará unos 300 años solo en alcanzar el borde interior de la Nube de Oort.',
      'Las perturbaciones gravitatorias producidas por estrellas que pasan cerca provocan que cometas de la Nube de Oort caigan hacia el interior del Sistema Solar.',
      'El Disco de Oro de las Voyager contiene 115 imágenes, saludos en 55 idiomas y sonidos de la Tierra para posibles civilizaciones extraterrestres.'
    ],
    landmarks: [
      {
        id: 'voyager1_pos',
        name: 'Sonda Voyager 1 (163 UA)',
        type: 'landing_site',
        coords: { lat: 12.00, lon: 108.00 },
        description: 'La sonda interestelar más distante de la Tierra, navegando a 61.000 km/h en el medio interestelar.',
        significance: 'Primer artefacto humano en alcanzar el espacio interestelar.'
      },
      {
        id: 'heliopause_boundary',
        name: 'Frontera de la Heliopausa (120 UA)',
        type: 'landing_site',
        coords: { lat: 0.00, lon: 0.00 },
        description: 'Límite donde la burbuja magnética del Sol frena ante el flujo de rayos cósmicos galácticos.',
        significance: 'Frontera magnética del Sistema Solar.'
      },
      {
        id: 'hills_cloud_inner',
        name: 'Disco de Hills (Nube Interior)',
        type: 'landing_site',
        coords: { lat: 0.00, lon: 90.00 },
        description: 'Toroide cometario denso situado entre 2.000 y 20.000 UA del Sol.',
        significance: 'Reserva primaria de cometas de largo periodo.'
      },
      {
        id: 'oort_outer_edge',
        name: 'Borde Exterior de Oort (100.000 UA)',
        type: 'landing_site',
        coords: { lat: 45.00, lon: 180.00 },
        description: 'Límite gravitatorio exterior a 1,5 años luz donde las estrellas vecinas perturban los cometas.',
        significance: 'El límite físico absoluto del dominio del Sol.'
      }
    ]
  },
  nearbystars: {
    key: 'nearbystars',
    name: 'Estrellas Vecinas y Alfa Centauri',
    category: 'sistema',
    tagline: 'Nuestro Vecindario Interestelar en la Vía Láctea',
    summary: 'La burbuja solar local abarca las estrellas situadas a menos de 15 años luz de distancia. Destaca el sistema triple Alfa Centauri (con Próxima Centauri a 4,24 años luz) y Sirio, la estrella más brillante de nuestro cielo nocturno.',
    stats: {
      diameter: '30 años luz (Radio de la Burbuja Local Inmediata)',
      mass: 'Concentrada en ~30 sistemas estelares principales',
      gravity: 'Dinámica estelar coordinada por el disco galáctico',
      avgTemp: '3.042 K (Próxima) a 9.940 K (Sirio A)',
      orbitalPeriod: '550 años (Órbita de Próxima alrededor de Alfa Centauri A/B)',
      orbitalSpeed: '220 km/s en rotación galáctica conjunta',
      distanceOrAltitude: '4,24 años luz (Próxima Centauri)'
    },
    structure: {
      layers: [
        { name: 'Sistema Alfa Centauri (A, B y Próxima)', desc: 'Sistema triple estelar más próximo; Próxima b es un exoplaneta rocoso en zona habitable.', composition: 'Estrellas tipo espectral G2V, K1V y enana roja M5.5V.' },
        { name: 'Estrella de Barnard', desc: 'Enana roja de tipo M con el mayor movimiento propio conocido en el cielo (10,3 segundos de arco/año).', composition: 'Enana roja de baja masa y rica en helio.' },
        { name: 'Sirio (Alfa Canis Majoris A/B)', desc: 'Estrella blanca de secuencia principal acompañada por una densa enana blanca (Sirio B).', composition: 'Estrella tipo A1V con núcleo en fusión CNO y compañera degenerada de carbono-oxígeno.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Misión Gaia (ESA)', year: '2013-Act.', agency: 'ESA', highlight: 'Astrometría ultra-precisa cartografiando las posiciones y velocidades 3D de 1.800 millones de estrellas.' },
        { name: 'Proyecto Breakthrough Starshot', year: 'En diseño', agency: 'Privado/Científico', highlight: 'Propuesta de micro-velas láser a 0,2 c (20% de la velocidad de la luz) para llegar a Próxima en 20 años.' }
      ]
    },
    didYouKnow: [
      'Próxima Centauri b es el exoplaneta potencialmente habitable más cercano a la Tierra, situado a 40 billones de kilómetros.',
      'Si redujéramos la Tierra al tamaño de un grano de arena y el Sol al de una canica en Madrid, Próxima Centauri estaría en Moscú.',
      'Sirio B es tan densa que una cucharadita de su materia pesaría más de 5 toneladas en la Tierra.'
    ],
    landmarks: [
      {
        id: 'proxima_centauri',
        name: 'Próxima Centauri (4,24 al)',
        type: 'landing_site',
        coords: { lat: -62.68, lon: 217.43 },
        description: 'La estrella más cercana al Sol, una enana roja activa con llamaradas estelares frecuentes.',
        significance: 'Nuestro destino interestelar más inmediato.'
      },
      {
        id: 'proxima_b_exoplanet',
        name: 'Exoplaneta Próxima b',
        type: 'landing_site',
        coords: { lat: -62.68, lon: 217.50 },
        description: 'Planeta rocoso con 1,17 masas terrestres orbitando en la zona de habitabilidad cada 11,2 días.',
        significance: 'El exoplaneta templado más próximo a la humanidad.'
      },
      {
        id: 'alpha_centauri_ab',
        name: 'Alfa Centauri A & B',
        type: 'landing_site',
        coords: { lat: -60.83, lon: 219.90 },
        description: 'Par binario de estrellas similares al Sol (tipo solar G2V y naranja K1V) separadas por 23 UA.',
        significance: 'Sistema estelar doble brillante visible a simple vista en el sur.'
      },
      {
        id: 'sirius_system',
        name: 'Sirio A & B (8,6 al)',
        type: 'landing_site',
        coords: { lat: -16.71, lon: 101.28 },
        description: 'La estrella más brillante del firmamento (magnitud -1,46) acompañada por la primera enana blanca descubierta.',
        significance: 'El faro nocturno más resplandeciente del cielo.'
      }
    ]
  },
  milkyway: {
    key: 'milkyway',
    name: 'La Vía Láctea y Sagitario A*',
    category: 'sistema',
    tagline: 'Nuestra Galaxia Espiral Barrada y el Agujero Negro Central',
    summary: 'La Vía Láctea es una galaxia espiral barrada de tipo SBbc que alberga entre 100.000 y 400.000 millones de estrellas. En su centro reside Sagitario A*, un agujero negro supermasivo de 4,3 millones de masas solares.',
    stats: {
      diameter: '100.000 años luz (~30 kiloparsecs)',
      mass: '1,5 billones de masas solares (incluyendo materia oscura)',
      gravity: 'Pozo gravitatorio masivo centrado en Sagitario A*',
      avgTemp: 'Desde nubes moleculares a 10 K hasta gas coronal a 10⁶ K',
      orbitalPeriod: '230 millones de años (Año Galáctico del Sol)',
      orbitalSpeed: '220 km/s (Velocidad orbital del Sol en el Brazo de Orión)',
      distanceOrAltitude: '26.000 años luz del Sol al Centro Galáctico'
    },
    structure: {
      layers: [
        { name: 'Núcleo y Bulbo Galáctico', desc: 'Región central de alta densidad estelar dominada por el agujero negro supermasivo Sagitario A*.', composition: 'Estrellas viejas de Población II y gas ionizado ultra-caliente.' },
        { name: 'Disco Espiral y Brazos (Perseo, Escudo-Centauro, Sagitario, Orión)', desc: 'Donde nacen las nuevas estrellas y nebulosas a partir de polvo interestelar.', composition: 'Estrellas jóvenes de Población I, nubes H II y polvo interestelar.' },
        { name: 'Halo Galáctico y Materia Oscura', desc: 'Envoltura esférica gigante con más de 150 cúmulos globulares y el 90% de la masa en materia oscura.', composition: 'Materia oscura no bariónica y estrellas hiperveloces.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Event Horizon Telescope (EHT)', year: '2022', agency: 'Colaboración Global', highlight: 'Primera fotografía histórica del horizonte de sucesos y anillo de gas de Sagitario A*.' },
        { name: 'Telescopio Espacial Gaia', year: '2013-Act.', agency: 'ESA', highlight: 'Reconstrucción de la historia de colisiones y fusiones de la Vía Láctea con la galaxia Gaia-Encélado.' }
      ]
    },
    didYouKnow: [
      'Sagitario A* tiene una masa equivalente a 4,3 millones de soles pero su horizonte de sucesos cabría dentro de la órbita de Mercurio.',
      'El Sistema Solar ha dado únicamente unas 20 vueltas a la Vía Láctea desde que se formó hace 4.600 millones de años.',
      'Nuestra galaxia y la Galaxia de Andrómeda colisionarán dentro de 4.500 millones de años para formar una gigantesca galaxia elíptica: Lactómeda.'
    ],
    landmarks: [
      {
        id: 'sagittarius_a_star',
        name: 'Sagitario A* (Centro Galáctico)',
        type: 'landing_site',
        coords: { lat: -29.00, lon: -5.00 },
        description: 'Agujero negro supermasivo central de 4,3 millones de masas solares con un disco de acreción giratorio.',
        significance: 'El ancla gravitatoria central de toda nuestra galaxia.'
      },
      {
        id: 'orion_arm_sun',
        name: 'Brazo de Orión (Posición del Sol)',
        type: 'landing_site',
        coords: { lat: 0.00, lon: 90.00 },
        description: 'Espolón espiral a 26.000 años luz del núcleo donde orbitan la Tierra y el Sistema Solar.',
        significance: 'Nuestra dirección cósmica dentro del disco galáctico.'
      },
      {
        id: 'perseus_arm',
        name: 'Brazo Espiral de Perseo',
        type: 'landing_site',
        coords: { lat: 15.00, lon: 140.00 },
        description: 'Uno de los dos brazos espirales mayores de la galaxia con intensa formación de estrellas jóvenes masivas.',
        significance: 'Estructura espiral dominante de la Vía Láctea exterior.'
      },
      {
        id: 'globular_cluster_m13',
        name: 'Cúmulo Globular M13 (Halo)',
        type: 'landing_site',
        coords: { lat: 36.46, lon: 250.42 },
        description: 'Esfera densa de 300.000 estrellas ancestrales de 12.000 millones de años en el halo galáctico.',
        significance: 'Fósiles estelares primordiales de la formación galáctica.'
      }
    ]
  },
  localgroup: {
    key: 'localgroup',
    name: 'El Grupo Local de Galaxias',
    category: 'sistema',
    tagline: 'Nuestra Familia Galáctica Ligada por la Gravedad',
    summary: 'El Grupo Local es un cúmulo de más de 80 galaxias con un diámetro de 10 millones de años luz. Está dominado por dos gigantes espirales: la Galaxia de Andrómeda (M31) y la Vía Láctea.',
    stats: {
      diameter: '10 millones de años luz (~3 megaparsecs)',
      mass: '2 a 3 billones de masas solares',
      gravity: 'Colapso mutuo entre la Vía Láctea y Andrómeda a 110 km/s',
      avgTemp: 'Medio intergaláctico tenue a 10⁵ K',
      orbitalPeriod: 'Dinámica de atracción gravitatoria ininterrumpida',
      orbitalSpeed: '110 km/s de aproximación mutua Vía Láctea - M31',
      distanceOrAltitude: '2,537 millones de años luz a la Galaxia de Andrómeda'
    },
    structure: {
      layers: [
        { name: 'Galaxia de Andrómeda (M31)', desc: 'La galaxia espiral más grande del grupo con un billón de estrellas.', composition: 'Disco espiral con 1 billón de estrellas y núcleo binario masivo.' },
        { name: 'La Vía Láctea', desc: 'Nuestra galaxia hogar y la segunda más masiva del grupo.', composition: 'Espiral barrada con 200-400 mil millones de estrellas.' },
        { name: 'Galaxia del Triángulo (M33)', desc: 'La tercera galaxia en tamaño con alta tasa de formación estelar.', composition: 'Espiral floculenta sin barra central.' },
        { name: 'Galaxias Satélites Enanas', desc: 'Nubes de Magallanes, Fornax, Escultor, Leo I y decenas de enanas esferoidales.', composition: 'Restos de galaxias capturadas e interacciones de marea galáctica.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Edwin Hubble (Monte Wilson)', year: '1924', agency: 'Observatorio Carnegie', highlight: 'Descubrimiento de variables cefeidas en Andrómeda, demostrando que eran galaxias independientes fuera de la Vía Láctea.' }
      ]
    },
    didYouKnow: [
      'La Galaxia de Andrómeda se acerca a nosotros a 400.000 km/h; en 4.000 millones de años cubrirá por completo nuestro cielo nocturno.',
      'A pesar de la colisión entre la Vía Láctea y Andrómeda, la distancia entre estrellas es tan colosal que es casi imposible que choquen dos estrellas individuales.',
      'Las dos Nubes de Magallanes son galaxias enanas satélites visibles a simple vista desde el hemisferio sur terrestre.'
    ],
    landmarks: [
      {
        id: 'andromeda_m31',
        name: 'Galaxia de Andrómeda (M31)',
        type: 'landing_site',
        coords: { lat: 41.26, lon: 10.68 },
        description: 'Galaxia espiral gigante a 2,537 millones de años luz que contiene más de 1 billón de estrellas.',
        significance: 'El objeto más distante visible a simple vista desde la Tierra.'
      },
      {
        id: 'triangulum_m33',
        name: 'Galaxia del Triángulo (M33)',
        type: 'landing_site',
        coords: { lat: 30.66, lon: 23.46 },
        description: 'Tercera galaxia mayor del Grupo Local a 2,73 millones de años luz con la gigantesca nebulosa NGC 604.',
        significance: 'Galaxia espiral activa en formación de cúmulos estelares.'
      },
      {
        id: 'large_magellanic_cloud',
        name: 'Gran Nube de Magallanes (LMC)',
        type: 'landing_site',
        coords: { lat: -69.75, lon: 80.89 },
        description: 'Galaxia satélite enana a 163.000 años luz que alberga la Nebulosa de la Tarántula.',
        significance: 'El laboratorio extragaláctico más cercano para el estudio estelar.'
      },
      {
        id: 'milkomeda_collision',
        name: 'Vector de Fusión Milkomeda',
        type: 'landing_site',
        coords: { lat: 25.00, lon: 45.00 },
        description: 'Eje vectorial de atracción a 110 km/s por el cual la Vía Láctea y Andrómeda se fusionarán.',
        significance: 'El destino cósmico final de nuestro grupo galáctico.'
      }
    ]
  },
  laniakea: {
    key: 'laniakea',
    name: 'Supercúmulo Laniakea y el Gran Atractor',
    category: 'sistema',
    tagline: 'El Inmenso Río Cósmico de 100.000 Galaxias',
    summary: 'Laniakea ("Cielos Inmensos" en hawaiano) es la superestructura cósmica que alberga 100.000 galaxias a lo largo de 520 millones de años luz. Todas las galaxias fluyen por filamentos hacia un centro gravitatorio llamado el Gran Atractor.',
    stats: {
      diameter: '520 millones de años luz (160 megaparsecs)',
      mass: '10¹⁷ masas solares (100.000 galaxias completas)',
      gravity: 'Flujo cósmico guiado hacia la anomalía del Gran Atractor',
      avgTemp: 'Filamentos intergalácticos de plasma caliente (WHIM)',
      orbitalPeriod: 'Flujo cinemático hacia la cuenca de atracción gravitatoria',
      orbitalSpeed: '600 km/s (Velocidad de la Vía Láctea hacia el Gran Atractor)',
      distanceOrAltitude: '250 millones de años luz al centro del Gran Atractor'
    },
    structure: {
      layers: [
        { name: 'Supercúmulo de Virgo (Nuestra Región Local)', desc: 'Apéndice de Laniakea que alberga el Grupo Local y el Cúmulo de Virgo.', composition: 'Más de 2.000 galaxias ligadas gravitatoriamente a Virgo M87.' },
        { name: 'Cúmulo de Norma y el Gran Atractor', desc: 'El epicentro gravitatorio que atrae a todos los filamentos de galaxias.', composition: 'Región masiva oculta en la Zona de Evitación por el plano de la Vía Láctea.' },
        { name: 'Cúmulo de Centauro e Hidra', desc: 'Corrientes galácticas secundarias densamente conectadas.', composition: 'Ríos de cúmulos de galaxias ricas en gas intergaláctico.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Equipo de Brent Tully (Universidad de Hawái)', year: '2014', agency: 'Nature', highlight: 'Descubrimiento y delimitación de la frontera exacta de Laniakea mediante mapas de velocidades peculiares de galaxias.' }
      ]
    },
    didYouKnow: [
      'Laniakea funciona como una cuenca hidrográfica: así como el agua fluye por valles hacia un lago central, 100.000 galaxias fluyen por filamentos hacia el Gran Atractor.',
      'El Gran Atractor se encuentra situado justo detrás del disco de polvo de la Vía Láctea (Zona de Evitación), lo que impide observarlo fácilmente en luz visible.',
      'Laniakea es solo uno de los millones de supercúmulos que forman la gigantesca telaraña cósmica del Universo observable.'
    ],
    landmarks: [
      {
        id: 'great_attractor',
        name: 'El Gran Atractor (Cúmulo Norma)',
        type: 'landing_site',
        coords: { lat: -60.00, lon: 325.00 },
        description: 'La anomalía gravitatoria supermasiva a 250 millones de años luz que arrastra a 100.000 galaxias a 600 km/s.',
        significance: 'El centro neurálgico del flujo cósmico de Laniakea.'
      },
      {
        id: 'virgo_supercluster',
        name: 'Supercúmulo de Virgo (Local)',
        type: 'landing_site',
        coords: { lat: 12.00, lon: 187.00 },
        description: 'Cúmulo de más de 2.000 galaxias dominado por la galaxia elíptica gigante M87.',
        significance: 'Nuestro subdistrito galáctico en la red cósmica.'
      },
      {
        id: 'hydra_centaurus',
        name: 'Supercúmulo Hidra-Centauro',
        type: 'landing_site',
        coords: { lat: -35.00, lon: 195.00 },
        description: 'Corriente galáctica masiva que conecta los filamentos de Virgo con el Gran Atractor.',
        significance: 'Puente de materia intergaláctica de alta densidad.'
      },
      {
        id: 'perseus_pisces_boundary',
        name: 'Filamento Perseo-Piscis',
        type: 'landing_site',
        coords: { lat: 40.00, lon: 50.00 },
        description: 'Superestructura vecina adyacente que define la frontera divisoria de aguas de atracción de Laniakea.',
        significance: 'Límite exterior del dominio gravitatorio de Laniakea.'
      }
    ]
  },
  universe: {
    key: 'universe',
    name: 'El Universo Observable y el CMB',
    category: 'sistema',
    tagline: 'El Límite del Horizonte Cósmico y el Eco del Big Bang',
    summary: 'El Universo Observable es la esfera de 93.000 millones de años luz centrada en nosotros de la que la luz ha tenido tiempo de alcanzarnos desde el Big Bang hace 13.800 millones de años. Contiene más de 2 billones de galaxias.',
    stats: {
      diameter: '93.000 millones de años luz (28,5 gigaparsecs)',
      mass: '1,5 × 10⁵³ kg en materia ordinaria (~10⁸⁰ átomos)',
      gravity: 'Expansión acelerada gobernada por la Energía Oscura (68,3%)',
      avgTemp: '2,7255 Kelvin (-270,42 °C, Fondo Cósmico de Microondas)',
      orbitalPeriod: '13.800 millones de años desde el Big Bang',
      orbitalSpeed: '70 km/s por megaparsec (Constante de Hubble H₀)',
      distanceOrAltitude: '46.500 millones de años luz de radio comóvil'
    },
    structure: {
      layers: [
        { name: 'Materia Bariónica Ordinaria (4,9%)', desc: 'Todo lo que vemos: estrellas, planetas, nubes de gas, galaxias y vida.', composition: '75% Hidrógeno, 24% Helio, 1% elementos pesados.' },
        { name: 'Materia Oscura Fría (26,8%)', desc: 'Materia invisible que genera la gravedad necesaria para mantener unidas las galaxias.', composition: 'Partículas masivas de interacción débil (WIMPs/Axiones).' },
        { name: 'Energía Oscura (68,3%)', desc: 'Fuerza misteriosa que impulsa la expansión acelerada del tejido del espacio-tiempo.', composition: 'Constante cosmológica de Einstein / Energía del vacío cuántico.' },
        { name: 'Superficie de Última Dispersión (CMB)', desc: 'El eco fósil de la luz liberada 380.000 años tras el Big Bang cuando el cosmos se volvió transparente.', composition: 'Fotones primordiales desplazados al rango de microondas por la expansión.' }
      ]
    },
    exploration: {
      historicMissions: [
        { name: 'Penzias y Wilson (Bell Labs)', year: '1964', agency: 'Premio Nobel', highlight: 'Descubrimiento accidental del Fondo Cósmico de Microondas a 2,7 K.' },
        { name: 'Telescopio Espacial Planck (ESA)', year: '2009-2013', agency: 'ESA', highlight: 'El mapa más nítido y detallado de las fluctuaciones de temperatura y polarización del CMB.' }
      ]
    },
    didYouKnow: [
      'El 1% de la "nieve" o interferencia estática en un televisor analógico antiguo sintonizado en un canal vacío proviene directamente del Big Bang.',
      'Debido a la expansión del espacio a velocidades superlumínicas en distancias lejanas, el radio del Universo observable es de 46.500 millones de años luz aunque tenga 13.800 millones de años.',
      'Existen más estrellas en el Universo observable que granos de arena en todas las playas y desiertos del planeta Tierra combinados (~10²² estrellas).'
    ],
    landmarks: [
      {
        id: 'cmb_radiation_sphere',
        name: 'Fondo Cósmico (CMB a 2,725 K)',
        type: 'landing_site',
        coords: { lat: 0.00, lon: 0.00 },
        description: 'La superficie de última dispersión emitida hace 13.800 millones de años cuando el universo se enfrió a 3.000 K.',
        significance: 'El fósil térmico más antiguo y fundamental de la cosmología.'
      },
      {
        id: 'particle_horizon',
        name: 'Horizonte de Partículas (46.500 Mal)',
        type: 'landing_site',
        coords: { lat: 45.00, lon: 90.00 },
        description: 'La distancia máxima comóvil desde donde la luz ha podido viajar hasta nosotros desde el origen del tiempo.',
        significance: 'El límite infranqueable de la observación humana.'
      },
      {
        id: 'recombination_epoch',
        name: 'Época de Recombinación (z = 1100)',
        type: 'landing_site',
        coords: { lat: -45.00, lon: 180.00 },
        description: 'El instante cósmico en que los electrones se unieron a los protones formando los primeros átomos neutros de hidrógeno.',
        significance: 'El momento exacto en que el cosmos se volvió transparente.'
      },
      {
        id: 'observable_universe_edge',
        name: 'Límite del Universo Observable',
        type: 'landing_site',
        coords: { lat: 0.00, lon: 270.00 },
        description: 'Esfera de 93.000 millones de años luz de diámetro que contiene más de 2 billones de galaxias.',
        significance: 'La escala cósmica total accesible a la física actual.'
      }
    ]
  }
};
