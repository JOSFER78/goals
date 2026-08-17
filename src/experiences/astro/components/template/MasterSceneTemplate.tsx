/**
 * GOALS 3D Cosmos - MasterSceneTemplate
 * Plantilla Estructural Universal para las 12 Escenas Cósmicas
 * Arquitectura Split-View No Solapante (60% 3D Viewport / 40% Panel de Información)
 * Inspirada en los estándares visuales de Apple VisionOS y NASA Eyes.
 */

import React, { useState } from 'react';
import { CelestialEntityInfo, Landmark } from '../../../../core/3d/data/CelestialBodiesDatabase';
import { SpaceMission } from '../../../../core/3d/missions/MissionsDatabase';
import { ChevronLeft, ChevronRight, MapPin, Compass, Award, Play, Pause, Maximize, Minimize } from 'lucide-react';

export type TemplateTab = 'landmarks' | 'challenge' | 'science';

interface MasterSceneTemplateProps {
  // 1. Escena y Navegación
  sceneNumber: number;
  totalScenes?: number;
  sceneTitle: string;
  onPrevScene?: () => void;
  onNextScene?: () => void;

  // 2. Astro e Información
  entity: CelestialEntityInfo;
  selectedLandmark?: Landmark | null;
  onSelectLandmark: (lm: Landmark) => void;

  // 3. Retos de Gamificación
  activeMission?: SpaceMission;
  currentStepIndex?: number;
  isStepCompleted?: boolean;
  onGuideToMission?: () => void;
  onOpenQuizModal?: () => void;

  // 4. Controles Temporales y Simulación
  timeScale: number;
  isPaused: boolean;
  scaleMode: 'didactic' | 'scientific';
  onTogglePause: () => void;
  onCycleTimeScale: () => void;
  onToggleScale: () => void;

  // 5. Canvas 3D
  children: React.ReactNode;
}

