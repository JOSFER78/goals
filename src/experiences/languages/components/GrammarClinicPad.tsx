import React, { useState } from 'react';
import { 
  Sparkles, Layers, BookOpen, CheckCircle2, AlertCircle, 
  ArrowRight, Loader2, Lightbulb, Search 
} from 'lucide-react';
import { TeacherAgent } from '../services/teacherAgent';
import { StudentLanguageProfile } from '../types';

interface GrammarClinicPadProps {
  profile: StudentLanguageProfile;
  onAddXP: (amount: number, reason: string) => void;
}

const GRAMMAR_TOPICS = [
  {
    id: 'past_simple_vs_present_perfect',
    title: 'Past Simple vs. Present Perfect',
    level: 'B1',
    rule: 'Past Simple = Tiempo cerrado ("yesterday, in 2020"). Present Perfect = Experiencia vital o acción con impacto presente ("I have visited Mars").'
  },
  {
    id: 'conditionals_1_2',
    title: 'Condicionales 1 y 2 (If clauses)',
    level: 'B1',
    rule: 'Tipo 1 (Real): If + Present Simple, will + Infinitivo. Tipo 2 (Hipotético): If + Past Simple, would + Infinitivo.'
  },
  {
    id: 'passive_voice',
    title: 'Voz Pasiva (Passive Voice)',
    level: 'B2',
    rule: 'Sujeto + Verbo To Be (conjugado) + Participio Pasado. El objeto de la acción pasa a ser el centro del mensaje.'
  },
  {
    id: 'reported_speech',
    title: 'Estilo Indirecto (Reported Speech)',
    level: 'B2',
    rule: 'Los tiempos verbales dan un salto hacia el pasado: Presente -> Pasado Simple; Pasado Simple -> Past Perfect.'
  },
  {
    id: 'inversion_adverbs',
    title: 'Inversión Sintáctica con Adverbios Negativos',
    level: 'C1',
    rule: 'Estructura enfática formal: Seldom / Rarely / Never + Auxiliar + Sujeto + Verbo principal.'
  }
];

export const GrammarClinicPad: React.FC<GrammarClinicPadProps> = ({ profile, onAddXP }) => {
  const [selectedTopic, setSelectedTopic] = useState(GRAMMAR_TOPICS[0]);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState<boolean>(false);

  const handleAskAIExplanation = async (topicTitle?: string) => {
    const conceptToExplain = topicTitle || customQuestion || selectedTopic.title;
    if (!conceptToExplain.trim() || isLoadingExplanation) return;

    setIsLoadingExplanation(true);
    setAiExplanation(null);

    try {
      const result = await TeacherAgent.explainConcept(conceptToExplain, profile.targetLanguage);
      setAiExplanation(result);
      onAddXP(15, `Consulta gramatical sobre ${conceptToExplain}`);
    } catch (e: any) {
      setAiExplanation(`Error al consultar al profesor de gramática: ${e.message}`);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/20 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              Clínica de Gramática Contextual & Adaptativa
            </h3>
            <p className="text-xs text-slate-400">Estructuras, reglas visuales y explicaciones socráticas adaptadas a tu nivel.</p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-3 py-1 rounded-xl border border-cyan-500/30">
          NIVEL CEFR {profile.overallLevel}
        </span>
      </div>

      {/* Selector de Temas Gramaticales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {GRAMMAR_TOPICS.map((top) => {
          const isSel = selectedTopic.id === top.id;
          return (
            <button
              key={top.id}
              onClick={() => {
                setSelectedTopic(top);
                setAiExplanation(null);
              }}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                isSel
                  ? 'border-cyan-400 bg-slate-950 shadow-md ring-1 ring-cyan-500/40'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">
                {top.level}
              </span>
              <p className="font-bold text-xs text-white mt-1 leading-tight">{top.title}</p>
            </button>
          );
        })}
      </div>

      {/* Tarjeta de Regla Visual del Tema Seleccionado */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
        
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span>{selectedTopic.title}</span>
          </h4>

          <button
            onClick={() => handleAskAIExplanation(selectedTopic.title)}
            disabled={isLoadingExplanation}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            {isLoadingExplanation ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Explicación Profunda con IA</span>
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
          <strong className="text-cyan-300">Regla Estructural:</strong> {selectedTopic.rule}
        </div>

        {/* Explicación IA si fue solicitada */}
        {aiExplanation && (
          <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2 animate-fadeIn text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
            <span className="font-mono font-bold text-cyan-400 text-xs block mb-1">
              DESGLOSE PEDAGÓGICO DEL PROFESOR IA:
            </span>
            {aiExplanation}
          </div>
        )}

        {/* Consulta Libre de Gramática */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            ¿Tienes otra duda gramatical en {profile.targetLanguage}?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Ej: ¿Cuándo se usa 'used to' vs 'be used to'?"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={() => handleAskAIExplanation()}
              disabled={isLoadingExplanation || !customQuestion.trim()}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-cyan-500/30 transition-all cursor-pointer disabled:opacity-40"
            >
              Consultar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
