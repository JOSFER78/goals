import React from 'react';
import { Mic, Sparkles, Brain, Award, ArrowRight, MessageSquare, Flame } from 'lucide-react';
import { StudentLanguageProfile, NextBestActionRecommendation } from '../types';

interface TeacherCardProps {
  profile: StudentLanguageProfile;
  recommendation: NextBestActionRecommendation;
  isListening: boolean;
  onStartVoiceChat: () => void;
  onExecuteRecommendation: () => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  profile,
  recommendation,
  isListening,
  onStartVoiceChat,
  onExecuteRecommendation
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-slate-950/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl soundwave-grid-pattern">
      {/* Resplandor ambiental */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Información del Profesor */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 via-cyan-400 to-emerald-400 p-0.5 shadow-[0_0_25px_rgba(6,182,212,0.35)]">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center overflow-hidden">
                <span className="text-3xl sm:text-4xl">👨‍🏫</span>
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950"></span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Profesor Particular de {profile.targetLanguage}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                NIVEL CEFR {profile.overallLevel}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Adaptado para <strong>{profile.name}</strong> ({profile.age} años) • Enfoque: {profile.interests.slice(0, 2).join(', ')}
            </p>
          </div>
        </div>

        {/* Botón Principal de Conversación por Voz */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            onClick={onStartVoiceChat}
            className={`px-6 py-4 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer active:scale-95 ${
              isListening
                ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30 animate-pulse'
                : 'bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 shadow-cyan-500/25'
            }`}
          >
            <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`} />
            <span>{isListening ? 'Escuchando en vivo...' : 'Hablar con mi Profesor'}</span>
          </button>
        </div>
      </div>

      {/* Banner de Recomendación Inteligente (Next Best Action) */}
      {recommendation && (
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 sm:px-6 rounded-b-3xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 tracking-wider">
                  Recomendación del Profesor
                </span>
                <span className="text-[10px] font-bold text-slate-400">• {recommendation.title}</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1">{recommendation.reason}</p>
            </div>
          </div>

          <button
            onClick={onExecuteRecommendation}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <span>Practicar ahora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
