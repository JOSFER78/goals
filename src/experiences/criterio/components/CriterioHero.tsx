import React from 'react';
import { 
  ShieldCheck, Compass, Sparkles, ArrowRight, Play, CheckCircle2, 
  Brain, Scale, Search, Bot, Cpu, ShieldAlert, GitMerge, Award
} from 'lucide-react';
import { CriterioCompetencyId } from '../types';

interface CriterioHeroProps {
  onStartDailyMission: () => void;
  onOpenFeedLab: () => void;
  onOpenMatiza: () => void;
  onSelectCompetencyFilter?: (comp: CriterioCompetencyId | null) => void;
  selectedCompetency: CriterioCompetencyId | null;
  criterioScore: number; // 0 - 100
}

interface CompetencyItem {
  id: CriterioCompetencyId;
  name: string;
  shortDesc: string;
  icon: React.ElementType;
  score: number;
  color: string;
}

export const CriterioHero: React.FC<CriterioHeroProps> = ({
  onStartDailyMission,
  onOpenFeedLab,
  onOpenMatiza,
  onSelectCompetencyFilter,
  selectedCompetency,
  criterioScore = 78
}) => {
  const COMPETENCIES: CompetencyItem[] = [
    { id: 'sources', name: 'Rastreo de Fuentes', shortDesc: 'Trazabilidad y BOE/NASA', icon: Search, score: 85, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40' },
    { id: 'fact_opinion', name: 'Hecho vs Opinión', shortDesc: 'Evidencia vs Sentimiento', icon: Scale, score: 90, color: 'text-amber-400 border-amber-500/30 bg-amber-950/40' },
    { id: 'context', name: 'Contexto & Encuadre', shortDesc: 'Vacíos y omisiones', icon: Compass, score: 75, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40' },
    { id: 'algorithms', name: 'Algoritmos & Atención', shortDesc: 'Economía de la retención', icon: Cpu, score: 80, color: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40' },
    { id: 'ai_literacy', name: 'Auditoría de IA', shortDesc: 'Alucinaciones y deepfakes', icon: Bot, score: 88, color: 'text-rose-400 border-rose-500/30 bg-rose-950/40' },
    { id: 'lateral_search', name: 'Lectura Lateral', shortDesc: 'Pestañas paralelas', icon: GitMerge, score: 70, color: 'text-blue-400 border-blue-500/30 bg-blue-950/40' },
    { id: 'pause_method', name: 'Método PAUSA', shortDesc: 'Desaceleración reflexiva', icon: ShieldAlert, score: 95, color: 'text-teal-400 border-teal-500/30 bg-teal-950/40' },
    { id: 'nuance', name: 'Juicio Matizado', shortDesc: 'Grados de certeza', icon: Award, score: 82, color: 'text-yellow-400 border-yellow-500/30 bg-yellow-950/40' }
  ];

  return (
    <div className="w-full space-y-4">
      {/* Hero Principal con War Room Visual */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-slate-950/90 p-5 sm:p-7 shadow-2xl backdrop-blur-xl forensic-grid-pattern">
        {/* Glow Ámbar Ambiental */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Copy y Llamadas a la Acción (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                SALA DE RIGOR & CRITERIO
              </span>
              <span className="text-slate-400 text-xs font-mono">
                MÉTODO NO CREER TODO + NO DESCONFIAR DE TODO
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Aprende a navegar el mundo digital con{' '}
              <span className="text-amber-400 font-black">Criterio Autónomo</span>.
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              La pregunta que lo cambia todo: <strong className="text-amber-300">«¿Y tú cómo lo sabes?»</strong>. Domina la economía de la atención, aprende cómo funcionan los algoritmos de recomendación, audita las alucinaciones de la IA y matiza con fuentes científicas oficiales.
            </p>

            {/* Botones de Acción Inmediata */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onStartDailyMission}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/25 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Misión Diaria de Criterio</span>
              </button>

              <button
                type="button"
                onClick={onOpenFeedLab}
                className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>Simulador de Algoritmos</span>
              </button>

              <button
                type="button"
                onClick={onOpenMatiza}
                className="px-4 py-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/40 text-amber-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Herramienta MATIZA</span>
              </button>
            </div>
          </div>

          {/* Tarjeta de Radar de Criterio (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="font-extrabold text-sm text-white">Tu Índice de Criterio</span>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                {criterioScore}% DOMINIO
              </span>
            </div>

            {/* Barra de Progreso Global */}
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${criterioScore}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400">
              Evaluación viva de tu capacidad para rastrear fuentes primarias, identificar sesgos algorítmicos y modular el juicio ante la incertidumbre.
            </p>

            {/* Métricas Rápidas */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800 text-center">
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="block font-mono text-xs font-black text-amber-400">8</span>
                <span className="text-[10px] text-slate-400">Competencias</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="block font-mono text-xs font-black text-emerald-400">60</span>
                <span className="text-[10px] text-slate-400">Misiones</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="block font-mono text-xs font-black text-cyan-400">100%</span>
                <span className="text-[10px] text-slate-400">Fuentes Reales</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Interactivo de las 8 Competencias Fundamentales */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Matriz de Competencias de Criterio</span>
          </h3>
          {selectedCompetency && (
            <button
              type="button"
              onClick={() => onSelectCompetencyFilter?.(null)}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold cursor-pointer"
            >
              Ver todos los módulos
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {COMPETENCIES.map((comp) => {
            const Icon = comp.icon;
            const isSelected = selectedCompetency === comp.id;
            return (
              <button
                key={comp.id}
                type="button"
                onClick={() => onSelectCompetencyFilter?.(isSelected ? null : comp.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected 
                    ? 'ring-2 ring-amber-400 border-amber-400 bg-slate-900 shadow-md scale-[1.02]' 
                    : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <div className={`p-1.5 rounded-xl border ${comp.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">
                    {comp.score}%
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-white leading-tight truncate">
                  {comp.name}
                </h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {comp.shortDesc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
