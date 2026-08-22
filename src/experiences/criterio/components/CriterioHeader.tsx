import React from 'react';
import { 
  BookOpen, Cpu, Target, Bot, FileCheck, Shield, Sparkles, 
  Flame, Star, Award, Compass, Search, AlertTriangle, Brain, Scale,
  MessageSquare, Radio, Layers, CheckCircle2, Lock, Zap
} from 'lucide-react';
import { CriterioAgeBracket } from '../types';
import { useProgress } from '../../../core/context/ProgressContext';

export type CriterioHeaderTab = 
  | 'modules' 
  | 'fallacies' 
  | 'biases' 
  | 'ethics' 
  | 'debate' 
  | 'feed_lab' 
  | 'missions' 
  | 'ai_lab' 
  | 'matiza'
  | 'ecosystem';

interface CriterioHeaderProps {
  activeTab?: string;
  onSelectTab?: (tab: any) => void;
  ageBracket: CriterioAgeBracket;
  onChangeAgeBracket: (bracket: CriterioAgeBracket) => void;
  criterioXP?: number;
  completedModulesCount?: number;
  totalModulesCount?: number;
  synapseBalance?: number;
  onOpenDynamicChallenge?: () => void;
  isGeneratingExercises?: boolean;
}

export const CriterioHeader: React.FC<CriterioHeaderProps> = ({
  activeTab = 'modules',
  onSelectTab,
  ageBracket,
  onChangeAgeBracket,
  criterioXP: propCriterioXP,
  completedModulesCount = 0,
  totalModulesCount = 12,
  synapseBalance: propSynapseBalance,
  onOpenDynamicChallenge,
  isGeneratingExercises = false
}) => {
  const { currencies, userData } = useProgress();

  const synapseBalance = propSynapseBalance !== undefined 
    ? propSynapseBalance 
    : (currencies?.synapse || 0);

  const criterioXP = propCriterioXP !== undefined 
    ? propCriterioXP 
    : (userData?.experiences?.criterio?.xp || userData?.experiences?.verify?.xp || userData?.xp || 0);

  const TABS = [
    { id: 'modules', label: '12 Módulos', icon: BookOpen, badge: `${completedModulesCount}/${totalModulesCount}` },
    { id: 'fallacies', label: 'Falacias', icon: AlertTriangle, badge: 'Forense' },
    { id: 'biases', label: 'Sesgos', icon: Brain, badge: 'Heurística' },
    { id: 'ethics', label: 'Dilemas Éticos', icon: Scale, badge: 'Moral' },
    { id: 'debate', label: 'Debate Socrático', icon: MessageSquare, badge: 'En Vivo' },
    { id: 'feed_lab', label: 'Simulador Feed', icon: Radio, badge: 'Algoritmo' },
    { id: 'missions', label: '60 Misiones', icon: Target, badge: 'PAUSA' },
    { id: 'ai_lab', label: 'IA Forense', icon: Bot, badge: 'Deepfakes' },
    { id: 'matiza', label: 'MATIZA', icon: Layers, badge: 'Rigor' },
    { id: 'ecosystem', label: 'Ecosistema GOALS', icon: Sparkles, badge: 'Family' }
  ];

  const AGE_BRACKETS: { id: CriterioAgeBracket; label: string }[] = [
    { id: '6-7', label: '6–7 años' },
    { id: '8-9', label: '8–9 años' },
    { id: '10-11', label: '10–11 años' },
    { id: '12-13', label: '12–13 años' },
    { id: '14-15', label: '14–15 años' }
  ];

  return (
    <div className="w-full space-y-3 font-display">
      
      {/* ── Banner Permanente: GRATIS PARA SIEMPRE (Honesto y Transparente) ── */}
      <div 
        role="region"
        aria-label="Información de Acceso Libre de Criterio"
        className="p-3 sm:p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-950/40 to-amber-500/10 border border-amber-500/30 backdrop-blur-xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
            <Shield className="w-5 h-5 fill-amber-400/20 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase bg-amber-500 text-slate-950 shadow-sm">
                GRATIS PARA SIEMPRE
              </span>
              <span className="text-xs font-extrabold text-white">
                Educación y Pensamiento Crítico sin Barreras
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-200/80 mt-0.5 leading-relaxed">
              CRITERIO es 100% gratuito y abierto para todas las familias, colegios y estudiantes. Sin suscripciones ocultas, sin publicidad y con privacidad total.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <span className="px-3 py-1 rounded-xl bg-slate-950/80 border border-amber-500/30 text-[11px] font-mono font-bold text-amber-300 flex items-center gap-1.5 shadow-inner">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Acceso Universal Ilimitado</span>
          </span>
        </div>
      </div>

      {/* ── Barra de Telemetría Superior & Monedas de Dominio ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-3xl bg-slate-950/85 border border-amber-500/20 backdrop-blur-xl shadow-xl">
        
        {/* Identidad de Miniapp */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] shrink-0">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base sm:text-lg text-white tracking-tight leading-none">
                CRITERIO
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                SABER E INFORMARSE
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              «¿Y tú cómo lo sabes?» · Pensamiento Autónomo, Algoritmos e IA
            </span>
          </div>
        </div>

        {/* Controles de Nivel de Edad, Balance Synapse y XP */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Selector de Rango de Edad */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl shadow-inner">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase font-mono hidden sm:inline">
              Edad:
            </span>
            {AGE_BRACKETS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onChangeAgeBracket(b.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  ageBracket === b.id
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Balance de Synapse (Moneda de Dominio de Criterio) */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold shadow-[0_0_12px_rgba(245,158,11,0.15)] cursor-help"
            title="Synapse: Moneda de Dominio de Criterio. Se acumula al contrastar fuentes, resolver casos forenses y completar módulos pedagógicos."
          >
            <span className="text-sm">🧠</span>
            <span className="text-amber-200 font-black text-xs sm:text-sm">{synapseBalance}</span>
            <span className="text-[10px] text-amber-400 uppercase font-sans font-bold hidden sm:inline">Synapse</span>
          </div>

          {/* Badge de XP Global en Criterio */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold shadow-inner"
            title="Puntos de Experiencia (XP) acumulados en Criterio"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>{criterioXP} XP</span>
          </div>

          {/* Botón de Desafío IA Dinámico si está disponible */}
          {onOpenDynamicChallenge && (
            <button
              type="button"
              onClick={onOpenDynamicChallenge}
              disabled={isGeneratingExercises}
              className="px-3 py-1.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>{isGeneratingExercises ? 'Generando...' : 'Desafío IA'}</span>
            </button>
          )}

        </div>
      </div>

      {/* ── Pestañas de Navegación Temática ── */}
      {onSelectTab && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02] font-black'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800/80 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                  isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-300/80'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default CriterioHeader;
