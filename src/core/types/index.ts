export type ExperienceId = 'school' | 'languages' | 'astro' | 'verify' | 'criterio' | 'ai-lab';
export type AppViewMode = ExperienceId | 'admin' | 'profile' | null;

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role?: 'admin' | 'user';
  isAnonymous?: boolean;
  providerId?: string;
  isApproved?: boolean;
  createdAt?: string;
}

export interface EvolutionEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  type: 'lesson_finished' | 'test_completed' | 'reto_claimed' | 'experience_activity' | 'streak_level';
  title: string;
  score?: string;
  stars?: number; // 0-3
  xpEarned: number;
  experienceId: ExperienceId;
  details?: string;
}

export interface LessonProgress {
  steps: number;
  testDone: boolean;
  stars: number; // 0 a 3
  read?: boolean;
  score?: number;
  completedAt?: string;
}

export interface ExperienceProgress {
  xp: number;
  lessons: Record<number | string, LessonProgress>;
}

export interface UserData {
  xp: number;
  streak: number;
  lastDay: string | null;
  lastActiveDate?: string;
  avatar?: string;
  bio?: string;
  role?: 'admin' | 'student' | 'teacher';
  isApproved?: boolean;
  claimedRetos?: Record<string, boolean>;
  weeklyActivity?: boolean[]; // [Lun, Mar, Mie, Jue, Vie, Sab, Dom]
  experiences?: {
    astro?: ExperienceProgress;
    school?: ExperienceProgress;
    languages?: ExperienceProgress;
    verify?: ExperienceProgress;
    criterio?: ExperienceProgress;
    'ai-lab'?: ExperienceProgress;
    aiLab?: ExperienceProgress;
  };
  lessons?: Record<number, LessonProgress>;
  evolutions: EvolutionEntry[];
  childProfile?: Record<string, any>;
  learnerProfile?: import('./adaptiveCurriculum').LearnerProfile;
  mascotConfig?: {
    skinId?: string;
    customName?: string;
    soulPrompt?: string;
    scale?: number;
    pitch?: number;
    rate?: number;
  };
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

export * from './adaptiveCurriculum';
