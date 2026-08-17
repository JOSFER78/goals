const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
};

const script = `
echo "=== REMOTE CAPACITOR CONFIG ==="
cat "/home/ubuntu/workspace/pro/webs/02 Ancora/capacitor.config.json" 2>/dev/null || cat "/home/ubuntu/workspace/pro/webs/02 Ancora/capacitor.config.ts" 2>/dev/null
echo ""
echo "=== REMOTE ANDROID/APP/BUILD.GRADLE ==="
cat "/home/ubuntu/workspace/pro/webs/02 Ancora/android/app/build.gradle"
echo ""
echo "=== REMOTE ANDROIDMANIFEST.XML ==="
cat "/home/ubuntu/workspace/pro/webs/02 Ancora/android/app/src/main/AndroidManifest.xml"
echo ""
echo "=== REMOTE STRINGS.XML ==="
cat "/home/ubuntu/workspace/pro/webs/02 Ancora/android/app/src/main/res/values/strings.xml"
`;

try {
  console.log(sshCmd(script));
} catch (e) {
  console.error(e.message);
}
