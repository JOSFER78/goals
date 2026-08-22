import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { DomainCurrencies, DomainCurrencyId } from '../../types/gamification';

interface CurrencyBarProps {
  currencies?: DomainCurrencies;
  compact?: boolean;
  className?: string;
  onCurrencyClick?: (currencyId: DomainCurrencyId) => void;
}

interface CurrencyItemConfig {
  id: DomainCurrencyId;
  name: string;
  domain: string;
  icon: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  glowColor: string;
}

const CURRENCIES_CONFIG: CurrencyItemConfig[] = [
  {
    id: 'stardust',
    name: 'Stardust',
    domain: 'Cosmos 3D',
    icon: '✨',
    colorClass: 'text-indigo-400',
    borderClass: 'border-indigo-500/30',
    bgClass: 'bg-indigo-500/10 hover:bg-indigo-500/20',
    glowColor: 'rgba(99, 102, 241, 0.15)'
  },
  {
    id: 'bytes',
    name: 'Bytes',
    domain: 'IA Lab',
    icon: '💾',
    colorClass: 'text-purple-400',
    borderClass: 'border-purple-500/30',
    bgClass: 'bg-purple-500/10 hover:bg-purple-500/20',
    glowColor: 'rgba(168, 85, 247, 0.15)'
  },
  {
    id: 'flow',
    name: 'Flow',
    domain: 'Idiomas',
    icon: '🌊',
    colorClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/30',
    bgClass: 'bg-cyan-500/10 hover:bg-cyan-500/20',
    glowColor: 'rgba(6, 182, 212, 0.15)'
  },
  {
    id: 'synapse',
    name: 'Synapse',
    domain: 'Criterio',
    icon: '🧠',
    colorClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
    bgClass: 'bg-amber-500/10 hover:bg-amber-500/20',
    glowColor: 'rgba(245, 158, 11, 0.15)'
  },
  {
    id: 'forgeCrystals',
    name: 'Cristales',
    domain: 'School',
    icon: '💎',
    colorClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
    bgClass: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    glowColor: 'rgba(16, 185, 129, 0.15)'
  }
];

export const CurrencyBar: React.FC<CurrencyBarProps> = ({
  currencies: propCurrencies,
  compact = false,
  className = '',
  onCurrencyClick
}) => {
  const progress = useProgress();
  const currencies = propCurrencies || progress.currencies;

  // ── Modo Compacto (Una sola fila de chips de monedas) ──
  if (compact) {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        {CURRENCIES_CONFIG.map((curr) => {
          const amount = currencies[curr.id] || 0;
          return (
            <div
              key={curr.id}
              onClick={() => onCurrencyClick?.(curr.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl border text-xs font-mono font-bold transition-all ${curr.bgClass} ${curr.borderClass} ${
                onCurrencyClick ? 'cursor-pointer active:scale-95' : 'cursor-default'
              }`}
              title={`${curr.name} (${curr.domain}): ${amount.toLocaleString()} acumulados`}
            >
              <span className="text-sm select-none">{curr.icon}</span>
              <span className={curr.colorClass}>{amount.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // ── Modo Completo (Grid de tarjetas estilizadas para Perfil / Stats) ──
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between px-1">
        <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
          Monedas de Dominio Temático
        </h4>
        <span className="text-[10px] font-mono text-slate-500">
          5 Dominios del Ecosistema
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {CURRENCIES_CONFIG.map((curr) => {
          const amount = currencies[curr.id] || 0;
          return (
            <div
              key={curr.id}
              onClick={() => onCurrencyClick?.(curr.id)}
              className={`relative overflow-hidden p-3 rounded-2xl border backdrop-blur-xl transition-all ${curr.bgClass} ${curr.borderClass} ${
                onCurrencyClick ? 'cursor-pointer hover:scale-[1.02] active:scale-95' : ''
              }`}
              style={{
                boxShadow: `0 4px 15px ${curr.glowColor}`
              }}
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl select-none">{curr.icon}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-950/70 border border-slate-800 text-slate-400">
                  {curr.domain}
                </span>
              </div>

              <div className="mt-2">
                <p className="text-[11px] font-medium text-slate-400 truncate">
                  {curr.name}
                </p>
                <p className={`text-base sm:text-lg font-black font-mono tracking-tight ${curr.colorClass}`}>
                  {amount.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
