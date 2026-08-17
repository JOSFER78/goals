/**
 * src/core/types/adaptiveCurriculum.ts
 * Contratos y Esquemas del Motor Educativo Adaptativo 6–15 de GOALS
 * Arquitectura modular y unificada para todas las disciplinas (Cosmos, Languages, School, Tech, AI, Verify).
 */

import { CurriculumStep, CurriculumTest } from './curriculum';
import { SourceReference } from './knowledge';

export type AgeTranche = '6-7' | '8-9' | '10-11' | '12-13' | '14-15';

export type MasteryLevel = 'needs_reinforcement' | 'in_progress' | 'mastered' | 'advanced';

export type EducationalStage = 
  | 'primaria_1_ciclo' // 1º y 2º Primaria (6-7 años)
  | 'primaria_2_ciclo' // 3º y 4º Primaria (8-9 años)
  | 'primaria_3_ciclo' // 5º y 6º Primaria (10-11 años)
  | 'eso_1_ciclo'      // 1º y 2º ESO (12-13 años)
  | 'eso_2_ciclo';     // 3º y 4º ESO (14-15 años)

// ==========================================
// 1. PERFIL EDUCATIVO GLOBAL (LearnerProfile)
// ==========================================
export interface LearnerProfile {
  userId: string;

  identity: {
    name: string;
    avatar?: string;
  };

  education: {
    age: number; // 6 a 15
    grade: string; // ej. '3º de Primaria', '2º de ESO'
    educationalStage: EducationalStage;
    ageTranche: AgeTranche;
  };

  preferences: {
    interests: string[];
    favoriteSubjects: string[];
    learningStyle?: 'visual' | 'auditivo' | 'practico' | 'general';
  };

  goals?: string[];

  createdAt: number;
  updatedAt: number;

  onboarding: {
    globalCompleted: boolean;
    completedAt?: number;
  };
}

// ==========================================
// 2. UNIDAD CURRICULAR MAESTRA (CurriculumUnit)
// ==========================================
export interface CurriculumCompetency {
  code: string;       // ej: 'LOMLOE.CN.1.2'
  title: string;      // 'Observación de movimientos celestes básicos'
  description: string;
  stage: EducationalStage;
}

export interface CurriculumUnit {
  id: string;               // ej: 'astro_u01_earth_atmosphere_6_7' o 'astro_u01_earth_atmosphere'
  canonicalNumber: number;  // 1, 2, 3, ... 200
  disciplineId: string;     // 'astro', 'languages', 'school', 'verify', 'ai-lab'
  ageTranche: AgeTranche;   // '6-7', '8-9', '10-11', '12-13', '14-15'
  targetAge: number;        // ej: 8
  title: string;
  subtitle: string;
  tag: string;
  icon: string;
  heroImage: string | null;
  xpReward: number;
  estimatedMinutes: number;
  
  // Enlaces Curriculares y de Conocimiento (SSOT)
  knowledgeSlugs: string[];        // ej: ['astronomy.solar_system.mars.atmosphere']
  competencies: CurriculumCompetency[];
  prerequisites: string[];         // IDs de CurriculumUnits conceptualmente previas
  coreConcepts: string[];          // ej: ['rotacion', 'gravedad_centripeta', 'terminador_solar']
  
  // Contenido de la Experiencia
  steps: CurriculumStep[];
  linkedTestId: string;
  test?: CurriculumTest;
  
  // Metadatos de Publicación
  version: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: number;
  updatedAt: number;
}

// ==========================================
// 3. EXPEDIENTE / ESTADO POR MINIAPP (MiniAppLearningState / StudentLearningState)
// ==========================================
export interface ConceptMasteryRecord {
  conceptKey: string;
  scorePercent: number;    // 0 a 100
  totalAttempts: number;
  lastPracticedAt: number;
  status: MasteryLevel;
}

export interface SessionHistoryItem {
  unitId: string;
  completedAt: number;
  scorePercent: number;
  xpEarned: number;
  attempts: number;
  durationSeconds?: number;
}

export interface MiniAppLearningState {
  userId: string;
  experienceId?: string;

  firstVisit?: boolean;
  onboardingCompleted?: boolean;

  diagnosticStatus: 'not_started' | 'pending' | 'in_progress' | 'completed' | 'skipped';
  diagnosticScore?: number;
  diagnosticDate?: number;
  estimatedAgeLevel?: number;

