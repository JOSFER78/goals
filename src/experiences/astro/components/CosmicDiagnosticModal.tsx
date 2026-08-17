/**
 * src/experiences/astro/components/CosmicDiagnosticModal.tsx
 * Modal Interactivo de Micro-Diagnóstico Adaptativo Espacial (3-4 micro-preguntas)
 * Calibra el punto de partida del estudiante sin frustración.
 */

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, Compass, Rocket, Award, X } from 'lucide-react';
import { DiagnosticEngine } from '../../../core/services/DiagnosticEngine';
import { studentStateService } from '../../../core/services/StudentStateService';
import { DiagnosticItem, DiagnosticResult } from '../../../core/types/adaptiveCurriculum';
import { useAuth } from '../../../core/context/AuthContext';
import { useProgress } from '../../../core/context/ProgressContext';

interface CosmicDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: (result: DiagnosticResult) => void;
}

export const CosmicDiagnosticModal: React.FC<CosmicDiagnosticModalProps> = ({
  isOpen,
  onClose,
  onCompleted
}) => {
  const { user } = useAuth();
  const { userData, addXP, showToast } = useProgress();

  const declaredAge = userData?.childProfile?.age || 9;
  const declaredGrade = userData?.childProfile?.grade || '4º de Primaria';
  const userId = user?.uid || 'guest';

  const [items] = useState<DiagnosticItem[]>(() => 
    DiagnosticEngine.getDiagnosticItemsForStudent('astro', declaredAge)
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<{ itemId: string; selectedOption: number; isCorrect: boolean; conceptKey: string }>>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  if (!isOpen) return null;

  const currentItem = items[currentStep];
  const progressPercent = Math.round(((currentStep) / items.length) * 100);

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
  };

  const handleNextStep = async () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentItem.correctAnswer;
    const answerRecord = {
      itemId: currentItem.id,
      selectedOption,
      isCorrect,
      conceptKey: currentItem.conceptKey
    };

    const nextAnswers = [...answers, answerRecord];
    setAnswers(nextAnswers);
    setSelectedOption(null);

    if (currentStep + 1 < items.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finalizar diagnóstico
      const result = DiagnosticEngine.evaluateDiagnostic(userId, 'astro', declaredAge, nextAnswers);
      setDiagnosticResult(result);
      setIsFinished(true);

      const state = DiagnosticEngine.createStudentStateFromResult(userId, 'astro', declaredAge, declaredGrade, result);
      await studentStateService.saveStudentState(state);

      addXP(50, 'astro', 'Diagnóstico inicial de Cosmos completado');
      showToast('🎉 ¡Diagnóstico completado! Tu ruta personalizada está lista.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-xl bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white overflow-hidden">
        
        {/* Glow de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

        {/* Cabecera */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-950 border border-indigo-500/30 text-indigo-400">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {isFinished ? '¡Nivel Espacial Calibrado!' : 'Calibración de Nivel Cósmico'}
              </h3>
              <p className="text-xs text-slate-400">
                {isFinished ? 'Tu punto de partida ideal' : `Pregunta ${currentStep + 1} de ${items.length} • ~2 minutos`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isFinished ? (
          /* PREGUNTAS DEL DIAGNÓSTICO */
          <div className="space-y-6">
            {/* Barra de Progreso */}
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Enunciado */}
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">
                Concepto: {currentItem.conceptKey.replace(/_/g, ' ')}
              </span>
              <h4 className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
                {currentItem.prompt}
              </h4>
            </div>

            {/* Opciones */}
            <div className="space-y-2.5">
              {currentItem.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-400 text-white shadow-lg shadow-indigo-950'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-indigo-400 bg-indigo-500' : 'border-slate-700'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Botón de Siguiente */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleNextStep}
                disabled={selectedOption === null}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  selectedOption !== null
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{currentStep + 1 === items.length ? 'Finalizar Diagnóstico' : 'Siguiente'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* RESULTADO DEL DIAGNÓSTICO */
          <div className="space-y-6 text-center py-2 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-white">
                ¡Ruta Espacial Asignada con Éxito!
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Hemos calibrado tu conocimiento inicial ({diagnosticResult?.initialMasteryPercent}% de precisión).
                Comenzarás directamente en el punto que mejor aprovecha tu talento.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Nivel Estimado:</span>
                <span className="font-bold text-indigo-300 font-mono">~{diagnosticResult?.estimatedAgeLevel} Años</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Punto de Entrada Recomendado:</span>
                <span className="font-bold text-cyan-300 font-mono">{diagnosticResult?.recommendedStartUnitId}</span>
              </div>
              {diagnosticResult?.detectedStrengths && diagnosticResult.detectedStrengths.length > 0 && (
                <div className="flex items-center justify-between text-slate-400">
                  <span>Fortaleza Detectada:</span>
                  <span className="font-bold text-emerald-400">{diagnosticResult.detectedStrengths[0].replace(/_/g, ' ')}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                if (diagnosticResult) onCompleted(diagnosticResult);
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              <span>Entrar a Mi Camino de Cosmos</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
