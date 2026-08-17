/**
 * GOALS 3D Cosmos Engine - KeplerOrbit
 * Propagador Orbital Kepleriano y Resolución de la Ecuación de Kepler
 * Basado en Efemérides J2000 de NASA / JPL
 */

import * as THREE from 'three';
import { ASTRO_CONSTANTS, AstroMath, ScaleMode, Vector3D64 } from '../math/AstroCoordinates';

export interface KeplerElements {
  name: string;
  semiMajorAxisKm: number; // a (km)
  eccentricity: number;     // e
  inclinationDeg: number;   // i (grados)
  longitudeOfAscendingNodeDeg: number; // Ω (grados)
  longitudeOfPeriapsisDeg: number;     // ϖ (grados)
  meanLongitudeJ2000Deg: number;       // L0 (grados en J2000.0)
  orbitalPeriodDays: number;
  rates?: {
    aRate?: number;
    eRate?: number;
    iRate?: number;
  };
}

export class KeplerOrbit {
  public elements: KeplerElements;

  constructor(elements: KeplerElements) {
    this.elements = elements;
  }

  /**
   * Convierte fecha del calendario a Fecha Juliana (Julian Date)
   */
  public static dateToJulianDate(date: Date): number {
    const time = date.getTime();
    return (time / 86400000.0) + 2440587.5;
  }

  /**
   * Resuelve la Ecuación de Kepler: M = E - e * sin(E)
   * Utiliza el método de iteración Newton-Raphson de convergencia rápida.
   */
  public static solveKepler(M: number, e: number, tolerance = 1e-8): number {
    // Normalizar M al rango [0, 2π]
    let mNorm = M % (Math.PI * 2);
    if (mNorm < 0) mNorm += Math.PI * 2;

    // Estimación inicial (Aproximación de Danby)
    let E = e > 0.8 ? Math.PI : mNorm;
    
    for (let iter = 0; iter < 25; iter++) {
      const f = E - e * Math.sin(E) - mNorm;
      const fPrime = 1.0 - e * Math.cos(E);
      const delta = f / fPrime;
      E -= delta;
      if (Math.abs(delta) < tolerance) break;
    }

    return E;
  }

  /**
   * Calcula la posición y velocidad en coordenadas 3D en km para una fecha dada
   */
  public getStateAtDate(date: Date): { position: Vector3D64; velocity: Vector3D64; trueAnomalyDeg: number; radiusKm: number } {
    const jd = KeplerOrbit.dateToJulianDate(date);
    const j2000 = 2451545.0;
    const d = jd - j2000; // Días transcurridos desde J2000.0

    const { semiMajorAxisKm, eccentricity: e, inclinationDeg, longitudeOfAscendingNodeDeg, longitudeOfPeriapsisDeg, meanLongitudeJ2000Deg, orbitalPeriodDays } = this.elements;

    // 1. Movimiento medio diario n (radianes / día)
    const n = (Math.PI * 2) / orbitalPeriodDays;

    // 2. Longitud Media L y Anomalía Media M
    const L = THREE.MathUtils.degToRad(meanLongitudeJ2000Deg) + n * d;
    const periapsisRad = THREE.MathUtils.degToRad(longitudeOfPeriapsisDeg);
    const M = L - periapsisRad;

    // 3. Resolver Ecuación de Kepler para obtener la Anomalía Excéntrica E
    const E = KeplerOrbit.solveKepler(M, e);

    // 4. Anomalía Verdadera ν (Nu) y Radio Vector r
    const sinNu = (Math.sqrt(1 - e * e) * Math.sin(E)) / (1 - e * Math.cos(E));
    const cosNu = (Math.cos(E) - e) / (1 - e * Math.cos(E));
    const nu = Math.atan2(sinNu, cosNu);
    const rKm = semiMajorAxisKm * (1 - e * Math.cos(E));

    // 5. Coordenadas en el plano orbital
    const xOrb = rKm * Math.cos(nu);
    const yOrb = rKm * Math.sin(nu);

    // 6. Transformación Euleriana al plano de referencia (Inclinación, Nodo, Periapsis)
    const omega = periapsisRad - THREE.MathUtils.degToRad(longitudeOfAscendingNodeDeg); // Argumento del periastron ω
    const node = THREE.MathUtils.degToRad(longitudeOfAscendingNodeDeg);
    const inc = THREE.MathUtils.degToRad(inclinationDeg);

    const cosNode = Math.cos(node);
    const sinNode = Math.sin(node);
    const cosInc = Math.cos(inc);
    const sinInc = Math.sin(inc);
    const cosOmegaNu = Math.cos(omega + nu);
    const sinOmegaNu = Math.sin(omega + nu);

    const x = rKm * (cosNode * cosOmegaNu - sinNode * sinOmegaNu * cosInc);
    const y = rKm * (sinOmegaNu * sinInc);
    const z = rKm * (sinNode * cosOmegaNu + cosNode * sinOmegaNu * cosInc);

    // Velocidad orbital escalar instantánea (Ecuación vis-viva)
    const mu = 398600.4418; // Constante gravitacional terrestre km³/s²
    const vMag = Math.sqrt(Math.max(0, mu * (2.0 / rKm - 1.0 / semiMajorAxisKm)));

    return {
      position: { x, y, z },
      velocity: { x: 0, y: vMag, z: 0 },
      trueAnomalyDeg: THREE.MathUtils.radToDeg(nu),
      radiusKm: rKm
    };
  }

