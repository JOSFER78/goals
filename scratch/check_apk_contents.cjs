const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
};

const script = `
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"

echo "=== PUBLIC FOLDER CONTENTS ==="
ls -lh public/
echo ""
echo "=== DIST FOLDER CONTENTS ==="
ls -lh dist/
echo ""
echo "=== ANDROID ASSETS CONTENTS ==="
ls -lh android/app/src/main/assets/public/ 2>/dev/null || ls -lh android/app/src/main/assets/
echo ""
echo "=== TOP 20 LARGEST FILES IN ancora-v1.0.0.apk ==="
unzip -l ancora-v1.0.0.apk | sort -k3 -n -r | head -n 20
`;

try {
  console.log(sshCmd(script));
} catch (e) {
  console.error(e.message);
}
