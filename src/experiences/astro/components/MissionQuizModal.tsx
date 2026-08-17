/**
 * GOALS 3D Cosmos - MissionQuizModal
 * Modal de Evaluación Formativa y Desafío Astrofísico con Recompensa de XP
 */

import React, { useState } from 'react';
import { SpaceMission } from '../../../core/3d/missions/MissionsDatabase';
import { useProgress } from '../../../core/context/ProgressContext';
import { Award, CheckCircle2, XCircle, Sparkles, X, ChevronRight } from 'lucide-react';

interface MissionQuizModalProps {
  mission: SpaceMission | null;
  onClose: () => void;
  onSuccess: (missionId: string, xpEarned: number) => void;
}

export const MissionQuizModal: React.FC<MissionQuizModalProps> = ({
  mission,
  onClose,
  onSuccess
}) => {
  const { claimReto, addXP } = useProgress();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  if (!mission) return null;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedIndex(idx);
    setIsAnswered(true);
    const correct = idx === mission.quiz.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      // Registrar recompensa en ProgressContext de GOALS sin interferir con los exámenes teóricos
      claimReto(`astro_mission_${mission.id}`, mission.quiz.xpReward);
      addXP(mission.quiz.xpReward, 'astro', `Misión 3D: ${mission.title}`);
    }
  };

  const handleClaimAndContinue = () => {
    onSuccess(mission.id, mission.quiz.xpReward);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 pointer-events-auto">
      <div className="max-w-lg w-full bg-slate-950/95 border border-cyan-500/40 p-5 sm:p-6 rounded-3xl shadow-2xl space-y-4 text-white">
        {/* CABECERA DEL DESAFÍO */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <div>
              <h3 className="font-extrabold text-base text-white">{mission.badge}</h3>
              <p className="text-xs text-cyan-300 font-mono">Desafío Astrofísico • +{mission.quiz.xpReward} XP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PREGUNTA */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Pregunta de Verificación:
          </span>
          <h4 className="text-sm font-bold text-slate-100 leading-relaxed">
            {mission.quiz.question}
          </h4>
        </div>

        {/* OPCIONES DE RESPUESTA */}
        <div className="space-y-2">
          {mission.quiz.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-900/90 border-slate-800 hover:border-cyan-500/40 text-slate-200';
            
            if (isAnswered) {
              if (idx === mission.quiz.correctIndex) {
                btnStyle = 'bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold';
              } else if (idx === selectedIndex) {
                btnStyle = 'bg-rose-600/30 border-rose-500 text-rose-200 line-through';
              } else {
                btnStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && idx === mission.quiz.correctIndex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {isAnswered && idx === selectedIndex && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* EXPLICACIÓN PEDAGÓGICA Y RECOMPENSA */}
        {isAnswered && (
          <div className={`p-3.5 rounded-2xl border text-xs space-y-2 animate-in slide-in-from-bottom-2 duration-300 ${
            isCorrect 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
              : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          }`}>
            <div className="flex items-center gap-1.5 font-bold">
              {isCorrect ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>¡Excelente deducción astrofísica! (+{mission.quiz.xpReward} XP)</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Respuesta incorrecta. Revisa el fundamento científico:</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
              {mission.quiz.explanation}
            </p>

            <div className="pt-2 flex justify-end">
              {isCorrect ? (
                <button
                  onClick={handleClaimAndContinue}
                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>Reclamar Recompensa y Continuar</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAnswered(false);
                    setSelectedIndex(null);
                  }}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
                >
                  Intentar de Nuevo
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
