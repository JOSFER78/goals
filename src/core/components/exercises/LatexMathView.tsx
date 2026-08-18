/**
 * src/core/components/exercises/LatexMathView.tsx
 * Renderizador de LaTeX y Fórmulas Matemáticas Tipográfico
 */

import React from 'react';

interface LatexMathViewProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export const LatexMathView: React.FC<LatexMathViewProps> = ({ 
  latex, 
  displayMode = true,
  className = '' 
}) => {
  if (!latex) return null;

  const formatMathString = (tex: string): React.ReactNode => {
    let clean = tex.replace(/\$/g, '').trim();

    const fracRegex = /\\frac\{([^}]+)\}\{([^}]+)\}/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = fracRegex.exec(clean)) !== null) {
      if (match.index > lastIndex) {
        parts.push(clean.substring(lastIndex, match.index));
      }
      const num = match[1];
      const den = match[2];
      parts.push(
        <span key={match.index} className="inline-flex flex-col items-center align-middle mx-1 text-center font-serif text-sm">
          <span className="border-b border-cyan-400/60 px-1.5 pb-0.5 leading-tight">{num}</span>
          <span className="px-1.5 pt-0.5 leading-tight">{den}</span>
        </span>
      );
      lastIndex = fracRegex.lastIndex;
    }

    if (lastIndex < clean.length) {
      let remaining = clean.substring(lastIndex);
      remaining = remaining
        .replace(/\\cdot/g, ' · ')
        .replace(/\\times/g, ' × ')
        .replace(/\\pm/g, ' ± ')
        .replace(/\\approx/g, ' ≈ ')
        .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
        .replace(/\\pi/g, 'π')
        .replace(/\\alpha/g, 'α')
        .replace(/\\beta/g, 'β')
        .replace(/\\theta/g, 'θ')
        .replace(/\\Delta/g, 'Δ')
        .replace(/\^2/g, '²')
        .replace(/\^3/g, '³');

      parts.push(<span key="rem">{remaining}</span>);
    }

    return parts;
  };

  return (
    <div className={`${displayMode ? 'p-3 my-2 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-center font-serif text-cyan-200 tracking-wide text-base shadow-inner' : 'inline-block font-serif text-cyan-300'} ${className}`}>
      {formatMathString(latex)}
    </div>
  );
};
