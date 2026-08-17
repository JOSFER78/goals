/**
 * GOALS 3D Cosmos - Scene Modular Types
 * Contrato estricto para cada una de las 12 escenas astronómicas.
 */

import * as THREE from 'three';

export interface CosmosSceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls?: any;
  onSelectTarget?: (key: string, name?: string) => void;
  snapCamera?: (x: number, y: number, z: number, targetX?: number, targetY?: number, targetZ?: number) => void;
}

export interface CosmosSceneModule {
  id: number;
  key: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  build: (ctx: CosmosSceneContext) => void;
  update?: (delta: number, simTime: number) => void;
  teardown?: () => void;
}
