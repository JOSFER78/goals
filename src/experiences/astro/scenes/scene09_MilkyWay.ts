/**
 * Escena 09: La Vía Láctea y Sagitario A*
 */
import * as THREE from 'three';
import { CosmosSceneModule, CosmosSceneContext } from './types';

let galaxyParticles: THREE.Points | null = null;
let coreMesh: THREE.Mesh | null = null;

export const scene09_MilkyWay: CosmosSceneModule = {
  id: 9,
  key: 'milkyway',
  name: 'La Vía Láctea',
  badge: '100.000 Años Luz',
  tagline: 'Nuestra Galaxia Espiral y el Agujero Negro Central',
  description: 'Contempla los 4 brazos espirales principales, la posición del Sol en el Brazo de Orión y el corazón galáctico Sagitario A*.',

  build: (ctx: CosmosSceneContext) => {
    const { scene, snapCamera } = ctx;

    // 1. Núcleo Sagitario A*
    const coreGeo = new THREE.SphereGeometry(3, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 2. Brazos Espirales (Generador de Partículas)
    const count = 12000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const arm = i % 4;
      const dist = Math.pow(Math.random(), 2) * 80 + 3;
      const angle = dist * 0.15 + (arm * Math.PI / 2) + (Math.random() - 0.5) * 0.4;
      
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = (Math.random() - 0.5) * (15 - dist * 0.12);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color degradado (centro cálido a bordes azulados)
      const ratio = dist / 80;
      colors[i * 3] = 1.0 - ratio * 0.5;
      colors[i * 3 + 1] = 0.8 - ratio * 0.3;
      colors[i * 3 + 2] = 0.5 + ratio * 0.5;
    }

    const galaxyGeo = new THREE.BufferGeometry();
    galaxyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const galaxyMat = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    galaxyParticles = new THREE.Points(galaxyGeo, galaxyMat);
    scene.add(galaxyParticles);

    // 3. Indicador de la Posición del Sol (a 26.000 al del centro)
    const sunMarker = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    );
    sunMarker.position.set(35, 0, 0);
    scene.add(sunMarker);

    if (snapCamera) {
      snapCamera(0, 90, 130, 0, 0, 0);
    }
  },

  update: (delta: number) => {
    if (galaxyParticles) galaxyParticles.rotation.y += delta * 0.04;
  },

  teardown: () => {
    galaxyParticles = null;
    coreMesh = null;
  }
};
export default scene09_MilkyWay;
