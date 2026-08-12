import React from 'react';
import { Download, ShieldAlert, Package, X, FolderArchive, ShieldCheck, ArrowRight } from 'lucide-react';

interface ApkDownloadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadGuideModal: React.FC<ApkDownloadGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0b0f19] border border-emerald-500/40 w-full max-w-md rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl font-display relative cursor-default max-h-[90vh] overflow-y-auto hide-scrollbar text-left"
      >
        {/* Botón X de Cierre Prominente */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-90 shadow-md"
          title="Cerrar ventana"
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
            <p className="text-[11px] text-emerald-400 font-mono">goalskid.zip (v2.0 Native APK)</p>
          </div>
        </div>

        {/* Explicación Detallada Paso a Paso basada en la pantalla real del móvil */}
        <div className="space-y-3">
          
          <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-xs">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Pasos Sencillos (Descargar ➔ Descomprimir ➔ Instalar):</span>
          </div>

          <div className="space-y-2 text-xs">
            
            {/* Paso 1 */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-emerald-500/30">1</span>
              <div>
                <h4 className="font-bold text-white text-[11px]">Descargar el paquete comprimido</h4>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Pulsa el botón verde inferior para descargar el archivo <strong className="text-emerald-400">goalskid.zip</strong> (4.1 MB).
                </p>
              </div>
            </div>

            {/* Paso 2 */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-amber-500/30">2</span>
              <div>
                <h4 className="font-bold text-white text-[11px]">Descomprimir ("Abrir con ➔ Extraer")</h4>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Abre las Descargas de tu teléfono y toca en <strong className="text-white">goalskid.zip</strong>. En el menú de tu pantalla que dice <em>"Abrir con"</em>, toca en el icono de la carpeta amarilla que dice <strong className="text-amber-300">"Extraer"</strong> para descomprimir el archivo <strong className="text-emerald-400">goalskid.apk</strong>.
                </p>
              </div>
            </div>

            {/* Paso 3 */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-cyan-500/30">3</span>
              <div>
                <h4 className="font-bold text-white text-[11px]">Abrir e Iniciar Instalación</h4>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Toca sobre el archivo extraído <strong className="text-emerald-400">goalskid.apk</strong> para iniciar el asistente de instalación de la aplicación.
                </p>
              </div>
            </div>

            {/* Paso 4 */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-extrabold text-[10px] flex items-center justify-center shrink-0 border border-indigo-500/30">4</span>
              <div>
                <h4 className="font-bold text-white text-[11px]">Pantalla Google Play Protect ("Instalar sin analizar")</h4>
                <p className="text-[10px] text-slate-300 leading-relaxed">
                  Android mostrará la pantalla de Google Play Protect que dice <em>"Se recomienda analizar la aplicación"</em>. Para instalarla de inmediato, pulsa sobre la opción de texto que dice <strong className="text-emerald-400 font-semibold font-mono">"Instalar sin analizar"</strong> (situado encima de los dos botones azules) o en <em>"Analizar app"</em>.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Botón Final de Descargar goalskid.zip */}
        <div className="pt-2">
          <a
            href="https://goalskid.web.app/downloads/goalskid.zip"
            download="goalskid.zip"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 hover:from-emerald-500 hover:to-teal-300 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 active:scale-95 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Entendido, Descargar goalskid.zip</span>
          </a>
        </div>

      </div>
    </div>
  );
};
