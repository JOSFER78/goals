import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { CROSS_APP_BADGES } from '../../services/GamificationEngine';
import { CrossAppBadge, DomainCurrencies, DomainCurrencyId } from '../../types/gamification';
import { Award, Lock, CheckCircle2, Sparkles, Filter, Info } from 'lucide-react';

interface SynergyBadgesGridProps {
  badges?: CrossAppBadge[];
  synergyBadges?: Record<string, number>;
  currencies?: DomainCurrencies;
  className?: string;
}

const CURRENCY_INFO: Record<DomainCurrencyId, { name: string; icon: string; color: string }> = {
  stardust: { name: 'Stardust', icon: '✨', color: 'text-indigo-400' },
  bytes: { name: 'Bytes', icon: '💾', color: 'text-purple-400' },
  flow: { name: 'Flow', icon: '🌊', color: 'text-cyan-400' },
  synapse: { name: 'Synapse', icon: '🧠', color: 'text-amber-400' },
  forgeCrystals: { name: 'Cristales', icon: '💎', color: 'text-emerald-400' }
};

export const SynergyBadgesGrid: React.FC<SynergyBadgesGridProps> = ({
  badges = CROSS_APP_BADGES,
  synergyBadges: propSynergyBadges,
  currencies: propCurrencies,
  className = ''
}) => {
  const progress = useProgress();
  const synergyBadges = propSynergyBadges || progress.synergyBadges || {};
  const currencies = propCurrencies || progress.currencies;

  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const earnedCount = badges.filter(b => !!synergyBadges[b.id]).length;
  const totalCount = badges.length;

  const filteredBadges = badges.filter(badge => {
    const isEarned = !!synergyBadges[badge.id];
    if (filter === 'unlocked') return isEarned;
    if (filter === 'locked') return !isEarned;
    return true;
  });

  return (
    <div className={`space-y-3 ${className}`}>
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Insignias de Sinergia Cruzada</span>
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
              {earnedCount} / {totalCount}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Logros multi-app desbloqueados al dominar múltiples dominios temáticos
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-[11px]">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todas ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unlocked')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              filter === 'unlocked'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ganadas ({earnedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('locked')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              filter === 'locked'
                ? 'bg-slate-700 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Bloqueadas ({totalCount - earnedCount})
          </button>
        </div>
      </div>

      {/* Grid of Badge Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredBadges.map((badge) => {
          const isEarned = !!synergyBadges[badge.id];
          const earnedTimestamp = synergyBadges[badge.id];
          const earnedDateStr = earnedTimestamp
            ? new Date(earnedTimestamp).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
            : null;

          return (
            <div
              key={badge.id}
              className={`relative overflow-hidden rounded-2xl p-4 border backdrop-blur-xl transition-all ${
                isEarned
                  ? 'bg-gradient-to-br from-slate-900/95 via-indigo-950/30 to-slate-900/95 border-amber-500/40 shadow-lg shadow-amber-950/20'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-75 grayscale-[0.6] hover:grayscale-0 hover:opacity-100'
              }`}
            >
              {/* Top Row: Icon, Title & Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border shrink-0 transition-transform ${
                      isEarned
                        ? 'bg-amber-500/15 border-amber-500/40 shadow-md shadow-amber-500/20 scale-105'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {badge.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className={`font-bold text-sm ${isEarned ? 'text-white' : 'text-slate-300'}`}>
                        {badge.name}
                      </h5>
                      {isEarned && (
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0">
                  {isEarned ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      DESBLOQUEADA
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-900 border border-slate-800 text-slate-500">
                      <Lock className="w-2.5 h-2.5" />
                      BLOQUEADA
                    </span>
                  )}
                </div>
              </div>

              {/* Requirements List & Progress */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Requisitos de Dominio:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {Object.entries(badge.requirements).map(([currKey, requiredAmount]) => {
                    const domainKey = currKey as DomainCurrencyId;
                    const info = CURRENCY_INFO[domainKey] || { name: currKey, icon: '⭐', color: 'text-slate-300' };
                    const currentAmount = currencies[domainKey] || 0;
                    const target = requiredAmount || 0;
                    const isMet = currentAmount >= target;
                    const pct = Math.min(100, Math.round((currentAmount / target) * 100));

                    return (
                      <div
                        key={currKey}
                        className={`p-2 rounded-xl border text-[11px] font-mono flex flex-col gap-1 ${
                          isMet
                            ? 'bg-slate-900/90 border-emerald-500/30'
                            : 'bg-slate-950/80 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-slate-300">
                            <span>{info.icon}</span>
                            <span>{info.name}</span>
                          </span>
                          <span className={`font-bold ${isMet ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {currentAmount} / {target}
                          </span>
                        </div>

                        {/* Progress bar per requirement */}
                        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isMet ? 'bg-emerald-400' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Earned timestamp footer */}
                {isEarned && earnedDateStr && (
                  <div className="text-[10px] font-mono text-amber-300/80 pt-1 text-right">
                    Conseguida el {earnedDateStr}
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
