/**
 * Escena 03: Rotación Terrestre de 24 Horas y Ciclo Día/Noche
 * Implementa CosmosSceneModule con eje axial (23.44°), terminador solar dinámico,
 * líneas latitudinales (Ecuador, Trópicos, Círculos Polares) y punto subsolar cenital.
 */
import * as THREE from 'three';
import { CosmosSceneModule, CosmosSceneContext } from './types';
import { loadNASATexture, createAtmosphereGlow } from '../utils/nasaTextures';

let rootGroup: THREE.Group | null = null;
let earthGroup: THREE.Group | null = null;
let subsolarBeacon: THREE.Mesh | null = null;
let terminatorRing: THREE.Line | null = null;

const SUN_DIR = new THREE.Vector3(1, 0, 0).normalize();
const EARTH_RADIUS = 6.0;
const AXIS_TILT = THREE.MathUtils.degToRad(23.44);

export const scene03_DayNight: CosmosSceneModule = {
  id: 3,
  key: 'day-night',
  name: 'Rotación y Ciclo Día / Noche',
  badge: '24h • 1.670 km/h',
  tagline: 'Eje Terrestre, Terminador Solar y Husos Horarios',
  description: 'Visualiza la rotación de 24 horas de la Tierra, el eje polar inclinado a 23.44°, el terminador solar que separa el día de la noche, las líneas latitudinales y el punto subsolar cenital.',

  build: (ctx: CosmosSceneContext) => {
    const { scene, snapCamera } = ctx;
    rootGroup = new THREE.Group();

    // 1. Iluminación Solar Unidireccional
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 3.2);
    sunLight.position.set(50, 0, 0);
    rootGroup.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 0.4);
    rootGroup.add(ambientLight);

    // 2. Grupo Terrestre con Inclinación Axial Inercial (23.44°)
    earthGroup = new THREE.Group();
    earthGroup.rotation.z = AXIS_TILT;

    // Globo Terráqueo
    const earthGeo = new THREE.SphereGeometry(EARTH_RADIUS, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: loadNASATexture('earthDay'),
      roughness: 0.65,
      metalness: 0.05
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earthMesh);

    // 3. Eje Polar Físico (Polo Norte a Polo Sur)
    const axisGeo = new THREE.CylinderGeometry(0.06, 0.06, EARTH_RADIUS * 2.8, 16);
    const axisMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const axisMesh = new THREE.Mesh(axisGeo, axisMat);
    earthGroup.add(axisMesh);

    // Flecha Polo Norte
    const poleArrow = new THREE.Mesh(
      new THREE.ConeGeometry(0.25, 0.7, 16),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    poleArrow.position.set(0, EARTH_RADIUS * 1.4, 0);
    earthGroup.add(poleArrow);

    // 4. Líneas Latitudinales de Referencia Climática
    const createLatitudeCircle = (latDeg: number, color: number, opacity = 0.5) => {
      const latRad = THREE.MathUtils.degToRad(latDeg);
      const r = EARTH_RADIUS * Math.cos(latRad) * 1.008;
      const y = EARTH_RADIUS * Math.sin(latRad);
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 72; i++) {
        const th = (i / 72) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
      const line = new THREE.Line(lineGeo, lineMat);
      earthGroup?.add(line);
    };

    createLatitudeCircle(0, 0xfbbf24, 0.8);        // Ecuador (Oro)
    createLatitudeCircle(23.44, 0x06b6d4, 0.6);    // Trópico de Cáncer (+23.44°)
    createLatitudeCircle(-23.44, 0x06b6d4, 0.6);   // Trópico de Capricornio (-23.44°)
    createLatitudeCircle(66.56, 0x818cf8, 0.5);    // Círculo Polar Ártico (+66.56°)
    createLatitudeCircle(-66.56, 0x818cf8, 0.5);   // Círculo Polar Antártico (-66.56°)

    rootGroup.add(earthGroup);

    // 5. Gran Círculo del Terminador Solar (Fijo respecto a la dirección de la luz)
    const termPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 96; i++) {
      const th = (i / 96) * Math.PI * 2;
      termPts.push(new THREE.Vector3(0, Math.cos(th) * (EARTH_RADIUS * 1.02), Math.sin(th) * (EARTH_RADIUS * 1.02)));
    }
    const termGeo = new THREE.BufferGeometry().setFromPoints(termPts);
    terminatorRing = new THREE.Line(
      termGeo,
      new THREE.LineBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.75 })
    );
    rootGroup.add(terminatorRing);

    // 6. Punto Subsolar Cenital (Donde el Sol está exactamente a 90° sobre el horizonte)
    const beaconGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    subsolarBeacon = new THREE.Mesh(beaconGeo, beaconMat);
    subsolarBeacon.position.set(EARTH_RADIUS * 1.04, 0, 0);

    // Rayo solar cenital incidente
    const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 8, 8);
    beamGeo.rotateZ(Math.PI / 2);
    beamGeo.translate(4, 0, 0);
    const beamMesh = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.6 }));
    subsolarBeacon.add(beamMesh);

    rootGroup.add(subsolarBeacon);
    rootGroup.add(createAtmosphereGlow(0x38bdf8, 0.45, 1.05));

    scene.add(rootGroup);

    if (snapCamera) {
      snapCamera(16, 8, 18, 0, 0, 0);
    }
  },

  update: (delta: number) => {
    // Rotación sobre su eje polar (Periodo 24h)
    if (earthGroup) {
      earthGroup.rotation.y += delta * 0.15;
    }

    // Efecto pulsante del punto subsolar
    if (subsolarBeacon) {
      const pulse = 1.0 + Math.sin(Date.now() * 0.005) * 0.15;
      subsolarBeacon.scale.set(pulse, pulse, pulse);
    }
  },

  teardown: () => {
    if (rootGroup) {
      rootGroup.parent?.remove(rootGroup);
      rootGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else if (obj.material) obj.material.dispose();
        }
      });
      rootGroup = null;
    }
    earthGroup = null;
    subsolarBeacon = null;
    terminatorRing = null;
  }
};

export default scene03_DayNight;
