/**
 * GOALS 3D Cosmos - ExplorerModeSelector
 * Selector de 3 modos de exploración: [ 🎯 Retos ] [ ℹ️ Info ] [ 🎓 Didáctica ]
 */

import React from 'react';
import { Target, Info, GraduationCap } from 'lucide-react';

export type ExplorerMode = 'retos' | 'info' | 'didactica';

interface ExplorerModeSelectorProps {
  activeMode: ExplorerMode;
  onSelectMode: (mode: ExplorerMode) => void;
}

export const ExplorerModeSelector: React.FC<ExplorerModeSelectorProps> = ({
  activeMode,
  onSelectMode
}) => {
  const modes: { id: ExplorerMode; label: string; icon: any; color: string }[] = [
    { id: 'retos', label: 'Retos', icon: Target, color: 'text-amber-400' },
    { id: 'info', label: 'Info & Vuelos', icon: Info, color: 'text-cyan-400' },
    { id: 'didactica', label: 'Didáctica', icon: GraduationCap, color: 'text-indigo-400' }
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-slate-950/85 backdrop-blur-xl border border-white/15 shadow-2xl pointer-events-auto">
      {modes.map((m) => {
        const Icon = m.icon;
        const isSelected = activeMode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onSelectMode(m.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              isSelected
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : m.color}`} />
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};
