import * as THREE from 'three';
import { FloatingOriginCamera, TravelTarget } from '../camera/FloatingOriginCamera';
import { ASTRO_CONSTANTS, AstroMath, ScaleMode } from '../math/AstroCoordinates';
import { TimeEngine, HistoricalEvent } from '../astro/TimeEngine';
import { KeplerOrbit, KEPLER_CATALOG } from '../astro/KeplerOrbit';
import { createAtmosphereMaterial } from '../shaders/AtmosphereShader';
import { createEarthPBRMaterial } from '../shaders/PlanetSurfaceShader';
import { ModelLoader } from '../assets/ModelLoader';

import { SpaceRaycaster } from '../interaction/SpaceRaycaster';
import { Landmark, CELESTIAL_DATABASE } from '../data/CelestialBodiesDatabase';
import { StellarSkyEngine } from '../environment/StellarSkyEngine';
import { SurfacePinManager } from '../markers/SurfacePinManager';

export interface TelemetryData {
  targetKey: string;
  targetName: string;
  distanceKm: number;
  altitudeKm: number;
  velocityKms: number;
  orbitalPeriodMin: number;
  scaleMode: ScaleMode;
  isTraveling: boolean;
  simDateFormatted: string;
  timeScale: number;
  isPaused: boolean;
}

export class CosmosScaleEngine {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private cameraCtrl: FloatingOriginCamera;
  private raycaster: SpaceRaycaster;
  
  public timeEngine: TimeEngine;
  public stellarSky: StellarSkyEngine | null = null;
  public pinManager: SurfacePinManager;
  private resizeObserver?: ResizeObserver;
  private keplerOrbits: Record<string, KeplerOrbit> = {};

  private clock: THREE.Clock;
  private animFrameId: number | null = null;
  private scaleMode: ScaleMode = 'didactic';

  // Grafo de Escena
  private earthGroup: THREE.Group = new THREE.Group();
  private earthMesh: THREE.Mesh | null = null;
  private cloudsMesh: THREE.Mesh | null = null;
  private atmosphereMesh: THREE.Mesh | null = null;
  
  private moonGroup: THREE.Group = new THREE.Group();
  private moonMesh: THREE.Mesh | null = null;
  private moonOrbitLine: THREE.Line | null = null;

  private satellites: Record<string, { group: THREE.Group; mesh: THREE.Group; orbitLine?: THREE.Line }> = {};
  private gridHelper: THREE.PolarGridHelper | null = null;
  
  private sunLight: THREE.DirectionalLight | null = null;
  private sunDir: THREE.Vector3 = new THREE.Vector3(16, 8, 28).normalize();

  // Targets de Navegación
  private targets: Record<string, TravelTarget> = {};
  private activeSceneModule: any = null;
  private onTelemetryUpdate?: (data: TelemetryData) => void;
  private onSelectEntityCallback?: (key: string) => void;

  constructor(
    container: HTMLElement,
    onTelemetry?: (data: TelemetryData) => void,
    onSelectEntity?: (key: string) => void
  ) {
    this.container = container;
    this.onTelemetryUpdate = onTelemetry;
    this.onSelectEntityCallback = onSelectEntity;
    this.clock = new THREE.Clock();
    this.timeEngine = new TimeEngine();
    this.pinManager = new SurfacePinManager((lm) => {
      this.flyToLandmark(lm);
    });

    // Inicializar propagadores keplerianos
    for (const [key, elem] of Object.entries(KEPLER_CATALOG)) {
      this.keplerOrbits[key] = new KeplerOrbit(elem);
    }

    // 1. Configuración del Renderizador WebGL2 con Logarithmic Depth Buffer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    // 2. Escena y Cámara con Floating Origin
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x010206);
    this.cameraCtrl = new FloatingOriginCamera(this.renderer.domElement, container.clientWidth / container.clientHeight);

    // 3. Sistema de Raycasting Espacial con Hitboxes Adaptativas
    this.raycaster = new SpaceRaycaster(
      this.renderer.domElement,
      this.cameraCtrl.camera,
      (key) => {
        this.onSelectEntityCallback?.(key);
      }
    );

    // 4. Inicialización de Objetos Celestiales y Entorno Espacial Fotorrealista
    this.initLightingAndStars();
    this.buildEarthSystem();
    this.buildMoonSystem();
    this.buildSatellites();
    this.populateLandmarkPins();
    this.setupTargets();

