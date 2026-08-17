const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ICONS = [
  {
    src: 'C:/Users/yo/.gemini/antigravity-ide/brain/6dbe55d4-3196-41d8-b4b1-80deba154256/miniapp_school_icon_1786935291699.jpg',
    outName: 'school_logo.png'
  },
  {
    src: 'C:/Users/yo/.gemini/antigravity-ide/brain/6dbe55d4-3196-41d8-b4b1-80deba154256/miniapp_languages_icon_1786935302808.jpg',
    outName: 'languages_logo.png'
  },
  {
    src: 'C:/Users/yo/.gemini/antigravity-ide/brain/6dbe55d4-3196-41d8-b4b1-80deba154256/miniapp_cosmos_icon_1786935314978.jpg',
    outName: 'cosmos_logo.png'
  },
  {
    src: 'C:/Users/yo/.gemini/antigravity-ide/brain/6dbe55d4-3196-41d8-b4b1-80deba154256/miniapp_criterio_icon_1786935327665.jpg',
    outName: 'criterio_logo.png'
  },
  {
    src: 'C:/Users/yo/.gemini/antigravity-ide/brain/6dbe55d4-3196-41d8-b4b1-80deba154256/miniapp_ialab_icon_1786935343643.jpg',
    outName: 'ialab_logo.png'
  }
];

async function processAll() {
  const outDir = path.resolve('public/assets/miniapps');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  for (const item of ICONS) {
    const dest = path.join(outDir, item.outName);
    await sharp(item.src)
      .resize(512, 512)
      .png()
      .toFile(dest);
    console.log(`✅ Procesado y exportado: ${item.outName} (512x512 PNG)`);
  }

  console.log('🎉 Todos los logos de MiniApps de Goalskid han sido creados.');
}

processAll().catch(console.error);
