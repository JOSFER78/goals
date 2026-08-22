import React, { useState } from 'react';
import { 
  Scale, Search, FileCheck, CheckCircle2, AlertTriangle, ExternalLink, 
  Loader2, ShieldCheck, Zap, Info, Sparkles, HelpCircle, ArrowRight, BookOpen
} from 'lucide-react';
import { analyzeWithMatizaAI } from '../services/criterioAIService';
import { MatizaAnalysisResult } from '../types';

interface MatizaToolModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAddXP?: (amount: number, reason: string) => void;
}

const SAMPLE_CLAIMS = [
  '¿El telescopio James Webb ha confirmado vida extraterrestre en el exoplaneta K2-18b?',
  '¿El entrenamiento de modelos de IA consume más agua y electricidad que una ciudad entera?',
  '¿Es cierto que en España se ha aprobado una ley que prohíbe poner deberes los fines de semana?',
  '¿La ignición por fusión nuclear en el laboratorio NIF generó más energía que toda la red eléctrica?'
];

export const MatizaToolModal: React.FC<MatizaToolModalProps> = ({ isOpen, onClose, onAddXP }) => {
  if (isOpen === false) return null;
  const [claimText, setClaimText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<MatizaAnalysisResult | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);

  const handleAnalyze = async (textToUse?: string) => {
    const text = textToUse || claimText;
    if (!text.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setResult(null);
    if (textToUse) setClaimText(textToUse);

    try {
      const res = await analyzeWithMatizaAI(text);
      setResult(res);
      if (!hasAnalyzed) {
        setHasAnalyzed(true);
        onAddXP?.(30, 'Análisis de afirmación en 4 capas con Laboratorio MATIZA');
      }
    } catch (err: any) {
      // Fallback
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full space-y-5 animate-fadeIn font-display">
      
      {/* Hero Header de la Estación MATIZA */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-amber-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg sm:text-xl text-white">
                  Laboratorio MATIZA
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  ESTACIÓN DE RIGOR & CONTRASTE
                </span>
              </div>
              <p className="text-xs text-amber-200/70 mt-0.5">
                Descompón cualquier noticia, afirmación o titular en 4 capas: Afirmación, Hechos probados, Contexto faltante y Conclusión matizada.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulario de Entrada y Consultas de Ejemplo */}
      <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-400" />
            <span>Introduce una afirmación, noticia o duda para analizar:</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Ej: ¿El James Webb ha descubierto ciudades alienígenas en Marte?"
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 shadow-inner"
            />
            <button
              type="button"
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing || !claimText.trim()}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analizando en 4 Capas...</span>
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4" />
                  <span>Matizar con Rigor</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Muestras Rápidas */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 font-mono">
            O PRUEBA CON UN CASO DE ACTUALIDAD CIENTÍFICA / LEGAL:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_CLAIMS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAnalyze(sample)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-all hover:text-amber-300 cursor-pointer text-left"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultados Estructurados en 4 Capas */}
      {result && (
        <div className="p-5 sm:p-7 rounded-3xl bg-slate-950 border border-amber-500/40 shadow-2xl space-y-5 animate-fadeIn">
          
          {/* Cabecera del Veredicto */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                DICTAMEN DE RIGOR MATIZA
              </span>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                {result.verdict}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                Certeza Factual: {result.confidenceScore}%
              </div>
            </div>
          </div>

          {/* Las 4 Capas del Análisis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Capa 1: Hechos Confirmados con Evidencia */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 font-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>1. HECHOS CONFIRMADOS POR FUENTES</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-100 leading-relaxed list-disc list-inside">
                {result.confirmedFacts.map((fact, i) => (
                  <li key={i}>{fact}</li>
                ))}
              </ul>
            </div>

            {/* Capa 2: Contexto Faltante o Datos Inciertos */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-400 font-mono">
                <AlertTriangle className="w-4 h-4" />
                <span>2. CONTEXTO FALTANTE / EXAGERACIONES</span>
              </div>
              <ul className="space-y-1.5 text-xs text-cyan-100 leading-relaxed list-disc list-inside">
                {result.uncertainOrMissing.map((missing, i) => (
                  <li key={i}>{missing}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Capa 3: Conclusión Matizada */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400 font-mono">
              <Sparkles className="w-4 h-4" />
              <span>3. SÍNTESIS MATIZADA PARA PENSAR</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {result.nuancedConclusion}
            </p>
          </div>

          {/* Capa 4: Fuentes Primarias y Consenso */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-400">
              4. FUENTES PRIMARIAS RECOMENDADAS PARA LECTURA LATERAL:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {result.verifiedSources.map((source, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <strong className="text-white block font-bold truncate">{source.title}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">{source.domain} · {source.authorityLevel}</span>
                    </div>
                  </div>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-400 transition-colors"
                      title="Abrir fuente oficial"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
