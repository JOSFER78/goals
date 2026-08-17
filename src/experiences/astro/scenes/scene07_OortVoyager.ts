/**
 * Escena 07: La Nube de Oort y la Sonda Voyager 1
 */
import * as THREE from 'three';
import { CosmosSceneModule, CosmosSceneContext } from './types';

let oortParticles: THREE.Points | null = null;
let voyagerGroup: THREE.Group | null = null;

export const scene07_OortVoyager: CosmosSceneModule = {
  id: 7,
  key: 'oort',
  name: 'Nube de Oort y Voyager 1',
  badge: '100.000 UA',
  tagline: 'El Límite Gravitatorio del Sistema Solar',
  description: 'Visualiza la gigantesca burbuja esférica de cometas y el viaje histórico de la sonda interestelar Voyager 1.',

  build: (ctx: CosmosSceneContext) => {
    const { scene, snapCamera } = ctx;

    // 1. Partículas de la Nube de Oort
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 60 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    const oortGeo = new THREE.BufferGeometry();
    oortGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const oortMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.8, transparent: true, opacity: 0.6 });
    oortParticles = new THREE.Points(oortGeo, oortMat);
    scene.add(oortParticles);

    // 2. Trayectoria Voyager 1
    voyagerGroup = new THREE.Group();
    const trailPoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(15, 8, 20),
      new THREE.Vector3(35, 18, 50),
      new THREE.Vector3(55, 28, 80)
    ];
    const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPoints);
    const trailMat = new THREE.LineBasicMaterial({ color: 0xf43f5e, linewidth: 2 });
    const trail = new THREE.Line(trailGeo, trailMat);
    voyagerGroup.add(trail);

    // Sonda Voyager
    const probeMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.8, 2, 8),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.8 })
    );
    probeMesh.position.set(55, 28, 80);
    voyagerGroup.add(probeMesh);

    scene.add(voyagerGroup);

    if (snapCamera) {
      snapCamera(0, 70, 140, 0, 0, 0);
    }
  },

  update: (delta: number) => {
    if (oortParticles) oortParticles.rotation.y += delta * 0.01;
  },

  teardown: () => {
    oortParticles = null;
    voyagerGroup = null;
  }
};
export default scene07_OortVoyager;
