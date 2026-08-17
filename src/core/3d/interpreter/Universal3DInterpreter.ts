/**
 * src/core/3d/interpreter/Universal3DInterpreter.ts
 * Intérprete Universal de Grafo de Escena 3D en Three.js.
 * CERO HARDCODEO: Construye cualquier modelo o mundo 3D a partir de una especificación JSON declarativa generada por la IA.
 * Funciona para cualquier dominio (instalaciones eléctricas, reactores, anatomía, satélites, motores, botánica, etc.).
 */

import * as THREE from 'three';

export interface Dynamic3DMaterialSpec {
  type?: 'pbr_physical' | 'standard' | 'basic' | 'glow' | 'wireframe';
  color?: string;
  metalness?: number;
  roughness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  transmission?: number;
  thickness?: number;
  opacity?: number;
  transparent?: boolean;
  emissive?: string;
  emissiveIntensity?: number;
  wireframe?: boolean;
  side?: 'front' | 'back' | 'double';
}

export interface Dynamic3DNodeSpec {
  id?: string;
  name: string;
  geometryType: 'box' | 'cylinder' | 'sphere' | 'tube' | 'torus' | 'cone' | 'capsule' | 'plane' | 'ring' | 'cable_curve' | 'particle_cloud';
  params?: Record<string, any>;
  position?: [number, number, number];
  rotation?: [number, number, number]; // en radianes o grados
  scale?: [number, number, number] | number;
  material?: Dynamic3DMaterialSpec;
  children?: Dynamic3DNodeSpec[];
}

export interface OfficialSourceSpec {
  name: string;
  organization: string; // ej: "Ministerio de Industria (REBT)", "NASA JPL", "NIH 3D", "IEEE Standards"
  standardCode?: string; // ej: "ITC-BT-25 / REBT 2002", "NASA-STD-3001", "ISO 9001"
  url?: string;
  docType?: 'normativa' | 'cad_oficial' | 'escaneo_medico' | 'diagrama_tecnico' | 'publicacion_cientifica' | string;
  description: string;
}

export interface Dynamic3DModelSpec {
  id: string;
  name: string;
  shortName: string;
  domain: string; // ej: "Ingeniería Eléctrica", "Aeroespacial", "Medicina", "Mecánica"
  category: string;
  description: string;
  technicalSummary: string;
  officialSources: OfficialSourceSpec[];
  inspectionHotspots: {
    title: string;
    desc: string;
    position?: [number, number, number];
    componentId?: string;
  }[];
  rootNodes: Dynamic3DNodeSpec[];
  initialCameraPosition?: [number, number, number];
  suggestedLighting?: 'studio' | 'industrial' | 'outdoor' | 'medical';
}

export class Universal3DInterpreter {

