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

echo "=== 1. CREATING CLEAN ZIP BUNDLE (MATCHING GOALS ARCHITECTURE) ==="
mkdir -p public/downloads
rm -f public/downloads/ancora*.zip dist/downloads/ancora*.zip

# Copy clean signed APK to temporary dir for zip creation
mkdir -p /tmp/ancora_zip_pack
cp dist/ancora.apk /tmp/ancora_zip_pack/ancora.apk
cd /tmp/ancora_zip_pack
zip -9 /home/ubuntu/workspace/pro/webs/02\\ Ancora/public/downloads/ancora-v1.0.0.zip ancora.apk
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"
rm -rf /tmp/ancora_zip_pack

cp public/downloads/ancora-v1.0.0.zip public/ancora-v1.0.0.zip
ls -lh public/downloads/ancora-v1.0.0.zip

echo "=== 2. UPDATING VERSION.JSON WITH DUAL ENDPOINTS ==="
cat << 'EOF' > public/version.json
{
  "version": "1.0.0",
  "name": "ÁNCORA",
  "zipUrl": "https://ancora-portal.web.app/downloads/ancora-v1.0.0.zip",
  "apkUrl": "https://github.com/JOSFER78/ancora/releases/download/v1.0.0/ancora.apk",
  "changelog": "🚀 Versión v1.0.0 Oficial (ancora-v1.0.0.zip): APK Android nativo (14.8MB) empaquetado y firmado v1+v2. Firebase Auth real, Firestore DB e IA integrada."
}
EOF

echo "=== 3. BUILDING SPA ==="
npm run build

echo "=== 4. DEPLOYING TO FIREBASE HOSTING ==="
npx -y firebase-tools deploy --only hosting

echo ""
echo "=== 5. TESTING LIVE FIREBASE ZIP ENDPOINT ==="
curl -I -s https://ancora-portal.web.app/downloads/ancora-v1.0.0.zip
`;

try {
  console.log(sshCmd(script));
} catch (e) {
  console.error("ERROR:", e.stdout || e.message);
}
