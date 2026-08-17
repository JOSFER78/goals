const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
};

const script = `
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"

echo "=== 1. SEARCH FOR APK DOWNLOAD LINKS / BUTTONS IN SRC ==="
grep -rn "Descargar APK" src/ || true
grep -rn "ApkDownload" src/ || true
grep -rn "apkUrl" src/ || true
grep -rn "APK" src/components/ src/views/ || true

echo "=== 2. SEARCH FOR SUPABASE URLS IN SRC ==="
grep -rn "ysnorelkaccaikvuqgnv" src/ || true
grep -rn "supabase.co" src/ || true
`;

console.log(sshCmd(script));
