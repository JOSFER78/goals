/**
 * src/core/3d/generators/Omni3DProceduralFactory.ts
 * Motor Generador 3D Procedural en Three.js con Sombreadores Físicos PBR Reales
 * Entidades: Sol SDO Volumétrico (Arcos Magnéticos 3D), Astronauta NASA EVA, Rover Marciano Perseverance, Tierra Realista con Continentes y Nubes, Corazón Anatómico, Átomo Cuántico.
 */

import * as THREE from 'three';
import { createEarthPBRMaterial } from '../shaders/PlanetSurfaceShader';
import { createAtmosphereMaterial } from '../shaders/AtmosphereShader';

/* =========================================================================
   1. TEXTURIZADOR FOTOSFÉRICO SOLAR ULTRA-HD CON MAPA DE NORMALES (SOBEL)
   ========================================================================= */

export function createSunProceduralTextures(): {
  diffuseMap: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  emissiveMap: THREE.CanvasTexture;
} {
  const width = 2048;
  const height = 1024;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const normCanvas = document.createElement('canvas');
  normCanvas.width = width;
  normCanvas.height = height;
  const nCtx = normCanvas.getContext('2d')!;

  // Gradiente base fotosférico
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0.0, '#ff3b00');
  grad.addColorStop(0.2, '#ff6a00');
  grad.addColorStop(0.5, '#ffa812');
  grad.addColorStop(0.8, '#ff6a00');
  grad.addColorStop(1.0, '#ff3b00');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const imgData = ctx.getImageData(0, 0, width, height);
  const nImgData = nCtx.createImageData(width, height);
  const heightMap = new Float32Array(width * height);

  // Generador de Ruido Granular Convectivo de Células de Bénard (Turbulencia Multi-Octava)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;

      const n1 = Math.sin(x * 0.08) * Math.cos(y * 0.08);
      const n2 = Math.sin(x * 0.22 + n1 * 3.0) * Math.cos(y * 0.22);
      const n3 = Math.sin(x * 0.65) * Math.cos(y * 0.65) * 0.5;
      const gran = (n1 * 0.5 + n2 * 0.35 + n3 * 0.15 + (Math.random() - 0.5) * 0.1);
      
      heightMap[idx] = gran;

      const pIdx = idx * 4;
      const baseR = 255;
      const baseG = Math.floor(THREE.MathUtils.clamp(140 + gran * 90, 80, 240));
      const baseB = Math.floor(THREE.MathUtils.clamp(20 + gran * 50, 0, 110));

      imgData.data[pIdx] = baseR;
      imgData.data[pIdx + 1] = baseG;
      imgData.data[pIdx + 2] = baseB;
      imgData.data[pIdx + 3] = 255;
    }
  }

  // Manchas Solares con Umbra y Penumbra Filamentosa Magnética
  const sunspots = [
    { x: 550, y: 440, r: 42 },
    { x: 620, y: 460, r: 28 },
    { x: 1380, y: 580, r: 52 },
    { x: 1460, y: 560, r: 34 },
    { x: 920, y: 490, r: 22 }
  ];

  ctx.putImageData(imgData, 0, 0);

  // Pintar manchas magnéticas y faculae brillantes
  sunspots.forEach(sp => {
    // 1. Faculae periféricas (>6.200 K)
    const fGrad = ctx.createRadialGradient(sp.x, sp.y, sp.r * 0.9, sp.x, sp.y, sp.r * 1.6);
    fGrad.addColorStop(0.0, 'rgba(255, 255, 220, 0.7)');
    fGrad.addColorStop(0.5, 'rgba(255, 200, 100, 0.3)');
    fGrad.addColorStop(1.0, 'transparent');
    ctx.fillStyle = fGrad;
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, sp.r * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // 2. Penumbra magnética (3.900 K)
    const pGrad = ctx.createRadialGradient(sp.x, sp.y, sp.r * 0.3, sp.x, sp.y, sp.r);
    pGrad.addColorStop(0.0, '#3a0800');
    pGrad.addColorStop(0.7, '#7a1900');
    pGrad.addColorStop(1.0, 'transparent');
    ctx.fillStyle = pGrad;
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
    ctx.fill();

    // 3. Umbra profunda (3.000 K)
    ctx.fillStyle = '#140100';
    ctx.beginPath();
    ctx.arc(sp.x, sp.y, sp.r * 0.42, 0, Math.PI * 2);
    ctx.fill();
  });

  // Generación de Normal Map mediante Sobel Filter sobre el mapa de convección
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const xLeft = y * width + (x > 0 ? x - 1 : width - 1);
      const xRight = y * width + (x < width - 1 ? x + 1 : 0);
      const yUp = (y > 0 ? y - 1 : height - 1) * width + x;
      const yDown = (y < height - 1 ? y + 1 : 0) * width + x;

      const dX = (heightMap[xRight] - heightMap[xLeft]) * 2.5;
      const dY = (heightMap[yDown] - heightMap[yUp]) * 2.5;
      const dZ = 1.0;

      const len = Math.sqrt(dX * dX + dY * dY + dZ * dZ);
      const nX = (dX / len) * 0.5 + 0.5;
      const nY = (dY / len) * 0.5 + 0.5;
      const nZ = (dZ / len) * 0.5 + 0.5;

      const pIdx = idx * 4;
      nImgData.data[pIdx] = Math.floor(nX * 255);
      nImgData.data[pIdx + 1] = Math.floor(nY * 255);
      nImgData.data[pIdx + 2] = Math.floor(nZ * 255);
      nImgData.data[pIdx + 3] = 255;
    }
  }
  nCtx.putImageData(nImgData, 0, 0);

  const diffuseMap = new THREE.CanvasTexture(canvas);
  diffuseMap.colorSpace = THREE.SRGBColorSpace;
  diffuseMap.wrapS = THREE.RepeatWrapping;
  diffuseMap.wrapT = THREE.ClampToEdgeWrapping;

  const normalMap = new THREE.CanvasTexture(normCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.ClampToEdgeWrapping;

  return { diffuseMap, normalMap, emissiveMap: diffuseMap };
}

/* =========================================================================
   2. TEXTURIZADOR REALISTA DEL PLANETA TIERRA (OCÉANOS, CONTINENTES, CASQUETES)
   ========================================================================= */

export function createEarthProceduralTextures(): {
  diffuseMap: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  cloudsMap: THREE.CanvasTexture;
} {
  const width = 2048;
  const height = 1024;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = width;
  cloudCanvas.height = height;
  const cCtx = cloudCanvas.getContext('2d')!;

  // 1. Océanos profundos
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0.0, '#0a2540');
  oceanGrad.addColorStop(0.5, '#0d3868');
  oceanGrad.addColorStop(1.0, '#0a2540');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Continentes proceduales mediante ruido armónico
  const imgData = ctx.getImageData(0, 0, width, height);
  const cloudData = cCtx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    const lat = ((y / height) - 0.5) * Math.PI;
    for (let x = 0; x < width; x++) {
      const lon = (x / width) * Math.PI * 2;
      const idx = (y * width + x) * 4;

      // Armónicos esféricos simulados
      const landNoise = Math.sin(lon * 2.0) * Math.cos(lat * 1.5) 
                      + Math.sin(lon * 3.5 + 1.2) * Math.sin(lat * 2.5) * 0.6
                      + Math.cos(lon * 5.0 - lat * 4.0) * 0.35;

      const isPole = Math.abs(lat) > 1.25;

      if (isPole) {
        // Casquetes polares glaciares
        imgData.data[idx] = 240;
        imgData.data[idx + 1] = 248;
        imgData.data[idx + 2] = 255;
      } else if (landNoise > 0.18) {
        // Masas continentales (Bosques, vegetación, sabana)
        const vegetation = (landNoise - 0.18) * 2.0;
        imgData.data[idx] = Math.floor(THREE.MathUtils.clamp(45 + vegetation * 40, 20, 110));
        imgData.data[idx + 1] = Math.floor(THREE.MathUtils.clamp(120 + vegetation * 50, 70, 170));
        imgData.data[idx + 2] = Math.floor(THREE.MathUtils.clamp(40 + vegetation * 20, 20, 80));
      }

      // Nubes espirales troposféricas
      const cloudNoise = Math.sin(lon * 4.0 + lat * 2.0) * Math.cos(lat * 3.0 + lon * 2.0)
                       + Math.sin(lon * 8.0) * 0.4;
      const cloudAlpha = Math.floor(THREE.MathUtils.clamp((cloudNoise - 0.15) * 350, 0, 255));

      cloudData.data[idx] = 255;
      cloudData.data[idx + 1] = 255;
      cloudData.data[idx + 2] = 255;
      cloudData.data[idx + 3] = cloudAlpha;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  cCtx.putImageData(cloudData, 0, 0);

  const diffuseMap = new THREE.CanvasTexture(canvas);
  diffuseMap.colorSpace = THREE.SRGBColorSpace;
  diffuseMap.wrapS = THREE.RepeatWrapping;

  const cloudsMap = new THREE.CanvasTexture(cloudCanvas);
  cloudsMap.colorSpace = THREE.SRGBColorSpace;
  cloudsMap.wrapS = THREE.RepeatWrapping;

  return { diffuseMap, normalMap: diffuseMap, cloudsMap };
}

/* =========================================================================
   3. FÁBRICA DEL SOL ESPECTACULAR: ARCOS MAGNÉTICOS 3D, PROMINENCIAS Y CORONA
   ========================================================================= */

