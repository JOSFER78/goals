export type AIAgeBracket = '7-9' | '10-12' | '13-15';

export type AICompetencyId = 
  | 'foundations'       // Fundamentos y Conceptos
  | 'how_it_works'      // Aprendizaje y Redes Neuronales
  | 'language_vision'   // LLMs, Tokens y Visión Artificial
  | 'limits_forensics'  // Alucinaciones, Deepfakes y Límites
  | 'ethics_safety'     // Sesgos, Privacidad y Ética
  | 'creation';         // Creación y Co-Piloto Socrático

export type AITab = 
  | 'modules' 
  | 'neural_lab' 
  | 'token_lab' 
  | 'vision_lab' 
  | 'hallucinations' 
  | 'ethics_bias' 
  | 'creative_studio';

export interface AISkillArea {
  id: AICompetencyId;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  color: string;
  bgBadge: string;
  borderBadge: string;
}

export interface AIStepDef {
  id: number;
  type: 'concept' | 'interactive_lab' | 'quiz' | 'comparison' | 'dilemma' | 'challenge';
  title: string;
  subtitle?: string;
  content?: string;
  contentByAge?: Record<AIAgeBracket, string>;
  wowFact?: string;
  interactiveType?: 'neural' | 'token' | 'convolution' | 'hallucination' | 'bias' | 'prompt';
  bullets?: string[];
  specs?: Record<string, string>;
  quiz?: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
}

export interface AIQuestionDef {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  competency: AICompetencyId;
  ageBracket?: AIAgeBracket;
}

export interface AILabModule {
  id: number;
  title: string;
  subtitle: string;
  tagline: string;
  competency: AICompetencyId;
  icon: string;
  level: number;
  xpReward: number;
  estimatedMinutes: number;
  summary: string;
  targetAges: AIAgeBracket[];
  ageAdaptedSummary: Record<AIAgeBracket, string>;
  steps: AIStepDef[];
  questions: AIQuestionDef[];
  keyTakeaways: string[];
  interactiveLabLink?: AITab;
}

// Modelos para los simuladores interactivos
export interface NeuralPoint {
  x: number;
  y: number;
  label: 0 | 1;
}

export type DatasetType = 'circle' | 'xor' | 'spiral' | 'moons';

export interface NeuralLayerConfig {
  neurons: number;
  activation: 'relu' | 'sigmoid' | 'tanh';
}

export interface TokenItem {
  text: string;
  id: number;
  color: string;
  bytes: number[];
}

export interface NextWordCandidate {
  word: string;
  rawProb: number;
  adjustedProb: number;
  isHallucinationRisk?: boolean;
}

export interface ConvolutionKernel {
  name: string;
  description: string;
  matrix: number[][]; // 3x3
  divisor: number;
}

export interface HallucinationCase {
  id: string;
  title: string;
  prompt: string;
  aiResponse: string;
  hallucinatedSubstring: string;
  category: 'fabricated_citation' | 'historical_anachronism' | 'logical_trap' | 'math_physics_error' | 'synthetic_image';
  realFact: string;
  explanation: string;
  difficulty: 'fácil' | 'medio' | 'avanzado';
  sourceUrl?: string;
}

export interface EthicalDilemma {
  id: string;
  title: string;
  category: 'autonomous_driving' | 'recruitment_bias' | 'predictive_justice' | 'ai_art_copyright' | 'biometric_surveillance';
  scenario: string;
  context: string;
  optionA: {
    title: string;
    action: string;
    consequences: string;
    ethicalTradeoff: string;
  };
  optionB: {
    title: string;
    action: string;
    consequences: string;
    ethicalTradeoff: string;
  };
  euAiActRegulation: string;
  reflectionQuestion: string;
}
