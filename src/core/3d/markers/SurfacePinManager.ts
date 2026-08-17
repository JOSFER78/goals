/**
 * GOALS 3D Cosmos - SurfacePinManager
 * Gestión de Balizas y Pines 3D Interactivos sobre Superficies Planetarias
 * Convierte Coordenadas Esféricas (Lat/Lon) a Vectores 3D con Anillo Radar Pulsante y Cartela Billboard.
 */

import * as THREE from 'three';
import { Landmark } from '../data/CelestialBodiesDatabase';

export interface PinInstance {
  landmark: Landmark;
  group: THREE.Group;
  ringMesh: THREE.Mesh;
  beamMesh: THREE.Mesh;
  labelSprite: THREE.Sprite;
  baseRadius: number;
  normal: THREE.Vector3;
}

export class SurfacePinManager {
  public pinsGroup: THREE.Group = new THREE.Group();
  private pins: PinInstance[] = [];
  private onSelectPinCallback?: (landmark: Landmark) => void;

  constructor(onSelectPin?: (landmark: Landmark) => void) {
    this.onSelectPinCallback = onSelectPin;
  }

  /**
   * Crea un marcador 3D en la superficie esférica a partir de Latitud y Longitud
   */
  public addPin(landmark: Landmark, sphereRadius: number, parentGroup?: THREE.Group) {
    const lat = landmark.coords?.lat ?? (landmark as any).latitude ?? 0;
    const lon = landmark.coords?.lon ?? (landmark as any).longitude ?? 0;
    const latRad = THREE.MathUtils.degToRad(lat);
    const lonRad = THREE.MathUtils.degToRad(lon);

    // Conversión Esférica a Cartesiana 3D
    const x = sphereRadius * Math.cos(latRad) * Math.sin(lonRad);
    const y = sphereRadius * Math.sin(latRad);
    const z = sphereRadius * Math.cos(latRad) * Math.cos(lonRad);

    const normal = new THREE.Vector3(x, y, z).normalize();
    const pinGroup = new THREE.Group();
    pinGroup.position.set(x, y, z);
    pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

    // 1. Anillo Radar Pulsante en la Superficie
    const ringGeo = new THREE.RingGeometry(sphereRadius * 0.012, sphereRadius * 0.024, 32);
    ringGeo.rotateX(-Math.PI / 2); // Alinear al plano del suelo
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    pinGroup.add(ringMesh);

    // 2. Haz de Luz Vertical (Spike Beacon)
    const beamHeight = sphereRadius * 0.08;
    const beamGeo = new THREE.CylinderGeometry(sphereRadius * 0.001, sphereRadius * 0.003, beamHeight, 8);
    beamGeo.translate(0, beamHeight / 2, 0);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.75
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    pinGroup.add(beamMesh);

    // 3. Cartela Billboard con Nombre del Landmark
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
      ctx.roundRect(4, 4, 248, 56, 12);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.roundRect(4, 4, 248, 56, 12);
      ctx.stroke();

      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(landmark.name, 128, 32);
    }

    const labelTex = new THREE.CanvasTexture(canvas);
    const labelMat = new THREE.SpriteMaterial({
      map: labelTex,
      transparent: true,
      depthTest: false
    });
    const labelSprite = new THREE.Sprite(labelMat);
    labelSprite.position.set(0, beamHeight + sphereRadius * 0.02, 0);
    labelSprite.scale.set(sphereRadius * 0.22, sphereRadius * 0.055, 1);
    pinGroup.add(labelSprite);

    // Guardar referencia
    const instance: PinInstance = {
      landmark,
      group: pinGroup,
      ringMesh,
      beamMesh,
      labelSprite,
      baseRadius: sphereRadius,
      normal
    };
    this.pins.push(instance);

    if (parentGroup) {
      parentGroup.add(pinGroup);
    } else {
      this.pinsGroup.add(pinGroup);
    }

    return instance;
  }

  /**
   * Limpia todos los pines
   */
  public clearAll() {
    this.pins.forEach((p) => {
      p.group.parent?.remove(p.group);
    });
    this.pins = [];
  }

  /**
   * Animación por frame (Efecto Radar y Visibilidad)
   */
  public update(time: number, camera: THREE.Camera) {
    const pulseScale = 1.0 + Math.sin(time * 3.5) * 0.25;
    const pulseOpacity = 0.5 + Math.cos(time * 3.5) * 0.35;

    this.pins.forEach((p) => {
      p.ringMesh.scale.set(pulseScale, pulseScale, pulseScale);
      (p.ringMesh.material as THREE.MeshBasicMaterial).opacity = pulseOpacity;

      // Ocultar etiquetas si están en la cara oculta del planeta (occlusión con la esfera)
      const worldPos = new THREE.Vector3();
      p.group.getWorldPosition(worldPos);
      const camDir = new THREE.Vector3().subVectors(camera.position, worldPos).normalize();
      
      const worldNormal = p.normal.clone().applyQuaternion(p.group.parent?.quaternion || new THREE.Quaternion());
      const dot = worldNormal.dot(camDir);

      // Si el ángulo es mayor de 90° (está al otro lado del planeta), atenuar o esconder
      p.labelSprite.visible = dot > 0.05;
      p.ringMesh.visible = dot > -0.1;
      p.beamMesh.visible = dot > -0.1;
    });
  }
}
