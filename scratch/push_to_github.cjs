const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
};

const script = `
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"
git add firebase.json public/version.json android/app/build.gradle README_TECNICO_APK.md
git commit -m "fix(android): resolve mobile APK installation, configure direct GitHub Release download and dual v1/v2 signatures"
git push origin main
echo "=== PUSH SUCCESSFUL ==="
git log -n 2 --oneline
`;

console.log(sshCmd(script));
