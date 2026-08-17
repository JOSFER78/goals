import React from 'react';
import { 
  AICompetencyId, 
  AITab 
} from '../types/aiLabTypes';
import { AI_SKILL_AREAS } from '../data/aiLabModulesData';
import { 
  Sparkles, 
  Cpu, 
  Binary, 
  Eye, 
  ShieldAlert, 
  Scale, 
  Wand2, 
  ArrowRight, 
  Play, 
  Check, 
  Flame,
  Layers,
  Search
} from 'lucide-react';

interface AILabHeroProps {
  onSelectTab: (tab: AITab) => void;
  selectedCompetency: AICompetencyId | null;
  onSelectCompetencyFilter: (comp: AICompetencyId | null) => void;
  aiScore: number;
}

export const AILabHero: React.FC<AILabHeroProps> = ({
  onSelectTab,
  selectedCompetency,
  onSelectCompetencyFilter,
  aiScore
}) => {
  return (
    <div className="space-y-4">
      {/* Banner Hero Principal */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-purple-950/40 border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        
        {/* Glow atmosférico */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-center">
          
          {/* Columna Izquierda: Introducción y Call to Actions */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-400" />
              <span>Sin Mocks · Simulaciones Matemáticas Reales</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
              Aprende cómo piensa una máquina <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-300">
                desde sus neuronas hasta sus límites.
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              No te limites a ser un usuario pasivo. Entrena redes neuronales en 2D, inspecciona tokens en vivo, aplica matrices de convolución sobre píxeles, desenmascara alucinaciones y construye el criterio para liderar el futuro.
            </p>

            {/* Accesos Rápidos a Laboratorios */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => onSelectTab('neural_lab')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Simulador de Red Neuronal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('token_lab')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Binary className="w-3.5 h-3.5" />
                <span>Explorar Tokens y LLMs</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('hallucinations')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Caza-Alucinaciones</span>
              </button>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Estado & Radar */}
          <div className="lg:col-span-5 bg-slate-950/80 border border-purple-500/25 rounded-2xl p-4.5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                Tu Índice de Criterio IA
              </span>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-lg border border-purple-500/20">
                {aiScore}/100 Pts
              </span>
            </div>

            {/* Barra de progreso de maestría */}
            <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
              <div 
                className="bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(10, aiScore)}%` }}
              />
            </div>

            {/* 3 Pilares Fundamentales de IA Lab */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80 text-center">
                <div className="text-[10px] text-purple-300 font-bold">1. Entender</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Pesos & Matrices</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80 text-center">
                <div className="text-[10px] text-cyan-300 font-bold">2. Auditar</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Sesgos & Errores</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800/80 text-center">
                <div className="text-[10px] text-emerald-300 font-bold">3. Crear</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Co-Piloto Ético</div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Selector / Filtro de Competencias Curriculares */}
      <div className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-purple-400" />
            Filtrar por Área:
          </span>
          {selectedCompetency && (
            <button
              type="button"
              onClick={() => onSelectCompetencyFilter(null)}
              className="text-[10px] text-purple-400 hover:text-purple-300 underline font-semibold cursor-pointer"
            >
              (Mostrar todas)
            </button>
          )}
        </div>

        {/* Chips de Competencias */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelectCompetencyFilter(null)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCompetency === null
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Todas (12)
          </button>

          {AI_SKILL_AREAS.map((area) => {
            const isSelected = selectedCompetency === area.id;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => onSelectCompetencyFilter(isSelected ? null : area.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-sm border border-purple-400/50'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {area.shortName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
