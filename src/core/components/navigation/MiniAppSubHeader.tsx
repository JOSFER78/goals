/**
 * src/core/components/navigation/MiniAppSubHeader.tsx
 * Barra Superior Contextual Estandarizada para todas las MiniApps de GOALS.
 * Proporciona botón de retorno, identidad visual de la MiniApp, selectores de contexto (edad, idioma, materia) y XP.
 */

import React from 'react';
import { GOALS_EXPERIENCES } from '../../config/experiencesConfig';
import { ExperienceId } from '../../types';
import { ArrowLeft, Zap, Sparkles } from 'lucide-react';

export interface MiniAppSubHeaderProps {
  experienceId: ExperienceId | string;
  title?: string;
  subtitle?: string;
  tagline?: string;
  badge?: string;
  xp?: number;
  onBackToGoals?: () => void;
  contextSelector?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const MiniAppSubHeader: React.FC<MiniAppSubHeaderProps> = ({
  experienceId,
  title,
  subtitle,
  tagline,
  badge,
  xp,
  onBackToGoals,
  contextSelector,
  actions,
  className = ''
}) => {
  const expConfig = GOALS_EXPERIENCES[experienceId];
  const IconComp = expConfig?.icon || Sparkles;
  const displayTitle = title || expConfig?.name || 'MiniApp';
  const displayTagline = tagline || expConfig?.tagline || '';
  const displayBadge = badge || expConfig?.themeKeyword || expConfig?.badge;

  return (
    <div className={`w-full rounded-2xl border ${expConfig?.borderClass || 'border-slate-800'} bg-slate-950/85 backdrop-blur-xl p-3 sm:p-4 shadow-xl flex flex-col gap-3 font-display relative overflow-hidden select-none ${className}`}>
      
      {/* Resplandor sutil ambiental */}
      <div 
        className="absolute top-0 right-0 w-64 h-32 rounded-full blur-3xl opacity-20 pointer-events-none -mr-12 -mt-12"
        style={{ background: expConfig?.primaryHex || '#6366F1' }}
      />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        
        {/* Lado Izquierdo: Botón Volver + Identidad de la MiniApp */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          {onBackToGoals && (
            <button
              type="button"
              onClick={onBackToGoals}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800/80 transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm"
              title="Volver a GOALS"
              aria-label="Volver a GOALS"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md ${expConfig?.iconColorClass || 'text-indigo-400'} shrink-0`}>
              <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-black text-sm sm:text-base text-white truncate tracking-tight">
                  {displayTitle}
                </h1>
                {displayBadge && (
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wide border shrink-0 ${expConfig?.badgeClass || 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'}`}>
                    {displayBadge}
                  </span>
                )}
              </div>
              {displayTagline && (
                <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                  {subtitle || displayTagline}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Lado Derecho: Selector Contextual, Acciones y Contador de XP */}
        <div className="flex items-center gap-2 sm:gap-2.5 ml-auto shrink-0">
          {contextSelector}

          {typeof xp === 'number' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{xp} XP</span>
            </div>
          )}

          {actions}
        </div>

      </div>

    </div>
  );
};

export default MiniAppSubHeader;
