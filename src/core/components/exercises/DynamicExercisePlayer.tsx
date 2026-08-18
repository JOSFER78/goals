/**
 * src/core/components/exercises/DynamicExercisePlayer.tsx
 * Reproductor de Ejercicios Dinámicos de IA en Tiempo Real
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  DynamicExerciseBatch, 
  DynamicExerciseItem, 
  ChoiceExerciseItem, 
  FillGapExerciseItem, 
  BooleanExerciseItem, 
  NumericCalcExerciseItem,
  ExerciseSessionResult 
} from '../../types/dynamicExercise';
import { useProgress } from '../../context/ProgressContext';
import { LatexMathView } from './LatexMathView';
import { playSuccessChime, playErrorBuzz, triggerCanvasConfetti } from './exerciseFx';
import { 
  Sparkles, Award, Clock, Lightbulb, CheckCircle2, XCircle, 
  ArrowRight, Star, X, Zap
} from 'lucide-react';

interface DynamicExercisePlayerProps {
  batch: DynamicExerciseBatch;
  onFinish?: (result: ExerciseSessionResult) => void;
  onClose?: () => void;
  onGenerateMore?: () => void;
}

export const DynamicExercisePlayer: React.FC<DynamicExercisePlayerProps> = ({
  batch,
  onFinish,
  onClose,
  onGenerateMore
}) => {
  const { addXP, addCustomEvolution, showToast } = useProgress();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, any>>({});
  const [evaluatedItems, setEvaluatedItems] = useState<Record<number, { isCorrect: boolean; attempts: number; usedHint: boolean }>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [gapInputs, setGapInputs] = useState<Record<string, string>>({});
  const [numericInput, setNumericInput] = useState<string>('');

  const currentItem: DynamicExerciseItem = batch.items[currentIndex] || batch.items[0];
  const initialTime = currentItem?.timeLimitSeconds || 60;
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setTimeLeft(currentItem?.timeLimitSeconds || 60);
    setShowHint(false);
    setGapInputs({});
    setNumericInput('');
  }, [currentIndex, currentItem]);

  useEffect(() => {
    if (isCompleted || evaluatedItems[currentIndex]) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentIndex, isCompleted, evaluatedItems]);

  const currentEval = evaluatedItems[currentIndex];
  const isCurrentEvaluated = !!currentEval;

  const handleSelectChoice = (optionIdx: number) => {
    if (isCurrentEvaluated) return;
    const choiceItem = currentItem as ChoiceExerciseItem;
    const isCorrect = optionIdx === choiceItem.correctIndex;
    recordEvaluation(optionIdx, isCorrect);
  };

  const handleSelectBoolean = (val: boolean) => {
    if (isCurrentEvaluated) return;
    const boolItem = currentItem as BooleanExerciseItem;
    const isCorrect = val === boolItem.booleanAnswer;
    recordEvaluation(val, isCorrect);
  };

  const handleCheckGap = () => {
    if (isCurrentEvaluated) return;
    const gapItem = currentItem as FillGapExerciseItem;
    const userGaps = gapItem.correctGaps.map((_, i) => (gapInputs[`gap${i + 1}`] || '').trim().toLowerCase());
    const isCorrect = gapItem.correctGaps.every((sol, i) => sol.trim().toLowerCase() === userGaps[i]);
    recordEvaluation(gapInputs, isCorrect);
  };

  const handleCheckNumeric = () => {
    if (isCurrentEvaluated) return;
    const numItem = currentItem as NumericCalcExerciseItem;
    const val = parseFloat(numericInput.replace(',', '.'));
    const isCorrect = !isNaN(val) && Math.abs(val - numItem.targetValue) <= (numItem.tolerance || 0.01);
    recordEvaluation(val, isCorrect);
  };

  const recordEvaluation = (userAns: any, isCorrect: boolean) => {
    const attempts = (evaluatedItems[currentIndex]?.attempts || 0) + 1;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: userAns }));
    setEvaluatedItems(prev => ({
      ...prev,
      [currentIndex]: { isCorrect, attempts, usedHint: showHint }
    }));

    if (isCorrect) {
      playSuccessChime();
      triggerCanvasConfetti();
    } else {
      playErrorBuzz();
    }
  };

  const handleNext = () => {
    if (currentIndex < batch.items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finalizeSession();
    }
  };

  const finalizeSession = () => {
    setIsCompleted(true);
    let correctCount = 0;
    let earnedXp = 0;

    batch.items.forEach((item, idx) => {
      const ev = evaluatedItems[idx];
      if (ev?.isCorrect) {
        correctCount++;
        const bonus = (!ev.usedHint && ev.attempts === 1) ? 5 : 0;
        earnedXp += item.xpReward + bonus;
      }
    });

    const pct = correctCount / Math.max(1, batch.items.length);
    const starsEarned: 1 | 2 | 3 = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1;

    addXP(earnedXp, batch.discipline, `Batería IA Superada: ${batch.title}`);
    addCustomEvolution({
      type: 'test_completed',
      title: `⭐ Reto Dinámico de IA: ${batch.title} (${starsEarned} ⭐)`,
      xpEarned: earnedXp,
      experienceId: batch.discipline === 'general' ? 'school' : batch.discipline,
      details: `Aciertos: ${correctCount}/${batch.items.length} (${Math.round(pct * 100)}%) • ${batch.topic}`
    });

    showToast(`🎉 ¡${starsEarned === 3 ? '⭐⭐⭐' : starsEarned === 2 ? '⭐⭐' : '⭐'} Reto Dinámico completado! (+${earnedXp} XP)`);

    const result: ExerciseSessionResult = {
      batchId: batch.id,
      totalQuestions: batch.items.length,
      correctAnswers: correctCount,
      scorePercentage: Math.round(pct * 100),
      starsEarned,
      totalXpEarned: earnedXp,
      timeSpentSeconds: 0,
      itemResults: batch.items.map((it, idx) => ({
        itemId: it.id,
        isCorrect: !!evaluatedItems[idx]?.isCorrect,
        userAnswer: selectedAnswers[idx],
        attempts: evaluatedItems[idx]?.attempts || 1,
        usedHint: !!evaluatedItems[idx]?.usedHint
      }))
    };

    onFinish?.(result);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-slate-950/95 border border-cyan-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl text-white font-sans overflow-hidden">
      {/* Fondo Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER DE SESIÓN */}
      <div className="relative flex items-center justify-between border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">{batch.title}</h3>
            <p className="text-xs text-cyan-300/80 font-mono">
              Pregunta {currentIndex + 1} de {batch.items.length} • +{currentItem.xpReward} XP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${
            timeLeft <= 10 ? 'bg-rose-950/50 border-rose-500/40 text-rose-300 animate-pulse' : 'bg-slate-900/80 border-slate-800 text-cyan-300'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* BARRA DE PROGRESO */}
      <div className="relative w-full h-1.5 bg-slate-900 rounded-full overflow-hidden mb-6 border border-slate-800">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / batch.items.length) * 100}%` }}
        />
      </div>

      {/* VISTA RESUMEN FINAL */}
      {isCompleted ? (
        <div className="text-center py-6 space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="inline-flex p-4 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Award className="w-12 h-12 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">¡Desafío Completado con Éxito!</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Has demostrado dominio en <strong className="text-cyan-300">{batch.topic}</strong>. Tu progreso ha sido registrado en tu expediente estelar.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400">Aciertos</span>
              <p className="text-lg font-black text-emerald-400">
                {Object.values(evaluatedItems).filter(v => v.isCorrect).length} / {batch.items.length}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400">XP Ganada</span>
              <p className="text-lg font-black text-cyan-400">
                +{batch.totalXp} XP
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-400">Nivel</span>
              <p className="text-lg font-black text-amber-400 flex items-center justify-center gap-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>LOMLOE</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onGenerateMore && (
              <button
                onClick={onGenerateMore}
                className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Generar Nueva Batería IA</span>
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="py-3 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
              >
                Volver a la Lección
              </button>
            )}
          </div>
        </div>
      ) : (
        /* VISTA DE PREGUNTA ACTIVA */
        <div className="space-y-5">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-cyan-400 bg-cyan-950/50 border border-cyan-500/30 px-2.5 py-1 rounded-lg">
              {currentItem.type === 'choice' ? 'Opción Múltiple' : currentItem.type === 'fill_gap' ? 'Completar Huecos' : currentItem.type === 'boolean' ? 'Verdadero o Falso' : 'Cálculo Numérico'}
            </span>
            <h4 className="text-base sm:text-lg font-bold text-slate-100 leading-snug">
              {currentItem.prompt}
            </h4>
          </div>

          {currentItem.latexFormula && (
            <LatexMathView latex={currentItem.latexFormula} />
          )}

          <div className="space-y-3 pt-1">
            {currentItem.type === 'choice' && (
              <div className="grid grid-cols-1 gap-2.5">
                {(currentItem as ChoiceExerciseItem).options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentIndex] === idx;
                  const isCorrectAnswer = idx === (currentItem as ChoiceExerciseItem).correctIndex;

                  let style = 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 text-slate-200';
                  if (isCurrentEvaluated) {
                    if (isCorrectAnswer) {
                      style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold shadow-lg shadow-emerald-950/50';
                    } else if (isSelected && !currentEval.isCorrect) {
                      style = 'bg-rose-950/60 border-rose-500 text-rose-200 line-through';
                    } else {
                      style = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isCurrentEvaluated}
                      onClick={() => handleSelectChoice(idx)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-xl bg-slate-800/80 flex items-center justify-center font-mono font-bold text-[11px] text-cyan-300 border border-slate-700">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isCurrentEvaluated && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isCurrentEvaluated && isSelected && !currentEval.isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {currentItem.type === 'boolean' && (
              <div className="grid grid-cols-2 gap-3">
                {[true, false].map((val) => {
                  const boolItem = currentItem as BooleanExerciseItem;
                  const label = val ? (boolItem.trueLabel || 'Verdadero') : (boolItem.falseLabel || 'Falso');
                  const isSelected = selectedAnswers[currentIndex] === val;
                  const isCorrect = val === boolItem.booleanAnswer;

                  let style = 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 text-slate-200';
                  if (isCurrentEvaluated) {
                    if (isCorrect) {
                      style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isSelected && !currentEval.isCorrect) {
                      style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                    } else {
                      style = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={String(val)}
                      disabled={isCurrentEvaluated}
                      onClick={() => handleSelectBoolean(val)}
                      className={`p-4 rounded-2xl border text-center font-bold text-sm transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${style}`}
                    >
                      <span className="text-2xl">{val ? '✅' : '❌'}</span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {currentItem.type === 'fill_gap' && (
              <div className="space-y-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div className="text-sm leading-loose text-slate-200">
                  {(currentItem as FillGapExerciseItem).templateSentence.split(/(\{gap\d+\})/).map((chunk, i) => {
                    const match = chunk.match(/\{gap(\d+)\}/);
                    if (match) {
                      const gapKey = `gap${match[1]}`;
                      return (
                        <input
                          key={i}
                          type="text"
                          disabled={isCurrentEvaluated}
                          value={gapInputs[gapKey] || ''}
                          onChange={(e) => setGapInputs({ ...gapInputs, [gapKey]: e.target.value })}
                          placeholder="[escribe aquí]"
                          className="inline-block mx-1.5 px-3 py-1 bg-slate-950 border border-cyan-500/40 rounded-xl text-cyan-300 font-bold text-xs focus:outline-none focus:border-cyan-400 text-center w-36"
                        />
                      );
                    }
                    return <span key={i}>{chunk}</span>;
                  })}
                </div>

                {(currentItem as FillGapExerciseItem).gapOptions && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-mono text-slate-400">Banco de palabras:</span>
                    {(currentItem as FillGapExerciseItem).gapOptions.map((word, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 text-xs font-mono border border-slate-700 select-all"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                )}

                {!isCurrentEvaluated && (
                  <button
                    onClick={handleCheckGap}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    Comprobar Solución
                  </button>
                )}
              </div>
            )}

            {currentItem.type === 'numeric_calc' && (
              <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="any"
                    disabled={isCurrentEvaluated}
                    value={numericInput}
                    onChange={(e) => setNumericInput(e.target.value)}
                    placeholder="Introduce el valor numérico..."
                    className="flex-1 px-4 py-2.5 bg-slate-950 border border-cyan-500/40 rounded-xl text-cyan-200 font-mono text-sm focus:outline-none focus:border-cyan-400"
                  />
                  {(currentItem as NumericCalcExerciseItem).unit && (
                    <span className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs font-bold border border-slate-700">
                      {(currentItem as NumericCalcExerciseItem).unit}
                    </span>
                  )}
                </div>

                {!isCurrentEvaluated && (
                  <button
                    onClick={handleCheckNumeric}
                    disabled={!numericInput.trim()}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    Validar Cálculo
                  </button>
                )}
              </div>
            )}
          </div>

          {!isCurrentEvaluated && currentItem.hint && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowHint(prev => !prev)}
                className="flex items-center gap-1.5 text-xs text-amber-400/90 hover:text-amber-300 font-bold transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Ocultar Pista Didáctica' : '¿Necesitas una pista?'}</span>
              </button>
              {showHint && (
                <div className="mt-2 p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs leading-relaxed animate-in fade-in duration-200">
                  {currentItem.hint}
                </div>
              )}
            </div>
          )}

          {isCurrentEvaluated && (
            <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-in slide-in-from-bottom-2 duration-300 ${
              currentEval.isCorrect 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {currentEval.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>¡Excelente deducción! (+{currentItem.xpReward} XP)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>No es del todo exacto. Fíjate en la fundamentación:</span>
                  </>
                )}
              </div>

              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                {currentItem.explanation}
              </p>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                >
                  <span>{currentIndex < batch.items.length - 1 ? 'Siguiente Pregunta' : 'Finalizar y Guardar XP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
