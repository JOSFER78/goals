import React from 'react';
import { VersionInfo, CURRENT_APP_VERSION } from '../config/version';
import { Sparkles, ArrowRight, X, DownloadCloud, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface UpdateAvailableModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateInfo: VersionInfo | null;
  isMandatory?: boolean;
  onUpdateNow: () => void;
}

export const UpdateAvailableModal: React.FC<UpdateAvailableModalProps> = ({
  isOpen,
  onClose,
  updateInfo,
  isMandatory = false,
  onUpdateNow
}) => {
  const { isDark } = useTheme();

  if (!isOpen || !updateInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-display animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
        onClick={!isMandatory ? onClose : undefined}
      />

      {/* Tarjeta Modal */}
      <div className={`relative z-10 w-full max-w-md rounded-3xl border p-5 sm:p-6 shadow-2xl transition-all animate-slideUp ${
        isDark 
          ? 'bg-[#0c101c]/95 border-slate-800 shadow-black/80 text-white' 
          : 'bg-white border-slate-200 shadow-slate-300 text-slate-900'
      }`}>
        
        {/* Botón cerrar si no es obligatoria */}
        {!isMandatory && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Encabezado con Icono Resplandeciente */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-500/10">
            <DownloadCloud className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Nueva Versión
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {updateInfo.releaseDate}
              </span>
            </div>
            <h2 className="font-bold text-lg sm:text-xl tracking-tight mt-0.5">
              {updateInfo.title || `Goalskid v${updateInfo.version}`}
            </h2>
          </div>
        </div>

        {/* Comparador de Versiones */}
        <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-mono mb-4 ${
          isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <div>
            <span className="text-[10px] text-slate-400 block">Instalada</span>
            <span className="font-bold text-slate-300">v{CURRENT_APP_VERSION}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0" />
          <div className="text-right">
            <span className="text-[10px] text-emerald-400 block">Disponible</span>
            <span className="font-extrabold text-emerald-400">v{updateInfo.version}</span>
          </div>
        </div>

        {/* Lista de Mejoras (Release Notes) */}
        {updateInfo.releaseNotes && updateInfo.releaseNotes.length > 0 && (
          <div className="space-y-2 mb-5">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              Novedades de esta versión:
            </span>
            <div className={`max-h-40 overflow-y-auto space-y-1.5 p-3 rounded-2xl border text-xs scrollbar-thin ${
              isDark ? 'bg-slate-950/50 border-slate-800/50 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              {updateInfo.releaseNotes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Garantía de Seguridad */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-5 px-1">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Firma criptográfica SHA-256 verificada en Firebase</span>
        </div>

        {/* Botones de Acción */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={onUpdateNow}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>Descargar e Instalar APK</span>
          </button>

          {!isMandatory && (
            <button
              type="button"
              onClick={onClose}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                isDark 
                  ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Recordar más tarde
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
