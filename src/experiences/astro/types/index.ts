export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  providerId: string;
}

export interface LessonProgress {
  steps: number;
  testDone: boolean;
  stars: number;
}

export interface EvolutionEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  type: 'test_completed' | 'lesson_finished' | 'streak_level';
  title: string;
  score?: string;
  stars?: number;
  xpEarned: number;
}

export interface UserData {
  xp: number;
  streak: number;
  lastDay: string | null;
  lessons: Record<number, LessonProgress>;
  evolutions: EvolutionEntry[];
}

export interface LessonStep {
  icon: string;
  t: string;
  text: string;
  wow: string;
  now?: string;
  scene: string;
}

export interface ChoiceQuestion {
  type: 'choice';
  question: string;
  options: string[];
  answer: number;
}

export interface OrderQuestion {
  type: 'order';
  question: string;
  items: string[];
  correctOrder: string[];
}

export type Question = ChoiceQuestion | OrderQuestion;

export interface Lesson {
  id: number;
  title: string;
  icon: string;
  hero: string | null;
  tag: string;
  steps: LessonStep[];
  test: Question[];
}

export interface SpaceObjectInfo {
  icon: string;
  name: string;
  tagline: string;
  desc: string;
  stats: [string, string][];
  facts: string[];
}

export interface LevelConfig {
  name: string;
  badge: string;
  desc: string;
  fact: string;
  stats: [string, string][];
  buildKey: string;
}

export type CelestialPhenomenonKey = 'eclipses' | 'daynight' | 'orbit' | 'seasons';

export interface CelestialPhenomenonInfo {
  id: CelestialPhenomenonKey;
  icon: string;
  title: string;
  subtitle: string;
  badge: string;
  desc: string;
  stats: [string, string][];
  facts: string[];
  experiment: string;
  challenge: {
    title: string;
    desc: string;
    xp: number;
  };
}