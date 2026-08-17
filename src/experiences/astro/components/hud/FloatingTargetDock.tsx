/**
 * GOALS 3D Cosmos - FloatingTargetDock
 * Dock flotante inferior translúcido para enfoque de satélites y planetas (44px)
 */

import React from 'react';
import { BookOpen, Compass } from 'lucide-react';

interface FloatingTargetDockProps {
  currentTargetKey: string;
  onFocusTarget: (key: string) => void;
  onOpenDrawer: (key: string) => void;
}

const TARGETS = [
  { key: 'earth', name: 'Tierra', icon: '🌍', border: 'hover:border-cyan-400' },
  { key: 'iss', name: 'ISS (5m)', icon: '🛰️', border: 'hover:border-emerald-400' },
  { key: 'hubble', name: 'Hubble', icon: '🔭', border: 'hover:border-indigo-400' },
  { key: 'landsat', name: 'Landsat', icon: '📡', border: 'hover:border-amber-400' },
  { key: 'moon', name: 'Luna', icon: '🌕', border: 'hover:border-slate-300' },
  { key: 'jwst', name: 'JWST L2', icon: '🌌', border: 'hover:border-rose-400' }
];

export const FloatingTargetDock: React.FC<FloatingTargetDockProps> = ({
  currentTargetKey,
  onFocusTarget,
  onOpenDrawer
}) => {
  return (
    <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-1.5 p-1 rounded-full bg-slate-950/85 backdrop-blur-xl border border-white/15 shadow-2xl">
      
      {/* CARRUSEL DE OBJETIVOS CON MOMENTUM SCROLL */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 px-1">
        {TARGETS.map(t => {
          const isSelected = currentTargetKey === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onFocusTarget(t.key)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                  : `bg-slate-900/80 text-slate-300 border border-slate-800/80 ${t.border} hover:text-white`
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* BOTÓN DE FICHA TELEMÉTRICA / DETALLE */}
      <button
        onClick={() => onOpenDrawer(currentTargetKey)}
        className="flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-extrabold shadow active:scale-95 transition-all cursor-pointer shrink-0"
        title="Abrir Ficha Técnica y Telemetría"
      >
        <BookOpen className="w-3 h-3 text-cyan-400" />
        <span className="hidden xs:inline">Ficha</span>
      </button>

    </div>
  );
};
