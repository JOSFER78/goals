import { SpaceObjectInfo, LevelConfig } from '../types';

export const SPACE_INFO: Record<string, SpaceObjectInfo> = {
  earth: {
    icon: '🌍',
    name: 'La Tierra',
    tagline: 'El único lugar con vida confirmada',
    desc: 'Una roca de 4.540 millones de años. El 71% está cubierta de océanos y la atmósfera es una capa finísima que nos protege.',
    stats: [['Diámetro', '12.742 km'], ['Océanos', '71%']],
    facts: [
      'Viaja alrededor del Sol a 107.000 km/h y ni lo notas.',
      'Desde aquí despegó Artemis II en 2026: el primer vuelo tripulado a la Luna en 50 años.',
      'Su campo magnético nos escuda del viento solar.'
    ]
  },
  moon: {
    icon: '🌕',
    name: 'La Luna',
    tagline: 'Objetivo de la nueva carrera espacial',
    desc: 'Nuestra compañera de mareas… y el destino de 2026: en abril de 2026, Artemis II llevó 4 astronautas a rodearla, el primer vuelo tripulado más allá de la órbita baja en 50 años.',
    stats: [['Distancia', '384.400 km'], ['Última visita humana', 'Artemis II · 2026']],
    facts: [
      'Se aleja 3,8 cm cada año.',
      'China planea llevar taikonautas en 2029-2030 y construir una base.',
      'El polo sur lunar tiene hielo de agua: el recurso clave para quedarse.'
    ]
  },
  sun: {
    icon: '☀️',
    name: 'El Sol',
    tagline: 'La estrella que lo controla todo',
    desc: 'Una enana amarilla que convierte 600 millones de toneladas de hidrógeno en helio cada segundo.',
    stats: [['Superficie', '5.500 °C'], ['Núcleo', '15.000.000 °C']],
    facts: [
      'Concentra el 99,86% de toda la masa del sistema solar.',
      'Su luz tarda 8 min 20 s en llegar a ti.',
      'La sonda Parker voló por su corona a ~700.000 km/h: récord humano de velocidad.'
    ]
  },
  mercury: {
    icon: '🪨',
    name: 'Mercurio',
    tagline: 'Pequeño y extremo',
    desc: 'El planeta más pequeño y cercano al Sol. Sin atmósfera: contrastes brutales de temperatura.',
    stats: [['Diámetro', '4.879 km'], ['Año', '88 días']],
    facts: [
      'De -180 °C de noche a 430 °C de día.',
      'Un día solar dura 176 días terrestres.',
      'Tiene hielo en cráteres en sombra permanente.'
    ]
  },
  venus: {
    icon: '🔥',
    name: 'Venus',
    tagline: 'El infierno gemelo',
    desc: 'Casi del tamaño de la Tierra, pero con efecto invernadero desbocado: el planeta más caliente.',
    stats: [['Temperatura', '465 °C'], ['Presión', '92 atm']],
    facts: [
      'Gira al revés: el Sol sale por el oeste.',
      'Su día dura más que su año.',
      'Nubes de ácido sulfúrico.'
    ]
  },
  mars: {
    icon: '🔴',
    name: 'Marte',
    tagline: 'El próximo destino',
    desc: 'Un desierto helado con el volcán más grande del sistema solar y ríos antiguos secos.',
    stats: [['Día', '24,6 h'], ['Gravedad', '38%']],
    facts: [
      'El monte Olimpo mide 21 km: 2,5 Everest.',
      'Su color es óxido de hierro: está oxidado.',
      'Los rovers Perseverance y Curiosity siguen explorándolo hoy.'
    ]
  },
  jupiter: {
    icon: '🟠',
    name: 'Júpiter',
    tagline: 'El gigante guardián',
    desc: 'Tan masivo que todos los demás planetas cabrían dentro. Su gravedad desvía asteroides.',
    stats: [['Diámetro', '139.820 km'], ['Lunas', '95']],
    facts: [
      'La Gran Mancha Roja: tormenta mayor que la Tierra, +300 años activa.',
      'Rota en ~10 horas.',
      'Su luna Europa esconde un océano: la misión Europa Clipper llegará en 2030.'
    ]
  },
  saturn: {
    icon: '🪐',
    name: 'Saturno',
    tagline: 'El señor de los anillos',
    desc: 'Anillos de 280.000 km de ancho y solo ~10 m de espesor: hielo y roca.',
    stats: [['Lunas', '146'], ['Densidad', '0,69 g/cm³']],
    facts: [
      'Flotaría en el agua.',
      'Titán tiene lagos de metano líquido.',
      'Sus anillos desaparecerán en ~100 millones de años.'
    ]
  },
  uranus: {
    icon: '🧊',
    name: 'Urano',
    tagline: 'El planeta inclinado',
    desc: 'Gira de lado (eje a 98°), probablemente por un impacto antiguo.',
    stats: [['Inclinación', '98°'], ['Mín', '-224 °C']],
    facts: [
      'Primer planeta descubierto con telescopio (1781).',
      '13 anillos tenues.',
      'Color azul verdoso por el metano.'
    ]
  },
  neptune: {
    icon: '🔵',
    name: 'Neptuno',
    tagline: 'El planeta matemático',
    desc: 'Descubierto en 1846 por cálculos matemáticos antes de verlo por telescopio.',
    stats: [['Vientos', '2.100 km/h'], ['Año', '165 años']],
    facts: [
      'Vientos más rápidos del sistema solar.',
      'Solo visitado por la Voyager 2 (1989).',
      'Su luna Tritón orbita al revés.'
    ]
  },
  comet: {
    icon: '☄️',
    name: 'Cometa en potencia',
    tagline: 'Habitante del borde',
    desc: 'Bola de hielo y polvo en la frontera del sistema solar.',
    stats: [['Temp', '-260 °C'], ['Tamaño', '1-100 km']],
    facts: [
      'La nube de Oort tiene billones de estos objetos.',
      'De aquí vienen los cometas de largo periodo.',
      'Marca el límite gravitatorio del Sol.'
    ]
  },
  proxima: {
    icon: '🎯',
    name: 'Próxima Centauri',
    tagline: 'Nuestra vecina más cercana',
    desc: 'Enana roja a 4,24 años luz con un planeta en zona habitable: Próxima b.',
    stats: [['Distancia', '4,24 a.l.'], ['Tipo', 'Enana roja']],
    facts: [
      'Su luz tarda 4,24 años en llegar.',
      'Próxima b podría tener agua líquida.',
      'Con tecnología actual: ~75.000 años de viaje.'
    ]
  },
  alfacen: {
    icon: '👯',
    name: 'Alfa Centauri A',
    tagline: 'Un sistema triple',
    desc: 'Tres estrellas bailando juntas; la A es muy parecida al Sol.',
    stats: [['Distancia', '4,37 a.l.'], ['Tipo', 'Amarilla']],
    facts: [
      'Forma sistema con Próxima Centauri.',
      'Será la estrella más brillante del cielo en 1,3 M de años.'
    ]
  },
  barnard: {
    icon: '🏃',
    name: 'Estrella de Barnard',
    tagline: 'La estrella fugitiva',
    desc: 'La enana roja con movimiento propio más rápido del cielo.',
    stats: [['Distancia', '5,96 a.l.'], ['Edad', '~10.000 M años']],
    facts: [
      'De las estrellas más viejas del vecindario.',
      'Tiene una supertierra: Barnard b.'
    ]
  },
  sirius: {
    icon: '💎',
    name: 'Sirio',
    tagline: 'La reina de la noche',
    desc: 'La estrella más brillante del cielo nocturno: sistema doble con una enana blanca.',
    stats: [['Distancia', '8,6 a.l.'], ['Brillo', '25× Sol']],
    facts: [
      'Sirio B: una cucharadita pesaría toneladas.',
      'Los egipcios la usaban para predecir las crecidas del Nilo.'
    ]
  },
  epsEri: {
    icon: '🐣',
    name: 'Épsilon Eridani',
    tagline: 'Un sistema joven',
    desc: 'Estrella joven (~440 M de años) formando planetas ahora mismo.',
    stats: [['Distancia', '10,5 a.l.'], ['Edad', '440 M años']],
    facts: [
      'Parecida al Sol de hace 4.000 M de años.',
      'Sale en mucha ciencia ficción.'
    ]
  },
  sagA: {
    icon: '🕳️',
    name: 'Sagitario A*',
    tagline: 'El corazón oscuro de la galaxia',
    desc: 'Agujero negro supermasivo de 4 millones de masas solares. Fotografiado en 2022.',
    stats: [['Masa', '4 M soles'], ['Distancia', '26.000 a.l.']],
    facts: [
      'Estrellas cercanas orbitan a 3% de la velocidad de la luz.',
      'No lo traga todo: lo orbitamos tranquilamente.'
    ]
  },
  youAreHere: {
    icon: '📍',
    name: 'Estás aquí',
    tagline: 'El Sol, visto desde fuera',
    desc: 'Nuestra estrella, un punto en el brazo de Orión. Desde aquí partió la nueva era lunar: Artemis II rodeó la Luna en abril de 2026.',
    stats: [['Zona', 'Brazo de Orión'], ['Velocidad', '828.000 km/h']],
    facts: [
      'Un año galáctico = 230 M de años.',
      'El Sol ya dio ~20 vueltas a la galaxia.'
    ]
  },
  milkyway: {
    icon: '🌌',
    name: 'Vía Láctea',
    tagline: 'Nuestra galaxia',
    desc: 'Espiral barrada con ~200.000 millones de estrellas.',
    stats: [['Estrellas', '~200.000 M'], ['Edad', '13.600 M años']],
    facts: [
      'Chocará con Andrómeda en ~4.500 M de años.',
      'Su centro esconde a Sagitario A*.'
    ]
  },
  andromeda: {
    icon: '🌀',
    name: 'Andrómeda',
    tagline: 'Nuestra futura compañera',
    desc: 'La más grande del Grupo Local: ~1 billón de estrellas. Se acerca a 110 km/s.',
    stats: [['Distancia', '2,5 M a.l.'], ['Estrellas', '~1 billón']],
    facts: [
      'Se ve a simple vista desde cielos oscuros.',
      'La luz que ves salió antes de que existieran los humanos.'
    ]
  },
  triangulum: {
    icon: '🔺',
    name: 'Triángulo (M33)',
    tagline: 'La tercera del grupo',
    desc: 'Tercera galaxia del Grupo Local: 40.000 millones de estrellas.',
    stats: [['Distancia', '2,7 M a.l.'], ['Estrellas', '40.000 M']],
    facts: [
      'Forma estrellas más rápido que la Vía Láctea.'
    ]
  },
  virgo: {
    icon: '🌟',
    name: 'Cúmulo de Virgo',
    tagline: 'El vecindario denso',
    desc: '~1.300 galaxias a 54 millones de años luz. Su gravedad tira de nosotros.',
    stats: [['Galaxias', '~1.300'], ['Distancia', '54 M a.l.']],
    facts: [
      'Caemos hacia él a ~400 km/s.'
    ]
  },
  laniakeaM: {
    icon: '🕸️',
    name: 'Laniakea',
    tagline: 'Nuestro supercúmulo',
    desc: '520 millones de años luz y ~100.000 galaxias fluyendo hacia el Gran Atractor.',
    stats: [['Galaxias', '100.000'], ['Masa', '10¹⁷ soles']],
    facts: [
      'Descubierto en 2014 mapeando movimientos de galaxias.',
      'Significa "cielo inmenso" en hawaiano.'
    ]
  },
  attractor: {
    icon: '🧲',
    name: 'Gran Atractor',
    tagline: 'El misterio gravitatorio',
    desc: 'Anomalía que arrastra decenas de miles de galaxias a ~600 km/s, oculta tras la Vía Láctea.',
    stats: [['Distancia', '~250 M a.l.'], ['Arrastre', '600 km/s']],
    facts: [
      'No podemos verlo directamente: la Vía Láctea lo tapa.',
      'Uno de los grandes misterios de la cosmología.'
    ]
  },
  everything: {
    icon: '🌐',
    name: 'Todo lo observable',
    tagline: 'La burbuja de luz',
    desc: 'Todo lo cuya luz nos ha llegado desde el Big Bang: 93.000 M de años luz, ~2 billones de galaxias.',
    stats: [['Diámetro', '93.000 M a.l.'], ['Galaxias', '~2 billones']],
    facts: [
      'El 95% es materia y energía oscuras.',
      'Cada foto del JWST de cielo "vacío" muestra miles de galaxias.'
    ]
  },
  edge: {
    icon: '📡',
    name: 'El borde del tiempo',
    tagline: 'Las galaxias más lejanas',
    desc: 'Galaxias cuya luz viajó +13.000 millones de años: las vemos recién nacidas. JWST confirmó en 2026 a MoM-z14, visible solo 280 millones de años después del Big Bang.',
    stats: [['Viaje de la luz', '>13.000 M años'], ['Récord 2026', 'MoM-z14']],
    facts: [
      'En noviembre de 2026, Voyager 1 estará a 1 día-luz de la Tierra.',
      'Mirar lejos = mirar al pasado.'
    ]
  }
};

