const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = 'C:/Users/yo/.gemini/antigravity-ide/brain/6dbe55d4-3196-41d8-b4b1-80deba154256';
const destDir = path.join(__dirname, '../public/assets/previews');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const fullMap = {
  // Cosmos 3D
  'cosmos_missions': 'cosmos_missions_lifestyle_1786946600308.jpg',
  'cosmos_celestial': 'cosmos_celestial_lifestyle_1786946618427.jpg',
  'cosmos_motor3d': 'cosmos_motor3d_lifestyle_1786946637978.jpg',
  'cosmos_gamification': 'cosmos_gamification_lifestyle_1786946656892.jpg',

  // Escuela IA
  'school_ocr': 'school_ocr_lifestyle_1786946691846.jpg',
  'school_socratic': 'school_socratic_lifestyle_1786946713513.jpg',
  'school_conceptmap': 'school_conceptmap_lifestyle_1786946733745.jpg',
  'school_exam': 'school_exam_lifestyle_1786946754576.jpg',

  // Idiomas Voz
  'languages_conversation': 'languages_conversation_lifestyle_1786946792283.jpg',
  'languages_phonetics': 'languages_phonetics_lifestyle_1786946814334.jpg',
  'languages_memory': 'languages_memory_lifestyle_1786946838161.jpg',
  'languages_scenarios': 'languages_scenarios_lifestyle_1786946863205.jpg',

  // Criterio
  'criterio_sources': 'criterio_sources_mockup_1786947105933.jpg',
  'criterio_biases': 'criterio_biases_mockup_1786947157495.jpg',
  'criterio_pausa': 'criterio_pausa_mockup_1786947181797.jpg',
  'criterio_matiza': 'criterio_matiza_mockup_1786947208332.jpg',

  // IA Lab
  'ialab_neural2d': 'ialab_neural2d_mockup_1786947255918.jpg',
  'ialab_tokens': 'ialab_tokens_mockup_1786947284480.jpg',
  'ialab_convolution': 'ialab_convolution_mockup_1786947311279.jpg',
  'ialab_ethics': 'ialab_ethics_mockup_1786947340089.jpg'
};

async function run() {
  console.log('--- Starting Hyper-Optimization of all 20 images ---');
  let totalRawBytes = 0;
  let totalOptimizedBytes = 0;

  for (const [key, filename] of Object.entries(fullMap)) {
    const srcPath = path.join(srcDir, filename);
    if (!fs.existsSync(srcPath)) {
      console.warn('[WARN] File does not exist:', srcPath);
      continue;
    }

    const rawSize = fs.statSync(srcPath).size;
    totalRawBytes += rawSize;

    const webpDest = path.join(destDir, `${key}.webp`);
    const jpgDest = path.join(destDir, `${key}.jpg`);

    // Generate WebP
    await sharp(srcPath)
      .resize(1280, 720, { fit: 'cover', position: 'center' })
      .webp({ quality: 82, effort: 5 })
      .toFile(webpDest);

    // Generate compressed JPG fallback
    await sharp(srcPath)
      .resize(1280, 720, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(jpgDest);

    const webpSize = fs.statSync(webpDest).size;
    totalOptimizedBytes += webpSize;

    const reduction = Math.round((1 - (webpSize / rawSize)) * 100);
    console.log(`[OPTIMIZED] ${key}: ${(rawSize / 1024).toFixed(0)} KB -> ${(webpSize / 1024).toFixed(0)} KB (-${reduction}%)`);
  }

  const totalReduction = Math.round((1 - (totalOptimizedBytes / totalRawBytes)) * 100);
  console.log(`=== Complete: ${(totalRawBytes / 1024 / 1024).toFixed(2)} MB -> ${(totalOptimizedBytes / 1024 / 1024).toFixed(2)} MB (-${totalReduction}%) ===`);
}

run().catch(console.error);
