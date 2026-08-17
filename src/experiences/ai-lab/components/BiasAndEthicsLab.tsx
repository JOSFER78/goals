import React, { useState, useMemo } from 'react';
import { EthicalDilemma } from '../types/aiLabTypes';
import { ETHICAL_DILEMMAS } from '../data/aiLabDilemmasData';
import { 
  Scale, 
  Users, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  RotateCcw,
  BookOpen,
  Info
} from 'lucide-react';

interface BiasAndEthicsLabProps {
  onAddXP?: (amount: number, reason: string) => void;
}

export const BiasAndEthicsLab: React.FC<BiasAndEthicsLabProps> = ({ onAddXP }) => {
  // Simulador de Sesgo en Dataset de Selección de Talento
  const [maleRatio, setMaleRatio] = useState<number>(75); // 75% Hombres / 25% Mujeres en datos históricos
  const [enableMitigation, setEnableMitigation] = useState<boolean>(false);

  // Dilemas Éticos
  const [activeDilemmaIndex, setActiveDilemmaIndex] = useState<number>(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, 'A' | 'B'>>({});

  const femaleRatio = 100 - maleRatio;

  // Cálculo del resultado de la IA según el desbalanceo
  const simulationResults = useMemo(() => {
    // Si no hay mitigación, la IA aprende a favorecer al grupo mayoritario
    let maleAcceptRate = 0.70;
    let femaleAcceptRate = 0.70;

    if (!enableMitigation) {
      const imbalanceFactor = (maleRatio - 50) / 50; // De -1 a 1
      maleAcceptRate = Math.min(0.95, Math.max(0.2, 0.65 + imbalanceFactor * 0.25));
      femaleAcceptRate = Math.min(0.95, Math.max(0.2, 0.65 - imbalanceFactor * 0.35));
    } else {
      // Con mitigación y reponderación
      maleAcceptRate = 0.68;
      femaleAcceptRate = 0.68;
    }

    const maleAccepted = Math.round(maleRatio * maleAcceptRate);
    const femaleAccepted = Math.round(femaleRatio * femaleAcceptRate);
    const totalAccepted = maleAccepted + femaleAccepted;
    const femaleShareInAccepted = totalAccepted > 0 ? Math.round((femaleAccepted / totalAccepted) * 100) : 0;

    const disparity = Math.abs(maleAcceptRate - femaleAcceptRate);
    const isBiased = disparity > 0.12;

    return {
      maleAcceptRate: Math.round(maleAcceptRate * 100),
      femaleAcceptRate: Math.round(femaleAcceptRate * 100),
      femaleShareInAccepted,
      isBiased,
      disparity: Math.round(disparity * 100)
    };
  }, [maleRatio, enableMitigation]);

  const activeDilemma = ETHICAL_DILEMMAS[activeDilemmaIndex];
  const userChoice = selectedChoices[activeDilemma.id];

  const handleVoteDilemma = (choice: 'A' | 'B') => {
    if (!selectedChoices[activeDilemma.id]) {
      setSelectedChoices((prev) => ({ ...prev, [activeDilemma.id]: choice }));
      if (onAddXP) onAddXP(15, `Dilema Ético Analizado: ${activeDilemma.title}`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Laboratorio de Sesgos Algorítmicos & Dilemas Éticos
            </h2>
            <p className="text-xs text-slate-400">
              Experimenta cómo un dataset desbalanceado genera discriminación matemática y toma decisiones éticas sobre la Ley de IA de la UE.
            </p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: SIMULADOR DE SESGO EN DATASET */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-rose-400 tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            1. Simulador de Sesgo en Contratación / Admisión
          </span>
          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
            simulationResults.isBiased
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            {simulationResults.isBiased ? '⚠️ Sesgo Detectado' : '✅ Modelo Equitativo'}
          </span>
        </div>

        {/* Sliders y Controles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-950/70 p-4.5 rounded-2xl border border-slate-800">
          
          {/* Proporción de Datos Históricos */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200">Composición de Datos Históricos:</span>
              <span className="font-mono text-purple-300 font-bold">
                {maleRatio}% Hombres / {femaleRatio}% Mujeres
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={maleRatio}
              onChange={(e) => setMaleRatio(parseInt(e.target.value, 10))}
              className="w-full accent-purple-500 bg-slate-900 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>10% H / 90% M</span>
              <span>50% / 50% (Equilibrado)</span>
              <span>90% H / 10% M</span>
            </div>
          </div>

          {/* Switch de Mitigación / Reweighting */}
          <div className="flex flex-col justify-center space-y-2">
            <span className="text-xs font-bold text-slate-200">Algoritmo de Mitigación de Sesgo:</span>
            <button
              type="button"
              onClick={() => setEnableMitigation(!enableMitigation)}
              className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                enableMitigation
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-600/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{enableMitigation ? 'Mitigación Activa (Reponderación de Clases)' : 'Sin Mitigación (Aprende Datos Crudos)'}</span>
            </button>
          </div>

        </div>

        {/* Resultados del Modelo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-bold">Tasa Aprobación Hombres</span>
            <div className="text-xl font-black text-purple-400">{simulationResults.maleAcceptRate}%</div>
            <span className="text-[10px] text-slate-400">Probabilidad de éxito</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-bold">Tasa Aprobación Mujeres</span>
            <div className="text-xl font-black text-cyan-400">{simulationResults.femaleAcceptRate}%</div>
            <span className="text-[10px] text-slate-400">Probabilidad de éxito</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-center space-y-1">
            <span className="text-[11px] text-slate-400 font-bold">Disparidad de Impacto</span>
            <div className={`text-xl font-black ${simulationResults.isBiased ? 'text-rose-400' : 'text-emerald-400'}`}>
              {simulationResults.disparity}%
            </div>
            <span className="text-[10px] text-slate-400">Diferencia entre grupos</span>
          </div>
        </div>

        {/* Mensaje de Explicación Didáctica */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/25 flex items-start gap-2.5 text-xs text-indigo-200 leading-relaxed">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p>
            {enableMitigation
              ? 'Con la técnica de reponderación (Reweighting), el algoritmo asigna un mayor peso estadístico a los ejemplos del grupo minoritario para garantizar que ambos grupos tengan la misma tasa de selección equitativa (Demographic Parity).'
              : 'Cuando los datos de entrenamiento tienen un 75% de un solo grupo, la red neuronal encuentra que "pertenecer al grupo mayoritario" es una característica predictiva tramposa, perjudicando injustamente a candidatos excelentes del grupo minoritario.'}
          </p>
        </div>

      </div>

      {/* SECCIÓN 2: ARENA DE DILEMAS ÉTICOS Y REGULACIÓN UE */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <span className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            2. Dilemas Morales de la Ley de IA de la Unión Europea
          </span>

          <div className="flex gap-1.5">
            {ETHICAL_DILEMMAS.map((d, idx) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveDilemmaIndex(idx)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeDilemmaIndex === idx
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Dilema #{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Caso del Dilema Activo */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {activeDilemma.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
              {activeDilemma.scenario}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 font-medium">
            <span className="font-bold text-slate-300 block mb-0.5">Contexto de Decisión:</span>
            {activeDilemma.context}
          </div>

          {/* Opciones A vs B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Opción A */}
            <div className={`p-4.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              userChoice === 'A'
                ? 'bg-purple-950/30 border-purple-500 ring-2 ring-purple-500/30'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}>
              <div className="space-y-2">
                <span className="font-bold text-sm text-white block">
                  {activeDilemma.optionA.title}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeDilemma.optionA.action}
                </p>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <strong className="text-slate-300">Consecuencias:</strong> {activeDilemma.optionA.consequences}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleVoteDilemma('A')}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  userChoice === 'A'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {userChoice === 'A' ? '✓ Decisión Elegida' : 'Elegir Opción A'}
              </button>
            </div>

            {/* Opción B */}
            <div className={`p-4.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              userChoice === 'B'
                ? 'bg-purple-950/30 border-purple-500 ring-2 ring-purple-500/30'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
            }`}>
              <div className="space-y-2">
                <span className="font-bold text-sm text-white block">
                  {activeDilemma.optionB.title}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeDilemma.optionB.action}
                </p>
                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <strong className="text-slate-300">Consecuencias:</strong> {activeDilemma.optionB.consequences}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleVoteDilemma('B')}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  userChoice === 'B'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {userChoice === 'B' ? '✓ Decisión Elegida' : 'Elegir Opción B'}
              </button>
            </div>

          </div>

          {/* Veredicto de la Ley de IA de la UE tras votar */}
          {userChoice && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Dictamen del Reglamento de IA de la Unión Europea (EU AI Act):</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activeDilemma.euAiActRegulation}
              </p>
              <div className="text-xs text-amber-200/90 pt-1 font-medium">
                <strong>Pregunta para el debate:</strong> {activeDilemma.reflectionQuestion}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
