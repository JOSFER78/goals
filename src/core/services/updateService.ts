// Servicio Transparente de Verificación y Auto-Actualización de APK In-App
import { App } from '@capacitor/app';

export interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  downloadUrl: string;
  releaseNotes: string;
  publishedAt: string;
}

const CURRENT_APP_VERSION = '1.0.0';
const VERSION_ENDPOINT = '/version.json';

/**
 * Obtener versión actual instalada en el dispositivo
 */
export async function getAppVersion(): Promise<string> {
  try {
    const info = await App.getInfo();
    return info.version || CURRENT_APP_VERSION;
  } catch (error) {
    return CURRENT_APP_VERSION;
  }
}

/**
 * Compara dos versiones semver (ej: "1.1.0" > "1.0.0")
 */
export function isVersionNewer(latest: string, current: string): boolean {
  const cleanLatest = latest.replace(/^v/, '').trim();
  const cleanCurrent = current.replace(/^v/, '').trim();

  const latestParts = cleanLatest.split('.').map((n) => parseInt(n, 10) || 0);
  const currentParts = cleanCurrent.split('.').map((n) => parseInt(n, 10) || 0);

  for (let i = 0; i < Math.max(latestParts.length, currentParts.length); i++) {
    const l = latestParts[i] || 0;
    const c = currentParts[i] || 0;
    if (l > c) return true;
    if (l < c) return false;
  }
  return false;
}

/**
 * Consulta de forma limpia y transparente si hay una actualización de APK en el servidor de producción
 */
export async function checkForApkUpdate(): Promise<UpdateInfo> {
  const currentVersion = await getAppVersion();

  try {
    // Intentar cargar el manifest de versión desde la web de producción o local
    const response = await fetch(VERSION_ENDPOINT, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Servidor de actualizaciones respondió (${response.status})`);
    }

    const data = await response.json();
    const latestVersion = data.version || CURRENT_APP_VERSION;
    const downloadUrl = data.apkUrl || '/downloads/app-release.apk';
    const hasUpdate = isVersionNewer(latestVersion, currentVersion);

    return {
      hasUpdate,
      currentVersion,
      latestVersion,
      downloadUrl,
      releaseNotes: data.changelog || 'Novedades y optimizaciones de rendimiento.',
      publishedAt: new Date().toISOString()
    };
  } catch (error: any) {
    console.warn('Verificación de actualización:', error.message);
    return {
      hasUpdate: false,
      currentVersion,
      latestVersion: currentVersion,
      downloadUrl: '/downloads/app-release.apk',
      releaseNotes: 'Servidor de actualizaciones en mantenimiento.',
      publishedAt: new Date().toISOString()
    };
  }
}

/**
 * Descargar e iniciar la instalación del archivo APK sin mostrar URLs ni repositorios
 */
export function triggerApkInstall(downloadUrl: string): void {
  window.open(downloadUrl, '_blank');
}
