/**
 * src/core/components/infographics/VisualKnowledgeBoard.tsx
 * Pizarrón Agéntico de Infografías, Diagramas de Flujo y Desglose Visual de Cuadernos
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Maximize2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Target,
  Layers,
  Camera,
  X,
  Zap,
  Compass
} from 'lucide-react';
import { EducationalInfographicPayload } from '../../types/visualInfographic';
import { speechVoiceService } from '../../services/SpeechVoiceService';

interface VisualKnowledgeBoardProps {
  infographic: EducationalInfographicPayload;
  onClose?: () => void;
  onSelectSubject?: (subject: string) => void;
}

export const VisualKnowledgeBoard: React.FC<VisualKnowledgeBoardProps> = ({
  infographic,
  onClose
}) => {
  const [activeCardTab, setActiveCardTab] = useState<Record<string, 'simple' | 'analogy' | 'depth'>>({});
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    takeaways: true,
    flow: true,
    cards: true,
    quiz: true
  });
  const [selectedPinId, setSelectedPinId] = useState<number | null>(
    infographic.notebookPins && infographic.notebookPins.length > 0 ? infographic.notebookPins[0].id : null
  );
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isPhotoZoomed, setIsPhotoZoomed] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSpeak = (textToSpeak: string) => {
    if (isSpeaking) {
      speechVoiceService.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speechVoiceService.speak(textToSpeak, {
      pitch: 1.0,
      rate: 0.96,
      lang: 'es-ES',
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400'
        };
      case 'cyan':
        return {
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          text: 'text-cyan-300',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          dot: 'bg-cyan-400'
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-300',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400'
        };
      case 'rose':
        return {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          text: 'text-rose-300',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400'
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          text: 'text-purple-300',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400'
        };
      case 'indigo':
      default:
        return {
          bg: 'bg-indigo-500/10',
          border: 'border-indigo-500/30',
          text: 'text-indigo-300',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          dot: 'bg-indigo-400'
        };
    }
  };

  const selectedPin = infographic.notebookPins?.find((p) => p.id === selectedPinId);

  return (
    <div className="relative w-full rounded-3xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-300 animate-fadeIn">
      {/* CABECERA GLASSPHORPHISM PREMIUM */}
      <div className="relative bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 p-5 md:p-6 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                {infographic.mode === 'notebook_deconstruction' ? 'Desglose Visual de Cuaderno' : 'Infografía Agéntica IA'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50">
                {infographic.subject}
              </span>
              {infographic.targetAge && (
                <span className="text-[10px] text-slate-400">
                  Nivel: {infographic.targetAge} años
                </span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {infographic.title}
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
              {infographic.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start">
            <button
              onClick={() => handleSpeak(`${infographic.title}. ${infographic.subtitle}. ${infographic.summaryQuote}`)}
              className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20'
              }`}
              title={isSpeaking ? 'Detener voz' : 'Escuchar explicación en voz alta'}
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isSpeaking ? 'Detener' : 'Locución'}</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-2xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700/60 transition-colors cursor-pointer"
                title="Cerrar pizarrón"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {infographic.summaryQuote && (
          <div className="mt-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-200 italic leading-snug">
              "{infographic.summaryQuote}"
            </p>
          </div>
        )}
      </div>

      {/* MODO 1: DESGLOSE DE FOTO DE CUADERNO / APUNTES */}
      {infographic.mode === 'notebook_deconstruction' && infographic.notebookPhotoUrl && (
        <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 border-b border-slate-800/80">
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Foto de tus Apuntes (Pines Interactivos)</span>
              </span>
              <button
                onClick={() => setIsPhotoZoomed(true)}
                className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 p-1 rounded-lg hover:bg-cyan-500/10 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Ampliar Foto</span>
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
              <img
                src={infographic.notebookPhotoUrl}
                alt="Foto de apuntes escolares"
                className="w-full h-auto max-h-[380px] object-contain rounded-2xl transition-transform duration-300"
              />

              {infographic.notebookPins?.map((pin) => {
                const isSelected = pin.id === selectedPinId;
                return (
                  <button
                    key={pin.id}
                    onClick={() => setSelectedPinId(pin.id)}
                    style={{
                      left: `${pin.xPercent}%`,
                      top: `${pin.yPercent}%`
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 shadow-lg cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/30 scale-125 z-20 animate-bounce'
                        : 'bg-cyan-500 text-white hover:bg-cyan-400 hover:scale-110 z-10'
                    }`}
                  >
                    {pin.label || pin.id}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Haz clic en los números de la foto para ver la explicación correspondiente.
            </p>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center">
            {selectedPin ? (
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/40 shadow-xl space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                      {selectedPin.label || selectedPin.id}
                    </span>
                    <h4 className="text-sm font-black text-white">
                      {selectedPin.topicTitle}
                    </h4>
                  </div>
                  <button
                    onClick={() => handleSpeak(`${selectedPin.topicTitle}. ${selectedPin.explanation}`)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors cursor-pointer"
                    title="Escuchar este punto"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedPin.explanation}
                </p>

                {selectedPin.formulaOrKeyRule && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400">
                    <span className="text-[10px] text-slate-400 block mb-1 font-sans">Regla o Fórmula Clave:</span>
                    {selectedPin.formulaOrKeyRule}
                  </div>
                )}

                {selectedPin.teacherTip && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span><strong>Consejo del Tutor:</strong> {selectedPin.teacherTip}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                  <span className="text-[11px] text-slate-400 font-medium">Otros puntos de tu apunte:</span>
                  <div className="flex gap-1.5">
                    {infographic.notebookPins?.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPinId(p.id)}
                        className={`w-6 h-6 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          p.id === selectedPinId
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {p.label || p.id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-slate-400 text-xs">
                Selecciona un punto en la imagen para ver el desglose detallado.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECCIÓN 1: PUNTOS CLAVE DIDÁCTICOS */}
      {infographic.keyTakeaways && infographic.keyTakeaways.length > 0 && (
        <div className="p-5 md:p-6 border-b border-slate-800/80">
          <button
            onClick={() => toggleAccordion('takeaways')}
            className="w-full flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-black text-slate-100 group-hover:text-white transition-colors">
                Puntos Clave del Esquema ({infographic.keyTakeaways.length})
              </h3>
            </div>
            {openAccordions.takeaways ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openAccordions.takeaways && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4 animate-fadeIn">
              {infographic.keyTakeaways.map((takeaway) => {
                const color = getColorClasses(takeaway.color);
                return (
                  <div
                    key={takeaway.id}
                    className={`p-4 rounded-2xl border ${color.border} ${color.bg} flex flex-col justify-between space-y-2 hover:border-slate-600 transition-all`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{takeaway.icon}</span>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {takeaway.title}
                        </h4>
                      </div>
                      {takeaway.tag && (
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${color.badge}`}>
                          {takeaway.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
                      {takeaway.description}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECCIÓN 2: DIAGRAMA DE FLUJO CONCEPTUAL */}
      {infographic.flowDiagram && infographic.flowDiagram.length > 0 && (
        <div className="p-5 md:p-6 border-b border-slate-800/80">
          <button
            onClick={() => toggleAccordion('flow')}
            className="w-full flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-black text-slate-100 group-hover:text-white transition-colors">
                Diagrama de Flujo Paso a Paso
              </h3>
            </div>
            {openAccordions.flow ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openAccordions.flow && (
            <div className="mt-4 overflow-x-auto pb-3 pt-1 animate-fadeIn scrollbar-none">
              <div className="flex items-center gap-3 min-w-max">
                {infographic.flowDiagram.map((step, idx) => {
                  const isLast = idx === infographic.flowDiagram!.length - 1;
                  return (
                    <React.Fragment key={step.stepNumber}>
                      <div className="w-60 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all shadow-lg flex flex-col justify-between space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-black flex items-center justify-center">
                            {step.stepNumber}
                          </span>
                          <span className="text-xs">{step.icon || '🔹'}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          {step.shortDesc}
                        </p>
                        {step.details && (
                          <span className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800/80 block">
                            {step.details}
                          </span>
                        )}
                      </div>

                      {!isLast && (
                        <div className="flex flex-col items-center justify-center px-1 text-slate-500">
                          {step.connectorLabel && (
                            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-tighter mb-0.5">
                              {step.connectorLabel}
                            </span>
                          )}
                          <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECCIÓN 3: TARJETAS DE CONCEPTOS CON ANALOGÍAS */}
      {infographic.conceptCards && infographic.conceptCards.length > 0 && (
        <div className="p-5 md:p-6 border-b border-slate-800/80">
          <button
            onClick={() => toggleAccordion('cards')}
            className="w-full flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-black text-slate-100 group-hover:text-white transition-colors">
                Tarjetas de Conceptos Didácticos ({infographic.conceptCards.length})
              </h3>
            </div>
            {openAccordions.cards ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openAccordions.cards && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-fadeIn">
              {infographic.conceptCards.map((card) => {
                const currentCardTab = activeCardTab[card.id] || 'simple';
                return (
                  <div
                    key={card.id}
                    className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 flex flex-col justify-between space-y-3 shadow-lg"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs md:text-sm font-black text-white">
                            {card.concept}
                          </h4>
                          <span className="text-[10px] text-slate-400">{card.subtitle}</span>
                        </div>
                        <button
                          onClick={() => handleSpeak(`${card.concept}. ${card.simpleExplanation}. Analogía: ${card.realWorldAnalogy}`)}
                          className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title="Escuchar concepto"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80 mt-3 text-[10px] font-bold">
                        <button
                          onClick={() => setActiveCardTab((p) => ({ ...p, [card.id]: 'simple' }))}
                          className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                            currentCardTab === 'simple'
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          💡 Simple
                        </button>
                        <button
                          onClick={() => setActiveCardTab((p) => ({ ...p, [card.id]: 'analogy' }))}
                          className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                            currentCardTab === 'analogy'
                              ? 'bg-amber-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          🌟 Analogía
                        </button>
                        {card.formulaOrRule && (
                          <button
                            onClick={() => setActiveCardTab((p) => ({ ...p, [card.id]: 'depth' }))}
                            className={`flex-1 py-1 rounded-lg transition-all cursor-pointer ${
                              currentCardTab === 'depth'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            📐 Fórmula
                          </button>
                        )}
                      </div>

                      <div className="mt-3 min-h-[50px] text-xs text-slate-200 leading-relaxed">
                        {currentCardTab === 'simple' && (
                          <p className="animate-fadeIn">{card.simpleExplanation}</p>
                        )}
                        {currentCardTab === 'analogy' && (
                          <p className="animate-fadeIn text-amber-200/90 italic">
                            "{card.realWorldAnalogy}"
                          </p>
                        )}
                        {currentCardTab === 'depth' && card.formulaOrRule && (
                          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-emerald-300 text-[11px] animate-fadeIn">
                            {card.formulaOrRule}
                          </div>
                        )}
                      </div>
                    </div>

                    {card.inDepthNote && (
                      <div className="text-[10px] text-slate-400 border-t border-slate-800/60 pt-2 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>{card.inDepthNote}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECCIÓN 4: COMPROBACIÓN RÁPIDA / MICRO-QUIZ */}
      {infographic.quickQuiz && infographic.quickQuiz.length > 0 && (
        <div className="p-5 md:p-6 border-b border-slate-800/80">
          <button
            onClick={() => toggleAccordion('quiz')}
            className="w-full flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-black text-slate-100 group-hover:text-white transition-colors">
                Comprobación Rápida de Comprensión
              </h3>
            </div>
            {openAccordions.quiz ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {openAccordions.quiz && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 animate-fadeIn">
              {infographic.quickQuiz.map((quiz, qIdx) => (
                <div key={qIdx} className="space-y-3">
                  <p className="text-xs font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{quiz.question}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {quiz.options.map((opt, optIdx) => {
                      const isSelected = quizSelectedOption === optIdx;
                      const isCorrect = quiz.correctIndex === optIdx;

                      let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-300';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-indigo-500/20 border-indigo-500/60 text-indigo-300 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setQuizSelectedOption(optIdx)}
                          className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      disabled={quizSelectedOption === null}
                      onClick={() => setQuizSubmitted(true)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                    >
                      Comprobar Respuesta
                    </button>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-emerald-400 block">
                          {quizSelectedOption === quiz.correctIndex ? '¡Excelente deducción!' : 'Casi lo tienes:'}
                        </span>
                        <span>{quiz.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONSEJO FINAL */}
      {infographic.didacticTip && (
        <div className="p-4 bg-slate-900/60 flex items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span><strong>Tip de Oro:</strong> {infographic.didacticTip}</span>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL */}
      {isPhotoZoomed && infographic.notebookPhotoUrl && (
        <div
          onClick={() => setIsPhotoZoomed(false)}
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="relative max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Camera className="w-4 h-4" />
                <span>Foto de Apuntes Escolar (HD)</span>
              </span>
              <button
                onClick={() => setIsPhotoZoomed(false)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-rose-500 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={infographic.notebookPhotoUrl}
              alt="Foto de apuntes en alta resolución"
              className="w-full max-h-[80vh] object-contain rounded-2xl border border-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};
