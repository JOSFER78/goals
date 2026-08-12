import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMsg } = useProgress();

  if (!toastMsg) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-slate-900/95 border border-indigo-500/40 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 text-white font-semibold text-xs text-center">
        <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
        <span>{toastMsg}</span>
      </div>
    </div>
  );
};
