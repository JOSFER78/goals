const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
};

const script = `
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"

echo "=== DEPLOYING WITH NPX FIREBASE-TOOLS ==="
npx -y firebase-tools deploy --only hosting

echo ""
echo "=== TESTING LIVE ENDPOINTS ==="
curl -I -s https://ancora-portal.web.app/ancora.apk
echo "---"
curl -I -s https://ancora-portal.web.app/ancora-v1.0.0.apk
echo "---"
curl -I -s https://ancora-portal.web.app/version.json
`;

console.log(sshCmd(script));
