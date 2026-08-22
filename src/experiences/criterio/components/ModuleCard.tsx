import React from 'react';
import { 
  Compass, Eye, Brain, GitMerge, Cpu, Scale, Search, Bot, 
  Sparkles, ShieldAlert, Award, FileText, ArrowRight, CheckCircle2, Clock, Zap, Lock
} from 'lucide-react';
import { CriterioModule } from '../types';

interface ModuleCardProps {
  module: CriterioModule;
  isCompleted?: boolean;
  isLocked?: boolean;
  onOpenModule: (module: CriterioModule) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Compass,
  Eye,
  Brain,
  GitMerge,
  Cpu,
  Scale,
  Search,
  Bot,
  Sparkles,
  ShieldAlert,
  Award,
  FileText
};

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isCompleted = false,
  isLocked = false,
  onOpenModule
}) => {
  const IconComponent = ICON_MAP[module.iconName] || Compass;

  return (
    <div 
      className={`group rounded-3xl border p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl hover:shadow-2xl hover:scale-[1.01] ${
        isLocked
          ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
          : isCompleted 
            ? 'bg-slate-950/85 border-emerald-500/40 hover:border-emerald-400' 
            : 'bg-slate-950/80 border-slate-800/90 hover:border-amber-500/50'
      }`}
    >
      {/* Resplandor ambiental de acento */}
      <div 
        className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: module.accentColor }}
      />

      <div className="space-y-3 relative z-10">
        
        {/* Cabecera de la Tarjeta con Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div 
              className="p-2.5 rounded-2xl border flex items-center justify-center transition-all group-hover:scale-105"
              style={{ 
                backgroundColor: `${module.accentColor}15`, 
                borderColor: `${module.accentColor}40`,
                color: module.accentColor
              }}
            >
              <IconComponent className="w-4 h-4" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 text-slate-300">
              {module.badgeTag}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isLocked ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-900/80 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
                <Lock className="w-3 h-3" /> BLOQUEADO
              </span>
            ) : isCompleted ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                <CheckCircle2 className="w-3 h-3" /> COMPLETADO
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
                <Zap className="w-3 h-3 text-amber-400" /> +{module.xpReward} XP
              </span>
            )}
          </div>
        </div>

        {/* Título y Subtítulo */}
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-white leading-snug group-hover:text-amber-300 transition-colors">
            {module.title}
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            {module.subtitle}
          </p>
        </div>

        {/* Descripción Didáctica */}
        <p className="text-xs text-slate-300/80 line-clamp-2 leading-relaxed">
          {module.shortDescription}
        </p>

        {/* Micro-Esquema Vectorial Didáctico */}
        <div className="p-2.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>~{module.durationMinutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: module.accentColor }} />
            <span>{module.steps.length} pasos socráticos</span>
          </div>
        </div>
      </div>

      {/* Botón de Entrada a la Lección */}
      <div className="pt-3 mt-3 border-t border-slate-800/70 relative z-10 flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-400 font-mono">
          Franja: {module.ageBracket}
        </span>

        <button
          type="button"
          onClick={() => onOpenModule(module)}
          disabled={isLocked}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
            isLocked
              ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed'
              : isCompleted
                ? 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 cursor-pointer'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer'
          }`}
        >
          {isLocked ? (
            <><Lock className="w-3.5 h-3.5" /><span>Completa el anterior</span></>
          ) : (
            <><span>{isCompleted ? 'Repasar' : 'Explorar Módulo'}</span><ArrowRight className="w-3.5 h-3.5" /></>
          )}
        </button>
      </div>
    </div>
  );
};
