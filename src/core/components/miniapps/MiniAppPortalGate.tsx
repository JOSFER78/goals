/**
 * src/core/components/miniapps/MiniAppPortalGate.tsx
 * Mini-Portada Inmersiva y Prueba de Nivel Específica por MiniApp.
 * Calibra el StudentLearningState en Firestore antes de ingresar a la experiencia.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import { ExperienceId } from '../../types';
import { GOALS_EXPERIENCES } from '../../config/experiencesConfig';
import { DiagnosticEngine } from '../../services/DiagnosticEngine';
import { studentStateService } from '../../services/StudentStateService';
import { PresentationEngine } from '../../services/PresentationEngine';
import { DiagnosticItem, StudentLearningState } from '../../types/adaptiveCurriculum';
import { PremiumGate } from '../premium/PremiumGate';
import { 
  Sparkles, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Trophy,
  Zap, Star, Shield, HelpCircle, Loader2, Check, Play
} from 'lucide-react';

interface MiniAppPortalGateProps {
  experienceId: ExperienceId;
  children: React.ReactNode;
  onBackToGoals: () => void;
}

export const MiniAppPortalGate: React.FC<MiniAppPortalGateProps> = ({
  experienceId,
  children,
  onBackToGoals
}) => {
  const { user } = useAuth();
  const { effectiveAge, addXP, isUserAdmin, userData, canAccessExperience } = useProgress();

  const isAdminAccess = Boolean(
    isUserAdmin || 
    user?.email === 'josferestudio@gmail.com' || 
    userData?.role === 'admin' || 
    user?.role === 'admin'
  );

  // El super admin josferestudio@gmail.com no tiene prueba de nivel ni portada de bloqueo en ninguna miniapp: accede directamente a todo
  if (isAdminAccess) {
    return <>{children}</>;
  }

  // Comprobar acceso premium antes del flujo cover/diagnostic
  if (!canAccessExperience(experienceId)) {
    return (
      <PremiumGate
        experienceId={experienceId}
        onBack={onBackToGoals}
      />
    );
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [learningState, setLearningState] = useState<StudentLearningState | null>(null);
  const [step, setStep] = useState<'cover' | 'diagnostic' | 'result'>('cover');

  // Estado del diagnóstico
  const [hasAcknowledgedResult, setHasAcknowledgedResult] = useState<boolean>(false);
  const [questions, setQuestions] = useState<DiagnosticItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Array<{ itemId: string; selectedOption: number; isCorrect: boolean; conceptKey: string }>>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const expConfig = GOALS_EXPERIENCES[experienceId];
  const ageTranche = PresentationEngine.getTrancheForAge(effectiveAge);
  const ageBadge = PresentationEngine.getLevelBadge(effectiveAge);

  useEffect(() => {
    let isMounted = true;
    const checkState = async () => {
      const uid = user?.uid || 'guest';
      try {
        const state = await studentStateService.getStudentState(uid, experienceId);
        if (isMounted) {
          setLearningState(state);
          if (state && state.diagnosticStatus === 'completed') {
            setLoading(false);
          } else {
            // Cargar preguntas de diagnóstico para esta materia
            const q = DiagnosticEngine.getDiagnosticItemsForStudent(experienceId, effectiveAge);
            setQuestions(q);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error verificando estado de miniapp:", err);
        if (isMounted) {
          const q = DiagnosticEngine.getDiagnosticItemsForStudent(experienceId, effectiveAge);
          setQuestions(q);
          setLoading(false);
        }
      }
    };

    checkState();
    return () => {
      isMounted = false;
    };
  }, [user?.uid, experienceId, effectiveAge]);

  // Si ya completó el diagnóstico previamente o confirmó la pantalla de resultado, mostrar la miniapp directamente
  if (!loading && learningState && learningState.diagnosticStatus === 'completed' && (step === 'cover' || hasAcknowledgedResult)) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-300 font-display">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-3" />
        <p className="text-xs font-mono">Preparando entorno de {expConfig?.name || 'la MiniApp'}...</p>
      </div>
    );
  }

  const handleStartDiagnostic = () => {
    let q = questions;
    if (q.length === 0) {
      q = DiagnosticEngine.getDiagnosticItemsForStudent(experienceId, effectiveAge);
      setQuestions(q);
    }
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setHasAnswered(false);
    setStep('diagnostic');
  };

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = index === currentQ.correctAnswer;

    setAnswers(prev => [
      ...prev,
      {
        itemId: currentQ.id,
        selectedOption: index,
        isCorrect,
        conceptKey: currentQ.conceptKey
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      finishDiagnostic(answers);
    }
  };

  const finishDiagnostic = async (currentAnswersList?: Array<{ itemId: string; selectedOption: number; isCorrect: boolean; conceptKey: string }>) => {
    const effectiveUid = user?.uid || 'guest';
    setIsSaving(true);

    const activeAnswers = currentAnswersList && currentAnswersList.length > 0 ? currentAnswersList : answers;

    const result = DiagnosticEngine.evaluateDiagnostic(
      effectiveUid,
      experienceId,
      effectiveAge,
      activeAnswers
    );

    const newState: StudentLearningState = {
      userId: effectiveUid,
      disciplineId: experienceId,
      experienceId: experienceId,
      firstVisit: false,
      onboardingCompleted: true,
      age: effectiveAge,
      grade: ageBadge.label.split(' (')[0],
      diagnosticStatus: 'completed',
      diagnosticScore: result.initialMasteryPercent,
      recommendedStartUnitId: result.recommendedStartUnitId,
      currentUnitId: result.recommendedStartUnitId,
      completedUnitIds: [],
      conceptMastery: {},
      weakConcepts: result.detectedWeakConcepts,
      strengths: result.detectedStrengths,
      sessionHistory: [],
      lastActiveAt: Date.now(),
      updatedAt: Date.now()
    };

    try {
      await studentStateService.saveStudentState(newState);
      setLearningState(newState);
      addXP(50, experienceId, `Prueba de Nivel superada en ${expConfig.name}`);
    } catch (err) {
      console.error("Error guardando diagnóstico de miniapp:", err);
      setLearningState(newState);
    } finally {
      setIsSaving(false);
      setStep('result');
    }
  };

  const handleSkipOrDirect = async () => {
    const effectiveUid = user?.uid || 'guest';
    setIsSaving(true);
    const directState: StudentLearningState = {
      userId: effectiveUid,
      disciplineId: experienceId,
      experienceId: experienceId,
      firstVisit: false,
      onboardingCompleted: true,
      age: effectiveAge,
      grade: ageBadge.label.split(' (')[0],
      diagnosticStatus: 'completed',
      diagnosticScore: 70,
      recommendedStartUnitId: questions[0]?.targetUnitId || 'base_u01',
      currentUnitId: questions[0]?.targetUnitId || 'base_u01',
      completedUnitIds: [],
      conceptMastery: {},
      weakConcepts: [],
      strengths: [],
      sessionHistory: [],
      lastActiveAt: Date.now(),
      updatedAt: Date.now()
    };

    try {
      await studentStateService.saveStudentState(directState);
      setLearningState(directState);
      setHasAcknowledgedResult(true);
    } catch (err) {
      console.error("Error asignando estado inicial directo:", err);
      setLearningState(directState);
      setHasAcknowledgedResult(true);
    } finally {
      setIsSaving(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const IconComp = expConfig.icon;

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-64px)] flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-display select-none">
      
      {/* Halo de luz temático de fondo */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 30%, ${expConfig.ambientGlow} 0%, transparent 80%)`
        }}
      />

      <div className="relative z-10 w-full max-w-2xl bg-slate-950/95 border border-slate-800/90 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 text-white backdrop-blur-2xl">
        
        {/* ========================================================== */}
        {/* PASO 1: MINI-PORTADA DE LA MINIAPP & OBJETIVOS             */}
        {/* ========================================================== */}
        {step === 'cover' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Header de la Mini-Portada */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <button
                type="button"
                onClick={onBackToGoals}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a GOALS</span>
              </button>

              <span className={`px-2.5 py-1 rounded-xl border text-[11px] font-mono font-bold uppercase ${expConfig.badgeClass}`}>
                {expConfig.badge}
              </span>
            </div>

            {/* Banner e Identidad de la Materia */}
            <div className="text-center space-y-3">
              <div className={`mx-auto w-20 h-20 rounded-3xl bg-slate-900 border ${expConfig.borderClass} flex items-center justify-center shadow-xl ${expConfig.iconColorClass}`}>
                <IconComp className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {expConfig.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                  {expConfig.tagline}
                </p>
              </div>
            </div>

            {/* Ficha Detectada del Alumno para esta materia */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-400 uppercase text-[10px] font-bold">🎯 Ficha Pedagógica de Entrada:</span>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[10px]">
                  Tramo {ageTranche} años
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-200">
                <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                  <div className="text-[10px] text-slate-400">Estudiante</div>
                  <div className="font-bold truncate text-white">{user?.displayName || 'Alumno'}</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5">
                  <div className="text-[10px] text-slate-400">Nivel Escolar</div>
                  <div className="font-bold text-amber-300">{ageBadge.label}</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                Para calibrar qué unidades y actividades verás primero en esta disciplina, realizaremos una breve prueba de nivel interactiva de 4 preguntas.
              </p>
            </div>

            {/* Botones de Entrada */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleStartDiagnostic}
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-950/50 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Iniciar Prueba de Nivel (4 Preguntas)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleSkipOrDirect}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Comenzar directamente en el Nivel Base
              </button>
            </div>

          </div>
        )}

        {/* ========================================================== */}
        {/* PASO 2: PRUEBA DE NIVEL INTERACTIVA (MICRO-TEST)           */}
        {/* ========================================================== */}
        {step === 'diagnostic' && currentQuestion && (
          <div className="space-y-5 animate-fadeIn">
            
            {/* Header del Test */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`p-1.5 rounded-lg bg-slate-900 border ${expConfig.borderClass} ${expConfig.iconColorClass}`}>
                  <IconComp className="w-3.5 h-3.5" />
                </span>
                <span className="font-bold text-white">Prueba de Nivel • {expConfig.name}</span>
              </div>
              <span className="font-mono text-indigo-400 font-bold">
                Pregunta {currentIndex + 1} de {questions.length}
              </span>
            </div>

            {/* Barra de Progreso */}
            <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Pregunta */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 font-bold">
                Concepto: {currentQuestion.conceptKey.replace(/_/g, ' ')}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                {currentQuestion.prompt}
              </h3>
            </div>

            {/* Opciones */}
            <div className="space-y-2">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswer;

                let btnStyle = "bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200";
                if (hasAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/40";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-950/80 border-rose-500 text-rose-200 shadow-md shadow-rose-950/40";
                  } else {
                    btnStyle = "bg-slate-950/50 border-slate-900 text-slate-500 opacity-60";
                  }
                } else if (isSelected) {
                  btnStyle = "bg-indigo-950/80 border-indigo-500 text-indigo-200";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={hasAnswered}
                    className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm font-medium text-left transition-all flex items-center justify-between gap-3 ${btnStyle} cursor-pointer`}
                  >
                    <span>{opt}</span>
                    {hasAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {hasAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explicación Formativa y Botón de Siguiente */}
            {hasAnswered && (
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3 animate-fadeIn">
                <p className="text-xs text-slate-300 leading-relaxed">
                  💡 <span className="font-bold text-white">Explicación:</span> {currentQuestion.explanation}
                </p>
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={isSaving}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : currentIndex + 1 < questions.length ? (
                    <>
                      <span>Siguiente Pregunta</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Finalizar y Calibrar Nivel</span>
                      <Trophy className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        )}

        {/* ========================================================== */}
        {/* PASO 3: RESULTADO Y ENTRADA AL MUNDO DE APRENDIZAJE        */}
        {/* ========================================================== */}
        {step === 'result' && learningState && (
          <div className="space-y-6 text-center animate-fadeIn">
            
            <div className="mx-auto w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl">
              <Trophy className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-1.5">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono font-bold uppercase">
                ¡Calibración Completada!
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Nivel Asignado en {expConfig.name}
              </h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Tu ruta de aprendizaje ha sido configurada con éxito para tu edad y nivel.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs text-left">
              <div className="flex items-center justify-between text-slate-300">
                <span>Puntuación Diagnóstica:</span>
                <span className="font-bold text-amber-300 font-mono">{learningState.diagnosticScore || 80}%</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Punto de Inicio:</span>
                <span className="font-bold text-indigo-300 truncate max-w-[200px]">{learningState.recommendedStartUnitId}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Recompensa Inicial:</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  +50 XP Ganados
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setHasAcknowledgedResult(true);
              }}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 hover:opacity-95 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Entrar al Mundo de {expConfig.name}</span>
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
