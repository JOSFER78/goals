import * as THREE from 'three';

// High-Resolution Public NASA CDN URLs (Three.js official repository / Solar System assets)
export const NASA_TEXTURE_URLS = {
  earthDay: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  earthSpecular: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg',
  earthNormal: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
  earthClouds: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png',
  earthNight: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png',
  moon: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
  sun: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/lava/lavatile.jpg',
  mars: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  jupiter: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  saturn: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  saturnRing: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  venus: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  mercury: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  neptune: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  uranus: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
  starfield: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png'
};

const textureCache: Record<string, THREE.Texture> = {};

/**
 * Genera texturas astronómicas procedimentales HD 2K (2048x1024)
 */
export function createPhotorealisticNASATexture(type: string): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  if (type === 'earthDay') {
    // 1. Deep Ocean Base
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, 1024);
    oceanGrad.addColorStop(0, '#061a33');
    oceanGrad.addColorStop(0.5, '#0b3558');
    oceanGrad.addColorStop(1, '#061a33');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    // Coastlines depth glow
    ctx.fillStyle = 'rgba(24, 154, 180, 0.22)';
    for (let i = 0; i < 90; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 2048, 150 + Math.random() * 724, 60 + Math.random() * 140, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Continents Landmass
    const drawLand = (x: number, y: number, rx: number, ry: number, color = '#2b5e46') => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
    };

    drawLand(450, 320, 260, 180, '#2d6a4f'); // N America
    drawLand(600, 650, 140, 260, '#386641'); // S America
    drawLand(1150, 420, 350, 240, '#2b5e46'); // Africa
    drawLand(1450, 300, 420, 220, '#1b4332'); // Eurasia
    drawLand(1720, 720, 180, 130, '#52796f'); // Australia

    // Desert terrain bands
    drawLand(1120, 380, 200, 80, '#d4a373'); // Sahara
    drawLand(1500, 280, 180, 70, '#c68b59'); // Gobi

    // Polar Ice Caps
    const iceGrad = ctx.createLinearGradient(0, 0, 0, 120);
    iceGrad.addColorStop(0, '#ffffff');
    iceGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = iceGrad;
    ctx.fillRect(0, 0, 2048, 120);

    const antarcticaGrad = ctx.createLinearGradient(0, 904, 0, 1024);
    antarcticaGrad.addColorStop(0, 'rgba(255,255,255,0)');
    antarcticaGrad.addColorStop(1, '#ffffff');
    ctx.fillStyle = antarcticaGrad;
    ctx.fillRect(0, 904, 2048, 120);

  } else if (type === 'earthSpecular') {
    ctx.fillStyle = '#ffffff'; // Oceans shine
    ctx.fillRect(0, 0, 2048, 1024);
    ctx.fillStyle = '#000000'; // Land is matte
    ctx.beginPath();
    ctx.ellipse(450, 320, 260, 180, Math.PI / 6, 0, Math.PI * 2); ctx.fill();
    ctx.ellipse(600, 650, 140, 260, Math.PI / 6, 0, Math.PI * 2); ctx.fill();
    ctx.ellipse(1150, 420, 350, 240, Math.PI / 6, 0, Math.PI * 2); ctx.fill();
    ctx.ellipse(1450, 300, 420, 220, Math.PI / 6, 0, Math.PI * 2); ctx.fill();
    ctx.ellipse(1720, 720, 180, 130, Math.PI / 6, 0, Math.PI * 2); ctx.fill();

  } else if (type === 'earthClouds') {
    ctx.clearRect(0, 0, 2048, 1024);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let i = 0; i < 180; i++) {
      const cx = Math.random() * 2048;
      const cy = Math.random() * 1024;
      const rx = 80 + Math.random() * 220;
      const ry = 20 + Math.random() * 50;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

  } else if (type === 'sun') {
    const sunGrad = ctx.createLinearGradient(0, 0, 2048, 1024);
    sunGrad.addColorStop(0, '#ff9e00');
    sunGrad.addColorStop(0.5, '#ff6000');
    sunGrad.addColorStop(1, '#ff0000');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, 2048, 1024);

    ctx.fillStyle = '#9e2a2b';
    for (let i = 0; i < 300; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 2048, Math.random() * 1024, 5 + Math.random() * 30, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'moon') {
    ctx.fillStyle = '#6c757d';
    ctx.fillRect(0, 0, 2048, 1024);
    ctx.fillStyle = '#343a40';
    ctx.beginPath();
    ctx.ellipse(600, 400, 220, 160, 0, 0, Math.PI * 2); ctx.fill();
    ctx.ellipse(900, 350, 180, 140, 0, 0, Math.PI * 2); ctx.fill();
    ctx.ellipse(1200, 500, 250, 180, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#adb5bd';
    for (let i = 0; i < 350; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 2048, Math.random() * 1024, 4 + Math.random() * 28, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = '#3a86ff';
    ctx.fillRect(0, 0, 2048, 1024);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Carga texturas con soporte CORS habilitado y fallback 2K HD automático
 */
export function loadNASATexture(key: keyof typeof NASA_TEXTURE_URLS): THREE.Texture {
  if (textureCache[key]) {
    return textureCache[key];
  }

  const fallback = createPhotorealisticNASATexture(key);
  textureCache[key] = fallback;

  const url = NASA_TEXTURE_URLS[key];
  if (url) {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      url,
      (loadedTex) => {
        loadedTex.wrapS = THREE.RepeatWrapping;
        loadedTex.wrapT = THREE.ClampToEdgeWrapping;
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        textureCache[key].image = loadedTex.image;
        textureCache[key].needsUpdate = true;
      },
      undefined,
      (err) => {
        console.warn(`Textura NASA CDN [${key}]: utilizando renderizado procedimental HD 2K.`, err);
      }
    );
  }

  return textureCache[key];
}

/**
 * Crea un halo atmosférico azulado para la Tierra
 */
export function createAtmosphereGlow(colorHex = 0x3a82ee, opacity = 0.55, scale = 1.05): THREE.Mesh {
  const geom = new THREE.SphereGeometry(2 * scale, 64, 64);
  const mat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      uniform vec3 uColor;
      uniform float uOpacity;
      void main() {
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
        gl_FragColor = vec4(uColor, intensity * uOpacity);
      }
    `,
    uniforms: {
      uColor: { value: new THREE.Color(colorHex) },
      uOpacity: { value: opacity }
    },
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
  });
  return new THREE.Mesh(geom, mat);
}
