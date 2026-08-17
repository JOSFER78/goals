import React, { useState } from 'react';
import { 
  AILabModule, 
  AIAgeBracket, 
  AITab,
  AIStepDef 
} from '../types/aiLabTypes';
import { AI_SKILL_AREAS } from '../data/aiLabModulesData';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Zap, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Cpu, 
  Award,
  Layers,
  Check,
  RotateCcw
} from 'lucide-react';
import { sanitizeTextForSpeech, getBestSpanishVoice } from '../../../core/services/aiService';

interface AILabModuleViewerModalProps {
  module: AILabModule | null;
  ageBracket: AIAgeBracket;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (moduleId: number, xpReward: number) => void;
  onLaunchLab?: (tab: AITab) => void;
}

export const AILabModuleViewerModal: React.FC<AILabModuleViewerModalProps> = ({
  module,
  ageBracket,
  isOpen,
  onClose,
  onComplete,
  onLaunchLab
}) => {
  if (!isOpen || !module) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Modo Test Final del Módulo
  const [isFinalTestMode, setIsFinalTestMode] = useState<boolean>(false);
  const [finalTestAnswers, setFinalTestAnswers] = useState<Record<number, number>>({});
  const [testScore, setTestScore] = useState<number | null>(null);

  const competency = AI_SKILL_AREAS.find((c) => c.id === module.competency);
  const currentStep: AIStepDef = module.steps[currentStepIndex] || module.steps[0];
  const totalSteps = module.steps.length;

  const handleSpeakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const clean = sanitizeTextForSpeech(text);
    if (!clean) return;

    const utter = new SpeechSynthesisUtterance(clean);
    const voice = getBestSpanishVoice();
    if (voice) utter.voice = voice;
    utter.rate = 1.0;
    utter.pitch = 1.0;

    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const handleNextStep = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedQuizOption(null);
      setIsQuizSubmitted(false);
    } else {
      // Pasar al test final
      setIsFinalTestMode(true);
    }
  };

  const handlePrevStep = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (isFinalTestMode) {
      setIsFinalTestMode(false);
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setSelectedQuizOption(null);
      setIsQuizSubmitted(false);
    }
  };

  const handleFinishTest = () => {
    let score = 0;
    module.questions.forEach((q) => {
      if (finalTestAnswers[q.id] === q.answer) {
        score++;
      }
    });
    setTestScore(score);
    const earnedXP = module.xpReward + (score === module.questions.length ? 25 : 10);
    onComplete(module.id, earnedXP);
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
    setIsFinalTestMode(false);
    setFinalTestAnswers({});
    setTestScore(null);
  };

  const currentStepText = currentStep.contentByAge?.[ageBracket] || currentStep.content || '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden text-slate-100 relative">
        
        {/* Cabecera del Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-mono font-bold shrink-0">
              {String(module.id).padStart(2, '0')}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-sm sm:text-base text-white truncate">
                  {module.title}
                </h2>
                {competency && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${competency.bgBadge} ${competency.color} ${competency.borderBadge}`}>
                    {competency.shortName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {module.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleSpeakText(currentStepText)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isSpeaking 
                  ? 'bg-purple-600 text-white border-purple-400 animate-pulse' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title={isSpeaking ? "Detener Lectura" : "Escuchar Paso"}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                if (isSpeaking) window.speechSynthesis.cancel();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Barra de Progreso de Pasos */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-1">
            {module.steps.map((step, idx) => (
              <div
                key={step.id}
                className={`h-1.5 rounded-full flex-1 transition-all ${
                  idx === currentStepIndex && !isFinalTestMode
                    ? 'bg-purple-500 shadow-sm shadow-purple-500/50'
                    : idx < currentStepIndex || isFinalTestMode
                    ? 'bg-purple-700'
                    : 'bg-slate-800'
                }`}
              />
            ))}
            <div
              className={`h-1.5 rounded-full flex-1 transition-all ${
                isFinalTestMode ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-slate-800'
              }`}
            />
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0">
            {isFinalTestMode ? 'Examen Final' : `Paso ${currentStepIndex + 1} de ${totalSteps}`}
          </span>
        </div>

        {/* Contenedor de Contenido Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {!isFinalTestMode ? (
            /* Vista del Paso de Aprendizaje */
            <div className="space-y-6 animate-fadeIn">
              
              {/* Título del Paso */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-[11px] font-mono font-bold border border-purple-500/20">
                    Paso {currentStepIndex + 1}
                  </span>
                  {currentStep.subtitle && (
                    <span className="text-xs text-slate-400 font-medium">
                      {currentStep.subtitle}
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {currentStep.title}
                </h3>
              </div>

              {/* Contenido Principal Explicativo */}
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed">
                <p>{currentStepText}</p>

                {currentStep.bullets && currentStep.bullets.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <span className="text-xs uppercase font-bold text-purple-300 tracking-wider">
                      Aspectos clave:
                    </span>
                    <ul className="space-y-1.5">
                      {currentStep.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                          <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Wow Fact si existe */}
              {currentStep.wowFact && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 text-amber-200 text-xs sm:text-sm">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-amber-300">¿Sabías que...?</span>
                    <p className="mt-0.5 leading-relaxed">{currentStep.wowFact}</p>
                  </div>
                </div>
              )}

              {/* Especificaciones / Desglose técnico */}
              {currentStep.specs && (
                <div className="space-y-2 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Desglose Técnico:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(currentStep.specs).map(([key, val]) => (
                      <div key={key} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <span className="font-bold text-purple-300 shrink-0">{key}:</span>
                        <span className="text-slate-300 text-right sm:text-left">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón para lanzar simulador interactivo si aplica */}
              {module.interactiveLabLink && onLaunchLab && (
                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Cpu className="w-5 h-5 text-purple-400" />
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-white block">Laboratorio Práctico Disponible</span>
                      <span className="text-[11px] text-slate-300">Experimenta con el simulador interactivo en tiempo real</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onLaunchLab(module.interactiveLabLink!);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 cursor-pointer transition-all shadow-md shadow-purple-600/30"
                  >
                    Abrir Simulador
                  </button>
                </div>
              )}

              {/* Mini Quiz del Paso 4 si existe */}
              {currentStep.quiz && (
                <div className="bg-slate-950 border border-indigo-500/30 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-indigo-400" />
                    <span>Pregunta de Verificación Rápida</span>
                  </div>

                  <p className="font-bold text-sm sm:text-base text-white">
                    {currentStep.quiz.question}
                  </p>

                  <div className="space-y-2">
                    {currentStep.quiz.options.map((opt, optIdx) => {
                      const isSelected = selectedQuizOption === optIdx;
                      const isCorrect = optIdx === currentStep.quiz?.answer;

                      let btnStyle = 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-200';
                      if (isQuizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-200';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-purple-600/20 border-purple-500 text-purple-200 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isQuizSubmitted}
                          onClick={() => setSelectedQuizOption(optIdx)}
                          className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-start gap-2.5 ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {!isQuizSubmitted ? (
                    <button
                      type="button"
                      disabled={selectedQuizOption === null}
                      onClick={() => setIsQuizSubmitted(true)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                        selectedQuizOption !== null
                          ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Comprobar Respuesta
                    </button>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-purple-500/30 text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-purple-300 block mb-1">Explicación Pedagógica:</span>
                      {currentStep.quiz.explanation}
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            /* Vista del Test de Evaluación Final del Módulo */
            <div className="space-y-6 animate-fadeIn">
              
              <div className="text-center max-w-xl mx-auto space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Examen de Certificación del Módulo
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Responde a las {module.questions.length} preguntas clave para certificar tu aprendizaje y reclamar tus {module.xpReward} XP.
                </p>
              </div>

              {testScore === null ? (
                /* Formulario de Preguntas */
                <div className="space-y-5">
                  {module.questions.map((q, qIdx) => (
                    <div key={q.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4.5 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 font-mono text-xs font-bold flex items-center justify-center">
                          {qIdx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-white">
                          {q.question}
                        </h4>
                      </div>

                      <div className="space-y-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = finalTestAnswers[q.id] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              type="button"
                              onClick={() => {
                                setFinalTestAnswers((prev) => ({ ...prev, [q.id]: oIdx }));
                              }}
                              className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer flex items-start gap-2.5 ${
                                isSelected
                                  ? 'bg-purple-600/20 border-purple-500 text-purple-200 font-bold'
                                  : 'bg-slate-900/80 hover:bg-slate-850 border-slate-800 text-slate-300'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="flex-1">{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled={Object.keys(finalTestAnswers).length < module.questions.length}
                      onClick={handleFinishTest}
                      className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                        Object.keys(finalTestAnswers).length >= module.questions.length
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/30'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Calificar y Reclamar XP</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Resultados y Recompensa */
                <div className="bg-slate-950 border border-purple-500/30 rounded-3xl p-6 text-center space-y-4">
                  <div className="text-4xl">🎉</div>
                  <h4 className="text-xl font-black text-white">
                    ¡Módulo Completado con Éxito!
                  </h4>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-extrabold text-sm">
                    <Zap className="w-4 h-4 fill-amber-400" />
                    <span>+{module.xpReward + (testScore === module.questions.length ? 25 : 10)} XP Obtenidos</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    Puntuación: <span className="font-bold text-white">{testScore} de {module.questions.length}</span> preguntas acertadas.
                  </p>

                  <div className="flex items-center justify-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleRestart}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Repasar de Nuevo</span>
                    </button>

                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 cursor-pointer"
                    >
                      Volver al Menú de IA Lab
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Pie de Navegación del Modal */}
        {!isFinalTestMode && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={handlePrevStep}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition-all cursor-pointer ${
                currentStepIndex > 0
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  : 'opacity-40 bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <span>{currentStepIndex === totalSteps - 1 ? 'Ir al Examen Final' : 'Siguiente Paso'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
