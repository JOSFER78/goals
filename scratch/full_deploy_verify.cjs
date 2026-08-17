const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8', maxBuffer: 30 * 1024 * 1024 });
};

const script = `
set -e
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"

echo "=== 1. VERIFY APK SOURCE ==="
APK_SRC="android/app/build/outputs/apk/debug/app-debug.apk"
ls -la "$APK_SRC"

echo "=== 2. POPULATE PUBLIC & ROOT WITH APK ==="
rm -f public/ancora*.zip dist/ancora*.zip
cp "$APK_SRC" public/ancora.apk
cp "$APK_SRC" public/ancora-v1.0.0.apk
cp "$APK_SRC" ancora.apk
cp "$APK_SRC" ancora-v1.0.0.apk

echo "=== 3. RUN VITE BUILD ==="
npm run build

echo "=== 4. CHECK DIST FOR APK ==="
ls -lh dist/ancora*

echo "=== 5. DEPLOY TO FIREBASE HOSTING ==="
npx -y firebase-tools deploy --only hosting

echo ""
echo "=== 6. VERIFY LIVE ENDPOINTS WITH CURL ==="
curl -I -s https://ancora-portal.web.app/ancora.apk
echo "---"
curl -I -s https://ancora-portal.web.app/ancora-v1.0.0.apk
echo "---"
curl -I -s https://ancora-portal.web.app/version.json
`;

try {
  console.log(sshCmd(script));
} catch (e) {
  console.error("ERROR:", e.stdout || e.message);
}
