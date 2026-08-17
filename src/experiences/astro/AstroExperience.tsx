/**
 * GOALS 3D Cosmos - AstroExperience (Orquestador React Modular)
 * Gestiona de forma limpia las 3 pestañas principales de la experiencia:
 * 1. [📖 Lecciones]: Catálogo y lectura teórica paso a paso adaptada por tramos (6-15 años).
 * 2. [🎯 Tests]: Evaluaciones formativas con XP y estrellas adaptadas al nivel escolar.
 * 3. [🌌 Explorar 3D]: Simulador 3D espacial WebGL2 con controles y telemetría.
 */

import React, { useState } from 'react';
import { LESSONS } from './data/lessonsData';
import { Lesson } from './types';
import { Cosmos3DCanvas } from './components/Cosmos3DCanvas';
import { LessonTheoryView } from './components/LessonTheoryView';
import { LessonTestView } from './components/LessonTestView';
import { useProgress } from '../../core/context/ProgressContext';
import { useAuth } from '../../core/context/AuthContext';
import { studentStateService } from '../../core/services/StudentStateService';
import { LegacyCurriculumAdapter } from '../../core/services/LegacyCurriculumAdapter';
import { PresentationEngine } from '../../core/services/PresentationEngine';
import { AdaptiveCosmosCatalogService } from './data/adaptiveCosmosCatalog';
import { CurriculumUnit, AgeTranche } from '../../core/types/adaptiveCurriculum';
import { BookOpen, CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';

import { TestsCatalogHub } from './components/TestsCatalogHub';
import { CosmicLearningPath } from './components/CosmicLearningPath';

interface AstroExperienceProps {
  onBackToGoals: () => void;
  onOpenProfile: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const AstroExperience: React.FC<AstroExperienceProps> = ({
  onBackToGoals,
  onOpenProfile,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const { userData, finishTest, completeStep, isLessonUnlocked, isTestUnlocked, showToast, effectiveAge } = useProgress();

  // Pestaña activa ('learn' | 'tests' | 'explore')
  const [activeTab, setActiveTab] = useState<'learn' | 'tests' | 'explore'>('explore');
  const [currentLessonId, setCurrentLessonId] = useState<number>(1);
  const [currentUnitId, setCurrentUnitId] = useState<string | null>(null);
  const [isReadingLesson, setIsReadingLesson] = useState<boolean>(false);
  const [isTakingTest, setIsTakingTest] = useState<boolean>(false);
  const [isBottomNavCollapsed, setIsBottomNavCollapsed] = useState<boolean>(false);

  const declaredAge = effectiveAge || userData?.learnerProfile?.education?.age || userData?.childProfile?.age || 9;
  const tranche: AgeTranche = PresentationEngine.getTrancheForAge(declaredAge);
  const trancheUnits: CurriculumUnit[] = AdaptiveCosmosCatalogService.getUnitsForTranche(tranche);

  // Resolver unidad activa
  const activeCurriculumUnit: CurriculumUnit | undefined = currentUnitId 
    ? AdaptiveCosmosCatalogService.getUnitById(currentUnitId)
    : (trancheUnits[currentLessonId - 1] || trancheUnits[0]);

  const currentLesson: Lesson = LESSONS.find(l => l.id === currentLessonId) || LESSONS[0];

  const handleSelectLesson = (id: number) => {
    setCurrentLessonId(id);
    const unit = trancheUnits[id - 1] || trancheUnits[0];
    if (unit) setCurrentUnitId(unit.id);
    setIsReadingLesson(true);
  };

  const handleSelectUnit = (unitId: string) => {
    setCurrentUnitId(unitId);
    const unit = AdaptiveCosmosCatalogService.getUnitById(unitId);
    if (unit) {
      setCurrentLessonId(unit.canonicalNumber);
    }
    setIsReadingLesson(true);
  };

  const handleSelectTest = (id: number, unitId?: string) => {
    if (unitId) {
      setCurrentUnitId(unitId);
      const unit = AdaptiveCosmosCatalogService.getUnitById(unitId);
      if (unit) {
        setCurrentLessonId(unit.canonicalNumber);
      } else {
        setCurrentLessonId(id);
      }
    } else {
      const unit = trancheUnits[id - 1] || trancheUnits[0];
      if (unit) {
        setCurrentUnitId(unit.id);
        setCurrentLessonId(unit.canonicalNumber);
      } else {
        setCurrentLessonId(id);
      }
    }
    setIsTakingTest(true);
  };

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-60px)] flex flex-col bg-slate-950 overflow-hidden select-none">
      
      {/* ÁREA PRINCIPAL SEGÚN PESTAÑA ACTIVA */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex flex-col">
        
        {/* PESTAÑA 1: LECCIONES TEÓRICAS */}
        {activeTab === 'learn' && (
          <div className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-6 scrollbar-thin">
            {!isReadingLesson ? (
              /* RUTA DE APRENDIZAJE CÓSMICA ADAPTADA */
              <CosmicLearningPath
                lessons={LESSONS}
                onSelectLesson={handleSelectLesson}
                onSelectUnit={handleSelectUnit}
                onGoToTest={(id, unitId) => {
                  handleSelectTest(id, unitId);
                  setActiveTab('tests');
                }}
              />
            ) : (
              /* DETALLE DE LA LECCIÓN ACTIVA (ADAPTADA AL TRAMO) */
              <LessonTheoryView
                lesson={currentLesson}
                unit={activeCurriculumUnit}
                onGoToCatalog={() => setIsReadingLesson(false)}
                onSelectLesson={(id) => handleSelectLesson(id)}
                onSelectUnit={(unitId) => handleSelectUnit(unitId)}
                onGoTo3D={(_target) => setActiveTab('explore')}
                onGoToTest={() => {
                  setIsTakingTest(true);
                  setActiveTab('tests');
                }}
                onStepComplete={(stepIdx) => completeStep(currentLesson.id, stepIdx)}
              />
            )}
          </div>
        )}

        {/* PESTAÑA 2: TESTS Y EVALUACIÓN */}
        {activeTab === 'tests' && (
          <div className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-6 scrollbar-thin">
            {!isTakingTest ? (
              /* CENTRO DE EVALUACIONES Y TESTS INDEPENDIENTES ADAPTADOS POR TRAMO */
              <TestsCatalogHub
                units={trancheUnits}
                lessons={LESSONS}
                onSelectTest={handleSelectTest}
                onGoToLesson={(id, unitId) => {
                  if (unitId) {
                    handleSelectUnit(unitId);
                  } else {
                    handleSelectLesson(id);
                  }
                  setActiveTab('learn');
                }}
              />
            ) : (
              /* EXAMEN EN CURSO (ADAPTADO AL TRAMO) */
              <div className="space-y-4">
                {/* BARRA DE NAVEGACIÓN ENTRE TESTS */}
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/10 text-white">
                  <button
                    onClick={() => {
                      const prevId = Math.max(1, currentLessonId - 1);
                      if (isTestUnlocked(prevId)) {
                        handleSelectTest(prevId);
                      } else {
                        showToast(`🔒 Completa la Lección ${prevId} para desbloquear este test`);
                      }
                    }}
                    disabled={currentLessonId <= 1}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentLessonId <= 1
                        ? 'opacity-40 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-cyan-950 text-slate-200 hover:text-cyan-300 cursor-pointer'
                    }`}
                  >
                    ◀ Anterior
                  </button>

                  <button
                    onClick={() => setIsTakingTest(false)}
                    className="px-3 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>📋</span>
                    <span>Centro de Tests</span>
                  </button>

                  <button
                    onClick={() => {
                      const nextId = Math.min(trancheUnits.length, currentLessonId + 1);
                      if (isTestUnlocked(nextId)) {
                        handleSelectTest(nextId);
                      } else {
                        showToast(`🔒 Completa la Lección ${nextId} para desbloquear este test`);
                      }
                    }}
                    disabled={currentLessonId >= trancheUnits.length}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentLessonId >= trancheUnits.length
                        ? 'opacity-40 text-slate-600 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-cyan-950 text-slate-200 hover:text-cyan-300 cursor-pointer'
                    }`}
                  >
                    Siguiente ▶
                  </button>
                </div>

                <LessonTestView
                  key={`test_${activeCurriculumUnit?.id || currentLesson.id}`}
                  lesson={currentLesson}
                  unit={activeCurriculumUnit}
                  onGoToCatalog={() => setIsTakingTest(false)}
                  onFinishTest={(score, total) => {
                    const res = finishTest(currentLesson.id, score, total);
                    const currentCanonicalId = activeCurriculumUnit?.id || LegacyCurriculumAdapter.numericToCanonicalId(currentLesson.id);
                    const nextIndex = Math.min(trancheUnits.length - 1, currentLessonId);
                    const nextCanonical = trancheUnits[nextIndex]?.id || currentCanonicalId;
                    
                    studentStateService.completeUnit(
                      user?.uid || 'guest',
                      'astro',
                      currentCanonicalId,
                      Math.round((score / total) * 100),
                      res.xpGained,
                      nextCanonical
                    );
                    return res;
                  }}
                  onGoToNextLesson={() => {
                    const nextId = Math.min(trancheUnits.length, currentLessonId + 1);
                    handleSelectLesson(nextId);
                    setActiveTab('learn');
                  }}
                  onGoTo3D={() => setActiveTab('explore')}
                />
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 3: SIMULADOR 3D FOTORREALISTA */}
        {activeTab === 'explore' && (
          <div className="flex-1 relative w-full h-full overflow-hidden">
            <Cosmos3DCanvas 
              onBackToGoals={onBackToGoals} 
              onOpenProfile={onOpenProfile} 
              showControls={true} 
            />
          </div>
        )}

      </div>

      {/* TIRADOR DE AUTOPLEGADO PARA MODO EXPLORAR 3D */}
      <div className="relative shrink-0 flex flex-col items-center">
        {activeTab === 'explore' && (
          <div className="absolute -top-7 z-50 flex justify-center w-full pointer-events-none">
            <button
              onClick={() => setIsBottomNavCollapsed(!isBottomNavCollapsed)}
              className="pointer-events-auto px-4 py-1 rounded-t-xl bg-slate-950/95 hover:bg-slate-900 border-t border-x border-cyan-500/40 text-[11px] font-mono font-extrabold text-cyan-300 backdrop-blur-2xl shadow-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-cyan-950"
              title={isBottomNavCollapsed ? 'Desplegar Barra de Navegación (Lecciones / Tests)' : 'Plegar Barra de Navegación para más espacio 3D'}
              aria-expanded={!isBottomNavCollapsed}
            >
              <span className="text-cyan-400 font-bold">{isBottomNavCollapsed ? '▲' : '▼'}</span>
              <span>{isBottomNavCollapsed ? 'Barra de Navegación' : 'Plegar Barra'}</span>
            </button>
          </div>
        )}

        {/* NAVEGACIÓN INFERIOR DE 3 PESTAÑAS */}
        {!isBottomNavCollapsed && (
          <nav className="w-full flex border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl z-40 shrink-0">
            <button 
              onClick={() => setActiveTab('learn')}
              className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'learn' ? 'text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Lecciones</span>
            </button>

            <button 
              onClick={() => setActiveTab('tests')}
              className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tests' ? 'text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Tests</span>
            </button>

            <button 
              onClick={() => setActiveTab('explore')}
              className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-xs font-bold transition-all cursor-pointer relative ${
                activeTab === 'explore' ? 'text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Explorar 3D</span>
            </button>
          </nav>
        )}
      </div>

    </div>
  );
};

export default AstroExperience;
