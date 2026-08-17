/**
 * Escena 05: Estaciones del Año y Oblicuidad Axial (23.44°)
 * Implementa CosmosSceneModule mostrando la orientación fija inercial del eje terrestre,
 * las 4 posiciones orbitales (Solsticios y Equinoccios) y el flujo solar incidente (W/m²).
 */
import * as THREE from 'three';
import { CosmosSceneModule, CosmosSceneContext } from './types';
import { loadNASATexture } from '../utils/nasaTextures';

let rootGroup: THREE.Group | null = null;
let activeEarthGroup: THREE.Group | null = null;
let activeEarthMesh: THREE.Mesh | null = null;
let orbitAngle = 0;
let fluxRays: THREE.LineSegments | null = null;

const ORBIT_RADIUS = 24.0;
const AXIAL_TILT = THREE.MathUtils.degToRad(23.44);
// Vector inercial fijo hacia Polaris
const INERTIAL_AXIS = new THREE.Vector3(Math.sin(AXIAL_TILT), Math.cos(AXIAL_TILT), 0).normalize();

export const scene05_Seasons: CosmosSceneModule = {
  id: 5,
  key: 'seasons',
  name: 'Estaciones del Año',
  badge: '23.44° Oblicuidad',
  tagline: 'Inclinación Axial Inercial e Insolación Solar',
  description: 'Demuestra el origen de las estaciones: el eje de la Tierra mantiene una orientación fija (23.44°) en el espacio inercial, variando el ángulo cenital de la luz solar (W/m²) en solsticios y equinoccios.',

  build: (ctx: CosmosSceneContext) => {
    const { scene, snapCamera } = ctx;
    rootGroup = new THREE.Group();
    orbitAngle = 0;

    // 1. Sol Central
    const sunLight = new THREE.PointLight(0xfff8e7, 3.5, 150, 0.3);
    rootGroup.add(sunLight);

    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(3.6, 32, 32),
      new THREE.MeshBasicMaterial({ map: loadNASATexture('sun'), color: 0xffb703 })
    );
    rootGroup.add(sunMesh);

    // 2. Anillo de la Órbita Eclíptica
    const orbitPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 100; i++) {
      const th = (i / 100) * Math.PI * 2;
      orbitPts.push(new THREE.Vector3(Math.cos(th) * ORBIT_RADIUS, 0, Math.sin(th) * ORBIT_RADIUS));
    }
    const orbitLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(orbitPts),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 })
    );
    rootGroup.add(orbitLine);

    // 3. Helper para crear un globo terrestre con eje fijo inercial
    const createEarthStation = (x: number, z: number, labelColor: number, opacity = 0.5) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      // Inclinación axial fija (apuntando en la misma dirección X fija)
      group.rotation.z = -AXIAL_TILT;

      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 24, 24),
        new THREE.MeshStandardMaterial({
          map: loadNASATexture('earthDay'),
          roughness: 0.7,
          transparent: opacity < 1,
          opacity
        })
      );
      group.add(globe);

      // Eje de rotación polar físico
      const axis = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 4.4, 12),
        new THREE.MeshBasicMaterial({ color: labelColor, transparent: opacity < 1, opacity })
      );
      group.add(axis);

      // Anillo ecuatorial
      const eqPts: THREE.Vector3[] = [];
      for (let i = 0; i <= 48; i++) {
        const th = (i / 48) * Math.PI * 2;
        eqPts.push(new THREE.Vector3(Math.cos(th) * 1.55, 0, Math.sin(th) * 1.55));
      }
      const eq = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(eqPts),
        new THREE.LineBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: opacity * 0.8 })
      );
      group.add(eq);

      rootGroup?.add(group);
      return group;
    };

    // 4. Las 4 Estaciones Clave Fijas en la Órbita
    // A. Solsticio de Junio (+X) -> Verano Norte (máx insolación HN)
    createEarthStation(ORBIT_RADIUS, 0, 0xef4444, 0.65);
    // B. Equinoccio de Septiembre (+Z) -> Otoño Norte / Primavera Sur
    createEarthStation(0, ORBIT_RADIUS, 0xf59e0b, 0.65);
    // C. Solsticio de Diciembre (-X) -> Invierno Norte (mín insolación HN)
    createEarthStation(-ORBIT_RADIUS, 0, 0x3b82f6, 0.65);
    // D. Equinoccio de Marzo (-Z) -> Primavera Norte / Otoño Sur
    createEarthStation(0, -ORBIT_RADIUS, 0x10b981, 0.65);

    // 5. Tierra Dinámica Activa que orbita en tiempo real
    activeEarthGroup = new THREE.Group();
    activeEarthGroup.rotation.z = -AXIAL_TILT;

    activeEarthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.7, 32, 32),
      new THREE.MeshStandardMaterial({ map: loadNASATexture('earthDay'), roughness: 0.6 })
    );
    activeEarthGroup.add(activeEarthMesh);

    const activeAxis = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 5.0, 16),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    activeEarthGroup.add(activeAxis);
    rootGroup.add(activeEarthGroup);

    // 6. Rayos de Flujo Solar (W/m²)
    const rayGeo = new THREE.BufferGeometry();
    const rayPos = new Float32Array(3 * 6);
    rayGeo.setAttribute('position', new THREE.BufferAttribute(rayPos, 3));
    fluxRays = new THREE.LineSegments(
      rayGeo,
      new THREE.LineBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.7 })
    );
    rootGroup.add(fluxRays);

    scene.add(rootGroup);

    if (snapCamera) {
      snapCamera(0, 45, 35, 0, 0, 0);
    }
  },

  update: (delta: number) => {
    if (!activeEarthGroup || !activeEarthMesh || !fluxRays) return;

    orbitAngle += delta * 0.12;
    const x = Math.cos(orbitAngle) * ORBIT_RADIUS;
    const z = Math.sin(orbitAngle) * ORBIT_RADIUS;

    activeEarthGroup.position.set(x, 0, z);
    activeEarthMesh.rotation.y += delta * 0.4;

    // Actualizar 3 rayos solares incidentes (Trópico Norte, Ecuador, Trópico Sur)
    const pos = (fluxRays.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    // Rayo central
    pos[0] = 0; pos[1] = 0; pos[2] = 0;
    pos[3] = x; pos[4] = 0; pos[5] = z;
    // Rayo norte
    pos[6] = 0; pos[7] = 1.0; pos[8] = 0;
    pos[9] = x; pos[10] = 0.8; pos[11] = z;
    // Rayo sur
    pos[12] = 0; pos[13] = -1.0; pos[14] = 0;
    pos[15] = x; pos[16] = -0.8; pos[17] = z;
    fluxRays.geometry.attributes.position.needsUpdate = true;
  },

  teardown: () => {
    if (rootGroup) {
      rootGroup.parent?.remove(rootGroup);
      rootGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.LineSegments) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else if (obj.material) obj.material.dispose();
        }
      });
      rootGroup = null;
    }
    activeEarthGroup = null;
    activeEarthMesh = null;
    fluxRays = null;
  }
};

export default scene05_Seasons;
