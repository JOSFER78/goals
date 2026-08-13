import React from 'react';
import { Download, X, Package, ShieldAlert } from 'lucide-react';

interface ApkDownloadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadGuideModal: React.FC<ApkDownloadGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0b0f19] border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-left font-display">
        
        {/* Botón de Cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white leading-tight">Guía de Instalación en Móvil</h3>
            <p className="text-[11px] text-emerald-400 font-mono">goalskid_2.4.apk (v2.4.0 Native APK)</p>
          </div>
        </div>

        {/* Explicación Detallada Paso a Paso */}
        <div className="space-y-3">
          
          <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Pasos Sencillos (Descargar ➔ Instalar):</span>
          </div>

          <div className="space-y-2 text-xs">
            
            {/* Paso 1 */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-emerald-500/30">1</span>
              <div>
                <h4 className="font-bold text-white text-[11px]">Descargar el archivo APK</h4>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Pulsa el botón verde inferior para descargar el archivo <strong className="text-emerald-400">goalskid_2.4.apk</strong>.
                </p>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-cyan-500/30">2</span>
              <div>
                <h4 className="font-bold text-white text-[11px]">Abrir e Iniciar Instalación</h4>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Abre las Descargas de tu teléfono y toca sobre el archivo <strong className="text-emerald-400">goalskid_2.4.apk</strong> para iniciar la instalación.
                </p>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-indigo-500/30">3</span>
              <div>
                <h4 className="font-bold text-white text-[11px]">Pantalla Google Play Protect ("Instalar sin analizar")</h4>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Android mostrará la pantalla de Google Play Protect. Para instalarla de inmediato, pulsa sobre la opción que dice <strong className="text-emerald-400 font-semibold font-mono">"Instalar sin analizar"</strong>.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Botón Final de Descargar goalskid_2.4.apk */}
        <div className="pt-2">
          <a
            href="https://astrolingo-96820.web.app/downloads/goalskid_2.4.apk"
            download="goalskid_2.4.apk"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 hover:from-emerald-500 hover:to-teal-300 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 active:scale-95 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Entendido, Descargar goalskid_2.4.apk</span>
          </a>
        </div>

      </div>
    </div>
  );
};
