import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Sparkles, Volume2, CheckCircle2, XCircle, ArrowRight, 
  Loader2, RefreshCw, Compass, Bookmark
} from 'lucide-react';
import { ContentGenerator } from '../services/contentGenerator';
import { StoryChapter, StudentLanguageProfile } from '../types';
import { VoiceEngine } from '../services/voiceEngine';

interface StoryLabProps {
  profile: StudentLanguageProfile;
  onAddXP: (amount: number, reason: string) => void;
}

export const StoryLab: React.FC<StoryLabProps> = ({
  profile,
  onAddXP
}) => {
  const [theme, setTheme] = useState<string>('Exploradores en una cueva de cristales en Marte');
  const [chapter, setChapter] = useState<StoryChapter | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuizAnswered, setIsQuizAnswered] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const loadStory = async (customTheme = theme) => {
    setIsLoading(true);
    setSelectedOption(null);
    setIsQuizAnswered(false);
    try {
      const story = await ContentGenerator.generateInteractiveStory(customTheme, profile.overallLevel);
      setChapter(story);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStory();
  }, []);

  const handleReadAudio = () => {
    if (!chapter) return;
    VoiceEngine.speakText(
      chapter.content,
      profile.targetLanguage,
      0.9,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  const handleCheckQuiz = (idx: number) => {
    if (!chapter || isQuizAnswered) return;
    setSelectedOption(idx);
    setIsQuizAnswered(true);

    if (idx === chapter.comprehensionQuestion.correctIndex) {
      onAddXP(25, 'Comprensión lectora de cuento completada');
    }
  };

  const handleDecision = (lead: string) => {
    loadStory(`${theme} - Siguiente capítulo: ${lead}`);
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/20 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl backdrop-blur-xl">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Cuentos Didácticos & Lectura Interactiva</span>
          </h3>
          <p className="text-xs text-slate-400">Lectura guiada, vocabulario destacado, audio inmersivo y toma de decisiones.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => loadStory()}
            disabled={isLoading}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Nueva Historia</span>
          </button>
        </div>
      </div>

      {/* Selector de Temáticas Rápidas */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-500 font-bold self-center shrink-0">Temas:</span>
        {[
          '🚀 Marte & Exploración',
          '🏰 Castillo Mágico & Dragones',
          '🤖 Academia de Robots',
          '🌊 Misterio en el Océano Profundo',
          '⚽ La Gran Final de Fútbol'
        ].map((t, idx) => (
          <button
            key={idx}
            onClick={() => {
              setTheme(t);
              loadStory(t);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            {t}
          </button>
        ))}
      </div>

      {/* Contenido del Cuento */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-cyan-300">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-sm font-bold">El profesor está escribiendo un cuento adaptado a tu nivel...</p>
        </div>
      ) : chapter ? (
        <div className="space-y-6">
          
          {/* Tarjeta de Lectura */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg relative overflow-hidden">
            
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <h4 className="text-lg sm:text-xl font-extrabold text-cyan-300">
                {chapter.title}
              </h4>
              <button
                onClick={handleReadAudio}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse text-cyan-400' : ''}`} />
                <span>{isPlayingAudio ? 'Leyendo...' : 'Escuchar Cuento'}</span>
              </button>
            </div>

            <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-serif space-y-3">
              <p>{chapter.content}</p>
            </div>

            {/* Píldoras de Vocabulario Destacado */}
            {chapter.vocabularyHighlights && chapter.vocabularyHighlights.length > 0 && (
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                  Vocabulario Clave del Texto:
                </span>
                <div className="flex flex-wrap gap-2">
                  {chapter.vocabularyHighlights.map((v, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-cyan-200 font-mono">
                      <strong className="text-white">{v.term}</strong> = {v.translation}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pregunta de Comprensión Lectora */}
          {chapter.comprehensionQuestion && (
            <div className="bg-slate-950 border border-cyan-500/30 rounded-2xl p-5 space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Bookmark className="w-4 h-4" />
                <span>Comprobación de Comprensión Lectora (+25 XP)</span>
              </div>
              
              <p className="text-sm font-bold text-white">
                {chapter.comprehensionQuestion.question}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {chapter.comprehensionQuestion.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  const isRight = idx === chapter.comprehensionQuestion.correctIndex;
                  return (
                    <button
                      key={idx}
                      disabled={isQuizAnswered}
                      onClick={() => handleCheckQuiz(idx)}
                      className={`p-3 rounded-xl text-xs font-bold text-left transition-all border cursor-pointer ${
                        isChosen
                          ? isRight
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : isQuizAnswered && isRight
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/30'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {isQuizAnswered && (
                <p className="text-xs text-slate-400 pt-1">
                  {chapter.comprehensionQuestion.explanation}
                </p>
              )}
            </div>
          )}

          {/* Bifurcación Narrativa (¿Qué quieres que ocurra después?) */}
          {chapter.decisionPrompt && (
            <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-5 space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Toma de Decisiones Narrativa</span>
              </div>
              <p className="text-sm font-bold text-white">{chapter.decisionPrompt.question}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {chapter.decisionPrompt.choices.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleDecision(c.nextPlotLead)}
                    className="p-3.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200 font-bold text-xs flex items-center justify-between gap-2 transition-all cursor-pointer"
                  >
                    <span>{c.text}</span>
                    <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      ) : null}
    </div>
  );
};
