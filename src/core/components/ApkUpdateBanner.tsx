import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Sparkles, CheckCircle2, AlertCircle, ShieldCheck, X } from 'lucide-react';
import { checkForApkUpdate, triggerApkInstall, UpdateInfo } from '../services/updateService';

interface ApkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkUpdateModal: React.FC<ApkUpdateModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCheckUpdate = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const info = await checkForApkUpdate();
      setUpdateInfo(info);
    } catch (err: any) {
      setErrorMsg('No se pudo verificar el servidor de actualizaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !updateInfo) {
      handleCheckUpdate();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Cabecera del Modal */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-5 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base text-white">Actualizador de la Aplicación</h3>
              <p className="text-xs text-emerald-200">Verificación de versión del servidor</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6 space-y-5">
          
          {loading ? (
            <div className="py-8 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-xs text-slate-300">Comprobando si existen nuevas versiones de la app...</p>
            </div>
          ) : updateInfo ? (
            <div className="space-y-4">
              
              {/* Tarjeta de Estado de Versión */}
              <div className={`p-4 rounded-2xl border ${
                updateInfo.hasUpdate 
                  ? 'bg-emerald-950/50 border-emerald-500/40' 
                  : 'bg-slate-950 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {updateInfo.hasUpdate ? (
                      <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    <span className="font-bold text-sm text-white">
                      {updateInfo.hasUpdate ? '¡Nueva versión lista para descargar!' : 'Tu aplicación está actualizada'}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    updateInfo.hasUpdate ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {updateInfo.hasUpdate ? `v${updateInfo.latestVersion}` : `v${updateInfo.currentVersion}`}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Versión Instalada:</span>
                    <span className="font-mono text-slate-300 font-semibold">v{updateInfo.currentVersion}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Última Versión:</span>
                    <span className="font-mono text-emerald-400 font-semibold">v{updateInfo.latestVersion}</span>
                  </div>
                </div>
              </div>

              {/* Novedades de la Versión */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Novedades de la Versión:
                </span>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {updateInfo.releaseNotes}
                </p>
              </div>

              {/* Botón Principal de Descarga / Verificación */}
              {updateInfo.hasUpdate ? (
                <button
                  onClick={() => triggerApkInstall(updateInfo.downloadUrl)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98"
                >
                  <Download className="w-5 h-5" />
                  <span>Descargar e Instalar APK v{updateInfo.latestVersion}</span>
                </button>
              ) : (
                <button
                  onClick={handleCheckUpdate}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <span>Volver a Comprobar</span>
                </button>
              )}

            </div>
          ) : null}

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Información Discreta */}
          <div className="text-[11px] text-slate-500 bg-slate-950/60 p-3 rounded-xl border border-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Actualización directa y segura mediante el instalador nativo de la aplicación.</span>
          </div>

        </div>

      </div>
    </div>
  );
};
