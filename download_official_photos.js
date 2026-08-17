import fs from 'fs';
import path from 'path';
import https from 'https';

const downloads = [
  // 1. Perseverance Rover en Marte (NASA JPL)
  {
    url: 'https://images-assets.nasa.gov/image/PIA24422/PIA24422~small.jpg',
    dest: 'public/downloads/datasets/perseverance_mars.jpg'
  },
  // 2. Astronauta EVA Spacewalk en Órbita (NASA JSC)
  {
    url: 'https://images-assets.nasa.gov/image/iss035e064010/iss035e064010~small.jpg',
    dest: 'public/downloads/datasets/astronaut_eva.jpg'
  },
  // 3. Planeta Tierra Blue Marble HD (NASA Visible Earth)
  {
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~small.jpg',
    dest: 'public/downloads/datasets/earth_blue_marble.jpg'
  },
  // 4. Corazón Humano Anatomía 3D / TC Cardíaco (NIH / Open Medical)
  {
    url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&auto=format&fit=crop&q=80',
    dest: 'public/downloads/datasets/heart_anatomy.jpg'
  },
  // 5. Microscopía Cuántica de Átomos (IBM Quantum / STM)
  {
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    dest: 'public/downloads/datasets/atom_quantum.jpg'
  },
  // 6. Hubble Oficial en Órbita (NASA)
  {
    url: 'https://images-assets.nasa.gov/image/S97-06283/S97-06283~small.jpg',
    dest: 'public/downloads/datasets/hubble_orbit_official.jpg'
  }
];

fs.mkdirSync('public/downloads/datasets', { recursive: true });

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, (res2) => {
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const item of downloads) {
    try {
      console.log(`Descargando ${item.dest}...`);
      await downloadFile(item.url, item.dest);
      const stat = fs.statSync(item.dest);
      console.log(`✓ Descargado ${item.dest} (${stat.size} bytes)`);
    } catch (e) {
      console.warn(`Error en ${item.dest}:`, e.message);
    }
  }
}

run();
