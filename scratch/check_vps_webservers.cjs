const { execSync } = require('child_process');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8' });
};

const script = `
sudo systemctl status caddy || sudo systemctl status nginx || true
echo "=== LISTENING PORTS ==="
sudo ss -tulpn | grep -E "80|443|3000|5180"
`;

console.log(sshCmd(script));
