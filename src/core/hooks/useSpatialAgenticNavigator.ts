/**
 * src/core/hooks/useSpatialAgenticNavigator.ts
 * Hook Maestro de Navegación Espacial, Teletransporte Cinematográfico y Anclaje DOM
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  SpatialTargetNode,
  SpatialAnchorPosition,
  MascotFlightState,
  SpatialAnchorState,
  AgenticTourStep
} from '../types/mascotSpatial';
import { MascotSpatialRegistry } from '../services/mascotSpatialRegistry';
import { MascotFlightPhysics, Particle } from '../services/mascotFlightPhysics';
import { AgenticActionDispatcher } from '../services/agenticActionDispatcher';
import { MascotBubbleMessage } from '../types/mascotFSM';

export interface UseSpatialNavigatorProps {
  mascotScale?: number;
  glowColor?: string;
  onShowBubble?: (message: MascotBubbleMessage) => void;
  onDismissBubble?: () => void;
  speakTTS?: (text: string) => void;
}

export interface UseSpatialNavigatorReturn {
  mascotPos: { x: number; y: number };
  flightState: MascotFlightState;
  anchorState: SpatialAnchorState;
  particles: Particle[];
  navigateToTarget: (targetId: string, customSpeech?: string, options?: { autoScroll?: boolean; highlight?: boolean }) => boolean;
  returnToDock: () => void;
  runTour: (steps?: AgenticTourStep[]) => void;
  parseAndExecuteIntent: (query: string) => boolean;
  availableTargets: SpatialTargetNode[];
  refreshTargets: () => void;
  highlightNode: (targetId: string, durationMs?: number) => void;
}

export const useSpatialAgenticNavigator = ({
  mascotScale = 1.2,
  glowColor = '#38bdf8',
  onShowBubble,
  onDismissBubble,
  speakTTS
}: UseSpatialNavigatorProps = {}): UseSpatialNavigatorReturn => {
  const mascotW = 64 * mascotScale;
  const mascotH = 64 * mascotScale;

  const getDockPosition = useCallback(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    return { x: vw - mascotW - 24, y: vh - mascotH - 24 };
  }, [mascotW, mascotH]);

  const [mascotPos, setMascotPos] = useState<{ x: number; y: number }>(getDockPosition);
  const [availableTargets, setAvailableTargets] = useState<SpatialTargetNode[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);

  const [flightState, setFlightState] = useState<MascotFlightState>({
    isFlying: false,
    progress: 0,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
    rotationDeg: 0,
    flipX: false,
    flightDurationMs: 850
  });

  const [anchorState, setAnchorState] = useState<SpatialAnchorState>({
    isAnchored: false,
    targetId: null,
    targetNode: null,
    anchorPosition: 'top-right',
    anchorCoords: getDockPosition()
  });

  const tourStepsRef = useRef<AgenticTourStep[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const flightStartTimeRef = useRef<number>(0);
  const flightStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const flightTargetPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const speechAfterLandingRef = useRef<string | null>(null);

  const refreshTargets = useCallback(() => {
    const targets = MascotSpatialRegistry.scanTargets();
    setAvailableTargets(targets);
  }, []);

  useEffect(() => {
    refreshTargets();
    window.addEventListener('resize', refreshTargets);
    window.addEventListener('scroll', refreshTargets, { passive: true });

    return () => {
      window.removeEventListener('resize', refreshTargets);
      window.removeEventListener('scroll', refreshTargets);
    };
  }, [refreshTargets]);

  const highlightNode = useCallback((targetId: string, durationMs: number = 3000) => {
    const target = MascotSpatialRegistry.getTarget(targetId);
    if (!target || !target.element) return;

    target.element.classList.add('goals-mascot-target-active');
    target.element.style.outline = '2px solid rgba(56, 189, 248, 0.6)';
    target.element.style.outlineOffset = '4px';
    target.element.style.transition = 'all 0.3s ease';

    setTimeout(() => {
      if (target.element) {
        target.element.classList.remove('goals-mascot-target-active');
        target.element.style.outline = '';
        target.element.style.outlineOffset = '';
      }
    }, durationMs);
  }, []);

  const startFlight = useCallback((
    targetCoords: { x: number; y: number },
    targetNode: SpatialTargetNode | null,
    speechText?: string
  ) => {
    const startPos = { ...mascotPos };
    flightStartPosRef.current = startPos;
    flightTargetPosRef.current = targetCoords;
    flightStartTimeRef.current = performance.now();
    speechAfterLandingRef.current = speechText || null;

    const dx = targetCoords.x - startPos.x;
    const dy = targetCoords.y - startPos.y;
    const dist = Math.hypot(dx, dy);

    const duration = Math.min(1300, Math.max(650, dist * 1.1));

    setFlightState({
      isFlying: true,
      progress: 0,
      startX: startPos.x,
      startY: startPos.y,
      currentX: startPos.x,
      currentY: startPos.y,
      targetX: targetCoords.x,
      targetY: targetCoords.y,
      rotationDeg: 0,
      flipX: dx < 0,
      flightDurationMs: duration
    });

    onDismissBubble?.();

    const loop = (now: number) => {
      const elapsed = now - flightStartTimeRef.current;
      const rawT = Math.min(1, elapsed / duration);
      const easedT = MascotFlightPhysics.easeInOutCubic(rawT);

      const bezier = MascotFlightPhysics.evaluateBezier(
        flightStartPosRef.current,
        flightTargetPosRef.current,
        easedT
      );

      const bankAngle = Math.max(-25, Math.min(25, bezier.dx * 0.045));
      const isFlipping = dx < 0;

      setMascotPos({ x: bezier.x, y: bezier.y });

      setParticles((prev) => [
        ...MascotFlightPhysics.updateParticles(prev),
        ...MascotFlightPhysics.createStardustCluster(
          bezier.x + mascotW / 2,
          bezier.y + mascotH * 0.8,
          glowColor,
          rawT < 0.9 ? 3 : 1
        )
      ]);

      setFlightState((prev) => ({
        ...prev,
        progress: rawT,
        currentX: bezier.x,
        currentY: bezier.y,
        rotationDeg: bankAngle,
        flipX: isFlipping
      }));

      if (rawT < 1) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        setFlightState((prev) => ({ ...prev, isFlying: false, rotationDeg: 0 }));
        setMascotPos(targetCoords);

        if (targetNode) {
          setAnchorState({
            isAnchored: true,
            targetId: targetNode.id,
            targetNode,
            anchorPosition: targetNode.preferredAnchor,
            anchorCoords: targetCoords
          });

          const speech = speechAfterLandingRef.current || `¡Aquí tienes ${targetNode.label}!`;
          const bubbleMsg: MascotBubbleMessage = {
            id: 'guide_' + Date.now(),
            text: speech,
            type: 'didactic_tip',
            durationMs: 7000,
            createdAt: Date.now(),
            chips: [
              { id: '1', label: '🚀 Empezar', prompt: `Vamos a empezar con ${targetNode.label}` },
              { id: '2', label: '⚓ Volver al dock', prompt: 'Vuelve a tu sitio' }
            ]
          };

          onShowBubble?.(bubbleMsg);
          speakTTS?.(speech);
        } else {
          setAnchorState({
            isAnchored: false,
            targetId: null,
            targetNode: null,
            anchorPosition: 'top-right',
            anchorCoords: targetCoords
          });
        }
      }
    };

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(loop);
  }, [mascotPos, mascotW, mascotH, glowColor, onDismissBubble, onShowBubble, speakTTS]);

  const navigateToTarget = useCallback((
    targetId: string,
    customSpeech?: string,
    options: { autoScroll?: boolean; highlight?: boolean } = { autoScroll: true, highlight: true }
  ): boolean => {
    const target = MascotSpatialRegistry.getTarget(targetId);
    if (!target || !target.element) return false;

    if (options.autoScroll) {
      target.element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }

    if (options.highlight) {
      highlightNode(targetId, 4000);
    }

    setTimeout(() => {
      const updatedRect = target.element.getBoundingClientRect();
      const { x, y } = MascotSpatialRegistry.calculateAnchorCoords(
        updatedRect,
        target.preferredAnchor,
        mascotW,
        mascotH
      );
      startFlight({ x, y }, target, customSpeech);
    }, 150);

    return true;
  }, [highlightNode, mascotW, mascotH, startFlight]);

  const returnToDock = useCallback(() => {
    const dock = getDockPosition();
    startFlight(dock, null, '¡De vuelta a mi puesto de mando!');
  }, [getDockPosition, startFlight]);

  const runTour = useCallback((steps?: AgenticTourStep[]) => {
    const activeSteps = steps && steps.length > 0
      ? steps
      : AgenticActionDispatcher.getTourForExperience(null);

    if (activeSteps.length === 0) return;

    tourStepsRef.current = activeSteps;

    const executeStep = (idx: number) => {
      if (idx >= tourStepsRef.current.length) {
        returnToDock();
        return;
      }
      const step = tourStepsRef.current[idx];
      navigateToTarget(step.targetId, step.speechText, {
        autoScroll: step.autoScroll ?? true,
        highlight: true
      });
      step.onEnter?.();
    };

    executeStep(0);
  }, [navigateToTarget, returnToDock]);

  const parseAndExecuteIntent = useCallback((query: string): boolean => {
    const payload = AgenticActionDispatcher.parseIntent(query);
    if (payload && payload.targetId) {
      return navigateToTarget(payload.targetId, payload.speech, {
        autoScroll: true,
        highlight: payload.highlight ?? true
      });
    }
    return false;
  }, [navigateToTarget]);

  useEffect(() => {
    if (!anchorState.isAnchored || !anchorState.targetNode || flightState.isFlying) return;

    const targetEl = anchorState.targetNode.element;
    const updateAnchorPos = () => {
      if (!targetEl) return;
      const rect = targetEl.getBoundingClientRect();
      const { x, y } = MascotSpatialRegistry.calculateAnchorCoords(
        rect,
        anchorState.anchorPosition,
        mascotW,
        mascotH
      );
      setMascotPos({ x, y });
    };

    window.addEventListener('scroll', updateAnchorPos, { passive: true });
    window.addEventListener('resize', updateAnchorPos);

    const ro = new ResizeObserver(updateAnchorPos);
    ro.observe(targetEl);

    return () => {
      window.removeEventListener('scroll', updateAnchorPos);
      window.removeEventListener('resize', updateAnchorPos);
      ro.disconnect();
    };
  }, [anchorState, flightState.isFlying, mascotW, mascotH]);

  return {
    mascotPos,
    flightState,
    anchorState,
    particles,
    navigateToTarget,
    returnToDock,
    runTour,
    parseAndExecuteIntent,
    availableTargets,
    refreshTargets,
    highlightNode
  };
};
