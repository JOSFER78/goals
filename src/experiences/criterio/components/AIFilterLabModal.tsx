import React, { useState } from 'react';
import { 
  Bot, Sparkles, AlertTriangle, CheckCircle2, Search, Volume2, 
  HelpCircle, Eye, ShieldCheck, Zap, ArrowRight, ShieldAlert, Award
} from 'lucide-react';
import { AI_FORENSIC_CASES } from '../data/aiScenariosData';
import { AIForensicCase } from '../types';

interface AIFilterLabModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onAddXP?: (amount: number, reason: string) => void;
}

export const AIFilterLabModal: React.FC<AIFilterLabModalProps> = ({ isOpen, onClose, onAddXP }) => {
  if (isOpen === false) return null;
  const [selectedCaseId, setSelectedCaseId] = useState<string>(AI_FORENSIC_CASES[0].id);
  const [inspectedClues, setInspectedClues] = useState<string[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [hasClaimedXP, setHasClaimedXP] = useState<Record<string, boolean>>({});

  const activeCase: AIForensicCase = AI_FORENSIC_CASES.find((c) => c.id === selectedCaseId) || AI_FORENSIC_CASES[0];

  const handleToggleClue = (clue: string) => {
    setInspectedClues((prev) => {
      const next = prev.includes(clue) ? prev : [...prev, clue];
      if (next.length === activeCase.inspectionClues.length && !isSolved) {
        setIsSolved(true);
        if (!hasClaimedXP[activeCase.id]) {
          setHasClaimedXP((p) => ({ ...p, [activeCase.id]: true }));
          onAddXP?.(35, `Caso Forense de IA resuelto: ${activeCase.title}`);
        }
      }
      return next;
    });
  };

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setInspectedClues([]);
    setIsSolved(false);
  };

  return (
    <div className="w-full space-y-5 animate-fadeIn font-display">
      
      {/* Cabecera del Laboratorio Forense */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-rose-500/30 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-lg sm:text-xl text-white">
                Laboratorio Forense de IA
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 border border-rose-500/30 text-rose-300">
                AUDITORÍA DE MEDIOS SINTÉTICOS
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Aprende a detectar alucinaciones en chatbots, anomalías en imágenes generadas y clonación de voz.
            </p>
          </div>
        </div>

        {/* Pestañas de Casos Forenses */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {AI_FORENSIC_CASES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => handleSelectCase(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 border ${
                selectedCaseId === c.id
                  ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-md font-black'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {c.type === 'text_hallucination' ? '📄 Texto / Citas' : c.type === 'image_synthetic' ? '🖼️ Imagen Sintética' : '🎙️ Voz Clonada'}
            </button>
          ))}
        </div>
      </div>

      {/* Caso Forense Activo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Columna Izquierda: La Salida Generada por la IA (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                CASO: {activeCase.title}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                Dificultad: {activeCase.difficulty}
              </span>
            </div>

            <h3 className="font-extrabold text-base text-white">
              Escenario de Prueba
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeCase.scenario}
            </p>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 font-mono">
                <Bot className="w-4 h-4" />
                <span>RESPUESTA GENERADA POR LA IA</span>
              </div>
              <p className="text-xs text-rose-100/90 leading-relaxed font-mono whitespace-pre-line bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                {activeCase.aiOutput}
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Pistas de Inspección Forense (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-400" />
                <span>Pistas de Inspección Forense</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">
                {inspectedClues.length}/{activeCase.inspectionClues.length} pistas
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Pulsa en cada pista para comprobar qué fallos delatan la fabricación artificial:
            </p>

            <div className="space-y-2">
              {activeCase.inspectionClues.map((clue, idx) => {
                const isInspected = inspectedClues.includes(clue);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleClue(clue)}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isInspected
                        ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200 shadow-sm'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{clue}</span>
                    {isInspected && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Revelación del Hecho Real y Veredicto */}
            {isSolved && (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2.5 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>¡CASO FORENSE RESUELTO! (+35 XP)</span>
                </div>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  <strong>La Realidad:</strong> {activeCase.realFact}
                </p>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/20 text-[11px] text-slate-300">
                  <strong className="text-amber-400">Cómo cazarlo siempre:</strong> {activeCase.howToCatch}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
