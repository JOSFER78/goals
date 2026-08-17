export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type LanguageCode = 'en' | 'fr' | 'de' | 'ja' | 'it' | 'pt';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  cefrDefault: CEFRLevel;
  accent: string;
  speechVoiceLang: string;
  samplePrompt: string;
}

export interface StudentLanguageProfile {
  id: string;
  name: string;
  age: number;
  nativeLanguage: string;
  targetLanguage: string;
  overallLevel: CEFRLevel;
  interests: string[];
  learningStyle: 'visual' | 'auditivo' | 'practico' | 'conversacional';
  correctionPreference: 'inmediata' | 'contextual' | 'diferida';
  dailyGoalMinutes: number;
}

export interface SkillMastery {
  speaking: number;       // 0 - 100
  listening: number;      // 0 - 100
  reading: number;        // 0 - 100
  writing: number;        // 0 - 100
  grammar: number;        // 0 - 100
  vocabulary: number;     // 0 - 100
  pronunciation: number;  // 0 - 100
  fluency: number;        // 0 - 100
}

export interface VocabularyItem {
  id: string;
  term: string;
  translation: string;
  status: 'new' | 'recognized' | 'active' | 'mastered' | 'forgotten';
  confidence: number;     // 0.0 - 1.0
  lastUsed: string;
  category?: string;
  exampleSentence?: string;
}

export interface ErrorPattern {
  id: string;
  incorrect: string;
  correction: string;
  category: 'irregular_past' | 'prepositions' | 'false_friends' | 'syntax' | 'phonetics' | 'general';
  frequency: number;
  severity: 'low' | 'medium' | 'high';
  status: 'active' | 'recurring' | 'resolved';
  lastSeen: string;
  pedagogicalNote?: string;
}

export interface EpisodicMemory {
  id: string;
  timestamp: number;
  dateStr: string;
  summary: string;
  activityType: 'conversation' | 'roleplay' | 'practice' | 'story' | 'writing' | 'translation';
  topicsCovered: string[];
  keyStrengths: string[];
  areasToReinforce: string[];
}

export type NextActionType =
  | 'CONTINUE_CONVERSATION'
  | 'ASK_QUESTION'
  | 'CORRECT'
  | 'EXPLAIN'
  | 'SHOW_VISUAL'
  | 'GENERATE_EXERCISE'
  | 'GENERATE_STORY'
  | 'START_ROLEPLAY'
  | 'START_TRANSLATION'
  | 'READING_PRACTICE'
  | 'WRITING_PRACTICE'
  | 'LISTENING_PRACTICE'
  | 'PRONUNCIATION_PRACTICE'
  | 'REVIEW_VOCABULARY'
  | 'REVIEW_ERROR'
  | 'CHANGE_DIFFICULTY'
  | 'END_SESSION';

export interface NextBestActionRecommendation {
  action: NextActionType;
  title: string;
  reason: string;
  targetSkill: keyof SkillMastery;
  suggestedPrompt?: string;
}

export interface RoleplayScenarioDef {
  id: string;
  title: string;
  icon: string;
  category: 'travel' | 'work' | 'academic' | 'social' | 'fantasy';
  studentRole: string;
  teacherRole: string;
  goal: string;
  targetVocabulary: string[];
  targetGrammar: string;
  difficulty: CEFRLevel;
  initialTeacherMessage: string;
  rubrics: string[];
}

export interface RoleplayEvaluation {
  scenarioId: string;
  completed: boolean;
  score: number; // 0 - 100
  fluencyScore: number;
  grammarScore: number;
  vocabularyScore: number;
  clarityScore: number;
  pronunciationScore: number;
  feedback: string;
  strengths: string[];
  areasToImprove: string[];
}

export type ExerciseType = 'fill_blank' | 'order_words' | 'multiple_choice' | 'error_correction' | 'translate' | 'create_sentences';

export interface ExerciseItem {
  id: string;
  type: ExerciseType;
  question: string;
  instruction: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  targetSkill: string;
  difficulty: CEFRLevel;
}

export interface StoryChapter {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  vocabularyHighlights: Array<{ term: string; translation: string }>;
  comprehensionQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  decisionPrompt?: {
    question: string;
    choices: Array<{ text: string; nextPlotLead: string }>;
  };
}

export interface WritingAnalysisResult {
  studentText: string;
  corrections: Array<{ wrong: string; right: string; reason: string }>;
  explanation: string;
  naturalVersion: string;
  suggestedPractice: string;
  grammarPoints: string[];
  overallScore: number;
}
