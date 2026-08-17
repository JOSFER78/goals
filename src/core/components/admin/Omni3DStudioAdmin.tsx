/**
 * Omni3DStudioAdmin.tsx
 * Estudio 3D Autónomo Asistido por IA integrado en el Panel de Superadmin de Goals.
 * Arquitectura 100% Dinámica con Sombreadores Físicos PBR Reales:
 * - Sombreadores Físicos Semánticos PBR calibrados con IBL RoomEnvironment y sombras dinámicas PCF Soft.
 * - Texturizadores Procedurales PBR (Espejo de Oro Hexagonal 24k, Celdas Fotovoltaicas GaAs, Foil Kapton térmico, Tejido Vascular SSS, Mantas MLI).
 * - Intérprete Universal de Grafo de Escena 3D para creaciones de IA (Cero Hardcodeo).
 * - Mapeo de Fotografías de Usuario a Mapas de Textura Normal/PBR.
 * - Fuentes Oficiales y Normativas Técnicas Dinámicas (NASA, ESA, NIH, REBT, CTE, IEEE, ISO).
 * - Persistencia y Sincronización en Tiempo Real con Firebase Firestore.
 */

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  Sparkles, 
  Search, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  ExternalLink, 
  ShieldCheck, 
  Info, 
  Loader2, 
  Cpu, 
  Camera, 
  Database, 
  BookOpen, 
  UploadCloud,
  Plus,
  MessageSquare,
  Layers,
  Eye,
  EyeOff,
  Activity,
  CheckCircle2,
  Sliders,
  Tag,
  Crosshair
} from 'lucide-react';
import { Omni3DChatStudioPanel, Wizard3DConfig } from './Omni3DChatStudioPanel';
import { Model3DDocument, Model3DService, DEFAULT_BUILTIN_MODELS } from '../../services/Model3DService';
import { Omni3DGeneratorService } from '../../services/Omni3DGeneratorService';
import { Universal3DInterpreter, Dynamic3DModelSpec } from '../../3d/interpreter/Universal3DInterpreter';
import { Omni3DProceduralFactory, createSpectacularSunModel } from '../../3d/generators/Omni3DProceduralFactory';
import { ImageTextureMapper, ProcessedPhotoTexture } from '../../3d/mapping/ImageTextureMapper';

export interface ModelLayerInfo {
  id: string;
  name: string;
  category: string;
  color: string;
  meshPattern: string;
  description: string;
  scientificRole: string;
  dimensionsOrMetric: string;
  defaultPosition?: [number, number, number];
}

