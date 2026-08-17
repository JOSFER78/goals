/**
 * Escena 04: Traslación Anual Kepleriana (Leyes de Kepler)
 * Implementa CosmosSceneModule con el Sol en el foco, elipse con Perihelio y Afelio,
 * radiovector dinámico y vector de velocidad orbital variable (2ª Ley de Kepler).
 */
import * as THREE from 'three';
import { CosmosSceneModule, CosmosSceneContext } from './types';
import { loadNASATexture, createAtmosphereGlow } from '../utils/nasaTextures';

let rootGroup: THREE.Group | null = null;
let earthMesh: THREE.Mesh | null = null;
let velocityArrow: THREE.ArrowHelper | null = null;
let radiusVectorLine: THREE.Line | null = null;
let sweptTriangle: THREE.Mesh | null = null;

// Parámetros orbitales Keplerianos (Excentricidad didáctica e=0.22 para visualización clara)
const A = 25.0; // Semieje mayor
const E = 0.22; // Excentricidad didáctica
const B = A * Math.sqrt(1 - E * E); // Semieje menor (~24.38)
const C = A * E; // Distancia focal (~5.5)
const SUN_POS = new THREE.Vector3(C, 0, 0); // Sol en el Foco 1

let trueAnomaly = 0; // Ángulo orbital

