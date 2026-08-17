/**
 * Escena 10: El Grupo Local de Galaxias
 */
import * as THREE from 'three';
import { CosmosSceneModule, CosmosSceneContext } from './types';

let localGroup: THREE.Group | null = null;

const GALAXIES = [
  { name: 'Vía Láctea', x: -20, y: 0, z: 0, size: 8, color: 0x38bdf8 },
  { name: 'Galaxia de Andrómeda (M31)', x: 30, y: 5, z: 15, size: 11, color: 0xa855f7 },
  { name: 'Galaxia del Triángulo (M33)', x: 15, y: -10, z: -25, size: 5, color: 0x34d399 },
  { name: 'Gran Nube de Magallanes', x: -28, y: -4, z: 6, size: 3, color: 0xfde047 }
];

export const scene10_LocalGroup: CosmosSceneModule = {
  id: 10,
  key: 'localgroup',
  name: 'El Grupo Local',
  badge: '10 Millones al',
  tagline: 'Nuestra Familia Galáctica Gravitacional',
  description: 'Explora más de 80 galaxias ligadas por gravedad, dominadas por la Vía Láctea y Andrómeda.',

  build: (ctx: CosmosSceneContext) => {
    const { scene, snapCamera } = ctx;

    localGroup = new THREE.Group();

    GALAXIES.forEach(g => {
      // Disco Galáctico
      const discGeo = new THREE.RingGeometry(0.5, g.size, 32);
      const discMat = new THREE.MeshBasicMaterial({ color: g.color, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
      const discMesh = new THREE.Mesh(discGeo, discMat);
      discMesh.position.set(g.x, g.y, g.z);
      discMesh.rotation.x = Math.PI / 3;
      localGroup?.add(discMesh);

      // Núcleo brillante
      const coreMesh = new THREE.Mesh(
        new THREE.SphereGeometry(g.size * 0.25, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      coreMesh.position.set(g.x, g.y, g.z);
      localGroup?.add(coreMesh);
    });

    scene.add(localGroup);

    if (snapCamera) {
      snapCamera(0, 70, 110, 0, 0, 0);
    }
  },

  update: (delta: number) => {
    if (localGroup) localGroup.rotation.y += delta * 0.02;
  },

  teardown: () => {
    localGroup = null;
  }
};
export default scene10_LocalGroup;
