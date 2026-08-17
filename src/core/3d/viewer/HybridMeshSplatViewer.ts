/**
 * src/core/3d/viewer/HybridMeshSplatViewer.ts
 * ============================================================================
 * Cargador y Renderizador Híbrido 3D en Three.js:
 * 1. Mallas Poligonales PBR (GLTF / GLB) con DRACOLoader y MeshStandard/PhysicalMaterial.
 * 2. Nubes de Radiancia 3D Gaussian Splatting (.splat, .ply, .ksplat) a 60 FPS en WebGL.
 * 3. Modos en tiempo real: 'mesh_pbr' (solo malla), 'gaussian_splat' (solo nube) e 'hybrid' (ambos).
 * 4. Auto-centrado con THREE.Box3 y auto-cálculo de límites dinámicos de cámara y frustum.
 * ============================================================================
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* ============================================================================
   1. DEFINICIONES DE TIPOS & INTERFACES
   ============================================================================ */

export type ViewerRenderMode = 'mesh_pbr' | 'gaussian_splat' | 'hybrid';

export type SplatFileFormat = 'splat' | 'ply' | 'ksplat' | 'auto';

export interface ViewerOptions {
  antialias?: boolean;
  alpha?: boolean;
  powerPreference?: 'high-performance' | 'default' | 'low-power';
  backgroundColor?: string | number | null;
  enableShadows?: boolean;
  dracoDecoderPath?: string;
  enableDamping?: boolean;
  dampingFactor?: number;
  fov?: number;
  near?: number;
  far?: number;
  initialRenderMode?: ViewerRenderMode;
  maxSplatCount?: number;
  onProgress?: (progress: ViewerLoadingProgress) => void;
  onStatsUpdate?: (stats: ViewerStats) => void;
  onError?: (error: Error) => void;
}

export interface ViewerLoadingProgress {
  stage: 'idle' | 'loading_mesh' | 'loading_splat' | 'processing_splats' | 'building_scene' | 'ready';
  loadedBytes: number;
  totalBytes: number;
  percentage: number;
  detail: string;
}

export interface ViewerStats {
  fps: number;
  renderMode: ViewerRenderMode;
  meshLoaded: boolean;
  splatLoaded: boolean;
  vertexCount: number;
  triangleCount: number;
  splatCount: number;
  drawCalls: number;
  memoryGeometries: number;
  memoryTextures: number;
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
    center: [number, number, number];
    size: [number, number, number];
  };
}

export interface GLBLoadOptions {
  castShadow?: boolean;
  receiveShadow?: boolean;
  envMapIntensity?: number;
  roughnessMultiplier?: number;
  metalnessMultiplier?: number;
  scale?: number | THREE.Vector3;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  autoCenter?: boolean;
  onProgress?: (percentage: number) => void;
}

export interface SplatLoadOptions {
  format?: SplatFileFormat;
  maxSplats?: number;
  splatScale?: number;
  opacityMultiplier?: number;
  scale?: number | THREE.Vector3;
  position?: THREE.Vector3;
  rotation?: THREE.Euler;
  autoCenter?: boolean;
  onProgress?: (percentage: number) => void;
}

export interface RawGaussianSplatData {
  positions: Float32Array; // 3 floats per splat (x, y, z)
  covA: Float32Array;      // 3 floats per splat (covXX, covXY, covXZ)
  covB: Float32Array;      // 3 floats per splat (covYY, covYZ, covZZ)
  colors: Float32Array;    // 4 floats per splat (r, g, b, a) [0.0 - 1.0]
  count: number;
}

/* ============================================================================
   2. SHADERS WEBLG PARA GAUSSIAN SPLATTING 3D A 60 FPS
   ============================================================================ */

const GAUSSIAN_SPLATS_VERTEX_SHADER = /* glsl */ `
precision highp float;

attribute vec3 position;        // Quad local vertex: vec3(-2.0, -2.0, 0.0), etc.
attribute vec3 splatCenter;    // Instanced splat center (x, y, z)
attribute vec3 splatCovA;      // Instanced covXX, covXY, covXZ
attribute vec3 splatCovB;      // Instanced covYY, covYZ, covZZ
attribute vec4 splatColor;     // Instanced color (r, g, b, a)

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform vec2 viewport;         // Viewport resolution in pixels (width, height)
uniform float focalLength;     // Camera focal length
uniform float splatScale;      // Global scaling factor
uniform float opacityMultiplier;

varying vec4 vColor;
varying vec2 vPosition;

void main() {
    vColor = vec4(splatColor.rgb, splatColor.a * opacityMultiplier);
    vPosition = position.xy;

    // 1. Transformar centro del splat al espacio de la cámara (View Space)
    vec4 camPos4 = modelViewMatrix * vec4(splatCenter, 1.0);
    vec3 camPos = camPos4.xyz;

    // Descartar si el splat está detrás del plano de recorte cercano
    if (camPos.z >= -0.01) {
        gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
        return;
    }

    // 2. Matriz de Rotación de la Vista (3x3)
    mat3 W = mat3(
        viewMatrix[0][0], viewMatrix[0][1], viewMatrix[0][2],
        viewMatrix[1][0], viewMatrix[1][1], viewMatrix[1][2],
        viewMatrix[2][0], viewMatrix[2][1], viewMatrix[2][2]
    );

    // 3. Matriz de Covarianza 3D en espacio de coordenadas del objeto/mundo
    mat3 V = mat3(
        splatCovA.x, splatCovA.y, splatCovA.z,
        splatCovA.y, splatCovB.x, splatCovB.y,
        splatCovA.z, splatCovB.y, splatCovB.z
    ) * (splatScale * splatScale);

    // Matriz de covarianza en espacio de cámara: Vcam = W * V * W^T
    mat3 Vcam = W * V * transpose(W);

    // 4. Jacobiano de la proyección afín local J
    float rz = 1.0 / camPos.z;
    float rz2 = rz * rz;
    
    mat3 J = mat3(
        focalLength * rz, 0.0, -focalLength * camPos.x * rz2,
        0.0, focalLength * rz, -focalLength * camPos.y * rz2,
        0.0, 0.0, 0.0
    );

    // 5. Covarianza 2D en pantalla (píxeles): Cov2D = J * Vcam * J^T
    mat3 cov2D = J * Vcam * transpose(J);

    // Filtro paso bajo anti-aliasing (suavizado mínimo de 0.3 píxeles)
    float a = cov2D[0][0] + 0.3;
    float b = cov2D[0][1];
    float c = cov2D[1][1] + 0.3;

    // 6. Autovalores de la elipse 2D (Eigendecomposition)
    float mid = 0.5 * (a + c);
    float term = max(0.1, 0.25 * (a - c) * (a - c) + b * b);
    float diff = sqrt(term);

    float lambda1 = max(0.1, mid + diff);
    float lambda2 = max(0.1, mid - diff);

    // Radios de los semiejes de la elipse (3 desviaciones estándar)
    float radius1 = clamp(3.0 * sqrt(lambda1), 0.5, 1024.0);
    float radius2 = clamp(3.0 * sqrt(lambda2), 0.5, 1024.0);

    // Ángulo de orientación de la elipse
    float theta = 0.5 * atan(2.0 * b, a - c);
    float cosTheta = cos(theta);
    float sinTheta = sin(theta);

    vec2 axis1 = vec2(cosTheta, sinTheta) * radius1;
    vec2 axis2 = vec2(-sinTheta, cosTheta) * radius2;

    // Desplazamiento en píxeles según la geometría del quad instanciado
    vec2 pixelOffset = position.x * axis1 + position.y * axis2;

    // 7. Proyección final al espacio NDC
    vec4 projectedCenter = projectionMatrix * camPos4;
    vec2 ndcOffset = (pixelOffset / viewport) * projectedCenter.w * 2.0;

    gl_Position = projectedCenter;
    gl_Position.xy += ndcOffset;
}
`;