export function createSpectacularSunModel(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'Spectacular_Sun_SDO';
  const sunRadius = 2.4;

  const { diffuseMap, normalMap, emissiveMap } = createSunProceduralTextures();

  // 1. Fotosfera con Normal Map y Brillo de Plasma
  const sunGeo = new THREE.SphereGeometry(sunRadius, 128, 128);
  const sunMat = new THREE.MeshStandardMaterial({
    map: diffuseMap,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.85, 0.85),
    emissiveMap: emissiveMap,
    emissive: new THREE.Color(0xff4d00),
    emissiveIntensity: 1.25,
    roughness: 0.45,
    metalness: 0.15
  });

  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  root.add(sunMesh);

  // 2. Bucles Coronales 3D Reales (Líneas de Campo Magnético Tubulares)
  const loopGroup = new THREE.Group();
  loopGroup.name = 'CoronalLoops';
  const loopPairs = [
    { start: new THREE.Vector3(1.8, 0.8, 1.3), end: new THREE.Vector3(1.4, 0.9, 1.7), height: 3.2, color: 0xffaa33, rad: 0.024 },
    { start: new THREE.Vector3(1.7, 0.7, 1.4), end: new THREE.Vector3(1.3, 1.1, 1.6), height: 3.4, color: 0xff5500, rad: 0.018 },
    { start: new THREE.Vector3(1.9, 0.6, 1.2), end: new THREE.Vector3(1.5, 0.7, 1.8), height: 3.0, color: 0xffdd44, rad: 0.020 },
    { start: new THREE.Vector3(-1.6, -0.6, 1.6), end: new THREE.Vector3(-1.2, -0.9, 1.8), height: 3.1, color: 0xff3b00, rad: 0.022 },
    { start: new THREE.Vector3(-1.5, -0.5, 1.7), end: new THREE.Vector3(-1.1, -0.8, 1.9), height: 3.3, color: 0xff8800, rad: 0.019 },
    { start: new THREE.Vector3(0.5, 2.0, 1.1), end: new THREE.Vector3(0.9, 1.8, 1.3), height: 3.15, color: 0xff6600, rad: 0.021 }
  ];

  loopPairs.forEach(lp => {
    const v1 = lp.start.clone().normalize().multiplyScalar(sunRadius);
    const v2 = lp.end.clone().normalize().multiplyScalar(sunRadius);
    const mid = v1.clone().add(v2).multiplyScalar(0.5).normalize().multiplyScalar(lp.height);

    const curve = new THREE.CatmullRomCurve3([
      v1,
      v1.clone().lerp(mid, 0.5).add(new THREE.Vector3(0, 0.1, 0)),
      mid,
      v2.clone().lerp(mid, 0.5).add(new THREE.Vector3(0, 0.1, 0)),
      v2
    ]);

    const tubeGeo = new THREE.TubeGeometry(curve, 48, lp.rad, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(lp.color),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const loopMesh = new THREE.Mesh(tubeGeo, tubeMat);
    loopGroup.add(loopMesh);
  });
  root.add(loopGroup);

  // 3. Erupciones y Prominencias Solares 3D (Extrusión de Plasma Ionizado)
  const prominenceGroup = new THREE.Group();
  prominenceGroup.name = 'Prominences';
  for (let p = 0; p < 8; p++) {
    const angle = (p / 8) * Math.PI * 2;
    const baseDir = new THREE.Vector3(Math.cos(angle), (Math.random() - 0.5) * 0.6, Math.sin(angle)).normalize();
    const pStart = baseDir.clone().multiplyScalar(sunRadius);
    const pEnd = baseDir.clone().multiplyScalar(sunRadius + 0.45 + Math.random() * 0.35);
    const pMid = baseDir.clone().multiplyScalar(sunRadius + 0.25).add(new THREE.Vector3((Math.random() - 0.5) * 0.3, 0.2, (Math.random() - 0.5) * 0.3));

    const pCurve = new THREE.CatmullRomCurve3([pStart, pMid, pEnd]);
    const pGeo = new THREE.TubeGeometry(pCurve, 24, 0.035, 6, false);
    const pMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(p % 2 === 0 ? 0xff2200 : 0xff7700),
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    prominenceGroup.add(new THREE.Mesh(pGeo, pMat));
  }
  root.add(prominenceGroup);

  // 4. Sistema de Partículas de Viento Solar y Plasma Coronal
  const particleCount = 4500;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const col1 = new THREE.Color(0xff4400);
  const col2 = new THREE.Color(0xffbb22);
  const col3 = new THREE.Color(0xffffff);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const r = sunRadius + 0.05 + Math.pow(Math.random(), 2.0) * 1.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);

    const mixCol = Math.random() < 0.6 ? col1.clone().lerp(col2, Math.random()) : col2.clone().lerp(col3, Math.random());
    colors[i3] = mixCol.r;
    colors[i3 + 1] = mixCol.g;
    colors[i3 + 2] = mixCol.b;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  particleSystem.name = 'SolarWind';
  root.add(particleSystem);

  // 5. Corona Solar Multicapa con Resplandor Fresnel
  const coronaGeo = new THREE.SphereGeometry(sunRadius * 1.18, 64, 64);
  const coronaMat = new THREE.ShaderMaterial({
    uniforms: {
      innerColor: { value: new THREE.Color(0xffcc33) },
      outerColor: { value: new THREE.Color(0xff2200) }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 innerColor;
      uniform vec3 outerColor;
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        float fresnel = pow(1.0 - abs(vNormal.z), 2.2);
        vec3 finalColor = mix(outerColor, innerColor, fresnel * 0.8);
        gl_FragColor = vec4(finalColor * 2.5, fresnel * 0.9);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
  });

  root.add(new THREE.Mesh(coronaGeo, coronaMat));
  return root;
}

/* =========================================================================
   4. GENERADOR UNIVERSAL DE ENTIDADES Y MUNDOS 3D PROCEDURALES
   ========================================================================= */

export class Omni3DProceduralFactory {