export function getModelLayers(modelDoc: Model3DDocument): ModelLayerInfo[] {
  const mid = (modelDoc.id || '').toLowerCase();
  const mname = (modelDoc.name || '').toLowerCase();

  // 1. Célula Eucariota Humana
  if (mid.includes('celula') || mname.includes('célula') || mname.includes('cell')) {
    return [
      {
        id: 'layer_nucleus',
        name: 'Núcleo, Carioteca & Nucleolo',
        category: 'Control Genético',
        color: '#a855f7',
        meshPattern: 'CellNucleus,Nucleolus',
        description: 'Doble envoltura nuclear con poros octogonales que albergan 3.200 millones de pares de bases de ADN.',
        scientificRole: 'Replicación y transcripción del genoma humano; ensamblaje de subunidades ribosomales.',
        dimensionsOrMetric: 'Diámetro: 5-7 µm • ~3.000 poros nucleares',
        defaultPosition: [-0.45, -0.12, -0.22]
      },
      {
        id: 'layer_mito',
        name: 'Mitocondrias (Crestas & ATP)',
        category: 'Bioenergética',
        color: '#f97316',
        meshPattern: 'MitochondriaNetwork',
        description: 'Centrales energéticas con doble membrana y crestas con complejos I-IV de la cadena respiratoria.',
        scientificRole: 'Ciclo de Krebs y fosforilación oxidativa generadora de hasta 36 moléculas de ATP por glucosa.',
        dimensionsOrMetric: 'Longitud: 1-4 µm • Gradiente electroquímico: 180 mV',
        defaultPosition: [1.1, 0.9, 0.5]
      },
      {
        id: 'layer_rer',
        name: 'Retículo Endoplasmático Rugoso (RER)',
        category: 'Síntesis Proteica',
        color: '#c084fc',
        meshPattern: 'RoughEndoplasmicReticulum,Ribosomes',
        description: 'Hojas helicoidales de Terasaki tachonadas de más de 450 ribosomas 80S para traducción proteica.',
        scientificRole: 'Traducción, plegamiento y control de calidad de proteínas secretoras y de membrana.',
        dimensionsOrMetric: 'Láminas de 40-50 nm • Ribosomas de 25-30 nm',
        defaultPosition: [-0.45, 0.65, 0.35]
      },
      {
        id: 'layer_golgi',
        name: 'Complejo de Golgi & Vesículas',
        category: 'Tráfico Celular',
        color: '#10b981',
        meshPattern: 'GolgiApparatus',
        description: 'Dictiosomas formados por 6 cisternas apiladas con vesículas gemando en constelación.',
        scientificRole: 'Glicosilación, fosforilación, empaquetamiento y direccionamiento de proteínas hacia lisosomas o exocitosis.',
        dimensionsOrMetric: 'Diámetro de cisternas: 1 µm • Vesículas: 50-100 nm',
        defaultPosition: [0.8, 0.28, -0.8]
      },
      {
        id: 'layer_centrosome',
        name: 'Centrosoma & Centriolos',
        category: 'División Celular',
        color: '#e2e8f0',
        meshPattern: 'CentrosomeCentrioles',
        description: 'Par de centriolos cilíndricos perpendiculares dispuestos en 9 tripletes de microtúbulos (9x3).',
        scientificRole: 'Centro organizador de microtúbulos (MTOC) y nucleación del huso mitótico durante la mitosis.',
        dimensionsOrMetric: 'Dimensiones: 0.2 µm × 0.5 µm • 27 microtúbulos',
        defaultPosition: [-1.1, 0.9, -0.28]
      },
      {
        id: 'layer_membrane',
        name: 'Membrana Plasmática & Glucocálix',
        category: 'Envoltura Celular',
        color: '#38bdf8',
        meshPattern: 'PlasmaMembrane,TransmembraneProteins',
        description: 'Bicapa de fosfolípidos con fluidez de membrana, glucocálix ramificado y permeabilidad selectiva.',
        scientificRole: 'Transporte iónico, potencial de membrana (-70 mV) y reconocimiento celular.',
        dimensionsOrMetric: 'Espesor: 7.5 nm • Fluidez lipídica a 37 °C',
        defaultPosition: [0.0, 2.35, 0.45]
      },
      {
        id: 'layer_vesicles',
        name: 'Lisosomas & Peroxisomas',
        category: 'Degradación & Detox',
        color: '#ef4444',
        meshPattern: 'LysosomesAndPeroxisomes',
        description: 'Vesículas esféricas con hidrolasas ácidas (lisosomas) y enzimas catalasa/oxidasa (peroxisomas).',
        scientificRole: 'Autofagia, digestión de restos celulares y neutralización de especies reactivas de oxígeno (H2O2).',
        dimensionsOrMetric: 'Diámetro: 0.1-1.2 µm • pH intra-lisosomal: 4.5-5.0',
        defaultPosition: [-0.95, -1.1, 0.6]
      },
      {
        id: 'layer_cyto',
        name: 'Red de Citoesqueleto',
        category: 'Arquitectura Estructural',
        color: '#38bdf8',
        meshPattern: 'CytoskeletonNetwork',
        description: 'Andamiaje tridimensional de microtúbulos de tubulina, microfilamentos de actina y filamentos intermedios.',
        scientificRole: 'Mantenimiento de la forma celular, transporte vesicular mediado por kinesina/dineína y motilidad.',
        dimensionsOrMetric: 'Microtúbulos: 25 nm • Actina: 7 nm',
        defaultPosition: [0.65, 1.45, 0.4]
      },
      {
        id: 'layer_cytosol',
        name: 'Citosol & Matriz Celular',
        category: 'Medio Intracelular',
        color: '#0284c7',
        meshPattern: 'CytosolMatrix',
        description: 'Solución acuosa gelatinosa rica en iones, glucosa, aminoácidos y micro-enzimas.',
        scientificRole: 'Soporte físico de reacciones metabólicas y glucólisis citoplasmática.',
        dimensionsOrMetric: 'Volumen: ~54% del total celular • pH 7.2',
        defaultPosition: [0.2, 0.2, 0.2]
      }
    ];
  }

  // 2. Planeta Tierra
  if (mid.includes('tierra') || mname.includes('tierra') || mname.includes('earth')) {
    return [
      {
        id: 'layer_earth_atmo',
        name: 'Atmósfera & Dispersión Rayleigh',
        category: 'Envoltura Gaseosa',
        color: '#38bdf8',
        meshPattern: 'AtmosphereMesh,atmo,EarthAtmosphere',
        description: 'Capa gaseosa estratificada de nitrógeno (78%) y oxígeno (21%) con dispersión física de la luz solar.',
        scientificRole: 'Protección contra radiación cósmica UV, efecto invernadero moderador y ciclo hidrológico.',
        dimensionsOrMetric: 'Espesor efectivo: ~100 km (Línea de Kármán) • Presión: 1013.25 hPa',
        defaultPosition: [0.0, 2.5, 0.2]
      },
      {
        id: 'layer_earth_clouds',
        name: 'Manto de Nubes Dinámicas',
        category: 'Hidrosfera / Meteorología',
        color: '#ffffff',
        meshPattern: 'EarthClouds',
        description: 'Vapor de agua condensado en la troposfera que forma vórtices ciclónicos y frentes boreales.',
        scientificRole: 'Albedo planetario (30%), transporte de humedad global y regulación térmica radiativa.',
        dimensionsOrMetric: 'Altitud: 2-12 km • Velocidad de rotación orbital independiente',
        defaultPosition: [1.2, 1.2, 1.4]
      },
      {
        id: 'layer_earth_surface',
        name: 'Litosfera & Océanos (Blue Marble)',
        category: 'Corteza Terrestre',
        color: '#0284c7',
        meshPattern: 'PlanetSurface,earth,Planet_Earth',
        description: 'Topografía continental con cadenas montañosas GTOPO30 y 71% de superficie oceánica reflectante.',
        scientificRole: 'Biosfera activa, tectónica de placas y almacenamiento térmico en corrientes termohalinas.',
        dimensionsOrMetric: 'Radio ecuatorial: 6.378 km • Masa: 5.972 × 10^24 kg',
        defaultPosition: [0.0, 0.0, 2.4]
      },
      {
        id: 'layer_earth_night',
        name: 'Luces Urbanas Nocturnas (Black Marble)',
        category: 'Antroposfera',
        color: '#f59e0b',
        meshPattern: 'NightLights',
        description: 'Cartografía satelital VIIRS de la emisión de fotones urbanos en la cara nocturna del planeta.',
        scientificRole: 'Monitorización del consumo energético humano, densidad poblacional y actividad económica global.',
        dimensionsOrMetric: 'Resolución: 750 m/píxel • Detección en rango de 500-900 nm',
        defaultPosition: [-1.4, 0.5, -1.5]
      },
      {
        id: 'layer_earth_satellites',
        name: 'Constelación de Satélites (ISS, Hubble, GPS)',
        category: 'Flota Orbital Artificial',
        color: '#34d399',
        meshPattern: 'SatellitesAndOrbits,ISS,Hubble,GPS,Geostationary',
        description: 'Red orbital con Estación Espacial Internacional (LEO 51.6°), Telescopio Hubble (LEO 28.5°), GPS y anillo geoestacionario.',
        scientificRole: 'Telecomunicaciones globales, navegación satelital GNSS e investigación científica en microgravedad.',
        dimensionsOrMetric: 'Altitud LEO: 400-550 km • MEO: 20.200 km • GEO: 35.786 km',
        defaultPosition: [1.9, 1.4, 0.9]
      },
      {
        id: 'layer_earth_moon',
        name: 'Sistema Lunar & Órbita (Luna)',
        category: 'Satélite Natural',
        color: '#cbd5e1',
        meshPattern: 'MoonSystem,Moon,Luna',
        description: 'Cuerpo rocoso craterizado de la Luna en órbita elíptica inclinada a 5.14° respecto a la eclíptica.',
        scientificRole: 'Estabilización de la oblicuidad del eje terrestre y generación de las mareas oceánicas terrestres.',
        dimensionsOrMetric: 'Radio lunar: 1.737 km • Distancia media: 384.400 km • Período: 27.3 días',
        defaultPosition: [4.8, 0.4, 2.4]
      }
    ];
  }

  // 3. Sistema Planetario & Cartografía Cósmica Multiescala (LOD)
  if (mid.includes('planetas') || mname.includes('planetario') || mname.includes('sistema solar') || mname.includes('mapa completo')) {
    return [
      {
        id: 'layer_planets_sun',
        name: 'Estrella Central (Sol Fotosférico & Corona)',
        category: 'Núcleo Gravitacional',
        color: '#fbbf24',
        meshPattern: 'Star_CentralSun,Sol,corona',
        description: 'Esfera central fotosférica con emisión térmica continua y halo coronal translúcido.',
        scientificRole: 'Centro de masa del sistema planetario y fuente primaria de energía radiativa fotónica.',
        dimensionsOrMetric: 'Diámetro: 1.392.700 km • Temperatura fotosférica: 5.778 K',
        defaultPosition: [0.0, 0.0, 0.0]
      },
      {
        id: 'layer_planets_grid',
        name: 'Plano de la Eclíptica & Rejilla UA',
        category: 'Cartografía Orbital',
        color: '#64748b',
        meshPattern: 'HeliocentricEclipticGrid,grid,ring',
        description: 'Rejilla concéntrica de distancias orbitales en Unidades Astronómicas (0.4 UA a 30.0 UA).',
        scientificRole: 'Marco de referencia heliocéntrico para el cálculo de efemérides y navegación interplanetaria.',
        dimensionsOrMetric: '1 UA = 149.597.870,7 km (Distancia media Tierra-Sol)',
        defaultPosition: [0.0, 0.0, 1.25]
      },
      {
        id: 'layer_planets_inner',
        name: 'Planetas Telúricos (Mercurio, Venus, Tierra, Marte)',
        category: 'Mundos Rocosos Interiores',
        color: '#38bdf8',
        meshPattern: 'InnerRockyPlanets,Mercurio,Venus,Tierra,Marte',
        description: 'Planetas rocosos con densidades elevadas (3.9 - 5.5 g/cm³) y corteza de silicatos.',
        scientificRole: 'Zona habitable Goldilocks y mundos terrestres con diferenciación manto/núcleo.',
        dimensionsOrMetric: 'Semiejes: 0.39 UA (Mercurio) a 1.52 UA (Marte)',
        defaultPosition: [1.15, 0.0, -1.15]
      },
      {
        id: 'layer_planets_asteroids',
        name: 'Cinturón Principal de Asteroides & Ceres',
        category: 'Cuerpos Menores Protoplanetarios',
        color: '#f59e0b',
        meshPattern: 'AsteroidBelt_Main,Ceres,asteroid',
        description: 'Anillo de 420 asteroides de silicatos/carbono y el planeta enano Ceres.',
        scientificRole: 'Restos primordiales de la nebulosa protoplanetaria que no lograron unirse por perturbaciones de Júpiter.',
        dimensionsOrMetric: 'Ubicación: 2.1 a 3.3 UA • Masa total: ~4% de la Luna',
        defaultPosition: [-1.45, 0.02, -1.45]
      },
      {
        id: 'layer_planets_outer',
        name: 'Gigantes Gaseosos & Anillos de Saturno',
        category: 'Planetas Exteriores Jovianos',
        color: '#e2e8f0',
        meshPattern: 'GasGiants_OuterPlanets,Jupiter,Saturno,Urano,Neptuno',
        description: 'Júpiter con lunas galileanas, Saturno con anillos PBR y división de Cassini, Urano y Neptuno.',
        scientificRole: 'Gigantes gaseosos y de hielo que concentran el 99% de la masa planetaria del sistema solar.',
        dimensionsOrMetric: 'Júpiter: 11 radios terrestres • Saturno con anillos: 280.000 km',
        defaultPosition: [2.33, 0.0, 2.33]
      },
      {
        id: 'layer_planets_kuiper',
        name: 'Cinturón de Kuiper & Frontera Transneptuniana',
        category: 'Frontera Helada Exterior',
        color: '#94a3b8',
        meshPattern: 'KuiperBelt_OuterBoundary,kuiper',
        description: 'Disco circunestelar de cuerpos menores helados más allá de la órbita de Neptuno.',
        scientificRole: 'Reservorio de cometas de corto período y planetas enanos transneptunianos (Plutón, Eris, Haumea).',
        dimensionsOrMetric: 'Ubicación: 30 a 55 UA • Composición: Hielo de agua, metano y amoníaco',
        defaultPosition: [4.8, 0.1, 0.0]
      }
    ];
  }

  // 4. James Webb (JWST)
  if (mid.includes('webb') || mname.includes('webb') || mname.includes('jwst')) {
    return [
      {
        id: 'layer_jwst_mirror',
        name: 'Espejo Primario de Oro de 6.5 m',
        category: 'Óptica Infrarroja',
        color: '#fbbf24',
        meshPattern: 'mirror,gold,primary,segment',
        description: '18 segmentos hexagonales de berilio de 1.32 m cada uno bañados en 100 nm de oro puro.',
        scientificRole: 'Concentración de fotones infrarrojos (0.6 a 28 µm) procedentes de las primeras galaxias del Universo.',
        dimensionsOrMetric: 'Área colectora: 25.4 m² • Error de superficie: <20 nm',
        defaultPosition: [0.0, 0.5, 0.4]
      },
      {
        id: 'layer_jwst_sunshield',
        name: 'Parasol Térmico Kapton de 5 Capas',
        category: 'Control Térmico Criogénico',
        color: '#e2e8f0',
        meshPattern: 'sunshield,kapton,layer,shield',
        description: '5 membranas de poliimida de 21 × 14 m con recubrimiento de aluminio y silicio dopado.',
        scientificRole: 'Disipación del calor solar; reduce la temperatura de +85 °C en el lado caliente a -233 °C en los detectores.',
        dimensionsOrMetric: 'Espesor: 25 a 50 µm • Gradiente térmico: ΔT = 300 Kelvin',
        defaultPosition: [0.0, -0.8, 0.0]
      },
      {
        id: 'layer_jwst_secondary',
        name: 'Trípode & Espejo Secundario',
        category: 'Estructura Óptica',
        color: '#64748b',
        meshPattern: 'secondary,strut,tripod,spider',
        description: 'Reflector circular de berilio montado en tres puntales huecos de fibra de carbono.',
        scientificRole: 'Redirección del haz convergente hacia el módulo de instrumentos científicos ISIM.',
        dimensionsOrMetric: 'Diámetro: 0.74 m • Longitud de brazos: 7.6 m',
        defaultPosition: [0.0, 0.5, 1.8]
      },
      {
        id: 'layer_jwst_isim',
        name: 'Módulo de Instrumentos Integrados (ISIM)',
        category: 'Carga Científica Útil',
        color: '#38bdf8',
        meshPattern: 'isim,instrument,nircam,miri,nirspec',
        description: 'Caja criogénica trasera con NIRCam, NIRSpec, MIRI y FGS/NIRISS.',
        scientificRole: 'Espectroscopía infrarroja profunda y coronagrafía de atmósferas de exoplanetas.',
        dimensionsOrMetric: 'Temperatura operativa: 37 K (NIRCam) / 7 K (MIRI con criorefrigerador)',
        defaultPosition: [0.0, 0.3, -0.6]
      }
    ];
  }

  // 5. Telescopio Espacial Hubble (HST)
  if (mid.includes('hubble') || mname.includes('hubble') || mname.includes('hst')) {
    return [
      {
        id: 'layer_hst_tube',
        name: 'Tubo Óptico (OTA) & Espejo Primario de 2.4 m',
        category: 'Ensamblaje Óptico',
        color: '#e2e8f0',
        meshPattern: 'tube,ota,primary,mirror,body,barrel',
        description: 'Tubo cilíndrico de aluminio reflectante con espejo primario hiperbólico de vidrio de sílice Zerodur.',
        scientificRole: 'Óptica Ritchey-Chrétien libre de coma para luz visible, ultravioleta e infrarrojo cercano.',
        dimensionsOrMetric: 'Diámetro: 2.4 m • Longitud total: 13.2 m • Masa: 11.110 kg',
        defaultPosition: [0.0, 0.0, 0.0]
      },
      {
        id: 'layer_hst_solar',
        name: 'Paneles Solares GaAs de Doble Ala',
        category: 'Subsistema de Potencia',
        color: '#f59e0b',
        meshPattern: 'solar,panel,wing,array',
        description: 'Dos alas rígidas de arseniuro de galio (GaAs) con celdas de alta eficiencia instaladas en la misión SM3B.',
        scientificRole: 'Generación de 2.800 vatios de potencia eléctrica continua para recargar 6 baterías de níquel-hidrógeno.',
        dimensionsOrMetric: 'Envergadura: 12 m • Potencia nominal: 2.8 kW',
        defaultPosition: [2.2, 0.0, 0.0]
      },
      {
        id: 'layer_hst_door',
        name: 'Puerta de Apertura & Parasol Delantero',
        category: 'Protección Óptica',
        color: '#64748b',
        meshPattern: 'door,aperture,sunshade,baffle',
        description: 'Mecanismo basculante motorizado que protege los detectores ópticos de la luz solar directa.',
        scientificRole: 'Cierre de emergencia si el ángulo de apuntamiento se acerca a menos de 45° del Sol.',
        dimensionsOrMetric: 'Diámetro: 3.0 m • Revestimiento interior: Negro absorbente antireflectante',
        defaultPosition: [0.0, 3.2, 0.0]
      },
      {
        id: 'layer_hst_instruments',
        name: 'Módulo de Instrumentos Científicos Axiales',
        category: 'Instrumentación Focal',
        color: '#38bdf8',
        meshPattern: 'instrument,wfc3,acs,cos,stis,aft',
        description: 'Bahía trasera modular con la Wide Field Camera 3 (WFC3) y Advanced Camera for Surveys (ACS).',
        scientificRole: 'Captura de las imágenes más profundas del Universo (Hubble Ultra Deep Field) en rango UV/Óptico.',
        dimensionsOrMetric: 'Resolución angular: 0.05 segundos de arco • Rango: 115-1.700 nm',
        defaultPosition: [0.0, -2.4, 0.0]
      }
    ];
  }

  // 6. Estación Espacial Internacional (ISS)
  if (mid.includes('iss') || mname.includes('iss') || mname.includes('estacion') || mname.includes('estación')) {
    return [
      {
        id: 'layer_iss_modules',
        name: 'Complejo de Módulos Presurizados',
        category: 'Hábitat & Laboratorios',
        color: '#38bdf8',
        meshPattern: 'module,zarya,destiny,kibo,columbus,hab,pressurized',
        description: 'Cilindros de aleación de aluminio-litio: Zarya, Zvezda, Destiny (NASA), Columbus (ESA) y Kibo (JAXA).',
        scientificRole: 'Ambiente habitable con presión de 1 atm para tripulaciones continuas en microgravedad.',
        dimensionsOrMetric: 'Volumen habitable: 916 m³ • Masa en órbita: 420 toneladas',
        defaultPosition: [0.0, 0.0, 0.0]
      },
      {
        id: 'layer_iss_truss',
        name: 'Viga Estructural Integrada (Truss ITS)',
        category: 'Estructura Dorsal',
        color: '#64748b',
        meshPattern: 'truss,its,s0,s1,p1,structure,backbone',
        description: 'Viga reticular de 108.5 metros de aluminio y titanio que soporta los radiadores y alas solares.',
        scientificRole: 'Espina dorsal de soporte mecánico, canalización de datos multiplexados y amoníaco criogénico.',
        dimensionsOrMetric: 'Longitud: 108.5 m • 11 segmentos modulares articulados',
        defaultPosition: [0.0, 1.2, 0.0]
      },
      {
        id: 'layer_iss_solar',
        name: 'Alas Solares Fotovoltaicas (SAW)',
        category: 'Potencia Eléctrica',
        color: '#f59e0b',
        meshPattern: 'solar,array,saw,pv,panel,wing',
        description: '8 alas de paneles solares fotovoltaicos con juntas rotatorias BAPTA para seguimiento solar continuo.',
        scientificRole: 'Generación de hasta 120 kilovatios de potencia eléctrica de corriente continua (160V DC).',
        dimensionsOrMetric: 'Superficie colectora: 2.500 m² • 262.400 celdas de silicio',
        defaultPosition: [3.5, 1.2, 0.0]
      },
      {
        id: 'layer_iss_cupola',
        name: 'Cúpula de Observación Terrestre (Cupola)',
        category: 'Puesto de Control Óptico',
        color: '#e2e8f0',
        meshPattern: 'cupola,window,viewport,node3',
        description: 'Módulo cúpula de 7 ventanas de cuarzo fundido con una ventana circular central de 80 cm.',
        scientificRole: 'Control visual de atraques de naves espaciales de carga (Dragon/Cygnus) y monitorización terrestre.',
        dimensionsOrMetric: 'Diámetro: 2.95 m • Altura: 1.5 m • 7 ventanas acorazadas',
        defaultPosition: [0.0, -0.8, 0.8]
      }
    ];
  }

  // 7. Módulo Lunar Apollo 11 (LM Eagle)
  if (mid.includes('apollo') || mname.includes('apollo') || mname.includes('eagle') || mname.includes('lunar')) {
    return [
      {
        id: 'layer_apollo_descent',
        name: 'Etapa de Descenso con Mylar Dorado',
        category: 'Estructura de Aterrizaje',
        color: '#fbbf24',
        meshPattern: 'descent,mylar,gold,stage,foil',
        description: 'Estructura octogonal envuelta en mantas térmicas multicapa de Mylar y Kapton aluminizado.',
        scientificRole: 'Alojamiento del motor cohete de descenso DPS, tanques de combustible y equipos de superficie EASEP.',
        dimensionsOrMetric: 'Masa de combustible: 8.200 kg de Aerozine 50 y N2O4',
        defaultPosition: [0.0, -0.6, 0.0]
      },
      {
        id: 'layer_apollo_gear',
        name: 'Tren de Aterrizaje Cuádruple de Titanio',
        category: 'Mecanismo de Contacto',
        color: '#64748b',
        meshPattern: 'gear,leg,footpad,probe,landing,strut',
        description: 'Cuatro patas articuladas con amortiguadores de nido de abeja deformable y zapatas de 91 cm con sondas de contacto.',
        scientificRole: 'Absorción del impacto cinético en el regolito lunar y estabilidad estática del módulo.',
        dimensionsOrMetric: 'Envergadura de patas: 9.4 m de diagonal • Sondas de contacto: 1.7 m',
        defaultPosition: [1.2, -1.2, 1.2]
      },
      {
        id: 'layer_apollo_ascent',
        name: 'Etapa de Ascenso & Cabina Presurizada',
        category: 'Módulo de Tripulación',
        color: '#e2e8f0',
        meshPattern: 'ascent,cabin,crew,cockpit,window',
        description: 'Cabina presurizada de aleación de aluminio para 2 astronautas con ordenador de guía AGC.',
        scientificRole: 'Soporte vital de 48 horas en superficie lunar y vehículo de re-despegue hacia la órbita de encuentro.',
        dimensionsOrMetric: 'Volumen de cabina: 6.6 m³ • Masa de ascenso: 4.700 kg',
        defaultPosition: [0.0, 0.6, 0.0]
      },
      {
        id: 'layer_apollo_rcs',
        name: 'Propulsores de Maniobra RCS & Radar',
        category: 'Control de Actitud',
        color: '#ef4444',
        meshPattern: 'rcs,thruster,radar,antenna,quad',
        description: 'Cuatro bloques cuádruples de propulsores de reacción (16 toberas en total) y antena de radar de encuentro.',
        scientificRole: 'Control en 3 ejes de guiñada, cabeceo y alabeo durante las maniobras de acoplamiento orbital.',
        dimensionsOrMetric: 'Empuje por tobera: 440 N • Propelente: Hiperbólico N2O4/UDMH',
        defaultPosition: [0.8, 0.8, 0.8]
      }
    ];
  }

  // 8. Encéfalo Humano (Brain MRI)
  if (mid.includes('brain') || mname.includes('brain') || mname.includes('encefalo') || mname.includes('encéfalo') || mname.includes('cerebro')) {
    return [
      {
        id: 'layer_brain_cortex',
        name: 'Corteza Cerebral (Sustancia Gris)',
        category: 'Neuroanatomía Telencefálica',
        color: '#f472b6',
        meshPattern: 'cortex,gyrus,sulcus,cerebrum,hemisphere',
        description: 'Manto replegado de 6 capas neuronales con circunvoluciones y cisuras cerebrales (Rolando y Silvio).',
        scientificRole: 'Funciones cognitivas superiores: percepción sensorial, lenguaje, razonamiento abstracto y toma de decisiones.',
        dimensionsOrMetric: 'Superficie extendida: 2.200 cm² • Espesor cortical: 2-4 mm • 16.000 millones de neuronas',
        defaultPosition: [0.0, 0.8, 0.4]
      },
      {
        id: 'layer_brain_cerebellum',
        name: 'Cerebelo & Tronco Encefálico',
        category: 'Control Motor & Funciones Vitales',
        color: '#c084fc',
        meshPattern: 'cerebellum,stem,folia,arbor,pons,medulla',
        description: 'Estructura posterior con folias horizontales de alta densidad neuronal y tronco encefálico regulador.',
        scientificRole: 'Coordinación motora fina, equilibrio vestibular, control cardiorrespiratorio y ciclo sueño-vigilia.',
        dimensionsOrMetric: 'Contiene >50% del total de neuronas del encéfalo en solo 10% del volumen.',
        defaultPosition: [0.0, -0.6, -0.8]
      },
      {
        id: 'layer_brain_limbic',
        name: 'Sistema Límbico, Tálamo & Hipocampo',
        category: 'Emoción & Memoria',
        color: '#fbbf24',
        meshPattern: 'thalamus,hippocampus,limbic,amygdala,fornix',
        description: 'Núcleos diencefálicos y arquicorteza en forma de cuerno que circundan los ventrículos laterales.',
        scientificRole: 'Consolidación de memoria episódica a largo plazo, modulación emocional y relevo sensorial talámico.',
        dimensionsOrMetric: 'Neurogénesis adulta activa en el giro dentado del hipocampo.',
        defaultPosition: [0.0, 0.1, 0.0]
      },
      {
        id: 'layer_brain_vessels',
        name: 'Red Vascular & Polígono de Willis',
        category: 'Angiología Cerebral',
        color: '#ef4444',
        meshPattern: 'vessel,artery,vascular,willis,capillary',
        description: 'Anillo anastomótico arterial que interconecta las arterias carótidas internas y vertebrales.',
        scientificRole: 'Aporte ininterrumpido del 20% del oxígeno y glucosa de todo el cuerpo humano.',
        dimensionsOrMetric: 'Flujo sanguíneo cerebral: 750 ml/min • Presión de perfusión: 50-150 mmHg',
        defaultPosition: [0.0, -0.2, 0.2]
      }
    ];
  }

  // 9. Rover Marciano Perseverance
  if (mid.includes('rover') || mname.includes('rover') || mname.includes('perseverance') || mname.includes('marte')) {
    return [
      {
        id: 'layer_rover_chassis',
        name: 'Chasis Central & Manta Térmica de Oro',
        category: 'Estructura Primaria',
        color: '#fbbf24',
        meshPattern: 'body,chassis,gold,foil,warm',
        description: 'Caja aislante de titanio (WEB) con generador termoeléctrico de radioisótopos MMRTG.',
        scientificRole: 'Protección electrónica contra la atmósfera gélida de Marte (-60 °C) y suministro de 110 W de potencia.',
        dimensionsOrMetric: 'Dimensiones: 3.0 m × 2.7 m × 2.2 m • Masa: 1.025 kg',
        defaultPosition: [0.0, 0.85, 0.0]
      },
      {
        id: 'layer_rover_mast',
        name: 'Mástil de Detección Remota (Mastcam-Z & SuperCam)',
        category: 'Instrumentación Óptica',
        color: '#64748b',
        meshPattern: 'mast,supercam,mastcam,head,pole',
        description: 'Torreta óptica a 2 metros de altura con cámaras estereoscópicas zoom y láser LIBS de ablación.',
        scientificRole: 'Análisis mineralógico espectral a distancia y captura panorámica 3D en alta resolución.',
        dimensionsOrMetric: 'Altura de visión: 2.0 m sobre el suelo • Láser: 1.064 nm pulsado',
        defaultPosition: [0.65, 2.2, 0.4]
      },
      {
        id: 'layer_rover_arm',
        name: 'Brazo Robótico & Torreta de Perforación',
        category: 'Muestreo Geológico',
        color: '#38bdf8',
        meshPattern: 'arm,drill,turret,sherloc,pixl',
        description: 'Brazo articulado de 5 grados de libertad con taladro de extracción de testigos y espectrómetro SHERLOC.',
        scientificRole: 'Perforación de núcleos de roca marciana y almacenamiento hermético en tubos para retorno a la Tierra.',
        dimensionsOrMetric: 'Alcance: 2.1 m • Masa de la torreta: 45 kg',
        defaultPosition: [1.05, 0.85, -0.3]
      },
      {
        id: 'layer_rover_wheels',
        name: 'Suspensión Rocker-Bogie & 6 Ruedas de Aluminio',
        category: 'Movilidad Todo-Terreno',
        color: '#94a3b8',
        meshPattern: 'wheel,bogie,rocker,strut,tire',
        description: 'Sistema diferencial oscilante con 6 motores independientes en los cubos de rueda estriados.',
        scientificRole: 'Superación de rocas y pendientes de hasta 30° sin volcar manteniendo las 6 ruedas en contacto.',
        dimensionsOrMetric: 'Diámetro de rueda: 52.5 cm con tacos de tracción de titanio',
        defaultPosition: [1.15, 0.35, 1.0]
      }
    ];
  }

  // 10. Ventana Climalit
  if (mid.includes('ventana') || mname.includes('ventana') || mname.includes('climalit')) {
    return [
      {
        id: 'layer_win_frame',
        name: 'Marco Exterior & Rotura de Puente Térmico',
        category: 'Perfilería de PVC',
        color: '#f8fafc',
        meshPattern: 'OuterFrame,pvc,frame',
        description: 'Perfilería de 5 cámaras de aislamiento con refuerzo interior de acero galvanizado.',
        scientificRole: 'Eliminación de puentes térmicos y resistencia mecánica frente a cargas de viento.',
        dimensionsOrMetric: 'Transmitancia marco: Uf = 1.3 W/m²K • Profundidad: 70 mm',
        defaultPosition: [0.9, 1.1, 0.0]
      },
      {
        id: 'layer_win_glass',
        name: 'Doble Acristalamiento Climalit 4/16/4 con Argón',
        category: 'Aislamiento Térmico & Acústico',
        color: '#38bdf8',
        meshPattern: 'ClimalitGlass,glass',
        description: 'Vidrio exterior bajo emisivo de 4 mm + cámara de 16 mm con 90% gas argón + vidrio interior de 4 mm.',
        scientificRole: 'Atenuación acústica de 38 dB y aislamiento térmico (Ug = 1.1 W/m²K) según CTE DB-HE.',
        dimensionsOrMetric: 'Espesor total: 24 mm • IOR: 1.52 • Factor solar g: 0.62',
        defaultPosition: [0.0, 0.0, 0.02]
      },
      {
        id: 'layer_win_hardware',
        name: 'Manilla & Herraje Oscilobatiente',
        category: 'Mecanismo de Cierre',
        color: '#94a3b8',
        meshPattern: 'handle,hinge,Hardware',
        description: 'Mecanismo perimetral con bulones de seguridad tipo champiñón y manilla ergonómica de acero.',
        scientificRole: 'Presión homogénea de la junta EPDM en todo el perímetro para máxima estanqueidad al aire (Clase 4).',
        dimensionsOrMetric: 'Resistencia anti-efracción: RC2 • Durabilidad: >20.000 ciclos',
        defaultPosition: [-0.85, -0.07, 0.12]
      }
    ];
  }

  // 11. Nebulosa de Carina (Cosmic Cliffs NGC 3324)
  if (mid.includes('carina') || mname.includes('carina') || mname.includes('cliffs') || mname.includes('3324')) {
    return [
      {
        id: 'layer_carina_ridge',
        name: 'Frente de Fotoionización Sinuoso (7 Años Luz)',
        category: 'Relieve de Fotoevaporación',
        color: '#fbbf24',
        meshPattern: 'PhotoionizationRidge,Photoionization_Cliff_Mesh,cliff',
        description: 'Muro monumental de gas molecular y polvo interestelar esculpido por la intensa radiación ultravioleta de estrellas jóvenes masivas.',
        scientificRole: 'Barrera de choque térmico y compresión hidrodinámica donde se desencadena la formación de nuevas protoestrellas.',
        dimensionsOrMetric: 'Extensión: ~7 años luz • Altura escarpada: ~16 años luz • Temperatura: 10-50 K',
        defaultPosition: [0.0, 0.0, 0.5]
      },
      {
        id: 'layer_carina_pillars',
        name: 'Pilares & Columnas de Polvo Cósmico',
        category: 'Estructuras Resistentes',
        color: '#ea580c',
        meshPattern: 'DustPillars_Foreground,Pillar,Spire,Bastion',
        description: 'Monolitos densos de hidrógeno molecular y granos de silicato/grafito que resisten la fotoevaporación estelar.',
        scientificRole: 'Guarderías estelares compactas con núcleos gravitacionalmente ligados en colapso.',
        dimensionsOrMetric: 'Densidad: >10^5 partículas/cm³ • Escala: 0.5-2.5 años luz',
        defaultPosition: [-0.9, 0.1, 1.2]
      },
      {
        id: 'layer_carina_jets',
        name: 'Protoestrellas & Chorros Herbig-Haro',
        category: 'Salidas Energéticas Bipolares',
        color: '#38bdf8',
        meshPattern: 'HerbigHaroJets,HH_901,HH_902,jet',
        description: 'Chorros bipolares de plasma hiperbólico eyectados a más de 300 km/s por estrellas recién nacidas en el interior del polvo.',
        scientificRole: 'Disipación del momento angular del disco de acreción y choque radiativo con el medio interestelar.',
        dimensionsOrMetric: 'Velocidad: 200-450 km/s • Líneas de emisión: Hα (656 nm), [Fe II] (1.64 µm)',
        defaultPosition: [-0.9, 0.35, 1.3]
      },
      {
        id: 'layer_carina_cavity',
        name: 'Bóveda Molecular & Cavidad Ionizada H II',
        category: 'Burbuja de Viento Estelar',
        color: '#0284c7',
        meshPattern: 'IonizedBlueCavity,HII_GasVault_Dome,Dome',
        description: 'Cavidad superior de gas azul ionizado (O III) ahuecada por la presión de radiación y vientos estelares del cúmulo NGC 3324.',
        scientificRole: 'Región H II ultra-caliente que expande la superburbuja en el brazo espiral de Carina-Sagitario.',
        dimensionsOrMetric: 'Temperatura electrónica: ~10.000 K • Espectro: Emisión O III y Hβ',
        defaultPosition: [0.0, 0.8, -0.6]
      },
      {
        id: 'layer_carina_jwst_stars',
        name: 'Estrellas con Picos de Difracción JWST',
        category: 'Óptica Telescópica James Webb',
        color: '#ffffff',
        meshPattern: 'JWSTDiffractionStars,Spike,Star',
        description: 'Estrellas masivas de campo y protoestrellas infrarrojas exhibiendo el patrón característico de 6 puntas hexagonales + 2 agujas del JWST.',
        scientificRole: 'Función de dispersión de punto (PSF) resultante de la geometría de 18 segmentos hexagonales de berilio del telescopio espacial.',
        dimensionsOrMetric: 'Apertura: 6.5 m • Rango espectral: 0.6 a 28 µm (NIRCam/MIRI)',
        defaultPosition: [-1.2, 0.8, -0.4]
      }
    ];
  }

  // 12. Galaxia Espiral con 3D Gaussian Splats
  if (mid.includes('galaxy') || mname.includes('galaxy') || mname.includes('galaxia')) {
    return [
      {
        id: 'layer_galaxy_smbh',
        name: 'Agujero Negro Supermasivo & Disco Doppler',
        category: 'Núcleo Galáctico Activo (AGN)',
        color: '#f59e0b',
        meshPattern: 'SMBH_AccretionCore,EventHorizon,EinsteinPhotonRing,DopplerAccretionDisk,RelativisticJet',
        description: 'Agujero negro supermasivo central con anillo de fotones de Einstein, disco de acreción con Doppler boosting y chorros relativistas.',
        scientificRole: 'Motor gravitacional del núcleo galáctico con velocidades orbitales cercanas a la velocidad de la luz (c).',
        dimensionsOrMetric: 'Masa: ~4 × 10^6 Masas Solares • Radio de Schwarzschild: ~12 × 10^6 km',
        defaultPosition: [0.0, 0.0, 0.0]
      },
      {
        id: 'layer_galaxy_arms',
        name: 'Brazos Espirales & Nube 3D Gaussian Splats',
        category: 'Estructura a Gran Escala',
        color: '#38bdf8',
        meshPattern: 'Gaussian_Galaxy_Arms_And_Halo,Gaussian_Splat_Galaxy',
        description: '14.000 Gaussian Splats organizados en 4 brazos espirales logarítmicos, cúmulos jóvenes O/B, regiones H II y halo globular.',
        scientificRole: 'Teoría de ondas de densidad de Lin-Shu que propaga la compresión y el nacimiento estelar a lo largo del disco galáctico.',
        dimensionsOrMetric: '14.000 Gaussian Splats • Diámetro: 100.000 años luz',
        defaultPosition: [0.8, 0.1, 0.8]
      }
    ];
  }

  // Fallback genérico para otros modelos
  return (modelDoc.hotspots || []).map((h, idx) => ({
    id: `layer_gen_${idx}`,
    name: h.title,
    category: 'Subsistema Técnico',
    color: idx === 0 ? '#38bdf8' : idx === 1 ? '#f59e0b' : '#10b981',
    meshPattern: h.title.split(' ')[0],
    description: h.desc,
    scientificRole: 'Componente funcional clave del sistema.',
    dimensionsOrMetric: 'Especificación física según normativa'
  }));
}

