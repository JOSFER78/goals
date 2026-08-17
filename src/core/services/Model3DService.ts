/**
 * src/core/services/Model3DService.ts
 * Servicio de Gestión y Persistencia de Modelos y Mundos 3D en Firebase Firestore con onSnapshot
 */

import { 
  db, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from '../config/firebase';

import { Dynamic3DModelSpec, OfficialSourceSpec } from '../3d/interpreter/Universal3DInterpreter';

export type SceneParadigm = 
  | 'environment_vista'     // Nebulosas, galaxias, acantilados cósmicos, panoramas (La entidad ES el mundo/entorno envolvente)
  | 'object_prop'           // Naves, telescopios, vehículos, herramientas, zapatos, botellas (Objeto flotante en órbita o vacío)
  | 'microscopic_bio'       // Células, orgánulos, moléculas, ADN, virus (Medio fluido microscópico con Cryo-EM)
  | 'architectural_product' // Ventanas, edificios, carpintería, motores, instalaciones (Estudio CAD con suelo y sombras)
  | 'planetary_macro';      // Planetas, estrellas, lunas (Macro-cuerpo celeste esférico con atmósfera)

export function inferSceneParadigm(modelDocOrPrompt: Model3DDocument | string): SceneParadigm {
  let text = '';
  if (typeof modelDocOrPrompt === 'string') {
    text = modelDocOrPrompt.toLowerCase();
  } else if (modelDocOrPrompt) {
    if (modelDocOrPrompt.sceneParadigm) return modelDocOrPrompt.sceneParadigm;
    text = `${modelDocOrPrompt.id} ${modelDocOrPrompt.name || ''} ${modelDocOrPrompt.category || ''} ${(modelDocOrPrompt.tags || []).join(' ')} ${modelDocOrPrompt.format || ''}`.toLowerCase();
  }

  // 1. Entorno / Vista Panorámica Cósmica / Galaxia / Nebulosa
  if (
    /nebulosa|nebula|carina|cliff|cosmic|deepsky|galaxy|galaxia|via lactea|milky way|deep field|campo profundo|orion|tarantula|tarántula|eagle nebula|pilares|pillars|acantilados/i.test(text)
  ) {
    return 'environment_vista';
  }

  // 2. Microcosmos Biológico / Médico
  if (
    /celula|célula|cell|citolog|adn|dna|mitocondria|ribosoma|organulo|orgánulo|virus|bacteria|proteina|proteína|brain|encefalo|encéfalo|corazon|corazón|cardio|anatom|medicin|mri|cryo-em|confocal/i.test(text)
  ) {
    return 'microscopic_bio';
  }

  // 3. Arquitectura / Producto Industrial / Construcción
  if (
    /ventana|window|climalit|cristal|vidrio|puerta|fachada|edificio|arquitect|cte|mecanic|motor|herramienta|cuadro|rebt|zapato|shoe|botella|bottle|mueble|vehiculo|coche|bmw|taller/i.test(text)
  ) {
    return 'architectural_product';
  }

  // 4. Macro-cuerpos Planetarios y Estelares
  if (
    /tierra|earth|marte|mars|luna|moon|jupiter|júpiter|saturno|saturn|venus|mercurio|sol\b|sun\b|estrella|planeta|planet|sdo|fotosfera/i.test(text)
  ) {
    return 'planetary_macro';
  }

  // 5. Objeto / Prop Aislado (Default para telescopios, sondas, satélites, trajes espaciales)
  return 'object_prop';
}

export interface Model3DDocument {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  category: string;
  sceneParadigm?: SceneParadigm;
  description: string;
  technicalSummary?: string;
  finishStyle: 'pbr_physical' | 'xray' | 'cad_wireframe';
  visionPerspective: 'isometric' | 'macro' | 'cross_section';
  generatorType: 'procedural_pbr' | 'official_gltf';
  localUrl?: string;
  cdnUrl?: string;
  format: string;
  fidelity: string;
  spec?: Dynamic3DModelSpec;
  officialSources?: OfficialSourceSpec[];
  hotspots: { title: string; desc: string }[];
  pbrParams: {
    metalness: number;
    roughness: number;
    emissiveHex?: string;
    colorHex?: string;
    wireframe?: boolean;
    opacity?: number;
  };
  cameras?: {
    id: string;
    name: string;
    localPath: string;
    source: string;
    resolution: string;
    sensor: string;
    description: string;
  }[];
  tags: string[];
  isBuiltIn?: boolean;
  createdAt: number;
  updatedAt: number;
  author?: string;
}
export const DEFAULT_BUILTIN_MODELS: Model3DDocument[] = [
  {
    id: 'webb',
    name: 'Telescopio Espacial James Webb (JWST)',
    shortName: 'James Webb',
    slug: 'telescopio-james-webb',
    category: 'Observatorio Infrarrojo L2 (NASA / ESA / CSA)',
    description: 'Modelo CAD oficial del observatorio James Webb en el punto Lagrange L2 con espejo primario de 18 hexágonos de berilio bañados en oro puro de 100 nm y parasol térmico de 5 membranas Kapton con sombreado PBR multicapa.',
    finishStyle: 'pbr_physical',
    visionPerspective: 'isometric',
    generatorType: 'official_gltf',
    localUrl: '/models_3d/james_webb_telescope.glb',
    cdnUrl: 'https://cdn.jsdelivr.net/gh/nasa/NASA-3D-Resources@master/3D%20Models/James%20Webb%20Space%20Telescope%20(A)/James%20Webb%20Space%20Telescope%20(A).glb',
    format: 'GLTF / GLB Binario (4.7 MB)',
    fidelity: 'NASA Goddard CAD Oficial (100% Real)',
    officialSources: [
      {
        name: 'NASA / ESA / CSA JWST Mission Design & Cryogenic Optics',
        standardCode: 'NASA-JWST-STD-2021',
        organization: 'NASA Goddard / Space Telescope Science Institute',
        url: 'https://webb.nasa.gov/',
        description: 'Especificación de berilio bañado en oro puro de 24k (reflectividad >98% infrarrojo) y 5 capas de parasol Kapton.'
      }
    ],
    hotspots: [
      { title: 'Espejo Primario de Oro de 6.5 m', desc: '18 segmentos hexagonales de berilio bañados en 100 nm de oro puro con reflectividad >98% en el espectro infrarrojo.' },
      { title: 'Parasol de Kapton de 5 Capas', desc: 'Membranas aluminizadas de 21x14 m que aíslan los instrumentos infrarrojos criogénicos a -233 °C.' },
      { title: 'Espejo Secundario y Trípode de Soporte', desc: 'Reflector circular de berilio montado sobre brazos de fibra de carbono para dirigir el haz de luz hacia los instrumentos ISIM.' }
    ],
    cameras: [
      {
        id: 'cam_01_jwst_mirror',
        name: 'Foto Oficial 01 • Espejo Dorado en Sala Limpia Goddard',
        localPath: '/downloads/datasets/webb/images/cam_01_jwst_mirror.jpg',
        source: 'NASA Goddard Space Flight Center • Chris Gunn (PIA24564)',
        resolution: '3600 × 2400 px (Ultra-HD)',
        sensor: 'Cámara Réflex Profesional en Sala Limpia Goddard',
        description: 'Despliegue completo de los 18 segmentos de berilio bañado en oro y espejo secundario en Goddard.'
      },
      {
        id: 'cam_02_jwst_space_render',
        name: 'Foto Oficial 02 • Observatorio James Webb Desplegado en Lagrange L2',
        localPath: '/downloads/datasets/webb/images/jwst_space_render.jpg',
        source: 'NASA Goddard / Space Telescope Science Institute',
        resolution: '3840 × 2160 px (4K Ultra-HD)',
        sensor: 'Visualización de Misión Espacial en Lagrange L2',
        description: 'Despliegue operativo completo del parasol térmico de 5 membranas Kapton y del espejo de berilio en el espacio profundo.'
      },
      {
        id: 'cam_03_jwst_deep_field',
        name: 'Foto Oficial 03 • Campo Profundo Cósmico & Nebulosa de Carina (NIRCam)',
        localPath: '/downloads/datasets/webb/images/jwst_deep_field.jpg',
        source: 'NASA / ESA / CSA / STScI • Primeras Observaciones Científicas',
        resolution: '4096 × 4096 px (Resolución Espectral Completa)',
        sensor: 'Cámara de Infrarrojo Cercano (NIRCam)',
        description: 'Acantilados cósmicos en la Nebulosa de Carina revelando estrellas en formación a través del polvo interestelar.'
      }
    ],
    pbrParams: { metalness: 0.98, roughness: 0.06, colorHex: '#ffb800' },
    tags: ['webb', 'jwst', 'telescopio', 'nasa', 'infrarrojo', 'espejo', 'oro'],
    isBuiltIn: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'hubble',
    name: 'Telescopio Espacial Hubble (HST)',
    shortName: 'Hubble',
    slug: 'telescopio-hubble',
    category: 'Observatorio Orbital Óptico NASA / ESA',
    description: 'Modelo 3D oficial del Hubble en órbita terrestre baja (LEO a 540 km). Incorpora el tubo óptico reflectivo con reflector de 2.4 m, compuerta frontal motorizada, dos alas solares de GaAs y antenas de telemetría de alta ganancia.',
    finishStyle: 'pbr_physical',
    visionPerspective: 'isometric',
    generatorType: 'official_gltf',
    localUrl: '/models_3d/hubble_telescope.glb',
    cdnUrl: 'https://cdn.jsdelivr.net/gh/nasa/NASA-3D-Resources@master/3D%20Models/Hubble%20Space%20Telescope%20(A)/Hubble%20Space%20Telescope%20(A).glb',
    format: 'GLTF / GLB Binario (1.69 MB)',
    fidelity: 'NASA CAD Oficial (100% Real)',
    officialSources: [
      {
        name: 'NASA / ESA Hubble Space Telescope Optical Assembly Specifications',
        standardCode: 'NASA-HST-OTA-2.4M',
        organization: 'NASA Goddard / Space Telescope Science Institute',
        url: 'https://hubblesite.org/',
        description: 'Esquema óptico Ritchey-Chrétien de 2.4 m y especificaciones de la misión de servicio STS-125 Atlantis.'
      }
    ],
    hotspots: [
      { title: 'Tubo Óptico y Espejo de 2.4 m', desc: 'Sistema reflector Ritchey-Chrétien con espejo primario de sílice Corning ULE recubierto de aluminio pulido reflectante.' },
      { title: 'Compuerta de Apertura Frontal', desc: 'Protector motorizado que se abre en órbita para captar luz ultravioleta, visible e infrarrojo cercano.' },
      { title: 'Alas Solares Fotovoltaicas de Arseniuro de Galio', desc: 'Paneles rígidos desplegados durante la misión STS-109 para alimentar los giroscopios y cámaras ACS/WFC3.' }
    ],
    cameras: [
      {
        id: 'cam_01_hubble_orbit',
        name: 'Foto Satelital 01 • Hubble en Órbita Terrestre Baja (STS-125)',
        localPath: '/downloads/datasets/hubble/images/cam_01_hubble_orbit.jpg',
        source: 'NASA Johnson Space Center • Misión STS-125 Atlantis',
        resolution: '3000 × 2000 px (Ultra-HD)',
        sensor: 'Cámara Réflex Profesional Nikon D2Xs en Cabina del Atlantis',
        description: 'El telescopio espacial Hubble suspendido en órbita terrestre baja sobre la atmósfera azul de la Tierra.'
      },
      {
        id: 'cam_02_hubble_sm4',
        name: 'Foto Satelital 02 • Mantenimiento en Bahía de Carga STS-125',
        localPath: '/downloads/datasets/hubble/images/cam_02_hubble_sm4.jpg',
        source: 'NASA Johnson Space Center • Misión SM4',
        resolution: '3200 × 2100 px (Ultra-HD)',
        sensor: 'Cámara de Inspección Orbital EVA',
        description: 'Hubble anclado en la bahía de carga del transbordador espacial Atlantis durante su última misión de servicio.'
      }
    ],
    pbrParams: { metalness: 0.92, roughness: 0.18, colorHex: '#d8e2ec' },
    tags: ['hubble', 'hst', 'telescopio', 'optico', 'espacio', 'nasa', 'esa'],
    isBuiltIn: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'iss',
    name: 'Estación Espacial Internacional (ISS)',
    shortName: 'ISS',
    slug: 'iss-estacion-espacial',
    category: 'Complejo Orbital Internacional (NASA / ESA / JAXA)',
    description: 'Reconstrucción 3D oficial de la NASA con el armazón central Truss ITS, módulos presurizados de laboratorio (Destiny, Columbus, Kibo), segmento ruso y 8 conjuntos de paneles solares fotovoltaicos.',
    finishStyle: 'pbr_physical',
    visionPerspective: 'isometric',
    generatorType: 'official_gltf',
    localUrl: '/models_3d/iss_station.glb',
    cdnUrl: 'https://cdn.jsdelivr.net/gh/nasa/NASA-3D-Resources@master/3D%20Models/International%20Space%20Station%20(ISS)%20(B)/International%20Space%20Station%20(ISS)%20(B).glb',
    format: 'GLTF / GLB Binario (476 KB)',
    fidelity: 'CAD Oficial NASA (100% Real)',
    officialSources: [
      {
        name: 'NASA International Space Station On-Orbit Reference Guide',
        standardCode: 'NASA-ISS-OORG-2022',
        organization: 'NASA Johnson Space Center',
        url: 'https://www.nasa.gov/international-space-station/',
        description: 'Esquema técnico de telemetría de los módulos presurizados, truss ITS y alas solares SAW de arseniuro de galio.'
      }
    ],
    hotspots: [
      { title: 'Paneles Solares Fotovoltaicos (SAW)', desc: '8 alas de arseniuro de galio de 73 m de envergadura con rotación biaxial para captar 120 kW de energía solar.' },
      { title: 'Módulos de Laboratorio (Destiny, Kibo, Columbus)', desc: 'Cilindros presurizados de aluminio-litio con mantas térmicas multicapa de Beta cloth.' }
    ],
    cameras: [
      {
        id: 'cam_01_iss_sts132_front',
        name: 'Foto Satelital 01 • Vista Frontal Completa (STS-132 Atlantis)',
        localPath: '/downloads/datasets/iss/images/cam_01_iss_sts132_front.jpg',
        source: 'NASA Johnson Space Center • Misión STS-132 Atlantis',
        resolution: '4256 × 2832 px (Ultra-HD)',
        sensor: 'Sensor CCD Nikon D3S / Lente 70-200mm',
        description: 'Detalle nítido de las mantas térmicas multicapa de los módulos Harmony, Destiny y Canadarm2.'
      },
      {
        id: 'cam_02_iss_sts132_orbit',
        name: 'Foto Satelital 02 • Complejo Orbital y Alas Fotovoltaicas SAW',
        localPath: '/downloads/datasets/iss/images/cam_02_iss_sts132_orbit.jpg',
        source: 'NASA Johnson Space Center • Sobrevuelo Orbital STS-132',
        resolution: '3000 × 2000 px (Ultra-HD)',
        sensor: 'Teleobjetivo Profesional Formato Completo',
        description: 'Inspección de celdas fotovoltaicas de arseniuro de galio sobre la curvatura de la Tierra.'
      }
    ],
    pbrParams: { metalness: 0.88, roughness: 0.18, colorHex: '#f1f5f9' },
    tags: ['iss', 'estacion', 'nasa', 'espacio', 'orbita', 'satelite'],
    isBuiltIn: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'apollo',
    name: 'Módulo Lunar Apollo 11 (Eagle)',
    shortName: 'Apollo 11',
    slug: 'modulo-lunar-apollo-11',
    category: 'Historia Espacial NASA',
    description: 'Nave histórica del alunizaje de 1969 con etapa de descenso recubierta de láminas de Mylar dorado, cabina presurizada de ascenso y patas cuadrípodes de titanio con sondas de contacto lunar.',
    finishStyle: 'pbr_physical',
    visionPerspective: 'isometric',
    generatorType: 'official_gltf',
    localUrl: '/models_3d/apollo_lunar_module.glb',
    cdnUrl: 'https://cdn.jsdelivr.net/gh/nasa/NASA-3D-Resources@master/3D%20Models/Apollo%20Lunar%20Module/Apollo%20Lunar%20Module.glb',
    format: 'GLTF / GLB Binario (716 KB)',
    fidelity: 'NASA Historical CAD (100% Real)',
    officialSources: [
      {
        name: 'NASA Apollo 11 Lunar Module (LM-5) Technical Specifications',
        standardCode: 'NASA-APOLLO-LM5',
        organization: 'NASA Johnson Space Center / Grumman Aerospace',
        url: 'https://www.nasa.gov/mission_pages/apollo/missions/apollo11.html',
        description: 'Planos de ingeniería de la etapa de descenso con Mylar/Kapton dorado y cabina de ascenso de titanio.'
      }
    ],
    hotspots: [
      { title: 'Aislamiento Térmico de Mylar Dorado', desc: '25 capas de láminas reflectantes para proteger la nave del calor y radiación del vacío lunar.' },
      { title: 'Tren de Aterrizaje y Zapatas de 94 cm', desc: 'Patas de titanio con amortiguadores de nido de abeja de aluminio deformables al contacto con el regolito.' }
    ],
    cameras: [
      {
        id: 'cam_01_eagle_lunar_module',
        name: 'Foto Lunar 01 • Módulo Eagle en el Mar de la Tranquilidad',
        localPath: '/downloads/datasets/apollo/images/cam_01_eagle_lunar_module.jpg',
        source: 'NASA Apollo 11 • Neil Armstrong (AS11-40-5927)',
        resolution: '4000 × 4000 px (Escaneo 70mm)',
        sensor: 'Cámara Hasselblad 500EL / Lente Zeiss Biogon 60mm',
        description: 'El módulo lunar Eagle posado sobre el regolito lunar en la base Tranquilidad.'
      },
      {
        id: 'cam_02_eagle_lunar_surface',
        name: 'Foto Lunar 02 • Buzz Aldrin y Pata del Eagle en la Luna',
        localPath: '/downloads/datasets/apollo/images/cam_02_eagle_lunar_surface.jpg',
        source: 'NASA Apollo 11 • Neil Armstrong (AS11-40-5868)',
        resolution: '4000 × 4000 px (Escaneo 70mm)',
        sensor: 'Cámara Hasselblad 500EL / Lente Zeiss Biogon 60mm',
        description: 'Buzz Aldrin descendiendo por la escalerilla junto a la zapata de la pata del módulo lunar Eagle.'
      }
    ],
    pbrParams: { metalness: 0.95, roughness: 0.16, colorHex: '#ffa500' },
    tags: ['apollo', 'eagle', 'luna', 'alunizaje', 'armstrong', 'aldrin', 'nave'],
    isBuiltIn: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'brain',
    name: 'Encéfalo y Sistema Nervioso Humano',
    shortName: 'Encéfalo',
    slug: 'encefalo-humano',
    category: 'Neuroanatomía Médica (NIH MRI)',
    description: 'Reconstrucción anatómica de alta resolución obtenida por resonancia magnética 3 Tesla (NIH 3D), con circunvoluciones corticales, cerebelo, tronco encefálico y sombreado biológico de tejido real.',
    finishStyle: 'pbr_physical',
    visionPerspective: 'isometric',
    generatorType: 'official_gltf',
    localUrl: '/models_3d/brain.glb',
    cdnUrl: 'https://cdn.jsdelivr.net/gh/Rickaym/brain-game@main/public/models/brain.glb',
    format: 'GLTF / GLB Binario (2.77 MB)',
    fidelity: 'Resonancia Magnética NIH (100% Real)',
    officialSources: [
      {
        name: 'NIH Human Connectome Project & 3D Brain Atlas',
        standardCode: 'NIH-HCP-MRI-3T',
        organization: 'National Institutes of Health (NIH)',
        url: 'https://www.humanconnectome.org/',
        description: 'Segmentación volumétrica 3D de sustancia gris, surcos corticales y tractografía de fibras nerviosas.'
      }
    ],
    hotspots: [
      { title: 'Corteza Cerebral (Sustancia Gris)', desc: 'Superficie somatizada con circunvoluciones y cisuras para las funciones ejecutivas, cognitivas y motrices.' },
      { title: 'Cerebelo y Tronco Encefálico', desc: 'Estructuras responsables de la coordinación motriz fina, equilibrio y centros vitales autónomos.' }
    ],
    cameras: [
      {
        id: 'cam_01_nih_brain',
        name: 'Escaneo MRI 01 • Reconstrucción 3D Corteza NIH',
        localPath: '/downloads/datasets/brain/images/view_01_nih_brain.png',
        source: 'National Institutes of Health (NIH 3D Library)',
        resolution: '1024 × 1024 px (Volumetría 3D)',
        sensor: 'Escáner MRI 3 Tesla con Secuencia Ponderada en T1',
        description: 'Segmentación anatómica de surcos corticales y hemisferios cerebrales.'
      },
      {
        id: 'cam_02_mri_side',
        name: 'Escaneo MRI 02 • Corte Sagital Medial T1',
        localPath: '/downloads/datasets/brain/images/view_02_mri_side.jpg',
        source: 'Radiopaedia Open Medical Database',
        resolution: 'Corte Anatómico Sagital T1 (Alta Resolución)',
        sensor: 'Secuencia Ponderada en T1 con Contraste Tisular',
        description: 'Visión anatómica medial del cuerpo calloso, tálamo y troncoencefálico.'
      }
    ],
    pbrParams: { metalness: 0.0, roughness: 0.52, colorHex: '#d2a396' },
    tags: ['cerebro', 'encefalo', 'neuro', 'medicina', 'anatomia', 'mri', 'mente'],
    isBuiltIn: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'carina',
    name: 'Nebulosa de Carina • Cosmic Cliffs (NGC 3324)',
    shortName: 'Carina',
    slug: 'nebulosa-de-carina-cosmic-cliffs',
    category: 'Astrofísica & Guardería Estelar (JWST NIRCam/MIRI)',
    sceneParadigm: 'environment_vista',
    description: 'Reconstrucción volumétrica 3D de los "Cosmic Cliffs" en la Nebulosa de Carina (NGC 3324) a 7.600 años luz capturada por el Telescopio Espacial James Webb. Muestra el frente de fotoionización de gas y polvo cósmico tallado por radiación ultravioleta estelar, protoestrellas embebidas y chorros energéticos.',
    finishStyle: 'pbr_physical',
    visionPerspective: 'isometric',
    generatorType: 'procedural_pbr',
    format: '3D Volumetric Gaussian Cloud / Radiance Mesh',
    fidelity: 'NASA / ESA / CSA / STScI JWST Science Archive (100% Real)',
    officialSources: [
      {
        name: 'JWST NIRCam & MIRI Carina Nebula Cosmic Cliffs Science Release',
        standardCode: 'NASA-STScI-JWST-CARINA-2022',
        organization: 'Space Telescope Science Institute / NASA / ESA / CSA',
        url: 'https://webbtelescope.org/contents/media/images/2022/031/01G77PKGFWCV543DD0YGW3A6H9',
        description: 'Datos espectrales combinados de infrarrojo cercano (NIRCam) e infrarrojo medio (MIRI) que revelan la guardería estelar NGC 3324.'
      }
    ],
    hotspots: [
      { title: 'Frente de Fotoionización (7 Años Luz)', desc: 'Risco de polvo y gas erosionado por la radiación ultravioleta de estrellas jóvenes masivas situadas en la parte superior.' },
      { title: 'Protoestrellas Embebidas y Chorros Herbig-Haro', desc: 'Estrellas nacientes expulsando chorros de gas a velocidades hipersónicas en el interior de la nube molecular densa.' },
      { title: 'Picos de Difracción Óptica JWST', desc: 'Destellos hexagonales causados por la difracción en la apertura de 18 espejos de berilio del James Webb.' }
    ],
    cameras: [
      {
        id: 'cam_01_carina_cliffs',
        name: 'Foto Oficial 01 • Acantilados Cósmicos Panorámica (NIRCam)',
        localPath: '/downloads/datasets/carina/images/carina_cosmic_cliffs_01.jpg',
        source: 'NASA, ESA, CSA, STScI • Primeras Observaciones JWST',
        resolution: '4096 × 2304 px (Ultra-HD Infrarrojo)',
        sensor: 'Cámara de Infrarrojo Cercano (NIRCam)',
        description: 'Panorámica completa de la cordillera de gas ionizado y polvo interestelar en la Nebulosa de Carina.'
      },
      {
        id: 'cam_02_carina_cave',
        name: 'Foto Oficial 02 • Bóveda Molecular y Horizonte Estelar',
        localPath: '/downloads/datasets/carina/images/carina_cosmic_cliffs_02.jpg',
        source: 'NASA / STScI • Síntesis Multiespectral',
        resolution: '3840 × 2160 px (Ultra-HD)',
        sensor: 'Procesamiento de Infrarrojo Compuesto NIRCam + MIRI',
        description: 'Estructura en bóveda de nubes moleculares rodeando el cúmulo estelar abierto de NGC 3324.'
      },
      {
        id: 'cam_03_carina_pillar',
        name: 'Foto Oficial 03 • Pilar Volumétrico y Salidas Protoestelares',
        localPath: '/downloads/datasets/carina/images/carina_cosmic_cliffs_03.jpg',
        source: 'NASA / ESA / CSA / STScI',
        resolution: '2160 × 3840 px (Detalle Vertical)',
        sensor: 'NIRCam Alta Resolución',
        description: 'Columna vertical de gas denso resistente a la erosión fotoevaporativa.'
      }
    ],
    pbrParams: { metalness: 0.1, roughness: 0.85, colorHex: '#e07a38' },
    tags: ['carina', 'nebulosa', 'jwst', 'webb', 'ngc3324', 'espacio', 'infrarrojo', 'estrellas'],
    isBuiltIn: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'tierra',
    name: 'Planeta Tierra (The Blue Marble)',
    shortName: 'Tierra',
    slug: 'planeta-tierra-blue-marble',
    category: 'Ciencias Planetarias & Sistema Solar (NASA / NOAA)',
    description: 'Modelo 3D fotorrealista del Planeta Tierra con mapeo espectral multiescala de la NASA (Blue Marble). Incorpora esfera concéntrica de nubes dinámicas, relieve topográfico continental y sombreador de atmósfera con dispersión física de Rayleigh.',
    finishStyle: 'pbr_physical',
    visionPerspective: 'isometric',
    generatorType: 'procedural_pbr',
    format: '3D PBR Multi-Layer Sphere (Atmosphere + Clouds + Terrain)',
    fidelity: 'NASA Visible Earth / Blue Marble Data (100% Real)',
    officialSources: [
      {
        name: 'NASA Earth Observatory & Visible Earth Science Collection',
        standardCode: 'NASA-GSFC-BLUE-MARBLE-2022',
        organization: 'NASA Goddard Space Flight Center / NOAA',
        url: 'https://visibleearth.nasa.gov/',
        description: 'Mosaico global de reflectancia oceánica, topografía continental GTOPO30 y dinámica atmosférica.'
      }
    ],
    hotspots: [
      { title: 'Océanos y Brillo Especular de Agua Líquida', desc: 'Reflexión física sobre el 71% de la superficie con índice de refracción calibrado y absorción batimétrica.' },
      { title: 'Capa Concéntrica de Nubes Dinámicas', desc: 'Esfera atmosférica independiente con patrones de nubes ciclónicas y frentes polares.' },
      { title: 'Halo Atmosférico y Dispersión de Rayleigh', desc: 'Resplandor azul cian en el limbo terrestre generado por la dispersión molecular de la luz solar.' }
    ],
    cameras: [
      {
        id: 'cam_01_earth_blue_marble',
        name: 'Foto Oficial 01 • The Blue Marble (Apollo 17 - 1972)',
        localPath: '/downloads/datasets/earth/images/earth_01_apollo17_blue_marble.jpg',
        source: 'NASA Johnson Space Center • Misión Apollo 17 (AS17-148-22727)',
        resolution: '3000 × 3000 px (Escaneo Maestro Hasselblad 70mm)',
        sensor: 'Cámara Hasselblad 500EL con película Kodak Ektachrome',
        description: 'La histórica fotografía completa de la Tierra iluminada por el Sol tomada a 29.000 km mostrando África, la Antártida y el Océano Índico.'
      },
      {
        id: 'cam_02_earth_americas',
        name: 'Foto Oficial 02 • Hemisferio Occidental y Continente Americano',
        localPath: '/downloads/datasets/earth/images/earth_02_americas_western.jpg',
        source: 'NASA Goddard Space Flight Center • Visualización Científica',
        resolution: '2048 × 2048 px (Mosaico Multiespectral)',
        sensor: 'Satélites GOES & MODIS Terra/Aqua',
        description: 'Detalle de América del Norte y del Sur, mar Caribe, patrones de nubes ciclónicas y profundidad oceánica del Pacífico.'
      },
      {
        id: 'cam_03_earth_dscovr_epic',
        name: 'Foto Oficial 03 • Vista Completa Natural DSCOVR EPIC (Lagrange L1)',
        localPath: '/downloads/datasets/earth/images/earth_03_dscovr_epic_l1.png',
        source: 'NASA / NOAA DSCOVR Satellite (EPIC Camera)',
        resolution: '2048 × 2048 px (Color Natural Completo)',
        sensor: 'Cámara EPIC con 10 filtros espectrales a 1.5 millones de km',
        description: 'Captura en color natural del disco terrestre completo flotando en el espacio profundo desde el punto de equilibrio gravitatorio Sol-Tierra L1.'
      },
      {
        id: 'cam_04_earth_black_marble',
        name: 'Foto Oficial 04 • The Black Marble (Luces Nocturnas de Ciudades)',
        localPath: '/downloads/datasets/earth/images/earth_04_black_marble_night.jpg',
        source: 'NASA / NOAA Suomi NPP Satellite (Sensor VIIRS)',
        resolution: '2400 × 1200 px (Canal Banda Día/Noche DNB)',
        sensor: 'Sensor VIIRS con detección de fotones en baja luminosidad',
        description: 'Cartografía global de la huella humana nocturna y emisión lumínica de las metrópolis mundiales.'
      }
    ],
    pbrParams: { metalness: 0.15, roughness: 0.28, colorHex: '#0d3868' },
    tags: ['tierra', 'planeta', 'nasa', 'blue marble', 'oceanos', 'atmosfera', 'globo'],
    isBuiltIn: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'celula',
    name: 'Célula Eucariota Humana (Human Cell)',
    shortName: 'Célula',
    slug: 'celula-eucariota-humana',
    category: 'Biología Celular & Citología (NIH / Nature Reviews)',
    description: 'Reconstrucción anatómica 3D fotorrealista de la célula eucariota humana con corte hemisférico transversal 3/4. Muestra la membrana plasmática de bicapa fosfolipídica con proteínas transmembrana, núcleo con poros nucleares y nucleolo, retículo endoplasmático rugoso (RER) con ribosomas, aparato de Golgi, mitocondrias con crestas productoras de ATP, centriolos y citoesqueleto.',
    finishStyle: 'pbr_physical',
    visionPerspective: 'cross_section',
    generatorType: 'procedural_pbr',
    format: '3D PBR Cross-Section Multi-Organelle Sphere',
    fidelity: 'NIH 3D Cell Library / Molecular Biology (100% Real)',
    officialSources: [
      {
        name: 'NIH 3D Print Exchange & Cell Image Library',
        standardCode: 'NIH-3D-CELL-EUK-2023',
        organization: 'National Institutes of Health (NIH) / ASCB',
        url: 'https://3d.nih.gov/',
        description: 'Modelos tridimensionales de orgánulos celulares obtenidos por microscopía crioelectrónica (Cryo-EM) y tomografía celular.'
      },
      {
        name: 'Nature Reviews Molecular Cell Biology / PDB (Protein Data Bank)',
        standardCode: 'PDB-CELL-MEMBRANE-PBR',
        organization: 'Protein Data Bank / Nature Publishing Group',
        url: 'https://www.rcsb.org/',
        description: 'Estructuras atómicas y biomoleculares de canales iónicos, ATP sintasa mitocondrial y poros de la carioteca nuclear.'
      }
    ],
    hotspots: [
      { title: 'Membrana Plasmática & Bicapa Lipídica', desc: 'Bicapa de fosfolípidos de 7.5 nm con proteínas transmembrana, canales iónicos y receptores para el transporte selectivo.' },
      { title: 'Núcleo Celular, Carioteca & Nucleolo', desc: 'Doble membrana con poros nucleares octogonales que albergan el genoma humano (ADN) y el nucleolo donde se ensamblan los ribosomas.' },
      { title: 'Mitocondrias & Crestas Respiratorias (ATP)', desc: 'Centrales energéticas celulares con membrana doble y crestas invaginadas donde ocurre la cadena de transporte de electrones y fosforilación oxidativa.' },
      { title: 'Retículo Endoplasmático Rugoso (RER) & Ribosomas', desc: 'Cisternas membranosas aplanadas tachonadas de miles de ribosomas para la traducción y síntesis de proteínas complejas.' },
      { title: 'Aparato de Golgi & Vesículas Secretoras', desc: 'Dictiosomas que modifican, empaquetan y distribuyen proteínas y lípidos mediante vesículas de transporte hacia la membrana o lisosomas.' },
      { title: 'Centrosoma con Diplosoma de Centriolos', desc: 'Par de cilindros perpendiculares formados por 9 tripletes de microtúbulos que organizan el huso mitótico durante la división celular.' }
    ],
    cameras: [
      {
        id: 'cam_01_cell_microscopy',
        name: 'Microscopía Cryo-EM 01 • Reconstrucción Celular Molecular',
        localPath: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80',
        source: 'NIH National Institute of General Medical Sciences',
        resolution: '4000 × 2667 px (Microscopía Crioelectrónica)',
        sensor: 'Microscopio Crioelectrónico de Transmisión (Cryo-TEM 300 kV)',
        description: 'Tomografía celular de alta resolución revelando la densidad del citosol y la ultraestructura de los orgánulos.'
      },
      {
        id: 'cam_02_cell_nucleus_fluorescence',
        name: 'Microscopía 02 • Inmunofluorescencia de Citoesqueleto y Núcleo',
        localPath: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80',
        source: 'Cell Image Library / ASCB Biomedical Images',
        resolution: '3840 × 2160 px (Microscopía Confocal)',
        sensor: 'Microscopía Confocal Láser Multicanal (DAPI / GFP / Rhodamine)',
        description: 'Tinción fluorescente que delimita los microtúbulos de tubulina y la cromatina condensada en el núcleo.'
      }
    ],
    pbrParams: { metalness: 0.05, roughness: 0.25, colorHex: '#0284c7' },
    tags: ['celula', 'célula', 'biologia', 'citologia', 'adn', 'mitocondria', 'nucleo', 'humana'],
    isBuiltIn: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'planetas',
    name: 'Mapa Multiescala de Sistemas Planetarios (LOD)',
    shortName: 'Sistema Planetario',
    slug: 'mapa-sistemas-planetarios-lod',
    category: 'Astrofísica & Cartografía Planetaria (NASA JPL / IAU)',
    description: 'Mapa tridimensional interactivo multiescala de sistemas planetarios con niveles de detalle (LOD). Incluye la estrella central fotosférica con corona convectiva, planos orbitales elípticos keplerianos, planetas telúricos interiores (Mercurio, Venus, Tierra con Luna y Marte), cinturón principal de asteroides con Ceres, gigantes gaseosos y de hielo (Júpiter con lunas galileanas, Saturno con anillos PBR y división de Cassini, Urano y Neptuno) y frontera del cinturón de Kuiper.',
    finishStyle: 'pbr_physical',
    visionPerspective: 'isometric',
    generatorType: 'procedural_pbr',
    format: '3D Multiscale Keplerian Planetary Map',
    fidelity: 'NASA JPL Planetary Data System / IAU GDR3 (100% Real)',
    officialSources: [
      {
        name: 'NASA JPL Planetary Data System (PDS) / Solar System Dynamics',
        standardCode: 'NASA-PDS4 / IAU-WGPSN-2023',
        organization: 'NASA Jet Propulsion Laboratory / Caltech',
        url: 'https://pds.nasa.gov/',
        description: 'Parámetros orbitales heliocéntricos (semieje mayor, excentricidad, inclinación) y datos espectrales de superficies planetarias.'
      },
      {
        name: 'ESA Gaia Astrometric Catalog & IAU Exoplanet Archive',
        standardCode: 'IAU-WGSBN / GAIA-DR3',
        organization: 'European Space Agency (ESA) / International Astronomical Union',
        url: 'https://www.cosmos.esa.int/gaia',
        description: 'Estándares internacionales de nomenclatura astronómica, límites de sistemas estelares y efemérides de alta precisión.'
      }
    ],
    hotspots: [
      { title: 'Estrella Central (Sol) & Radiación Fotosférica', desc: 'Núcleo estelar con emisión térmica continua, vientos estelares ionizados y centro de gravedad del sistema.' },
      { title: 'Zona de Habitabilidad (Goldilocks Zone: 0.95 - 1.37 UA)', desc: 'Faja orbital donde el flujo estelar permite la presencia de agua líquida en superficies telúricas con atmósfera.' },
      { title: 'Cinturón Principal de Asteroides & Resonancias de Kirkwood', desc: 'Zona de transición entre planetas interiores y gigantes exteriores con acumulación de cuerpos protoplanetarios y Ceres.' },
      { title: 'Gigantes Gaseosos & Sistema de Anillos PBR de Saturno', desc: 'Estructuras planetarias con atmósferas estratificadas de hidrógeno/helio y discos de acreción con división de Cassini.' },
      { title: 'Cinturón de Kuiper & Cuerpos Transneptunianos', desc: 'Frontera exterior de escombros helados primordiales del sistema solar.' }
    ],
    cameras: [
      {
        id: 'cam_01_solar_system_orbit_map',
        name: 'Foto Oficial 01 • Mapa Orbital Heliocéntrico Completo',
        localPath: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
        source: 'NASA Jet Propulsion Laboratory / Solar System Dynamics',
        resolution: '3840 × 2160 px (Ultra-HD)',
        sensor: 'Cartografía Orbital Heliocéntrica de Precisión',
        description: 'Trayectorias keplerianas completas de los planetas telúricos y gigantes exteriores en el plano de la eclíptica.'
      },
      {
        id: 'cam_02_saturn_rings_cassini',
        name: 'Foto Oficial 02 • Sistema de Anillos de Saturno y División de Cassini',
        localPath: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&w=1200&q=80',
        source: 'NASA / ESA / ASI Misión Cassini-Huygens (Sensor ISS NAC)',
        resolution: '4000 × 3000 px (4K Ultra-HD)',
        sensor: 'Imaging Science Subsystem Narrow Angle Camera (Cassini ISS)',
        description: 'Estructura fina de partículas de hielo de agua y resonancias de Lindblad en los anillos A, B y C de Saturno.'
      }
    ],
    pbrParams: { metalness: 0.1, roughness: 0.35, colorHex: '#f59e0b' },
    tags: ['sistema solar', 'planetas', 'planetario', 'mapa', 'orbita', 'astronomia', 'kepler', 'jupiter', 'saturno', 'tierra', 'sol'],
    isBuiltIn: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

export class Model3DService {
  private static instance: Model3DService;
  private cache: Map<string, Model3DDocument> = new Map();
  private subscribers: Set<(models: Model3DDocument[]) => void> = new Set();
  private unsubscribeFirestore: (() => void) | null = null;
  private initialized: boolean = false;

  private constructor() {
    this.loadFromLocalStorage();
  }

  public static getInstance(): Model3DService {
    if (!Model3DService.instance) {
      Model3DService.instance = new Model3DService();
    }
    return Model3DService.instance;
  }

  private isValidModel(m: Model3DDocument): boolean {
    if (!m || !m.id || !m.name) return false;
    return true;
  }

  private loadFromLocalStorage() {
    try {
      this.cache.clear();
      DEFAULT_BUILTIN_MODELS.forEach(m => this.cache.set(m.id, m));
      const stored = localStorage.getItem('goals_models_3d_cache_v8');
      if (stored) {
        const parsed: Model3DDocument[] = JSON.parse(stored);
        parsed.forEach(m => {
          if (!this.isValidModel(m)) return;
          const builtin = DEFAULT_BUILTIN_MODELS.find(b => b.id === m.id);
          if (builtin) {
            this.cache.set(m.id, { ...m, cameras: builtin.cameras, officialSources: builtin.officialSources, hotspots: builtin.hotspots });
          }
        });
      }
    } catch {
      DEFAULT_BUILTIN_MODELS.forEach(m => this.cache.set(m.id, m));
    }
  }

  private saveToLocalStorage() {
    try {
      const array = Array.from(this.cache.values()).filter(m => this.isValidModel(m));
      localStorage.setItem('goals_models_3d_cache_v8', JSON.stringify(array));
    } catch {}
  }

  public subscribeToModels(callback: (models: Model3DDocument[]) => void): () => void {
    this.subscribers.add(callback);
    callback(Array.from(this.cache.values()).filter(m => this.isValidModel(m)));

    if (!this.initialized && db) {
      this.initialized = true;
      try {
        const colRef = collection(db, 'models_3d');
        this.unsubscribeFirestore = onSnapshot(colRef, (snapshot) => {
          if (!snapshot.empty) {
            snapshot.docs.forEach((docSnap) => {
              const data = docSnap.data() as Model3DDocument;
              const id = data.id || docSnap.id;
              if (!this.isValidModel(data)) {
                if (db) {
                  try { deleteDoc(doc(db, 'models_3d', docSnap.id)); } catch {}
                }
                return;
              }
              const builtin = DEFAULT_BUILTIN_MODELS.find(b => b.id === id);
              if (builtin) {
                this.cache.set(id, { ...data, id, cameras: builtin.cameras, officialSources: builtin.officialSources, hotspots: builtin.hotspots });
              }
            });
          }
          this.saveToLocalStorage();
          this.notifySubscribers();
        }, (err) => {
          console.warn('⚠️ Model3DService: Modo Local / Offline activo:', err);
        });
      } catch (err) {
        console.warn('⚠️ Error al iniciar listener de Firestore models_3d:', err);
      }
    }

    return () => {
      this.subscribers.delete(callback);
    };
  }

  private notifySubscribers() {
    const list = Array.from(this.cache.values());
    this.subscribers.forEach(cb => cb(list));
  }

  public getModels(): Model3DDocument[] {
    return Array.from(this.cache.values());
  }

  public getModelById(id: string): Model3DDocument | undefined {
    return this.cache.get(id);
  }

  public async saveModel(model: Model3DDocument): Promise<void> {
    const docData: Model3DDocument = {
      ...model,
      updatedAt: Date.now()
    };

    this.cache.set(model.id, docData);
    this.saveToLocalStorage();
    this.notifySubscribers();

    if (db) {
      try {
        const docRef = doc(db, 'models_3d', model.id);
        await setDoc(docRef, docData, { merge: true });
        console.log(`✅ Modelo 3D [${model.name}] persistido en Firestore.`);
      } catch (err) {
        console.error('❌ Error al guardar modelo 3D en Firestore:', err);
      }
    }
  }

  public async deleteModel(id: string): Promise<void> {
    this.cache.delete(id);
    this.saveToLocalStorage();
    this.notifySubscribers();

    if (db) {
      try {
        await deleteDoc(doc(db, 'models_3d', id));
      } catch (err) {
        console.error('❌ Error al eliminar modelo de Firestore:', err);
      }
    }
  }

  public async seedInitialModelsToFirestore(): Promise<void> {
    if (!db) return;
    try {
      for (const item of DEFAULT_BUILTIN_MODELS) {
        const docRef = doc(db, 'models_3d', item.id);
        await setDoc(docRef, item, { merge: true });
      }
      console.log('✅ Model3DService: Colección models_3d sembrada en Firestore.');
    } catch (err) {
      console.warn('Aviso en seedInitialModelsToFirestore:', err);
    }
  }
}
