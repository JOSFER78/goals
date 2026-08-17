/**
 * GOALS 3D Cosmos Engine - FloatingOriginCamera
 * Controlador de Cámara Espacial Cinemática con Floating Origin
 * Soporta navegación táctil (2 dedos) y PC (Espacio + Arrastre)
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface TravelTarget {
  key: string;
  name: string;
  targetPos: THREE.Vector3;
  cameraOffset: THREE.Vector3;
  minDistance: number;
  maxDistance: number;
  fov?: number;
}

export class FloatingOriginCamera {
  public camera: THREE.PerspectiveCamera;
  public controls: OrbitControls;
  
  private domElement: HTMLElement;
  private currentFocus: string = 'earth';
  
  // Transición cinemática de viaje
  private isTraveling: boolean = false;
  private travelStartTime: number = 0;
  private travelDuration: number = 2.0;
  private travelFromPos: THREE.Vector3 = new THREE.Vector3();
  private travelToPos: THREE.Vector3 = new THREE.Vector3();
  private travelFromTarget: THREE.Vector3 = new THREE.Vector3();
  private travelToTarget: THREE.Vector3 = new THREE.Vector3();
  private onTravelCompleteCallback?: () => void;

  constructor(domElement: HTMLElement, aspect: number = 1.0) {
    this.domElement = domElement;

    // Cámara con Frustum astronómico ultra-amplio y Logarithmic Depth Buffer
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.001, 1e12);
    this.camera.position.set(0, 4.0, 18.0);

    // OrbitControls con amortiguación inercial (Damping)
    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 1.2;
    this.controls.rotateSpeed = 0.75;
    this.controls.enablePan = true;
    this.controls.panSpeed = 1.0;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 0.005; // Permite acercarse a 5 metros de una estación
    this.controls.maxDistance = 2500.0;

    // Configuración de gestos táctiles y ratón
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };

    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };

    this.setupKeyboardShortcuts();
  }

  private setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !e.repeat && document.activeElement?.tagName !== 'INPUT') {
        this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
        this.domElement.style.cursor = 'grab';
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
        this.domElement.style.cursor = 'default';
      }
    });

    this.domElement.addEventListener('pointerdown', () => {
      if (this.controls.mouseButtons.LEFT === THREE.MOUSE.PAN) {
        this.domElement.style.cursor = 'grabbing';
      }
    });

    this.domElement.addEventListener('pointerup', () => {
      if (this.controls.mouseButtons.LEFT === THREE.MOUSE.PAN) {
        this.domElement.style.cursor = 'grab';
      }
    });
  }

  /**
   * Viaja suavemente de la posición actual hacia un nuevo objetivo espacial
   */
  public travelTo(target: TravelTarget, durationSec: number = 2.2, onComplete?: () => void) {
    this.isTraveling = true;
    this.travelStartTime = performance.now() / 1000;
    this.travelDuration = Math.max(0.6, durationSec);
    this.currentFocus = target.key;
    this.onTravelCompleteCallback = onComplete;

    this.travelFromPos.copy(this.camera.position);
    this.travelToPos.copy(target.targetPos).add(target.cameraOffset);

    this.travelFromTarget.copy(this.controls.target);
    this.travelToTarget.copy(target.targetPos);

    this.controls.minDistance = target.minDistance;
    this.controls.maxDistance = target.maxDistance;
  }

  /**
   * Actualización por cada fotograma (60 FPS)
   */
  public update(dt: number): boolean {
    if (this.isTraveling) {
      const now = performance.now() / 1000;
      const progress = Math.min(1.0, (now - this.travelStartTime) / this.travelDuration);
      
      // Curva sigmoide suave (Smoothstep cuádruple)
      const ease = progress < 0.5
        ? 8 * progress * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 4) / 2;

      this.camera.position.lerpVectors(this.travelFromPos, this.travelToPos, ease);
      this.controls.target.lerpVectors(this.travelFromTarget, this.travelToTarget, ease);

      if (progress >= 1.0) {
        this.isTraveling = false;
        this.onTravelCompleteCallback?.();
      }
    }

    this.controls.update();
    return this.isTraveling;
  }

  public resize(width: number, height: number) {
    if (height === 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  public getDistanceToTarget(): number {
    return this.camera.position.distanceTo(this.controls.target);
  }

  public getCurrentFocus(): string {
    return this.currentFocus;
  }

  public dispose() {
    this.controls.dispose();
  }
}
