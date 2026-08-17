import React, { useState } from 'react';
import { useProgress } from '../../core/context/ProgressContext';
import { useAuth } from '../../core/context/AuthContext';
import { CRITERIO_MODULES } from './data/modulesData';
import { CriterioModule, CriterioAgeBracket, CriterioCompetencyId } from './types';
import { CriterioHero } from './components/CriterioHero';
import { ModuleCard } from './components/ModuleCard';
import { ModuleViewerModal } from './components/ModuleViewerModal';
import { FeedSimulatorLab } from './components/FeedSimulatorLab';
import { TrainingMissionsModal } from './components/TrainingMissionsModal';
import { AIFilterLabModal } from './components/AIFilterLabModal';
import { MatizaToolModal } from './components/MatizaToolModal';
import { 
  Lock, BookOpen, FlaskConical, Trophy, Shield, Sparkles, 
  Radio, Compass, CheckCircle2, Layers 
} from 'lucide-react';

// Componentes del Sistema de Navegación Universal
import { MiniAppSubHeader } from '../../core/components/navigation/MiniAppSubHeader';
import { MiniAppBottomNav, MiniAppPillar } from '../../core/components/navigation/MiniAppBottomNav';
import { MiniAppSubmenuSheet, SubmenuSection } from '../../core/components/navigation/MiniAppSubmenuSheet';
import { ExperienceId } from '../../core/types';

export type CriterioTab = 'modules' | 'feed_lab' | 'missions' | 'ai_lab' | 'matiza';

interface CriterioExperienceProps {
  onBackToGoals?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onNavigateExperience?: (expId: ExperienceId) => void;
}