export const MasterSceneTemplate: React.FC<MasterSceneTemplateProps> = ({
  sceneNumber,
  totalScenes = 12,
  sceneTitle,
  onPrevScene,
  onNextScene,
  entity,
  selectedLandmark,
  onSelectLandmark,
  activeMission,
  currentStepIndex = 0,
  isStepCompleted = false,
  onGuideToMission,
  onOpenQuizModal,
  timeScale,
  isPaused,
  scaleMode,
  onTogglePause,
  onCycleTimeScale,
  onToggleScale,
  children
}) => {
  const [activeTab, setActiveTab] = useState<TemplateTab>('landmarks');
  const [activeLandmark, setActiveLandmark] = useState<Landmark | null>(
    selectedLandmark || entity.landmarks?.[0] || null
  );

  const handleLandmarkClick = (lm: Landmark) => {
    setActiveLandmark(lm);
    onSelectLandmark(lm);
  };

  const currentStep = activeMission?.steps?.[currentStepIndex];

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      
      {/* ========================================================
          1. VIEWPORT 3D SUPERIOR (58% en móvil / 65% en PC)
          Totalmente despejado para interacción táctil y rotación
          ======================================================== */}
      <div className="relative w-full h-[58%] sm:h-[62%] bg-black overflow-hidden">
        {/* Renderizador Three.js con Gaia Stars, Sol Radiante y Pines 3D */}
        {children}

        {/* CONTROLES SUPERIORES FLOTANTES ULTRA-DISCRETOS */}
        <div className="absolute top-3 inset-x-3 pointer-events-none flex items-center justify-between z-20">
          {/* Paginador de Escena */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-xl border border-white/15 px-3 py-1.5 rounded-full shadow-2xl">
            <button
              onClick={onPrevScene}
              disabled={sceneNumber <= 1}
              className="p-1 rounded-full text-slate-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
              title="Escena Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-cyan-300 tracking-wide">
              {sceneNumber} / {totalScenes}
            </span>
            <button
              onClick={onNextScene}
              disabled={sceneNumber >= totalScenes}
              className="p-1 rounded-full text-slate-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
              title="Siguiente Escena"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Micro-Controles de Simulación */}
          <div className="pointer-events-auto flex items-center gap-1 bg-slate-950/80 backdrop-blur-xl border border-white/15 p-1 rounded-full shadow-2xl">
            <button
              onClick={onTogglePause}
              className={`p-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isPaused ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
              title="Pausar / Reanudar Simulación"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onCycleTimeScale}
              className="px-2 py-1 rounded-full bg-slate-800 text-[10px] font-mono font-bold text-cyan-300 hover:text-white transition-all cursor-pointer"
              title="Acelerar Tiempo Cósmico"
            >
              {timeScale}x
            </button>

            <button
              onClick={onToggleScale}
              className={`px-2 py-1 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${
                scaleMode === 'scientific'
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                  : 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50'
              }`}
              title="Alternar Escala Científica / Didáctica"
            >
              {scaleMode === 'scientific' ? '🔬 1:1' : '🎓 Didáct.'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. PANEL TIPOGRÁFICO INFERIOR (42% en móvil / 38% en PC)
          Fijo, sin solapamientos, con scroll táctil interno
          ======================================================== */}
      <div className="w-full h-[42%] sm:h-[38%] bg-slate-950 border-t border-slate-800/80 flex flex-col z-30 shadow-2xl">
        
        {/* CABECERA DE ESCENA Y PESTAÑAS (ZERO CLUTTER) */}
        <div className="px-4 pt-3 pb-2 border-b border-white/5 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-extrabold block">
              TEMA {sceneNumber} · {entity.name}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
              {sceneTitle}
            </h2>
          </div>

          {/* 3 Pestañas Tipográficas Limpias */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-900 border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('landmarks')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'landmarks'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Puntos Clave
            </button>
            <button
              onClick={() => setActiveTab('challenge')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'challenge'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Reto +50 XP
            </button>
            <button
              onClick={() => setActiveTab('science')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'science'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ficha
            </button>
          </div>
        </div>

        {/* CONTENIDO SCROLLEABLE INTERNO SEGÚN PESTAÑA */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin text-slate-300 text-xs">
          
          {/* ================= PESTAÑA 1: PUNTOS CLAVE & LANDMARKS ================= */}
          {activeTab === 'landmarks' && (
            <div className="space-y-2.5">
              {/* Cabecera de estado de coordenadas */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Toca un punto para volar hacia él en 3D:</span>
                {activeLandmark && (
                  <span className="text-cyan-400 font-bold">
                    📍 {activeLandmark.coords?.lat ?? 0}° Lat, {activeLandmark.coords?.lon ?? 0}° Lon
                  </span>
                )}
              </div>

              {/* Carrusel de Puntos Clave Tocables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {entity.landmarks?.map((lm: Landmark) => {
                  const isSelected = activeLandmark?.name === lm.name;
                  return (
                    <button
                      key={lm.name}
                      onClick={() => handleLandmarkClick(lm)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-500/20 scale-[1.01]'
                          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-cyan-300' : 'text-slate-500'}`} />
                      <div className="flex-1">
                        <h4 className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {lm.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {lm.description}
                        </p>
                      </div>
                    </button>
                  );
                }) || (
                  <p className="text-slate-400 italic">Explora la superficie para interactuar con los elementos 3D.</p>
                )}
              </div>
            </div>
          )}

          {/* ================= PESTAÑA 2: RETO ESPACIAL (+50 XP) ================= */}
          {activeTab === 'challenge' && activeMission && currentStep && (
            <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-2.5">
              <div className="flex items-center justify-between font-mono text-[11px] text-amber-300 font-bold">
                <span>MISIÓN: {activeMission.title.toUpperCase()}</span>
                <span>Paso {currentStepIndex + 1}/{activeMission.steps.length}</span>
              </div>
              <h3 className="font-bold text-sm text-white leading-snug">
                {currentStep.instruction}
              </h3>
              <p className="text-xs text-amber-200/80 leading-relaxed">
                {currentStep.hint}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={onGuideToMission}
                  className="py-2 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-95"
                >
                  <Compass className="w-4 h-4" />
                  <span>Volar al Objetivo 3D</span>
                </button>

                <button
                  onClick={onOpenQuizModal}
                  className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-95 ${
                    isStepCompleted
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white animate-pulse'
                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>{isStepCompleted ? '🎉 Validar Reto' : 'Completar (+50 XP)'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ================= PESTAÑA 3: FICHA CIENTÍFICA ================= */}
          {activeTab === 'science' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Diámetro:</span>
                  <span className="font-bold text-white">{entity.stats?.diameter || '—'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Masa:</span>
                  <span className="font-bold text-white">{entity.stats?.mass || '—'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Gravedad:</span>
                  <span className="font-bold text-emerald-400">{entity.stats?.gravity || '—'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Velocidad Orbital:</span>
                  <span className="font-bold text-cyan-300">{entity.stats?.orbitalSpeed || '—'}</span>
                </div>
              </div>

              {entity.summary && (
                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                  {entity.summary}
                </p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
