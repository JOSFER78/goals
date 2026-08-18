/**
 * src/core/types/mascotSpatial.ts
 * Definición de tipos para la Navegación Espacial Agéntica y Anclaje DOM
 */

import { ActionChip } from './mascotFSM';

export type SpatialAnchorPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'right-center'
  | 'bottom-right'
  | 'bottom-center'
  | 'bottom-left'
  | 'left-center';

export interface SpatialTargetNode {
  id: string;
  label: string;
  hint?: string;
  element: HTMLElement;
  rect: DOMRect;
  preferredAnchor: SpatialAnchorPosition;
  offset?: { x: number; y: number };
  highlightColor?: string;
  category?: 'practice' | 'theory' | 'tool' | 'navigation' | 'media';
}

export interface MascotFlightState {
  isFlying: boolean;
  progress: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  rotationDeg: number;
  flipX: boolean;
  flightDurationMs: number;
}

export interface SpatialAnchorState {
  isAnchored: boolean;
  targetId: string | null;
  targetNode: SpatialTargetNode | null;
  anchorPosition: SpatialAnchorPosition;
  anchorCoords: { x: number; y: number };
}

export interface AgenticTourStep {
  targetId: string;
  speechText: string;
  anchor?: SpatialAnchorPosition;
  highlightDurationMs?: number;
  actionChips?: ActionChip[];
  autoScroll?: boolean;
  onEnter?: () => void;
}

export interface AgenticActionPayload {
  action: 'NAVIGATE' | 'HIGHLIGHT' | 'RELEASE' | 'START_TOUR';
  targetId?: string;
  speech?: string;
  anchor?: SpatialAnchorPosition;
  tourSteps?: AgenticTourStep[];
  highlight?: boolean;
}
