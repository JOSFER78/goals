import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { 
  Zap, Flame, Star, Sparkles, Send, Loader2, Check, ArrowRight, User
} from 'lucide-react';
import { ExperienceId } from '../types';
import { askAI } from '../services/aiService';
import { GOALS_EXPERIENCES } from '../config/experiencesConfig';

interface GoalsHomeProps {
  onSelectExperience: (id: ExperienceId) => void;
  onOpenProfile: () => void;
}

export const GoalsHome: React.FC<GoalsHomeProps> = ({ onSelectExperience, onOpenProfile }) => {
  const { user } = useAuth();
  const { userData, totalStars, maxStars, getRankInfo, addXP } = useProgress();

  const [quickQuery, setQuickQuery] = useState('');
  const [quickAiResponse, setQuickAiResponse] = useState<string | null>(null);
  const [isAskingQuickAI, setIsAskingQuickAI] = useState(false);

  const rank = getRankInfo(userData.xp);
  const currentStars = totalStars();
  const maxPossibleStars = maxStars();

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
      setQuickAiResponse(`Error al conectar con la IA: ${err.message}`);
    } finally {
      setIsAskingQuickAI(false);
    }
  };

  const MINI_APPS = Object.values(GOALS_EXPERIENCES);

  const initial = user?.displayName ? user.displayName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'E');

  return (
    <div className="w-full h-full overflow-y-auto snap-y snap-mandatory scroll-smooth hide-scrollbar text-slate-100 font-display">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 pb-16">

        {/* BLOQUE PRINCIPAL: DASHBOARD RESUMEN Y NAVEGACIÓN */}
        <section 
          id="home-section-1" 
          className="min-h-[480px] snap-start flex flex-col justify-between py-1 relative overflow-hidden"
        >
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col justify-between h-full space-y-3.5 backdrop-blur-md">
            
            {/* Header del Dashboard con Perfil y Nivel */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-3.5">
                <button onClick={onOpenProfile} className="relative group cursor-pointer" title="Ver Perfil">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-indigo-500/40 flex items-center justify-center text-sm shadow-md group-hover:border-indigo-400 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all overflow-hidden">
                    {user?.photoURL && (user.photoURL.startsWith('http') || user.photoURL.startsWith('/') || user.photoURL.startsWith('data:')) ? (
                      <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-extrabold text-indigo-300 text-base">{initial}</span>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-slate-950 shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-base sm:text-lg text-white leading-tight">
                      {user?.displayName || 'Estudiante'}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-mono font-bold">
                      Nivel {rank.level}
                    </span>
                  </div>
                  <p className={`text-xs font-semibold ${rank.color} mt-0.5`}>{rank.title}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenProfile}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Centro de Perfil</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            {/* Fila Métrica Gamificada con Micro-Elevación (XP, Racha, Estrellas) */}
            <div className="grid grid-cols-3 gap-2.5">
              
              <div 
                onClick={onOpenProfile}
                className="group cursor-pointer bg-gradient-to-br from-amber-950/20 via-slate-900/80 to-slate-950 border border-amber-500/20 hover:border-amber-400/50 rounded-2xl p-3 text-center flex flex-col justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
              >
                <div className="flex items-center justify-center gap-1.5 text-amber-400 font-black text-lg group-hover:scale-105 transition-transform">
                  <Zap className="w-4 h-4 fill-amber-400" />
                  <span>{userData.xp}</span>
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5 tracking-wider">XP Total</div>
              </div>

              <div 
                onClick={onOpenProfile}
                className="group cursor-pointer bg-gradient-to-br from-rose-950/20 via-slate-900/80 to-slate-950 border border-rose-500/20 hover:border-rose-400/50 rounded-2xl p-3 text-center flex flex-col justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]"
              >
                <div className="flex items-center justify-center gap-1.5 text-rose-400 font-black text-lg group-hover:scale-105 transition-transform">
                  <Flame className="w-4 h-4 fill-rose-400" />
                  <span>{userData.streak} {userData.streak === 1 ? 'Día' : 'Días'}</span>
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5 tracking-wider">Racha Diaria</div>
              </div>

              <div 
                onClick={onOpenProfile}
                className="group cursor-pointer bg-gradient-to-br from-indigo-950/20 via-slate-900/80 to-slate-950 border border-indigo-500/20 hover:border-indigo-400/50 rounded-2xl p-3 text-center flex flex-col justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]"
              >
                <div className="flex items-center justify-center gap-1.5 text-amber-300 font-black text-lg group-hover:scale-105 transition-transform">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{currentStars} / {maxPossibleStars}</span>
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mt-0.5 tracking-wider">Estrellas</div>
              </div>

            </div>

            {/* Widget de Asistente IA Rápido */}
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3 sm:p-3.5 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Mentor IA Rápido</span>
                </div>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                  inferencia: multimodal
                </span>
              </div>

              <form onSubmit={handleSendQuickQuery} className="flex gap-2">
                <input
                  type="text"
                  value={quickQuery}
                  onChange={(e) => setQuickQuery(e.target.value)}
                  placeholder="Pregunta lo que quieras al Mentor IA..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500/80 transition-colors font-medium"
                />
                <button
                  type="submit"
                  disabled={isAskingQuickAI || !quickQuery.trim()}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1 disabled:opacity-50 active:scale-95 cursor-pointer shadow-sm shadow-indigo-600/20"
                >
                  {isAskingQuickAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </form>

              {quickAiResponse && (
                <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans max-h-32 overflow-y-auto animate-fadeIn">
                  {quickAiResponse}
                </div>
              )}
            </div>

            {/* Ecosistema Bento Grid de 4 Mini Apps */}
            <div className="space-y-2 flex-1 flex flex-col justify-center my-0.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-0.5">
                <span>Ecosistema de Aprendizaje</span>
                <span className="text-slate-500 text-[11px] font-medium font-mono">4 Módulos Sincronizados</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {MINI_APPS.map((app) => {
                  const IconComp = app.icon;
                  return (
                    <div
                      key={app.id}
                      onClick={() => onSelectExperience(app.id)}
                      className={`bg-slate-900/80 border ${app.borderClass} hover:border-slate-600 rounded-2xl p-3.5 cursor-pointer transition-all duration-300 hover:bg-slate-900 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 flex flex-col justify-between group`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-105 transition-transform ${app.iconColorClass}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${app.badgeClass}`}>
                          {app.badge}
                        </span>
                      </div>

                      <div className="mt-2.5">
                        <h3 className="font-extrabold text-xs text-white truncate group-hover:text-indigo-300 transition-colors">{app.name}</h3>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{app.tagline}</p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                        <div className="w-20 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                          <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${app.progressPct}%` }} />
                        </div>
                        <span className="font-bold text-emerald-400 font-mono">{app.progressPct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

