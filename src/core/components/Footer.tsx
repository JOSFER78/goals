import React, { useState, useRef, useEffect } from 'react';
import { Download, Shield, Globe, BookOpen, Orbit, RefreshCw, ChevronUp, HelpCircle, CheckCircle2, Smartphone } from 'lucide-react';
import { ApkDownloadGuideModal } from './ApkDownloadGuideModal';
import { checkForApkUpdate, isNativeApp, UpdateInfo, CURRENT_APP_VERSION } from '../services/updateService';
import { useProgress } from '../context/ProgressContext';
import { GOALS_EXPERIENCES } from '../config/experiencesConfig';

interface FooterProps {
  onSelectExperience?: (expId: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectExperience }) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);

  const { showToast } = useProgress();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCheckUpdates = async () => {
    setIsCheckingUpdate(true);
    try {
      const info = await checkForApkUpdate();
      setUpdateInfo(info);
      if (info.hasUpdate) {
        showToast(`🔔 ¡Nueva versión v${info.latestVersion} disponible!`);
      } else {
        showToast(`✅ Estás en la versión más reciente (v${info.currentVersion})`);
      }
    } catch (e) {
      showToast("Error consultando servidor de versiones");
    } finally {
      setIsCheckingUpdate(false);
    }
  };

  return (
    <>
      <footer className="w-full bg-slate-950/95 border-t border-slate-800/80 text-slate-400 text-xs font-display backdrop-blur-md z-10 py-5 px-4 sm:px-8 mt-auto relative snap-start">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4">
          
          {/* Fila Principal: Branding, Links de Navegación & Único Icono Android */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-4 border-b border-slate-800/60 items-center">
            
            {/* Columna 1: Branding GOALS */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <img 
                  src="/goals_platform_logo.png" 
                  alt="GOALS Platform Logo" 
                  className="w-7 h-7 rounded-lg border border-indigo-500/40 shadow-sm object-cover shrink-0" 
                />
                <span className="font-extrabold text-white text-sm tracking-tight">GOALS Platform</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Plataforma Educativa Gamificada con IA Real, Astrofísica 3D y Aprendizaje Adaptativo.
              </p>
            </div>

            {/* Columna 2: Ecosistema de Mini Apps */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Ecosistema</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                {Object.values(GOALS_EXPERIENCES).map((exp) => {
                  const IconComp = exp.icon;
                  return (
                    <button
                      key={exp.id}
                      type="button"
                      className={`hover:${exp.iconColorClass} flex items-center gap-1 transition-colors cursor-pointer`}
                      onClick={() => onSelectExperience?.(exp.id)}
                    >
                      <IconComp className={`w-3 h-3 ${exp.iconColorClass}`} />
                      <span>{exp.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Columna 3: ÚNICO BOTÓN ELEGANTE CON ICONO OFICIAL ANDROID / MÓVIL Y DESPLEGABLE */}
            <div className="sm:text-right flex sm:justify-end relative" ref={dropdownRef}>
              
              {/* Botón Principal Mínimo de Android */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-400 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer group"
              >
                <img src="/android-logo.png" alt="Android" className="w-4 h-4 object-contain group-hover:scale-110 transition-transform" />
                <span className="text-emerald-400 font-mono text-[11px]">v{CURRENT_APP_VERSION}</span>
                <ChevronUp className={`w-3 h-3 text-emerald-400 transition-transform duration-200 ${isDropdownOpen ? '' : 'rotate-180'}`} />
              </button>

              {/* Mini Desplegable Ultra-Mínimo */}
              {isDropdownOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-64 bg-[#0b0f19] border border-emerald-500/30 rounded-2xl p-3 shadow-2xl space-y-2.5 z-50 font-display animate-fadeIn text-left">
                  
                  {/* Cabecera limpia */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <img src="/android-logo.png" alt="Android Logo" className="w-4 h-4 object-contain" />
                      <h4 className="font-extrabold text-xs text-white leading-tight flex items-center gap-1.5">
                        <span>Android App</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">v{CURRENT_APP_VERSION}</span>
                      </h4>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </div>

                  {/* Botón de Descargar Directa Mínimo */}
                  <a
                    href="https://goalskid.web.app/downloads/goals.apk"
                    download="goals.apk"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar APK</span>
                  </a>

                  {/* Acciones Secundarias */}
                  <div className={isNativeApp() ? "grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80" : "pt-1 border-t border-slate-800/80"}>
                    
                    {/* Buscar Actualización (Sólo en APK) */}
                    {isNativeApp() && (
                      <button
                        type="button"
                        onClick={handleCheckUpdates}
                        disabled={isCheckingUpdate}
                        className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 text-indigo-400 ${isCheckingUpdate ? 'animate-spin' : ''}`} />
                        <span>{isCheckingUpdate ? 'Consultando...' : 'Comprobar'}</span>
                      </button>
                    )}

                    {/* Guía de Instalación */}
                    <button
                      type="button"
                      onClick={() => { setIsGuideOpen(true); setIsDropdownOpen(false); }}
                      className="w-full py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-400 text-[10px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
                    >
                      <HelpCircle className="w-3 h-3 text-amber-400" />
                      <span>Guía de Instalación</span>
                    </button>
                  </div>

                  {/* Resultado dinámico en la APK */}
                  {updateInfo && isNativeApp() && (
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{updateInfo.hasUpdate ? `¡Nueva versión v${updateInfo.latestVersion} disponible!` : `App actualizada (v${updateInfo.currentVersion})`}</span>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

          {/* Fila Inferior: Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500">
            <p>© 2026 GOALS Educational Ecosystem. Todos los derechos reservados.</p>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                🟢 IA Real Conectada (model: "auto")
              </span>
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
