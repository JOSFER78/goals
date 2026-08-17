export type CriterioAgeBracket = '8-10' | '10-12' | '12-14' | '14-16' | '16-18' | '8-18' | '14-18';

export type CriterioCompetencyId = 
  | 'sources'        // C1: Rastreo de fuentes primarias
  | 'fact_opinion'   // C2: Distinción hecho vs opinión
  | 'context'        // C3: Identificación de contexto faltante
  | 'algorithms'     // C4: Comprensión de algoritmos y atención
  | 'ai_literacy'    // C5: Detección de alucinaciones y deepfakes
  | 'lateral_search' // C6: Búsqueda y lectura lateral
  | 'pause_method'   // C7: Desaceleración y método PAUSA
  | 'nuance';        // C8: Juicio matizado e incertidumbre

export interface CriterioCompetencyInfo {
  id: CriterioCompetencyId;
  name: string;
  shortDesc: string;
  icon: string;
  badge: string;
  colorClass: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
}

export interface CriterioStep {
  id: number;
  type: 'concept' | 'interactive_diagram' | 'socratic_question' | 'evidence_reveal' | 'reflection';
  title: string;
  subtitle?: string;
  content: string;
  keyTakeaway: string;
  diagramType?: 'funnel' | 'chain' | 'network' | 'split' | 'loop' | 'scale';
  wowFact?: string;
  question?: {
    prompt: string;
    options: {
      id: string;
      text: string;
      isNuanced: boolean;
      score: number;
      explanation: string;
    }[];
  };
  sources?: {
    name: string;
    domain: string;
    url?: string;
    type: 'primary' | 'academic' | 'regulatory' | 'factcheck';
    description: string;
  }[];
}

export interface CriterioModule {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  ageBracket: CriterioAgeBracket;
  competency: CriterioCompetencyId;
  iconName: string;
  badgeTag: string;
  accentColor: string;
  xpReward: number;
  durationMinutes: number;
  keyTakeaways: string[];
  steps: CriterioStep[];
}

export interface CriterioMission {
  id: string;
  title: string;
  category: 'colegio' | 'redes' | 'ciencia' | 'sorteos' | 'ia_deepfakes';
  minAge: number;
  situation: string;
  authorHandle?: string;
  authorBadge?: string;
  mediaType?: 'text' | 'image_prompt' | 'chat_capture' | 'voice_memo';
  initialClaim: string;
  emotionalHook?: string;
  missingContext: string;
  options: {
    id: string;
    text: string;
    quality: 'impulsive' | 'skeptical' | 'nuanced_correct';
    criterioScore: number;
    feedback: string;
  }[];
  revealedEvidence: string;
  primarySourceUrl?: string;
  primarySourceName?: string;
  trickExplanation: string;
}

export interface SocialFeedPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  verified: boolean;
  timeAgo: string;
  content: string;
  category: 'sensational' | 'scientific' | 'gaming' | 'extreme_debate' | 'wholesome';
  stats: {
    likes: number;
    shares: number;
    comments: number;
  };
  emotionalIntensity: number; // 1-10
  factualBacking: number;     // 1-10
  algorithmImpact: string;
}

export interface AIForensicCase {
  id: string;
  type: 'text_hallucination' | 'image_synthetic' | 'voice_clone';
  title: string;
  scenario: string;
  aiOutput: string;
  realFact: string;
  inspectionClues: string[];
  howToCatch: string;
  difficulty: 'fácil' | 'medio' | 'experto';
  realImageSample?: string;
  fakeImageSample?: string;
}

export interface MatizaAnalysisResult {
  claim: string;
  verdict: 'Comprobado con Evidencia Sólida' | 'Falso / Desinformación' | 'Parcialmente Cierto / Falta Contexto' | 'Opinión o Especulación';
  confidenceScore: number; // 0 - 100
  confirmedFacts: string[];
  uncertainOrMissing: string[];
  nuancedConclusion: string;
  verifiedSources: {
    title: string;
    domain: string;
    url?: string;
    authorityLevel: 'Oficial / Primaria' | 'Académica' | 'Periodística';
  }[];
}
