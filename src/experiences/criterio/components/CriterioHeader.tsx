import React from 'react';
import { 
  BookOpen, Cpu, Target, Bot, FileCheck, Shield, Sparkles, 
  Flame, Star, Award, Compass, Search
} from 'lucide-react';
import { CriterioAgeBracket } from '../types';

export type CriterioTab = 'modules' | 'feed_lab' | 'missions' | 'ai_lab' | 'matiza';

interface CriterioHeaderProps {
  activeTab: CriterioTab;
  onSelectTab: (tab: CriterioTab) => void;
  ageBracket: CriterioAgeBracket;
  onChangeAgeBracket: (bracket: CriterioAgeBracket) => void;
  criterioXP: number;
  completedModulesCount: number;
  totalModulesCount: number;
}

export const CriterioHeader: React.FC<CriterioHeaderProps> = ({
  activeTab,
  onSelectTab,
  ageBracket,
  onChangeAgeBracket,
  criterioXP,
  completedModulesCount,
  totalModulesCount
}) => {
  const TABS = [
    { id: 'modules', label: '12 Módulos', icon: BookOpen, badge: `${completedModulesCount}/${totalModulesCount}` },
    { id: 'feed_lab', label: 'Simulador Feed', icon: Cpu, badge: 'Algoritmo' },
    { id: 'missions', label: '60 Misiones', icon: Target, badge: 'Gamificado' },
    { id: 'ai_lab', label: 'Laboratorio IA', icon: Bot, badge: 'Forense' },
    { id: 'matiza', label: 'Laboratorio MATIZA', icon: FileCheck, badge: 'Herramienta' }
  ];

  const AGE_BRACKETS: { id: CriterioAgeBracket; label: string }[] = [
    { id: '8-10', label: '8–10 años' },
    { id: '10-12', label: '10–12 años' },
    { id: '12-14', label: '12–14 años' },
    { id: '14-16', label: '14–16 años' },
    { id: '16-18', label: '16–18 años' }
  ];

  return (
    <div className="w-full space-y-3">
      {/* Barra de Telemetría Superior */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/80 border border-amber-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base text-white tracking-tight leading-none">
                CRITERIO
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                SABER E INFORMARSE
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              «¿Y tú cómo lo sabes?» · Pensamiento Autónomo e IA
            </span>
          </div>
        </div>

        {/* Selector de Nivel de Edad y XP Acumulado */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Selector de Rango de Edad */}
          <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase font-mono hidden sm:inline">
              Edad:
            </span>
            {AGE_BRACKETS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => onChangeAgeBracket(b.id)}
                className={`px-2 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                  ageBracket === b.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Badge de XP en Criterio */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{criterioXP} XP</span>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación Temática */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id as CriterioTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800/80 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono font-bold ${
                isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-300/80'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