interface HighResCamera {
  id: string;
  name: string;
  localPath: string;
  source: string;
  resolution: string;
  sensor: string;
  description: string;
}

/* =========================================================================
   1. GENERADORES DE TEXTURAS PROCEDURALES PBR EN CANVAS 2D
   ========================================================================= */

/**
 * 1. Textura biológica vascular para el Encéfalo (Micro-capilares y circunvoluciones)
 */
function createBrainVascularTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#d2a396';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const idx = (y * 512 + x) * 4;
      const noise = (Math.sin(x * 0.08) * Math.cos(y * 0.08) + Math.sin(x * 0.03 + y * 0.04)) * 18;
      imgData.data[idx] = Math.min(255, Math.max(160, 210 + noise));
      imgData.data[idx + 1] = Math.min(255, Math.max(110, 163 + noise * 0.8));
      imgData.data[idx + 2] = Math.min(255, Math.max(100, 150 + noise * 0.7));
    }
  }
  ctx.putImageData(imgData, 0, 0);

  ctx.strokeStyle = 'rgba(160, 32, 24, 0.4)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let s = 0; s < 5; s++) {
      x += (Math.random() - 0.5) * 60;
      y += (Math.random() - 0.5) * 60;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

/**
 * 2. Textura de espejo hexagonal de oro puro para el James Webb (24k)
 */
function createGoldHexMirrorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffc222';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#d49b0f';
  ctx.lineWidth = 2.0;

  const hexRadius = 32;
  const h = hexRadius * Math.sin(Math.PI / 3);
  for (let y = 0; y < 512 + h; y += h * 2) {
    for (let x = 0; x < 512 + hexRadius * 3; x += hexRadius * 3) {
      drawHexagon(ctx, x, y, hexRadius);
      drawHexagon(ctx, x + hexRadius * 1.5, y + h, hexRadius);
    }
  }

  function drawHexagon(c: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    c.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = cx + r * Math.cos(angle);
      const hy = cy + r * Math.sin(angle);
      if (i === 0) c.moveTo(hx, hy);
      else c.lineTo(hx, hy);
    }
    c.closePath();
    c.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

/**
 * 3. Textura de láminas arrugadas de Mylar / Kapton térmico
 */
