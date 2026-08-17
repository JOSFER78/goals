/**
 * GOALS 3D Cosmos - CosmosQuickShortcutsModal
 * Modal de Ayuda y Atajos de Teclado y Gestos Táctiles
 */

import React from 'react';
import { X, Keyboard, Smartphone, Compass } from 'lucide-react';

interface CosmosQuickShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CosmosQuickShortcutsModal: React.FC<CosmosQuickShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 pointer-events-auto select-none">
      <div className="max-w-md w-full bg-slate-950/95 border border-cyan-500/40 p-5 rounded-3xl shadow-2xl text-white space-y-4">
        {/* CABECERA */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-base text-white">Guía de Control Espacial</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ATAJOS PC */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Atajos de Teclado (PC)</span>
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Desplazamiento (Pan):</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">Espacio</kbd>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Pausar / Reanudar:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">P</kbd>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Modo Escala 1:1:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">M</kbd>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Modo Zen (Ocultar UI):</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">H</kbd>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Pantalla Completa:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">F</kbd>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Velocidad 1x - 10k:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[10px]">1 - 5</kbd>
            </div>
          </div>
        </div>

        {/* GESTOS TÁCTILES MÓVIL */}
        <div className="space-y-2 pt-1 border-t border-white/10">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Gestos Táctiles (Móvil / Tablet)</span>
          </h4>
          <div className="space-y-1.5 text-xs text-slate-300">
            <p className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
              <span className="text-base">👆</span>
              <span><strong>1 Dedo:</strong> Rota la cámara en 360° alrededor del cuerpo celeste.</span>
            </p>
            <p className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
              <span className="text-base">✌️</span>
              <span><strong>2 Dedos:</strong> Pellizca para Zoom o desliza en paralelo para Desplazarte (Pan).</span>
            </p>
            <p className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 flex items-center gap-2">
              <span className="text-base">🎯</span>
              <span><strong>Tocar Objeto:</strong> Toca cualquier planeta o nave para abrir su ficha científica.</span>
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-all active:scale-95"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
