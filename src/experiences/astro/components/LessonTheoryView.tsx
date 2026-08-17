/**
 * GOALS 3D Cosmos - LessonTheoryView
 * Vista de Lecciones Teóricas Adaptativas con layout fluido en 2 columnas (Desktop) / 1 columna (Móvil),
 * visor interactivo de fotos de la NASA con zoom 1x-3x, dato WOW, actualidad y soporte para CurriculumUnit.
 */

import React, { useState } from 'react';
import { Lesson } from '../types';
import { CurriculumUnit } from '../../../core/types/adaptiveCurriculum';
import { Sparkles, ArrowRight, ArrowLeft, Clock, BookOpen, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { useProgress } from '../../../core/context/ProgressContext';
import { PresentationEngine } from '../../../core/services/PresentationEngine';
import { NasaPhotoViewer } from './interactive/NasaPhotoViewer';

interface LessonTheoryViewProps {
  lesson?: Lesson;
  unit?: CurriculumUnit;
  onGoToCatalog: () => void;
  onSelectLesson?: (id: number) => void;
  onSelectUnit?: (unitId: string) => void;
  onGoTo3D: (targetObject?: string) => void;
  onGoToTest: () => void;
  onStepComplete?: (stepIndex: number) => void;
}

export const LessonTheoryView: React.FC<LessonTheoryViewProps> = ({
  lesson,
  unit,
  onGoToCatalog,
  onSelectLesson,
  onSelectUnit,
  onGoTo3D,
  onGoToTest,
  onStepComplete
}) => {
  const { userData, isLessonUnlocked, showToast, effectiveAge } = useProgress();
  const declaredAge = effectiveAge || userData?.learnerProfile?.education?.age || userData?.childProfile?.age || 9;
  const profile = PresentationEngine.computeProfile(declaredAge);

  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);

  // Normalizar datos de la lección / unidad
  const title = unit?.title || lesson?.title || 'Exploración Cósmica';
  const icon = unit?.icon || lesson?.icon || '🌌';
  const tag = unit?.tag || lesson?.tag || 'Misión Espacial';

  // Normalizar pasos
  interface NormalizedStep {
    t: string;
    text: string;
    icon: string;
    wow?: string;
    now?: string;
    photo?: {
      url: string;
      caption?: string;
      credit?: string;
    };
    scene?: string;
  }

  const rawSteps: NormalizedStep[] = unit 
    ? unit.steps.map(s => ({
        t: s.title,
        text: s.content,
        icon: s.icon || icon,
        wow: s.wowFact,
        now: s.nowFact,
        photo: s.media?.url ? {
          url: s.media.url,
          caption: s.media.caption,
          credit: s.media.credit
        } : s.photo ? s.photo : (unit.heroImage ? { url: unit.heroImage, caption: unit.title, credit: 'NASA' } : undefined),
        scene: s.model3d?.sceneId || 'space_default'
      }))
    : (lesson?.steps || []);

  const total = Math.max(1, rawSteps.length);
  const step = rawSteps[currentStepIdx] || rawSteps[0] || {
    t: title,
    text: 'Cargando contenido pedagógico...',
    icon
  };
  const isLastStep = currentStepIdx === total - 1;

  const handleNextStep = () => {
    onStepComplete?.(currentStepIdx);
    if (!isLastStep) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      onGoToTest();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-7xl xl:max-w-[1500px] mx-auto px-3 sm:px-6 lg:px-8 space-y-4 lg:space-y-6 pb-12 text-white animate-in fade-in duration-300">
      
      {/* 1. NAVEGACIÓN SUPERIOR FLUIDA */}
      <header className="flex items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-xl p-2 sm:p-3 rounded-2xl border border-white/10 shadow-xl">
        <button
          type="button"
          onClick={onGoToCatalog}
          title="Ver Ruta y Catálogo"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-bold text-slate-200 transition-all active:scale-95 cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Mi Ruta</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="text-xs sm:text-sm font-bold text-cyan-300 font-display flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/30">
            <span className="text-base">{icon}</span>
            <span className="truncate max-w-[180px] sm:max-w-[320px] md:max-w-[450px]">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl bg-indigo-950/80 border border-indigo-500/30 text-indigo-300">
            <GraduationCap className="w-3 h-3 text-indigo-400" />
            Tramo {profile.ageTranche}
          </span>
          <span className="text-xs font-mono font-extrabold px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300">
            Paso {currentStepIdx + 1}/{total}
          </span>
        </div>
      </header>

      {/* 2. BARRA DE PROGRESO SEGMENTADA */}
      <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div
          className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
          style={{ width: `${((currentStepIdx + 1) / total) * 100}%` }}
        />
      </div>

      {/* 3. LAYOUT RESPONSIVE EN 2 COLUMNAS (DESKTOP) / 1 COLUMNA (TABLET/MÓVIL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        
        {/* COLUMNA IZQUIERDA: VISOR FOTOGRÁFICO NASA CON ZOOM & TELEMETRÍA (7 COLS) */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-3 lg:sticky lg:top-4">
          {step.photo && step.photo.url ? (
            <NasaPhotoViewer
              photoUrl={step.photo.url}
              caption={step.photo.caption}
              credit={step.photo.credit}
              title={step.t}
              onOpen3D={() => onGoTo3D(step.scene)}
            />
          ) : (
            <div className="w-full h-64 sm:h-80 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-500">
              <span>Fotografía en proceso de calibración orbital</span>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: CONSOLA DIDÁCTICA, DATO WOW, ACTUALIDAD & CONTROLES (5 COLS) */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-4">
          
          {/* TARJETA DE TEORÍA PEDAGÓGICA */}
          <div className="rounded-3xl p-5 sm:p-6 space-y-4 border border-white/15 shadow-2xl bg-slate-900/90 backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <span className="text-2xl p-2 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner">
                {step.icon}
              </span>
              <h2 className="font-display font-black text-base sm:text-lg text-white leading-snug">
                {step.t}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal">
              {step.text}
            </p>

            {/* BLOQUE DATO WOW */}
            {step.wow && (
              <div className="bg-gradient-to-br from-indigo-950/70 to-purple-950/50 border border-indigo-500/40 rounded-2xl p-4 space-y-1 shadow-lg shadow-indigo-950/20">
                <div className="flex items-center gap-1.5 text-xs font-black text-indigo-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Dato WOW 🤯</span>
                </div>
                <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                  {step.wow}
                </p>
              </div>
            )}

            {/* BLOQUE ACTUALIDAD AGOSTO 2026 */}
            {step.now && (
              <div className="bg-gradient-to-br from-cyan-950/70 to-slate-950 border border-cyan-500/40 rounded-2xl p-4 space-y-1 shadow-lg shadow-cyan-950/20">
                <div className="flex items-center gap-1.5 text-xs font-black text-cyan-300 uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Agosto 2026: Actualidad Espacial</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
                  {step.now}
                </p>
              </div>
            )}
          </div>

          {/* BOTONERA DE NAVEGACIÓN ERGONÓMICA (ALTURA MÍNIMA 48PX) */}
          <div className="flex gap-3 pt-2">
            {currentStepIdx > 0 && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="flex-1 min-h-[48px] px-4 py-3 rounded-2xl font-display font-bold text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Paso Anterior</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className={`flex-1 min-h-[48px] px-4 py-3 rounded-2xl font-display font-black text-xs sm:text-sm uppercase tracking-wide border-b-4 active:border-b-0 active:mt-1 text-white shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isLastStep
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 border-cyan-700 shadow-cyan-950/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-800 shadow-emerald-950/40'
              }`}
            >
              <span>{isLastStep ? `🎯 Realizar Evaluación (+50 XP)` : 'Siguiente Paso'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
