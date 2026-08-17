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

const apkVersionedName = `goalskid_v${version}.apk`;
const zipVersionedName = `goalskid_v${version}.zip`;

// 1. Preparar APK con el nombre y versión explícita en temporal para que el ZIP contenga el nombre correcto
const tempDir = path.join(rootDir, 'android/app/build/outputs/apk/temp_package');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
const tempVersionedApk = path.join(tempDir, apkVersionedName);
fs.copyFileSync(apkSrc, tempVersionedApk);

// 2. Copiar APK a todos los directorios destino con todas las variantes de nombre
targetDirs.forEach(dir => {
  fs.copyFileSync(apkSrc, path.join(dir, apkVersionedName));
  fs.copyFileSync(apkSrc, path.join(dir, `goalskid-v${version}.apk`));
  fs.copyFileSync(apkSrc, path.join(dir, `goalskidv${version}.apk`));
  fs.copyFileSync(apkSrc, path.join(dir, 'goalskid.apk'));
});

// 3. Generar el ZIP comprimido conteniendo goalskid_v2.5.1.apk (una sola vez)
const primaryZip = path.join(targetDirs[0], zipVersionedName);
console.log(`⚡ Comprimiendo ${apkVersionedName} en archivo ZIP...`);
try {
  execSync(`powershell -Command "Compress-Archive -Path '${tempVersionedApk}' -DestinationPath '${primaryZip}' -Force"`);
  
  targetDirs.forEach(dir => {
    const mainZip = path.join(dir, zipVersionedName);
    if (mainZip !== primaryZip) {
      fs.copyFileSync(primaryZip, mainZip);
    }
    fs.copyFileSync(primaryZip, path.join(dir, `goalskid-v${version}.zip`));
    fs.copyFileSync(primaryZip, path.join(dir, `goalskid_${version}.zip`));
    fs.copyFileSync(primaryZip, path.join(dir, 'goalskid.zip'));
  });
} catch (err) {
  console.warn('Advertencia al generar ZIP:', err.message);
}

// Limpiar temporal
try {
  if (fs.existsSync(tempVersionedApk)) fs.unlinkSync(tempVersionedApk);
  if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
} catch (e) {}

console.log('✅ Archivos generados con éxito:');
console.log(`   - ${apkVersionedName} (${(fs.statSync(apkSrc).size / 1024 / 1024).toFixed(2)} MB)`);
console.log(`   - ${zipVersionedName} (${(fs.statSync(primaryZip).size / 1024 / 1024).toFixed(2)} MB)`);
console.log(`   - https://appgoals.web.app/download/${zipVersionedName} (Oficial con Nombre y Versión)`);
console.log(`   - https://appgoals.web.app/download/${apkVersionedName} (APK Directo)`);
console.log(`   - https://appgoals.web.app/download/goalskid.zip (Alias de compatibilidad)`);