function createKaptonCrinkleTexture(baseColorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.0;
  for (let i = 0; i < 60; i++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let s = 0; s < 4; s++) {
      x += (Math.random() - 0.5) * 80;
      y += (Math.random() - 0.5) * 80;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.20)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 40; i++) {
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = Math.random() * 512;
    ctx.moveTo(x, y);
    for (let s = 0; s < 3; s++) {
      x += (Math.random() - 0.5) * 70;
      y += (Math.random() - 0.5) * 70;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

/**
 * 4. Textura de celdas fotovoltaicas de arseniuro de galio (GaAs)
 */
function createPhotovoltaicCellTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#d46b19';
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#1e1208';
  ctx.lineWidth = 3.0;
  for (let x = 0; x <= 512; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(230, 240, 255, 0.7)';
  ctx.lineWidth = 1.0;
  for (let x = 32; x < 512; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

/**
 * 5. Textura de mantas térmicas acolchadas MLI (Beta cloth)
 */
function createThermalMLITexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f5f7fb';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = 'rgba(200, 210, 225, 0.6)';
  ctx.lineWidth = 1.0;
  for (let x = 0; x <= 256; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 256);
    ctx.stroke();
  }
  for (let y = 0; y <= 256; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

/* =========================================================================
   2. CLASIFICADOR Y ASIGNADOR DE MATERIALES PBR FÍSICOS
   ========================================================================= */

function getHierarchicalSemanticTag(mesh: THREE.Mesh, mat: THREE.Material | null): string {
  const parts: string[] = [];
  if (mat && mat.name) parts.push(mat.name.toLowerCase());
  if (mesh.name) parts.push(mesh.name.toLowerCase());

  let currentParent = mesh.parent;
  let depth = 0;
  while (currentParent && depth < 3) {
    if (currentParent.name) parts.push(currentParent.name.toLowerCase());
    currentParent = currentParent.parent;
    depth++;
  }

  return parts.join(' ');
}

interface PbrTexturePack {
  brainTex: THREE.CanvasTexture | null;
  goldHexTex: THREE.CanvasTexture | null;
  kaptonPinkTex: THREE.CanvasTexture | null;
  kaptonSilverTex: THREE.CanvasTexture | null;
  kaptonGoldTex: THREE.CanvasTexture | null;
  pvCellTex: THREE.CanvasTexture | null;
  mliTex: THREE.CanvasTexture | null;
}

function generatePlanarUVs(geometry: THREE.BufferGeometry) {
  const pos = geometry.attributes.position;
  if (!pos) return;
  const uvs = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    uvs[i * 2] = (x * 0.35 + z * 0.35) % 1;
    uvs[i * 2 + 1] = (y * 0.35) % 1;
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
}

function resolvePbrMaterial(
  originalMat: THREE.Material | null,
  mesh: THREE.Mesh,
  presetId: string,
  textures: PbrTexturePack
): THREE.Material {
  const tag = getHierarchicalSemanticTag(mesh, originalMat);
  const existingMap = (originalMat as any)?.map || null;
  const existingNormal = (originalMat as any)?.normalMap || null;
  const existingRoughness = (originalMat as any)?.roughnessMap || null;

  // 1. HUBBLE (Tubo de aluminio pulido reflectante, alas fotovoltaicas GaAs y compuerta)
  if (presetId === 'hubble') {
    const isSolarArray = tag.includes('hbltel_3') || tag.includes('hbltel_4') || tag.includes('solar') || tag.includes('panel') || tag.includes('wing') || tag.includes('array');
    if (isSolarArray) {
      return new THREE.MeshPhysicalMaterial({
        map: existingMap || textures.pvCellTex,
        normalMap: existingNormal,
        color: existingMap ? new THREE.Color(0xffffff) : new THREE.Color(0xb85614),
        metalness: 0.35,
        roughness: 0.18,
        clearcoat: 0.50,
        clearcoatRoughness: 0.08,
        envMapIntensity: 2.2,
        reflectivity: 0.9,
        side: THREE.DoubleSide
      });
    }

    // Cuerpo y reflector óptico de aluminio pulido reflectante con marcas NASA
    return new THREE.MeshPhysicalMaterial({
      map: existingMap,
      normalMap: existingNormal,
      roughnessMap: existingRoughness,
      color: existingMap ? new THREE.Color(0xffffff) : new THREE.Color(0xd8e2ec),
      metalness: 0.92,
      roughness: 0.15,
      clearcoat: 0.55,
      clearcoatRoughness: 0.06,
      envMapIntensity: 2.8,
      reflectivity: 1.0,
      side: THREE.DoubleSide
    });
  }

  // 2. JAMES WEBB (Oro puro de 100 nm con patrón hexagonal, Kapton térmico)
  if (presetId === 'webb') {
    if (tag.includes('mirror') || tag.includes('gold') || tag.includes('segment') || tag.includes('primary') || tag.includes('hex')) {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xffb800),
        map: textures.goldHexTex || existingMap,
        metalness: 0.98,
        roughness: 0.04,
        clearcoat: 1.0,
        clearcoatRoughness: 0.02,
        envMapIntensity: 3.0,
        reflectivity: 1.0,
        side: THREE.DoubleSide
      });
    }
    if (tag.includes('pink') || tag.includes('shld_pink') || tag.includes('pinkmli') || tag.includes('sunshield') || tag.includes('layer') || tag.includes('boom')) {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xd6538a),
        map: textures.kaptonPinkTex || existingMap,
        metalness: 0.90,
        roughness: 0.18,
        clearcoat: 0.65,
        clearcoatRoughness: 0.10,
        envMapIntensity: 2.0,
        side: THREE.DoubleSide
      });
    }
    if (tag.includes('silver') || tag.includes('shld_silv') || tag.includes('silver_mli') || tag.includes('radiator') || tag.includes('foil')) {
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xd0d8e2),
        map: textures.kaptonSilverTex || existingMap,
        metalness: 0.92,
        roughness: 0.16,
        clearcoat: 0.55,
        envMapIntensity: 2.0,
        side: THREE.DoubleSide
      });
    }
    return new THREE.MeshStandardMaterial({
      map: existingMap,
      color: existingMap ? new THREE.Color(0xffffff) : new THREE.Color(0x1a1d24),
      metalness: 0.40,
      roughness: 0.55,
      envMapIntensity: 1.2,
      side: THREE.DoubleSide
    });
  }

  // 3. ESTACIÓN ESPACIAL INTERNACIONAL (Paneles GaAs, Armazón Truss, Módulos MLI)
  if (presetId === 'iss') {
    if (tag.includes('anisotropic') || tag.includes('blinn5') || tag.includes('blinn6') || tag.includes('solar') || tag.includes('panel') || tag.includes('saw') || tag.includes('array')) {
      return new THREE.MeshPhysicalMaterial({
        map: existingMap || textures.pvCellTex,
        normalMap: existingNormal,
        color: existingMap ? new THREE.Color(0xffffff) : new THREE.Color(0xb85614),
        metalness: 0.25,
        roughness: 0.22,
        clearcoat: 0.45,
        envMapIntensity: 1.8,
        side: THREE.DoubleSide
      });
    }
    if (tag.includes('blinn1') || tag.includes('blinn3') || tag.includes('blinn4') || tag.includes('blinn7') || tag.includes('truss') || tag.includes('bendedtruss') || tag.includes('strut') || tag.includes('cylinder') || tag.includes('pcylinder')) {
      return new THREE.MeshStandardMaterial({
        map: existingMap,
        color: existingMap ? new THREE.Color(0xffffff) : new THREE.Color(0x64748b),
        metalness: 0.85,
        roughness: 0.35,
        envMapIntensity: 1.6,
        side: THREE.DoubleSide
      });
    }
    if (tag.includes('apollohorns') || tag.includes('antenna') || tag.includes('dish')) {
      return new THREE.MeshPhysicalMaterial({
        map: existingMap,
        color: existingMap ? new THREE.Color(0xffffff) : new THREE.Color(0xd97706),
        metalness: 0.92,
        roughness: 0.18,
        clearcoat: 0.7,
        envMapIntensity: 2.2,
        side: THREE.DoubleSide
      });
    }
    return new THREE.MeshStandardMaterial({
      map: existingMap || textures.mliTex,
      color: existingMap ? new THREE.Color(0xffffff) : new THREE.Color(0xe2e8f0),
      metalness: 0.10,
      roughness: 0.55,
      envMapIntensity: 1.2,
      side: THREE.DoubleSide
    });
  }

  // 4. MÓDULO LUNAR APOLLO 11 (Mylar dorado arrugado, titanio)
  if (presetId === 'apollo') {
    if (tag.includes('blinn1') || tag.includes('blinn5') || tag.includes('blinn7') || tag.includes('gold') || tag.includes('mylar') || tag.includes('descent')) {
      return new THREE.MeshPhysicalMaterial({
        map: existingMap || textures.kaptonGoldTex,
        color: existingMap ? new THREE.Color(0xffffff) : new THREE.Color(0xffa500),
        metalness: 0.96,
        roughness: 0.14,
        clearcoat: 0.75,
        clearcoatRoughness: 0.15,
        envMapIntensity: 2.6,
        side: THREE.DoubleSide
      });
    }
    return new THREE.MeshStandardMaterial({
      map: existingMap,
      color: existingMap ? new THREE.Color(0xffffff) : new THREE.Color(0x9ca3af),
      metalness: 0.88,
      roughness: 0.28,
      envMapIntensity: 1.6,
      side: THREE.DoubleSide
    });
  }

  // 5. ENCÉFALO (Tejido Biológico con Subsurface Scattering orgánico)
  if (presetId === 'brain') {
    return new THREE.MeshPhysicalMaterial({
      map: existingMap || textures.brainTex,
      color: new THREE.Color(0xd2a396),
      roughness: 0.52,
      metalness: 0.0,
      clearcoat: 0.20,
      clearcoatRoughness: 0.45,
      transmission: 0.22,
      thickness: 2.2,
      attenuationColor: new THREE.Color(0xb83a2a),
      attenuationDistance: 1.5,
      sheen: 0.35,
      sheenColor: new THREE.Color(0xff9988),
      side: THREE.DoubleSide
    });
  }

  // 6. DEFAULT PBR CALIBRADO
  if (originalMat instanceof THREE.MeshStandardMaterial) {
    const clone = originalMat.clone();
    clone.roughness = 0.25;
    clone.metalness = 0.85;
    clone.envMapIntensity = 2.0;
    clone.side = THREE.DoubleSide;
    return clone;
  }

  return new THREE.MeshPhysicalMaterial({
    map: existingMap,
    color: existingMap ? new THREE.Color(0xffffff) : new THREE.Color(0xd8e2ec),
    metalness: 0.85,
    roughness: 0.25,
    clearcoat: 0.4,
    envMapIntensity: 1.8,
    side: THREE.DoubleSide
  });
}

export type Omni3DEnvironmentType =
  | 'environment_vista'      // Nebulosa, Galaxia, Paisaje Cósmico Panorámico (Sin estrellas externas superpuestas)
  | 'microscopic_bio'        // Célula, Cerebro, Órganos, Tejidos, Moléculas, Microscopía (Fluido oscuro, partículas Brownian motion)
  | 'architectural_product'  // Ventanas, Cuadros Eléctricos, Productos, Ingeniería, Mobiliario (Estudio neutro 6500K con suelo receptor de sombras)
  | 'planetary_macro'        // Planeta Tierra, Sol, Marte, Júpiter, Cuerpos Celestes a Macroescala (Vector solar, corona y estrellas macro)
  | 'object_prop';           // James Webb, Hubble, ISS, Apollo 11, Satélites, Astronauta EVA en Órbita (Vacío orbital 5800K + Earthshine)

/**
 * Clasificador Dinámico Universal de Entorno e Iluminación 3D
 */
export function resolveEnvironmentType(
  identifier = '',
  category = '',
  tags: string[] = []
): Omni3DEnvironmentType {
  const combined = `${identifier} ${category} ${tags.join(' ')}`.toLowerCase();

  // 1. Nebulosas, Galaxias y Paisajes Cósmicos Panorámicos
  if (
    combined.includes('carina') ||
    combined.includes('nebulosa') ||
    combined.includes('nebula') ||
    combined.includes('galaxy') ||
    combined.includes('galaxia') ||
    combined.includes('cosmic') ||
    combined.includes('cliffs') ||
    combined.includes('deep_field') ||
    combined.includes('vista') ||
    combined.includes('landscape')
  ) {
    return 'environment_vista';
  }

  // 2. Biología, Citología, Neuroanatomía, Medicina y Microscopía
  if (
    combined.includes('celula') ||
    combined.includes('célula') ||
    combined.includes('cell') ||
    combined.includes('brain') ||
    combined.includes('cerebro') ||
    combined.includes('encefalo') ||
    combined.includes('encéfalo') ||
    combined.includes('heart') ||
    combined.includes('corazon') ||
    combined.includes('corazón') ||
    combined.includes('bio') ||
    combined.includes('medic') ||
    combined.includes('anatom') ||
    combined.includes('citolog') ||
    combined.includes('microscop') ||
    combined.includes('mitocondria') ||
    combined.includes('adn') ||
    combined.includes('dna') ||
    combined.includes('organelle') ||
    combined.includes('virus') ||
    combined.includes('bacteri') ||
    combined.includes('atomo') ||
    combined.includes('átomo') ||
    combined.includes('quantum')
  ) {
    return 'microscopic_bio';
  }

  // 3. Planetas y Macroescala Planetaria / Estelar
  if (
    combined.includes('tierra') ||
    combined.includes('earth') ||
    combined.includes('blue marble') ||
    combined.includes('black marble') ||
    combined.includes('planet') ||
    combined.includes('planeta') ||
    combined.includes('marte') ||
    combined.includes('mars') ||
    combined.includes('jupiter') ||
    combined.includes('júpiter') ||
    combined.includes('moon') ||
    combined.includes('luna') ||
    /\bsol\b/i.test(combined) ||
    combined.includes('sun') ||
    combined.includes('solar')
  ) {
    return 'planetary_macro';
  }

  // 4. Objetos y Vehículos en Órbita / Espacio Exterior
  if (
    combined.includes('webb') ||
    combined.includes('jwst') ||
    combined.includes('hubble') ||
    combined.includes('iss') ||
    combined.includes('apollo') ||
    combined.includes('astronaut') ||
    combined.includes('astronauta') ||
    combined.includes('rover') ||
    combined.includes('satelite') ||
    combined.includes('satélite') ||
    combined.includes('satellite') ||
    combined.includes('telescop') ||
    combined.includes('spacecraft') ||
    combined.includes('orbital') ||
    combined.includes('estacion espacial')
  ) {
    return 'object_prop';
  }

  // 5. Arquitectura, Ingeniería, Productos Industriales y Nuevas Creaciones en Laboratorio
  return 'architectural_product';
}

/* =========================================================================
   HELPERS GRÁFICOS PARA GENERACIÓN DE FONDOS Y EFECTOS ÓPTICOS
   ========================================================================= */

function createDistantSunHalo(position: THREE.Vector3, sunScale = 65, coreRadius = 7.5): THREE.Group {
  const sunGroup = new THREE.Group();
  sunGroup.name = 'DistantSunCoronaGroup';
  sunGroup.position.copy(position);

  // Núcleo fotosférico del sol distante
  const sunGeo = new THREE.SphereGeometry(coreRadius, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  sunGroup.add(new THREE.Mesh(sunGeo, sunMat));

  // Halo / Corona Solar con mezcla aditiva
  const coronaCanvas = document.createElement('canvas');
  coronaCanvas.width = 256;
  coronaCanvas.height = 256;
  const cCtx = coronaCanvas.getContext('2d')!;
  const radGrad = cCtx.createRadialGradient(128, 128, 10, 128, 128, 128);
  radGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  radGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.85)');
  radGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.45)');
  radGrad.addColorStop(0.8, 'rgba(6, 182, 212, 0.15)');
  radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  cCtx.fillStyle = radGrad;
  cCtx.fillRect(0, 0, 256, 256);

  const coronaTexture = new THREE.CanvasTexture(coronaCanvas);
  const coronaMat = new THREE.SpriteMaterial({
    map: coronaTexture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
  });
  const coronaSprite = new THREE.Sprite(coronaMat);
  coronaSprite.scale.set(sunScale, sunScale, 1);
  sunGroup.add(coronaSprite);

  return sunGroup;
}

function createAstronomicalStarField(
  starCount = 8000,
  minRadius = 120,
  maxRadius = 300,
  pointSize = 0.32,
  pointOpacity = 0.92
): THREE.Points {
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);

  const spectralColors = [
    new THREE.Color(0xa5f3fc), // O/B: Blanco azulado brillante
    new THREE.Color(0xffffff), // A: Blanco puro
    new THREE.Color(0xfef08a), // F/G: Amarillo solar cálido
    new THREE.Color(0xfca5a5), // K/M: Naranja/Rojo estelar
    new THREE.Color(0xdbeafe)  // Blanco estelar
  ];

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const sinPhi = Math.sin(phi);

    starPos[i3] = radius * sinPhi * Math.cos(theta);
    starPos[i3 + 1] = radius * sinPhi * Math.sin(theta);
    starPos[i3 + 2] = radius * Math.cos(phi);

    const col = spectralColors[Math.floor(Math.random() * spectralColors.length)];
    starColors[i3] = col.r;
    starColors[i3 + 1] = col.g;
    starColors[i3 + 2] = col.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

  const starMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: pointSize,
    sizeAttenuation: true,
    transparent: true,
    opacity: pointOpacity
  });

  const points = new THREE.Points(starGeo, starMaterial);
  points.name = 'AstronomicalStarField';
  return points;
}

