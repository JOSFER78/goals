/**
 * GOALS 3D Cosmos - TopFloatingBar
 * Micro-barra superior translúcida ultra-compacta (38px de alto)
 * Inspirada en Apple Maps 3D y Sky Guide.
 */

import React, { useState } from 'react';
import { COSMOS_SCENES, CosmosSceneModule } from '../../scenes';
import { ScaleMode } from '../../../../core/3d/math/AstroCoordinates';
import { ChevronDown, Eye, EyeOff, Maximize, Minimize, Sparkles, Clock, Compass } from 'lucide-react';

interface TopFloatingBarProps {
  currentSceneIdx: number;
  onSelectScene: (idx: number) => void;
  scaleMode: ScaleMode;
  onToggleScale: (mode: ScaleMode) => void;
  timeScale: number;
  onSetTimeScale: (scale: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  isZenMode: boolean;
  onToggleZenMode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const TopFloatingBar: React.FC<TopFloatingBarProps> = ({
  currentSceneIdx,
  onSelectScene,
  scaleMode,
  onToggleScale,
  timeScale,
  onSetTimeScale,
  isPaused,
  onTogglePause,
  isZenMode,
  onToggleZenMode,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [isSceneMenuOpen, setIsSceneMenuOpen] = useState<boolean>(false);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState<boolean>(false);

  const activeScene: CosmosSceneModule = COSMOS_SCENES[currentSceneIdx] || COSMOS_SCENES[0];
  const speeds = [1, 10, 100, 1000, 10000];

  return (
    <div className="absolute top-3 inset-x-3 z-30 pointer-events-none flex items-center justify-between gap-2">
      
      {/* IZQUIERDA: PÍLDORA SELECTORA DE ESCENA */}
      <div className="relative pointer-events-auto">
        <button
          onClick={() => {
            setIsSceneMenuOpen(!isSceneMenuOpen);
            setIsSpeedMenuOpen(false);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/15 text-white shadow-xl hover:border-cyan-400/60 active:scale-95 transition-all cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-[11px] font-mono font-extrabold text-cyan-300">
            {activeScene.id}/12
          </span>
          <span className="text-xs font-bold text-slate-100 max-w-[120px] sm:max-w-[180px] truncate">
            {activeScene.name}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* MENÚ DESPLEGABLE DE 12 ESCENAS */}
        {isSceneMenuOpen && (
          <div className="absolute top-10 left-0 w-64 max-h-72 overflow-y-auto bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-1.5 shadow-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150 scrollbar-thin">
            <div className="px-2.5 py-1 text-[10px] font-mono font-extrabold uppercase text-slate-400 border-b border-white/10 flex items-center justify-between">
              <span>12 Saltos Astronómicos</span>
              <Sparkles className="w-3 h-3 text-cyan-400" />
            </div>
            {COSMOS_SCENES.map((sc, idx) => (
              <button
                key={sc.id}
                onClick={() => {
                  onSelectScene(idx);
                  setIsSceneMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                  currentSceneIdx === idx
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono text-[10px] text-slate-400">{sc.id}.</span>
                  <span className="truncate">{sc.name}</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 shrink-0 ml-1">{sc.badge}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DERECHA: VELOCIDAD, ESCALA Y ZEN */}
      <div className="relative pointer-events-auto flex items-center gap-1.5">
        
        {/* SELECTOR DE VELOCIDAD COLAPSADO */}
        <div className="relative">
          <button
            onClick={() => {
              setIsSpeedMenuOpen(!isSpeedMenuOpen);
              setIsSceneMenuOpen(false);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/15 text-slate-200 text-xs font-mono font-bold shadow-xl hover:text-white active:scale-95 transition-all cursor-pointer"
            title="Aceleración Temporal"
          >
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{isPaused ? 'Pausa' : `${timeScale}x`}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isSpeedMenuOpen && (
            <div className="absolute top-10 right-0 w-32 bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-1.5 shadow-2xl space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  onTogglePause();
                  setIsSpeedMenuOpen(false);
                }}
                className="w-full text-left px-2 py-1 rounded-lg text-xs font-mono text-amber-300 hover:bg-white/10 font-bold"
              >
                {isPaused ? '▶ Reanudar' : '⏸ Pausar'}
              </button>
              {speeds.map(s => (
                <button
                  key={s}
                  onClick={() => {
                    onSetTimeScale(s);
                    setIsSpeedMenuOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                    timeScale === s && !isPaused
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TOGGLE ESCALA 1:1 */}
        <button
          onClick={() => onToggleScale(scaleMode === 'didactic' ? 'scientific' : 'didactic')}
          className={`px-2 py-1.5 rounded-full text-xs font-mono font-bold border shadow-xl active:scale-95 transition-all cursor-pointer ${
            scaleMode === 'scientific'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-950/80 text-slate-300 border-white/15 hover:text-white'
          }`}
          title="Alternar Escala 1:1 vs Didáctica"
        >
          {scaleMode === 'scientific' ? '🔬 1:1' : '🎓 Didáct.'}
        </button>

        {/* MODO ZEN (OCULTAR / MOSTRAR HUD) */}
        <button
          onClick={onToggleZenMode}
          className={`p-1.5 rounded-full border shadow-xl active:scale-95 transition-all cursor-pointer ${
            isZenMode
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-950/80 text-slate-300 border-white/15 hover:text-white'
          }`}
          title="Modo Zen (Ocultar Todo)"
        >
          {isZenMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
      </div>

    </div>
  );
};
