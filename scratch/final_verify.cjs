const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
};

const script = `
echo "=== 1. TEST VERSION.JSON ON PRODUCTION ==="
curl -s https://ancora-portal.web.app/version.json
echo ""

echo "=== 2. TEST GITHUB RELEASE APK ENDPOINT ==="
curl -I -L -s https://github.com/JOSFER78/ancora/releases/download/v1.0.0/ancora.apk | grep -E "HTTP/|content-type|content-length|content-disposition"

echo ""
echo "=== 3. TEST NGINX VPS BACKUP APK ENDPOINT ==="
curl -I -k -s https://127.0.0.1/pro/ancora/ancora.apk | grep -E "HTTP/|content-type|content-length"
`;

console.log(sshCmd(script));
