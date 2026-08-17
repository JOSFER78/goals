import { useState, useEffect, useCallback } from 'react';
import { appUpdateService, UpdateCheckResult } from '../services/AppUpdateService';
import { VersionInfo, CURRENT_APP_VERSION } from '../config/version';

export function useAppUpdate(autoCheck: boolean = true) {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [updateResult, setUpdateResult] = useState<UpdateCheckResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const checkForUpdates = useCallback(async (force: boolean = false) => {
    setIsChecking(true);
    try {
      const result = await appUpdateService.checkForUpdates(force);
      setUpdateResult(result);
      if (result.hasUpdate && result.updateInfo) {
        // Solo abrir automáticamente si no fue descartada o si es obligatoria o si es forzada
        if (force || result.isMandatory || !appUpdateService.isVersionDismissed(result.updateInfo.version)) {
          setIsModalOpen(true);
        }
      }
      return result;
    } catch (err: any) {
      console.warn('[useAppUpdate] Error al comprobar actualización:', err);
      return null;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (autoCheck) {
      // Comprobación inicial demorada 3 segundos para no competir con el arranque
      const timer = setTimeout(() => {
        checkForUpdates(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoCheck, checkForUpdates]);

  const handleDismiss = useCallback(() => {
    if (updateResult?.updateInfo && !updateResult.isMandatory) {
      appUpdateService.dismissVersion(updateResult.updateInfo.version);
    }
    setIsModalOpen(false);
  }, [updateResult]);

  const handleUpdateNow = useCallback(() => {
    appUpdateService.launchUpdate(updateResult?.updateInfo?.apkDirectDownload || updateResult?.updateInfo?.apkUrl);
  }, [updateResult]);

  return {
    currentVersion: CURRENT_APP_VERSION,
    hasUpdate: Boolean(updateResult?.hasUpdate),
    updateInfo: updateResult?.updateInfo as VersionInfo | null,
    isMandatory: Boolean(updateResult?.isMandatory),
    isChecking,
    isModalOpen,
    openModal: () => setIsModalOpen(true),
    closeModal: handleDismiss,
    checkForUpdates,
    handleUpdateNow
  };
}
