// Servicio Transparente de Verificación y Auto-Actualización de APK In-App
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { 
  CURRENT_APP_VERSION, 
  CURRENT_VERSION_CODE, 
  VERSION_CHECK_URL, 
  APK_DOWNLOAD_URL,
  VersionInfo,
  compareSemver
} from '../config/version';
import { appUpdateService } from './AppUpdateService';

export { CURRENT_APP_VERSION, CURRENT_VERSION_CODE, compareSemver };

export interface UpdateInfo {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  downloadUrl: string;
  releaseNotes: string;
  publishedAt: string;
  isNative: boolean;
}

export const isNativeApp = (): boolean => Capacitor.isNativePlatform();

/**
 * Obtener versión actual instalada en el dispositivo nativo Android
 */
export async function getAppVersion(): Promise<string> {
  const overrideVersion = localStorage.getItem('goals_override_app_version');
  if (overrideVersion) {
    return overrideVersion;
  }

  if (Capacitor.isNativePlatform()) {
    try {
      const info = await App.getInfo();
      if (info && info.version && info.version !== '1.0' && info.version !== '1.0.0') {
        return info.version;
      }
    } catch (error) {
      console.warn('Capacitor App.getInfo fallback:', error);
    }
  }

  return CURRENT_APP_VERSION;
}

/**
 * Compara dos versiones semver (ej: "2.5.1" > "2.5.0")
 */
export function isVersionNewer(latest: string, current: string): boolean {
  return compareSemver(latest, current) > 0;
}

/**
 * Consulta el endpoint oficial version.json
 */
export async function checkForApkUpdate(): Promise<UpdateInfo> {
  const check = await appUpdateService.checkForUpdates(true);
  const info = check.updateInfo;

  return {
    hasUpdate: check.hasUpdate,
    currentVersion: check.currentVersion,
    latestVersion: check.latestVersion,
    downloadUrl: info?.apkDirectDownload || info?.apkUrl || APK_DOWNLOAD_URL,
    releaseNotes: Array.isArray(info?.releaseNotes) ? info.releaseNotes.join(' • ') : (info?.releaseNotes || 'Mejoras y correcciones'),
    publishedAt: info?.releaseDate || new Date().toISOString().split('T')[0],
    isNative: Capacitor.isNativePlatform()
  };
}

/**
 * Lanza la instalación/descarga del APK
 */
export function triggerApkInstall(apkUrl?: string): void {
  appUpdateService.launchUpdate(apkUrl);
}

/**
 * Marca una versión como descartada
 */
export function markUpdateDismissed(version: string): void {
  appUpdateService.dismissVersion(version);
}
