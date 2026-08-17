import React from 'react';
import { 
  AILabModule, 
  AIAgeBracket, 
  AITab 
} from '../types/aiLabTypes';
import { AI_SKILL_AREAS } from '../data/aiLabModulesData';
import { 
  Clock, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Binary, 
  Eye, 
  ShieldAlert, 
  Scale, 
  Wand2, 
  Bot, 
  Database, 
  FileCode, 
  Palette, 
  Lock, 
  ScanEye 
} from 'lucide-react';

interface AILabModuleCardProps {
  module: AILabModule;
  ageBracket: AIAgeBracket;
  isCompleted: boolean;
  onOpenModule: (module: AILabModule) => void;
  onLaunchLab?: (tab: AITab) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Bot,
  Database,
  Cpu,
  Eye,
  FileCode,
  Sparkles,
  ShieldAlert,
  Palette,
  Scale,
  Lock,
  ScanEye,
  Wand2
};

export const AILabModuleCard: React.FC<AILabModuleCardProps> = ({
  module,
  ageBracket,
  isCompleted,
  onOpenModule,
  onLaunchLab
}) => {
  const competency = AI_SKILL_AREAS.find((c) => c.id === module.competency);
  const IconComponent = ICON_MAP[module.icon] || Sparkles;

  const adaptedSummary = module.ageAdaptedSummary[ageBracket] || module.summary;

  return (
    <div className={`group rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between relative overflow-hidden bg-slate-900/80 hover:bg-slate-900 shadow-xl ${
      isCompleted 
        ? 'border-emerald-500/40 hover:border-emerald-400' 
        : 'border-slate-800 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]'
    }`}>
      
      {/* Halo de fondo en hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-all pointer-events-none" />

      {/* Cabecera de la Tarjeta: Número de Módulo + Insignia de Competencia + Recompensa */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs font-black flex items-center justify-center">
              {String(module.id).padStart(2, '0')}
            </span>
            {competency && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${competency.bgBadge} ${competency.color} ${competency.borderBadge}`}>
                {competency.shortName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-[11px]">
              <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>+{module.xpReward} XP</span>
            </div>
            {isCompleted && (
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center" title="Módulo Completado">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

        </div>

        {/* Título e Icono */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 group-hover:border-purple-400 transition-all shadow-md">
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-purple-300 transition-colors leading-snug">
              {module.title}
            </h3>
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              {module.subtitle}
            </p>
          </div>
        </div>

        {/* Resumen adaptado a la edad */}
        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
          {adaptedSummary}
        </p>

        {/* Puntos clave / Aprendizajes esenciales */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Lo que aprenderás:
          </span>
          <ul className="space-y-1">
            {module.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
              <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5 leading-tight">
                <span className="text-purple-400 font-bold shrink-0 mt-0.5">•</span>
                <span className="line-clamp-1">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pie de Tarjeta: Metadatos y Botones */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {module.estimatedMinutes} min
          </span>
          <span>•</span>
          <span className="font-mono text-purple-400 font-semibold">Nivel {module.level}</span>
        </div>

        <div className="flex items-center gap-2">
          {module.interactiveLabLink && onLaunchLab && (
            <button
              type="button"
              onClick={() => onLaunchLab(module.interactiveLabLink!)}
              className="px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold transition-all cursor-pointer"
              title="Abrir Simulador del Módulo"
            >
              Lab
            </button>
          )}

          <button
            type="button"
            onClick={() => onOpenModule(module)}
            className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isCompleted
                ? 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30'
            }`}
          >
            <span>{isCompleted ? 'Repasar' : 'Comenzar'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

    </div>
  );
};
