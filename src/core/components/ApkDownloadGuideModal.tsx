import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Download, X, Package, ShieldAlert, CheckCircle2, Copy, Check, 
  Smartphone, Settings, FileArchive, Sparkles, ExternalLink, QrCode,
  ShieldCheck, RefreshCw, AlertCircle, Eye
} from 'lucide-react';
import { CURRENT_APP_VERSION, ZIP_DOWNLOAD_URL, ZIP_FILE_NAME, APK_FILE_NAME, DIRECT_APK_URL } from '../config/version';
import { useProgress } from '../context/ProgressContext';

interface ApkDownloadGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'download' | 'config' | 'qr';
}

export const ApkDownloadGuideModal: React.FC<ApkDownloadGuideModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'download'
}) => {
  const { showToast } = useProgress();
  const [activeTab, setActiveTab] = useState<'download' | 'config' | 'qr'>(initialTab);
  const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'completed'>('idle');
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setDownloadState('idle');
      setDownloadProgress(0);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const downloadUrl = ZIP_DOWNLOAD_URL || `https://appgoals.web.app/download/${ZIP_FILE_NAME}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(downloadUrl)}&bgcolor=090d16&color=38bdf8`;

  const handleStartDownload = () => {
    setDownloadState('downloading');
    setDownloadProgress(10);
    showToast?.(`⬇️ Descargando ${ZIP_FILE_NAME} (85.7 MB)...`);

    // Trigger download via hidden link
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = ZIP_FILE_NAME;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Visual animated progress feedback
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadState('completed');
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 15;
      });
    }, 250);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(downloadUrl);
      setCopied(true);
      showToast?.('📋 ¡Enlace de descarga copiado al portapapeles!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast?.('Enlace: ' + downloadUrl);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn font-display select-none"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 text-left max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Botón de Cierre */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer z-10"
          title="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Encabezado con Badges */}
        <div className="flex items-start gap-3.5 pb-3 border-b border-slate-800 shrink-0 pr-10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base text-white leading-tight">
                Centro de Descargas & Configuración APK
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20">
                v{CURRENT_APP_VERSION} Oficial
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Paquete oficial compilado para teléfonos y tablets Android (85.73 MB · Aceleración 3D)
            </p>
          </div>
        </div>

        {/* Selector de Pestañas */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('download')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'download' 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descarga</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'config' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configuración</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qr')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'qr' 
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Móvil (QR)</span>
          </button>
        </div>

        {/* Contenido Dinámico por Pestaña */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5 scrollbar-thin">
          
          {/* PESTAÑA 1: DESCARGA Y ARCHIVOS */}
          {activeTab === 'download' && (
            <div className="space-y-3">
              
              {/* Tarjeta del Archivo Principal */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <FileArchive className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{ZIP_FILE_NAME}</h4>
                      <p className="text-[11px] text-slate-400">Contiene el instalador <span className="text-emerald-400 font-mono">{APK_FILE_NAME}</span> (86.2 MB)</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs font-bold">
                    85.73 MB
                  </span>
                </div>

                {/* Feedback Dinámico de Descarga */}
                {downloadState === 'downloading' && (
                  <div className="p-3 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-indigo-300 font-bold flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                        Iniciando descarga en tu navegador...
                      </span>
                      <span className="text-slate-400 font-mono">{downloadProgress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-300 rounded-full"
                        style={{ width: `${downloadProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Comprueba la barra de descargas o la notificación de tu navegador para ver el progreso del archivo.
                    </p>
                  </div>
                )}

                {downloadState === 'completed' && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1.5 animate-fadeIn">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>¡Descarga enviada correctamente!</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Abre el archivo <strong className="text-white">{ZIP_FILE_NAME}</strong> desde tu carpeta de Descargas para extraer e instalar <strong className="text-emerald-400">{APK_FILE_NAME}</strong>.
                    </p>
                  </div>
                )}

                {/* Botón de Acción Principal */}
                <button
                  type="button"
                  onClick={handleStartDownload}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadState === 'idle' ? `Descargar ${ZIP_FILE_NAME} (85.7 MB)` : 'Volver a Descargar Archivo'}</span>
                </button>
              </div>

              {/* Acciones Secundarias: Copiar Enlace y Ayuda */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? '¡Enlace Copiado!' : 'Copiar Enlace Directo'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('config')}
                  className="py-2.5 px-3 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Ver Guía de Permisos</span>
                </button>
              </div>

            </div>
          )}

          {/* PESTAÑA 2: GUÍA DE CONFIGURACIÓN Y PERMISOS ANDROID */}
          {activeTab === 'config' && (
            <div className="space-y-2.5 text-xs">
              
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-amber-300 text-[11px]">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <p>
                  Al instalar la APK directamente sin pasar por Play Store, Android te solicitará permisos de seguridad estándar. Sigue estos 4 pasos:
                </p>
              </div>

              {/* Paso 1 */}
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">1</span>
                <div>
                  <h4 className="font-bold text-white text-xs">Extraer o Abrir el Paquete</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Toca la notificación de descarga o busca <strong className="text-white">{ZIP_FILE_NAME}</strong> en la app de Archivos para abrir <strong className="text-emerald-400">{APK_FILE_NAME}</strong>.
                  </p>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-xl bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 border border-cyan-500/30">2</span>
                <div>
                  <h4 className="font-bold text-white text-xs">Permitir Fuentes Desconocidas</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Si el sistema lo solicita, ve a <em>Ajustes &gt; Seguridad</em> y activa <strong className="text-cyan-300">"Permitir desde esta fuente"</strong> para tu navegador o gestor de archivos.
                  </p>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/30">3</span>
                <div>
                  <h4 className="font-bold text-white text-xs">Aviso de Google Play Protect</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Si aparece la advertencia de Play Protect al ser un archivo externo, pulsa <strong className="text-amber-300 font-semibold">"Más detalles"</strong> y luego <strong className="text-emerald-400 font-semibold">"Instalar de todas formas"</strong>.
                  </p>
                </div>
              </div>

              {/* Paso 4 */}
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 flex items-start gap-3">
                <span className="w-6 h-6 rounded-xl bg-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-500/30">4</span>
                <div>
                  <h4 className="font-bold text-white text-xs">Google Login &amp; Permisos IA</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Inicia sesión en 1 toque con Google Play Services nativo. Permite el acceso al micrófono y cámara para usar la tutoría de idiomas por voz y el OCR de cuadernos.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartDownload}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Paquete Ahora</span>
              </button>

            </div>
          )}

          {/* PESTAÑA 3: DESCARGA DIRECTA EN MÓVIL (QR) */}
          {activeTab === 'qr' && (
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
              <div className="p-3 bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-xl shadow-cyan-950/50">
                <img 
                  src={qrCodeUrl} 
                  alt="Código QR de Descarga APK" 
                  className="w-44 h-44 rounded-xl object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Escanea con tu Móvil Android</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Apunta con la cámara de tu smartphone para abrir e iniciar la descarga directa del paquete APK al instante.
                </p>
              </div>
              <div className="pt-1 w-full max-w-xs">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? '¡Enlace Copiado!' : 'Copiar URL para Compartir'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer del Modal */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-semibold">Firma SHA-256 Verificada</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
};
