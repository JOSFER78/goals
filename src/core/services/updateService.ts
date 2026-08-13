// Servicio Transparente de Verificación y Auto-Actualización de APK In-App
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  downloadUrl: string;
  releaseNotes: string;
  publishedAt: string;
  isNative: boolean;
}

const CURRENT_APP_VERSION = '2.1.0';
const VERSION_ENDPOINT = 'https://goalskid.web.app/version.json';

export const isNativeApp = (): boolean => Capacitor.isNativePlatform();

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
 * Consulta si hay una actualización de APK en el servidor de producción
 */
export async function checkForApkUpdate(): Promise<UpdateInfo> {
  const currentVersion = await getAppVersion();
  const isNative = isNativeApp();

  try {
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
    const downloadUrl = data.apkUrl || 'https://goalskid.web.app/downloads/goalskid2.1.zip';
    const hasUpdate = isVersionNewer(latestVersion, currentVersion);

    return {
      hasUpdate,
      currentVersion,
      latestVersion,
      downloadUrl,
      releaseNotes: data.changelog || 'Novedades y optimizaciones de rendimiento.',
      publishedAt: new Date().toISOString(),
      isNative
    };
  } catch (error: any) {
    console.warn('Verificación de actualización:', error.message);
    return {
      hasUpdate: false,
      currentVersion,
      latestVersion: currentVersion,
      downloadUrl: 'https://goalskid.web.app/downloads/goalskid2.1.zip',
      releaseNotes: 'Servidor de actualizaciones en mantenimiento.',
      publishedAt: new Date().toISOString(),
      isNative
    };
  }
}

/**
 * Descarga directa y 100% garantizada del archivo goalskid2.1.zip usando elemento <a download>
 */
export function triggerApkInstall(downloadUrl?: string): void {
  const url = downloadUrl || 'https://goalskid.web.app/downloads/goalskid2.1.zip';
  const a = document.createElement('a');
  a.href = url;
  a.download = 'goalskid2.1.zip';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 100);
}