function createCosmicDustField(dustCount = 1500, radius = 200, heightSpread = 60): THREE.Points {
  const nebGeo = new THREE.BufferGeometry();
  const nebPos = new Float32Array(dustCount * 3);
  const nebColors = new Float32Array(dustCount * 3);
  const colDustA = new THREE.Color(0x1e3a8a);
  const colDustB = new THREE.Color(0x38bdf8);

  for (let i = 0; i < dustCount; i++) {
    const i3 = i * 3;
    const rad = radius + Math.random() * 80;
    const angle = Math.random() * Math.PI * 2;
    const h = (Math.random() - 0.5) * heightSpread;

    nebPos[i3] = Math.cos(angle) * rad;
    nebPos[i3 + 1] = h;
    nebPos[i3 + 2] = Math.sin(angle) * rad;

    const c = colDustA.clone().lerp(colDustB, Math.random());
    nebColors[i3] = c.r;
    nebColors[i3 + 1] = c.g;
    nebColors[i3 + 2] = c.b;
  }

  nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3));
  nebGeo.setAttribute('color', new THREE.BufferAttribute(nebColors, 3));

  const nebMaterial = new THREE.PointsMaterial({
    vertexColors: true,
    size: 1.8,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const dust = new THREE.Points(nebGeo, nebMaterial);
  dust.name = 'CosmicDustMilkyWay';
  return dust;
}

/* =========================================================================
   3. ORQUESTADOR UNIVERSAL DE ILUMINACIÓN Y ENTORNO DINÁMICO
   ========================================================================= */

export function setupSceneLightsAndStars(
  scene: THREE.Scene,
  presetId = 'webb',
  contextCategory = '',
  forcedEnvType?: Omni3DEnvironmentType
): Omni3DEnvironmentType {
  const envType = forcedEnvType || resolveEnvironmentType(presetId, contextCategory);

  // Limpiar callback de animación previa del entorno
  (scene as any).__updateEnvironment = null;

  /* -------------------------------------------------------------------------
     1. ENTORNO DE NEBULOSA / GALAXIA ('environment_vista')
     Fondo envolvente de polvo cósmico con niebla volumétrica y gradiente infrarrojo
     SIN estrellas genéricas superpuestas que choquen con la propia nebulosa.
     ------------------------------------------------------------------------- */
  if (envType === 'environment_vista') {
    scene.background = new THREE.Color(0x060210);
    scene.fog = new THREE.FogExp2(0x0a0418, 0.012);

    // Luz difusa de fotoionización ultravioleta e infrarroja
    const hemiLight = new THREE.HemisphereLight(0xd946ef, 0x1e1b4b, 1.8);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0x2e1065, 0.9);
    scene.add(ambientLight);

    // Key Light estelar cálida de fotoevaporación
    const photoIonizationLight = new THREE.DirectionalLight(0xfbbf24, 2.6);
    photoIonizationLight.position.set(20, 30, 20);
    photoIonizationLight.castShadow = true;
    photoIonizationLight.shadow.mapSize.width = 4096;
    photoIonizationLight.shadow.mapSize.height = 4096;
    photoIonizationLight.shadow.bias = -0.00005;
    scene.add(photoIonizationLight);

    // Luz difusa OIII cian de frente/lateral
    const oiiiEmissionLight = new THREE.DirectionalLight(0x06b6d4, 1.6);
    oiiiEmissionLight.position.set(-22, 10, -18);
    scene.add(oiiiEmissionLight);

    // Luz de relleno sutil para profundidad
    const rimCosmic = new THREE.DirectionalLight(0xf43f5e, 1.2);
    rimCosmic.position.set(0, -15, -20);
    scene.add(rimCosmic);

    return envType;
  }

  /* -------------------------------------------------------------------------
     2. ENTORNO BIOLÓGICO / MICROSCOPÍA ('microscopic_bio')
     Medio fluido oscuro con partículas suaves de Brownian motion, niebla oscura
     suave y transiluminación microscópica (SIN estrellas del espacio).
     ------------------------------------------------------------------------- */
  if (envType === 'microscopic_bio') {
    scene.background = new THREE.Color(0x020817);
    scene.fog = new THREE.FogExp2(0x020817, 0.018);

    // Iluminación de Microscopía Confocal y Transiluminación de Campo Oscuro
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x020617, 1.5);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.2);
    scene.add(ambientLight);

    // Epi-illumination Laser / Key Light cenital de alta resolución
    const epiLight = new THREE.DirectionalLight(0xffffff, 3.4);
    epiLight.position.set(14, 20, 16);
    epiLight.castShadow = true;
    epiLight.shadow.mapSize.width = 4096;
    epiLight.shadow.mapSize.height = 4096;
    epiLight.shadow.bias = -0.00005;
    scene.add(epiLight);

    // Sub-stage Transillumination Light (Condensador inferior que resalta membranas celulares)
    const transLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    transLight.position.set(0, -18, 6);
    scene.add(transLight);

    // Inmunofluorescencia secundaria (tinción DAPI / fluoróforos)
    const fluorLight = new THREE.DirectionalLight(0xa855f7, 2.0);
    fluorLight.position.set(-16, 12, -12);
    scene.add(fluorLight);

    // Resplandor de contraste de borde tisular
    const rimLight = new THREE.DirectionalLight(0xf43f5e, 1.6);
    rimLight.position.set(0, 10, -18);
    scene.add(rimLight);

    // Partículas coloidales en suspensión de fluido biológico con movimiento Browniano dinámico
    const partCount = 1200;
    const partGeo = new THREE.BufferGeometry();
    const initialPositions = new Float32Array(partCount * 3);
    const currentPositions = new Float32Array(partCount * 3);
    const seedFactors = new Float32Array(partCount * 3);

    for (let i = 0; i < partCount * 3; i += 3) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      initialPositions[i] = x;
      initialPositions[i + 1] = y;
      initialPositions[i + 2] = z;
      currentPositions[i] = x;
      currentPositions[i + 1] = y;
      currentPositions[i + 2] = z;

      seedFactors[i] = 0.3 + Math.random() * 0.7;
      seedFactors[i + 1] = 0.3 + Math.random() * 0.7;
      seedFactors[i + 2] = 0.3 + Math.random() * 0.7;
    }

    partGeo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.14,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const bioParticles = new THREE.Points(partGeo, partMat);
    bioParticles.name = 'MicroscopicBioBrownianParticles';
    scene.add(bioParticles);

    // Función de actualización de movimiento Browniano dinámico en cada frame
    (scene as any).__updateEnvironment = (time: number) => {
      const posAttr = partGeo.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < partCount; i++) {
        const i3 = i * 3;
        const s1 = seedFactors[i3];
        const s2 = seedFactors[i3 + 1];
        const s3 = seedFactors[i3 + 2];
        arr[i3] = initialPositions[i3] + Math.sin(time * s1 + i) * 0.7 + Math.cos(time * 0.5 + i * 2) * 0.25;
        arr[i3 + 1] = initialPositions[i3 + 1] + Math.cos(time * s2 + i * 1.5) * 0.7 + Math.sin(time * 0.4 + i) * 0.25;
        arr[i3 + 2] = initialPositions[i3 + 2] + Math.sin(time * s3 + i * 2.2) * 0.7 + Math.cos(time * 0.6 + i * 1.2) * 0.25;
      }
      posAttr.needsUpdate = true;
    };

    return envType;
  }

  /* -------------------------------------------------------------------------
     3. ENTORNO ARQUITECTÓNICO / INDUSTRIAL / PRODUCTO ('architectural_product')
     Estudio técnico neutral con suelo con plano receptor de sombras suaves
     (ShadowReceiver Plane), reflejos de estudio 6500K y cuadrícula sutil opcional.
     ------------------------------------------------------------------------- */
  if (envType === 'architectural_product') {
    scene.background = new THREE.Color(0x0b0f19);
    scene.fog = new THREE.Fog(0x0b0f19, 25, 120);

    // Iluminación de Estudio Neutra 6.500K
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 2.0);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0x1e293b, 0.8);
    scene.add(ambientLight);

    // Key Light de estudio fotográfico / showroom 6500K
    const studioKeyLight = new THREE.DirectionalLight(0xf8fafc, 3.8);
    studioKeyLight.position.set(14, 20, 16);
    studioKeyLight.castShadow = true;
    studioKeyLight.shadow.mapSize.width = 4096;
    studioKeyLight.shadow.mapSize.height = 4096;
    studioKeyLight.shadow.bias = -0.00005;
    studioKeyLight.shadow.normalBias = 0.02;
    scene.add(studioKeyLight);

    // Softbox difusor de relleno lateral
    const softFillLight = new THREE.DirectionalLight(0x94a3b8, 2.0);
    softFillLight.position.set(-16, 12, -12);
    scene.add(softFillLight);

    // Luz difusa cenital
    const topLight = new THREE.DirectionalLight(0xffffff, 1.6);
    topLight.position.set(0, 22, 0);
    scene.add(topLight);

    // Rim light de perfil técnico
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(0, 6, -18);
    scene.add(rimLight);

    // Suelo con plano receptor de sombras suaves (ShadowReceiver Plane / Contact Shadow Ground Plane)
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.ShadowMaterial({
      opacity: 0.45,
      color: 0x020617
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.name = 'ContactShadowGroundPlane';
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -2.42;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Cuadrícula técnica sutil opcional de referencia métrica e ingeniería
    const gridHelper = new THREE.GridHelper(50, 50, 0x334155, 0x1e293b);
    gridHelper.name = 'TechnicalStudioGridHelper';
    gridHelper.position.y = -2.418;
    if (Array.isArray(gridHelper.material)) {
      gridHelper.material.forEach((m) => {
        m.transparent = true;
        m.opacity = 0.45;
      });
    } else {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.45;
    }
    scene.add(gridHelper);

    return envType;
  }

  /* -------------------------------------------------------------------------
     4. ENTORNO PLANETARIO MACROESCALA ('planetary_macro')
     Escala planetaria con atmósfera, vector solar colimado a 5800K,
     corona solar distante y estrellas lejanas acordes a la escala planetaria.
     ------------------------------------------------------------------------- */
  if (envType === 'planetary_macro') {
    scene.background = new THREE.Color(0x010206);
    scene.fog = null;

    // Vector solar colimado
    const solarVector = new THREE.Vector3(26, 14, 24).normalize();

    // Luz Solar Directa a 5.800 K
    const sunLight = new THREE.DirectionalLight(0xfffaea, 4.2);
    sunLight.position.copy(solarVector.clone().multiplyScalar(32));
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 150;
    sunLight.shadow.bias = -0.00005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    // Luz de dispersión Rayleigh en el limbo atmosférico
    const atmoLimbFill = new THREE.HemisphereLight(0x38bdf8, 0x020617, 0.7);
    scene.add(atmoLimbFill);

    // Reflectancia tenue de la cara nocturna
    const nightFill = new THREE.DirectionalLight(0x0f172a, 0.35);
    nightFill.position.set(-20, -10, -18);
    scene.add(nightFill);

    // Disco solar lejano con corona fotosférica en la trayectoria del vector solar
    const sunGroup = createDistantSunHalo(solarVector.clone().multiplyScalar(220), 75, 8.5);
    scene.add(sunGroup);

    // Firmamento tridimensional de estrellas macroescala (6.000 estrellas)
    const starField = createAstronomicalStarField(6000, 160, 380, 0.38, 0.95);
    scene.add(starField);

    return envType;
  }

  /* -------------------------------------------------------------------------
     5. ENTORNO ESPACIAL ORBITAL ('object_prop')
     Vacío orbital real con luz solar colimada a 5800K, reflectancia de la Tierra
     (Earthshine azulada), rim light rasante, estrellas astronómicas y polvo cósmico.
     ------------------------------------------------------------------------- */
  scene.background = new THREE.Color(0x010308);
  scene.fog = null;

  // 1. Luz Solar Directa en el Vacío Espacial (Direct Solar Radiation 5800K)
  const sunLight = new THREE.DirectionalLight(0xfffaea, 4.0);
  sunLight.position.set(22, 28, 20);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 4096;
  sunLight.shadow.mapSize.height = 4096;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 120;
  sunLight.shadow.camera.left = -12;
  sunLight.shadow.camera.right = 12;
  sunLight.shadow.camera.top = 12;
  sunLight.shadow.camera.bottom = -12;
  sunLight.shadow.bias = -0.00005;
  sunLight.shadow.normalBias = 0.02;
  scene.add(sunLight);

  // 2. Luz Secundaria de Relleno Planetario (Earthshine / Reflectancia Atmosférica Azulada)
  const earthshineLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
  earthshineLight.position.set(-18, -12, -16);
  scene.add(earthshineLight);

  // 3. Luz Rasante de Contorno (Grazing Rim Light) para Perfil de Paneles y Espejos
  const rimLight = new THREE.DirectionalLight(0xffffff, 1.8);
  rimLight.position.set(-8, 18, -25);
  scene.add(rimLight);

  // 4. Luz de Relleno Suave Cósmica (Deep Space Ambient Fill)
  const cosmicFill = new THREE.HemisphereLight(0xffffff, 0x030712, 0.6);
  scene.add(cosmicFill);

  // 5. Disco Solar / Corona Estelar en la Lejanía
  const sunGroup = createDistantSunHalo(new THREE.Vector3(160, 186, 133), 65, 7.5);
  scene.add(sunGroup);

  // 6. Firmamento Tridimensional de Estrellas Astronómicas (8.000 Estrellas)
  const starField = createAstronomicalStarField(8000, 120, 300, 0.32, 0.92);
  scene.add(starField);

  // 7. Polvo Cósmico de Fondo Sutil
  const cosmicDust = createCosmicDustField(1500, 200, 60);
  scene.add(cosmicDust);

  return envType;
}

