import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function getHash(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.name.endsWith('.jpg') || entry.name.endsWith('.png')) {
      const stat = fs.statSync(fullPath);
      const hash = getHash(fullPath);
      console.log(`${fullPath} -> size: ${stat.size} bytes, hash: ${hash.slice(0, 8)}`);
    }
  }
}

console.log('=== AUDITORÍA DE ARCHIVOS DE IMAGEN EN PUBLIC ===');
scanDir('public/downloads/datasets');
scanDir('public/assets/nasa');
