import React from 'react';
import { 
  AITab, 
  AIAgeBracket 
} from '../types/aiLabTypes';
import { 
  Brain, 
  Sparkles, 
  Cpu, 
  Binary, 
  Eye, 
  ShieldAlert, 
  Scale, 
  Wand2, 
  Zap, 
  CheckCircle2, 
  Award,
  BookOpen
} from 'lucide-react';

interface AILabHeaderProps {
  activeTab: AITab;
  onSelectTab: (tab: AITab) => void;
  ageBracket: AIAgeBracket;
  onChangeAgeBracket: (bracket: AIAgeBracket) => void;
  aiXP: number;
  completedModulesCount: number;
  totalModulesCount: number;
}

export const AILabHeader: React.FC<AILabHeaderProps> = ({
  activeTab,
  onSelectTab,
  ageBracket,
  onChangeAgeBracket,
  aiXP,
  completedModulesCount,
  totalModulesCount
}) => {
  const completionPercentage = Math.round((completedModulesCount / totalModulesCount) * 100);

  const TABS: { id: AITab; label: string; shortLabel: string; icon: React.ElementType; color: string }[] = [
    { id: 'modules', label: '12 Módulos IA', shortLabel: 'Módulos', icon: BookOpen, color: 'text-purple-400' },
    { id: 'neural_lab', label: 'Red Neuronal 2D', shortLabel: 'Red Neuronal', icon: Cpu, color: 'text-indigo-400' },
    { id: 'token_lab', label: 'Tokens & LLM', shortLabel: 'Tokens', icon: Binary, color: 'text-cyan-400' },
    { id: 'vision_lab', label: 'Visión & Convolución', shortLabel: 'Visión', icon: Eye, color: 'text-emerald-400' },
    { id: 'hallucinations', label: 'Caza-Alucinaciones', shortLabel: 'Alucinaciones', icon: ShieldAlert, color: 'text-amber-400' },
    { id: 'ethics_bias', label: 'Sesgos & Dilemas', shortLabel: 'Ética', icon: Scale, color: 'text-rose-400' },
    { id: 'creative_studio', label: 'Estudio Creativo', shortLabel: 'Crear', icon: Wand2, color: 'text-fuchsia-400' }
  ];

  return (
    <div className="w-full space-y-4">
      {/* Barra Superior con Identidad, Nivel de Edad y Progreso */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        
        {/* Halo decorativo de fondo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          
          {/* Título y Tagline */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 flex items-center justify-center text-white shadow-[0_0_25px_rgba(168,85,247,0.35)] shrink-0">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  GOALS <span className="text-purple-400">· IA LAB</span>
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold tracking-wider border border-purple-500/30 uppercase">
                  Laboratorio Experimental
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                Descubre. Entiende. Experimenta. Crea con Inteligencia Artificial.
              </p>
            </div>
          </div>

          {/* Selector de Franja de Edad & Medidores */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 self-start lg:self-center">
            
            {/* Selector de Edad */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 shadow-inner">
              <span className="text-[10px] text-slate-400 font-bold uppercase px-2 hidden sm:inline">
                Nivel:
              </span>
              <button
                type="button"
                onClick={() => onChangeAgeBracket('7-9')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ageBracket === '7-9'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                title="Nivel Exploradores (7 a 9 años)"
              >
                7-9 años
              </button>
              <button
                type="button"
                onClick={() => onChangeAgeBracket('10-12')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ageBracket === '10-12'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                title="Nivel Constructores (10 a 12 años)"
              >
                10-12 años
              </button>
              <button
                type="button"
                onClick={() => onChangeAgeBracket('13-15')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  ageBracket === '13-15'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                title="Nivel Innovadores (13 a 15+ años)"
              >
                13-15+ años
              </button>
            </div>

            {/* Contador de XP */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{aiXP} XP</span>
            </div>

            {/* Contador de Módulos */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>{completedModulesCount}/{totalModulesCount}</span>
            </div>

          </div>

        </div>

        {/* Barra de progreso general */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-3">
          <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-purple-300 font-bold shrink-0">
            {completionPercentage}% Completado
          </span>
        </div>

      </div>

      {/* Selector de Pestañas de Laboratorios Interactivos */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40 scale-[1.02]'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
