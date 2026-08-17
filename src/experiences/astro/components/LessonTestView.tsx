/**
 * GOALS 3D Cosmos - LessonTestView
 * Bloque 3: Test & Reto de Conocimiento Interactivo con Recompensas de XP,
 * Estrellas (0-3 ⭐), soporte para fotos de examen, minijuego de ordenación y soporte dual para CurriculumUnit / Lesson.
 */

import React, { useState } from 'react';
import { Lesson, Question, ChoiceQuestion, OrderQuestion } from '../types';
import { CurriculumUnit } from '../../../core/types/adaptiveCurriculum';
import { useProgress } from '../../../core/context/ProgressContext';
import { Award, CheckCircle2, XCircle, Star, ArrowRight, RotateCcw, Rocket, Lightbulb, BookOpen } from 'lucide-react';
import { InteractiveOrderList } from './interactive/InteractiveOrderList';

interface LessonTestViewProps {
  lesson?: Lesson;
  unit?: CurriculumUnit;
  onFinishTest: (score: number, total: number) => void;
  onGoToNextLesson: () => void;
  onGoTo3D: () => void;
  onGoToCatalog?: () => void;
}

export const LessonTestView: React.FC<LessonTestViewProps> = ({
  lesson,
  unit,
  onFinishTest,
  onGoToNextLesson,
  onGoTo3D,
  onGoToCatalog
}) => {
  const { finishTest, addXP } = useProgress();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Normalizar título
  const title = unit?.title || lesson?.title || 'Evaluación Espacial';
  const unitIdOrNum = unit?.canonicalNumber || lesson?.id || 1;

  // Normalizar preguntas
  const normalizedQuestions: Question[] = unit?.test?.questions?.map(q => {
    if (q.type === 'order') {
      const orderQ: OrderQuestion = {
        type: 'order',
        question: q.prompt,
        items: q.orderItems?.map(i => i.label) || [],
        correctOrder: q.correctOrder || [],
        explanation: q.explanation,
        xp: q.xp
      };
      return orderQ;
    }
    const choiceQ: ChoiceQuestion = {
      type: 'choice',
      question: q.prompt,
      options: q.options || [],
      answer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
      explanation: q.explanation,
      xp: q.xp
    };
    return choiceQ;
  }) || lesson?.test || [];

  const totalQuestions = Math.max(1, normalizedQuestions.length);
  const currentQ = normalizedQuestions[currentQuestionIdx] || normalizedQuestions[0];

  const handleSelectChoice = (optionIdx: number) => {
    if (userAnswers[currentQuestionIdx] !== undefined) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: optionIdx }));
  };

  const handleConfirmOrder = (finalOrder: string[]) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: finalOrder }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < normalizedQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Cálculo del score final
      let totalCorrect = 0;
      normalizedQuestions.forEach((q, idx) => {
        const ans = userAnswers[idx];
        if (q.type === 'choice' && ans === (q as ChoiceQuestion).answer) {
          totalCorrect++;
        } else if (q.type === 'order' && JSON.stringify(ans) === JSON.stringify((q as OrderQuestion).correctOrder)) {
          totalCorrect++;
        }
      });

      setScore(totalCorrect);
      setIsSubmitted(true);

      const xpEarned = totalCorrect * 25 + 25;
      if (lesson?.id) {
        finishTest(lesson.id, totalCorrect, totalQuestions);
      }
      addXP(xpEarned, 'astro', `Evaluación Superada: ${title}`);
      onFinishTest(totalCorrect, totalQuestions);
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setCurrentQuestionIdx(0);
    setIsSubmitted(false);
    setScore(0);
  };

  const isCurrentAnswered = userAnswers[currentQuestionIdx] !== undefined;
  const isChoice = currentQ && currentQ.type === 'choice';
  const choiceQ = currentQ as ChoiceQuestion;
  const orderQ = currentQ as OrderQuestion;

  const isCurrentCorrect = isChoice
    ? userAnswers[currentQuestionIdx] === choiceQ?.answer
    : isCurrentAnswered && JSON.stringify(userAnswers[currentQuestionIdx]) === JSON.stringify(orderQ?.correctOrder);

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 text-white animate-in fade-in duration-300 pb-12">
      {!isSubmitted ? (
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 p-5 sm:p-8 lg:p-10 rounded-3xl shadow-2xl space-y-6">
          
          {/* HEADER DEL TEST */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              {onGoToCatalog && (
                <button
                  type="button"
                  onClick={onGoToCatalog}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Volver a Mi Ruta"
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              )}
              <span className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-display font-black text-base sm:text-lg text-white">
                  Evaluación Formativa: {title}
                </h3>
                <p className="text-xs text-slate-400">
                  Pregunta {currentQuestionIdx + 1} de {totalQuestions}
                </p>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300">
              +{choiceQ?.xp || 25} XP por acierto
            </span>
          </div>

          {/* BARRA DE PROGRESO */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIdx + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* ENUNCIADO DE LA PREGUNTA */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.question}
            </h4>

            {/* OPCIONES DE SELECCIÓN MÚLTIPLE */}
            {isChoice && (
              <div className="grid grid-cols-1 gap-3 pt-2">
                {choiceQ.options?.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQuestionIdx] === optIdx;
                  const isCorrect = optIdx === choiceQ.answer;

                  let btnStyle = 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200';
                  if (isCurrentAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                    } else if (isSelected) {
                      btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
                    } else {
                      btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isCurrentAnswered}
                      onClick={() => handleSelectChoice(optIdx)}
                      className={`p-4 rounded-2xl border text-left font-medium text-sm transition-all flex items-center justify-between gap-3 ${btnStyle} ${
                        !isCurrentAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                      }`}
                    >
                      <span>{opt}</span>
                      {isCurrentAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      {isCurrentAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* EXPLICACIÓN DIDÁCTICA TRAS RESPONDER */}
            {isCurrentAnswered && currentQ.explanation && (
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Explicación Científica</span>
                </div>
                <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}
          </div>

          {/* BOTÓN DE CONTINUAR */}
          {isCurrentAnswered && (
            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wide shadow-xl shadow-cyan-950 hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{currentQuestionIdx < totalQuestions - 1 ? 'Siguiente Pregunta' : 'Finalizar Evaluación'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* RESULTADO DEL TEST */
        <div className="bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 p-6 sm:p-10 rounded-3xl shadow-2xl text-center space-y-6 max-w-xl mx-auto">
          <div className="inline-flex p-4 rounded-3xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Award className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {score >= Math.ceil(totalQuestions * 0.75) ? '¡Misión Cumplida con Éxito!' : '¡Buen Intento, Explorador!'}
            </h3>
            <p className="text-sm text-slate-300">
              Has acertado <strong className="text-cyan-400 font-mono">{score}</strong> de <strong className="text-white font-mono">{totalQuestions}</strong> preguntas.
            </p>
          </div>

          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 ${
                  score >= star * Math.ceil(totalQuestions / 3)
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleRetry}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reintentar</span>
            </button>

            <button
              type="button"
              onClick={onGoToNextLesson}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-lg shadow-cyan-950"
            >
              Continuar Aprendiendo ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
