import React, { useState, useEffect } from 'react';
import { ShieldAlert, Play, RotateCcw, CheckCircle2, Pause, Sparkles } from 'lucide-react';

interface PauseTimerWidgetProps {
  onTimerComplete?: () => void;
  autoStart?: boolean;
}

export const PauseTimerWidget: React.FC<PauseTimerWidgetProps> = ({
  onTimerComplete,
  autoStart = false
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(autoStart);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && !isCompleted) {
      setIsCompleted(true);
      setIsActive(false);
      onTimerComplete?.();
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, isCompleted, onTimerComplete]);

  const handleToggle = () => {
    if (isCompleted) {
      setSecondsLeft(30);
      setIsCompleted(false);
      setIsActive(true);
    } else {
      setIsActive(!isActive);
    }
  };

  const handleReset = () => {
    setSecondsLeft(30);
    setIsActive(false);
    setIsCompleted(false);
  };

  const progressPct = ((30 - secondsLeft) / 30) * 100;

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-teal-500/30 p-4 shadow-xl backdrop-blur-md relative overflow-hidden">
      {/* Resplandor ambiental de respiración */}
      <div 
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl transition-all duration-1000 pointer-events-none ${
          isActive ? 'bg-teal-500/20 scale-125' : isCompleted ? 'bg-emerald-500/20' : 'bg-slate-800/10'
        }`} 
      />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
            isCompleted 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : isActive 
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <ShieldAlert className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-white">
                Método PAUSA · 30 Segundos
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/10 border border-teal-500/30 text-teal-300">
                DESACELERACIÓN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isCompleted 
                ? '¡Excelente! Tu córtex prefrontal ha tomado el control. Ahora puedes analizar con calma.' 
                : isActive 
                  ? 'Respira hondo y reflexiona: ¿quién se beneficia si reenvías esto ahora?' 
                  : 'Detén el impulso de responder o compartir antes de examinar las pruebas.'}
            </p>
          </div>
        </div>

        {/* Contador y Controles */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${isCompleted ? 'text-emerald-400' : 'text-teal-400'} transition-all duration-1000 ease-linear`}
                strokeDasharray={`${progressPct}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-mono text-xs font-black text-white">
              {secondsLeft}s
            </span>
          </div>

          <button
            type="button"
            onClick={handleToggle}
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              isCompleted
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                : isActive
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
            }`}
          >
            {isCompleted ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repetir</span>
              </>
            ) : isActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Iniciar PAUSA</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
