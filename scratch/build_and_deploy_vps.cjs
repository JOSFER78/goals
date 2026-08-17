const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8', maxBuffer: 30 * 1024 * 1024 });
};

const script = `
set -e
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"

echo "=== 1. CLEANING OLD ZIP/APK ARTIFACTS ==="
rm -rf dist/ancora*.zip dist/ancora*.apk public/downloads/*.zip public/downloads/*.apk public/ancora*.apk public/ancora*.zip
rm -f android/app/src/main/assets/public/*.zip android/app/src/main/assets/public/*.apk

echo "=== 2. RUNNING NPM RUN BUILD ==="
npm run build

echo "=== 3. RUNNING CAPACITOR SYNC ==="
npx cap sync android

echo "=== 4. PURGING ANY LEFTOVER ZIP/APK FROM ASSETS ==="
find android/app/src/main/assets/public -name "*.zip" -o -name "*.apk" -delete 2>/dev/null || true

echo "=== 5. COMPILING CLEAN NATIVE APK WITH GRADLE ==="
cd android
chmod +x gradlew
./gradlew assembleDebug
cd ..

echo "=== 6. COPYING FRESH NATIVE APK TO DIST & PUBLIC ==="
APK_SRC="android/app/build/outputs/apk/debug/app-debug.apk"
cp "$APK_SRC" "dist/ancora.apk"
cp "$APK_SRC" "dist/ancora-v1.0.0.apk"
cp "$APK_SRC" "public/ancora.apk"
cp "$APK_SRC" "public/ancora-v1.0.0.apk"
cp "$APK_SRC" "ancora-v1.0.0.apk"
cp "$APK_SRC" "ancora.apk"

echo "=== 7. VERIFYING SIGNATURES & BADGING ==="
ls -lh dist/ancora.apk
aapt dump badging dist/ancora.apk | head -n 10
apksigner verify --verbose --print-certs dist/ancora.apk

echo "=== 8. DEPLOYING TO FIREBASE HOSTING ==="
firebase deploy --only hosting
`;

try {
  console.log(sshCmd(script));
} catch (e) {
  console.error("ERROR:", e.stdout || e.message);
}
