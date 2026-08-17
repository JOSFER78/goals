/**
 * GOALS 3D Cosmos - TestsCatalogHub
 * Centro de Exámenes y Retos Independientes de Astronomía (12 Bloques)
 * Muestra el estado gradual de desbloqueo, estrellas conseguidas (0-3 ⭐),
 * mejor puntuación y permite evaluar o reintentar cualquier examen desbloqueado.
 */

import React from 'react';
import { Award, Star, Lock, CheckCircle2, RotateCcw, ArrowRight, BookOpen, Shield, Sparkles } from 'lucide-react';
import { Lesson } from '../types';
import { CurriculumUnit } from '../../../core/types/adaptiveCurriculum';
import { useProgress } from '../../../core/context/ProgressContext';
import { useAuth } from '../../../core/context/AuthContext';
import { PresentationEngine } from '../../../core/services/PresentationEngine';

interface TestsCatalogHubProps {
  units?: CurriculumUnit[];
  lessons?: Lesson[];
  onSelectTest: (lessonId: number, unitId?: string) => void;
  onGoToLesson: (lessonId: number, unitId?: string) => void;
}

export const TestsCatalogHub: React.FC<TestsCatalogHubProps> = ({
  units,
  lessons = [],
  onSelectTest,
  onGoToLesson
}) => {
  const { userData, isTestUnlocked, adminBypass, toggleAdminBypass, showToast, effectiveAge } = useProgress();
  const { user } = useAuth();
  const isUserAdmin = Boolean(user?.email === 'josferestudio@gmail.com' || userData?.role === 'admin');

  const declaredAge = effectiveAge || userData?.learnerProfile?.education?.age || userData?.childProfile?.age || 9;
  const levelBadge = PresentationEngine.getLevelBadge(declaredAge);

  const astroLessons = userData?.experiences?.astro?.lessons || userData?.lessons || {};

  // Si se reciben unidades adaptadas, usamos ese catálogo; si no, fallback a lessons
  const displayItems = units && units.length > 0 
    ? units.map(u => {
        const canonicalNum = u.canonicalNumber;
        const prog = astroLessons[canonicalNum];
        const isCompleted = Boolean(prog?.testDone);
        const stars = prog?.stars || 0;
        const isUnlocked = isTestUnlocked(canonicalNum) || adminBypass;
        const qCount = u.test?.questions?.length || 4;

        return {
          id: canonicalNum,
          unitId: u.id,
          title: u.title,
          subtitle: u.subtitle,
          icon: u.icon,
          xpReward: u.test?.xpReward || u.xpReward || 50,
          isCompleted,
          stars,
          isUnlocked,
          qCount,
          isAdaptiveUnit: true
        };
      })
    : lessons.map(l => {
        const prog = astroLessons[l.id];
        const isCompleted = Boolean(prog?.testDone);
        const stars = prog?.stars || 0;
        const isUnlocked = isTestUnlocked(l.id) || adminBypass;
        const qCount = l.test?.length || 4;

        return {
          id: l.id,
          unitId: undefined,
          title: l.title,
          subtitle: l.tag || 'Astronomía 3D',
          icon: l.icon,
          xpReward: 50,
          isCompleted,
          stars,
          isUnlocked,
          qCount,
          isAdaptiveUnit: false
        };
      });

  // Estadísticas globales de tests
  let totalTestsCompleted = 0;
  let totalStarsEarned = 0;
  displayItems.forEach((item) => {
    if (item.isCompleted) totalTestsCompleted++;
    if (item.stars) totalStarsEarned += item.stars;
  });

  const maxStars = displayItems.length * 3;
  const progressPct = Math.round((totalTestsCompleted / Math.max(1, displayItems.length)) * 100);

  return (
    <div className="w-full max-w-5xl mx-auto p-3 sm:p-6 space-y-6 text-white animate-in fade-in duration-300">
      
      {/* CABECERA ACADÉMICA / TELEMETRÍA DE EXÁMENES */}
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 p-5 sm:p-7 rounded-3xl shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                <Award className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-tight">
                Centro de Evaluaciones Cósmicas
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-bold ${levelBadge.color}`}>
                {levelBadge.label}
              </span>
              <p className="text-xs text-slate-300">
                {displayItems.length} Evaluaciones Calibradas para tu Etapa Escolar.
              </p>
            </div>
          </div>

          {/* MODO TUTOR / ADMIN BYPASS SWITCH */}
          {isUserAdmin && (
            <button
              onClick={() => {
                toggleAdminBypass();
                showToast(adminBypass ? "🔒 Modo Alumno Activado (Candados graduales)" : "🔓 Modo Tutor Activado (Desbloqueo total)");
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer ${
                adminBypass
                  ? 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-lg shadow-amber-950'
                  : 'bg-slate-950/80 border-slate-700 text-slate-400 hover:text-white'
              }`}
              title="Alternar entre visión de alumno con candados o desbloqueo total para auditoría"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Modo Tutor: {adminBypass ? 'Desbloqueo Total' : 'Modo Alumno'}</span>
            </button>
          )}
        </div>

        {/* MÉTRICAS GLOBALES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Tests Superados</span>
            <div className="text-lg sm:text-xl font-display font-black text-cyan-300">
              {totalTestsCompleted} <span className="text-xs font-normal text-slate-400">/ {displayItems.length}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Estrellas ⭐</span>
            <div className="text-lg sm:text-xl font-display font-black text-amber-300">
              {totalStarsEarned} <span className="text-xs font-normal text-slate-400">/ {maxStars}</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Progreso Tramo</span>
            <div className="text-lg sm:text-xl font-display font-black text-emerald-300">
              {progressPct}%
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">XP Evaluaciones</span>
            <div className="text-lg sm:text-xl font-display font-black text-indigo-300">
              +{totalTestsCompleted * 50} <span className="text-xs font-normal text-slate-400">XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* CATÁLOGO DE TARJETAS DE EVALUACIÓN ADAPTADAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayItems.map((item, idx) => {
          return (
            <div
              key={`test_card_${item.unitId || item.id}`}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                !item.isUnlocked
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-65 cursor-not-allowed'
                  : item.isCompleted
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  : 'bg-slate-900/90 border-cyan-500/40 hover:border-cyan-400 shadow-lg shadow-cyan-950/20'
              }`}
            >
              {/* CABECERA DE LA TARJETA */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                        Evaluación {idx + 1} de {displayItems.length}
                      </span>
                      <h3 className="font-display font-bold text-sm text-white leading-tight mt-0.5">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* INSIGNIA DE ESTADO */}
                  <div className="shrink-0">
                    {!item.isUnlocked ? (
                      <span className="p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-600 block">
                        <Lock className="w-4 h-4" />
                      </span>
                    ) : item.isCompleted ? (
                      <span className="px-2 py-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Superado
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Disponible
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.subtitle}
                </p>

                {/* METADATOS: PREGUNTAS Y ESTRELLAS */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400 font-mono">
                    {item.qCount} {item.qCount === 1 ? 'Pregunta' : 'Preguntas'} • +{item.xpReward} XP
                  </span>

                  {item.isUnlocked && (
                    <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-lg border border-white/5">
                      <Star className={`w-3.5 h-3.5 ${item.stars >= 1 ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                      <Star className={`w-3.5 h-3.5 ${item.stars >= 2 ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                      <Star className={`w-3.5 h-3.5 ${item.stars >= 3 ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
                    </div>
                  )}
                </div>
              </div>

              {/* BOTONERA DE ACCIÓN */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                {item.isUnlocked ? (
                  <>
                    <button
                      type="button"
                      onClick={() => onSelectTest(item.id, item.unitId)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow ${
                        item.isCompleted
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-cyan-950'
                      }`}
                    >
                      {item.isCompleted ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5 text-cyan-300" />
                          <span>Repetir (+XP)</span>
                        </>
                      ) : (
                        <>
                          <span>Comenzar Test</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => onGoToLesson(item.id, item.unitId)}
                      title="Repasar Lección Teórica"
                      className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="w-full py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] font-mono text-slate-500 text-center flex items-center justify-center gap-1.5">
                    <Lock className="w-3 h-3 text-slate-600" />
                    <span>Bloqueado (Sigue la ruta pedagógica)</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
