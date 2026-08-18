/**
 * src/core/components/mascot/SpatialGuidingBubble.tsx
 * Bocadillo de Guía Orientado al Elemento Anclado
 */

import React, { useState, useEffect } from 'react';
import { X, ChevronRight, Compass } from 'lucide-react';
import { SpatialAnchorPosition } from '../../types/mascotSpatial';
import { ActionChip } from '../../types/mascotFSM';

interface SpatialGuidingBubbleProps {
  text: string;
  mascotPos: { x: number; y: number };
  mascotScale?: number;
  mascotName?: string;
  anchorPosition?: SpatialAnchorPosition;
  onActionClick?: (prompt: string) => void;
  onClose?: () => void;
  actionChips?: ActionChip[];
}

export const SpatialGuidingBubble: React.FC<SpatialGuidingBubbleProps> = ({
  text,
  mascotPos,
  mascotScale = 1.2,
  mascotName = 'Sparky',
  onActionClick,
  onClose,
  actionChips = [
    { id: '1', label: '🚀 Empezar', prompt: 'Comenzar actividad guiada' },
    { id: '2', label: '⚓ Volver al dock', prompt: 'Vuelve a tu sitio' }
  ]
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const bubbleWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 320) : 320;
  const mascotW = 64 * mascotScale;

  useEffect(() => {
    let i = 0;
    setDisplayedText('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 20);
    return () => clearInterval(timer);
  }, [text]);

  const isLeft = mascotPos.x < (typeof window !== 'undefined' ? window.innerWidth / 2 : 600);
  let bubbleLeft = isLeft ? mascotPos.x + mascotW + 12 : mascotPos.x - bubbleWidth - 12;
  let bubbleTop = Math.max(16, mascotPos.y - 40);

  bubbleLeft = Math.max(12, Math.min(bubbleLeft, (typeof window !== 'undefined' ? window.innerWidth : 1200) - bubbleWidth - 12));

  return (
    <div
      style={{
        position: 'fixed',
        left: `${bubbleLeft}px`,
        top: `${bubbleTop}px`,
        width: `${bubbleWidth}px`,
        zIndex: 55
      }}
      className="bg-slate-950/95 border border-sky-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 select-none font-sans"
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[10px] text-sky-400 font-bold tracking-wide uppercase">
        <span className="flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
          <span>GUÍA AGÉNTICA // {mascotName}</span>
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Cerrar guía"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <p className="text-xs text-slate-100 leading-relaxed font-medium">
        {displayedText}
      </p>

      {actionChips.length > 0 && onActionClick && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap gap-1.5">
          {actionChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => onActionClick(chip.prompt)}
              className="px-2.5 py-1.5 rounded-xl bg-sky-950/70 hover:bg-sky-900 border border-sky-500/30 text-[11px] font-bold text-sky-200 hover:text-white transition-all transform active:scale-95 flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>{chip.label}</span>
              <ChevronRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