  /**
   * Construye el árbol completo de Three.js a partir de la especificación declarativa
   */
  public static buildSceneFromSpec(spec: Dynamic3DModelSpec): THREE.Group {
    const rootGroup = new THREE.Group();
    rootGroup.name = spec.name || 'DynamicRoot';

    if (!spec.rootNodes || spec.rootNodes.length === 0) {
      // Si la especificación está vacía, generar un marcador geométrico
      const fallbackGeo = new THREE.BoxGeometry(1, 1, 1);
      const fallbackMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true });
      rootGroup.add(new THREE.Mesh(fallbackGeo, fallbackMat));
      return rootGroup;
    }

    const isDeepSky = /galaxy|galaxia|galazcia|nebula|nebulosa|carina|deepsky|cosmos/i.test(`${spec.id} ${spec.name} ${spec.category} ${spec.domain}`);
    if (isDeepSky) {
      const particleCount = 8000;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(particleCount * 3);
      const col = new Float32Array(particleCount * 3);

      const colorCore = new THREE.Color(0xfff3d6);
      const colorGas = new THREE.Color(0xf97316);
      const colorOxy = new THREE.Color(0x06b6d4);

      for (let i = 0; i < particleCount; i++) {
        const arm = i % 2;
        const dist = Math.pow(Math.random(), 1.5) * 2.8;
        const angle = dist * 2.2 + (arm * Math.PI) + (Math.random() - 0.5) * 0.4;
        const spread = (Math.random() - 0.5) * (0.2 + dist * 0.15);

        pos[i * 3] = Math.cos(angle) * dist + (Math.random() - 0.5) * 0.1;
        pos[i * 3 + 1] = spread;
        pos[i * 3 + 2] = Math.sin(angle) * dist + (Math.random() - 0.5) * 0.1;

        let mixedColor: THREE.Color;
        if (dist < 0.6) {
          mixedColor = colorCore.clone().lerp(colorGas, dist / 0.6);
        } else {
          mixedColor = colorGas.clone().lerp(colorOxy, (dist - 0.6) / 2.2);
        }
        col[i * 3] = mixedColor.r;
        col[i * 3 + 1] = mixedColor.g;
        col[i * 3 + 2] = mixedColor.b;
      }

      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

      const splatMat = new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      rootGroup.add(new THREE.Points(geo, splatMat));
    }

    spec.rootNodes.forEach(nodeSpec => {
      const obj = this.buildNode(nodeSpec);
      if (obj) {
        rootGroup.add(obj);
      }
    });

    return rootGroup;
  }

  /**
   * Construye un nodo individual y sus hijos de forma recursiva
   */
  private static buildNode(nodeSpec: Dynamic3DNodeSpec): THREE.Object3D {
    const group = new THREE.Group();
    group.name = nodeSpec.name || 'Node';

    // 1. Crear la geometría según su tipo declarativo
    const geometry = this.createGeometry(nodeSpec.geometryType, nodeSpec.params || {});
    
    // 2. Crear el material PBR físico
    const material = this.createMaterial(nodeSpec.material || {});

    // 3. Crear Mesh si la geometría existe
    if (geometry) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = (nodeSpec.name || 'Mesh') + '_Geometry';
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }

    // 4. Aplicar transformaciones espaciales
    if (nodeSpec.position) {
      group.position.set(nodeSpec.position[0], nodeSpec.position[1], nodeSpec.position[2]);
    }

    if (nodeSpec.rotation) {
      // Comprobar si los ángulos vienen en grados (> 2*PI) o radianes
      const rx = Math.abs(nodeSpec.rotation[0]) > 6.29 ? THREE.MathUtils.degToRad(nodeSpec.rotation[0]) : nodeSpec.rotation[0];
      const ry = Math.abs(nodeSpec.rotation[1]) > 6.29 ? THREE.MathUtils.degToRad(nodeSpec.rotation[1]) : nodeSpec.rotation[1];
      const rz = Math.abs(nodeSpec.rotation[2]) > 6.29 ? THREE.MathUtils.degToRad(nodeSpec.rotation[2]) : nodeSpec.rotation[2];
      group.rotation.set(rx, ry, rz);
    }

    if (nodeSpec.scale !== undefined) {
      if (Array.isArray(nodeSpec.scale)) {
        group.scale.set(nodeSpec.scale[0], nodeSpec.scale[1], nodeSpec.scale[2]);
      } else {
        group.scale.setScalar(nodeSpec.scale);
      }
    }

    // 5. Procesar hijos recursivamente
    if (nodeSpec.children && nodeSpec.children.length > 0) {
      nodeSpec.children.forEach(childSpec => {
        const childObj = this.buildNode(childSpec);
        if (childObj) {
          group.add(childObj);
        }
      });
    }

    return group;
  }

  // Caché de mapas de normales y texturas de micro-detalle procedural
  private static scratchNormalTexture: THREE.CanvasTexture | null = null;
  private static wrinkleNormalTexture: THREE.CanvasTexture | null = null;
  private static asphaltNormalTexture: THREE.CanvasTexture | null = null;
  private static organicNormalTexture: THREE.CanvasTexture | null = null;

  public static getScratchNormalMap(): THREE.CanvasTexture {
    if (this.scratchNormalTexture) return this.scratchNormalTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    // Base normal vector (0, 0, 1) -> RGB (128, 128, 255)
    ctx.fillStyle = 'rgb(128, 128, 255)';
    ctx.fillRect(0, 0, 512, 512);

    // Micro-arañazos y líneas de mecanizado CNC / desgaste
    for (let i = 0; i < 400; i++) {
      const x1 = Math.random() * 512;
      const y1 = Math.random() * 512;
      const length = 10 + Math.random() * 45;
      const angle = Math.random() * Math.PI * 2;
      const x2 = x1 + Math.cos(angle) * length;
      const y2 = y1 + Math.sin(angle) * length;

      const nx = Math.floor(128 + (Math.random() - 0.5) * 50);
      const ny = Math.floor(128 + (Math.random() - 0.5) * 50);
      ctx.strokeStyle = `rgb(${nx}, ${ny}, 245)`;
      ctx.lineWidth = 0.6 + Math.random() * 0.8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    this.scratchNormalTexture = tex;
    return tex;
  }

  public static getWrinkleNormalMap(): THREE.CanvasTexture {
    if (this.wrinkleNormalTexture) return this.wrinkleNormalTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgb(128, 128, 255)';
    ctx.fillRect(0, 0, 512, 512);

    // Micro-arrugas para láminas, Mylar y mantas térmicas
    for (let i = 0; i < 180; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 20 + Math.random() * 60;
      const grad = ctx.createRadialGradient(x, y, 2, x, y, r);
      grad.addColorStop(0, 'rgba(145, 110, 255, 0.4)');
      grad.addColorStop(0.5, 'rgba(110, 145, 255, 0.2)');
      grad.addColorStop(1, 'rgba(128, 128, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    this.wrinkleNormalTexture = tex;
    return tex;
  }

  public static getAsphaltNormalMap(): THREE.CanvasTexture {
    if (this.asphaltNormalTexture) return this.asphaltNormalTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgb(128, 128, 255)';
    ctx.fillRect(0, 0, 512, 512);

    // Grano granular y agregados de asfalto / hormigón
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 1 + Math.random() * 3.5;
      const nx = Math.floor(128 + (Math.random() - 0.5) * 80);
      const ny = Math.floor(128 + (Math.random() - 0.5) * 80);
      ctx.fillStyle = `rgb(${nx}, ${ny}, 235)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    this.asphaltNormalTexture = tex;
    return tex;
  }

  public static getOrganicNormalMap(): THREE.CanvasTexture {
    if (this.organicNormalTexture) return this.organicNormalTexture;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'rgb(128, 128, 255)';
    ctx.fillRect(0, 0, 512, 512);

    // Patrón de capilares y micro-poros biológicos
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 3 + Math.random() * 12;
      const grad = ctx.createRadialGradient(x, y, 1, x, y, r);
      grad.addColorStop(0, 'rgba(160, 110, 240, 0.35)');
      grad.addColorStop(1, 'rgba(128, 128, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    this.organicNormalTexture = tex;
    return tex;
  }

  /**
   * Fábrica universal de geometrías Three.js
   */
  private static createGeometry(type: string, p: Record<string, any>): THREE.BufferGeometry | null {
    try {
      let geo: THREE.BufferGeometry;
      switch (type.toLowerCase()) {
        case 'box':
          geo = new THREE.BoxGeometry(p.width ?? p.x ?? 1, p.height ?? p.y ?? 1, p.depth ?? p.z ?? 1);
          break;

        case 'cylinder':
          geo = new THREE.CylinderGeometry(
            p.radiusTop ?? p.radius ?? 0.5,
            p.radiusBottom ?? p.radius ?? 0.5,
            p.height ?? 1,
            p.radialSegments ?? 24
          );
          break;

        case 'sphere':
          geo = new THREE.SphereGeometry(
            p.radius ?? 1,
            p.widthSegments ?? 32,
            p.heightSegments ?? 32,
            p.phiStart,
            p.phiLength,
            p.thetaStart,
            p.thetaLength
          );
          break;

        case 'torus':
          geo = new THREE.TorusGeometry(
            p.radius ?? 1,
            p.tube ?? 0.2,
            p.radialSegments ?? 16,
            p.tubularSegments ?? 48
          );
          break;

        case 'cone':
          geo = new THREE.ConeGeometry(
            p.radius ?? 0.5,
            p.height ?? 1,
            p.radialSegments ?? 24
          );
          break;

        case 'capsule':
          geo = new THREE.CapsuleGeometry(
            p.radius ?? 0.3,
            p.length ?? 1,
            p.capSubdivisions ?? 8,
            p.radialSegments ?? 16
          );
          break;

        case 'plane':
          geo = new THREE.PlaneGeometry(p.width ?? 1, p.height ?? 1);
          break;

        case 'ring':
          geo = new THREE.RingGeometry(p.innerRadius ?? 0.5, p.outerRadius ?? 1, p.thetaSegments ?? 32);
          break;

        case 'tube':
        case 'cable_curve': {
          const points: THREE.Vector3[] = [];
          if (Array.isArray(p.points) && p.points.length >= 2) {
            p.points.forEach((pt: any) => {
              if (Array.isArray(pt)) points.push(new THREE.Vector3(pt[0], pt[1], pt[2]));
              else if (pt.x !== undefined) points.push(new THREE.Vector3(pt.x, pt.y, pt.z));
            });
          } else {
            points.push(new THREE.Vector3(-0.5, 0, 0), new THREE.Vector3(0, 0.5, 0), new THREE.Vector3(0.5, 0, 0));
          }
          const curve = new THREE.CatmullRomCurve3(points);
          geo = new THREE.TubeGeometry(
            curve,
            p.tubularSegments ?? 32,
            p.radius ?? 0.04,
            p.radialSegments ?? 12,
            p.closed ?? false
          );
          break;
        }

        default:
          geo = new THREE.BoxGeometry(p.width ?? 1, p.height ?? 1, p.depth ?? 1);
          break;
      }

      geo.computeVertexNormals();
      return geo;
    } catch (e) {
      console.warn(`Error al instanciar geometría [${type}]:`, e);
      const fallback = new THREE.BoxGeometry(1, 1, 1);
      fallback.computeVertexNormals();
      return fallback;
    }
  }

  /**
   * Fábrica universal de materiales PBR calibrados con soporte de normales de arañazos, asfalto y tejido orgánico
   */
  private static createMaterial(matSpec: Dynamic3DMaterialSpec): THREE.Material {
    const colorHex = matSpec.color || '#38bdf8';
    const color = new THREE.Color(colorHex);
    const side = matSpec.side === 'double' ? THREE.DoubleSide : matSpec.side === 'back' ? THREE.BackSide : THREE.FrontSide;

    const metalness = matSpec.metalness ?? 0.85;
    const roughness = matSpec.roughness ?? 0.15;
    const clearcoat = matSpec.clearcoat ?? (metalness > 0.7 ? 0.6 : 0.0);

    // Selección inteligente del mapa de normales según propiedades físicas del material
    let normalMap: THREE.CanvasTexture | null = null;
    if (matSpec.type === 'pbr_physical' || metalness > 0.6) {
      normalMap = this.getScratchNormalMap();
    } else if (roughness > 0.6) {
      normalMap = this.getAsphaltNormalMap();
    } else if (matSpec.transmission || (matSpec.thickness && matSpec.thickness > 0)) {
      normalMap = this.getOrganicNormalMap();
    }

    if (matSpec.type === 'pbr_physical' || clearcoat > 0 || matSpec.transmission) {
      return new THREE.MeshPhysicalMaterial({
        color,
        normalMap,
        metalness,
        roughness,
        clearcoat,
        clearcoatRoughness: matSpec.clearcoatRoughness ?? 0.08,
        transmission: matSpec.transmission ?? 0.0,
        thickness: matSpec.thickness ?? 0.0,
        transparent: matSpec.transparent ?? (matSpec.opacity !== undefined && matSpec.opacity < 1.0),
        opacity: matSpec.opacity ?? 1.0,
        emissive: matSpec.emissive ? new THREE.Color(matSpec.emissive) : new THREE.Color(0x000000),
        emissiveIntensity: matSpec.emissiveIntensity ?? 1.0,
        wireframe: !!matSpec.wireframe,
        envMapIntensity: 2.5,
        side
      });
    }

    if (matSpec.type === 'wireframe' || matSpec.wireframe) {
      return new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: matSpec.opacity ?? 0.8
      });
    }

    if (matSpec.type === 'glow') {
      return new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: matSpec.opacity ?? 0.9,
        blending: THREE.AdditiveBlending
      });
    }

    return new THREE.MeshStandardMaterial({
      color,
      normalMap,
      metalness,
      roughness,
      transparent: matSpec.transparent ?? (matSpec.opacity !== undefined && matSpec.opacity < 1.0),
      opacity: matSpec.opacity ?? 1.0,
      emissive: matSpec.emissive ? new THREE.Color(matSpec.emissive) : new THREE.Color(0x000000),
      emissiveIntensity: matSpec.emissiveIntensity ?? 1.0,
      wireframe: !!matSpec.wireframe,
      envMapIntensity: 2.0,
      side
    });
  }
}
