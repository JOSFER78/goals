import React from 'react';
import { Download, X, Package, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { CURRENT_APP_VERSION } from '../services/updateService';

interface ApkDownloadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadGuideModal: React.FC<ApkDownloadGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-left font-display">
        
        {/* Botón de Cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white leading-tight">Guía de Instalación en Móvil</h3>
            <p className="text-[11px] text-emerald-400 font-mono">goalskid_{CURRENT_APP_VERSION}.apk (v{CURRENT_APP_VERSION} Native Android)</p>
          </div>
        </div>

        {/* Explicación Detallada */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-slate-300 font-bold text-xs">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Pasos de Instalación Rápida:</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Paso 1 */}
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0 border border-emerald-500/30">1</span>
              <div>
                <h4 className="font-bold text-white text-xs">Descargar el archivo APK</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pulsa el botón inferior para descargar el paquete de instalación.
                </p>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 border border-cyan-500/30">2</span>
              <div>
                <h4 className="font-bold text-white text-xs">Abrir e Iniciar Instalación</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Abre las Descargas de tu teléfono y toca sobre el archivo APK descargado.
                </p>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0 border border-indigo-500/30">3</span>
              <div>
                <h4 className="font-bold text-white text-xs">Autorizar Instalación</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Si Android muestra la pantalla de Play Protect, selecciona la opción <strong className="text-emerald-400 font-medium">"Instalar sin analizar"</strong>.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Botón Final de Descarga */}
        <div className="pt-2">
          <a
            href="https://appgoals.web.app/downloads/goalskid_2.5.zip"
            download="goalskid_2.5.zip"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar APK v{CURRENT_APP_VERSION}</span>
          </a>
        </div>

      </div>
    </div>
  );
};

