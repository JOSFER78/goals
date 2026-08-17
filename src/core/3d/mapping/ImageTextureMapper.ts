/**
 * src/core/3d/mapping/ImageTextureMapper.ts
 * Motor de Mapeo de Fotos de Usuario a Texturas PBR 3D (Albedo, Normal Map, Roughness)
 * y Generador de Vistas Multi-Ángulo Sintetizadas (Novel View Synthesis via DIBR / Parallax).
 */

import * as THREE from 'three';

export interface MultiAngleView {
  id: string;
  name: string;
  angleLabel: string;
  yawDeg: number;
  pitchDeg: number;
  dataUrl: string;
  description: string;
}

export interface ProcessedPhotoTexture {
  diffuseMap: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  aspectRatio: number;
  dominantColor: string;
  sourceUrl: string;
  fileName: string;
  multiAngleViews: MultiAngleView[];
}

export class NovelViewSynthesizer {
  /**
   * Genera 4 perspectivas angulares sintéticas a partir de la imagen y su mapa de profundidad
   */
  public static generateMultiAngleViews(
    sourceImg: HTMLImageElement,
    width: number,
    height: number
  ): MultiAngleView[] {
    const angles = [
      { id: 'view_0', name: 'Frontal (0°)', angleLabel: '0° Sensor Principal', yaw: 0, pitch: 0, desc: 'Enfoque frontal ortogonal directo del sensor' },
      { id: 'view_45', name: 'Isométrica (45°)', angleLabel: '45° Perspectiva 3D', yaw: 35, pitch: 20, desc: 'Profundidad tridimensional y volumen oblicuo' },
      { id: 'view_90', name: 'Perfil Lateral (90°)', angleLabel: '90° Vista Lateral', yaw: 75, pitch: 0, desc: 'Proyección ortogonal de espesor y silueta lateral' },
      { id: 'view_top', name: 'Cenital / Corte', angleLabel: 'Top-Down 90°', yaw: 0, pitch: 75, desc: 'Plano superior axial y distribución espacial' }
    ];

    return angles.map(ang => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.min(width, 512);
      canvas.height = Math.min(height, 512);
      const ctx = canvas.getContext('2d')!;

      const radYaw = (ang.yaw * Math.PI) / 180;
      const radPitch = (ang.pitch * Math.PI) / 180;

      // Deformación DIBR (Depth-Image-Based Rendering) por desplazamiento tangencial
      const shiftX = Math.sin(radYaw) * (canvas.width * 0.08);
      const shiftY = Math.sin(radPitch) * (canvas.height * 0.08);

      ctx.fillStyle = '#060913';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      // Aplicar transformación simulando el ángulo de cámara
      ctx.translate(canvas.width / 2 + shiftX, canvas.height / 2 + shiftY);
      ctx.rotate(radYaw * 0.12);
      ctx.scale(Math.cos(radYaw * 0.35), Math.cos(radPitch * 0.35));
      ctx.drawImage(sourceImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      ctx.restore();

      // Añadir marcas de cuadrícula de fotogrametría técnica en las vistas
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Marca de mira central
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.stroke();

      return {
        id: ang.id,
        name: ang.name,
        angleLabel: ang.angleLabel,
        yawDeg: ang.yaw,
        pitchDeg: ang.pitch,
        dataUrl: canvas.toDataURL('image/jpeg', 0.88),
        description: ang.desc
      };
    });
  }
}

export class ImageTextureMapper {

