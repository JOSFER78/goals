/**
 * Escena 06: El Sistema Solar Completo (8 Planetas y Cinturón de Asteroides)
 * Implementa CosmosSceneModule con el Sol central, los 8 planetas (Mercurio a Neptuno),
 * órbitas coplanarias proporcionales, anillos de Saturno y velocidades Keplerianas.
 */
import * as THREE from 'three';
import { CosmosSceneModule, CosmosSceneContext } from './types';
import { loadNASATexture } from '../utils/nasaTextures';

let rootGroup: THREE.Group | null = null;
let planets: Array<{
  mesh: THREE.Mesh;
  pivot: THREE.Group;
  dist: number;
  speed: number;
  rotSpeed: number;
  angle: number;
}> = [];
let asteroidBelt: THREE.Points | null = null;

const PLANET_CONFIGS = [
  { name: 'mercury', radius: 0.45, dist: 7.5, speed: 1.4, tex: 'mercury', color: 0x94a3b8 },
  { name: 'venus', radius: 0.85, dist: 11.5, speed: 1.05, tex: 'venus', color: 0xf59e0b },
  { name: 'earth', radius: 0.95, dist: 16.0, speed: 0.85, tex: 'earthDay', color: 0x38bdf8 },
  { name: 'mars', radius: 0.55, dist: 21.0, speed: 0.7, tex: 'mars', color: 0xef4444 },
  { name: 'jupiter', radius: 2.5, dist: 30.0, speed: 0.4, tex: 'jupiter', color: 0xd97706 },
  { name: 'saturn', radius: 2.1, dist: 40.0, speed: 0.3, tex: 'saturn', color: 0xfbbf24, hasRings: true },
  { name: 'uranus', radius: 1.4, dist: 50.0, speed: 0.22, tex: 'uranus', color: 0x06b6d4 },
  { name: 'neptune', radius: 1.35, dist: 60.0, speed: 0.16, tex: 'neptune', color: 0x3b82f6 }
];

export const scene06_SolarSystem: CosmosSceneModule = {
  id: 6,
  key: 'solar-system',
  name: 'El Sistema Solar',
  badge: '8 Planetas',
  tagline: 'El Sol y los 8 Planetas del Sistema Solar',
  description: 'Visión completa y didáctica del Sistema Solar con el Sol central, los 8 planetas (Mercurio a Neptuno), órbitas coplanarias, velocidades keplerianas y el cinturón de asteroides.',

  build: (ctx: CosmosSceneContext) => {
    const { scene, snapCamera } = ctx;
    rootGroup = new THREE.Group();
    planets = [];

    // 1. Sol Central con Luz Omnidireccional
    const sunLight = new THREE.PointLight(0xfffaed, 4.0, 300, 0.15);
    rootGroup.add(sunLight);

    const ambient = new THREE.AmbientLight(0x1e293b, 0.5);
    rootGroup.add(ambient);

    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(4.0, 32, 32),
      new THREE.MeshBasicMaterial({ map: loadNASATexture('sun'), color: 0xffaa00 })
    );
    rootGroup.add(sunMesh);

    // Corona Solar suave
    const corona = new THREE.Mesh(
      new THREE.SphereGeometry(5.2, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff8800, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending })
    );
    rootGroup.add(corona);

    // 2. Construcción de los 8 Planetas y sus Órbitas
    PLANET_CONFIGS.forEach((p, idx) => {
      // Línea de la órbita
      const orbitPts: THREE.Vector3[] = [];
      for (let i = 0; i <= 100; i++) {
        const th = (i / 100) * Math.PI * 2;
        orbitPts.push(new THREE.Vector3(Math.cos(th) * p.dist, 0, Math.sin(th) * p.dist));
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
      const orbitLine = new THREE.Line(
        orbitGeo,
        new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0.35 })
      );
      rootGroup?.add(orbitLine);

      // Pivote orbital
      const pivot = new THREE.Group();
      const initialAngle = (idx / PLANET_CONFIGS.length) * Math.PI * 2;

      // Malla del planeta
      const pGeo = new THREE.SphereGeometry(p.radius, 32, 32);
      const pMat = new THREE.MeshStandardMaterial({
        map: loadNASATexture(p.tex as any),
        roughness: 0.7,
        metalness: 0.1
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(Math.cos(initialAngle) * p.dist, 0, Math.sin(initialAngle) * p.dist);

      // Si es Saturno, añadir anillo 3D
      if (p.hasRings) {
        const ringGeo = new THREE.RingGeometry(p.radius * 1.35, p.radius * 2.3, 32);
        ringGeo.rotateX(Math.PI / 2);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xdeb887,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const rings = new THREE.Mesh(ringGeo, ringMat);
        rings.rotation.z = THREE.MathUtils.degToRad(26.7);
        pMesh.add(rings);
      }

      // Si es la Tierra, añadir la Luna orbitando
      if (p.name === 'earth') {
        const moon = new THREE.Mesh(
          new THREE.SphereGeometry(0.24, 16, 16),
          new THREE.MeshStandardMaterial({ map: loadNASATexture('moon'), roughness: 0.9 })
        );
        moon.position.set(1.8, 0, 0);
        pMesh.add(moon);
      }

      pivot.add(pMesh);
      rootGroup?.add(pivot);

      planets.push({
        mesh: pMesh,
        pivot,
        dist: p.dist,
        speed: p.speed,
        rotSpeed: 0.5 + Math.random() * 0.5,
        angle: initialAngle
      });
    });

    // 3. Cinturón de Asteroides (entre Marte a 21u y Júpiter a 30u -> radio 25u)
    const astCount = 450;
    const astPositions = new Float32Array(astCount * 3);
    for (let i = 0; i < astCount; i++) {
      const r = 24.0 + Math.random() * 3.5;
      const th = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 0.8;
      astPositions[i * 3] = Math.cos(th) * r;
      astPositions[i * 3 + 1] = y;
      astPositions[i * 3 + 2] = Math.sin(th) * r;
    }
    const astGeo = new THREE.BufferGeometry();
    astGeo.setAttribute('position', new THREE.BufferAttribute(astPositions, 3));
    const astMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.2, transparent: true, opacity: 0.65 });
    asteroidBelt = new THREE.Points(astGeo, astMat);
    rootGroup.add(asteroidBelt);

    scene.add(rootGroup);

    if (snapCamera) {
      snapCamera(0, 65, 75, 0, 0, 0);
    }
  },

  update: (delta: number) => {
    // Actualizar traslación y rotación de cada planeta
    for (const p of planets) {
      p.angle += delta * p.speed * 0.18;
      p.mesh.position.set(Math.cos(p.angle) * p.dist, 0, Math.sin(p.angle) * p.dist);
      p.mesh.rotation.y += delta * p.rotSpeed;
    }

    // Rotación suave del cinturón de asteroides
    if (asteroidBelt) {
      asteroidBelt.rotation.y += delta * 0.05;
    }
  },

  teardown: () => {
    if (rootGroup) {
      rootGroup.parent?.remove(rootGroup);
      rootGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else if (obj.material) obj.material.dispose();
        }
      });
      rootGroup = null;
    }
    planets = [];
    asteroidBelt = null;
  }
};

export default scene06_SolarSystem;
