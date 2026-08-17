const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
};

const script = `
set -e
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"

echo "=== 1. CREATING CLEAN ZIP BUNDLE (PYTHON ZIPFILE) ==="
python3 -c "
import zipfile, os
os.makedirs('public/downloads', exist_ok=True)
with zipfile.ZipFile('public/downloads/ancora-v1.0.0.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    z.write('dist/ancora.apk', 'ancora.apk')
    z.write('dist/ancora.apk', 'app-debug.apk')
print('ZIP created successfully. Size:', os.path.getsize('public/downloads/ancora-v1.0.0.zip'))
"

cp public/downloads/ancora-v1.0.0.zip public/ancora-v1.0.0.zip
ls -lh public/downloads/ancora-v1.0.0.zip

echo "=== 2. UPDATING VERSION.JSON WITH GOALS ZIP FORMAT ==="
cat << 'EOF' > public/version.json
{
  "version": "1.0.0",
  "name": "ÁNCORA",
  "zipUrl": "https://ancora-portal.web.app/downloads/ancora-v1.0.0.zip",
  "apkUrl": "https://github.com/JOSFER78/ancora/releases/download/v1.0.0/ancora.apk",
  "changelog": "🚀 Versión v1.0.0 Oficial (ancora-v1.0.0.zip): APK Android nativo (14.8MB) empaquetado. Firebase Auth real, Firestore DB e IA integrada."
}
EOF

echo "=== 3. RUNNING VITE BUILD ==="
npm run build
cp public/version.json dist/version.json
mkdir -p dist/downloads
cp public/downloads/ancora-v1.0.0.zip dist/downloads/ancora-v1.0.0.zip

echo "=== 4. DEPLOYING TO FIREBASE HOSTING ==="
npx -y firebase-tools deploy --only hosting

echo ""
echo "=== 5. TESTING LIVE FIREBASE ZIP ENDPOINT ==="
curl -I -s https://ancora-portal.web.app/downloads/ancora-v1.0.0.zip
echo "---"
curl -s https://ancora-portal.web.app/version.json
`;

try {
  console.log(sshCmd(script));
} catch (e) {
  console.error("ERROR:", e.stdout || e.message);
}
