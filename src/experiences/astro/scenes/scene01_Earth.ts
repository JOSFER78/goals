/**
 * Escena 01: La Tierra, su Atmósfera y Satélites NASA
 * Utiliza el sistema maestro PBR de la Tierra de CosmosScaleEngine.
 */
import * as THREE from 'three';
import { CosmosSceneModule, CosmosSceneContext } from './types';

let rootGroup: THREE.Group | null = null;

export const scene01_Earth: CosmosSceneModule = {
  id: 1,
  key: 'earth',
  name: 'La Tierra y Satélites',
  badge: '12.742 km',
  tagline: 'Nuestro Oasis Cósmico y la Órbita Terrestre',
  description: 'Explora la Tierra con su atmósfera Rayleigh-Mie, capa de nubes dinámica, la Luna y las órbitas de satélites artificiales (ISS, Hubble, Landsat 9 y JWST en L2).',

  build: (ctx: CosmosSceneContext) => {
    const { scene, snapCamera, onSelectTarget } = ctx;
    rootGroup = new THREE.Group();
    scene.add(rootGroup);

    if (onSelectTarget) {
      onSelectTarget('earth');
    }

    if (snapCamera) {
      snapCamera(0, 4, 18, 0, 0, 0);
    }
  },

  update: (_delta: number) => {
    // La rotación sidérea y satélites son calculados en tiempo real por CosmosScaleEngine
  },

  teardown: () => {
    if (rootGroup && rootGroup.parent) {
      rootGroup.parent.remove(rootGroup);
      rootGroup = null;
    }
  }
};

export default scene01_Earth;
