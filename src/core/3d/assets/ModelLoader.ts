/**
 * GOALS 3D Cosmos Engine - ModelLoader
 * Gestor Asíncrono de Modelos 3D Oficiales de la NASA con GLTFLoader y Fallbacks PBR
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export interface SpacecraftModelDef {
  key: string;
  name: string;
  url?: string;
  scale: number;
}

export class ModelLoader {
  private static gltfLoader: GLTFLoader | null = null;
  private static dracoLoader: DRACOLoader | null = null;
  private static modelCache: Map<string, THREE.Group> = new Map();

  private static initLoaders() {
    if (!this.gltfLoader) {
      this.gltfLoader = new GLTFLoader();
      this.dracoLoader = new DRACOLoader();
      this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
      this.gltfLoader.setDRACOLoader(this.dracoLoader);
    }
  }

  /**
   * Carga un modelo 3D de nave/satélite (o devuelve el fallback procedural PBR de alta fidelidad)
   */
  public static async loadSpacecraft(def: SpacecraftModelDef): Promise<THREE.Group> {
    if (this.modelCache.has(def.key)) {
      return this.modelCache.get(def.key)!.clone();
    }

    this.initLoaders();

    // 1. Crear Fallback PBR de Alta Fidelidad instantáneo
    const fallbackModel = this.buildProceduralPBR(def.key);

    if (!def.url) {
      this.modelCache.set(def.key, fallbackModel);
      return fallbackModel.clone();
    }

    try {
      // 2. Intentar cargar el archivo .glb oficial de la NASA
      const gltf = await this.gltfLoader!.loadAsync(def.url);
      const root = gltf.scene;
      root.scale.setScalar(def.scale);

      // Optimizar materiales PBR
      root.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          if (mesh.material) {
            const mat = mesh.material as THREE.MeshStandardMaterial;
            mat.envMapIntensity = 1.2;
          }
        }
      });

      this.modelCache.set(def.key, root);
      return root.clone();
    } catch {
      // Si falla la red o el CDN, usar el fallback PBR sin interrumpir la simulación
      this.modelCache.set(def.key, fallbackModel);
      return fallbackModel.clone();
    }
  }

  /**
   * Fábrica de Modelos 3D PBR de Alta Fidelidad (ISS, Hubble, Landsat 9, JWST)
   */
  public static buildProceduralPBR(key: string): THREE.Group {
    const root = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.88, roughness: 0.18 });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1e40af, metalness: 0.95, roughness: 0.12, emissive: 0x082f49 });
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.98, roughness: 0.15 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.85, roughness: 0.3 });

    if (key === 'iss') {
      // Estación Espacial Internacional: Módulos presurizados + Viga Truss + 8 Paneles
      const truss = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.015, 0.015), bodyMat);
      root.add(truss);

      // Módulo Central Destiny
      const destGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.09, 16);
      destGeo.rotateZ(Math.PI / 2);
      root.add(new THREE.Mesh(destGeo, bodyMat));

      // Módulo Zarya (Dorado)
      const zaryaGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.075, 16);
      zaryaGeo.rotateZ(Math.PI / 2);
      const zarya = new THREE.Mesh(zaryaGeo, goldMat);
      zarya.position.x = -0.08;
      root.add(zarya);

      // Cúpula de cristal polarizado
      const cupola = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 12), new THREE.MeshBasicMaterial({ color: 0x38bdf8 }));
      cupola.position.set(0, -0.025, 0.016);
      root.add(cupola);

      // 4 alas dobles fotovoltaicas
      [-0.18, -0.12, 0.12, 0.18].forEach((wx) => {
        [-0.07, 0.07].forEach((wz) => {
          const panel = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.003, 0.105), solarMat);
          panel.position.set(wx, 0.028, wz);
          root.add(panel);
        });
      });
      root.scale.setScalar(1.2);
    } else if (key === 'hubble') {
      // Telescopio Espacial Hubble: Tubo óptico plateado + Compuerta a 45° + Espejo
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.14, 24), bodyMat);
      tube.rotation.z = Math.PI / 2;
      root.add(tube);

      const door = new THREE.Mesh(new THREE.CircleGeometry(0.032, 16), bodyMat);
      door.rotation.y = Math.PI / 4;
      door.position.set(0.075, 0.022, 0);
      root.add(door);

      const mirror = new THREE.Mesh(new THREE.CircleGeometry(0.028, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1.0, roughness: 0.05 }));
      mirror.rotation.y = Math.PI / 2;
      mirror.position.x = 0.028;
      root.add(mirror);

      [-0.08, 0.08].forEach((sy) => {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.003, 0.13), solarMat);
        panel.position.set(-0.02, sy, 0);
        root.add(panel);
      });
      root.scale.setScalar(1.3);
    } else if (key === 'landsat') {
      // Satélite Landsat 9: Bus MLI dorado + Sensores OLI-2 / TIRS-2 + Panel
      const bus = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.07), goldMat);
      root.add(bus);

      const inst = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.04, 16), darkMat);
      inst.position.y = -0.042;
      root.add(inst);

      const solar = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.004, 0.16), solarMat);
      solar.position.set(0, 0.05, 0.09);
      root.add(solar);
      root.scale.setScalar(1.3);
    } else if (key === 'jwst') {
      // Telescopio James Webb: Parasol Kapton diamante + 18 Espejos hexagonales dorados
      const shieldShape = new THREE.Shape();
      shieldShape.moveTo(0, 0.2);
      shieldShape.lineTo(0.11, 0);
      shieldShape.lineTo(0, -0.2);
      shieldShape.lineTo(-0.11, 0);
      shieldShape.closePath();

      const shield = new THREE.Mesh(new THREE.ShapeGeometry(shieldShape), new THREE.MeshStandardMaterial({ color: 0xdb2777, metalness: 0.85, roughness: 0.35, side: THREE.DoubleSide }));
      shield.rotation.x = Math.PI / 2;
      root.add(shield);

      const mirrorGroup = new THREE.Group();
      for (let q = -2; q <= 2; q++) {
        for (let r = -2; r <= 2; r++) {
          if (Math.abs(q + r) <= 2 && !(q === 0 && r === 0)) {
            const hex = new THREE.Mesh(new THREE.CircleGeometry(0.018, 6), goldMat);
            const hx = 0.032 * (q + r * 0.5);
            const hy = 0.032 * (r * Math.sqrt(3) / 2);
            hex.position.set(hx, hy + 0.035, 0.04);
            mirrorGroup.add(hex);
          }
        }
      }
      mirrorGroup.rotation.x = -Math.PI / 6;
      root.add(mirrorGroup);

      const secMirror = new THREE.Mesh(new THREE.CircleGeometry(0.011, 6), goldMat);
      secMirror.position.set(0, 0.07, 0.09);
      root.add(secMirror);
      root.scale.setScalar(1.3);
    }

    return root;
  }
}
