/**
 * GOALS 3D Cosmos - MissionBannerHUD
 * Banner Flotante Minimalista de Misión Activa y Objetivos Pedagógicos
 */

import React from 'react';
import { SpaceMission } from '../../../core/3d/missions/MissionsDatabase';
import { Target, CheckCircle2, ChevronRight, Award, Compass, Sparkles } from 'lucide-react';

interface MissionBannerHUDProps {
  mission: SpaceMission;
  currentStepIndex: number;
  isStepCompleted: boolean;
  onGuideMe: () => void;
  onOpenQuiz: () => void;
  onNextMission: () => void;
  isQuizCompleted: boolean;
}

export const MissionBannerHUD: React.FC<MissionBannerHUDProps> = ({
  mission,
  currentStepIndex,
  isStepCompleted,
  onGuideMe,
  onOpenQuiz,
  onNextMission,
  isQuizCompleted
}) => {
  const currentStep = mission.steps[currentStepIndex] || mission.steps[mission.steps.length - 1];

  return (
    <div className="w-full max-w-sm pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="bg-slate-950/85 backdrop-blur-xl border border-cyan-500/30 p-3 sm:p-3.5 rounded-2xl shadow-2xl text-white space-y-2">
        {/* ENCABEZADO DE MISIÓN */}
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">🚀</span>
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cyan-300">
              {mission.badge}
            </span>
          </div>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-bold">
            Paso {currentStepIndex + 1} de {mission.steps.length} • +{mission.totalXp} XP
          </span>
        </div>

        {/* TÍTULO E INSTRUCCIÓN DEL PASO */}
        <div>
          <h3 className="text-xs font-bold text-white leading-snug">{mission.title}</h3>
          <p className="text-[11px] text-cyan-200 mt-0.5 leading-relaxed">
            {currentStep.instruction}
          </p>
        </div>

        {/* BOTÓN DE ACCIÓN / DESAFÍO */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
          <span className="text-[9px] text-slate-400 font-mono line-clamp-1">
            💡 {currentStep.hint}
          </span>

          {isQuizCompleted ? (
            <button
              onClick={onNextMission}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1 shrink-0 transition-all active:scale-95 border border-emerald-400"
            >
              <span>Siguiente Misión</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : isStepCompleted ? (
            <button
              onClick={onOpenQuiz}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-orange-500/30 flex items-center gap-1.5 shrink-0 transition-all active:scale-95 hover:scale-105"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Desafío (+{mission.totalXp} XP)</span>
            </button>
          ) : (
            <button
              onClick={onGuideMe}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 text-[10px] font-bold flex items-center gap-1 shrink-0 transition-all active:scale-95"
            >
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>Guiarme</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
