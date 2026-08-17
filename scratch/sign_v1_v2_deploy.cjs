const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
};

const script = `
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"

# Check debug keystore
DEBUG_KS="/home/ubuntu/.android/debug.keystore"
if [ ! -f "$DEBUG_KS" ]; then
  mkdir -p /home/ubuntu/.android
  keytool -genkey -v -keystore "$DEBUG_KS" -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"
fi

# Zipalign first
zipalign -f -p 4 dist/ancora.apk dist/ancora_aligned.apk

# Sign with v1 + v2 + v3 explicitly
apksigner sign --ks "$DEBUG_KS" --ks-pass pass:android --ks-key-alias androiddebugkey --key-pass pass:android --v1-signing-enabled true --v2-signing-enabled true --out dist/ancora.apk dist/ancora_aligned.apk
rm -f dist/ancora_aligned.apk

cp dist/ancora.apk dist/ancora-v1.0.0.apk
cp dist/ancora.apk public/ancora.apk
cp dist/ancora.apk public/ancora-v1.0.0.apk
cp dist/ancora.apk ancora.apk
cp dist/ancora.apk ancora-v1.0.0.apk

echo "=== APKSIGNER VERIFY OUTPUT ==="
apksigner verify --verbose --print-certs dist/ancora.apk

echo "=== DEPLOYING TO FIREBASE HOSTING ==="
firebase deploy --only hosting
`;

try {
  console.log(sshCmd(script));
} catch (e) {
  console.error("ERROR:", e.stdout || e.message);
}
