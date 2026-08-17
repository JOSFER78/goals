const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const srcImage = path.resolve('C:/Users/yo/.gemini/antigravity-ide/brain/6dbe55d4-3196-41d8-b4b1-80deba154256/goalskid_app_icon_1786934695644.jpg');

async function generate() {
  console.log('Procesando icono desde:', srcImage);

  // 1. Guardar icono web principal
  await sharp(srcImage)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/goals_platform_logo.png'));
  
  await sharp(srcImage)
    .resize(512, 512)
    .png()
    .toFile(path.resolve('public/goalskid_logo.png'));

  await sharp(srcImage)
    .resize(192, 192)
    .png()
    .toFile(path.resolve('public/favicon.png'));

  console.log('✅ Iconos Web generados');

  // 2. Definiciones de densidad Android
  const androidTargets = [
    { dir: 'android/app/src/main/res/mipmap-mdpi', iconSize: 48, fgSize: 108 },
    { dir: 'android/app/src/main/res/mipmap-hdpi', iconSize: 72, fgSize: 162 },
    { dir: 'android/app/src/main/res/mipmap-xhdpi', iconSize: 96, fgSize: 216 },
    { dir: 'android/app/src/main/res/mipmap-xxhdpi', iconSize: 144, fgSize: 324 },
    { dir: 'android/app/src/main/res/mipmap-xxxhdpi', iconSize: 192, fgSize: 432 }
  ];

  for (const target of androidTargets) {
    const targetDir = path.resolve(target.dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // ic_launcher.png
    await sharp(srcImage)
      .resize(target.iconSize, target.iconSize)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // ic_launcher_round.png
    await sharp(srcImage)
      .resize(target.iconSize, target.iconSize)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    // ic_launcher_foreground.png
    await sharp(srcImage)
      .resize(target.fgSize, target.fgSize)
      .png()
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    console.log(`✅ Android ${path.basename(target.dir)} generado (${target.iconSize}px / ${target.fgSize}px)`);
  }

  console.log('🎉 Todos los iconos de Goalskid han sido generados con éxito');
}

generate().catch(console.error);
