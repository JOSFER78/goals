/**
 * GOALS 3D Cosmos - MiniScenePager
 * Paginador ultra-minimalista de 12 saltos cósmicos (26px)
 */

import React from 'react';
import { COSMOS_SCENES } from '../../scenes';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MiniScenePagerProps {
  currentSceneIdx: number;
  onSelectScene: (idx: number) => void;
}

export const MiniScenePager: React.FC<MiniScenePagerProps> = ({
  currentSceneIdx,
  onSelectScene
}) => {
  return (
    <div className="flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 shadow-lg text-[10px] font-mono mx-auto max-w-sm">
      
      {/* BOTÓN ANTERIOR */}
      <button
        onClick={() => onSelectScene(Math.max(0, currentSceneIdx - 1))}
        disabled={currentSceneIdx === 0}
        className="p-0.5 rounded-full text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
        title="Escena Anterior"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* 12 PUNTOS DE SALTO */}
      <div className="flex items-center gap-1">
        {COSMOS_SCENES.map((sc, idx) => (
          <button
            key={sc.id}
            onClick={() => onSelectScene(idx)}
            className={`transition-all cursor-pointer rounded-full ${
              currentSceneIdx === idx
                ? 'w-4 h-1.5 bg-cyan-400 shadow-sm shadow-cyan-400/80'
                : 'w-1.5 h-1.5 bg-slate-700 hover:bg-slate-400'
            }`}
            title={`${sc.id}. ${sc.name}`}
          />
        ))}
      </div>

      {/* BOTÓN SIGUIENTE */}
      <button
        onClick={() => onSelectScene(Math.min(COSMOS_SCENES.length - 1, currentSceneIdx + 1))}
        disabled={currentSceneIdx === COSMOS_SCENES.length - 1}
        className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold hover:bg-cyan-500/30 disabled:opacity-20 transition-all cursor-pointer"
        title="Siguiente Escena"
      >
        <span>Saltar</span>
        <ChevronRight className="w-3 h-3" />
      </button>

    </div>
  );
};