export const scene04_Orbit: CosmosSceneModule = {
  id: 4,
  key: 'orbit',
  name: 'Traslación Anual Kepleriana',
  badge: '365.25d • 29.78 km/s',
  tagline: 'Leyes de Kepler, Perihelio y Afelio',
  description: 'La órbita elíptica de la Tierra alrededor del Sol con el Sol en uno de los focos, destacando el Perihelio (147M km, 30.29 km/s), el Afelio (152M km, 29.29 km/s) y la velocidad orbital variable (2ª Ley de Kepler).',

  build: (ctx: CosmosSceneContext) => {
    const { scene, snapCamera } = ctx;
    rootGroup = new THREE.Group();
    trueAnomaly = 0;

    // 1. Sol en el Foco 1 de la Elipse
    const sunLight = new THREE.PointLight(0xfff5ea, 3.5, 200, 0.2);
    sunLight.position.copy(SUN_POS);
    rootGroup.add(sunLight);

    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(3.5, 32, 32),
      new THREE.MeshBasicMaterial({ map: loadNASATexture('sun'), color: 0xffaa00 })
    );
    sunMesh.position.copy(SUN_POS);
    rootGroup.add(sunMesh);

    // Segundo foco vacío F2
    const f2Marker = new THREE.Mesh(
      new THREE.RingGeometry(0.3, 0.45, 16),
      new THREE.MeshBasicMaterial({ color: 0x64748b, side: THREE.DoubleSide })
    );
    f2Marker.rotation.x = Math.PI / 2;
    f2Marker.position.set(-C, 0, 0);
    rootGroup.add(f2Marker);

    // 2. Curva Elíptica de la Órbita
    const orbitPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const th = (i / 128) * Math.PI * 2;
      orbitPts.push(new THREE.Vector3(Math.cos(th) * A, 0, Math.sin(th) * B));
    }
    const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
    const orbitLine = new THREE.Line(orbitGeo, new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 }));
    rootGroup.add(orbitLine);

    // 3. Marcadores de Perihelio y Afelio
    const createApsisMarker = (pos: THREE.Vector3, color: number, labelColor: number) => {
      const marker = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), new THREE.MeshBasicMaterial({ color }));
      marker.position.copy(pos);
      rootGroup?.add(marker);

      const ring = new THREE.Mesh(new THREE.RingGeometry(0.7, 0.9, 24), new THREE.MeshBasicMaterial({ color: labelColor, side: THREE.DoubleSide }));
      ring.rotation.x = Math.PI / 2;
      ring.position.copy(pos);
      rootGroup?.add(ring);
    };

    // Perihelio (+A, 0, 0) -> Más cercano al Sol (cerca de Foco 1 en C)
    createApsisMarker(new THREE.Vector3(A, 0, 0), 0xef4444, 0xf87171);
    // Afelio (-A, 0, 0) -> Más lejano del Sol
    createApsisMarker(new THREE.Vector3(-A, 0, 0), 0x3b82f6, 0x60a5fa);

    // 4. Planeta Tierra
    const earthGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({
      map: loadNASATexture('earthDay'),
      roughness: 0.6
    });
    earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.rotation.z = THREE.MathUtils.degToRad(23.44);
    rootGroup.add(earthMesh);
    rootGroup.add(createAtmosphereGlow(0x38bdf8, 0.4, 1.06));

    // 5. Radiovector (Línea Sol -> Tierra)
    const radiusGeo = new THREE.BufferGeometry().setFromPoints([SUN_POS, new THREE.Vector3(A, 0, 0)]);
    radiusVectorLine = new THREE.Line(radiusGeo, new THREE.LineBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.7 }));
    rootGroup.add(radiusVectorLine);

    // 6. Vector de Velocidad Orbital Tangencial
    velocityArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(A, 0, 0), 4.5, 0x10b981, 0.8, 0.4);
    rootGroup.add(velocityArrow);

    // 7. Área barrida por unidad de tiempo (2ª Ley de Kepler)
    const triGeo = new THREE.BufferGeometry();
    const triPositions = new Float32Array(9);
    triGeo.setAttribute('position', new THREE.BufferAttribute(triPositions, 3));
    sweptTriangle = new THREE.Mesh(triGeo, new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25, side: THREE.DoubleSide }));
    rootGroup.add(sweptTriangle);

    scene.add(rootGroup);

    if (snapCamera) {
      snapCamera(0, 42, 32, 0, 0, 0);
    }
  },

  update: (delta: number) => {
    if (!earthMesh || !velocityArrow || !radiusVectorLine || !sweptTriangle) return;

    // Distancia actual al Sol r
    const prevX = Math.cos(trueAnomaly) * A;
    const prevZ = Math.sin(trueAnomaly) * B;
    const currentR = Math.hypot(prevX - SUN_POS.x, prevZ - SUN_POS.z);

    // 2ª Ley de Kepler: Velocidad angular inversamente proporcional al cuadrado de la distancia (dθ/dt = h / r²)
    const angSpeed = (22.0 / (currentR * currentR)) * 1.8;
    trueAnomaly += delta * angSpeed;

    const x = Math.cos(trueAnomaly) * A;
    const z = Math.sin(trueAnomaly) * B;
    earthMesh.position.set(x, 0, z);
    earthMesh.rotation.y += delta * 0.4;

    // Actualizar Radiovector Sol -> Tierra
    const radPositions = (radiusVectorLine.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    radPositions[0] = SUN_POS.x; radPositions[1] = SUN_POS.y; radPositions[2] = SUN_POS.z;
    radPositions[3] = x; radPositions[4] = 0; radPositions[5] = z;
    radiusVectorLine.geometry.attributes.position.needsUpdate = true;

    // Vector velocidad tangencial (derivada de la elipse [-A*sin(th), 0, B*cos(th)])
    const tangent = new THREE.Vector3(-A * Math.sin(trueAnomaly), 0, B * Math.cos(trueAnomaly)).normalize();
    const speedMagnitude = 2.0 + (32.0 / currentR) * 0.35; // Crece en perihelio y decrece en afelio

    velocityArrow.position.set(x, 0, z);
    velocityArrow.setDirection(tangent);
    velocityArrow.setLength(speedMagnitude, 0.8, 0.4);

    // Triángulo del sector barrido
    const triPos = (sweptTriangle.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    triPos[0] = SUN_POS.x; triPos[1] = 0; triPos[2] = SUN_POS.z;
    triPos[3] = prevX; triPos[4] = 0; triPos[5] = prevZ;
    triPos[6] = x; triPos[7] = 0; triPos[8] = z;
    sweptTriangle.geometry.attributes.position.needsUpdate = true;
  },

  teardown: () => {
    if (rootGroup) {
      rootGroup.parent?.remove(rootGroup);
      rootGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.ArrowHelper) {
          if ('geometry' in obj && obj.geometry) obj.geometry.dispose();
          if ('material' in obj && obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        }
      });
      rootGroup = null;
    }
    earthMesh = null;
    velocityArrow = null;
    radiusVectorLine = null;
    sweptTriangle = null;
  }
};

export default scene04_Orbit;
