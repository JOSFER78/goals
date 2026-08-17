/**
 * GOALS 3D Cosmos Engine - PlanetSurfaceShader
 * Shader PBR Fotorrealista para Superficies Planetarias (Tierra, Luna, Marte)
 * Gestiona albedo diurno, luces nocturnas VIIRS, especular oceánico y relieve.
 */

import * as THREE from 'three';

export interface PlanetSurfaceUniforms {
  uDayTex: { value: THREE.Texture | null };
  uNightTex: { value: THREE.Texture | null };
  uSpecularMap: { value: THREE.Texture | null };
  uCloudsTex: { value: THREE.Texture | null };
  uNormalMap: { value: THREE.Texture | null };
  uSunDir: { value: THREE.Vector3 };
  uShininess: { value: number };
  uDayIntensity: { value: number };
  uNightIntensity: { value: number };
}

export function createEarthPBRMaterial(
  dayTex: THREE.Texture,
  nightTex: THREE.Texture,
  specularTex: THREE.Texture | null,
  sunDir: THREE.Vector3,
  normalTex?: THREE.Texture | null,
  cloudsTex?: THREE.Texture | null
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uDayTex: { value: dayTex },
      uNightTex: { value: nightTex },
      uSpecularMap: { value: specularTex || null },
      uCloudsTex: { value: cloudsTex || null },
      uNormalMap: { value: normalTex || null },
      uSunDir: { value: sunDir },
      uShininess: { value: 96.0 },
      uDayIntensity: { value: 1.15 },
      uNightIntensity: { value: 3.2 }
    },
    vertexShader: `
      varying vec3 vWorldNormal;
      varying vec2 vUv;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;

      void main() {
        vUv = uv;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPos.xyz;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform sampler2D uDayTex;
      uniform sampler2D uNightTex;
      uniform sampler2D uSpecularMap;
      uniform sampler2D uCloudsTex;
      uniform sampler2D uNormalMap;
      uniform vec3 uSunDir;
      uniform float uShininess;
      uniform float uDayIntensity;
      uniform float uNightIntensity;

      varying vec3 vWorldNormal;
      varying vec2 vUv;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;

      void main() {
        vec3 norm = normalize(vWorldNormal);
        vec3 lightDir = normalize(uSunDir);
        vec3 viewDir = normalize(vViewPosition);

        // 1. Producto escalar luz solar y vista
        float dotNL = dot(norm, lightDir);
        float dotNV = max(dot(norm, viewDir), 0.0);

        // 2. Transición día / noche hiper-calibrada
        float dayFactor = smoothstep(-0.06, 0.18, dotNL);
        float nightFactor = smoothstep(0.06, -0.12, dotNL);

        // 3. Muestreo de texturas satelitales NASA
        vec4 dayColor = texture2D(uDayTex, vUv);
        vec4 nightColor = texture2D(uNightTex, vUv);

        // 4. Máscara Oceánica
        float oceanMask = texture2D(uSpecularMap, vUv).r;

        // 5. Emisión de luces urbanas nocturnas (NASA Black Marble dorada)
        vec3 cityNightGlow = vec3(1.0, 0.82, 0.55) * nightColor.rgb * nightFactor * uNightIntensity;

        // 6. Banda Crepuscular / Atardecer en el Terminador (Física Rayleigh)
        float twilight = smoothstep(-0.14, 0.02, dotNL) * smoothstep(0.18, -0.02, dotNL);
        vec3 twilightRayleigh = vec3(1.0, 0.42, 0.12) * twilight * 1.35;

        // 7. Brillo Especular de Agua Líquida con Fresnel Schlick
        vec3 halfDir = normalize(lightDir + viewDir);
        float NdotH = max(dot(norm, halfDir), 0.0);
        float specPower = pow(NdotH, uShininess);
        float fresnelSchlick = 0.04 + 0.96 * pow(1.0 - dotNV, 5.0);
        vec3 sunOceanGlint = vec3(1.0, 0.98, 0.92) * specPower * fresnelSchlick * oceanMask * dayFactor * 2.8;

        // 8. Composición final
        vec3 groundColor = (dayColor.rgb * dayFactor) + (dayColor.rgb * 0.02);
        vec3 finalColor = groundColor + cityNightGlow + twilightRayleigh + sunOceanGlint;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  });
}