    // 5. Iniciar Bucle de Renderizado 60 FPS
    this.animate = this.animate.bind(this);
    this.animate();

    // Escuchar redimensionamiento tanto por window como por ResizeObserver del contenedor
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.container);
    }
  }

  private initLightingAndStars() {
    this.sunLight = new THREE.DirectionalLight(0xfffbf2, 4.2);
    this.sunLight.position.copy(this.sunDir).multiplyScalar(100.0);
    this.scene.add(this.sunLight);

    this.scene.add(new THREE.AmbientLight(0x060a16, 0.18));

    // Entorno Espacial Fotorrealista: 10.000 Estrellas Gaia, Vía Láctea HD y Sol Radiante
    const sunWorldPos = this.sunDir.clone().multiplyScalar(450.0);
    this.stellarSky = new StellarSkyEngine(this.scene, sunWorldPos);
    this.scene.add(this.pinManager.pinsGroup);

    // Cuadrícula Ecuatorial / Eclíptica de Referencia (Google Maps Style Layer)
    this.gridHelper = new THREE.PolarGridHelper(32, 16, 8, 64, 0x0ea5e9, 0x1e293b);
    this.gridHelper.position.y = 0;
    this.gridHelper.visible = false;
    this.scene.add(this.gridHelper);
  }

  public setLayerVisibility(layerKey: 'orbits' | 'labels' | 'pins' | 'atmosphere' | 'stars' | 'grid', visible: boolean) {
    if (layerKey === 'orbits') {
      if (this.moonOrbitLine) this.moonOrbitLine.visible = visible;
      Object.values(this.satellites).forEach(s => {
        if (s.orbitLine) s.orbitLine.visible = visible;
      });
    } else if (layerKey === 'pins') {
      this.pinManager.pinsGroup.visible = visible;
    } else if (layerKey === 'atmosphere') {
      if (this.atmosphereMesh) this.atmosphereMesh.visible = visible;
      if (this.cloudsMesh) this.cloudsMesh.visible = visible;
    } else if (layerKey === 'stars') {
      if (this.stellarSky?.starsPoints) this.stellarSky.starsPoints.visible = visible;
    } else if (layerKey === 'grid') {
      if (this.gridHelper) this.gridHelper.visible = visible;
    }
  }

  private populateLandmarkPins() {
    const earthRadiusScene = ASTRO_CONSTANTS.RADIUS_EARTH_KM / ASTRO_CONSTANTS.SCENE_SCALE_FACTOR; // 6.371
    const moonRadiusScene = ASTRO_CONSTANTS.RADIUS_MOON_KM / ASTRO_CONSTANTS.SCENE_SCALE_FACTOR;   // 1.737

    // Pines en la Luna (Apolo 11, Tycho, Copérnico)
    const moonData = CELESTIAL_DATABASE['moon'];
    if (moonData?.landmarks) {
      moonData.landmarks.forEach((lm) => {
        this.pinManager.addPin(lm, moonRadiusScene * 1.005, this.moonGroup);
      });
    }

    // Pines en la Tierra (Cabo Cañaveral, Chicxulub, Baikonur)
    const earthData = CELESTIAL_DATABASE['earth'];
    if (earthData?.landmarks) {
      earthData.landmarks.forEach((lm) => {
        this.pinManager.addPin(lm, earthRadiusScene * 1.005, this.earthGroup);
      });
    }
  }

  private buildEarthSystem() {
    const earthRadiusScene = ASTRO_CONSTANTS.RADIUS_EARTH_KM / ASTRO_CONSTANTS.SCENE_SCALE_FACTOR; // 6.371
    this.earthGroup = new THREE.Group();
    this.earthGroup.rotation.z = THREE.MathUtils.degToRad(23.44);

    const texLoader = new THREE.TextureLoader();
    const dayTex = texLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
    dayTex.colorSpace = THREE.SRGBColorSpace;

    const nightTex = texLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png');
    nightTex.colorSpace = THREE.SRGBColorSpace;

    const specTex = texLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg');
    const cloudsTex = texLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png');

    // Shader PBR Físico con Luces VIIRS y Reflejo Oceánico
    const earthMat = createEarthPBRMaterial(dayTex, nightTex, specTex, this.sunDir);
    this.earthMesh = new THREE.Mesh(new THREE.SphereGeometry(earthRadiusScene, 96, 96), earthMat);
    this.earthGroup.add(this.earthMesh);
    this.raycaster.registerEntity('earth', this.earthMesh, earthRadiusScene * 1.05);

    // Manto de Nubes Dinámicas
    const cloudsMat = new THREE.MeshStandardMaterial({
      map: cloudsTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
      roughness: 0.95
    });
    this.cloudsMesh = new THREE.Mesh(new THREE.SphereGeometry(earthRadiusScene * 1.012, 96, 96), cloudsMat);
    this.earthGroup.add(this.cloudsMesh);

    // Dispersión Atmosférica Rayleigh-Mie Física
    this.atmosphereMesh = new THREE.Mesh(
      new THREE.SphereGeometry(earthRadiusScene * 1.025, 64, 64),
      createAtmosphereMaterial(this.sunDir, earthRadiusScene, earthRadiusScene * 1.025, 0x38bdf8, 0xf97316)
    );
    this.earthGroup.add(this.atmosphereMesh);
    this.scene.add(this.earthGroup);
  }

  private buildMoonSystem() {
    const moonRadiusScene = ASTRO_CONSTANTS.RADIUS_MOON_KM / ASTRO_CONSTANTS.SCENE_SCALE_FACTOR; // 1.737
    this.moonGroup = new THREE.Group();

    const texLoader = new THREE.TextureLoader();
    const moonTex = texLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg');
    moonTex.colorSpace = THREE.SRGBColorSpace;

    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTex,
      roughness: 0.88,
      metalness: 0.04
    });

    this.moonMesh = new THREE.Mesh(new THREE.SphereGeometry(moonRadiusScene, 64, 64), moonMat);
    this.moonGroup.add(this.moonMesh);
    this.raycaster.registerEntity('moon', this.moonMesh, moonRadiusScene * 1.15);
    this.scene.add(this.moonGroup);

    // Trazado Elíptico Kepleriano de la Órbita Lunar
    this.updateMoonOrbitGeometry();
  }

  private updateMoonOrbitGeometry() {
    if (this.moonOrbitLine) {
      this.scene.remove(this.moonOrbitLine);
      this.moonOrbitLine.geometry.dispose();
    }

    const orbitGeo = this.keplerOrbits['moon'].generateOrbitGeometry(180, this.scaleMode);
    const orbitMat = new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.35 });
    this.moonOrbitLine = new THREE.Line(orbitGeo, orbitMat);
    this.scene.add(this.moonOrbitLine);
  }

  private buildSatellites() {
    const satKeys = ['iss', 'hubble', 'landsat', 'jwst'];

    satKeys.forEach(key => {
      const satGroup = new THREE.Group();
      
      // Modelo PBR de Alta Fidelidad mediante ModelLoader
      const model = ModelLoader.buildProceduralPBR(key);
      satGroup.add(model);
      this.raycaster.registerEntity(key, model, 0.45);
      this.scene.add(satGroup);

      // Trazo orbital kepleriano
      const orbGeo = this.keplerOrbits[key].generateOrbitGeometry(120, this.scaleMode);
      const orbLine = new THREE.Line(orbGeo, new THREE.LineBasicMaterial({
        color: key === 'iss' ? 0x38bdf8 : key === 'hubble' ? 0x818cf8 : key === 'landsat' ? 0xfbbf24 : 0xf43f5e,
        transparent: true,
        opacity: 0.3
      }));
      this.scene.add(orbLine);

      this.satellites[key] = {
        group: satGroup,
        mesh: model,
        orbitLine: orbLine
      };
    });
  }

  private setupTargets() {
    const rEarth = ASTRO_CONSTANTS.RADIUS_EARTH_KM / ASTRO_CONSTANTS.SCENE_SCALE_FACTOR;
    
    this.targets = {
      system: {
        key: 'system',
        name: 'Sistema Tierra-Luna (Panorámica)',
        targetPos: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 18.0, 48.0),
        minDistance: 12.0,
        maxDistance: 1200.0
      },
      earth: {
        key: 'earth',
        name: 'Planeta Tierra (Oasis Azul)',
        targetPos: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 2.5, 14.5),
        minDistance: 6.4,
        maxDistance: 120.0
      },
      moon: {
        key: 'moon',
        name: 'La Luna (Superficie y Cráteres)',
        targetPos: new THREE.Vector3(24.0, 0.5, 0),
        cameraOffset: new THREE.Vector3(0, 0.8, 3.8),
        minDistance: 1.75,
        maxDistance: 60.0
      },
      iss: {
        key: 'iss',
        name: 'Estación Espacial Internacional (ISS)',
        targetPos: new THREE.Vector3(rEarth + 0.418, 0, 0),
        cameraOffset: new THREE.Vector3(0, 0.08, 0.45),
        minDistance: 0.005,
        maxDistance: 15.0
      },
      hubble: {
        key: 'hubble',
        name: 'Telescopio Espacial Hubble',
        targetPos: new THREE.Vector3(rEarth + 0.535, 0, 0),
        cameraOffset: new THREE.Vector3(0, 0.06, 0.35),
        minDistance: 0.005,
        maxDistance: 15.0
      },
      landsat: {
        key: 'landsat',
        name: 'Satélite Landsat 9 (Observación Terrestre)',
        targetPos: new THREE.Vector3(rEarth + 0.705, 0, 0),
        cameraOffset: new THREE.Vector3(0, 0.07, 0.4),
        minDistance: 0.005,
        maxDistance: 15.0
      },
      jwst: {
        key: 'jwst',
        name: 'Telescopio James Webb (Punto L2)',
        targetPos: new THREE.Vector3(28.0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 0.1, 0.6),
        minDistance: 0.005,
        maxDistance: 30.0
      },
      eclipses_2026: {
        key: 'eclipses_2026',
        name: 'Eclipses y el Gran Eclipse 2026',
        targetPos: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 3.0, 18.0),
        minDistance: 5.0,
        maxDistance: 150.0
      },
      day_night_rotation: {
        key: 'day_night_rotation',
        name: 'Rotación Terrestre y Husos 24h',
        targetPos: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 2.5, 14.5),
        minDistance: 5.0,
        maxDistance: 120.0
      },
      kepler_orbit: {
        key: 'kepler_orbit',
        name: 'Traslación Anual Kepleriana',
        targetPos: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 8.0, 35.0),
        minDistance: 8.0,
        maxDistance: 300.0
      },
      seasons_obliquity: {
        key: 'seasons_obliquity',
        name: 'Estaciones y Oblicuidad 23,44°',
        targetPos: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 4.0, 20.0),
        minDistance: 5.0,
        maxDistance: 150.0
      },
      oort: {
        key: 'oort',
        name: 'Nube de Oort y Sonda Voyager 1',
        targetPos: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 15.0, 50.0),
        minDistance: 10.0,
        maxDistance: 500.0
      },
      nearbystars: {
        key: 'nearbystars',
        name: 'Estrellas Vecinas y Alfa Centauri',
        targetPos: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 20.0, 60.0),
        minDistance: 10.0,
        maxDistance: 600.0
      },
      milkyway: {
        key: 'milkyway',
        name: 'La Vía Láctea y Sagitario A*',
        targetPos: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 30.0, 90.0),
        minDistance: 15.0,
        maxDistance: 1000.0
      },
      localgroup: {
        key: 'localgroup',
        name: 'El Grupo Local de Galaxias',
        targetPos: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 40.0, 120.0),
        minDistance: 20.0,
        maxDistance: 1500.0
      },
      laniakea: {
        key: 'laniakea',
        name: 'Supercúmulo Laniakea y el Gran Atractor',
        targetPos: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 50.0, 150.0),
        minDistance: 25.0,
        maxDistance: 2000.0
      },
      universe: {
        key: 'universe',
        name: 'El Universo Observable y el CMB',
        targetPos: new THREE.Vector3(0, 0, 0),
        cameraOffset: new THREE.Vector3(0, 60.0, 180.0),
        minDistance: 30.0,
        maxDistance: 3000.0
      }
    };
  }

  public setScaleMode(mode: ScaleMode) {
    this.scaleMode = mode;
    this.updateMoonOrbitGeometry();
    // Actualizar órbitas de satélites
    for (const [key, sat] of Object.entries(this.satellites)) {
      if (sat.orbitLine && this.keplerOrbits[key]) {
        sat.orbitLine.geometry.dispose();
        sat.orbitLine.geometry = this.keplerOrbits[key].generateOrbitGeometry(120, this.scaleMode);
      }
    }
  }

  public setTimeScale(scale: number) {
    this.timeEngine.setTimeScale(scale);
  }

  public togglePause(): boolean {
    return this.timeEngine.togglePause();
  }

  public setDate(date: Date) {
    this.timeEngine.setDate(date);
  }

  public setHistoricEvent(eventId: string): HistoricalEvent | undefined {
    const event = this.timeEngine.setHistoricEvent(eventId);
    if (event && event.focusTarget) {
      this.focusTarget(event.focusTarget);
    }
    return event;
  }

  public focusTarget(key: string, durationSec: number = 2.2) {
    const target = this.targets[key];
    if (!target) return;

    if (key === 'moon') {
      target.targetPos.copy(this.moonGroup.position);
    } else if (this.satellites[key]) {
      target.targetPos.copy(this.satellites[key].group.position);
    }

    this.cameraCtrl.travelTo(target, durationSec);
  }

  public snapToTarget(key: string) {
    this.focusTarget(key, 0.1);
  }

  public flyToLandmark(landmark: Landmark) {
    const lat = landmark.coords?.lat ?? (landmark as any).latitude ?? 0;
    const lon = landmark.coords?.lon ?? (landmark as any).longitude ?? 0;
    const latRad = THREE.MathUtils.degToRad(lat);
    const lonRad = THREE.MathUtils.degToRad(lon);
    
    // Detectar si el landmark pertenece a la Luna o a la Tierra
    const isMoon = landmark.id.includes('apollo') || landmark.id.includes('tycho') || landmark.id.includes('copernicus') || landmark.id.includes('tranquility') || landmark.id.includes('oceanus');
    const radiusScene = isMoon 
      ? ASTRO_CONSTANTS.RADIUS_MOON_KM / ASTRO_CONSTANTS.SCENE_SCALE_FACTOR 
      : ASTRO_CONSTANTS.RADIUS_EARTH_KM / ASTRO_CONSTANTS.SCENE_SCALE_FACTOR;
    
    const parentGroup = isMoon ? this.moonGroup : this.earthGroup;

    const lx = radiusScene * Math.cos(latRad) * Math.sin(lonRad);
    const ly = radiusScene * Math.sin(latRad);
    const lz = radiusScene * Math.cos(latRad) * Math.cos(lonRad);

    const surfacePoint = new THREE.Vector3(lx, ly, lz);
    const worldTarget = surfacePoint.clone().applyQuaternion(parentGroup.quaternion).add(parentGroup.position);
    const normal = surfacePoint.clone().applyQuaternion(parentGroup.quaternion).normalize();
    const cameraOffset = normal.multiplyScalar(isMoon ? 0.75 : 2.4);

    this.cameraCtrl.travelTo({
      key: `landmark_${landmark.id}`,
      name: landmark.name,
      targetPos: worldTarget,
      cameraOffset: cameraOffset,
      minDistance: 0.02,
      maxDistance: 25.0
    }, 2.4);
  }

  public focusLandmark(landmark: Landmark) {
    this.flyToLandmark(landmark);
  }

  public loadSceneModule(sceneModule: any) {
    if (this.activeSceneModule && typeof this.activeSceneModule.teardown === 'function') {
      try {
        this.activeSceneModule.teardown();
      } catch (err) {
        console.warn('Error in scene teardown:', err);
      }
    }

    this.activeSceneModule = sceneModule;

    // Si la escena activa es la 1 (Tierra maestra), mostrar la Tierra del motor.
    // Para las demás escenas (Eclipses, Día/Noche, Órbita, etc.), ocultarla para que cada módulo gestione sus propios astros sin solapamiento
    const showEngineEarth = !sceneModule || sceneModule.id === 1;
    this.earthGroup.visible = showEngineEarth;
    this.moonGroup.visible = showEngineEarth;
    Object.values(this.satellites).forEach(s => {
      s.group.visible = showEngineEarth;
      if (s.orbitLine) s.orbitLine.visible = showEngineEarth;
    });

    if (sceneModule && typeof sceneModule.build === 'function') {
      try {
        sceneModule.build({
          scene: this.scene,
          camera: this.cameraCtrl.camera,
          renderer: this.renderer,
          controls: this.cameraCtrl.controls,
          onSelectTarget: (key: string) => this.focusTarget(key),
          snapCamera: (x: number, y: number, z: number, tx = 0, ty = 0, tz = 0) => {
            this.cameraCtrl.camera.position.set(x, y, z);
            this.cameraCtrl.controls.target.set(tx, ty, tz);
            this.cameraCtrl.controls.update();
          }
        });
      } catch (err) {
        console.warn(`Error building scene ${sceneModule.id}:`, err);
      }
    }
  }

  private animate() {
    this.animFrameId = requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.1);
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Actualizar Entorno Estelar Fotorrealista (Corona Solar y Estrellas)
    if (this.stellarSky) {
      this.stellarSky.update(dt);
    }
    this.pinManager.update(elapsedTime, this.cameraCtrl.camera);

    // 1.1 Actualizar Módulo de Escena Cósmica Activa (si existe)
    if (this.activeSceneModule && typeof this.activeSceneModule.update === 'function') {
      this.activeSceneModule.update(dt, elapsedTime);
    }

    // 2. Actualizar Motor de Tiempo Cósmico
    const simDate = this.timeEngine.update(dt);

    // 3. Rotación Terrestre dependiente de la hora UTC real
    const jd = KeplerOrbit.dateToJulianDate(simDate);
    const siderealTimeRad = (jd % 1.0) * Math.PI * 2;
    if (this.earthMesh) this.earthMesh.rotation.y = siderealTimeRad;
    if (this.cloudsMesh) this.cloudsMesh.rotation.y = siderealTimeRad * 1.08;

    // 4. Propagación Kepleriana de la Luna
    const moonState = this.keplerOrbits['moon'].getStateAtDate(simDate);
    const moonScenePos = AstroMath.toSceneCoords(moonState.position, this.scaleMode);
    this.moonGroup.position.set(moonScenePos.x, moonScenePos.y, moonScenePos.z);
    if (this.moonMesh) {
      // Bloqueo de marea: rotación igual a la anomalía verdadera
      this.moonMesh.rotation.y = THREE.MathUtils.degToRad(moonState.trueAnomalyDeg);
    }

    // 4. Propagación Kepleriana de Satélites
    for (const [key, sat] of Object.entries(this.satellites)) {
      if (!this.keplerOrbits[key]) continue;
      const state = this.keplerOrbits[key].getStateAtDate(simDate);
      const scenePos = AstroMath.toSceneCoords(state.position, this.scaleMode);
      sat.group.position.set(scenePos.x, scenePos.y, scenePos.z);

      if (this.cameraCtrl.getCurrentFocus() === key) {
        this.targets[key].targetPos.copy(sat.group.position);
      }
    }

    // 5. Actualizar Cámara y Floating Origin
    const isTraveling = this.cameraCtrl.update(dt);

    // 6. Emitir Telemetría
    if (this.onTelemetryUpdate) {
      const currentFocusKey = this.cameraCtrl.getCurrentFocus();
      const distScene = this.cameraCtrl.getDistanceToTarget();
      const distKm = distScene * ASTRO_CONSTANTS.SCENE_SCALE_FACTOR;
      
      let altKm = 0;
      let velKms = 0;
      let periodMin = 0;
      let targetName = 'Espacio Profundo';

      if (this.targets[currentFocusKey]) {
        targetName = this.targets[currentFocusKey].name;
      }

      if (this.keplerOrbits[currentFocusKey]) {
        const state = this.keplerOrbits[currentFocusKey].getStateAtDate(simDate);
        altKm = state.radiusKm - ASTRO_CONSTANTS.RADIUS_EARTH_KM;
        velKms = state.velocity.y;
        periodMin = this.keplerOrbits[currentFocusKey].elements.orbitalPeriodDays * 1440.0;
      } else if (currentFocusKey === 'moon') {
        altKm = moonState.radiusKm;
        velKms = moonState.velocity.y;
        periodMin = 39343.0;
      }

      this.onTelemetryUpdate({
        targetKey: currentFocusKey,
        targetName,
        distanceKm: distKm,
        altitudeKm: altKm,
        velocityKms: velKms,
        orbitalPeriodMin: periodMin,
        scaleMode: this.scaleMode,
        isTraveling,
        simDateFormatted: this.timeEngine.formatUTC(),
        timeScale: this.timeEngine.timeScale,
        isPaused: this.timeEngine.isPaused
      });
    }

    // 7. Renderizar escena
    this.renderer.render(this.scene, this.cameraCtrl.camera);
  }

  private onResize() {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.cameraCtrl.resize(w, h);
  }

  public dispose() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    window.removeEventListener('resize', this.onResize);
    this.resizeObserver?.disconnect();
    this.raycaster.dispose();
    this.cameraCtrl.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
