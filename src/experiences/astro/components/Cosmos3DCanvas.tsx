/**
 * GOALS 3D Cosmos - Cosmos3DCanvas
 * Componente React Nativo para Exploración Espacial con Floating Origin,
 * Renderizado Fotorrealista (Gaia Stars, Sol Radiante, Rayleigh-Mie, Pines 3D)
 * y Dashboard Espacial para iPad / Desktop First con 100% de la Información.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CosmosScaleEngine, TelemetryData } from '../../../core/3d/engine/CosmosScaleEngine';
import { AstroMath, ScaleMode } from '../../../core/3d/math/AstroCoordinates';
import { CELESTIAL_DATABASE, Landmark } from '../../../core/3d/data/CelestialBodiesDatabase';
import { SPACE_MISSIONS, SpaceMission } from '../../../core/3d/missions/MissionsDatabase';
import { MissionQuizModal } from './MissionQuizModal';
import { CosmosQuickShortcutsModal } from './CosmosQuickShortcutsModal';
import { COSMOS_SCENES, CosmosSceneModule } from '../scenes';
import { CosmosSpatialDashboard } from './dashboard/CosmosSpatialDashboard';

interface Cosmos3DCanvasProps {
  onBackToGoals?: () => void;
  onOpenProfile?: () => void;
  showControls?: boolean;
}

export const Cosmos3DCanvas: React.FC<Cosmos3DCanvasProps> = ({ 
  onBackToGoals, 
  onOpenProfile,
  showControls = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainWrapperRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<CosmosScaleEngine | null>(null);

  // ESCENAS MODULARES 1..12
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const activeScene: CosmosSceneModule = COSMOS_SCENES[currentSceneIdx] || COSMOS_SCENES[0];

  const [telemetry, setTelemetry] = useState<TelemetryData>({
    targetKey: 'earth',
    targetName: 'Planeta Tierra',
    distanceKm: 14500,
    altitudeKm: 0,
    velocityKms: 29.78,
    orbitalPeriodMin: 525600,
    scaleMode: 'didactic',
    isTraveling: false,
    simDateFormatted: 'Cargando reloj astronómico...',
    timeScale: 1.0,
    isPaused: false
  });

  const [scaleMode, setScaleMode] = useState<ScaleMode>('didactic');
  const [selectedEntityKey, setSelectedEntityKey] = useState<string>('earth');

  // MISIONES Y RETOS ESPACIALES
  const [currentMissionIdx, setCurrentMissionIdx] = useState<number>(0);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isStepCompleted, setIsStepCompleted] = useState<boolean>(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState<boolean>(false);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  const activeMission: SpaceMission = SPACE_MISSIONS[currentMissionIdx] || SPACE_MISSIONS[0];

  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new CosmosScaleEngine(
      containerRef.current,
      (data) => {
        setTelemetry(data);
      },
      (selectedKey) => {
        setSelectedEntityKey(selectedKey);
      }
    );
    engineRef.current = engine;

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  // SINCRONIZAR ESCENAS MODULARES 1..12
  useEffect(() => {
    if (!engineRef.current) return;

    const activeSceneModule = COSMOS_SCENES[currentSceneIdx] || COSMOS_SCENES[0];
    engineRef.current.loadSceneModule(activeSceneModule);

    const sceneTargetMap: Record<number, string> = {
      0: 'earth',
      1: 'eclipses_2026',
      2: 'day_night_rotation',
      3: 'kepler_orbit',
      4: 'seasons_obliquity',
      5: 'system',
      6: 'oort',
      7: 'nearbystars',
      8: 'milkyway',
      9: 'localgroup',
      10: 'laniakea',
      11: 'universe'
    };

    const targetKey = sceneTargetMap[currentSceneIdx] || 'earth';
    setSelectedEntityKey(targetKey);
    engineRef.current.focusTarget(targetKey);
  }, [currentSceneIdx]);

  // VALIDADOR DE OBJETIVOS DE MISIÓN EN TIEMPO REAL
  useEffect(() => {
    const step = activeMission?.steps?.[currentStepIdx];
    if (!step) return;

    const matchesTarget = telemetry.targetKey === step.targetKey;
    const matchesScale = !step.requiredScaleMode || telemetry.scaleMode === step.requiredScaleMode;
    const matchesDistance = !step.requiredMaxDistanceKm || telemetry.distanceKm <= step.requiredMaxDistanceKm;

    if (matchesTarget && matchesScale && matchesDistance) {
      setIsStepCompleted(true);
    }
  }, [telemetry.targetKey, telemetry.scaleMode, telemetry.distanceKm, activeMission, currentStepIdx]);

  const handleFocus = useCallback((key: string) => {
    setSelectedEntityKey(key);
    engineRef.current?.focusTarget(key);
  }, []);

  const handleToggleScale = useCallback((newMode: ScaleMode) => {
    setScaleMode(newMode);
    engineRef.current?.setScaleMode(newMode);
  }, []);

  const handleTogglePause = useCallback(() => {
    engineRef.current?.togglePause();
  }, []);

  const handleSetTimeScale = useCallback((scale: number) => {
    engineRef.current?.setTimeScale(scale);
  }, []);

  const handleGuideToMission = () => {
    const step = activeMission?.steps?.[currentStepIdx];
    if (step) {
      handleFocus(step.targetKey);
      if (step.requiredScaleMode && step.requiredScaleMode !== scaleMode) {
        handleToggleScale(step.requiredScaleMode);
      }
    }
  };

  const handleQuizSuccess = (missionId: string) => {
    setCompletedMissionIds((prev) => [...prev, missionId]);
    setIsQuizModalOpen(false);
    setIsStepCompleted(false);

    // Avanzar al siguiente paso de la misión o siguiente misión
    if (currentStepIdx + 1 < (activeMission?.steps?.length || 0)) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      // Siguiente misión
      setCurrentStepIdx(0);
      setCurrentMissionIdx(prev => Math.min(SPACE_MISSIONS.length - 1, prev + 1));
    }
  };

  const selectedEntityInfo = CELESTIAL_DATABASE[selectedEntityKey] || CELESTIAL_DATABASE['earth'];

  const scenesList = COSMOS_SCENES.map((s, idx) => ({ id: idx + 1, name: s.name }));

  return (
    <div ref={mainWrapperRef} className="relative w-full h-full">
      <CosmosSpatialDashboard
        sceneNumber={currentSceneIdx + 1}
        totalScenes={COSMOS_SCENES.length}
        sceneTitle={activeScene.name}
        onPrevScene={() => setCurrentSceneIdx((prev) => Math.max(0, prev - 1))}
        onNextScene={() => setCurrentSceneIdx((prev) => Math.min(COSMOS_SCENES.length - 1, prev + 1))}
        onSelectSceneIdx={(idx) => setCurrentSceneIdx(idx)}
        scenesList={scenesList}
        entity={selectedEntityInfo}
        telemetry={telemetry}
        onSelectLandmark={(lm: Landmark) => {
          engineRef.current?.flyToLandmark(lm);
        }}
        onFocusTarget={handleFocus}
        onToggleLayerVisibility={(layerKey, visible) => {
          engineRef.current?.setLayerVisibility(layerKey, visible);
        }}
        activeMission={activeMission}
        currentStepIndex={currentStepIdx}
        isStepCompleted={isStepCompleted}
        onGuideToMission={handleGuideToMission}
        onOpenQuizModal={() => setIsQuizModalOpen(true)}
        onTogglePause={handleTogglePause}
        onSetTimeScale={handleSetTimeScale}
        onToggleScale={() => handleToggleScale(scaleMode === 'didactic' ? 'scientific' : 'didactic')}
        scaleMode={scaleMode}
      >
        {/* CANVAS 3D WEBGL2 NATIVO */}
        <div ref={containerRef} className="w-full h-full cursor-default" />
      </CosmosSpatialDashboard>

      {/* MODAL DE QUIZ DE DESAFÍO */}
      {isQuizModalOpen && (
        <MissionQuizModal
          mission={activeMission}
          onClose={() => setIsQuizModalOpen(false)}
          onSuccess={handleQuizSuccess}
        />
      )}

      {/* MODAL DE ATAJOS Y AYUDA */}
      <CosmosQuickShortcutsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};

export default Cosmos3DCanvas;
