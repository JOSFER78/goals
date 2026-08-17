/**
 * GOALS 3D Cosmos Engine - AstroCoordinates
 * Sistema de Coordenadas Astronómicas de Doble Precisión (Float64)
 * Soporta escala científica 1:1 y compresión didáctica logarítmica.
 */

export interface Vector3D64 {
  x: number;
  y: number;
  z: number;
}

export const ASTRO_CONSTANTS = {
  // Constantes del Sistema Internacional (kilómetros)
  AU_KM: 149597870.7,           // 1 Unidad Astronómica en km
  SPEED_OF_LIGHT_KMS: 299792.458,// Velocidad de la luz en km/s
  
  // Radios volumétricos reales (km)
  RADIUS_SUN_KM: 696340.0,
  RADIUS_EARTH_KM: 6371.0,
  RADIUS_MOON_KM: 1737.4,
  RADIUS_JUPITER_KM: 69911.0,
  RADIUS_MARS_KM: 3389.5,

  // Distancias medias reales (km)
  DIST_EARTH_MOON_KM: 384400.0,
  DIST_EARTH_ISS_KM: 418.0,
  DIST_EARTH_HUBBLE_KM: 535.0,
  DIST_EARTH_LANDSAT_KM: 705.0,
  DIST_EARTH_JWST_L2_KM: 1500000.0,

  // Escala base de renderizado en GPU: 1 unidad de escena = 1.000 km
  SCENE_SCALE_FACTOR: 1000.0
};

export type ScaleMode = 'scientific' | 'didactic';

export class AstroMath {
  /**
   * Crea un vector Float64 en km
   */
  static vec64(x = 0, y = 0, z = 0): Vector3D64 {
    return { x, y, z };
  }

  /**
   * Resta dos vectores Float64 para calcular posición relativa a la cámara
   * (Principio de Floating Origin / Origin Rebasing)
   */
  static subtract(a: Vector3D64, b: Vector3D64): Vector3D64 {
    return {
      x: a.x - b.x,
      y: a.y - b.y,
      z: a.z - b.z
    };
  }

  /**
   * Distancia euclidiana entre dos puntos en km (precisión float64)
   */
  static distance(a: Vector3D64, b: Vector3D64): number {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * Magnitud o longitud de un vector
   */
  static length(v: Vector3D64): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }

  /**
   * Normaliza un vector 3D
   */
  static normalize(v: Vector3D64): Vector3D64 {
    const len = AstroMath.length(v);
    if (len === 0) return { x: 0, y: 0, z: 0 };
    return { x: v.x / len, y: v.y / len, z: v.z / len };
  }

  /**
   * Convierte coordenadas de km reales a unidades de escena WebGL
   * según el modo de visualización seleccionado (Científico 1:1 vs Didáctico).
   */
  static toSceneCoords(
    realPosKm: Vector3D64,
    mode: ScaleMode = 'didactic',
    referenceRadiusKm: number = ASTRO_CONSTANTS.RADIUS_EARTH_KM
  ): Vector3D64 {
    if (mode === 'scientific') {
      // 1 unidad de Three.js = 1.000 km reales
      return {
        x: realPosKm.x / ASTRO_CONSTANTS.SCENE_SCALE_FACTOR,
        y: realPosKm.y / ASTRO_CONSTANTS.SCENE_SCALE_FACTOR,
        z: realPosKm.z / ASTRO_CONSTANTS.SCENE_SCALE_FACTOR
      };
    }

    // MODO DIDÁCTICO: Compresión logarítmica del vacío espacial
    // Preserva la dirección exacta pero comprime distancias extremas
    const distKm = AstroMath.length(realPosKm);
    if (distKm === 0) return { x: 0, y: 0, z: 0 };

    const dir = AstroMath.normalize(realPosKm);
    
    // Escala didáctica: r' = R_ref * (1 + 2.4 * ln(1 + dist / R_ref))
    const ref = referenceRadiusKm / ASTRO_CONSTANTS.SCENE_SCALE_FACTOR;
    const compressedDist = ref * (1.0 + 2.4 * Math.log(1.0 + (distKm / referenceRadiusKm)));

    return {
      x: dir.x * compressedDist,
      y: dir.y * compressedDist,
      z: dir.z * compressedDist
    };
  }

  /**
   * Formateador astronómico para telemetría en tiempo real
   */
  static formatDistance(km: number): string {
    if (km < 1.0) {
      return `${(km * 1000).toFixed(1)} m`;
    } else if (km < 1000.0) {
      return `${km.toFixed(1)} km`;
    } else if (km < 1000000.0) {
      return `${km.toLocaleString('es-ES', { maximumFractionDigits: 0 })} km`;
    } else if (km < ASTRO_CONSTANTS.AU_KM * 0.1) {
      return `${(km / 1000000.0).toFixed(2)} M km`;
    } else {
      const au = km / ASTRO_CONSTANTS.AU_KM;
      return `${au.toFixed(4)} AU (${(km / 1000000.0).toFixed(1)} M km)`;
    }
  }
}
