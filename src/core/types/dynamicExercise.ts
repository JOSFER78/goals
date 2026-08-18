/**
 * src/core/types/dynamicExercise.ts
 * Contratos de datos para el Generador Agéntico de Ejercicios Dinámicos de GOALS
 */

import { AgeTranche } from './adaptiveCurriculum';
import { ExperienceId } from './index';

export type DynamicExerciseType = 
  | 'choice'        // Opción múltiple (3-4 opciones)
  | 'fill_gap'      // Rellenar huecos / tokens
  | 'boolean'       // Verdadero o Falso
  | 'numeric_calc'; // Cálculo matemático con fórmula LaTeX y tolerancia

export type ExerciseDifficulty = 'easy' | 'medium' | 'hard';

export interface BaseExerciseItem {
  id: string;
  type: DynamicExerciseType;
  prompt: string;
  difficulty: ExerciseDifficulty;
  xpReward: number;
  timeLimitSeconds?: number;
  hint: string;
  explanation: string;
  latexFormula?: string;
  contextTag?: string;
}

export interface ChoiceExerciseItem extends BaseExerciseItem {
  type: 'choice';
  options: string[];
  correctIndex: number;
}

export interface FillGapExerciseItem extends BaseExerciseItem {
  type: 'fill_gap';
  templateSentence: string;
  gapOptions: string[];
  correctGaps: string[];
}

export interface BooleanExerciseItem extends BaseExerciseItem {
  type: 'boolean';
  booleanAnswer: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

export interface NumericCalcExerciseItem extends BaseExerciseItem {
  type: 'numeric_calc';
  targetValue: number;
  tolerance: number;
  unit?: string;
  stepByStepSolution?: string[];
}

export type DynamicExerciseItem = 
  | ChoiceExerciseItem 
  | FillGapExerciseItem 
  | BooleanExerciseItem 
  | NumericCalcExerciseItem;

export interface DynamicExerciseBatch {
  id: string;
  title: string;
  topic: string;
  discipline: ExperienceId | 'general';
  ageTranche: AgeTranche;
  targetAge: number;
  difficulty: ExerciseDifficulty;
  totalXp: number;
  items: DynamicExerciseItem[];
  generatedAt: number;
  sourceContextSummary?: string;
}

export interface ExerciseSessionResult {
  batchId: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  starsEarned: 1 | 2 | 3;
  totalXpEarned: number;
  timeSpentSeconds: number;
  itemResults: {
    itemId: string;
    isCorrect: boolean;
    userAnswer: any;
    attempts: number;
    usedHint: boolean;
  }[];
}

export interface ExerciseGenerationOptions {
  topic?: string;
  discipline?: ExperienceId | 'general';
  customContextText?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  questionCount?: number;
  difficulty?: ExerciseDifficulty;
  allowedTypes?: DynamicExerciseType[];
}
