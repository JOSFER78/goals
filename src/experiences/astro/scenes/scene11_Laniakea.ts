/**
 * Escena 11: El Supercúmulo Laniakea y el Gran Atractor
 */
import * as THREE from 'three';
import { CosmosSceneModule, CosmosSceneContext } from './types';

let cosmicFilaments: THREE.Points | null = null;
let attractorMesh: THREE.Mesh | null = null;

export const scene11_Laniakea: CosmosSceneModule = {
  id: 11,
  key: 'laniakea',
  name: 'Supercúmulo Laniakea',
  badge: '520 Millones al',
  tagline: 'El Río de Galaxias Hacia el Gran Atractor',
  description: 'Visualiza más de 100.000 galaxias moviéndose a lo largo de filamentos cósmicos hacia el misterioso Gran Atractor.',

  build: (ctx: CosmosSceneContext) => {
    const { scene, snapCamera } = ctx;

    // 1. Gran Atractor (Centro Gravitatorio)
    const attractorGeo = new THREE.SphereGeometry(4, 32, 32);
    const attractorMat = new THREE.MeshBasicMaterial({ color: 0xec4899, wireframe: true });
    attractorMesh = new THREE.Mesh(attractorGeo, attractorMat);
    attractorMesh.position.set(0, 0, 0);
    scene.add(attractorMesh);

    // 2. Filamentos Cósmicos de Galaxias
    const count = 10000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const strand = i % 5;
      const t = Math.random();
      const dist = t * 100 + 4;
      const baseAngle = strand * (Math.PI * 2 / 5);
      
      const x = Math.cos(baseAngle + t * 1.5) * dist + (Math.random() - 0.5) * 8;
      const y = (Math.random() - 0.5) * 20 * (1 - t * 0.5);
      const z = Math.sin(baseAngle + t * 1.5) * dist + (Math.random() - 0.5) * 8;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      colors[i * 3] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.2 + (1 - t) * 0.6;
      colors[i * 3 + 2] = 0.9;
    }

    const filamentGeo = new THREE.BufferGeometry();
    filamentGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    filamentGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const filamentMat = new THREE.PointsMaterial({
      size: 1.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    cosmicFilaments = new THREE.Points(filamentGeo, filamentMat);
    scene.add(cosmicFilaments);

    if (snapCamera) {
      snapCamera(0, 110, 150, 0, 0, 0);
    }
  },

  update: (delta: number) => {
    if (cosmicFilaments) cosmicFilaments.rotation.y += delta * 0.015;
  },

  teardown: () => {
    cosmicFilaments = null;
    attractorMesh = null;
  }
};
export default scene11_Laniakea;
