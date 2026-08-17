import React, { useState } from 'react';
import { useProgress } from '../../core/context/ProgressContext';
import { useAuth } from '../../core/context/AuthContext';
import { AI_LAB_MODULES } from './data/aiLabModulesData';
import { 
  AILabModule, 
  AIAgeBracket, 
  AICompetencyId, 
  AITab 
} from './types/aiLabTypes';
import { AILabHeader } from './components/AILabHeader';
import { AILabHero } from './components/AILabHero';
import { AILabModuleCard } from './components/AILabModuleCard';
import { AILabModuleViewerModal } from './components/AILabModuleViewerModal';
import { NeuralNetworkVisualizer } from './components/NeuralNetworkVisualizer';
import { TokenFlowLab } from './components/TokenFlowLab';
import { ComputerVisionLab } from './components/ComputerVisionLab';
import { HallucinationHunterLab } from './components/HallucinationHunterLab';
import { BiasAndEthicsLab } from './components/BiasAndEthicsLab';
import { CreativeAIStudio } from './components/CreativeAIStudio';
import { Lock } from 'lucide-react';

interface AILabExperienceProps {
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const AILabExperience: React.FC<AILabExperienceProps> = ({ onOpenAuth }) => {
  const { userData, addXP } = useProgress();
  const { user } = useAuth();
  const isAuthenticated = !!(user && !user.isAnonymous);

  const [activeTab, setActiveTab] = useState<AITab>('modules');
  const [ageBracket, setAgeBracket] = useState<AIAgeBracket>('10-12');
  const [selectedCompetency, setSelectedCompetency] = useState<AICompetencyId | null>(null);

  const [activeViewingModule, setActiveViewingModule] = useState<AILabModule | null>(null);
  const [completedModuleIds, setCompletedModuleIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('goals_ai_lab_completed_modules');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleCompleteModule = (moduleId: number, xpReward: number) => {
    if (!completedModuleIds.includes(moduleId)) {
      const next = [...completedModuleIds, moduleId];
      setCompletedModuleIds(next);
      localStorage.setItem('goals_ai_lab_completed_modules', JSON.stringify(next));
    }
    addXP(xpReward, 'ai-lab', `Completado Módulo de IA Lab #${moduleId}`);
    setActiveViewingModule(null);
  };

  const handleAddXP = (amount: number, reason: string) => {
    addXP(amount, 'ai-lab', reason);
  };

  // Filtrado de módulos según la competencia seleccionada
  const displayedModules = selectedCompetency
    ? AI_LAB_MODULES.filter((m) => m.competency === selectedCompetency)
    : AI_LAB_MODULES;

  const aiXP = userData.experiences?.aiLab?.xp || userData.xp || 0;
  const aiScore = Math.min(100, Math.round((completedModuleIds.length / AI_LAB_MODULES.length) * 100) + 20);

  return (
    <div className="w-full space-y-5 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 pb-28 font-display text-slate-100">
      
      {/* Banner de Navegación Libre si no está autenticado */}
      {!isAuthenticated && (
        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-wrap items-center justify-between gap-3 text-purple-300 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <Lock className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Modo Libre: Explora IA Lab. Inicia sesión para guardar tu racha, XP y certificados de IA.</span>
          </div>
          <button
            type="button"
            onClick={() => onOpenAuth?.('signup')}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shrink-0 transition-all text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Desbloquear Todo</span>
          </button>
        </div>
      )}

      {/* Cabecera Principal y Selector de Pestañas de IA Lab */}
      <AILabHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        ageBracket={ageBracket}
        onChangeAgeBracket={setAgeBracket}
        aiXP={aiXP}
        completedModulesCount={completedModuleIds.length}
        totalModulesCount={AI_LAB_MODULES.length}
      />

      {/* Pestaña Principal: 12 Módulos Curriculares */}
      {activeTab === 'modules' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Hero y Radar de Habilidades de IA */}
          <AILabHero
            onSelectTab={setActiveTab}
            onSelectCompetencyFilter={setSelectedCompetency}
            selectedCompetency={selectedCompetency}
            aiScore={aiScore}
          />

          {/* Grid de los 12 Módulos Curriculares */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base sm:text-lg text-white">
                Módulos Curriculares de Inteligencia Artificial
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Mostrando {displayedModules.length} de {AI_LAB_MODULES.length} lecciones
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayedModules.map((module) => (
                <AILabModuleCard
                  key={module.id}
                  module={module}
                  ageBracket={ageBracket}
                  isCompleted={completedModuleIds.includes(module.id)}
                  onOpenModule={(mod) => setActiveViewingModule(mod)}
                  onLaunchLab={(tab) => setActiveTab(tab)}
                />
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Pestaña: Simulador de Red Neuronal en Canvas 2D */}
      {activeTab === 'neural_lab' && (
        <NeuralNetworkVisualizer onAddXP={handleAddXP} />
      )}

      {/* Pestaña: Laboratorio de Tokens & LLM */}
      {activeTab === 'token_lab' && (
        <TokenFlowLab onAddXP={handleAddXP} />
      )}

      {/* Pestaña: Laboratorio de Visión & Convolución */}
      {activeTab === 'vision_lab' && (
        <ComputerVisionLab onAddXP={handleAddXP} />
      )}

      {/* Pestaña: Caza-Alucinaciones Forense */}
      {activeTab === 'hallucinations' && (
        <HallucinationHunterLab onAddXP={handleAddXP} />
      )}

      {/* Pestaña: Sesgos & Dilemas Éticos */}
      {activeTab === 'ethics_bias' && (
        <BiasAndEthicsLab onAddXP={handleAddXP} />
      )}

      {/* Pestaña: Estudio de Creación Asistida */}
      {activeTab === 'creative_studio' && (
        <CreativeAIStudio onAddXP={handleAddXP} />
      )}

      {/* Modal de Lectura y Examen de Módulos */}
      <AILabModuleViewerModal
        module={activeViewingModule}
        ageBracket={ageBracket}
        isOpen={!!activeViewingModule}
        onClose={() => setActiveViewingModule(null)}
        onComplete={handleCompleteModule}
        onLaunchLab={(tab) => setActiveTab(tab)}
      />

    </div>
  );
};

export default AILabExperience;
