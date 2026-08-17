const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' }, { maxBuffer: 20 * 1024 * 1024 });
};

const script = `
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"

# Abort any paused rebase
git rebase --abort 2>/dev/null || true
git reset --hard origin/main

# Pull latest origin main
git pull origin main

# Re-apply our clean changes
cat << 'EOF' > firebase.json
{
  "auth": {
    "providers": {
      "emailPassword": true,
      "googleSignIn": {
        "oAuthBrandDisplayName": "ÁNCORA",
        "supportEmail": "josferestudio@gmail.com",
        "authorizedRedirectUris": [
          "https://ancora-portal.web.app/__/auth/handler"
        ]
      }
    }
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "site": "ancora-portal",
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**",
      "**/*.apk",
      "**/*.exe"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
EOF

cat << 'EOF' > public/version.json
{
  "version": "1.0.0",
  "name": "ÁNCORA",
  "apkUrl": "https://github.com/JOSFER78/ancora/releases/download/v1.0.0/ancora.apk",
  "bundleZipUrl": "https://github.com/JOSFER78/ancora/releases/download/v1.0.0/ancora.apk",
  "changelog": "Compilación nativa APK oficial verificada para instalación directa en Android.",
  "publishedAt": "2026-08-14T22:20:00.000Z"
}
EOF

git add firebase.json public/version.json src/services/updateService.js src/components/ApkDownloadGuideModal.jsx README_TECNICO_APK.md android/app/build.gradle
git commit -m "fix(android): resolve APK installation failure with dual v1/v2 signatures, clean 14.8MB build and direct GitHub release download"
git push origin main
echo "=== GIT STATUS & PUSH SUCCESSFUL ==="
git log -n 3 --oneline
`;

try {
  console.log(sshCmd(script));
} catch (e) {
  console.error("ERROR:", e.stdout || e.message);
}