  /**
   * Genera la geometría elíptica kepleriana para el trazado de la trayectoria orbital
   */
  public generateOrbitGeometry(segments = 180, scaleMode: ScaleMode = 'didactic'): THREE.BufferGeometry {
    const points: THREE.Vector3[] = [];
    const { semiMajorAxisKm, eccentricity: e, inclinationDeg, longitudeOfAscendingNodeDeg, longitudeOfPeriapsisDeg } = this.elements;

    const periapsisRad = THREE.MathUtils.degToRad(longitudeOfPeriapsisDeg);
    const node = THREE.MathUtils.degToRad(longitudeOfAscendingNodeDeg);
    const omega = periapsisRad - node;
    const inc = THREE.MathUtils.degToRad(inclinationDeg);

    const cosNode = Math.cos(node);
    const sinNode = Math.sin(node);
    const cosInc = Math.cos(inc);
    const sinInc = Math.sin(inc);

    for (let i = 0; i <= segments; i++) {
      const nu = (i / segments) * Math.PI * 2;
      const rKm = (semiMajorAxisKm * (1 - e * e)) / (1 + e * Math.cos(nu));

      const cosOmegaNu = Math.cos(omega + nu);
      const sinOmegaNu = Math.sin(omega + nu);

      const rawX = rKm * (cosNode * cosOmegaNu - sinNode * sinOmegaNu * cosInc);
      const rawY = rKm * (sinOmegaNu * sinInc);
      const rawZ = rKm * (sinNode * cosOmegaNu + cosNode * sinOmegaNu * cosInc);

      const scenePos = AstroMath.toSceneCoords({ x: rawX, y: rawY, z: rawZ }, scaleMode);
      points.push(new THREE.Vector3(scenePos.x, scenePos.y, scenePos.z));
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }
}

/**
 * BASE DE DATOS DE ELEMENTOS KEPLERIANOS NASA / JPL
 */
export const KEPLER_CATALOG: Record<string, KeplerElements> = {
  earth: {
    name: 'Tierra',
    semiMajorAxisKm: ASTRO_CONSTANTS.AU_KM,
    eccentricity: 0.0167086,
    inclinationDeg: 0.00005,
    longitudeOfAscendingNodeDeg: -11.26064,
    longitudeOfPeriapsisDeg: 102.94719,
    meanLongitudeJ2000Deg: 100.46457,
    orbitalPeriodDays: 365.256363
  },
  moon: {
    name: 'Luna',
    semiMajorAxisKm: 384400.0,
    eccentricity: 0.05490,
    inclinationDeg: 5.145,
    longitudeOfAscendingNodeDeg: 125.08,
    longitudeOfPeriapsisDeg: 83.353,
    meanLongitudeJ2000Deg: 218.316,
    orbitalPeriodDays: 27.321661
  },
  iss: {
    name: 'Estación Espacial Internacional (ISS)',
    semiMajorAxisKm: ASTRO_CONSTANTS.RADIUS_EARTH_KM + 418.0,
    eccentricity: 0.0006,
    inclinationDeg: 51.64,
    longitudeOfAscendingNodeDeg: 240.12,
    longitudeOfPeriapsisDeg: 130.45,
    meanLongitudeJ2000Deg: 45.2,
    orbitalPeriodDays: 92.9 / 1440.0 // 92.9 minutos a días
  },
  hubble: {
    name: 'Telescopio Espacial Hubble',
    semiMajorAxisKm: ASTRO_CONSTANTS.RADIUS_EARTH_KM + 535.0,
    eccentricity: 0.0003,
    inclinationDeg: 28.47,
    longitudeOfAscendingNodeDeg: 180.5,
    longitudeOfPeriapsisDeg: 95.0,
    meanLongitudeJ2000Deg: 120.0,
    orbitalPeriodDays: 95.4 / 1440.0
  },
  landsat: {
    name: 'Landsat 9',
    semiMajorAxisKm: ASTRO_CONSTANTS.RADIUS_EARTH_KM + 705.0,
    eccentricity: 0.0001,
    inclinationDeg: 98.20,
    longitudeOfAscendingNodeDeg: 310.4,
    longitudeOfPeriapsisDeg: 45.0,
    meanLongitudeJ2000Deg: 80.0,
    orbitalPeriodDays: 98.8 / 1440.0
  },
  jwst: {
    name: 'James Webb (Punto L2)',
    semiMajorAxisKm: ASTRO_CONSTANTS.RADIUS_EARTH_KM + 1500000.0,
    eccentricity: 0.005,
    inclinationDeg: 15.0,
    longitudeOfAscendingNodeDeg: 100.0,
    longitudeOfPeriapsisDeg: 200.0,
    meanLongitudeJ2000Deg: 10.0,
    orbitalPeriodDays: 180.0
  }
};
