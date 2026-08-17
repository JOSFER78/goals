/**
 * GOALS 3D Cosmos - CosmicLearningPath
 * Vista Adaptativa Dual: "Mi Camino" (Ruta Personal Focalizada) y "Catálogo Cósmico" (Visión Global).
 * Consume `LearningPathEngine`, `AdaptiveCosmosCatalogService` y `StudentStateService` para personalizar la experiencia del alumno por tramos (6-15 años).
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Award, Lock, CheckCircle2, Star, ArrowRight, Sparkles, 
  Shield, Compass, Layers, RotateCcw, AlertCircle, PlayCircle, Rocket, ChevronRight, GraduationCap
} from 'lucide-react';
import { Lesson } from '../types';
import { useProgress } from '../../../core/context/ProgressContext';
import { useAuth } from '../../../core/context/AuthContext';
import { LearningPathEngine } from '../../../core/services/LearningPathEngine';
import { studentStateService } from '../../../core/services/StudentStateService';
import { LegacyCurriculumAdapter } from '../../../core/services/LegacyCurriculumAdapter';
import { PresentationEngine } from '../../../core/services/PresentationEngine';
import { AdaptiveCosmosCatalogService } from '../data/adaptiveCosmosCatalog';
import { StudentLearningState, LearningPath, AgeTranche, CurriculumUnit } from '../../../core/types/adaptiveCurriculum';
import { CosmicDiagnosticModal } from './CosmicDiagnosticModal';

interface CosmicLearningPathProps {
  lessons: Lesson[];
  onSelectLesson: (lessonId: number) => void;
  onSelectUnit?: (unitId: string) => void;
  onGoToTest: (lessonId: number, unitId?: string) => void;
}

export const CosmicLearningPath: React.FC<CosmicLearningPathProps> = ({
  lessons,
  onSelectLesson,
  onSelectUnit,
  onGoToTest
}) => {
  const { userData, isLessonUnlocked, isTestUnlocked, adminBypass, toggleAdminBypass, showToast, effectiveAge } = useProgress();
  const { user } = useAuth();
  const isUserAdmin = Boolean(user?.email === 'josferestudio@gmail.com' || userData?.role === 'admin');

  // Modo de vista: 'my_path' (Ruta Personal Focalizada) vs 'full_catalog' (Catálogo Completo)
  const [viewMode, setViewMode] = useState<'my_path' | 'full_catalog'>('my_path');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const [studentState, setStudentState] = useState<StudentLearningState | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);

  const userId = user?.uid || 'guest';
  const declaredAge = effectiveAge || userData?.learnerProfile?.education?.age || userData?.childProfile?.age || 9;
  const declaredGrade = userData?.learnerProfile?.education?.grade || userData?.childProfile?.grade || '4º de Primaria';
  const tranche: AgeTranche = PresentationEngine.getTrancheForAge(declaredAge);
  const trancheUnits: CurriculumUnit[] = AdaptiveCosmosCatalogService.getUnitsForTranche(tranche);
  const levelBadge = PresentationEngine.getLevelBadge(declaredAge);

  // Cargar estado del estudiante
  useEffect(() => {
    let isMounted = true;
    const loadState = async () => {
      let state = await studentStateService.getStudentState(userId, 'astro');
      if (!state) {
        // Inicializar estado por defecto si no existe
        state = {
          userId,
          experienceId: 'astro',
          disciplineId: 'astro',
          firstVisit: true,
          onboardingCompleted: false,
          age: declaredAge,
          grade: declaredGrade,
          diagnosticStatus: 'pending',
          recommendedStartUnitId: trancheUnits[0]?.id || 'astro_8_9_u01_atmosphere_satellites',
          currentUnitId: trancheUnits[0]?.id || 'astro_8_9_u01_atmosphere_satellites',
          completedUnitIds: [],
          conceptMastery: {},
          weakConcepts: [],
          strengths: [],
          sessionHistory: [],
          lastActiveAt: Date.now(),
          updatedAt: Date.now()
        };
      }

      if (isMounted) {
        setStudentState(state);
        const path = LearningPathEngine.computeLearningPath(state, trancheUnits);
        setLearningPath(path);
      }
    };

    loadState();
    return () => { isMounted = false; };
  }, [userId, declaredAge, declaredGrade, tranche]);

  const completedUnitsCount = learningPath?.completedUnitsCount || 0;
  const totalUnits = trancheUnits.length;
  const progressPct = Math.round((completedUnitsCount / Math.max(1, totalUnits)) * 100);

  const handleStartDiagnostic = () => {
    setIsDiagnosticOpen(true);
  };

  const handleDiagnosticCompleted = async () => {
    const state = await studentStateService.getStudentState(userId, 'astro');
    if (state) {
      setStudentState(state);
      setLearningPath(LearningPathEngine.computeLearningPath(state, trancheUnits));
    }
  };

  const handleUnitClick = (unitId: string, canonicalNum: number) => {
    if (onSelectUnit) {
      onSelectUnit(unitId);
    } else {
      onSelectLesson(canonicalNum);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-6 space-y-6 text-white animate-in fade-in duration-300">
      
      {/* CABECERA CON CONTROLES ADAPTATIVOS */}
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-indigo-500/30 p-5 sm:p-7 rounded-3xl shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-300">
                <Compass className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-tight">
                Ruta de Aprendizaje Cósmica
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-bold ${levelBadge.color}`}>
                <GraduationCap className="w-3 h-3 inline mr-1" />
                {levelBadge.label}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {levelBadge.stageTitle} • {totalUnits} Unidades Adaptadas
              </span>
            </div>
          </div>

          {/* SELECTOR DE VISTA: MI CAMINO vs CATÁLOGO */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setViewMode('my_path')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'my_path'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Mi Camino</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('full_catalog')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'full_catalog'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Catálogo ({totalUnits})</span>
              </button>
            </div>

            {/* MODO TUTOR / ADMIN BYPASS SWITCH */}
            {isUserAdmin && (
              <button
                onClick={() => {
                  toggleAdminBypass();
                  showToast(adminBypass ? "🔒 Modo Alumno Activado (Candados graduales)" : "🔓 Modo Tutor Activado (Desbloqueo total)");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer ${
                  adminBypass
                    ? 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-lg shadow-amber-950'
                    : 'bg-slate-950/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Alternar entre candados o desbloqueo total para auditoría"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{adminBypass ? 'Desbloqueo' : 'Alumno'}</span>
              </button>
            )}
          </div>
        </div>

        {/* BANNER DE DIAGNÓSTICO PENDIENTE SI CORRESPONDE */}
        {studentState?.diagnosticStatus === 'pending' && (
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-white">¿Quieres calibrar tu nivel inicial de Cosmos?</h4>
                <p className="text-[11px] text-indigo-200/80">Micro-diagnóstico de 2 minutos para saltar directamente a tu unidad recomendada.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleStartDiagnostic}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
            >
              Comenzar Calibración
            </button>
          </div>
        )}

        {/* BARRA DE PROGRESO DE LA RUTA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-mono">Progreso en Tramo {tranche}: {completedUnitsCount} de {totalUnits} Unidades</span>
            <span className="font-mono font-bold text-cyan-300">{progressPct}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* VISTA 1: MI CAMINO FOCALIZADO */}
      {viewMode === 'my_path' && learningPath && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* TARJETA PRINCIPAL: CONTINUAR MI CAMINO */}
          <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-950 border-2 border-indigo-500/50 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-mono font-bold text-xs flex items-center gap-1.5">
                <PlayCircle className="w-3.5 h-3.5 text-indigo-400" />
                TU UNIDAD ACTUAL
              </span>
              <span className="text-xs font-mono text-cyan-300 font-bold">+{learningPath.currentUnit.xpReward} XP</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{learningPath.currentUnit.icon}</span>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {learningPath.currentUnit.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                {learningPath.currentUnit.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleUnitClick(learningPath.currentUnit.unitId, learningPath.currentUnit.canonicalNumber)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-950 hover:opacity-95 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Continuar mi Aprendizaje</span>
              </button>
              <button
                type="button"
                onClick={() => onGoToTest(learningPath.currentUnit.canonicalNumber, learningPath.currentUnit.unitId)}
                className="px-5 py-3 rounded-2xl bg-slate-900 border border-indigo-500/30 text-indigo-200 hover:text-white hover:bg-slate-800 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Ir a la Evaluación</span>
              </button>
            </div>
          </div>

          {/* TARJETA DE REFUERZO SI EXISTE */}
          {learningPath.reinforcementUnit && (
            <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">{learningPath.reinforcementUnit.title}</h4>
                  <p className="text-[11px] text-amber-200/80">{learningPath.reinforcementUnit.subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleUnitClick(learningPath.reinforcementUnit!.unitId, learningPath.reinforcementUnit!.canonicalNumber)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all cursor-pointer shrink-0"
              >
                Repasar
              </button>
            </div>
          )}

          {/* PRÓXIMOS PASOS EN TU RUTA */}
          {learningPath.upcomingUnits.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Próximos Pasos en tu Camino</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {learningPath.upcomingUnits.map((u) => {
                  const isUnlocked = u.status === 'upcoming' || u.status === 'completed' || adminBypass;
                  return (
                    <div
                      key={u.unitId}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isUnlocked
                          ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 cursor-pointer'
                          : 'bg-slate-950/60 border-slate-900 opacity-60'
                      }`}
                      onClick={() => { if (isUnlocked) handleUnitClick(u.unitId, u.canonicalNumber); }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl shrink-0">{u.icon}</span>
                        <div className="min-w-0">
                          <h5 className="text-xs sm:text-sm font-bold text-white truncate">{u.title}</h5>
                          <p className="text-[11px] text-slate-400 truncate">{u.subtitle}</p>
                        </div>
                      </div>

                      {isUnlocked ? (
                        <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* VISTA 2: CATÁLOGO COMPLETO DE UNIDADES */}
      {viewMode === 'full_catalog' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trancheUnits.map((unit) => {
              const isCompleted = studentState?.completedUnitIds?.includes(unit.id) || false;
              const isUnlocked = isCompleted || unit.id === studentState?.currentUnitId || adminBypass;

              return (
                <div
                  key={unit.id}
                  className={`p-5 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                    isCompleted
                      ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                      : isUnlocked
                      ? 'bg-slate-900/80 border-cyan-500/30 shadow-lg shadow-cyan-950/10 hover:border-cyan-400'
                      : 'bg-slate-950/60 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl p-2 rounded-2xl bg-slate-950 border border-slate-800">{unit.icon}</span>
                      {isCompleted ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Superado
                        </span>
                      ) : isUnlocked ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                          Disponible
                        </span>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-600" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">{unit.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed pt-1">{unit.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400 font-mono">+{unit.xpReward} XP</span>
                    <button
                      type="button"
                      disabled={!isUnlocked}
                      onClick={() => handleUnitClick(unit.id, unit.canonicalNumber)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                        isUnlocked
                          ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 cursor-pointer shadow-md'
                          : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      }`}
                    >
                      {isCompleted ? 'Repasar' : 'Explorar'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL DE DIAGNÓSTICO ADAPTATIVO */}
      <CosmicDiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        onCompleted={() => {
          setIsDiagnosticOpen(false);
          handleDiagnosticCompleted();
        }}
      />

    </div>
  );
};
