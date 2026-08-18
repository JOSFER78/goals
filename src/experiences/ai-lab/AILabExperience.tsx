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

// Componentes del Motor Agéntico y Didáctico
import { DynamicExerciseEngine } from '../../core/services/DynamicExerciseEngine';
import { DynamicExerciseBatch } from '../../core/types/dynamicExercise';
import { DynamicExercisePlayer } from '../../core/components/exercises/DynamicExercisePlayer';
import { InfographicAgentService } from '../../core/services/InfographicAgentService';
import { EducationalInfographicPayload } from '../../core/types/visualInfographic';
import { VisualKnowledgeBoard } from '../../core/components/infographics/VisualKnowledgeBoard';
import { askAI } from '../../core/services/aiService';

import { 
  Lock, BookOpen, FlaskConical, Trophy, Brain, Cpu, 
  Eye, Search, Sparkles, ShieldAlert, Palette, Code2, 
  Play, Terminal, Loader2, Zap, RotateCcw, Lightbulb
} from 'lucide-react';

// Componentes del Sistema de Navegación Universal
import { MiniAppBottomNav } from '../../core/components/navigation/MiniAppBottomNav';
import { MiniAppSubmenuSheet, SubmenuSection } from '../../core/components/navigation/MiniAppSubmenuSheet';
import { ExperienceId } from '../../core/types';

// Presets de código para el Code Canvas interactivo
const CODE_PRESETS = [
  {
    id: 'gradient_descent',
    name: 'Descenso de Gradiente 1D',
    description: 'Optimización de pesos minimizando una función de coste f(x) = (x - 4)^2',
    code: `// Descenso de Gradiente 1D
function loss(x) { return Math.pow(x - 4, 2); }
function gradient(x) { return 2 * (x - 4); }

let weight = 0.0; // Peso inicial aleatorio
const lr = 0.1;   // Tasa de aprendizaje (Learning Rate)
const epochs = 15;

console.log("Iniciando optimización. Objetivo: x = 4.0");
for (let epoch = 1; epoch <= epochs; epoch++) {
  const grad = gradient(weight);
  weight = weight - lr * grad;
  const currentLoss = loss(weight);
  console.log(\`Época \${epoch}: Peso = \${weight.toFixed(4)}, Pérdida (Loss) = \${currentLoss.toFixed(6)}\`);
}
console.log("¡Convergencia alcanzada!");`
  },
  {
    id: 'bpe_tokenizer',
    name: 'Tokenizador de Fusión de Pares (BPE)',
    description: 'Fusión de bigramas más frecuentes para construir vocabulario',
    code: `// Tokenizador Byte Pair Encoding (BPE Básico)
const text = "la red neuronal aprende y la red predice";
const tokens = text.split(" ");

console.log("Tokens iniciales:", tokens);

// Contar pares de palabras adyacentes
const pairCounts = {};
for (let i = 0; i < tokens.length - 1; i++) {
  const pair = tokens[i] + "_" + tokens[i + 1];
  pairCounts[pair] = (pairCounts[pair] || 0) + 1;
}

console.log("Frecuencias de bigramas:", JSON.stringify(pairCounts, null, 2));
const topPair = Object.keys(pairCounts).reduce((a, b) => pairCounts[a] > pairCounts[b] ? a : b);
console.log(\`Par más frecuente a fusionar en nuevo token: "\${topPair}" (\${pairCounts[topPair]} veces)\`);`
  },
  {
    id: 'agent_bfs',
    name: 'Planificador de Agente (BFS)',
    description: 'Búsqueda en anchura para toma de decisiones autónomas en un grafo de estados',
    code: `// Planificador de Agente Inteligente (BFS Pathfinding)
const graph = {
  'Inicio': ['Percepción_Datos', 'Memoria_Contexto'],
  'Percepción_Datos': ['Limpieza_Tokens', 'Extracción_Features'],
  'Memoria_Contexto': ['Búsqueda_Vectorial'],
  'Extracción_Features': ['Inferencia_LLM'],
  'Búsqueda_Vectorial': ['Inferencia_LLM'],
  'Inferencia_LLM': ['Ejecutar_Herramienta', 'Respuesta_Final'],
  'Ejecutar_Herramienta': ['Respuesta_Final'],
  'Respuesta_Final': []
};

function bfsAgentPlan(start, goal) {
  const queue = [[start]];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const path = queue.shift();
    const node = path[path.length - 1];

    if (node === goal) return path;

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  return null;
}

const plan = bfsAgentPlan('Inicio', 'Respuesta_Final');
console.log("Ruta óptima del Agente:", plan.join(" ➔ "));`
  }
];

