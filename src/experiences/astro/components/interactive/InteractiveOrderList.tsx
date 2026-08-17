import React, { useState, useEffect } from 'react';
import { GripVertical, ArrowUp, ArrowDown, Check } from 'lucide-react';

interface InteractiveOrderListProps {
  items: string[];
  isSubmitted: boolean;
  correctOrder?: string[];
  userOrder?: string[];
  onOrderChange: (newOrder: string[]) => void;
  onConfirmOrder: (finalOrder: string[]) => void;
}

export const InteractiveOrderList: React.FC<InteractiveOrderListProps> = ({
  items,
  isSubmitted,
  correctOrder,
  userOrder,
  onOrderChange,
  onConfirmOrder
}) => {
  const [currentList, setCurrentList] = useState<string[]>(() => userOrder || [...items]);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (userOrder && userOrder.length === items.length) {
      setCurrentList(userOrder);
    } else {
      setCurrentList([...items]);
    }
  }, [items, userOrder]);

  const handleMove = (fromIdx: number, toIdx: number) => {
    if (isSubmitted || toIdx < 0 || toIdx >= currentList.length) return;
    const nextList = [...currentList];
    const [moved] = nextList.splice(fromIdx, 1);
    nextList.splice(toIdx, 0, moved);
    setCurrentList(nextList);
    onOrderChange(nextList);
  };

  const handleDragStart = (idx: number) => {
    if (isSubmitted) return;
    setDraggedIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx || isSubmitted) return;
    handleMove(draggedIdx, targetIdx);
    setDraggedIdx(targetIdx);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2.5">
        {currentList.map((item, idx) => {
          const isDragging = draggedIdx === idx;
          const isCorrect = isSubmitted && correctOrder && correctOrder[idx] === item;

          return (
            <div
              key={item}
              draggable={!isSubmitted}
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 select-none ${
                isDragging ? 'opacity-50 scale-105 border-cyan-400 bg-slate-900 shadow-2xl' : 'opacity-100'
              } ${
                isSubmitted
                  ? isCorrect
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100 font-bold shadow-md shadow-emerald-950/40'
                    : 'bg-rose-950/70 border-rose-500 text-rose-200 shadow-md shadow-rose-950/40'
                  : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/40 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-mono text-xs font-black shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm font-medium leading-snug">{item}</span>
              </div>

              {!isSubmitted && (
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, idx - 1)}
                    title="Mover arriba"
                    className="min-h-[38px] min-w-[38px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === currentList.length - 1}
                    onClick={() => handleMove(idx, idx + 1)}
                    title="Mover abajo"
                    className="min-h-[38px] min-w-[38px] rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <div className="hidden sm:flex items-center px-1 text-slate-500 cursor-grab">
                    <GripVertical className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isSubmitted && (
        <button
          type="button"
          onClick={() => onConfirmOrder(currentList)}
          className="w-full min-h-[48px] py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-cyan-600/30 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Confirmar Orden Cronológico / Escala</span>
        </button>
      )}
    </div>
  );
};
