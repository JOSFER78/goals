const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
};

const script = `
set -e
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"

echo "=== 1. UPDATING FIREBASE.JSON WITH IGNORE FOR APK (SPARK COMPLIANT) ==="
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

echo "=== 2. DEPLOYING TO FIREBASE HOSTING ==="
npx -y firebase-tools deploy --only hosting

echo ""
echo "=== 3. TESTING LIVE VERSION.JSON ==="
curl -s https://ancora-portal.web.app/version.json
echo ""

echo "=== 4. TESTING GITHUB RELEASE DOWNLOAD URL WITH CURL ==="
curl -I -L -s https://github.com/JOSFER78/ancora/releases/download/v1.0.0/ancora.apk | grep -E "HTTP/|content-type|content-length|content-disposition"
`;

console.log(sshCmd(script));
