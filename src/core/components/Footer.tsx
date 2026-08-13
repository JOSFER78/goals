import React, { useState } from 'react';
import { Download, Shield, Globe, BookOpen, Orbit } from 'lucide-react';
import { ApkDownloadGuideModal } from './ApkDownloadGuideModal';

interface FooterProps {
  onSelectExperience?: (expId: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectExperience }) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <>
      <footer className="w-full bg-slate-950/90 border-t border-slate-800/80 text-slate-400 text-xs font-display backdrop-blur-md z-10 py-6 px-4 sm:px-8 mt-auto">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6">
          
          {/* Fila Principal: Branding, Links de Navegación & Estado de Versión */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-6 border-b border-slate-800/60">
            
            {/* Columna 1: Branding GOALS */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-black text-indigo-400 text-xs">
                  G
                </div>
                <span className="font-extrabold text-white text-sm tracking-tight">GOALS Platform</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Plataforma Educativa Gamificada con Inteligencia Artificial Real, Astrofísica 3D y Aprendizaje Adaptativo.
              </p>
            </div>

            {/* Columna 2: Ecosistema de Mini Apps */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Ecosistema</h4>
              <ul className="space-y-1 text-[11px]">
                <li className="hover:text-emerald-400 cursor-pointer flex items-center gap-1.5 transition-colors" onClick={() => onSelectExperience?.('school')}>
                  <BookOpen className="w-3 h-3 text-emerald-400" /> Escuela IA & OCR
                </li>
                <li className="hover:text-cyan-400 cursor-pointer flex items-center gap-1.5 transition-colors" onClick={() => onSelectExperience?.('languages')}>
                  <Globe className="w-3 h-3 text-cyan-400" /> AstroLingo Idiomas
                </li>
                <li className="hover:text-indigo-400 cursor-pointer flex items-center gap-1.5 transition-colors" onClick={() => onSelectExperience?.('astro')}>
                  <Orbit className="w-3 h-3 text-indigo-400" /> Astro 3D NASA
                </li>
                <li className="hover:text-amber-400 cursor-pointer flex items-center gap-1.5 transition-colors" onClick={() => onSelectExperience?.('verify')}>
                  <Shield className="w-3 h-3 text-amber-400" /> Verifica Noticias
                </li>
              </ul>
            </div>

            {/* Columna 3: Descarga Directa de goalskid.zip con Guía Previa */}
            <div className="space-y-2.5 sm:text-right flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Descarga APK / ZIP</h4>
                <div className="flex items-center sm:justify-end gap-1.5 mt-1 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-slate-300 font-medium">Versión v2.1.0</span>
                </div>
              </div>

              {/* Botón que abre el modal explicativo de instalación */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all flex items-center gap-1.5 active:scale-95 sm:ml-auto shadow-md w-fit cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar goalskid2.1.zip (v2.1.0)</span>
                </button>
              </div>
            </div>

          </div>

          {/* Fila Inferior: Copyright & Transparencia */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500">
            <p>© 2026 GOALS Educational Ecosystem. Todos los derechos reservados.</p>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                🟢 IA Real Conectada (model: "auto")
              </span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Privacidad & Términos</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Modal Explicativo de Instalación en Android */}
      <ApkDownloadGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </>
  );
};
