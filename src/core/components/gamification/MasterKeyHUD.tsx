import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { MasterKeyStatus } from '../../types/gamification';
import { MASTER_KEY_MIN_MINUTES } from '../../services/GamificationEngine';
import { Key, Lock, CheckCircle2, Sparkles, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

interface MasterKeyHUDProps {
  masterKey?: MasterKeyStatus;
  masterKeyActive?: boolean;
  onOpenSchool?: () => void;
  compact?: boolean;
  className?: string;
}

export const MasterKeyHUD: React.FC<MasterKeyHUDProps> = ({
  masterKey: propMasterKey,
  masterKeyActive: propActive,
  onOpenSchool,
  compact = false,
  className = ''
}) => {
  const progress = useProgress();
  const mk = propMasterKey || progress.masterKey;
  const isActive = propActive !== undefined ? propActive : (progress.masterKeyActive || mk.isActive);
  const minutes = mk.schoolMinutesToday || 0;
  const targetMinutes = MASTER_KEY_MIN_MINUTES || 15;
  const progressPct = Math.min(100, Math.round((minutes / targetMinutes) * 100));
  const multiplier = mk.multiplier || 2.0;

  // ── 1. Modo Compacto (Para Header y barras de navegación) ──
  if (compact) {
    if (isActive) {
      return (
        <button
          type="button"
          onClick={onOpenSchool}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all active:scale-95 shadow-sm shadow-emerald-950/40 cursor-pointer ${className}`}
          title={`¡Llave Maestra Activa! Multiplicador ×${multiplier.toFixed(1)} XP en todo el ecosistema GOALS hoy.`}
        >
          <span className="text-sm select-none animate-bounce">🔑</span>
          <span className="font-mono tracking-tight text-emerald-200">
            ×{multiplier.toFixed(1)} XP
          </span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={onOpenSchool}
        className={`group flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs transition-all active:scale-95 cursor-pointer ${className}`}
        title={`Llave Maestra: Estudia 15 min en Escuela IA para activar ×2.0 XP universal. Progreso hoy: ${minutes}/${targetMinutes} min.`}
      >
        <Lock className="w-3 h-3 text-slate-400 group-hover:text-amber-400 transition-colors shrink-0" />
        <span className="text-[11px] font-mono font-medium">
          {minutes}/{targetMinutes}m
        </span>
      </button>
    );
  }

  // ── 2. Modo Expandido (Para ProfileModal y Dashboards) ──
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border transition-all ${
        isActive
          ? 'bg-gradient-to-br from-emerald-950/40 via-slate-950/90 to-slate-950/90 border-emerald-500/40 shadow-xl shadow-emerald-950/20'
          : 'bg-slate-950/80 border-slate-800/90'
      } ${className}`}
    >
      {/* Glow effect when active */}
      {isActive && (
        <div className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl" />
      )}

      <div className="relative z-10 space-y-3.5">
        
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border shrink-0 ${
                isActive
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {isActive ? '🔑' : '🔒'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  Llave Maestra Estelar
                </h3>
                {isActive ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    ACTIVA HOY
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-900 border border-slate-800 text-slate-400">
                    BLOQUEADA
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isActive
                  ? `Multiplicador universal de ×${multiplier.toFixed(1)} XP activo en todas las experiencias hoy`
                  : `Estudia ${targetMinutes} min en Escuela IA para activar ×2.0 XP`}
              </p>
            </div>
          </div>

          {/* Multiplier Tag */}
          <div className="text-right shrink-0">
            <div
              className={`text-lg sm:text-xl font-black font-mono tracking-tight ${
                isActive ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              ×{isActive ? multiplier.toFixed(1) : '1.0'}
            </div>
            <div className="text-[9px] font-mono text-slate-400 uppercase">
              {isActive ? 'Multiplicador' : 'Standby'}
            </div>
          </div>
        </div>

        {/* Progress Bar for the 15 minutes requirement */}
        <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span>Estudio en Escuela IA hoy</span>
            </span>
            <span className={`font-bold ${isActive ? 'text-emerald-300' : 'text-slate-300'}`}>
              {minutes} / {targetMinutes} min ({progressPct}%)
            </span>
          </div>

          <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-indigo-600 to-emerald-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Additional details */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] text-slate-400">
            <div className="flex items-center gap-1.5">
              {isActive ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
              )}
              <span>
                {isActive
                  ? 'Requisitos cumplidos con honestidad pedagógica'
                  : 'Requiere sesión enfocada con honestidad ≥ 80%'}
              </span>
            </div>

            {onOpenSchool && !isActive && (
              <button
                type="button"
                onClick={onOpenSchool}
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer"
              >
                <span>Ir a Escuela IA</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
