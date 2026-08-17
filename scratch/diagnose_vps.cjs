const { execSync } = require('child_process');
const fs = require('fs');

const sshCmd = (remoteCommand) => {
  const b64 = Buffer.from(remoteCommand).toString('base64');
  const fullCmd = `ssh -o StrictHostKeyChecking=no -i "C:\\Users\\yo\\.ssh\\id_rsa_openclaw" ubuntu@143.47.35.167 "echo ${b64} | base64 -d | bash"`;
  return execSync(fullCmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
};

const script = `
cd "/home/ubuntu/workspace/pro/webs/02 Ancora"

files=(
  "public/downloads/ancora-v1.0.0.apk"
  "ancora-v1.0.0.apk"
  "public/ancora-latest.apk"
  "android/app/build/outputs/apk/debug/app-debug.apk"
  "scratch/ancora-v1.0.0.apk"
  "scratch/ancora_aligned.apk"
  "scratch/ancora_mod.apk"
)

for f in "\${files[@]}"; do
  if [ -f "$f" ]; then
    echo "=================================================="
    echo "FILE: $f"
    ls -lh "$f"
    echo "--- AAPT BADGING ---"
    aapt dump badging "$f" 2>&1 | head -n 12
    echo "--- ZIPALIGN CHECK ---"
    zipalign -c -v 4 "$f" 2>&1 | tail -n 2
    echo "--- APKSIGNER VERIFY ---"
    apksigner verify --verbose --print-certs "$f" 2>&1
  fi
done
`;

try {
  const output = sshCmd(script);
  console.log(output);
} catch (err) {
  console.error("ERROR:", err.stdout || err.message);
}
