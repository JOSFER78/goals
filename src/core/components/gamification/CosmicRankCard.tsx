import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { CosmicRankInfo, DomainCurrencies } from '../../types/gamification';
import { Sparkles, Shield, TrendingUp, Zap, Award } from 'lucide-react';

interface CosmicRankCardProps {
  rankInfo?: CosmicRankInfo;
  currencies?: DomainCurrencies;
  harmonyFactor?: number;
  xp?: number;
  className?: string;
}

const ROMAN_TIERS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const CURRENCY_SPECS = [
  { key: 'stardust' as const, name: 'Stardust', icon: '✨', color: '#6366F1', label: 'Cosmos' },
  { key: 'bytes' as const, name: 'Bytes', icon: '💾', color: '#A855F7', label: 'IA Lab' },
  { key: 'flow' as const, name: 'Flow', icon: '🌊', color: '#06B6D4', label: 'Idiomas' },
  { key: 'synapse' as const, name: 'Synapse', icon: '🧠', color: '#F59E0B', label: 'Criterio' },
  { key: 'forgeCrystals' as const, name: 'Cristales', icon: '💎', color: '#10B981', label: 'School' }
];

export const CosmicRankCard: React.FC<CosmicRankCardProps> = ({
  rankInfo: propRankInfo,
  currencies: propCurrencies,
  harmonyFactor: propHarmony,
  xp: propXp,
  className = ''
}) => {
  const progress = useProgress();
  const rank = propRankInfo || progress.cosmicRank;
  const currencies = propCurrencies || progress.currencies;
  const harmony = propHarmony !== undefined ? propHarmony : progress.harmonyFactor;
  const xp = propXp !== undefined ? propXp : progress.userData.xp;

  const romanTier = ROMAN_TIERS[Math.max(0, Math.min(9, (rank.tier || 1) - 1))];
  const haloColor = rank.haloHex || '#6366F1';

  // ── Radar Pentagonal SVG Geometry ──
  const cx = 110;
  const cy = 110;
  const maxR = 70;

  // Compute normalized values for the 5 vertices
  const rawValues = CURRENCY_SPECS.map(c => currencies[c.key] || 0);
  const maxVal = Math.max(100, ...rawValues);

  // Radar points at radius ratio
  const getPoint = (index: number, ratio: number) => {
    // 5 vertices: angle from -90 deg (top)
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5;
    return {
      x: cx + ratio * maxR * Math.cos(angle),
      y: cy + ratio * maxR * Math.sin(angle)
    };
  };

  const getPolygonPoints = (ratio: number) => {
    return [0, 1, 2, 3, 4]
      .map(i => {
        const pt = getPoint(i, ratio);
        return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      })
      .join(' ');
  };

  // User data polygon points
  const dataPoints = CURRENCY_SPECS.map((c, i) => {
    const val = currencies[c.key] || 0;
    // Ratio between 0.15 (for visibility) and 1.0
    const ratio = Math.max(0.15, Math.min(1.0, val / maxVal));
    return getPoint(i, ratio);
  });

  const dataPolygonStr = dataPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // Harmony bonus percentage (+0% to +50%)
  const harmonyBonusPct = Math.round(Math.max(0, (harmony - 1.0)) * 100);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-slate-950/90 border p-5 sm:p-6 backdrop-blur-2xl transition-all shadow-2xl ${className}`}
      style={{
        borderColor: `${haloColor}40`,
        boxShadow: `0 0 30px ${haloColor}15, inset 0 1px 0 rgba(255,255,255,0.05)`
      }}
    >
      {/* Background radial halo accent */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle, ${haloColor} 0%, transparent 70%)` }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Cosmic Rank & Level Info (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Header Tier Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border"
              style={{
                backgroundColor: `${haloColor}18`,
                borderColor: `${haloColor}50`,
                color: haloColor
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>TIER {romanTier} • RANGO CÓSMICO</span>
            </div>

            <div className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
              Nivel en Tier: {rank.levelInTier}/10
            </div>
          </div>

          {/* Tier Name & Global Level */}
          <div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {rank.tierName}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Nivel Universal Global:</span>
              <span className="font-bold font-mono text-white text-sm" style={{ color: haloColor }}>
                Nv. {rank.level} / 100
              </span>
            </p>
          </div>

          {/* Progress Bar towards Next Level */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-indigo-400" />
                <span>Progreso de Nivel</span>
              </span>
              <span className="font-bold text-white">
                {rank.isMaxLevel ? 'NIVEL MÁXIMO' : `${rank.progressPct}%`}
              </span>
            </div>

            {/* Bar Track */}
            <div className="h-3 w-full bg-slate-900/90 rounded-full overflow-hidden border border-slate-800 p-0.5 relative">
              <div
                className="h-full rounded-full transition-all duration-700 relative overflow-hidden"
                style={{
                  width: `${rank.progressPct}%`,
                  background: `linear-gradient(90deg, #6366F1 0%, ${haloColor} 100%)`
                }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>

            {/* XP details */}
            <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-0.5">
              <span>XP Actual: <strong className="text-amber-400">{xp.toLocaleString()} XP</strong></span>
              {!rank.isMaxLevel && rank.xpForNextLevel !== Infinity && (
                <span>Sig. Nivel: <strong className="text-slate-300">{rank.xpForNextLevel.toLocaleString()} XP</strong></span>
              )}
            </div>
          </div>

          {/* Shannon Harmony Factor Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold font-mono text-sm shrink-0">
                Φ
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-200">Armonía de Shannon</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    ×{harmony.toFixed(3)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {harmonyBonusPct > 0 ? (
                    <span className="text-emerald-400 font-medium">+{harmonyBonusPct}% XP Universal</span>
                  ) : (
                    <span>Equilibra las 5 monedas para bonus de XP</span>
                  )}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Radar Pentagonal SVG (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/50 border border-slate-800/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Equilibrio Pentagonal</span>
          </div>

          <div className="relative flex items-center justify-center w-[220px] h-[220px]">
            <svg
              viewBox="0 0 220 220"
              className="w-full h-full overflow-visible drop-shadow-md"
            >
              {/* Concentric grid webs */}
              {[0.25, 0.5, 0.75, 1.0].map((r, idx) => (
                <polygon
                  key={idx}
                  points={getPolygonPoints(r)}
                  fill="none"
                  stroke="rgba(148, 163, 184, 0.15)"
                  strokeWidth="1"
                  strokeDasharray={idx < 3 ? '2 2' : 'none'}
                />
              ))}

              {/* Axis lines */}
              {[0, 1, 2, 3, 4].map(i => {
                const pt = getPoint(i, 1.0);
                return (
                  <line
                    key={i}
                    x1={cx}
                    y1={cy}
                    x2={pt.x}
                    y2={pt.y}
                    stroke="rgba(148, 163, 184, 0.18)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* User Data Polygon */}
              <polygon
                points={dataPolygonStr}
                fill="rgba(99, 102, 241, 0.28)"
                stroke={haloColor}
                strokeWidth="2.2"
                className="transition-all duration-700"
              />

              {/* Vertex points & glows */}
              {dataPoints.map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="3.5"
                  fill={CURRENCY_SPECS[i].color}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                  className="transition-all duration-700"
                />
              ))}

              {/* Labels around perimeter */}
              {CURRENCY_SPECS.map((c, i) => {
                const labelPt = getPoint(i, 1.28);
                return (
                  <g key={c.key} transform={`translate(${labelPt.x}, ${labelPt.y})`}>
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="text-[9px] font-bold select-none fill-slate-300 font-sans"
                    >
                      {c.icon} {c.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[10px] text-slate-400 text-center mt-1">
            Polimatía equilibrada = Máximo multiplicador Φ
          </div>
        </div>

      </div>
    </div>
  );
};
