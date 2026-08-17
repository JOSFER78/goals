/**
 * GOALS 3D Cosmos Engine - SpaceRaycaster
 * Sistema de Raycasting Espacial con Hitboxes Adaptativas y Feedback Visual
 */

import * as THREE from 'three';

export interface ClickableEntity {
  key: string;
  mesh: THREE.Object3D;
  proxyRadius?: number;
}

export class SpaceRaycaster {
  private raycaster: THREE.Raycaster;
  private mousePos: THREE.Vector2 = new THREE.Vector2();
  private pointerDownPos: { x: number; y: number } | null = null;
  
  private camera: THREE.Camera;
  private domElement: HTMLElement;
  private clickables: Map<string, THREE.Object3D> = new Map();
  private proxyMeshes: THREE.Mesh[] = [];

  private onSelectCallback?: (key: string) => void;
  private onHoverCallback?: (key: string | null) => void;
  private hoveredKey: string | null = null;

  constructor(
    domElement: HTMLElement,
    camera: THREE.Camera,
    onSelect?: (key: string) => void,
    onHover?: (key: string | null) => void
  ) {
    this.domElement = domElement;
    this.camera = camera;
    this.onSelectCallback = onSelect;
    this.onHoverCallback = onHover;

    this.raycaster = new THREE.Raycaster();
    this.raycaster.params.Points = { threshold: 1.0 };

    this.setupListeners();
  }

  private setupListeners() {
    this.domElement.addEventListener('pointerdown', (e) => {
      this.pointerDownPos = { x: e.clientX, y: e.clientY };
    });

    this.domElement.addEventListener('pointermove', (e) => {
      this.updateMouseCoords(e);
      this.checkHover();
    });

    this.domElement.addEventListener('pointerup', (e) => {
      if (!this.pointerDownPos) return;
      const dist = Math.hypot(e.clientX - this.pointerDownPos.x, e.clientY - this.pointerDownPos.y);
      this.pointerDownPos = null;

      // Umbral estricto de 6px: Si el usuario estaba arrastrando la cámara, NO disparar clic accidental
      if (dist > 6) return;

      this.updateMouseCoords(e);
      this.checkClick();
    });
  }

  private updateMouseCoords(e: PointerEvent) {
    const rect = this.domElement.getBoundingClientRect();
    this.mousePos.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mousePos.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  }

  public registerEntity(key: string, targetObject: THREE.Object3D, hitRadius: number = 1.0) {
    // Crear Hitbox Proxy invisible para facilitar el clic en objetos pequeños a grandes distancias
    const proxyGeo = new THREE.SphereGeometry(hitRadius, 12, 12);
    const proxyMat = new THREE.MeshBasicMaterial({ visible: false, wireframe: true });
    const proxyMesh = new THREE.Mesh(proxyGeo, proxyMat);
    proxyMesh.userData = { entityKey: key };

    targetObject.add(proxyMesh);
    this.proxyMeshes.push(proxyMesh);
    this.clickables.set(key, targetObject);
  }

  private checkHover() {
    this.raycaster.setFromCamera(this.mousePos, this.camera);
    const intersects = this.raycaster.intersectObjects(this.proxyMeshes, true);

    if (intersects.length > 0) {
      const hitKey = intersects[0].object.userData.entityKey;
      if (this.hoveredKey !== hitKey) {
        this.hoveredKey = hitKey;
        this.domElement.style.cursor = 'pointer';
        this.onHoverCallback?.(hitKey);
      }
    } else {
      if (this.hoveredKey !== null) {
        this.hoveredKey = null;
        this.domElement.style.cursor = 'default';
        this.onHoverCallback?.(null);
      }
    }
  }

  private checkClick() {
    this.raycaster.setFromCamera(this.mousePos, this.camera);
    const intersects = this.raycaster.intersectObjects(this.proxyMeshes, true);

    if (intersects.length > 0) {
      const hitKey = intersects[0].object.userData.entityKey;
      if (hitKey) {
        this.onSelectCallback?.(hitKey);
      }
    }
  }

  public updateCamera(camera: THREE.Camera) {
    this.camera = camera;
  }

  public dispose() {
    this.proxyMeshes.forEach((mesh) => {
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    });
    this.proxyMeshes = [];
    this.clickables.clear();
  }
}