interface AILabExperienceProps {
  onBackToGoals?: () => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
  onNavigateExperience?: (expId: ExperienceId) => void;
}

export const AILabExperience: React.FC<AILabExperienceProps> = ({ onOpenAuth, onNavigateExperience }) => {
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

  // Estados del Motor Agéntico Dinámico
  const [dynamicBatch, setDynamicBatch] = useState<DynamicExerciseBatch | null>(null);
  const [isGeneratingExercises, setIsGeneratingExercises] = useState<boolean>(false);
  const [infographicData, setInfographicData] = useState<EducationalInfographicPayload | null>(null);
  const [isGeneratingInfographic, setIsGeneratingInfographic] = useState<boolean>(false);

  // Estados del Canvas de Código y Algoritmos
  const [selectedPresetId, setSelectedPresetId] = useState<string>('gradient_descent');
  const [codeSource, setCodeSource] = useState<string>(CODE_PRESETS[0].code);
  const [codeOutput, setCodeOutput] = useState<string[]>([]);
  const [isCodeRunning, setIsCodeRunning] = useState<boolean>(false);
  const [codeAIExplanation, setCodeAIExplanation] = useState<string | null>(null);
  const [isAskingCodeAI, setIsAskingCodeAI] = useState<boolean>(false);

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

  // Generador Real de Ejercicios Dinámicos por IA
  const handleGenerateExercises = async (customTopic?: string) => {
    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }
    const topicToUse = customTopic || 'Redes Neuronales, Algoritmos de Búsqueda y Lógica de Inteligencia Artificial';
    setIsGeneratingExercises(true);
    try {
      const batch = await DynamicExerciseEngine.generateExerciseBatch({
        topic: topicToUse,
        discipline: 'ai-lab',
        questionCount: 4,
        allowedTypes: ['choice', 'fill_gap', 'boolean', 'numeric_calc']
      });
      setDynamicBatch(batch);
      setInfographicData(null);
    } catch (err: any) {
      console.error('Error generando ejercicios dinámicos de IA:', err);
    } finally {
      setIsGeneratingExercises(false);
    }
  };

  // Generador Real de Infografía Agéntica por IA
  const handleGenerateInfographic = async (customTopic?: string) => {
    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }
    const topicToUse = customTopic || 'Arquitectura de Redes Neuronales, Mecanismo de Atención en Transformers y Lógica de Agentes Autónomos';
    setIsGeneratingInfographic(true);
    try {
      const data = await InfographicAgentService.generateConceptualInfographic(
        'Inteligencia Artificial y Redes Neuronales',
        topicToUse
      );
      setInfographicData(data);
      setDynamicBatch(null);
    } catch (err: any) {
      console.error('Error generando infografía de IA:', err);
    } finally {
      setIsGeneratingInfographic(false);
    }
  };

  // Ejecutor Real de Código en Sandbox de Navegador
  const handleRunCode = () => {
    setIsCodeRunning(true);
    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => {
        logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      },
      error: (...args: any[]) => {
        logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      },
      warn: (...args: any[]) => {
        logs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      }
    };

    try {
      const runFn = new Function('console', codeSource);
      runFn(customConsole);
      setCodeOutput(logs.length > 0 ? logs : ['Código ejecutado con éxito (sin salidas por consola).']);
      addXP(15, 'ai-lab', 'Ejecución de Algoritmo en Code Canvas');
    } catch (err: any) {
      setCodeOutput([`Error de ejecución: ${err.message}`]);
    } finally {
      setIsCodeRunning(false);
    }
  };

  // Asistente Socrático de Análisis de Código con IA Real
  const handleExplainCodeWithAI = async () => {
    if (!isAuthenticated) {
      onOpenAuth?.('signup');
      return;
    }
    setIsAskingCodeAI(true);
    setCodeAIExplanation(null);
    try {
      const response = await askAI({
        messages: [
          {
            role: 'system',
            content: 'Eres el Tutor Socrático de Algoritmos e IA de GOALS. Analiza el código proporcionado, explica su complejidad Big-O O(n), qué principio de IA ilustra y cómo optimizarlo de forma didáctica para un estudiante.'
          },
          {
            role: 'user',
            content: `Analiza este código de IA:\n\`\`\`javascript\n${codeSource}\n\`\`\``
          }
        ]
      });
      setCodeAIExplanation(response);
      addXP(20, 'ai-lab', 'Consulta Socrática de Algoritmos con IA');
    } catch (err: any) {
      setCodeAIExplanation(`Error al consultar con el Tutor de IA: ${err.message}`);
    } finally {
      setIsAskingCodeAI(false);
    }
  };

  // Filtrado de módulos según la competencia seleccionada
  const displayedModules = selectedCompetency
    ? AI_LAB_MODULES.filter((m) => m.competency === selectedCompetency)
    : AI_LAB_MODULES;

  const aiScore = Math.min(100, Math.round((completedModuleIds.length / AI_LAB_MODULES.length) * 100) + 20);

  // Submenú Desplegable de IA Lab
  const submenuSections: SubmenuSection[] = [
    {
      title: 'Currículo de Inteligencia Artificial',
      icon: BookOpen,
      items: [
        {
          id: 'ai-modules-all',
          label: '12 Módulos Curriculares',
          description: `${completedModuleIds.length} de ${AI_LAB_MODULES.length} lecciones completadas`,
          icon: BookOpen,
          badge: `${completedModuleIds.length}/${AI_LAB_MODULES.length}`,
          isActive: activeTab === 'modules',
          onClick: () => { setActiveTab('modules'); setDynamicBatch(null); setInfographicData(null); }
        }
      ]
    },
    {
      title: 'Laboratorios & Canvas de Algoritmos',
      icon: FlaskConical,
      items: [
        {
          id: 'lab-code-canvas',
          label: 'Canvas de Código & Algoritmos',
          description: 'Sandbox interactivo con Descenso de Gradiente, BPE y Planificadores',
          icon: Code2,
          badge: 'Sandbox JS',
          isActive: activeTab === 'creative_studio' && !dynamicBatch && !infographicData,
          onClick: () => { setActiveTab('creative_studio'); setDynamicBatch(null); setInfographicData(null); }
        },
        {
          id: 'lab-neural',
          label: 'Red Neuronal 2D (Canvas)',
          description: 'Visualizador interactivo de capas densas y backpropagation',
          icon: Brain,
          badge: 'Simulador 2D',
          isActive: activeTab === 'neural_lab',
          onClick: () => { setActiveTab('neural_lab'); setDynamicBatch(null); setInfographicData(null); }
        },
        {
          id: 'lab-tokens',
          label: 'Flujo de Tokens & LLM',
          description: 'Tokenización en tiempo real y probabilidades softmax',
          icon: Cpu,
          badge: 'LLM Lab',
          isActive: activeTab === 'token_lab',
          onClick: () => { setActiveTab('token_lab'); setDynamicBatch(null); setInfographicData(null); }
        },
        {
          id: 'lab-vision',
          label: 'Visión & Convolución',
          description: 'Filtros convolucionales sobre matrices de píxeles',
          icon: Eye,
          badge: 'Computer Vision',
          isActive: activeTab === 'vision_lab',
          onClick: () => { setActiveTab('vision_lab'); setDynamicBatch(null); setInfographicData(null); }
        },
        {
          id: 'lab-hallucinations',
          label: 'Caza-Alucinaciones Forense',
          description: 'Auditoría de respuestas sintéticas y verificación',
          icon: Search,
          badge: 'Forense',
          isActive: activeTab === 'hallucinations',
          onClick: () => { setActiveTab('hallucinations'); setDynamicBatch(null); setInfographicData(null); }
        }
      ]
    },
    {
      title: 'Ética & Gobernanza de IA',
      icon: Trophy,
      items: [
        {
          id: 'tab-ethics',
          label: 'Sesgos & Dilemas Éticos (EU AI Act)',
          description: 'Auditoría algorítmica y alineamiento de valores',
          icon: ShieldAlert,
          badge: 'Ética & IA',
          isActive: activeTab === 'ethics_bias',
          onClick: () => { setActiveTab('ethics_bias'); setDynamicBatch(null); setInfographicData(null); }
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

      {/* Selector Compacto de Tramo de Edad y Barra de Acción Agéntica */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl">
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

        {/* Botonera de Acciones Agénticas en Tiempo Real */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleGenerateExercises()}
            disabled={isGeneratingExercises}
            className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
          >
            {isGeneratingExercises ? <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isGeneratingExercises ? 'Generando Retos...' : '🎯 Retos IA'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleGenerateInfographic()}
            disabled={isGeneratingInfographic}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
          >
            {isGeneratingInfographic ? <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" /> : <Sparkles className="w-3.5 h-3.5 text-cyan-300" />}
            <span>{isGeneratingInfographic ? 'Generando Esquema...' : '📊 Diagrama IA'}</span>
          </button>
        </div>
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
          { id: 'creative_studio', label: 'Prompt & Code Studio', icon: Palette }
        ].map((tab) => {
          const Icon = tab.icon;
          const isAct = activeTab === tab.id && !dynamicBatch && !infographicData;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as AITab);
                setDynamicBatch(null);
                setInfographicData(null);
              }}
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

      {/* Renderizado de Batería de Ejercicios Dinámicos de IA */}
      {dynamicBatch && (
        <div 
          data-mascot-target="exercises"
          data-mascot-anchor="top-right"
          data-mascot-label="Retos de Algoritmos & Dinámica IA"
          data-mascot-hint="Desafíos adaptativos generados al vuelo por el motor pedagógico"
          className="space-y-4 animate-fadeIn"
        >
          <DynamicExercisePlayer
            batch={dynamicBatch}
            onClose={() => setDynamicBatch(null)}
            onGenerateMore={() => handleGenerateExercises()}
          />
        </div>
      )}

      {/* Renderizado de Infografía & Diagrama de Flujo Agéntico IA */}
      {infographicData && (
        <div 
          data-mascot-target="infographics"
          data-mascot-anchor="top-left"
          data-mascot-label="Pizarrón de Infografía Visual IA"
          data-mascot-hint="Diagramas de flujo de Transformers, Redes y Agentes"
          className="space-y-4 animate-fadeIn"
        >
          <VisualKnowledgeBoard
            infographic={infographicData}
            onClose={() => setInfographicData(null)}
          />
        </div>
      )}

      {/* Pestaña Principal: 12 Módulos Curriculares */}
      {activeTab === 'modules' && !dynamicBatch && !infographicData && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Hero y Radar de Habilidades de IA */}
          <AILabHero
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setDynamicBatch(null);
              setInfographicData(null);
            }}
            onSelectCompetencyFilter={setSelectedCompetency}
            selectedCompetency={selectedCompetency}
            aiScore={aiScore}
          />

          {/* Grid de los 12 Módulos Curriculares */}
          <div 
            data-mascot-target="curriculum-map"
            data-mascot-anchor="top-right"
            data-mascot-label="Currículo de 12 Lecciones de IA"
            data-mascot-hint="Explora lecciones desde fundamentos hasta modelos multimodales"
            className="space-y-3"
          >
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
                  onLaunchLab={(tab) => {
                    setActiveTab(tab);
                    setDynamicBatch(null);
                    setInfographicData(null);
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Pestaña: Simulador de Red Neuronal en Canvas 2D */}
      {activeTab === 'neural_lab' && !dynamicBatch && !infographicData && (
        <div 
          data-mascot-target="neural-infographics"
          data-mascot-anchor="top-left"
          data-mascot-label="Laboratorio de Redes Neuronales 2D"
          data-mascot-hint="Ajusta pesos, tasas de aprendizaje y límites de decisión"
        >
          <NeuralNetworkVisualizer onAddXP={handleAddXP} />
        </div>
      )}

      {/* Pestaña: Laboratorio de Tokens & LLM */}
      {activeTab === 'token_lab' && !dynamicBatch && !infographicData && (
        <div 
          data-mascot-target="token-flow"
          data-mascot-anchor="top-right"
          data-mascot-label="Laboratorio de Tokens & LLM"
          data-mascot-hint="Tokenización en tiempo real y probabilidades softmax"
        >
          <TokenFlowLab onAddXP={handleAddXP} />
        </div>
      )}

      {/* Pestaña: Laboratorio de Visión & Convolución */}
      {activeTab === 'vision_lab' && !dynamicBatch && !infographicData && (
        <div 
          data-mascot-target="vision-cnn"
          data-mascot-anchor="top-left"
          data-mascot-label="Visión Convolucional & Matrices"
          data-mascot-hint="Filtros de convolución aplicados a matrices de píxeles"
        >
          <ComputerVisionLab onAddXP={handleAddXP} />
        </div>
      )}

      {/* Pestaña: Caza-Alucinaciones Forense */}
      {activeTab === 'hallucinations' && !dynamicBatch && !infographicData && (
        <div 
          data-mascot-target="hallucination-hunter"
          data-mascot-anchor="bottom-right"
          data-mascot-label="Caza-Alucinaciones Forense"
          data-mascot-hint="Auditoría de respuestas sintéticas y verificación de fuentes"
        >
          <HallucinationHunterLab onAddXP={handleAddXP} />
        </div>
      )}

      {/* Pestaña: Sesgos & Dilemas Éticos */}
      {activeTab === 'ethics_bias' && !dynamicBatch && !infographicData && (
        <div 
          data-mascot-target="ethics-dilemmas"
          data-mascot-anchor="top-right"
          data-mascot-label="Sesgos, Ética y EU AI Act"
          data-mascot-hint="Auditoría algorítmica y alineamiento de valores humanos"
        >
          <BiasAndEthicsLab onAddXP={handleAddXP} />
        </div>
      )}

      {/* Pestaña: Estudio de Creación Asistida + Canvas de Código y Algoritmos */}
      {activeTab === 'creative_studio' && !dynamicBatch && !infographicData && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Submódulo 1: Ingeniería de Prompts (RCRF Studio) */}
          <div 
            data-mascot-target="prompt-crafting"
            data-mascot-anchor="top-right"
            data-mascot-label="Ingeniería de Prompts (RCRF)"
            data-mascot-hint="Estructura roles, restricciones y depura alucinaciones"
          >
            <CreativeAIStudio onAddXP={handleAddXP} />
          </div>

          {/* Submódulo 2: Canvas de Código y Algoritmos de IA Interactivos */}
          <div 
            data-mascot-target="code-canvas"
            data-mascot-anchor="top-left"
            data-mascot-label="Canvas de Código y Algoritmos IA"
            data-mascot-hint="Escribe, ejecuta y optimiza algoritmos reales en vivo"
            className="bg-slate-900/90 border border-purple-500/20 rounded-3xl p-5 space-y-4 shadow-xl backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                    <span>Canvas de Código & Algoritmos de IA</span>
                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono">
                      Sandbox JS
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Experimenta con optimización matemática, tokenización y lógica agéntica real.
                  </p>
                </div>
              </div>

              {/* Selector de Presets Algorítmicos */}
              <div className="flex items-center gap-2 flex-wrap">
                {CODE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      setCodeSource(preset.code);
                      setCodeOutput([]);
                      setCodeAIExplanation(null);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedPresetId === preset.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Editor y Terminal de Salida */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Editor de Código */}
              <div className="lg:col-span-7 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Editor JavaScript / TypeScript</span>
                  <button
                    type="button"
                    onClick={() => {
                      const preset = CODE_PRESETS.find(p => p.id === selectedPresetId);
                      if (preset) setCodeSource(preset.code);
                    }}
                    className="flex items-center gap-1 hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Resetear Código</span>
                  </button>
                </div>
                <textarea
                  value={codeSource}
                  onChange={(e) => setCodeSource(e.target.value)}
                  rows={14}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 font-mono text-xs text-purple-200 focus:outline-none focus:border-purple-500/50 shadow-inner resize-y leading-relaxed"
                  spellCheck={false}
                />
                
                {/* Botonera de Ejecución y Consulta IA */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRunCode}
                    disabled={isCodeRunning}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Ejecutar Algoritmo</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExplainCodeWithAI}
                    disabled={isAskingCodeAI}
                    className="px-3.5 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isAskingCodeAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5 text-amber-400" />}
                    <span>💡 Explicación Socrática IA</span>
                  </button>
                </div>
              </div>

              {/* Consola de Salida y Análisis Socrático */}
              <div className="lg:col-span-5 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Consola de Salida (Stdout)</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 font-mono text-xs text-cyan-300 min-h-[160px] max-h-[220px] overflow-y-auto space-y-1 shadow-inner scrollbar-thin">
                    {codeOutput.length === 0 ? (
                      <p className="text-slate-600 italic">Pulsa "Ejecutar Algoritmo" para ver los cálculos en consola...</p>
                    ) : (
                      codeOutput.map((line, idx) => (
                        <p key={idx} className="leading-snug">{line}</p>
                      ))
                    )}
                  </div>
                </div>

                {/* Respuesta Socrática del Tutor de Algoritmos */}
                {codeAIExplanation && (
                  <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-3.5 space-y-1.5 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Análisis Didáctico de IA:</span>
                    </div>
                    <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                      {codeAIExplanation}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Modal de Lectura y Examen de Módulos */}
      <AILabModuleViewerModal
        module={activeViewingModule}
        ageBracket={ageBracket}
        isOpen={!!activeViewingModule}
        onClose={() => setActiveViewingModule(null)}
        onComplete={handleCompleteModule}
        onLaunchLab={(tab) => {
          setActiveTab(tab);
          setDynamicBatch(null);
          setInfographicData(null);
        }}
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
            isActive: activeTab === 'modules' && !dynamicBatch && !infographicData,
            onClick: () => { setActiveTab('modules'); setDynamicBatch(null); setInfographicData(null); }
          },
          {
            id: 'neural_lab',
            label: 'Red 2D',
            icon: Brain,
            isActive: activeTab === 'neural_lab',
            onClick: () => { setActiveTab('neural_lab'); setDynamicBatch(null); setInfographicData(null); }
          },
          {
            id: 'creative_studio',
            label: 'Código & Prompts',
            icon: Code2,
            isActive: activeTab === 'creative_studio' && !dynamicBatch && !infographicData,
            onClick: () => { setActiveTab('creative_studio'); setDynamicBatch(null); setInfographicData(null); }
          },
          {
            id: 'vision_lab',
            label: 'Visión CNN',
            icon: Eye,
            isActive: activeTab === 'vision_lab',
            onClick: () => { setActiveTab('vision_lab'); setDynamicBatch(null); setInfographicData(null); }
          },
          {
            id: 'ethics_bias',
            label: 'Ética & Sesgos',
            icon: ShieldAlert,
            isActive: activeTab === 'ethics_bias',
            onClick: () => { setActiveTab('ethics_bias'); setDynamicBatch(null); setInfographicData(null); }
          }
        ]}
      />

      {/* Submenú Desplegable Discreto hacia arriba */}
      <MiniAppSubmenuSheet
        isOpen={isSubmenuOpen}
        onClose={() => setIsSubmenuOpen(false)}
        experienceId="ai-lab"
        onNavigateExperience={onNavigateExperience}
        submenuSections={submenuSections}
        onSelectAction={(actionId) => {
          if (actionId === 'learn') { setActiveTab('modules'); setDynamicBatch(null); setInfographicData(null); }
          if (actionId === 'neural') { setActiveTab('neural_lab'); setDynamicBatch(null); setInfographicData(null); }
          if (actionId === 'vision') { setActiveTab('vision_lab'); setDynamicBatch(null); setInfographicData(null); }
          if (actionId === 'hallucination') { setActiveTab('hallucinations'); setDynamicBatch(null); setInfographicData(null); }
          if (actionId === 'ethics') { setActiveTab('ethics_bias'); setDynamicBatch(null); setInfographicData(null); }
        }}
      />

    </div>
  );
};

export default AILabExperience;
