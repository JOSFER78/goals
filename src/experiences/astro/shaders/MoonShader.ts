import * as THREE from 'three';

/**
 * GLSL Shader for Photorealistic Lunar Surface
 * Implements the Lommel-Seeliger Law for airless regolith reflectance
 * and the Zero-Phase Opposition Surge Effect (backscattering peak).
 */
export function createMoonShaderMaterial(
  moonMap: THREE.Texture
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMoonMap: { value: moonMap },
      uSunDirection: { value: new THREE.Vector3(9, 4, 7).normalize() },
      uSunIntensity: { value: 2.2 }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uMoonMap;
      uniform vec3 uSunDirection;
      uniform float uSunIntensity;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        vec3 N = normalize(vNormal);
        vec3 L = normalize(uSunDirection);
        vec3 V = normalize(cameraPosition - vWorldPosition);

        float mu0 = max(0.001, dot(N, L)); // Cosine of solar incidence angle
        float mu  = max(0.001, dot(N, V)); // Cosine of emission angle

        // Lommel-Seeliger Law for airless lunar regolith: L(mu0, mu) = mu0 / (mu0 + mu)
        float lommelSeeliger = mu0 / (mu0 + mu);

        // Opposition Surge (Backscattering brightening at small phase angles)
        float cosPhase = clamp(dot(V, L), -1.0, 1.0);
        float phaseAngle = acos(cosPhase);
        float oppositionSurge = 1.0 + 0.65 / (1.0 + tan(phaseAngle * 0.5) / 0.08);

        vec4 albedo = texture2D(uMoonMap, vUv);
        
        // Final photometric intensity
        vec3 finalLighting = albedo.rgb * (lommelSeeliger * oppositionSurge * uSunIntensity + 0.08);

        gl_FragColor = vec4(finalLighting, 1.0);
      }
    `
  });
}
