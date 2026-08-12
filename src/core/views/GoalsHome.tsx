import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { 
  Zap, Flame, Star, Trophy, ArrowRight, Sparkles, BookOpen, 
  Globe, Shield, Orbit, Award, CheckCircle, ChevronRight, Gift, Send, Loader2
} from 'lucide-react';
import { ExperienceId } from '../types';
import { askAI } from '../services/aiService';

interface GoalsHomeProps {
  onSelectExperience: (id: ExperienceId) => void;
  onOpenProfile: () => void;
}

export const GoalsHome: React.FC<GoalsHomeProps> = ({ onSelectExperience, onOpenProfile }) => {
  const { user } = useAuth();
  const { userData, totalStars, maxStars, getRankInfo, getRetosList, claimReto, addXP } = useProgress();

  const [quickQuery, setQuickQuery] = useState('');
  const [quickAiResponse, setQuickAiResponse] = useState<string | null>(null);
  const [isAskingQuickAI, setIsAskingQuickAI] = useState(false);

  const rank = getRankInfo(userData.xp);
  const currentStars = totalStars();
  const maxPossibleStars = maxStars();
  const retosList = getRetosList();
  const pendingRetos = retosList.filter(r => !r.claimed && r.cond);

  const handleSendQuickQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim() || isAskingQuickAI) return;
    setIsAskingQuickAI(true);
    setQuickAiResponse(null);

    try {
      const answer = await askAI({
        messages: [
          { role: 'system', content: 'Eres el Mentor Global de IA de la plataforma GOALS. Ofrece respuestas concisas, claras y educativas.' },
          { role: 'user', content: quickQuery }
        ]
      });
      setQuickAiResponse(answer);
      addXP(10, 'school', 'Consulta al Asistente IA del Dashboard');
    } catch (err: any) {
      setQuickAiResponse(`❌ Error al conectar con la IA: ${err.message}`);
    } finally {
      setIsAskingQuickAI(false);
    }
  };

  const MINI_APPS = [
    {
      id: 'school' as ExperienceId,
      name: 'Escuela IA',
      icon: '📚',
      tagline: 'Tutor OCR & Cuadernos',
      badge: 'Mini App #1',
      colorHex: '#10b981',
      border: 'border-emerald-500/40 hover:border-emerald-400',
      bgGradient: 'from-emerald-950/80 via-slate-900 to-slate-950',
      btnBg: 'bg-emerald-500 text-slate-950 font-black',
      progressPct: 85
    },
    {
      id: 'languages' as ExperienceId,
      name: 'Idiomas Voz',
      icon: '🌐',
      tagline: 'Profesor Particular de Voz',
      badge: 'Voz & Memoria',
      colorHex: '#06b6d4',
      border: 'border-cyan-500/40 hover:border-cyan-400',
      bgGradient: 'from-cyan-950/80 via-slate-900 to-slate-950',
      btnBg: 'bg-cyan-500 text-slate-950 font-black',
      progressPct: 60
    },
    {
      id: 'astro' as ExperienceId,
      name: 'AstroLingo 3D',
      icon: '🪐',
      tagline: 'Astrofísica & NASA 3D',
      badge: 'Visor 3D NASA',
      colorHex: '#6366f1',
      border: 'border-indigo-500/40 hover:border-indigo-400',
      bgGradient: 'from-indigo-950/80 via-slate-900 to-slate-950',
      btnBg: 'bg-indigo-500 text-slate-950 font-black',
      progressPct: Math.round((currentStars / (maxPossibleStars || 1)) * 100)
    },
    {
      id: 'verify' as ExperienceId,
      name: 'Verifica',
      icon: '🛡️',
      tagline: 'Rigor & Fuentes Oficiales',
      badge: 'ESA / NASA',
      colorHex: '#f59e0b',
      border: 'border-amber-500/40 hover:border-amber-400',
      bgGradient: 'from-amber-950/80 via-slate-900 to-slate-950',
      btnBg: 'bg-amber-500 text-slate-950 font-black',
      progressPct: 100
    }
  ];

  return (
    <div className="w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar text-slate-100 font-display">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 pb-16">

        {/* BLOQUE 1: DASHBOARD DE NAVEGACIÓN Y RESUMEN GAMIFICADO */}
        <section 
          id="home-section-1" 
          className="min-h-[500px] snap-start flex flex-col justify-between py-1 relative overflow-hidden"
        >
          <div className="bg-slate-950/90 border border-indigo-500/30 rounded-3xl p-3 sm:p-4 shadow-[0_0_30px_rgba(99,102,241,0.15)] flex flex-col justify-between h-full space-y-3">
            
            {/* Header del Dashboard */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <button onClick={onOpenProfile} className="relative group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-transform">
                    👽
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center text-[8px] font-black text-slate-950">✓</div>
                </button>

                <div>
                  <h2 className="font-black text-sm sm:text-base text-white leading-tight">
                    ¡Hola, {user?.displayName || 'Astronauta'}!
                  </h2>
                  <p className={`text-[10px] font-bold ${rank.color}`}>{rank.title}</p>
                </div>
              </div>

              {/* Botón Ver Perfil Completo */}
              <button 
                onClick={onOpenProfile}
                className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-[10px] font-extrabold transition-all active:scale-95 flex items-center gap-1"
              >
                <span>Ver Mi Perfil</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Fila Métrica Gamificada (Racha, Estrellas, XP, Nivel) */}
            <div className="grid grid-cols-3 gap-2">
              
              <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-2.5 text-center flex flex-col justify-center">
                <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-base">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  <span>{userData.xp}</span>
                </div>
                <div className="text-[9px] text-slate-400 uppercase font-extrabold mt-0.5">XP Total</div>
              </div>

              <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-2.5 text-center flex flex-col justify-center">
                <div className="flex items-center justify-center gap-1 text-rose-400 font-black text-base">
                  <Flame className="w-4 h-4 fill-rose-400" />
                  <span>{userData.streak} Días</span>
                </div>
                <div className="text-[9px] text-slate-400 uppercase font-extrabold mt-0.5">Racha Diaria</div>
              </div>

              <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-2.5 text-center flex flex-col justify-center">
                <div className="flex items-center justify-center gap-1 text-amber-300 font-black text-base">
                  <Star className="w-4 h-4 fill-amber-300" />
                  <span>{currentStars} / {maxPossibleStars}</span>
                </div>
                <div className="text-[9px] text-slate-400 uppercase font-extrabold mt-0.5">Estrellas ⭐</div>
              </div>

            </div>

            {/* Widget de Asistente IA Rápido con model: "auto" */}
            <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/70 border border-indigo-500/30 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Mentor IA Rápido</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  model: "auto"
                </span>
              </div>

              <form onSubmit={handleSendQuickQuery} className="flex gap-2">
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="Pregunta lo que quieras al Mentor IA..."
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isAskingQuickAI || !quickQuery.trim()}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1 disabled:opacity-50"
                >
                  {isAskingQuickAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </form>

              {quickAiResponse && (
                <div className="bg-slate-950 p-2.5 rounded-xl border border-indigo-500/20 text-xs text-slate-200 leading-relaxed font-sans max-h-32 overflow-y-auto">
                  {quickAiResponse}
                </div>
              )}
            </div>

            {/* Grid 2x2 Compacto de las 4 Mini Apps */}
            <div className="space-y-1.5 flex-1 flex flex-col justify-center my-1">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-300 uppercase tracking-wider px-1">
                <span>Acceso Directo al Ecosistema</span>
                <span className="text-cyan-400 text-[10px]">4 Mini Apps Sincronizadas</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {MINI_APPS.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => onSelectExperience(app.id)}
                    className={`bg-slate-900/90 border ${app.border} rounded-2xl p-2.5 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 shadow-md flex flex-col justify-between group`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl p-1.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform">{app.icon}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[9px] font-bold text-slate-300">
                        {app.badge}
                      </span>
                    </div>

                    <div className="mt-2">
                      <h3 className="font-extrabold text-xs text-white truncate">{app.name}</h3>
                      <p className="text-[9px] text-slate-400 truncate">{app.tagline}</p>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9px]">
                      <div className="w-16 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                        <div className="h-full bg-emerald-400" style={{ width: `${app.progressPct}%` }} />
                      </div>
                      <span className="font-bold text-emerald-400">{app.progressPct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};
