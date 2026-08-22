import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Zap, Flame, Star, Sparkles, Send, Loader2, Check, ArrowRight, User,
  GraduationCap, Globe, Orbit, ShieldCheck, Target, Award, BookOpen, 
  Compass, CheckCircle2, ChevronRight, HelpCircle, Lock
} from 'lucide-react';
import { ExperienceId } from '../types';
import { askAI } from '../services/aiService';
import { GOALS_EXPERIENCES } from '../config/experiencesConfig';
import { studentStateService } from '../services/StudentStateService';
import { LearningPathEngine } from '../services/LearningPathEngine';
import { PresentationEngine } from '../services/PresentationEngine';
import { LearningPath, StudentLearningState } from '../types/adaptiveCurriculum';

interface GoalsHomeProps {
  onSelectExperience: (id: ExperienceId) => void;
  onOpenProfile: () => void;
  onOpenMiniApps?: () => void;
}

const QUICK_TOPICS = [
  { label: '📐 Mates: Pitágoras', prompt: 'Explícame el Teorema de Pitágoras con un ejemplo de la vida real y una fórmula sencilla.' },
  { label: '🇬🇧 Inglés: Diálogo', prompt: 'Inicia una conversación corta en inglés para pedir comida en un restaurante.' },
  { label: '🚀 Espacio: Artemis', prompt: '¿Cuál es el objetivo principal de la misión lunar Artemis II de la NASA?' },
  { label: '🔍 Ciencia: Gravedad', prompt: 'Explica por qué los astronautas flotan en la Estación Espacial Internacional.' }
];

