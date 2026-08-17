import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, XCircle, Sparkles, RefreshCw, Loader2, ArrowRight, 
  HelpCircle, Lightbulb, Trophy 
} from 'lucide-react';
import { ContentGenerator } from '../services/contentGenerator';
import { ExerciseItem, ExerciseType, StudentLanguageProfile } from '../types';

interface PracticeGeneratorPadProps {
  profile: StudentLanguageProfile;
  onAddXP: (amount: number, reason: string) => void;
}

export const PracticeGeneratorPad: React.FC<PracticeGeneratorPadProps> = ({
  profile,
  onAddXP
}) => {
  const [exerciseType, setExerciseType] = useState<ExerciseType>('fill_blank');
  const [topic, setTopic] = useState<string>('Verbos en pasado simple & viajes');
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scoreCount, setScoreCount] = useState<number>(0);

  const fetchExercises = async (typeToLoad = exerciseType, topicToLoad = topic) => {
    setIsLoading(true);
    setIsAnswerChecked(false);
    setUserAnswer('');
    try {
      const list = await ContentGenerator.generateExercises(topicToLoad, typeToLoad, profile.overallLevel, 3);
      setExercises(list);
      setCurrentIndex(0);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [exerciseType]);

  const currentEx = exercises[currentIndex];

  const handleCheckAnswer = (selectedAns?: string) => {
    const ansToCheck = (selectedAns || userAnswer).trim().toLowerCase();
    if (!ansToCheck || !currentEx) return;

    const correct = currentEx.correctAnswer.trim().toLowerCase();
    const matches = ansToCheck === correct || ansToCheck.includes(correct);

    setIsCorrect(matches);
    setIsAnswerChecked(true);

    if (matches) {
      setScoreCount(prev => prev + 1);
      onAddXP(15, `Ejercicio de ${currentEx.targetSkill} completado con éxito`);
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else {
      fetchExercises();
    }
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/20 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl backdrop-blur-xl">
      
      {/* Selector de Tipos de Práctica */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span>Generador de Práctica Pedagógica ({profile.targetLanguage})</span>
          </h3>
          <p className="text-xs text-slate-400">Ejercicios adaptativos generados en tiempo real según tu nivel {profile.overallLevel}.</p>
        </div>

        <button
          onClick={() => fetchExercises()}
          disabled={isLoading}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Generar Nuevos</span>
        </button>
      </div>

      {/* Pestañas de Tipo de Ejercicio */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'fill_blank', label: 'Completar Espacio' },
          { id: 'multiple_choice', label: 'Opción Múltiple' },
          { id: 'order_words', label: 'Ordenar Palabras' },
          { id: 'error_correction', label: 'Corregir Error' },
          { id: 'translate', label: 'Traducción' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setExerciseType(tab.id as ExerciseType)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              exerciseType === tab.id
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                : 'bg-slate-950/80 text-slate-400 hover:text-cyan-300 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tarjeta del Ejercicio Activo */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3 text-cyan-300">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-sm font-bold">Generando ejercicios adaptados con el profesor IA...</p>
        </div>
      ) : currentEx ? (
        <div className="space-y-4 bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30 font-bold">
              EJERCICIO {currentIndex + 1} DE {exercises.length}
            </span>
            <span className="font-semibold text-slate-300">{currentEx.targetSkill}</span>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-400 font-medium">{currentEx.instruction}</p>
            <h4 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              {currentEx.question}
            </h4>
          </div>

          {/* Opciones interactivas si tiene opciones */}
          {currentEx.options && currentEx.options.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {currentEx.options.map((opt, i) => {
                const isSelected = userAnswer === opt;
                return (
                  <button
                    key={i}
                    disabled={isAnswerChecked}
                    onClick={() => {
                      setUserAnswer(opt);
                      handleCheckAnswer(opt);
                    }}
                    className={`p-3.5 rounded-xl text-xs sm:text-sm font-bold text-left transition-all border cursor-pointer ${
                      isSelected
                        ? isAnswerChecked
                          ? isCorrect
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-850'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Input de texto si es para escribir */
            <div className="space-y-3 pt-2">
              <input
                type="text"
                value={userAnswer}
                disabled={isAnswerChecked}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-sm text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-medium"
              />
              {!isAnswerChecked && (
                <button
                  onClick={() => handleCheckAnswer()}
                  disabled={!userAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-40"
                >
                  Comprobar Respuesta
                </button>
              )}
            </div>
          )}

          {/* Feedback y Explicación Pedagógica */}
          {isAnswerChecked && (
            <div
              className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${
                isCorrect
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>¡Respuesta Correcta! (+15 XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>Respuesta Correcta: <strong>{currentEx.correctAnswer}</strong></span>
                    </>
                  )}
                </div>

                <button
                  onClick={handleNext}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                >
                  <span>{currentIndex < exercises.length - 1 ? 'Siguiente Ejercicio' : 'Completar Tanda'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-start gap-2 text-xs text-slate-300 pt-1">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>{currentEx.explanation}</p>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
