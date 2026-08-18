/**
 * GOALS 3D Cosmos - AstroExperience (Orquestador React Modular)
 * Gestiona de forma limpia las 3 pestañas principales de la experiencia:
 * 1. [📖 Lecciones]: Catálogo y lectura teórica paso a paso adaptada por tramos (6-15 años).
 * 2. [🎯 Tests]: Evaluaciones formativas con XP y estrellas adaptadas al nivel escolar.
 * 3. [🌌 Explorar 3D]: Simulador 3D espacial WebGL2 con controles y telemetría.
 * 
 * Integraciones Agénticas:
 * - DynamicExercisePlayer: Cálculos orbitales y retos dinámicos generados por IA real.
 * - VisualKnowledgeBoard: Infografías conceptuales visuales de planetas, constelaciones y distancias.
 * - Mascot Spatial Registry: Atributos data-mascot-target para navegación física de la mascota.
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
import { 
  BookOpen, CheckCircle2, Sparkles, Orbit, Trophy, 
  Zap, Loader2
} from 'lucide-react';

import { TestsCatalogHub } from './components/TestsCatalogHub';
import { CosmicLearningPath } from './components/CosmicLearningPath';

// Integración Agéntica de Ejercicios e Infografías
import { DynamicExerciseEngine } from '../../core/services/DynamicExerciseEngine';
import { DynamicExerciseBatch } from '../../core/types/dynamicExercise';
import { DynamicExercisePlayer } from '../../core/components/exercises/DynamicExercisePlayer';
import { InfographicAgentService } from '../../core/services/InfographicAgentService';
import { EducationalInfographicPayload } from '../../core/types/visualInfographic';
import { VisualKnowledgeBoard } from '../../core/components/infographics/VisualKnowledgeBoard';

// Componentes del Sistema de Navegación Universal
import { MiniAppBottomNav } from '../../core/components/navigation/MiniAppBottomNav';
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
  onNavigateExperience
}) => {
  const { user } = useAuth();
  const { userData, finishTest, completeStep, isTestUnlocked, showToast, effectiveAge } = useProgress();

  // Pestaña activa ('learn' | 'tests' | 'explore')
  const [activeTab, setActiveTab] = useState<'learn' | 'tests' | 'explore'>('explore');
  const [currentLessonId, setCurrentLessonId] = useState<number>(1);
  const [currentUnitId, setCurrentUnitId] = useState<string | null>(null);
  const [isReadingLesson, setIsReadingLesson] = useState<boolean>(false);
  const [isTakingTest, setIsTakingTest] = useState<boolean>(false);
  const [isBottomNavCollapsed, setIsBottomNavCollapsed] = useState<boolean>(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);

  // Estados de Motor Agéntico (Ejercicios Dinámicos e Infografías IA)
  const [dynamicBatch, setDynamicBatch] = useState<DynamicExerciseBatch | null>(null);
  const [isGeneratingExercises, setIsGeneratingExercises] = useState<boolean>(false);
  const [infographicData, setInfographicData] = useState<EducationalInfographicPayload | null>(null);
  const [isGeneratingInfographic, setIsGeneratingInfographic] = useState<boolean>(false);

  const declaredAge = effectiveAge || userData?.learnerProfile?.education?.age || userData?.childProfile?.age || 9;
  const tranche: AgeTranche = PresentationEngine.getTrancheForAge(declaredAge);
  const allUnits: CurriculumUnit[] = LegacyCurriculumAdapter.getAllAdaptedUnits();
  const trancheUnits: CurriculumUnit[] = AdaptiveCosmosCatalogService.getUnitsForTranche(tranche);

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
    // Limpiar overlays agénticos para ver la lección
    setDynamicBatch(null);
    setInfographicData(null);
  };

  const handleSelectUnit = (unitId: string) => {
    setCurrentUnitId(unitId);
    const unit = AdaptiveCosmosCatalogService.getUnitById(unitId) || allUnits.find(u => u.id === unitId);
    if (unit) {
      setCurrentLessonId(unit.canonicalNumber);
    }
    setIsReadingLesson(true);
    setDynamicBatch(null);
    setInfographicData(null);
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
    setDynamicBatch(null);
    setInfographicData(null);
  };

  // Generador Agéntico de Ejercicios y Retos Celestes
  const handleGenerateExercises = async (customTopic?: string) => {
    const topicToUse = customTopic || currentLesson?.title || 'Leyes de Kepler y Mecánica Celeste';
    setIsGeneratingExercises(true);
    try {
      const batch = await DynamicExerciseEngine.generateExerciseBatch({
        topic: `Astronomía y Física Espacial: ${topicToUse}`,
        discipline: 'astro',
        questionCount: 3,
        allowedTypes: ['choice', 'fill_gap', 'boolean', 'numeric_calc']
      });
      setDynamicBatch(batch);
      setInfographicData(null);
    } catch (err: any) {
      console.error('Error generando ejercicios astronómicos:', err);
      showToast('Error generando retos celestes. Inténtalo de nuevo.');
    } finally {
      setIsGeneratingExercises(false);
    }
  };

  // Generador Agéntico de Infografía Astronómica
  const handleGenerateInfographic = async (customTopic?: string) => {
    const topicToUse = customTopic || currentLesson?.title || 'Estructura del Sistema Solar y Distancias Cósmicas';
    setIsGeneratingInfographic(true);
    try {
      const data = await InfographicAgentService.generateConceptualInfographic(
        'Astronomía',
        topicToUse,
        declaredAge
      );
      setInfographicData(data);
      setDynamicBatch(null);
    } catch (err: any) {
      console.error('Error generando infografía astronómica:', err);
      showToast('Error generando la infografía cósmica.');
    } finally {
      setIsGeneratingInfographic(false);
    }
  };

  // Submenú Desplegable de Cosmos 3D
  const submenuSections: SubmenuSection[] = [
    {
      title: 'Motor Agéntico & Retos IA',
      icon: Sparkles,
      items: [
        {
          id: 'astro-agent-exercises',
          label: '🎯 Retos y Cálculos Orbitales IA',
          description: 'Ejercicios adaptativos con física y cálculo numérico en tiempo real',
          icon: Zap,
          badge: 'IA Real',
          onClick: () => handleGenerateExercises()
        },
        {
          id: 'astro-agent-infographic',
          label: '📊 Infografía Cósmica Interactiva',
          description: 'Pizarrón visual con tarjetas conceptuales y analogías',
          icon: Sparkles,
          badge: 'Agéntico',
          onClick: () => handleGenerateInfographic()
        }
      ]
    },
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
          isActive: activeTab === 'explore' && !dynamicBatch && !infographicData,
          onClick: () => {
            setDynamicBatch(null);
            setInfographicData(null);
            setActiveTab('explore');
          }
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
            setDynamicBatch(null);
            setInfographicData(null);
            setActiveTab('tests');
          }
        }
      ]
    }
  ];

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-60px)] flex flex-col bg-slate-950 overflow-hidden select-none font-display">
      
      {/* BARRA DE HERRAMIENTAS AGÉNTICAS SUPERIOR (CÁLCULOS E INFOGRAFÍAS IA) */}
      <div className="relative z-20 w-full px-3 py-2 bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span className="text-[11px] font-black uppercase tracking-wider text-cyan-300">Cosmos Agentic Engine</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* BOTÓN: GENERAR RETOS Y CÁLCULOS ORBITALES */}
          <button
            type="button"
            onClick={() => handleGenerateExercises()}
            disabled={isGeneratingExercises}
            className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            title="Generar retos y ejercicios de cálculo orbital con IA"
          >
            {isGeneratingExercises ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isGeneratingExercises ? 'Calculando...' : '🎯 Retos & Cálculos IA'}</span>
          </button>

          {/* BOTÓN: GENERAR INFOGRAFÍA CÓSMICA */}
          <button
            type="button"
            onClick={() => handleGenerateInfographic()}
            disabled={isGeneratingInfographic}
            className="px-3 py-1 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
            title="Generar infografía conceptual estructurada con IA"
          >
            {isGeneratingInfographic ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isGeneratingInfographic ? 'Estructurando...' : '📊 Infografía Cósmica IA'}</span>
          </button>
        </div>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 relative w-full h-full overflow-hidden flex flex-col">
        
        {/* OVERLAY AGÉNTICO 1: REPRODUCTOR DE EJERCICIOS DINÁMICOS */}
        {dynamicBatch && (
          <div 
            data-mascot-target="celestial-quiz"
            data-mascot-anchor="top-right"
            data-mascot-label="Retos Celestes y Cálculos Orbitales IA"
            data-mascot-hint="Batería interactiva de ejercicios astronómicos generados en tiempo real"
            className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-6 pb-28 scrollbar-thin z-10 bg-slate-950/95 animate-fadeIn"
          >
            <div className="max-w-4xl mx-auto space-y-4">
              <DynamicExercisePlayer
                batch={dynamicBatch}
                onClose={() => setDynamicBatch(null)}
                onGenerateMore={() => handleGenerateExercises()}
              />
            </div>
          </div>
        )}

        {/* OVERLAY AGÉNTICO 2: PIZARRÓN DE INFOGRAFÍA VISUAL */}
        {infographicData && (
          <div 
            data-mascot-target="astronomy-infographic"
            data-mascot-anchor="top-left"
            data-mascot-label="Pizarrón de Infografías Astronómicas"
            data-mascot-hint="Desglose visual con tarjetas de conceptos, fórmulas y analogías"
            className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-6 pb-28 scrollbar-thin z-10 bg-slate-950/95 animate-fadeIn"
          >
            <div className="max-w-4xl mx-auto space-y-4">
              <VisualKnowledgeBoard
                infographic={infographicData}
                onClose={() => setInfographicData(null)}
                onSelectSubject={() => handleGenerateInfographic()}
              />
            </div>
          </div>
        )}

        {/* PESTAÑA 1: LECCIONES TEÓRICAS (12 Lecciones) */}
        {activeTab === 'learn' && !dynamicBatch && !infographicData && (
          <div 
            data-mascot-target="cosmic-path"
            data-mascot-anchor="top-right"
            data-mascot-label="Ruta de Aprendizaje Cósmica"
            className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-6 pb-28 scrollbar-thin"
          >
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
              <div
                data-mascot-target="lesson-theory"
                data-mascot-anchor="top-left"
                data-mascot-label="Lectura Teórica Interactiva"
              >
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
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA 2: TESTS Y EVALUACIÓN (12 Tests) */}
        {activeTab === 'tests' && !dynamicBatch && !infographicData && (
          <div 
            data-mascot-target="astro-tests-hub"
            data-mascot-anchor="top-right"
            data-mascot-label="Centro de Tests de Astronomía"
            className="flex-1 w-full h-full overflow-y-auto p-3 sm:p-6 pb-28 scrollbar-thin"
          >
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
              <div 
                data-mascot-target="active-test-view"
                data-mascot-anchor="top-right"
                data-mascot-label="Examen Activo de Cosmos"
                className="space-y-4"
              >
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

        {/* PESTAÑA 3: SIMULADOR 3D FOTORREALISTA (ORRERY Y VISOR ESPACIAL) */}
        {activeTab === 'explore' && !dynamicBatch && !infographicData && (
          <div 
            data-mascot-target="orrery-3d"
            data-mascot-anchor="top-right"
            data-mascot-label="Simulador y Orrery 3D"
            data-mascot-hint="Explora planetas, satélites y viaja por el cosmos en WebGL2"
            className="flex-1 relative w-full h-full overflow-hidden"
          >
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
            isActive: activeTab === 'learn' && !dynamicBatch && !infographicData,
            onClick: () => {
              setDynamicBatch(null);
              setInfographicData(null);
              setActiveTab('learn');
            }
          },
          {
            id: 'explore',
            label: 'Explorar 3D',
            icon: Sparkles,
            badge: 'WebGL2',
            isActive: activeTab === 'explore' && !dynamicBatch && !infographicData,
            onClick: () => {
              setDynamicBatch(null);
              setInfographicData(null);
              setActiveTab('explore');
            }
          },
          {
            id: 'tests',
            label: 'Tests (12)',
            icon: CheckCircle2,
            isActive: activeTab === 'tests' && !dynamicBatch && !infographicData,
            onClick: () => {
              setDynamicBatch(null);
              setInfographicData(null);
              setActiveTab('tests');
            }
          }
        ]}
      />

      {/* Submenú Desplegable Discreto hacia arriba */}
      <MiniAppSubmenuSheet
        isOpen={isSubmenuOpen}
        onClose={() => setIsSubmenuOpen(false)}
        experienceId="astro"
        onNavigateExperience={onNavigateExperience}
        submenuSections={submenuSections}
        onSelectAction={(actionId) => {
          if (actionId === 'learn') {
            setDynamicBatch(null);
            setInfographicData(null);
            setActiveTab('learn');
          }
          if (actionId === 'lab') {
            setDynamicBatch(null);
            setInfographicData(null);
            setActiveTab('explore');
          }
          if (actionId === 'tests') {
            setDynamicBatch(null);
            setInfographicData(null);
            setActiveTab('tests');
          }
          if (actionId === 'astro-agent-exercises') {
            handleGenerateExercises();
          }
          if (actionId === 'astro-agent-infographic') {
            handleGenerateInfographic();
          }
          if (actionId.startsWith('mission-') || actionId.startsWith('rover-')) {
            setDynamicBatch(null);
            setInfographicData(null);
            setActiveTab('explore');
          }
        }}
      />

    </div>
  );
};

export default AstroExperience;
