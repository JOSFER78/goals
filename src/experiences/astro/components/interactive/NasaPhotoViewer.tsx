import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw, Satellite, Compass } from 'lucide-react';

interface NasaPhotoViewerProps {
  photoUrl: string;
  caption?: string;
  credit?: string;
  mission?: string;
  title: string;
  onOpen3D?: () => void;
}

export const NasaPhotoViewer: React.FC<NasaPhotoViewerProps> = ({
  photoUrl,
  caption,
  credit,
  mission = 'Misión Oficial NASA / ESA',
  title,
  onOpen3D
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-cyan-500/40 bg-slate-950 shadow-2xl transition-all duration-300 ${
      isFullscreen ? 'fixed inset-4 z-50 flex flex-col justify-between bg-slate-950/95 backdrop-blur-2xl' : 'w-full'
    }`}>
      {/* HEADER SUPERPUESTO */}
      <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-500/40 shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-black tracking-wider text-cyan-300 uppercase">
            Fotografía Real NASA
          </span>
        </div>

        {/* CONTROLES DE ZOOM Y PANTALLA COMPLETA */}
        <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 3}
            title="Acercar (Zoom In)"
            className="p-1.5 rounded-lg hover:bg-cyan-950/80 text-slate-300 hover:text-cyan-300 disabled:opacity-30 transition-all cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono font-bold text-cyan-300 px-1">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            title="Alejar (Zoom Out)"
            className="p-1.5 rounded-lg hover:bg-cyan-950/80 text-slate-300 hover:text-cyan-300 disabled:opacity-30 transition-all cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          {zoomLevel > 1 && (
            <button
              type="button"
              onClick={handleResetZoom}
              title="Restablecer Zoom"
              className="p-1.5 rounded-lg hover:bg-slate-800 text-amber-400 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            className="p-1.5 rounded-lg hover:bg-cyan-950/80 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* CONTENEDOR DE LA IMAGEN CON ZOOM */}
      <div className={`relative w-full overflow-hidden flex items-center justify-center bg-slate-950 ${
        isFullscreen ? 'flex-1 min-h-0' : 'h-64 sm:h-80 md:h-96 lg:h-[420px] xl:h-[480px]'
      }`}>
        <img
          src={photoUrl}
          referrerPolicy="no-referrer"
          alt={title}
          style={{ transform: `scale(${zoomLevel})` }}
          className="w-full h-full object-cover transition-transform duration-300 ease-out select-none"
        />

        {/* OVERLAY DE DEGRADADO INFERIOR PARA LECTURA */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent pointer-events-none" />
      </div>

      {/* FOOTER DE TELEMETRÍA Y CAPTION */}
      <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-white/10 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
            {caption || title}
          </p>
          {onOpen3D && (
            <button
              type="button"
              onClick={onOpen3D}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explorar en Mapa 3D</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-slate-400 font-mono gap-y-1 border-t border-white/5 pt-2">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            <span>{mission}</span>
          </div>
          {credit && <span>Crédito oficial: <strong className="text-slate-300">{credit}</strong></span>}
        </div>
      </div>
    </div>
  );
};
