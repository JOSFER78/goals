import React, { useState } from 'react';
import { 
  Target, Award, ShieldAlert, CheckCircle2, ChevronRight, RotateCcw, 
  Sparkles, Zap, ArrowRight, ExternalLink, HelpCircle, Filter
} from 'lucide-react';
import { CRITERIO_MISSIONS } from '../data/missionsData';
import { CriterioMission } from '../types';
import { PauseTimerWidget } from './PauseTimerWidget';

interface TrainingMissionsModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAddXP?: (amount: number, reason: string) => void;
  initialCategory?: string;
}

export const TrainingMissionsModal: React.FC<TrainingMissionsModalProps> = ({
  isOpen,
  onClose,
  onAddXP,
  initialCategory
}) => {
  if (isOpen === false) return null;
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [currentMissionIndex, setCurrentMissionIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const filteredMissions = selectedCategory === 'all'
    ? CRITERIO_MISSIONS
    : CRITERIO_MISSIONS.filter((m) => m.category === selectedCategory);

  const mission: CriterioMission = filteredMissions[currentMissionIndex] || filteredMissions[0];

  const handleSelectOption = (option: any) => {
    if (hasAnswered) return;
    setSelectedOptionId(option.id);
    setHasAnswered(true);
    if (option.quality === 'nuanced_correct') {
      setScore((prev) => prev + 100);
      onAddXP?.(25, `Misión completada con Criterio: ${mission.title}`);
    } else {
      setScore((prev) => prev + option.criterioScore);
      onAddXP?.(10, `Intento formativo en Misión: ${mission.title}`);
    }
  };

  const handleNextMission = () => {
    if (currentMissionIndex < filteredMissions.length - 1) {
      setCurrentMissionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentMissionIndex(0);
    setSelectedOptionId(null);
    setHasAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  const CATEGORIES = [
    { id: 'all', label: 'Todas' },
    { id: 'colegio', label: 'Colegio & Grupos' },
    { id: 'sorteos', label: 'Sorteos & Phishing' },
    { id: 'redes', label: 'Redes & Virales' },
    { id: 'ciencia', label: 'Ciencia & Espacio' },
    { id: 'ia_deepfakes', label: 'IA & Deepfakes' }
  ];

  return (
    <div className="w-full space-y-5 animate-fadeIn font-display">
      
      {/* Cabecera de Misiones */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-amber-500/30 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Target className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg sm:text-xl text-white">
                Misiones de Campo Gamificadas
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                60 ESCENARIOS COTIDIANOS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Enfréntate a situaciones de la vida digital, activa el método PAUSA y elige la respuesta con más Criterio.
            </p>
          </div>
        </div>

        {/* Selector de Categorías */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                handleRestart();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {!isFinished ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Columna Izquierda: Situación Narrativa & Método PAUSA (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Widget PAUSA */}
            <PauseTimerWidget />

            {/* Tarjeta de la Situación */}
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold uppercase">
                  MISIÓN {currentMissionIndex + 1} DE {filteredMissions.length}
                </span>
                <span className="text-slate-400">
                  {mission.category.toUpperCase()}
                </span>
              </div>

              <h3 className="font-extrabold text-base sm:text-lg text-white">
                {mission.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {mission.situation}
              </p>

              {/* Contenido Visual / Mensaje Clave */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{mission.authorHandle || '@origen_mensaje'}</span>
                  <span>{mission.authorBadge || 'Mensaje Reenviado'}</span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-amber-200 italic">
                  {mission.initialClaim}
                </p>
              </div>

              {mission.emotionalHook && (
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 text-xs text-rose-300">
                  <strong>Gancho emocional:</strong> {mission.emotionalHook}
                </div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Opciones y Feedback Formativo (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-3.5">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>¿Cómo actuarías ante esta situación?</span>
              </h4>

              <div className="space-y-2.5">
                {mission.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      disabled={hasAnswered}
                      className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex flex-col gap-2 cursor-pointer ${
                        isSelected
                          ? opt.quality === 'nuanced_correct'
                            ? 'bg-emerald-950/70 border-emerald-500 text-emerald-100 shadow-md'
                            : 'bg-amber-950/70 border-amber-500 text-amber-100'
                          : hasAnswered && opt.quality === 'nuanced_correct'
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.text}</span>
                        {hasAnswered && opt.quality === 'nuanced_correct' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                      </div>

                      {isSelected && (
                        <div className="text-xs pt-2 border-t border-slate-800 font-normal leading-relaxed">
                          {opt.feedback}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Revelación de Evidencia y Explicación del Truco */}
              {hasAnswered && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-2 animate-fadeIn">
                  <div className="text-xs font-bold text-amber-400 font-mono">
                    💡 ¿DÓNDE ESTABA EL TRUCO?
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {mission.trickExplanation}
                  </p>
                  <p className="text-xs text-emerald-300">
                    <strong>Evidencia real:</strong> {mission.revealedEvidence}
                  </p>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextMission}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                    >
                      <span>{currentMissionIndex < filteredMissions.length - 1 ? 'Siguiente Misión' : 'Ver Puntuación Final'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* Pantalla de Fin de Ronda */
        <div className="p-8 rounded-3xl bg-slate-950 border border-emerald-500/40 text-center space-y-4 max-w-xl mx-auto shadow-2xl animate-fadeIn">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <Award className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-white">
            ¡Ronda de Misiones Completada!
          </h3>

          <p className="text-sm text-slate-300">
            Has demostrado solidez y pensamiento crítico ante situaciones cotidianas de desinformación e impulso.
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-sm text-amber-400 font-bold">
            Puntuación de Criterio Acumulada: +{score} Puntos
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 mx-auto shadow-lg shadow-amber-500/25 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jugar Otra Ronda</span>
          </button>
        </div>
      )}

    </div>
  );
};
