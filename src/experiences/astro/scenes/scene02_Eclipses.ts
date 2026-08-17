/**
 * Escena 02: Eclipses Solares y Lunares (12 Agosto 2026 en España)
 * Implementa CosmosSceneModule con Sol distante, órbita lunar inclinada 5.14°,
 * conos de sombra de umbra/penumbra y punto de totalidad sobre la península ibérica.
 */
import * as THREE from 'three';
import { CosmosSceneModule, CosmosSceneContext } from './types';
import { loadNASATexture, createAtmosphereGlow } from '../utils/nasaTextures';

let rootGroup: THREE.Group | null = null;
let earthMesh: THREE.Mesh | null = null;
let moonMesh: THREE.Mesh | null = null;
let moonAngle = 0;
let umbraCone: THREE.Mesh | null = null;
let penumbraCone: THREE.Mesh | null = null;
let rayLines: THREE.LineSegments | null = null;

const MOON_ORBIT_R = 24.0;
const SUN_POS = new THREE.Vector3(-60, 0, 0);

export const scene02_Eclipses: CosmosSceneModule = {
  id: 2,
  key: 'eclipses',
  name: 'Eclipses y Gran Eclipse 2026',
  badge: '12 Ago 2026',
  tagline: 'Mecánica Celeste: Umbra, Penumbra y Nodos Lunares',
  description: 'Simulación de los eclipses con la inclinación orbital lunar de 5.14°, conos de sombra (umbra y penumbra) y la franja de totalidad del eclipse total de Sol del 12 de agosto de 2026 en España.',

  build: (ctx: CosmosSceneContext) => {
    const { scene, snapCamera } = ctx;
    rootGroup = new THREE.Group();
    moonAngle = Math.PI * 0.96;

    // 1. Sol Distante y Emisión Lumínica
    const sunLight = new THREE.DirectionalLight(0xfffaed, 3.0);
    sunLight.position.copy(SUN_POS);
    const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(6.0, 32, 32), new THREE.MeshBasicMaterial({ map: loadNASATexture('sun'), color: 0xffdd44 }));
    sunMesh.position.copy(SUN_POS);
    rootGroup.add(sunLight, sunMesh);

    // 2. Planeta Tierra en el Origen con Inclinación Axial (23.44°)
    earthMesh = new THREE.Mesh(new THREE.SphereGeometry(5.0, 48, 48), new THREE.MeshStandardMaterial({ map: loadNASATexture('earthDay'), roughness: 0.7 }));
    earthMesh.rotation.z = THREE.MathUtils.degToRad(23.44);
    rootGroup.add(earthMesh, createAtmosphereGlow(0x38bdf8, 0.5, 1.05));

    // 3. Marcador del Eclipse Total en España (Lat 40.4°N, Lon -3.7°W)
    const lat = THREE.MathUtils.degToRad(40.4);
    const lon = THREE.MathUtils.degToRad(-3.7);
    const markerPos = new THREE.Vector3(5.15 * Math.cos(lat) * Math.cos(lon), 5.15 * Math.sin(lat), -5.15 * Math.cos(lat) * Math.sin(lon));
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    marker.position.copy(markerPos);
    earthMesh.add(marker);

    // 4. Órbita Lunar Inclinada (5.14°) y Línea de Nodos
    const orbitPts: THREE.Vector3[] = [];
    for (let i = 0; i <= 80; i++) {
      const th = (i / 80) * Math.PI * 2;
      orbitPts.push(new THREE.Vector3(Math.cos(th) * MOON_ORBIT_R, Math.sin(th) * MOON_ORBIT_R * Math.tan(THREE.MathUtils.degToRad(5.14)), Math.sin(th) * MOON_ORBIT_R));
    }
    const orbitLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitPts), new THREE.LineBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.45 }));
    rootGroup.add(orbitLine);

    // 5. La Luna
    moonMesh = new THREE.Mesh(new THREE.SphereGeometry(1.36, 32, 32), new THREE.MeshStandardMaterial({ map: loadNASATexture('moon'), roughness: 0.9 }));
    rootGroup.add(moonMesh);

    // 6. Conos de Sombra (Umbra y Penumbra)
    const umbraGeo = new THREE.ConeGeometry(0.5, 24, 24, 1, true);
    umbraGeo.rotateX(Math.PI / 2);
    umbraCone = new THREE.Mesh(umbraGeo, new THREE.MeshBasicMaterial({ color: 0x020617, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }));
    rootGroup.add(umbraCone);

    const penumbraGeo = new THREE.ConeGeometry(3.2, 24, 24, 1, true);
    penumbraGeo.rotateX(Math.PI / 2);
    penumbraCone = new THREE.Mesh(penumbraGeo, new THREE.MeshBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false }));
    rootGroup.add(penumbraCone);

    // Rayos de luz tangentes
    const rayGeo = new THREE.BufferGeometry();
    rayGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(4 * 6), 3));
    rayLines = new THREE.LineSegments(rayGeo, new THREE.LineBasicMaterial({ color: 0xfef08a, transparent: true, opacity: 0.3 }));
    rootGroup.add(rayLines);

    scene.add(rootGroup);
    if (snapCamera) snapCamera(-28, 12, 34, 0, 0, 0);
  },

  update: (delta: number) => {
    if (!earthMesh || !moonMesh || !umbraCone || !penumbraCone || !rayLines) return;
    earthMesh.rotation.y += delta * 0.04;
    moonAngle += delta * 0.08;

    const mx = Math.cos(moonAngle) * MOON_ORBIT_R;
    const mz = Math.sin(moonAngle) * MOON_ORBIT_R;
    const my = Math.sin(moonAngle) * MOON_ORBIT_R * Math.tan(THREE.MathUtils.degToRad(5.14));
    moonMesh.position.set(mx, my, mz);

    const shadowDir = new THREE.Vector3().subVectors(moonMesh.position, SUN_POS).normalize();
    const coneOrigin = moonMesh.position.clone().add(shadowDir.clone().multiplyScalar(12));

    umbraCone.position.copy(coneOrigin);
    umbraCone.lookAt(coneOrigin.clone().add(shadowDir));
    penumbraCone.position.copy(coneOrigin);
    penumbraCone.lookAt(coneOrigin.clone().add(shadowDir));

    const pos = (rayLines.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    pos[0] = SUN_POS.x; pos[1] = SUN_POS.y + 6; pos[2] = SUN_POS.z;
    pos[3] = mx; pos[4] = my + 1.36; pos[5] = mz;
    pos[6] = SUN_POS.x; pos[7] = SUN_POS.y - 6; pos[8] = SUN_POS.z;
    pos[9] = mx; pos[10] = my - 1.36; pos[11] = mz;
    pos[12] = SUN_POS.x; pos[13] = SUN_POS.y + 6; pos[14] = SUN_POS.z;
    pos[15] = mx; pos[16] = my - 1.36; pos[17] = mz;
    pos[18] = SUN_POS.x; pos[19] = SUN_POS.y - 6; pos[20] = SUN_POS.z;
    pos[21] = mx; pos[22] = my + 1.36; pos[23] = mz;
    rayLines.geometry.attributes.position.needsUpdate = true;
  },

  teardown: () => {
    if (rootGroup) {
      rootGroup.parent?.remove(rootGroup);
      rootGroup.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.LineSegments) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else if (obj.material) obj.material.dispose();
        }
      });
      rootGroup = null;
    }
    earthMesh = null;
    moonMesh = null;
    umbraCone = null;
    penumbraCone = null;
    rayLines = null;
  }
};

export default scene02_Eclipses;