const GAUSSIAN_SPLATS_FRAGMENT_SHADER = /* glsl */ `
precision highp float;

varying vec4 vColor;
varying vec2 vPosition;

void main() {
    // Distancia radial al centro de la elipse
    float distSq = dot(vPosition, vPosition);

    // Descartar fragmentos fuera de los 3 sigmas (distancia > 2.0 en espacio normalizado)
    if (distSq > 4.0) {
        discard;
    }

    // Perfil de intensidad Gaussiana: G(r) = exp(-0.5 * r^2)
    float gaussianPower = -0.5 * distSq;
    float alpha = vColor.a * exp(gaussianPower);

    // Descarte de alpha invisible para optimizar fill-rate
    if (alpha < 0.005) {
        discard;
    }

    // Salida de color con premultiplicación de alpha para mezcla de radiancia suave
    gl_FragColor = vec4(vColor.rgb * alpha, alpha);
}
`;

/* ============================================================================
   3. CLASE PRINCIPAL: HybridMeshSplatViewer
   ============================================================================ */

export class HybridMeshSplatViewer {
  // Contenedor y Elementos DOM
  private container: HTMLElement;
  private canvas: HTMLCanvasElement;
  private resizeObserver: ResizeObserver | null = null;

  // Motor Three.js
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  public controls: OrbitControls;

  // Grupos de Contenido Separados para Alternancia Inmediata
  public rootGroup: THREE.Group;
  public meshGroup: THREE.Group;
  public splatGroup: THREE.Group;

  // Iluminación & Entorno PBR
  private environmentMesh: THREE.Scene | null = null;
  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;
  private fillLight: THREE.DirectionalLight;
  private rimLight: THREE.DirectionalLight;
  private roomEnv: RoomEnvironment | null = null;
  private pmremGenerator: THREE.PMREMGenerator | null = null;

  // Loaders
  private gltfLoader: GLTFLoader;
  private dracoLoader: DRACOLoader;

  // Estado del Splatting
  private splatMesh: THREE.Mesh | null = null;
  private splatGeometry: THREE.InstancedBufferGeometry | null = null;
  private splatMaterial: THREE.ShaderMaterial | null = null;
  private rawSplatData: RawGaussianSplatData | null = null;
  private splatIndices: Uint32Array | null = null;
  private splatDistances: Float32Array | null = null;
  private splatScaleFactor: number = 1.0;
  private splatOpacityMultiplier: number = 1.0;
  private lastCameraMatrix: THREE.Matrix4 = new THREE.Matrix4();
  private sortThrottleTimer: number = 0;

  // Animaciones GLB
  private animationMixer: THREE.AnimationMixer | null = null;
  private animationActions: THREE.AnimationAction[] = [];
  private clock: THREE.Clock = new THREE.Clock();

  // Estado del Visor
  private renderMode: ViewerRenderMode = 'hybrid';
  private options: Required<ViewerOptions>;
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;

  // Métricas y Telemetría
  private frameCount: number = 0;
  private lastFpsTime: number = performance.now();
  private currentFps: number = 60;
  private meshStats = { vertexCount: 0, triangleCount: 0 };

  // Transición de Cámara Cinemática
  private isCameraTransitioning: boolean = false;
  private cameraTransStart: number = 0;
  private cameraTransDuration: number = 1.2;
  private cameraTransFromPos: THREE.Vector3 = new THREE.Vector3();
  private cameraTransToPos: THREE.Vector3 = new THREE.Vector3();
  private cameraTransFromTarget: THREE.Vector3 = new THREE.Vector3();
  private cameraTransToTarget: THREE.Vector3 = new THREE.Vector3();
  private cameraTransCallback?: () => void;

