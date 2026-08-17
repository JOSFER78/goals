/**
 * Escena 08: Estrellas Vecinas (4 a 11 Años Luz)
 */
import * as THREE from 'three';
import { CosmosSceneModule, CosmosSceneContext } from './types';

let starsGroup: THREE.Group | null = null;

const NEARBY_STARS = [
  { name: 'Sol', x: 0, y: 0, z: 0, color: 0xfbbf24, size: 2.5 },
  { name: 'Próxima Centauri (4.24 al)', x: 22, y: -4, z: 12, color: 0xef4444, size: 1.2 },
  { name: 'Alfa Centauri A/B (4.37 al)', x: 24, y: -3, z: 14, color: 0xfde047, size: 2.2 },
  { name: 'Estrella de Barnard (5.96 al)', x: -18, y: 15, z: 20, color: 0xf87171, size: 1.1 },
  { name: 'Sirio (8.6 al)', x: -35, y: -20, z: -30, color: 0x67e8f9, size: 3.5 },
  { name: 'Épsilon Eridani (10.5 al)', x: 45, y: -30, z: -25, color: 0xf59e0b, size: 1.8 }
];

export const scene08_NearbyStars: CosmosSceneModule = {
  id: 8,
  key: 'nearbystars',
  name: 'Estrellas Vecinas',
  badge: '4 - 11 Años Luz',
  tagline: 'Nuestro Vecindario Interestelar',
  description: 'Descubre las estrellas más cercanas al Sol, incluyendo el sistema Alfa Centauri y la brillante Sirio.',

  build: (ctx: CosmosSceneContext) => {
    const { scene, snapCamera } = ctx;

    starsGroup = new THREE.Group();

    NEARBY_STARS.forEach(s => {
      // Esfera Estelar
      const starMesh = new THREE.Mesh(
        new THREE.SphereGeometry(s.size, 24, 24),
        new THREE.MeshBasicMaterial({ color: s.color })
      );
      starMesh.position.set(s.x, s.y, s.z);
      starsGroup?.add(starMesh);

      // Línea de referencia al Sol
      if (s.x !== 0 || s.y !== 0 || s.z !== 0) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(s.x, s.y, s.z)
        ]);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.3 });
        starsGroup?.add(new THREE.Line(lineGeo, lineMat));
      }
    });

    scene.add(starsGroup);

    if (snapCamera) {
      snapCamera(0, 50, 90, 0, 0, 0);
    }
  },

  update: (delta: number) => {
    if (starsGroup) starsGroup.rotation.y += delta * 0.03;
  },

  teardown: () => {
    starsGroup = null;
  }
};
export default scene08_NearbyStars;
