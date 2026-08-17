/**
 * src/core/components/navigation/MiniAppsDrawer.tsx
 * Menú Desplegable Slide-Over / Popover de Exploración de MiniApps de GOALS.
 * Permite alternar y entrar rápidamente a cualquiera de las 5 experiencias interactivas.
 */

import React from 'react';
import { GOALS_EXPERIENCES } from '../../config/experiencesConfig';
import { ExperienceId } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { 
  X, Sparkles, ChevronRight, Zap, Star, ShieldCheck, 
  Orbit, GraduationCap, Globe, Shield, Bot, ExternalLink
} from 'lucide-react';

interface MiniAppsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExperience: (id: ExperienceId) => void;
  activeExperience: string | null;
}

export const MiniAppsDrawer: React.FC<MiniAppsDrawerProps> = ({
  isOpen,
  onClose,
  onSelectExperience,
  activeExperience
}) => {
  const { userData } = useProgress();

  if (!isOpen) return null;

  const MINI_APPS = (['school', 'languages', 'astro', 'verify', 'ai-lab'] as ExperienceId[])
    .map((id) => GOALS_EXPERIENCES[id])
    .filter(Boolean);

  const handleSelect = (id: ExperienceId) => {
    onSelectExperience(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-display select-none animate-fadeIn">
      
      {/* Backdrop oscuro con desenfoque */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Panel Lateral Desplegable (Slide-Over) */}
      <div className="relative z-10 w-full max-w-md h-full bg-slate-950/95 border-l border-slate-800/90 shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Header del Drawer */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Mundos de Aprendizaje
              </h2>
              <p className="text-[11px] text-slate-400">
                5 MiniApps educativas adaptativas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Cerrar Menú"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista Scrollable de MiniApps */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 scrollbar-thin">
          {MINI_APPS.map((app) => {
            const IconComp = app.icon;
            const isActive = activeExperience === app.id;
            const expProgress = userData?.experiences?.[app.id as ExperienceId];
            const xpEarned = expProgress?.xp || 0;

            return (
              <div
                key={app.id}
                onClick={() => handleSelect(app.id as ExperienceId)}
                className={`relative group p-4 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between gap-3 ${
                  isActive 
                    ? `bg-slate-900/90 ${app.borderClass} shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500/50` 
                    : `bg-slate-900/60 hover:bg-slate-900/90 border-slate-800/80 hover:${app.borderClass} hover:shadow-md`
                }`}
              >
                {/* Glow sutil */}
                <div 
                  className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-15 group-hover:opacity-30 transition-opacity pointer-events-none"
                  style={{ background: app.ambientGlow }}
                />

                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-md ${app.iconColorClass} group-hover:scale-105 transition-transform shrink-0`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-white group-hover:text-slate-100 truncate">
                          {app.name}
                        </h3>
                        {isActive && (
                          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold uppercase">
                            Activa
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {app.tagline}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-mono font-bold uppercase shrink-0 ${app.badgeClass}`}>
                    {app.themeKeyword || app.badge}
                  </span>
                </div>

                {/* Footer de la Tarjeta con Métricas */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] relative z-10">
                  <div className="flex items-center gap-2 text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-amber-300">{xpEarned} XP</span>
                    </span>
                  </div>

                  <span className={`font-bold ${app.iconColorClass} flex items-center gap-1 group-hover:translate-x-0.5 transition-transform`}>
                    <span>{isActive ? 'En Curso' : 'Entrar'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Informativo */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 text-center">
          <p className="text-[11px] text-slate-400">
            🌌 Cada MiniApp calibra automáticamente tu nivel de entrada.
          </p>
        </div>

      </div>
    </div>
  );
};
