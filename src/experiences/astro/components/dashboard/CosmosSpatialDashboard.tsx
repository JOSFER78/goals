/**
 * GOALS 3D Cosmos - CosmosSpatialDashboard
 * Plantilla Maestra Espacial de Alta Fidelidad para iPad, Web Desktop y Móvil 50/50.
 * 
 * Novedades & Estándares:
 * 1. Pestaña de Borde Fija [ ◀ DATOS ] para recuperación garantizada de panel al ocultarse.
 * 2. Leyenda de Capas estilo Google Maps ([ 🗺️ Capas ]: Órbitas, Balizas, Atmósfera, Estrellas, Cuadrícula).
 * 3. Dock Lateral Izquierdo Compacto con micro-iconos (Tierra, Luna, ISS, Hubble, Landsat, JWST).
 * 4. Layout Móvil 50/50 (Mitad 3D arriba, Mitad panel interactivo abajo, sin tapar el 3D).
 * 5. 100% de la Información Científica, Capas, Datos WOW, Misiones y Retos con XP.
 */

import React, { useState } from 'react';
import { CelestialEntityInfo, Landmark } from '../../../../core/3d/data/CelestialBodiesDatabase';
import { SpaceMission } from '../../../../core/3d/missions/MissionsDatabase';
import { TelemetryData } from '../../../../core/3d/engine/CosmosScaleEngine';
import { 
  ChevronLeft, ChevronRight, MapPin, Compass, Award, Play, Pause, 
  Layers, BookOpen, Sparkles, Clock, Globe, Orbit, ShieldCheck, Eye, EyeOff,
  Maximize, Minimize, HelpCircle, X, ChevronDown, Rocket, Check, SlidersHorizontal,
  ChevronUp
} from 'lucide-react';

export type DashboardTab = 'landmarks' | 'encyclopedia' | 'curiosities' | 'challenges';

export interface MapLayerConfig {
  orbits: boolean;
  pins: boolean;
  atmosphere: boolean;
  stars: boolean;
  grid: boolean;
}

interface CosmosSpatialDashboardProps {
  // Escena y Navegación
  sceneNumber: number;
  totalScenes: number;
  sceneTitle: string;
  onPrevScene: () => void;
  onNextScene: () => void;
  onSelectSceneIdx: (idx: number) => void;
  scenesList: Array<{ id: number; name: string }>;

  // Astro y Datos
  entity: CelestialEntityInfo;
  telemetry: TelemetryData;
  onSelectLandmark: (lm: Landmark) => void;
  onFocusTarget: (key: string) => void;

  // Capas estilo Google Maps
  onToggleLayerVisibility: (layerKey: keyof MapLayerConfig, visible: boolean) => void;

  // Gamificación y Retos
  activeMission: SpaceMission;
  currentStepIndex: number;
  isStepCompleted: boolean;
  onGuideToMission: () => void;
  onOpenQuizModal: () => void;

  // Controles de Simulación
  onTogglePause: () => void;
  onSetTimeScale: (scale: number) => void;
  onToggleScale: () => void;
  scaleMode: 'didactic' | 'scientific';

  // Canvas 3D
  children: React.ReactNode;
}

