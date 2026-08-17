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
import { AILabHero } from './components/AILabHero';
import { AILabModuleCard } from './components/AILabModuleCard';
import { AILabModuleViewerModal } from './components/AILabModuleViewerModal';
import { NeuralNetworkVisualizer } from './components/NeuralNetworkVisualizer';
import { TokenFlowLab } from './components/TokenFlowLab';
import { ComputerVisionLab } from './components/ComputerVisionLab';
import { HallucinationHunterLab } from './components/HallucinationHunterLab';
import { BiasAndEthicsLab } from './components/BiasAndEthicsLab';
import { CreativeAIStudio } from './components/CreativeAIStudio';
import { 
  Lock, BookOpen, FlaskConical, Trophy, Brain, Cpu, 
  Eye, Search, Sparkles, ShieldAlert, Palette 
} from 'lucide-react';

// Componentes del Sistema de Navegación Universal
import { MiniAppSubHeader } from '../../core/components/navigation/MiniAppSubHeader';
import { MiniAppBottomNav, MiniAppPillar } from '../../core/components/navigation/MiniAppBottomNav';
import { MiniAppSubmenuSheet, SubmenuSection } from '../../core/components/navigation/MiniAppSubmenuSheet';
import { ExperienceId } from '../../core/types';

interface AILabExperienceProps {
  onBackToGoals?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onNavigateExperience?: (expId: ExperienceId) => void;
}

