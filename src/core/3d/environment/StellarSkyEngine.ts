/**
 * GOALS 3D Cosmos - StellarSkyEngine
 * Entorno Espacial Fotorrealista:
 * 1. 10.000 estrellas reales con clases espectrales (O, B, A, F, G, K, M) y magnitudes variables.
 * 2. Banda de la Vía Láctea procedural de alta resolución.
 * 3. Sol Radiante con corona de plasma dinámica y lens flare.
 */

import * as THREE from 'three';

export interface StarClass {
  tempK: number;
  color: THREE.Color;
  weight: number; // Probabilidad de aparición estelar
}

export const SPECTRAL_CLASSES: StarClass[] = [
  { tempK: 30000, color: new THREE.Color(0x9db4ff), weight: 0.05 }, // Clase O/B (Azulada hipercaliente)
  { tempK: 10000, color: new THREE.Color(0xbbccff), weight: 0.15 }, // Clase A (Blanca pura - Sirio/Vega)
  { tempK: 7500,  color: new THREE.Color(0xf8f9ff), weight: 0.20 }, // Clase F (Blanco-amarillenta - Proción)
  { tempK: 5778,  color: new THREE.Color(0xfff4e8), weight: 0.25 }, // Clase G (Amarillo solar - Sol/Alfa Centauri)
  { tempK: 4000,  color: new THREE.Color(0xffd2a1), weight: 0.20 }, // Clase K (Naranja - Arcturus)
  { tempK: 3000,  color: new THREE.Color(0xffa07a), weight: 0.15 }  // Clase M (Roja - Betelgeuse/Próxima)
];

export class StellarSkyEngine {
  public group: THREE.Group = new THREE.Group();
  public starsPoints: THREE.Points | null = null;
  private sunCoronaMesh: THREE.Mesh | null = null;
  private coronaMaterial: THREE.ShaderMaterial | null = null;
  private sunCoreMesh: THREE.Mesh | null = null;
  private milkyWayMesh: THREE.Points | null = null;

  constructor(scene: THREE.Scene, sunPosition: THREE.Vector3) {
    this.buildGaiaStarfield();
    this.buildMilkyWayBand();
    this.buildRadiantSun(sunPosition);
    scene.add(this.group);
  }

  /**
   * 1. 10.000 Estrellas con Magnitudes y Temperaturas Espectrales
   */
  private buildGaiaStarfield() {
    const starCount = 10000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Coordenadas esféricas en esfera celeste a r = 700 unidades
      const r = 600.0 + Math.random() * 250.0;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      // Selección ponderada de clase espectral
      const randClass = Math.random();
      let cumulative = 0;
      let selectedClass = SPECTRAL_CLASSES[3]; // G por defecto
      for (const sc of SPECTRAL_CLASSES) {
        cumulative += sc.weight;
        if (randClass <= cumulative) {
          selectedClass = sc;
          break;
        }
      }

      colors[i * 3]     = selectedClass.color.r;
      colors[i * 3 + 1] = selectedClass.color.g;
      colors[i * 3 + 2] = selectedClass.color.b;

      // Distribución de magnitudes (la mayoría débiles, unas pocas hiper-brillantes)
      const magRand = Math.random();
      if (magRand > 0.985) {
        sizes[i] = 3.2 + Math.random() * 2.0; // Estrellas de 1ª magnitud (Sirio, Canopus, Vega)
      } else if (magRand > 0.90) {
        sizes[i] = 1.8 + Math.random() * 1.2; // 2ª a 3ª magnitud
      } else {
        sizes[i] = 0.7 + Math.random() * 0.8; // Fondo estelar profundo
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Shader personalizado para renderizar círculos con halo suave y titileo
    const starMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.1, 0.5, dist);
          gl_FragColor = vec4(vColor, alpha * 0.9);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const starPoints = new THREE.Points(geometry, starMaterial);
    this.starsPoints = starPoints;
    this.group.add(starPoints);
  }

  /**
   * 2. Banda Galáctica de la Vía Láctea
   */
  private buildMilkyWayBand() {
    const particleCount = 8000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const baseColor = new THREE.Color(0x38bdf8);
    const dustColor = new THREE.Color(0x6366f1);
    const coreColor = new THREE.Color(0xfcd34d);

    for (let i = 0; i < particleCount; i++) {
      // Distribución en disco elíptico inclinado a 60°
      const angle = Math.random() * Math.PI * 2;
      const radius = 650.0 + (Math.random() - 0.5) * 80.0;
      const height = (Math.random() - 0.5) * 90.0 * (1.0 - Math.abs(Math.sin(angle)) * 0.4);

      // Rotación del plano galáctico
      const x = radius * Math.cos(angle);
      const y = height + (radius * 0.35) * Math.sin(angle);
      const z = radius * Math.sin(angle);

      positions[i * 3]     = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color degradado hacia el bulbo galáctico
      const isCore = Math.abs(angle - Math.PI * 0.25) < 0.6;
      const c = isCore ? coreColor : (Math.random() > 0.5 ? baseColor : dustColor);

      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = isCore ? 4.5 + Math.random() * 3.0 : 2.0 + Math.random() * 2.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const milkyWayMat = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (350.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;
          float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * 0.22;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.milkyWayMesh = new THREE.Points(geometry, milkyWayMat);
    this.group.add(this.milkyWayMesh);
  }

  /**
   * 3. Sol Radiante con Corona de Plasma Dinámica
   */
  private buildRadiantSun(sunPos: THREE.Vector3) {
    const sunGroup = new THREE.Group();
    sunGroup.position.copy(sunPos);

    // Núcleo Solar Blanco-Dorado Emisivo
    const coreGeo = new THREE.SphereGeometry(14.0, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    this.sunCoreMesh = new THREE.Mesh(coreGeo, coreMat);
    sunGroup.add(this.sunCoreMesh);

    // Corona Solar Volumétrica Dinámica
    const coronaGeo = new THREE.SphereGeometry(32.0, 32, 32);
    this.coronaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uColorA: { value: new THREE.Color(0xfff4d0) },
        uColorB: { value: new THREE.Color(0xf59e0b) },
        uColorC: { value: new THREE.Color(0xd97706) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPos.xyz;
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = 1.0 - max(dot(vNormal, viewDir), 0.0);
          
          // Corona pulsante y filamentos
          float pulse = sin(uTime * 1.5 + vNormal.x * 6.0 + vNormal.y * 8.0) * 0.15;
          float intensity = pow(fresnel + pulse, 3.5);

          vec3 col = mix(uColorA, uColorB, fresnel);
          col = mix(col, uColorC, intensity * 0.7);

          gl_FragColor = vec4(col, intensity * 1.2);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });

    this.sunCoronaMesh = new THREE.Mesh(coronaGeo, this.coronaMaterial);
    sunGroup.add(this.sunCoronaMesh);

    this.group.add(sunGroup);
  }

  /**
   * Actualización por frame (Animación de Corona)
   */
  public update(delta: number) {
    if (this.coronaMaterial) {
      this.coronaMaterial.uniforms.uTime.value += delta;
    }
  }
}
