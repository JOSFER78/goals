const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8', maxBuffer: 30 * 1024 * 1024 });
};

const script = `
set -e
export PATH="$PATH:/home/ubuntu/.npm-global/bin"
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"

DEBUG_KS="/home/ubuntu/.android/debug.keystore"
if [ ! -f "$DEBUG_KS" ]; then
  mkdir -p /home/ubuntu/.android
  keytool -genkey -v -keystore "$DEBUG_KS" -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
fi

echo "=== 1. JARSIGNER (V1 SIGNATURE) ==="
APK_RAW="android/app/build/outputs/apk/debug/app-debug.apk"
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore "$DEBUG_KS" -storepass android -keypass android "$APK_RAW" androiddebugkey

echo "=== 2. ZIPALIGN (4-BYTE ALIGNMENT) ==="
zipalign -f -p 4 "$APK_RAW" dist/ancora_aligned.apk

echo "=== 3. APKSIGNER (V1 + V2 + V3 SIGNATURES) ==="
apksigner sign --ks "$DEBUG_KS" --ks-pass pass:android --ks-key-alias androiddebugkey --key-pass pass:android --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --out dist/ancora.apk dist/ancora_aligned.apk
rm -f dist/ancora_aligned.apk

echo "=== 4. COPYING TO ALL ENDPOINTS ==="
cp dist/ancora.apk dist/ancora-v1.0.0.apk
cp dist/ancora.apk public/ancora.apk
cp dist/ancora.apk public/ancora-v1.0.0.apk
cp dist/ancora.apk ancora.apk
cp dist/ancora.apk ancora-v1.0.0.apk

echo "=== 5. VERIFYING FULL SIGNATURE MATRIX ==="
apksigner verify --verbose --print-certs dist/ancora.apk

echo "=== 6. DEPLOYING TO FIREBASE HOSTING ==="
/home/ubuntu/.npm-global/bin/firebase deploy --only hosting
`;

try {
  console.log(sshCmd(script));
} catch (e) {
  console.error("ERROR:", e.stdout || e.message);
}
