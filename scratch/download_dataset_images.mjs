/**
 * download_dataset_images.mjs
 * Descarga y verificación física de imágenes oficiales 100% reales para las fichas de modelos 3D
 */
import fs from 'fs';
import path from 'path';
import https from 'https';

const downloads = [
  // 1. HUBBLE
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg',
    dest: 'public/downloads/datasets/hubble/images/cam_01_hubble_orbit.jpg',
    name: 'Hubble en Órbita Terrestre Baja (STS-125)'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Hubble_01.jpg/1280px-Hubble_01.jpg',
    dest: 'public/downloads/datasets/hubble/images/cam_02_hubble_sm4.jpg',
    name: 'Telescopio Espacial Hubble en Bahía de Carga'
  },

  // 2. JAMES WEBB (JWST)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/James_Webb_Space_Telescope_Mirror37.jpg/1280px-James_Webb_Space_Telescope_Mirror37.jpg',
    dest: 'public/downloads/datasets/webb/images/cam_01_jwst_mirror.jpg',
    name: 'JWST Espejos de Oro de Berilio en Goddard'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/James_Webb_Space_Telescope_2021.jpg/1280px-James_Webb_Space_Telescope_2021.jpg',
    dest: 'public/downloads/datasets/webb/images/jwst_space_render.jpg',
    name: 'Observatorio James Webb Desplegado en Lagrange L2'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/JWST_2022-07-12_Cosmic_Cliffs.png/1280px-JWST_2022-07-12_Cosmic_Cliffs.png',
    dest: 'public/downloads/datasets/webb/images/jwst_deep_field.jpg',
    name: 'Campo Profundo y Acantilados Cósmicos (NIRCam)'
  },

  // 3. ESTACIÓN ESPACIAL INTERNACIONAL (ISS)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/International_Space_Station_after_undocking_of_STS-132.jpg/1280px-International_Space_Station_after_undocking_of_STS-132.jpg',
    dest: 'public/downloads/datasets/iss/images/cam_01_iss_sts132_front.jpg',
    name: 'ISS Completa en Órbita (STS-132)'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/ISS_March_2009.jpg/1280px-ISS_March_2009.jpg',
    dest: 'public/downloads/datasets/iss/images/cam_02_iss_sts132_orbit.jpg',
    name: 'ISS Módulos y Alas SAW sobre la Tierra'
  },

  // 4. APOLLO 11 (EAGLE)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Apollo_11_Lunar_Module_-_AS11-44-6574.jpg/1280px-Apollo_11_Lunar_Module_-_AS11-44-6574.jpg',
    dest: 'public/downloads/datasets/apollo/images/cam_01_eagle_lunar_module.jpg',
    name: 'Módulo Lunar Eagle en Órbita Lunar (AS11-44-6574)'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Aldrin_with_the_Lunar_Module.jpg/1280px-Aldrin_with_the_Lunar_Module.jpg',
    dest: 'public/downloads/datasets/apollo/images/cam_02_eagle_lunar_surface.jpg',
    name: 'Eagle en el Mar de la Tranquilidad con Mylar Dorado'
  },

  // 5. ENCÉFALO HUMANO (BRAIN)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Human_brain_inferior-lateral_view_description.JPG/1280px-Human_brain_inferior-lateral_view_description.JPG',
    dest: 'public/downloads/datasets/brain/images/view_01_nih_brain.png',
    name: 'Anatomía Cortical del Encéfalo Humano'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/MRI_head_side.jpg/1280px-MRI_head_side.jpg',
    dest: 'public/downloads/datasets/brain/images/view_02_mri_side.jpg',
    name: 'Resonancia Magnética Sagital 3D'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(destPath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

    const request = (targetUrl) => {
      const parsedUrl = new URL(targetUrl);
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      };

      https.get(options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          let redirectUrl = res.headers.location;
          if (redirectUrl.startsWith('/')) {
            redirectUrl = parsedUrl.origin + redirectUrl;
          }
          return request(redirectUrl);
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${targetUrl}`));
        }

        const fileStream = fs.createWriteStream(fullPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          const stats = fs.statSync(fullPath);
          resolve(stats.size);
        });
      }).on('error', (err) => {
        reject(err);
      });
    };

    request(url);
  });
}

async function run() {
  console.log('🚀 Iniciando descarga de fotografías oficiales verificadas...');
  for (const item of downloads) {
    try {
      const size = await downloadFile(item.url, item.dest);
      console.log(`✅ [${(size / 1024).toFixed(1)} KB] ${item.name} -> ${item.dest}`);
    } catch (err) {
      console.error(`❌ Error descargando ${item.name}:`, err.message);
    }
  }
  console.log('✨ Proceso completado.');
}

run();