export const AILabExperience: React.FC<AILabExperienceProps> = ({ onBackToGoals, onOpenAuth, onNavigateExperience }) => {
  const { userData, addXP } = useProgress();
  const { user } = useAuth();
  const isAuthenticated = !!(user && !user.isAnonymous);

  const [activeTab, setActiveTab] = useState<AITab>('modules');
  const [ageBracket, setAgeBracket] = useState<AIAgeBracket>('10-12');
  const [selectedCompetency, setSelectedCompetency] = useState<AICompetencyId | null>(null);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState<boolean>(false);

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

  // Mapeo entre Dock y Tabs
  const handleSelectPillar = (pillar: MiniAppPillar) => {
    if (pillar === 'learn') setActiveTab('modules');
    else if (pillar === 'lab') setActiveTab('neural_lab');
    else if (pillar === 'tests') setActiveTab('ethics_bias');
  };

  const currentPillar: MiniAppPillar = 
    activeTab === 'modules' ? 'learn' :
    ['neural_lab', 'token_lab', 'vision_lab', 'hallucinations', 'creative_studio'].includes(activeTab) ? 'lab' : 'tests';

  // Submenú Desplegable de IA Lab
  const submenuSections: SubmenuSection[] = [
    {
      title: 'Currículo de Inteligencia Artificial (12 Lecciones)',
      icon: BookOpen,
      items: [
        {
          id: 'ai-modules-all',
          label: 'Módulos Curriculares de IA',
          description: `${completedModuleIds.length} de ${AI_LAB_MODULES.length} lecciones completadas`,
          icon: BookOpen,
          badge: `${completedModuleIds.length}/${AI_LAB_MODULES.length}`,
          isActive: activeTab === 'modules',
          onClick: () => setActiveTab('modules')
        }
      ]
    },
    {
      title: '5 Laboratorios Interactivos',
      icon: FlaskConical,
      items: [
        {
          id: 'lab-neural',
          label: 'Red Neuronal 2D (Canvas)',
          description: 'Visualizador interactivo de capas densas y propagación',
          icon: Brain,
          badge: 'Simulador 2D',
          isActive: activeTab === 'neural_lab',
          onClick: () => setActiveTab('neural_lab')
        },
        {
          id: 'lab-tokens',
          label: 'Flujo de Tokens & LLM',
          description: 'Tokenización en tiempo real y probabilidades softmax',
          icon: Cpu,
          badge: 'LLM Lab',
          isActive: activeTab === 'token_lab',
          onClick: () => setActiveTab('token_lab')
        },
        {
          id: 'lab-vision',
          label: 'Visión & Convolución',
          description: 'Filtros convolucionales sobre matrices de píxeles',
          icon: Eye,
          badge: 'Computer Vision',
          isActive: activeTab === 'vision_lab',
          onClick: () => setActiveTab('vision_lab')
        },
        {
          id: 'lab-hallucinations',
          label: 'Caza-Alucinaciones Forense',
          description: 'Auditoría de respuestas sintéticas y verificación',
          icon: Search,
          badge: 'Forense',
          isActive: activeTab === 'hallucinations',
          onClick: () => setActiveTab('hallucinations')
        },
        {
          id: 'lab-creative',
          label: 'Creative AI Studio',
          description: 'Generación asistida y experimentación multimodal',
          icon: Palette,
          badge: 'Creative Lab',
          isActive: activeTab === 'creative_studio',
          onClick: () => setActiveTab('creative_studio')
        }
      ]
    },
    {
      title: 'Ética, Sesgos & Auditoría',
      icon: Trophy,
      items: [
        {
          id: 'tab-ethics',
          label: 'Laboratorio de Sesgos & Dilemas Éticos',
          description: 'Auditoría algorítmica y alineamiento de valores',
          icon: ShieldAlert,
          badge: 'Ética & IA',
          isActive: activeTab === 'ethics_bias',
          onClick: () => setActiveTab('ethics_bias')
        }
      ]
    }
  ];

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

      {/* Selector Compacto de Tramo de Edad */}
      <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Tramo:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['6-9', '10-12', '13-16'] as AIAgeBracket[]).map((bracket) => {
              const isSel = ageBracket === bracket;
              return (
                <button
                  key={bracket}
                  type="button"
                  onClick={() => setAgeBracket(bracket)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSel
                      ? 'bg-purple-600 text-white font-black shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {bracket} años
                </button>
              );
            })}
          </div>
        </div>

        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-purple-500/10 border border-purple-500/30 text-purple-300">
          LABORATORIO IA
        </span>
      </div>

      {/* Barra Rápida de Secciones */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'modules', label: '12 Módulos Curriculares', icon: BookOpen },
          { id: 'neural_lab', label: 'Red Neuronal 2D', icon: Brain },
          { id: 'token_lab', label: 'Flujo de Tokens', icon: Cpu },
          { id: 'vision_lab', label: 'Visión Convolucional', icon: Eye },
          { id: 'hallucinations', label: 'Caza-Alucinaciones', icon: Search },
          { id: 'ethics_bias', label: 'Sesgos & Ética', icon: ShieldAlert },
          { id: 'creative_studio', label: 'Creative Studio', icon: Palette }
        ].map((tab) => {
          const Icon = tab.icon;
          const isAct = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AITab)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isAct
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25 font-black scale-102'
                  : 'bg-slate-900/80 text-slate-400 hover:text-purple-300 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

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

      {/* Dock Inferior Ultra-Minimalista de IA Lab (5 Pestañas Dinámicas) */}
      <MiniAppBottomNav
        experienceId="ai-lab"
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
            id: 'neural_lab',
            label: 'Red 2D',
            icon: Brain,
            isActive: activeTab === 'neural_lab',
            onClick: () => setActiveTab('neural_lab')
          },
          {
            id: 'vision_lab',
            label: 'Visión CNN',
            icon: Eye,
            isActive: activeTab === 'vision_lab',
            onClick: () => setActiveTab('vision_lab')
          },
          {
            id: 'hallucinations',
            label: 'Alucinaciones',
            icon: Search,
            isActive: activeTab === 'hallucinations',
            onClick: () => setActiveTab('hallucinations')
          },
          {
            id: 'ethics_bias',
            label: 'Ética & Sesgos',
            icon: ShieldAlert,
            isActive: activeTab === 'ethics_bias',
            onClick: () => setActiveTab('ethics_bias')
          }
        ]}
      />

      {/* Submenú Desplegable Discreto hacia arriba */}
      <MiniAppSubmenuSheet
        isOpen={isSubmenuOpen}
        onClose={() => setIsSubmenuOpen(false)}
        experienceId="ai-lab"
        onNavigateExperience={onNavigateExperience}
        onSelectAction={(actionId) => {
          if (actionId === 'learn') setActiveTab('modules');
          if (actionId === 'neural') setActiveTab('neural_lab');
          if (actionId === 'vision') setActiveTab('vision_lab');
          if (actionId === 'hallucination') setActiveTab('hallucinations');
          if (actionId === 'ethics') setActiveTab('ethics_bias');
        }}
      />

    </div>
  );
};

export default AILabExperience;