  recommendedStartUnitId?: string;
  currentUnitId: string;
  completedUnitIds: string[];

  conceptMastery: Record<string, ConceptMasteryRecord>;
  weakConcepts: string[];
  strengths: string[];

  sessionHistory: SessionHistoryItem[];

  lastVisitedAt?: number;
  updatedAt: number;
}

// StudentLearningState es equivalente a MiniAppLearningState para disciplinas
export interface StudentLearningState extends MiniAppLearningState {
  disciplineId: string; // alias compatible para experienceId
  age: number;
  grade: string;
  ageTranche?: AgeTranche;
  lastActiveAt?: number;
}

// ==========================================
// 4. DIAGNÓSTICO ADAPTATIVO (Diagnostic)
// ==========================================
export interface DiagnosticItem {
  id: string;
  disciplineId: string;
  conceptKey: string;
  ageTranche: AgeTranche;
  difficulty: 'easy' | 'medium' | 'hard';
  prompt: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  targetUnitId: string;       // Si falla, sugiere empezar aquí
}

export interface DiagnosticSession {
  sessionId: string;
  userId: string;
  disciplineId: string;
  declaredAge: number;
  declaredGrade: string;
  currentStep: number;
  totalSteps: number;         // típicamente 4-6 micro-preguntas
  items: DiagnosticItem[];
  answers: Array<{ itemId: string; selectedOption: number; isCorrect: boolean; conceptKey: string }>;
  isCompleted: boolean;
}

export interface DiagnosticResult {
  userId: string;
  disciplineId: string;
  estimatedAgeLevel: number;
  recommendedStartUnitId: string;
  detectedStrengths: string[];
  detectedWeakConcepts: string[];
  initialMasteryPercent: number;
}

// ==========================================
// 5. CAMINO DEL ALUMNO (LearningPath)
// ==========================================
export interface LearningPathItem {
  unitId: string;
  canonicalNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  xpReward: number;
  ageTranche: AgeTranche;
  status: 'completed' | 'current' | 'upcoming' | 'locked' | 'reinforcement' | 'challenge';
  masteryPercent?: number;
  prerequisitesMet: boolean;
}

export interface LearningPath {
  userId: string;
  disciplineId: string;
  totalUnitsInCurriculum: number;
  completedUnitsCount: number;
  progressPercent: number;
  
  currentUnit: LearningPathItem;
  upcomingUnits: LearningPathItem[];      // Siguientes unidades visibles en la secuencia del tramo
  completedUnits: LearningPathItem[];     // Unidades aprobadas
  reinforcementUnit?: LearningPathItem;   // Micro-unidad de refuerzo si hay laguna
  optionalChallenge?: LearningPathItem;   // Desafío opcional avanzado
  
  activeStreak: number;
  totalStars: number;
}

// ==========================================
// 6. PERFIL DE PRESENTACIÓN ADAPTATIVA (PresentationProfile)
// ==========================================
export type TextDepth = 'concise' | 'standard' | 'in_depth';
export type VisualDensity = 'spacious' | 'balanced' | 'dense';
export type InteractionMode = 'playful_guided' | 'tactile_interactive' | 'analytical_formal';
export type QuizFormat = 'binary_emoji' | 'multiple_choice_3' | 'standard_4' | 'analytical_calc';

export interface PresentationProfile {
  ageTranche: AgeTranche;
  lomloeReference: string;
  analogyDomain: string;
  scaffoldingLevel: 'high_guided' | 'moderate_scaffolding' | 'autonomous_socratic' | 'rigorous_formal';
  tone: string;
  maxResponseSentences: number;
  textDepth: TextDepth;
  visualDensity: VisualDensity;
  interactionMode: InteractionMode;
  quizFormat: QuizFormat;
  showSourcesDirectly: boolean;
  show3DParameters: boolean;
  allowCameraFreeFlight: boolean;
  aiPersona: 'cosmic_pet' | 'friendly_tutor' | 'socratic_mentor' | 'science_colleague';
  aiPromptInstructions: string;
}

// ==========================================
// 7. MOTOR DE BÚSQUEDA / RAG GENÉRICO (Contrato)
// ==========================================
export interface KnowledgeSearchEngine {
  search(query: { text: string; domain?: string; maxResults?: number; minSimilarity?: number }): Promise<Array<{
    chunkId: string;
    knowledgeId: string;
    content: string;
    similarityScore: number;
    sources: SourceReference[];
  }>>;
}
