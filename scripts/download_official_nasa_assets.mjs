import https from 'https';
import fs from 'fs';
import path from 'path';

const downloads = [
  {
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000494/GSFC_20171208_Archive_e000494~medium.jpg',
    dest: 'public/downloads/datasets/webb/images/cam_01_jwst_mirror.jpg'
  },
  {
    url: 'https://images-assets.nasa.gov/image/STScI-01G7ETPF6P5G4NWS0G8N210214/STScI-01G7ETPF6P5G4NWS0G8N210214~medium.jpg',
    dest: 'public/downloads/datasets/webb/images/cam_02_jwst_deepfield.jpg'
  },
  {
    url: 'https://images-assets.nasa.gov/image/iss056e201262/iss056e201262~medium.jpg',
    dest: 'public/downloads/datasets/iss/images/cam_01_iss_sts132_front.jpg'
  },
  {
    url: 'https://images-assets.nasa.gov/image/iss065e094186/iss065e094186~medium.jpg',
    dest: 'public/downloads/datasets/iss/images/cam_02_iss_sts132_truss.jpg'
  },
  {
    url: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~medium.jpg',
    dest: 'public/downloads/datasets/apollo/images/cam_02_eagle_lunar_surface.jpg'
  },
  {
    url: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~medium.jpg',
    dest: 'public/downloads/datasets/sol/images/cam_01_sdo_304.jpg'
  },
  {
    url: 'https://images-assets.nasa.gov/image/hubble-captures-the-ghost-nebula_28353597405_o/hubble-captures-the-ghost-nebula_28353597405_o~medium.jpg',
    dest: 'public/downloads/datasets/hubble/images/cam_01_hubble_orbit.jpg'
  }
];

async function downloadFile(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (redirectRes) => {
          const file = fs.createWriteStream(dest);
          redirectRes.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✓ Descargado: ${dest} (${fs.statSync(dest).size} bytes)`);
            resolve();
          });
        }).on('error', reject);
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ Descargado: ${dest} (${fs.statSync(dest).size} bytes)`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const item of downloads) {
    try {
      await downloadFile(item.url, item.dest);
    } catch (e) {
      console.error(`Error en ${item.url}:`, e);
    }
  }
}

main();
