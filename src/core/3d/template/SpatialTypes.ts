/**
 * GOALS Engine - SpatialTypes
 * Definición de Tipos Universales para Experiencias 3D Multidisciplinares
 * (Cosmos, Anatomía Humana, Motor de Coche, Electricidad & Física)
 */

export type SpatialDomain = 'cosmos' | 'anatomy' | 'engineering' | 'physics';

export interface SpatialVector3 {
  x: number;
  y: number;
  z: number;
}

export interface SpatialCoords {
  lat?: number;
  lon?: number;
  x?: number;
  y?: number;
  z?: number;
}

export interface UniversalSpatialLayer {
  id: string;
  name: string;
  category?: string;
  description: string;
  depthLevel: number;
  thickness?: string;
  composition?: string;
  opacity: number;
  color: string;
}

export interface UniversalSpatialLandmark {
  id: string;
  name: string;
  category: string;
  description: string;
  significance: string;
  coords: SpatialCoords;
  icon?: string;
}

export interface UniversalWowFact {
  id: string;
  title: string;
  fact: string;
  scientificContext?: string;
}

export interface UniversalSpatialChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  instruction: string;
  hint: string;
  question?: {
    prompt: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  };
}

export interface UniversalMapLayerFilter {
  id: string;
  label: string;
  icon: string;
  enabledDefault: boolean;
  type: 'orbits' | 'labels' | 'pins' | 'flow' | 'field' | 'atmosphere' | 'grid';
}

export interface UniversalSpatialEntity {
  id: string;
  name: string;
  subname?: string;
  category: string;
  domain: SpatialDomain;
  icon: string;
  description: string;
  tagline: string;
  stats: Record<string, string>;
  summary: string;
  layers: UniversalSpatialLayer[];
  landmarks: UniversalSpatialLandmark[];
  wowFacts: UniversalWowFact[];
  challenges: UniversalSpatialChallenge[];
  mapLayerFilters: UniversalMapLayerFilter[];
}

export interface UniversalExperiencePackage {
  experienceId: string;
  domain: SpatialDomain;
  title: string;
  subtitle: string;
  domainBadge: string;
  entities: UniversalSpatialEntity[];
}
