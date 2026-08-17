/**
 * GOALS 3D Cosmos - realImagesCatalog
 * Archivo de Fotografías REALES Oficiales de la NASA, ESA y Telescopios Espaciales
 * (Cero imágenes ficticias ni placeholders)
 */

export interface RealPhoto {
  url: string;
  credit: string;
  caption: string;
  missionOrDate: string;
}

export const REAL_PHOTOS: Record<string, RealPhoto> = {
  earthrise_apollo8: {
    url: 'https://images-assets.nasa.gov/image/as08-16-2593/as08-16-2593~orig.jpg',
    credit: 'NASA / William Anders (Apolo 8)',
    caption: 'Fotografía original "Earthrise" (Salida de la Tierra) tomada en órbita lunar el 24 de diciembre de 1968.',
    missionOrDate: 'Apolo 8 • Diciembre 1968'
  },
  apollo11_moon: {
    url: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~orig.jpg',
    credit: 'NASA / Neil Armstrong',
    caption: 'Buzz Aldrin sobre el regolito lunar en el Mar de la Tranquilidad con el módulo Eagle reflejado en el visor.',
    missionOrDate: 'Apolo 11 • Julio 1969'
  },
  artemis_rocket: {
    url: 'https://images-assets.nasa.gov/image/KSC-20220829-PH-KLS01_0001/KSC-20220829-PH-KLS01_0001~orig.jpg',
    credit: 'NASA / Kim Shiflett',
    caption: 'El megacohete SLS y la nave espacial Orión del programa Artemis en la plataforma 39B de Cabo Cañaveral.',
    missionOrDate: 'Programa Artemis • 2026'
  },
  iss_orbit: {
    url: 'https://images-assets.nasa.gov/image/iss064e007861/iss064e007861~orig.jpg',
    credit: 'NASA / Roscosmos / ESA',
    caption: 'La Estación Espacial Internacional (ISS) orbitando a 418 km sobre el Océano Pacífico con sus paneles solares dorados.',
    missionOrDate: 'Expedición 64 • Órbita LEO'
  },
  hubble_space: {
    url: 'https://images-assets.nasa.gov/image/s125e012001/s125e012001~orig.jpg',
    credit: 'NASA / STS-125 Shuttle Atlantis',
    caption: 'El Telescopio Espacial Hubble liberado en órbita tras su última misión de servicio y actualización óptica.',
    missionOrDate: 'Misión SM4 • 535 km de altitud'
  },
  jwst_deepfield: {
    url: 'https://images-assets.nasa.gov/image/PIA25325/PIA25325~orig.jpg',
    credit: 'NASA / ESA / CSA / STScI',
    caption: 'Primer campo profundo en luz infrarroja del Telescopio Espacial James Webb (Cúmulo SMACS 0723), revelando galaxias de hace 13.000 millones de años.',
    missionOrDate: 'JWST NIRCam • Punto Lagrange L2'
  },
  landsat_earth: {
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000450/GSFC_20171208_Archive_e000450~orig.jpg',
    credit: 'NASA Earth Observatory / USGS',
    caption: 'Imagen multiespectral real de la cordillera del Himalaya y deltas fluviales capturada por la flota satelital Landsat.',
    missionOrDate: 'Landsat • 705 km de altitud'
  },
  mars_perseverance: {
    url: 'https://images-assets.nasa.gov/image/PIA24422/PIA24422~orig.jpg',
    credit: 'NASA / JPL-Caltech',
    caption: 'El rover Perseverance sobre la superficie rojiza y rocosa del cráter Jezero en Marte buscando biofirmas antiguas.',
    missionOrDate: 'Misión Mars 2020 • Superficie Marciana'
  },
  saturn_cassini: {
    url: 'https://images-assets.nasa.gov/image/PIA08329/PIA08329~orig.jpg',
    credit: 'NASA / JPL / Space Science Institute',
    caption: 'Fotografía real de Saturno y sus anillos iluminados por el Sol a contraluz tomada por la sonda espacial Cassini.',
    missionOrDate: 'Misión Cassini-Huygens'
  },
  sun_solar_dynamics: {
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg',
    credit: 'NASA / SDO (Solar Dynamics Observatory)',
    caption: 'Erupción solar y bucles magnéticos de plasma coronal capturados en luz ultravioleta extrema a 304 Å.',
    missionOrDate: 'Observatorio Solar SDO'
  }
};