export const CriterioExperience: React.FC<CriterioExperienceProps> = ({ onBackToGoals, onOpenAuth, onNavigateExperience }) => {
  const { userData, addXP } = useProgress();
  const { user } = useAuth();
  const isAuthenticated = !!(user && !user.isAnonymous);

  const [activeTab, setActiveTab] = useState<CriterioTab>('modules');
  const [ageBracket, setAgeBracket] = useState<CriterioAgeBracket>('10-12');
  const [selectedCompetency, setSelectedCompetency] = useState<CriterioCompetencyId | null>(null);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);

  const [activeViewingModule, setActiveViewingModule] = useState<CriterioModule | null>(null);
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('goals_criterio_completed_modules');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleCompleteModule = (moduleId: number, xpReward: number) => {
    if (!completedModuleIds.includes(moduleId)) {
      const next = [...completedModuleIds, moduleId];
      setCompletedModuleIds(next);
      localStorage.setItem('goals_criterio_completed_modules', JSON.stringify(next));
    }
    addXP(xpReward, 'verify', `Completado Módulo de Criterio #${moduleId}`);
    setActiveViewingModule(null);
  };

  const handleAddXP = (amount: number, reason: string) => {
    addXP(amount, 'verify', reason);
  };

  // Filtrado de Módulos según la competencia seleccionada en el radar
  const displayedModules = selectedCompetency
    ? CRITERIO_MODULES.filter((m) => m.competency === selectedCompetency)
    : CRITERIO_MODULES;

  const criterioXP = userData.experiences?.verify?.xp || 0;
  const criterioScore = Math.min(100, Math.round((completedModuleIds.length / CRITERIO_MODULES.length) * 100) + 40);

  // Mapeo entre Dock y Tabs
  const handleSelectPillar = (pillar: MiniAppPillar) => {
    if (pillar === 'learn') setActiveTab('modules');
    else if (pillar === 'lab') setActiveTab('feed_lab');
    else if (pillar === 'tests') setActiveTab('missions');
  };

  const currentPillar: MiniAppPillar = 
    activeTab === 'modules' ? 'learn' :
    ['feed_lab', 'ai_lab', 'matiza'].includes(activeTab) ? 'lab' : 'tests';

  // Submenú Desplegable de Criterio
  const submenuSections: SubmenuSection[] = [
    {
      title: 'Módulos Curriculares (12 Lecciones)',
      icon: BookOpen,
      items: [
        {
          id: 'modules-all',
          label: 'Catálogo de Módulos',
          description: `${completedModuleIds.length} de ${CRITERIO_MODULES.length} lecciones completadas`,
          icon: BookOpen,
          badge: `${completedModuleIds.length}/${CRITERIO_MODULES.length}`,
          isActive: activeTab === 'modules',
          onClick: () => setActiveTab('modules')
        }
      ]
    },
    {
      title: 'Laboratorios & Simuladores Forenses',
      icon: FlaskConical,
      items: [
        {
          id: 'tab-feed-lab',
          label: 'Simulador de Feed & Algoritmos',
          description: 'Descubre cómo los algoritmos optimizan la retención',
          icon: Radio,
          badge: 'Simulador',
          isActive: activeTab === 'feed_lab',
          onClick: () => setActiveTab('feed_lab')
        },
        {
          id: 'tab-ai-lab',
          label: 'Laboratorio Forense de IA',
          description: 'Detección de contenido sintético, deepfakes y sesgos',
          icon: Sparkles,
          badge: 'Forense',
          isActive: activeTab === 'ai_lab',
          onClick: () => setActiveTab('ai_lab')
        },
        {
          id: 'tab-matiza',
          label: 'Herramienta MATIZA',
          description: 'Pensamiento en escala de grises y polarización',
          icon: Layers,
          badge: 'Rigor',
          isActive: activeTab === 'matiza',
          onClick: () => setActiveTab('matiza')
        }
      ]
    },
    {
      title: 'Misiones de Entrenamiento',
      icon: Trophy,
      items: [
        {
          id: 'tab-missions',
          label: '60 Misiones Gamificadas (PAUSA)',
          description: 'Entrenamiento procedimental de verificación y fuentes',
          icon: Trophy,
          badge: '60 Retos',
          isActive: activeTab === 'missions',
          onClick: () => setActiveTab('missions')
        }
      ]
    }
  ];

  return (
    <div className="w-full space-y-5 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 pb-28 font-display text-slate-100">
      
      {/* Banner de Navegación Libre si no está autenticado */}
      {!isAuthenticated && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-wrap items-center justify-between gap-3 text-amber-300 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Modo Libre: Explora CRITERIO. Inicia sesión para guardar tu racha, XP y certificados de rigor.</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenAuth?.('signup')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0 transition-all text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Desbloquear Todo</span>
          </button>
        </div>
      )}

      {/* Selector Compacto de Tramo de Edad */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Tramo:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['6-9', '10-12', '13-16'] as CriterioAgeBracket[]).map((bracket) => {
              const isSel = ageBracket === bracket;
              return (
                <button
                  key={bracket}
                  type="button"
                  onClick={() => setAgeBracket(bracket)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSel
                      ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {bracket} años
                </button>
              );
            })}
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-amber-500/10 border border-amber-500/30 text-amber-300">
          SALA DE RIGOR
        </span>
      </div>

      {/* Barra Rápida de Secciones */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'modules', label: '12 Módulos de Rigor', icon: BookOpen },
          { id: 'feed_lab', label: 'Simulador de Feed', icon: Radio },
          { id: 'missions', label: '60 Misiones PAUSA', icon: Trophy },
          { id: 'ai_lab', label: 'Lab IA Forense', icon: Sparkles },
          { id: 'matiza', label: 'Herramienta MATIZA', icon: Layers }
        ].map((tab) => {
          const Icon = tab.icon;
          const isAct = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as CriterioTab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isAct
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-black scale-102'
                  : 'bg-slate-900/80 text-slate-400 hover:text-amber-300 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido Condicional según la Pestaña Activa */}
      {activeTab === 'modules' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Hero y Radar de Competencias */}
          <CriterioHero
            onStartDailyMission={() => setActiveTab('missions')}
            onOpenFeedLab={() => setActiveTab('feed_lab')}
            onOpenMatiza={() => setActiveTab('matiza')}
            onSelectCompetencyFilter={setSelectedCompetency}
            selectedCompetency={selectedCompetency}
            criterioScore={criterioScore}
          />

          {/* Grid de los 12 Módulos Pedagógicos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base sm:text-lg text-white">
                Módulos de Alfabetización Informativa
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Mostrando {displayedModules.length} de {CRITERIO_MODULES.length} lecciones
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayedModules.map((module) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  isCompleted={completedModuleIds.includes(module.id)}
                  onOpenModule={(mod) => setActiveViewingModule(mod)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pestaña: Simulador de Feed y Algoritmos */}
      {activeTab === 'feed_lab' && (
        <FeedSimulatorLab onAddXP={handleAddXP} />
      )}

      {/* Pestaña: 60 Misiones Gamificadas con Método PAUSA */}
      {activeTab === 'missions' && (
        <TrainingMissionsModal onAddXP={handleAddXP} />
      )}

      {/* Pestaña: Laboratorio Forense de IA */}
      {activeTab === 'ai_lab' && (
        <AIFilterLabModal onAddXP={handleAddXP} />
      )}

      {/* Pestaña: Laboratorio MATIZA */}
      {activeTab === 'matiza' && (
        <MatizaToolModal onAddXP={handleAddXP} />
      )}

      {/* Modal Visor Socrático de Lecciones */}
      {activeViewingModule && (
        <ModuleViewerModal
          module={activeViewingModule}
          onClose={() => setActiveViewingModule(null)}
          onCompleteModule={handleCompleteModule}
        />
      )}

      {/* Dock Inferior Ultra-Minimalista de Criterio (5 Pestañas Dinámicas) */}
      <MiniAppBottomNav
        experienceId="verify"
        onOpenMenu={() => setIsSubmenuOpen(true)}
        items={[
          {
            id: 'modules',
            label: '12 Módulos',
            icon: BookOpen,
            isActive: activeTab === 'modules',
            onClick: () => setActiveTab('modules')
          },
          {
            id: 'feed_lab',
            label: 'Feed Lab',
            icon: Radio,
            isActive: activeTab === 'feed_lab',
            onClick: () => setActiveTab('feed_lab')
          },
          {
            id: 'missions',
            label: '60 Misiones',
            icon: Trophy,
            badge: '60',
            isActive: activeTab === 'missions',
            onClick: () => setActiveTab('missions')
          },
          {
            id: 'ai_lab',
            label: 'IA Forense',
            icon: Sparkles,
            isActive: activeTab === 'ai_lab',
            onClick: () => setActiveTab('ai_lab')
          },
          {
            id: 'matiza',
            label: 'MATIZA',
            icon: Layers,
            isActive: activeTab === 'matiza',
            onClick: () => setActiveTab('matiza')
          }
        ]}
      />

      {/* Submenú Desplegable Discreto hacia arriba */}
      <MiniAppSubmenuSheet
        isOpen={isSubmenuOpen}
        onClose={() => setIsSubmenuOpen(false)}
        experienceId="verify"
        onNavigateExperience={onNavigateExperience}
        onSelectAction={(actionId) => {
          if (actionId === 'learn') setActiveTab('modules');
          if (actionId === 'feed') setActiveTab('feed_lab');
          if (actionId === 'missions') setActiveTab('missions');
          if (actionId === 'lab') setActiveTab('ai_lab');
          if (actionId === 'matiza') setActiveTab('matiza');
        }}
      />

    </div>
  );
};

export default CriterioExperience;
