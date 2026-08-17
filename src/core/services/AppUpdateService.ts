import { Capacitor } from '@capacitor/core';
import { 
  CURRENT_APP_VERSION, 
  CURRENT_VERSION_CODE, 
  VERSION_CHECK_URL, 
  VersionInfo, 
  compareSemver,
  APK_DOWNLOAD_URL 
} from '../config/version';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export interface UpdateCheckResult {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  updateInfo: VersionInfo | null;
  isMandatory: boolean;
  error: string | null;
}

class AppUpdateServiceImpl {
  private cachedUpdateInfo: VersionInfo | null = null;
  private lastCheckTime: number = 0;
  private checkIntervalMs: number = 30 * 60 * 1000; // 30 minutos

  /**
   * Comprueba en línea si hay una nueva versión disponible.
   * Prioridad 1: Endpoint HTTP en Firebase Hosting (version.json).
   * Prioridad 2 (Fallback): Documento Firestore 'system_config/app_version'.
   */
  async checkForUpdates(force: boolean = false): Promise<UpdateCheckResult> {
    const now = Date.now();
    if (!force && this.cachedUpdateInfo && now - this.lastCheckTime < this.checkIntervalMs) {
      const hasUpdate = compareSemver(this.cachedUpdateInfo.version, CURRENT_APP_VERSION) > 0;
      return {
        hasUpdate,
        currentVersion: CURRENT_APP_VERSION,
        latestVersion: this.cachedUpdateInfo.version,
        updateInfo: this.cachedUpdateInfo,
        isMandatory: Boolean(this.cachedUpdateInfo.isMandatory),
        error: null
      };
    }

    let remoteInfo: VersionInfo | null = null;
    let checkError: string | null = null;

    // 1. Intento HTTP con cache-busting
    try {
      const response = await fetch(`${VERSION_CHECK_URL}?_nocache=${now}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' }
      });
      if (response.ok) {
        remoteInfo = await response.json();
      }
    } catch (httpErr: any) {
      console.warn('[AppUpdateService] Error consultando version.json vía HTTP, probando Firestore:', httpErr);
    }

    // 2. Fallback a Firestore si falla el HTTP
    if (!remoteInfo && db) {
      try {
        const docRef = doc(db, 'system_config', 'app_version');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          remoteInfo = docSnap.data() as VersionInfo;
        }
      } catch (fsErr: any) {
        console.warn('[AppUpdateService] Error consultando Firestore fallback:', fsErr);
        checkError = 'No se pudo conectar con el servidor de actualizaciones.';
      }
    }

    if (!remoteInfo) {
      return {
        hasUpdate: false,
        currentVersion: CURRENT_APP_VERSION,
        latestVersion: CURRENT_APP_VERSION,
        updateInfo: null,
        isMandatory: false,
        error: checkError || 'No se pudo verificar la versión remota.'
      };
    }

    this.cachedUpdateInfo = remoteInfo;
    this.lastCheckTime = now;

    const hasUpdate = compareSemver(remoteInfo.version, CURRENT_APP_VERSION) > 0 || 
                      (remoteInfo.versionCode > CURRENT_VERSION_CODE);

    return {
      hasUpdate,
      currentVersion: CURRENT_APP_VERSION,
      latestVersion: remoteInfo.version,
      updateInfo: remoteInfo,
      isMandatory: Boolean(remoteInfo.isMandatory || (remoteInfo.minRequiredVersion && compareSemver(CURRENT_APP_VERSION, remoteInfo.minRequiredVersion) < 0)),
      error: null
    };
  }

  /**
   * Inicia la descarga e instalación de la APK o redirección
   */
  launchUpdate(apkUrl?: string): void {
    const targetUrl = apkUrl || this.cachedUpdateInfo?.apkDirectDownload || this.cachedUpdateInfo?.apkUrl || APK_DOWNLOAD_URL;
    
    if (Capacitor.isNativePlatform()) {
      // En Android APK nativo, forzar apertura en el navegador del sistema / gestor de descargas
      window.open(targetUrl, '_system');
    } else {
      // En Web de escritorio o móvil
      const a = document.createElement('a');
      a.href = targetUrl;
      a.download = 'goalskid.apk';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  /**
   * Guarda en almacenamiento local que el usuario descartó esta versión
   */
  dismissVersion(version: string): void {
    try {
      localStorage.setItem(`dismissed_update_${version}`, String(Date.now()));
    } catch {
      // ignore storage errors
    }
  }

  /**
   * Comprueba si una versión ha sido descartada recientemente (menos de 24 horas)
   */
  isVersionDismissed(version: string): boolean {
    try {
      const dismissed = localStorage.getItem(`dismissed_update_${version}`);
      if (!dismissed) return false;
      const dismissedTime = parseInt(dismissed, 10);
      const oneDayMs = 24 * 60 * 60 * 1000;
      return Date.now() - dismissedTime < oneDayMs;
    } catch {
      return false;
    }
  }
}

export const appUpdateService = new AppUpdateServiceImpl();
