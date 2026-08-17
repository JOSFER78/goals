const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' }, { maxBuffer: 20 * 1024 * 1024 });
};

const sshWriteFile = (remotePath, content) => {
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "cat > '${remotePath}'"`;
  execSync(fullCmd, { input: content, encoding: 'utf-8' });
};

const fs = require('fs');
const readmeContent = fs.readFileSync('c:\\Obsidian\\proyectos\\webs\\02 Ancora\\ancora_repo\\README_TECNICO_APK.md', 'utf-8');

sshWriteFile('/home/ubuntu/workspace/pro/webs/02 Ancora/README_TECNICO_APK.md', readmeContent);
console.log('README_TECNICO_APK.md written to VPS.');

const gitScript = `
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"
git add firebase.json public/version.json src/services/updateService.js src/components/ApkDownloadGuideModal.jsx README_TECNICO_APK.md android/app/build.gradle
git commit -m "fix(android): resolve APK installation failure, enable direct GitHub release download and dual v1/v2 signing" || true
git push origin main || true
`;

try {
  console.log(sshCmd(gitScript));
} catch (e) {
  console.log("GIT RESULT:", e.stdout || e.message);
}
