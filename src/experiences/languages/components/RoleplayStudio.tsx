import React, { useState } from 'react';
import { 
  Briefcase, Plane, Coffee, Sparkles, Send, Volume2, Award, 
  CheckCircle, ArrowRight, RotateCcw, Loader2, ShieldCheck, Star
} from 'lucide-react';
import { ScenarioEngine, SCENARIO_CATALOG } from '../services/scenarioEngine';
import { RoleplayScenarioDef, RoleplayEvaluation, StudentLanguageProfile } from '../types';
import { VoiceEngine } from '../services/voiceEngine';

interface RoleplayStudioProps {
  profile: StudentLanguageProfile;
  onAddXP: (amount: number, reason: string) => void;
}

export const RoleplayStudio: React.FC<RoleplayStudioProps> = ({
  profile,
  onAddXP
}) => {
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenarioDef>(SCENARIO_CATALOG[0]);
  const [dialogue, setDialogue] = useState<Array<{ speaker: string; text: string }>>([
    { speaker: SCENARIO_CATALOG[0].teacherRole, text: SCENARIO_CATALOG[0].initialTeacherMessage }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<RoleplayEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleSelectScenario = (sc: RoleplayScenarioDef) => {
    setSelectedScenario(sc);
    setDialogue([{ speaker: sc.teacherRole, text: sc.initialTeacherMessage }]);
    setEvaluation(null);
    setInputVal('');
  };

  const handleSendTurn = async () => {
    if (!inputVal.trim() || isLoading) return;
    const studentText = inputVal.trim();
    setInputVal('');

    const newDialogue = [...dialogue, { speaker: selectedScenario.studentRole, text: studentText }];
    setDialogue(newDialogue);
    setIsLoading(true);

    try {
      const history = newDialogue.map(d => ({
        role: d.speaker === selectedScenario.studentRole ? ('user' as const) : ('assistant' as const),
        content: d.text
      }));

      const reply = await ScenarioEngine.executeScenarioTurn(selectedScenario, studentText, history);
      setDialogue(prev => [...prev, { speaker: selectedScenario.teacherRole, text: reply }]);

      VoiceEngine.speakText(reply, profile.targetLanguage);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishAndEvaluate = async () => {
    if (dialogue.length < 2 || isEvaluating) return;
    setIsEvaluating(true);
    try {
      const evalResult = await ScenarioEngine.evaluateScenario(selectedScenario, dialogue);
      setEvaluation(evalResult);
      onAddXP(evalResult.score, `Roleplay "${selectedScenario.title}" completado con éxito`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/20 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
            <span className="text-xl">{selectedScenario.icon}</span>
            <span>Estudio de Roleplay & Simulaciones Reales</span>
          </h3>
          <p className="text-xs text-slate-400">Entrena situaciones profesionales, académicas y cotidianas con evaluación formal.</p>
        </div>

        <div className="flex items-center gap-2">
          {dialogue.length >= 3 && !evaluation && (
            <button
              onClick={handleFinishAndEvaluate}
              disabled={isEvaluating}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isEvaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
              <span>{isEvaluating ? 'Evaluando...' : 'Finalizar & Evaluar'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Catálogo de Escenarios */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {SCENARIO_CATALOG.map((sc) => {
          const isSel = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => handleSelectScenario(sc)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                isSel
                  ? 'border-cyan-400 bg-slate-950 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <span className="text-2xl block mb-1">{sc.icon}</span>
              <p className="font-extrabold text-xs text-white leading-tight">{sc.title}</p>
              <span className="text-[10px] text-cyan-400 font-mono mt-0.5 block">{sc.difficulty}</span>
            </button>
          );
        })}
      </div>

      {/* Tarjeta de Información del Escenario */}
      <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <p className="text-slate-300"><strong>Objetivo:</strong> {selectedScenario.goal}</p>
          <p className="text-slate-400">
            <strong>Vocabulario Clave:</strong> {selectedScenario.targetVocabulary.join(', ')}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 font-mono font-bold text-[11px] border border-cyan-500/30">
          Tu rol: {selectedScenario.studentRole}
        </span>
      </div>

      {/* Feed del Diálogo del Roleplay */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 min-h-[260px] max-h-[360px] overflow-y-auto scrollbar-thin">
        {dialogue.map((d, i) => {
          const isStudent = d.speaker === selectedScenario.studentRole;
          return (
            <div key={i} className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'} space-y-1`}>
              <span className="text-[10px] font-mono text-slate-500 font-bold px-1">{d.speaker}</span>
              <div
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[85%] ${
                  isStudent
                    ? 'bg-cyan-600 text-white font-medium shadow-md'
                    : 'bg-slate-900 border border-cyan-500/20 text-slate-200'
                }`}
              >
                <p>{d.text}</p>
                {!isStudent && (
                  <button
                    onClick={() => VoiceEngine.speakText(d.text, profile.targetLanguage)}
                    className="mt-1 flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-200 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Escuchar</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{selectedScenario.teacherRole} está respondiendo...</span>
          </div>
        )}
      </div>

      {/* Input de Respuesta */}
      {!evaluation && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendTurn();
          }}
          className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-2 focus-within:border-cyan-500/40"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={`Habla o escribe como ${selectedScenario.studentRole}...`}
            className="flex-1 bg-transparent text-xs sm:text-sm text-cyan-100 placeholder-slate-500 focus:outline-none px-2"
          />
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Responder</span>
          </button>
        </form>
      )}

      {/* Scorecard de Evaluación Final */}
      {evaluation && (
        <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-5 space-y-4 animate-fadeIn shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm sm:text-base">
              <ShieldCheck className="w-5 h-5" />
              <span>Rúbrica de Evaluación Pedagógica Oficial</span>
            </div>
            <span className="text-xl font-black font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/30">
              {evaluation.score} / 100
            </span>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-sans">{evaluation.feedback}</p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">Fluidez</span>
              <span className="text-sm font-mono font-black text-cyan-300">{evaluation.fluencyScore}%</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">Gramática</span>
              <span className="text-sm font-mono font-black text-cyan-300">{evaluation.grammarScore}%</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">Vocabulario</span>
              <span className="text-sm font-mono font-black text-cyan-300">{evaluation.vocabularyScore}%</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">Claridad</span>
              <span className="text-sm font-mono font-black text-cyan-300">{evaluation.clarityScore}%</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-bold block">Pronunciación</span>
              <span className="text-sm font-mono font-black text-cyan-300">{evaluation.pronunciationScore}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-500/20 space-y-1">
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Puntos Fuertes:
              </span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                {evaluation.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-500/20 space-y-1">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Star className="w-3.5 h-3.5" /> Áreas a Reforzar:
              </span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                {evaluation.areasToImprove.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => handleSelectScenario(selectedScenario)}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs border border-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repetir Simulación</span>
          </button>
        </div>
      )}
    </div>
  );
};
