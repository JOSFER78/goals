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

export const CURRENT_APP_VERSION = '2.5.0';
const VERSION_ENDPOINT = 'https://appgoals.web.app/version.json';
const DEFAULT_APK_URL = 'https://appgoals.web.app/downloads/goalskid_2.5.zip';

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
 * Compara dos versiones semver (ej: "2.4.0" > "2.3.0")
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
 * Consulta el endpoint remoto version.json en tiempo real desde cualquier plataforma (Web, Windows, APK Nativa)
 */
export async function checkForApkUpdate(): Promise<UpdateInfo> {
  const isNative = isNativeApp();
  const currentVersion = await getAppVersion();

  try {
    const response = await fetch(`${VERSION_ENDPOINT}?t=${Date.now()}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    if (!response.ok) {
      throw new Error(`Servidor de actualizaciones respondió (${response.status})`);
    }

    const data = await response.json();
    const latestVersion = data.version || CURRENT_APP_VERSION;
    const downloadUrl = data.apkUrl || DEFAULT_APK_URL;
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
      latestVersion: CURRENT_APP_VERSION,
      downloadUrl: DEFAULT_APK_URL,
      releaseNotes: 'Servidor de actualizaciones en mantenimiento.',
      publishedAt: new Date().toISOString(),
      isNative
    };
  }
}

/**
 * Descarga directa del archivo goalskid_2.4.apk usando elemento <a download>
 */
export function triggerApkInstall(downloadUrl?: string): void {
  const url = downloadUrl || DEFAULT_APK_URL;
  const a = document.createElement('a');
  a.href = url;
  a.download = 'goalskid_2.4.apk';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
  }, 100);
}