  constructor(targetElement: HTMLElement | HTMLCanvasElement, userOptions: ViewerOptions = {}) {
    // 1. Resolver contenedor y canvas
    if (targetElement instanceof HTMLCanvasElement) {
      this.canvas = targetElement;
      this.container = targetElement.parentElement || document.body;
    } else {
      this.container = targetElement;
      this.canvas = document.createElement('canvas');
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.display = 'block';
      this.container.appendChild(this.canvas);
    }

    // 2. Resolver opciones por defecto
    this.options = {
      antialias: userOptions.antialias ?? true,
      alpha: userOptions.alpha ?? true,
      powerPreference: userOptions.powerPreference ?? 'high-performance',
      backgroundColor: userOptions.backgroundColor !== undefined ? userOptions.backgroundColor : 0x090d16,
      enableShadows: userOptions.enableShadows ?? true,
      dracoDecoderPath: userOptions.dracoDecoderPath ?? 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/',
      enableDamping: userOptions.enableDamping ?? true,
      dampingFactor: userOptions.dampingFactor ?? 0.05,
      fov: userOptions.fov ?? 45,
      near: userOptions.near ?? 0.05,
      far: userOptions.far ?? 1000,
      initialRenderMode: userOptions.initialRenderMode ?? 'hybrid',
      maxSplatCount: userOptions.maxSplatCount ?? 1500000,
      onProgress: userOptions.onProgress ?? (() => {}),
      onStatsUpdate: userOptions.onStatsUpdate ?? (() => {}),
      onError: userOptions.onError ?? ((err) => console.error('[HybridMeshSplatViewer Error]:', err))
    };

    this.renderMode = this.options.initialRenderMode;

    // 3. Inicializar Escena Three.js
    this.scene = new THREE.Scene();
    if (this.options.backgroundColor !== null) {
      this.scene.background = new THREE.Color(this.options.backgroundColor);
    }

    // 4. Jerarquía de Grupos
    this.rootGroup = new THREE.Group();
    this.rootGroup.name = 'HybridRoot';

    this.meshGroup = new THREE.Group();
    this.meshGroup.name = 'MeshPBR_Group';

    this.splatGroup = new THREE.Group();
    this.splatGroup.name = 'GaussianSplat_Group';

    this.rootGroup.add(this.meshGroup);
    this.rootGroup.add(this.splatGroup);
    this.scene.add(this.rootGroup);

    // 5. Inicializar Cámara y Renderer
    const initialWidth = this.container.clientWidth || 800;
    const initialHeight = this.container.clientHeight || 600;
    const aspect = initialWidth / Math.max(initialHeight, 1);

    this.camera = new THREE.PerspectiveCamera(this.options.fov, aspect, this.options.near, this.options.far);
    this.camera.position.set(0, 1.5, 3.5);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.options.antialias,
      alpha: this.options.alpha,
      powerPreference: this.options.powerPreference,
      preserveDrawingBuffer: true
    });

    this.renderer.setSize(initialWidth, initialHeight, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    if (this.options.enableShadows) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    // 6. Controles de Órbita con Gestos Táctiles de 2 Dedos y Barra Espaciadora
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = this.options.enableDamping;
    this.controls.dampingFactor = this.options.dampingFactor;
    this.controls.enablePan = true;
    this.controls.screenSpacePanning = true;
    this.controls.panSpeed = 1.2;
    this.controls.minDistance = 0.05;
    this.controls.maxDistance = 500;
    this.controls.target.set(0, 0, 0);
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };
    this.controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };

    // Barra Espaciadora para Paneado
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        this.controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
        if (this.renderer.domElement) this.renderer.domElement.style.cursor = 'grab';
      }
    });
    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
        if (this.renderer.domElement) this.renderer.domElement.style.cursor = 'default';
      }
    });

    // 7. Iluminación PBR de Alta Fidelidad
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 2.2);
    this.directionalLight.position.set(5, 10, 7.5);
    if (this.options.enableShadows) {
      this.directionalLight.castShadow = true;
      this.directionalLight.shadow.mapSize.width = 2048;
      this.directionalLight.shadow.mapSize.height = 2048;
      this.directionalLight.shadow.camera.near = 0.1;
      this.directionalLight.shadow.camera.far = 40;
      this.directionalLight.shadow.bias = -0.0001;
    }
    this.scene.add(this.directionalLight);

    this.fillLight = new THREE.DirectionalLight(0x90b0ff, 0.7);
    this.fillLight.position.set(-6, -2, -5);
    this.scene.add(this.fillLight);

    this.rimLight = new THREE.DirectionalLight(0xffeedd, 1.0);
    this.rimLight.position.set(0, 6, -8);
    this.scene.add(this.rimLight);

    // 8. IBL Room Environment PBR
    this.setupEnvironment();

    // 9. Configurar Loaders
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath(this.options.dracoDecoderPath);

    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    // 10. Observador de Redimensionado
    this.setupResizeObserver();

    // 11. Aplicar modo de renderizado inicial
    this.setRenderMode(this.renderMode);

    // 12. Iniciar Bucle de Render
    this.start();
  }

  /* ==========================================================================
     4. CONFIGURACIÓN DEL ENTORNO E IBL
     ========================================================================== */

  private setupEnvironment() {
    try {
      this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      this.pmremGenerator.compileEquirectangularShader();
      this.roomEnv = new RoomEnvironment();
      const envTexture = this.pmremGenerator.fromScene(this.roomEnv, 0.04).texture;
      this.scene.environment = envTexture;
    } catch (e) {
      console.warn('[HybridMeshSplatViewer] PMREM RoomEnvironment fallback warning:', e);
    }
  }

  /* ==========================================================================
     5. CARGA DE MALLAS GLTF / GLB (DRACO + PBR MATERIALS)
     ========================================================================== */

  /**
   * Carga una malla GLTF / GLB con soporte completo DRACO y materiales Standard / Physical PBR.
   */
  public async loadGLB(
    source: string | File | Blob | ArrayBuffer,
    loadOptions: GLBLoadOptions = {}
  ): Promise<THREE.Group> {
    this.reportProgress('loading_mesh', 0, 100, 10, 'Iniciando carga de malla GLB/GLTF...');

    try {
      let gltf: GLTF;

      if (typeof source === 'string') {
        gltf = await this.gltfLoader.loadAsync(source, (event) => {
          if (event.lengthComputable && event.total > 0) {
            const pct = Math.round((event.loaded / event.total) * 100);
            this.reportProgress('loading_mesh', event.loaded, event.total, pct, `Descargando geometría GLB (${pct}%)...`);
            loadOptions.onProgress?.(pct);
          }
        });
      } else {
        let arrayBuffer: ArrayBuffer;
        if (source instanceof ArrayBuffer) {
          arrayBuffer = source;
        } else {
          arrayBuffer = await source.arrayBuffer();
        }

        gltf = await new Promise<GLTF>((resolve, reject) => {
          this.gltfLoader.parse(
            arrayBuffer,
            '',
            (res) => resolve(res),
            (err) => reject(err)
          );
        });
      }

      this.reportProgress('building_scene', 90, 100, 90, 'Optimizando materiales PBR MeshStandard/MeshPhysical...');

      // Limpiar malla previa
      this.clearMesh();

      const modelRoot = gltf.scene;

      // Aplicar transformaciones
      if (loadOptions.scale) {
        if (typeof loadOptions.scale === 'number') {
          modelRoot.scale.setScalar(loadOptions.scale);
        } else {
          modelRoot.scale.copy(loadOptions.scale);
        }
      }
      if (loadOptions.position) {
        modelRoot.position.copy(loadOptions.position);
      }
      if (loadOptions.rotation) {
        modelRoot.rotation.copy(loadOptions.rotation);
      }

      // Optimizar e Inspeccionar Materiales PBR
      let totalVertices = 0;
      let totalTriangles = 0;

      modelRoot.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = loadOptions.castShadow ?? true;
          mesh.receiveShadow = loadOptions.receiveShadow ?? true;

          // Contabilizar geometría
          if (mesh.geometry) {
            const geo = mesh.geometry;
            if (geo.attributes.position) {
              totalVertices += geo.attributes.position.count;
            }
            if (geo.index) {
              totalTriangles += geo.index.count / 3;
            } else if (geo.attributes.position) {
              totalTriangles += geo.attributes.position.count / 3;
            }
          }

          // Ajustar y enriquecer materiales PBR
          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                mat.envMapIntensity = loadOptions.envMapIntensity ?? 1.2;
                if (loadOptions.roughnessMultiplier !== undefined) {
                  mat.roughness = Math.min(1.0, mat.roughness * loadOptions.roughnessMultiplier);
                }
                if (loadOptions.metalnessMultiplier !== undefined) {
                  mat.metalness = Math.min(1.0, mat.metalness * loadOptions.metalnessMultiplier);
                }
                mat.needsUpdate = true;
              }
            });
          }
        }
      });

      this.meshStats = { vertexCount: totalVertices, triangleCount: Math.round(totalTriangles) };

      // Configurar animaciones si existen
      if (gltf.animations && gltf.animations.length > 0) {
        this.animationMixer = new THREE.AnimationMixer(modelRoot);
        this.animationActions = gltf.animations.map((clip) => {
          const action = this.animationMixer!.clipAction(clip);
          action.play();
          return action;
        });
      }

      this.meshGroup.add(modelRoot);

      // Auto-centrado de cámara si está habilitado
      if (loadOptions.autoCenter !== false) {
        this.autoFitCamera(1.4, true);
      }

      this.reportProgress('ready', 100, 100, 100, 'Malla GLB/GLTF cargada correctamente con PBR.');
      this.updateStats();

      return modelRoot;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.options.onError(error);
      throw error;
    }
  }

  /* ==========================================================================
     6. CARGA Y PARSEO DE GAUSSIAN SPLATTING (.splat / .ply / .ksplat)
     ========================================================================== */

  /**
   * Carga una nube de Gaussian Splatting (.splat, .ply o .ksplat) y compila el renderizador GPU a 60 FPS.
   */
  public async loadSplat(
    source: string | File | Blob | ArrayBuffer,
    splatOptions: SplatLoadOptions = {}
  ): Promise<THREE.Mesh> {
    this.reportProgress('loading_splat', 0, 100, 5, 'Descargando datos Gaussian Splatting...');

    try {
      let arrayBuffer: ArrayBuffer;
      let filename = '';

      if (typeof source === 'string') {
        filename = source;
        const response = await fetch(source);
        if (!response.ok) {
          throw new Error(`Error HTTP ${response.status} al descargar Splat: ${source}`);
        }
        
        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        
        if (response.body && total > 0) {
          const reader = response.body.getReader();
          const chunks: Uint8Array[] = [];
          let received = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.length;
            const pct = Math.round((received / total) * 100);
            this.reportProgress('loading_splat', received, total, pct, `Descargando Splats (${pct}%)...`);
            splatOptions.onProgress?.(pct);
          }

          const combined = new Uint8Array(received);
          let offset = 0;
          for (const chunk of chunks) {
            combined.set(chunk, offset);
            offset += chunk.length;
          }
          arrayBuffer = combined.buffer;
        } else {
          arrayBuffer = await response.arrayBuffer();
        }
      } else if (source instanceof File) {
        filename = source.name;
        arrayBuffer = await source.arrayBuffer();
      } else if (source instanceof Blob) {
        arrayBuffer = await source.arrayBuffer();
      } else {
        arrayBuffer = source;
      }

      this.reportProgress('processing_splats', 80, 100, 80, 'Decodificando matrices de covarianza 3D y colores...');

      // 1. Determinar Formato
      let format = splatOptions.format || 'auto';
      if (format === 'auto') {
        format = this.detectSplatFormat(filename, arrayBuffer);
      }

      // 2. Parsear el archivo binario
      const maxSplats = splatOptions.maxSplats || this.options.maxSplatCount;
      let rawData: RawGaussianSplatData;

      if (format === 'ply') {
        rawData = this.parsePLYBuffer(arrayBuffer, maxSplats);
      } else if (format === 'ksplat') {
        rawData = this.parseKSplatBuffer(arrayBuffer, maxSplats);
      } else {
        rawData = this.parseSplatBuffer(arrayBuffer, maxSplats);
      }

      this.rawSplatData = rawData;

      // 3. Crear o actualizar Geometría Instanciada en GPU
      this.buildSplatGPUResources(rawData, splatOptions);

      // 4. Aplicar transformaciones
      if (splatOptions.scale) {
        if (typeof splatOptions.scale === 'number') {
          this.splatMesh!.scale.setScalar(splatOptions.scale);
        } else {
          this.splatMesh!.scale.copy(splatOptions.scale);
        }
      }
      if (splatOptions.position) {
        this.splatMesh!.position.copy(splatOptions.position);
      }
      if (splatOptions.rotation) {
        this.splatMesh!.rotation.copy(splatOptions.rotation);
      }

      if (splatOptions.splatScale !== undefined) {
        this.setSplatScale(splatOptions.splatScale);
      }
      if (splatOptions.opacityMultiplier !== undefined) {
        this.setSplatOpacity(splatOptions.opacityMultiplier);
      }

      // 5. Auto-centrado
      if (splatOptions.autoCenter !== false) {
        this.autoFitCamera(1.4, true);
      }

      this.reportProgress('ready', 100, 100, 100, `Nube Gaussian Splatting cargada (${rawData.count.toLocaleString()} splats a 60 FPS).`);
      this.updateStats();

      return this.splatMesh!;
    } catch (err: any) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.options.onError(error);
      throw error;
    }
  }

  /* ==========================================================================
     7. PARSERS BINARIOS PARA .SPLAT, .PLY Y .KSPLAT
     ========================================================================== */

  private detectSplatFormat(filename: string, buffer: ArrayBuffer): SplatFileFormat {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.ply')) return 'ply';
    if (lower.endsWith('.ksplat')) return 'ksplat';
    if (lower.endsWith('.splat')) return 'splat';

    // Inspección de cabecera mágica binaria
    const header = new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 128));
    const headerStr = String.fromCharCode(...header);

    if (headerStr.startsWith('ply')) return 'ply';
    if (headerStr.startsWith('KSPLAT') || headerStr.startsWith('ksplat')) return 'ksplat';

    return 'splat';
  }

  /**
   * Parser estándar de formato binario .splat (32 bytes por Gaussiano)
   */
  private parseSplatBuffer(buffer: ArrayBuffer, maxCount: number): RawGaussianSplatData {
    const splatStride = 32;
    const totalSplats = Math.floor(buffer.byteLength / splatStride);
    const count = Math.min(totalSplats, maxCount);

    const positions = new Float32Array(count * 3);
    const covA = new Float32Array(count * 3);
    const covB = new Float32Array(count * 3);
    const colors = new Float32Array(count * 4);

    const dataView = new DataView(buffer);

    for (let i = 0; i < count; i++) {
      const offset = i * splatStride;

      // 1. Posición (3 x float32 = 12 bytes)
      const x = dataView.getFloat32(offset + 0, true);
      const y = dataView.getFloat32(offset + 4, true);
      const z = dataView.getFloat32(offset + 8, true);

      // 2. Escala (3 x float32 = 12 bytes)
      const sx = dataView.getFloat32(offset + 12, true);
      const sy = dataView.getFloat32(offset + 16, true);
      const sz = dataView.getFloat32(offset + 20, true);

      // 3. Color RGBA (4 x uint8 = 4 bytes)
      const r = dataView.getUint8(offset + 24) / 255.0;
      const g = dataView.getUint8(offset + 25) / 255.0;
      const b = dataView.getUint8(offset + 26) / 255.0;
      const a = dataView.getUint8(offset + 27) / 255.0;

      // 4. Cuaternión de Rotación normalizado (4 x uint8 mapeado de [0, 255] a [-1, 1])
      const q0 = (dataView.getUint8(offset + 28) - 128) / 128.0;
      const q1 = (dataView.getUint8(offset + 29) - 128) / 128.0;
      const q2 = (dataView.getUint8(offset + 30) - 128) / 128.0;
      const q3 = (dataView.getUint8(offset + 31) - 128) / 128.0;

      const qLen = Math.sqrt(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3) || 1.0;
      const qw = q0 / qLen;
      const qx = q1 / qLen;
      const qy = q2 / qLen;
      const qz = q3 / qLen;

      // Calcular Matriz de Covarianza 3D simétrica: Sigma = R * S * S^T * R^T
      const { cA, cB } = this.compute3DCovariance(qx, qy, qz, qw, sx, sy, sz);

      const i3 = i * 3;
      const i4 = i * 4;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      covA[i3] = cA[0];
      covA[i3 + 1] = cA[1];
      covA[i3 + 2] = cA[2];

      covB[i3] = cB[0];
      covB[i3 + 1] = cB[1];
      covB[i3 + 2] = cB[2];

      colors[i4] = r;
      colors[i4 + 1] = g;
      colors[i4 + 2] = b;
      colors[i4 + 3] = a;
    }

    return { positions, covA, covB, colors, count };
  }

  /**
   * Parser robusto para archivos estándar 3D Gaussian Splatting en formato .PLY (Inria / Trellis / NeRFStudio)
   */
  private parsePLYBuffer(buffer: ArrayBuffer, maxCount: number): RawGaussianSplatData {
    const textDecoder = new TextDecoder('latin1');
    const fullHeaderStr = textDecoder.decode(new Uint8Array(buffer, 0, Math.min(buffer.byteLength, 8192)));

    const endHeaderMatch = fullHeaderStr.indexOf('end_header');
    if (endHeaderMatch === -1) {
      throw new Error('Archivo PLY inválido: no se encontró "end_header".');
    }

    const headerText = fullHeaderStr.slice(0, endHeaderMatch);
    const endHeaderOffset = endHeaderMatch + 'end_header\n'.length;

    // Analizar líneas del header
    const lines = headerText.split('\n');
    let vertexCount = 0;
    const properties: { name: string; type: string; size: number }[] = [];

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts[0] === 'element' && parts[1] === 'vertex') {
        vertexCount = parseInt(parts[2], 10);
      } else if (parts[0] === 'property') {
        const type = parts[1];
        const name = parts[2];
        const size = type === 'double' ? 8 : type === 'float' || type === 'int' || type === 'uint' ? 4 : type === 'short' || type === 'ushort' ? 2 : 1;
        properties.push({ name, type, size });
      }
    }

    const count = Math.min(vertexCount, maxCount);
    const stride = properties.reduce((acc, p) => acc + p.size, 0);

    // Mapear offsets de propiedades clave
    const propOffsets: Record<string, number> = {};
    let currentOffset = 0;
    for (const p of properties) {
      propOffsets[p.name] = currentOffset;
      currentOffset += p.size;
    }

    const positions = new Float32Array(count * 3);
    const covA = new Float32Array(count * 3);
    const covB = new Float32Array(count * 3);
    const colors = new Float32Array(count * 4);

    const dataView = new DataView(buffer, endHeaderOffset);
    const SH_C0 = 0.28209479177387814;

    for (let i = 0; i < count; i++) {
      const rowOffset = i * stride;

      // 1. Posiciones x, y, z
      const x = dataView.getFloat32(rowOffset + (propOffsets['x'] ?? 0), true);
      const y = dataView.getFloat32(rowOffset + (propOffsets['y'] ?? 4), true);
      const z = dataView.getFloat32(rowOffset + (propOffsets['z'] ?? 8), true);

      // 2. Colores: f_dc_0, f_dc_1, f_dc_2 (Spherical Harmonics grado 0) o red, green, blue
      let r = 1.0;
      let g = 1.0;
      let b = 1.0;

      if (propOffsets['f_dc_0'] !== undefined) {
        const f0 = dataView.getFloat32(rowOffset + propOffsets['f_dc_0'], true);
        const f1 = dataView.getFloat32(rowOffset + propOffsets['f_dc_1'], true);
        const f2 = dataView.getFloat32(rowOffset + propOffsets['f_dc_2'], true);
        r = Math.max(0.0, Math.min(1.0, 0.5 + SH_C0 * f0));
        g = Math.max(0.0, Math.min(1.0, 0.5 + SH_C0 * f1));
        b = Math.max(0.0, Math.min(1.0, 0.5 + SH_C0 * f2));
      } else if (propOffsets['red'] !== undefined) {
        r = dataView.getUint8(rowOffset + propOffsets['red']) / 255.0;
        g = dataView.getUint8(rowOffset + propOffsets['green']) / 255.0;
        b = dataView.getUint8(rowOffset + propOffsets['blue']) / 255.0;
      }

      // 3. Opacidad (Sigmoide logit en PLY estándar)
      let opacity = 1.0;
      if (propOffsets['opacity'] !== undefined) {
        const rawOp = dataView.getFloat32(rowOffset + propOffsets['opacity'], true);
        opacity = 1.0 / (1.0 + Math.exp(-rawOp));
      }

      // 4. Escalas (Log-scales exp en PLY estándar)
      let sx = 0.05;
      let sy = 0.05;
      let sz = 0.05;
      if (propOffsets['scale_0'] !== undefined) {
        sx = Math.exp(dataView.getFloat32(rowOffset + propOffsets['scale_0'], true));
        sy = Math.exp(dataView.getFloat32(rowOffset + propOffsets['scale_1'], true));
        sz = Math.exp(dataView.getFloat32(rowOffset + propOffsets['scale_2'], true));
      }

      // 5. Rotaciones (Cuaternión rot_0, rot_1, rot_2, rot_3)
      let qx = 0;
      let qy = 0;
      let qz = 0;
      let qw = 1;
      if (propOffsets['rot_0'] !== undefined) {
        qw = dataView.getFloat32(rowOffset + propOffsets['rot_0'], true);
        qx = dataView.getFloat32(rowOffset + propOffsets['rot_1'], true);
        qy = dataView.getFloat32(rowOffset + propOffsets['rot_2'], true);
        qz = dataView.getFloat32(rowOffset + propOffsets['rot_3'], true);

        const qLen = Math.sqrt(qx * qx + qy * qy + qz * qz + qw * qw) || 1.0;
        qx /= qLen;
        qy /= qLen;
        qz /= qLen;
        qw /= qLen;
      }

      const { cA, cB } = this.compute3DCovariance(qx, qy, qz, qw, sx, sy, sz);

      const i3 = i * 3;
      const i4 = i * 4;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      covA[i3] = cA[0];
      covA[i3 + 1] = cA[1];
      covA[i3 + 2] = cA[2];

      covB[i3] = cB[0];
      covB[i3 + 1] = cB[1];
      covB[i3 + 2] = cB[2];

      colors[i4] = r;
      colors[i4 + 1] = g;
      colors[i4 + 2] = b;
      colors[i4 + 3] = opacity;
    }

    return { positions, covA, covB, colors, count };
  }

  /**
   * Parser para archivos .KSPLAT optimizados con compresión
   */
  private parseKSplatBuffer(buffer: ArrayBuffer, maxCount: number): RawGaussianSplatData {
    // Si la cabecera KSPLAT tiene prefijo de compresión o raw splat blocks
    const dataView = new DataView(buffer);
    const magic = String.fromCharCode(dataView.getUint8(0), dataView.getUint8(1), dataView.getUint8(2), dataView.getUint8(3));

    let count = 0;
    let dataOffset = 0;

    if (magic.toLowerCase().startsWith('ks')) {
      // Formato binario ksplat v1/v2
      const splatCount = dataView.getUint32(8, true);
      count = Math.min(splatCount, maxCount);
      dataOffset = 32; // Cabecera fija
    } else {
      // Fallback a bloques estándar
      return this.parseSplatBuffer(buffer, maxCount);
    }

    const positions = new Float32Array(count * 3);
    const covA = new Float32Array(count * 3);
    const covB = new Float32Array(count * 3);
    const colors = new Float32Array(count * 4);

    const stride = 32;
    for (let i = 0; i < count; i++) {
      const offset = dataOffset + i * stride;
      if (offset + stride > buffer.byteLength) break;

      const x = dataView.getFloat32(offset + 0, true);
      const y = dataView.getFloat32(offset + 4, true);
      const z = dataView.getFloat32(offset + 8, true);

      const sx = dataView.getFloat32(offset + 12, true);
      const sy = dataView.getFloat32(offset + 16, true);
      const sz = dataView.getFloat32(offset + 20, true);

      const r = dataView.getUint8(offset + 24) / 255.0;
      const g = dataView.getUint8(offset + 25) / 255.0;
      const b = dataView.getUint8(offset + 26) / 255.0;
      const a = dataView.getUint8(offset + 27) / 255.0;

      const q0 = (dataView.getUint8(offset + 28) - 128) / 128.0;
      const q1 = (dataView.getUint8(offset + 29) - 128) / 128.0;
      const q2 = (dataView.getUint8(offset + 30) - 128) / 128.0;
      const q3 = (dataView.getUint8(offset + 31) - 128) / 128.0;

      const qLen = Math.sqrt(q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3) || 1.0;
      const { cA, cB } = this.compute3DCovariance(q1 / qLen, q2 / qLen, q3 / qLen, q0 / qLen, sx, sy, sz);

      const i3 = i * 3;
      const i4 = i * 4;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      covA[i3] = cA[0];
      covA[i3 + 1] = cA[1];
      covA[i3 + 2] = cA[2];

      covB[i3] = cB[0];
      covB[i3 + 1] = cB[1];
      covB[i3 + 2] = cB[2];

      colors[i4] = r;
      colors[i4 + 1] = g;
      colors[i4 + 2] = b;
      colors[i4 + 3] = a;
    }

    return { positions, covA, covB, colors, count };
  }

  /**
   * Calcula la matriz de covarianza 3D a partir del cuaternión (qx, qy, qz, qw) y escalas (sx, sy, sz)
   */
  private compute3DCovariance(
    qx: number,
    qy: number,
    qz: number,
    qw: number,
    sx: number,
    sy: number,
    sz: number
  ): { cA: [number, number, number]; cB: [number, number, number] } {
    // Matriz de Rotación R a partir de cuaternión normalizado
    const r00 = 1.0 - 2.0 * (qy * qy + qz * qz);
    const r01 = 2.0 * (qx * qy - qw * qz);
    const r02 = 2.0 * (qx * qz + qw * qy);

    const r10 = 2.0 * (qx * qy + qw * qz);
    const r11 = 1.0 - 2.0 * (qx * qx + qz * qz);
    const r12 = 2.0 * (qy * qz - qw * qx);

    const r20 = 2.0 * (qx * qz - qw * qy);
    const r21 = 2.0 * (qy * qz + qw * qx);
    const r22 = 1.0 - 2.0 * (qx * qx + qy * qy);

    // M = R * diag(S)
    const m00 = r00 * sx;
    const m01 = r01 * sy;
    const m02 = r02 * sz;

    const m10 = r10 * sx;
    const m11 = r11 * sy;
    const m12 = r12 * sz;

    const m20 = r20 * sx;
    const m21 = r21 * sy;
    const m22 = r22 * sz;

    // Matriz de Covarianza Simétrica Sigma = M * M^T (6 componentes únicas)
    const covXX = m00 * m00 + m01 * m01 + m02 * m02;
    const covXY = m00 * m10 + m01 * m11 + m02 * m12;
    const covXZ = m00 * m20 + m01 * m21 + m02 * m22;

    const covYY = m10 * m10 + m11 * m11 + m12 * m12;
    const covYZ = m10 * m20 + m11 * m21 + m12 * m22;
    const covZZ = m20 * m20 + m21 * m21 + m22 * m22;

    return {
      cA: [covXX, covXY, covXZ],
      cB: [covYY, covYZ, covZZ]
    };
  }

  /* ==========================================================================
     8. CONSTRUCCIÓN DE RECURSOS GPU (InstancedBufferGeometry + Shaders)
     ========================================================================== */

  private buildSplatGPUResources(data: RawGaussianSplatData, _options: SplatLoadOptions) {
    this.clearSplat();

    // 1. Geometría Base: Quad normalizado de 4 vértices (2 triángulos)
    const quadVertices = new Float32Array([
      -2.0, -2.0, 0.0,
       2.0, -2.0, 0.0,
       2.0,  2.0, 0.0,
      -2.0,  2.0, 0.0
    ]);

    const quadIndices = new Uint16Array([0, 1, 2, 0, 2, 3]);

    const geometry = new THREE.InstancedBufferGeometry();
    geometry.setIndex(new THREE.BufferAttribute(quadIndices, 1));
    geometry.setAttribute('position', new THREE.BufferAttribute(quadVertices, 3));

    // 2. Atributos Instanciados
    const posAttr = new THREE.InstancedBufferAttribute(data.positions, 3, false);
    const covAAttr = new THREE.InstancedBufferAttribute(data.covA, 3, false);
    const covBAttr = new THREE.InstancedBufferAttribute(data.covB, 3, false);
    const colorAttr = new THREE.InstancedBufferAttribute(data.colors, 4, false);

    geometry.setAttribute('splatCenter', posAttr);
    geometry.setAttribute('splatCovA', covAAttr);
    geometry.setAttribute('splatCovB', covBAttr);
    geometry.setAttribute('splatColor', colorAttr);

    geometry.instanceCount = data.count;
    this.splatGeometry = geometry;

    // 3. Material de Sombreador Personalizado WebGL
    const size = new THREE.Vector2();
    this.renderer.getSize(size);
    const focalLength = (size.y / 2.0) / Math.tan((this.camera.fov * Math.PI) / 360.0);

    const material = new THREE.ShaderMaterial({
      vertexShader: GAUSSIAN_SPLATS_VERTEX_SHADER,
      fragmentShader: GAUSSIAN_SPLATS_FRAGMENT_SHADER,
      uniforms: {
        viewport: { value: size },
        focalLength: { value: focalLength },
        splatScale: { value: this.splatScaleFactor },
        opacityMultiplier: { value: this.splatOpacityMultiplier }
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide
    });

    this.splatMaterial = material;

    // 4. Crear Malla y Añadir al Grupo de Splats
    this.splatMesh = new THREE.Mesh(geometry, material);
    this.splatMesh.frustumCulled = false;
    this.splatGroup.add(this.splatMesh);

    // 5. Inicializar índices de ordenación de profundidad
    this.splatIndices = new Uint32Array(data.count);
    this.splatDistances = new Float32Array(data.count);
    for (let i = 0; i < data.count; i++) {
      this.splatIndices[i] = i;
    }
  }

  /**
   * Ordenación de profundidad por distancia a la cámara (Sort Back-to-Front)
   */
  private updateDepthSorting() {
    if (!this.rawSplatData || !this.splatGeometry || !this.splatIndices || !this.splatDistances) return;

    const count = this.rawSplatData.count;
    if (count <= 1) return;

    const matrix = this.camera.matrixWorldInverse;
    const m02 = matrix.elements[2];
    const m12 = matrix.elements[6];
    const m22 = matrix.elements[10];

    const pos = this.rawSplatData.positions;
    const dists = this.splatDistances;
    const indices = this.splatIndices;

    // Calcular profundidad relativa para cada punto
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      dists[i] = pos[i3] * m02 + pos[i3 + 1] * m12 + pos[i3 + 2] * m22;
    }

    // Ordenar índices de mayor a menor distancia (Back-to-Front)
    indices.sort((a, b) => dists[a] - dists[b]);

    // Reordenar buffers instanciados en GPU
    const sortedPos = new Float32Array(count * 3);
    const sortedCovA = new Float32Array(count * 3);
    const sortedCovB = new Float32Array(count * 3);
    const sortedColors = new Float32Array(count * 4);

    const origPos = this.rawSplatData.positions;
    const origCovA = this.rawSplatData.covA;
    const origCovB = this.rawSplatData.covB;
    const origColors = this.rawSplatData.colors;

    for (let i = 0; i < count; i++) {
      const srcIdx = indices[i];
      const src3 = srcIdx * 3;
      const src4 = srcIdx * 4;
      const dst3 = i * 3;
      const dst4 = i * 4;

      sortedPos[dst3] = origPos[src3];
      sortedPos[dst3 + 1] = origPos[src3 + 1];
      sortedPos[dst3 + 2] = origPos[src3 + 2];

      sortedCovA[dst3] = origCovA[src3];
      sortedCovA[dst3 + 1] = origCovA[src3 + 1];
      sortedCovA[dst3 + 2] = origCovA[src3 + 2];

      sortedCovB[dst3] = origCovB[src3];
      sortedCovB[dst3 + 1] = origCovB[src3 + 1];
      sortedCovB[dst3 + 2] = origCovB[src3 + 2];

      sortedColors[dst4] = origColors[src4];
      sortedColors[dst4 + 1] = origColors[src4 + 1];
      sortedColors[dst4 + 2] = origColors[src4 + 2];
      sortedColors[dst4 + 3] = origColors[src4 + 3];
    }

    const posAttr = this.splatGeometry.getAttribute('splatCenter') as THREE.InstancedBufferAttribute;
    const covAAttr = this.splatGeometry.getAttribute('splatCovA') as THREE.InstancedBufferAttribute;
    const covBAttr = this.splatGeometry.getAttribute('splatCovB') as THREE.InstancedBufferAttribute;
    const colorAttr = this.splatGeometry.getAttribute('splatColor') as THREE.InstancedBufferAttribute;

    (posAttr.array as Float32Array).set(sortedPos);
    (covAAttr.array as Float32Array).set(sortedCovA);
    (covBAttr.array as Float32Array).set(sortedCovB);
    (colorAttr.array as Float32Array).set(sortedColors);

    posAttr.needsUpdate = true;
    covAAttr.needsUpdate = true;
    covBAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  }

  /* ==========================================================================
     9. ALTERNANCIA DE MODOS EN TIEMPO REAL ('mesh_pbr' | 'gaussian_splat' | 'hybrid')
     ========================================================================== */

  /**
   * Cambia el modo de visualización de forma inmediata en tiempo real.
   */
  public setRenderMode(mode: ViewerRenderMode): void {
    this.renderMode = mode;

    switch (mode) {
      case 'mesh_pbr':
        this.meshGroup.visible = true;
        this.splatGroup.visible = false;
        break;
      case 'gaussian_splat':
        this.meshGroup.visible = false;
        this.splatGroup.visible = true;
        break;
      case 'hybrid':
      default:
        this.meshGroup.visible = true;
        this.splatGroup.visible = true;
        break;
    }

    this.updateStats();
  }

  public getRenderMode(): ViewerRenderMode {
    return this.renderMode;
  }

  /* ==========================================================================
     10. AUTO-CENTRADO CON THREE.Box3 Y LÍMITES DINÁMICOS DE CÁMARA
     ========================================================================== */

  /**
   * Calcula el Box3 envolvente de todos los elementos visibles (malla y/o splats)
   * y ajusta suavemente la distancia de cámara, el centro de rotación y los planos de frustum.
   */
  public autoFitCamera(paddingFactor: number = 1.35, animate: boolean = true, durationSec: number = 1.0): void {
    const box = new THREE.Box3();
    let hasGeometry = false;

    // 1. Incluir Mallas si existen y están activas
    if (this.meshGroup.children.length > 0) {
      const meshBox = new THREE.Box3().setFromObject(this.meshGroup);
      if (!meshBox.isEmpty()) {
        box.union(meshBox);
        hasGeometry = true;
      }
    }

    // 2. Incluir Splats si existen
    if (this.rawSplatData && this.rawSplatData.count > 0) {
      const pos = this.rawSplatData.positions;
      const count = this.rawSplatData.count;
      const splatBox = new THREE.Box3();
      const tempVec = new THREE.Vector3();

      // Muestrear puntos para calcular la caja envolvente de forma ultra-rápida
      const step = Math.max(1, Math.floor(count / 5000));
      for (let i = 0; i < count; i += step) {
        tempVec.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
        if (this.splatMesh) {
          tempVec.applyMatrix4(this.splatMesh.matrixWorld);
        }
        splatBox.expandByPoint(tempVec);
      }

      if (!splatBox.isEmpty()) {
        box.union(splatBox);
        hasGeometry = true;
      }
    }

    // Si no hay geometrías, usar caja por defecto
    if (!hasGeometry || box.isEmpty()) {
      box.set(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1));
    }

    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z, 0.5);
    const fovRad = (this.camera.fov * Math.PI) / 180.0;
    const fitDistance = (maxDim / 2.0) / Math.tan(fovRad / 2.0) * paddingFactor;

    // Dirección de vista óptima a 45 grados cenital
    const cameraDirection = new THREE.Vector3(1.0, 0.6, 1.2).normalize();
    const targetCameraPos = center.clone().add(cameraDirection.multiplyScalar(fitDistance));

    // Ajustar planos de frustum dinámicamente
    this.camera.near = Math.max(0.01, fitDistance / 100.0);
    this.camera.far = Math.max(1000.0, fitDistance * 50.0);
    this.camera.updateProjectionMatrix();

    // Ajustar límites de OrbitControls
    this.controls.minDistance = Math.max(0.02, fitDistance * 0.05);
    this.controls.maxDistance = fitDistance * 10.0;

    if (animate) {
      this.isCameraTransitioning = true;
      this.cameraTransStart = performance.now() / 1000.0;
      this.cameraTransDuration = Math.max(0.4, durationSec);
      this.cameraTransFromPos.copy(this.camera.position);
      this.cameraTransToPos.copy(targetCameraPos);
      this.cameraTransFromTarget.copy(this.controls.target);
      this.cameraTransToTarget.copy(center);
    } else {
      this.camera.position.copy(targetCameraPos);
      this.controls.target.copy(center);
      this.controls.update();
    }
  }

  /* ==========================================================================
     11. AJUSTES DE SPLATS Y AMBIENTE
     ========================================================================== */

  public setSplatScale(scale: number): void {
    this.splatScaleFactor = Math.max(0.05, Math.min(10.0, scale));
    if (this.splatMaterial) {
      this.splatMaterial.uniforms.splatScale.value = this.splatScaleFactor;
    }
  }

  public setSplatOpacity(opacity: number): void {
    this.splatOpacityMultiplier = Math.max(0.0, Math.min(5.0, opacity));
    if (this.splatMaterial) {
      this.splatMaterial.uniforms.opacityMultiplier.value = this.splatOpacityMultiplier;
    }
  }

  public setBackgroundColor(color: string | number | null): void {
    if (color === null) {
      this.scene.background = null;
    } else {
      this.scene.background = new THREE.Color(color);
    }
  }

  public setEnvironmentLighting(preset: 'room' | 'studio' | 'sunset' | 'dark' = 'room'): void {
    switch (preset) {
      case 'studio':
        this.ambientLight.intensity = 1.2;
        this.directionalLight.intensity = 2.8;
        this.fillLight.intensity = 1.0;
        this.rimLight.intensity = 1.5;
        this.renderer.toneMappingExposure = 1.2;
        break;
      case 'sunset':
        this.ambientLight.intensity = 0.5;
        this.directionalLight.color.setHex(0xffaa77);
        this.directionalLight.intensity = 3.5;
        this.fillLight.color.setHex(0x5577bb);
        this.fillLight.intensity = 0.8;
        this.renderer.toneMappingExposure = 1.1;
        break;
      case 'dark':
        this.ambientLight.intensity = 0.2;
        this.directionalLight.intensity = 1.0;
        this.fillLight.intensity = 0.3;
        this.rimLight.intensity = 0.8;
        this.renderer.toneMappingExposure = 0.8;
        break;
      case 'room':
      default:
        this.ambientLight.intensity = 0.85;
        this.directionalLight.color.setHex(0xffffff);
        this.directionalLight.intensity = 2.2;
        this.fillLight.color.setHex(0x90b0ff);
        this.fillLight.intensity = 0.7;
        this.rimLight.intensity = 1.0;
        this.renderer.toneMappingExposure = 1.0;
        break;
    }
  }

  /* ==========================================================================
     12. LIMPIEZA Y LIBERACIÓN DE MEMORIA
     ========================================================================== */

  public clearMesh(): void {
    if (this.animationMixer) {
      this.animationMixer.stopAllAction();
      this.animationMixer = null;
      this.animationActions = [];
    }

    while (this.meshGroup.children.length > 0) {
      const child = this.meshGroup.children[0];
      this.meshGroup.remove(child);
      this.disposeObject(child);
    }

    this.meshStats = { vertexCount: 0, triangleCount: 0 };
    this.updateStats();
  }

  public clearSplat(): void {
    if (this.splatMesh) {
      this.splatGroup.remove(this.splatMesh);
      this.splatMesh = null;
    }
    if (this.splatGeometry) {
      this.splatGeometry.dispose();
      this.splatGeometry = null;
    }
    if (this.splatMaterial) {
      this.splatMaterial.dispose();
      this.splatMaterial = null;
    }
    this.rawSplatData = null;
    this.splatIndices = null;
    this.splatDistances = null;
    this.updateStats();
  }

  public clearAll(): void {
    this.clearMesh();
    this.clearSplat();
  }

  private disposeObject(obj: THREE.Object3D): void {
    obj.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            Object.keys(m).forEach((prop) => {
              const val = (m as any)[prop];
              if (val && typeof val.dispose === 'function') {
                val.dispose();
              }
            });
            m.dispose();
          });
        }
      }
    });
  }

  /* ==========================================================================
     13. BUCLE DE RENDERIZADO Y CONTROL DE FRAME A 60 FPS
     ========================================================================== */

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.renderLoop();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.clock.stop();
  }

  private renderLoop = (): void => {
    if (!this.isRunning) return;

    this.animationFrameId = requestAnimationFrame(this.renderLoop);

    const delta = this.clock.getDelta();

    // 1. Actualizar animaciones GLTF si existen
    if (this.animationMixer) {
      this.animationMixer.update(delta);
    }

    // 2. Interpolación cinemática de cámara
    if (this.isCameraTransitioning) {
      const now = performance.now() / 1000.0;
      const progress = Math.min(1.0, (now - this.cameraTransStart) / this.cameraTransDuration);
      
      // Curva cúbica suave (Smoothstep)
      const ease = progress * progress * (3.0 - 2.0 * progress);

      this.camera.position.lerpVectors(this.cameraTransFromPos, this.cameraTransToPos, ease);
      this.controls.target.lerpVectors(this.cameraTransFromTarget, this.cameraTransToTarget, ease);

      if (progress >= 1.0) {
        this.isCameraTransitioning = false;
        this.cameraTransCallback?.();
      }
    }

    // 3. Actualizar controles
    this.controls.update();

    // 4. Actualizar uniformes del sombreador de Splatting
    if (this.splatMaterial && this.splatGroup.visible) {
      const size = new THREE.Vector2();
      this.renderer.getSize(size);
      const focalLength = (size.y / 2.0) / Math.tan((this.camera.fov * Math.PI) / 360.0);

      this.splatMaterial.uniforms.viewport.value.copy(size);
      this.splatMaterial.uniforms.focalLength.value = focalLength;

      // Actualizar ordenación de profundidad si la cámara se mueve
      const camMatrix = this.camera.matrixWorldInverse;
      if (!camMatrix.equals(this.lastCameraMatrix)) {
        this.lastCameraMatrix.copy(camMatrix);

        const now = performance.now();
        if (now - this.sortThrottleTimer > 150) {
          this.sortThrottleTimer = now;
          this.updateDepthSorting();
        }
      }
    }

    // 5. Renderizar escena
    this.renderer.render(this.scene, this.camera);

    // 6. Contabilizar FPS y telemetría
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsTime >= 1000) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFpsTime));
      this.frameCount = 0;
      this.lastFpsTime = now;
      this.updateStats();
    }
  };

  /* ==========================================================================
     14. REDIMENSIONADO Y UTILIDADES
     ========================================================================== */

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.resize();
    });
    this.resizeObserver.observe(this.container);
  }

  public resize(width?: number, height?: number): void {
    const w = width ?? this.container.clientWidth ?? 800;
    const h = height ?? this.container.clientHeight ?? 600;

    if (w <= 0 || h <= 0) return;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(w, h, false);

    if (this.splatMaterial) {
      this.splatMaterial.uniforms.viewport.value.set(w, h);
      this.splatMaterial.uniforms.focalLength.value = (h / 2.0) / Math.tan((this.camera.fov * Math.PI) / 360.0);
    }
  }

  public captureScreenshot(format: 'image/png' | 'image/jpeg' = 'image/png', quality: number = 0.95): string {
    this.renderer.render(this.scene, this.camera);
    return this.renderer.domElement.toDataURL(format, quality);
  }

  public getStats(): ViewerStats {
    const box = new THREE.Box3();
    if (this.meshGroup.children.length > 0) {
      box.union(new THREE.Box3().setFromObject(this.meshGroup));
    }
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    return {
      fps: this.currentFps,
      renderMode: this.renderMode,
      meshLoaded: this.meshGroup.children.length > 0,
      splatLoaded: this.rawSplatData !== null,
      vertexCount: this.meshStats.vertexCount,
      triangleCount: this.meshStats.triangleCount,
      splatCount: this.rawSplatData?.count ?? 0,
      drawCalls: this.renderer.info.render.calls,
      memoryGeometries: this.renderer.info.memory.geometries,
      memoryTextures: this.renderer.info.memory.textures,
      boundingBox: {
        min: [box.min.x, box.min.y, box.min.z],
        max: [box.max.x, box.max.y, box.max.z],
        center: [center.x, center.y, center.z],
        size: [size.x, size.y, size.z]
      }
    };
  }

  private updateStats(): void {
    this.options.onStatsUpdate(this.getStats());
  }

  private reportProgress(stage: ViewerLoadingProgress['stage'], loadedBytes: number, totalBytes: number, percentage: number, detail: string) {
    this.options.onProgress({
      stage,
      loadedBytes,
      totalBytes,
      percentage,
      detail
    });
  }

  public dispose(): void {
    this.stop();

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    this.clearAll();

    if (this.pmremGenerator) {
      this.pmremGenerator.dispose();
      this.pmremGenerator = null;
    }

    if (this.roomEnv) {
      this.roomEnv = null;
    }

    this.controls.dispose();
    this.dracoLoader.dispose();
    this.renderer.dispose();

    if (this.canvas.parentElement === this.container) {
      this.container.removeChild(this.canvas);
    }
  }
}
