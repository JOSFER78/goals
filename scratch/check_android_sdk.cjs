const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
};

const script = `
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"
cat android/local.properties 2>/dev/null
echo "ANDROID_HOME=$ANDROID_HOME"
echo "ANDROID_SDK_ROOT=$ANDROID_SDK_ROOT"
find /home/ubuntu /opt /usr/lib -maxdepth 3 -name "android-sdk*" -o -name "Android" 2>/dev/null
`;

console.log(sshCmd(script));
