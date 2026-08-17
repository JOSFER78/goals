/**
 * GOALS 3D Cosmos - LessonSelectorDrawer
 * Selector Visual y Mapa de las 12 Lecciones de Astrofísica con Bloqueo Incremental
 */

import React from 'react';
import { Lesson } from '../types';
import { LESSONS } from '../data/lessonsData';
import { useProgress } from '../../../core/context/ProgressContext';
import { X, BookOpen, Star, CheckCircle2, ChevronRight, Lock, Unlock } from 'lucide-react';

interface LessonSelectorDrawerProps {
  isOpen: boolean;
  activeLessonId: number;
  onSelectLesson: (lessonId: number) => void;
  onClose: () => void;
}

export const LessonSelectorDrawer: React.FC<LessonSelectorDrawerProps> = ({
  isOpen,
  activeLessonId,
  onSelectLesson,
  onClose
}) => {
  const { userData, isLessonUnlocked, showToast } = useProgress();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end animate-in fade-in duration-200 pointer-events-auto">
      <div className="w-full sm:w-[480px] h-full bg-slate-950/95 border-l border-cyan-500/30 p-5 sm:p-6 flex flex-col gap-4 text-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* CABECERA */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-extrabold text-base text-white">Escalera Cósmica</h3>
              <p className="text-xs text-cyan-300 font-mono">12 Lecciones & Desbloqueo Incremental</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LISTADO DE LAS 12 LECCIONES */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
          {LESSONS.map((lesson) => {
            const isActive = lesson.id === activeLessonId;
            const astroLessons = userData?.experiences?.astro?.lessons || userData?.lessons || {};
            const progress = astroLessons[lesson.id];
            const isCompleted = progress?.testDone;
            const stars = progress?.stars || 0;
            const isUnlocked = isLessonUnlocked(lesson.id);

            return (
              <div
                key={lesson.id}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectLesson(lesson.id);
                    onClose();
                  } else {
                    showToast(`🔒 Completa la Lección ${lesson.id - 1} para desbloquear este nivel`);
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 group ${
                  !isUnlocked
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60 cursor-not-allowed'
                    : isActive
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-500/20 cursor-pointer'
                    : 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-105 transition-transform">
                    {lesson.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-cyan-300">
                        {lesson.id} / 12
                      </span>
                      {isCompleted ? (
                        <span className="flex items-center gap-0.5 text-[10px] font-mono text-emerald-400">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Aprobado</span>
                        </span>
                      ) : !isUnlocked ? (
                        <span className="flex items-center gap-0.5 text-[10px] font-mono text-slate-500">
                          <Lock className="w-3 h-3" />
                          <span>Bloqueado</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-[10px] font-mono text-cyan-400">
                          <Unlock className="w-3 h-3" />
                          <span>Disponible</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {lesson.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {lesson.tag}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Estrellas */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  {isUnlocked && (
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