export const GoalsHome: React.FC<GoalsHomeProps> = ({ 
  onSelectExperience, 
  onOpenProfile,
  onOpenMiniApps
}) => {
  const { user } = useAuth();
  const { userData, totalStars, maxStars, getRankInfo, addXP, effectiveAge, canAccessExperience } = useProgress();
  const { isDark } = useTheme();

  const [quickQuery, setQuickQuery] = useState('');
  const [quickAiResponse, setQuickAiResponse] = useState<string | null>(null);
  const [isAskingQuickAI, setIsAskingQuickAI] = useState(false);
  const [astroPath, setAstroPath] = useState<LearningPath | null>(null);

  const currentXp = Number(userData?.xp || 0);
  const rank = getRankInfo(currentXp);
  const currentStars = totalStars();
  const maxPossibleStars = maxStars();

  const ageBadge = PresentationEngine.getLevelBadge(effectiveAge);
  const xpProgress = Math.min(100, Math.round((currentXp / (rank.nextXp || 100)) * 100));

  React.useEffect(() => {
    let isMounted = true;
    const loadAstroState = async () => {
      if (!user?.uid) return;
      try {
        const loadedState = await studentStateService.getStudentState(user.uid, 'astro');
        const finalState: StudentLearningState = loadedState || {
          userId: user.uid,
          disciplineId: 'astro',
          experienceId: 'astro',
          firstVisit: false,
          onboardingCompleted: true,
          age: effectiveAge,
          grade: ageBadge.label.split(' (')[0],
          diagnosticStatus: 'completed',
          recommendedStartUnitId: 'astro_u01_earth_atmosphere',
          currentUnitId: 'astro_u01_earth_atmosphere',
          completedUnitIds: [],
          conceptMastery: {},
          weakConcepts: [],
          strengths: [],
          sessionHistory: [],
          lastActiveAt: Date.now(),
          updatedAt: Date.now()
        };
        if (!loadedState) {
          await studentStateService.saveStudentState(finalState);
        }
        const path = LearningPathEngine.computeLearningPath(finalState);
        if (isMounted) {
          setAstroPath(path);
        }
      } catch (err) {
        console.error('Error calculando ruta adaptativa:', err);
      }
    };
    loadAstroState();
    return () => {
      isMounted = false;
    };
  }, [user?.uid, effectiveAge]);

  const handleSendQuickQuery = async (queryText?: string) => {
    const promptToSend = queryText || quickQuery;
    if (!promptToSend.trim() || isAskingQuickAI) return;
    setIsAskingQuickAI(true);
    setQuickAiResponse(null);

    try {
      const answer = await askAI({
        messages: [
          { role: 'system', content: 'Eres el Mentor Global de IA de GOALS. Responde de forma clara, didáctica, amena y concisa.' },
          { role: 'user', content: promptToSend }
        ]
      });
      setQuickAiResponse(answer);
      addXP(15, 'school', 'Consulta interactiva al Mentor IA');
    } catch (err: any) {
      setQuickAiResponse(`Error al conectar con el asistente de IA: ${err.message}`);
    } finally {
      setIsAskingQuickAI(false);
    }
  };

  const MINI_APPS = (['school', 'languages', 'astro', 'criterio', 'ai-lab'] as ExperienceId[])
    .map((id) => GOALS_EXPERIENCES[id])
    .filter(Boolean);
  const initial = user?.displayName ? user.displayName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'E');

  return (
    <div className={`w-full h-full overflow-y-auto scroll-smooth font-display transition-colors duration-300 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 py-3 pb-16">

        {/* 1. TARJETA PRINCIPAL DEL ESTUDIANTE CON PROGRESO DE NIVEL */}
        <div className={`rounded-3xl p-4 sm:p-5 border transition-colors ${
          isDark 
            ? 'bg-[#0c101c] border-slate-800/90 shadow-xl' 
            : 'bg-white border-slate-200 shadow-md'
        }`}>
          
          {/* Header del Perfil */}
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
            isDark ? 'border-slate-800/80' : 'border-slate-100'
          }`}>
            <div className="flex items-center gap-3.5">
              <button 
                type="button" 
                onClick={onOpenProfile} 
                className="relative group cursor-pointer shrink-0" 
                title="Abrir Centro de Perfil"
              >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-sm shadow-md transition-all overflow-hidden ${
                  isDark ? 'bg-slate-900 border-indigo-500/40' : 'bg-slate-100 border-indigo-300'
                }`}>
                  {user?.photoURL && (user.photoURL.startsWith('http') || user.photoURL.startsWith('/') || user.photoURL.startsWith('data:')) ? (
                    <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-300 text-base">{initial}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 flex items-center justify-center text-slate-950 shadow-sm">
                  <Check className="w-2.5 h-2.5 stroke-[3] text-white" />
                </div>
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className={`font-extrabold text-base sm:text-lg leading-tight truncate ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {user?.displayName || 'Estudiante GOALS'}
                  </h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border shrink-0 ${
                    isDark ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    Nivel {rank.level}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${ageBadge.color}`}>
                    {ageBadge.label}
                  </span>
                  {user?.email === 'josferestudio@gmail.com' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[10px] font-bold border border-amber-500/30 shrink-0">
                      ADMIN
                    </span>
                  )}
                </div>
                <p className={`text-xs font-semibold ${rank.color} mt-0.5`}>{rank.title}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenProfile}
              className={`self-start sm:self-center flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer ${
                isDark 
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-500" />
              <span>Ver Perfil y Retos</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Barra de Progreso XP al siguiente Nivel */}
          <div className="space-y-1.5 mt-4">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-bold text-amber-600 dark:text-amber-300">{currentXp} XP</span> / {rank.nextXp} XP
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-bold">{xpProgress}% hacia Nivel {rank.level + 1}</span>
            </div>
            <div className={`w-full rounded-full h-2.5 overflow-hidden border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <div 
                className="bg-gradient-to-r from-amber-400 via-indigo-500 to-cyan-400 h-full transition-all duration-500 rounded-full" 
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          {/* Fila Métrica Gamificada (XP, Racha, Estrellas) */}
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            <div 
              onClick={onOpenProfile}
              className={`group cursor-pointer rounded-2xl p-3 text-center border transition-all duration-200 ${
                isDark 
                  ? 'bg-slate-900/70 hover:bg-slate-900 border-amber-500/20 hover:border-amber-400/40' 
                  : 'bg-amber-50/50 hover:bg-amber-50 border-amber-200/60 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-amber-500 font-black text-lg">
                <Zap className="w-4 h-4 fill-amber-500" />
                <span>{currentXp}</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mt-0.5">XP Total</div>
            </div>

            <div 
              onClick={onOpenProfile}
              className={`group cursor-pointer rounded-2xl p-3 text-center border transition-all duration-200 ${
                isDark 
                  ? 'bg-slate-900/70 hover:bg-slate-900 border-rose-500/20 hover:border-rose-400/40' 
                  : 'bg-rose-50/50 hover:bg-rose-50 border-rose-200/60 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-rose-500 font-black text-lg">
                <Flame className="w-4 h-4 fill-rose-500" />
                <span>{userData.streak} {userData.streak === 1 ? 'Día' : 'Días'}</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mt-0.5">Racha Diaria</div>
            </div>

            <div 
              onClick={onOpenProfile}
              className={`group cursor-pointer rounded-2xl p-3 text-center border transition-all duration-200 ${
                isDark 
                  ? 'bg-slate-900/70 hover:bg-slate-900 border-indigo-500/20 hover:border-indigo-400/40' 
                  : 'bg-indigo-50/50 hover:bg-indigo-50 border-indigo-200/60 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-indigo-500 font-black text-lg">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{currentStars} / {maxPossibleStars}</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mt-0.5">Estrellas</div>
            </div>
          </div>

        </div>

        {/* 1.5. TARJETA ADAPTATIVA "TU CAMINO PERSONAL DE COSMOS" */}
        {astroPath && (
          <div className={`rounded-3xl p-5 border shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
            isDark 
              ? 'bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-slate-950 border-indigo-500/40' 
              : 'bg-gradient-to-br from-indigo-50 via-white to-sky-50 border-indigo-200 shadow-md'
          }`}>
            <div className="flex items-center gap-3.5">
              <span className={`p-3 rounded-2xl border text-2xl shrink-0 ${
                isDark ? 'bg-indigo-950 border-indigo-500/40' : 'bg-indigo-100 border-indigo-200'
              }`}>
                {astroPath.currentUnit.icon}
              </span>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                    isDark ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-indigo-100 text-indigo-800 border-indigo-200'
                  }`}>
                    Mi Camino • Cosmos
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {astroPath.completedUnitsCount} completadas
                  </span>
                </div>
                <h3 className={`font-extrabold text-sm sm:text-base truncate ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  {astroPath.currentUnit.title}
                </h3>
                <p className={`text-xs truncate max-w-xl ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {astroPath.currentUnit.subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectExperience('astro')}
              className="self-start sm:self-center px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all active:scale-95 cursor-pointer flex items-center gap-2 shrink-0"
            >
              <span>Continuar Aprendiendo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2. ACCESO A MUNDOS DE APRENDIZAJE */}
        <div className={`rounded-3xl p-4 sm:p-5 border transition-colors ${
          isDark 
            ? 'bg-[#0c101c] border-slate-800/90 shadow-xl' 
            : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <h3 className={`font-extrabold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Mundos de Aprendizaje
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                  isDark ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  5 MiniApps
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selecciona una disciplina o abre el menú lateral para explorar todas las experiencias interactivas.
              </p>
            </div>

            {onOpenMiniApps && (
              <button
                type="button"
                onClick={onOpenMiniApps}
                className="self-start sm:self-center px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explorar Todas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Chips Rápidos de Selección */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {MINI_APPS.map((app) => {
              const IconComp = app.icon;
              const isFree = app.id === 'criterio' || app.id === 'verify';
              const hasAccess = canAccessExperience(app.id as ExperienceId);

              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => onSelectExperience(app.id as ExperienceId)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all shadow-sm active:scale-95 cursor-pointer shrink-0 group ${
                    isDark 
                      ? 'bg-slate-900/90 hover:bg-slate-900 border-slate-800 text-slate-200 hover:text-white' 
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className={`relative p-1.5 rounded-xl border ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                  } ${app.iconColorClass}`}>
                    <IconComp className="w-4 h-4" />
                    {!isFree && !hasAccess && (
                      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[8px] font-black shadow-sm">
                        🔒
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs block leading-tight">{app.name}</span>
                      {isFree ? (
                        <span className="px-1.5 py-0.2 rounded text-[8px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                          GRATIS
                        </span>
                      ) : (
                        <span className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-bold border uppercase flex items-center gap-0.5 ${
                          hasAccess 
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                            : 'bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {!hasAccess && <span className="text-[7px]">🔒</span>}
                          PRO
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono block">{app.themeKeyword || app.badge}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. MENTOR IA RÁPIDO INTERACTIVO CON SUGERENCIAS */}
        <div className={`rounded-3xl p-4 sm:p-5 border transition-colors ${
          isDark 
            ? 'bg-[#0c101c] border-slate-800/90 shadow-xl' 
            : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`flex items-center gap-2 text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Mentor IA Rápido</span>
            </div>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold font-mono border ${
              isDark ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}>
              Inferencia Multimodal
            </span>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuickQuery();
            }} 
            className="flex gap-2"
          >
            <input
              type="text"
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              placeholder="Haz cualquier pregunta a tu Mentor IA (ciencia, idiomas, mates...)"
              className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-indigo-500 transition-colors font-medium ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
            <button
              type="submit"
              disabled={isAskingQuickAI || !quickQuery.trim()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 disabled:opacity-50 active:scale-95 cursor-pointer shadow-sm"
            >
              {isAskingQuickAI ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Preguntar</span>
            </button>
          </form>

          {/* Chips de Temas Rápidos */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {QUICK_TOPICS.map((topic, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuickQuery(topic.prompt);
                  handleSendQuickQuery(topic.prompt);
                }}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {topic.label}
              </button>
            ))}
          </div>

          {quickAiResponse && (
            <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed font-sans max-h-48 overflow-y-auto animate-fadeIn mt-3 ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-slate-200' 
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <div className={`flex items-center justify-between mb-1.5 pb-1 border-b text-[10px] font-bold ${
                isDark ? 'border-slate-800 text-indigo-300' : 'border-slate-200 text-indigo-700'
              }`}>
                <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> Respuesta del Tutor</span>
                <span className="text-emerald-600 dark:text-emerald-400">+15 XP ganados</span>
              </div>
              {quickAiResponse}
            </div>
          )}
        </div>

        {/* 4. RECOMENDACIÓN INTELIGENTE DEL DÍA */}
        <div className={`rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border transition-colors ${
          isDark 
            ? 'bg-gradient-to-r from-indigo-950/40 via-[#0c101c] to-cyan-950/40 border-indigo-500/30' 
            : 'bg-gradient-to-r from-indigo-50 via-white to-sky-50 border-indigo-200 shadow-md'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl border shrink-0 ${
              isDark ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300' : 'bg-indigo-100 border-indigo-200 text-indigo-700'
            }`}>
              <Orbit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isDark ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'
                }`}>
                  Misión Recomendada
                </span>
                <span className="text-amber-500 font-bold text-[11px]">+50 XP</span>
              </div>
              <h4 className={`font-extrabold text-sm mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Lección 1: Objetivo Luna — Artemis
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Explora el simulador espacial 3D y supera el primer test para desbloquear tus 3 estrellas.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectExperience('astro')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Comenzar Misión</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
