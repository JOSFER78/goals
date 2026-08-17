/**
 * Escena 12: El Universo Observable y el Fondo Cósmico de Microondas
 */
import * as THREE from 'three';
import { CosmosSceneModule, CosmosSceneContext } from './types';

let universeParticles: THREE.Points | null = null;
let cmbSphere: THREE.Mesh | null = null;

export const scene12_Universe: CosmosSceneModule = {
  id: 12,
  key: 'universe',
  name: 'El Universo Observable',
  badge: '93.000 Millones al',
  tagline: 'El Horizonte Cósmico y el Eco del Big Bang',
  description: 'Contempla la totalidad de la burbuja observable con 2 billones de galaxias rodeada por la radiación cósmica de fondo de microondas.',

  build: (ctx: CosmosSceneContext) => {
    const { scene, snapCamera } = ctx;

    // 1. Esfera Límite del Fondo Cósmico de Microondas (CMB)
    const cmbGeo = new THREE.SphereGeometry(120, 32, 32);
    const cmbMat = new THREE.MeshBasicMaterial({
      color: 0x312e81,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    cmbSphere = new THREE.Mesh(cmbGeo, cmbMat);
    scene.add(cmbSphere);

    // 2. Red de Billones de Galaxias (Esfera Uniforme)
    const count = 8000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = Math.cbrt(Math.random()) * 115;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Colores de corrimiento al rojo (redshift) hacia el borde
      const redshift = radius / 120;
      colors[i * 3] = 0.4 + redshift * 0.6;
      colors[i * 3 + 1] = 0.5 - redshift * 0.3;
      colors[i * 3 + 2] = 0.9 - redshift * 0.5;
    }

    const universeGeo = new THREE.BufferGeometry();
    universeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    universeGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const universeMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    universeParticles = new THREE.Points(universeGeo, universeMat);
    scene.add(universeParticles);

    if (snapCamera) {
      snapCamera(0, 140, 180, 0, 0, 0);
    }
  },

  update: (delta: number) => {
    if (universeParticles) universeParticles.rotation.y += delta * 0.01;
    if (cmbSphere) cmbSphere.rotation.y -= delta * 0.005;
  },

  teardown: () => {
    universeParticles = null;
    cmbSphere = null;
  }
};
export default scene12_Universe;
