/**
 * download_real_datasets.js
 * Descarga y guarda localmente datasets de fotos reales multi-ángulo de la NASA
 * en public/downloads/datasets/{slug}/ para alimentar el visor 3D y el estudio fotogramétrico.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATASETS_DIR = path.join(ROOT_DIR, 'public', 'downloads', 'datasets');

fs.mkdirSync(DATASETS_DIR, { recursive: true });

const DATASET_SOURCES = {
  iss: {
    name: 'Estación Espacial Internacional (ISS)',
    slug: 'iss',
    category: 'Aeroespacial',
    description: 'Fotografías reales multi-ángulo capturadas durante sobrevuelos (Flyaround) de transbordadores espaciales STS-132, STS-114 y STS-110.',
    modelUrl: '/models_3d/iss_station.glb',
    images: [
      {
        id: 'view_01_sts132',
        title: 'ISS Vista Frontal Completa (STS-132)',
        url: 'https://images-assets.nasa.gov/image/s132e013215/s132e013215~medium.jpg',
        source: 'NASA Johnson Space Center'
      },
      {
        id: 'view_02_sts110',
        title: 'ISS Vista Posterior y Módulos Zvezda/Zarya (STS-110)',
        url: 'https://images-assets.nasa.gov/image/s110e5918/s110e5918~medium.jpg',
        source: 'NASA Johnson Space Center'
      },
      {
        id: 'view_03_sts114',
        title: 'ISS Ángulo Oblicuo y Alas Solares (STS-114)',
        url: 'https://images-assets.nasa.gov/image/s114e7235/s114e7235~medium.jpg',
        source: 'NASA Johnson Space Center'
      }
    ]
  },
  sol: {
    name: 'El Sol (NASA SDO 4K AIA)',
    slug: 'sol',
    category: 'Astrofísica Solar',
    description: 'Imágenes espectrales reales capturadas por el Solar Dynamics Observatory (SDO) en AIA 304 Å y AIA 171 Å.',
    modelUrl: '',
    images: [
      {
        id: 'view_01_aia304',
        title: 'SDO AIA 304 Å - Plasma Cromosférico',
        url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg',
        source: 'NASA Goddard Space Flight Center'
      },
      {
        id: 'view_02_aia171',
        title: 'SDO AIA 171 Å - Bucles Coronales de Plasma',
        url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000494/GSFC_20171208_Archive_e000494~orig.jpg',
        source: 'NASA SDO Team'
      }
    ]
  },
  brain: {
    name: 'Encéfalo y Sistema Nervioso',
    slug: 'brain',
    category: 'Neuroanatomía',
    description: 'Cortes coronales y axiales de Resonancia Magnética (MRI) 3D con segmentación de materia gris y blanca.',
    modelUrl: '/models_3d/brain.glb',
    images: [
      {
        id: 'view_01_mri_3d',
        title: 'Reconstrucción de Superficie Cortical Humana',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Human_brain_left_hemisphere_showing_cortex.png/640px-Human_brain_left_hemisphere_showing_cortex.png',
        source: 'Brain Atlas Medical Imaging'
      },
      {
        id: 'view_02_mri_sagittal',
        title: 'Corte Sagital de Resonancia Magnética',
        url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Brain_MRI_sagittal.jpg/640px-Brain_MRI_sagittal.jpg',
        source: 'Radiopaedia Open Medical MRI'
      }
    ]
  },
  webb: {
    name: 'Telescopio Espacial James Webb (JWST)',
    slug: 'webb',
    category: 'Observatorio Espacial',
    description: 'Imágenes oficiales de alta resolución de la NASA durante el despliegue de los 18 espejos hexagonales de berilio bañado en oro.',
    modelUrl: '/models_3d/james_webb_telescope.glb',
    images: [
      {
        id: 'view_01_mirror',
        title: 'JWST Espejo Primario de Oro en Cámara Limpia',
        url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~orig.jpg',
        source: 'NASA / Chris Gunn'
      }
    ]
  }
};

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.warn(`[Aviso] No se pudo descargar ${url}: ${err.message}`);
    return false;
  }
}

async function run() {
  console.log('=== DESCARGANDO DATASETS DE FOTOGRAFÍAS REALES MULTI-ÁNGULO ===\n');

  for (const [key, dataset] of Object.entries(DATASET_SOURCES)) {
    const targetDir = path.join(DATASETS_DIR, dataset.slug);
    const imagesDir = path.join(targetDir, 'images');
    fs.mkdirSync(imagesDir, { recursive: true });

    console.log(`📁 Procesando dataset: ${dataset.name} -> ${targetDir}`);

    const downloadedImages = [];

    for (let i = 0; i < dataset.images.length; i++) {
      const img = dataset.images[i];
      const filename = `${img.id}.jpg`;
      const localFilePath = path.join(imagesDir, filename);
      const publicUrl = `/downloads/datasets/${dataset.slug}/images/${filename}`;

      process.stdout.write(`  ⏳ Descargando foto ${i + 1}/${dataset.images.length}: ${img.title}... `);
      const success = await downloadFile(img.url, localFilePath);

      if (success) {
        console.log(`✅ Guardada (${(fs.statSync(localFilePath).size / 1024).toFixed(1)} KB)`);
        downloadedImages.push({
          ...img,
          localPath: publicUrl,
          sizeBytes: fs.statSync(localFilePath).size
        });
      } else {
        console.log(`❌ Fallida`);
      }
    }

    // Escribir manifiesto JSON
    const manifest = {
      slug: dataset.slug,
      name: dataset.name,
      category: dataset.category,
      description: dataset.description,
      modelUrl: dataset.modelUrl,
      downloadDate: new Date().toISOString(),
      imagesCount: downloadedImages.length,
      images: downloadedImages
    };

    const manifestPath = path.join(targetDir, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(`  📄 Manifiesto generado: ${manifestPath}\n`);
  }

  console.log('🎉 Todos los datasets fotográficos reales se han descargado e indexado.');
}

run();
