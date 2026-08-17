import React, { useState } from 'react';
import { 
  X, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, AlertCircle, 
  HelpCircle, Bot, Send, Loader2, ArrowRight, ShieldCheck, Zap, Info
} from 'lucide-react';
import { CriterioModule, CriterioStep } from '../types';
import { askCriterioSocraticTutor } from '../services/criterioAIService';

interface ModuleViewerModalProps {
  module: CriterioModule | null;
  onClose: () => void;
  onCompleteModule: (moduleId: number, xpReward: number) => void;
}

export const ModuleViewerModal: React.FC<ModuleViewerModalProps> = ({
  module,
  onClose,
  onCompleteModule
}) => {
  if (!module) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnsweredQuestion, setHasAnsweredQuestion] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Consultas al Tutor Socrático
  const [isAskingTutor, setIsAskingTutor] = useState<boolean>(false);
  const [tutorQuery, setTutorQuery] = useState<string>('');
  const [tutorResponse, setTutorResponse] = useState<string | null>(null);
  const [showTutorBox, setShowTutorBox] = useState<boolean>(false);

  const step: CriterioStep = module.steps[currentStepIndex] || module.steps[0];
  const isLastStep = currentStepIndex === module.steps.length - 1;

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    setHasAnsweredQuestion(true);
  };

  const handleNextStep = () => {
    if (isLastStep) {
      setIsCompleted(true);
      onCompleteModule(module.id, module.xpReward);
    } else {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setHasAnsweredQuestion(false);
      setTutorResponse(null);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      setSelectedOptionId(null);
      setHasAnsweredQuestion(false);
      setTutorResponse(null);
    }
  };

  const handleAskTutor = async () => {
    if (!tutorQuery.trim() || isAskingTutor) return;
    setIsAskingTutor(true);
    setTutorResponse(null);
    try {
      const resp = await askCriterioSocraticTutor(module.title, tutorQuery, module.ageBracket);
      setTutorResponse(resp);
    } catch (e: any) {
      setTutorResponse("No pude conectar con el tutor en este momento. Inténtalo de nuevo.");
    } finally {
      setIsAskingTutor(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-950 border border-amber-500/40 shadow-2xl overflow-hidden font-display">
        
        {/* Cabecera del Visor */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs flex items-center justify-center">
              {module.id < 10 ? `0${module.id}` : module.id}
            </span>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-white leading-tight">
                {module.title}
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                Paso {currentStepIndex + 1} de {module.steps.length}: {step.title}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Barra de Progreso de la Lección */}
        <div className="w-full bg-slate-900 h-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / module.steps.length) * 100}%` }}
          />
        </div>

        {/* Cuerpo del Paso Activo (Scrollable) */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5">
          
          {/* Título y Subtítulo del Paso */}
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              {step.subtitle || 'ANÁLISIS PEDAGÓGICO'}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white">
              {step.title}
            </h3>
          </div>

          {/* Contenido Principal */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
            {step.content}
          </div>

          {/* Dato Asombroso / Wow Fact */}
          {step.wowFact && (
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 text-xs text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-indigo-300 block">¿Sabías que...?</strong>
                <span>{step.wowFact}</span>
              </div>
            </div>
          )}

          {/* Pregunta Socrática si existe en este paso */}
          {step.question && (
            <div className="space-y-3 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase font-mono">
                <HelpCircle className="w-4 h-4" />
                <span>Desafío de Pensamiento Crítico</span>
              </div>
              <p className="font-extrabold text-sm sm:text-base text-white">
                {step.question.prompt}
              </p>

              <div className="space-y-2 pt-1">
                {step.question.options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.id)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isSelected
                          ? opt.isNuanced
                            ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md'
                            : 'bg-amber-950/60 border-amber-500 text-amber-200'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.text}</span>
                        {isSelected && opt.isNuanced && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                      </div>

                      {isSelected && (
                        <p className="text-xs pt-2 border-t border-slate-800 text-slate-300 font-normal">
                          {opt.explanation}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Píldora de Conclusión Clave (Key Takeaway) */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300 font-semibold">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span><strong>Conclusión clave:</strong> {step.keyTakeaway}</span>
          </div>

          {/* Sección de Consulta al Tutor Socrático IA */}
          <div className="pt-2">
            {!showTutorBox ? (
              <button
                type="button"
                onClick={() => setShowTutorBox(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>¿Tienes una duda o ejemplo sobre este paso? Pregunta al Mentor IA</span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                    <Bot className="w-4 h-4" />
                    <span>Mentor Socrático de Criterio</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTutorBox(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Cerrar
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tutorQuery}
                    onChange={(e) => setTutorQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskTutor()}
                    placeholder="Escribe tu duda o caso para analizar..."
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={handleAskTutor}
                    disabled={isAskingTutor || !tutorQuery.trim()}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                  >
                    {isAskingTutor ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Preguntar</span>
                  </button>
                </div>

                {tutorResponse && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
                    {tutorResponse}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Pie con Controles de Navegación del Paso */}
        <div className="px-5 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Anterior</span>
          </button>

          <div className="flex items-center gap-1.5">
            {module.steps.map((_, i) => (
              <span 
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStepIndex 
                    ? 'w-6 bg-amber-400' 
                    : i < currentStepIndex 
                      ? 'bg-emerald-400' 
                      : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextStep}
            disabled={step.question && !hasAnsweredQuestion}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              step.question && !hasAnsweredQuestion
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : isLastStep
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
            }`}
          >
            <span>{isLastStep ? `Finalizar (+${module.xpReward} XP)` : 'Siguiente'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
