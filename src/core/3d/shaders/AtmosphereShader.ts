/**
 * GOALS 3D Cosmos Engine - AtmosphereShader
 * Shader de Dispersión Atmosférica Física de Alto Contraste (Aproximación Rayleigh-Mie)
 * Produce un resplandor celeste brillante en el limbo exterior y un terminador crepuscular dorado/ámbar.
 */

import * as THREE from 'three';

export interface AtmosphereShaderUniforms {
  uSunDir: { value: THREE.Vector3 };
  uAtmosphereColor: { value: THREE.Color };
  uSunsetColor: { value: THREE.Color };
  uInnerRadius: { value: number };
  uOuterRadius: { value: number };
}

export function createAtmosphereMaterial(
  sunDir: THREE.Vector3,
  innerRadius: number,
  outerRadius: number,
  atmoColor = 0x3b82f6,
  sunsetColor = 0xf97316
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunDir: { value: sunDir },
      uAtmosphereColor: { value: new THREE.Color(atmoColor) },
      uSunsetColor: { value: new THREE.Color(sunsetColor) },
      uInnerRadius: { value: innerRadius },
      uOuterRadius: { value: outerRadius }
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;

      void main() {
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uSunDir;
      uniform vec3 uAtmosphereColor;
      uniform vec3 uSunsetColor;

      varying vec3 vWorldNormal;
      varying vec3 vWorldPosition;
      varying vec3 vViewPosition;

      void main() {
        vec3 norm = normalize(vWorldNormal);
        vec3 lightDir = normalize(uSunDir);
        vec3 viewDir = normalize(vViewPosition);

        // 1. Ángulo con la luz solar
        float dotNL = dot(norm, lightDir);

        // 2. Efecto Fresnel en el limbo atmosférico exterior
        float dotNV = max(dot(-norm, viewDir), 0.0);
        float fresnel = pow(1.0 - dotNV, 4.5);

        // 3. Dispersión Rayleigh en la cara diurna (Azul Celeste Atmosférico Natural)
        float dayFactor = smoothstep(-0.05, 0.20, dotNL);
        vec3 rayleighBlue = uAtmosphereColor * dayFactor * 1.6;

        // 4. Dispersión Mie / Atardecer en el terminador (Ámbar cálido suave)
        float twilightBand = smoothstep(-0.15, 0.02, dotNL) * smoothstep(0.20, -0.02, dotNL);
        vec3 mieSunset = uSunsetColor * twilightBand * 2.0;

        // 5. Opacidad física: CERO en el lado nocturno, suave en el diurno
        float alpha = fresnel * (dayFactor * 0.85 + twilightBand * 0.95);

        vec3 finalColor = rayleighBlue + mieSunset;
        gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
  });
}
