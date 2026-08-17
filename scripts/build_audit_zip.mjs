import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const rootDir = 'C:\\Obsidian\\proyectos\\webs\\10_goals';
const tempDir = 'C:\\Obsidian\\proyectos\\webs\\10_goals_audit_temp';
const outputZip = 'C:\\Obsidian\\proyectos\\webs\\10_goals\\goals_audit.zip';

// Clean temp directory if exists
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir, { recursive: true });

// Copy function with exclusions
function copyDir(src, dest, excludeFilter) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (excludeFilter && excludeFilter(srcPath, entry)) continue;
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, excludeFilter);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Top-level files to include
const rootFiles = [
  '.firebaserc',
  '.gitignore',
  'DESIGN.md',
  'README.md',
  'capacitor.config.ts',
  'components.json',
  'firebase.json',
  'firestore.rules',
  'index.html',
  'package.json',
  'package-lock.json',
  'postcss.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'vite.config.ts'
];

for (const file of rootFiles) {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    fs.copyFileSync(fullPath, path.join(tempDir, file));
  }
}

// Folders to include
const folders = ['src', 'public', 'content', 'docs', 'skill', 'scripts'];
for (const folder of folders) {
  const srcFolder = path.join(rootDir, folder);
  const destFolder = path.join(tempDir, folder);
  if (fs.existsSync(srcFolder)) {
    copyDir(srcFolder, destFolder, (srcPath, entry) => {
      // Exclude public/downloads and zip files
      if (srcPath.includes(path.join('public', 'downloads'))) return true;
      if (entry.name.endsWith('.zip')) return true;
      return false;
    });
  }
}

console.log('Staged files successfully.');

if (fs.existsSync(outputZip)) {
  fs.unlinkSync(outputZip);
}

// Use tar -a -cf to create zip
process.chdir(tempDir);
execSync(`tar -a -cf "${outputZip}" *`);

// Cleanup tempDir
process.chdir(rootDir);
fs.rmSync(tempDir, { recursive: true, force: true });

const stats = fs.statSync(outputZip);
console.log(`ZIP created successfully at: ${outputZip}`);
console.log(`Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB (${(stats.size / 1024).toFixed(2)} KB)`);