export function processAndMountModel(
  rawObject: THREE.Object3D,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  presetId: string,
  targetRadius = 2.4,
  applyPbrClassifier = true,
  category = '',
  forcedEnvType?: Omni3DEnvironmentType
): THREE.Group {
  scene.clear();
  const envType = setupSceneLightsAndStars(scene, presetId, category, forcedEnvType);

  const pivotGroup = new THREE.Group();

  rawObject.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(rawObject);
  const sphere = new THREE.Sphere();
  box.getBoundingSphere(sphere);

  const center = sphere.center.clone();
  const currentRadius = Math.max(sphere.radius, 0.001);

  // Para vistas panorámicas cósmicas (nebulosas, galaxias), mantener escala monumental envolvente
  const scaleFactor = envType === 'environment_vista' ? 1.0 : (targetRadius / currentRadius);
  rawObject.scale.setScalar(scaleFactor);
  if (envType === 'environment_vista') {
    rawObject.position.set(0, 0, 0);
  } else {
    rawObject.position.copy(center).multiplyScalar(-scaleFactor);
  }

  // Para entornos de producto / arquitectura, posicionar el plano receptor de sombras exactamente en la base
  if (envType === 'architectural_product') {
    const groundPlane = scene.getObjectByName('ContactShadowGroundPlane');
    const gridHelper = scene.getObjectByName('TechnicalStudioGridHelper');
    const floorY = -targetRadius;
    if (groundPlane) groundPlane.position.y = floorY;
    if (gridHelper) gridHelper.position.y = floorY + 0.002;
  }

  // Orientaciones óptimas iniciales para exhibición
  if (presetId === 'hubble') {
    rawObject.rotation.y = 0.45;
    rawObject.rotation.x = 0.15;
  } else if (presetId === 'webb') {
    rawObject.rotation.x = 0.2;
    rawObject.rotation.y = -0.6;
  } else if (presetId === 'apollo') {
    rawObject.rotation.y = 0.4;
  } else if (presetId === 'iss') {
    rawObject.rotation.x = 1.35;
    rawObject.rotation.y = 0.45;
    rawObject.rotation.z = -0.25;
  }

  pivotGroup.add(rawObject);

  // Precalcular texturas PBR si aplica clasificador de CAD GLTF
  if (applyPbrClassifier) {
    const texturePack: PbrTexturePack = {
      brainTex: presetId === 'brain' ? createBrainVascularTexture() : null,
      goldHexTex: presetId === 'webb' ? createGoldHexMirrorTexture() : null,
      kaptonPinkTex: presetId === 'webb' ? createKaptonCrinkleTexture('#d4688e') : null,
      kaptonSilverTex: presetId === 'webb' ? createKaptonCrinkleTexture('#e2e8f0') : null,
      kaptonGoldTex: presetId === 'apollo' ? createKaptonCrinkleTexture('#ffae19') : null,
      pvCellTex: (presetId === 'iss' || presetId === 'hubble') ? createPhotovoltaicCellTexture() : null,
      mliTex: presetId === 'iss' ? createThermalMLITexture() : null
    };

    rawObject.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.geometry) {
          if (!mesh.geometry.hasAttribute('normal')) {
            mesh.geometry.computeVertexNormals();
          }
          if (!mesh.geometry.hasAttribute('uv')) {
            generatePlanarUVs(mesh.geometry);
          }
        }

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((mat) => resolvePbrMaterial(mat, mesh, presetId, texturePack));
        } else {
          mesh.material = resolvePbrMaterial(mesh.material || null, mesh, presetId, texturePack);
        }
      }
    });
  } else {
    // Para modelos procedurales o sintéticos de IA, activar sombras y calcular normales respetando sus materiales originales
    rawObject.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.geometry && !mesh.geometry.hasAttribute('normal')) {
          mesh.geometry.computeVertexNormals();
        }
      }
    });
  }

  scene.add(pivotGroup);

  const aspect = camera.aspect > 0 ? camera.aspect : 16 / 9;
  const fovVRad = (camera.fov * Math.PI) / 180;
  const fovHRad = 2 * Math.atan(Math.tan(fovVRad / 2) * aspect);
  const effectiveRadius = envType === 'environment_vista' ? Math.max(currentRadius, targetRadius) : targetRadius;
  const distV = effectiveRadius / Math.sin(fovVRad / 2);
  const distH = effectiveRadius / Math.sin(fovHRad / 2);
  const targetDistance = Math.max(distV, distH) * 1.35;

  // Calibración de cámara y límites de controles adaptados a cada tipo de entorno
  controls.target.set(0, 0, 0);

  if (envType === 'environment_vista') {
    (pivotGroup as any).__noAutoRotate = true;
    pivotGroup.name = 'EnvironmentVistaGroup';
    camera.near = 0.1;
    camera.far = 2000;
    camera.position.set(0, 0.2, 9.5);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.minDistance = 1.0;
    controls.maxDistance = 28.0;
    controls.maxAzimuthAngle = Math.PI * 0.42;
    controls.minAzimuthAngle = -Math.PI * 0.42;
    controls.maxPolarAngle = Math.PI * 0.68;
    controls.minPolarAngle = Math.PI * 0.32;
  } else if (envType === 'microscopic_bio') {
    camera.near = 0.02;
    camera.far = 600;
    camera.updateProjectionMatrix();
    const dir = new THREE.Vector3(1.0, 0.65, 1.25).normalize();
    camera.position.copy(dir.multiplyScalar(targetDistance));
    controls.minDistance = 0.1;
    controls.maxDistance = targetDistance * 6;
    controls.maxAzimuthAngle = Infinity;
    controls.minAzimuthAngle = -Infinity;
    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = 0;
  } else if (envType === 'architectural_product') {
    camera.near = 0.05;
    camera.far = 800;
    camera.updateProjectionMatrix();
    const dir = new THREE.Vector3(1.2, 0.8, 1.4).normalize();
    camera.position.copy(dir.multiplyScalar(targetDistance));
    controls.minDistance = 0.2;
    controls.maxDistance = targetDistance * 5;
    controls.maxAzimuthAngle = Infinity;
    controls.minAzimuthAngle = -Infinity;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // No pasar por debajo del suelo técnico
    controls.minPolarAngle = 0.05;
  } else if (envType === 'planetary_macro') {
    camera.near = 0.1;
    camera.far = 2000;
    camera.updateProjectionMatrix();
    const dir = new THREE.Vector3(0.9, 0.5, 1.4).normalize();
    camera.position.copy(dir.multiplyScalar(targetDistance));
    controls.minDistance = 0.5;
    controls.maxDistance = targetDistance * 10;
    controls.maxAzimuthAngle = Infinity;
    controls.minAzimuthAngle = -Infinity;
    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = 0;
  } else {
    // 'object_prop'
    camera.near = 0.05;
    camera.far = 1000;
    camera.updateProjectionMatrix();
    const dir = new THREE.Vector3(1.1, 0.6, 1.3).normalize();
    camera.position.copy(dir.multiplyScalar(targetDistance));
    controls.minDistance = 0.2;
    controls.maxDistance = targetDistance * 6;
    controls.maxAzimuthAngle = Infinity;
    controls.minAzimuthAngle = -Infinity;
    controls.maxPolarAngle = Math.PI;
    controls.minPolarAngle = 0;
  }

  controls.update();
  return pivotGroup;
}