export const LEVELS_CONFIG: LevelConfig[] = [
  {
    name: "La Tierra y Satélites NASA",
    badge: "12.742 km",
    desc: "Nuestro punto de partida: una esfera con océanos PBR, capas de nubes dinámicas y satélites reales en órbita (ISS, Hubble, JWST).",
    fact: "En abril de 2026, desde este planeta, 4 humanos rodearon la Luna con Artemis II.",
    stats: [["Diámetro", "12.742 km"], ["Edad", "4.540 M años"]],
    buildKey: "earth"
  },
  {
    name: "Eclipses Solares y Lunares",
    badge: "Inclinación 5.14°",
    desc: "Efemérides 100% reales de la NASA: calcula la sombra de umbra proyectada en la Tierra (como el Gran Eclipse Solar Total de España del 12 de agosto de 2026).",
    fact: "El eclipse solar total cruzará España hoy (12 de agosto de 2026) desde Coruña hasta las Islas Baleares.",
    stats: [["Inclinación Lunar", "5.14°"], ["Eclipses/Año", "2 a 5"]],
    buildKey: "eclipses"
  },
  {
    name: "Rotación 24h & Ciclo Día/Noche",
    badge: "1.670 km/h en Ecuador",
    desc: "Simulador de rotación diurna en tiempo real con calculador de punto subsolar exacto, terminador crepuscular Rayleigh y horas de luz por latitud.",
    fact: "La atmósfera gira solidariamente con la corteza terrestre, evitando vientos de 1.670 km/h.",
    stats: [["Velocidad Ecuador", "1.670 km/h"], ["Periodo Sidéreo", "23h 56m 4s"]],
    buildKey: "daynight"
  },
  {
    name: "Traslación y Duración del Año",
    badge: "365,2422 días",
    desc: "Órbita elíptica kepleriana real con foco desfasado en el Sol. Distancia real Tierra-Sol en km, velocímetro de Perihelio/Afelio y años bisiestos.",
    fact: "El desfasaje de 0.2422 días por año exige añadir el 29 de febrero cada 4 años.",
    stats: [["Velocidad Media", "107.000 km/h"], ["Perihelio", "147,1 M km"]],
    buildKey: "orbit"
  },
  {
    name: "Estaciones del Año y Oblicuidad",
    badge: "Eje inclinado 23.44°",
    desc: "Demostración de que la inclinación del eje de 23.44° (fija en el espacio inercial) altera la densidad de radiación solar (W/m²) en cada hemisferio.",
    fact: "En el Perihelio (enero) estamos más cerca del Sol que en julio, demostrando que la distancia NO causa las estaciones.",
    stats: [["Inclinación Axial", "23.44°"], ["Solsticio Verano", "21 de Junio"]],
    buildKey: "seasons"
  },
  {
    name: "El Sistema Solar",
    badge: "4.500 M de km",
    desc: "Una estrella, 8 planetas, cientos de lunas y millones de asteroides.",
    fact: "La luz tarda 4,5 horas en llegar a Neptuno.",
    stats: [["Planetas", "8"], ["Luz a Neptuno", "4,2 h"]],
    buildKey: "solar"
  },
  {
    name: "Nube de Oort",
    badge: "1,5 años luz",
    desc: "La frontera real: una nube esférica con billones de cometas.",
    fact: "Voyager 1 tardará 300 años en llegar y 30.000 en cruzarla.",
    stats: [["Extensión", "100.000 UA"], ["Contenido", "Cometas ☄️"]],
    buildKey: "oort"
  },
  {
    name: "Estrellas vecinas",
    badge: "4 – 11 años luz",
    desc: "Cada punto es un sol. Próxima Centauri tiene un planeta en zona habitable.",
    fact: "A velocidad de Voyager, Próxima queda a 75.000 años de viaje.",
    stats: [["Próxima", "4,24 a.l."], ["Sirio", "8,6 a.l."]],
    buildKey: "nearby"
  },
  {
    name: "La Vía Láctea",
    badge: "100.000 años luz",
    desc: "Espiral con ~200.000 millones de estrellas. El Sol vive en el brazo de Orión.",
    fact: "El Sol orbita el centro a 828.000 km/h.",
    stats: [["Estrellas", "200.000 M"], ["Forma", "Espiral 🌀"]],
    buildKey: "milkyway"
  },
  {
    name: "El Grupo Local",
    badge: "10 M de años luz",
    desc: "+80 galaxias unidas por gravedad. Vía Láctea y Andrómeda dominan.",
    fact: "Se fusionarán en ~4.500 millones de años.",
    stats: [["Galaxias", "+80"], ["Andrómeda", "2,5 M a.l."]],
    buildKey: "localgroup"
  },
  {
    name: "Laniakea",
    badge: "520 M de años luz",
    desc: "La red cósmica: filamentos de galaxias fluyendo hacia el Gran Atractor.",
    fact: "Laniakea = 'cielo inmenso' en hawaiano.",
    stats: [["Galaxias", "100.000"], ["Descubierto", "2014"]],
    buildKey: "laniakea"
  },
  {
    name: "Universo observable",
    badge: "93.000 M años luz",
    desc: "Todo lo cuya luz ha tenido tiempo de llegarnos desde el Big Bang.",
    fact: "Hay ~2 billones de galaxias. Y puede que haya infinito más allá.",
    stats: [["Edad", "13.800 M años"], ["Galaxias", "2 billones"]],
    buildKey: "observable"
  }
];