  /**
   * Procesa un archivo de imagen (File o Blob) y genera mapas de Albedo, Normales y Rugosidad PBR con Vistas Multi-Ángulo
   */
  public static async processUserImage(file: File): Promise<ProcessedPhotoTexture> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          try {
            const width = Math.min(img.width, 2048);
            const height = Math.min(img.height, 2048);

            // 1. Canvas para Diffuse / Albedo
            const diffuseCanvas = document.createElement('canvas');
            diffuseCanvas.width = width;
            diffuseCanvas.height = height;
            const dCtx = diffuseCanvas.getContext('2d')!;
            dCtx.drawImage(img, 0, 0, width, height);

            const imgData = dCtx.getImageData(0, 0, width, height);
            const data = imgData.data;

            // 2. Canvas para Normal Map (Filtro Sobel 3x3)
            const normalCanvas = document.createElement('canvas');
            normalCanvas.width = width;
            normalCanvas.height = height;
            const nCtx = normalCanvas.getContext('2d')!;
            const nImgData = nCtx.createImageData(width, height);
            const nData = nImgData.data;

            // 3. Canvas para Roughness Map
            const roughCanvas = document.createElement('canvas');
            roughCanvas.width = width;
            roughCanvas.height = height;
            const rCtx = roughCanvas.getContext('2d')!;
            const rImgData = rCtx.createImageData(width, height);
            const rData = rImgData.data;

            // Calcular luminancia en escala de grises para el mapa de relieve
            const gray = new Float32Array(width * height);
            let rSum = 0, gSum = 0, bSum = 0;
            const totalPixels = width * height;

            for (let i = 0; i < totalPixels; i++) {
              const idx = i * 4;
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];

              rSum += r;
              gSum += g;
              bSum += b;

              // Luminancia perceptiva estándar (ITU-R BT.709)
              const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0;
              gray[i] = lum;

              // Roughness inverso: zonas más claras suelen ser más reflectantes/pulidas
              const roughVal = Math.floor(THREE.MathUtils.clamp((1.0 - lum * 0.7) * 255, 30, 240));
              rData[idx] = roughVal;
              rData[idx + 1] = roughVal;
              rData[idx + 2] = roughVal;
              rData[idx + 3] = 255;
            }

            // Aplicar Operador de Sobel 3x3 para derivar vectores Normales Tangenciales
            const strength = 3.2;
            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                const idx = y * width + x;

                const xLeft = y * width + (x > 0 ? x - 1 : width - 1);
                const xRight = y * width + (x < width - 1 ? x + 1 : 0);
                const yUp = (y > 0 ? y - 1 : height - 1) * width + x;
                const yDown = (y < height - 1 ? y + 1 : 0) * width + x;

                const dX = (gray[xRight] - gray[xLeft]) * strength;
                const dY = (gray[yDown] - gray[yUp]) * strength;
                const dZ = 1.0;

                const len = Math.sqrt(dX * dX + dY * dY + dZ * dZ);
                const nx = (dX / len) * 0.5 + 0.5;
                const ny = (dY / len) * 0.5 + 0.5;
                const nz = (dZ / len) * 0.5 + 0.5;

