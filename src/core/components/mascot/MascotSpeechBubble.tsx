import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, ChevronRight, Pencil } from 'lucide-react';
import { ActionChip } from '../../types/mascotFSM';

interface MascotSpeechBubbleProps {
  text: string;
  mascotPos: { x?: number; y?: number };
  mascotScale?: number;
  mascotName?: string;
  primaryColor?: string;
  onActionClick?: (prompt: string) => void;
  onExpandChat?: () => void;
  onOpenDrawingPad?: () => void;
  onClose?: () => void;
  actionChips?: ActionChip[];
}

export const MascotSpeechBubble: React.FC<MascotSpeechBubbleProps> = ({
  text,
  mascotPos,
  mascotScale = 1.2,
  mascotName = 'Sparky',
  primaryColor: _primaryColor = '#F97316',
  onActionClick,
  onExpandChat,
  onOpenDrawingPad,
  onClose,
  actionChips = [
    { id: '1', label: '💡 Explícamelo fácil', prompt: 'Explícamelo con un ejemplo sencillo y didáctico.' },
    { id: '2', label: '✨ ¿Sabías qué?', prompt: 'Cuéntame un dato curioso sobre lo que estamos viendo.' },
    { id: '3', label: '✍️ Pizarra / Dibujo', prompt: '__OPEN_DRAWING_PAD__' }
  ]
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [_isPaused, setIsPaused] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsTyping(true);

    let timeoutId: any = null;

    const typeNextChar = () => {
      if (index < text.length) {
        const char = text.charAt(index);
        setDisplayedText((prev) => prev + char);
        index++;

        let delay = 20;
        if (['.', '!', '?', ':'].includes(char)) {
          delay = 140;
        } else if ([',', ';'].includes(char)) {
          delay = 70;
        }

        timeoutId = setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
      }
    };

    typeNextChar();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text]);

  const bubbleWidth = typeof window !== 'undefined' ? Math.min(window.innerWidth - 32, 310) : 310;
  const mascotWidth = 64 * mascotScale;
  const mascotHeight = 64 * mascotScale;

  const currentX = mascotPos.x !== undefined ? mascotPos.x : (typeof window !== 'undefined' ? window.innerWidth - mascotWidth - 24 : 800);
  const currentY = mascotPos.y !== undefined ? mascotPos.y : (typeof window !== 'undefined' ? window.innerHeight - mascotHeight - 24 : 600);

  const windowW = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const isTopSpaceEnough = currentY > 210;

  let bubbleLeft = currentX + mascotWidth / 2 - bubbleWidth / 2;
  bubbleLeft = Math.max(16, Math.min(bubbleLeft, windowW - bubbleWidth - 16));

  const bubbleTop = isTopSpaceEnough
    ? currentY - 170
    : currentY + mascotHeight + 14;

  const tailX = Math.max(20, Math.min(currentX + mascotWidth / 2 - bubbleLeft, bubbleWidth - 20));

  const handleBubbleClick = () => {
    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
    } else if (onOpenDrawingPad) {
      onOpenDrawingPad();
    } else if (onExpandChat) {
      onExpandChat();
    }
  };

  return (
    <div
      ref={bubbleRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'fixed',
        left: `${bubbleLeft}px`,
        top: `${bubbleTop}px`,
        width: `${bubbleWidth}px`,
        zIndex: 55
      }}
      className="bg-slate-950/95 border border-indigo-500/40 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 select-none cursor-pointer group font-sans"
      onClick={handleBubbleClick}
    >
      <svg
        className={`absolute left-0 w-full h-3 overflow-visible pointer-events-none ${
          isTopSpaceEnough ? '-bottom-3' : '-top-3 rotate-180'
        }`}
      >
        <polygon
          points={`${tailX - 7},0 ${tailX},9 ${tailX + 7},0`}
          fill="#020617"
          stroke="#6366f1"
          strokeWidth="1.5"
        />
      </svg>

      {/* Cabecera del Bocadillo */}
      <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/80 text-[10px] text-indigo-400 font-bold tracking-wide uppercase">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{mascotName}</span>
        </span>
        <div className="flex items-center gap-1">
          {onOpenDrawingPad && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDrawingPad();
              }}
              className="p-1 rounded-md hover:bg-indigo-900/60 text-indigo-300 hover:text-white transition-colors cursor-pointer"
              title="Abrir Pizarra de Dibujo y Apuntes"
            >
              <Pencil className="w-3 h-3 text-amber-400" />
            </button>
          )}
          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Cerrar bocadillo"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Texto Máquina de Escribir */}
      <p className="text-xs text-slate-200 leading-relaxed font-medium">
        {displayedText}
        {isTyping && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-amber-400 animate-pulse align-middle" />}
      </p>

      {/* Chips Rápidos */}
      {!isTyping && actionChips.length > 0 && onActionClick && (
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
          {actionChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => {
                if (chip.prompt === '__OPEN_DRAWING_PAD__' && onOpenDrawingPad) {
                  onOpenDrawingPad();
                } else {
                  onActionClick(chip.prompt);
                }
              }}
              className="px-2 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-[10px] font-semibold text-indigo-200 hover:text-white transition-all transform active:scale-95 flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <span>{chip.label}</span>
              <ChevronRight className="w-2.5 h-2.5 opacity-60" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
