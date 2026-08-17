/**
 * GOALS 3D Cosmos - AdaptiveBottomSheet
 * Panel inferior deslizable háptico de 3 alturas (Peek: 56px, Half: 45vh, Full: 85vh)
 * Integra Retos con XP, Ficha Info con Vuelos de Cámara y Didáctica Interactiva.
 */

import React, { useState } from 'react';
import { ExplorerMode } from './ExplorerModeSelector';
import { CelestialEntityInfo, Landmark } from '../../../../core/3d/data/CelestialBodiesDatabase';
import { SpaceMission } from '../../../../core/3d/missions/MissionsDatabase';
import { ChevronUp, ChevronDown, Compass, Target, BookOpen, Layers, Award, Sparkles, MapPin, ExternalLink, Play } from 'lucide-react';

export type SheetHeight = 'peek' | 'half' | 'full';

interface AdaptiveBottomSheetProps {
  activeMode: ExplorerMode;
  entity: CelestialEntityInfo | null;
  activeMission: SpaceMission | null;
  currentStepIndex: number;
  isStepCompleted: boolean;
  onGuideMe: () => void;
  onOpenQuiz: () => void;
  onCinematicTravel: (key: string) => void;
  onSelectLandmark: (lm: Landmark) => void;
}

export const AdaptiveBottomSheet: React.FC<AdaptiveBottomSheetProps> = ({
  activeMode,
  entity,
  activeMission,
  currentStepIndex,
  isStepCompleted,
  onGuideMe,
  onOpenQuiz,
  onCinematicTravel,
  onSelectLandmark
}) => {
  const [heightState, setHeightState] = useState<SheetHeight>('peek');
  const [activeInfoTab, setActiveInfoTab] = useState<'landmarks' | 'layers' | 'data'>('landmarks');

  const toggleExpand = () => {
    if (heightState === 'peek') setHeightState('half');
    else if (heightState === 'half') setHeightState('full');
    else setHeightState('peek');
  };

  const collapseToPeek = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeightState('peek');
  };

  const expandToHalf = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeightState('half');
  };

  // Altura dinámica según estado
  const heightClass =
    heightState === 'peek'
      ? 'h-14'
      : heightState === 'half'
      ? 'h-[45vh]'
      : 'h-[85vh]';

  const currentStep = activeMission?.steps[currentStepIndex];

  return (
    <div
      className={`w-full max-w-xl mx-auto rounded-t-3xl bg-slate-950/95 backdrop-blur-2xl border-t border-x border-cyan-500/30 shadow-2xl transition-all duration-300 ease-out flex flex-col pointer-events-auto overflow-hidden ${heightClass}`}
    >
      {/* 1. BARRA DE CABECERA Y DRAG HANDLE (SIEMPRE VISIBLE EN PEEK) */}
      <div
        onClick={toggleExpand}
        className="w-full px-4 py-2 flex items-center justify-between cursor-pointer border-b border-white/10 shrink-0 select-none hover:bg-white/5"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-1 rounded-full bg-slate-600 mx-auto absolute top-1.5 left-1/2 -translate-x-1/2" />
          <span className="text-sm font-bold text-white flex items-center gap-1.5">
            {activeMode === 'retos' && <span>🎯 Reto Espacial</span>}
            {activeMode === 'info' && <span>ℹ️ {entity?.name || 'Explorador'}</span>}
            {activeMode === 'didactica' && <span>🎓 Guía Didáctica</span>}
          </span>
          {activeMode === 'retos' && currentStep && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              +{(activeMission as any)?.xpReward || 50} XP
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {heightState !== 'peek' ? (
            <button
              onClick={collapseToPeek}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
              title="Colapsar Panel"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={expandToHalf}
              className="p-1 rounded-lg text-cyan-300 hover:text-white"
              title="Expandir Panel"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* CONTENIDO SCROLLEABLE INTERACTIVO */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-4 scrollbar-thin">
        {/* ================= MODO 1: RETOS CON XP ================= */}
        {activeMode === 'retos' && activeMission && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Paso {currentStepIndex + 1} de {activeMission.steps.length}: {currentStep?.instruction}</span>
                </span>
                {isStepCompleted && (
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                    ✓ Objetivo Alcanzado
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {currentStep?.hint}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={onGuideMe}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Guiar Cámara 3D</span>
                </button>

                {isStepCompleted && (currentStep as any)?.quiz && (
                  <button
                    onClick={onOpenQuiz}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition-all flex items-center gap-1.5 active:scale-95 animate-bounce cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Reclamar +50 XP</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= MODO 2: FICHA INFO CON VUELOS 3D ================= */}
        {activeMode === 'info' && entity && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* SUB-TABS DENTRO DE INFO */}
            <div className="flex items-center gap-1 border-b border-white/10 pb-2">
              <button
                onClick={() => setActiveInfoTab('landmarks')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeInfoTab === 'landmarks' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                📍 Puntos Clave
              </button>
              <button
                onClick={() => setActiveInfoTab('layers')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeInfoTab === 'layers' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                🪐 Estructura
              </button>
              <button
                onClick={() => setActiveInfoTab('data')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeInfoTab === 'data' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                📊 Ficha Física
              </button>
            </div>

            {/* TAB: LANDMARKS TOCABLES CON VUELO DE CÁMARA */}
            {activeInfoTab === 'landmarks' && (
              <div className="space-y-2">
                <span className="text-[11px] font-mono text-cyan-300 uppercase font-bold block">
                  Toca un punto para que la cámara vuele hacia él:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {entity.landmarks?.map((lm: Landmark) => (
                    <button
                      key={lm.name}
                      onClick={() => {
                        onSelectLandmark(lm);
                        setHeightState('half');
                      }}
                      className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-400/60 hover:bg-white/5 text-left transition-all active:scale-98 flex items-start gap-2 group cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">{lm.name}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{lm.description}</p>
                      </div>
                    </button>
                  )) || (
                    <p className="text-xs text-slate-400 italic">Explora la superficie para ver detalles.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB: CAPAS GEOLÓGICAS */}
            {activeInfoTab === 'layers' && (
              <div className="space-y-2">
                {(entity as any).layers?.map((layer: any) => (
                  <div key={layer.name} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                      <span>{layer.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{layer.thickness}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{layer.description}</p>
                  </div>
                )) || <p className="text-xs text-slate-400">Sin capas internas disponibles.</p>}
              </div>
            )}

            {/* TAB: FICHA FÍSICA Y MAGNITUDES */}
            {activeInfoTab === 'data' && (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Diámetro:</span>
                  <span className="font-bold text-white">{entity.stats?.diameter || '12.742 km'}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Gravedad:</span>
                  <span className="font-bold text-emerald-400">{entity.stats?.gravity || (entity as any).surfaceGravityMs2 || '9.8 m/s²'}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Periodo de Rotación:</span>
                  <span className="font-bold text-cyan-300">{entity.stats?.orbitalPeriod || (entity as any).rotationPeriodHours || '24 h'}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= VISTA: MODO DIDÁCTICA ================= */}
        {activeMode === 'didactica' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Conceptos Astronómicos Fundamentales</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                Toca cualquier concepto para que la cámara 3D viaje al fenómeno y dibuje su geometría en vivo.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onCinematicTravel('earth');
                  setHeightState('half');
                }}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-400/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300">🌍 Línea de Kármán (100 km)</h4>
                  <p className="text-[11px] text-slate-400">El límite físico donde la atmósfera da paso al vacío orbital.</p>
                </div>
                <span className="text-xs text-indigo-400 font-bold shrink-0">Ver 3D ▶</span>
              </button>

              <button
                onClick={() => {
                  onCinematicTravel('iss');
                  setHeightState('half');
                }}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-400/60 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-300">🛰️ Órbita LEO a 27.600 km/h</h4>
                  <p className="text-[11px] text-slate-400">Por qué los satélites "caen continuamente" sin chocar.</p>
                </div>
                <span className="text-xs text-emerald-400 font-bold shrink-0">Ver 3D ▶</span>
              </button>

              <button
                onClick={() => {
                  onCinematicTravel('moon');
                  setHeightState('half');
                }}
                className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-400 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-slate-200">🌕 Acoplamiento de Marea Lunar</h4>
                  <p className="text-[11px] text-slate-400">Por qué la Luna siempre nos muestra la misma cara.</p>
                </div>
                <span className="text-xs text-slate-300 font-bold shrink-0">Ver 3D ▶</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