  /**
   * 👨‍🚀 Genera el Astronauta NASA con Traje EVA y Visor Reflectante de Oro
   */
  public static createAstronaut(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Astronaut_EVA';

    // Materiales PBR
    const goldVisorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffb800),
      metalness: 1.0,
      roughness: 0.04,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      envMapIntensity: 2.8
    });

    const suitMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xf1f5f9),
      roughness: 0.55,
      metalness: 0.10
    });

    const jointMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x334155),
      roughness: 0.45,
      metalness: 0.40
    });

    const plssBackpackMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xe2e8f0),
      roughness: 0.35,
      metalness: 0.25
    });

    const ringRedMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8, roughness: 0.2 });
    const ringBlueMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8, roughness: 0.2 });
    const darkDetailsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });

    // 1. Casco EMU y Visor Bañado en Oro
    const helmetGroup = new THREE.Group();
    const helmetBase = new THREE.Mesh(new THREE.SphereGeometry(0.38, 32, 32), suitMat);
    helmetGroup.add(helmetBase);

    const visorGeo = new THREE.SphereGeometry(0.34, 32, 32, 0, Math.PI, 0, Math.PI * 0.65);
    const visorMesh = new THREE.Mesh(visorGeo, goldVisorMat);
    visorMesh.rotation.x = Math.PI * 0.15;
    visorMesh.rotation.y = Math.PI / 2;
    visorMesh.position.set(0, 0.02, 0.08);
    helmetGroup.add(visorMesh);

    // Focos del casco (EVA Lights)
    [-0.32, 0.32].forEach(lx => {
      const lightMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.12), darkDetailsMat);
      lightMesh.position.set(lx, 0.12, 0.15);
      helmetGroup.add(lightMesh);
    });

    helmetGroup.position.set(0, 1.45, 0);
    group.add(helmetGroup);

    // 2. Torso y Unidad DCM de Pecho
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 0.95, 24), suitMat);
    torso.position.set(0, 0.75, 0);
    group.add(torso);

    const dcmBox = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 0.12), plssBackpackMat);
    dcmBox.position.set(0, 0.85, 0.26);
    group.add(dcmBox);

    // 3. Mochila de Soporte Vital PLSS & SAFER
    const plss = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.98, 0.34), plssBackpackMat);
    plss.position.set(0, 0.82, -0.32);
    group.add(plss);

    // 4. Brazos y Guantes con Anillos de Bloqueo
    [-0.55, 0.55].forEach((ax, idx) => {
      const armGroup = new THREE.Group();
      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.11, 0.5, 16), suitMat);
      upperArm.position.y = -0.25;
      armGroup.add(upperArm);

      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), jointMat);
      elbow.position.y = -0.52;
      armGroup.add(elbow);

      const foreArm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.10, 0.45, 16), suitMat);
      foreArm.position.y = -0.76;
      armGroup.add(foreArm);

      const lockRing = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.02, 12, 24), idx === 0 ? ringRedMat : ringBlueMat);
      lockRing.rotation.x = Math.PI / 2;
      lockRing.position.y = -0.98;
      armGroup.add(lockRing);

      const glove = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.20, 0.10), darkDetailsMat);
      glove.position.y = -1.10;
      armGroup.add(glove);

      armGroup.position.set(ax, 1.15, 0);
      armGroup.rotation.z = idx === 0 ? 0.2 : -0.2;
      group.add(armGroup);
    });

    // 5. Piernas y Botas Lunares
    [-0.24, 0.24].forEach(lx => {
      const legGroup = new THREE.Group();
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.13, 0.65, 16), suitMat);
      thigh.position.y = -0.32;
      legGroup.add(thigh);

      const knee = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), jointMat);
      knee.position.y = -0.66;
      legGroup.add(knee);

      const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.12, 0.62, 16), suitMat);
      shin.position.y = -0.98;
      legGroup.add(shin);

      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.38), darkDetailsMat);
      boot.position.set(0, -1.34, 0.08);
      legGroup.add(boot);

      legGroup.position.set(lx, 0.28, 0);
      group.add(legGroup);
    });

    group.scale.setScalar(1.2);
    return group;
  }

  /**
   * 🤖 Genera el Rover Marciano Perseverance con Suspensión Rocker-Bogie y Mástil
   */
  public static createMarsRover(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Mars_Rover_Perseverance';

    const chassisMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.25 });
    const goldFoilMat = new THREE.MeshPhysicalMaterial({ color: 0xffa500, metalness: 0.95, roughness: 0.12, clearcoat: 0.6 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.90, roughness: 0.35 });
    const armMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
    const cameraMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9, roughness: 0.2 });

    // Chasis principal y manta de aislamiento térmico
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 1.2), chassisMat);
    body.position.set(0, 0.85, 0);
    group.add(body);

    const goldTop = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.9), goldFoilMat);
    goldTop.position.set(0, 1.22, 0);
    group.add(goldTop);

    // Mástil de Cámaras Mastcam-Z & SuperCam
    const mastPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.3, 16), armMat);
    mastPole.position.set(0.65, 1.85, 0.4);
    group.add(mastPole);

    const mastHead = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.28), cameraMat);
    mastHead.position.set(0.65, 2.5, 0.4);
    group.add(mastHead);

    // Brazo Robótico Frontal
    const armBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 12), armMat);
    armBase.position.set(1.05, 0.85, -0.3);
    armBase.rotation.z = -Math.PI * 0.35;
    group.add(armBase);

    // 6 Ruedas de Aluminio Estriadas
    const wheelPositions = [
      { x: 1.15, y: 0.35, z: 1.0 },
      { x: -1.15, y: 0.35, z: 1.0 },
      { x: 1.25, y: 0.35, z: 0.0 },
      { x: -1.25, y: 0.35, z: 0.0 },
      { x: 1.15, y: 0.35, z: -1.0 },
      { x: -1.15, y: 0.35, z: -1.0 }
    ];

    wheelPositions.forEach(wp => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.28, 24), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wp.x, wp.y, wp.z);
      group.add(wheel);

      const bogieStrut = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.65, 12), armMat);
      bogieStrut.position.set(wp.x * 0.75, wp.y + 0.28, wp.z * 0.65);
      bogieStrut.rotation.z = wp.x > 0 ? -Math.PI * 0.2 : Math.PI * 0.2;
      group.add(bogieStrut);
    });

    group.scale.setScalar(1.1);
    return group;
  }

  /**
   * 🌍 Genera el Planeta Tierra con Océanos PBR, Continentes NASA Blue Marble 4K, Nubes y Atmósfera Rayleigh
   */
  public static createEarth(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Planet_Earth';
    const earthRadius = 2.4;
    const texLoader = new THREE.TextureLoader();

    // 1. Texturas Satelitales Oficiales de la NASA (Blue Marble Vibrant HD)
    const dayTex = texLoader.load('/downloads/datasets/earth/textures/earth_day_2048.jpg');
    dayTex.colorSpace = THREE.SRGBColorSpace;
    dayTex.anisotropy = 16;

    const nightTex = texLoader.load('/downloads/datasets/earth/textures/earth_night_2048.png');
    nightTex.colorSpace = THREE.SRGBColorSpace;
    nightTex.anisotropy = 16;

    const specTex = texLoader.load('/downloads/datasets/earth/textures/earth_specular_2048.jpg');
    specTex.anisotropy = 16;

    const normalTex = texLoader.load('/downloads/datasets/earth/textures/earth_normal_2048.jpg');
    normalTex.anisotropy = 16;

    const cloudsTex = texLoader.load('/downloads/datasets/earth/textures/earth_clouds_1024.png');
    cloudsTex.anisotropy = 16;

    const sunDir = new THREE.Vector3(1.2, 0.35, 1.0).normalize();

    // 2. Superficie Terrestre (Shader GLSL Físico PBR: Día + Luces Nocturnas VIIRS + Especular Oceánico + Banda Crepuscular Ámbar)
    const earthGeo = new THREE.SphereGeometry(earthRadius, 128, 128);
    const earthMat = createEarthPBRMaterial(dayTex, nightTex, specTex, sunDir, normalTex, cloudsTex);
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    group.add(earthMesh);

    // 3. Capa Esférica de Nubes Dinámicas
    const cloudGeo = new THREE.SphereGeometry(earthRadius + 0.016, 128, 128);
    const cloudMat = new THREE.MeshStandardMaterial({
      map: cloudsTex,
      transparent: true,
      opacity: 0.78,
      roughness: 0.95,
      blending: THREE.NormalBlending,
      depthWrite: false
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    cloudMesh.name = 'EarthClouds';
    group.add(cloudMesh);

    // 4. Atmósfera con Dispersión Rayleigh Física Fina
    const atmoMesh = new THREE.Mesh(
      new THREE.SphereGeometry(earthRadius * 1.018, 96, 96),
      createAtmosphereMaterial(sunDir, earthRadius, earthRadius * 1.018, 0x3b82f6, 0xf97316)
    );
    atmoMesh.name = 'EarthAtmosphere';
    group.add(atmoMesh);

    // 5. SISTEMA DE SATÉLITES ARTIFICIALES & CONSTELACIÓN ORBITAL
    const satGroup = new THREE.Group();
    satGroup.name = 'SatellitesAndOrbits';

    // A) Estación Espacial Internacional (ISS) - Órbita LEO (51.6° de inclinación)
    const issOrbitGeo = new THREE.RingGeometry(2.61, 2.63, 64);
    const issOrbitMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, side: THREE.DoubleSide });
    const issOrbitMesh = new THREE.Mesh(issOrbitGeo, issOrbitMat);
    issOrbitMesh.rotation.x = Math.PI / 2 + 0.90; // 51.6°
    issOrbitMesh.name = 'ISS_OrbitLine';
    satGroup.add(issOrbitMesh);

    const issSubGroup = new THREE.Group();
    issSubGroup.position.set(1.9, 1.4, 0.9);
    const issBody = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 12), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.1 }));
    issBody.rotation.z = Math.PI / 2;
    issSubGroup.add(issBody);
    const issPanels = new THREE.Mesh(new THREE.BoxGeometry(0.005, 0.18, 0.08), new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.8 }));
    issSubGroup.add(issPanels);
    issSubGroup.name = 'ISS_SatelliteModel';
    satGroup.add(issSubGroup);

    // B) Telescopio Espacial Hubble (HST) - Órbita LEO (28.5° de inclinación)
    const hubbleOrbitGeo = new THREE.RingGeometry(2.68, 2.70, 64);
    const hubbleOrbitMat = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
    const hubbleOrbitMesh = new THREE.Mesh(hubbleOrbitGeo, hubbleOrbitMat);
    hubbleOrbitMesh.rotation.x = Math.PI / 2 + 0.50; // 28.5°
    hubbleOrbitMesh.name = 'Hubble_OrbitLine';
    satGroup.add(hubbleOrbitMesh);

    const hubbleSubGroup = new THREE.Group();
    hubbleSubGroup.position.set(-2.2, 0.8, 1.2);
    const hstCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.09, 12), new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.95, roughness: 0.15 }));
    hubbleSubGroup.add(hstCyl);
    hubbleSubGroup.name = 'Hubble_SatelliteModel';
    satGroup.add(hubbleSubGroup);

    // C) Constelación GPS (MEO: 20.200 km / 55° de inclinación en 3 planos)
    [-0.5, 0, 0.5].forEach((rotY, pIdx) => {
      const gpsGeo = new THREE.RingGeometry(3.30, 3.315, 64);
      const gpsMat = new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
      const gpsMesh = new THREE.Mesh(gpsGeo, gpsMat);
      gpsMesh.rotation.x = Math.PI / 2 + 0.96;
      gpsMesh.rotation.y = rotY;
      satGroup.add(gpsMesh);

      // Satélites GPS baliza
      const gpsSat = new THREE.Mesh(
        new THREE.SphereGeometry(0.025, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xa5b4fc })
      );
      const ang = (pIdx * Math.PI * 2) / 3 + 0.8;
      gpsSat.position.set(Math.cos(ang) * 3.3, Math.sin(ang) * 0.8, Math.sin(ang) * 2.8);
      satGroup.add(gpsSat);
    });

    // D) Cinturón Geoestacionario (GEO: 35.786 km)
    const geoOrbitGeo = new THREE.RingGeometry(4.20, 4.22, 64);
    const geoOrbitMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.30, side: THREE.DoubleSide });
    const geoOrbitMesh = new THREE.Mesh(geoOrbitGeo, geoOrbitMat);
    geoOrbitMesh.rotation.x = Math.PI / 2;
    geoOrbitMesh.name = 'Geostationary_Ring';
    satGroup.add(geoOrbitMesh);

    group.add(satGroup);

    // 6. SISTEMA LUNAR (LUNA & ÓRBITA LUNAR)
    const moonGroup = new THREE.Group();
    moonGroup.name = 'MoonSystem';

    // Órbita elíptica de la Luna (5.14° de inclinación respecto a la eclíptica)
    const moonOrbitGeo = new THREE.RingGeometry(5.40, 5.42, 64);
    const moonOrbitMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
    const moonOrbitMesh = new THREE.Mesh(moonOrbitGeo, moonOrbitMat);
    moonOrbitMesh.rotation.x = Math.PI / 2 + 0.09;
    moonGroup.add(moonOrbitMesh);

    // Cuerpo esférico de la Luna
    const moonGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.92,
      metalness: 0.1
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(4.8, 0.4, 2.4);
    moonMesh.name = 'Moon_CelestialBody';
    moonGroup.add(moonMesh);

    group.add(moonGroup);

    // 7. BALIZAS Y PINES DE SUPERFICIE HISTÓRICOS Y CIENTÍFICOS
    const landmarksGroup = new THREE.Group();
    landmarksGroup.name = 'EarthSurfaceLandmarks';

    const landmarks = [
      { name: 'Cabo Cañaveral (KSC)', lat: 28.5, lon: -80.6, color: 0x38bdf8 },
      { name: 'Cráter de Chicxulub', lat: 21.4, lon: -89.5, color: 0xf87171 },
      { name: 'Cosmódromo de Baikonur', lat: 45.9, lon: 63.3, color: 0x34d399 },
      { name: 'Centro Espacial de Kourou', lat: 5.2, lon: -52.8, color: 0xfbbf24 },
      { name: 'Telescopio VLT Paranal', lat: -24.6, lon: -70.4, color: 0xa78bfa },
      { name: 'CERN Gran Colisionador LHC', lat: 46.2, lon: 6.0, color: 0x38bdf8 },
      { name: 'Monte Everest', lat: 27.9, lon: 86.9, color: 0xe2e8f0 }
    ];

    landmarks.forEach(lm => {
      const phi = (90 - lm.lat) * (Math.PI / 180);
      const theta = (lm.lon + 180) * (Math.PI / 180);
      const r = earthRadius + 0.035;

      const px = -(r * Math.sin(phi) * Math.cos(theta));
      const pz = r * Math.sin(phi) * Math.sin(theta);
      const py = r * Math.cos(phi);

      const pinSubGroup = new THREE.Group();
      pinSubGroup.position.set(px, py, pz);
      pinSubGroup.name = lm.name;

      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.032, 12, 12),
        new THREE.MeshBasicMaterial({ color: lm.color })
      );
      pinSubGroup.add(dot);

      const stalk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, 0.08, 8),
        new THREE.MeshBasicMaterial({ color: lm.color, transparent: true, opacity: 0.85 })
      );
      stalk.position.y = 0.04;
      pinSubGroup.add(stalk);

      landmarksGroup.add(pinSubGroup);
    });

    group.add(landmarksGroup);

    return group;
  }

  /**
   * 🫀 Genera el Corazón Humano con Vasos y Animación de Pulsación
   */
  public static createHumanHeart(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Human_Heart';

    const muscleMat = new THREE.MeshPhysicalMaterial({ 
      color: new THREE.Color(0xb91c1c), 
      roughness: 0.45, 
      metalness: 0.05,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2
    });
    const aortaMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0xdc2626), roughness: 0.35, metalness: 0.1 });
    const veinMat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(0x2563eb), roughness: 0.35, metalness: 0.1 });

    const ventricles = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), muscleMat);
    ventricles.scale.set(0.9, 1.25, 0.85);
    ventricles.name = 'HeartVentricles';
    group.add(ventricles);

    const aortaCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 1.0, 0),
      new THREE.Vector3(0.3, 1.9, 0),
      new THREE.Vector3(-0.5, 1.9, 0),
      new THREE.Vector3(-0.4, 0.9, -0.2)
    );
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 24, 0.22, 16, false);
    group.add(new THREE.Mesh(aortaGeo, aortaMat));

    const venaCava = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.2, 16), veinMat);
    venaCava.position.set(0.55, 1.1, -0.15);
    group.add(venaCava);

    group.scale.setScalar(1.2);
    return group;
  }

  /**
   * ⚛️ Genera el Átomo Cuántico con Núcleo y Orbitales en 3D
   */
  public static createQuantumAtom(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Quantum_Atom';

    const protonMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8, roughness: 0.2 });
    const neutronMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.6, roughness: 0.2 });
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.75 });
    const electronMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x06b6d4, emissiveIntensity: 1.8, roughness: 0.1 });

    // Núcleo
    const nucleus = new THREE.Group();
    const offsets = [
      [0, 0, 0], [0.18, 0.15, 0], [-0.16, 0.12, 0.1],
      [0.08, -0.18, 0.12], [-0.12, -0.14, -0.1], [0.15, -0.05, -0.15]
    ];
    offsets.forEach(([ox, oy, oz], i) => {
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), i % 2 === 0 ? protonMat : neutronMat);
      sphere.position.set(ox, oy, oz);
      nucleus.add(sphere);
    });
    group.add(nucleus);

    // 3 Anillos Orbitales en 3D
    const angles = [0, Math.PI / 3, -Math.PI / 3];
    angles.forEach((ang, idx) => {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.x = ang;
      ringGroup.rotation.y = idx * (Math.PI / 3);

      const ringGeo = new THREE.TorusGeometry(1.6, 0.015, 8, 64);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ringGroup.add(ring);

      const electron = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), electronMat);
      electron.position.set(1.6, 0, 0);
      ringGroup.add(electron);

      group.add(ringGroup);
    });

    group.scale.setScalar(1.3);
    return group;
  }

  /**
   * 🌌 Genera Galaxia Espiral Volumétrica de Gran Diseño con 3D Gaussian Splats, Agujero Negro Supermasivo y Disco de Acreción Doppler
   */
  public static create3DGaussianGalaxy(numSplats = 14000): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Gaussian_Splat_Galaxy';

    // 1. Núcleo Galáctico Activo: Agujero Negro Supermasivo (SMBH) con Lente Gravitacional y Disco Relativista
    const smbhGroup = new THREE.Group();
    smbhGroup.name = 'SMBH_AccretionCore';

    // Horizonte de Sucesos (Sombra Negra Absoluta de Schwarzschild)
    const horizonGeo = new THREE.SphereGeometry(0.32, 32, 32);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x010101 });
    const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    horizonMesh.name = 'EventHorizon';
    smbhGroup.add(horizonMesh);

    // Anillo de Fotones / Lente Gravitacional de Einstein
    const photonRingGeo = new THREE.TorusGeometry(0.58, 0.035, 24, 80);
    const photonRingMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewPos = -mvPos.xyz;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewPos;
        void main() {
          float rim = pow(1.0 - max(dot(vNormal, normalize(vViewPos)), 0.0), 1.8);
          vec3 ringCol = vec3(1.0, 0.92, 0.7) * (1.8 + rim * 2.2);
          gl_FragColor = vec4(ringCol, 0.95);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
    photonRing.name = 'EinsteinPhotonRing';
    photonRing.rotation.x = Math.PI / 2;
    smbhGroup.add(photonRing);

    // Disco de Acreción de Plasma con Efecto Doppler Relativista (Azul/Brillante al acercarse, Rojo al alejarse)
    const diskGeo = new THREE.RingGeometry(0.42, 1.45, 64, 8);
    const diskMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vLocalPos;
        void main() {
          vUv = uv;
          vLocalPos = position;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vLocalPos;
        void main() {
          float rad = length(vLocalPos.xy);
          float normRad = clamp((rad - 0.42) / (1.45 - 0.42), 0.0, 1.0);
          
          // Doppler boosting: el lado izquierdo se acerca a velocidad relativista
          float doppler = 1.0 - clamp(vLocalPos.x / 1.45, -0.8, 0.8) * 0.65;
          
          vec3 colInner = vec3(1.0, 0.95, 0.85);
          vec3 colMid = vec3(0.22, 0.74, 0.97);
          vec3 colOuter = vec3(0.96, 0.25, 0.37);

          vec3 baseCol = mix(colInner, colMid, normRad * 1.2);
          baseCol = mix(baseCol, colOuter, pow(normRad, 2.0));

          float spiral = sin(atan(vLocalPos.y, vLocalPos.x) * 4.0 - rad * 12.0) * 0.5 + 0.5;
          float alpha = pow(1.0 - normRad, 1.3) * (0.65 + spiral * 0.35) * doppler;

          gl_FragColor = vec4(baseCol * doppler * 2.2, alpha * 0.92);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const diskMesh = new THREE.Mesh(diskGeo, diskMat);
    diskMesh.name = 'DopplerAccretionDisk';
    diskMesh.rotation.x = Math.PI / 2;
    smbhGroup.add(diskMesh);

    // Chorros Relativistas Bipolares de Sincrotrón (Eje Z Perpendicular)
    [-1, 1].forEach((dir, jIdx) => {
      const jetGeo = new THREE.ConeGeometry(0.14, 2.8, 16, 1, true);
      jetGeo.translate(0, 1.4, 0);
      const jetMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const jetMesh = new THREE.Mesh(jetGeo, jetMat);
      jetMesh.name = `RelativisticJet_${jIdx === 0 ? 'South' : 'North'}`;
      if (dir < 0) jetMesh.rotation.z = Math.PI;
      smbhGroup.add(jetMesh);
    });

    group.add(smbhGroup);

    // 2. Nube 3D Gaussian Splats de Gran Diseño Espiral (4 Brazos + Bulbo Triaxial + Halo)
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(numSplats * 3);
    const colors = new Float32Array(numSplats * 3);
    const scales = new Float32Array(numSplats * 3);

    const colBulge = new THREE.Color(0xffedd5);      // Núcleo cálido estelar (6.000 K)
    const colBulgeOuter = new THREE.Color(0xfbbf24); // Estrellas gigantes rojas/naranjas Población II
    const colArmOB = new THREE.Color(0x38bdf8);       // Cúmulos gigantes jóvenes O/B (20.000 K)
    const colHII = new THREE.Color(0xf43f5e);         // Regiones H II de hidrógeno ionizado (656 nm)
    const colDustFilament = new THREE.Color(0x1e1b4b);// Filamentos oscuros de polvo molecular
    const colHalo = new THREE.Color(0xdbeafe);        // Cúmulos globulares del halo

    const numArms = 4;
    const armSpread = 0.38;

    for (let i = 0; i < numSplats; i++) {
      const i3 = i * 3;
      const rRatio = i / numSplats;

      let x: number, y: number, z: number;
      let col: THREE.Color;
      let sx: number, sy: number, sz: number;

      if (rRatio < 0.18) {
        // Bulbo Central Triaxial Elipsoidal
        const bRad = Math.pow(Math.random(), 1.5) * 0.85;
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);

        x = bRad * Math.sin(phi) * Math.cos(theta) * 1.25;
        y = bRad * Math.sin(phi) * Math.sin(theta) * 0.65;
        z = bRad * Math.cos(phi) * 0.55;

        col = colBulge.clone().lerp(colBulgeOuter, bRad / 0.85);
        sx = 0.10 + Math.random() * 0.12;
        sy = 0.06 + Math.random() * 0.08;
        sz = 0.10 + Math.random() * 0.12;
      } else if (rRatio < 0.92) {
        // 4 Brazos Espirales Logarítmicos con Ondas de Densidad
        const dist = 0.75 + Math.pow(Math.random(), 1.4) * 3.0;
        const armIndex = i % numArms;
        const baseAngle = armIndex * ((2 * Math.PI) / numArms);
        const spiralAngle = baseAngle + Math.log(dist / 0.45) * 2.2 + (Math.random() - 0.5) * armSpread;

        const armPerturb = (Math.random() - 0.5) * 0.28;
        x = Math.cos(spiralAngle) * dist + armPerturb;
        z = Math.sin(spiralAngle) * dist + armPerturb;
        y = (Math.random() - 0.5) * 0.32 * Math.exp(-dist * 0.55);

        // Clasificación espectral por radio galactocéntrico
        if (dist < 1.4) {
          col = colBulgeOuter.clone().lerp(colArmOB, (dist - 0.75) / 0.65);
        } else if (dist < 2.6) {
          const isHII = Math.random() > 0.55;
          col = isHII ? colHII.clone().lerp(colArmOB, Math.random() * 0.4) : colArmOB.clone();
        } else {
          const isDust = Math.random() > 0.7;
          col = isDust ? colDustFilament.clone() : colArmOB.clone().lerp(colHII, Math.random() * 0.7);
        }

        sx = 0.09 + Math.random() * 0.16;
        sy = 0.04 + Math.random() * 0.06;
        sz = 0.09 + Math.random() * 0.16;
      } else {
        // Halo Esferoidal Extenso & Cúmulos Globulares
        const hRad = 2.6 + Math.random() * 1.8;
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);

        x = hRad * Math.sin(phi) * Math.cos(theta);
        y = hRad * Math.sin(phi) * Math.sin(theta) * 0.45;
        z = hRad * Math.cos(phi);

        col = colHalo.clone();
        sx = 0.07 + Math.random() * 0.10;
        sy = 0.04 + Math.random() * 0.05;
        sz = 0.07 + Math.random() * 0.10;
      }

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      scales[i3] = sx;
      scales[i3 + 1] = sy;
      scales[i3 + 2] = sz;

      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 3));

    const splatMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uGlowIntensity: { value: 2.6 }
      },
      vertexShader: `
        attribute vec3 color;
        attribute vec3 scale;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (scale.x * 450.0) / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float uGlowIntensity;
        void main() {
          vec2 coord = gl_PointCoord * 2.0 - 1.0;
          float r2 = dot(coord, coord);
          if (r2 > 1.0) discard;
          float alpha = exp(-3.2 * r2);
          vec3 hdrColor = vColor * uGlowIntensity * (1.0 + (1.0 - r2) * 0.75);
          gl_FragColor = vec4(hdrColor, alpha * 0.92);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true
    });

    const splatMesh = new THREE.Points(geometry, splatMaterial);
    splatMesh.name = 'Gaussian_Galaxy_Arms_And_Halo';
    group.add(splatMesh);

    group.scale.setScalar(1.2);
    return group;
  }

  /**
   * 🌌 Genera Textura Procedural NIRCam Calibrada de Carina en Canvas 2D
   */
  private static createCarinaProceduralFallbackTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Fondo cósmico profundo azul-zafiro / OIII
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    bgGrad.addColorStop(0.0, '#030712');
    bgGrad.addColorStop(0.35, '#071833');
    bgGrad.addColorStop(0.55, '#0e2b4d');
    bgGrad.addColorStop(0.70, '#381a0e');
    bgGrad.addColorStop(1.0, '#1a0802');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Franja de Fotoionización y Frente de Polvo Cálido (PAH Infrarrojo)
    const ridgeGrad = ctx.createLinearGradient(0, 360, 0, 780);
    ridgeGrad.addColorStop(0.0, 'rgba(56, 189, 248, 0.65)');
    ridgeGrad.addColorStop(0.22, 'rgba(251, 191, 36, 0.96)');
    ridgeGrad.addColorStop(0.50, 'rgba(234, 88, 12, 0.92)');
    ridgeGrad.addColorStop(0.78, 'rgba(154, 52, 18, 0.96)');
    ridgeGrad.addColorStop(1.0, 'rgba(67, 20, 7, 0.98)');

    ctx.fillStyle = ridgeGrad;
    ctx.beginPath();
    ctx.moveTo(0, 520);
    for (let x = 0; x <= 1024; x += 16) {
      const nx = (x / 1024) * 2.0 - 1.0;
      const y = 500 + Math.sin(nx * 3.14 * 1.3 + 0.5) * 80 + Math.sin(nx * 7.0) * 35 + Math.cos(nx * 14.0) * 15;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(1024, 1024);
    ctx.lineTo(0, 1024);
    ctx.closePath();
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /**
   * 8. Nebulosa de Carina • Cosmic Cliffs (NGC 3324) - Reconstrucción 3D Monumental Multicapa (JWST NIRCam/MIRI)
   * Diseñado como un horizonte cósmico envolvente que reemplaza cualquier caja flotante por un anfiteatro inmersivo:
   * - Capa 1: Frente de Fotoionización Sinuoso con relieve orográfico fractal y 4 pilares 3D de polvo destacados.
   * - Capa 2: Protoestrellas Embebidas y Chorros Herbig-Haro hiperbólicos con ondas de choque de proa.
   * - Capa 3: Bóveda de gas molecular ionizado superior azul profundo/cian, 7.000 partículas gaussianas y campo profundo.
   * - Capa 4: Estrellas brillantes con picos de difracción de 6 puntas (JWST) y halo Airy.
   */
  public static createCarinaCosmicCliffs(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Carina_Cosmic_Cliffs';
    group.userData.isPanoramicNebula = true;

    const textureLoader = new THREE.TextureLoader();
    const fallbackTexture = this.createCarinaProceduralFallbackTexture();
    let officialTexture: THREE.Texture = fallbackTexture;

    try {
      officialTexture = textureLoader.load(
        '/downloads/datasets/carina/images/carina_cosmic_cliffs_01.jpg',
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.wrapS = THREE.ClampToEdgeWrapping;
          tex.wrapT = THREE.ClampToEdgeWrapping;
          if (carinaMaterial) carinaMaterial.uniforms.uMap.value = tex;
        },
        undefined,
        () => {
          // Mantener textura procedural calibrada de fallback en caso de red offline
        }
      );
      officialTexture.colorSpace = THREE.SRGBColorSpace;
    } catch {
      officialTexture = fallbackTexture;
    }
    // Malla orográfica parabólica de alta resolución (320x180) con relieve continuo
    // =========================================================================
    const ridgeGroup = new THREE.Group();
    ridgeGroup.name = 'PhotoionizationRidge';

    const segX = 280;
    const segY = 160;
    const width = 24.0;
    const height = 13.5;
    const geom = new THREE.PlaneGeometry(width, height, segX, segY);
    const pos = geom.attributes.position;
    const uvs = geom.attributes.uv;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const u = uvs.getX(i);
      const v = uvs.getY(i);

      const normX = x / (width * 0.5); // [-1, 1]
      const normY = y / (height * 0.5); // [-1, 1]

      // Curvatura panorámica cilíndrica envolvente que abraza el campo de visión (120°)
      const curveZ = -Math.pow(normX, 2) * 3.0 - Math.pow(normY, 2) * 0.6;

      // Perfil armónico continuo de la cordillera sinuosa de fotoionización
      const ridgeWave =
        Math.sin(normX * Math.PI * 1.15 + 0.3) * 0.42 +
        Math.sin(normX * 6.5 + 0.2) * 0.18 +
        Math.cos(normX * 13.0) * 0.08 +
        Math.sin(normX * 26.0) * 0.03;

      const ridgeCenterV = 0.44 + ridgeWave * 0.20;
      const vDist = v - ridgeCenterV;

      // Micro-relieve fractal continuo en el frente de choque
      const fractalDetail =
        (Math.sin(x * 2.8 + y * 2.2) * 0.5 +
          Math.sin(x * 6.4 - y * 5.2) * 0.25 +
          Math.sin(x * 13.5 + y * 10.8) * 0.125) * 0.28;

      // Relieve: el polvo molecular inferior avanza en +Z, la cresta se afila, la cavidad azul retrocede en -Z
      let depthRelief = 0.0;
      if (v < ridgeCenterV) {
        const dustFactor = Math.pow((ridgeCenterV - v) / ridgeCenterV, 0.85);
        depthRelief = dustFactor * 1.8 + Math.exp(-Math.pow(vDist * 6.5, 2)) * 1.2 + fractalDetail * 0.8;
      } else {
        const cavityFactor = Math.pow((v - ridgeCenterV) / (1.0 - ridgeCenterV), 1.15);
        depthRelief = -cavityFactor * 2.2 + Math.exp(-Math.pow(vDist * 8.5, 2)) * 0.9 + fractalDetail * 0.4;
      }

      // Columnas y pilares de fotoevaporación integrados directamente en la topografía continua
      const colPillars = 
        Math.exp(-Math.pow(normX + 0.42, 2) * 20.0) * Math.max(0, 1.0 - Math.abs(v - 0.54) * 3.5) * 1.6 +
        Math.exp(-Math.pow(normX - 0.48, 2) * 18.0) * Math.max(0, 1.0 - Math.abs(v - 0.48) * 3.2) * 1.4 +
        Math.exp(-Math.pow(normX + 0.04, 2) * 24.0) * Math.max(0, 1.0 - Math.abs(v - 0.42) * 4.0) * 1.2 +
        Math.exp(-Math.pow(normX - 0.78, 2) * 16.0) * Math.max(0, 1.0 - Math.abs(v - 0.58) * 3.0) * 1.1;

      const finalZ = curveZ + depthRelief + colPillars;
      pos.setZ(i, finalZ);
    }
    geom.computeVertexNormals();

    // Sombreador PBR Físico de Emisión Infrarroja (JWST NIRCam 4.7µm + Fotoionización)
    const carinaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: officialTexture },
        uIonizationColor: { value: new THREE.Color(0xfff1cc) }, // Borde dorado ionizado
        uInfraredColor: { value: new THREE.Color(0xef4444) },  // Emisión térmica profunda PAH
        uCavityColor: { value: new THREE.Color(0x0284c7) },    // Gas OIII azul cavidad
        uTime: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPos.xyz;
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform vec3 uIonizationColor;
        uniform vec3 uInfraredColor;
        uniform vec3 uCavityColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;

        void main() {
          vec4 texColor = texture2D(uMap, vUv);

          // Difuminado orgánico de bordes ultra-suave que funde el horizonte cósmico
          float edgeX = smoothstep(0.0, 0.12, vUv.x) * (1.0 - smoothstep(0.88, 1.0, vUv.x));
          float edgeY = smoothstep(0.0, 0.12, vUv.y) * (1.0 - smoothstep(0.88, 1.0, vUv.y));
          float edgeAlpha = pow(edgeX * edgeY, 0.7);

          // Radiación ultravioleta rasante desde las estrellas masivas superiores
          vec3 uvRadiationDir = normalize(vec3(0.12, 0.96, 0.35));
          float rimLight = max(dot(vNormal, uvRadiationDir), 0.0);
          float rimIonization = pow(rimLight, 2.0);

          // Detección espectral de polvo cálido vs gas azul
          float warmDustIntensity = clamp((texColor.r * 1.4 - texColor.b * 0.9), 0.0, 1.0);
          float blueGasIntensity = clamp((texColor.b * 1.3 - texColor.r * 0.7), 0.0, 1.0);

          // Iluminación difusa con realce PBR
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.2);

          // Síntesis de color final calibrado
          vec3 baseRadiance = texColor.rgb * (0.88 + rimLight * 0.45);
          vec3 ionizationGlow = uIonizationColor * rimIonization * 0.55;
          vec3 infraredThermal = uInfraredColor * pow(warmDustIntensity, 1.8) * 0.30;
          vec3 cavityHaze = uCavityColor * blueGasIntensity * 0.25;
          vec3 fresnelEdge = vec3(0.7, 0.9, 1.0) * fresnel * 0.20;

          vec3 finalColor = baseRadiance + ionizationGlow + infraredThermal + cavityHaze + fresnelEdge;

          gl_FragColor = vec4(finalColor, edgeAlpha * texColor.a);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: true
    });

    const mainNebulaMesh = new THREE.Mesh(geom, carinaMaterial);
    mainNebulaMesh.name = 'Photoionization_Cliff_Mesh';
    mainNebulaMesh.position.set(0, 0, -1.0);
    ridgeGroup.add(mainNebulaMesh);
    group.add(ridgeGroup);

    // =========================================================================
    // CAPA 2: ENJAMBRE DE GAS Y POLVO VOLUMÉTRICO SUAVE (Partículas Gauss)
    // =========================================================================
    const particleCount = 2800;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);
    const pSizes = new Float32Array(particleCount);

    const cBlue = new THREE.Color(0x38bdf8);
    const cCyan = new THREE.Color(0x06b6d4);
    const cAmber = new THREE.Color(0xfb923c);
    const cGold = new THREE.Color(0xfde047);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const isTop = Math.random() > 0.45;

      let px: number, py: number, pz: number;
      let col: THREE.Color;

      if (isTop) {
        px = (Math.random() - 0.5) * 22.0;
        py = 0.8 + Math.random() * 5.0;
        pz = -1.5 - Math.random() * 3.5;
        col = cBlue.clone().lerp(cCyan, Math.random());
      } else {
        px = (Math.random() - 0.5) * 20.0;
        py = -0.5 + (Math.random() - 0.5) * 3.0;
        pz = 0.3 + Math.random() * 1.8;
        col = cAmber.clone().lerp(cGold, Math.random());
      }

      pPositions[i3] = px;
      pPositions[i3 + 1] = py;
      pPositions[i3 + 2] = pz;

      pColors[i3] = col.r;
      pColors[i3 + 1] = col.g;
      pColors[i3 + 2] = col.b;

      pSizes[i] = 0.10 + Math.random() * 0.22;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
    pGeo.setAttribute('size', new THREE.BufferAttribute(pSizes, 1));

    const pMat = new THREE.ShaderMaterial({
      vertexShader: `
        attribute vec3 color;
        attribute float size;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (size * 380.0) / -mvPos.z;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 coord = gl_PointCoord * 2.0 - 1.0;
          float r2 = dot(coord, coord);
          if (r2 > 1.0) discard;
          float alpha = exp(-3.0 * r2) * 0.45;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(pGeo, pMat);
    particles.name = 'VolumetricGasParticles';
    group.add(particles);

    // =========================================================================
    // CAPA 3: ESTRELLAS CON PICOS DE DIFRACCIÓN ÓPTICA JWST (6 Puntas Hexagonales)
    // =========================================================================
    const starsGroup = new THREE.Group();
    starsGroup.name = 'JWSTDiffractionStars';

    const jwstStars = [
      { x: -6.8, y: 4.2, z: -2.2, scale: 1.4, col: 0xffffff, haloCol: 0x93c5fd },
      { x: 5.6, y: 4.8, z: -2.8, scale: 1.2, col: 0xf0f9ff, haloCol: 0x38bdf8 },
      { x: -1.8, y: 1.2, z: 1.2, scale: 1.1, col: 0xfef08a, haloCol: 0xfbbf24 },
      { x: 3.4, y: -0.4, z: 1.5, scale: 0.95, col: 0xfb923c, haloCol: 0xf97316 },
      { x: -4.8, y: 2.2, z: 0.4, scale: 1.15, col: 0xe0e7ff, haloCol: 0x818cf8 },
      { x: 1.2, y: 5.2, z: -3.2, scale: 1.5, col: 0xffffff, haloCol: 0xa5f3fc },
      { x: 8.2, y: -1.8, z: 0.6, scale: 0.90, col: 0xfef08a, haloCol: 0xfde047 },
      { x: -8.5, y: -0.8, z: 0.3, scale: 1.05, col: 0xfbcfe8, haloCol: 0xf472b6 }
    ];

    jwstStars.forEach(st => {
      const starSubGroup = new THREE.Group();
      starSubGroup.position.set(st.x, st.y, st.z);

      // Núcleo brillante
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(st.scale * 0.05, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      starSubGroup.add(core);

      // Halo difuso
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(st.scale * 0.18, 16, 16),
        new THREE.MeshBasicMaterial({
          color: st.haloCol,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending
        })
      );
      starSubGroup.add(halo);

      // 6 Puntas de Difracción Hexagonal (Espejos JWST a 30°, 90°, 150°, 210°, 270°, 330°)
      const primarySpikeMat = new THREE.LineBasicMaterial({
        color: st.col,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending
      });

      for (let a = 0; a < Math.PI; a += Math.PI / 3) {
        const spikeGeo = new THREE.BufferGeometry();
        const spikeLen = st.scale * 1.35;
        const dx = Math.cos(a) * spikeLen;
        const dy = Math.sin(a) * spikeLen;
        spikeGeo.setAttribute('position', new THREE.Float32BufferAttribute([
          -dx, -dy, 0,
          dx, dy, 0
        ], 3));
        starSubGroup.add(new THREE.Line(spikeGeo, primarySpikeMat));
      }

      starsGroup.add(starSubGroup);
    });

    group.add(starsGroup);

    group.scale.setScalar(0.95);
    return group;
  }

  /**
   * 🪟 Genera una Unidad de Ventana Técnica Arquitectónica con Rotura de Puente Térmico, Doble Vidrio Climalit y Manilla de Acero
   */
  public static createArchitecturalWindow(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Architectural_Window_Unit';

    // Materiales PBR de Alta Fidelidad
    const pvcFrameMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.28,
      metalness: 0.08,
      clearcoat: 0.4
    });

    const rubberMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.92,
      metalness: 0.05
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xdbeafe,
      transmission: 0.92,
      opacity: 1.0,
      transparent: true,
      roughness: 0.02,
      ior: 1.52,
      thickness: 0.04,
      reflectivity: 0.88,
      clearcoat: 1.0
    });

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.12
    });

    const sillMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.85,
      roughness: 0.25
    });

    const W = 2.0;  // Ancho total (m)
    const H = 2.4;  // Alto total (m)
    const D = 0.15; // Fondo de marco (m)
    const T = 0.12; // Grosor de perfil (m)

    // 1. Marco Exterior Fijo (4 perfiles)
    // Superior e inferior
    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), pvcFrameMat);
    topFrame.position.set(0, H / 2 - T / 2, 0);
    group.add(topFrame);

    const botFrame = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), pvcFrameMat);
    botFrame.position.set(0, -H / 2 + T / 2, 0);
    group.add(botFrame);

    // Laterales
    const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(T, H - 2 * T, D), pvcFrameMat);
    leftFrame.position.set(-W / 2 + T / 2, 0, 0);
    group.add(leftFrame);

    const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(T, H - 2 * T, D), pvcFrameMat);
    rightFrame.position.set(W / 2 - T / 2, 0, 0);
    group.add(rightFrame);

    // 2. Hoja Abatible Practicable Interior
    const sashW = W - 2 * T - 0.02;
    const sashH = H - 2 * T - 0.02;
    const sashT = 0.09;
    const sashD = 0.10;

    const sashGroup = new THREE.Group();
    sashGroup.name = 'WindowSash';

    // Perfiles de la hoja
    const sTop = new THREE.Mesh(new THREE.BoxGeometry(sashW, sashT, sashD), pvcFrameMat);
    sTop.position.set(0, sashH / 2 - sashT / 2, 0.01);
    sashGroup.add(sTop);

    const sBot = new THREE.Mesh(new THREE.BoxGeometry(sashW, sashT, sashD), pvcFrameMat);
    sBot.position.set(0, -sashH / 2 + sashT / 2, 0.01);
    sashGroup.add(sBot);

    const sLeft = new THREE.Mesh(new THREE.BoxGeometry(sashT, sashH - 2 * sashT, sashD), pvcFrameMat);
    sLeft.position.set(-sashW / 2 + sashT / 2, 0, 0.01);
    sashGroup.add(sLeft);

    const sRight = new THREE.Mesh(new THREE.BoxGeometry(sashT, sashH - 2 * sashT, sashD), pvcFrameMat);
    sRight.position.set(sashW / 2 - sashT / 2, 0, 0.01);
    sashGroup.add(sRight);

    // 3. Junta de Goma EPDM Negra
    const gasket = new THREE.Mesh(
      new THREE.BoxGeometry(sashW - 2 * sashT + 0.01, sashH - 2 * sashT + 0.01, 0.02),
      rubberMat
    );
    gasket.position.set(0, 0, 0.01);
    sashGroup.add(gasket);

    // 4. Panel de Doble Vidrio Aislante Climalit
    const glassPane = new THREE.Mesh(
      new THREE.BoxGeometry(sashW - 2 * sashT, sashH - 2 * sashT, 0.035),
      glassMat
    );
    glassPane.position.set(0, 0, 0.01);
    glassPane.name = 'ClimalitGlassPane';
    sashGroup.add(glassPane);

    // 5. Manivela / Manilla de Apertura Ergonómica en L
    const handleBase = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 16), steelMat);
    handleBase.rotation.x = Math.PI / 2;
    handleBase.position.set(-sashW / 2 + sashT / 2, 0, 0.065);
    sashGroup.add(handleBase);

    const handleStem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.05, 16), steelMat);
    handleStem.rotation.x = Math.PI / 2;
    handleStem.position.set(-sashW / 2 + sashT / 2, 0, 0.095);
    sashGroup.add(handleStem);

    const handleGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.16, 16), steelMat);
    handleGrip.position.set(-sashW / 2 + sashT / 2, -0.07, 0.12);
    sashGroup.add(handleGrip);

    // 6. Bisagras de Acero Inoxidable (Lateral derecho)
    const hingeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 16), steelMat);
    hingeTop.position.set(W / 2 - T / 2, H * 0.3, 0.04);
    group.add(hingeTop);

    const hingeBot = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.12, 16), steelMat);
    hingeBot.position.set(W / 2 - T / 2, -H * 0.3, 0.04);
    group.add(hingeBot);

    group.add(sashGroup);

    // 7. Alféizar / Vierteaguas Inferior
    const sill = new THREE.Mesh(new THREE.BoxGeometry(W + 0.25, 0.04, D + 0.18), sillMat);
    sill.position.set(0, -H / 2 - 0.02, 0.06);
    sill.rotation.x = 0.05; // Ligera pendiente de evacuación
    group.add(sill);

    // Centrado de escala
    group.scale.set(1.1, 1.1, 1.1);

    return group;
  }

  /**
   * 🧬 Reconstrucción 3D Hiperrealista de la Célula Eucariota Humana (Human Eukaryotic Cell)
   * Diseñada con precisión bio-anatómica Cryo-EM:
   * - Membrana con bicapa fosfolipídica y glucocálix ramificado
   * - Núcleo con carioteca de doble membrana, 48 poros nucleares NPC, nucleolo granular y masa de cromatina
   * - Retículo Endoplasmático Rugoso (RER) en hojas helicoidales de Terasaki con 450 ribosomas
   * - Mitocondrias anatómicas con doble membrana, crestas laminares profundas y complejos ATP sintasa
   * - Aparato de Golgi con dictiosomas apilados en medialuna y constelación de vesículas de secreción
   * - Centrosoma con diplosoma de centriolos en 9 tripletes (9x3)
   * - Citoesqueleto de microtúbulos y filamentos de actina
   */
  public static createHyperrealisticHumanCell(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Human_Eukaryotic_Cell';

    // 1. MATERIALES PBR BIOLÓGICOS CALIBRADOS (Vibrantes & Bioluminiscentes)
    const membraneMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.65,
      opacity: 0.88,
      transparent: true,
      roughness: 0.12,
      ior: 1.38,
      thickness: 0.25,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      emissive: 0x0284c7,
      emissiveIntensity: 0.22,
      attenuationColor: new THREE.Color(0x0369a1),
      attenuationDistance: 2.0,
      side: THREE.DoubleSide
    });

    const lipidHeadOuterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.1,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3
    });

    const lipidHeadInnerMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.3,
      metalness: 0.1,
      emissive: 0xd97706,
      emissiveIntensity: 0.25
    });

    const glycocalyxMat = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4,
      roughness: 0.15
    });

    const cytosolMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transmission: 0.92,
      opacity: 0.22,
      transparent: true,
      roughness: 0.06,
      ior: 1.34,
      depthWrite: false
    });

    const nucleusEnvelopeMat = new THREE.MeshPhysicalMaterial({
      color: 0x7c3aed,
      roughness: 0.22,
      metalness: 0.08,
      clearcoat: 0.9,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.3,
      side: THREE.DoubleSide
    });

    const nucleolusMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.85,
      roughness: 0.3,
      metalness: 0.05
    });

    const chromatinMat = new THREE.MeshStandardMaterial({
      color: 0xd8b4fe,
      emissive: 0x9333ea,
      emissiveIntensity: 0.45,
      roughness: 0.25
    });

    const rerSheetMat = new THREE.MeshPhysicalMaterial({
      color: 0x9333ea,
      roughness: 0.2,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
      emissive: 0x581c87,
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide
    });

    const ribosomeMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.75,
      roughness: 0.15
    });

    const mitoOuterMat = new THREE.MeshPhysicalMaterial({
      color: 0xf97316,
      transmission: 0.45,
      opacity: 0.92,
      transparent: true,
      roughness: 0.15,
      clearcoat: 0.9,
      emissive: 0xc2410c,
      emissiveIntensity: 0.4,
      attenuationColor: new THREE.Color(0x9a3412),
      attenuationDistance: 0.8,
      side: THREE.DoubleSide
    });

    const mitoMatrixMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    const golgiCisternaMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      roughness: 0.18,
      clearcoat: 0.95,
      clearcoatRoughness: 0.06,
      emissive: 0x047857,
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide
    });

    const vesicleMat = new THREE.MeshPhysicalMaterial({
      color: 0x34d399,
      transmission: 0.5,
      transparent: true,
      opacity: 0.9,
      emissive: 0x059669,
      emissiveIntensity: 0.4,
      roughness: 0.12,
      clearcoat: 0.8
    });

    const lysosomeMat = new THREE.MeshPhysicalMaterial({
      color: 0xef4444,
      roughness: 0.18,
      emissive: 0xdc2626,
      emissiveIntensity: 0.6,
      transmission: 0.25,
      transparent: true,
      opacity: 0.95,
      clearcoat: 0.8
    });

    const peroxisomeMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      roughness: 0.18,
      emissive: 0x0891b2,
      emissiveIntensity: 0.55,
      transmission: 0.3,
      transparent: true,
      opacity: 0.95,
      clearcoat: 0.8
    });

    const centrioleMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.85,
      roughness: 0.12,
      emissive: 0x64748b,
      emissiveIntensity: 0.2
    });

    const channelProteinMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
      roughness: 0.2
    });

    // Luz Biológica Interna de Transiluminación Citoplasmática
    const innerCellLight = new THREE.PointLight(0x38bdf8, 2.2, 8);
    innerCellLight.position.set(0, 0, 0);
    group.add(innerCellLight);

    const R = 2.5; // Radio celular general

    // 1. MEMBRANA PLASMÁTICA EN CORTE ANATÓMICO 3/4 CON GLUCOCÁLIX REAL
    const membraneGroup = new THREE.Group();
    membraneGroup.name = 'PlasmaMembrane';

    // Cúpula esférica de la membrana con corte transversal
    const membraneGeo = new THREE.SphereGeometry(R, 80, 80, 0, Math.PI * 1.52, 0, Math.PI);
    const membraneMesh = new THREE.Mesh(membraneGeo, membraneMat);
    membraneMesh.name = 'PlasmaMembraneMesh';
    membraneGroup.add(membraneMesh);

    // Bicapa de cabezas fosfolipídicas en el borde del corte
    const lipidCount = 200;
    const lipidGeo = new THREE.SphereGeometry(0.024, 8, 8);
    const lipidOuterInst = new THREE.InstancedMesh(lipidGeo, lipidHeadOuterMat, lipidCount);
    const lipidInnerInst = new THREE.InstancedMesh(lipidGeo, lipidHeadInnerMat, lipidCount);
    const dummy = new THREE.Object3D();

    for (let i = 0; i < lipidCount; i++) {
      const phi = (i / lipidCount) * Math.PI;
      // Capa externa polar (cian)
      dummy.position.set(R * Math.sin(phi), R * Math.cos(phi), 0.015);
      dummy.updateMatrix();
      lipidOuterInst.setMatrixAt(i, dummy.matrix);

      // Capa interna hidrofóbica (ámbar)
      dummy.position.set((R - 0.05) * Math.sin(phi), (R - 0.05) * Math.cos(phi), -0.015);
      dummy.updateMatrix();
      lipidInnerInst.setMatrixAt(i, dummy.matrix);
    }
    lipidOuterInst.instanceMatrix.needsUpdate = true;
    lipidInnerInst.instanceMatrix.needsUpdate = true;
    membraneGroup.add(lipidOuterInst);
    membraneGroup.add(lipidInnerInst);

    // Glucocálix: Árboles ramificados de oligosacáridos sobre la superficie celular
    const glycocalyxGroup = new THREE.Group();
    glycocalyxGroup.name = 'TransmembraneProteins';

    for (let i = 0; i < 55; i++) {
      const u = Math.random() * 0.72;
      const v = Math.random() * 0.88 + 0.06;
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const px = R * Math.sin(phi) * Math.cos(theta);
      const py = R * Math.sin(phi) * Math.sin(theta);
      const pz = R * Math.cos(phi);

      const tree = new THREE.Group();
      tree.position.set(px, py, pz);
      tree.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(px, py, pz).normalize());

      // Tallo proteico
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 0.14, 6), channelProteinMat);
      stem.position.y = 0.07;
      tree.add(stem);

      // Ramitas de azúcares (monosacáridos)
      const numBranches = 3 + Math.floor(Math.random() * 3);
      for (let b = 0; b < numBranches; b++) {
        const sugar = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 6), glycocalyxMat);
        sugar.position.set(
          (Math.random() - 0.5) * 0.08,
          0.12 + b * 0.03,
          (Math.random() - 0.5) * 0.08
        );
        tree.add(sugar);
      }
      glycocalyxGroup.add(tree);
    }
    membraneGroup.add(glycocalyxGroup);
    group.add(membraneGroup);

    // 2. CITOSOL / MATRIZ CELULAR TRANSPARENTE
    const cytosolGeo = new THREE.SphereGeometry(R - 0.06, 60, 60, 0, Math.PI * 1.5, 0, Math.PI);
    const cytosolMesh = new THREE.Mesh(cytosolGeo, cytosolMat);
    cytosolMesh.name = 'CytosolMatrix';
    group.add(cytosolMesh);

    // 3. NÚCLEO CELULAR, CARIOTECA CON POROS OCTOGONALES, ADN Y NUCLEOLO
    const nucleusGroup = new THREE.Group();
    nucleusGroup.name = 'CellNucleus';
    nucleusGroup.position.set(-0.45, -0.12, -0.22);

    const nRadius = 0.95;
    // Envoltura nuclear con corte
    const nGeo = new THREE.SphereGeometry(nRadius, 60, 60, 0, Math.PI * 1.40, 0, Math.PI);
    const nMesh = new THREE.Mesh(nGeo, nucleusEnvelopeMat);
    nucleusGroup.add(nMesh);

    // Poros nucleares octogonales (NPC)
    for (let i = 0; i < 48; i++) {
      const u = Math.random() * 0.66;
      const v = Math.random() * 0.85 + 0.08;
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const px = nRadius * Math.sin(phi) * Math.cos(theta);
      const py = nRadius * Math.sin(phi) * Math.sin(theta);
      const pz = nRadius * Math.cos(phi);

      const pore = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.012, 8, 8), channelProteinMat);
      pore.position.set(px, py, pz);
      pore.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(px, py, pz).normalize());
      nucleusGroup.add(pore);
    }

    // Nucleolo interno denso con centro fibrilar bioluminiscente
    const nucleolus = new THREE.Mesh(new THREE.SphereGeometry(0.38, 40, 40), nucleolusMat);
    nucleolus.position.set(0.08, 0.08, 0.08);
    nucleolus.name = 'Nucleolus';
    nucleusGroup.add(nucleolus);

    // Maraña densa de hebras de ADN / Cromatina superenrollada
    const dnaPath1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.35, 0.28, 0.15),
      new THREE.Vector3(-0.12, 0.48, 0.35),
      new THREE.Vector3(0.28, 0.36, 0.24),
      new THREE.Vector3(0.45, -0.12, 0.32),
      new THREE.Vector3(0.2, -0.4, 0.18)
    ]);
    const dnaPath2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.28, -0.35, 0.22),
      new THREE.Vector3(0.08, -0.48, 0.38),
      new THREE.Vector3(0.38, -0.25, 0.16),
      new THREE.Vector3(0.22, 0.18, 0.42),
      new THREE.Vector3(-0.15, 0.22, 0.35)
    ]);
    const dnaPath3 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.4, 0.05, 0.3),
      new THREE.Vector3(-0.15, -0.2, 0.45),
      new THREE.Vector3(0.1, 0.35, 0.28),
      new THREE.Vector3(0.35, 0.05, 0.38)
    ]);

    [dnaPath1, dnaPath2, dnaPath3].forEach(crv => {
      nucleusGroup.add(new THREE.Mesh(new THREE.TubeGeometry(crv, 48, 0.022, 8, false), chromatinMat));
    });
    group.add(nucleusGroup);

    // 4. RETÍCULO ENDOPLASMÁTICO RUGOSO (RER) EN HOJAS HELICOIDALES DE TERASAKI
    const rerGroup = new THREE.Group();
    rerGroup.name = 'RoughEndoplasmicReticulum';
    rerGroup.position.set(-0.45, -0.12, -0.22);

    const rerPlates = [1.16, 1.38, 1.62, 1.86];
    rerPlates.forEach((rVal, idx) => {
      const plateGeo = new THREE.TorusGeometry(rVal, 0.095 + idx * 0.018, 16, 54, Math.PI * 0.94);
      const plateMesh = new THREE.Mesh(plateGeo, rerSheetMat);
      plateMesh.rotation.x = Math.PI / 2 + (idx * 0.13);
      plateMesh.rotation.z = idx * 0.20;
      rerGroup.add(plateMesh);
    });

    // 450 Ribosomas densos salpicados en el RER
    const riboCount = 450;
    const riboGeo = new THREE.SphereGeometry(0.018, 8, 8);
    const riboInstanced = new THREE.InstancedMesh(riboGeo, ribosomeMat, riboCount);

    for (let i = 0; i < riboCount; i++) {
      const r = 1.08 + Math.random() * 0.85;
      const angle = (Math.random() - 0.5) * Math.PI * 0.98;
      const zOffset = (Math.random() - 0.5) * 0.55;
      dummy.position.set(Math.cos(angle) * r, Math.sin(angle) * r, zOffset);
      dummy.updateMatrix();
      riboInstanced.setMatrixAt(i, dummy.matrix);
    }
    riboInstanced.instanceMatrix.needsUpdate = true;
    riboInstanced.name = 'Ribosomes';
    rerGroup.add(riboInstanced);
    group.add(rerGroup);

    // 5. MITOCONDRIAS BIOLÓGICAMENTE PRECISAS CON CRESTAS EN ZIG-ZAG Y ATP SINTASA
    const mitoGroup = new THREE.Group();
    mitoGroup.name = 'MitochondriaNetwork';

    const mitoConfigs = [
      { pos: [1.1, 0.9, 0.5], rot: [0.4, 0.8, 0.2], scale: 1.05 },
      { pos: [0.95, -1.05, 0.75], rot: [-0.6, 0.3, 0.9], scale: 1.15 },
      { pos: [1.4, -0.25, -0.5], rot: [0.8, -0.5, 0.3], scale: 1.0 },
      { pos: [-0.5, 1.45, 0.6], rot: [-0.2, 0.6, -0.7], scale: 1.1 },
      { pos: [-1.45, -0.9, 0.45], rot: [0.5, -0.7, 0.4], scale: 0.95 }
    ];

    mitoConfigs.forEach((cfg) => {
      const mG = new THREE.Group();
      mG.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      mG.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
      mG.scale.setScalar(cfg.scale);

      // Membrana externa permeable
      const outerMito = new THREE.Mesh(new THREE.CapsuleGeometry(0.24, 0.70, 22, 22), mitoOuterMat);
      mG.add(outerMito);

      // 9 Crestas mitocondriales transversales continuas plegadas
      for (let c = -0.30; c <= 0.30; c += 0.075) {
        const cristaGroup = new THREE.Group();
        cristaGroup.position.set(0, c, 0);

        const cristaShape = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 0.038, 18),
          mitoMatrixMat
        );
        cristaShape.scale.set(1.0, 1.0, 0.42);
        cristaShape.rotation.y = (c > 0 ? 0.4 : -0.4);
        cristaGroup.add(cristaShape);

        // ATP Sintasa luminosa en el borde de la cresta
        const atpP = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), ribosomeMat);
        atpP.position.set(0.14, 0.02, 0);
        cristaGroup.add(atpP);

        mG.add(cristaGroup);
      }
      mitoGroup.add(mG);
    });
    group.add(mitoGroup);

    // 6. APARATO DE GOLGI CON 6 CISTERNAS APILADAS Y VESÍCULAS
    const golgiGroup = new THREE.Group();
    golgiGroup.name = 'GolgiApparatus';
    golgiGroup.position.set(0.8, 0.28, -0.8);
    golgiGroup.rotation.set(0.4, -0.5, 0.3);

    for (let g = 0; g < 6; g++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.6, g * 0.095, -0.16),
        new THREE.Vector3(0, g * 0.095 + 0.06, 0.14),
        new THREE.Vector3(0.6, g * 0.095, -0.16)
      ]);
      const cisterna = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 36, 0.056, 16, false),
        golgiCisternaMat
      );
      golgiGroup.add(cisterna);
    }

    // 28 Vesículas de secreción gemantes en constelación
    for (let v = 0; v < 28; v++) {
      const vMesh = new THREE.Mesh(new THREE.SphereGeometry(0.042 + Math.random() * 0.035, 14, 14), vesicleMat);
      vMesh.position.set(
        (Math.random() - 0.5) * 1.4,
        (Math.random() - 0.5) * 0.7,
        -0.28 - Math.random() * 0.45
      );
      golgiGroup.add(vMesh);
    }
    group.add(golgiGroup);

    // 7. CENTROSOMA & DIPLOMA DE CENTRIOLOS (RUEDA DE CARRO 9x3)
    const centrosomeGroup = new THREE.Group();
    centrosomeGroup.name = 'CentrosomeCentrioles';
    centrosomeGroup.position.set(-1.1, 0.9, -0.28);

    const createCentriole = () => {
      const centG = new THREE.Group();
      for (let t = 0; t < 9; t++) {
        const ang = (t / 9) * Math.PI * 2;
        const cx = Math.cos(ang) * 0.075;
        const cy = Math.sin(ang) * 0.075;

        for (let sub = 0; sub < 3; sub++) {
          const mTube = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.34, 8), centrioleMat);
          mTube.position.set(
            cx + sub * 0.014 * Math.cos(ang + 0.6),
            cy + sub * 0.014 * Math.sin(ang + 0.6),
            0
          );
          centG.add(mTube);
        }
      }
      return centG;
    };

    const c1 = createCentriole();
    centrosomeGroup.add(c1);

    const c2 = createCentriole();
    c2.rotation.x = Math.PI / 2;
    c2.position.set(0.16, 0.12, 0);
    centrosomeGroup.add(c2);
    group.add(centrosomeGroup);

    // 8. LISOSOMAS & PEROXISOMAS CON HALO ENZIMÁTICO
    const vesicleGroup = new THREE.Group();
    vesicleGroup.name = 'LysosomesAndPeroxisomes';

    const lysoPositions = [
      [-0.95, -1.1, 0.6],
      [0.45, 1.3, -0.48],
      [1.3, -0.95, -0.28],
      [-1.35, 0.12, 0.85]
    ];
    lysoPositions.forEach(pos => {
      const lyso = new THREE.Mesh(new THREE.SphereGeometry(0.15, 22, 22), lysosomeMat);
      lyso.position.set(pos[0], pos[1], pos[2]);
      vesicleGroup.add(lyso);
    });

    const peroxiPositions = [
      [-0.18, -1.4, 0.38],
      [1.05, 0.38, 0.95],
      [-1.3, 0.28, 0.7],
      [0.6, -0.65, 1.15]
    ];
    peroxiPositions.forEach(pos => {
      const peroxi = new THREE.Mesh(new THREE.SphereGeometry(0.11, 22, 22), peroxisomeMat);
      peroxi.position.set(pos[0], pos[1], pos[2]);
      vesicleGroup.add(peroxi);
    });
    group.add(vesicleGroup);

    // 9. RED TRIDIMENSIONAL DE CITOESQUELETO (MICROTÚBULOS & FILAMENTOS)
    const cytoGroup = new THREE.Group();
    cytoGroup.name = 'CytoskeletonNetwork';

    const cytoCurves = [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.1, 0.9, -0.28),
        new THREE.Vector3(-0.65, 1.45, 0.48),
        new THREE.Vector3(0.65, 1.85, 0.38),
        new THREE.Vector3(1.55, 1.25, 0.58)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.1, 0.9, -0.28),
        new THREE.Vector3(-0.95, -0.45, 0.75),
        new THREE.Vector3(-0.28, -1.65, 0.48),
        new THREE.Vector3(0.95, -1.4, 0.75)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.1, 0.9, -0.28),
        new THREE.Vector3(0.18, 0.48, -0.75),
        new THREE.Vector3(1.1, -0.28, -0.95),
        new THREE.Vector3(1.65, -0.65, -0.38)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.1, 0.9, -0.28),
        new THREE.Vector3(-1.55, 0.22, -0.55),
        new THREE.Vector3(-1.45, -0.95, -0.22),
        new THREE.Vector3(-0.85, -1.85, 0.12)
      ])
    ];

    const cytoMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.15,
      transparent: true,
      opacity: 0.88
    });

    cytoCurves.forEach(crv => {
      const tube = new THREE.Mesh(new THREE.TubeGeometry(crv, 54, 0.022, 10, false), cytoMat);
      cytoGroup.add(tube);
    });
    group.add(cytoGroup);

    group.scale.setScalar(1.0);
    return group;
  }

  /**
   * 🪐 Genera un Mapa Tridimensional de Sistemas Planetarios con Niveles de Detalle (LOD)
   * Basado en datos orbitales de NASA JPL Planetary Data System y la Unión Astronómica Internacional (IAU).
   */
  public static createPlanetarySystemMap(): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Planetary_System_Multiscale_Map';

    // 1. ESTRELLA CENTRAL (SOL FOTOSFÉRICO & CORONA)
    const starGroup = new THREE.Group();
    starGroup.name = 'Star_CentralSun';

    const sunMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xffaa00,
      emissiveIntensity: 2.8,
      roughness: 0.1,
      metalness: 0.0,
      clearcoat: 1.0
    });
    const sunSphere = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), sunMat);
    sunSphere.name = 'Sol_Fotosfera';
    starGroup.add(sunSphere);

    // Corona fotosférica convectiva
    const coronaMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    const coronaMesh = new THREE.Mesh(new THREE.SphereGeometry(0.58, 24, 24), coronaMat);
    starGroup.add(coronaMesh);

    // Luz puntual emitida por la estrella central
    const starLight = new THREE.PointLight(0xffffff, 4.0, 50, 0.8);
    starGroup.add(starLight);
    group.add(starGroup);

    // 2. PLANO DE LA ECLÍPTICA & REJILLA CARTOGRÁFICA DE DISTANCIAS (UA)
    const eclipticGroup = new THREE.Group();
    eclipticGroup.name = 'HeliocentricEclipticGrid';

    const uaRadii = [
      { r: 0.62, label: '0.4 UA (Mercurio)', col: 0x64748b },
      { r: 0.92, label: '0.7 UA (Venus)', col: 0x64748b },
      { r: 1.25, label: '1.0 UA (Tierra - Goldilocks)', col: 0x38bdf8 },
      { r: 1.62, label: '1.5 UA (Marte)', col: 0x64748b },
      { r: 2.55, label: '5.2 UA (Júpiter)', col: 0x64748b },
      { r: 3.30, label: '9.5 UA (Saturno)', col: 0x64748b },
      { r: 3.95, label: '19.2 UA (Urano)', col: 0x64748b },
      { r: 4.65, label: '30.0 UA (Neptuno)', col: 0x64748b }
    ];

    uaRadii.forEach(ua => {
      const ringGeo = new THREE.RingGeometry(ua.r - 0.006, ua.r + 0.006, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ua.col,
        transparent: true,
        opacity: ua.r === 1.25 ? 0.65 : 0.35,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      eclipticGroup.add(ringMesh);
    });
    group.add(eclipticGroup);

    // 3. PLANETAS TELÚRICOS INTERIORES (LOD 1)
    const innerPlanetsGroup = new THREE.Group();
    innerPlanetsGroup.name = 'InnerRockyPlanets';

    // Mercurio
    const mercMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.85, metalness: 0.4 })
    );
    mercMesh.position.set(0.62, 0, 0);
    mercMesh.name = 'Mercurio_PlanetaRocoso';
    innerPlanetsGroup.add(mercMesh);

    // Venus
    const venusMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.45, metalness: 0.1 })
    );
    venusMesh.position.set(-0.65, 0, 0.65);
    venusMesh.name = 'Venus_AtmosferaDensa';
    innerPlanetsGroup.add(venusMesh);

    // Tierra y Luna
    const earthSubGroup = new THREE.Group();
    earthSubGroup.position.set(0, 0, 1.25);
    const earthMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 24, 24),
      new THREE.MeshPhysicalMaterial({ color: 0x2563eb, roughness: 0.25, metalness: 0.15, clearcoat: 0.8 })
    );
    earthMesh.name = 'Tierra_PlanetaOceano';
    earthSubGroup.add(earthMesh);

    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.024, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.9 })
    );
    moonMesh.position.set(0.14, 0.03, 0);
    moonMesh.name = 'Luna_Satelite';
    earthSubGroup.add(moonMesh);
    innerPlanetsGroup.add(earthSubGroup);

    // Marte
    const marsMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.058, 18, 18),
      new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.75, metalness: 0.25 })
    );
    marsMesh.position.set(1.15, 0, -1.15);
    marsMesh.name = 'Marte_PlanetaRojo';
    innerPlanetsGroup.add(marsMesh);

    group.add(innerPlanetsGroup);

    // 4. CINTURÓN PRINCIPAL DE ASTEROIDES (LOD 2)
    const asteroidBeltGroup = new THREE.Group();
    asteroidBeltGroup.name = 'AsteroidBelt_Main';

    const astCount = 420;
    const astGeo = new THREE.BufferGeometry();
    const astPos = new Float32Array(astCount * 3);
    const astCol = new Float32Array(astCount * 3);

    for (let i = 0; i < astCount; i++) {
      const i3 = i * 3;
      const r = 1.95 + (Math.random() - 0.5) * 0.35;
      const th = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 0.08;

      astPos[i3] = Math.cos(th) * r;
      astPos[i3 + 1] = y;
      astPos[i3 + 2] = Math.sin(th) * r;

      const c = 0.45 + Math.random() * 0.35;
      astCol[i3] = c;
      astCol[i3 + 1] = c * 0.95;
      astCol[i3 + 2] = c * 0.9;
    }
    astGeo.setAttribute('position', new THREE.BufferAttribute(astPos, 3));
    astGeo.setAttribute('color', new THREE.BufferAttribute(astCol, 3));

    const astMat = new THREE.PointsMaterial({
      size: 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });
    asteroidBeltGroup.add(new THREE.Points(astGeo, astMat));

    // Ceres Protoplaneta
    const ceresMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xa8a29e, roughness: 0.9 })
    );
    ceresMesh.position.set(-1.45, 0.02, -1.45);
    ceresMesh.name = 'Ceres_PlanetaEnano';
    asteroidBeltGroup.add(ceresMesh);
    group.add(asteroidBeltGroup);

    // 5. GIGANTES GASEOSOS Y DE HIELO (LOD 3)
    const outerPlanetsGroup = new THREE.Group();
    outerPlanetsGroup.name = 'GasGiants_OuterPlanets';

    // Júpiter + Lunas
    const jupiterSubGroup = new THREE.Group();
    jupiterSubGroup.position.set(-2.55, 0, 0);
    const jupiterMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 28, 28),
      new THREE.MeshPhysicalMaterial({ color: 0xd97706, roughness: 0.35, metalness: 0.05, clearcoat: 0.5 })
    );
    jupiterMesh.name = 'Jupiter_GiganteGaseoso';
    jupiterSubGroup.add(jupiterMesh);

    // Lunas Galileanas
    [-0.32, -0.40, 0.34, 0.46].forEach((offset, idx) => {
      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(0.022, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 })
      );
      moon.position.set(offset, 0.01 * (idx % 2 === 0 ? 1 : -1), 0);
      jupiterSubGroup.add(moon);
    });
    outerPlanetsGroup.add(jupiterSubGroup);

    // Saturno + Sistema de Anillos PBR
    const saturnSubGroup = new THREE.Group();
    saturnSubGroup.position.set(2.33, 0, 2.33);
    const saturnMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.5, metalness: 0.05 })
    );
    saturnMesh.name = 'Saturno_Cuerpo';
    saturnSubGroup.add(saturnMesh);

    // Anillo PBR con División de Cassini
    const saturnRingGeo = new THREE.RingGeometry(0.24, 0.46, 48);
    const saturnRingMat = new THREE.MeshPhysicalMaterial({
      color: 0xfde68a,
      roughness: 0.4,
      metalness: 0.1,
      opacity: 0.82,
      transparent: true,
      side: THREE.DoubleSide
    });
    const saturnRingMesh = new THREE.Mesh(saturnRingGeo, saturnRingMat);
    saturnRingMesh.rotation.x = Math.PI / 2.8;
    saturnRingMesh.rotation.y = 0.15;
    saturnSubGroup.add(saturnRingMesh);
    outerPlanetsGroup.add(saturnSubGroup);

    // Urano
    const uranusSubGroup = new THREE.Group();
    uranusSubGroup.position.set(-2.8, 0, -2.8);
    const uranusMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 20, 20),
      new THREE.MeshPhysicalMaterial({ color: 0x67e8f9, roughness: 0.3, metalness: 0.1, clearcoat: 0.8 })
    );
    uranusMesh.name = 'Urano_GiganteHielo';
    uranusSubGroup.add(uranusMesh);
    outerPlanetsGroup.add(uranusSubGroup);

    // Neptuno
    const neptuneSubGroup = new THREE.Group();
    neptuneSubGroup.position.set(0, 0, -4.65);
    const neptuneMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.105, 20, 20),
      new THREE.MeshPhysicalMaterial({ color: 0x3b82f6, roughness: 0.28, metalness: 0.15, clearcoat: 0.9 })
    );
    neptuneMesh.name = 'Neptuno_GiganteHielo';
    neptuneSubGroup.add(neptuneMesh);
    outerPlanetsGroup.add(neptuneSubGroup);

    group.add(outerPlanetsGroup);

    // 6. CINTURÓN DE KUIPER (LOD 4)
    const kuiperBeltGroup = new THREE.Group();
    kuiperBeltGroup.name = 'KuiperBelt_OuterBoundary';

    const kCount = 300;
    const kGeo = new THREE.BufferGeometry();
    const kPos = new Float32Array(kCount * 3);
    for (let i = 0; i < kCount; i++) {
      const i3 = i * 3;
      const r = 5.1 + (Math.random() - 0.5) * 0.5;
      const th = Math.random() * Math.PI * 2;
      kPos[i3] = Math.cos(th) * r;
      kPos[i3 + 1] = (Math.random() - 0.5) * 0.15;
      kPos[i3 + 2] = Math.sin(th) * r;
    }
    kGeo.setAttribute('position', new THREE.BufferAttribute(kPos, 3));
    const kMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.03,
      transparent: true,
      opacity: 0.65
    });
    kuiperBeltGroup.add(new THREE.Points(kGeo, kMat));
    group.add(kuiperBeltGroup);

    group.scale.setScalar(0.72);
    return group;
  }

  public static buildProceduralEntity(prompt: string): THREE.Group {
    const k = (prompt || '').toLowerCase().trim();

    // 1. Planeta Tierra (Específico con satélites, luna y atmósfera)
    if (k.includes('tierra') || k.includes('earth') || k.includes('blue marble')) {
      return this.createEarth();
    }

    // 2. Nebulosa de Carina & Galaxias
    if (k.includes('carina') || k.includes('cliff') || k.includes('ngc 3324') || k.includes('ngc3324')) {
      return this.createCarinaCosmicCliffs();
    }
    if (k.includes('galazcia') || k.includes('galaxia') || k.includes('galaxy') || k.includes('nebulosa') || k.includes('nebula') || k.includes('deepsky')) {
      return this.create3DGaussianGalaxy();
    }

    // 3. El Sol
    if (/\bsol\b/i.test(k) || /\bsun\b/i.test(k) || /\bsdo\b/i.test(k) || k.includes('fotosfera') || k.includes('corona solar')) {
      return createSpectacularSunModel();
    }

    // 4. Biología Celular & Anatomía
    if (k.includes('celula') || k.includes('célula') || k.includes('cell') || k.includes('citologia') || k.includes('mitocondria') || k.includes('eucariota')) {
      return this.createHyperrealisticHumanCell();
    }
    if (k.includes('corazon') || k.includes('corazón') || k.includes('heart') || k.includes('cardio')) {
      return this.createHumanHeart();
    }
    if (k.includes('atomo') || k.includes('átomo') || k.includes('atom') || k.includes('cuantica') || k.includes('cuántica')) {
      return this.createQuantumAtom();
    }

    // 5. Arquitectura & Construcción
    if (k.includes('ventana') || k.includes('window') || k.includes('cristalera') || k.includes('cerramiento') || k.includes('carpinteria') || k.includes('carpintería') || k.includes('climalit')) {
      return this.createArchitecturalWindow();
    }

    // 6. Astronautas & Exploración Planetaria
    if (k.includes('astronaut') || k.includes('muñeco') || k.includes('astronauta') || k.includes('eva') || k.includes('humano')) {
      return this.createAstronaut();
    }
    if (k.includes('rover') || k.includes('perseverance') || k.includes('curiosity') || k.includes('marte') || k.includes('mars')) {
      return this.createMarsRover();
    }

    // 7. Sistemas Planetarios, Cartografía Cósmica & Sistema Solar
    if (k.includes('planetario') || k.includes('sistema solar') || k.includes('mapa completo') || k.includes('sistemas planetarios') || k.includes('exoplaneta') || k.includes('orbita') || k.includes('kepler') || k.includes('heliocentrico') || k.includes('planeta')) {
      return this.createPlanetarySystemMap();
    }

    return this.createPlanetarySystemMap();
  }
}

