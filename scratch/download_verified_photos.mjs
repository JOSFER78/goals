/**
 * download_verified_photos.mjs
 * Descarga garantizada de fotos oficiales con User-Agent de Wikimedia y verificación de bytes > 20KB
 */
import fs from 'fs';
import path from 'path';
import https from 'https';

const downloads = [
  // 1. HUBBLE (El telescopio completo en órbita y en bahía de carga)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg',
    mirror: 'https://images-assets.nasa.gov/image/iss020e006835/iss020e006835~orig.jpg',
    dest: 'public/downloads/datasets/hubble/images/cam_01_hubble_orbit.jpg',
    name: 'Hubble en Órbita Terrestre (Telescopio Completo)'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Hubble_Space_Telescope_in_the_cargo_bay_of_Space_Shuttle_Discovery_during_STS-82.jpg',
    mirror: 'https://images-assets.nasa.gov/image/s82-51000/s82-51000~orig.jpg',
    dest: 'public/downloads/datasets/hubble/images/cam_02_hubble_sm4.jpg',
    name: 'Hubble en la Bahía de Carga (STS-82 / SM4)'
  },

  // 2. JAMES WEBB (Espejo de oro 24k en Goddard, render espacial desplegado, y Carina Nebula)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/07/James_Webb_Space_Telescope_Mirror37.jpg',
    mirror: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000445/GSFC_20171208_Archive_e000445~orig.jpg',
    dest: 'public/downloads/datasets/webb/images/cam_01_jwst_mirror.jpg',
    name: 'JWST Espejo Dorado en Sala Limpia Goddard'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/86/James_Webb_Space_Telescope_2021.jpg',
    mirror: 'https://images-assets.nasa.gov/image/PIA24564/PIA24564~orig.jpg',
    dest: 'public/downloads/datasets/webb/images/jwst_space_render.jpg',
    name: 'JWST Desplegado en Lagrange L2'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/JWST_2022-07-12_Cosmic_Cliffs.png',
    mirror: 'https://images-assets.nasa.gov/image/GSFC_20220712_Carina_Nebula/GSFC_20220712_Carina_Nebula~orig.jpg',
    dest: 'public/downloads/datasets/webb/images/jwst_deep_field.jpg',
    name: 'JWST Acantilados Cósmicos Carina'
  },

  // 3. ESTACIÓN ESPACIAL INTERNACIONAL (ISS)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/International_Space_Station_after_undocking_of_STS-132.jpg',
    mirror: 'https://images-assets.nasa.gov/image/s132e012208/s132e012208~orig.jpg',
    dest: 'public/downloads/datasets/iss/images/cam_01_iss_sts132_front.jpg',
    name: 'ISS Completa en Órbita (STS-132)'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/ISS_March_2009.jpg',
    mirror: 'https://images-assets.nasa.gov/image/s119e010488/s119e010488~orig.jpg',
    dest: 'public/downloads/datasets/iss/images/cam_02_iss_sts132_orbit.jpg',
    name: 'ISS Paneles Solares y Módulos sobre la Tierra'
  },

  // 4. APOLLO 11 (Módulo Lunar Eagle en órbita y en la superficie lunar)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Apollo_11_Lunar_Module_-_AS11-44-6574.jpg',
    mirror: 'https://images-assets.nasa.gov/image/as11-44-6574/as11-44-6574~orig.jpg',
    dest: 'public/downloads/datasets/apollo/images/cam_01_eagle_lunar_module.jpg',
    name: 'Módulo Lunar Eagle en Órbita Lunar'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Aldrin_with_the_Lunar_Module.jpg',
    mirror: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~orig.jpg',
    dest: 'public/downloads/datasets/apollo/images/cam_02_eagle_lunar_surface.jpg',
    name: 'Eagle y Buzz Aldrin en Superficie Lunar'
  },

  // 5. ENCÉFALO HUMANO (Corteza 3D y Resonancia Magnética Sagital)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Human_brain_inferior-lateral_view_description.JPG',
    dest: 'public/downloads/datasets/brain/images/view_01_nih_brain.png',
    name: 'Corteza Cerebral Humana'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/MRI_head_side.jpg',
    dest: 'public/downloads/datasets/brain/images/view_02_mri_side.jpg',
    name: 'MRI Resonancia Sagital 3D'
  }
];

function fetchBinary(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: {
        'User-Agent': 'GoalsEducationalPlatform/2.0 (https://goals-project.org; dev@goals-project.org) Axios/1.6.0'
      }
    };

    https.get(options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirect = res.headers.location;
        if (redirect.startsWith('/')) {
          redirect = parsed.origin + redirect;
        }
        return fetchBinary(redirect).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode}`));
      }

      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('🛰️ Descargando imágenes verificadas de alta fidelidad...');
  for (const item of downloads) {
    const fullPath = path.resolve(item.dest);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

    let buffer = null;
    try {
      buffer = await fetchBinary(item.url);
      if (buffer.length < 20000 && item.mirror) {
        console.log(`⚠️ Archivo pequeño (${buffer.length} B), intentando mirror para ${item.name}...`);
        buffer = await fetchBinary(item.mirror);
      }
    } catch (e) {
      if (item.mirror) {
        try {
          console.log(`🔄 Reintentando mirror para ${item.name}...`);
          buffer = await fetchBinary(item.mirror);
        } catch (err2) {
          console.error(`❌ Falló también el mirror para ${item.name}: ${err2.message}`);
        }
      } else {
        console.error(`❌ Error descargando ${item.name}: ${e.message}`);
      }
    }

    if (buffer && buffer.length > 20000) {
      fs.writeFileSync(fullPath, buffer);
      console.log(`✅ [${(buffer.length / 1024).toFixed(1)} KB] ${item.name} -> ${item.dest}`);
    } else {
      console.error(`❌ ${item.name} no se pudo descargar (tamaño inválido: ${buffer ? buffer.length : 0} bytes)`);
    }
  }
  console.log('🎯 Todas las descargas procesadas.');
}

main();
