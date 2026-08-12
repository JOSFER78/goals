export type ExperienceId = 'school' | 'languages' | 'astro' | 'verify';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
  isApproved?: boolean;
  createdAt: string;
}

export interface EvolutionEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  type: 'lesson_finished' | 'test_completed' | 'reto_claimed';
  title: string;
  score?: string;
  stars?: number;
  xpEarned: number;
  experienceId: ExperienceId;
}

export interface LessonProgress {
  steps: number;
  testDone: boolean;
  stars: number; // 0 a 3
  read?: boolean;
  score?: number;
}

export interface UserData {
  xp: number;
  streak: number;
  lastDay: string | null;
  lastActiveDate?: string;
  avatar?: string;
  bio?: string;
  isApproved?: boolean;
  claimedRetos?: Record<string, boolean>;
  weeklyActivity?: boolean[]; // [Lun, Mar, Mie, Jue, Vie, Sab, Dom]
  experiences?: {
    astro?: {
      xp: number;
      lessons: Record<number, LessonProgress>;
    };
    school?: {
      xp: number;
      lessons: Record<number, LessonProgress>;
    };
    languages?: {
      xp: number;
      lessons: Record<number, LessonProgress>;
    };
    verify?: {
      xp: number;
      lessons: Record<number, LessonProgress>;
    };
  };
  lessons?: Record<number, LessonProgress>;
  evolutions: EvolutionEntry[];
}

export interface RetoItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  xp: number;
  cond: boolean;
  claimed: boolean;
}

export interface RankInfo {
  title: string;
  level: number;
  color: string;
  nextXp: number;
}

export interface StepDef {
  id: number;
  type: 'concept' | 'model3d' | 'comparison' | 'media';
  title: string;
  subtitle?: string;
  content: string;
  badge?: string;
  objectId?: string;
  wowFact?: string;
  bullets?: string[];
  specs?: Record<string, string>;
  quiz?: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
}

export interface QuestionDef {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  type?: 'choice' | 'order';
  orderItems?: { id: string; label: string }[];
  correctOrder?: string[];
}

export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  stepsCount: number;
  xpReward: number;
  unlocked: boolean;
  objectId: string;
  steps: StepDef[];
  questions: QuestionDef[];
}

export interface SpaceObjectInfo {
  id: string;
  name: string;
  scale: string;
  category: string;
  distance: string;
  diameter: string;
  description: string;
  features: string[];
  modelType: string;
  color: string;
}
