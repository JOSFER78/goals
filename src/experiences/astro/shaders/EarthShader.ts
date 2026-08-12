import * as THREE from 'three';

/**
 * Custom GLSL Shader Material for Earth with Day/Night City Lights Transition
 * Blends NASA Blue Marble day texture with NASA Black Marble night city lights
 * based on the Sun light vector dot product with surface normal vector.
 */
export function createEarthMaterial(
  dayMap: THREE.Texture,
  nightMap: THREE.Texture,
  specularMap: THREE.Texture,
  normalMap: THREE.Texture
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uDayMap: { value: dayMap },
      uNightMap: { value: nightMap },
      uSpecularMap: { value: specularMap },
      uNormalMap: { value: normalMap },
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
      uniform sampler2D uDayMap;
      uniform sampler2D uNightMap;
      uniform sampler2D uSpecularMap;
      uniform sampler2D uNormalMap;
      uniform vec3 uSunDirection;
      uniform float uSunIntensity;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 sunDir = normalize(uSunDirection);

        // Dot product between surface normal and sun light direction
        float dotNL = dot(normal, sunDir);
        
        // Day light factor (0.0 to 1.0 with smooth terminator transition)
        float dayFactor = smoothstep(-0.2, 0.25, dotNL);

        // Sample maps
        vec4 dayColor = texture2D(uDayMap, vUv);
        vec4 nightColor = texture2D(uNightMap, vUv);
        vec4 specColor = texture2D(uSpecularMap, vUv);

        // Specular highlight on ocean water
        vec3 viewDir = normalize(cameraPosition - vWorldPosition);
        vec3 halfDir = normalize(sunDir + viewDir);
        float specAngle = max(0.0, dot(normal, halfDir));
        float specularIntensity = pow(specAngle, 32.0) * specColor.r * dayFactor;
        vec3 specular = vec3(1.0, 0.95, 0.85) * specularIntensity * 1.5;

        // Blend Day color (lit by Sun) and Night City Lights (unlit side)
        vec3 dayLighting = dayColor.rgb * (max(0.1, dotNL) * uSunIntensity + 0.15) + specular;
        vec3 nightLighting = nightColor.rgb * (1.0 - dayFactor) * 2.2;

        vec3 finalColor = mix(nightLighting, dayLighting, dayFactor);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  });
}

/**
 * Rayleigh Atmospheric Scattering Horizon Glow Shader Material
 */
export function createAtmosphereShaderMaterial(colorHex = 0x3a82ee): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vEyeVector;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
        vEyeVector = normalize(-worldPos.xyz);
        gl_Position = projectionMatrix * worldPos;
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vEyeVector;
      uniform vec3 color;

      void main() {
        float dotNV = dot(vNormal, vEyeVector);
        // Fine atmospheric rim scattering
        float intensity = pow(1.0 - max(0.0, dotNV), 3.2);
        gl_FragColor = vec4(color, intensity * 0.75);
      }
    `,
    uniforms: {
      color: { value: new THREE.Color(colorHex) }
    },
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    transparent: true,
    depthWrite: false
  });
}
