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

echo "=== 1. COPYING APK TO NGINX WEB ROOT ==="
sudo mkdir -p /var/www/pro/ancora
sudo cp dist/ancora.apk /var/www/pro/ancora/ancora.apk
sudo cp dist/ancora.apk /var/www/pro/ancora/ancora-v1.0.0.apk
sudo chmod 644 /var/www/pro/ancora/*.apk

echo "=== 2. CREATING / UPDATING GITHUB RELEASE ==="
git tag -d v1.0.0 2>/dev/null || true
git push origin :refs/tags/v1.0.0 2>/dev/null || true
gh release delete v1.0.0 -y 2>/dev/null || true
gh release create v1.0.0 dist/ancora.apk --title "Áncora Android Native v1.0.0" --notes "Compilación oficial limpia de Áncora para Android. Firmada con esquemas v1 (JAR) y v2/v3 para compatibilidad total con instalación directa en teléfonos móviles."

echo "=== 3. CONFIGURING VERSION.JSON & UPDATESERVICE.JS WITH DIRECT RELEASE URL ==="
GITHUB_APK_URL="https://github.com/JOSFER78/ancora/releases/download/v1.0.0/ancora.apk"

cat << EOF > public/version.json
{
  "version": "1.0.0",
  "name": "ÁNCORA",
  "apkUrl": "$GITHUB_APK_URL",
  "bundleZipUrl": "$GITHUB_APK_URL",
  "changelog": "Compilación nativa APK oficial verificada para instalación directa en Android.",
  "publishedAt": "2026-08-14T22:20:00.000Z"
}
EOF

echo "=== 4. REBUILDING DIST FOR FIREBASE HOSTING ==="
npm run build
cp public/version.json dist/version.json

echo "=== 5. DEPLOYING TO FIREBASE HOSTING (SPARK SAFE) ==="
npx -y firebase-tools deploy --only hosting

echo ""
echo "=== 6. VERIFYING GITHUB RELEASE URL WITH CURL ==="
curl -I -L -s "$GITHUB_APK_URL" | grep -E "HTTP/|content-type|content-length|content-disposition"
`;

try {
  console.log(sshCmd(script));
} catch (e) {
  console.error("ERROR:", e.stdout || e.message);
}
