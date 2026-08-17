import React, { useState } from 'react';
import { X, Award, CheckCircle2, ArrowRight, Sparkles, Loader2, Compass } from 'lucide-react';
import { CEFRLevel, StudentLanguageProfile } from '../types';
import { MemoryService } from '../services/memoryService';

interface PlacementDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentLanguageProfile;
  onUpdateLevel: (newLevel: CEFRLevel) => void;
}

interface DiagnosticQuestion {
  id: number;
  level: CEFRLevel;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    id: 1,
    level: 'A1',
    question: 'Where ___ you from?',
    options: ['is', 'are', 'be', 'am'],
    correctIndex: 1,
    explanation: 'Con el pronombre "you" en presente se utiliza el verbo "are".'
  },
  {
    id: 2,
    level: 'A2',
    question: 'Yesterday afternoon, we ___ to the science museum by bus.',
    options: ['go', 'went', 'gone', 'goed'],
    correctIndex: 1,
    explanation: '"Went" es el pasado simple irregular del verbo "go".'
  },
  {
    id: 3,
    level: 'B1',
    question: 'If it ___ tomorrow, we will cancel the outdoor rocket launch.',
    options: ['rains', 'will rain', 'rained', 'rain'],
    correctIndex: 0,
    explanation: 'Primer condicional: if + presente simple ("rains"), principal con will + infinitivo.'
  },
  {
    id: 4,
    level: 'B2',
    question: 'She asked me how long I ___ working on the artificial intelligence project.',
    options: ['am', 'had been', 'have been', 'was'],
    correctIndex: 1,
    explanation: 'Estilo indirecto (Reported Speech) en pasado continuo: Past Perfect Continuous ("had been working").'
  },
  {
    id: 5,
    level: 'C1',
    question: 'Seldom ___ such an intricate planetary alignment in the telescope.',
    options: ['have we observed', 'we observed', 'did we saw', 'we have observed'],
    correctIndex: 0,
    explanation: 'Inversión sintáctica tras adverbio restrictivo inicial "Seldom": Seldom + auxiliar + sujeto + participio.'
  }
];

export const PlacementDiagnosticModal: React.FC<PlacementDiagnosticModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateLevel
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [assignedLevel, setAssignedLevel] = useState<CEFRLevel>('A2');

  if (!isOpen) return null;

  const currentQ = DIAGNOSTIC_QUESTIONS[currentStep];

  const handleSelectOption = (idx: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: idx }));
  };

  const handleNext = () => {
    if (currentStep < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calcular puntuación
      let correctCount = 0;
      DIAGNOSTIC_QUESTIONS.forEach(q => {
        if (answers[q.id] === q.correctIndex) correctCount++;
      });

      let calculated: CEFRLevel = 'A1';
      if (correctCount === 5) calculated = 'C1';
      else if (correctCount === 4) calculated = 'B2';
      else if (correctCount === 3) calculated = 'B1';
      else if (correctCount >= 2) calculated = 'A2';

      setAssignedLevel(calculated);
      setIsFinished(true);
      MemoryService.updateProfile({ overallLevel: calculated });
      onUpdateLevel(calculated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
            <Compass className="w-5 h-5" />
            <span>Diagnóstico Inicial Adaptativo (Placement Test)</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isFinished ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Pregunta {currentStep + 1} de {DIAGNOSTIC_QUESTIONS.length}</span>
              <span className="font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                Nivel Evaluado: {currentQ.level}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <p className="text-xs text-slate-400 font-semibold">Selecciona la opción correcta para completar la frase:</p>
              <h4 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {currentQ.question}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-3.5 rounded-xl text-xs sm:text-sm font-bold text-left transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-500/40'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={handleNext}
                disabled={answers[currentQ.id] === undefined}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <span>{currentStep < DIAGNOSTIC_QUESTIONS.length - 1 ? 'Siguiente Pregunta' : 'Calcular Diagnóstico'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/20">
              🏆
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xl font-extrabold text-white">¡Diagnóstico Completado!</h4>
              <p className="text-xs text-slate-400">Tu nivel inicial CEFR asignado para el plan de estudio es:</p>
              <div className="inline-block mt-2 px-5 py-2 rounded-2xl bg-cyan-950 border border-cyan-500 text-cyan-300 font-mono font-black text-2xl shadow-xl">
                CEFR {assignedLevel}
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              El Teacher Agent ha calibrado automáticamente la dificultad de las conversaciones, prácticas y roleplays para ajustarse a tu nivel real.
            </p>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg cursor-pointer"
              >
                Comenzar con Nivel {assignedLevel}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
