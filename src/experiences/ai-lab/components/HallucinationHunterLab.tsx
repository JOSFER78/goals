import React, { useState } from 'react';
import { HallucinationCase } from '../types/aiLabTypes';
import { HALLUCINATION_CASES } from '../data/aiLabDilemmasData';
import { 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  Award,
  AlertTriangle
} from 'lucide-react';

interface HallucinationHunterLabProps {
  onAddXP?: (amount: number, reason: string) => void;
}

export const HallucinationHunterLab: React.FC<HallucinationHunterLabProps> = ({ onAddXP }) => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);
  const [isDebunked, setIsDebunked] = useState<boolean>(false);
  const [solvedCases, setSolvedCases] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const currentCase: HallucinationCase = HALLUCINATION_CASES[currentCaseIndex];

  const handleRevealEvidence = () => {
    if (!isDebunked) {
      setIsDebunked(true);
      if (!solvedCases.includes(currentCase.id)) {
        setSolvedCases((prev) => [...prev, currentCase.id]);
        if (onAddXP) onAddXP(20, `Caso Forense Resuelto: ${currentCase.title}`);
      }
    }
  };

  const handleNextCase = () => {
    setIsDebunked(false);
    setSelectedWord(null);
    setCurrentCaseIndex((prev) => (prev + 1) % HALLUCINATION_CASES.length);
  };

  const handlePrevCase = () => {
    setIsDebunked(false);
    setSelectedWord(null);
    setCurrentCaseIndex((prev) => (prev === 0 ? HALLUCINATION_CASES.length - 1 : prev - 1));
  };

  const categoryNames: Record<string, string> = {
    fabricated_citation: 'Cita Legal o Académica Inventada',
    historical_anachronism: 'Anacronismo Histórico / Hecho Falso',
    logical_trap: 'Trampa Lógica y Pseudociencia',
    math_physics_error: 'Error de Física o Razonamiento Numérico',
    synthetic_image: 'Medio Audiovisual Sintético'
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                Caza-Alucinaciones Forense
              </h2>
              <p className="text-xs text-slate-400">
                Audita respuestas reales de IA con errores sutiles, identifica la trampa y contrasta con la verdad científica.
              </p>
            </div>
          </div>

          {/* Insignia de Detective Forense */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shrink-0">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Casos Resueltos: {solvedCases.length}/{HALLUCINATION_CASES.length}</span>
          </div>
        </div>
      </div>

      {/* Caso Forense Activo */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6">
        
        {/* Metadatos del Caso */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-mono text-xs font-black flex items-center justify-center">
              #{currentCaseIndex + 1}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              {currentCase.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium">
              {categoryNames[currentCase.category] || 'Alucinación'}
            </span>
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase border ${
              currentCase.difficulty === 'fácil' 
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : currentCase.difficulty === 'medio'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}>
              {currentCase.difficulty}
            </span>
          </div>
        </div>

        {/* 1. Pregunta formulada por el usuario */}
        <div className="space-y-1.5">
          <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
            Pregunta / Prompt introducido:
          </span>
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 text-xs sm:text-sm font-medium">
            "{currentCase.prompt}"
          </div>
        </div>

        {/* 2. Respuesta Generada por la IA (con trampa sutil) */}
        <div className="space-y-1.5">
          <span className="text-[11px] uppercase font-bold text-purple-300 tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Respuesta Generada por el Modelo (con total elocuencia):
          </span>
          
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all text-xs sm:text-sm leading-relaxed ${
            isDebunked
              ? 'bg-rose-950/20 border-rose-500/40 text-slate-200'
              : 'bg-slate-950 border-purple-500/30 text-slate-200'
          }`}>
            {isDebunked ? (
              <div>
                {currentCase.aiResponse.split(currentCase.hallucinatedSubstring).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    <span>{part}</span>
                    {i < arr.length - 1 && (
                      <span className="bg-rose-500/30 text-rose-300 border border-rose-500/50 px-1 py-0.5 rounded font-bold underline decoration-rose-500 animate-pulse">
                        {currentCase.hallucinatedSubstring}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p>{currentCase.aiResponse}</p>
            )}
          </div>
        </div>

        {/* 3. Panel de Descubrimiento de Evidencia Real */}
        {!isDebunked ? (
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleRevealEvidence}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Verificar Evidencia Forense (+20 XP)</span>
            </button>
          </div>
        ) : (
          <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-4 animate-fadeIn">
            
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>¡Alucinación Desenmascarada!</span>
            </div>

            {/* Hecho Real Fáctico */}
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold text-emerald-300 tracking-wider block">
                La Realidad Comprobada:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                {currentCase.realFact}
              </p>
            </div>

            {/* Explicación Pedagógica del Fallo */}
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                ¿Por qué alucinó el modelo?
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentCase.explanation}
              </p>
            </div>

            {/* Enlace a fuente si existe */}
            {currentCase.sourceUrl && (
              <div className="pt-2 flex justify-end">
                <a
                  href={currentCase.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1.5 underline"
                >
                  <span>Consultar caso en Wikipedia / Registro Oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

          </div>
        )}

        {/* Navegación entre casos */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrevCase}
            className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-bold cursor-pointer transition-all"
          >
            Caso Anterior
          </button>

          <span className="text-xs font-mono text-slate-400">
            {currentCaseIndex + 1} de {HALLUCINATION_CASES.length}
          </span>

          <button
            type="button"
            onClick={handleNextCase}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-purple-600/30"
          >
            <span>Siguiente Caso</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
