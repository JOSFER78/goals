import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Sparkles, CheckCircle2, X } from 'lucide-react';
import { checkForApkUpdate, triggerApkInstall, markUpdateDismissed, UpdateInfo } from '../services/updateService';

interface ApkUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkUpdateModal: React.FC<ApkUpdateModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

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
    if (isOpen && !updateInfo) {
      handleCheckUpdate();
    }
  }, [isOpen]);

  const handleDismissAndClose = () => {
    if (updateInfo?.latestVersion) {
      markUpdateDismissed(updateInfo.latestVersion);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0b0f19] border border-slate-800 w-full max-w-xs rounded-2xl p-4 space-y-4 shadow-2xl text-center font-display relative">
        
        {/* Botón Cerrar (Guarda memoria de descarte en localStorage) */}
        <button 
          onClick={handleDismissAndClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors p-1"
          title="Cerrar y recordar descarte"
        >
          <X className="w-4 h-4" />
        </button>

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

        {/* 3. Botón de Acción Único */}
        {updateInfo?.hasUpdate ? (
          <button
            onClick={() => triggerApkInstall(updateInfo.downloadUrl)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Descargar e Instalar
          </button>
        ) : (
          <button
            onClick={handleCheckUpdate}
            disabled={loading}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${loading ? 'animate-spin' : ''}`} /> Verificar Ahora
          </button>
        )}

      </div>
    </div>
  );
};
