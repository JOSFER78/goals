const { execSync } = require('child_process');
const fs = require('fs');

const sshWriteFile = (remotePath, content) => {
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "cat > '${remotePath}'"`;
  execSync(fullCmd, { input: content, encoding: 'utf-8' });
};

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
};

const readmeContent = fs.readFileSync('c:\\Obsidian\\proyectos\\webs\\02 Ancora\\ancora_repo\\README_TECNICO_APK.md', 'utf-8');

sshWriteFile('/home/ubuntu/workspace/pro/webs/02 Ancora/README_TECNICO_APK.md', readmeContent);
console.log('README_TECNICO_APK.md written.');

const script = `
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"
git add firebase.json public/version.json android/app/build.gradle README_TECNICO_APK.md
git commit -m "fix(android): resolve mobile APK installation, configure direct GitHub Release download and dual v1/v2 signatures"
git push origin main
echo "=== PUSH RESULT ==="
git log -n 2 --oneline
`;

console.log(sshCmd(script));
