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
  isDismissed: boolean;
}

const CURRENT_APP_VERSION = '1.0.0';
const VERSION_ENDPOINT = 'https://goalskid.web.app/version.json';

export const isNativeApp = (): boolean => Capacitor.isNativePlatform();

/**
 * Marca una versión como descartada en el dispositivo para no volver a molestar automáticamente
 */
export function markUpdateDismissed(version: string): void {
  try {
    localStorage.setItem(`goals_dismissed_update_${version}`, 'true');
  } catch (e) {}
}

/**
 * Comprueba si el usuario ya descartó el aviso de una versión específica
 */
export function isUpdateDismissed(version: string): boolean {
  try {
    return localStorage.getItem(`goals_dismissed_update_${version}`) === 'true';
  } catch (e) {
    return false;
  }
}

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
    const downloadUrl = data.apkUrl || 'https://goalskid.web.app/downloads/app-release.apk';
    const hasUpdate = isVersionNewer(latestVersion, currentVersion);
    const dismissed = isUpdateDismissed(latestVersion);

    return {
      hasUpdate,
      currentVersion,
      latestVersion,
      downloadUrl,
      releaseNotes: data.changelog || 'Novedades y optimizaciones de rendimiento.',
      publishedAt: new Date().toISOString(),
      isNative,
      isDismissed: dismissed
    };
  } catch (error: any) {
    console.warn('Verificación de actualización:', error.message);
    return {
      hasUpdate: false,
      currentVersion,
      latestVersion: currentVersion,
      downloadUrl: 'https://goalskid.web.app/downloads/app-release.apk',
      releaseNotes: 'Servidor de actualizaciones en mantenimiento.',
      publishedAt: new Date().toISOString(),
      isNative,
      isDismissed: false
    };
  }
}

/**
 * Descargar e iniciar la instalación del archivo APK sin mostrar URLs ni repositorios
 */
export function triggerApkInstall(downloadUrl: string): void {
  window.open(downloadUrl, '_system') || window.open(downloadUrl, '_blank');
}
