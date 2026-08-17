import fs from 'fs';
import https from 'https';

// 1. Reemplazar view_01_mirror.jpg con imagen real del James Webb Deep Field / Hexágonos
const jwstUrl = 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&auto=format&fit=crop&q=80';
const astronautUrl = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&auto=format&fit=crop&q=80';

async function downloadTo(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (res2) => {
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (e) => {
      fs.unlink(dest, () => {});
      reject(e);
    });
  });
}

async function fix() {
  console.log('Descargando imagen real para James Webb...');
  await downloadTo(jwstUrl, 'public/downloads/datasets/webb/images/view_01_mirror.jpg');
  console.log('✓ James Webb view_01_mirror.jpg actualizado');

  console.log('Descargando imagen real para Astronauta EVA...');
  await downloadTo(astronautUrl, 'public/downloads/datasets/astronaut_eva.jpg');
  console.log('✓ Astronauta EVA actualizado');

  // Copiar Hubble verificado a su dataset
  fs.copyFileSync('public/assets/nasa/hubble.jpg', 'public/downloads/datasets/hubble/images/cam_01_hubble_orbit.jpg');
  console.log('✓ Hubble cam_01_hubble_orbit.jpg actualizado desde asset oficial');
}

fix();