export const CosmosSpatialDashboard: React.FC<CosmosSpatialDashboardProps> = ({
  sceneNumber,
  totalScenes,
  sceneTitle,
  onPrevScene,
  onNextScene,
  onSelectSceneIdx,
  scenesList,
  entity,
  telemetry,
  onSelectLandmark,
  onFocusTarget,
  onToggleLayerVisibility,
  activeMission,
  currentStepIndex,
  isStepCompleted,
  onGuideToMission,
  onOpenQuizModal,
  onTogglePause,
  onSetTimeScale,
  onToggleScale,
  scaleMode,
  children
}) => {
  // Estados de interfaz
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>('landmarks');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isSceneDropdownOpen, setIsSceneDropdownOpen] = useState<boolean>(false);
  const [isLayersMenuOpen, setIsLayersMenuOpen] = useState<boolean>(false);
  const [isSpeedMenuOpen, setIsSpeedMenuOpen] = useState<boolean>(false);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(
    entity.landmarks?.[0] || null
  );

  // Referencia para click-outside de popovers
  const headerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsSceneDropdownOpen(false);
        setIsLayersMenuOpen(false);
        setIsSpeedMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  // Estados de capas visibles
  const [layerVisibility, setLayerVisibility] = useState<MapLayerConfig>({
    orbits: true,
    pins: true,
    atmosphere: true,
    stars: true,
    grid: false
  });

  const handleToggleLayer = (layerKey: keyof MapLayerConfig) => {
    const nextVal = !layerVisibility[layerKey];
    setLayerVisibility(prev => ({ ...prev, [layerKey]: nextVal }));
    onToggleLayerVisibility(layerKey, nextVal);
  };

  const currentMission = activeMission;
  const currentStep = currentMission?.steps?.[currentStepIndex];

  const speeds = [1, 10, 100, 1000, 10000];

  // Helper para títulos de estructura rigurosos
  const getStructureTitle = () => {
    if (entity.category === 'planeta' || entity.category === 'luna') return 'Estructura Geológica y Capas';
    if (entity.category === 'estacion' || entity.category === 'telescopio' || entity.category === 'satelite') return 'Arquitectura e Instrumentación';
    return 'Componentes y Morfología Cósmica';
  };

  const handleLandmarkClick = (lm: Landmark) => {
    setSelectedLandmark(lm);
    onSelectLandmark(lm);
  };

  const TARGETS_DOCK = [
    { key: 'earth', label: 'Tierra', icon: '🌍' },
    { key: 'moon', label: 'Luna', icon: '🌕' },
    { key: 'iss', label: 'ISS', icon: '🛰️' },
    { key: 'hubble', label: 'Hubble', icon: '🔭' },
    { key: 'landsat', label: 'Landsat', icon: '📡' },
    { key: 'jwst', label: 'JWST', icon: '🌌' }
  ];

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex flex-col md:flex-row bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      
      {/* ========================================================
          1. VIEWPORT 3D (Ocupa el 100% en Desktop, o 50% en Móvil)
          ======================================================== */}
      <div className={`relative ${isSidebarOpen ? 'h-[48vh] md:h-full flex-1' : 'h-full flex-1'} bg-black overflow-hidden transition-all duration-300`}>
        
        {/* Canvas WebGL2 Three.js */}
        {children}

        {/* ========================================================
            CABECERA SUPERIOR FLOTANTE ESTILO NASA EYES / STELLARIUM
            ======================================================== */}
        {/* ================= BARRA SUPERIOR (HEADER) ================= */}
        {!isZenMode && (
          <header ref={headerRef} className="absolute top-2 left-2 right-2 md:top-3 md:left-4 md:right-4 z-40 flex items-center justify-between pointer-events-none gap-2">
            
            {/* IZQUIERDA: Selector de Escena con Popover */}
            <div className="relative pointer-events-auto flex items-center gap-1 bg-slate-950/90 backdrop-blur-2xl border border-white/15 px-1.5 py-1 md:px-3 md:py-1.5 rounded-xl md:rounded-2xl shadow-2xl shrink-0">
              <button
                onClick={onPrevScene}
                disabled={sceneNumber <= 1}
                className="p-0.5 md:p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                title="Escena Anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>

              <button
                onClick={() => {
                  setIsSceneDropdownOpen(!isSceneDropdownOpen);
                  setIsLayersMenuOpen(false);
                  setIsSpeedMenuOpen(false);
                }}
                className="flex items-center gap-1 px-1 py-0.5 rounded-lg hover:bg-white/10 transition-all text-[11px] md:text-xs font-bold text-cyan-300 font-mono cursor-pointer max-w-[100px] xs:max-w-[130px] sm:max-w-[200px] md:max-w-none"
              >
                <span className="truncate">{sceneNumber}/12 · {sceneTitle.split('·')[0].trim()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>

              <button
                onClick={onNextScene}
                disabled={sceneNumber >= totalScenes}
                className="p-0.5 md:p-1 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-all cursor-pointer"
                title="Siguiente Escena"
              >
                <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>

              {/* Menú Desplegable de las 12 Escenas */}
              {isSceneDropdownOpen && (
                <div className="absolute top-11 left-0 w-64 md:w-72 bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 p-2 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto scrollbar-thin">
                  <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase px-2 py-1 border-b border-white/10">
                    Las 12 Escenas Cósmicas
                  </div>
                  {scenesList.map((sc, idx) => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        onSelectSceneIdx(idx);
                        setIsSceneDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer mt-1 ${
                        sceneNumber === sc.id
                          ? 'bg-cyan-600 text-white shadow'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{sc.id}. {sc.name}</span>
                      {sceneNumber === sc.id && <span className="text-[10px] text-cyan-200">Activo</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CENTRO: Reloj Astronómico UTC y Control de Tiempo (Desktop/iPad) */}
            <div className="pointer-events-auto hidden md:flex items-center gap-2 bg-slate-950/90 backdrop-blur-2xl border border-white/15 px-3 py-1.5 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{telemetry.simDateFormatted}</span>
              </div>

              <div className="h-4 w-px bg-white/20" />

              <button
                onClick={onTogglePause}
                className={`p-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  telemetry.isPaused ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
                title="Pausa / Reanudar Simulación"
              >
                {telemetry.isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3" />}
              </button>

              <div className="flex items-center gap-0.5 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
                {speeds.map((s) => (
                  <button
                    key={s}
                    onClick={() => onSetTimeScale(s)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      telemetry.timeScale === s && !telemetry.isPaused
                        ? 'bg-cyan-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s >= 1000 ? `${s / 1000}k` : `${s}x`}
                  </button>
                ))}
              </div>

              <button
                onClick={onToggleScale}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all border cursor-pointer ${
                  scaleMode === 'scientific'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                }`}
                title="Alternar Escala Científica 1:1 vs Didáctica"
              >
                {scaleMode === 'scientific' ? '🔬 1:1' : '🎓 Didáct.'}
              </button>
            </div>

            {/* DERECHA: Leyenda de Capas (Google Maps) + Controles Móviles + Toggle Sidebar */}
            <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-2xl border border-white/15 p-1 md:px-2 md:py-1 rounded-xl md:rounded-2xl shadow-2xl">
              
              {/* VELOCIDAD COMPACTA EN MÓVIL (<768px) */}
              <div className="relative md:hidden">
                <button
                  onClick={() => {
                    setIsSpeedMenuOpen(!isSpeedMenuOpen);
                    setIsLayersMenuOpen(false);
                    setIsSceneDropdownOpen(false);
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono font-bold text-cyan-300 flex items-center gap-1 cursor-pointer"
                  title="Velocidad y Pausa"
                >
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>{telemetry.isPaused ? 'Pausa' : `${telemetry.timeScale}x`}</span>
                </button>

                {isSpeedMenuOpen && (
                  <div className="absolute top-10 right-0 w-36 bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 p-2 rounded-2xl shadow-2xl z-50 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      onClick={() => {
                        onTogglePause();
                        setIsSpeedMenuOpen(false);
                      }}
                      className="w-full text-left px-2 py-1 rounded-lg text-xs font-mono font-bold text-amber-300 hover:bg-white/10"
                    >
                      {telemetry.isPaused ? '▶ Reanudar' : '⏸ Pausar'}
                    </button>
                    {speeds.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          onSetTimeScale(s);
                          setIsSpeedMenuOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                          telemetry.timeScale === s && !telemetry.isPaused
                            ? 'bg-cyan-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                    <div className="pt-1 border-t border-white/10">
                      <button
                        onClick={() => {
                          onToggleScale();
                          setIsSpeedMenuOpen(false);
                        }}
                        className="w-full text-left px-2 py-1 rounded-lg text-[11px] font-mono text-cyan-300 hover:bg-white/10"
                      >
                        {scaleMode === 'scientific' ? 'Cambiar a Didáctica' : 'Cambiar a 1:1'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* BOTÓN DE LEYENDA DE CAPAS ESTILO GOOGLE MAPS */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsLayersMenuOpen(!isLayersMenuOpen);
                    setIsSceneDropdownOpen(false);
                    setIsSpeedMenuOpen(false);
                  }}
                  className={`px-2 py-1 md:px-2.5 md:py-1 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isLayersMenuOpen
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-900/90 text-cyan-300 border-cyan-500/40 hover:bg-slate-800'
                  }`}
                  title="Leyenda de Capas de Visualización"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Capas</span>
                </button>

                {/* POPOVER DE CAPAS ESTILO GOOGLE MAPS */}
                {isLayersMenuOpen && (
                  <div className="absolute top-11 right-0 w-56 bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 p-2.5 rounded-2xl shadow-2xl z-50 space-y-1.5">
                    <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase pb-1 border-b border-white/10">
                      Capas de Visualización
                    </div>
                    
                    {[
                      { key: 'orbits', label: '⭕ Órbitas Elípticas' },
                      { key: 'pins', label: '📍 Balizas y Pines 3D' },
                      { key: 'atmosphere', label: '🌫️ Atmósfera Rayleigh' },
                      { key: 'stars', label: '✨ Estrellas Gaia' },
                      { key: 'grid', label: '🌐 Cuadrícula Ecuatorial' }
                    ].map((layer) => {
                      const isActive = layerVisibility[layer.key as keyof MapLayerConfig];
                      return (
                        <button
                          key={layer.key}
                          onClick={() => handleToggleLayer(layer.key as keyof MapLayerConfig)}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                            isActive ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/50' : 'text-slate-400 hover:bg-white/5'
                          }`}
                        >
                          <span>{layer.label}</span>
                          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${isActive ? 'bg-cyan-500 text-slate-950 font-bold' : 'border border-slate-700'}`}>
                            {isActive && '✓'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* BOTÓN TOGGLE SIDEBAR EN TOPBAR */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`px-2 py-1 md:px-2.5 md:py-1 rounded-lg md:rounded-xl text-[11px] md:text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                  isSidebarOpen
                    ? 'bg-cyan-600 text-white border-cyan-400 shadow'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
                title={isSidebarOpen ? "Plegar Panel Lateral de Datos" : "Abrir Panel Lateral de Datos"}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isSidebarOpen ? 'Panel' : 'Datos'}</span>
              </button>

              {/* BOTÓN MODO ZEN / PANTALLA COMPLETA */}
              <button
                onClick={() => setIsZenMode(true)}
                className="p-1 md:p-1.5 rounded-lg md:rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-1"
                title="Modo Pantalla Completa (Ocultar todos los menús para contemplación 3D)"
              >
                <Eye className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-[10px] hidden lg:inline font-mono">Zen</span>
              </button>
            </div>

          </header>
        )}

        {/* ========================================================
            BOTÓN FLOTANTE PARA RESTAURAR EN MODO ZEN (OCULTAR TODO)
            ======================================================== */}
        {isZenMode && (
          <div className="fixed top-3 right-3 md:top-4 md:right-4 z-50 pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsZenMode(false)}
              className="px-3.5 py-1.5 md:px-4 md:py-2 rounded-2xl bg-slate-950/95 hover:bg-slate-900 border border-cyan-400/60 text-cyan-300 hover:text-white text-xs font-mono font-bold backdrop-blur-2xl shadow-2xl flex items-center gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-cyan-950/80"
              title="Restaurar todos los menús y paneles"
            >
              <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Mostrar Menús</span>
            </button>
          </div>
        )}

        {/* ========================================================
            DOCK VERTICAL IZQUIERDO COMPACTO (MICRO-ICONOS CON TOOLTIP)
        ======================================================== */}
        {!isZenMode && (
          <div className="absolute left-2 md:left-3 top-14 md:top-20 z-30 pointer-events-auto flex flex-col gap-1 bg-slate-950/85 backdrop-blur-2xl border border-white/15 p-1 rounded-2xl shadow-2xl max-h-[calc(48vh-80px)] md:max-h-none overflow-y-auto scrollbar-none">
            {TARGETS_DOCK.map((t) => {
              const isSelected = telemetry.targetKey === t.key;
              return (
                <div key={t.key} className="relative group">
                  <button
                    onClick={() => onFocusTarget(t.key)}
                    aria-label={`Enfocar ${t.label}`}
                    className={`w-7 h-7 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-sm md:text-base transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/40 ring-1 ring-cyan-300 scale-105'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{t.icon}</span>
                  </button>

                  {/* Flyout Tooltip en Desktop/iPad */}
                  <div className="hidden md:block absolute left-11 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-slate-950/95 border border-cyan-500/30 text-white text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50">
                    {t.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================
            PESTAÑA DE BORDE FIJA DERECHA PARA RECUPERAR PANEL
            (Garantiza que NUNCA desaparece el acceso a datos)
            ======================================================== */}
        {!isSidebarOpen && !isZenMode && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-1/2 right-0 -translate-y-1/2 z-50 bg-slate-900/90 hover:bg-cyan-600 border-y border-l border-cyan-400/40 text-cyan-300 hover:text-white px-2.5 py-3 rounded-l-2xl shadow-2xl backdrop-blur-xl flex flex-col items-center gap-1.5 transition-all group cursor-pointer animate-in slide-in-from-right"
            title="Abrir Panel de Información"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-[10px] font-mono font-bold [writing-mode:vertical-lr] rotate-180 tracking-widest">DATOS</span>
          </button>
        )}

        {/* TELEMETRÍA INFERIOR FLOTANTE */}
        {!isZenMode && (
          <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 pointer-events-none z-20">
            <div className="pointer-events-auto bg-slate-950/80 backdrop-blur-xl border border-white/10 px-2.5 py-1.5 md:px-3 md:py-2 rounded-xl md:rounded-2xl shadow-2xl flex items-center gap-2 md:gap-3 text-[10px] md:text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white font-bold">{telemetry.targetName}</span>
              </div>
              <div className="h-3 w-px bg-white/20" />
              <div className="text-slate-400">
                Dist: <strong className="text-cyan-300">{telemetry.distanceKm.toLocaleString('es-ES', { maximumFractionDigits: 0 })} km</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          2. SIDEBAR DE DATOS DE ALTA DENSIDAD
          En Desktop/iPad: Barra Lateral de 380px
          En Móvil: Mitad Inferior (50% Pantalla) sin tapar el 3D
          ======================================================== */}
      {isSidebarOpen && !isZenMode && (
        <aside className="w-full md:w-96 lg:w-[400px] h-[52vh] md:h-full bg-slate-950/95 backdrop-blur-2xl border-t md:border-t-0 md:border-l border-white/10 flex flex-col z-40 shadow-2xl shrink-0 animate-in slide-in-from-bottom md:slide-in-from-right duration-300">
          
          {/* CABECERA DEL SIDEBAR */}
          <div className="p-3 md:p-4 border-b border-white/10 flex items-start justify-between shrink-0">
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-cyan-400 block">
                {entity.category} · SISTEMA SOLAR
              </span>
              <h2 className="text-base md:text-lg font-bold text-white leading-tight mt-0.5">
                {entity.name}
              </h2>
              <p className="text-[11px] md:text-xs text-slate-400 leading-snug mt-0.5">
                {entity.tagline}
              </p>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Ocultar Panel Lateral"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 4 PESTAÑAS PRINCIPALES DE INFORMACIÓN */}
          <div className="grid grid-cols-4 p-1 mx-2.5 mt-1.5 md:p-1.5 md:mx-3 md:mt-2 rounded-xl md:rounded-2xl bg-slate-900 border border-white/10 text-xs shrink-0 font-bold">
            <button
              id="tab-btn-landmarks"
              onClick={() => setActiveTab('landmarks')}
              className={`py-1 md:py-1.5 rounded-lg md:rounded-xl transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === 'landmarks' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-[10px]">Puntos</span>
            </button>

            <button
              id="tab-btn-encyclopedia"
              onClick={() => setActiveTab('encyclopedia')}
              className={`py-1 md:py-1.5 rounded-lg md:rounded-xl transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === 'encyclopedia' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[10px]">Estructura</span>
            </button>

            <button
              id="tab-btn-curiosities"
              onClick={() => setActiveTab('curiosities')}
              className={`py-1 md:py-1.5 rounded-lg md:rounded-xl transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === 'curiosities' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px]">Dato WOW</span>
            </button>

            <button
              id="tab-btn-challenges"
              onClick={() => setActiveTab('challenges')}
              className={`py-1 md:py-1.5 rounded-lg md:rounded-xl transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                activeTab === 'challenges' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[10px]">Reto XP</span>
            </button>
          </div>

          {/* CONTENIDO SCROLLEABLE DE ALTA DENSIDAD */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3.5 scrollbar-thin text-slate-200 text-xs">
            
            {/* ================= TAB 1: PUNTOS CLAVE & LANDMARKS ================= */}
            {activeTab === 'landmarks' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300 font-bold">
                  <span>Accidentes y Balizas en Superficie:</span>
                  <span>{entity.landmarks?.length || 0} Registrados</span>
                </div>

                <div className="space-y-2">
                  {entity.landmarks?.map((lm) => {
                    const isSelected = selectedLandmark?.name === lm.name;
                    return (
                      <div
                        key={lm.name}
                        onClick={() => handleLandmarkClick(lm)}
                        className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? 'bg-cyan-950/80 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.01]'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-300' : 'text-slate-400'}`} />
                            <h4 className="font-bold text-xs text-white">{lm.name}</h4>
                          </div>
                          <span className="text-[10px] font-mono text-cyan-400 bg-slate-950 px-2 py-0.5 rounded-md border border-white/10 font-bold">
                            {lm.coords.lat}° Lat, {lm.coords.lon}° Lon
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                          {lm.description}
                        </p>
                        <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-slate-400 font-mono">
                          <span>{lm.significance}</span>
                          <span className={`font-bold flex items-center gap-1 ${isSelected && telemetry.isTraveling ? 'text-amber-400 animate-pulse' : 'text-cyan-400'}`}>
                            {isSelected && telemetry.isTraveling ? '🛰️ En Vuelo...' : 'Volar 3D ▶'}
                          </span>
                        </div>
                      </div>
                    );
                  }) || (
                    <p className="text-slate-400 italic">Explora la superficie para interactuar con los elementos 3D.</p>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB 2: ENCICLOPEDIA, CAPAS Y FÍSICA ================= */}
            {activeTab === 'encyclopedia' && (
              <div className="space-y-3.5">
                {/* PARÁMETROS FÍSICOS Y ORBITALES */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Magnitudes Físicas</span>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">Diámetro:</span>
                      <span className="font-bold text-white">{entity.stats.diameter}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">Masa:</span>
                      <span className="font-bold text-white">{entity.stats.mass}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">Gravedad:</span>
                      <span className="font-bold text-emerald-400">{entity.stats.gravity}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">Velocidad Orbital:</span>
                      <span className="font-bold text-cyan-300">{entity.stats.orbitalSpeed}</span>
                    </div>
                  </div>
                </div>

                {/* ESTRUCTURA INTERNA EN CAPAS O SUBSISTEMAS */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400">{getStructureTitle()}</span>
                  <div className="space-y-1.5">
                    {entity.structure.layers.map((layer) => (
                      <div key={layer.name} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                          <span>{layer.name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{layer.composition}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{layer.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COMPOSICIÓN ATMOSFÉRICA / EXOSFERA */}
                {entity.structure.atmosphere && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                        {entity.key === 'moon' ? 'Exosfera Superficial' : 'Atmósfera'}
                      </span>
                      {entity.key === 'moon' && (
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded font-bold">
                          Vacío Práctico
                        </span>
                      )}
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                      <p className="text-[11px] text-slate-200 leading-relaxed font-sans">{entity.structure.atmosphere}</p>
                    </div>
                  </div>
                )}

                {/* CRONOLOGÍA DE MISIONES HISTÓRICAS NASA / ESA */}
                {entity.exploration?.historicMissions && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Misiones Históricas</span>
                    <div className="space-y-1.5">
                      {entity.exploration.historicMissions.map((m) => (
                        <div key={m.name} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                          <Rocket className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-white">{m.name}</h4>
                              <span className="text-[9px] font-mono text-cyan-400 font-bold bg-slate-950 px-1 rounded">
                                {m.year} · {m.agency}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">{m.highlight}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 3: CURIOSIDADES Y DATOS WOW ================= */}
            {activeTab === 'curiosities' && (
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl md:rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <Sparkles className="w-4 h-4" />
                    <span>Dato WOW 🤯 (Astrofísica Verificada)</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed font-sans">
                    Hechos científicos impactantes recopilados de las misiones espaciales oficiales.
                  </p>
                </div>

                <div className="space-y-1.5">
                  {entity.didYouKnow?.map((fact, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                      <span className="text-xs font-black text-cyan-400 font-mono">0{idx + 1}</span>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{fact}</p>
                    </div>
                  ))}
                </div>

                {/* NOTAS DE ACTUALIDAD ESPACIAL (SOLO CUERPOS RELEVANTES) */}
                {(entity.key === 'earth' || entity.key === 'moon') && (
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block">
                      🔥 Gran Eclipse Solar 2026 en España
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                      El 12 de agosto de 2026, la Luna cruzará entre el Sol y la Tierra proyectando una umbra que cruzará la Península Ibérica en totalidad absoluta.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB 4: RETOS ESPACIALES & XP ================= */}
            {activeTab === 'challenges' && activeMission && currentStep && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>{activeMission.title}</span>
                    </span>
                    <span>+{activeMission.quiz?.xpReward || activeMission.totalXp} XP</span>
                  </div>
                  <h3 className="font-bold text-xs text-white leading-snug">
                    {currentStep.instruction}
                  </h3>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed font-sans">
                    {currentStep.hint}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={onGuideToMission}
                      className="py-2 px-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-95"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Volar en 3D</span>
                    </button>

                    <button
                      onClick={onOpenQuizModal}
                      className={`py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-95 ${
                        isStepCompleted
                          ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:text-white'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5 text-amber-300" />
                      <span>{isStepCompleted ? '🎉 Validar Reto' : 'Completar'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </aside>
      )}

    </div>
  );
};
