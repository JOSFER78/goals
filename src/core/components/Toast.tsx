import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { Sparkles, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMsg, hideToast } = useProgress();

  if (!toastMsg) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
      <div 
        onClick={hideToast}
        className="bg-slate-900/95 border border-indigo-500/40 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 text-white font-semibold text-xs text-center cursor-pointer hover:border-indigo-400 transition-all active:scale-95 group"
      >
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="truncate max-w-xs">{toastMsg}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            hideToast();
          }}
          className="ml-1 w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
          title="Cerrar notificación"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
