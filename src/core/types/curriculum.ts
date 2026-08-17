/**
 * Esquema Tipado Universal de Currículums Educativos para GOALS
 * Soporta Astronomía 3D, Idiomas (CEFR/Audio), Colegios (ESO/Bachillerato con LaTeX), Anatomía e Ingeniería.
 */

export type DisciplineCategory = 
  | 'stem' 
  | 'languages' 
  | 'school' 
  | 'medical' 
  | 'tech' 
  | 'humanities';

export type GradeLevel = 
  | 'all' 
  | 'primary' 
  | 'eso_1_2' 
  | 'eso_3_4' 
  | 'bachillerato' 
  | 'university';

export type StepContentType = 
  | 'concept'          // Texto estructurado + badges + wow facts
  | 'model3d'          // Escena interactiva Three.js / Canvas
  | 'audio_phrasal'    // Reproducción de audio nativo y fonética
  | 'math_formula'     // Fórmulas matemáticas / científicas (LaTeX)
  | 'comparison'       // Comparativa visual / specs lado a lado
  | 'code_snippet'     // Snippet interactivo con syntax highlighting
  | 'media';           // Imágenes en alta resolución / esquemas

export type QuestionType = 
  | 'choice'           // Selección simple
  | 'multi_choice'     // Selección múltiple
  | 'order'            // Ordenación secuencial / cronológica / espacial
  | 'matching'         // Emparejamiento de conceptos o vocabulario
  | 'fill_gap'         // Rellenar huecos en frases o ecuaciones
  | 'audio_listen'     // Escuchar pronunciación y transcribir/identificar
  | 'numeric_calc';    // Cálculo numérico con tolerancia

// ==========================================
// 1. DISCIPLINA (Curriculum Root)
// ==========================================
export interface CurriculumDiscipline {
  id: string; // ej: 'astro', 'languages_en', 'school_math_eso'
  title: string;
  subtitle: string;
  category: DisciplineCategory;
  gradeLevel: GradeLevel;
  icon: string;
  color: string; // CSS gradient o HEX
  totalLessons: number;
  totalXp: number;
  version: number;
  isPublished: boolean;
  author?: {
    uid: string;
    name: string;
  };
  tags: string[];
  createdAt: number; // epoch ms
  updatedAt: number;
}

// ==========================================
// 2. PASOS INTERACTIVOS (Steps)
// ==========================================
export interface Model3DConfig {
  sceneId: string; // ej: 'earth', 'iss', 'solar_system', 'heart_anatomy'
  objectId?: string;
  modelUrl?: string;
  cameraPosition?: [number, number, number];
  targetPosition?: [number, number, number];
  fov?: number;
}

export interface AudioConfig {
  url: string;
  speaker: string;
  accent?: string;
  transcript?: string;
  phoneticIpa?: string;
  durationSeconds?: number;
}

export interface MathFormulaConfig {
  latex: string;
  explanation: string;
  variables: Record<string, string>;
}

export interface VocabularyItem {
  word: string;
  phonetic: string;
  translation: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'idiom';
  exampleSentence: string;
  exampleTranslation: string;
  audioUrl?: string;
}

export interface CurriculumStep {
  stepNumber: number;
  type: StepContentType;
  title: string;
  subtitle?: string;
  content: string; // Texto enriquecido con soporte Markdown
  icon: string;
  badge?: string;
  wowFact?: string;
  nowFact?: string; // Actualidad real (ej: Artemis II, misiones 2026)
  photo?: {
    url: string;
    caption?: string;
    credit?: string;
  };
  photos?: Array<{
    url: string;
    caption?: string;
    credit?: string;
  }>;
  video?: {
    url: string;
    title: string;
    provider?: 'youtube' | 'nasa' | 'esa' | 'vimeo';
    embedUrl?: string;
  };
  realWorldNews?: {
    headline: string;
    summary: string;
    date: string;
    source: string;
    url: string;
    verified: boolean;
  };
  practicalCase?: {
    title: string;
    situation: string;
    challenge: string;
  };
  media?: {
    type?: 'image' | 'video' | 'interactive_3d';
    url?: string;
    caption?: string;
    credit?: string;
  };
  model3d?: Model3DConfig;
  audio?: AudioConfig;
  formula?: MathFormulaConfig;
  vocabulary?: VocabularyItem[];
  specs?: Record<string, string>;
}

// ==========================================
// 3. LECCIÓN (Lesson Document)
// ==========================================
export interface CurriculumLesson {
  id: string; // ej: 'lesson_01'
  disciplineId: string;
  order: number;
  title: string;
  subtitle: string;
  tag: string;
  icon: string;
  heroImage: string | null;
  xpReward: number;
  estimatedMinutes: number;
  prerequisites?: string[]; // IDs de lecciones previas
  // 🔗 Referencias explícitas a la Knowledge Base (SSOT)
  knowledgeSlugs?: string[]; // ej: ['astronomy.solar_system.mars']
  knowledgeItemIds?: string[]; // ej: ['know_astro_mars']
  steps: CurriculumStep[];
  linkedTestId: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: number;
  updatedAt: number;
}

// ==========================================
// 4. PREGUNTAS Y EVALUACIÓN (Test Document)
// ==========================================
export interface CurriculumQuestion {
  id: string | number;
  type: QuestionType;
  prompt: string; // Pregunta / enunciado
  explanation: string; // Explicación pedagógica detallada
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
  media?: {
    type: 'image' | 'audio' | 'model3d';
    url: string;
    caption?: string;
  };
  // Para 'choice' y 'multi_choice'
  options?: string[];
  correctAnswer?: number | number[]; // Índice o lista de índices
  // Para 'order'
  orderItems?: Array<{ id: string; label: string; details?: string }>;
  correctOrder?: string[]; // IDs ordenados
  // Para 'matching'
  matchPairs?: Array<{ left: string; right: string }>;
  // Para 'fill_gap'
  templateSentence?: string;
  gapSolutions?: string[];
  // Para 'numeric_calc'
  targetValue?: number;
  tolerance?: number;
  unit?: string;
  // Para 'audio_listen'
  audioUrl?: string;
}

export interface CurriculumTest {
  id: string; // ej: 'test_lesson_01'
  lessonId: string;
  disciplineId: string;
  title: string;
  passScorePercent: number; // ej: 75
  xpReward: number;
  timeLimitSeconds?: number;
  questions: CurriculumQuestion[];
  version: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: number;
  updatedAt: number;
}
