const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash -l"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
};

const script = `
which jarsigner
which firebase || find /home/ubuntu -name firebase 2>/dev/null
npx firebase --version
`;

console.log(sshCmd(script));
