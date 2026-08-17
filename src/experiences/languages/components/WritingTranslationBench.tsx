import React, { useState } from 'react';
import { 
  PenTool, Globe, Sparkles, CheckCircle2, AlertCircle, ArrowRight, 
  Loader2, BookOpen, Layers, Lightbulb 
} from 'lucide-react';
import { ContentGenerator } from '../services/contentGenerator';
import { WritingAnalysisResult, StudentLanguageProfile } from '../types';

interface WritingTranslationBenchProps {
  profile: StudentLanguageProfile;
  onAddXP: (amount: number, reason: string) => void;
}

export const WritingTranslationBench: React.FC<WritingTranslationBenchProps> = ({
  profile,
  onAddXP
}) => {
  const [activeMode, setActiveMode] = useState<'writing' | 'translation'>('writing');

  // Estado Writing Lab
  const [writingPrompt, setWritingPrompt] = useState<string>('Email a un profesor pidiendo extender la fecha de entrega de un trabajo');
  const [studentWriting, setStudentWriting] = useState<string>(
    'Dear teacher, I write to you because yesterday my computer was broken and I did not can finish the science project. Can you give me more time please?'
  );
  const [writingAnalysis, setWritingAnalysis] = useState<WritingAnalysisResult | null>(null);
  const [isAnalyzingWriting, setIsAnalyzingWriting] = useState<boolean>(false);

  // Estado Translation Bench
  const [sourceText, setSourceText] = useState<string>(
    'Si hubiéramos llegado diez minutos antes al aeropuerto, no habríamos perdido el vuelo de conexión.'
  );
  const [translationResult, setTranslationResult] = useState<{
    translation: string;
    naturalAlternative: string;
    vocabularyBreakdown: Array<{ word: string; meaning: string }>;
    grammarTip: string;
  } | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const handleAnalyzeWriting = async () => {
    if (!studentWriting.trim() || isAnalyzingWriting) return;
    setIsAnalyzingWriting(true);
    try {
      const result = await ContentGenerator.analyzeWriting(studentWriting, writingPrompt);
      setWritingAnalysis(result);
      onAddXP(result.overallScore, 'Taller de Expresión Escrita completado');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingWriting(false);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim() || isTranslating) return;
    setIsTranslating(true);
    try {
      const res = await ContentGenerator.pedagogicalTranslate(
        sourceText,
        profile.nativeLanguage,
        profile.targetLanguage
      );
      setTranslationResult(res);
      onAddXP(20, 'Traducción pedagógica analizada');
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/20 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl backdrop-blur-xl">
      
      {/* Header y Selector de Modo */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            {activeMode === 'writing' ? <PenTool className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              {activeMode === 'writing' ? 'Taller de Redacción & Expresión Escrita' : 'Banco de Traducción Pedagógica'}
            </h3>
            <p className="text-xs text-slate-400">
              {activeMode === 'writing'
                ? 'Corrección en 4 capas: errores, explicación, estilo nativo y práctica.'
                : 'Traducción estructurada con desglose léxico y tips de gramática comparada.'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveMode('writing')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'writing'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-cyan-300'
            }`}
          >
            Escritura (4 Capas)
          </button>
          <button
            onClick={() => setActiveMode('translation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'translation'
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-cyan-300'
            }`}
          >
            Traducción
          </button>
        </div>
      </div>

      {/* MODO 1: TALLER DE ESCRITURA */}
      {activeMode === 'writing' && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Consigna / Contexto:</label>
            <input
              type="text"
              value={writingPrompt}
              onChange={(e) => setWritingPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-cyan-300 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Tu Texto en {profile.targetLanguage}:</label>
            <textarea
              rows={4}
              value={studentWriting}
              onChange={(e) => setStudentWriting(e.target.value)}
              placeholder="Escribe tu párrafo o carta aquí..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
            />
          </div>

          <button
            onClick={handleAnalyzeWriting}
            disabled={isAnalyzingWriting || !studentWriting.trim()}
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isAnalyzingWriting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Analizando en 4 Capas con el Profesor IA...</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4 text-slate-950" />
                <span>Corregir Redacción (Análisis 4 Capas)</span>
              </>
            )}
          </button>

          {/* Resultado de las 4 Capas */}
          {writingAnalysis && (
            <div className="space-y-3 pt-2 animate-fadeIn">
              
              {/* Capa 1: Corrección de Errores */}
              <div className="bg-slate-950 border border-rose-500/30 rounded-2xl p-4 space-y-2">
                <span className="text-xs font-bold text-rose-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Capa 1: Detección de Errores
                </span>
                {writingAnalysis.corrections.length > 0 ? (
                  <div className="space-y-1.5">
                    {writingAnalysis.corrections.map((c, i) => (
                      <div key={i} className="text-xs bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="line-through text-rose-300 mr-2">{c.wrong}</span>
                          <span className="text-emerald-400 font-bold">➔ {c.right}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{c.reason}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-300">¡No se detectaron errores graves en la estructura!</p>
                )}
              </div>

              {/* Capa 2: Explicación Pedagógica */}
              <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-4 space-y-1.5">
                <span className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" /> Capa 2: Explicación Didáctica
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">{writingAnalysis.explanation}</p>
              </div>

              {/* Capa 3: Versión Nativa y Natural */}
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-4 space-y-1.5">
                <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Capa 3: Cómo lo Diría un Nativo
                </span>
                <p className="text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20">
                  "{writingAnalysis.naturalVersion}"
                </p>
              </div>

              {/* Capa 4: Práctica Sugerida */}
              <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-4 space-y-1.5">
                <span className="text-xs font-bold text-purple-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Capa 4: Desafío de Consolidación
                </span>
                <p className="text-xs text-purple-200">{writingAnalysis.suggestedPractice}</p>
              </div>

            </div>
          )}
        </div>
      )}

      {/* MODO 2: BANCO DE TRADUCCIÓN */}
      {activeMode === 'translation' && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Texto en {profile.nativeLanguage} a traducir:
            </label>
            <textarea
              rows={3}
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            onClick={handleTranslate}
            disabled={isTranslating || !sourceText.trim()}
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isTranslating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Generando Traducción Pedagógica...</span>
              </>
            ) : (
              <>
                <Globe className="w-4 h-4 text-slate-950" />
                <span>Traducir a {profile.targetLanguage}</span>
              </>
            )}
          </button>

          {translationResult && (
            <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-5 space-y-4 animate-fadeIn">
              <div>
                <span className="text-[11px] text-slate-400 font-mono block">Traducción Precisa:</span>
                <h4 className="text-base font-bold text-white mt-0.5">{translationResult.translation}</h4>
              </div>

              <div>
                <span className="text-[11px] text-emerald-400 font-mono block">Alternativa Más Natural / Idiomática:</span>
                <p className="text-xs text-emerald-200 mt-0.5 font-medium">{translationResult.naturalAlternative}</p>
              </div>

              {translationResult.vocabularyBreakdown && translationResult.vocabularyBreakdown.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] text-cyan-400 font-mono font-bold block mb-1.5">Desglose Léxico Clave:</span>
                  <div className="flex flex-wrap gap-2">
                    {translationResult.vocabularyBreakdown.map((v, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                        <strong className="text-cyan-300">{v.word}</strong>: {v.meaning}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <p>{translationResult.grammarTip}</p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
