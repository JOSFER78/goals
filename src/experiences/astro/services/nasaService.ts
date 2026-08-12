/**
 * Servicio 100% Real de Datos Científicos de la NASA (Sin Mocks ni Simulaciones)
 * Conecta con las APIs públicas en vivo de NASA.gov:
 * 1. APOD (Astronomy Picture of the Day)
 * 2. NeoWS (Near Earth Object Web Service - Asteroides en tiempo real)
 * 3. DONKI (Space Weather Notification System - Clima espacial y fulguraciones solares)
 */

export interface NASAApodData {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  date: string;
  copyright?: string;
  media_type: string;
}

export interface NASANeoAsteroid {
  id: string;
  name: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    meters: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    }
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: {
    close_approach_date_full: string;
    relative_velocity: {
      kilometers_per_hour: string;
    };
    miss_distance: {
      kilometers: string;
    };
    orbiting_body: string;
  }[];
}

export interface NASADonkiFlare {
  flrID: string;
  beginTime: string;
  peakTime: string;
  classType: string;
  sourceLocation: string;
  activeRegionNum: number;
}

/**
 * Obtiene la Imagen Astronomica del Dia en vivo desde NASA APOD API
 */
export async function fetchNASAApod(): Promise<NASAApodData | null> {
  try {
    const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
    if (!res.ok) throw new Error(`NASA APOD Error: ${res.status}`);
    const data = await res.json();
    return data as NASAApodData;
  } catch (err) {
    console.warn("Info API NASA APOD:", err);
    return null;
  }
}

/**
 * Obtiene la lista de asteroides y objetos cercanos a la Tierra rastreados hoy en vivo por el JPL/NASA
 */
export async function fetchNASANearEarthAsteroids(): Promise<NASANeoAsteroid[]> {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${todayStr}&end_date=${todayStr}&api_key=DEMO_KEY`);
    if (!res.ok) throw new Error(`NASA NeoWS Error: ${res.status}`);
    const data = await res.json();
    const nearEarthObjects = data.near_earth_objects;
    if (nearEarthObjects && nearEarthObjects[todayStr]) {
      return nearEarthObjects[todayStr] as NASANeoAsteroid[];
    }
    // Fallback search first available day
    const days = Object.keys(nearEarthObjects || {});
    if (days.length > 0) {
      return nearEarthObjects[days[0]] as NASANeoAsteroid[];
    }
    return [];
  } catch (err) {
    console.warn("Info API NASA NeoWS:", err);
    return [];
  }
}

/**
 * Obtiene las fulguraciones solares recientes registradas por el laboratorio DONKI de la NASA
 */
export async function fetchNASASolarFlares(): Promise<NASADonkiFlare[]> {
  try {
    const res = await fetch('https://api.nasa.gov/DONKI/FLR?api_key=DEMO_KEY');
    if (!res.ok) throw new Error(`NASA DONKI Error: ${res.status}`);
    const data = await res.json();
    return (Array.isArray(data) ? data.slice(0, 5) : []) as NASADonkiFlare[];
  } catch (err) {
    console.warn("Info API NASA DONKI:", err);
    return [];
  }
}
