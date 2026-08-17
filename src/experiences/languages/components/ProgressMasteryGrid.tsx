import React, { useState } from 'react';
import { 
  BarChart3, Award, BookOpen, AlertCircle, CheckCircle2, 
  Clock, TrendingUp, Sparkles, Filter 
} from 'lucide-react';
import { MemoryService } from '../services/memoryService';
import { SkillMastery, VocabularyItem, ErrorPattern, EpisodicMemory, StudentLanguageProfile } from '../types';

interface ProgressMasteryGridProps {
  profile: StudentLanguageProfile;
}

export const ProgressMasteryGrid: React.FC<ProgressMasteryGridProps> = ({ profile }) => {
  const [mastery] = useState<SkillMastery>(() => MemoryService.getSkillMastery());
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(() => MemoryService.getVocabulary());
  const [errors, setErrors] = useState<ErrorPattern[]>(() => MemoryService.getErrorPatterns());
  const [memories] = useState<EpisodicMemory[]>(() => MemoryService.getEpisodicMemories());

  const [vocabFilter, setVocabFilter] = useState<'all' | 'active' | 'mastered' | 'forgotten'>('all');

  const filteredVocab = vocabulary.filter(v => vocabFilter === 'all' || v.status === vocabFilter);

  const SKILLS_CONFIG: Array<{ key: keyof SkillMastery; label: string; icon: string; color: string }> = [
    { key: 'speaking', label: 'Speaking (Expresión Oral)', icon: '🗣️', color: 'from-cyan-500 to-blue-500' },
    { key: 'listening', label: 'Listening (Comprensión Auditiva)', icon: '🎧', color: 'from-emerald-500 to-teal-500' },
    { key: 'reading', label: 'Reading (Lectura & Textos)', icon: '📖', color: 'from-indigo-500 to-purple-500' },
    { key: 'writing', label: 'Writing (Expresión Escrita)', icon: '✍️', color: 'from-amber-500 to-orange-500' },
    { key: 'grammar', label: 'Grammar (Estructuras & Sintaxis)', icon: '📐', color: 'from-rose-500 to-pink-500' },
    { key: 'vocabulary', label: 'Vocabulary (Léxico Activo)', icon: '📚', color: 'from-cyan-400 to-emerald-400' },
    { key: 'pronunciation', label: 'Pronunciation (Fonética)', icon: '🎙️', color: 'from-teal-400 to-cyan-500' },
    { key: 'fluency', label: 'Fluency (Cadencia y Ritmo)', icon: '⚡', color: 'from-yellow-400 to-amber-500' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Matriz de Competencias Lingüísticas (8 Habilidades) */}
      <div className="bg-slate-900/90 border border-cyan-500/20 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">
                Expediente de Dominio CEFR & Mastery (8 Competencias)
              </h3>
              <p className="text-xs text-slate-400">Medición pedagógica continua basada en tus interacciones y correcciones.</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-xl bg-cyan-950 text-cyan-300 font-mono font-bold text-xs border border-cyan-500/30">
            Nivel Global: {profile.overallLevel}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          {SKILLS_CONFIG.map((sk) => {
            const val = mastery[sk.key] || 60;
            return (
              <div key={sk.key} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg">{sk.icon}</span>
                  <span className="text-xs font-mono font-bold text-cyan-300">{val}%</span>
                </div>
                <div>
                  <p className="font-bold text-xs text-white truncate">{sk.label}</p>
                  <div className="w-full bg-slate-900 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${sk.color} transition-all duration-500`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Banco de Vocabulario y Registro de Errores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Banco de Vocabulario */}
        <div className="bg-slate-900/90 border border-cyan-500/20 rounded-3xl p-5 space-y-4 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Banco Léxico ({vocabulary.length} Palabras)</span>
              </div>

              {/* Filtro de estado */}
              <div className="flex gap-1 text-[10px] font-mono">
                {(['all', 'active', 'mastered', 'forgotten'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setVocabFilter(f)}
                    className={`px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                      vocabFilter === f
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredVocab.map((v) => (
                <div key={v.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="font-bold text-white text-sm">{v.term}</span>
                    <p className="text-slate-400 text-[11px]">{v.translation}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        v.status === 'mastered'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : v.status === 'forgotten'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {v.status}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{v.lastUsed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Registro de Errores Recurrentes */}
        <div className="bg-slate-900/90 border border-cyan-500/20 rounded-3xl p-5 space-y-4 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Patrones de Error Detectados ({errors.length})</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">MEMORIA PERSISTENTE</span>
            </div>

            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
              {errors.map((e) => (
                <div key={e.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="line-through text-rose-300 font-medium mr-2">{e.incorrect}</span>
                      <span className="text-emerald-400 font-bold">➔ {e.correction}</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                      Freq: {e.frequency}x
                    </span>
                  </div>
                  {e.pedagogicalNote && (
                    <p className="text-[11px] text-slate-400 leading-tight">{e.pedagogicalNote}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Historial de Memoria Episódica */}
      <div className="bg-slate-900/90 border border-cyan-500/20 rounded-3xl p-5 space-y-3 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Memoria Episódica de Sesiones Anteriores</span>
        </div>

        <div className="space-y-2.5">
          {memories.map((m) => (
            <div key={m.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="font-bold text-cyan-300 font-mono uppercase">{m.activityType}</span>
                <span>{m.dateStr}</span>
              </div>
              <p className="text-slate-200">{m.summary}</p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                <span className="text-emerald-400 font-semibold">Fortalezas: {m.keyStrengths.join(', ')}</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-400 font-semibold">Reforzar: {m.areasToReinforce.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