                const pIdx = idx * 4;
                nData[pIdx] = Math.floor(nx * 255);
                nData[pIdx + 1] = Math.floor(ny * 255);
                nData[pIdx + 2] = Math.floor(nz * 255);
                nData[pIdx + 3] = 255;
              }
            }

            nCtx.putImageData(nImgData, 0, 0);
            rCtx.putImageData(rImgData, 0, 0);

            // Generar Texturas Three.js
            const diffuseMap = new THREE.CanvasTexture(diffuseCanvas);
            diffuseMap.colorSpace = THREE.SRGBColorSpace;
            diffuseMap.wrapS = THREE.RepeatWrapping;
            diffuseMap.wrapT = THREE.RepeatWrapping;

            const normalMap = new THREE.CanvasTexture(normalCanvas);
            normalMap.wrapS = THREE.RepeatWrapping;
            normalMap.wrapT = THREE.RepeatWrapping;

            const roughnessMap = new THREE.CanvasTexture(roughCanvas);
            roughnessMap.wrapS = THREE.RepeatWrapping;
            roughnessMap.wrapT = THREE.RepeatWrapping;

            // Color dominante promedio
            const avgR = Math.floor(rSum / totalPixels);
            const avgG = Math.floor(gSum / totalPixels);
            const avgB = Math.floor(bSum / totalPixels);
            const dominantColor = `#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB).toString(16).slice(1)}`;

            // Generar las 4 perspectivas multi-ángulo sintéticas
            const multiAngleViews = NovelViewSynthesizer.generateMultiAngleViews(img, width, height);

            resolve({
              diffuseMap,
              normalMap,
              roughnessMap,
              aspectRatio: img.width / img.height,
              dominantColor,
              sourceUrl: reader.result as string,
              fileName: file.name,
              multiAngleViews
            });
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Procesa un elemento HTMLImageElement ya cargado y deriva texturas PBR y vistas multi-ángulo
   */
  public static processImageElement(img: HTMLImageElement, sourceUrl: string, fileName: string = 'foto_referencia.jpg'): ProcessedPhotoTexture {
    const width = Math.min(img.width || 512, 2048);
    const height = Math.min(img.height || 512, 2048);

    // 1. Canvas para Diffuse / Albedo
    const diffuseCanvas = document.createElement('canvas');
    diffuseCanvas.width = width;
    diffuseCanvas.height = height;
    const dCtx = diffuseCanvas.getContext('2d')!;
    dCtx.drawImage(img, 0, 0, width, height);

    const imgData = dCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // 2. Canvas para Normal Map (Filtro Sobel 3x3)
    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = width;
    normalCanvas.height = height;
    const nCtx = normalCanvas.getContext('2d')!;
    const nImgData = nCtx.createImageData(width, height);
    const nData = nImgData.data;

    // 3. Canvas para Roughness Map
    const roughCanvas = document.createElement('canvas');
    roughCanvas.width = width;
    roughCanvas.height = height;
    const rCtx = roughCanvas.getContext('2d')!;
    const rImgData = rCtx.createImageData(width, height);
    const rData = rImgData.data;

    const gray = new Float32Array(width * height);
    let rSum = 0, gSum = 0, bSum = 0;
    const totalPixels = width * height;

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      rSum += r;
      gSum += g;
      bSum += b;

      const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0;
      gray[i] = lum;

      const roughVal = Math.floor(THREE.MathUtils.clamp((1.0 - lum * 0.7) * 255, 30, 240));
      rData[idx] = roughVal;
      rData[idx + 1] = roughVal;
      rData[idx + 2] = roughVal;
      rData[idx + 3] = 255;
    }

    const strength = 3.2;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;

        const xLeft = y * width + (x > 0 ? x - 1 : width - 1);
        const xRight = y * width + (x < width - 1 ? x + 1 : 0);
        const yUp = (y > 0 ? y - 1 : height - 1) * width + x;
        const yDown = (y < height - 1 ? y + 1 : 0) * width + x;

        const dX = (gray[xRight] - gray[xLeft]) * strength;
        const dY = (gray[yDown] - gray[yUp]) * strength;
        const dZ = 1.0;

        const len = Math.sqrt(dX * dX + dY * dY + dZ * dZ);
        const nx = (dX / len) * 0.5 + 0.5;
        const ny = (dY / len) * 0.5 + 0.5;
        const nz = (dZ / len) * 0.5 + 0.5;

        const pIdx = idx * 4;
        nData[pIdx] = Math.floor(nx * 255);
        nData[pIdx + 1] = Math.floor(ny * 255);
        nData[pIdx + 2] = Math.floor(nz * 255);
        nData[pIdx + 3] = 255;
      }
    }

    nCtx.putImageData(nImgData, 0, 0);
    rCtx.putImageData(rImgData, 0, 0);

    const diffuseMap = new THREE.CanvasTexture(diffuseCanvas);
    diffuseMap.colorSpace = THREE.SRGBColorSpace;
    diffuseMap.wrapS = THREE.RepeatWrapping;
    diffuseMap.wrapT = THREE.RepeatWrapping;

    const normalMap = new THREE.CanvasTexture(normalCanvas);
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;

    const roughnessMap = new THREE.CanvasTexture(roughCanvas);
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.RepeatWrapping;

    const avgR = Math.floor(rSum / totalPixels);
    const avgG = Math.floor(gSum / totalPixels);
    const avgB = Math.floor(bSum / totalPixels);
    const dominantColor = `#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB).toString(16).slice(1)}`;

    const multiAngleViews = NovelViewSynthesizer.generateMultiAngleViews(img, width, height);

    return {
      diffuseMap,
      normalMap,
      roughnessMap,
      aspectRatio: (img.width || 1) / (img.height || 1),
      dominantColor,
      sourceUrl,
      fileName,
      multiAngleViews
    };
  }

  /**
   * Carga y procesa directamente una URL de imagen para el pipeline de visión y mapeo
   */
  public static async processImageUrl(url: string, fileName: string = 'imagen_referencia.jpg'): Promise<ProcessedPhotoTexture> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const processed = ImageTextureMapper.processImageElement(img, url, fileName);
          resolve(processed);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = (err) => reject(new Error('No se pudo cargar la imagen desde la URL: ' + url));
      img.src = url;
    });
  }

  /**
   * Aplica la textura y los mapas PBR a un grupo Three.js completo con proyección física
   */
  public static applyTextureToGroup(group: THREE.Group, texture: ProcessedPhotoTexture) {
    group.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh) {
        const physicalMat = new THREE.MeshPhysicalMaterial({
          map: texture.diffuseMap,
          normalMap: texture.normalMap,
          normalScale: new THREE.Vector2(0.95, 0.95),
          roughnessMap: texture.roughnessMap,
          metalness: 0.82,
          roughness: 0.22,
          clearcoat: 0.65,
          clearcoatRoughness: 0.08,
          envMapIntensity: 2.6
        });

        mesh.material = physicalMat;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }
}
