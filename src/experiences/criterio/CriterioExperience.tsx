import React, { useState } from 'react';
import { useProgress } from '../../core/context/ProgressContext';
import { useAuth } from '../../core/context/AuthContext';
import { CRITERIO_MODULES } from './data/modulesData';
import { CriterioModule, CriterioAgeBracket, CriterioCompetencyId } from './types';
import { CriterioHeader, CriterioTab } from './components/CriterioHeader';
import { CriterioHero } from './components/CriterioHero';
import { ModuleCard } from './components/ModuleCard';
import { ModuleViewerModal } from './components/ModuleViewerModal';
import { FeedSimulatorLab } from './components/FeedSimulatorLab';
import { TrainingMissionsModal } from './components/TrainingMissionsModal';
import { AIFilterLabModal } from './components/AIFilterLabModal';
import { MatizaToolModal } from './components/MatizaToolModal';
import { Lock } from 'lucide-react';

interface CriterioExperienceProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const CriterioExperience: React.FC<CriterioExperienceProps> = ({ onOpenAuth }) => {
  const { userData, addXP, isLessonUnlocked } = useProgress();
  const { user } = useAuth();
  const isAuthenticated = !!(user && !user.isAnonymous);

  const [activeTab, setActiveTab] = useState<CriterioTab>('modules');
  const [ageBracket, setAgeBracket] = useState<CriterioAgeBracket>('10-12');
  const [selectedCompetency, setSelectedCompetency] = useState<CriterioCompetencyId | null>(null);

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

      {/* Cabecera Principal y Selector de Pestañas de Criterio */}
      <CriterioHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        ageBracket={ageBracket}
        onChangeAgeBracket={setAgeBracket}
        criterioXP={criterioXP}
        completedModulesCount={completedModuleIds.length}
        totalModulesCount={CRITERIO_MODULES.length}
      />

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

    </div>
  );
};
