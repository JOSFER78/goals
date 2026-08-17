/**
 * Configuración Centralizada de Versión y Actualizaciones OTA de Goalskid
 */

export interface VersionInfo {
  version: string;
  versionCode: number;
  minRequiredVersion: string;
  releaseDate: string;
  title: string;
  releaseNotes: string[];
  apkUrl: string;
  apkDirectDownload: string;
  zipUrl?: string;
  fileSizeBytes?: number;
  isMandatory?: boolean;
}

export const CURRENT_APP_VERSION = '2.5.1';
export const CURRENT_VERSION_CODE = 251;

export const APK_FILE_NAME = `goalskid_v${CURRENT_APP_VERSION}.apk`;
export const ZIP_FILE_NAME = `goalskid_v${CURRENT_APP_VERSION}.zip`;

export const VERSION_CHECK_URL = 'https://appgoals.web.app/version.json';
export const APK_DOWNLOAD_URL = `https://appgoals.web.app/download/${ZIP_FILE_NAME}`;
export const ZIP_DOWNLOAD_URL = `https://appgoals.web.app/download/${ZIP_FILE_NAME}`;
export const DIRECT_APK_URL = `https://appgoals.web.app/download/${APK_FILE_NAME}`;

/**
 * Compara dos cadenas de versión semántica (ej. "2.5.1" > "2.5.0")
 * Devuelve:
 *  1 si v1 > v2
 * -1 si v1 < v2
 *  0 si v1 === v2
 */
export function compareSemver(v1: string, v2: string): number {
  const p1 = v1.split('.').map(n => parseInt(n, 10) || 0);
  const p2 = v2.split('.').map(n => parseInt(n, 10) || 0);
  const maxLen = Math.max(p1.length, p2.length);

  for (let i = 0; i < maxLen; i++) {
    const num1 = p1[i] || 0;
    const num2 = p2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}
