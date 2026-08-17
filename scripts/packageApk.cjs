const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const releaseApk = path.join(rootDir, 'android/app/build/outputs/apk/release/app-release.apk');
const debugApk = path.join(rootDir, 'android/app/build/outputs/apk/debug/app-debug.apk');

const apkSrc = fs.existsSync(releaseApk) ? releaseApk : (fs.existsSync(debugApk) ? debugApk : null);

if (!apkSrc) {
  console.error('❌ No se encontró ningún APK compilado en android/app/build/outputs/apk/');
  console.log('💡 Ejecuta: cd android && ./gradlew assembleDebug (o assembleRelease)');
  process.exit(1);
}

const targetDirs = [
  path.join(rootDir, 'public/download'),
  path.join(rootDir, 'public/downloads'),
  path.join(rootDir, 'dist/download'),
  path.join(rootDir, 'dist/downloads')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

console.log(`📦 Empaquetando APK desde: ${path.relative(rootDir, apkSrc)} (${(fs.statSync(apkSrc).size / 1024 / 1024).toFixed(2)} MB)`);

// Leer versión
const versionJsonPath = path.join(rootDir, 'public/version.json');
let version = '2.5.1';
if (fs.existsSync(versionJsonPath)) {
  try {
    const vData = JSON.parse(fs.readFileSync(versionJsonPath, 'utf-8'));
    if (vData.version) version = vData.version;
  } catch (e) {}
}

targetDirs.forEach(dir => {
  // 1. APK directo con nombre estándar y versionado
  const destGeneric = path.join(dir, 'goalskid.apk');
  const destVersioned = path.join(dir, `goalskid-v${version}.apk`);
  fs.copyFileSync(apkSrc, destGeneric);
  fs.copyFileSync(apkSrc, destVersioned);

  // 2. ZIP con APK para descarga comprimida
  const zipGeneric = path.join(dir, 'goalskid.zip');
  const zipVersioned = path.join(dir, `goalskid_${version}.zip`);
  
  try {
    execSync(`powershell -Command "Compress-Archive -Path '${destGeneric}' -DestinationPath '${zipGeneric}' -Force"`);
    fs.copyFileSync(zipGeneric, zipVersioned);
  } catch (err) {
    console.warn('Advertencia al generar ZIP:', err.message);
  }
});

console.log('✅ Archivos generados con éxito para Firebase:');
console.log('   - https://appgoals.web.app/download/goalskid.apk (APK Directo)');
console.log(`   - https://appgoals.web.app/download/goalskid-v${version}.apk`);
console.log('   - https://appgoals.web.app/download/goalskid.zip (Archivo ZIP)');
console.log(`   - https://appgoals.web.app/downloads/goalskid_${version}.zip (Fallback)`);
