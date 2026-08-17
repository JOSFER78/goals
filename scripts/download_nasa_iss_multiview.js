/**
 * Pipeline de Extracción Multi-Ángulo de la NASA
 * Descarga imágenes reales en máxima resolución de la ISS y el Sol para reconstrucción 3D
 */

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'NASA-3D-Reconstruction-Agent/1.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return await res.json();
}

async function searchNASAImages(query, limit = 10) {
  console.log(`[1] Consultando NASA Image API para query: "${query}"...`);
  const endpoint = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
  const result = await fetchJSON(endpoint);
  const items = result.collection.items || [];
  
  console.log(`   -> Se encontraron ${items.length} elementos.`);
  const extracted = [];
  for (let i = 0; i < Math.min(items.length, limit); i++) {
    const item = items[i];
    const data = item.data[0];
    const thumb = (item.links && item.links[0]) ? item.links[0].href : null;
    const collectionUri = item.href;
    
    extracted.push({
      nasa_id: data.nasa_id,
      title: data.title,
      date: data.date_created,
      description: data.description ? data.description.substring(0, 150) + '...' : '',
      thumb: thumb,
      collectionUri: collectionUri
    });
  }
  return extracted;
}

async function getHelioviewerSolarData() {
  console.log(`[2] Consultando Helioviewer API para el Sol (SDO / AIA multiespectral)...`);
  const date = new Date().toISOString().split('T')[0] + 'T12:00:00Z';
  
  // Wavelengths: 14 = AIA 335, 13 = AIA 304, 11 = AIA 193, 10 = AIA 171
  const sources = [
    { id: 13, name: 'AIA 304 (Chromosphere / Prominences - 50,000 K)', color: '#FF3B00' },
    { id: 10, name: 'AIA 171 (Corona / Quiet Sun Loops - 600,000 K)', color: '#FFD700' },
    { id: 11, name: 'AIA 193 (Hot Corona / Flare Plasma - 1,200,000 K)', color: '#68B04D' },
    { id: 14, name: 'AIA 335 (Active Regions - 2,500,000 K)', color: '#3A86FF' }
  ];

  const results = [];
  for (const src of sources) {
    try {
      const url = `https://api.helioviewer.org/v2/getClosestImage/?date=${date}&sourceId=${src.id}`;
      const res = await fetchJSON(url);
      results.push({
        sourceId: src.id,
        name: src.name,
        color: src.color,
        imageId: res.id,
        date: res.date,
        width: res.width,
        height: res.height,
        rsun: res.rsun,
        scale: res.scale,
        tileUrl: `https://api.helioviewer.org/v2/downloadScreenshot/?id=${res.id}`
      });
    } catch (e) {
      console.warn(`Aviso al consultar source ${src.id}:`, e.message);
    }
  }
  return results;
}

async function main() {
  try {
    const issImages = await searchNASAImages('iss space station flyaround angle', 6);
    console.log('Muestra de fotos ISS multi-ángulo:', JSON.stringify(issImages.map(img => ({ id: img.nasa_id, title: img.title })), null, 2));

    const solarData = await getHelioviewerSolarData();
    console.log('Muestra de datos SDO Sol 4K:', JSON.stringify(solarData, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
