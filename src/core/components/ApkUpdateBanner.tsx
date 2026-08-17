import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Sparkles, CheckCircle2, X, ShieldAlert, ArrowRight, Check } from 'lucide-react';
import { checkForApkUpdate, triggerApkInstall, markUpdateDismissed, UpdateInfo } from '../services/updateService';

interface ApkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkUpdateModal: React.FC<ApkUpdateModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [showAndroidGuide, setShowAndroidGuide] = useState<boolean>(false);

  const handleCheckUpdate = async () => {
    setLoading(true);
    try {
      const info = await checkForApkUpdate();
      setUpdateInfo(info);
    } catch (err) {
      // Ignorar errores silenciosamente
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShowAndroidGuide(false);
      if (!updateInfo) {
        handleCheckUpdate();
      }
    }
  }, [isOpen]);

  const handleDismissAndClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (updateInfo?.latestVersion) {
      markUpdateDismissed(updateInfo.latestVersion);
    } else {
      markUpdateDismissed('1.0.1');
    }
    onClose();
  };

  const handleStartDownload = () => {
    const apkUrl = updateInfo?.downloadUrl || 'https://appgoals.web.app/downloads/goalskid_2.5.zip';
    triggerApkInstall(apkUrl);
    handleDismissAndClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={handleDismissAndClose}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0b0f19] border border-slate-800 w-full max-w-xs sm:max-w-sm rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl text-center font-display relative cursor-default overflow-hidden"
      >
        
        {/* Botón 'X' destacado para cerrar */}
        <button 
          type="button"
          onClick={handleDismissAndClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer z-10"
          title="Cerrar y recordar descarte"
        >
          <X className="w-4 h-4 text-slate-300" />
        </button>

        {!showAndroidGuide ? (
          /* PANTALLA 1: ESTADO DE ACTUALIZACIÓN */
          <>
            {/* 1. Icono + Título */}
            <div className="flex flex-col items-center gap-1.5 pt-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-sm text-white">Actualización de la App</h3>
            </div>

            {/* 2. Frase de Estado / Versión */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
              {loading ? (
                <span className="text-slate-400 flex items-center justify-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  Comprobando servidor...
                </span>
              ) : updateInfo?.hasUpdate ? (
                <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> ¡Nueva versión v{updateInfo.latestVersion} lista!
                </span>
              ) : (
                <span className="text-slate-300 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Versión v{updateInfo?.currentVersion || '1.0.0'} al día
                </span>
              )}
            </div>

            {/* 3. Botones de Acción */}
            <div className="space-y-2">
              {updateInfo?.hasUpdate ? (
                <button
                  type="button"
                  onClick={() => setShowAndroidGuide(true)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Descargar ZIP (APK v{updateInfo.latestVersion})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCheckUpdate}
                  disabled={loading}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} /> Verificar Ahora
                </button>
              )}

              <button
                type="button"
                onClick={handleDismissAndClose}
                className="w-full py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Cerrar y recordar más tarde
              </button>
            </div>
          </>
        ) : (
          /* PANTALLA 2: GUÍA EXPLICATIVA DE INSTALACIÓN EN ANDROID */
          <div className="space-y-3 text-left pt-1 animate-fadeIn">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <h4 className="font-extrabold text-xs text-white">Instrucciones de Instalación</h4>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/30 space-y-2 text-[11px]">
              <p className="text-amber-300 font-bold flex items-center gap-1 text-xs">
                ⚠️ Aviso de Android / Play Store:
              </p>
              
              <ol className="space-y-2 text-slate-300 list-decimal pl-4 leading-relaxed">
                <li>
                  Se descargará el archivo <strong className="text-emerald-400">goalskid_2.5.zip</strong> (contiene el APK oficial).
                </li>
                <li>
                  Extrae el ZIP en tu gestor de archivos y toca el archivo APK para instalar.
                </li>
                <li>
                  Debes pulsar en <strong className="text-white">"Ajustes ➔ Permitir de esta fuente"</strong> o <strong className="text-emerald-400">"Instalar de todas formas"</strong>.
                </li>
              </ol>
            </div>

            <button
              type="button"
              onClick={handleStartDownload}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Entendido, Descargar ZIP con APK</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
