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
import { BookOpen, CheckCircle2, Sparkles, ChevronRight, Orbit, Trophy, FlaskConical } from 'lucide-react';

import { TestsCatalogHub } from './components/TestsCatalogHub';
import { CosmicLearningPath } from './components/CosmicLearningPath';

// Componentes del Sistema de Navegación Universal
import { MiniAppSubHeader } from '../../core/components/navigation/MiniAppSubHeader';
import { MiniAppBottomNav, MiniAppPillar } from '../../core/components/navigation/MiniAppBottomNav';
import { MiniAppSubmenuSheet, SubmenuSection } from '../../core/components/navigation/MiniAppSubmenuSheet';
import { ExperienceId } from '../../core/types';

interface AstroExperienceProps {
  onBackToGoals: () => void;
  onOpenProfile: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onNavigateExperience?: (expId: ExperienceId) => void;
}

export const AstroExperience: React.FC<AstroExperienceProps> = ({
  onBackToGoals,
  onOpenProfile,
  onOpenAuth,
  onNavigateExperience
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
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);

  const declaredAge = effectiveAge || userData?.learnerProfile?.education?.age || userData?.childProfile?.age || 9;
  const tranche: AgeTranche = PresentationEngine.getTrancheForAge(declaredAge);
  const allUnits: CurriculumUnit[] = LegacyCurriculumAdapter.getAllAdaptedUnits();
  const trancheUnits: CurriculumUnit[] = AdaptiveCosmosCatalogService.getUnitsForTranche(tranche);

  const astroXP = userData?.experiences?.astro?.xp || userData?.xp || 0;

  // Resolver unidad activa (prioriza allUnits para soportar las 12 lecciones)
  const activeCurriculumUnit: CurriculumUnit | undefined = currentUnitId 
    ? (AdaptiveCosmosCatalogService.getUnitById(currentUnitId) || allUnits.find(u => u.id === currentUnitId))
    : (allUnits[currentLessonId - 1] || allUnits[0]);

  const currentLesson: Lesson = LESSONS.find(l => l.id === currentLessonId) || LESSONS[0];

  const handleSelectLesson = (id: number) => {
    setCurrentLessonId(id);
    const unit = allUnits[id - 1] || allUnits[0];
    if (unit) setCurrentUnitId(unit.id);
    setIsReadingLesson(true);
  };

  const handleSelectUnit = (unitId: string) => {
    setCurrentUnitId(unitId);
    const unit = AdaptiveCosmosCatalogService.getUnitById(unitId) || allUnits.find(u => u.id === unitId);
    if (unit) {
      setCurrentLessonId(unit.canonicalNumber);
    }
    setIsReadingLesson(true);
  };

  const handleSelectTest = (id: number, unitId?: string) => {
    if (unitId) {
      setCurrentUnitId(unitId);
      const unit = AdaptiveCosmosCatalogService.getUnitById(unitId) || allUnits.find(u => u.id === unitId);
      if (unit) {
        setCurrentLessonId(unit.canonicalNumber);
      } else {
        setCurrentLessonId(id);
      }
    } else {
      const unit = allUnits[id - 1] || allUnits[0];
      if (unit) {
        setCurrentUnitId(unit.id);
        setCurrentLessonId(unit.canonicalNumber);
      } else {
        setCurrentLessonId(id);
      }
    }
    setIsTakingTest(true);
  };

  // Mapeo entre Dock y Tabs
  const handleSelectPillar = (pillar: MiniAppPillar) => {
    if (pillar === 'learn') setActiveTab('learn');
    else if (pillar === 'lab') setActiveTab('explore');
    else if (pillar === 'tests') setActiveTab('tests');
  };

  const currentPillar: MiniAppPillar = activeTab === 'learn' ? 'learn' : activeTab === 'explore' ? 'lab' : 'tests';

  // Submenú Desplegable de Cosmos 3D
  const submenuSections: SubmenuSection[] = [
    {
      title: 'Ruta Cósmica (12 Lecciones Teóricas)',
      icon: BookOpen,
      items: LESSONS.map((les) => ({
        id: `astro-les-${les.id}`,
        label: `${les.id}. ${les.title}`,
        description: les.tag,
        icon: BookOpen,
        badge: les.tag,
        isActive: activeTab === 'learn' && isReadingLesson && currentLessonId === les.id,
        isCompleted: ((userData?.experiences?.astro as any)?.completedLessons || []).includes(les.id),
        onClick: () => {
          handleSelectLesson(les.id);
          setActiveTab('learn');
        }
      }))
    },
    {
      title: 'Simulador Espacial 3D NASA',
      icon: Orbit,
      items: [
        {
          id: 'astro-3d-sim',
          label: 'Simulador Espacial WebGL2',
          description: 'Viajes orbitales, telemetría y modelos planetarios 3D',
          icon: Sparkles,
          badge: 'WebGL2',
          isActive: activeTab === 'explore',
          onClick: () => setActiveTab('explore')
        }
      ]
    },
    {
      title: 'Centro de Evaluaciones (12 Tests)',
      icon: Trophy,
      items: [
        {
          id: 'astro-tests-hub',
          label: 'Catálogo de 12 Tests Formativos',
          description: 'Exámenes adaptados por tramo con estrellas y XP',
          icon: Trophy,
          badge: '12 Tests',
          isActive: activeTab === 'tests' && !isTakingTest,
          onClick: () => {
            setIsTakingTest(false);
            setActiveTab('tests');
          }
        }
      ]
    }
  ];

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-60px)] flex flex-col bg-slate-950 overflow-hidden select-none font-display">
      
      {/* ÁREA PRINCIPAL SEGÚN PESTAÑA ACTIVA */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex flex-col">
        
        {/* PESTAÑA 1: LECCIONES TEÓRICAS (12 Lecciones) */}
        {activeTab === 'learn' && (
          <div className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-6 pb-28 scrollbar-thin">
            {!isReadingLesson ? (
              /* RUTA DE APRENDIZAJE CÓSMICA CON TODAS LAS 12 LECCIONES */
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

        {/* PESTAÑA 2: TESTS Y EVALUACIÓN (12 Tests) */}
        {activeTab === 'tests' && (
          <div className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-6 pb-28 scrollbar-thin">
            {!isTakingTest ? (
              /* CENTRO DE EVALUACIONES CON LOS 12 TESTS COMPLETOS */
              <TestsCatalogHub
                units={allUnits}
                lessons={LESSONS}
                onSelectTest={handleSelectTest}
                onGoToLesson={(id, unitId) => {
                  if (unitId) {
                    handleSelectUnit(unitId);
                  }
                  handleSelectLesson(id);
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

      {/* Dock Inferior Ultra-Minimalista de Cosmos 3D con Tirador Plegable */}
      <MiniAppBottomNav
        experienceId="astro"
        isCollapsible={activeTab === 'explore'}
        isCollapsed={isBottomNavCollapsed}
        onToggleCollapse={() => setIsBottomNavCollapsed(!isBottomNavCollapsed)}
        onOpenMenu={() => setIsSubmenuOpen(true)}
        items={[
          {
            id: 'learn',
            label: 'Lecciones',
            icon: BookOpen,
            isActive: activeTab === 'learn',
            onClick: () => setActiveTab('learn')
          },
          {
            id: 'explore',
            label: 'Explorar 3D',
            icon: Sparkles,
            badge: 'WebGL2',
            isActive: activeTab === 'explore',
            onClick: () => setActiveTab('explore')
          },
          {
            id: 'tests',
            label: 'Tests (12)',
            icon: CheckCircle2,
            isActive: activeTab === 'tests',
            onClick: () => setActiveTab('tests')
          }
        ]}
      />

      {/* Submenú Desplegable Discreto hacia arriba */}
      <MiniAppSubmenuSheet
        isOpen={isSubmenuOpen}
        onClose={() => setIsSubmenuOpen(false)}
        experienceId="astro"
        onNavigateExperience={onNavigateExperience}
        onSelectAction={(actionId) => {
          if (actionId === 'learn') setActiveTab('learn');
          if (actionId === 'lab') setActiveTab('explore');
          if (actionId === 'tests') setActiveTab('tests');
          if (actionId.startsWith('mission-') || actionId.startsWith('rover-')) {
            setActiveTab('explore');
          }
        }}
      />

    </div>
  );
};

export default AstroExperience;
