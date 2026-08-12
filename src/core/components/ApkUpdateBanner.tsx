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

  const handleDismissAndClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Guardar descarte en localStorage (memoria)
    if (updateInfo?.latestVersion) {
      markUpdateDismissed(updateInfo.latestVersion);
    } else {
      markUpdateDismissed('1.0.1');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={handleDismissAndClose}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0b0f19] border border-slate-800 w-full max-w-xs rounded-2xl p-4 space-y-4 shadow-2xl text-center font-display relative cursor-default"
      >
        
        {/* Botón 'X' destacado para cerrar (Guarda memoria de descarte) */}
        <button 
          type="button"
          onClick={handleDismissAndClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer z-10"
          title="Cerrar y recordar descarte"
        >
          <X className="w-4 h-4 text-slate-300" />
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

        {/* 3. Botones de Acción */}
        <div className="space-y-2">
          {updateInfo?.hasUpdate ? (
            <button
              type="button"
              onClick={() => {
                triggerApkInstall(updateInfo.downloadUrl);
                handleDismissAndClose();
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Descargar e Instalar
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

          {/* Botón de Cierre Secundario Explicito */}
          <button
            type="button"
            onClick={handleDismissAndClose}
            className="w-full py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Cerrar y recordar más tarde
          </button>
        </div>

      </div>
    </div>
  );
};
