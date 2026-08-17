export interface VerifiedSourceItem {
  id: string;
  name: string;
  domain: string;
  category: 'institucional' | 'academica' | 'espacial' | 'meteorologica' | 'regulatoria';
  authorityLevel: 'Oficial / Primaria' | 'Académica' | 'Periodismo de Investigación';
  description: string;
  url: string;
  trustScore: number;
}

export const VERIFIED_SOURCES: VerifiedSourceItem[] = [
  {
    id: 'nasa-pds',
    name: 'NASA Planetary Data System (PDS)',
    domain: 'pds.nasa.gov',
    category: 'espacial',
    authorityLevel: 'Oficial / Primaria',
    description: 'Repositorio oficial de datos científicos, telemetría e imágenes calibradas de todas las misiones planetarias de la NASA.',
    url: 'https://pds.nasa.gov',
    trustScore: 99
  },
  {
    id: 'esa-science',
    name: 'European Space Agency (ESA Science)',
    domain: 'esa.int',
    category: 'espacial',
    authorityLevel: 'Oficial / Primaria',
    description: 'Archivos científicos, misiones orbitales y descubrimientos astronómicos de la Agencia Espacial Europea.',
    url: 'https://www.esa.int',
    trustScore: 99
  },
  {
    id: 'boe',
    name: 'Boletín Oficial del Estado (BOE)',
    domain: 'boe.es',
    category: 'institucional',
    authorityLevel: 'Oficial / Primaria',
    description: 'Diario oficial del Estado español para leyes, decretos, resoluciones ministeriales y convocatorias públicas.',
    url: 'https://www.boe.es',
    trustScore: 100
  },
  {
    id: 'csic',
    name: 'Consejo Superior de Investigaciones Científicas (CSIC)',
    domain: 'csic.es',
    category: 'academica',
    authorityLevel: 'Académica',
    description: 'Mayor institución pública dedicada a la investigación científica y técnica en España.',
    url: 'https://www.csic.es',
    trustScore: 98
  },
  {
    id: 'aemet',
    name: 'Agencia Estatal de Meteorología (AEMET)',
    domain: 'aemet.es',
    category: 'meteorologica',
    authorityLevel: 'Oficial / Primaria',
    description: 'Servicio meteorológico nacional de España para avisos de fenómenos adversos y registros climáticos.',
    url: 'https://www.aemet.es',
    trustScore: 98
  },
  {
    id: 'ugr-cimcyc',
    name: 'Centro de Investigación Mente, Cerebro y Comportamiento (CIMCYC / UGR)',
    domain: 'cimcyc.ugr.es',
    category: 'academica',
    authorityLevel: 'Académica',
    description: 'Instituto universitario pionero en el análisis empírico de mecanismos cognitivos de desinformación y psicología social.',
    url: 'https://cimcyc.ugr.es',
    trustScore: 97
  },
  {
    id: 'ftc-gov',
    name: 'Federal Trade Commission (FTC)',
    domain: 'ftc.gov',
    category: 'regulatoria',
    authorityLevel: 'Oficial / Primaria',
    description: 'Agencia gubernamental de EE.UU. para la protección del consumidor y resoluciones sobre privacidad y datos digitales.',
    url: 'https://www.ftc.gov',
    trustScore: 99
  },
  {
    id: 'science-journal',
    name: 'Science Magazine (AAAS)',
    domain: 'science.org',
    category: 'academica',
    authorityLevel: 'Académica',
    description: 'Revista científica con revisión por pares de referencia mundial sobre propagación de información y descubrimientos.',
    url: 'https://www.science.org',
    trustScore: 98
  }
];
