const fs = require('fs');
const path = require('path');

const models = [
  'hubble_telescope.glb',
  'james_webb_telescope.glb',
  'iss_station.glb',
  'apollo_lunar_module.glb'
];

models.forEach(m => {
  const filePath = path.join('c:\\Obsidian\\proyectos\\webs\\10_goals\\public\\models_3d', m);
  if (!fs.existsSync(filePath)) return;
  const buf = fs.readFileSync(filePath);
  const jsonLength = buf.readUInt32LE(12);
  const jsonType = buf.readUInt32LE(16);
  if (jsonType === 0x4E4F534A) {
    const jsonStr = buf.toString('utf8', 20, 20 + jsonLength);
    const gltf = JSON.parse(jsonStr);
    console.log(`\n=== MODEL: ${m} ===`);
    console.log('Meshes:', gltf.meshes ? gltf.meshes.map(x => x.name) : []);
    console.log('Materials:', gltf.materials ? gltf.materials.map(x => x.name) : []);
    console.log('Nodes:', gltf.nodes ? gltf.nodes.map(x => x.name) : []);
  }
});