export const Omni3DStudioAdmin: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [modelsList, setModelsList] = useState<Model3DDocument[]>(DEFAULT_BUILTIN_MODELS);
  const [selectedId, setSelectedId] = useState<string>('webb');
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [promptInput, setPromptInput] = useState<string>('');
  const [renderMode, setRenderMode] = useState<'solid' | 'xray' | 'wireframe'>('solid');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [selectedImageModal, setSelectedImageModal] = useState<HighResCamera | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<'ai_chat' | 'inspector' | 'layers' | 'database'>('inspector');
  const [dbSearchQuery, setDbSearchQuery] = useState<string>('');
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set());
  const [showLayersOverlay, setShowLayersOverlay] = useState<boolean>(false);
  const [selectedLayerDetail, setSelectedLayerDetail] = useState<ModelLayerInfo | null>(null);
  const [showHotspotPins, setShowHotspotPins] = useState<boolean>(true);
  const [activeFloatingPopover, setActiveFloatingPopover] = useState<{ layer: ModelLayerInfo; screenPos: { x: number; y: number } } | null>(null);
  const [isSceneReady, setIsSceneReady] = useState<boolean>(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentModelGroupRef = useRef<THREE.Group | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeModelLayersRef = useRef<ModelLayerInfo[]>([]);
  const hiddenLayersRef = useRef<Set<string>>(new Set());
  const pinDomRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Escucha reactiva en tiempo real con Firebase Firestore
  useEffect(() => {
    const service = Model3DService.getInstance();
    const unsubscribe = service.subscribeToModels((list) => {
      setModelsList(list);
    });
    return () => unsubscribe();
  }, []);

  const activeModelDoc = modelsList.find(m => m.id === selectedId) || DEFAULT_BUILTIN_MODELS.find(m => m.id === selectedId) || modelsList[0] || DEFAULT_BUILTIN_MODELS[0];
  const activeModelLayers = getModelLayers(activeModelDoc);
  activeModelLayersRef.current = activeModelLayers;
  hiddenLayersRef.current = hiddenLayers;

  // Reset layer visibility and popovers when active model changes
  useEffect(() => {
    setHiddenLayers(new Set());
    setSelectedLayerDetail(null);
    setActiveFloatingPopover(null);
  }, [activeModelDoc.id]);

  const handleFocusOnLayer = (layer: ModelLayerInfo, screenPos?: { x: number; y: number }) => {
    setSelectedLayerDetail(layer);
    if (screenPos) {
      setActiveFloatingPopover({ layer, screenPos });
    } else {
      setActiveFloatingPopover({
        layer,
        screenPos: { x: 260, y: 160 }
      });
    }

    if (cameraRef.current && controlsRef.current && layer.defaultPosition) {
      const targetPos = new THREE.Vector3(...layer.defaultPosition);
      if (currentModelGroupRef.current) {
        targetPos.applyMatrix4(currentModelGroupRef.current.matrixWorld);
      }

      const startTarget = controlsRef.current.target.clone();
      const startTime = performance.now();
      const duration = 650;

      const animateFocus = (time: number) => {
        const elapsed = time - startTime;
        const t = Math.min(elapsed / duration, 1.0);
        const ease = 0.5 - Math.cos(t * Math.PI) / 2;

        if (controlsRef.current) {
          controlsRef.current.target.lerpVectors(startTarget, targetPos, ease);
          controlsRef.current.update();
        }

        if (t < 1.0) {
          requestAnimationFrame(animateFocus);
        }
      };
      requestAnimationFrame(animateFocus);
    }
  };

  const handleIsolateLayer = (targetLayer: ModelLayerInfo) => {
    const newHidden = new Set<string>();
    activeModelLayers.forEach(l => {
      if (l.id !== targetLayer.id) {
        newHidden.add(l.id);
      }
    });
    setHiddenLayers(newHidden);

    if (currentModelGroupRef.current) {
      const targetPatterns = targetLayer.meshPattern.split(',').map(p => p.trim().toLowerCase());
      currentModelGroupRef.current.traverse((child) => {
        const cName = (child.name || '').toLowerCase();
        const pName = (child.parent?.name || '').toLowerCase();
        const matches = targetPatterns.some(p => cName.includes(p) || pName.includes(p));
        child.visible = matches;
      });
    }
  };

  const handleShowAllLayers = () => {
    setHiddenLayers(new Set());
    if (currentModelGroupRef.current) {
      currentModelGroupRef.current.traverse((child) => {
        child.visible = true;
      });
    }
  };

  const handleToggleLayer = (layer: ModelLayerInfo) => {
    setHiddenLayers(prev => {
      const next = new Set(prev);
      const isCurrentlyHidden = next.has(layer.id);
      if (isCurrentlyHidden) {
        next.delete(layer.id);
      } else {
        next.add(layer.id);
      }

      const shouldBeVisible = isCurrentlyHidden;
      const patterns = layer.meshPattern.split(',').map(p => p.trim().toLowerCase());

      if (currentModelGroupRef.current) {
        currentModelGroupRef.current.traverse((child) => {
          const cName = (child.name || '').toLowerCase();
          const pName = (child.parent?.name || '').toLowerCase();
          const matches = patterns.some(p => cName.includes(p) || pName.includes(p));
          if (matches) {
            child.visible = shouldBeVisible;
          }
        });
      }

      return next;
    });
  };

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02040a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Configuración IBL RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.panSpeed = 1.2;
    controls.minDistance = 2.42;
    controls.maxDistance = 200.0;
    controls.zoomSpeed = 1.5;
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };
    controlsRef.current = controls;

    // Sistema de Raycasting Interactivo por Clic Directo en Three.js
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: MouseEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      isDragging = false;
    };

    const handlePointerMove = (e: MouseEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 5) isDragging = true;

      // Hover feedback: cambiar cursor a pointer si pasa sobre un orgánulo interactivo
      if (!renderer.domElement || !cameraRef.current || !currentModelGroupRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(currentModelGroupRef.current.children, true);
      if (intersects.length > 0 && !isDragging) {
        renderer.domElement.style.cursor = 'pointer';
      } else if (!isDragging && controls.mouseButtons.LEFT !== THREE.MOUSE.PAN) {
        renderer.domElement.style.cursor = 'default';
      }
    };

    const handlePointerUp = (e: MouseEvent) => {
      if (isDragging) return; // Si fue un arrastre de rotación/paneo, ignorar clic
      if (!renderer.domElement || !cameraRef.current || !currentModelGroupRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(currentModelGroupRef.current.children, true);

      if (intersects.length > 0) {
        const hit = intersects[0];
        let currentObj: THREE.Object3D | null = hit.object;
        let matchedLayer: ModelLayerInfo | undefined;

        // Buscar qué capa anatómica contiene al objeto clickeado
        while (currentObj && currentObj !== currentModelGroupRef.current) {
          const objName = (currentObj.name || '').toLowerCase();
          matchedLayer = activeModelLayers.find(layer => {
            const patterns = layer.meshPattern.split(',').map(p => p.trim().toLowerCase());
            return patterns.some(p => objName.includes(p));
          });
          if (matchedLayer) break;
          currentObj = currentObj.parent;
        }

        if (matchedLayer) {
          setSelectedLayerDetail(matchedLayer);
          setRightPanelTab('inspector');

          // Animación suave de enfoque de cámara hacia el orgánulo seleccionado
          const targetPos = new THREE.Vector3();
          hit.object.getWorldPosition(targetPos);
          
          // Animar el centro de los controles hacia el orgánulo
          const startTarget = controls.target.clone();
          const startTime = performance.now();
          const duration = 650; // ms

          const animateFocus = (time: number) => {
            const elapsed = time - startTime;
            const t = Math.min(elapsed / duration, 1.0);
            const ease = 0.5 - Math.cos(t * Math.PI) / 2; // Ease in-out

            controls.target.lerpVectors(startTarget, targetPos, ease);
            controls.update();

            if (t < 1.0) {
              requestAnimationFrame(animateFocus);
            }
          };
          requestAnimationFrame(animateFocus);
        }
      }
    };

    if (renderer.domElement) {
      renderer.domElement.addEventListener('mousedown', handlePointerDown);
      renderer.domElement.addEventListener('mousemove', handlePointerMove);
      renderer.domElement.addEventListener('mouseup', handlePointerUp);
    }

    // Habilitar navegación PAN con Barra Espaciadora en toda la web
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
        if (renderer.domElement) renderer.domElement.style.cursor = 'grab';
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
        if (renderer.domElement) renderer.domElement.style.cursor = 'default';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    setupSceneLightsAndStars(scene);

    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = performance.now() * 0.001;

      // Actualización dinámica del entorno (ej: agitación térmica de partículas Brownianas en microscopía)
      if (sceneRef.current && (sceneRef.current as any).__updateEnvironment) {
        (sceneRef.current as any).__updateEnvironment(elapsedTime);
      }

      if (currentModelGroupRef.current) {
        const isVista = currentModelGroupRef.current.name?.includes('Vista') || 
                        currentModelGroupRef.current.name?.includes('Carina') || 
                        (currentModelGroupRef.current as any).__noAutoRotate ||
                        (currentModelGroupRef.current.children[0] && (currentModelGroupRef.current.children[0] as any).userData?.isPanoramicNebula);
        if (!isVista) {
          currentModelGroupRef.current.rotation.y += 0.0012;
        } else {
          // Parallax cósmico sutil y orgánico para horizontes panorámicos
          currentModelGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.15) * 0.035;
          currentModelGroupRef.current.rotation.x = Math.cos(elapsedTime * 0.1) * 0.015;
        }

        const earthClouds = currentModelGroupRef.current.getObjectByName('EarthClouds');
        if (earthClouds) {
          earthClouds.rotation.y += 0.0015;
        }

        const solarWind = currentModelGroupRef.current.getObjectByName('SolarWind');
        if (solarWind) {
          solarWind.rotation.y -= 0.001;
        }

        // Proyección dinámica de Hotspots 3D a coordenadas 2D en pantalla (Direct DOM Transform - Zero React re-renders)
        if (cameraRef.current && rendererRef.current && activeModelLayersRef.current.length > 0) {
          const width = rendererRef.current.domElement.clientWidth;
          const height = rendererRef.current.domElement.clientHeight;

          if (width > 50 && height > 50) {
            activeModelLayersRef.current.forEach((layer) => {
              const el = pinDomRefs.current[layer.id];
              if (!el) return;

              if (hiddenLayersRef.current.has(layer.id)) {
                el.style.display = 'none';
                return;
              }

              const pos = new THREE.Vector3();
              let foundObj: THREE.Object3D | null = null;
              const patterns = layer.meshPattern.split(',').map(p => p.trim().toLowerCase());

              currentModelGroupRef.current!.traverse((child) => {
                if (foundObj) return;
                const cName = (child.name || '').toLowerCase();
                if (patterns.some(p => cName.includes(p))) {
                  foundObj = child;
                }
              });

              if (foundObj) {
                (foundObj as THREE.Object3D).getWorldPosition(pos);
              } else if (layer.defaultPosition) {
                pos.set(...layer.defaultPosition);
                pos.applyMatrix4(currentModelGroupRef.current!.matrixWorld);
              } else {
                el.style.display = 'none';
                return;
              }

              pos.project(cameraRef.current!);

              // Solo visible si está delante del plano de la cámara
              if (pos.z < 1.0) {
                const screenX = (pos.x * 0.5 + 0.5) * width;
                const screenY = (-(pos.y * 0.5) + 0.5) * height;

                if (screenX >= 20 && screenX <= width - 20 && screenY >= 20 && screenY <= height - 20) {
                  el.style.display = 'flex';
                  el.style.transform = `translate3d(${Math.round(screenX)}px, ${Math.round(screenY)}px, 0) translate(-50%, -50%)`;
                } else {
                  el.style.display = 'none';
                }
              } else {
                el.style.display = 'none';
              }
            });
          }
        }
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth || 800;
      const h = containerRef.current.clientHeight || 600;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    setIsSceneReady(true);

    return () => {
      setIsSceneReady(false);
      cancelAnimationFrame(animId);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener('mousedown', handlePointerDown);
        renderer.domElement.removeEventListener('mousemove', handlePointerMove);
        renderer.domElement.removeEventListener('mouseup', handlePointerUp);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      renderer.dispose();
    };
  }, []);

  // Carga y renderizado dinámico de la entidad seleccionada
  useEffect(() => {
    if (!isSceneReady || !sceneRef.current || !cameraRef.current || !controlsRef.current) return;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    scene.clear();

    // 0. Si el usuario está en modo "+ Nueva Creación", dejar el escenario limpio en blanco con iluminación de laboratorio
    if (isCreatingNew) {
      setupSceneLightsAndStars(scene, 'new_creation', 'Laboratorio de Síntesis 3D');
      currentModelGroupRef.current = null;
      setLoading(false);
      return;
    }

    if (!activeModelDoc) return;
    setupSceneLightsAndStars(scene, activeModelDoc.id, activeModelDoc.category || '');
    currentModelGroupRef.current = null;

    let isCancelled = false;

    // 1. Si tiene archivo CAD GLTF real (.glb oficial o generado por TRELLIS)
    if (activeModelDoc.localUrl && activeModelDoc.localUrl.endsWith('.glb')) {
      setLoading(true);
      setLoadingMessage(`Cargando modelo 3D real (${activeModelDoc.name})...`);

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      dracoLoader.setDecoderConfig({ type: 'js' });

      const loader = new GLTFLoader();
      loader.setDRACOLoader(dracoLoader);

      const loadWithUrl = (url: string, isFallback = false) => {
        loader.load(
          url,
          (gltf) => {
            if (isCancelled) return;
            setLoading(false);
            const mountedGroup = processAndMountModel(
              gltf.scene,
              scene,
              camera,
              controls,
              activeModelDoc.id,
              2.4,
              true,
              activeModelDoc.category || ''
            );
            currentModelGroupRef.current = mountedGroup;
          },
          undefined,
          (err) => {
            if (isCancelled) return;
            console.error('Error al cargar GLTF:', err);
            if (!isFallback && activeModelDoc.cdnUrl) {
              loadWithUrl(activeModelDoc.cdnUrl, true);
            } else {
              setLoading(false);
              // Fallback a especificación paramétrica si el binario remoto falla
              if (activeModelDoc.spec && activeModelDoc.spec.rootNodes) {
                const entityGroup = Universal3DInterpreter.buildSceneFromSpec(activeModelDoc.spec);
                const mountedGroup = processAndMountModel(
                  entityGroup,
                  scene,
                  camera,
                  controls,
                  activeModelDoc.id,
                  2.4,
                  false,
                  activeModelDoc.category || ''
                );
                currentModelGroupRef.current = mountedGroup;
              }
            }
          }
        );
      };

      loadWithUrl(activeModelDoc.localUrl);
      return () => {
        isCancelled = true;
      };
    }

    // 2. Comprobar si existe generador procedural especializado (Ventana, Tierra, Astronauta, Rover, Corazón, Átomo, Carina, Sol)
    const entityKeyword = `${activeModelDoc.id} ${activeModelDoc.name} ${activeModelDoc.category || ''}`.toLowerCase();
    const hasSpecializedGenerator = (
      entityKeyword.includes('celula') ||
      entityKeyword.includes('célula') ||
      entityKeyword.includes('cell') ||
      entityKeyword.includes('citologia') ||
      entityKeyword.includes('mitocondria') ||
      entityKeyword.includes('ventana') ||
      entityKeyword.includes('window') ||
      entityKeyword.includes('climalit') ||
      entityKeyword.includes('tierra') ||
      entityKeyword.includes('earth') ||
      entityKeyword.includes('astronaut') ||
      entityKeyword.includes('rover') ||
      entityKeyword.includes('corazon') ||
      entityKeyword.includes('corazón') ||
      entityKeyword.includes('atomo') ||
      entityKeyword.includes('átomo') ||
      entityKeyword.includes('carina') ||
      entityKeyword.includes('galaxy') ||
      entityKeyword.includes('galaxia') ||
      entityKeyword.includes('planetario') ||
      entityKeyword.includes('sistema solar') ||
      entityKeyword.includes('mapa completo') ||
      entityKeyword.includes('sistemas planetarios') ||
      entityKeyword.includes('exoplaneta') ||
      /\bsol\b/i.test(entityKeyword)
    );

    if (hasSpecializedGenerator) {
      setLoading(false);
      const proceduralGroup = Omni3DProceduralFactory.buildProceduralEntity(entityKeyword);
      const mountedGroup = processAndMountModel(
        proceduralGroup,
        scene,
        camera,
        controls,
        activeModelDoc.id,
        2.4,
        false,
        activeModelDoc.category || ''
      );
      currentModelGroupRef.current = mountedGroup;
      return;
    }

    // 3. Si el modelo contiene especificación dinámica JSON generada por la IA
    if (activeModelDoc.spec && activeModelDoc.spec.rootNodes && activeModelDoc.spec.rootNodes.length > 0) {
      setLoading(false);
      const entityGroup = Universal3DInterpreter.buildSceneFromSpec(activeModelDoc.spec);
      const mountedGroup = processAndMountModel(
        entityGroup,
        scene,
        camera,
        controls,
        activeModelDoc.id,
        2.4,
        false,
        activeModelDoc.category || ''
      );
      currentModelGroupRef.current = mountedGroup;
      return;
    }

    // 4. Fallback: Despachador procedural universal
    setLoading(false);
    const proceduralGroup = Omni3DProceduralFactory.buildProceduralEntity(entityKeyword);
    const mountedGroup = processAndMountModel(
      proceduralGroup,
      scene,
      camera,
      controls,
      activeModelDoc.id,
      2.4,
      false,
      activeModelDoc.category || ''
    );
    currentModelGroupRef.current = mountedGroup;

  }, [isSceneReady, selectedId, isCreatingNew, activeModelDoc?.id]);

  // Manejador de subida de fotos por el usuario para mapeo PBR
  const handleUserPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setLoading(true);
    setLoadingMessage(`Procesando y mapeando fotografía (${file.name})...`);

    try {
      const photoTexture = await ImageTextureMapper.processUserImage(file);
      if (currentModelGroupRef.current) {
        ImageTextureMapper.applyTextureToGroup(currentModelGroupRef.current, photoTexture);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error al procesar fotografía:', err);
      setLoading(false);
    }
  };

  // Aplicar Estilo de Renderizado
  const handleSetRenderStyle = (style: 'solid' | 'xray' | 'wireframe') => {
    setRenderMode(style);
    if (!currentModelGroupRef.current) return;
    currentModelGroupRef.current.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const mat = m as THREE.MeshStandardMaterial;
          if (style === 'wireframe') {
            mat.wireframe = true;
            mat.transparent = false;
            mat.opacity = 1.0;
          } else if (style === 'xray') {
            mat.wireframe = false;
            mat.transparent = true;
            mat.opacity = 0.35;
          } else {
            mat.wireframe = false;
            mat.transparent = false;
            mat.opacity = 1.0;
          }
        });
      }
    });
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchInput = document.querySelector('input[placeholder*="Escribe lo que sea"]') as HTMLInputElement;
    const q = (searchInput?.value || promptInput).trim();
    if (q) {
      setIsCreatingNew(false);
      const generatedSpec = Omni3DGeneratorService.generateAdaptiveFallbackSpec(q);
      const doc = Omni3DGeneratorService.specToDocument(generatedSpec, 'pbr_physical');
      const cleanSlug = q.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 24);
      doc.id = cleanSlug.includes('ventana') ? 'ventana_climalit' : ('gen_' + cleanSlug + '_' + Date.now().toString(36));
      doc.name = generatedSpec.name;
      doc.category = generatedSpec.category;
      doc.spec = generatedSpec;
      doc.officialSources = generatedSpec.officialSources;

      setModelsList(prev => [doc, ...prev.filter(m => m.id !== doc.id)]);
      setSelectedId(doc.id);
      setRightPanelTab('inspector');
    } else {
      setIsCreatingNew(true);
      setSelectedId('');
      setRightPanelTab('ai_chat');
    }
  };

  const handleExecuteReconstruction = async (config: Wizard3DConfig) => {
    setModelsList(prev => {
      const exists = prev.some(m => m.id === config.selectedModelDoc.id);
      if (!exists) {
        return [config.selectedModelDoc, ...prev];
      }
      return prev.map(m => m.id === config.selectedModelDoc.id ? config.selectedModelDoc : m);
    });
    setIsCreatingNew(false);
    setSelectedId(config.presetId);
    setPromptInput(config.selectedModelDoc.name || config.query);
    setRightPanelTab('inspector');

    if (config.finishStyle === 'cad_wireframe') {
      handleSetRenderStyle('wireframe');
    } else if (config.finishStyle === 'xray') {
      handleSetRenderStyle('xray');
    } else {
      handleSetRenderStyle('solid');
    }

    if (cameraRef.current && controlsRef.current) {
      if (config.visionPerspective === 'macro') {
        cameraRef.current.position.set(1.4, 0.8, 1.8);
      } else if (config.visionPerspective === 'cross_section') {
        cameraRef.current.position.set(0.0, 3.5, 0.1);
      } else {
        cameraRef.current.position.set(3.5, 2.0, 5.0);
      }
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(3.5, 2.0, 5.0);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-display overflow-hidden">
      
      {/* Top Prompt & Model Selector Bar */}
      <div className="p-3 bg-slate-900/80 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <form onSubmit={handlePromptSubmit} className="flex-1 min-w-[280px] flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Escribe lo que sea (ej: Instalación eléctrica, Motor turbofán, Célula, Puente, Hubble, Astronauta)..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Chatear & Crear 3D IA</span>
          </button>
        </form>

        {/* Dynamic Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-0.5">
          <button
            type="button"
            onClick={() => {
              setIsCreatingNew(true);
              setSelectedId('');
              setPromptInput('');
              setRightPanelTab('ai_chat');
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isCreatingNew
                ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/25'
            }`}
          >
            <Plus className="w-3 h-3" />
            <span>+ Nueva Creación</span>
          </button>

          {modelsList.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setIsCreatingNew(false);
                setSelectedId(item.id);
                setPromptInput(item.name);
                setRightPanelTab('inspector');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedId === item.id && !isCreatingNew
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              {item.shortName || item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Viewport & Inspector Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
        
        {/* Left: 3D WebGL Canvas */}
        <div className="lg:col-span-8 bg-black relative flex flex-col overflow-hidden select-none">
          
          {/* Top Floating Controls */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
            {isCreatingNew ? (
              <div className="bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 p-2 px-3 rounded-xl pointer-events-auto shadow-lg shadow-cyan-950/40">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Laboratorio de Síntesis 3D • En Espera</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono font-bold">NUEVO</span>
                </h4>
                <p className="text-[10px] text-slate-400">Describe tu objetivo en el Asistente lateral derecho para investigar y generar el modelo 3D.</p>
              </div>
            ) : (
              <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 p-2 px-3 rounded-xl pointer-events-auto shadow-lg">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{activeModelDoc.name}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" /> 100% REAL PBR
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[9px] font-mono font-bold flex items-center gap-1">
                    <Database className="w-2.5 h-2.5" /> FIREBASE
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400">{activeModelDoc.category}</p>
              </div>
            )}

            <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 p-1 rounded-xl flex items-center gap-1 pointer-events-auto shadow-lg">
              {/* Botón Flotante de Capas */}
              <button
                type="button"
                onClick={() => setShowLayersOverlay(!showLayersOverlay)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border cursor-pointer ${
                  showLayersOverlay
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                }`}
                title="Control de Capas 3D Visibles"
              >
                <Layers className="w-3 h-3 text-cyan-400" />
                <span>Capas ({activeModelLayers.length})</span>
              </button>

              {/* Botón Toggle de Pines Hotspot 3D */}
              <button
                type="button"
                onClick={() => setShowHotspotPins(!showHotspotPins)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border cursor-pointer ${
                  showHotspotPins
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title="Mostrar/Ocultar Pines Interactivos 3D"
              >
                <Crosshair className="w-3 h-3 text-emerald-400" />
                <span>Pines 3D ({activeModelLayers.length})</span>
              </button>

              {/* Botón para Subir Fotos y Mapear Texturas */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUserPhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-800 text-cyan-300 hover:bg-slate-700 transition-all flex items-center gap-1 border border-slate-700 cursor-pointer"
                title="Sube una fotografía para mapear texturas y normales en 3D"
              >
                <UploadCloud className="w-3 h-3" />
                <span>Mapear Foto</span>
              </button>

              <button
                onClick={() => handleSetRenderStyle('solid')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  renderMode === 'solid' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Sólido PBR
              </button>
              <button
                onClick={() => handleSetRenderStyle('xray')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  renderMode === 'xray' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Rayos X
              </button>
              <button
                onClick={() => handleSetRenderStyle('wireframe')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  renderMode === 'wireframe' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                }`}
              >
                Malla CAD
              </button>
              <button
                onClick={handleResetCamera}
                title="Restablecer Cámara"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Floating Layers Dropdown Overlay on 3D Canvas */}
          {showLayersOverlay && (
            <div className="absolute top-14 right-3 w-80 max-h-[70vh] overflow-y-auto bg-slate-950/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-3.5 z-30 shadow-2xl space-y-2 pointer-events-auto">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Control de Capas 3D • {activeModelDoc.shortName || activeModelDoc.name}</span>
                </h5>
                <button
                  onClick={() => setShowLayersOverlay(false)}
                  className="text-slate-400 hover:text-white text-xs p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1.5">
                {activeModelLayers.map((layer) => {
                  const isHidden = hiddenLayers.has(layer.id);
                  return (
                    <div
                      key={layer.id}
                      onClick={() => handleToggleLayer(layer)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isHidden
                          ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                          : 'bg-slate-900/80 border-slate-700/80 hover:border-cyan-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                        <div className="truncate">
                          <p className={`text-[11px] font-bold truncate ${isHidden ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                            {layer.name}
                          </p>
                          <p className="text-[9px] text-slate-500 truncate">{layer.category}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFocusOnLayer(layer);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors"
                          title="Enfocar en 3D"
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLayer(layer);
                          }}
                          className={`p-1 rounded-lg transition-colors ${
                            isHidden ? 'text-slate-500 hover:text-slate-300' : 'text-cyan-400 hover:text-cyan-300 bg-cyan-950/40'
                          }`}
                          title={isHidden ? 'Mostrar capa' : 'Ocultar capa'}
                        >
                          {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800/60 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowLayersOverlay(false);
                    setRightPanelTab('layers');
                  }}
                  className="text-[10px] font-bold text-cyan-400 hover:underline flex items-center justify-center gap-1 w-full"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Abrir Documentación Completa en Panel</span>
                </button>
              </div>
            </div>
          )}

          {/* Three.js Canvas Container */}
          <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing flex-1" />

          {/* 📍 Interactive 3D Hotspot Pins directly on the WebGL Canvas (Direct DOM Matrix Transform - 60 FPS) */}
          {showHotspotPins && (
            <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
              {activeModelLayers.map((layer, idx) => {
                const isSelected = activeFloatingPopover?.layer.id === layer.id;
                return (
                  <div
                    key={layer.id}
                    ref={(el) => { pinDomRefs.current[layer.id] = el; }}
                    style={{ display: 'none', position: 'absolute', top: 0, left: 0 }}
                    className="pointer-events-auto group cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      const rect = containerRef.current?.getBoundingClientRect();
                      const clickX = e.clientX && rect ? e.clientX - rect.left : 280;
                      const clickY = e.clientY && rect ? e.clientY - rect.top : 180;
                      handleFocusOnLayer(layer, { x: Math.max(clickX, 40), y: Math.max(clickY, 40) });
                    }}
                  >
                    {/* Outer pulsing ring */}
                    <div
                      className="w-6 h-6 rounded-full absolute -top-0.5 -left-0.5 animate-ping opacity-35"
                      style={{ backgroundColor: layer.color }}
                    />
                    
                    {/* Main pin badge */}
                    <div
                      className={`relative px-2.5 py-1 rounded-full backdrop-blur-md border shadow-lg flex items-center gap-1.5 transition-all transform hover:scale-110 ${
                        isSelected
                          ? 'bg-slate-900/95 border-cyan-400 ring-2 ring-cyan-400/50 scale-105 shadow-cyan-500/40'
                          : 'bg-slate-950/85 border-slate-700/80 hover:border-cyan-500/80'
                      }`}
                      style={{ boxShadow: `0 0 12px ${layer.color}35` }}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0 shadow-sm animate-pulse"
                        style={{ backgroundColor: layer.color }}
                      />
                      <span className="text-[10px] font-bold text-white whitespace-nowrap">
                        {layer.name.split(' ')[0]}
                      </span>
                      <span className="text-[9px] font-mono text-cyan-300/80 bg-cyan-950/60 px-1 rounded">
                        #{idx + 1}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 🪟 Floating Interactive 3D Holographic Card (Popover) pinned next to target */}
          {activeFloatingPopover && (
            <div
              style={{
                left: `${Math.min(Math.max(activeFloatingPopover.screenPos.x + 15, 20), (containerRef.current?.clientWidth || 800) - 340)}px`,
                top: `${Math.min(Math.max(activeFloatingPopover.screenPos.y - 120, 65), (containerRef.current?.clientHeight || 600) - 330)}px`
              }}
              className="absolute z-30 w-80 bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/60 rounded-2xl p-4 shadow-2xl space-y-3 pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 shadow-md shadow-cyan-500/50"
                    style={{ backgroundColor: activeFloatingPopover.layer.color }}
                  />
                  <div>
                    <h4 className="text-xs font-black text-white leading-tight">
                      {activeFloatingPopover.layer.name}
                    </h4>
                    <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded-full border border-cyan-800/40">
                      {activeFloatingPopover.layer.category}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveFloatingPopover(null)}
                  className="text-slate-400 hover:text-white text-xs p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Biological / Technical Role */}
              <div className="space-y-2 text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                <p className="font-semibold text-slate-200">
                  {activeFloatingPopover.layer.description}
                </p>
                <div className="pt-1.5 border-t border-slate-800/60 flex items-start gap-1.5 text-[10px] text-slate-400">
                  <Activity className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong className="text-cyan-300">Función:</strong> {activeFloatingPopover.layer.scientificRole}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <Sliders className="w-3 h-3 shrink-0" />
                  <span>{activeFloatingPopover.layer.dimensionsOrMetric}</span>
                </div>
              </div>

              {/* Interactive Actions */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleIsolateLayer(activeFloatingPopover.layer)}
                  className="px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm"
                  title="Oculta las demás capas para inspeccionar solo este orgánulo"
                >
                  <Crosshair className="w-3 h-3" />
                  <span>🎯 Aislar Capa</span>
                </button>
                <button
                  type="button"
                  onClick={handleShowAllLayers}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Restablece la visibilidad de todas las capas"
                >
                  <Eye className="w-3 h-3" />
                  <span>👁️ Ver Todo</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center gap-2 z-30">
              <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
              <span className="text-xs font-bold text-white">{loadingMessage}</span>
            </div>
          )}

          {/* Floating Controls Bottom */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
            <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 p-1 px-2.5 rounded-lg text-[10px] text-slate-400 pointer-events-auto">
              <span>🖱️ Rueda: Zoom Ultra-HD | Arrastrar / Barra Espaciadora: Panning | 2 Dedos: Táctil</span>
            </div>

            <div className="flex gap-1 pointer-events-auto">
              <button
                onClick={() => {
                  if (cameraRef.current && controlsRef.current) {
                    const target = controlsRef.current.target;
                    const offset = cameraRef.current.position.clone().sub(target);
                    const newLen = Math.max(offset.length() * 0.70, 2.43);
                    cameraRef.current.position.copy(target.clone().add(offset.normalize().multiplyScalar(newLen)));
                    controlsRef.current.update();
                  }
                }}
                className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Acercar Zoom Ultra-HD"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (cameraRef.current && controlsRef.current) {
                    const target = controlsRef.current.target;
                    const offset = cameraRef.current.position.clone().sub(target);
                    const newLen = Math.min(offset.length() * 1.40, 100.0);
                    cameraRef.current.position.copy(target.clone().add(offset.normalize().multiplyScalar(newLen)));
                    controlsRef.current.update();
                  }
                }}
                className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Alejar Zoom"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Technical Inspector & Integrated AI Co-Creation Panel (ZERO POPUPS) */}
        <div className="lg:col-span-4 bg-slate-950 border-t lg:border-t-0 lg:border-l border-slate-800/80 flex flex-col overflow-hidden">
          
          {/* Top Panel Tab Selector */}
          <div className="p-2 bg-slate-950 border-b border-slate-800 grid grid-cols-3 gap-1 shrink-0">
            {isCreatingNew ? (
              <button
                type="button"
                onClick={() => setRightPanelTab('ai_chat')}
                className={`col-span-2 py-1.5 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  rightPanelTab === 'ai_chat'
                    ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-transparent'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Asistente Creación</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/30 text-cyan-300 text-[8px] font-mono font-bold">NUEVO</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setIsCreatingNew(false); setRightPanelTab('inspector'); }}
                  className={`py-1.5 px-1.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    rightPanelTab === 'inspector' && !isCreatingNew
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-white bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <Cpu className="w-3 h-3 text-emerald-400" />
                  <span>Ficha</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setIsCreatingNew(false); setRightPanelTab('layers'); }}
                  className={`py-1.5 px-1.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    rightPanelTab === 'layers' && !isCreatingNew
                      ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-white bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <Layers className="w-3 h-3 text-cyan-400" />
                  <span>Capas ({activeModelLayers.length})</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setRightPanelTab('database')}
              className={`py-1.5 px-1.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                rightPanelTab === 'database'
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-900/60 border border-transparent'
              }`}
            >
              <Database className="w-3 h-3 text-cyan-400" />
              <span>Catálogo ({modelsList.length})</span>
            </button>
          </div>

          {/* Panel Content based on active tab */}
          {rightPanelTab === 'ai_chat' ? (
            <div className="flex-1 overflow-hidden">
              <Omni3DChatStudioPanel
                initialPrompt={promptInput}
                onConfirmReconstruction={(cfg) => {
                  handleExecuteReconstruction(cfg);
                  setRightPanelTab('inspector');
                }}
              />
            </div>
          ) : rightPanelTab === 'layers' ? (
            <div className="flex-1 p-3.5 flex flex-col gap-3 overflow-y-auto">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                  <Layers className="w-3 h-3" /> Arquitectura Anatómica & Capas 3D
                </span>
                <h3 className="text-xs font-bold text-white">{activeModelDoc.name}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Activa o desactiva capas individuales para inspeccionar estructuras internas, membranas y sub-ensamblajes.
                </p>
              </div>

              {/* Lista de Capas con Toggle */}
              <div className="space-y-2">
                {activeModelLayers.map((layer) => {
                  const isHidden = hiddenLayers.has(layer.id);
                  const isDetailSelected = selectedLayerDetail?.id === layer.id;

                  return (
                    <div
                      key={layer.id}
                      onClick={() => setSelectedLayerDetail(layer)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                        isDetailSelected
                          ? 'bg-slate-900 border-cyan-500/70 shadow-md shadow-cyan-950/40'
                          : isHidden
                          ? 'bg-slate-950/40 border-slate-800/40 opacity-60'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                          <div>
                            <h5 className={`text-xs font-bold ${isHidden ? 'text-slate-400 line-through' : 'text-white'}`}>
                              {layer.name}
                            </h5>
                            <span className="text-[9px] font-mono text-cyan-400">{layer.category}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLayer(layer);
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors ${
                            isHidden
                              ? 'bg-slate-800 text-slate-400 hover:text-slate-200'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                          }`}
                        >
                          {isHidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{isHidden ? 'Oculta' : 'Visible'}</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-300 leading-relaxed">{layer.description}</p>

                      <div className="pt-1 border-t border-slate-800/60 flex flex-col gap-1 text-[9px]">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-slate-500 font-medium">Función Científica:</span>
                          <span className="text-slate-300 font-semibold">{layer.scientificRole}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="text-slate-500 font-medium">Dimensión / Métrica:</span>
                          <span className="font-mono text-amber-300">{layer.dimensionsOrMetric}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Documentación Adicional & Leyenda de Referencia */}
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 space-y-1 text-[10px] text-slate-400">
                <div className="flex items-center gap-1 text-emerald-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Validación Científica & Estándar</span>
                </div>
                <p className="leading-relaxed">
                  Las geometrías, espesores y dispersión física PBR corresponden a las fuentes oficiales de {activeModelDoc.fidelity}.
                </p>
              </div>
            </div>
          ) : rightPanelTab === 'database' ? (
            <div className="flex-1 p-3.5 flex flex-col gap-3 overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Catálogo & Base de Datos 3D</span>
                  </h4>
                  <p className="text-[10px] text-slate-400">Colección persistida en Firebase Firestore ({modelsList.length} modelos)</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(true);
                    setSelectedId('');
                    setPromptInput('');
                    setRightPanelTab('ai_chat');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 cursor-pointer hover:brightness-110 shadow-sm"
                >
                  <Plus className="w-3 h-3" />
                  <span>Crear Nuevo</span>
                </button>
              </div>

              {/* Buscador de Modelos */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={dbSearchQuery}
                  onChange={(e) => setDbSearchQuery(e.target.value)}
                  placeholder="Buscar modelo por nombre, categoría o etiqueta..."
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Lista de Tarjetas de Modelos */}
              <div className="space-y-2">
                {modelsList
                  .filter(m => !dbSearchQuery || m.name.toLowerCase().includes(dbSearchQuery.toLowerCase()) || m.category.toLowerCase().includes(dbSearchQuery.toLowerCase()) || m.tags.some(t => t.toLowerCase().includes(dbSearchQuery.toLowerCase())))
                  .map((m) => {
                    const isSelected = selectedId === m.id && !isCreatingNew;
                    const mainPhoto = m.cameras && m.cameras[0] ? m.cameras[0].localPath : null;

                    return (
                      <div
                        key={m.id}
                        onClick={() => {
                          setIsCreatingNew(false);
                          setSelectedId(m.id);
                          setPromptInput(m.name);
                        }}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                          isSelected
                            ? 'bg-slate-900 border-cyan-500/60 shadow-md shadow-cyan-950/40'
                            : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <h5 className="text-xs font-bold text-white truncate">{m.name}</h5>
                              {m.isBuiltIn ? (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[8px] font-mono font-bold shrink-0">OFICIAL</span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[8px] font-mono font-bold shrink-0">IA 3D</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate">{m.category}</p>
                          </div>

                          {mainPhoto && (
                            <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-800 bg-black shrink-0">
                              <img src={mainPhoto} alt={m.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[9px] text-slate-400">
                          <span className="font-mono">{m.format || 'Grafo 3D Universal'}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsCreatingNew(false);
                                setSelectedId(m.id);
                                setPromptInput(m.name);
                                setRightPanelTab('inspector');
                              }}
                              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
                            >
                              Ver Ficha
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsCreatingNew(false);
                                setSelectedId(m.id);
                                setPromptInput(m.name);
                              }}
                              className={`px-2 py-0.5 rounded font-bold cursor-pointer ${
                                isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30'
                              }`}
                            >
                              {isSelected ? 'Cargado' : 'Cargar en 3D'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="flex-1 p-4 flex flex-col gap-3.5 overflow-y-auto">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Cpu className="w-3 h-3" /> Ficha Técnica & Reconstrucción 3D
                </span>
                <h3 className="text-sm font-bold text-white">{activeModelDoc.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{activeModelDoc.description}</p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="block text-[9px] uppercase font-bold text-slate-500">Formato</span>
                  <span className="font-semibold text-white text-[11px]">{activeModelDoc.format}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <span className="block text-[9px] uppercase font-bold text-slate-500">Fidelidad</span>
                  <span className="font-semibold text-white text-[11px]">{activeModelDoc.fidelity}</span>
                </div>
              </div>

              {/* SECCIÓN 1: FUENTES OFICIALES Y NORMATIVAS TÉCNICAS DINÁMICAS */}
              {activeModelDoc.officialSources && activeModelDoc.officialSources.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-bold uppercase text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Fuentes Oficiales & Normativas Técnicas ({activeModelDoc.officialSources.length})</span>
                  </h5>
                  <div className="space-y-2">
                    {activeModelDoc.officialSources.map((src, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                        <div className="flex items-start justify-between gap-1">
                          <h6 className="text-[11px] font-bold text-emerald-300">{src.name}</h6>
                          {src.standardCode && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono shrink-0">
                              {src.standardCode}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 leading-snug">{src.description}</p>
                        <div className="pt-1 text-[9px] text-slate-500 flex items-center justify-between">
                          <span>Emisor: <strong className="text-slate-300">{src.organization}</strong></span>
                          {src.url && (
                            <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-0.5">
                              <span>Ver oficial</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECCIÓN 2: FOTOGRAFÍAS OFICIALES SI EXISTEN */}
              {activeModelDoc.cameras && activeModelDoc.cameras.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-[11px] font-bold uppercase text-slate-300 flex items-center gap-1.5">
                      <Camera className="w-3 h-3 text-cyan-400" />
                      <span>Fotografías Oficiales de Origen ({activeModelDoc.cameras.length})</span>
                    </h5>
                    <span className="text-[9px] text-slate-400 font-medium">Clic para ampliar</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {activeModelDoc.cameras.map((cam) => (
                      <div
                        key={cam.id}
                        onClick={() => setSelectedImageModal(cam)}
                        className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer bg-slate-950 aspect-video flex flex-col"
                      >
                        <img
                          src={cam.localPath}
                          alt={cam.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent p-1.5 flex flex-col justify-end">
                          <p className="text-[9px] font-bold text-white truncate">{cam.name}</p>
                          <p className="text-[8px] text-cyan-300 truncate">{cam.resolution}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECCIÓN 3: HOTSPOTS DIDÁCTICOS */}
              {activeModelDoc.hotspots && activeModelDoc.hotspots.length > 0 && (
                <div>
                  <h5 className="text-[11px] font-bold uppercase text-slate-300 mb-1.5 flex items-center gap-1">
                    <Info className="w-3 h-3 text-amber-400" /> Puntos de Inspección & Ciencia
                  </h5>
                  <div className="space-y-1.5">
                    {activeModelDoc.hotspots.map((h, i) => (
                      <div key={i} className="p-2 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:border-cyan-500/40 transition-colors">
                        <h6 className="text-[11px] font-bold text-cyan-300">{h.title}</h6>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{h.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Open Link */}
              <div className="mt-auto pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Dataset: <code className="text-cyan-300">/models_3d/{activeModelDoc.slug}/</code></span>
                <a
                  href="/solar_3d_reconstruction_research.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-bold transition-colors"
                >
                  <span>Estudio 3D Global</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modal Zoom Foto de Entrada */}
      {selectedImageModal && (
        <div 
          onClick={() => setSelectedImageModal(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div onClick={(e) => e.stopPropagation()} className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col cursor-default">
            <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">{selectedImageModal.name}</h4>
                <p className="text-[10px] text-slate-400">Fuente: {selectedImageModal.source} • {selectedImageModal.resolution}</p>
              </div>
              <button 
                onClick={() => setSelectedImageModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-2 bg-black flex items-center justify-center max-h-[70vh] overflow-auto">
              <img src={selectedImageModal.localPath} alt={selectedImageModal.name} className="max-w-full max-h-[68vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
